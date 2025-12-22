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

        // Get unique categories from published events
        $categories = Event::where('status', 'published')
            ->distinct()
            ->pluck('category')
            ->map(function ($category) {
                return [
                    'name' => ucfirst($category),
                    'slug' => $category,
                    'icon' => $this->getCategoryIcon($category),
                ];
            })
            ->toArray();

        return Inertia::render('Ticketing/Index', [
            'trendingEvents' => $trendingEvents,
            'categories' => $categories,
            'location' => 'Lilongwe, MW',
        ]);
    }

    /**
     * Get icon for event category
     */
    private function getCategoryIcon(string $category): string
    {
        $icons = [
            'sports' => '🏈',
            'concert' => '🎵',
            'festival' => '🎪',
            'exhibition' => '🎨',
            'conference' => '💼',
            'workshop' => '🛠️',
            'networking' => '🤝',
            'other' => '🎉',
        ];

        return $icons[$category] ?? '🎉';
    }
}
