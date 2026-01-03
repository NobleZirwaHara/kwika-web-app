<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of provider's bookings
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        $query = Booking::where('service_provider_id', $provider->id)
            ->with(['user', 'service', 'payments']);

        // Filter by booking status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by service
        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        // Filter by event date range
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }

        // Search by booking number or customer name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('booking_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'event_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $bookings = $query->paginate(25)->withQueryString();

        $bookings->getCollection()->transform(function ($booking) {
            return [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'customer_name' => $booking->user->name,
                'customer_email' => $booking->user->email,
                'service_name' => $booking->service->name,
                'event_date' => $booking->event_date->format('M d, Y g:i A'),
                'event_location' => $booking->event_location,
                'attendees' => $booking->attendees,
                'total_amount' => $booking->total_amount,
                'currency' => $booking->currency,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'created_at' => $booking->created_at->format('M d, Y'),
                'has_special_requests' => !empty($booking->special_requests),
            ];
        });

        // Get services for filter dropdown
        $services = Service::where('service_provider_id', $provider->id)
            ->active()
            ->get(['id', 'name']);

        // Get counts for tab badges
        $statusCounts = [
            'all' => Booking::where('service_provider_id', $provider->id)->count(),
            'pending' => Booking::where('service_provider_id', $provider->id)->where('status', 'pending')->count(),
            'confirmed' => Booking::where('service_provider_id', $provider->id)->where('status', 'confirmed')->count(),
            'completed' => Booking::where('service_provider_id', $provider->id)->where('status', 'completed')->count(),
            'cancelled' => Booking::where('service_provider_id', $provider->id)->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Provider/Bookings/Index', [
            'bookings' => $bookings,
            'services' => $services,
            'statusCounts' => $statusCounts,
            'filters' => [
                'status' => $request->status,
                'payment_status' => $request->payment_status,
                'service_id' => $request->service_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'search' => $request->search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Display the specified booking
     */
    public function show($id)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->with(['user', 'service', 'payments', 'review'])
            ->findOrFail($id);

        return Inertia::render('Provider/Bookings/Show', [
            'booking' => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,

                // Customer information
                'customer' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                    'phone' => $booking->user->phone ?? 'N/A',
                    'bookings_count' => Booking::where('user_id', $booking->user_id)
                        ->where('service_provider_id', $provider->id)
                        ->count(),
                ],

                // Service information
                'service' => [
                    'id' => $booking->service->id,
                    'name' => $booking->service->name,
                    'description' => $booking->service->description,
                    'base_price' => $booking->service->base_price,
                    'price_type' => $booking->service->price_type,
                    'duration' => $booking->service->duration,
                    'inclusions' => $booking->service->inclusions,
                ],

                // Event details
                'event_date' => $booking->event_date->format('Y-m-d\TH:i'),
                'event_date_formatted' => $booking->event_date->format('l, F d, Y \a\t g:i A'),
                'event_end_date' => $booking->event_end_date?->format('Y-m-d\TH:i'),
                'event_end_date_formatted' => $booking->event_end_date?->format('l, F d, Y \a\t g:i A'),
                'event_location' => $booking->event_location,
                'attendees' => $booking->attendees,
                'special_requests' => $booking->special_requests,

                // Financial information
                'total_amount' => $booking->total_amount,
                'deposit_amount' => $booking->deposit_amount,
                'remaining_amount' => $booking->remaining_amount,
                'currency' => $booking->currency,

                // Timestamps
                'created_at' => $booking->created_at->format('M d, Y g:i A'),
                'confirmed_at' => $booking->confirmed_at?->format('M d, Y g:i A'),
                'completed_at' => $booking->completed_at?->format('M d, Y g:i A'),
                'cancelled_at' => $booking->cancelled_at?->format('M d, Y g:i A'),
                'cancellation_reason' => $booking->cancellation_reason,

                // Payments
                'payments' => $booking->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'transaction_id' => $payment->transaction_id,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'payment_method' => $payment->payment_method,
                        'payment_gateway' => $payment->payment_gateway,
                        'status' => $payment->status,
                        'proof_of_payment' => $payment->proof_of_payment ? Storage::url($payment->proof_of_payment) : null,
                        'phone_number' => $payment->phone_number,
                        'paid_at' => $payment->paid_at?->format('M d, Y g:i A'),
                        'created_at' => $payment->created_at->format('M d, Y g:i A'),
                        'notes' => $payment->notes,
                    ];
                }),

                // Review (if exists)
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
     * Confirm a booking
     */
    public function confirm(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        $request->validate([
            'confirmation_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        // TODO: Send confirmation email/SMS to customer

        return redirect()->back()->with('success', 'Booking confirmed successfully');
    }

    /**
     * Mark booking as completed
     */
    public function complete($id)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->where('status', 'confirmed')
            ->findOrFail($id);

        // Check if event date has passed
        if ($booking->event_date->isFuture()) {
            return redirect()->back()->withErrors([
                'error' => 'Cannot mark booking as completed before the event date.'
            ]);
        }

        $booking->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // TODO: Send completion email/SMS and request review

        return redirect()->back()->with('success', 'Booking marked as completed');
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, $id)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->findOrFail($id);

        $request->validate([
            'cancellation_reason' => ['required', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        // TODO: Process refund if payment was made
        // TODO: Send cancellation email/SMS to customer

        return redirect()->back()->with('success', 'Booking cancelled successfully');
    }

    /**
     * Verify a payment (approve/reject)
     */
    public function verifyPayment(Request $request, $bookingId, $paymentId)
    {
        $provider = Auth::user()->serviceProvider;

        $booking = Booking::where('service_provider_id', $provider->id)
            ->findOrFail($bookingId);

        $payment = Payment::where('id', $paymentId)
            ->where('booking_id', $booking->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $request->validate([
            'action' => ['required', 'in:approve,reject'],
            'rejection_reason' => ['required_if:action,reject', 'string', 'max:500'],
        ]);

        if ($request->action === 'approve') {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            // Update booking payment status
            $totalPaid = $booking->payments()->where('status', 'completed')->sum('amount');

            if ($totalPaid >= $booking->total_amount) {
                $booking->update(['payment_status' => 'fully_paid']);
            } elseif ($totalPaid >= $booking->deposit_amount) {
                $booking->update(['payment_status' => 'deposit_paid']);
            }

            // Auto-confirm booking if fully paid
            if ($booking->payment_status === 'fully_paid' && $booking->status === 'pending') {
                $booking->update([
                    'status' => 'confirmed',
                    'confirmed_at' => now(),
                ]);
            }

            return redirect()->back()->with('success', 'Payment verified and approved');
        } else {
            $payment->update([
                'status' => 'failed',
                'notes' => $request->rejection_reason,
            ]);

            return redirect()->back()->with('success', 'Payment rejected. Customer will be notified.');
        }
    }

    /**
     * Export bookings as CSV
     */
    public function export(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $query = Booking::where('service_provider_id', $provider->id)
            ->with(['user', 'service']);

        // Apply same filters as index
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }

        $bookings = $query->orderBy('event_date')->get();

        $filename = 'bookings_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($bookings) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Booking Number',
                'Customer Name',
                'Customer Email',
                'Service',
                'Event Date',
                'Event Location',
                'Attendees',
                'Total Amount',
                'Currency',
                'Status',
                'Payment Status',
                'Created At',
            ]);

            // Data rows
            foreach ($bookings as $booking) {
                fputcsv($file, [
                    $booking->booking_number,
                    $booking->user->name,
                    $booking->user->email,
                    $booking->service->name,
                    $booking->event_date->format('Y-m-d H:i'),
                    $booking->event_location,
                    $booking->attendees ?? 'N/A',
                    $booking->total_amount,
                    $booking->currency,
                    $booking->status,
                    $booking->payment_status,
                    $booking->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
