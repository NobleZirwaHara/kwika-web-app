<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ServiceProvider;
use App\Models\Catalogue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of products
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
        $catalogue = $request->input('catalogue'); // catalogue_id
        $status = $request->input('status', 'all'); // all, active, inactive
        $stock = $request->input('stock', 'all'); // all, in_stock, out_of_stock
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Product::with(['serviceProvider', 'catalogue'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($catalogue, function ($q) use ($catalogue) {
                return $q->where('catalogue_id', $catalogue);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'active':
                        return $q->where('is_active', true);
                    case 'inactive':
                        return $q->where('is_active', false);
                }
            })
            ->when($stock !== 'all', function ($q) use ($stock) {
                switch ($stock) {
                    case 'in_stock':
                        return $q->where(function($query) {
                            $query->where('track_inventory', false)
                                  ->orWhere('stock_quantity', '>', 0);
                        });
                    case 'out_of_stock':
                        return $q->where('track_inventory', true)
                               ->where('stock_quantity', '<=', 0);
                }
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $productsData = $products->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
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
                'primary_image' => $product->primary_image,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'is_on_sale' => $product->is_on_sale,
                'is_in_stock' => $product->is_in_stock,
                'display_price' => $product->display_price,
                'created_at' => $product->created_at->format('M d, Y'),
                'service_provider' => [
                    'id' => $product->serviceProvider->id,
                    'business_name' => $product->serviceProvider->business_name,
                    'slug' => $product->serviceProvider->slug,
                ],
                'catalogue' => $product->catalogue ? [
                    'id' => $product->catalogue->id,
                    'name' => $product->catalogue->name,
                ] : null,
            ];
        });

        // Get statistics
        $stats = [
            'total' => Product::count(),
            'active' => Product::where('is_active', true)->count(),
            'inactive' => Product::where('is_active', false)->count(),
            'in_stock' => Product::where(function($query) {
                $query->where('track_inventory', false)
                      ->orWhere('stock_quantity', '>', 0);
            })->count(),
            'out_of_stock' => Product::where('track_inventory', true)
                                   ->where('stock_quantity', '<=', 0)
                                   ->count(),
            'featured' => Product::where('is_featured', true)->count(),
        ];

        // Get catalogues for filter
        $catalogues = Catalogue::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get providers for filter
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Products/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'products' => $productsData,
            'stats' => $stats,
            'catalogues' => $catalogues,
            'providers' => $providers,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'catalogue' => $catalogue,
                'status' => $status,
                'stock' => $stock,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create products.');
        }

        // Get catalogues for dropdown
        $catalogues = Catalogue::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'catalogues' => $catalogues,
            'providers' => $providers,
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create products.');
        }

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'catalogue_id' => 'required|exists:catalogues,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:255|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'currency' => 'required|string|max:3',
            'stock_quantity' => 'required|integer|min:0',
            'track_inventory' => 'boolean',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'primary_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Generate slug
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);

            // Handle image upload
            if ($request->hasFile('primary_image')) {
                $image = $request->file('primary_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $validated['primary_image'] = '/storage/' . $path;
            }

            $product = Product::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                Product::class,
                $product->id,
                null,
                $validated,
                'Product created by admin'
            );

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a product
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit products.');
        }

        $product = Product::with(['serviceProvider', 'catalogue', 'media'])
            ->findOrFail($id);

        // Get catalogues for dropdown
        $catalogues = Catalogue::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get providers for dropdown
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        return Inertia::render('Admin/Products/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'product' => [
                'id' => $product->id,
                'service_provider_id' => $product->service_provider_id,
                'catalogue_id' => $product->catalogue_id,
                'name' => $product->name,
                'slug' => $product->slug,
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
                'primary_image' => $product->primary_image ? asset('storage/' . $product->primary_image) : null,
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'display_order' => $product->display_order,
                'created_at' => $product->created_at->format('M d, Y H:i'),
                'updated_at' => $product->updated_at->format('M d, Y H:i'),
                'service_provider' => [
                    'id' => $product->serviceProvider->id,
                    'business_name' => $product->serviceProvider->business_name,
                    'slug' => $product->serviceProvider->slug,
                ],
                'catalogue' => $product->catalogue ? [
                    'id' => $product->catalogue->id,
                    'name' => $product->catalogue->name,
                ] : null,
                'media' => $product->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->url ? asset('storage/' . $media->url) : null,
                        'type' => $media->type,
                    ];
                }),
            ],
            'catalogues' => $catalogues,
            'providers' => $providers,
        ]);
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit products.');
        }

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'catalogue_id' => 'required|exists:catalogues,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:255|unique:products,sku,' . $id,
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'currency' => 'required|string|max:3',
            'stock_quantity' => 'required|integer|min:0',
            'track_inventory' => 'boolean',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:255',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'primary_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $oldValues = $product->only([
            'service_provider_id', 'catalogue_id', 'name', 'description', 'sku',
            'price', 'sale_price', 'currency', 'stock_quantity', 'track_inventory',
            'unit', 'weight', 'dimensions', 'specifications', 'features',
            'is_active', 'is_featured', 'display_order', 'primary_image'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $product->name) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
            }

            // Handle image upload
            if ($request->hasFile('primary_image')) {
                // Delete old image if exists
                if ($product->primary_image) {
                    $oldPath = str_replace('/storage/', '', $product->primary_image);
                    Storage::disk('public')->delete($oldPath);
                }

                $image = $request->file('primary_image');
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $validated['primary_image'] = '/storage/' . $path;
            }

            $product->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                Product::class,
                $product->id,
                $oldValues,
                $product->only(array_keys($oldValues)),
                'Product details updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Toggle product active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle product status.');
        }

        $product = Product::findOrFail($id);

        $oldValue = $product->is_active;
        $product->update(['is_active' => !$product->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $product->is_active ? 'activated' : 'deactivated',
            Product::class,
            $product->id,
            ['is_active' => $oldValue],
            ['is_active' => $product->is_active],
            $product->is_active ? 'Product activated' : 'Product deactivated'
        );

        return back()->with('success', 'Product status updated successfully.');
    }

    /**
     * Toggle product featured status
     */
    public function toggleFeatured($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle product featured status.');
        }

        $product = Product::findOrFail($id);

        $oldValue = $product->is_featured;
        $product->update(['is_featured' => !$product->is_featured]);

        // Log admin action
        $admin->logAdminAction(
            $product->is_featured ? 'featured' : 'unfeatured',
            Product::class,
            $product->id,
            ['is_featured' => $oldValue],
            ['is_featured' => $product->is_featured],
            $product->is_featured ? 'Product marked as featured' : 'Product unmarked as featured'
        );

        return back()->with('success', 'Product featured status updated successfully.');
    }

    /**
     * Permanently delete a product
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete products.');
        }

        $product = Product::with('serviceProvider')->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Product::class,
                $product->id,
                [
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'provider' => $product->serviceProvider->business_name,
                    'price' => $product->price,
                ],
                null,
                'Product permanently deleted'
            );

            // Delete image if exists
            if ($product->primary_image) {
                $oldPath = str_replace('/storage/', '', $product->primary_image);
                Storage::disk('public')->delete($oldPath);
            }

            // Delete related media
            $product->media()->delete();

            // Delete the product
            $product->delete();

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }
}
