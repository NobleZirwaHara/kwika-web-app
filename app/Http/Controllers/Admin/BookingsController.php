<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ServiceProvider;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingsController extends Controller
{
    /**
     * Display a listing of bookings
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Get filter parameters
        $search = $request->input('search');
        $provider = $request->input('provider');
        $service = $request->input('service');
        $status = $request->input('status', 'all');
        $paymentStatus = $request->input('payment_status', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Build query
        $query = Booking::with(['user', 'service', 'serviceProvider'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($query) use ($search) {
                    $query->where('booking_number', 'like', "%{$search}%")
                        ->orWhere('event_location', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('serviceProvider', function ($q) use ($search) {
                            $q->where('business_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($provider, function ($q) use ($provider) {
                return $q->where('service_provider_id', $provider);
            })
            ->when($service, function ($q) use ($service) {
                return $q->where('service_id', $service);
            })
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($paymentStatus !== 'all', function ($q) use ($paymentStatus) {
                return $q->where('payment_status', $paymentStatus);
            })
            ->when($dateFrom, function ($q) use ($dateFrom) {
                return $q->where('event_date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($q) use ($dateTo) {
                return $q->where('event_date', '<=', $dateTo);
            });

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $bookings = $query->paginate(20)->withQueryString();

        // Transform data for frontend
        $bookingsData = $bookings->through(function ($booking) {
            return [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'event_date' => $booking->event_date->format('Y-m-d'),
                'event_date_formatted' => $booking->event_date->format('M d, Y'),
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'event_location' => $booking->event_location,
                'attendees' => $booking->attendees,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'created_at' => $booking->created_at->format('M d, Y H:i'),
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                ],
                'service' => $booking->service ? [
                    'id' => $booking->service->id,
                    'name' => $booking->service->name,
                ] : null,
                'service_provider' => [
                    'id' => $booking->serviceProvider->id,
                    'business_name' => $booking->serviceProvider->business_name,
                    'slug' => $booking->serviceProvider->slug,
                ],
            ];
        });

        // Get statistics
        $stats = [
            'total' => Booking::count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
            'total_revenue' => Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_amount'),
            'pending_amount' => Booking::where('payment_status', 'pending')->sum('total_amount'),
        ];

        // Get providers and services for filters
        $providers = ServiceProvider::verified()
            ->select('id', 'business_name', 'slug')
            ->orderBy('business_name')
            ->get();

        $services = Service::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Bookings/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'bookings' => $bookingsData,
            'stats' => $stats,
            'providers' => $providers,
            'services' => $services,
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'service' => $service,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show booking details
     */
    public function show($id)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        $booking = Booking::with([
            'user',
            'service',
            'serviceProvider',
            'payments',
            'review',
        ])->findOrFail($id);

        return Inertia::render('Admin/Bookings/Show', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'event_date' => $booking->event_date->format('Y-m-d'),
                'event_date_formatted' => $booking->event_date->format('F d, Y'),
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'event_end_date' => $booking->event_end_date?->format('F d, Y'),
                'event_location' => $booking->event_location,
                'event_latitude' => $booking->event_latitude,
                'event_longitude' => $booking->event_longitude,
                'attendees' => $booking->attendees,
                'special_requests' => $booking->special_requests,
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'cancellation_reason' => $booking->cancellation_reason,
                'cancelled_at' => $booking->cancelled_at?->format('M d, Y H:i'),
                'confirmed_at' => $booking->confirmed_at?->format('M d, Y H:i'),
                'completed_at' => $booking->completed_at?->format('M d, Y H:i'),
                'created_at' => $booking->created_at->format('M d, Y H:i'),
                'updated_at' => $booking->updated_at->format('M d, Y H:i'),
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                    'phone' => $booking->user->phone,
                ],
                'service' => $booking->service ? [
                    'id' => $booking->service->id,
                    'name' => $booking->service->name,
                    'category' => $booking->service->category,
                ] : null,
                'service_provider' => [
                    'id' => $booking->serviceProvider->id,
                    'business_name' => $booking->serviceProvider->business_name,
                    'email' => $booking->serviceProvider->email,
                    'phone' => $booking->serviceProvider->phone,
                    'slug' => $booking->serviceProvider->slug,
                ],
                'payments' => $booking->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'amount' => $payment->amount,
                        'payment_method' => $payment->payment_method,
                        'status' => $payment->status,
                        'transaction_id' => $payment->transaction_id,
                        'created_at' => $payment->created_at->format('M d, Y H:i'),
                    ];
                }),
                'review' => $booking->review ? [
                    'id' => $booking->review->id,
                    'rating' => $booking->review->rating,
                    'comment' => $booking->review->comment,
                    'created_at' => $booking->review->created_at->format('M d, Y'),
                ] : null,
            ],
        ]);
    }

    /**
     * Update booking status
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to update booking status.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'cancellation_reason' => 'nullable|required_if:status,cancelled|string',
        ]);

        $booking = Booking::findOrFail($id);

        $oldStatus = $booking->status;

        DB::beginTransaction();
        try {
            // Update status
            $booking->status = $validated['status'];

            // Set timestamps based on status
            switch ($validated['status']) {
                case 'confirmed':
                    if (!$booking->confirmed_at) {
                        $booking->confirmed_at = now();
                    }
                    break;
                case 'completed':
                    if (!$booking->completed_at) {
                        $booking->completed_at = now();
                    }
                    break;
                case 'cancelled':
                    $booking->cancelled_at = now();
                    $booking->cancellation_reason = $validated['cancellation_reason'] ?? null;
                    break;
            }

            $booking->save();

            // Log admin action
            $admin->logAdminAction(
                'status_changed',
                Booking::class,
                $booking->id,
                ['status' => $oldStatus],
                ['status' => $booking->status],
                "Booking status changed from {$oldStatus} to {$booking->status}"
            );

            DB::commit();

            return back()->with('success', 'Booking status updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update booking status: ' . $e->getMessage());
        }
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin->canAdmin('manage_content')) {
            return back()->with('error', 'You do not have permission to update payment status.');
        }

        $validated = $request->validate([
            'payment_status' => 'required|in:pending,partial,paid,refunded',
        ]);

        $booking = Booking::findOrFail($id);

        $oldPaymentStatus = $booking->payment_status;

        DB::beginTransaction();
        try {
            $booking->update(['payment_status' => $validated['payment_status']]);

            // Log admin action
            $admin->logAdminAction(
                'payment_status_changed',
                Booking::class,
                $booking->id,
                ['payment_status' => $oldPaymentStatus],
                ['payment_status' => $booking->payment_status],
                "Payment status changed from {$oldPaymentStatus} to {$booking->payment_status}"
            );

            DB::commit();

            return back()->with('success', 'Payment status updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update payment status: ' . $e->getMessage());
        }
    }

    /**
     * Delete a booking (super admin only)
     */
    public function destroy($id)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can delete bookings.');
        }

        $booking = Booking::with(['user', 'serviceProvider'])->findOrFail($id);

        DB::beginTransaction();
        try {
            // Log admin action before deletion
            $admin->logAdminAction(
                'deleted',
                Booking::class,
                $booking->id,
                [
                    'booking_number' => $booking->booking_number,
                    'user' => $booking->user->name,
                    'provider' => $booking->serviceProvider->business_name,
                    'total_amount' => $booking->total_amount,
                    'status' => $booking->status,
                ],
                null,
                'Booking permanently deleted'
            );

            // Delete the booking (soft delete)
            $booking->delete();

            DB::commit();

            return redirect()->route('admin.bookings.index')
                ->with('success', 'Booking deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete booking: ' . $e->getMessage());
        }
    }
}
