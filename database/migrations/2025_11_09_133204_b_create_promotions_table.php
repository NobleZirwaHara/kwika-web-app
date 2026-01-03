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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_provider_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['percentage', 'fixed_amount', 'bundle', 'early_bird'])->default('percentage');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('code')->unique()->nullable(); // Promo code (null for automatic promotions)
            $table->decimal('discount_value', 10, 2); // Percentage or fixed amount
            $table->decimal('min_booking_amount', 10, 2)->nullable(); // Minimum booking to qualify
            $table->decimal('max_discount_amount', 10, 2)->nullable(); // Cap for percentage discounts
            $table->enum('applicable_to', ['all_services', 'specific_services', 'specific_categories'])->default('all_services');
            $table->json('service_ids')->nullable(); // For specific_services
            $table->json('category_ids')->nullable(); // For specific_categories
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('usage_limit')->nullable(); // Total uses (null = unlimited)
            $table->integer('usage_count')->default(0); // Times used
            $table->integer('per_customer_limit')->default(1); // Max per customer
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0); // For stacking/conflict resolution
            $table->text('terms_conditions')->nullable();
            $table->string('banner_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
