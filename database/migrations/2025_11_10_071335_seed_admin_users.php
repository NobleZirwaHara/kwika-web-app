<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Seed Super Admin
        DB::table('users')->insert([
            'name' => 'Super Admin',
            'email' => 'superadmin@kwika.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_admin' => true,
            'admin_role' => 'super_admin',
            'admin_permissions' => null, // Super admin has all permissions
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Admin
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@kwika.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_admin' => true,
            'admin_role' => 'admin',
            'admin_permissions' => json_encode([
                'manage_providers',
                'manage_users',
                'manage_content',
                'manage_payments',
                'manage_subscriptions',
                'moderate_reviews',
            ]),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Moderator
        DB::table('users')->insert([
            'name' => 'Moderator User',
            'email' => 'moderator@kwika.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_admin' => true,
            'admin_role' => 'moderator',
            'admin_permissions' => json_encode([
                'moderate_reviews',
                'manage_content',
            ]),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove seeded admin users
        DB::table('users')->whereIn('email', [
            'superadmin@kwika.com',
            'admin@kwika.com',
            'moderator@kwika.com',
        ])->delete();
    }
};
