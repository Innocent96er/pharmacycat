<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['pain-relief', 'Paracetamol 500mg (20 tablets)', 'Relief from mild to moderate pain and fever.', 15.00, 100, true],
            ['pain-relief', 'Ibuprofen 400mg (20 tablets)', 'Anti-inflammatory pain relief.', 25.00, 80, false],
            ['vitamins', 'Vitamin C 1000mg (30 tablets)', 'Daily immune support.', 60.00, 50, true],
            ['vitamins', 'Multivitamin Complex (60 tablets)', 'Daily vitamins and minerals.', 95.00, 40, false],
            ['antibiotics', 'Amoxicillin 500mg (21 capsules)', 'Antibiotic capsules.', 70.00, 30, false],
            ['cold-flu', 'Cough Syrup 100ml', 'Soothes cough and throat irritation.', 45.00, 60, true],
            ['cold-flu', 'Cold & Flu Tablets (12 tablets)', 'Relieves cold and flu symptoms.', 35.00, 70, true],
            ['skincare', 'Moisturising Cream 200ml', 'Daily hydrating body cream.', 55.00, 45, false],
        ];

        foreach ($products as [$slug, $name, $description, $price, $stock, $featured]) {
            $categoryId = DB::table('categories')->where('slug', $slug)->value('id');

            DB::table('products')->updateOrInsert(
                ['name' => $name],
                [
                    'category_id' => $categoryId,
                    'description' => $description,
                    'price' => $price,
                    'stock' => $stock,
                    'is_featured' => $featured,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
