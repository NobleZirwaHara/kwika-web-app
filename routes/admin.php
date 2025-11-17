<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| These routes are for the admin panel and require both 'auth' and 'admin'
| middleware. All routes are prefixed with '/admin'.
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Verification Queue - HIGH PRIORITY
    Route::prefix('verification-queue')->name('verification-queue.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'show'])->name('show');
        Route::post('/{id}/approve', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'reject'])->name('reject');
        Route::post('/{id}/request-changes', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'requestChanges'])->name('request-changes');
        Route::put('/{id}/toggle-featured', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\VerificationQueueController::class, 'toggleActive'])->name('toggle-active');
    });

    // Service Provider Management
    Route::prefix('service-providers')->name('service-providers.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'index'])->name('index');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'toggleActive'])->name('toggle-active');
        Route::put('/{id}/toggle-featured', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::post('/{id}/ban', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'ban'])->name('ban');
        Route::post('/{id}/unban', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'unban'])->name('unban');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\ServiceProviderController::class, 'destroy'])->name('destroy');
    });

    // User Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('index');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('update');
        Route::post('/{id}/verify', [\App\Http\Controllers\Admin\UserController::class, 'verify'])->name('verify');
        Route::post('/{id}/unverify', [\App\Http\Controllers\Admin\UserController::class, 'unverify'])->name('unverify');
        Route::post('/{id}/ban', [\App\Http\Controllers\Admin\UserController::class, 'ban'])->name('ban');
        Route::post('/{id}/unban', [\App\Http\Controllers\Admin\UserController::class, 'unban'])->name('unban');
        Route::post('/{id}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('reset-password');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('destroy');
    });

    // Review Moderation
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ReviewController::class, 'index'])->name('index');
        Route::post('/{id}/approve', [\App\Http\Controllers\Admin\ReviewController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [\App\Http\Controllers\Admin\ReviewController::class, 'reject'])->name('reject');
        Route::put('/{id}/toggle-featured', [\App\Http\Controllers\Admin\ReviewController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::post('/{id}/respond', [\App\Http\Controllers\Admin\ReviewController::class, 'respond'])->name('respond');
        Route::delete('/{id}/delete-response', [\App\Http\Controllers\Admin\ReviewController::class, 'deleteResponse'])->name('delete-response');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('destroy');
    });

    // Services Management
    Route::prefix('services')->name('services.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ServicesController::class, 'index'])->name('index');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\ServicesController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\ServicesController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\ServicesController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\ServicesController::class, 'destroy'])->name('destroy');
    });

    // Categories Management
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\CategoriesController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\CategoriesController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\CategoriesController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\CategoriesController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\CategoriesController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\CategoriesController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/update-order', [\App\Http\Controllers\Admin\CategoriesController::class, 'updateOrder'])->name('update-order');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\CategoriesController::class, 'destroy'])->name('destroy');
    });

    // Products Management
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ProductsController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\ProductsController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\ProductsController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\ProductsController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\ProductsController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\ProductsController::class, 'toggleActive'])->name('toggle-active');
        Route::put('/{id}/toggle-featured', [\App\Http\Controllers\Admin\ProductsController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\ProductsController::class, 'destroy'])->name('destroy');
    });

    // Payments Management
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\PaymentsController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\PaymentsController::class, 'show'])->name('show');
        Route::post('/{id}/verify', [\App\Http\Controllers\Admin\PaymentsController::class, 'verify'])->name('verify');
        Route::post('/{id}/reject', [\App\Http\Controllers\Admin\PaymentsController::class, 'reject'])->name('reject');
        Route::post('/{id}/refund', [\App\Http\Controllers\Admin\PaymentsController::class, 'refund'])->name('refund');
    });

    // Bookings Management
    Route::prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\BookingsController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\BookingsController::class, 'show'])->name('show');
        Route::put('/{id}/update-status', [\App\Http\Controllers\Admin\BookingsController::class, 'updateStatus'])->name('update-status');
        Route::put('/{id}/update-payment-status', [\App\Http\Controllers\Admin\BookingsController::class, 'updatePaymentStatus'])->name('update-payment-status');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\BookingsController::class, 'destroy'])->name('destroy');
    });

    // Subscription Plans Management
    Route::prefix('subscription-plans')->name('subscription-plans.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/update-order', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'updateOrder'])->name('update-order');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\SubscriptionPlansController::class, 'destroy'])->name('destroy');
    });

    // Companies Management
    Route::prefix('companies')->name('companies.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\CompaniesController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\CompaniesController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\CompaniesController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\CompaniesController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\CompaniesController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\CompaniesController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\CompaniesController::class, 'destroy'])->name('destroy');
    });

    // Admin Users Management (Phase 7)
    Route::prefix('admin-users')->name('admin-users.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminUsersController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\AdminUsersController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\AdminUsersController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\AdminUsersController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\AdminUsersController::class, 'update'])->name('update');
        Route::post('/{id}/suspend', [\App\Http\Controllers\Admin\AdminUsersController::class, 'suspend'])->name('suspend');
        Route::post('/{id}/restore', [\App\Http\Controllers\Admin\AdminUsersController::class, 'restore'])->name('restore');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\AdminUsersController::class, 'destroy'])->name('destroy');
    });

    // Audit Logs (Phase 7)
    Route::prefix('audit-logs')->name('audit-logs.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AuditLogsController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\AuditLogsController::class, 'show'])->name('show');
    });

    // Messaging
    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\MessageController::class, 'index'])->name('index');
        Route::post('/search-users', [\App\Http\Controllers\Admin\MessageController::class, 'searchUsers'])->name('search-users');
        Route::post('/start-conversation', [\App\Http\Controllers\Admin\MessageController::class, 'startConversation'])->name('start-conversation');
        Route::post('/send', [\App\Http\Controllers\Admin\MessageController::class, 'sendAdminMessage'])->name('send');
    });

    // Third Party Services
    Route::prefix('third-party-services')->name('third-party-services.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'index'])->name('index');
        Route::get('/{serviceId}/config', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'getConfig'])->name('get-config');
        Route::post('/update-config', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'updateConfig'])->name('update-config');
        Route::post('/test-supabase', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'testSupabase'])->name('test-supabase');
        Route::post('/test-supabase-realtime', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'testSupabaseRealtime'])->name('test-supabase-realtime');
        Route::post('/test-mail', [\App\Http\Controllers\Admin\ThirdPartyServiceController::class, 'testMail'])->name('test-mail');
    });

    // Events Management
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\EventsController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\EventsController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\EventsController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\EventsController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\EventsController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-featured', [\App\Http\Controllers\Admin\EventsController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::put('/{id}/update-status', [\App\Http\Controllers\Admin\EventsController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\EventsController::class, 'destroy'])->name('destroy');
    });

    // Promotions Management
    Route::prefix('promotions')->name('promotions.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\PromotionsController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\PromotionsController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\PromotionsController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\PromotionsController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\PromotionsController::class, 'update'])->name('update');
        Route::put('/{id}/toggle-active', [\App\Http\Controllers\Admin\PromotionsController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\PromotionsController::class, 'destroy'])->name('destroy');
    });

    // Reports & Analytics
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ReportsController::class, 'index'])->name('index');
        Route::get('/revenue', [\App\Http\Controllers\Admin\ReportsController::class, 'revenue'])->name('revenue');
        Route::get('/bookings', [\App\Http\Controllers\Admin\ReportsController::class, 'bookings'])->name('bookings');
        Route::get('/users', [\App\Http\Controllers\Admin\ReportsController::class, 'users'])->name('users');
        Route::get('/providers', [\App\Http\Controllers\Admin\ReportsController::class, 'providers'])->name('providers');
        Route::get('/products', [\App\Http\Controllers\Admin\ReportsController::class, 'products'])->name('products');
        Route::get('/promotions-analytics', [\App\Http\Controllers\Admin\ReportsController::class, 'promotionsAnalytics'])->name('promotions-analytics');
        Route::post('/export/excel', [\App\Http\Controllers\Admin\ReportsController::class, 'exportExcel'])->name('export.excel');
        Route::post('/export/pdf', [\App\Http\Controllers\Admin\ReportsController::class, 'exportPdf'])->name('export.pdf');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('update');
        Route::post('/clear-cache', [\App\Http\Controllers\Admin\SettingsController::class, 'clearCache'])->name('clear-cache');
    });
});
