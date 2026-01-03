<?php

namespace App\Http\Controllers;

use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Display a listing of providers with optional filtering
     */
    public function index(Request $request)
    {
        $request->validate([
            'query' => 'nullable|string|max:255',
            'category' => 'nullable|exists:service_categories,id',
            'city' => 'nullable|string|max:255',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'min_rating' => 'nullable|numeric|min:0|max:5',
            'price_type' => 'nullable|in:fixed,hourly,daily,custom',
            'available_date' => 'nullable|date',
            'sort_by' => 'nullable|in:rating,reviews,price,newest',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|in:12,24,48',
        ]);

        $query = ServiceProvider::with(['user', 'services'])
            ->verified()
            ->active();

        // Search by query (business name or description)
        if ($request->filled('query')) {
            $searchTerm = $request->query;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('business_name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('location', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by category (supports hierarchical filtering)
        if ($request->filled('category')) {
            $categoryId = $request->category;
            $category = ServiceCategory::with('children')->find($categoryId);

            if ($category) {
                if ($category->isParent()) {
                    $subcategoryIds = $category->children->pluck('id')->toArray();
                    $query->whereHas('services', function ($q) use ($subcategoryIds) {
                        $q->whereIn('service_category_id', $subcategoryIds);
                    });
                } else {
                    $query->whereHas('services', function ($q) use ($categoryId) {
                        $q->where('service_category_id', $categoryId);
                    });
                }
            }
        }

        // Filter by city/location
        if ($request->filled('city')) {
            $query->where(function ($q) use ($request) {
                $q->where('city', 'like', "%{$request->city}%")
                  ->orWhere('location', 'like', "%{$request->city}%");
            });
        }

        // Filter by price range
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->whereHas('services', function ($q) use ($request) {
                if ($request->filled('min_price')) {
                    $q->where('base_price', '>=', $request->min_price);
                }
                if ($request->filled('max_price')) {
                    $q->where('base_price', '<=', $request->max_price);
                }
            });
        }

        // Filter by minimum rating
        if ($request->filled('min_rating')) {
            $query->where('average_rating', '>=', $request->min_rating);
        }

        // Filter by service type (price_type)
        if ($request->filled('price_type')) {
            $query->whereHas('services', function ($q) use ($request) {
                $q->where('price_type', $request->price_type);
            });
        }

        // Filter by availability date
        if ($request->filled('available_date')) {
            $query->whereHas('availability', function ($q) use ($request) {
                $q->whereDate('available_from', '<=', $request->available_date)
                  ->whereDate('available_to', '>=', $request->available_date)
                  ->where('is_available', true);
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'rating');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'reviews':
                $query->orderBy('total_reviews', $sortOrder);
                break;
            case 'price':
                $query->withMin('services', 'base_price')
                      ->orderBy('services_min_base_price', $sortOrder);
                break;
            case 'newest':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'rating':
            default:
                $query->orderBy('average_rating', $sortOrder)
                      ->orderBy('total_reviews', 'desc');
                break;
        }

        // Paginate results
        $perPage = $request->get('per_page', 12);
        $providers = $query->paginate($perPage)
            ->through(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'description' => substr($provider->description ?? '', 0, 150) . '...',
                    'location' => $provider->location,
                    'city' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image,
                    'logo' => $provider->logo,
                    'featured' => $provider->is_featured,
                    'min_price' => $provider->services->where('is_active', true)->min('base_price'),
                    'latitude' => $provider->latitude,
                    'longitude' => $provider->longitude,
                ];
            });

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

        // Get unique cities from service providers
        $cities = ServiceProvider::verified()
            ->active()
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city')
            ->sort()
            ->values();

        // Build search params object
        $searchParams = [
            'query' => $request->filled('query') ? $request->query : null,
            'category' => $request->filled('category') ? (int) $request->category : null,
            'city' => $request->filled('city') ? $request->city : null,
            'min_price' => $request->filled('min_price') ? (float) $request->min_price : null,
            'max_price' => $request->filled('max_price') ? (float) $request->max_price : null,
            'min_rating' => $request->filled('min_rating') ? (float) $request->min_rating : null,
            'price_type' => $request->filled('price_type') ? $request->price_type : null,
            'available_date' => $request->filled('available_date') ? $request->available_date : null,
            'sort_by' => $request->get('sort_by', 'rating'),
            'sort_order' => $request->get('sort_order', 'desc'),
            'per_page' => $request->get('per_page', 12),
            'listing_type' => 'providers',
        ];

        return Inertia::render('Providers/Index', [
            'results' => $providers,
            'listingType' => 'providers',
            'categories' => $categories,
            'cities' => $cities,
            'searchParams' => $searchParams,
            'totalResults' => $providers->total(),
        ]);
    }

    /**
     * Display the specified provider
     */
    public function show($slug)
    {
        $provider = ServiceProvider::with(['user', 'services.category', 'reviews.user', 'portfolioImages'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Get provider's services grouped by category
        $services = $provider->services()
            ->with('category')
            ->active()
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'slug' => $service->slug,
                    'name' => $service->name,
                    'description' => $service->description,
                    'category' => $service->category->name,
                    'price' => $service->getFormattedPrice(),
                    'basePrice' => (float) $service->base_price,
                    'priceType' => $service->price_type,
                    'duration' => $service->duration,
                    'inclusions' => $service->inclusions,
                ];
            });

        // Get provider reviews
        $reviews = $provider->reviews()
            ->with('user')
            ->approved()
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'userName' => $review->user->name,
                    'createdAt' => $review->created_at->format('M d, Y'),
                    'isVerified' => $review->is_verified,
                ];
            });

        // Get similar providers in the same city
        $similarProviders = ServiceProvider::verified()
            ->active()
            ->where('id', '!=', $provider->id)
            ->where('city', $provider->city)
            ->orderBy('average_rating', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($similar) {
                return [
                    'id' => $similar->id,
                    'slug' => $similar->slug,
                    'name' => $similar->business_name,
                    'location' => $similar->city,
                    'rating' => (float) $similar->average_rating,
                    'reviews' => $similar->total_reviews,
                    'image' => $similar->cover_image ? asset('storage/' . $similar->cover_image) : null,
                ];
            });

        // Get portfolio images with fallback to cover image
        $portfolioImages = $provider->portfolioImages->map(function ($media) {
            return $media->url;
        })->toArray();

        // If no portfolio images, use cover image and logo as fallbacks
        if (empty($portfolioImages)) {
            $fallbackImages = [];
            if ($provider->cover_image) {
                $fallbackImages[] = asset('storage/' . $provider->cover_image);
            }
            if ($provider->logo) {
                $fallbackImages[] = asset('storage/' . $provider->logo);
            }
            $portfolioImages = $fallbackImages;
        }

        // Get all categories for search dropdown
        $categories = ServiceCategory::active()->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
            ];
        });

        // Get provider's service packages
        $packages = ServicePackage::where('service_provider_id', $provider->id)
            ->where('is_active', true)
            ->with(['items.service'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('display_order')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'slug' => $package->slug,
                    'name' => $package->name,
                    'description' => $package->description,
                    'package_type' => $package->package_type,
                    'final_price' => $package->final_price,
                    'currency' => $package->currency,
                    'is_featured' => $package->is_featured,
                    'primary_image' => $package->primary_image ? asset('storage/' . $package->primary_image) : null,
                    'items' => $package->items->map(function ($item) {
                        return [
                            'quantity' => $item->quantity,
                            'service_name' => $item->service->name,
                        ];
                    }),
                ];
            });

        return Inertia::render('ProviderDetail', [
            'provider' => [
                'id' => $provider->id,
                'slug' => $provider->slug,
                'name' => $provider->business_name,
                'description' => $provider->description,
                'location' => $provider->location,
                'city' => $provider->city,
                'phone' => $provider->phone,
                'email' => $provider->email,
                'website' => $provider->website,
                'rating' => (float) $provider->average_rating,
                'totalReviews' => $provider->total_reviews,
                'totalBookings' => $provider->total_bookings,
                'coverImage' => $provider->cover_image ? asset('storage/' . $provider->cover_image) : null,
                'logo' => $provider->logo ? asset('storage/' . $provider->logo) : null,
                'verificationStatus' => $provider->verification_status,
                'isFeatured' => $provider->is_featured,
                'images' => $portfolioImages,
            ],
            'services' => $services,
            'packages' => $packages,
            'reviews' => $reviews,
            'similarProviders' => $similarProviders,
            'categories' => $categories,
        ]);
    }
}
