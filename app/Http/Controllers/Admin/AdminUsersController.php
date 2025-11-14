<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminUsersController extends Controller
{
    // Define available admin roles
    const ADMIN_ROLES = [
        'super_admin' => 'Super Administrator',
        'content_manager' => 'Content Manager',
        'user_manager' => 'User Manager',
        'moderator' => 'Moderator',
        'support' => 'Support Staff',
        'analyst' => 'Analyst',
    ];

    // Define available permissions
    const PERMISSIONS = [
        'manage_content' => 'Manage Content (Products, Services, Events, Companies)',
        'manage_users' => 'Manage Users',
        'manage_providers' => 'Manage Service Providers',
        'manage_payments' => 'Manage Payments & Refunds',
        'manage_reviews' => 'Manage Reviews & Moderation',
        'manage_reports' => 'Access Reports & Analytics',
        'manage_settings' => 'Manage System Settings',
        'manage_admins' => 'Manage Admin Users',
    ];

    /**
     * Display a listing of admin users
     */
    public function index(Request $request)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can manage admin users.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status', 'all'); // all, active, suspended
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = User::where('is_admin', true)
            ->withCount(['adminLogs'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($q) use ($role) {
                return $q->where('admin_role', $role);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'active':
                        return $q->whereNull('deleted_at');
                    case 'suspended':
                        return $q->whereNotNull('deleted_at');
                }
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $adminUsers = $query->withTrashed()->paginate(20)->withQueryString();

        // Transform data for frontend
        $adminUsersData = $adminUsers->through(function ($admin) {
            return [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'admin_role' => $admin->admin_role,
                'admin_role_label' => self::ADMIN_ROLES[$admin->admin_role] ?? ucwords(str_replace('_', ' ', $admin->admin_role)),
                'admin_permissions' => $admin->admin_permissions ?? [],
                'admin_logs_count' => $admin->admin_logs_count,
                'is_suspended' => $admin->trashed(),
                'created_at' => $admin->created_at->format('M d, Y'),
                'deleted_at' => $admin->deleted_at?->format('M d, Y'),
            ];
        });

        // Get statistics
        $stats = [
            'total' => User::where('is_admin', true)->count(),
            'active' => User::where('is_admin', true)->count(),
            'suspended' => User::where('is_admin', true)->onlyTrashed()->count(),
            'super_admins' => User::where('is_admin', true)->where('admin_role', 'super_admin')->count(),
        ];

        return Inertia::render('Admin/AdminUsers/Index', [
            'admin' => [
                'id' => $currentAdmin->id,
                'name' => $currentAdmin->name,
                'email' => $currentAdmin->email,
                'admin_role' => $currentAdmin->admin_role,
            ],
            'adminUsers' => $adminUsersData,
            'stats' => $stats,
            'availableRoles' => self::ADMIN_ROLES,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new admin user
     */
    public function create()
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can create admin users.');
        }

        return Inertia::render('Admin/AdminUsers/Create', [
            'admin' => [
                'id' => $currentAdmin->id,
                'name' => $currentAdmin->name,
                'email' => $currentAdmin->email,
                'admin_role' => $currentAdmin->admin_role,
            ],
            'availableRoles' => self::ADMIN_ROLES,
            'availablePermissions' => self::PERMISSIONS,
        ]);
    }

    /**
     * Store a newly created admin user
     */
    public function store(Request $request)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can create admin users.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'admin_role' => 'required|in:' . implode(',', array_keys(self::ADMIN_ROLES)),
            'admin_permissions' => 'nullable|array',
            'admin_permissions.*' => 'in:' . implode(',', array_keys(self::PERMISSIONS)),
        ]);

        DB::beginTransaction();
        try {
            $validated['is_admin'] = true;
            $validated['role'] = 'admin';
            $validated['is_verified'] = true;
            $validated['password'] = Hash::make($validated['password']);

            $adminUser = User::create($validated);

            // Log admin action
            $currentAdmin->logAdminAction(
                'created',
                User::class,
                $adminUser->id,
                null,
                [
                    'name' => $adminUser->name,
                    'email' => $adminUser->email,
                    'admin_role' => $adminUser->admin_role,
                ],
                'Admin user created'
            );

            DB::commit();

            return redirect()->route('admin.admin-users.index')
                ->with('success', 'Admin user created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create admin user: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing an admin user
     */
    public function edit($id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can edit admin users.');
        }

        $adminUser = User::where('is_admin', true)
            ->withTrashed()
            ->withCount(['adminLogs'])
            ->findOrFail($id);

        return Inertia::render('Admin/AdminUsers/Edit', [
            'admin' => [
                'id' => $currentAdmin->id,
                'name' => $currentAdmin->name,
                'email' => $currentAdmin->email,
                'admin_role' => $currentAdmin->admin_role,
            ],
            'adminUser' => [
                'id' => $adminUser->id,
                'name' => $adminUser->name,
                'email' => $adminUser->email,
                'phone' => $adminUser->phone,
                'admin_role' => $adminUser->admin_role,
                'admin_permissions' => $adminUser->admin_permissions ?? [],
                'admin_logs_count' => $adminUser->admin_logs_count,
                'is_suspended' => $adminUser->trashed(),
                'created_at' => $adminUser->created_at->format('M d, Y H:i'),
            ],
            'availableRoles' => self::ADMIN_ROLES,
            'availablePermissions' => self::PERMISSIONS,
            'canEditSelf' => $currentAdmin->id === $adminUser->id,
        ]);
    }

    /**
     * Update an admin user
     */
    public function update(Request $request, $id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can edit admin users.');
        }

        $adminUser = User::where('is_admin', true)->withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'admin_role' => 'required|in:' . implode(',', array_keys(self::ADMIN_ROLES)),
            'admin_permissions' => 'nullable|array',
            'admin_permissions.*' => 'in:' . implode(',', array_keys(self::PERMISSIONS)),
        ]);

        // Prevent demoting the last super admin
        if ($adminUser->admin_role === 'super_admin' && $validated['admin_role'] !== 'super_admin') {
            $superAdminCount = User::where('is_admin', true)
                ->where('admin_role', 'super_admin')
                ->count();

            if ($superAdminCount <= 1) {
                return back()->with('error', 'Cannot change role of the last super administrator.');
            }
        }

        $oldValues = $adminUser->only(['name', 'email', 'phone', 'admin_role', 'admin_permissions']);

        DB::beginTransaction();
        try {
            // Hash password if provided
            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $adminUser->update($validated);

            // Log admin action
            $currentAdmin->logAdminAction(
                'updated',
                User::class,
                $adminUser->id,
                $oldValues,
                $adminUser->only(array_keys($oldValues)),
                'Admin user updated'
            );

            DB::commit();

            return redirect()->route('admin.admin-users.index')
                ->with('success', 'Admin user updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update admin user: ' . $e->getMessage());
        }
    }

    /**
     * Suspend an admin user (soft delete)
     */
    public function suspend($id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can suspend admin users.');
        }

        $adminUser = User::where('is_admin', true)->findOrFail($id);

        // Prevent suspending self
        if ($currentAdmin->id === $adminUser->id) {
            return back()->with('error', 'You cannot suspend your own account.');
        }

        // Prevent suspending the last super admin
        if ($adminUser->admin_role === 'super_admin') {
            $superAdminCount = User::where('is_admin', true)
                ->where('admin_role', 'super_admin')
                ->count();

            if ($superAdminCount <= 1) {
                return back()->with('error', 'Cannot suspend the last super administrator.');
            }
        }

        DB::beginTransaction();
        try {
            $adminUser->delete(); // Soft delete

            // Log admin action
            $currentAdmin->logAdminAction(
                'suspended',
                User::class,
                $adminUser->id,
                ['suspended' => false],
                ['suspended' => true],
                'Admin user suspended'
            );

            DB::commit();

            return back()->with('success', 'Admin user suspended successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to suspend admin user: ' . $e->getMessage());
        }
    }

    /**
     * Restore a suspended admin user
     */
    public function restore($id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can restore admin users.');
        }

        $adminUser = User::where('is_admin', true)->onlyTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            $adminUser->restore();

            // Log admin action
            $currentAdmin->logAdminAction(
                'restored',
                User::class,
                $adminUser->id,
                ['suspended' => true],
                ['suspended' => false],
                'Admin user restored'
            );

            DB::commit();

            return back()->with('success', 'Admin user restored successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to restore admin user: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete an admin user
     */
    public function destroy($id)
    {
        $currentAdmin = Auth::user();

        if (!$currentAdmin->isSuperAdmin()) {
            return back()->with('error', 'Only super administrators can delete admin users.');
        }

        $adminUser = User::where('is_admin', true)->withTrashed()->findOrFail($id);

        // Prevent deleting self
        if ($currentAdmin->id === $adminUser->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting the last super admin
        if ($adminUser->admin_role === 'super_admin') {
            $superAdminCount = User::where('is_admin', true)
                ->where('admin_role', 'super_admin')
                ->count();

            if ($superAdminCount <= 1) {
                return back()->with('error', 'Cannot delete the last super administrator.');
            }
        }

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $currentAdmin->logAdminAction(
                'deleted',
                User::class,
                $adminUser->id,
                [
                    'name' => $adminUser->name,
                    'email' => $adminUser->email,
                    'admin_role' => $adminUser->admin_role,
                ],
                null,
                'Admin user permanently deleted'
            );

            // Permanently delete
            $adminUser->forceDelete();

            DB::commit();

            return redirect()->route('admin.admin-users.index')
                ->with('success', 'Admin user deleted permanently.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete admin user: ' . $e->getMessage());
        }
    }
}
