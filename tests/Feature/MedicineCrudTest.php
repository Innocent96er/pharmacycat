<?php

use App\Models\Medicine;

test('can display medicines list', function () {
    Medicine::create([
        'name' => 'Aspirin',
        'dosage' => '300mg',
        'category' => 'Pain Relief',
        'price' => 20.00,
        'stock_quantity' => 50,
        'in_stock' => true,
    ]);

    $response = $this->get(route('medicines.index'));
    $response->assertOk();
});

test('can render create medicine page', function () {
    $response = $this->get(route('medicines.create'));
    $response->assertOk();
});

test('can store a new medicine in database', function () {
    $response = $this->post(route('medicines.store'), [
        'name' => 'Ibuprofen Extra',
        'dosage' => '400mg',
        'category' => 'Pain Relief',
        'price' => 35.50,
        'stock_quantity' => 100,
        'in_stock' => true,
        'badge' => 'Fast Relief',
        'description' => 'Effective pain relief for headaches and fever.',
    ]);

    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseHas('medicines', [
        'name' => 'Ibuprofen Extra',
        'category' => 'Pain Relief',
    ]);
});

test('can view single medicine details', function () {
    $medicine = Medicine::create([
        'name' => 'Amoxicillin Cap',
        'dosage' => '500mg',
        'category' => 'Antibiotics',
        'price' => 70.00,
        'stock_quantity' => 30,
        'in_stock' => true,
    ]);

    $response = $this->get(route('medicines.show', $medicine));
    $response->assertOk();
});

test('can update a medicine', function () {
    $medicine = Medicine::create([
        'name' => 'Cough Syrup',
        'dosage' => '100ml',
        'category' => 'Cold & Flu',
        'price' => 30.00,
        'stock_quantity' => 20,
        'in_stock' => true,
    ]);

    $response = $this->put(route('medicines.update', $medicine), [
        'name' => 'Cough Syrup Forte',
        'dosage' => '150ml',
        'category' => 'Cold & Flu',
        'price' => 45.00,
        'stock_quantity' => 15,
        'in_stock' => true,
    ]);

    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseHas('medicines', [
        'id' => $medicine->id,
        'name' => 'Cough Syrup Forte',
        'price' => 45.00,
    ]);
});

test('can delete a medicine', function () {
    $medicine = Medicine::create([
        'name' => 'Expired Drops',
        'dosage' => '10ml',
        'category' => 'Other',
        'price' => 10.00,
        'stock_quantity' => 5,
        'in_stock' => false,
    ]);

    $response = $this->delete(route('medicines.destroy', $medicine));
    $response->assertRedirect(route('medicines.index'));
    $this->assertDatabaseMissing('medicines', [
        'id' => $medicine->id,
    ]);
});
