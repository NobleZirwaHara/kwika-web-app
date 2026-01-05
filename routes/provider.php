<?php

use App\Http\Controllers\Provider\BookingChecklistController;
use App\Http\Controllers\Provider\ChecklistTemplateController;
use App\Http\Controllers\Provider\DashboardController;
use App\Http\Controllers\Provider\ListingsController;
use App\Http\Controllers\Provider\MediaController;
use App\Http\Controllers\Provider\PackageController;
use App\Http\Controllers\Provider\ServiceController;
use App\Http\Controllers\Provider\SettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Provider Routes
|--------------------------------------------------------------------------
|
| These routes are for the provider admin panel and require both 'auth'
| and 'provider' middleware. All routes are prefixed with '/provider'.
|
*/

Route::middleware(['auth', 'provider'])->prefix('provider')->name('provider.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Listings - Combined view for services and products
    Route::get('/listings', [ListingsController::class, 'index'])->name('listings');

    // Messages - Provider messaging
    Route::get('/messages', fn () => inertia('Provider/Messages'))->name('messages');
    Route::get('/messages/{id}', fn ($id) => inertia('Provider/Messages', ['conversationId' => $id]))->name('messages.show');

    // Company Management
    Route::resource('companies', \App\Http\Controllers\Provider\CompanyController::class);

    // Service Catalogues Management
    Route::resource('service-catalogues', \App\Http\Controllers\Provider\ServiceCatalogueController::class);

    // Product Catalogues Management
    Route::resource('product-catalogues', \App\Http\Controllers\Provider\ProductCatalogueController::class);

    // Promotions Management
    Route::resource('promotions', \App\Http\Controllers\Provider\PromotionController::class);
    Route::put('/promotions/{promotion}/toggle', [\App\Http\Controllers\Provider\PromotionController::class, 'toggle'])->name('promotions.toggle');

    // Events Management
    Route::resource('events', \App\Http\Controllers\Provider\EventController::class);

    // Products Management
    Route::resource('products', \App\Http\Controllers\Provider\ProductController::class);
    Route::put('/products/{product}/toggle', [\App\Http\Controllers\Provider\ProductController::class, 'toggle'])->name('products.toggle');

    // Services Management
    Route::get('/services', [ServiceController::class, 'index'])->name('services');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{id}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');
    Route::put('/services/{id}/toggle', [ServiceController::class, 'toggle'])->name('services.toggle');

    // Package Management
    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [PackageController::class, 'index'])->name('index');
        Route::get('/create', [PackageController::class, 'create'])->name('create');
        Route::post('/', [PackageController::class, 'store'])->name('store');
        Route::get('/{package}/edit', [PackageController::class, 'edit'])->name('edit');
        Route::put('/{package}', [PackageController::class, 'update'])->name('update');
        Route::delete('/{package}', [PackageController::class, 'destroy'])->name('destroy');
        Route::put('/{package}/toggle', [PackageController::class, 'toggle'])->name('toggle');
        Route::post('/reorder', [PackageController::class, 'reorder'])->name('reorder');
    });

    // Media Management
    Route::get('/media', [MediaController::class, 'index'])->name('media');
    Route::post('/media/logo', [MediaController::class, 'uploadLogo'])->name('media.logo');
    Route::post('/media/cover', [MediaController::class, 'uploadCover'])->name('media.cover');
    Route::post('/media/portfolio', [MediaController::class, 'uploadPortfolio'])->name('media.portfolio');
    Route::delete('/media/{id}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Profile Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::put('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password');

    // Availability Management
    Route::get('/availability', [\App\Http\Controllers\Provider\AvailabilityController::class, 'index'])->name('availability');
    Route::post('/availability', [\App\Http\Controllers\Provider\AvailabilityController::class, 'store'])->name('availability.store');
    Route::put('/availability/{availability}', [\App\Http\Controllers\Provider\AvailabilityController::class, 'update'])->name('availability.update');
    Route::delete('/availability/{availability}', [\App\Http\Controllers\Provider\AvailabilityController::class, 'destroy'])->name('availability.destroy');
    Route::post('/availability/bulk-delete', [\App\Http\Controllers\Provider\AvailabilityController::class, 'bulkDelete'])->name('availability.bulk-delete');

    // Bookings Management
    Route::get('/bookings', [\App\Http\Controllers\Provider\BookingController::class, 'index'])->name('bookings');
    Route::get('/bookings/export', [\App\Http\Controllers\Provider\BookingController::class, 'export'])->name('bookings.export');
    Route::get('/bookings/{id}', [\App\Http\Controllers\Provider\BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{id}/confirm', [\App\Http\Controllers\Provider\BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/bookings/{id}/complete', [\App\Http\Controllers\Provider\BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('/bookings/{id}/cancel', [\App\Http\Controllers\Provider\BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::post('/bookings/{bookingId}/payments/{paymentId}/verify', [\App\Http\Controllers\Provider\BookingController::class, 'verifyPayment'])->name('bookings.payments.verify');

    // Booking Checklist routes
    Route::prefix('bookings/{booking}/checklist')->name('bookings.checklist.')->group(function () {
        Route::post('/', [BookingChecklistController::class, 'store'])->name('store');
        Route::delete('/', [BookingChecklistController::class, 'destroy'])->name('destroy');
        Route::post('/items', [BookingChecklistController::class, 'storeItem'])->name('items.store');
        Route::put('/items/{item}', [BookingChecklistController::class, 'updateItem'])->name('items.update');
        Route::post('/items/{item}/toggle', [BookingChecklistController::class, 'toggleItem'])->name('items.toggle');
        Route::delete('/items/{item}', [BookingChecklistController::class, 'deleteItem'])->name('items.destroy');
        Route::post('/reorder', [BookingChecklistController::class, 'reorder'])->name('reorder');
    });

    // Checklist Templates Management
    Route::prefix('checklists')->name('checklists.')->group(function () {
        Route::get('/', [ChecklistTemplateController::class, 'index'])->name('index');
        Route::post('/', [ChecklistTemplateController::class, 'store'])->name('store');
        Route::get('/{template}', [ChecklistTemplateController::class, 'show'])->name('show');
        Route::put('/{template}', [ChecklistTemplateController::class, 'update'])->name('update');
        Route::delete('/{template}', [ChecklistTemplateController::class, 'destroy'])->name('destroy');
        Route::put('/{template}/toggle', [ChecklistTemplateController::class, 'toggle'])->name('toggle');
        Route::post('/{template}/duplicate', [ChecklistTemplateController::class, 'duplicate'])->name('duplicate');
        Route::post('/{template}/items', [ChecklistTemplateController::class, 'storeItem'])->name('items.store');
        Route::put('/{template}/items/{item}', [ChecklistTemplateController::class, 'updateItem'])->name('items.update');
        Route::delete('/{template}/items/{item}', [ChecklistTemplateController::class, 'deleteItem'])->name('items.destroy');
        Route::post('/{template}/items/reorder', [ChecklistTemplateController::class, 'reorderItems'])->name('items.reorder');
    });

    // Analytics & Reports
    Route::get('/analytics', [\App\Http\Controllers\Provider\AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/analytics/revenue', [\App\Http\Controllers\Provider\AnalyticsController::class, 'revenue'])->name('analytics.revenue');
    Route::get('/analytics/bookings', [\App\Http\Controllers\Provider\AnalyticsController::class, 'bookings'])->name('analytics.bookings');
    Route::get('/analytics/services', [\App\Http\Controllers\Provider\AnalyticsController::class, 'services'])->name('analytics.services');
    Route::get('/analytics/customers', [\App\Http\Controllers\Provider\AnalyticsController::class, 'customers'])->name('analytics.customers');
    Route::get('/analytics/export', [\App\Http\Controllers\Provider\AnalyticsController::class, 'export'])->name('analytics.export');

    // Placeholder routes for future implementation
    Route::get('/pricing', fn () => inertia('Provider/Pricing'))->name('pricing');
    Route::get('/reviews', fn () => inertia('Provider/Reviews'))->name('reviews');
});
