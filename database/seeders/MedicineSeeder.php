<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicines = [
            [
                'name' => 'Paracetamol',
                'dosage' => '500mg (20 Tablets)',
                'category' => 'Pain Relief',
                'price' => 25.00,
                'stock_quantity' => 120,
                'in_stock' => true,
                'badge' => 'Best Seller',
                'description' => 'Fast-acting pain reliever and fever reducer. Ideal for headaches, muscle aches, arthritis, backaches, toothaches, and colds.',
                'manufacturer' => 'PharmaHealth Ltd',
            ],
            [
                'name' => 'Amoxicillin',
                'dosage' => '250mg (30 Capsules)',
                'category' => 'Antibiotics',
                'price' => 85.50,
                'stock_quantity' => 45,
                'in_stock' => true,
                'badge' => 'Prescription Only',
                'description' => 'Broad-spectrum antibiotic used to treat bacterial infections of the ear, nose, throat, skin, and respiratory tract.',
                'manufacturer' => 'MedLife Laboratories',
            ],
            [
                'name' => 'Vitamin C + Zinc Effervescent',
                'dosage' => '1000mg (10 Tablets)',
                'category' => 'Vitamins',
                'price' => 65.00,
                'stock_quantity' => 80,
                'in_stock' => true,
                'badge' => 'Popular',
                'description' => 'Daily immune support supplement with antioxidants to fight fatigue and support daily health defense.',
                'manufacturer' => 'Vitality Labs',
            ],
            [
                'name' => 'Ibuprofen Suspension',
                'dosage' => '100mg/5ml (100ml)',
                'category' => 'Pain Relief',
                'price' => 45.00,
                'stock_quantity' => 60,
                'in_stock' => true,
                'badge' => null,
                'description' => 'Anti-inflammatory and fever relief for children and adults. Soothes swelling and toothaches.',
                'manufacturer' => 'PharmaHealth Ltd',
            ],
            [
                'name' => 'Cetirizine Hydrochloride',
                'dosage' => '10mg (30 Tablets)',
                'category' => 'Cold & Flu',
                'price' => 40.00,
                'stock_quantity' => 75,
                'in_stock' => true,
                'badge' => 'Non-Drowsy',
                'description' => 'Long-lasting allergy relief from sneezing, runny nose, itchy watery eyes, and itchy throat or nose.',
                'manufacturer' => 'AllerCare Pharma',
            ],
            [
                'name' => 'Hydrocortisone Cream 1%',
                'dosage' => '30g Tube',
                'category' => 'Skincare',
                'price' => 55.00,
                'stock_quantity' => 35,
                'in_stock' => true,
                'badge' => null,
                'description' => 'Topical anti-inflammatory cream for prompt relief of itching, insect bites, eczema, and skin rashes.',
                'manufacturer' => 'DermaSafe Co',
            ],
        ];

        foreach ($medicines as $item) {
            Medicine::updateOrCreate(
                ['name' => $item['name'], 'dosage' => $item['dosage']],
                $item
            );
        }
    }
}
