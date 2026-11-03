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

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('contact', [ContactController::class, 'show'])->name('contact');
Route::post('contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('checkout', [OrderController::class, 'store'])->middleware('auth')->name('checkout.store');

Route::get('storage/{path}', function (string $path) {
    $filePath = storage_path('app/public/' . $path);
    if (! file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*');

Route::middleware(['auth', 'verified', 'role:admin,pharmacist'])->group(function () {
    // Both staff roles may create and edit medicines.
    Route::resource('medicines', MedicineController::class)->only(['create', 'store', 'edit', 'update']);
});

Route::resource('medicines', MedicineController::class)->only(['index', 'show']);

// Only admins may remove medicines.
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::delete('medicines/{medicine}', [MedicineController::class, 'destroy'])->name('medicines.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // The starter kit sends everyone to /dashboard after login.
    // If user is a customer, redirect to the customer catalog.
    // If admin or pharmacist, redirect to the Admin Dashboard.
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('customer')) {
            return redirect()->route('catalog');
        }

        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin,pharmacist'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Both staff roles can manage day-to-day inventory and fulfillment.
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::patch('products/{product}/stock', [AdminProductController::class, 'updateStock'])->name('products.stock');
        Route::patch('products/{product}/toggle-featured', [AdminProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
        Route::resource('products', AdminProductController::class)->except(['destroy']);
        // Keep delete routes separate so the admin-only gate cannot be bypassed.
        Route::delete('products/{product}', [AdminProductController::class, 'destroy'])
            ->middleware('can:delete-products')
            ->name('products.destroy');

        Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::resource('orders', AdminOrderController::class)->only(['index']);

        Route::resource('categories', AdminCategoryController::class)->only(['index', 'store', 'update']);
        // Category deletion is also restricted to admins.
        Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy'])
            ->middleware('can:delete-categories')
            ->name('categories.destroy');
    });

require __DIR__.'/settings.php';
