<?php

use App\Http\Controllers\CatalogController;
use App\Models\Product;
use App\Models\User;

test('guests can browse the catalog without logging in', function () {
    Product::factory()->count(3)->create();

    $this->get(route('catalog'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('catalog'));
});

test('authenticated users can also browse the catalog', function () {
    $this->actingAs(User::factory()->create());
    Product::factory()->count(3)->create();

    $this->get(route('catalog'))->assertOk();
});

test('catalog paginates at configured items per page', function () {
    Product::factory()->count(25)->create();

    $this->get(route('catalog'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('catalog')
            ->has('products.data', CatalogController::PER_PAGE)
            ->where('products.total', 25));
});

test('search is case-insensitive and matches partial words', function () {
    Product::factory()->create(['name' => 'Paracetamol 500mg']);
    Product::factory()->create(['name' => 'Vitamin C']);

    $this->get(route('catalog', ['search' => 'PARA']))
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Paracetamol 500mg'));
});

test('search also matches the active ingredient', function () {
    Product::factory()->create(['name' => 'Brand X', 'active_ingredient' => 'Ibuprofen']);
    Product::factory()->create(['name' => 'Brand Y', 'active_ingredient' => 'Zinc']);

    $this->get(route('catalog', ['search' => 'ibupro']))
        ->assertInertia(fn ($page) => $page->has('products.data', 1));
});

test('filters by category', function () {
    Product::factory()->create(['category' => 'Baby Care']);
    Product::factory()->count(2)->create(['category' => 'First Aid']);

    $this->get(route('catalog', ['category' => 'First Aid']))
        ->assertInertia(fn ($page) => $page->has('products.data', 2));
});

test('filters by price range (inclusive)', function () {
    Product::factory()->create(['price' => 5.00]);
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 25.00]);

    $this->get(route('catalog', ['min_price' => 5, 'max_price' => 10]))
        ->assertInertia(fn ($page) => $page->has('products.data', 2));

    $this->get(route('catalog', ['min_price' => 10]))
        ->assertInertia(fn ($page) => $page->has('products.data', 2));
});

test('filters by prescription type', function () {
    Product::factory()->count(3)->create();
    Product::factory()->prescription()->create();

    $this->get(route('catalog', ['prescription' => 'rx']))
        ->assertInertia(fn ($page) => $page->has('products.data', 1));

    $this->get(route('catalog', ['prescription' => 'otc']))
        ->assertInertia(fn ($page) => $page->has('products.data', 3));
});

test('search and filters combine, then paginate the filtered set', function () {
    Product::factory()->count(7)->create([
        'category' => 'Vitamins & Supplements',
        'prescription_type' => 'otc',
        'price' => 10,
        'name' => 'Vitamin test',
    ]);
    Product::factory()->count(4)->create(['category' => 'First Aid']);

    $this->get(route('catalog', [
        'search' => 'vitamin',
        'category' => 'Vitamins & Supplements',
        'prescription' => 'otc',
        'max_price' => 20,
    ]))->assertInertia(fn ($page) => $page
        ->has('products.data', 7)
        ->where('products.total', 7));
});
