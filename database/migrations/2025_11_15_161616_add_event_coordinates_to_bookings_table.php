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
        Schema::table('bookings', function (Blueprint $table) {
            // Add event coordinates for map location
            $table->decimal('event_latitude', 10, 7)->nullable()->after('event_location');
            $table->decimal('event_longitude', 10, 7)->nullable()->after('event_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['event_latitude', 'event_longitude']);
        });
    }
};
