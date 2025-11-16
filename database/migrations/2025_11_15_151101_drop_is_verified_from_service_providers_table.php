<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('service_providers', function (Blueprint $table) {
            // Drop the redundant is_verified column
            // verification_status enum field now serves as the single source of truth
            $table->dropColumn('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_providers', function (Blueprint $table) {
            // Re-add the is_verified column for rollback
            // Default to true if verification_status is 'approved'
            $table->boolean('is_verified')->default(false)->after('verification_status');
        });

        // Sync the is_verified value based on verification_status
        DB::table('service_providers')
            ->where('verification_status', 'approved')
            ->update(['is_verified' => true]);
    }
};
