<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Product;
use App\Models\ServiceCategory;
use App\Models\ServiceProvider;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get parent categories with their subcategories
        $categories = ServiceCategory::with('children')
            ->parents()
            ->active()
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'icon' => $category->icon,
                    'subcategories' => $category->children->where('is_active', true)->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'name' => $child->name,
                        ];
                    })->values(),
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
                    'image' => $provider->cover_image ? Storage::url($provider->cover_image) : null,
                    'logo' => $provider->logo ? Storage::url($provider->logo) : null,
                    'description' => $provider->description,
                    'featured' => true,
                ];
            });

        // Get top-rated providers
        $topProviders = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->orderBy('average_rating', 'desc')
            ->orderBy('total_reviews', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image ? Storage::url($provider->cover_image) : null,
                    'logo' => $provider->logo ? Storage::url($provider->logo) : null,
                    'featured' => $provider->is_featured,
                ];
            });

        // Get providers in Lilongwe
        $lilongweProviders = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->where('city', 'Lilongwe')
            ->orderBy('average_rating', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image ? Storage::url($provider->cover_image) : null,
                    'logo' => $provider->logo ? Storage::url($provider->logo) : null,
                    'featured' => $provider->is_featured,
                ];
            });

        // Get new providers (recently joined)
        $newProviders = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image ? Storage::url($provider->cover_image) : null,
                    'logo' => $provider->logo ? Storage::url($provider->logo) : null,
                    'featured' => $provider->is_featured,
                ];
            });

        // Get featured products with their images (only from verified providers)
        $featuredProducts = Product::with(['serviceProvider', 'catalogue'])
            ->active()
            ->featured()
            ->inStock()
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved');
            })
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
                    'image' => $product->primary_image ? Storage::url($product->primary_image) : null,
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
            'lilongweProviders' => $lilongweProviders,
            'newProviders' => $newProviders,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
