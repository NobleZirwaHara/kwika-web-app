<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCatalogueRequest;
use App\Models\Catalogue;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductCatalogueController extends Controller
{
    /**
     * Display a listing of product catalogues owned by the provider's companies
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Get all company IDs owned by this provider
        $companyIds = $provider->companies()->pluck('id');

        $catalogues = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->with('company:id,name,logo')
            ->withCount('products')
            ->latest()
            ->get()
            ->map(function ($catalogue) {
                return [
                    'id' => $catalogue->id,
                    'name' => $catalogue->name,
                    'slug' => $catalogue->slug,
                    'description' => $catalogue->description,
                    'cover_image' => $catalogue->cover_image ? asset('storage/' . $catalogue->cover_image) : null,
                    'is_active' => $catalogue->is_active,
                    'is_featured' => $catalogue->is_featured,
                    'display_order' => $catalogue->display_order,
                    'products_count' => $catalogue->products_count,
                    'company' => [
                        'id' => $catalogue->company->id,
                        'name' => $catalogue->company->name,
                        'logo' => $catalogue->company->logo ? asset('storage/' . $catalogue->company->logo) : null,
                    ],
                    'created_at' => $catalogue->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Provider/ProductCatalogues/Index', [
            'catalogues' => $catalogues,
        ]);
    }

    /**
     * Show the form for creating a new product catalogue
     */
    public function create()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Get companies owned by this provider
        $companies = $provider->companies()
            ->active()
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                ];
            });

        return Inertia::render('Provider/ProductCatalogues/Create', [
            'companies' => $companies,
        ]);
    }

    /**
     * Store a newly created product catalogue
     */
    public function store(ProductCatalogueRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Verify the company belongs to this provider
        $company = Company::where('id', $request->company_id)
            ->where('service_provider_id', $provider->id)
            ->firstOrFail();

        $data = $request->validated();
        $data['type'] = 'product';

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = 'catalogues/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        $catalogue = Catalogue::create($data);

        return redirect()->route('provider.product-catalogues.index')
            ->with('success', 'Product catalogue created successfully');
    }

    /**
     * Show the form for editing the specified product catalogue
     */
    public function edit($id)
    {
        $provider = Auth::user()->serviceProvider;

        $companyIds = $provider->companies()->pluck('id');

        $catalogue = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->with('company:id,name,logo')
            ->findOrFail($id);

        // Get companies owned by this provider
        $companies = $provider->companies()
            ->active()
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                ];
            });

        return Inertia::render('Provider/ProductCatalogues/Edit', [
            'catalogue' => [
                'id' => $catalogue->id,
                'company_id' => $catalogue->company_id,
                'name' => $catalogue->name,
                'description' => $catalogue->description,
                'cover_image' => $catalogue->cover_image ? asset('storage/' . $catalogue->cover_image) : null,
                'display_order' => $catalogue->display_order,
                'is_active' => $catalogue->is_active,
                'is_featured' => $catalogue->is_featured,
            ],
            'companies' => $companies,
        ]);
    }

    /**
     * Update the specified product catalogue
     */
    public function update(ProductCatalogueRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $companyIds = $provider->companies()->pluck('id');

        $catalogue = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->findOrFail($id);

        // Verify the new company (if changed) belongs to this provider
        if ($request->company_id != $catalogue->company_id) {
            Company::where('id', $request->company_id)
                ->where('service_provider_id', $provider->id)
                ->firstOrFail();
        }

        $data = $request->validated();

        // Handle cover image upload and remove old one
        if ($request->hasFile('cover_image')) {
            if ($catalogue->cover_image) {
                Storage::disk('public')->delete($catalogue->cover_image);
            }
            $file = $request->file('cover_image');
            $filename = 'catalogues/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        // Don't update slug or type on updates
        unset($data['slug'], $data['type']);

        $catalogue->update($data);

        return redirect()->route('provider.product-catalogues.index')
            ->with('success', 'Product catalogue updated successfully');
    }

    /**
     * Remove the specified product catalogue
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $companyIds = $provider->companies()->pluck('id');

        $catalogue = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->findOrFail($id);

        // Delete associated cover image
        if ($catalogue->cover_image) {
            Storage::disk('public')->delete($catalogue->cover_image);
        }

        $catalogue->delete();

        return redirect()->route('provider.product-catalogues.index')
            ->with('success', 'Product catalogue deleted successfully');
    }
}
