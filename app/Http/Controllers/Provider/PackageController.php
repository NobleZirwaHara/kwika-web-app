<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServicePackageItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of packages for the authenticated provider.
     */
    public function index()
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('provider.dashboard')
                ->with('error', 'Service provider profile not found.');
        }

        $packages = ServicePackage::where('service_provider_id', $provider->id)
            ->with(['baseService', 'items.service'])
            ->orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Provider/Packages/Index', [
            'packages' => $packages,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('provider.dashboard')
                ->with('error', 'Service provider profile not found.');
        }

        $services = Service::where('service_provider_id', $provider->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Provider/Packages/Create', [
            'services' => $services,
            'packageTypes' => [
                ['value' => 'tier', 'label' => 'Tier Package', 'description' => 'Variations of a single service (e.g., Small/Medium/Large)'],
                ['value' => 'bundle', 'label' => 'Bundle Package', 'description' => 'Combination of multiple services'],
            ],
        ]);
    }

    /**
     * Store a newly created package in storage.
     */
    public function store(Request $request)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('provider.dashboard')
                ->with('error', 'Service provider profile not found.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'package_type' => 'required|in:tier,bundle',
            'base_service_id' => 'nullable|exists:services,id',
            'inclusions' => 'nullable|array',
            'inclusions.*' => 'string',
            'primary_image' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        // Generate unique slug
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;

        while (ServicePackage::where('service_provider_id', $provider->id)
            ->where('slug', $slug)
            ->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Calculate total price from items
        $totalPrice = 0;
        $itemsData = [];

        foreach ($validated['items'] as $index => $item) {
            $service = Service::find($item['service_id']);
            $quantity = $item['quantity'];
            $unitPrice = (float) $service->base_price;
            $subtotal = $quantity * $unitPrice;
            $totalPrice += $subtotal;

            $itemsData[] = [
                'service_id' => $item['service_id'],
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'notes' => $item['notes'] ?? null,
                'display_order' => $index + 1,
            ];
        }

        // Create package
        $package = ServicePackage::create([
            'service_provider_id' => $provider->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'package_type' => $validated['package_type'],
            'base_service_id' => $validated['base_service_id'] ?? null,
            'base_price' => $totalPrice,
            'final_price' => $totalPrice,
            'currency' => 'MWK',
            'inclusions' => $validated['inclusions'] ?? null,
            'primary_image' => $validated['primary_image'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        // Create package items
        foreach ($itemsData as $itemData) {
            ServicePackageItem::create(array_merge(
                ['service_package_id' => $package->id],
                $itemData
            ));
        }

        return redirect()->route('provider.packages.index')
            ->with('success', 'Package created successfully!');
    }

    /**
     * Show the form for editing the specified package.
     */
    public function edit(ServicePackage $package)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider || $package->service_provider_id !== $provider->id) {
            abort(403, 'Unauthorized access to this package.');
        }

        $package->load(['baseService', 'items.service']);

        $services = Service::where('service_provider_id', $provider->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Provider/Packages/Edit', [
            'package' => $package,
            'services' => $services,
            'packageTypes' => [
                ['value' => 'tier', 'label' => 'Tier Package', 'description' => 'Variations of a single service'],
                ['value' => 'bundle', 'label' => 'Bundle Package', 'description' => 'Combination of multiple services'],
            ],
        ]);
    }

    /**
     * Update the specified package in storage.
     */
    public function update(Request $request, ServicePackage $package)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider || $package->service_provider_id !== $provider->id) {
            abort(403, 'Unauthorized access to this package.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'package_type' => 'required|in:tier,bundle',
            'base_service_id' => 'nullable|exists:services,id',
            'inclusions' => 'nullable|array',
            'inclusions.*' => 'string',
            'primary_image' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        // Update slug only if name changed
        if ($validated['name'] !== $package->name) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;

            while (ServicePackage::where('service_provider_id', $provider->id)
                ->where('slug', $slug)
                ->where('id', '!=', $package->id)
                ->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        } else {
            $slug = $package->slug;
        }

        // Calculate total price from items
        $totalPrice = 0;
        $itemsData = [];

        foreach ($validated['items'] as $index => $item) {
            $service = Service::find($item['service_id']);
            $quantity = $item['quantity'];
            $unitPrice = (float) $service->base_price;
            $subtotal = $quantity * $unitPrice;
            $totalPrice += $subtotal;

            $itemsData[] = [
                'service_id' => $item['service_id'],
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'notes' => $item['notes'] ?? null,
                'display_order' => $index + 1,
            ];
        }

        // Update package
        $package->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'package_type' => $validated['package_type'],
            'base_service_id' => $validated['base_service_id'] ?? null,
            'base_price' => $totalPrice,
            'final_price' => $totalPrice,
            'inclusions' => $validated['inclusions'] ?? null,
            'primary_image' => $validated['primary_image'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        // Delete old items and create new ones
        $package->items()->delete();
        foreach ($itemsData as $itemData) {
            ServicePackageItem::create(array_merge(
                ['service_package_id' => $package->id],
                $itemData
            ));
        }

        return redirect()->route('provider.packages.index')
            ->with('success', 'Package updated successfully!');
    }

    /**
     * Remove the specified package from storage.
     */
    public function destroy(ServicePackage $package)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider || $package->service_provider_id !== $provider->id) {
            abort(403, 'Unauthorized access to this package.');
        }

        // Check if package has bookings
        if ($package->bookings()->count() > 0) {
            return back()->with('error', 'Cannot delete package with existing bookings.');
        }

        $package->delete();

        return redirect()->route('provider.packages.index')
            ->with('success', 'Package deleted successfully!');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggle(ServicePackage $package)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider || $package->service_provider_id !== $provider->id) {
            abort(403, 'Unauthorized access to this package.');
        }

        $package->update([
            'is_active' => !$package->is_active,
        ]);

        $status = $package->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Package {$status} successfully!");
    }

    /**
     * Reorder packages.
     */
    public function reorder(Request $request)
    {
        $provider = auth()->user()->serviceProvider;

        if (!$provider) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'packages' => 'required|array',
            'packages.*.id' => 'required|exists:service_packages,id',
            'packages.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['packages'] as $packageData) {
            $package = ServicePackage::find($packageData['id']);

            if ($package && $package->service_provider_id === $provider->id) {
                $package->update(['display_order' => $packageData['display_order']]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Packages reordered successfully!']);
    }
}
