<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Pain Relief
            ['Paracetamol', '500mg Tablets', 'Pain Relief', 25, 120],
            ['Ibuprofen', '200mg Tablets', 'Pain Relief', 35, 80],
            ['Aspirin', '300mg Tablets', 'Pain Relief', 30, 60],
            ['Diclofenac Gel', '30g Tube', 'Pain Relief', 55, 40],

            // Antibiotics
            ['Amoxicillin', '250mg Capsules', 'Antibiotics', 85, 30],
            ['Azithromycin', '250mg Tablets', 'Antibiotics', 95, 20],
            ['Doxycycline', '100mg Capsules', 'Antibiotics', 70, 25],
            ['Cephalexin', '500mg Capsules', 'Antibiotics', 100, 20],

            // Vitamins & Supplements
            ['Vitamin C', '1000mg Tablets', 'Vitamins & Supplements', 65, 80],
            ['Vitamin D3', '1000 IU Tablets', 'Vitamins & Supplements', 75, 50],
            ['Multivitamins', '30 Tablets', 'Vitamins & Supplements', 90, 60],
            ['Zinc Supplements', '20 Tablets', 'Vitamins & Supplements', 45, 45],

            // Cold & Flu
            ['Cough Syrup', '100ml Bottle', 'Cold & Flu', 50, 40],
            ['Throat Lozenges', 'Pack of 24', 'Cold & Flu', 30, 60],
            ['Saline Nasal Spray', '30ml Bottle', 'Cold & Flu', 45, 35],
            ['Flu Relief Tablets', 'Pack of 12', 'Cold & Flu', 40, 50],

            // Skincare
            ['Daily Face Cream', '50ml Jar', 'Skincare', 85, 40],
            ['Facial Cleanser', '150ml Bottle', 'Skincare', 70, 35],
            ['Daily Moisturizer', '100ml Bottle', 'Skincare', 95, 30],
            ['Hydrating Face Mask', 'Single Pack', 'Skincare', 25, 50],

            // Sun Protection
            ['SPF 30 Sunscreen', '100ml Tube', 'Sun Protection', 120, 35],
            ['SPF 50 Sunscreen', '50ml Tube', 'Sun Protection', 150, 30],
            ['Kids Sunscreen', '100ml Tube', 'Sun Protection', 130, 25],
            ['After-Sun Lotion', '150ml Bottle', 'Sun Protection', 90, 20],

            // Oral Care
            ['Fluoride Toothpaste', '100ml Tube', 'Oral Care', 35, 60],
            ['Soft Toothbrush', 'Single Brush', 'Oral Care', 20, 50],
            ['Mouthwash', '250ml Bottle', 'Oral Care', 45, 40],
            ['Dental Floss', '50m Pack', 'Oral Care', 30, 35],

            // Feminine Care
            ['Sanitary Pads', 'Pack of 10', 'Feminine Care', 35, 60],
            ['Pantyliners', 'Pack of 20', 'Feminine Care', 25, 45],
            ['Intimate Wash', '200ml Bottle', 'Feminine Care', 55, 25],
            ['Menstrual Heat Patch', 'Single Pack', 'Feminine Care', 30, 20],

            // Sexual Health
            ['Condoms', 'Pack of 3', 'Sexual Health', 25, 100],
            ['Water-Based Lubricant', '50ml Tube', 'Sexual Health', 65, 30],
            ['Pregnancy Test', 'Single Test', 'Sexual Health', 35, 40],
            ['Ovulation Test', 'Single Test', 'Sexual Health', 40, 30],

            // First Aid & Wound Care
            ['Adhesive Bandages', 'Pack of 20', 'First Aid & Wound Care', 25, 50],
            ['Sterile Gauze', 'Pack of 10', 'First Aid & Wound Care', 35, 40],
            ['Antiseptic Solution', '100ml Bottle', 'First Aid & Wound Care', 40, 35],
            ['Medical Tape', 'Roll', 'First Aid & Wound Care', 20, 45],

            // Medical Devices
            ['Digital Thermometer', 'Single Device', 'Medical Devices', 85, 20],
            ['Blood Pressure Monitor', 'Single Device', 'Medical Devices', 450, 10],
            ['Glucose Meter', 'Starter Kit', 'Medical Devices', 350, 12],
            ['Pulse Oximeter', 'Single Device', 'Medical Devices', 250, 15],

            // Supports & Braces
            ['Arm Brace', 'Adjustable Support', 'Supports & Braces', 180, 15],
            ['Wrist Support', 'Adjustable Support', 'Supports & Braces', 100, 20],
            ['Knee Brace', 'Adjustable Support', 'Supports & Braces', 160, 15],
            ['Ankle Support', 'Adjustable Support', 'Supports & Braces', 120, 18],

            // Other
            ['Cotton Wool', '100g Pack', 'Other', 25, 40],
            ['Hand Sanitizer', '100ml Bottle', 'Other', 30, 50],
            ['Disposable Gloves', 'Pack of 10', 'Other', 35, 35],
            ['Petroleum Jelly', '100g Jar', 'Other', 40, 30],
        ];

        foreach ($products as [$name, $dosage, $category, $price, $stock]) {
            Medicine::updateOrCreate(
                ['name' => $name, 'dosage' => $dosage],
                [
                    'category' => $category,
                    'price' => $price,
                    'stock_quantity' => $stock,
                    'in_stock' => $stock > 0,
                    'badge' => null,
                    'description' => $name.' - pharmacy catalog product.',
                    'manufacturer' => 'Please verify supplier',
                    'expiry_date' => null,
                ]
            );
        }
    }
}
