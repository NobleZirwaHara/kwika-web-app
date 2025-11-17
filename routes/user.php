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
        return Inertia::render('User/Bookings', [
            'bookings' => [],
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
