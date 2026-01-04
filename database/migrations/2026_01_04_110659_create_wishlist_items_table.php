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
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_wishlist_id')->constrained('user_wishlists')->cascadeOnDelete();
            $table->string('itemable_type'); // 'App\Models\ServiceProvider', 'App\Models\ServicePackage', or 'App\Models\Service'
            $table->unsignedBigInteger('itemable_id');
            $table->text('notes')->nullable(); // User notes for this item
            $table->timestamps();

            // Prevent duplicate items in same wishlist
            $table->unique(['user_wishlist_id', 'itemable_type', 'itemable_id'], 'wishlist_item_unique');
            // Index for polymorphic lookups
            $table->index(['itemable_type', 'itemable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};
