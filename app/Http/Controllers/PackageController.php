<?php

namespace App\Http\Controllers;

use App\Models\ServicePackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display the specified package.
     */
    public function show($slug)
    {
        $package = ServicePackage::where('slug', $slug)
            ->with([
                'serviceProvider' => function ($query) {
                    $query->select('id', 'business_name', 'slug', 'description', 'location', 'city', 'logo', 'average_rating', 'total_reviews', 'verification_status');
                },
                'baseService',
                'items.service' => function ($query) {
                    $query->select('id', 'name', 'description', 'base_price', 'price_type', 'primary_image');
                }
            ])
            ->where('is_active', true)
            ->firstOrFail();

        // Get related packages from same provider
        $relatedPackages = ServicePackage::where('service_provider_id', $package->service_provider_id)
            ->where('id', '!=', $package->id)
            ->where('is_active', true)
            ->with(['baseService', 'items'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('display_order')
            ->take(3)
            ->get();

        // Get similar packages from other providers (same type)
        $similarPackages = ServicePackage::where('package_type', $package->package_type)
            ->where('service_provider_id', '!=', $package->service_provider_id)
            ->where('is_active', true)
            ->with(['serviceProvider', 'baseService', 'items'])
            ->inRandomOrder()
            ->take(4)
            ->get();

        return Inertia::render('PackageDetail', [
            'package' => $package,
            'relatedPackages' => $relatedPackages,
            'similarPackages' => $similarPackages,
        ]);
    }
}
