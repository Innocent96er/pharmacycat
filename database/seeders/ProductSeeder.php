<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed sample pharmacy products (23 items = 5 pages at 5 per page).
     */
    public function run(): void
    {
        $products = [
            // [name, description, active ingredient, category, price, type]
            ['Paracetamol 500mg Tablets', 'Fast relief from mild pain and fever.', 'Paracetamol', 'Pain Relief', 3.50, 'otc'],
            ['Ibuprofen 200mg Tablets', 'Anti-inflammatory for headaches and muscle pain.', 'Ibuprofen', 'Pain Relief', 4.75, 'otc'],
            ['Diclofenac Gel 1%', 'Topical gel for joint and muscle pain.', 'Diclofenac', 'Pain Relief', 8.90, 'otc'],
            ['Tramadol 50mg Capsules', 'Strong pain relief for moderate to severe pain.', 'Tramadol', 'Pain Relief', 14.00, 'rx'],
            ['Vitamin C 1000mg', 'Daily immune support, effervescent tablets.', 'Ascorbic acid', 'Vitamins & Supplements', 9.99, 'otc'],
            ['Vitamin D3 2000 IU', 'Supports bone health and immunity.', 'Cholecalciferol', 'Vitamins & Supplements', 12.50, 'otc'],
            ['Multivitamin Adults', 'Complete daily vitamins and minerals.', 'Mixed vitamins', 'Vitamins & Supplements', 18.00, 'otc'],
            ['Iron + Folic Acid', 'Helps prevent iron-deficiency anaemia.', 'Ferrous sulfate', 'Vitamins & Supplements', 7.25, 'otc'],
            ['Zinc 50mg Tablets', 'Supports immune function.', 'Zinc gluconate', 'Vitamins & Supplements', 6.40, 'otc'],
            ['Adhesive Bandages (50 pack)', 'Assorted sizes, breathable fabric.', null, 'First Aid', 2.99, 'otc'],
            ['Antiseptic Solution 100ml', 'Cleans minor cuts and grazes.', 'Povidone-iodine', 'First Aid', 3.20, 'otc'],
            ['Sterile Gauze Pads', 'Pack of 20 sterile pads.', null, 'First Aid', 4.10, 'otc'],
            ['Burn Relief Cream', 'Soothes minor burns and scalds.', 'Lidocaine', 'First Aid', 6.80, 'otc'],
            ['Baby Nappy Rash Cream', 'Gentle zinc-based barrier cream.', 'Zinc oxide', 'Baby Care', 5.60, 'otc'],
            ['Infant Paracetamol Syrup', 'Pain and fever relief for infants.', 'Paracetamol', 'Baby Care', 6.30, 'otc'],
            ['Baby Gripe Water', 'Eases colic and wind.', 'Sodium bicarbonate', 'Baby Care', 4.45, 'otc'],
            ['Cough Syrup 150ml', 'Soothes dry and chesty coughs.', 'Dextromethorphan', 'Cold & Flu', 5.20, 'otc'],
            ['Decongestant Nasal Spray', 'Relieves a blocked nose.', 'Xylometazoline', 'Cold & Flu', 4.90, 'otc'],
            ['Cold & Flu Sachets', 'Hot drink for cold and flu symptoms.', 'Paracetamol', 'Cold & Flu', 7.10, 'otc'],
            ['Amoxicillin 500mg Capsules', 'Antibiotic for bacterial infections.', 'Amoxicillin', 'Cold & Flu', 11.50, 'rx'],
            ['Digital Thermometer', 'Fast, accurate digital reading.', null, 'Medical Devices', 9.50, 'otc'],
            ['Blood Pressure Monitor', 'Automatic upper-arm monitor.', null, 'Medical Devices', 45.00, 'otc'],
            ['Salbutamol Inhaler 100mcg', 'Reliever inhaler for asthma.', 'Salbutamol', 'Medical Devices', 13.75, 'rx'],
        ];

        foreach ($products as [$name, $description, $ingredient, $category, $price, $type]) {
            Product::create([
                'name' => $name,
                'description' => $description,
                'active_ingredient' => $ingredient,
                'category' => $category,
                'price' => $price,
                'prescription_type' => $type,
            ]);
        }
    }
}
