<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --------------------------------------------------------------------------
// 1. Public Storefront Routes (Guests and Authenticated Users)
// --------------------------------------------------------------------------
// Anyone can view the landing page, browse medicines in the catalog, and visit
// the contact form. Only the checkout endpoint requires an authenticated account.
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('contact', [ContactController::class, 'show'])->name('contact');
Route::post('contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('checkout', [OrderController::class, 'store'])->middleware('auth')->name('checkout.store');

// --------------------------------------------------------------------------
// 2. Local Media Storage Handler
// --------------------------------------------------------------------------
// Serves product photos and prescription uploads securely from the local storage
// disk without requiring symbolic link configuration on Windows/staging hosts.
Route::get('storage/{path}', function (string $path) {
    $filePath = storage_path('app/public/' . $path);
    if (! file_exists($filePath)) {
        abort(404);
    }

    return response()->file($filePath);
})->where('path', '.*');

// --------------------------------------------------------------------------
// 3. Medicine Management (Staff RBAC)
// --------------------------------------------------------------------------
// Pharmacists and Admins can create and edit medicine entries.
Route::middleware(['auth', 'verified', 'role:admin,pharmacist'])->group(function () {
    Route::resource('medicines', MedicineController::class)->only(['create', 'store', 'edit', 'update']);
});

// The public can view index listings and detail pages for medicines.
Route::resource('medicines', MedicineController::class)->only(['index', 'show']);

// Only Admins have destructive authorization (hard deletion of medicine records).
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::delete('medicines/{medicine}', [MedicineController::class, 'destroy'])->name('medicines.destroy');
});

// --------------------------------------------------------------------------
// 4. Role-Based Post-Login Redirection (/dashboard)
// --------------------------------------------------------------------------
// Laravel starter kits default post-login visits to /dashboard.
// This route acts as a traffic controller based on user role:
// - Regular Customers -> redirected to /catalog to continue shopping
// - Staff / Admin / Pharmacist -> redirected to /admin/dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('customer')) {
            return redirect()->route('catalog');
        }

        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

// --------------------------------------------------------------------------
// 5. Admin & Pharmacy Staff Panel Routes (/admin/*)
// --------------------------------------------------------------------------
// Protected by 'auth', 'verified', and custom 'role:admin,pharmacist' middleware.
// Allows staff to manage inventory levels, view incoming orders, and change statuses.
Route::middleware(['auth', 'verified', 'role:admin,pharmacist'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Main Admin KPI Dashboard (revenue, order counts, low-stock warnings)
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Product Catalog & Stock Quick-Update Endpoints
        Route::patch('products/{product}/stock', [AdminProductController::class, 'updateStock'])->name('products.stock');
        Route::patch('products/{product}/toggle-featured', [AdminProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
        Route::resource('products', AdminProductController::class);

        // Order Fulfillment Management
        Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::resource('orders', AdminOrderController::class)->only(['index']);

        // Medicine Category Taxonomy
        Route::resource('categories', AdminCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    });

require __DIR__.'/settings.php';
