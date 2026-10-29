<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $active_ingredient
 * @property string $category
 * @property string $price
 * @property string $prescription_type
 * @property int|null $category_id
 * @property int $stock
 * @property string|null $image
 * @property bool $is_featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'description', 'active_ingredient', 'category', 'price', 'prescription_type', 'category_id', 'stock', 'image', 'is_featured'])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    public const PER_PAGE = 5;

    public const OTC = 'otc';

    public const RX = 'rx';

    public const PRESCRIPTION_TYPES = [self::OTC, self::RX];

    public const CATEGORIES = [
        'Pain Relief',
        'Vitamins & Supplements',
        'First Aid',
        'Baby Care',
        'Cold & Flu',
        'Medical Devices',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['is_featured' => 'boolean'];
    }

    /** @return BelongsTo<Category, $this> */
    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Keyword search: name, description or active ingredient (case-insensitive, partial match).
     *
     * @param  Builder<Product>  $query
     */
    public function scopeSearch(Builder $query, ?string $term): void
    {
        $term = trim((string) $term);

        if ($term === '') {
            return;
        }

        $query->where(function (Builder $q) use ($term) {
            $q->whereLike('name', "%{$term}%")
                ->orWhereLike('description', "%{$term}%")
                ->orWhereLike('active_ingredient', "%{$term}%");
        });
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeInCategory(Builder $query, ?string $category): void
    {
        if ($category) {
            $query->where('category', $category);
        }
    }

    /**
     * Inclusive price range; either bound may be omitted.
     *
     * @param  Builder<Product>  $query
     */
    public function scopePriceBetween(Builder $query, int|float|string|null $min, int|float|string|null $max): void
    {
        if ($min !== null && $min !== '') {
            $query->where('price', '>=', $min);
        }

        if ($max !== null && $max !== '') {
            $query->where('price', '<=', $max);
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeOfPrescriptionType(Builder $query, ?string $type): void
    {
        if ($type) {
            $query->where('prescription_type', $type);
        }
    }
}
