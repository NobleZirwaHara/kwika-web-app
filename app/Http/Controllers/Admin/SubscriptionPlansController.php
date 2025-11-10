<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubscriptionPlansController extends Controller
{
    /**
     * Display a listing of subscription plans
     */
    public function index()
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get all plans ordered by sort_order
        $plans = SubscriptionPlan::withCount('providerSubscriptions')
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        // Transform data for frontend
        $plansData = $plans->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price' => $plan->price,
                'billing_cycle' => $plan->billing_cycle,
                'features' => $plan->features,
                'max_services' => $plan->max_services,
                'max_images' => $plan->max_images,
                'featured_listing' => $plan->featured_listing,
                'priority_support' => $plan->priority_support,
                'analytics_access' => $plan->analytics_access,
                'is_active' => $plan->is_active,
                'sort_order' => $plan->sort_order,
                'subscribers_count' => $plan->provider_subscriptions_count,
                'created_at' => $plan->created_at->format('M d, Y'),
            ];
        });

        // Get statistics
        $stats = [
            'total' => SubscriptionPlan::count(),
            'active' => SubscriptionPlan::where('is_active', true)->count(),
            'inactive' => SubscriptionPlan::where('is_active', false)->count(),
            'total_subscribers' => SubscriptionPlan::withCount('providerSubscriptions')->get()->sum('provider_subscriptions_count'),
        ];

        return Inertia::render('Admin/SubscriptionPlans/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'plans' => $plansData,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new subscription plan
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to create subscription plans.');
        }

        // Get next sort order
        $nextSortOrder = SubscriptionPlan::max('sort_order') + 1;

        return Inertia::render('Admin/SubscriptionPlans/Create', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'nextSortOrder' => $nextSortOrder,
        ]);
    }

    /**
     * Store a newly created subscription plan
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to create subscription plans.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subscription_plans,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,lifetime',
            'features' => 'nullable|array',
            'max_services' => 'nullable|integer|min:0',
            'max_images' => 'nullable|integer|min:0',
            'featured_listing' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Generate slug
            $validated['slug'] = Str::slug($validated['name']);

            // Create plan
            $plan = SubscriptionPlan::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                SubscriptionPlan::class,
                $plan->id,
                null,
                $validated,
                'Subscription plan created'
            );

            DB::commit();

            return redirect()->route('admin.subscription-plans.index')
                ->with('success', 'Subscription plan created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create subscription plan: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a subscription plan
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to edit subscription plans.');
        }

        $plan = SubscriptionPlan::withCount('providerSubscriptions')->findOrFail($id);

        return Inertia::render('Admin/SubscriptionPlans/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price' => $plan->price,
                'billing_cycle' => $plan->billing_cycle,
                'features' => $plan->features ?? [],
                'max_services' => $plan->max_services,
                'max_images' => $plan->max_images,
                'featured_listing' => $plan->featured_listing,
                'priority_support' => $plan->priority_support,
                'analytics_access' => $plan->analytics_access,
                'is_active' => $plan->is_active,
                'sort_order' => $plan->sort_order,
                'subscribers_count' => $plan->provider_subscriptions_count,
                'created_at' => $plan->created_at->format('M d, Y H:i'),
                'updated_at' => $plan->updated_at->format('M d, Y H:i'),
            ],
        ]);
    }

    /**
     * Update a subscription plan
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to edit subscription plans.');
        }

        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subscription_plans,name,' . $plan->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,lifetime',
            'features' => 'nullable|array',
            'max_services' => 'nullable|integer|min:0',
            'max_images' => 'nullable|integer|min:0',
            'featured_listing' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $oldValues = $plan->only([
            'name', 'description', 'price', 'billing_cycle', 'features',
            'max_services', 'max_images', 'featured_listing', 'priority_support',
            'analytics_access', 'is_active', 'sort_order'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $plan->name) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $plan->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                SubscriptionPlan::class,
                $plan->id,
                $oldValues,
                $plan->only(array_keys($oldValues)),
                'Subscription plan updated'
            );

            DB::commit();

            return redirect()->route('admin.subscription-plans.index')
                ->with('success', 'Subscription plan updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update subscription plan: ' . $e->getMessage());
        }
    }

    /**
     * Toggle subscription plan active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to toggle subscription plan status.');
        }

        $plan = SubscriptionPlan::findOrFail($id);

        $oldValue = $plan->is_active;
        $plan->update(['is_active' => !$plan->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $plan->is_active ? 'activated' : 'deactivated',
            SubscriptionPlan::class,
            $plan->id,
            ['is_active' => $oldValue],
            ['is_active' => $plan->is_active],
            $plan->is_active ? 'Subscription plan activated' : 'Subscription plan deactivated'
        );

        return back()->with('success', 'Subscription plan status updated successfully.');
    }

    /**
     * Update sort order of subscription plans
     */
    public function updateOrder(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_subscriptions')) {
            return back()->with('error', 'You do not have permission to reorder subscription plans.');
        }

        $request->validate([
            'plans' => 'required|array',
            'plans.*.id' => 'required|exists:subscription_plans,id',
            'plans.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->input('plans') as $planData) {
                SubscriptionPlan::where('id', $planData['id'])
                    ->update(['sort_order' => $planData['sort_order']]);
            }

            // Log admin action
            $admin->logAdminAction(
                'reordered',
                SubscriptionPlan::class,
                null,
                null,
                null,
                'Subscription plans reordered'
            );

            DB::commit();

            return back()->with('success', 'Subscription plans reordered successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reorder plans: ' . $e->getMessage());
        }
    }

    /**
     * Delete a subscription plan
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete subscription plans.');
        }

        $plan = SubscriptionPlan::withCount('providerSubscriptions')->findOrFail($id);

        // Check if plan has active subscriptions
        if ($plan->provider_subscriptions_count > 0) {
            return back()->with('error', "Cannot delete subscription plan with {$plan->provider_subscriptions_count} active subscriptions. Deactivate instead.");
        }

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                SubscriptionPlan::class,
                $plan->id,
                [
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'billing_cycle' => $plan->billing_cycle,
                ],
                null,
                'Subscription plan permanently deleted'
            );

            // Delete the plan
            $plan->delete();

            DB::commit();

            return redirect()->route('admin.subscription-plans.index')
                ->with('success', 'Subscription plan deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete subscription plan: ' . $e->getMessage());
        }
    }
}
