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
        Schema::create('service_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_provider_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->enum('package_type', ['tier', 'bundle'])->default('tier');
            $table->foreignId('base_service_id')->nullable()->constrained('services')->onDelete('set null');
            $table->decimal('base_price', 10, 2)->default(0);
            $table->decimal('final_price', 10, 2)->default(0);
            $table->string('currency', 3)->default('MWK');
            $table->integer('min_quantity')->default(1);
            $table->integer('max_quantity')->nullable();
            $table->json('inclusions')->nullable();
            $table->string('primary_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Unique slug per provider
            $table->unique(['service_provider_id', 'slug']);
            $table->index(['package_type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_packages');
    }
};
