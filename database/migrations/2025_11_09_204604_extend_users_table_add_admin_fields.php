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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('role');
            $table->enum('admin_role', ['super_admin', 'admin', 'moderator'])->nullable()->after('is_admin');
            $table->json('admin_permissions')->nullable()->after('admin_role');

            // Add index for performance
            $table->index('is_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_admin']);
            $table->dropColumn(['is_admin', 'admin_role', 'admin_permissions']);
        });
    }
};
