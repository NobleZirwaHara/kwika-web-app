<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketingController extends Controller
{
    public function index()
    {
        // Fetch trending events (published, upcoming events with ticket packages)
        $trendingEvents = Event::with(['ticketPackages' => function ($query) {
                $query->where('is_active', true)
                      ->orderBy('price', 'asc');
            }])
            ->where('status', 'published')
            ->where('start_datetime', '>', now())
            ->orderBy('is_featured', 'desc')
            ->orderBy('start_datetime', 'asc')
            ->limit(12)
            ->get()
            ->map(function ($event) {
                // Get the minimum price from ticket packages
                $minPrice = $event->ticketPackages->min('price');

                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'date' => $event->start_datetime->format('D, M j • g:i A'),
                    'price' => $minPrice ? 'From MWK ' . number_format($minPrice) : 'TBA',
                    'image' => $event->cover_image,
                    'category' => ucfirst($event->category),
                    'venue' => $event->venue_name . ', ' . $event->venue_city,
                ];
            });

        // Static categories with images
        $categories = [
            [
                'id' => 'sports',
                'name' => 'Sports',
                'slug' => 'sports',
                'image' => '/ticketing/categories/sports-1.png',
            ],
            [
                'id' => 'music-arts',
                'name' => 'Music & Arts',
                'slug' => 'music-arts',
                'image' => '/ticketing/categories/music-1.png',
            ],
            [
                'id' => 'festivals',
                'name' => 'Festivals',
                'slug' => 'festivals',
                'image' => '/ticketing/categories/festivals-1.png',
            ],
            [
                'id' => 'cars-motorsport',
                'name' => 'Cars & Motorsport',
                'slug' => 'cars-motorsport',
                'image' => '/ticketing/categories/cars-1.png',
            ],
            [
                'id' => 'expos-fairs',
                'name' => 'Expos & Fairs',
                'slug' => 'expos-fairs',
                'image' => '/ticketing/categories/expo-1.png',
            ],
        ];

        return Inertia::render('Ticketing/Index', [
            'trendingEvents' => $trendingEvents,
            'categories' => $categories,
            'location' => 'Lilongwe, MW',
        ]);
    }

}
