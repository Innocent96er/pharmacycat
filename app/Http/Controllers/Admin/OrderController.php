<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin\OrderController
 *
 * Dedicated controller for pharmacy staff to oversee order fulfillment:
 * 1. Lists orders with real-time status filtering (Pending, Processing, Delivered, Cancelled).
 * 2. Provides multi-field live search across Order #, Customer Name, Phone, and Email.
 * 3. Eager-loads line items and product relationships to prevent N+1 queries.
 * 4. Enables pharmacy staff to advance order lifecycle statuses.
 */
class OrderController extends Controller
{
    /**
     * Display a listing of pharmacy customer orders.
     * Accessible by: admin, pharmacist
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'all');
        $search = $request->input('search');

        // STEP 1: Build the order query with eager-loading for performance
        $query = Order::query()
            ->with(['items.product', 'user'])
            // Filter by fulfillment status tab if not 'all'
            ->when($status && $status !== 'all', function ($q) use ($status) {
                $q->where('status', $status);
            })
            // Multi-column search matching tracking code, customer name, phone, or email
            ->when($search, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('order_number', 'like', "%{$term}%")
                        ->orWhere('customer_name', 'like', "%{$term}%")
                        ->orWhere('customer_phone', 'like', "%{$term}%")
                        ->orWhere('customer_email', 'like', "%{$term}%");
                });
            })
            ->latest();

        // Paginate results (10 orders per page) while preserving URL search filters
        $orders = $query->paginate(10)->withQueryString();

        // STEP 2: Aggregate count badges for quick status tab navigation
        $counts = [
            'all' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        // STEP 3: Render the React/Inertia admin management interface
        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'counts' => $counts,
            'filters' => [
                'status' => $status,
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Update the fulfillment status of an order (e.g. pending -> processing -> delivered).
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        // Validate against the allowed workflow status values
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,delivered,cancelled'],
        ]);

        // Update the order in the database
        $order->update(['status' => $validated['status']]);

        // Flash notification informing staff that the state was updated
        return back()->with('success', "Order #{$order->order_number} status updated to {$validated['status']}.");
    }
}

