<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Service;
use App\Models\Product;
use App\Models\ServiceCategory;
use App\Models\ServiceProvider;
use Inertia\Inertia;

class HomeController extends Controller
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
            // ->verified()
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
            // ->verified()
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

        // Get featured services with their images
        $featuredServices = Service::with(['serviceProvider', 'category'])
            ->active()
            ->whereNotNull('primary_image')
            ->latest()
            ->limit(8)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'description' => $service->description,
                    'price' => $service->getFormattedPrice(),
                    'base_price' => (float) $service->base_price,
                    'currency' => $service->currency,
                    'image' => $service->primary_image,
                    'category' => $service->category->name ?? null,
                    'provider' => [
                        'id' => $service->serviceProvider->id,
                        'name' => $service->serviceProvider->business_name,
                        'slug' => $service->serviceProvider->slug,
                        'city' => $service->serviceProvider->city,
                    ],
                ];
            });

        // Get featured products with their images
        $featuredProducts = Product::with(['serviceProvider', 'catalogue'])
            ->active()
            ->featured()
            ->inStock()
            ->whereNotNull('primary_image')
            ->latest()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'price' => $product->display_price,
                    'regular_price' => (float) $product->price,
                    'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
                    'currency' => $product->currency,
                    'image' => $product->primary_image,
                    'is_on_sale' => $product->is_on_sale,
                    'in_stock' => $product->is_in_stock,
                    'provider' => [
                        'id' => $product->serviceProvider->id,
                        'name' => $product->serviceProvider->business_name,
                        'slug' => $product->serviceProvider->slug,
                        'city' => $product->serviceProvider->city,
                    ],
                ];
            });

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProviders' => $featuredProviders,
            'topProviders' => $topProviders,
            'featuredServices' => $featuredServices,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
