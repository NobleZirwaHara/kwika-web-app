<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VerificationQueueController extends Controller
{
    /**
     * Display the verification queue
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $status = $request->input('status', 'pending');
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'asc');

        // Build query
        $query = ServiceProvider::with(['user', 'services', 'media', 'logo', 'coverImage'])
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('verification_status', $status);
            })
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('business_name', 'like', "%{$search}%")
                        ->orWhere('business_registration_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            });

        // Apply sorting
        if ($sortBy === 'waiting_time') {
            $query->orderBy('created_at', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $providers = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $providersData = $providers->through(function ($provider) {
            return [
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
                'verification_status' => $provider->verification_status,
                'rejection_reason' => $provider->rejection_reason,
                'is_verified' => $provider->is_verified,
                'is_featured' => $provider->is_featured,
                'is_active' => $provider->is_active,
                'verified_at' => $provider->verified_at?->format('M d, Y H:i'),
                'created_at' => $provider->created_at->format('M d, Y H:i'),
                'days_waiting' => $provider->created_at->diffInDays(now()),
                'user' => [
                    'id' => $provider->user->id,
                    'name' => $provider->user->name,
                    'email' => $provider->user->email,
                    'phone' => $provider->user->phone,
                    'is_verified' => $provider->user->is_verified,
                ],
                'services_count' => $provider->services->count(),
                'logo_url' => $provider->logo?->file_path,
                'cover_image_url' => $provider->coverImage?->file_path,
                'onboarding_completed' => $provider->onboarding_completed,
                'onboarding_step' => $provider->onboarding_step,
            ];
        });

        // Get statistics
        $stats = [
            'pending' => ServiceProvider::where('verification_status', 'pending')->count(),
            'approved' => ServiceProvider::where('verification_status', 'approved')->count(),
            'rejected' => ServiceProvider::where('verification_status', 'rejected')->count(),
            'total' => ServiceProvider::count(),
        ];

        return Inertia::render('Admin/VerificationQueue/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'providers' => $providersData,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show detailed view of a provider application
     */
    public function show($id)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        $provider = ServiceProvider::with([
            'user',
            'services.category',
            'media',
            'logo',
            'coverImage',
            'portfolioImages',
            'companies',
        ])->findOrFail($id);

        return Inertia::render('Admin/VerificationQueue/Show', [
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
                'verification_status' => $provider->verification_status,
                'rejection_reason' => $provider->rejection_reason,
                'is_verified' => $provider->is_verified,
                'is_featured' => $provider->is_featured,
                'is_active' => $provider->is_active,
                'verified_at' => $provider->verified_at?->format('M d, Y H:i'),
                'created_at' => $provider->created_at->format('M d, Y H:i'),
                'days_waiting' => $provider->created_at->diffInDays(now()),
                'onboarding_data' => $provider->onboarding_data,
                'user' => [
                    'id' => $provider->user->id,
                    'name' => $provider->user->name,
                    'email' => $provider->user->email,
                    'phone' => $provider->user->phone,
                    'national_id' => $provider->user->national_id,
                    'is_verified' => $provider->user->is_verified,
                    'created_at' => $provider->user->created_at->format('M d, Y H:i'),
                ],
                'services' => $provider->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'description' => $service->description,
                        'base_price' => $service->base_price,
                        'currency' => $service->currency,
                        'duration' => $service->duration,
                        'category' => $service->category ? [
                            'id' => $service->category->id,
                            'name' => $service->category->name,
                        ] : null,
                        'is_active' => $service->is_active,
                    ];
                }),
                'companies' => $provider->companies->map(function ($company) {
                    return [
                        'id' => $company->id,
                        'name' => $company->name,
                        'registration_number' => $company->registration_number,
                        'tax_id' => $company->tax_id,
                        'address' => $company->address,
                        'phone' => $company->phone,
                        'email' => $company->email,
                    ];
                }),
                'logo_url' => $provider->logo?->file_path,
                'cover_image_url' => $provider->coverImage?->file_path,
                'portfolio_images' => $provider->portfolioImages->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'file_path' => $media->file_path,
                        'file_name' => $media->file_name,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Approve a provider
     */
    public function approve(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('approve_providers')) {
            return back()->with('error', 'You do not have permission to approve providers.');
        }

        $provider = ServiceProvider::with('user')->findOrFail($id);

        $oldValues = [
            'verification_status' => $provider->verification_status,
            'is_verified' => $provider->is_verified,
            'verified_at' => $provider->verified_at,
        ];

        DB::beginTransaction();
        try {
            // Update provider
            $provider->update([
                'verification_status' => 'approved',
                'is_verified' => true,
                'is_active' => true,
                'verified_at' => now(),
                'rejection_reason' => null,
            ]);

            // Log admin action
            $admin->logAdminAction(
                'approved',
                ServiceProvider::class,
                $provider->id,
                $oldValues,
                [
                    'verification_status' => 'approved',
                    'is_verified' => true,
                    'verified_at' => now()->toDateTimeString(),
                ],
                $request->input('notes', 'Provider approved via verification queue')
            );

            DB::commit();

            return back()->with('success', 'Provider approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve provider: ' . $e->getMessage());
        }
    }

    /**
     * Reject a provider
     */
    public function reject(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('approve_providers')) {
            return back()->with('error', 'You do not have permission to reject providers.');
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $provider = ServiceProvider::with('user')->findOrFail($id);

        $oldValues = [
            'verification_status' => $provider->verification_status,
            'is_verified' => $provider->is_verified,
            'rejection_reason' => $provider->rejection_reason,
        ];

        DB::beginTransaction();
        try {
            // Update provider
            $provider->update([
                'verification_status' => 'rejected',
                'is_verified' => false,
                'is_active' => false,
                'rejection_reason' => $request->input('reason'),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'rejected',
                ServiceProvider::class,
                $provider->id,
                $oldValues,
                [
                    'verification_status' => 'rejected',
                    'is_verified' => false,
                    'rejection_reason' => $request->input('reason'),
                ],
                $request->input('notes', 'Provider rejected via verification queue')
            );

            DB::commit();

            return back()->with('success', 'Provider rejected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject provider: ' . $e->getMessage());
        }
    }

    /**
     * Request changes from provider
     */
    public function requestChanges(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('approve_providers')) {
            return back()->with('error', 'You do not have permission to request changes.');
        }

        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $provider = ServiceProvider::with('user')->findOrFail($id);

        $oldValues = [
            'verification_status' => $provider->verification_status,
        ];

        DB::beginTransaction();
        try {
            // Update provider status to pending with feedback
            $provider->update([
                'verification_status' => 'pending',
                'rejection_reason' => 'Changes requested: ' . $request->input('message'),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'requested_changes',
                ServiceProvider::class,
                $provider->id,
                $oldValues,
                [
                    'verification_status' => 'pending',
                    'feedback' => $request->input('message'),
                ],
                'Requested changes from provider: ' . $request->input('message')
            );

            DB::commit();

            return back()->with('success', 'Change request sent to provider.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to request changes: ' . $e->getMessage());
        }
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
            'Toggled featured status'
        );

        return back()->with('success', 'Featured status updated.');
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
            'Toggled active status'
        );

        return back()->with('success', 'Active status updated.');
    }
}
