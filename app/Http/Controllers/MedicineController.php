<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicineController extends Controller
{
    /**
     * Display a listing of the medicines (READ - List).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $medicines = Medicine::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('dosage', 'like', "%{$search}%");
                });
            })
            ->when($category && $category !== 'All', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = [
            'All',
            'Pain Relief',
            'Antibiotics',
            'Vitamins',
            'Cold & Flu',
            'Skincare',
            'Other',
        ];

        return Inertia::render('medicines/index', [
            'medicines' => $medicines,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'All',
            ],
        ]);
    }

    /**
     * Show the form for creating a new medicine (CREATE - Form).
     */
    public function create(): Response
    {
        return Inertia::render('medicines/create', [
            'categories' => [
                'Pain Relief',
                'Antibiotics',
                'Vitamins',
                'Cold & Flu',
                'Skincare',
                'Other',
            ],
        ]);
    }

    /**
     * Store a newly created medicine in storage (CREATE - Store).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dosage' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'in_stock' => ['boolean'],
            'badge' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
        ]);

        $validated['in_stock'] = $request->boolean('in_stock', true);

        Medicine::create($validated);

        return redirect()->route('medicines.index')->with('success', 'Medicine added successfully to the catalog.');
    }

    /**
     * Display the specified medicine (READ - Show).
     */
    public function show(Medicine $medicine): Response
    {
        return Inertia::render('medicines/show', [
            'medicine' => $medicine,
        ]);
    }

    /**
     * Show the form for editing the specified medicine (UPDATE - Form).
     */
    public function edit(Medicine $medicine): Response
    {
        return Inertia::render('medicines/edit', [
            'medicine' => $medicine,
            'categories' => [
                'Pain Relief',
                'Antibiotics',
                'Vitamins',
                'Cold & Flu',
                'Skincare',
                'Other',
            ],
        ]);
    }

    /**
     * Update the specified medicine in storage (UPDATE - Save).
     */
    public function update(Request $request, Medicine $medicine): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dosage' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'in_stock' => ['boolean'],
            'badge' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
        ]);

        $validated['in_stock'] = $request->boolean('in_stock', true);

        $medicine->update($validated);

        return redirect()->route('medicines.index')->with('success', 'Medicine updated successfully.');
    }

    /**
     * Remove the specified medicine from storage (DELETE).
     */
    public function destroy(Medicine $medicine): RedirectResponse
    {
        $medicine->delete();

        return redirect()->route('medicines.index')->with('success', 'Medicine removed from the catalog.');
    }
}
