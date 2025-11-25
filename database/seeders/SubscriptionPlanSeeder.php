<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Perfect for new service providers getting started',
                'price' => 15000.00, // MWK per month
                'billing_cycle' => 'monthly',
                'features' => [
                    'List up to 3 services',
                    'Upload up to 10 photos',
                    'Basic profile page',
                    'Email support',
                    'Customer reviews',
                ],
                'max_services' => 3,
                'max_images' => 10,
                'featured_listing' => false,
                'priority_support' => false,
                'analytics_access' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Standard',
                'slug' => 'standard',
                'description' => 'Great for growing businesses',
                'price' => 35000.00, // MWK per month
                'billing_cycle' => 'monthly',
                'features' => [
                    'List up to 10 services',
                    'Upload up to 30 photos',
                    'Enhanced profile with gallery',
                    'Priority email support',
                    'Customer reviews',
                    'Basic analytics',
                    'Social media links',
                ],
                'max_services' => 10,
                'max_images' => 30,
                'featured_listing' => false,
                'priority_support' => true,
                'analytics_access' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Featured',
                'slug' => 'featured',
                'description' => 'Best for established providers who want maximum visibility',
                'price' => 60000.00, // MWK per month
                'billing_cycle' => 'monthly',
                'features' => [
                    'Unlimited services',
                    'Unlimited photos',
                    'Premium profile with video',
                    'Featured placement on homepage',
                    'Priority support',
                    'Advanced analytics',
                    'Social media integration',
                    'Verified badge',
                    'Top search results',
                ],
                'max_services' => null, // unlimited
                'max_images' => null, // unlimited
                'featured_listing' => true,
                'priority_support' => true,
                'analytics_access' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            \App\Models\SubscriptionPlan::create($plan);
        }
    }
}
