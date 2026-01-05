<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
|
| These routes are for authenticated user functionality such as profile
| management, bookings history, messages, etc.
| All routes require 'auth' middleware and are prefixed with '/user'.
|
*/

use Inertia\Inertia;

Route::middleware(['auth'])->prefix('user')->name('user.')->group(function () {
    // User dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard', [
            'user' => auth()->user(),
            'stats' => [
                'total_bookings' => 0,
                'upcoming_bookings' => 0,
                'wishlist_items' => 0,
                'total_spent' => 0,
            ],
            'upcoming_bookings' => [],
            'recent_bookings' => [],
        ]);
    })->name('dashboard');

    // Bookings
    Route::get('/bookings', function () {
        $query = \App\Models\Booking::where('user_id', auth()->id())
            ->with(['service', 'servicePackage', 'serviceProvider', 'payments', 'review']);

        // Filter by status
        if (request('status')) {
            $query->where('status', request('status'));
        }

        // Filter by date range
        if (request('date_from')) {
            $query->whereDate('event_date', '>=', request('date_from'));
        }
        if (request('date_to')) {
            $query->whereDate('event_date', '<=', request('date_to'));
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
                'status' => request('status'),
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
            ],
        ]);
    })->name('bookings');

    // Profile management
    Route::get('/profile', function () {
        return Inertia::render('User/Profile', [
            'user' => auth()->user(),
            'settings' => [
                'email_notifications' => true,
                'sms_notifications' => true,
                'marketing_emails' => false,
            ],
        ]);
    })->name('profile');

    Route::post('/profile', function () {
        // Handle profile update
        return back()->with('success', 'Profile updated successfully');
    })->name('profile.update');

    Route::post('/password', function () {
        // Handle password update
        return back()->with('success', 'Password updated successfully');
    })->name('password.update');

    Route::post('/notifications', function () {
        // Handle notification settings update
        return back()->with('success', 'Notification preferences updated');
    })->name('notifications.update');

    // Messages
    Route::get('/messages', function () {
        return Inertia::render('User/Messages', [
            'conversations' => [],
        ]);
    })->name('messages');
});
