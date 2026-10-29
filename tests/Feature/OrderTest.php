<?php

use App\Mail\OrderConfirmed;
use Illuminate\Support\Facades\Mail;

test('customers can place an order and receive confirmation', function () {
    Mail::fake();

    $payload = [
        'customer_name' => 'Jane Doe',
        'customer_email' => 'jane@example.com',
        'customer_phone' => '+260 97 1234567',
        'delivery_address' => 'Plot 482, Great East Road',
        'delivery_type' => 'delivery',
        'payment_method' => 'mobile_money',
        'payment_details' => [
            'network' => 'Airtel Money',
            'number' => '+260 97 1234567',
        ],
        'items' => [
            [
                'name' => 'Paracetamol Extra (500mg)',
                'qty' => 2,
                'price' => 4.99,
                'image' => '/images/products/paracetamol.jpg',
            ],
            [
                'name' => 'Vitamin C 1000mg + Zinc',
                'qty' => 1,
                'price' => 9.99,
            ],
        ],
        'subtotal' => 19.97,
        'delivery_fee' => 3.50,
        'total' => 23.47,
    ];

    $response = $this->postJson(route('checkout.store'), $payload);

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ])
        ->assertJsonStructure([
            'success',
            'message',
            'order' => [
                'order_number',
                'customer_name',
                'total',
            ],
        ]);

    Mail::assertQueued(OrderConfirmed::class, function ($mail) {
        $html = $mail->render();

        return $mail->hasTo('jane@example.com')
            && str_contains($html, url('/images/products/paracetamol.jpg'))
            && str_contains($html, 'Instrument Sans');
    });
});

test('order requires valid items and customer details', function () {
    $response = $this->postJson(route('checkout.store'), []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['customer_name', 'customer_email', 'items']);
});

test('order rejects product images outside the product image directory', function () {
    $response = $this->postJson(route('checkout.store'), [
        'customer_name' => 'Jane Doe',
        'customer_email' => 'jane@example.com',
        'customer_phone' => '+260 97 1234567',
        'delivery_address' => 'Plot 482, Great East Road',
        'delivery_type' => 'delivery',
        'payment_method' => 'cash',
        'items' => [
            [
                'name' => 'Paracetamol Extra (500mg)',
                'qty' => 1,
                'price' => 4.99,
                'image' => 'https://example.com/tracker.jpg',
            ],
        ],
        'subtotal' => 4.99,
        'delivery_fee' => 3.50,
        'total' => 8.49,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['items.0.image']);
});

test('customers can place an order with Yango delivery and receive courier dispatch confirmation', function () {
    Mail::fake();

    $payload = [
        'customer_name' => 'John Banda',
        'customer_email' => 'john@example.com',
        'customer_phone' => '+260 97 7654321',
        'delivery_address' => '12 Woodlands Extension, Lusaka',
        'delivery_type' => 'yango',
        'courier_name' => 'Yango Delivery',
        'payment_method' => 'mobile_money',
        'items' => [
            [
                'name' => 'Vitamin C 1000mg + Zinc',
                'qty' => 1,
                'price' => 120.00,
            ],
        ],
        'subtotal' => 120.00,
        'delivery_fee' => 60.00,
        'total' => 180.00,
    ];

    $response = $this->postJson(route('checkout.store'), $payload);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'order' => [
                'delivery_type' => 'yango',
                'courier_name' => 'Yango Delivery',
                'total' => 'K180.00',
            ],
        ]);

    Mail::assertQueued(OrderConfirmed::class, function ($mail) {
        $html = $mail->render();

        return $mail->hasTo('john@example.com')
            && str_contains($html, 'Yango Delivery')
            && str_contains($html, 'A PharmacyCat staff member will book your courier and call you to confirm');
    });
});

test('customers can place an order with inDrive delivery', function () {
    Mail::fake();

    $payload = [
        'customer_name' => 'Mutale Phiri',
        'customer_email' => 'mutale@example.com',
        'customer_phone' => '+260 96 1122334',
        'delivery_address' => 'Plot 88, Kabulonga, Lusaka',
        'delivery_type' => 'indrive',
        'courier_name' => 'inDrive Delivery',
        'payment_method' => 'card',
        'items' => [
            [
                'name' => 'Daily Multivitamin Complete',
                'qty' => 1,
                'price' => 250.00,
            ],
        ],
        'subtotal' => 250.00,
        'delivery_fee' => 55.00,
        'total' => 305.00,
    ];

    $response = $this->postJson(route('checkout.store'), $payload);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'order' => [
                'delivery_type' => 'indrive',
                'courier_name' => 'inDrive Delivery',
            ],
        ]);

    Mail::assertQueued(OrderConfirmed::class, function ($mail) {
        $html = $mail->render();

        return $mail->hasTo('mutale@example.com')
            && str_contains($html, 'inDrive Delivery')
            && str_contains($html, 'A PharmacyCat staff member will book your courier and call you to confirm');
    });
});

test('customers can place an order for Counter Pickup', function () {
    Mail::fake();

    $payload = [
        'customer_name' => 'Chipo Mwansa',
        'customer_email' => 'chipo@example.com',
        'customer_phone' => '+260 95 9988776',
        'delivery_address' => 'PharmacyCat Counter Collection',
        'delivery_type' => 'pickup',
        'payment_method' => 'cash',
        'items' => [
            [
                'name' => 'Paracetamol Extra (500mg)',
                'qty' => 1,
                'price' => 45.00,
            ],
        ],
        'subtotal' => 45.00,
        'delivery_fee' => 0.00,
        'total' => 45.00,
    ];

    $response = $this->postJson(route('checkout.store'), $payload);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'order' => [
                'delivery_type' => 'pickup',
                'delivery_fee' => 'K0.00',
            ],
        ]);

    Mail::assertQueued(OrderConfirmed::class, function ($mail) {
        $html = $mail->render();

        return $mail->hasTo('chipo@example.com')
            && str_contains($html, 'counter collection');
    });
});

test('order rejects invalid delivery_type', function () {
    $response = $this->postJson(route('checkout.store'), [
        'customer_name' => 'Jane Doe',
        'customer_email' => 'jane@example.com',
        'customer_phone' => '+260 97 1234567',
        'delivery_address' => 'Plot 482, Great East Road',
        'delivery_type' => 'drone_delivery',
        'payment_method' => 'cash',
        'items' => [
            [
                'name' => 'Paracetamol Extra (500mg)',
                'qty' => 1,
                'price' => 45.00,
            ],
        ],
        'subtotal' => 45.00,
        'delivery_fee' => 0.00,
        'total' => 45.00,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['delivery_type']);
});
