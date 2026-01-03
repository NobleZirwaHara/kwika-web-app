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
            SubscriptionPlanSeeder::class,
            UserSeeder::class,              // Creates customer users
            ServiceProviderSeeder::class,   // Creates provider users and their business profiles
            ServiceSeeder::class,           // Creates services for each provider
            ServicePackageSeeder::class,    // Creates service packages for each provider
            EventSeeder::class,             // Creates sample events with ticket packages
            BookingSeeder::class,           // Creates sample bookings for services
            ReviewSeeder::class,            // Creates reviews for completed bookings
        ]);

        $this->command->info('Database seeded successfully!');
    }
}
