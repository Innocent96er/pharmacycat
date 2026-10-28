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
<<<<<<< HEAD
    // The starter kit sends everyone to /dashboard after login.
    // From here, each role goes to its own landing page. Route::has() keeps this
    // working before the teammates' catalog and admin routes are merged.
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('customer')) {
            return redirect()->route(Route::has('catalog.index') ? 'catalog.index' : 'home');
        }

        return Route::has('admin.dashboard')
            ? redirect()->route('admin.dashboard')
            : Inertia::render('dashboard');
    })->name('dashboard');
});
require __DIR__.'/settings.php';
=======
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
});

require __DIR__.'/settings.php';
>>>>>>> 2941bab2d7bb073a9a099d74422ffa9ad4134e15
