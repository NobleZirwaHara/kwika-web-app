<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of services (only from verified providers)
     */
    public function index()
    {
        $services = Service::with(['serviceProvider', 'category'])
            ->where('is_active', true)
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved')
                      ->where('is_active', true);
            })
            ->paginate(12);

        return Inertia::render('Services/Index', [
            'services' => $services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'slug' => $service->slug,
                    'name' => $service->name,
                    'description' => $service->description,
                    'base_price' => $service->base_price,
                    'max_price' => $service->max_price,
                    'price_type' => $service->price_type,
                    'currency' => $service->currency,
                    'duration' => $service->duration,
                    'primary_image' => $service->primary_image,
                    'category' => [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                        'slug' => $service->category->slug,
                    ],
                    'provider' => [
                        'id' => $service->serviceProvider->id,
                        'slug' => $service->serviceProvider->slug,
                        'business_name' => $service->serviceProvider->business_name,
                        'city' => $service->serviceProvider->city,
                        'rating' => $service->serviceProvider->rating ?? 0,
                        'verification_status' => $service->serviceProvider->verification_status,
                    ],
                ];
            }),
        ]);
    }

    /**
     * Display the specified service (only if provider is verified)
     */
    public function show($slug)
    {
        $service = Service::with([
            'serviceProvider',
            'category',
            'media'
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved')
                      ->where('is_active', true);
            })
            ->firstOrFail();

        // Get provider's other services
        $relatedServices = Service::where('service_provider_id', $service->service_provider_id)
            ->where('id', '!=', $service->id)
            ->where('is_active', true)
            ->limit(3)
            ->get()
            ->map(function ($relatedService) {
                return [
                    'id' => $relatedService->id,
                    'slug' => $relatedService->slug,
                    'name' => $relatedService->name,
                    'description' => $relatedService->description,
                    'base_price' => $relatedService->base_price,
                    'price_type' => $relatedService->price_type,
                    'currency' => $relatedService->currency,
                    'primary_image' => $relatedService->primary_image ? asset('storage/' . $relatedService->primary_image) : null,
                ];
            });

        // Get similar services from other providers in the same category (only verified providers)
        $similarServices = Service::with('serviceProvider')
            ->where('service_category_id', $service->service_category_id)
            ->where('service_provider_id', '!=', $service->service_provider_id)
            ->where('is_active', true)
            ->whereHas('serviceProvider', function ($query) {
                $query->where('verification_status', 'approved')
                      ->where('is_active', true);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function ($similarService) {
                return [
                    'id' => $similarService->id,
                    'slug' => $similarService->slug,
                    'name' => $similarService->name,
                    'description' => $similarService->description,
                    'base_price' => $similarService->base_price,
                    'price_type' => $similarService->price_type,
                    'currency' => $similarService->currency,
                    'primary_image' => $similarService->primary_image ? asset('storage/' . $similarService->primary_image) : null,
                    'provider' => [
                        'business_name' => $similarService->serviceProvider->business_name,
                        'city' => $similarService->serviceProvider->city,
                        'rating' => $similarService->serviceProvider->rating ?? 0,
                    ],
                ];
            });

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

        return Inertia::render('ServiceDetail', [
            'service' => [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'description' => $service->description,
                'base_price' => $service->base_price,
                'max_price' => $service->max_price,
                'price_type' => $service->price_type,
                'currency' => $service->currency,
                'duration' => $service->duration,
                'max_attendees' => $service->max_attendees,
                'inclusions' => $service->inclusions,
                'requirements' => $service->requirements,
                'primary_image' => $service->primary_image ? asset('storage/' . $service->primary_image) : null,
                'gallery_images' => collect($service->gallery_images ?? [])->map(function ($image) {
                    return asset('storage/' . $image);
                })->toArray(),
                'requires_deposit' => $service->requires_deposit,
                'deposit_percentage' => $service->deposit_percentage,
                'cancellation_hours' => $service->cancellation_hours,
                'category' => [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ],
                'provider' => [
                    'id' => $service->serviceProvider->id,
                    'slug' => $service->serviceProvider->slug,
                    'business_name' => $service->serviceProvider->business_name,
                    'description' => $service->serviceProvider->description,
                    'city' => $service->serviceProvider->city,
                    'location' => $service->serviceProvider->location,
                    'phone' => $service->serviceProvider->phone,
                    'email' => $service->serviceProvider->email,
                    'rating' => $service->serviceProvider->rating ?? 0,
                    'total_reviews' => $service->serviceProvider->reviews_count ?? 0,
                    'verification_status' => $service->serviceProvider->verification_status,
                    'is_featured' => $service->serviceProvider->is_featured,
                    'logo' => $service->serviceProvider->logo ? asset('storage/' . $service->serviceProvider->logo) : null,
                ],
            ],
            'relatedServices' => $relatedServices,
            'similarServices' => $similarServices,
            'categories' => $categories,
        ]);
    }
}
