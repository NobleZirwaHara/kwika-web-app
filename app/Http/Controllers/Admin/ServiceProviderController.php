<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceProviderController extends Controller
{
    /**
     * Display a listing of service providers
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $status = $request->input('status', 'all'); // all, active, inactive, verified, unverified, featured
        $city = $request->input('city');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = ServiceProvider::with(['user', 'services'])
            ->withCount(['bookings', 'reviews', 'services'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('business_name', 'like', "%{$search}%")
                        ->orWhere('business_registration_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'active':
                        return $q->where('is_active', true);
                    case 'inactive':
                        return $q->where('is_active', false);
                    case 'verified':
                        return $q->where('is_verified', true);
                    case 'unverified':
                        return $q->where('is_verified', false);
                    case 'featured':
                        return $q->where('is_featured', true);
                }
            })
            ->when($city, function ($q) use ($city) {
                return $q->where('city', $city);
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $providers = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $providersData = $providers->through(function ($provider) {
            return [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'slug' => $provider->slug,
                'city' => $provider->city,
                'location' => $provider->location,
                'email' => $provider->email,
                'phone' => $provider->phone,
                'is_verified' => $provider->is_verified,
                'is_featured' => $provider->is_featured,
                'is_active' => $provider->is_active,
                'verification_status' => $provider->verification_status,
                'average_rating' => $provider->average_rating,
                'total_reviews' => $provider->total_reviews,
                'total_bookings' => $provider->total_bookings,
                'created_at' => $provider->created_at->format('M d, Y'),
                'verified_at' => $provider->verified_at?->format('M d, Y'),
                'user' => [
                    'id' => $provider->user->id,
                    'name' => $provider->user->name,
                    'email' => $provider->user->email,
                ],
                'bookings_count' => $provider->bookings_count,
                'reviews_count' => $provider->reviews_count,
                'services_count' => $provider->services_count,
            ];
        });

        // Get statistics
        $stats = [
            'total' => ServiceProvider::count(),
            'active' => ServiceProvider::where('is_active', true)->count(),
            'inactive' => ServiceProvider::where('is_active', false)->count(),
            'verified' => ServiceProvider::where('is_verified', true)->count(),
            'featured' => ServiceProvider::where('is_featured', true)->count(),
        ];

        // Get unique cities for filter
        $cities = ServiceProvider::select('city')
            ->distinct()
            ->whereNotNull('city')
            ->orderBy('city')
            ->pluck('city');

        return Inertia::render('Admin/ServiceProviders/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'providers' => $providersData,
            'stats' => $stats,
            'cities' => $cities,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'city' => $city,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for editing a provider
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_providers')) {
            return back()->with('error', 'You do not have permission to edit providers.');
        }

        $provider = ServiceProvider::with([
            'user',
            'services.category',
            'companies',
            'currentSubscription.plan',
        ])->findOrFail($id);

        // Get all service categories for the form
        $categories = ServiceCategory::orderBy('name')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ];
        });

        return Inertia::render('Admin/ServiceProviders/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'slug' => $provider->slug,
                'description' => $provider->description,
                'business_registration_number' => $provider->business_registration_number,
                'location' => $provider->location,
                'city' => $provider->city,
                'phone' => $provider->phone,
                'email' => $provider->email,
                'website' => $provider->website,
                'social_links' => $provider->social_links,
                'is_verified' => $provider->is_verified,
                'is_featured' => $provider->is_featured,
                'is_active' => $provider->is_active,
                'verification_status' => $provider->verification_status,
                'average_rating' => $provider->average_rating,
                'total_reviews' => $provider->total_reviews,
                'total_bookings' => $provider->total_bookings,
                'created_at' => $provider->created_at->format('M d, Y H:i'),
                'verified_at' => $provider->verified_at?->format('M d, Y H:i'),
                'user' => [
                    'id' => $provider->user->id,
                    'name' => $provider->user->name,
                    'email' => $provider->user->email,
                    'phone' => $provider->user->phone,
                ],
                'current_subscription' => $provider->currentSubscription ? [
                    'id' => $provider->currentSubscription->id,
                    'plan' => [
                        'name' => $provider->currentSubscription->plan->name,
                        'price' => $provider->currentSubscription->plan->price,
                    ],
                    'start_date' => $provider->currentSubscription->start_date->format('M d, Y'),
                    'end_date' => $provider->currentSubscription->end_date->format('M d, Y'),
                    'status' => $provider->currentSubscription->status,
                ] : null,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified provider
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_providers')) {
            return back()->with('error', 'You do not have permission to edit providers.');
        }

        $provider = ServiceProvider::findOrFail($id);

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_registration_number' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
        ]);

        $oldValues = $provider->only(array_keys($validated));

        DB::beginTransaction();
        try {
            // Generate new slug if business name changed
            if ($validated['business_name'] !== $provider->business_name) {
                $validated['slug'] = Str::slug($validated['business_name']);

                // Ensure unique slug
                $baseSlug = $validated['slug'];
                $counter = 1;
                while (ServiceProvider::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                    $validated['slug'] = $baseSlug . '-' . $counter;
                    $counter++;
                }
            }

            $provider->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                ServiceProvider::class,
                $provider->id,
                $oldValues,
                $validated,
                'Updated provider information'
            );

            DB::commit();

            return back()->with('success', 'Provider updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update provider: ' . $e->getMessage());
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_providers')) {
            return back()->with('error', 'You do not have permission to manage provider status.');
        }

        $provider = ServiceProvider::findOrFail($id);

        $oldValue = $provider->is_active;
        $provider->update(['is_active' => !$provider->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $provider->is_active ? 'activated' : 'deactivated',
            ServiceProvider::class,
            $provider->id,
            ['is_active' => $oldValue],
            ['is_active' => $provider->is_active],
            $provider->is_active ? 'Provider activated' : 'Provider deactivated'
        );

        return back()->with('success', 'Provider status updated successfully.');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_providers')) {
            return back()->with('error', 'You do not have permission to feature providers.');
        }

        $provider = ServiceProvider::findOrFail($id);

        $oldValue = $provider->is_featured;
        $provider->update(['is_featured' => !$provider->is_featured]);

        // Log admin action
        $admin->logAdminAction(
            $provider->is_featured ? 'featured' : 'unfeatured',
            ServiceProvider::class,
            $provider->id,
            ['is_featured' => $oldValue],
            ['is_featured' => $provider->is_featured],
            $provider->is_featured ? 'Provider featured' : 'Provider unfeatured'
        );

        return back()->with('success', 'Featured status updated successfully.');
    }

    /**
     * Ban a provider (soft delete)
     */
    public function ban(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('ban_providers')) {
            return back()->with('error', 'You do not have permission to ban providers.');
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $provider = ServiceProvider::findOrFail($id);

        DB::beginTransaction();
        try {
            // Deactivate the provider
            $provider->update([
                'is_active' => false,
                'rejection_reason' => 'Banned: ' . $request->input('reason'),
            ]);

            // Soft delete
            $provider->delete();

            // Log admin action
            $admin->logAdminAction(
                'banned',
                ServiceProvider::class,
                $provider->id,
                ['is_active' => true, 'deleted_at' => null],
                ['is_active' => false, 'deleted_at' => now()],
                'Provider banned: ' . $request->input('reason')
            );

            DB::commit();

            return redirect()->route('admin.service-providers.index')
                ->with('success', 'Provider banned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to ban provider: ' . $e->getMessage());
        }
    }

    /**
     * Unban a provider (restore soft delete)
     */
    public function unban($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('ban_providers')) {
            return back()->with('error', 'You do not have permission to unban providers.');
        }

        $provider = ServiceProvider::withTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            // Restore the provider
            $provider->restore();

            // Reactivate
            $provider->update([
                'is_active' => true,
                'rejection_reason' => null,
            ]);

            // Log admin action
            $admin->logAdminAction(
                'unbanned',
                ServiceProvider::class,
                $provider->id,
                ['is_active' => false, 'deleted_at' => $provider->deleted_at],
                ['is_active' => true, 'deleted_at' => null],
                'Provider unbanned and restored'
            );

            DB::commit();

            return back()->with('success', 'Provider unbanned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to unban provider: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a provider
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can permanently delete providers.');
        }

        $provider = ServiceProvider::withTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'permanently_deleted',
                ServiceProvider::class,
                $provider->id,
                [
                    'business_name' => $provider->business_name,
                    'email' => $provider->email,
                ],
                null,
                'Provider permanently deleted from system'
            );

            // Permanently delete
            $provider->forceDelete();

            DB::commit();

            return redirect()->route('admin.service-providers.index')
                ->with('success', 'Provider permanently deleted.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete provider: ' . $e->getMessage());
        }
    }
}
