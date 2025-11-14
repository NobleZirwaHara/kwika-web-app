<?php

namespace App\Http\Controllers;

use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Display a listing of providers with optional filtering
     */
    public function index(Request $request)
    {
        $query = ServiceProvider::with(['user'])
            // ->verified()
            ->active();

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('services', function ($q) use ($request) {
                $q->where('service_category_id', $request->category);
            });
        }

        // Filter by city
        if ($request->has('city') && $request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('business_name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'rating');
        if ($sortBy === 'rating') {
            $query->orderBy('average_rating', 'desc')
                  ->orderBy('total_reviews', 'desc');
        } elseif ($sortBy === 'reviews') {
            $query->orderBy('total_reviews', 'desc');
        } elseif ($sortBy === 'name') {
            $query->orderBy('business_name', 'asc');
        }

        $providers = $query->paginate(12)->through(function ($provider) {
            return [
                'id' => $provider->id,
                'slug' => $provider->slug,
                'name' => $provider->business_name,
                'description' => $provider->description,
                'location' => $provider->location,
                'city' => $provider->city,
                'rating' => (float) $provider->average_rating,
                'reviews' => $provider->total_reviews,
                'image' => $provider->cover_image,
                'logo' => $provider->logo,
                'featured' => $provider->is_featured,
            ];
        });

        $categories = ServiceCategory::active()->get();

        return Inertia::render('Providers/Index', [
            'providers' => $providers,
            'categories' => $categories,
            'filters' => $request->only(['category', 'city', 'search', 'sort']),
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
                    'image' => $similar->cover_image,
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
                'coverImage' => $provider->cover_image,
                'logo' => $provider->logo,
                'isVerified' => $provider->is_verified,
                'isFeatured' => $provider->is_featured,
                'images' => $portfolioImages,
            ],
            'services' => $services,
            'reviews' => $reviews,
            'similarProviders' => $similarProviders,
            'categories' => $categories,
        ]);
    }
}
