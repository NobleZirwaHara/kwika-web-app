<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $role = $request->input('role', 'all'); // all, customer, provider
        $status = $request->input('status', 'all'); // all, verified, unverified
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = User::withTrashed()
            ->with(['serviceProvider', 'bookings', 'reviews'])
            ->withCount(['bookings', 'reviews'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('national_id', 'like', "%{$search}%");
                });
            })
            ->when($role !== 'all', function ($q) use ($role) {
                return $q->where('role', $role);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                if ($status === 'verified') {
                    return $q->where('is_verified', true);
                } else if ($status === 'unverified') {
                    return $q->where('is_verified', false);
                }
            })
            ->where('is_admin', false); // Exclude admin users

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $usersData = $users->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'national_id' => $user->national_id,
                'role' => $user->role,
                'is_verified' => $user->is_verified,
                'email_verified_at' => $user->email_verified_at?->format('M d, Y H:i'),
                'phone_verified_at' => $user->phone_verified_at?->format('M d, Y H:i'),
                'created_at' => $user->created_at->format('M d, Y'),
                'deleted_at' => $user->deleted_at?->format('M d, Y'),
                'is_banned' => $user->deleted_at !== null,
                'bookings_count' => $user->bookings_count,
                'reviews_count' => $user->reviews_count,
                'has_provider_account' => $user->serviceProvider !== null,
                'provider_id' => $user->serviceProvider?->id,
            ];
        });

        // Get statistics
        $stats = [
            'total' => User::where('is_admin', false)->count(),
            'customers' => User::where('is_admin', false)->where('role', 'customer')->count(),
            'providers' => User::where('is_admin', false)->where('role', 'provider')->count(),
            'verified' => User::where('is_admin', false)->where('is_verified', true)->count(),
            'banned' => User::where('is_admin', false)->onlyTrashed()->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'users' => $usersData,
            'stats' => $stats,
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
     * Show the form for editing a user
     */
    public function edit($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_users')) {
            return back()->with('error', 'You do not have permission to edit users.');
        }

        $user = User::withTrashed()
            ->with(['serviceProvider', 'bookings.service', 'reviews'])
            ->withCount(['bookings', 'reviews'])
            ->findOrFail($id);

        return Inertia::render('Admin/Users/Edit', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'national_id' => $user->national_id,
                'role' => $user->role,
                'is_verified' => $user->is_verified,
                'email_verified_at' => $user->email_verified_at?->format('M d, Y H:i'),
                'phone_verified_at' => $user->phone_verified_at?->format('M d, Y H:i'),
                'created_at' => $user->created_at->format('M d, Y H:i'),
                'deleted_at' => $user->deleted_at?->format('M d, Y H:i'),
                'is_banned' => $user->deleted_at !== null,
                'bookings_count' => $user->bookings_count,
                'reviews_count' => $user->reviews_count,
                'service_provider' => $user->serviceProvider ? [
                    'id' => $user->serviceProvider->id,
                    'business_name' => $user->serviceProvider->business_name,
                    'slug' => $user->serviceProvider->slug,
                    'verification_status' => $user->serviceProvider->verification_status,
                    'is_active' => $user->serviceProvider->is_active,
                ] : null,
                'recent_bookings' => $user->bookings->take(5)->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'service_name' => $booking->service->name ?? 'N/A',
                        'status' => $booking->status,
                        'total_amount' => $booking->total_amount,
                        'booking_date' => $booking->booking_date,
                        'created_at' => $booking->created_at->format('M d, Y'),
                    ];
                }),
                'recent_reviews' => $user->reviews->take(5)->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'is_approved' => $review->is_approved,
                        'created_at' => $review->created_at->format('M d, Y'),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_users')) {
            return back()->with('error', 'You do not have permission to edit users.');
        }

        $user = User::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'national_id' => 'nullable|string|max:50',
        ]);

        $oldValues = $user->only(array_keys($validated));

        DB::beginTransaction();
        try {
            $user->update($validated);

            // Log admin action
            $admin->logAdminAction(
                'updated',
                User::class,
                $user->id,
                $oldValues,
                $validated,
                'Updated user information'
            );

            DB::commit();

            return back()->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Verify a user's account
     */
    public function verify($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('verify_users')) {
            return back()->with('error', 'You do not have permission to verify users.');
        }

        $user = User::findOrFail($id);

        $oldValue = $user->is_verified;

        DB::beginTransaction();
        try {
            $user->update([
                'is_verified' => true,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'verified',
                User::class,
                $user->id,
                ['is_verified' => $oldValue],
                ['is_verified' => true],
                'User manually verified by admin'
            );

            DB::commit();

            return back()->with('success', 'User verified successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to verify user: ' . $e->getMessage());
        }
    }

    /**
     * Unverify a user's account
     */
    public function unverify($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('verify_users')) {
            return back()->with('error', 'You do not have permission to unverify users.');
        }

        $user = User::findOrFail($id);

        $oldValue = $user->is_verified;

        DB::beginTransaction();
        try {
            $user->update([
                'is_verified' => false,
            ]);

            // Log admin action
            $admin->logAdminAction(
                'unverified',
                User::class,
                $user->id,
                ['is_verified' => $oldValue],
                ['is_verified' => false],
                'User verification revoked by admin'
            );

            DB::commit();

            return back()->with('success', 'User verification revoked successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to unverify user: ' . $e->getMessage());
        }
    }

    /**
     * Ban a user (soft delete)
     */
    public function ban(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('ban_users')) {
            return back()->with('error', 'You do not have permission to ban users.');
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $user = User::findOrFail($id);

        DB::beginTransaction();
        try {
            // Soft delete the user
            $user->delete();

            // Log admin action
            $admin->logAdminAction(
                'banned',
                User::class,
                $user->id,
                ['deleted_at' => null],
                ['deleted_at' => now()],
                'User banned: ' . $request->input('reason')
            );

            DB::commit();

            return redirect()->route('admin.users.index')
                ->with('success', 'User banned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to ban user: ' . $e->getMessage());
        }
    }

    /**
     * Unban a user (restore soft delete)
     */
    public function unban($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('ban_users')) {
            return back()->with('error', 'You do not have permission to unban users.');
        }

        $user = User::withTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            // Restore the user
            $user->restore();

            // Log admin action
            $admin->logAdminAction(
                'unbanned',
                User::class,
                $user->id,
                ['deleted_at' => $user->deleted_at],
                ['deleted_at' => null],
                'User unbanned and restored'
            );

            DB::commit();

            return back()->with('success', 'User unbanned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to unban user: ' . $e->getMessage());
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can reset user passwords.');
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::withTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            $user->update([
                'password' => Hash::make($request->input('password')),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'reset_password',
                User::class,
                $user->id,
                null,
                null,
                'Password reset by super admin'
            );

            DB::commit();

            return back()->with('success', 'User password reset successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reset password: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a user
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can permanently delete users.');
        }

        $user = User::withTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'permanently_deleted',
                User::class,
                $user->id,
                [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                null,
                'User permanently deleted from system'
            );

            // Permanently delete
            $user->forceDelete();

            DB::commit();

            return redirect()->route('admin.users.index')
                ->with('success', 'User permanently deleted.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}
