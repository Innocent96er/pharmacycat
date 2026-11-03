<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('admins and pharmacists can access management workspaces', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)->get(route('admin.dashboard'))->assertOk();
    $this->actingAs($user)->get(route('admin.products.index'))->assertOk();
    $this->actingAs($user)->get(route('admin.categories.index'))->assertOk();
    $this->actingAs($user)->get(route('admin.orders.index'))->assertOk();
})->with(['admin', 'pharmacist']);

test('customers cannot access management workspaces', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($customer)->get(route('admin.products.index'))->assertForbidden();
    $this->actingAs($customer)->get(route('admin.categories.index'))->assertForbidden();
    $this->actingAs($customer)->get(route('admin.orders.index'))->assertForbidden();
});

test('only admins can delete products', function () {
    $product = Product::factory()->create();
    $pharmacist = User::factory()->create(['role' => 'pharmacist']);

    $this->actingAs($pharmacist)
        ->delete(route('admin.products.destroy', $product))
        ->assertForbidden();

    $this->assertDatabaseHas('products', ['id' => $product->id]);

    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});

test('only admins can delete categories', function () {
    $category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
    ]);
    $pharmacist = User::factory()->create(['role' => 'pharmacist']);

    $this->actingAs($pharmacist)
        ->delete(route('admin.categories.destroy', $category))
        ->assertForbidden();

    $this->assertDatabaseHas('categories', ['id' => $category->id]);

    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
