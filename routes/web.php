<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('contact', [ContactController::class, 'show'])->name('contact');
Route::post('contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('checkout', [OrderController::class, 'store'])->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('catalog', [CatalogController::class, 'index'])->name('catalog');
});

require __DIR__.'/settings.php';