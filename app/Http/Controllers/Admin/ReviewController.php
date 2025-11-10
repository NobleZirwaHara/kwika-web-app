<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $status = $request->input('status', 'pending'); // all, pending, approved, rejected, featured
        $rating = $request->input('rating'); // 1-5
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Review::with(['user', 'serviceProvider', 'booking.service'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('comment', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== 'all', function ($q) use ($status) {
                switch ($status) {
                    case 'pending':
                        return $q->where('is_approved', false);
                    case 'approved':
                        return $q->where('is_approved', true);
                    case 'featured':
                        return $q->where('is_featured', true);
                }
            })
            ->when($rating, function ($q) use ($rating) {
                return $q->where('rating', $rating);
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $reviews = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $reviewsData = $reviews->through(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'is_approved' => $review->is_approved,
                'is_featured' => $review->is_featured,
                'is_verified' => $review->is_verified,
                'admin_response' => $review->admin_response,
                'responded_at' => $review->responded_at?->format('M d, Y H:i'),
                'created_at' => $review->created_at->format('M d, Y H:i'),
                'user' => [
                    'id' => $review->user->id,
                    'name' => $review->user->name,
                    'email' => $review->user->email,
                ],
                'service_provider' => [
                    'id' => $review->serviceProvider->id,
                    'business_name' => $review->serviceProvider->business_name,
                    'slug' => $review->serviceProvider->slug,
                ],
                'service' => $review->booking?->service ? [
                    'id' => $review->booking->service->id,
                    'name' => $review->booking->service->name,
                ] : null,
                'booking_id' => $review->booking_id,
            ];
        });

        // Get statistics
        $stats = [
            'total' => Review::count(),
            'pending' => Review::where('is_approved', false)->count(),
            'approved' => Review::where('is_approved', true)->count(),
            'featured' => Review::where('is_featured', true)->count(),
            'avg_rating' => round(Review::where('is_approved', true)->avg('rating') ?? 0, 1),
        ];

        return Inertia::render('Admin/Reviews/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'reviews' => $reviewsData,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'rating' => $rating,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Approve a review
     */
    public function approve($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('moderate_reviews')) {
            return back()->with('error', 'You do not have permission to approve reviews.');
        }

        $review = Review::with('serviceProvider')->findOrFail($id);

        $oldValue = $review->is_approved;

        DB::beginTransaction();
        try {
            $review->update(['is_approved' => true]);

            // Update provider's average rating and total reviews
            $provider = $review->serviceProvider;
            $provider->update([
                'average_rating' => $provider->reviews()->approved()->avg('rating'),
                'total_reviews' => $provider->reviews()->approved()->count(),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'approved',
                Review::class,
                $review->id,
                ['is_approved' => $oldValue],
                ['is_approved' => true],
                'Review approved'
            );

            DB::commit();

            return back()->with('success', 'Review approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve review: ' . $e->getMessage());
        }
    }

    /**
     * Reject a review
     */
    public function reject(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('moderate_reviews')) {
            return back()->with('error', 'You do not have permission to reject reviews.');
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $review = Review::findOrFail($id);

        $oldValue = $review->is_approved;

        DB::beginTransaction();
        try {
            // Mark as rejected (not approved)
            $review->update([
                'is_approved' => false,
                'is_featured' => false, // Remove featured status if rejected
            ]);

            // Log admin action
            $admin->logAdminAction(
                'rejected',
                Review::class,
                $review->id,
                ['is_approved' => $oldValue],
                ['is_approved' => false],
                'Review rejected' . ($request->input('reason') ? ': ' . $request->input('reason') : '')
            );

            DB::commit();

            return back()->with('success', 'Review rejected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject review: ' . $e->getMessage());
        }
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('moderate_reviews')) {
            return back()->with('error', 'You do not have permission to feature reviews.');
        }

        $review = Review::findOrFail($id);

        // Can only feature approved reviews
        if (!$review->is_approved && !$review->is_featured) {
            return back()->with('error', 'Only approved reviews can be featured.');
        }

        $oldValue = $review->is_featured;
        $review->update(['is_featured' => !$review->is_featured]);

        // Log admin action
        $admin->logAdminAction(
            $review->is_featured ? 'featured' : 'unfeatured',
            Review::class,
            $review->id,
            ['is_featured' => $oldValue],
            ['is_featured' => $review->is_featured],
            $review->is_featured ? 'Review featured' : 'Review unfeatured'
        );

        return back()->with('success', 'Featured status updated successfully.');
    }

    /**
     * Add admin response to a review
     */
    public function respond(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('moderate_reviews')) {
            return back()->with('error', 'You do not have permission to respond to reviews.');
        }

        $request->validate([
            'response' => 'required|string|max:1000',
        ]);

        $review = Review::findOrFail($id);

        $oldResponse = $review->admin_response;

        DB::beginTransaction();
        try {
            $review->update([
                'admin_response' => $request->input('response'),
                'responded_at' => now(),
            ]);

            // Log admin action
            $admin->logAdminAction(
                'responded',
                Review::class,
                $review->id,
                ['admin_response' => $oldResponse],
                ['admin_response' => $request->input('response')],
                'Admin response added to review'
            );

            DB::commit();

            return back()->with('success', 'Response added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to add response: ' . $e->getMessage());
        }
    }

    /**
     * Delete admin response from a review
     */
    public function deleteResponse($id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('moderate_reviews')) {
            return back()->with('error', 'You do not have permission to delete responses.');
        }

        $review = Review::findOrFail($id);

        $oldResponse = $review->admin_response;

        DB::beginTransaction();
        try {
            $review->update([
                'admin_response' => null,
                'responded_at' => null,
            ]);

            // Log admin action
            $admin->logAdminAction(
                'deleted_response',
                Review::class,
                $review->id,
                ['admin_response' => $oldResponse],
                ['admin_response' => null],
                'Admin response deleted from review'
            );

            DB::commit();

            return back()->with('success', 'Response deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete response: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a review
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete reviews.');
        }

        $review = Review::with('serviceProvider')->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Review::class,
                $review->id,
                [
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                ],
                null,
                'Review permanently deleted'
            );

            $provider = $review->serviceProvider;

            // Delete the review
            $review->delete();

            // Update provider's average rating and total reviews
            $provider->update([
                'average_rating' => $provider->reviews()->approved()->avg('rating'),
                'total_reviews' => $provider->reviews()->approved()->count(),
            ]);

            DB::commit();

            return back()->with('success', 'Review deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete review: ' . $e->getMessage());
        }
    }
}
