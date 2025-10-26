<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed in the correct order due to foreign key constraints
        $this->call([
            ServiceCategorySeeder::class,
            SubscriptionPlanSeeder::class,
            UserSeeder::class,              // Creates customer users
            ServiceProviderSeeder::class,   // Creates provider users and their business profiles
            // ServiceSeeder::class,        // TODO: Add when services are created
            // ReviewSeeder::class,          // TODO: Add when reviews are created
            // BookingSeeder::class,         // TODO: Add when bookings are created
        ]);

        $this->command->info('Database seeded successfully!');
    }
}
