<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServiceProvider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        // Create regular customers (non-providers)
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '+265998887771',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_verified' => true,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '+265998887772',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_verified' => true,
            ],
            [
                'name' => 'Michael Johnson',
                'email' => 'michael.j@example.com',
                'phone' => '+265998887773',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_verified' => true,
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah.w@example.com',
                'phone' => '+265998887774',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_verified' => true,
            ],
        ];

        foreach ($customers as $customer) {
            User::create($customer);
        }

        // Create provider users
        $providers = [
            [
                'user' => [
                    'name' => 'David Brown',
                    'email' => 'david.brown@example.com',
                    'phone' => '+265997771111',
                    'password' => Hash::make('password'),
                    'role' => 'provider',
                    'is_verified' => true,
                ],
                'provider' => [
                    'business_name' => 'Brown Events & Catering',
                    'slug' => 'brown-events-catering',
                    'description' => 'Professional catering and event planning services',
                    'email' => 'info@brownevents.com',
                    'phone' => '+265991234571',
                    'location' => 'Lilongwe',
                    'city' => 'Lilongwe',
                    'verification_status' => 'approved',
                ],
            ],
            [
                'user' => [
                    'name' => 'Emily Davis',
                    'email' => 'emily.davis@example.com',
                    'phone' => '+265997772222',
                    'password' => Hash::make('password'),
                    'role' => 'provider',
                    'is_verified' => true,
                ],
                'provider' => [
                    'business_name' => 'Davis Photography Studio',
                    'slug' => 'davis-photography-studio',
                    'description' => 'Wedding and event photography',
                    'email' => 'info@davisphotos.com',
                    'phone' => '+265991234572',
                    'location' => 'Blantyre',
                    'city' => 'Blantyre',
                    'verification_status' => 'approved',
                ],
            ],
            [
                'user' => [
                    'name' => 'Robert Wilson',
                    'email' => 'robert.wilson@example.com',
                    'phone' => '+265997773333',
                    'password' => Hash::make('password'),
                    'role' => 'provider',
                    'is_verified' => true,
                ],
                'provider' => [
                    'business_name' => 'Wilson Sound & Lighting',
                    'slug' => 'wilson-sound-lighting',
                    'description' => 'Professional audio and lighting equipment rental',
                    'email' => 'info@wilsonsound.com',
                    'phone' => '+265991234573',
                    'location' => 'Mzuzu',
                    'city' => 'Mzuzu',
                    'verification_status' => 'approved',
                ],
            ],
        ];

        foreach ($providers as $providerData) {
            $user = User::create($providerData['user']);

            ServiceProvider::create(array_merge($providerData['provider'], [
                'user_id' => $user->id,
            ]));
        }

        $this->command->info('Created 4 regular customers and 3 provider users');
    }
}
