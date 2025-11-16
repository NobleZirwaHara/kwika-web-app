<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Please login to view your wishlist.');
        }

        $wishlists = Wishlist::with(['service.serviceProvider', 'service.category'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $services = $wishlists->map(function ($wishlist) {
            $service = $wishlist->service;
            return [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'description' => $service->description,
                'base_price' => $service->base_price,
                'max_price' => $service->max_price,
                'price_type' => $service->price_type,
                'currency' => $service->currency,
                'primary_image' => $service->primary_image,
                'added_at' => $wishlist->created_at->diffForHumans(),
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ] : null,
                'provider' => [
                    'id' => $service->serviceProvider->id,
                    'slug' => $service->serviceProvider->slug,
                    'business_name' => $service->serviceProvider->business_name,
                    'city' => $service->serviceProvider->city,
                    'rating' => $service->serviceProvider->rating,
                    'verification_status' => $service->serviceProvider->verification_status,
                ],
            ];
        });

        // Get all categories for the header
        $categories = \App\Models\ServiceCategory::active()
            ->select('id', 'name', 'slug', 'description', 'icon')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'services' => $services,
            'categories' => $categories,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
        ]);
    }

    /**
     * Add a service to the wishlist
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to add items to your wishlist.',
            ], 401);
        }

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        // Check if already in wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('service_id', $validated['service_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Service is already in your wishlist.',
            ], 400);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'service_id' => $validated['service_id'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service added to your wishlist!',
        ]);
    }

    /**
     * Remove a service from the wishlist
     */
    public function destroy($serviceId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to manage your wishlist.',
            ], 401);
        }

        $deleted = Wishlist::where('user_id', $user->id)
            ->where('service_id', $serviceId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found in your wishlist.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Service removed from your wishlist.',
        ]);
    }

    /**
     * Check if a service is in the user's wishlist
     */
    public function check($serviceId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'isWishlisted' => false,
            ]);
        }

        $isWishlisted = Wishlist::where('user_id', $user->id)
            ->where('service_id', $serviceId)
            ->exists();

        return response()->json([
            'isWishlisted' => $isWishlisted,
        ]);
    }

    /**
     * Get the user's wishlist service IDs
     */
    public function getWishlistIds()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'serviceIds' => [],
            ]);
        }

        $serviceIds = Wishlist::where('user_id', $user->id)
            ->pluck('service_id')
            ->toArray();

        return response()->json([
            'serviceIds' => $serviceIds,
        ]);
    }
}
