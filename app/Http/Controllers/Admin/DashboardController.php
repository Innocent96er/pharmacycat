<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the main pharmacy admin dashboard with real-time stats and management summaries.
     */
    public function index(Request $request): Response
    {
        $totalProducts = Product::count();
        $totalStockUnits = (int) Product::sum('stock');
        $lowStockCount = Product::where('stock', '<', 10)->count();
        $outOfStockCount = Product::where('stock', '<=', 0)->count();

        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $totalRevenue = (float) Order::sum('total_amount');

        $lowStockProducts = Product::where('stock', '<', 10)
            ->orderBy('stock', 'asc')
            ->limit(8)
            ->get();

        $recentOrders = Order::with(['items.product'])
            ->latest()
            ->limit(6)
            ->get();

        $recentProducts = Product::latest()
            ->limit(6)
            ->get();

        $categories = Category::withCount('products')->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalStockUnits' => $totalStockUnits,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'processingOrders' => $processingOrders,
                'deliveredOrders' => $deliveredOrders,
                'totalRevenue' => $totalRevenue,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'recentProducts' => $recentProducts,
            'categories' => $categories,
        ]);
    }
}

