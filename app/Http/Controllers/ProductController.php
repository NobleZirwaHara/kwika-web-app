<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Catalogue;
use App\Models\ServiceProvider;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Get product categories (catalogues with type='product')
        $categories = Catalogue::product()
            ->active()
            ->withCount('products')
            ->orderBy('display_order')
            ->get()
            ->map(function ($catalogue) {
                return [
                    'id' => $catalogue->id,
                    'name' => $catalogue->name,
                    'slug' => $catalogue->slug,
                    'description' => $catalogue->description,
                    'image' => $catalogue->cover_image ? asset('storage/' . $catalogue->cover_image) : null,
                    'product_count' => $catalogue->products_count,
                ];
            });

        // Get featured products
        $featuredProducts = Product::with(['serviceProvider', 'catalogue'])
            ->active()
            ->featured()
            ->inStock()
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved');
            })
            ->latest()
            ->limit(12)
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
                    'image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
                    'is_on_sale' => $product->is_on_sale,
                    'in_stock' => $product->is_in_stock,
                    'category' => $product->catalogue->name ?? null,
                    'provider' => [
                        'id' => $product->serviceProvider->id,
                        'name' => $product->serviceProvider->business_name,
                        'slug' => $product->serviceProvider->slug,
                        'city' => $product->serviceProvider->city,
                    ],
                ];
            });

        // Get sale products
        $saleProducts = Product::with(['serviceProvider', 'catalogue'])
            ->active()
            ->inStock()
            ->whereNotNull('sale_price')
            ->where('sale_price', '>', 0)
            ->whereColumn('sale_price', '<', 'price')
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved');
            })
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
                    'sale_price' => (float) $product->sale_price,
                    'currency' => $product->currency,
                    'image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
                    'is_on_sale' => true,
                    'in_stock' => $product->is_in_stock,
                    'discount_percent' => round((($product->price - $product->sale_price) / $product->price) * 100),
                    'provider' => [
                        'id' => $product->serviceProvider->id,
                        'name' => $product->serviceProvider->business_name,
                        'slug' => $product->serviceProvider->slug,
                        'city' => $product->serviceProvider->city,
                    ],
                ];
            });

        // Get new arrivals
        $newArrivals = Product::with(['serviceProvider', 'catalogue'])
            ->active()
            ->inStock()
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved');
            })
            ->orderBy('created_at', 'desc')
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
                    'image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
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

        // Get top sellers (providers with most products)
        $topSellers = ServiceProvider::with(['user'])
            ->verified()
            ->active()
            ->has('products')
            ->withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image ? asset('storage/' . $provider->cover_image) : null,
                    'logo' => $provider->logo ? asset('storage/' . $provider->logo) : null,
                    'product_count' => $provider->products_count,
                ];
            });

        return Inertia::render('Products', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'saleProducts' => $saleProducts,
            'newArrivals' => $newArrivals,
            'topSellers' => $topSellers,
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::with(['serviceProvider', 'catalogue'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Get related products from same provider
        $relatedProducts = Product::with(['serviceProvider'])
            ->where('service_provider_id', $product->service_provider_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->inStock()
            ->limit(4)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'description' => $p->description,
                    'price' => $p->display_price,
                    'regular_price' => (float) $p->price,
                    'sale_price' => $p->sale_price ? (float) $p->sale_price : null,
                    'currency' => $p->currency,
                    'image' => $p->primary_image ? asset('storage/' . $p->primary_image) : null,
                    'is_on_sale' => $p->is_on_sale,
                ];
            });

        // Get similar products from same category
        $similarProducts = Product::with(['serviceProvider', 'catalogue'])
            ->where('catalogue_id', $product->catalogue_id)
            ->where('id', '!=', $product->id)
            ->where('service_provider_id', '!=', $product->service_provider_id)
            ->active()
            ->inStock()
            ->limit(6)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'price' => $p->display_price,
                    'regular_price' => (float) $p->price,
                    'sale_price' => $p->sale_price ? (float) $p->sale_price : null,
                    'currency' => $p->currency,
                    'image' => $p->primary_image ? asset('storage/' . $p->primary_image) : null,
                    'is_on_sale' => $p->is_on_sale,
                    'provider' => [
                        'name' => $p->serviceProvider->business_name,
                        'city' => $p->serviceProvider->city,
                    ],
                ];
            });

        return Inertia::render('ProductDetail', [
            'product' => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
                'display_price' => $product->display_price,
                'currency' => $product->currency,
                'sku' => $product->sku,
                'stock_quantity' => $product->stock_quantity,
                'track_inventory' => $product->track_inventory,
                'unit' => $product->unit,
                'weight' => $product->weight,
                'dimensions' => $product->dimensions,
                'specifications' => $product->specifications,
                'features' => $product->features,
                'primary_image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
                'gallery_images' => $product->gallery_images ? collect($product->gallery_images)->map(fn($img) => asset('storage/' . $img))->toArray() : [],
                'is_on_sale' => $product->is_on_sale,
                'is_in_stock' => $product->is_in_stock,
                'category' => $product->catalogue ? [
                    'id' => $product->catalogue->id,
                    'name' => $product->catalogue->name,
                    'slug' => $product->catalogue->slug,
                ] : null,
                'provider' => [
                    'id' => $product->serviceProvider->id,
                    'slug' => $product->serviceProvider->slug,
                    'business_name' => $product->serviceProvider->business_name,
                    'description' => $product->serviceProvider->description,
                    'city' => $product->serviceProvider->city,
                    'location' => $product->serviceProvider->location,
                    'phone' => $product->serviceProvider->phone,
                    'email' => $product->serviceProvider->email,
                    'rating' => (float) $product->serviceProvider->average_rating,
                    'total_reviews' => $product->serviceProvider->total_reviews,
                    'verification_status' => $product->serviceProvider->verification_status,
                    'logo' => $product->serviceProvider->logo ? asset('storage/' . $product->serviceProvider->logo) : null,
                ],
            ],
            'relatedProducts' => $relatedProducts,
            'similarProducts' => $similarProducts,
        ]);
    }
}
