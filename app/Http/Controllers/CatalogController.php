<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public const PER_PAGE = 12;

    /**
     * Dedicated Pharmacy Catalog: Search, left-sidebar filters, sorting, and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $prescription = $request->input('prescription');
        $inStockOnly = $request->boolean('in_stock', false);
        $sort = $request->input('sort', 'featured');

        $query = Product::query()
            ->when($search, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('name', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%")
                        ->orWhere('active_ingredient', 'like', "%{$term}%")
                        ->orWhere('manufacturer', 'like', "%{$term}%");
                });
            })
            ->when($category && $category !== 'all', function ($q) use ($category) {
                $q->where('category', $category);
            })
            ->when($minPrice !== null && $minPrice !== '', function ($q) use ($minPrice) {
                $q->where('price', '>=', (float) $minPrice);
            })
            ->when($maxPrice !== null && $maxPrice !== '', function ($q) use ($maxPrice) {
                $q->where('price', '<=', (float) $maxPrice);
            })
            ->when($prescription && in_array($prescription, ['otc', 'rx'], true), function ($q) use ($prescription) {
                $q->where('prescription_type', $prescription);
            })
            ->when($inStockOnly, function ($q) {
                $q->where('stock', '>', 0);
            });

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
                $query->latest();
                break;
            case 'featured':
            default:
                $query->orderByDesc('is_featured')->latest();
                break;
        }

        $products = $query->paginate(self::PER_PAGE)->withQueryString();

        // Get category list with live item counts
        $categoryCounts = Product::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        $allCategories = Category::pluck('name')->toArray();
        if (empty($allCategories)) {
            $allCategories = Product::CATEGORIES;
        }

        $categoriesWithCounts = array_map(function ($name) use ($categoryCounts) {
            return [
                'name' => $name,
                'count' => $categoryCounts[$name] ?? 0,
            ];
        }, $allCategories);

        $priceBounds = [
            'min' => (float) (Product::min('price') ?? 0),
            'max' => (float) (Product::max('price') ?? 500),
        ];

        return Inertia::render('catalog', [
            'products' => $products,
            'categories' => $categoriesWithCounts,
            'priceBounds' => $priceBounds,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
                'min_price' => $minPrice ?? '',
                'max_price' => $maxPrice ?? '',
                'prescription' => $prescription ?? 'all',
                'in_stock' => $inStockOnly,
                'sort' => $sort,
            ],
        ]);
    }
}
