<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServicePackageItem;
use App\Models\ServiceProvider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServicePackageSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get all active providers with services
        $providers = ServiceProvider::where('is_active', true)
            ->has('services')
            ->with('services')
            ->get();

        foreach ($providers as $provider) {
            // Create tier packages for each provider
            $this->createTierPackagesForProvider($provider);

            // Create bundle packages if provider has multiple services
            if ($provider->services->count() >= 2) {
                $this->createBundlePackagesForProvider($provider);
            }
        }
    }

    /**
     * Create tier packages for a specific provider
     */
    private function createTierPackagesForProvider(ServiceProvider $provider): void
    {
        // Get the first service for tier packages
        $primaryService = $provider->services->first();

        if (!$primaryService) return;

        $basePrice = (float) $primaryService->base_price;

        // Small Event Package
        $smallPackage = ServicePackage::create([
            'service_provider_id' => $provider->id,
            'name' => 'Starter Package - Small Events',
            'slug' => 'starter-package-' . Str::slug($provider->business_name) . '-' . Str::random(4),
            'description' => 'Perfect for intimate gatherings and small events. Our entry-level package with essential services.',
            'package_type' => 'tier',
            'base_service_id' => $primaryService->id,
            'base_price' => $basePrice * 1.5,
            'final_price' => $basePrice * 1.5,
            'currency' => 'MWK',
            'min_quantity' => 1,
            'max_quantity' => 1,
            'inclusions' => [
                'Basic service package',
                'Standard setup',
                'Professional team',
                'Up to 4 hours coverage',
                'Basic support'
            ],
            'is_active' => true,
            'is_featured' => false,
            'display_order' => 1,
        ]);

        ServicePackageItem::create([
            'service_package_id' => $smallPackage->id,
            'service_id' => $primaryService->id,
            'quantity' => 1,
            'unit_price' => $basePrice * 1.5,
            'subtotal' => $basePrice * 1.5,
            'is_optional' => false,
            'notes' => 'Starter package service',
            'display_order' => 1,
        ]);

        // Medium Event Package
        $mediumPackage = ServicePackage::create([
            'service_provider_id' => $provider->id,
            'name' => 'Premium Package - Medium Events',
            'slug' => 'premium-package-' . Str::slug($provider->business_name) . '-' . Str::random(4),
            'description' => 'Ideal for medium-sized weddings, corporate events, and celebrations. Our most popular package.',
            'package_type' => 'tier',
            'base_service_id' => $primaryService->id,
            'base_price' => $basePrice * 2.5,
            'final_price' => $basePrice * 2.5,
            'currency' => 'MWK',
            'min_quantity' => 1,
            'max_quantity' => 1,
            'inclusions' => [
                'Enhanced service package',
                'Premium setup',
                'Experienced professionals',
                'Up to 8 hours coverage',
                'Priority support',
                'Additional equipment',
                'Post-event consultation'
            ],
            'is_active' => true,
            'is_featured' => true,
            'display_order' => 2,
        ]);

        ServicePackageItem::create([
            'service_package_id' => $mediumPackage->id,
            'service_id' => $primaryService->id,
            'quantity' => 1,
            'unit_price' => $basePrice * 2.5,
            'subtotal' => $basePrice * 2.5,
            'is_optional' => false,
            'notes' => 'Premium package service',
            'display_order' => 1,
        ]);

        // Large Event Package
        $largePackage = ServicePackage::create([
            'service_provider_id' => $provider->id,
            'name' => 'Elite Package - Large Events',
            'slug' => 'elite-package-' . Str::slug($provider->business_name) . '-' . Str::random(4),
            'description' => 'Perfect for large weddings, conferences, and major celebrations. Our premium all-inclusive package.',
            'package_type' => 'tier',
            'base_service_id' => $primaryService->id,
            'base_price' => $basePrice * 4,
            'final_price' => $basePrice * 4,
            'currency' => 'MWK',
            'min_quantity' => 1,
            'max_quantity' => 1,
            'inclusions' => [
                'Complete service package',
                'Luxury setup',
                'Elite professional team',
                'Full day coverage (12+ hours)',
                'VIP support',
                'Premium equipment',
                'Dedicated event coordinator',
                'Pre and post-event services',
                'Backup team on standby'
            ],
            'is_active' => true,
            'is_featured' => true,
            'display_order' => 3,
        ]);

        ServicePackageItem::create([
            'service_package_id' => $largePackage->id,
            'service_id' => $primaryService->id,
            'quantity' => 1,
            'unit_price' => $basePrice * 4,
            'subtotal' => $basePrice * 4,
            'is_optional' => false,
            'notes' => 'Elite package service',
            'display_order' => 1,
        ]);
    }

    /**
     * Create bundle packages for a specific provider
     */
    private function createBundlePackagesForProvider(ServiceProvider $provider): void
    {
        $services = $provider->services;

        if ($services->count() < 2) return;

        // Essentials Bundle (2-3 services)
        $essentialsPackage = ServicePackage::create([
            'service_provider_id' => $provider->id,
            'name' => 'Essentials Bundle',
            'slug' => 'essentials-bundle-' . Str::slug($provider->business_name) . '-' . Str::random(4),
            'description' => 'Everything you need to get started. Our most popular package combining essential services.',
            'package_type' => 'bundle',
            'base_service_id' => null,
            'base_price' => 0,
            'final_price' => 0,
            'currency' => 'MWK',
            'min_quantity' => 1,
            'max_quantity' => 1,
            'inclusions' => [
                'Multiple services from trusted provider',
                'Professional team coordination',
                'Seamless service integration',
                '10% bundle discount',
                'Priority scheduling'
            ],
            'is_active' => true,
            'is_featured' => false,
            'display_order' => 4,
        ]);

        $totalPrice = 0;
        $itemOrder = 1;

        // Add 2-3 services to the bundle
        foreach ($services->take(min(3, $services->count())) as $service) {
            $unitPrice = (float) $service->base_price;
            $totalPrice += $unitPrice;

            ServicePackageItem::create([
                'service_package_id' => $essentialsPackage->id,
                'service_id' => $service->id,
                'quantity' => 1,
                'unit_price' => $unitPrice,
                'subtotal' => $unitPrice,
                'is_optional' => false,
                'notes' => "Included: {$service->name}",
                'display_order' => $itemOrder++,
            ]);
        }

        // Update final price with 10% discount
        $essentialsPackage->update([
            'base_price' => $totalPrice,
            'final_price' => $totalPrice * 0.9,
        ]);

        // Complete Package (all services)
        if ($services->count() >= 3) {
            $completePackage = ServicePackage::create([
                'service_provider_id' => $provider->id,
                'name' => 'Complete Package - All Services',
                'slug' => 'complete-package-' . Str::slug($provider->business_name) . '-' . Str::random(4),
                'description' => 'Our most comprehensive package with all services included. Perfect for those who want everything taken care of with maximum savings.',
                'package_type' => 'bundle',
                'base_service_id' => null,
                'base_price' => 0,
                'final_price' => 0,
                'currency' => 'MWK',
                'min_quantity' => 1,
                'max_quantity' => 1,
                'inclusions' => [
                    'All available services',
                    'Priority booking guarantee',
                    'Dedicated project manager',
                    'Premium 24/7 support',
                    '15% bundle discount',
                    'Flexible scheduling',
                    'VIP treatment'
                ],
                'is_active' => true,
                'is_featured' => true,
                'display_order' => 5,
            ]);

            $completeTotalPrice = 0;
            $completeItemOrder = 1;

            // Add all services
            foreach ($services as $service) {
                $unitPrice = (float) $service->base_price;
                $completeTotalPrice += $unitPrice;

                ServicePackageItem::create([
                    'service_package_id' => $completePackage->id,
                    'service_id' => $service->id,
                    'quantity' => 1,
                    'unit_price' => $unitPrice,
                    'subtotal' => $unitPrice,
                    'is_optional' => false,
                    'notes' => "Complete package: {$service->name}",
                    'display_order' => $completeItemOrder++,
                ]);
            }

            // Update with 15% discount
            $completePackage->update([
                'base_price' => $completeTotalPrice,
                'final_price' => $completeTotalPrice * 0.85,
            ]);
        }
    }
}
