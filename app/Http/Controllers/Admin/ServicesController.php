<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServicesController extends Controller
{
    /**
     * Display a listing of services
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $provider = $request->input('provider'); // provider_id
        $category = $request->input('category'); // category_id
        $status = $request->input('status', 'all'); // all, active, inactive
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Service::with(['serviceProvider', 'category', 'catalogue'])
            ->withCount(['bookings'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($category, function ($q) use ($category) {
                return $q->where('service_category_id', $category);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'active':
                        return $q->where('is_active', true);
                    case 'inactive':
                        return $q->where('is_active', false);
                }
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $services = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $servicesData = $services->through(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'description' => $service->description,
                'base_price' => $service->base_price,
                'max_price' => $service->max_price,
                'price_type' => $service->price_type,
                'currency' => $service->currency,
                'duration' => $service->duration,
                'max_attendees' => $service->max_attendees,
                'is_active' => $service->is_active,
                'requires_deposit' => $service->requires_deposit,
                'deposit_percentage' => $service->deposit_percentage,
                'cancellation_hours' => $service->cancellation_hours,
                'bookings_count' => $service->bookings_count,
                'created_at' => $service->created_at->format('M d, Y'),
                'service_provider' => [
                    'id' => $service->serviceProvider->id,
                    'business_name' => $service->serviceProvider->business_name,
                    'slug' => $service->serviceProvider->slug,
                ],
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ] : null,
                'catalogue' => $service->catalogue ? [
                    'id' => $service->catalogue->id,
                    'name' => $service->catalogue->name,
                ] : null,
            ];
        });

        // Get statistics
        $stats = [
            'total' => Service::count(),
            'active' => Service::where('is_active', true)->count(),
            'inactive' => Service::where('is_active', false)->count(),
            'total_bookings' => Service::withCount('bookings')->get()->sum('bookings_count'),
        ];

        // Get categories for filter
        $categories = ServiceCategory::active()
            ->select('id', 'name', 'slug')
            ->get();

        // Get providers for filter
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Services/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'services' => $servicesData,
            'stats' => $stats,
            'categories' => $categories,
            'providers' => $providers,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'category' => $category,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for editing a service
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit services.');
        }

        $service = Service::with(['serviceProvider', 'category', 'catalogue', 'media'])
            ->withCount(['bookings'])
            ->findOrFail($id);

        // Get categories for dropdown
        $categories = ServiceCategory::active()
            ->select('id', 'name', 'slug')
            ->get();

        return Inertia::render('Admin/Services/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'description' => $service->description,
                'base_price' => $service->base_price,
                'max_price' => $service->max_price,
                'price_type' => $service->price_type,
                'currency' => $service->currency,
                'duration' => $service->duration,
                'max_attendees' => $service->max_attendees,
                'inclusions' => $service->inclusions,
                'requirements' => $service->requirements,
                'is_active' => $service->is_active,
                'requires_deposit' => $service->requires_deposit,
                'deposit_percentage' => $service->deposit_percentage,
                'cancellation_hours' => $service->cancellation_hours,
                'service_category_id' => $service->service_category_id,
                'bookings_count' => $service->bookings_count,
                'created_at' => $service->created_at->format('M d, Y H:i'),
                'updated_at' => $service->updated_at->format('M d, Y H:i'),
                'service_provider' => [
                    'id' => $service->serviceProvider->id,
                    'business_name' => $service->serviceProvider->business_name,
                    'slug' => $service->serviceProvider->slug,
                ],
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                ] : null,
                'catalogue' => $service->catalogue ? [
                    'id' => $service->catalogue->id,
                    'name' => $service->catalogue->name,
                ] : null,
                'media' => $service->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->url,
                        'type' => $media->type,
                    ];
                }),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update a service
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit services.');
        }

        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'service_category_id' => 'required|exists:service_categories,id',
            'base_price' => 'required|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:base_price',
            'price_type' => 'required|in:fixed,hourly,daily,custom',
            'currency' => 'required|string|max:10',
            'duration' => 'nullable|integer|min:1',
            'max_attendees' => 'nullable|integer|min:1',
            'inclusions' => 'nullable|array',
            'requirements' => 'nullable|array',
            'requires_deposit' => 'boolean',
            'deposit_percentage' => 'nullable|numeric|min:0|max:100',
            'cancellation_hours' => 'nullable|integer|min:0',
        ]);

        $oldValues = $service->only([
            'name', 'description', 'service_category_id', 'base_price', 'max_price',
            'price_type', 'currency', 'duration', 'max_attendees', 'inclusions',
            'requirements', 'requires_deposit', 'deposit_percentage', 'cancellation_hours'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $service->name) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $service->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                Service::class,
                $service->id,
                $oldValues,
                $service->only(array_keys($oldValues)),
                'Service details updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.services.index')
                ->with('success', 'Service updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update service: ' . $e->getMessage());
        }
    }

    /**
     * Toggle service active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle service status.');
        }

        $service = Service::findOrFail($id);

        $oldValue = $service->is_active;
        $service->update(['is_active' => !$service->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $service->is_active ? 'activated' : 'deactivated',
            Service::class,
            $service->id,
            ['is_active' => $oldValue],
            ['is_active' => $service->is_active],
            $service->is_active ? 'Service activated' : 'Service deactivated'
        );

        return back()->with('success', 'Service status updated successfully.');
    }

    /**
     * Permanently delete a service
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete services.');
        }

        $service = Service::with('serviceProvider')->findOrFail($id);

        // Check if service has bookings
        $bookingsCount = $service->bookings()->count();
        if ($bookingsCount > 0) {
            return back()->with('error', "Cannot delete service with {$bookingsCount} existing bookings. Deactivate instead.");
        }

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Service::class,
                $service->id,
                [
                    'name' => $service->name,
                    'provider' => $service->serviceProvider->business_name,
                    'base_price' => $service->base_price,
                ],
                null,
                'Service permanently deleted'
            );

            // Delete related media
            $service->media()->delete();

            // Delete the service
            $service->delete();

            DB::commit();

            return redirect()->route('admin.services.index')
                ->with('success', 'Service deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete service: ' . $e->getMessage());
        }
    }
}
