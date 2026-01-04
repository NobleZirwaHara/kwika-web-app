<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProviderOnboardingController;
use App\Http\Controllers\TicketingController;
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
Route::get('/home', [HomeController::class, 'index'])->name('home.default');

// Products page
Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products');
Route::get('/products/{slug}', [\App\Http\Controllers\ProductController::class, 'show'])->name('products.show');

// Package routes
Route::get('/packages/{slug}', [PackageController::class, 'show'])->name('packages.show');

// Cart routes (works for both guests and authenticated users)
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [\App\Http\Controllers\CartController::class, 'index'])->name('index');
    Route::get('/data', [\App\Http\Controllers\CartController::class, 'show'])->name('show');
    Route::get('/count', [\App\Http\Controllers\CartController::class, 'count'])->name('count');
    Route::post('/add', [\App\Http\Controllers\CartController::class, 'addItem'])->name('add');
    Route::patch('/items/{itemId}', [\App\Http\Controllers\CartController::class, 'updateItem'])->name('update');
    Route::delete('/items/{itemId}', [\App\Http\Controllers\CartController::class, 'removeItem'])->name('remove');
    Route::delete('/clear', [\App\Http\Controllers\CartController::class, 'clear'])->name('clear');
});

// Ticketing pages
Route::get('/ticketing', [TicketingController::class, 'index'])->name('ticketing');
Route::get('/ticketing/organizer/{slug}', [TicketingController::class, 'organizer'])->name('ticketing.organizer');

// Ticket Order routes (authenticated users)
Route::middleware(['auth'])->prefix('ticket-orders')->name('ticket-orders.')->group(function () {
    Route::post('/checkout', [\App\Http\Controllers\TicketOrderController::class, 'checkout'])->name('checkout');
    Route::post('/create', [\App\Http\Controllers\TicketOrderController::class, 'create'])->name('create');
    Route::get('/{order}', [\App\Http\Controllers\TicketOrderController::class, 'show'])->name('show');
    Route::get('/{order}/payment', [\App\Http\Controllers\TicketOrderController::class, 'payment'])->name('payment');
    Route::post('/{order}/process-payment', [\App\Http\Controllers\TicketOrderController::class, 'processPayment'])->name('process-payment');
    Route::get('/{order}/confirmation', [\App\Http\Controllers\TicketOrderController::class, 'confirmation'])->name('confirmation');
    Route::delete('/{order}', [\App\Http\Controllers\TicketOrderController::class, 'cancel'])->name('cancel');
});

// My Tickets (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::get('/my-tickets', [\App\Http\Controllers\TicketOrderController::class, 'myTickets'])->name('my-tickets');
    Route::get('/tickets/{ticket}/download', [\App\Http\Controllers\TicketOrderController::class, 'downloadTicket'])->name('tickets.download');
});

// Payment Webhooks (public, no auth required)
Route::post('/webhooks/flutterwave', [\App\Http\Controllers\WebhookController::class, 'flutterwave'])->name('webhooks.flutterwave');
Route::post('/webhooks/stripe', [\App\Http\Controllers\WebhookController::class, 'stripe'])->name('webhooks.stripe');
Route::post('/webhooks/mpesa', [\App\Http\Controllers\WebhookController::class, 'mpesa'])->name('webhooks.mpesa');

// Event routes (public viewing)
Route::get('/events', [\App\Http\Controllers\EventController::class, 'index'])->name('events.index');
Route::get('/events/{slug}', [\App\Http\Controllers\EventController::class, 'show'])->name('events.show');
Route::get('/events/{event}/seating', [\App\Http\Controllers\EventController::class, 'seating'])->name('events.seating');
Route::post('/events/{event}/check-availability', [\App\Http\Controllers\EventController::class, 'checkAvailability'])->name('events.check-availability');

// Search routes
Route::get('/search', [SearchController::class, 'search'])->name('search');
Route::get('/api/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Listings route (browse all providers/services with filters)
Route::get('/listings', [SearchController::class, 'search'])->name('listings');

// Provider routes (public viewing)
Route::get('/providers', [ProviderController::class, 'index'])->name('providers.index');
Route::get('/providers/{slug}', [ProviderController::class, 'show'])->name('providers.show');

// Service routes (public viewing)
Route::get('/services', [\App\Http\Controllers\ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [\App\Http\Controllers\ServiceController::class, 'show'])->name('services.show');

// Provider Availability API (public)
Route::get('/api/providers/{providerId}/availability', [BookingController::class, 'getProviderAvailability'])->name('api.providers.availability');

// Booking routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    // Single service booking
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');

    // Package booking
    Route::get('/bookings/package', [BookingController::class, 'createFromPackage'])->name('bookings.package.create');
    Route::post('/bookings/package', [BookingController::class, 'storePackageBooking'])->name('bookings.package.store');

    // Custom package booking
    Route::get('/bookings/custom', [BookingController::class, 'createCustom'])->name('bookings.custom.create');
    Route::post('/bookings/custom', [BookingController::class, 'storeCustomBooking'])->name('bookings.custom.store');

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

// Review routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

// Wishlist routes (works for both guests and authenticated users)
Route::prefix('wishlist')->name('wishlist.')->group(function () {
    // Page routes
    Route::get('/', [\App\Http\Controllers\WishlistController::class, 'index'])->name('index');
    Route::get('/{slug}', [\App\Http\Controllers\WishlistController::class, 'show'])->name('show');
    Route::post('/create', [\App\Http\Controllers\WishlistController::class, 'create'])->name('create');
    Route::patch('/{id}', [\App\Http\Controllers\WishlistController::class, 'update'])->name('update');
    Route::delete('/{id}', [\App\Http\Controllers\WishlistController::class, 'destroy'])->name('destroy');
});

// Wishlist API routes (for frontend context and item management)
Route::prefix('api/wishlist')->name('api.wishlist.')->group(function () {
    // Get data
    Route::get('/data', [\App\Http\Controllers\WishlistController::class, 'getData'])->name('data');
    Route::get('/ids', [\App\Http\Controllers\WishlistController::class, 'getIds'])->name('ids');

    // Check if items are wishlisted
    Route::get('/check/provider/{id}', [\App\Http\Controllers\WishlistController::class, 'checkProvider'])->name('check.provider');
    Route::get('/check/package/{id}', [\App\Http\Controllers\WishlistController::class, 'checkPackage'])->name('check.package');
    Route::get('/check/service/{id}', [\App\Http\Controllers\WishlistController::class, 'checkService'])->name('check.service');

    // Add items
    Route::post('/provider', [\App\Http\Controllers\WishlistController::class, 'addProvider'])->name('add.provider');
    Route::post('/package', [\App\Http\Controllers\WishlistController::class, 'addPackage'])->name('add.package');
    Route::post('/service', [\App\Http\Controllers\WishlistController::class, 'addService'])->name('add.service');
    Route::post('/custom-package', [\App\Http\Controllers\WishlistController::class, 'addCustomPackage'])->name('add.custom-package');

    // Remove custom package
    Route::delete('/custom-package/{id}', [\App\Http\Controllers\WishlistController::class, 'removeCustomPackage'])->name('remove.custom-package');

    // Toggle items (add if not present, remove if present)
    Route::post('/toggle/provider', [\App\Http\Controllers\WishlistController::class, 'toggleProvider'])->name('toggle.provider');
    Route::post('/toggle/package', [\App\Http\Controllers\WishlistController::class, 'togglePackage'])->name('toggle.package');
    Route::post('/toggle/service', [\App\Http\Controllers\WishlistController::class, 'toggleService'])->name('toggle.service');

    // Item management
    Route::delete('/item/{id}', [\App\Http\Controllers\WishlistController::class, 'removeItem'])->name('remove');
    Route::patch('/item/{id}/move', [\App\Http\Controllers\WishlistController::class, 'moveItem'])->name('move');
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

/*
|--------------------------------------------------------------------------
| Include Additional Route Files
|--------------------------------------------------------------------------
*/

// Provider admin panel routes
require __DIR__ . '/provider.php';

// Admin panel routes
require __DIR__ . '/admin.php';

// User dashboard routes (future implementation)
require __DIR__ . '/user.php';
