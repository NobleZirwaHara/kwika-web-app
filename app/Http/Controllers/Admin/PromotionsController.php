<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PromotionsController extends Controller
{
    /**
     * Display a listing of promotions
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
        $type = $request->input('type'); // percentage, fixed_amount
        $status = $request->input('status', 'all'); // all, active, upcoming, expired, inactive
        $applicable_to = $request->input('applicable_to');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Promotion::with(['serviceProvider'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($type, function ($q) use ($type) {
                return $q->where('type', $type);
            })
            ->when($applicable_to, function ($q) use ($applicable_to) {
                return $q->where('applicable_to', $applicable_to);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'active':
                        return $q->active();
                    case 'upcoming':
                        return $q->upcoming();
                    case 'expired':
                        return $q->expired();
                    case 'inactive':
                        return $q->where('is_active', false);
                }
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $promotions = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $promotionsData = $promotions->through(function ($promotion) {
            return [
                'id' => $promotion->id,
                'title' => $promotion->title,
                'description' => $promotion->description,
                'code' => $promotion->code,
                'type' => $promotion->type,
                'discount_value' => $promotion->discount_value,
                'discount_display' => $promotion->discount_display,
                'min_booking_amount' => $promotion->min_booking_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'applicable_to' => $promotion->applicable_to,
                'start_date' => $promotion->start_date->format('Y-m-d'),
                'end_date' => $promotion->end_date->format('Y-m-d'),
                'start_date_formatted' => $promotion->start_date->format('M d, Y'),
                'end_date_formatted' => $promotion->end_date->format('M d, Y'),
                'usage_limit' => $promotion->usage_limit,
                'usage_count' => $promotion->usage_count,
                'remaining_uses' => $promotion->remaining_uses,
                'per_customer_limit' => $promotion->per_customer_limit,
                'is_active' => $promotion->is_active,
                'is_expired' => $promotion->is_expired,
                'is_upcoming' => $promotion->is_upcoming,
                'is_exhausted' => $promotion->is_exhausted,
                'status' => $promotion->status,
                'priority' => $promotion->priority,
                'banner_image' => $promotion->banner_image,
                'created_at' => $promotion->created_at->format('M d, Y'),
                'service_provider' => [
                    'id' => $promotion->serviceProvider->id,
                    'business_name' => $promotion->serviceProvider->business_name,
                    'slug' => $promotion->serviceProvider->slug,
                ],
            ];
        });

        // Get statistics
        $stats = [
            'total' => Promotion::count(),
            'active' => Promotion::active()->count(),
            'upcoming' => Promotion::upcoming()->count(),
            'expired' => Promotion::expired()->count(),
            'inactive' => Promotion::where('is_active', false)->count(),
            'total_uses' => Promotion::sum('usage_count'),
        ];

        // Get unique types and applicable_to values
        $types = ['percentage', 'fixed_amount'];
        $applicableToOptions = ['all', 'specific_services', 'specific_categories'];

        // Get providers for filter
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Promotions/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'promotions' => $promotionsData,
            'stats' => $stats,
            'types' => $types,
            'applicableToOptions' => $applicableToOptions,
            'providers' => $providers,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'type' => $type,
                'status' => $status,
                'applicable_to' => $applicable_to,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new promotion
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create promotions.');
        }

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Promotions/Create', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'providers' => $providers,
        ]);
    }

    /**
     * Store a newly created promotion
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create promotions.');
        }

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'type' => 'required|in:percentage,fixed_amount',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:50|unique:promotions,code',
            'discount_value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'applicable_to' => 'required|in:all,specific_services,specific_categories',
            'service_ids' => 'nullable|array',
            'category_ids' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'priority' => 'nullable|integer|min:0',
            'terms_conditions' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Handle banner image upload
            if ($request->hasFile('banner_image')) {
                $image = $request->file('banner_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('promotions', $filename, 'public');
                $validated['banner_image'] = '/storage/' . $path;
            }

            // Initialize usage count
            $validated['usage_count'] = $validated['usage_count'] ?? 0;

            // Uppercase the code
            $validated['code'] = strtoupper($validated['code']);

            $promotion = Promotion::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                Promotion::class,
                $promotion->id,
                null,
                $validated,
                'Promotion created by admin'
            );

            DB::commit();

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create promotion: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a promotion
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit promotions.');
        }

        $promotion = Promotion::with(['serviceProvider'])
            ->findOrFail($id);

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Promotions/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'promotion' => [
                'id' => $promotion->id,
                'service_provider_id' => $promotion->service_provider_id,
                'type' => $promotion->type,
                'title' => $promotion->title,
                'description' => $promotion->description,
                'code' => $promotion->code,
                'discount_value' => $promotion->discount_value,
                'min_booking_amount' => $promotion->min_booking_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'applicable_to' => $promotion->applicable_to,
                'service_ids' => $promotion->service_ids,
                'category_ids' => $promotion->category_ids,
                'start_date' => $promotion->start_date->format('Y-m-d'),
                'end_date' => $promotion->end_date->format('Y-m-d'),
                'usage_limit' => $promotion->usage_limit,
                'usage_count' => $promotion->usage_count,
                'per_customer_limit' => $promotion->per_customer_limit,
                'is_active' => $promotion->is_active,
                'priority' => $promotion->priority,
                'terms_conditions' => $promotion->terms_conditions,
                'banner_image' => $promotion->banner_image,
                'created_at' => $promotion->created_at->format('M d, Y H:i'),
                'updated_at' => $promotion->updated_at->format('M d, Y H:i'),
                'service_provider' => [
                    'id' => $promotion->serviceProvider->id,
                    'business_name' => $promotion->serviceProvider->business_name,
                    'slug' => $promotion->serviceProvider->slug,
                ],
            ],
            'providers' => $providers,
        ]);
    }

    /**
     * Update a promotion
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit promotions.');
        }

        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'type' => 'required|in:percentage,fixed_amount',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:50|unique:promotions,code,' . $id,
            'discount_value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'applicable_to' => 'required|in:all,specific_services,specific_categories',
            'service_ids' => 'nullable|array',
            'category_ids' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'priority' => 'nullable|integer|min:0',
            'terms_conditions' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $oldValues = $promotion->only([
            'service_provider_id', 'type', 'title', 'description', 'code',
            'discount_value', 'min_booking_amount', 'max_discount_amount',
            'applicable_to', 'service_ids', 'category_ids', 'start_date', 'end_date',
            'usage_limit', 'per_customer_limit', 'is_active', 'priority',
            'terms_conditions', 'banner_image'
        ]);

        DB::beginTransaction();
        try {
            // Handle banner image upload
            if ($request->hasFile('banner_image')) {
                // Delete old image if exists
                if ($promotion->banner_image) {
                    $oldPath = str_replace('/storage/', '', $promotion->banner_image);
                    Storage::disk('public')->delete($oldPath);
                }

                $image = $request->file('banner_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('promotions', $filename, 'public');
                $validated['banner_image'] = '/storage/' . $path;
            }

            // Uppercase the code
            $validated['code'] = strtoupper($validated['code']);

            $promotion->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                Promotion::class,
                $promotion->id,
                $oldValues,
                $promotion->only(array_keys($oldValues)),
                'Promotion details updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update promotion: ' . $e->getMessage());
        }
    }

    /**
     * Toggle promotion active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle promotion status.');
        }

        $promotion = Promotion::findOrFail($id);

        $oldValue = $promotion->is_active;
        $promotion->update(['is_active' => !$promotion->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $promotion->is_active ? 'activated' : 'deactivated',
            Promotion::class,
            $promotion->id,
            ['is_active' => $oldValue],
            ['is_active' => $promotion->is_active],
            $promotion->is_active ? 'Promotion activated' : 'Promotion deactivated'
        );

        return back()->with('success', 'Promotion status updated successfully.');
    }

    /**
     * Permanently delete a promotion
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete promotions.');
        }

        $promotion = Promotion::with('serviceProvider')->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Promotion::class,
                $promotion->id,
                [
                    'title' => $promotion->title,
                    'code' => $promotion->code,
                    'provider' => $promotion->serviceProvider->business_name,
                    'usage_count' => $promotion->usage_count,
                ],
                null,
                'Promotion permanently deleted'
            );

            // Delete banner image if exists
            if ($promotion->banner_image) {
                $oldPath = str_replace('/storage/', '', $promotion->banner_image);
                Storage::disk('public')->delete($oldPath);
            }

            // Delete the promotion
            $promotion->delete();

            DB::commit();

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete promotion: ' . $e->getMessage());
        }
    }
}
