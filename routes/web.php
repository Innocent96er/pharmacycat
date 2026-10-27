<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
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
