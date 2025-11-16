<?php

namespace App\Http\Controllers;

use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
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

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('services', function ($q) use ($request) {
                $q->where('service_category_id', $request->category);
            });
        }

        // Filter by city/location
        if ($request->filled('city')) {
            $query->where(function ($q) use ($request) {
                $q->where('city', 'like', "%{$request->city}%")
                  ->orWhere('location', 'like', "%{$request->city}%");
            });
        }

        // Order by rating and reviews
        $providers = $query->orderBy('average_rating', 'desc')
            ->orderBy('total_reviews', 'desc')
            ->paginate(12)
            ->through(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'description' => substr($provider->description, 0, 150) . '...',
                    'location' => $provider->location,
                    'city' => $provider->city,
                    'rating' => (float) $provider->average_rating,
                    'reviews' => $provider->total_reviews,
                    'image' => $provider->cover_image,
                    'logo' => $provider->logo,
                    'featured' => $provider->is_featured,
                ];
            });

        $categories = ServiceCategory::active()->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
            ];
        });

        return Inertia::render('Search', [
            'providers' => $providers,
            'categories' => $categories,
            'searchParams' => [
                'query' => $request->filled('query') ? $request->query : null,
                'category' => $request->filled('category') ? (int) $request->category : null,
                'city' => $request->filled('city') ? $request->city : null,
            ],
            'totalResults' => $providers->total(),
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
