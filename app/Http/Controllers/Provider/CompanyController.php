<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies owned by the authenticated provider
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $companies = $provider->companies()
            ->withCount('catalogues')
            ->latest()
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                    'description' => $company->description,
                    'city' => $company->city,
                    'phone' => $company->phone,
                    'email' => $company->email,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                    'is_active' => $company->is_active,
                    'catalogues_count' => $company->catalogues_count,
                    'created_at' => $company->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Provider/Companies/Index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Show the form for creating a new company
     */
    public function create()
    {
        return Inertia::render('Provider/Companies/Create');
    }

    /**
     * Store a newly created company
     */
    public function store(CompanyRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $data = $request->validated();
        $data['service_provider_id'] = $provider->id;

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'companies/logos/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['logo'] = $file->storeAs('', $filename, 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = 'companies/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        $company = Company::create($data);

        return redirect()->route('provider.companies.index')
            ->with('success', 'Company created successfully');
    }

    /**
     * Show the form for editing the specified company
     */
    public function edit($id)
    {
        $provider = Auth::user()->serviceProvider;

        $company = Company::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        return Inertia::render('Provider/Companies/Edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
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
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                'cover_image' => $company->cover_image ? asset('storage/' . $company->cover_image) : null,
                'is_active' => $company->is_active,
            ],
        ]);
    }

    /**
     * Update the specified company
     */
    public function update(CompanyRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $company = Company::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $data = $request->validated();

        // Handle logo upload and remove old one
        if ($request->hasFile('logo')) {
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }
            $file = $request->file('logo');
            $filename = 'companies/logos/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['logo'] = $file->storeAs('', $filename, 'public');
        }

        // Handle cover image upload and remove old one
        if ($request->hasFile('cover_image')) {
            if ($company->cover_image) {
                Storage::disk('public')->delete($company->cover_image);
            }
            $file = $request->file('cover_image');
            $filename = 'companies/covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['cover_image'] = $file->storeAs('', $filename, 'public');
        }

        // Don't update slug on updates
        unset($data['slug']);

        $company->update($data);

        return redirect()->route('provider.companies.index')
            ->with('success', 'Company updated successfully');
    }

    /**
     * Remove the specified company
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $company = Company::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Delete associated images
        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }
        if ($company->cover_image) {
            Storage::disk('public')->delete($company->cover_image);
        }

        $company->delete();

        return redirect()->route('provider.companies.index')
            ->with('success', 'Company deleted successfully');
    }
}
