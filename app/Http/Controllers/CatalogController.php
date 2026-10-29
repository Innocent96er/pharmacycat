<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Catalog: search -> filter (category, price, prescription type) -> paginate (5 per page).
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', Rule::in(Product::CATEGORIES)],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'prescription' => ['nullable', Rule::in(Product::PRESCRIPTION_TYPES)],
        ]);

        $products = Product::query()
            ->search($filters['search'] ?? null)
            ->inCategory($filters['category'] ?? null)
            ->priceBetween($filters['min_price'] ?? null, $filters['max_price'] ?? null)
            ->ofPrescriptionType($filters['prescription'] ?? null)
            ->orderBy('name')
            ->paginate(Product::PER_PAGE)
            ->withQueryString();

        return Inertia::render('catalog', [
            'products' => $products,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? '',
                'min_price' => $filters['min_price'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'prescription' => $filters['prescription'] ?? '',
            ],
            'categories' => Product::CATEGORIES,
        ]);
    }
}
