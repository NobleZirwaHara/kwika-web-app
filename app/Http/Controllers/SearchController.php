<?php

namespace App\Http\Controllers;

use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Handle search requests from the hero search
     */
    public function search(Request $request)
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
            'listing_type' => 'nullable|in:providers,services',
        ]);

        $listingType = $request->get('listing_type', 'services');

        // Route to appropriate method based on listing type
        if ($listingType === 'services') {
            return $this->searchServices($request);
        }

        return $this->searchProviders($request);
    }

    /**
     * Search for service providers
     */
    private function searchProviders(Request $request)
    {
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
                // If it's a parent category, include all services from its subcategories
                if ($category->isParent()) {
                    $subcategoryIds = $category->children->pluck('id')->toArray();
                    $query->whereHas('services', function ($q) use ($subcategoryIds) {
                        $q->whereIn('service_category_id', $subcategoryIds);
                    });
                } else {
                    // If it's a subcategory, search for that specific category
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
                // Sort by minimum service price
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

        return $this->renderSearchResults($request, $providers, 'providers');
    }

    /**
     * Search for individual services
     */
    private function searchServices(Request $request)
    {
        $query = Service::with(['serviceProvider', 'category'])
            ->active()
            ->whereHas('serviceProvider', function ($q) {
                $q->verified()->active();
            });

        // Search by query (service name or description)
        if ($request->filled('query')) {
            $searchTerm = $request->query;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $categoryId = $request->category;
            $category = ServiceCategory::with('children')->find($categoryId);

            if ($category) {
                if ($category->isParent()) {
                    $subcategoryIds = $category->children->pluck('id')->toArray();
                    $query->whereIn('service_category_id', $subcategoryIds);
                } else {
                    $query->where('service_category_id', $categoryId);
                }
            }
        }

        // Filter by provider city/location
        if ($request->filled('city')) {
            $query->whereHas('serviceProvider', function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('city', 'like', "%{$request->city}%")
                          ->orWhere('location', 'like', "%{$request->city}%");
                });
            });
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        // Filter by service type (price_type)
        if ($request->filled('price_type')) {
            $query->where('price_type', $request->price_type);
        }

        // Filter by provider rating
        if ($request->filled('min_rating')) {
            $query->whereHas('serviceProvider', function ($q) use ($request) {
                $q->where('average_rating', '>=', $request->min_rating);
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
                $query->withCount('bookings')
                      ->orderBy('bookings_count', $sortOrder);
                break;
            case 'price':
                $query->orderBy('base_price', $sortOrder);
                break;
            case 'newest':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'rating':
            default:
                // Sort by provider rating
                $query->join('service_providers', 'services.service_provider_id', '=', 'service_providers.id')
                      ->orderBy('service_providers.average_rating', $sortOrder)
                      ->select('services.*');
                break;
        }

        // Paginate results
        $perPage = $request->get('per_page', 12);
        $services = $query->paginate($perPage)
            ->through(function ($service) {
                return [
                    'id' => $service->id,
                    'slug' => $service->slug,
                    'name' => $service->name,
                    'description' => substr($service->description ?? '', 0, 150) . '...',
                    'price' => (float) $service->base_price,
                    'formatted_price' => $service->getFormattedPrice(),
                    'price_type' => $service->price_type,
                    'currency' => $service->currency,
                    'duration' => $service->duration,
                    'image' => $service->primary_image,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                    ] : null,
                    'provider' => [
                        'id' => $service->serviceProvider->id,
                        'slug' => $service->serviceProvider->slug,
                        'name' => $service->serviceProvider->business_name,
                        'city' => $service->serviceProvider->city,
                        'rating' => (float) $service->serviceProvider->average_rating,
                        'reviews' => $service->serviceProvider->total_reviews,
                        'logo' => $service->serviceProvider->logo,
                        'latitude' => $service->serviceProvider->latitude,
                        'longitude' => $service->serviceProvider->longitude,
                    ],
                ];
            });

        return $this->renderSearchResults($request, $services, 'services');
    }

    /**
     * Render search results page with common data
     */
    private function renderSearchResults(Request $request, $results, $listingType)
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
            'listing_type' => $listingType,
        ];

        // Determine which page to render based on route
        $page = $request->route()->getName() === 'listings' ? 'Listings' : 'Search';

        return Inertia::render($page, [
            'results' => $results,
            'listingType' => $listingType,
            'categories' => $categories,
            'cities' => $cities,
            'searchParams' => $searchParams,
            'totalResults' => $results->total(),
        ]);
    }

    /**
     * Get search suggestions (for autocomplete)
     */
    public function suggestions(Request $request)
    {
        if (!$request->filled('q')) {
            return response()->json([]);
        }

        $query = $request->q;

        $providers = ServiceProvider::verified()
            ->active()
            ->where('business_name', 'like', "%{$query}%")
            ->orWhere('city', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'business_name as name', 'city', 'slug']);

        return response()->json($providers);
    }
}
