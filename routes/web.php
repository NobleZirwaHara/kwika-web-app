<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProviderOnboardingController;
use App\Http\Controllers\Provider\DashboardController;
use App\Http\Controllers\Provider\MediaController;
use App\Http\Controllers\Provider\ServiceController;
use App\Http\Controllers\Provider\SettingsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Home page - shows categories and featured providers
Route::get('/', [HomeController::class, 'index'])->name('home');

// Search routes
Route::get('/search', [SearchController::class, 'search'])->name('search');
Route::get('/api/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Provider routes
Route::get('/providers', [ProviderController::class, 'index'])->name('providers.index');
Route::get('/providers/{slug}', [ProviderController::class, 'show'])->name('providers.show');

// Booking routes (will require authentication)
Route::middleware(['auth'])->group(function () {
    // Create booking
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');

    // Payment selection
    Route::get('/bookings/{booking}/payment/select', [BookingController::class, 'selectPaymentMethod'])->name('bookings.payment.select');

    // Bank Transfer
    Route::get('/bookings/{booking}/payment/bank-transfer', [BookingController::class, 'showBankTransfer'])->name('bookings.payment.bank');
    Route::post('/bookings/{booking}/payment/bank-transfer', [BookingController::class, 'processBankTransfer'])->name('bookings.payment.bank.process');

    // Mobile Money
    Route::get('/bookings/{booking}/payment/mobile-money', [BookingController::class, 'showMobileMoney'])->name('bookings.payment.mobile');
    Route::post('/bookings/{booking}/payment/mobile-money', [BookingController::class, 'processMobileMoney'])->name('bookings.payment.mobile.process');

    // Card Payment
    Route::get('/bookings/{booking}/payment/card', [BookingController::class, 'showCardPayment'])->name('bookings.payment.card');
    Route::post('/bookings/{booking}/payment/card', [BookingController::class, 'processCardPayment'])->name('bookings.payment.card.process');

    // Confirmation
    Route::get('/bookings/{booking}/confirmation', [BookingController::class, 'confirmation'])->name('bookings.confirmation');

    // View and cancel booking
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
});

// Review routes (will require authentication)
Route::middleware(['auth'])->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

// Provider Onboarding Routes
Route::prefix('onboarding')->name('onboarding.')->group(function () {
    // Welcome page (public)
    Route::get('/welcome', [ProviderOnboardingController::class, 'welcome'])->name('welcome');

    // Step 1: Personal Details (public - creates account)
    Route::get('/step1', [ProviderOnboardingController::class, 'step1'])->name('step1');
    Route::post('/step1', [ProviderOnboardingController::class, 'storeStep1'])->name('step1.store');

    // Remaining steps require authentication
    Route::middleware(['auth'])->group(function () {
        // Step 2: Business Information
        Route::get('/step2', [ProviderOnboardingController::class, 'step2'])->name('step2');
        Route::post('/step2', [ProviderOnboardingController::class, 'storeStep2'])->name('step2.store');

        // Step 3: Services & Media
        Route::get('/step3', [ProviderOnboardingController::class, 'step3'])->name('step3');
        Route::post('/step3', [ProviderOnboardingController::class, 'storeStep3'])->name('step3.store');

        // Step 4: Review & Submit
        Route::get('/step4', [ProviderOnboardingController::class, 'step4'])->name('step4');
        Route::post('/complete', [ProviderOnboardingController::class, 'complete'])->name('complete');

        // Navigate to specific step
        Route::get('/step/{step}', [ProviderOnboardingController::class, 'goToStep'])->name('step');
    });
});

// Provider Admin Panel
Route::middleware(['auth'])->prefix('provider')->name('provider.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

// Admin Panel Routes
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

    // Payments Management
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\PaymentsController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\PaymentsController::class, 'show'])->name('show');
        Route::post('/{id}/verify', [\App\Http\Controllers\Admin\PaymentsController::class, 'verify'])->name('verify');
        Route::post('/{id}/reject', [\App\Http\Controllers\Admin\PaymentsController::class, 'reject'])->name('reject');
        Route::post('/{id}/refund', [\App\Http\Controllers\Admin\PaymentsController::class, 'refund'])->name('refund');
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

    // Content Management: Products, Events (Phase 3)
    // Companies, Promotions (Phase 5-6)
    // Admin Users, Audit Logs, Settings, Reports (Phase 7-8)
});
