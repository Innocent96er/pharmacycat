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
        return $mail->hasTo('jane@example.com');
    });
});

test('order requires valid items and customer details', function () {
    $response = $this->postJson(route('checkout.store'), []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['customer_name', 'customer_email', 'items']);
});
