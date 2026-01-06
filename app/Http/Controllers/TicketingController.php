<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ServiceProvider;
use Illuminate\Support\Facades\Storage;
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
                    'slug' => $event->slug,
                    'title' => $event->title,
                    'date' => $event->start_datetime->format('D, M j • g:i A'),
                    'price' => $minPrice ? 'From MWK '.number_format($minPrice, 0, '.', ',') : 'TBA',
                    'image' => $event->cover_image ? Storage::url($event->cover_image) : null,
                    'category' => ucfirst($event->category),
                    'venue' => $event->venue_name.', '.$event->venue_city,
                ];
            });

        // Static categories with images
        $categories = [
            [
                'id' => 'sports',
                'name' => 'Sports',
                'slug' => 'sports',
                'image' => '/resized-win/venue-1.jpg',
            ],
            [
                'id' => 'music-arts',
                'name' => 'Music & Arts',
                'slug' => 'music-arts',
                'image' => '/resized-win/dj-1.jpg',
            ],
            [
                'id' => 'festivals',
                'name' => 'Festivals',
                'slug' => 'festivals',
                'image' => '/resized-win/lighting-1.jpg',
            ],
            [
                'id' => 'cars-motorsport',
                'name' => 'Cars & Motorsport',
                'slug' => 'cars-motorsport',
                'image' => '/resized-win/venue-5.jpg',
            ],
            [
                'id' => 'expos-fairs',
                'name' => 'Expos & Fairs',
                'slug' => 'expos-fairs',
                'image' => '/resized-win/tent-1.jpg',
            ],
        ];

        // Fetch top organizers (providers who have events)
        $topOrganizers = ServiceProvider::with(['user'])
            ->active()
            ->whereHas('events')
            ->orderBy('average_rating', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'slug' => $provider->slug,
                    'name' => $provider->business_name,
                    'location' => $provider->city,
                    'rating' => (float) ($provider->average_rating ?? 4.5),
                    'reviews' => $provider->total_reviews ?? 0,
                    'image' => $provider->cover_image ? Storage::url($provider->cover_image) : null,
                    'logo' => $provider->logo ? Storage::url($provider->logo) : null,
                    'event_count' => $provider->events()->count(),
                    'is_verified' => $provider->verification_status === 'approved',
                ];
            });

        return Inertia::render('Ticketing/Index', [
            'trendingEvents' => $trendingEvents,
            'categories' => $categories,
            'topOrganizers' => $topOrganizers,
            'location' => 'Lilongwe, MW',
        ]);
    }

    public function organizer($slug)
    {
        $organizer = ServiceProvider::where('slug', $slug)->firstOrFail();

        // Fetch upcoming events
        $upcomingEvents = Event::with(['ticketPackages' => function ($query) {
            $query->where('is_active', true)->orderBy('price', 'asc');
        }])
            ->where('service_provider_id', $organizer->id)
            ->where('status', 'published')
            ->where('start_datetime', '>', now())
            ->orderBy('start_datetime', 'asc')
            ->get()
            ->map(function ($event) {
                $minPrice = $event->ticketPackages->min('price');

                return [
                    'id' => $event->id,
                    'slug' => $event->slug,
                    'title' => $event->title,
                    'date' => $event->start_datetime->format('D, M j • g:i A'),
                    'price' => $minPrice ? 'From MWK '.number_format($minPrice, 0, '.', ',') : 'TBA',
                    'image' => $event->cover_image ? Storage::url($event->cover_image) : null,
                    'category' => ucfirst($event->category),
                    'venue' => $event->venue_name.', '.$event->venue_city,
                ];
            });

        // Fetch past events
        $pastEvents = Event::with(['ticketPackages'])
            ->where('service_provider_id', $organizer->id)
            ->where('end_datetime', '<', now())
            ->orderBy('start_datetime', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($event) {
                $minPrice = $event->ticketPackages->min('price');

                return [
                    'id' => $event->id,
                    'slug' => $event->slug,
                    'title' => $event->title,
                    'date' => $event->start_datetime->format('D, M j, Y'),
                    'price' => $minPrice ? 'MWK '.number_format($minPrice, 0, '.', ',') : 'TBA',
                    'image' => $event->cover_image ? Storage::url($event->cover_image) : null,
                    'category' => ucfirst($event->category),
                    'venue' => $event->venue_name.', '.$event->venue_city,
                ];
            });

        // Get event count and stats
        $totalEvents = Event::where('service_provider_id', $organizer->id)->count();
        $totalAttendees = Event::where('service_provider_id', $organizer->id)->sum('registered_count');

        return Inertia::render('Ticketing/OrganizerDetail', [
            'organizer' => [
                'id' => $organizer->id,
                'slug' => $organizer->slug,
                'name' => $organizer->business_name,
                'description' => $organizer->description,
                'location' => $organizer->city,
                'rating' => $organizer->average_rating ?? 4.5,
                'reviews' => $organizer->reviews()->count(),
                'image' => $organizer->cover_image ? Storage::url($organizer->cover_image) : null,
                'logo' => $organizer->logo ? Storage::url($organizer->logo) : null,
                'is_verified' => $organizer->verification_status === 'approved',
                'event_count' => $totalEvents,
                'total_attendees' => $totalAttendees,
                'website' => $organizer->website,
                'email' => $organizer->email,
                'phone' => $organizer->phone,
            ],
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
        ]);
    }
}
