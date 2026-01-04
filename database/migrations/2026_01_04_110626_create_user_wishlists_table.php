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
        Schema::create('user_wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('guest_token', 36)->nullable()->index(); // UUID for guests
            $table->string('name')->default('My Wishlist');
            $table->string('slug')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            // Unique constraint: user + name (for authenticated users)
            $table->unique(['user_id', 'name']);
            // Index for guest token lookups
            $table->index(['guest_token', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_wishlists');
    }
};
