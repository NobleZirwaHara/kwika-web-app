<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\Catalogue;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ListingsController extends Controller
{
    /**
     * Display combined services and products listing
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('home')->withErrors(['error' => 'Provider profile not found']);
        }

        // Fetch services with categories
        $services = $provider->services()
            ->with('category')
            ->withCount('bookings')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'description' => $service->description,
                    'base_price' => $service->base_price,
                    'price_type' => $service->price_type,
                    'max_price' => $service->max_price,
                    'currency' => $service->currency,
                    'duration' => $service->duration,
                    'max_attendees' => $service->max_attendees,
                    'category_name' => $service->category->name,
                    'is_active' => $service->is_active,
                    'bookings_count' => $service->bookings_count,
                    'primary_image' => $service->primary_image ? asset('storage/' . $service->primary_image) : null,
                    'gallery_images' => $service->gallery_images ? collect($service->gallery_images)->map(function ($image) {
                        return asset('storage/' . $image);
                    })->toArray() : [],
                ];
            });

        // Fetch products with catalogues
        $products = $provider->products()
            ->with('catalogue')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'currency' => $product->currency,
                    'stock_quantity' => $product->stock_quantity,
                    'track_inventory' => $product->track_inventory,
                    'unit' => $product->unit,
                    'specifications' => $product->specifications ?? [],
                    'features' => $product->features ?? [],
                    'primary_image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
                    'gallery_images' => $product->gallery_images ? collect($product->gallery_images)->map(function ($image) {
                        return asset('storage/' . $image);
                    })->toArray() : [],
                    'is_active' => $product->is_active,
                    'is_featured' => $product->is_featured,
                    'catalogue_name' => $product->catalogue ? $product->catalogue->name : null,
                ];
            });

        // Get parent categories with their subcategories for hierarchical selection
        $categories = ServiceCategory::with('children')
            ->parents()
            ->active()
            ->get(['id', 'name'])
            ->map(function ($parent) {
                return [
                    'id' => $parent->id,
                    'name' => $parent->name,
                    'subcategories' => $parent->children->where('is_active', true)->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'name' => $child->name,
                        ];
                    })->values(),
                ];
            });

        // Get catalogues for product creation (only product catalogues from provider's companies)
        $companyIds = $provider->companies()->pluck('id');
        $catalogues = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->get(['id', 'name'])
            ->map(function ($catalogue) {
                return [
                    'id' => $catalogue->id,
                    'name' => $catalogue->name,
                ];
            });

        return Inertia::render('Provider/Listings', [
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'logo' => $provider->logo,
                'verification_status' => $provider->verification_status,
            ],
            'services' => $services,
            'products' => $products,
            'categories' => $categories,
            'catalogues' => $catalogues,
        ]);
    }
}
