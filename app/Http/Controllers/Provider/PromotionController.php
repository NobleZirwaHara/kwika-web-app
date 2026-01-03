<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\PromotionRequest;
use App\Models\Promotion;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PromotionController extends Controller
{
    /**
     * Display a listing of promotions with filtering
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $query = Promotion::where('service_provider_id', $provider->id);

        // Filter by status
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'active':
                    $query->active();
                    break;
                case 'expired':
                    $query->expired();
                    break;
                case 'upcoming':
                    $query->upcoming();
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
            }
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        // Search by title or code
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $promotions = $query->latest()
            ->get()
            ->map(function ($promotion) {
                return [
                    'id' => $promotion->id,
                    'title' => $promotion->title,
                    'description' => $promotion->description,
                    'code' => $promotion->code,
                    'type' => $promotion->type,
                    'discount_value' => $promotion->discount_value,
                    'discount_display' => $promotion->discount_display,
                    'applicable_to' => $promotion->applicable_to,
                    'start_date' => $promotion->start_date->format('M d, Y'),
                    'end_date' => $promotion->end_date->format('M d, Y'),
                    'usage_count' => $promotion->usage_count,
                    'usage_limit' => $promotion->usage_limit,
                    'remaining_uses' => $promotion->remaining_uses,
                    'status' => $promotion->status,
                    'is_active' => $promotion->is_active,
                    'banner_image' => $promotion->banner_image ? Storage::url($promotion->banner_image) : null,
                    'created_at' => $promotion->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Provider/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => [
                'status' => $request->status,
                'type' => $request->type,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new promotion
     */
    public function create()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Get services for selection
        $services = $provider->services()
            ->active()
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category ? $service->category->name : null,
                ];
            });

        // Get categories
        $categories = ServiceCategory::all()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        return Inertia::render('Provider/Promotions/Create', [
            'services' => $services,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created promotion
     */
    public function store(PromotionRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $data = $request->validated();
        $data['service_provider_id'] = $provider->id;
        $data['usage_count'] = 0;

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $filename = 'promotions/banners/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['banner_image'] = $file->storeAs('', $filename, 'public');
        }

        $promotion = Promotion::create($data);

        return redirect()->route('provider.promotions.index')
            ->with('success', 'Promotion created successfully');
    }

    /**
     * Show the form for editing the specified promotion
     */
    public function edit($id)
    {
        $provider = Auth::user()->serviceProvider;

        $promotion = Promotion::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Get services for selection
        $services = $provider->services()
            ->active()
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category ? $service->category->name : null,
                ];
            });

        // Get categories
        $categories = ServiceCategory::all()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        return Inertia::render('Provider/Promotions/Edit', [
            'promotion' => [
                'id' => $promotion->id,
                'title' => $promotion->title,
                'description' => $promotion->description,
                'code' => $promotion->code,
                'type' => $promotion->type,
                'discount_value' => $promotion->discount_value,
                'min_booking_amount' => $promotion->min_booking_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'applicable_to' => $promotion->applicable_to,
                'service_ids' => $promotion->service_ids ?? [],
                'category_ids' => $promotion->category_ids ?? [],
                'start_date' => $promotion->start_date->format('Y-m-d'),
                'end_date' => $promotion->end_date->format('Y-m-d'),
                'usage_limit' => $promotion->usage_limit,
                'per_customer_limit' => $promotion->per_customer_limit,
                'is_active' => $promotion->is_active,
                'priority' => $promotion->priority,
                'terms_conditions' => $promotion->terms_conditions,
                'banner_image' => $promotion->banner_image ? Storage::url($promotion->banner_image) : null,
            ],
            'services' => $services,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified promotion
     */
    public function update(PromotionRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $promotion = Promotion::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $data = $request->validated();

        // Handle banner image upload and remove old one
        if ($request->hasFile('banner_image')) {
            if ($promotion->banner_image) {
                Storage::disk('public')->delete($promotion->banner_image);
            }
            $file = $request->file('banner_image');
            $filename = 'promotions/banners/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['banner_image'] = $file->storeAs('', $filename, 'public');
        }

        // Don't update usage_count through form
        unset($data['usage_count']);

        $promotion->update($data);

        return redirect()->route('provider.promotions.index')
            ->with('success', 'Promotion updated successfully');
    }

    /**
     * Remove the specified promotion
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $promotion = Promotion::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Delete associated banner image
        if ($promotion->banner_image) {
            Storage::disk('public')->delete($promotion->banner_image);
        }

        $promotion->delete();

        return redirect()->route('provider.promotions.index')
            ->with('success', 'Promotion deleted successfully');
    }

    /**
     * Toggle promotion active status
     */
    public function toggle($id)
    {
        $provider = Auth::user()->serviceProvider;

        $promotion = Promotion::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $promotion->update(['is_active' => !$promotion->is_active]);

        return back()->with('success', 'Promotion status updated');
    }
}
