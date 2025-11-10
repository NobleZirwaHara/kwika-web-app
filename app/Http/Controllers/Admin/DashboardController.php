<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ServiceProvider;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Key metrics
        $stats = [
            'total_users' => User::count(),
            'total_providers' => ServiceProvider::count(),
            'pending_verifications' => ServiceProvider::where('verification_status', 'pending')->count(),
            'total_revenue' => Booking::whereIn('payment_status', ['fully_paid', 'deposit_paid'])->sum('total_amount'),
            'this_month_revenue' => Booking::whereIn('payment_status', ['fully_paid', 'deposit_paid'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total_amount'),
            'total_bookings' => Booking::count(),
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'active_services' => Service::where('is_active', true)->count(),
        ];

        // Recent users (last 7 days)
        $recentUsers = User::where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_verified' => $user->is_verified,
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            });

        // Pending provider verifications
        $pendingProviders = ServiceProvider::where('verification_status', 'pending')
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->take(5)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'business_name' => $provider->business_name,
                    'owner_name' => $provider->user->name,
                    'email' => $provider->user->email,
                    'created_at' => $provider->created_at->format('M d, Y'),
                    'days_waiting' => $provider->created_at->diffInDays(now()),
                ];
            });

        // Revenue trend (last 30 days)
        $revenueTrend = Booking::whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as revenue'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                ];
            });

        // User growth (last 30 days)
        $userGrowth = User::where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'count' => $item->count,
                ];
            });

        // Booking status distribution
        $bookingStats = [
            ['status' => 'Pending', 'count' => Booking::where('status', 'pending')->count()],
            ['status' => 'Confirmed', 'count' => Booking::where('status', 'confirmed')->count()],
            ['status' => 'Completed', 'count' => Booking::where('status', 'completed')->count()],
            ['status' => 'Cancelled', 'count' => Booking::where('status', 'cancelled')->count()],
        ];

        // Top providers by revenue (this month)
        $topProviders = ServiceProvider::join('bookings', 'service_providers.id', '=', 'bookings.service_provider_id')
            ->whereMonth('bookings.created_at', now()->month)
            ->whereYear('bookings.created_at', now()->year)
            ->whereIn('bookings.payment_status', ['fully_paid', 'deposit_paid'])
            ->select('service_providers.id', 'service_providers.business_name', DB::raw('SUM(bookings.total_amount) as revenue'))
            ->groupBy('service_providers.id', 'service_providers.business_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'business_name' => $item->business_name,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Recent payments
        $recentPayments = Payment::with(['booking.user', 'booking.service'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'amount' => (float) $payment->amount,
                    'currency' => $payment->currency,
                    'payment_method' => $payment->payment_method,
                    'status' => $payment->status,
                    'customer_name' => $payment->booking->user->name,
                    'service_name' => $payment->booking->service->name ?? 'N/A',
                    'created_at' => $payment->created_at->format('M d, Y H:i'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'stats' => $stats,
            'recent_users' => $recentUsers,
            'pending_providers' => $pendingProviders,
            'revenue_trend' => $revenueTrend,
            'user_growth' => $userGrowth,
            'booking_stats' => $bookingStats,
            'top_providers' => $topProviders,
            'recent_payments' => $recentPayments,
        ]);
    }
}
