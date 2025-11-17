<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Event;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Display the reports dashboard
     */
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        // Date range filter
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Overview Stats
        $overviewStats = [
            'total_users' => User::count(),
            'total_providers' => ServiceProvider::count(),
            'total_bookings' => Booking::count(),
            'total_events' => Event::count(),
            'total_products' => Product::count(),
            'total_promotions' => Promotion::count(),
        ];

        // Revenue Data (last 30 days)
        $revenueData = Booking::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as bookings')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                    'bookings' => $item->bookings,
                ];
            });

        // User Growth (last 30 days)
        $userGrowth = User::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as users')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'users' => $item->users,
                ];
            });

        // Booking Status Distribution
        $bookingsByStatus = Booking::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => ucfirst($item->status),
                    'value' => $item->count,
                ];
            });

        // Top Providers by Revenue
        $topProviders = Booking::join('service_providers', 'bookings.service_provider_id', '=', 'service_providers.id')
            ->selectRaw('service_providers.business_name, SUM(bookings.total_amount) as revenue, COUNT(bookings.id) as total_bookings')
            ->whereBetween('bookings.created_at', [$startDate, $endDate])
            ->groupBy('service_providers.id', 'service_providers.business_name')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->business_name,
                    'revenue' => (float) $item->revenue,
                    'bookings' => $item->total_bookings,
                ];
            });

        // Promotion Usage
        $promotionStats = Promotion::selectRaw('title, code, usage_count')
            ->orderByDesc('usage_count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'title' => $item->title,
                    'code' => $item->code,
                    'uses' => $item->usage_count,
                ];
            });

        return Inertia::render('Admin/Reports/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'overviewStats' => $overviewStats,
            'revenueData' => $revenueData,
            'userGrowth' => $userGrowth,
            'bookingsByStatus' => $bookingsByStatus,
            'topProviders' => $topProviders,
            'promotionStats' => $promotionStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Export reports to Excel
     */
    public function exportExcel(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return back()->with('error', 'Unauthorized access.');
        }

        // Note: Requires maatwebsite/excel package
        // Implementation placeholder
        return back()->with('info', 'Excel export functionality requires Laravel Excel package to be installed.');
    }

    /**
     * Export reports to PDF
     */
    public function exportPdf(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isAdmin()) {
            return back()->with('error', 'Unauthorized access.');
        }

        // Note: Requires barryvdh/laravel-dompdf package
        // Implementation placeholder
        return back()->with('info', 'PDF export functionality requires DomPDF package to be installed.');
    }

    /**
     * Revenue reports
     */
    public function revenue(Request $request)
    {
        // Detailed revenue analytics
        return $this->index($request);
    }

    /**
     * Booking reports
     */
    public function bookings(Request $request)
    {
        // Detailed booking analytics
        return $this->index($request);
    }

    /**
     * User reports
     */
    public function users(Request $request)
    {
        // Detailed user analytics
        return $this->index($request);
    }

    /**
     * Provider reports
     */
    public function providers(Request $request)
    {
        // Detailed provider analytics
        return $this->index($request);
    }

    /**
     * Product reports
     */
    public function products(Request $request)
    {
        // Detailed product analytics
        return $this->index($request);
    }

    /**
     * Promotion analytics
     */
    public function promotionsAnalytics(Request $request)
    {
        // Detailed promotion analytics
        return $this->index($request);
    }
}
