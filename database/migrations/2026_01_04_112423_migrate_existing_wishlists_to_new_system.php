<?php

use App\Models\Service;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Migrates data from old wishlists table to new user_wishlists and wishlist_items tables.
     * - Creates a default wishlist for each user who has wishlist items
     * - Moves all service IDs to wishlist_items with proper polymorphic types
     */
    public function up(): void
    {
        // Check if old wishlists table exists
        if (! \Illuminate\Support\Facades\Schema::hasTable('wishlists')) {
            return;
        }

        // Get all unique users with wishlists
        $userIds = DB::table('wishlists')
            ->select('user_id')
            ->distinct()
            ->pluck('user_id');

        foreach ($userIds as $userId) {
            // Create default wishlist for user
            $wishlistId = DB::table('user_wishlists')->insertGetId([
                'user_id' => $userId,
                'guest_token' => null,
                'name' => 'My Wishlist',
                'slug' => 'my-wishlist-'.Str::random(6),
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Get all services for this user
            $serviceIds = DB::table('wishlists')
                ->where('user_id', $userId)
                ->pluck('service_id');

            // Insert each service as a wishlist item
            foreach ($serviceIds as $serviceId) {
                DB::table('wishlist_items')->insert([
                    'user_wishlist_id' => $wishlistId,
                    'itemable_type' => Service::class,
                    'itemable_id' => $serviceId,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * Note: This only removes migrated data. The old wishlists table is not affected.
     */
    public function down(): void
    {
        // Remove all user wishlists that were created by this migration
        // (those named "My Wishlist" with is_default = true)
        DB::table('user_wishlists')
            ->where('name', 'My Wishlist')
            ->where('is_default', true)
            ->whereNotNull('user_id')
            ->delete();
    }
};
