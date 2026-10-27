<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Handle checkout and place an order.
     */
    public function store(Request $request): JsonResponse
    {
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

        $orderNumber = 'PC-'.strtoupper(Str::random(6));

        $formattedItems = array_map(function ($item) {
            return [
                'name' => $item['name'],
                'qty' => (int) $item['qty'],
                'price' => 'K'.number_format((float) $item['price'], 2),
                'image' => isset($item['image']) ? url($item['image']) : null,
            ];
        }, $validated['items']);

        $courierName = $validated['courier_name'] ?? match ($validated['delivery_type']) {
            'home_delivery', 'delivery' => 'Home Delivery (PharmacyCat Rider)',
            'yango' => 'Yango Delivery',
            'indrive' => 'inDrive Delivery',
            'pickup' => 'Pharmacy Counter Pickup',
            default => ucfirst($validated['delivery_type']),
        };

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

        // Send email confirmation
        try {
            Mail::to($validated['customer_email'])->send(new OrderConfirmed($orderData));
        } catch (\Throwable $e) {
            Log::warning('Failed to send order confirmation email: '.$e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Your order has been placed successfully!',
            'order' => $orderData,
        ]);
    }
}
