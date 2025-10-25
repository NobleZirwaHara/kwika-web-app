<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/providers/{id}', function ($id) {
    // Sample provider data - in a real app, this would come from a database
    $providerData = [
        'id' => $id,
        'name' => 'Sarah Chen Photography',
        'category' => 'Photographer',
        'location' => 'San Francisco, CA',
        'rating' => 4.95,
        'reviews' => 234,
        'price' => 2500,
        'images' => [
            '/professional-photographer-portfolio-wedding.jpg',
            '/cinematic-wedding-videography.jpg',
            '/luxury-wedding-decoration-flowers.jpg',
            '/elegant-catering-food-display.jpg',
        ],
        'description' => 'Join award-winning photographer Sarah Chen for a professional photography session that captures your event\'s most precious moments. With over 10 years of experience and a keen eye for detail, Sarah specializes in creating timeless memories.',
        'about' => 'Professional photographer with expertise in weddings, corporate events, and special occasions. Michelin-recognized for visual storytelling.',
        'badges' => [
            [
                'icon' => '⭐',
                'title' => 'Top Rated Provider',
                'description' => 'This provider has consistently received 5-star reviews from clients.',
            ],
            [
                'icon' => '🎖️',
                'title' => 'Kwika.Events Original',
                'description' => 'This photography service was designed exclusively for Kwika.Events.',
            ],
        ],
        'languages' => ['English', 'Mandarin', 'Cantonese'],
        'cancellationPolicy' => 'Free cancellation up to 7 days before the event',
    ];

    return Inertia::render('ProviderDetail', [
        'provider' => $providerData
    ]);
})->name('provider.show');
