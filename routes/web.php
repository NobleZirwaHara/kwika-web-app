<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProviderOnboardingController;
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

// Review routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

// Wishlist routes (authenticated users)
Route::middleware(['auth'])->prefix('wishlist')->name('wishlist.')->group(function () {
    Route::get('/', [\App\Http\Controllers\WishlistController::class, 'index'])->name('index');
    Route::post('/', [\App\Http\Controllers\WishlistController::class, 'store'])->name('store');
    Route::delete('/{serviceId}', [\App\Http\Controllers\WishlistController::class, 'destroy'])->name('destroy');
});

// Wishlist API routes (for checking wishlist status)
Route::get('/api/wishlist/check/{serviceId}', [\App\Http\Controllers\WishlistController::class, 'check'])->name('api.wishlist.check');
Route::get('/api/wishlist/ids', [\App\Http\Controllers\WishlistController::class, 'getWishlistIds'])->name('api.wishlist.ids');

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
