<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        $products = Product::all();

        if ($products->isEmpty()) {
            return;
        }

        $sampleOrders = [
            [
                'customer_name' => 'Alice Mwansa',
                'customer_email' => 'alice.mwansa@example.com',
                'customer_phone' => '+260 97 123 4567',
                'delivery_address' => 'Plot 42, Great East Road, Lusaka',
                'delivery_type' => 'home_delivery',
                'payment_method' => 'mobile_money',
                'status' => 'pending',
                'items' => [
                    ['product' => $products->firstWhere('name', 'Paracetamol 500mg Tablets') ?? $products[0], 'qty' => 2],
                    ['product' => $products->firstWhere('name', 'Vitamin C 1000mg + Zinc') ?? $products[1], 'qty' => 1],
                ],
            ],
            [
                'customer_name' => 'Dr. Kelvin Banda',
                'customer_email' => 'kbanda@clinic.org',
                'customer_phone' => '+260 96 987 6543',
                'delivery_address' => '12 Independence Avenue, Woodlands, Lusaka',
                'delivery_type' => 'yango',
                'payment_method' => 'card',
                'status' => 'processing',
                'items' => [
                    ['product' => $products->firstWhere('name', 'Automatic Digital Blood Pressure Monitor') ?? $products[0], 'qty' => 1],
                    ['product' => $products->firstWhere('name', 'Emergency First Aid Kit 50pc') ?? $products[1], 'qty' => 1],
                ],
            ],
            [
                'customer_name' => 'Chileshe Mulenga',
                'customer_email' => 'chileshe.m@gmail.com',
                'customer_phone' => '+260 95 555 4321',
                'delivery_address' => 'Kalingalinga Clinic Road, Lusaka',
                'delivery_type' => 'pickup',
                'payment_method' => 'cash',
                'status' => 'delivered',
                'items' => [
                    ['product' => $products->firstWhere('name', 'Cough & Cold Day/Night Syrup') ?? $products[0], 'qty' => 1],
                    ['product' => $products->firstWhere('name', 'Soothing Throat Lozenges Honey & Lemon') ?? $products[1], 'qty' => 2],
                ],
            ],
            [
                'customer_name' => 'Grace Tembo',
                'customer_email' => 'grace.tembo@outlook.com',
                'customer_phone' => '+260 97 777 8899',
                'delivery_address' => 'Alick Nkhata Road, Mass Media, Lusaka',
                'delivery_type' => 'home_delivery',
                'payment_method' => 'mobile_money',
                'status' => 'delivered',
                'items' => [
                    ['product' => $products->firstWhere('name', 'Barrier Repair Ceramide Moisturizing Cream') ?? $products[0], 'qty' => 1],
                    ['product' => $products->firstWhere('name', 'Baby Nappy Rash Zinc Barrier Cream') ?? $products[1], 'qty' => 1],
                ],
            ],
            [
                'customer_name' => 'Mutale Phiri',
                'customer_email' => 'mutale.phiri@yahoo.com',
                'customer_phone' => '+260 96 111 2233',
                'delivery_address' => 'Kabulonga Shopping Centre, Lusaka',
                'delivery_type' => 'indrive',
                'payment_method' => 'card',
                'status' => 'pending',
                'items' => [
                    ['product' => $products->firstWhere('name', 'Ibuprofen Rapid Action') ?? $products[0], 'qty' => 3],
                ],
            ],
        ];

        foreach ($sampleOrders as $data) {
            $subtotal = 0;
            $itemsData = $data['items'];
            unset($data['items']);

            foreach ($itemsData as $itemInfo) {
                $subtotal += (float) $itemInfo['product']->price * $itemInfo['qty'];
            }

            $deliveryFee = match ($data['delivery_type']) {
                'home_delivery' => 50.00,
                'yango' => 60.00,
                'indrive' => 55.00,
                default => 0.00,
            };

            $order = Order::create(array_merge($data, [
                'user_id' => $customer?->id,
                'order_number' => 'PC-' . strtoupper(Str::random(6)),
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total_amount' => $subtotal + $deliveryFee,
            ]));

            foreach ($itemsData as $itemInfo) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemInfo['product']->id,
                    'quantity' => $itemInfo['qty'],
                    'unit_price' => $itemInfo['product']->price,
                ]);
            }
        }
    }
}

