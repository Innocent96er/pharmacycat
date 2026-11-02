<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of all products with search, filtering, and stock status.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $prescriptionType = $request->input('prescription_type');
        $stockStatus = $request->input('stock_status');
        $sort = $request->input('sort', 'latest');

        $query = Product::query()
            ->with('productCategory')
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
            ->when($prescriptionType && $prescriptionType !== 'all', function ($q) use ($prescriptionType) {
                $q->where('prescription_type', $prescriptionType);
            })
            ->when($stockStatus, function ($q, $status) {
                if ($status === 'in_stock') {
                    $q->where('stock', '>=', 10);
                } elseif ($status === 'low_stock') {
                    $q->where('stock', '>', 0)->where('stock', '<', 10);
                } elseif ($status === 'out_of_stock') {
                    $q->where('stock', '<=', 0);
                }
            });

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'stock_asc':
                $query->orderBy('stock', 'asc');
                break;
            case 'stock_desc':
                $query->orderBy('stock', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(10)->withQueryString();

        $categories = Category::pluck('name')->toArray();
        if (empty($categories)) {
            $categories = Product::CATEGORIES;
        }

        $availableSampleImages = [
            '/images/products/paracetamol.jpg' => 'Paracetamol Tablets',
            '/images/products/ibuprofen.png' => 'Ibuprofen Tablets',
            '/images/products/vitamin-c.jpg' => 'Vitamin C + Zinc',
            '/images/products/daily-multivitamin.jpg' => 'Daily Multivitamin',
            '/images/products/syrup.jpg' => 'Cough & Cold Syrup',
            '/images/products/codral.jpg' => 'Throat Lozenges',
            '/images/products/amoxycillin-trihydrate.jpg' => 'Amoxicillin Antibiotic',
            '/images/products/azithromycin.webp' => 'Azithromycin Capsules',
            '/images/products/first-aid.png' => 'First Aid Kit / Bandages',
            '/images/products/bp-monitor.jpg' => 'Blood Pressure Monitor',
            '/images/products/cream.jpg' => 'Moisturizing Cream / Gel',
            '/images/products/cortizone.jpg' => 'Hydrocortisone Salve',
        ];

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'sampleImages' => $availableSampleImages,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
                'prescription_type' => $prescriptionType ?? 'all',
                'stock_status' => $stockStatus ?? 'all',
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::all();

        $sampleImages = [
            '/images/products/paracetamol.jpg' => 'Paracetamol Tablets',
            '/images/products/ibuprofen.png' => 'Ibuprofen Tablets',
            '/images/products/vitamin-c.jpg' => 'Vitamin C + Zinc',
            '/images/products/daily-multivitamin.jpg' => 'Daily Multivitamin',
            '/images/products/syrup.jpg' => 'Cough & Cold Syrup',
            '/images/products/codral.jpg' => 'Throat Lozenges',
            '/images/products/amoxycillin-trihydrate.jpg' => 'Amoxicillin Antibiotic',
            '/images/products/azithromycin.webp' => 'Azithromycin Capsules',
            '/images/products/first-aid.png' => 'First Aid Kit / Bandages',
            '/images/products/bp-monitor.jpg' => 'Blood Pressure Monitor',
            '/images/products/cream.jpg' => 'Moisturizing Cream / Gel',
            '/images/products/cortizone.jpg' => 'Hydrocortisone Salve',
        ];

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
            'sampleImages' => $sampleImages,
        ]);
    }

    /**
     * Store a newly created product with optional image upload.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'prescription_type' => ['required', Rule::in(Product::PRESCRIPTION_TYPES)],
            'active_ingredient' => ['nullable', 'string', 'max:255'],
            'dosage' => ['nullable', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:100'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:5000'],
            'is_featured' => ['sometimes', 'boolean'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'image_url' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['is_featured'] = $request->boolean('is_featured', false);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            
            // Mirror to public directory for immediate access without requiring symlink privileges
            $publicDest = public_path('storage/' . $path);
            if (! file_exists(dirname($publicDest))) {
                mkdir(dirname($publicDest), 0755, true);
            }
            @copy(Storage::disk('public')->path($path), $publicDest);

            $validated['image'] = $path;
        } elseif (! empty($validated['image_url'])) {
            $validated['image'] = $validated['image_url'];
        }

        unset($validated['image_file'], $validated['image_url']);

        if (empty($validated['category_id']) && ! empty($validated['category'])) {
            $category = Category::firstOrCreate(
                ['name' => $validated['category']],
                ['slug' => \Illuminate\Support\Str::slug($validated['category'])]
            );
            $validated['category_id'] = $category->id;
        }

        $product = Product::create($validated);

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product '{$product->name}' was added to the pharmacy inventory!");
    }

    /**
     * Show the form for editing an existing product.
     */
    public function edit(Product $product): Response
    {
        $categories = Category::all();

        $sampleImages = [
            '/images/products/paracetamol.jpg' => 'Paracetamol Tablets',
            '/images/products/ibuprofen.png' => 'Ibuprofen Tablets',
            '/images/products/vitamin-c.jpg' => 'Vitamin C + Zinc',
            '/images/products/daily-multivitamin.jpg' => 'Daily Multivitamin',
            '/images/products/syrup.jpg' => 'Cough & Cold Syrup',
            '/images/products/codral.jpg' => 'Throat Lozenges',
            '/images/products/amoxycillin-trihydrate.jpg' => 'Amoxicillin Antibiotic',
            '/images/products/azithromycin.webp' => 'Azithromycin Capsules',
            '/images/products/first-aid.png' => 'First Aid Kit / Bandages',
            '/images/products/bp-monitor.jpg' => 'Blood Pressure Monitor',
            '/images/products/cream.jpg' => 'Moisturizing Cream / Gel',
            '/images/products/cortizone.jpg' => 'Hydrocortisone Salve',
        ];

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'sampleImages' => $sampleImages,
        ]);
    }

    /**
     * Update an existing product with optional image replacement.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'prescription_type' => ['required', Rule::in(Product::PRESCRIPTION_TYPES)],
            'active_ingredient' => ['nullable', 'string', 'max:255'],
            'dosage' => ['nullable', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:100'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:5000'],
            'is_featured' => ['sometimes', 'boolean'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'image_url' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['is_featured'] = $request->boolean('is_featured', false);

        if ($request->hasFile('image_file')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $oldPublic = public_path('storage/' . $product->image);
            if ($product->image && file_exists($oldPublic)) {
                @unlink($oldPublic);
            }

            $path = $request->file('image_file')->store('products', 'public');
            
            // Mirror to public directory for immediate access without requiring symlink privileges
            $publicDest = public_path('storage/' . $path);
            if (! file_exists(dirname($publicDest))) {
                mkdir(dirname($publicDest), 0755, true);
            }
            @copy(Storage::disk('public')->path($path), $publicDest);

            $validated['image'] = $path;
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $validated['image_url'];
        }

        unset($validated['image_file'], $validated['image_url']);

        if (empty($validated['category_id']) && ! empty($validated['category'])) {
            $category = Category::firstOrCreate(
                ['name' => $validated['category']],
                ['slug' => \Illuminate\Support\Str::slug($validated['category'])]
            );
            $validated['category_id'] = $category->id;
        }

        $product->update($validated);

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product '{$product->name}' was successfully updated!");
    }

    /**
     * Delete a product from inventory.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;

        if ($product->image) {
            if (Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $publicFile = public_path('storage/' . $product->image);
            if (file_exists($publicFile)) {
                @unlink($publicFile);
            }
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product '{$name}' was deleted from the catalog.");
    }

    /**
     * Fast inline stock adjustment.
     */
    public function updateStock(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'stock' => ['required', 'integer', 'min:0'],
        ]);

        $product->update(['stock' => $validated['stock']]);

        return back()->with('success', "Stock for '{$product->name}' updated to {$validated['stock']}.");
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Product $product): RedirectResponse
    {
        $product->update(['is_featured' => ! $product->is_featured]);

        $status = $product->is_featured ? 'marked as featured' : 'removed from featured';

        return back()->with('success', "Product '{$product->name}' {$status}.");
    }
}

