<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the curated storefront homepage.
     */
    public function index(Request $request): Response
    {
        // Curated featured products (up to 8 items)
        $featuredProducts = Product::where('is_featured', true)
            ->where('stock', '>', 0)
            ->limit(8)
            ->get();

        if ($featuredProducts->count() < 4) {
            $additional = Product::whereNotIn('id', $featuredProducts->pluck('id'))
                ->where('stock', '>', 0)
                ->limit(8 - $featuredProducts->count())
                ->get();
            $featuredProducts = $featuredProducts->concat($additional);
        }

        // Category distribution for category cards
        $categories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(8)
            ->get();

        $totalProductsCount = Product::count();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'totalProductsCount' => $totalProductsCount,
        ]);
    }
}

