<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'role:admin,pharmacist'])->group(function () {
    Route::resource('medicines', MedicineController::class)->only(['create', 'store', 'edit', 'update']);
});

Route::resource('medicines', MedicineController::class)->only(['index', 'show']);

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::delete('medicines/{medicine}', [MedicineController::class, 'destroy'])->name('medicines.destroy');
});

Route::get('contact', [ContactController::class, 'show'])->name('contact');
Route::post('contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('checkout', [OrderController::class, 'store'])->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // The starter kit sends everyone to /dashboard after login.
    // From here, each role goes to its own landing page. Route::has() keeps the
    // staff redirect working until an admin dashboard route exists.
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('customer')) {
            return redirect()->route('catalog');
        }

        return Route::has('admin.dashboard')
            ? redirect()->route('admin.dashboard')
            : Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
});

require __DIR__.'/settings.php';
