<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'dosage')) {
                $table->string('dosage')->nullable()->after('active_ingredient');
            }
            if (! Schema::hasColumn('products', 'badge')) {
                $table->string('badge')->nullable()->after('is_featured');
            }
            if (! Schema::hasColumn('products', 'manufacturer')) {
                $table->string('manufacturer')->nullable()->after('badge');
            }
            if (! Schema::hasColumn('products', 'expiry_date')) {
                $table->date('expiry_date')->nullable()->after('manufacturer');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'order_number')) {
                $table->string('order_number')->nullable()->after('id');
            }
            if (! Schema::hasColumn('orders', 'customer_name')) {
                $table->string('customer_name')->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('orders', 'customer_email')) {
                $table->string('customer_email')->nullable()->after('customer_name');
            }
            if (! Schema::hasColumn('orders', 'customer_phone')) {
                $table->string('customer_phone')->nullable()->after('customer_email');
            }
            if (! Schema::hasColumn('orders', 'delivery_address')) {
                $table->text('delivery_address')->nullable()->after('customer_phone');
            }
            if (! Schema::hasColumn('orders', 'delivery_type')) {
                $table->string('delivery_type')->nullable()->after('delivery_address');
            }
            if (! Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('delivery_type');
            }
            if (! Schema::hasColumn('orders', 'subtotal')) {
                $table->decimal('subtotal', 10, 2)->nullable()->after('payment_method');
            }
            if (! Schema::hasColumn('orders', 'delivery_fee')) {
                $table->decimal('delivery_fee', 10, 2)->nullable()->after('subtotal');
            }
        });

        try {
            Schema::table('orders', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->change();
            });
        } catch (\Throwable $e) {
            // SQLite foreign key constraint modification fallback
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['dosage', 'badge', 'manufacturer', 'expiry_date']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_number',
                'customer_name',
                'customer_email',
                'customer_phone',
                'delivery_address',
                'delivery_type',
                'payment_method',
                'subtotal',
                'delivery_fee',
            ]);
        });
    }
};
