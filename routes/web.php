<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');
Route::post('contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('checkout', [OrderController::class, 'store'])->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
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
