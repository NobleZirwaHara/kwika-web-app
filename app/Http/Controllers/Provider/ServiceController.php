<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display services listing
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('home')->withErrors(['error' => 'Provider profile not found']);
        }

        $services = $provider->services()
            ->with('category')
            ->withCount('bookings')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'description' => $service->description,
                    'base_price' => $service->base_price,
                    'price_type' => $service->price_type,
                    'max_price' => $service->max_price,
                    'currency' => $service->currency,
                    'duration' => $service->duration,
                    'max_attendees' => $service->max_attendees,
                    'category_name' => $service->category->name,
                    'is_active' => $service->is_active,
                    'bookings_count' => $service->bookings_count,
                ];
            });

        $categories = ServiceCategory::active()->get(['id', 'name']);

        return Inertia::render('Provider/Services', [
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'logo' => $provider->logo,
                'verification_status' => $provider->verification_status,
            ],
            'services' => $services,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new service
     */
    public function store(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['nullable', 'string', 'max:5000'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', 'in:fixed,hourly,daily,custom'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gt:base_price'],
            'duration' => ['nullable', 'integer', 'min:1'],
            'max_attendees' => ['nullable', 'integer', 'min:1'],
            'inclusions' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        $validated['service_provider_id'] = $provider->id;
        $validated['currency'] = 'MWK'; // Default currency

        Service::create($validated);

        return redirect()->back()->with('success', 'Service created successfully');
    }

    /**
     * Update an existing service
     */
    public function update(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $service = Service::where('id', $id)
            ->where('service_provider_id', $provider->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['nullable', 'string', 'max:5000'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', 'in:fixed,hourly,daily,custom'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gt:base_price'],
            'duration' => ['nullable', 'integer', 'min:1'],
            'max_attendees' => ['nullable', 'integer', 'min:1'],
            'inclusions' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        // Update slug if name changed
        if ($validated['name'] !== $service->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        }

        $service->update($validated);

        return redirect()->back()->with('success', 'Service updated successfully');
    }

    /**
     * Toggle service active status
     */
    public function toggle(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $service = Service::where('id', $id)
            ->where('service_provider_id', $provider->id)
            ->firstOrFail();

        $service->update([
            'is_active' => !$service->is_active,
        ]);

        return redirect()->back()->with('success', 'Service status updated');
    }

    /**
     * Delete a service
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $service = Service::where('id', $id)
            ->where('service_provider_id', $provider->id)
            ->firstOrFail();

        // Check if service has bookings
        if ($service->bookings()->count() > 0) {
            return redirect()->back()->withErrors([
                'error' => 'Cannot delete service with existing bookings. Deactivate it instead.'
            ]);
        }

        $service->delete();

        return redirect()->back()->with('success', 'Service deleted successfully');
    }
}
