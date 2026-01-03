<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Catalogue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $query = Product::where('service_provider_id', $provider->id)
            ->with('catalogue');

        // Filter by catalogue
        if ($request->filled('catalogue_id')) {
            $query->where('catalogue_id', $request->catalogue_id);
        }

        // Filter by stock status
        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
                case 'in_stock':
                    $query->inStock();
                    break;
                case 'out_of_stock':
                    $query->where('track_inventory', true)
                          ->where('stock_quantity', '<=', 0);
                    break;
            }
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        // Search by name or SKU
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description ? Str::limit($product->description, 100) : null,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'currency' => $product->currency,
                    'display_price' => $product->display_price,
                    'is_on_sale' => $product->is_on_sale,
                    'stock_quantity' => $product->stock_quantity,
                    'track_inventory' => $product->track_inventory,
                    'is_in_stock' => $product->is_in_stock,
                    'unit' => $product->unit,
                    'is_active' => $product->is_active,
                    'is_featured' => $product->is_featured,
                    'primary_image' => $product->primary_image ? Storage::url($product->primary_image) : null,
                    'catalogue' => [
                        'id' => $product->catalogue->id,
                        'name' => $product->catalogue->name,
                    ],
                    'created_at' => $product->created_at->format('M d, Y'),
                ];
            });

        // Get catalogues for filtering
        $companyIds = $provider->companies()->pluck('id');
        $catalogues = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->get(['id', 'name']);

        return Inertia::render('Provider/Products/Index', [
            'products' => $products,
            'catalogues' => $catalogues,
            'filters' => [
                'catalogue_id' => $request->catalogue_id,
                'stock_status' => $request->stock_status,
                'is_active' => $request->is_active,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Get catalogues for dropdown
        $companyIds = $provider->companies()->pluck('id');
        $catalogues = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->get(['id', 'name', 'company_id'])
            ->map(function($catalogue) {
                return [
                    'id' => $catalogue->id,
                    'name' => $catalogue->name,
                    'company_id' => $catalogue->company_id,
                ];
            });

        return Inertia::render('Provider/Products/Create', [
            'catalogues' => $catalogues,
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(ProductRequest $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $data = $request->validated();
        $data['service_provider_id'] = $provider->id;

        // Handle primary image upload
        if ($request->hasFile('primary_image')) {
            $file = $request->file('primary_image');
            $filename = 'products/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['primary_image'] = $file->storeAs('', $filename, 'public');
        }

        Product::create($data);

        return redirect()->route('provider.products.index')
            ->with('success', 'Product created successfully');
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit($id)
    {
        $provider = Auth::user()->serviceProvider;

        $product = Product::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Get catalogues for dropdown
        $companyIds = $provider->companies()->pluck('id');
        $catalogues = Catalogue::product()
            ->whereIn('company_id', $companyIds)
            ->get(['id', 'name', 'company_id'])
            ->map(function($catalogue) {
                return [
                    'id' => $catalogue->id,
                    'name' => $catalogue->name,
                    'company_id' => $catalogue->company_id,
                ];
            });

        return Inertia::render('Provider/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'catalogue_id' => $product->catalogue_id,
                'name' => $product->name,
                'description' => $product->description,
                'sku' => $product->sku,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'currency' => $product->currency,
                'stock_quantity' => $product->stock_quantity,
                'track_inventory' => $product->track_inventory,
                'unit' => $product->unit,
                'weight' => $product->weight,
                'dimensions' => $product->dimensions,
                'specifications' => $product->specifications,
                'features' => $product->features,
                'primary_image' => $product->primary_image ? Storage::url($product->primary_image) : null,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'display_order' => $product->display_order,
            ],
            'catalogues' => $catalogues,
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(ProductRequest $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $product = Product::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $data = $request->validated();

        // Handle primary image upload and remove old one
        if ($request->hasFile('primary_image')) {
            if ($product->primary_image) {
                Storage::disk('public')->delete($product->primary_image);
            }
            $file = $request->file('primary_image');
            $filename = 'products/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $data['primary_image'] = $file->storeAs('', $filename, 'public');
        }

        $product->update($data);

        return redirect()->route('provider.products.index')
            ->with('success', 'Product updated successfully');
    }

    /**
     * Toggle product active status
     */
    public function toggle($id)
    {
        $provider = Auth::user()->serviceProvider;

        $product = Product::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        $product->update([
            'is_active' => !$product->is_active,
        ]);

        return redirect()->back()->with('success', 'Product status updated');
    }

    /**
     * Remove the specified product
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        $product = Product::where('service_provider_id', $provider->id)
            ->findOrFail($id);

        // Delete associated primary image
        if ($product->primary_image) {
            Storage::disk('public')->delete($product->primary_image);
        }

        $product->delete();

        return redirect()->route('provider.products.index')
            ->with('success', 'Product deleted successfully');
    }
}
