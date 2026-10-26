<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Pain Relief',
            'Vitamins',
            'Antibiotics',
            'Cold & Flu',
            'Skincare',
            'Other',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}