<?php

use App\Models\Medicine;
use App\Models\User;

function medicineCrudPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Ibuprofen Extra',
        'dosage' => '400mg',
        'category' => 'Pain Relief',
        'price' => 35.50,
        'stock_quantity' => 100,
        'in_stock' => true,
        'badge' => 'Fast Relief',
        'description' => 'Effective pain relief for headaches and fever.',
    ], $overrides);
}

function medicineCrudMedicine(array $overrides = []): Medicine
{
    return Medicine::create(array_merge([
        'name' => 'Aspirin',
        'dosage' => '300mg',
        'category' => 'Pain Relief',
        'price' => 20.00,
        'stock_quantity' => 50,
        'in_stock' => true,
    ], $overrides));
}

test('guests can display the medicines list', function () {
    medicineCrudMedicine();

    $this->get(route('medicines.index'))->assertOk();
});

test('guests can view single medicine details', function () {
    $medicine = medicineCrudMedicine([
        'name' => 'Amoxicillin Cap',
        'dosage' => '500mg',
        'category' => 'Antibiotics',
        'price' => 70.00,
    ]);

    $this->get(route('medicines.show', $medicine))->assertOk();
});

test('admins and pharmacists can render the create and edit pages', function (string $role) {
    $user = User::factory()->create(['role' => $role]);
    $medicine = medicineCrudMedicine();

    $this->actingAs($user)->get(route('medicines.create'))->assertOk();
    $this->actingAs($user)->get(route('medicines.edit', $medicine))->assertOk();
})->with(['admin', 'pharmacist']);

test('admins and pharmacists can store a new medicine', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $response = $this->actingAs($user)->post(route('medicines.store'), medicineCrudPayload());

    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseHas('medicines', [
        'name' => 'Ibuprofen Extra',
        'category' => 'Pain Relief',
    ]);
})->with(['admin', 'pharmacist']);

test('admins and pharmacists can update a medicine', function (string $role) {
    $user = User::factory()->create(['role' => $role]);
    $medicine = medicineCrudMedicine([
        'name' => 'Cough Syrup',
        'dosage' => '100ml',
        'category' => 'Cold & Flu',
        'price' => 30.00,
    ]);

    $response = $this->actingAs($user)->put(route('medicines.update', $medicine), medicineCrudPayload([
        'name' => 'Cough Syrup Forte',
        'dosage' => '150ml',
        'category' => 'Cold & Flu',
        'price' => 45.00,
    ]));

    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseHas('medicines', [
        'id' => $medicine->id,
        'name' => 'Cough Syrup Forte',
        'price' => 45.00,
    ]);
})->with(['admin', 'pharmacist']);

test('admins can delete a medicine', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $medicine = medicineCrudMedicine(['name' => 'Expired Drops', 'in_stock' => false]);

    $response = $this->actingAs($admin)->delete(route('medicines.destroy', $medicine));

    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseMissing('medicines', ['id' => $medicine->id]);
});

test('pharmacists cannot delete a medicine', function () {
    $pharmacist = User::factory()->create(['role' => 'pharmacist']);
    $medicine = medicineCrudMedicine();

    $this->actingAs($pharmacist)
        ->delete(route('medicines.destroy', $medicine))
        ->assertForbidden();

    $this->assertDatabaseHas('medicines', ['id' => $medicine->id]);
});

test('customers cannot create, edit, update or delete medicines', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $medicine = medicineCrudMedicine();

    $this->actingAs($customer)->get(route('medicines.create'))->assertForbidden();
    $this->actingAs($customer)->get(route('medicines.edit', $medicine))->assertForbidden();
    $this->actingAs($customer)
        ->post(route('medicines.store'), medicineCrudPayload())
        ->assertForbidden();
    $this->actingAs($customer)
        ->put(route('medicines.update', $medicine), medicineCrudPayload(['name' => 'Changed']))
        ->assertForbidden();
    $this->actingAs($customer)
        ->delete(route('medicines.destroy', $medicine))
        ->assertForbidden();

    $this->assertDatabaseHas('medicines', ['id' => $medicine->id, 'name' => 'Aspirin']);
    $this->assertDatabaseMissing('medicines', ['name' => 'Ibuprofen Extra']);
    $this->assertDatabaseMissing('medicines', ['name' => 'Changed']);
});

test('guests are redirected to the login page for staff actions', function () {
    $medicine = medicineCrudMedicine();

    $this->get(route('medicines.create'))->assertRedirect(route('login'));
    $this->post(route('medicines.store'), medicineCrudPayload())->assertRedirect(route('login'));
    $this->put(route('medicines.update', $medicine), medicineCrudPayload())->assertRedirect(route('login'));
    $this->delete(route('medicines.destroy', $medicine))->assertRedirect(route('login'));
});
