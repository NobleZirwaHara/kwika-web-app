<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create customer users (matching testimonial images)
        $customers = [
            [
                'name' => 'Sarah Mkwezalamba',
                'email' => 'sarah.mkwezalamba@gmail.com',
                'phone' => '+265991111222',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Michael Tembo',
                'email' => 'michael.tembo@outlook.com',
                'phone' => '+265888111222',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Priya Mwambo',
                'email' => 'priya.mwambo@gmail.com',
                'phone' => '+265999111333',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'David Kachingwe',
                'email' => 'david.kachingwe@yahoo.com',
                'phone' => '+265991222333',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Amara Chisomo',
                'email' => 'amara.chisomo@gmail.com',
                'phone' => '+265888222333',
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($customers as $customer) {
            \App\User::create($customer);
        }
    }
}
