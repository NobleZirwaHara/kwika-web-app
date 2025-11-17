<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $status = $request->input('status', 'all'); // all, active, inactive
        $sortBy = $request->input('sort_by', 'sort_order');
        $sortOrder = $request->input('sort_order', 'asc');

        // Build query
        $query = ServiceCategory::with(['parent', 'children'])
            ->withCount(['services', 'children'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
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

        $categories = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $categoriesData = $categories->through(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'parent_id' => $category->parent_id,
                'is_parent' => $category->isParent(),
                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                ] : null,
                'children_count' => $category->children_count,
                'is_active' => $category->is_active,
                'sort_order' => $category->sort_order,
                'services_count' => $category->services_count,
                'created_at' => $category->created_at->format('M d, Y'),
                'updated_at' => $category->updated_at->format('M d, Y'),
            ];
        });

        // Get statistics
        $stats = [
            'total' => ServiceCategory::count(),
            'active' => ServiceCategory::where('is_active', true)->count(),
            'inactive' => ServiceCategory::where('is_active', false)->count(),
            'total_services' => ServiceCategory::withCount('services')->get()->sum('services_count'),
        ];

        return Inertia::render('Admin/Categories/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'categories' => $categoriesData,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create()
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create categories.');
        }

        // Get the next sort order
        $nextSortOrder = ServiceCategory::max('sort_order') + 1;

        // Get all parent categories for selection
        $parentCategories = ServiceCategory::parents()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Create', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'nextSortOrder' => $nextSortOrder,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to create categories.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_categories,name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:service_categories,id',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // Generate slug
            $validated['slug'] = Str::slug($validated['name']);

            // Ensure slug is unique
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (ServiceCategory::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            $category = ServiceCategory::create($validated);

            // Log admin action
            $admin->logAdminAction(
                'created',
                ServiceCategory::class,
                $category->id,
                null,
                $category->toArray(),
                'Category created by admin'
            );

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create category: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show the form for editing a category
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit categories.');
        }

        $category = ServiceCategory::with(['parent'])->withCount(['services', 'children'])->findOrFail($id);

        // Get all parent categories for selection (excluding current category and its children)
        $parentCategories = ServiceCategory::parents()
            ->where('id', '!=', $id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'parent_id' => $category->parent_id,
                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                ] : null,
                'is_active' => $category->is_active,
                'sort_order' => $category->sort_order,
                'services_count' => $category->services_count,
                'children_count' => $category->children_count,
                'created_at' => $category->created_at->format('M d, Y H:i'),
                'updated_at' => $category->updated_at->format('M d, Y H:i'),
            ],
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Update a category
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to edit categories.');
        }

        $category = ServiceCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_categories,name,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:service_categories,id',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Prevent circular reference: category cannot be its own parent
        if (isset($validated['parent_id']) && $validated['parent_id'] == $id) {
            return back()->with('error', 'A category cannot be its own parent.');
        }

        // Prevent setting a subcategory as parent (only parent categories can be parents)
        if (isset($validated['parent_id'])) {
            $parentCategory = ServiceCategory::find($validated['parent_id']);
            if ($parentCategory && $parentCategory->parent_id !== null) {
                return back()->with('error', 'You can only select a parent category (not a subcategory) as parent.');
            }
        }

        $oldValues = $category->only([
            'name', 'description', 'icon', 'sort_order', 'is_active'
        ]);

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $category->name) {
                $validated['slug'] = Str::slug($validated['name']);

                // Ensure slug is unique
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (ServiceCategory::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $category->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                ServiceCategory::class,
                $category->id,
                $oldValues,
                $category->only(array_keys($oldValues)),
                'Category updated by admin'
            );

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update category: ' . $e->getMessage());
        }
    }

    /**
     * Toggle category active status
     */
    public function toggleActive($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to toggle category status.');
        }

        $category = ServiceCategory::findOrFail($id);

        $oldValue = $category->is_active;
        $category->update(['is_active' => !$category->is_active]);

        // Log admin action
        $admin->logAdminAction(
            $category->is_active ? 'activated' : 'deactivated',
            ServiceCategory::class,
            $category->id,
            ['is_active' => $oldValue],
            ['is_active' => $category->is_active],
            $category->is_active ? 'Category activated' : 'Category deactivated'
        );

        return back()->with('success', 'Category status updated successfully.');
    }

    /**
     * Update category order
     */
    public function updateOrder(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to reorder categories.');
        }

        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:service_categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['categories'] as $categoryData) {
                ServiceCategory::where('id', $categoryData['id'])
                    ->update(['sort_order' => $categoryData['sort_order']]);
            }

            // Log admin action
            $admin->logAdminAction(
                'reordered',
                ServiceCategory::class,
                null,
                null,
                ['categories' => $validated['categories']],
                'Categories reordered'
            );

            DB::commit();

            return back()->with('success', 'Category order updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update category order: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a category
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete categories.');
        }

        $category = ServiceCategory::findOrFail($id);

        // Check if category has services
        $servicesCount = $category->services()->count();
        if ($servicesCount > 0) {
            return back()->with('error', "Cannot delete category with {$servicesCount} existing services. Deactivate instead.");
        }

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                ServiceCategory::class,
                $category->id,
                [
                    'name' => $category->name,
                    'slug' => $category->slug,
                ],
                null,
                'Category permanently deleted'
            );

            // Delete the category
            $category->delete();

            DB::commit();

            return redirect()->route('admin.categories.index')
                ->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete category: ' . $e->getMessage());
        }
    }
}
