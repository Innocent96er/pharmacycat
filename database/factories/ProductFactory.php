<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'active_ingredient' => fake()->word(),
            'category' => fake()->randomElement(Product::CATEGORIES),
            'price' => fake()->randomFloat(2, 2, 60),
            'prescription_type' => Product::OTC,
        ];
    }

    public function prescription(): static
    {
        return $this->state(fn () => ['prescription_type' => Product::RX]);
    }
}
