<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CompaniesController extends Controller
{
    /**
     * Display a listing of companies
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
        $country = $request->input('country');
        $status = $request->input('status', 'all'); // all, active, inactive
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Company::with(['serviceProvider'])
            ->withCount(['catalogues'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('business_registration_number', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($country, function ($q) use ($country) {
                return $q->where('country', $country);
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

        $companies = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $companiesData = $companies->through(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'description' => $company->description,
                'business_registration_number' => $company->business_registration_number,
                'tax_id' => $company->tax_id,
                'address' => $company->address,
                'city' => $company->city,
                'state' => $company->state,
                'country' => $company->country,
                'postal_code' => $company->postal_code,
                'phone' => $company->phone,
                'email' => $company->email,
                'website' => $company->website,
                'social_links' => $company->social_links,
                'logo' => $company->logo,
                'cover_image' => $company->cover_image,
                'is_active' => $company->is_active,
                'catalogues_count' => $company->catalogues_count,
                'created_at' => $company->created_at->format('M d, Y'),
                'service_provider' => [
                    'id' => $company->serviceProvider->id,
                    'business_name' => $company->serviceProvider->business_name,
                    'slug' => $company->serviceProvider->slug,
                ],
            ];
        });

        // Get statistics
        $stats = [
            'total' => Company::count(),
            'active' => Company::where('is_active', true)->count(),
            'inactive' => Company::where('is_active', false)->count(),
            'with_catalogues' => Company::has('catalogues')->count(),
        ];

        // Get providers for filter
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        // Get unique countries for filter
        $countries = Company::select('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country')
            ->filter();

        return Inertia::render('Admin/Companies/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'companies' => $companiesData,
            'stats' => $stats,
            'providers' => $providers,
            'countries' => $countries,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'country' => $country,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new company
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create companies.');
        }

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Companies/Create', [
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
     * Store a newly created company
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create companies.');
        }

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_registration_number' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
            'social_links.linkedin' => 'nullable|url',
            'is_active' => 'boolean',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
        ]);

        DB::beginTransaction();
        try {
            // Generate slug
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $filename = 'logo_' . time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();
                $path = $logo->storeAs('companies/logos', $filename, 'public');
                $validated['logo'] = '/storage/' . $path;
            }

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                $cover = $request->file('cover_image');
                $filename = 'cover_' . time() . '_' . Str::random(10) . '.' . $cover->getClientOriginalExtension();
                $path = $cover->storeAs('companies/covers', $filename, 'public');
                $validated['cover_image'] = '/storage/' . $path;
            }

            $company = Company::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                Company::class,
                $company->id,
                null,
                $validated,
                'Company created by admin'
            );

            DB::commit();

            return redirect()->route('admin.companies.index')
                ->with('success', 'Company created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create company: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a company
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit companies.');
        }

        $company = Company::with(['serviceProvider', 'catalogues', 'media'])
            ->findOrFail($id);

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Companies/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'company' => [
                'id' => $company->id,
                'service_provider_id' => $company->service_provider_id,
                'name' => $company->name,
                'slug' => $company->slug,
                'description' => $company->description,
                'business_registration_number' => $company->business_registration_number,
                'tax_id' => $company->tax_id,
                'address' => $company->address,
                'city' => $company->city,
                'state' => $company->state,
                'country' => $company->country,
                'postal_code' => $company->postal_code,
                'phone' => $company->phone,
                'email' => $company->email,
                'website' => $company->website,
                'social_links' => $company->social_links,
                'logo' => $company->logo,
                'cover_image' => $company->cover_image,
                'is_active' => $company->is_active,
                'created_at' => $company->created_at->format('M d, Y H:i'),
                'updated_at' => $company->updated_at->format('M d, Y H:i'),
                'service_provider' => [
                    'id' => $company->serviceProvider->id,
                    'business_name' => $company->serviceProvider->business_name,
                    'slug' => $company->serviceProvider->slug,
                ],
                'catalogues' => $company->catalogues->map(function ($catalogue) {
                    return [
                        'id' => $catalogue->id,
                        'name' => $catalogue->name,
                    ];
                }),
            ],
            'providers' => $providers,
        ]);
    }

    /**
     * Update a company
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit companies.');
        }

        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_registration_number' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
            'social_links.linkedin' => 'nullable|url',
            'is_active' => 'boolean',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
        ]);

        $oldValues = $company->only([
            'service_provider_id', 'name', 'description', 'business_registration_number',
            'tax_id', 'address', 'city', 'state', 'country', 'postal_code',
            'phone', 'email', 'website', 'social_links', 'is_active'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $company->name) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($company->logo) {
                    $oldPath = str_replace('/storage/', '', $company->logo);
                    Storage::disk('public')->delete($oldPath);
                }

                $logo = $request->file('logo');
                $filename = 'logo_' . time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();
                $path = $logo->storeAs('companies/logos', $filename, 'public');
                $validated['logo'] = '/storage/' . $path;
            }

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                // Delete old cover if exists
                if ($company->cover_image) {
                    $oldPath = str_replace('/storage/', '', $company->cover_image);
                    Storage::disk('public')->delete($oldPath);
                }

                $cover = $request->file('cover_image');
                $filename = 'cover_' . time() . '_' . Str::random(10) . '.' . $cover->getClientOriginalExtension();
                $path = $cover->storeAs('companies/covers', $filename, 'public');
                $validated['cover_image'] = '/storage/' . $path;
            }

            $company->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                Company::class,
                $company->id,
                $oldValues,
                $company->only(array_keys($oldValues)),
                'Company details updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.companies.index')
                ->with('success', 'Company updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update company: ' . $e->getMessage());
        }
    }

    /**
     * Toggle company active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle company status.');
        }

        $company = Company::findOrFail($id);

        $oldValue = $company->is_active;
        $company->update(['is_active' => !$company->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $company->is_active ? 'activated' : 'deactivated',
            Company::class,
            $company->id,
            ['is_active' => $oldValue],
            ['is_active' => $company->is_active],
            $company->is_active ? 'Company activated' : 'Company deactivated'
        );

        return back()->with('success', 'Company status updated successfully.');
    }

    /**
     * Permanently delete a company
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete companies.');
        }

        $company = Company::with('serviceProvider')->findOrFail($id);

        // Check if company has catalogues
        $cataloguesCount = $company->catalogues()->count();
        if ($cataloguesCount > 0) {
            return back()->with('error', "Cannot delete company with {$cataloguesCount} catalogues. Remove catalogues first or deactivate instead.");
        }

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Company::class,
                $company->id,
                [
                    'name' => $company->name,
                    'provider' => $company->serviceProvider->business_name,
                    'registration' => $company->business_registration_number,
                ],
                null,
                'Company permanently deleted'
            );

            // Delete logo if exists
            if ($company->logo) {
                $oldPath = str_replace('/storage/', '', $company->logo);
                Storage::disk('public')->delete($oldPath);
            }

            // Delete cover image if exists
            if ($company->cover_image) {
                $oldPath = str_replace('/storage/', '', $company->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            // Delete related media
            $company->media()->delete();

            // Delete the company
            $company->delete();

            DB::commit();

            return redirect()->route('admin.companies.index')
                ->with('success', 'Company deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete company: ' . $e->getMessage());
        }
    }
}
