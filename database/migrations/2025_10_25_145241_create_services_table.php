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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_provider_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2);
            $table->enum('price_type', ['fixed', 'hourly', 'daily', 'custom'])->default('fixed');
            $table->decimal('max_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('MWK');
            $table->integer('duration')->nullable(); // in minutes
            $table->integer('max_attendees')->nullable();
            $table->json('inclusions')->nullable(); // What's included
            $table->json('requirements')->nullable(); // Client requirements
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_deposit')->default(false);
            $table->decimal('deposit_percentage', 5, 2)->nullable();
            $table->integer('cancellation_hours')->default(24); // Hours before event
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['service_provider_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
