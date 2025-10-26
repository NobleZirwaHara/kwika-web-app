<?php

namespace App\Http\Controllers;

use App\ServiceCategory;
use App\ServiceProvider;
use Inertia\Inertia;

class HomeController
{
    public function index()
    {
        // Get active service categories ordered by sort_order
        $categories = ServiceCategory::active()->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
            ];
        });

        // Get featured providers with their details
        $featuredProviders = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->featured()
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image,
                    'logo' => $provider->logo,
                    'description' => $provider->description,
                    'featured' => true,
                ];
            });

        // Get all top-rated providers (for the second section)
        $topProviders = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->orderBy('average_rating', 'desc')
            ->orderBy('total_reviews', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image,
                    'logo' => $provider->logo,
                    'featured' => $provider->is_featured,
                ];
            });

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProviders' => $featuredProviders,
            'topProviders' => $topProviders,
        ]);
    }
}
