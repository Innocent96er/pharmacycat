<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderAlert;
use App\Mail\OrderConfirmed;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

/**
 * OrderController
 *
 * Handles the checkout lifecycle for customers on the PharmacyCat platform:
 * 1. Validates delivery details, payment method, distance fees, and cart items.
 * 2. Generates a unique tracking reference (e.g. PC-A1B2C3).
 * 3. Persists the Order and OrderItem records in the database.
 * 4. Automatically decrements inventory stock.
 * 5. Dispatches SMTP email notifications to both the customer and pharmacy admin.
 */
class OrderController extends Controller
{
    /**
     * Handle checkout and place an order.
     */
    public function store(Request $request): JsonResponse
    {
        // STEP 0: Authentication gate — require users to be logged in or registered before checkout
        if (! auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in or registered to place an order.',
                'redirect' => route('login'),
            ], 401);
        }

        // STEP 1: Strict input validation for customer details, delivery, and cart items
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'delivery_address' => ['required', 'string', 'max:500'],
            'delivery_type' => ['required', 'string', 'in:delivery,home_delivery,yango,indrive,pickup'],
            'courier_name' => ['nullable', 'string', 'max:100'],
            'payment_method' => ['required', 'string', 'in:card,mobile_money,cash'],
            'payment_details' => ['nullable', 'array'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric'],
            'items.*.image' => [
                'nullable',
                'string',
                'regex:~^/images/products/[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$~i',
            ],
            'subtotal' => ['required', 'numeric'],
            'delivery_fee' => ['required', 'numeric'],
            'total' => ['required', 'numeric'],
        ]);

        // STEP 2: Generate a human-friendly unique order reference number
        $orderNumber = 'PC-'.strtoupper(Str::random(6));

        // STEP 3: Normalize and format cart items for receipt presentation
        $formattedItems = array_map(function ($item) {
            return [
                'name' => $item['name'],
                'qty' => (int) $item['qty'],
                'price' => 'K'.number_format((float) $item['price'], 2),
                'image' => isset($item['image']) ? url($item['image']) : null,
            ];
        }, $validated['items']);

        // Determine clear courier display title
        $courierName = $validated['courier_name'] ?? match ($validated['delivery_type']) {
            'home_delivery', 'delivery' => 'Home Delivery (PharmacyCat Rider)',
            'yango' => 'Yango Delivery',
            'indrive' => 'inDrive Delivery',
            'pickup' => 'Pharmacy Counter Pickup',
            default => ucfirst($validated['delivery_type']),
        };

        // Package receipt data for both email templates and frontend response
        $orderData = [
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'delivery_address' => $validated['delivery_address'],
            'delivery_type' => $validated['delivery_type'],
            'courier_name' => $courierName,
            'payment_method' => match ($validated['payment_method']) {
                'card' => 'Credit / Debit Card',
                'mobile_money' => 'Mobile Money (Airtel / MTN)',
                'cash' => 'Cash on Delivery / Pharmacy Counter',
                default => $validated['payment_method'],
            },
            'items' => $formattedItems,
            'subtotal' => 'K'.number_format((float) $validated['subtotal'], 2),
            'delivery_fee' => 'K'.number_format((float) $validated['delivery_fee'], 2),
            'total' => 'K'.number_format((float) $validated['total'], 2),
            'placed_at' => now()->toFormattedDateString(),
        ];

        // STEP 4: Persist the order record and order line items to SQLite/MySQL
        try {
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'delivery_address' => $validated['delivery_address'],
                'delivery_type' => $validated['delivery_type'],
                'payment_method' => $validated['payment_method'],
                'subtotal' => $validated['subtotal'],
                'delivery_fee' => $validated['delivery_fee'],
                'total_amount' => $validated['total'],
                'status' => 'pending',
            ]);

            // Save individual items and decrement live product inventory
            foreach ($validated['items'] as $item) {
                $productId = $item['id'] ?? null;
                if (! $productId || ! Product::where('id', $productId)->exists()) {
                    $productId = Product::where('name', $item['name'])->value('id');
                }

                if ($productId) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $productId,
                        'quantity' => (int) $item['qty'],
                        'unit_price' => (float) $item['price'],
                    ]);

                    // Decrement stock in real-time so other customers see updated availability
                    Product::where('id', $productId)->decrement('stock', min((int) $item['qty'], Product::where('id', $productId)->value('stock') ?? 0));
                }
            }
        } catch (\Throwable $e) {
            Log::error('Failed to save order in database: '.$e->getMessage());
        }

        // STEP 5: Dispatch SMTP Emails
        // A) Send order confirmation receipt to the customer
        try {
            Mail::to($validated['customer_email'])->send(new OrderConfirmed($orderData));
        } catch (\Throwable $e) {
            Log::warning('Failed to send order confirmation email: '.$e->getMessage());
        }

        // B) Send new order alert to the pharmacy admin/staff
        try {
            Mail::send(new NewOrderAlert([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'total' => 'K'.number_format((float) $validated['total'], 2),
                'items_count' => count($validated['items']),
                'courier_name' => $courierName,
                'delivery_type' => $validated['delivery_type'],
            ]));
        } catch (\Throwable $e) {
            Log::warning('Failed to send admin order alert email: '.$e->getMessage());
        }

        // STEP 6: Return JSON confirmation back to the frontend checkout modal
        return response()->json([
            'success' => true,
            'message' => 'Your order has been placed successfully!',
            'order' => $orderData,
        ]);
    }
}
