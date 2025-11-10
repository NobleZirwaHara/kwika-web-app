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
        Schema::create('ticket_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "VIP", "General Admission", "Early Bird"
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('MWK');

            // Availability
            $table->integer('quantity_available')->nullable(); // null = unlimited
            $table->integer('quantity_sold')->default(0);
            $table->integer('min_per_order')->default(1);
            $table->integer('max_per_order')->nullable();

            // Sale Period
            $table->dateTime('sale_start')->nullable();
            $table->dateTime('sale_end')->nullable();

            // Features
            $table->json('features')->nullable(); // List of benefits/inclusions
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('ticket_packages');
    }
};
