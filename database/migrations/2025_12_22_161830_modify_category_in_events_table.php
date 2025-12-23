<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the column
        // Change category from enum to string to allow custom categories
        Schema::table('events', function (Blueprint $table) {
            $table->string('category_new')->default('other')->after('category');
        });

        // Copy data
        DB::statement('UPDATE events SET category_new = category');

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('category_new', 'category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to enum if needed
        Schema::table('events', function (Blueprint $table) {
            $table->string('category_old')->default('other')->after('category');
        });

        DB::statement('UPDATE events SET category_old = category');

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->enum('category', ['conference', 'workshop', 'concert', 'festival', 'sports', 'exhibition', 'networking', 'other'])->default('other');
        });

        DB::statement('UPDATE events SET category = category_old');

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('category_old');
        });
    }
};
