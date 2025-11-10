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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalogue_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_provider_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('sku')->nullable()->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('MWK');
            $table->integer('stock_quantity')->default(0);
            $table->boolean('track_inventory')->default(true);
            $table->string('unit')->nullable(); // e.g., piece, kg, liter
            $table->decimal('weight', 10, 2)->nullable();
            $table->string('dimensions')->nullable(); // JSON or string like "10x20x30"
            $table->json('specifications')->nullable();
            $table->json('features')->nullable();
            $table->string('primary_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
