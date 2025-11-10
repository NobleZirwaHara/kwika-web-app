<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Main analytics dashboard
     */
    public function index(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('onboarding.welcome')
                ->with('error', 'Please complete provider onboarding first');
        }

        // Date range filter (default: last 30 days)
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // KPI Metrics
        $totalRevenue = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        $totalBookings = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $confirmedBookings = Booking::where('service_provider_id', $provider->id)
            ->where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $conversionRate = $totalBookings > 0
            ? round(($confirmedBookings / $totalBookings) * 100, 1)
            : 0;

        $averageRating = Review::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->avg('rating');

        $averageRating = $averageRating ? round($averageRating, 1) : 0;

        $averageBookingValue = $totalBookings > 0
            ? round($totalRevenue / $totalBookings, 2)
            : 0;

        $cancellationRate = $totalBookings > 0
            ? round((Booking::where('service_provider_id', $provider->id)
                ->where('status', 'cancelled')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count() / $totalBookings) * 100, 1)
            : 0;

        // Revenue trend (daily for last 30 days)
        $revenueTrend = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$startDate, $endDate])
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

        // Booking status distribution
        $statusDistribution = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                ];
            });

        // Top services by revenue
        $topServices = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->join('services', 'bookings.service_id', '=', 'services.id')
            ->select('services.name', DB::raw('SUM(bookings.total_amount) as revenue'), DB::raw('COUNT(bookings.id) as bookings'))
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($provider) {
                return [
                    'name' => $item->name,
                    'revenue' => (float) $item->revenue,
                    'bookings' => $item->bookings,
                    'currency' => $provider->currency ?? 'MWK',
                ];
            });

        // Payment method distribution
        $paymentMethods = Payment::whereHas('booking', function ($query) use ($provider) {
                $query->where('service_provider_id', $provider->id);
            })
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('payment_method', DB::raw('count(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => str_replace('_', ' ', ucwords($item->payment_method, '_')),
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        // Compare with previous period
        $previousStartDate = Carbon::parse($startDate)->sub(Carbon::parse($endDate)->diffInDays($startDate), 'days');
        $previousEndDate = Carbon::parse($startDate)->subDay();

        $previousRevenue = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->sum('total_amount');

        $revenueChange = $previousRevenue > 0
            ? round((($totalRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : 0;

        $previousBookings = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->count();

        $bookingsChange = $previousBookings > 0
            ? round((($totalBookings - $previousBookings) / $previousBookings) * 100, 1)
            : 0;

        return Inertia::render('Provider/Analytics/Index', [
            'dateRange' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'kpis' => [
                'total_revenue' => $totalRevenue,
                'total_bookings' => $totalBookings,
                'conversion_rate' => $conversionRate,
                'average_rating' => $averageRating,
                'average_booking_value' => $averageBookingValue,
                'cancellation_rate' => $cancellationRate,
                'revenue_change' => $revenueChange,
                'bookings_change' => $bookingsChange,
            ],
            'revenue_trend' => $revenueTrend,
            'status_distribution' => $statusDistribution,
            'top_services' => $topServices,
            'payment_methods' => $paymentMethods,
            'currency' => $provider->currency ?? 'MWK',
        ]);
    }

    /**
     * Detailed revenue analytics
     */
    public function revenue(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        $groupBy = $request->input('group_by', 'day'); // day, week, month

        // Revenue by period
        $dateFormat = match($groupBy) {
            'week' => '%Y-W%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $revenueTrend = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($groupBy) {
                $label = match($groupBy) {
                    'week' => 'Week ' . explode('-W', $item->period)[1],
                    'month' => Carbon::parse($item->period . '-01')->format('M Y'),
                    default => Carbon::parse($item->period)->format('M d'),
                };

                return [
                    'period' => $label,
                    'revenue' => (float) $item->revenue,
                    'bookings' => $item->bookings,
                ];
            });

        // Revenue by service
        $revenueByService = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->join('services', 'bookings.service_id', '=', 'services.id')
            ->select(
                'services.name',
                DB::raw('SUM(bookings.total_amount) as revenue'),
                DB::raw('COUNT(bookings.id) as bookings'),
                DB::raw('AVG(bookings.total_amount) as avg_value')
            )
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'revenue' => (float) $item->revenue,
                    'bookings' => $item->bookings,
                    'avg_value' => round((float) $item->avg_value, 2),
                ];
            });

        // Deposit vs full payment
        $depositVsFull = [
            'deposit_only' => Booking::where('service_provider_id', $provider->id)
                ->where('payment_status', 'deposit_paid')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('deposit_amount'),
            'fully_paid' => Booking::where('service_provider_id', $provider->id)
                ->where('payment_status', 'fully_paid')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount'),
        ];

        // Revenue summary
        $summary = [
            'total_revenue' => Booking::where('service_provider_id', $provider->id)
                ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount'),
            'pending_revenue' => Booking::where('service_provider_id', $provider->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('payment_status', 'deposit_paid')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('remaining_amount'),
            'refunded_revenue' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'cancelled')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount'),
        ];

        return Inertia::render('Provider/Analytics/Revenue', [
            'dateRange' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'groupBy' => $groupBy,
            'revenue_trend' => $revenueTrend,
            'revenue_by_service' => $revenueByService,
            'deposit_vs_full' => $depositVsFull,
            'summary' => $summary,
            'currency' => $provider->currency ?? 'MWK',
        ]);
    }

    /**
     * Booking analytics
     */
    public function bookings(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Booking volume over time
        $bookingVolume = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
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

        // Status funnel
        $statusFunnel = [
            ['status' => 'Pending', 'count' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'pending')
                ->whereBetween('created_at', [$startDate, $endDate])->count()],
            ['status' => 'Confirmed', 'count' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])->count()],
            ['status' => 'Completed', 'count' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])->count()],
            ['status' => 'Cancelled', 'count' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'cancelled')
                ->whereBetween('created_at', [$startDate, $endDate])->count()],
        ];

        // Cancellation trend
        $totalBookings = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $cancelledBookings = Booking::where('service_provider_id', $provider->id)
            ->where('status', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Average booking value trend
        $avgBookingValue = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('AVG(total_amount) as avg_value'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'avg_value' => round((float) $item->avg_value, 2),
                ];
            });

        // Booking by day of week
        $bookingByDayOfWeek = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('event_date', [$startDate, $endDate])
            ->select(DB::raw('DAYOFWEEK(event_date) as day'), DB::raw('COUNT(*) as count'))
            ->groupBy('day')
            ->get()
            ->map(function ($item) {
                $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return [
                    'day' => $days[$item->day - 1],
                    'count' => $item->count,
                ];
            });

        // Summary stats
        $summary = [
            'total_bookings' => $totalBookings,
            'confirmed_bookings' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])->count(),
            'completed_bookings' => Booking::where('service_provider_id', $provider->id)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])->count(),
            'cancelled_bookings' => $cancelledBookings,
            'conversion_rate' => $totalBookings > 0
                ? round((Booking::where('service_provider_id', $provider->id)
                    ->where('status', 'confirmed')
                    ->whereBetween('created_at', [$startDate, $endDate])->count() / $totalBookings) * 100, 1)
                : 0,
            'cancellation_rate' => $totalBookings > 0
                ? round(($cancelledBookings / $totalBookings) * 100, 1)
                : 0,
            'avg_booking_value' => $totalBookings > 0
                ? round(Booking::where('service_provider_id', $provider->id)
                    ->whereBetween('created_at', [$startDate, $endDate])->avg('total_amount'), 2)
                : 0,
        ];

        return Inertia::render('Provider/Analytics/Bookings', [
            'dateRange' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'booking_volume' => $bookingVolume,
            'status_funnel' => $statusFunnel,
            'avg_booking_value' => $avgBookingValue,
            'booking_by_day' => $bookingByDayOfWeek,
            'summary' => $summary,
            'currency' => $provider->currency ?? 'MWK',
        ]);
    }

    /**
     * Service performance analytics
     */
    public function services(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Service performance comparison
        $servicePerformance = Service::where('service_provider_id', $provider->id)
            ->leftJoin('bookings', function ($join) use ($startDate, $endDate) {
                $join->on('services.id', '=', 'bookings.service_id')
                    ->whereBetween('bookings.created_at', [$startDate, $endDate]);
            })
            ->select(
                'services.id',
                'services.name',
                'services.base_price',
                'services.is_active',
                DB::raw('COUNT(bookings.id) as total_bookings'),
                DB::raw('SUM(CASE WHEN bookings.payment_status IN ("fully_paid", "deposit_paid") THEN bookings.total_amount ELSE 0 END) as revenue'),
                DB::raw('SUM(CASE WHEN bookings.status = "confirmed" THEN 1 ELSE 0 END) as confirmed_bookings'),
                DB::raw('SUM(CASE WHEN bookings.status = "cancelled" THEN 1 ELSE 0 END) as cancelled_bookings')
            )
            ->groupBy('services.id', 'services.name', 'services.base_price', 'services.is_active')
            ->get()
            ->map(function ($item) {
                $conversionRate = $item->total_bookings > 0
                    ? round(($item->confirmed_bookings / $item->total_bookings) * 100, 1)
                    : 0;

                $cancellationRate = $item->total_bookings > 0
                    ? round(($item->cancelled_bookings / $item->total_bookings) * 100, 1)
                    : 0;

                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'base_price' => (float) $item->base_price,
                    'is_active' => (bool) $item->is_active,
                    'total_bookings' => $item->total_bookings,
                    'revenue' => (float) $item->revenue,
                    'conversion_rate' => $conversionRate,
                    'cancellation_rate' => $cancellationRate,
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        // Service revenue contribution (pie chart)
        $revenueContribution = $servicePerformance->map(function ($item) {
            return [
                'name' => $item['name'],
                'value' => $item['revenue'],
            ];
        })->filter(function ($item) {
            return $item['value'] > 0;
        })->values();

        // Service popularity trend
        $popularityTrend = Service::where('service_provider_id', $provider->id)
            ->join('bookings', 'services.id', '=', 'bookings.service_id')
            ->whereBetween('bookings.created_at', [$startDate, $endDate])
            ->select(
                'services.name',
                DB::raw('DATE(bookings.created_at) as date'),
                DB::raw('COUNT(bookings.id) as bookings')
            )
            ->groupBy('services.id', 'services.name', 'date')
            ->orderBy('date')
            ->get()
            ->groupBy('name')
            ->map(function ($items, $name) {
                return [
                    'name' => $name,
                    'data' => $items->map(function ($item) {
                        return [
                            'date' => Carbon::parse($item->date)->format('M d'),
                            'bookings' => $item->bookings,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Provider/Analytics/Services', [
            'dateRange' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'service_performance' => $servicePerformance,
            'revenue_contribution' => $revenueContribution,
            'popularity_trend' => $popularityTrend,
            'currency' => $provider->currency ?? 'MWK',
        ]);
    }

    /**
     * Customer analytics
     */
    public function customers(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Top customers
        $topCustomers = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->join('users', 'bookings.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(bookings.id) as total_bookings'),
                DB::raw('SUM(CASE WHEN bookings.payment_status IN ("fully_paid", "deposit_paid") THEN bookings.total_amount ELSE 0 END) as lifetime_value')
            )
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('lifetime_value')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'email' => $item->email,
                    'total_bookings' => $item->total_bookings,
                    'lifetime_value' => (float) $item->lifetime_value,
                ];
            });

        // New vs returning customers
        $allCustomerIds = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->pluck('user_id')
            ->unique();

        $returningCustomerIds = Booking::where('service_provider_id', $provider->id)
            ->whereIn('user_id', $allCustomerIds)
            ->where('created_at', '<', $startDate)
            ->pluck('user_id')
            ->unique();

        $newCustomers = $allCustomerIds->count() - $returningCustomerIds->count();
        $returningCustomers = $returningCustomerIds->count();

        // Customer retention (repeat rate)
        $totalUniqueCustomers = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->distinct('user_id')
            ->count('user_id');

        $repeatCustomers = Booking::where('service_provider_id', $provider->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('user_id', DB::raw('COUNT(*) as booking_count'))
            ->groupBy('user_id')
            ->having('booking_count', '>', 1)
            ->count();

        $repeatRate = $totalUniqueCustomers > 0
            ? round(($repeatCustomers / $totalUniqueCustomers) * 100, 1)
            : 0;

        // Customer lifetime value distribution
        $clvDistribution = Booking::where('service_provider_id', $provider->id)
            ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
            ->select('user_id', DB::raw('SUM(total_amount) as total_spent'))
            ->groupBy('user_id')
            ->get()
            ->map(function ($item) {
                $value = (float) $item->total_spent;
                if ($value < 50000) return '0-50K';
                if ($value < 100000) return '50K-100K';
                if ($value < 200000) return '100K-200K';
                if ($value < 500000) return '200K-500K';
                return '500K+';
            })
            ->countBy()
            ->map(function ($count, $range) {
                return ['range' => $range, 'count' => $count];
            })
            ->values();

        // Summary stats
        $summary = [
            'total_customers' => $totalUniqueCustomers,
            'new_customers' => $newCustomers,
            'returning_customers' => $returningCustomers,
            'repeat_rate' => $repeatRate,
            'avg_customer_value' => $totalUniqueCustomers > 0
                ? round(Booking::where('service_provider_id', $provider->id)
                    ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount') / $totalUniqueCustomers, 2)
                : 0,
        ];

        return Inertia::render('Provider/Analytics/Customers', [
            'dateRange' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'top_customers' => $topCustomers,
            'new_vs_returning' => [
                ['type' => 'New', 'count' => $newCustomers],
                ['type' => 'Returning', 'count' => $returningCustomers],
            ],
            'clv_distribution' => $clvDistribution,
            'summary' => $summary,
            'currency' => $provider->currency ?? 'MWK',
        ]);
    }

    /**
     * Export analytics report
     */
    public function export(Request $request)
    {
        $provider = Auth::user()->serviceProvider;

        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        $type = $request->input('type', 'overview'); // overview, revenue, bookings, services, customers

        $filename = "analytics_{$type}_" . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($provider, $startDate, $endDate, $type) {
            $file = fopen('php://output', 'w');

            switch ($type) {
                case 'revenue':
                    fputcsv($file, ['Date', 'Service', 'Booking Number', 'Amount', 'Payment Status', 'Status']);

                    Booking::where('service_provider_id', $provider->id)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->with('service')
                        ->orderBy('created_at')
                        ->chunk(100, function ($bookings) use ($file) {
                            foreach ($bookings as $booking) {
                                fputcsv($file, [
                                    $booking->created_at->format('Y-m-d'),
                                    $booking->service->name,
                                    $booking->booking_number,
                                    $booking->total_amount,
                                    $booking->payment_status,
                                    $booking->status,
                                ]);
                            }
                        });
                    break;

                case 'services':
                    fputcsv($file, ['Service', 'Base Price', 'Total Bookings', 'Revenue', 'Confirmed', 'Cancelled']);

                    Service::where('service_provider_id', $provider->id)
                        ->leftJoin('bookings', function ($join) use ($startDate, $endDate) {
                            $join->on('services.id', '=', 'bookings.service_id')
                                ->whereBetween('bookings.created_at', [$startDate, $endDate]);
                        })
                        ->select(
                            'services.name',
                            'services.base_price',
                            DB::raw('COUNT(bookings.id) as total_bookings'),
                            DB::raw('SUM(CASE WHEN bookings.payment_status IN ("fully_paid", "deposit_paid") THEN bookings.total_amount ELSE 0 END) as revenue'),
                            DB::raw('SUM(CASE WHEN bookings.status = "confirmed" THEN 1 ELSE 0 END) as confirmed'),
                            DB::raw('SUM(CASE WHEN bookings.status = "cancelled" THEN 1 ELSE 0 END) as cancelled')
                        )
                        ->groupBy('services.id', 'services.name', 'services.base_price')
                        ->get()
                        ->each(function ($service) use ($file) {
                            fputcsv($file, [
                                $service->name,
                                $service->base_price,
                                $service->total_bookings,
                                $service->revenue ?? 0,
                                $service->confirmed ?? 0,
                                $service->cancelled ?? 0,
                            ]);
                        });
                    break;

                default: // overview
                    fputcsv($file, ['Metric', 'Value']);

                    $totalRevenue = Booking::where('service_provider_id', $provider->id)
                        ->whereIn('payment_status', ['fully_paid', 'deposit_paid'])
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->sum('total_amount');

                    $totalBookings = Booking::where('service_provider_id', $provider->id)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->count();

                    $avgRating = Review::where('service_provider_id', $provider->id)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->avg('rating');

                    fputcsv($file, ['Total Revenue', $totalRevenue]);
                    fputcsv($file, ['Total Bookings', $totalBookings]);
                    fputcsv($file, ['Average Rating', round($avgRating ?? 0, 1)]);
                    fputcsv($file, ['Average Booking Value', $totalBookings > 0 ? round($totalRevenue / $totalBookings, 2) : 0]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
