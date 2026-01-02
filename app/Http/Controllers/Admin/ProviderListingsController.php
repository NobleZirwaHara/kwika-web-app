<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Product;
use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderListingsController extends Controller
{
    /**
     * Display a combined view of all services and products
     */
    public function index(Request $request)
    {
        // Get filters
        $search = $request->get('search', '');
        $provider = $request->get('provider', '');
        $type = $request->get('type', 'all'); // all, services, products
        $status = $request->get('status', 'all');

        // Build services query
        $servicesQuery = Service::with(['serviceProvider', 'category'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($provider, function ($query) use ($provider) {
                $query->where('service_provider_id', $provider);
            })
            ->when($status === 'active', function ($query) {
                $query->where('is_active', true);
            })
            ->when($status === 'inactive', function ($query) {
                $query->where('is_active', false);
            });

        // Build products query
        $productsQuery = Product::with(['serviceProvider', 'catalogue'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($provider, function ($query) use ($provider) {
                $query->where('service_provider_id', $provider);
            })
            ->when($status === 'active', function ($query) {
                $query->where('is_active', true);
            })
            ->when($status === 'inactive', function ($query) {
                $query->where('is_active', false);
            });

        // Get counts for stats
        $servicesCount = Service::count();
        $productsCount = Product::count();
        $activeServicesCount = Service::where('is_active', true)->count();
        $activeProductsCount = Product::where('is_active', true)->count();

        // Get services and products based on type filter
        $services = [];
        $products = [];

        if ($type === 'all' || $type === 'services') {
            $services = $servicesQuery->latest()->get()->map(function ($service) {
                return [
                    'id' => $service->id,
                    'type' => 'service',
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'description' => $service->description,
                    'price' => $service->base_price,
                    'currency' => $service->currency,
                    'is_active' => $service->is_active,
                    'provider' => $service->serviceProvider ? [
                        'id' => $service->serviceProvider->id,
                        'name' => $service->serviceProvider->business_name,
                        'slug' => $service->serviceProvider->slug,
                    ] : null,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                    ] : null,
                    'created_at' => $service->created_at->format('M d, Y'),
                ];
            });
        }

        if ($type === 'all' || $type === 'products') {
            $products = $productsQuery->latest()->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'type' => 'product',
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'price' => $product->price,
                    'currency' => $product->currency ?? 'MWK',
                    'is_active' => $product->is_active,
                    'stock' => $product->track_inventory ? $product->stock_quantity : null,
                    'provider' => $product->serviceProvider ? [
                        'id' => $product->serviceProvider->id,
                        'name' => $product->serviceProvider->business_name,
                        'slug' => $product->serviceProvider->slug,
                    ] : null,
                    'catalogue' => $product->catalogue ? [
                        'id' => $product->catalogue->id,
                        'name' => $product->catalogue->name,
                    ] : null,
                    'created_at' => $product->created_at->format('M d, Y'),
                ];
            });
        }

        // Combine and sort by created_at
        $listings = collect($services)->merge($products)->sortByDesc('created_at')->values();

        // Get providers for filter dropdown
        $providers = ServiceProvider::orderBy('business_name')
            ->get(['id', 'business_name as name', 'slug']);

        // Get categories for filter dropdown
        $categories = ServiceCategory::orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/ProviderListings/Index', [
            'listings' => $listings,
            'stats' => [
                'total_services' => $servicesCount,
                'total_products' => $productsCount,
                'active_services' => $activeServicesCount,
                'active_products' => $activeProductsCount,
                'total' => $servicesCount + $productsCount,
                'active' => $activeServicesCount + $activeProductsCount,
            ],
            'providers' => $providers,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'type' => $type,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Toggle active status of a service
     */
    public function toggleServiceStatus(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->is_active = !$service->is_active;
        $service->save();

        return back()->with('success', 'Service status updated successfully');
    }

    /**
     * Toggle active status of a product
     */
    public function toggleProductStatus(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->is_active = !$product->is_active;
        $product->save();

        return back()->with('success', 'Product status updated successfully');
    }
}
