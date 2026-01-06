<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of user's bookings
     */
    public function index(Request $request)
    {
        $query = Booking::where('user_id', Auth::id())
            ->with(['service', 'servicePackage', 'serviceProvider', 'payments', 'review']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }

        $bookings = $query->latest()->paginate(15);

        // Format bookings for frontend
        $bookings->through(function ($booking) {
            return [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'service_name' => $booking->display_name,
                'service_type' => $booking->booking_type,
                'provider_name' => $booking->serviceProvider->business_name ?? 'N/A',
                'provider_logo' => $booking->serviceProvider->logo ?? null,
                'event_date' => $booking->event_date,
                'event_time' => $booking->start_time ? "{$booking->start_time} - {$booking->end_time}" : null,
                'event_location' => $booking->event_location,
                'total_amount' => $booking->total_amount,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'created_at' => $booking->created_at->toISOString(),
            ];
        });

        return Inertia::render('User/Bookings', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
        ]);
    }
}
