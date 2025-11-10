<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        if (! $provider) {
            return redirect()->route('onboarding.step1');
        }

        // Calculate stats
        $thisMonthRevenue = $provider->bookings()
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        $lastMonthRevenue = $provider->bookings()
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_amount');

        $revenueChange = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $thisMonthBookings = $provider->bookings()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $lastMonthBookings = $provider->bookings()
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        $bookingsChange = $lastMonthBookings > 0
            ? round((($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100, 1)
            : 0;

        $stats = [
            'total_revenue' => $provider->bookings()->whereIn('payment_status', ['fully_paid', 'deposit_paid'])->sum('total_amount'),
            'pending_bookings' => $provider->bookings()->where('status', 'pending')->count(),
            'active_services' => $provider->services()->where('is_active', true)->count(),
            'profile_views' => 0, // TODO: Implement view tracking
            'this_month_revenue' => $thisMonthRevenue,
            'this_month_bookings' => $thisMonthBookings,
            'revenue_change' => $revenueChange,
            'bookings_change' => $bookingsChange,
        ];

        // Recent bookings
        $recent_bookings = $provider->bookings()
            ->with(['user', 'service'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number,
                    'user_name' => $booking->user->name,
                    'service_name' => $booking->service->name,
                    'event_date' => $booking->event_date,
                    'total_amount' => (float) $booking->total_amount,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                ];
            });

        // Upcoming events
        $upcoming_events = $provider->bookings()
            ->with(['user', 'service'])
            ->where('status', 'confirmed')
            ->where('event_date', '>=', now())
            ->orderBy('event_date')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'service_name' => $booking->service->name,
                    'event_date' => $booking->event_date->format('Y-m-d'),
                    'event_time' => $booking->event_date->format('H:i'),
                    'client_name' => $booking->user->name,
                ];
            });

        return Inertia::render('Provider/Dashboard', [
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'logo' => $provider->logo,
                'verification_status' => $provider->verification_status,
                'average_rating' => (float) $provider->average_rating,
                'total_reviews' => $provider->total_reviews,
                'total_bookings' => $provider->total_bookings,
            ],
            'stats' => $stats,
            'recent_bookings' => $recent_bookings,
            'upcoming_events' => $upcoming_events,
        ]);
    }
}
