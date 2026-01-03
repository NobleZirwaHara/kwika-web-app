<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\ServiceProvider;
use App\Models\User;
use App\Models\TicketPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Database\Seeders\Traits\UploadsSeederImages;

class EventOrganizersSeeder extends Seeder
{
    use UploadsSeederImages;

    public function run(): void
    {
        $organizers = [
            [
                'business_name' => 'Lake of Stars Events',
                'slug' => 'lake-of-stars-events',
                'description' => 'Premier festival organizers bringing world-class music events to Malawi since 2004.',
                'city' => 'Lilongwe',
                'email' => 'info@lakeofstars.org',
                'phone' => '+265 999 123 456',
                'website' => 'https://lakeofstars.org',
                'average_rating' => 4.9,
                'total_reviews' => 156,
                'is_verified' => true,
                'is_featured' => true,
            ],
            [
                'business_name' => 'Malawi Sports Council',
                'slug' => 'malawi-sports-council',
                'description' => 'Official sports governing body organizing national and international sporting events.',
                'city' => 'Blantyre',
                'email' => 'events@malawisc.mw',
                'phone' => '+265 888 234 567',
                'website' => 'https://malawisc.mw',
                'average_rating' => 4.7,
                'total_reviews' => 89,
                'is_verified' => true,
                'is_featured' => true,
            ],
            [
                'business_name' => 'Flame Entertainment',
                'slug' => 'flame-entertainment',
                'description' => 'Leading entertainment company producing concerts, shows, and corporate events.',
                'city' => 'Lilongwe',
                'email' => 'bookings@flameent.mw',
                'phone' => '+265 991 345 678',
                'website' => 'https://flameentertainment.mw',
                'average_rating' => 4.8,
                'total_reviews' => 234,
                'is_verified' => true,
                'is_featured' => true,
            ],
            [
                'business_name' => 'Sunbird Events',
                'slug' => 'sunbird-events',
                'description' => 'Hospitality and events division of Sunbird Tourism, hosting premium events at top venues.',
                'city' => 'Lilongwe',
                'email' => 'events@sunbirdmalawi.com',
                'phone' => '+265 1 774 777',
                'website' => 'https://sunbirdmalawi.com',
                'average_rating' => 4.6,
                'total_reviews' => 112,
                'is_verified' => true,
                'is_featured' => false,
            ],
            [
                'business_name' => 'Capital FM Events',
                'slug' => 'capital-fm-events',
                'description' => 'Radio station events arm, bringing listeners together through music and entertainment.',
                'city' => 'Lilongwe',
                'email' => 'events@capitalfm.mw',
                'phone' => '+265 992 456 789',
                'website' => 'https://capitalfm.mw',
                'average_rating' => 4.5,
                'total_reviews' => 78,
                'is_verified' => false,
                'is_featured' => false,
            ],
            [
                'business_name' => 'Crossroads Hospitality',
                'slug' => 'crossroads-hospitality',
                'description' => 'Premium venue and event management company specializing in corporate and social events.',
                'city' => 'Lilongwe',
                'email' => 'events@crossroadshotel.mw',
                'phone' => '+265 1 752 888',
                'website' => 'https://crossroadshotel.mw',
                'average_rating' => 4.7,
                'total_reviews' => 145,
                'is_verified' => true,
                'is_featured' => true,
            ],
        ];

        $events = [
            // Lake of Stars Events
            [
                'organizer_slug' => 'lake-of-stars-events',
                'title' => 'Lake of Stars Music Festival 2025',
                'slug' => 'lake-of-stars-music-festival-2025',
                'description' => 'The legendary Lake of Stars Festival returns with an incredible lineup of African and international artists.',
                'category' => 'festival',
                'venue_name' => 'Sunbird Nkopola Lodge',
                'venue_city' => 'Mangochi',
                'start_datetime' => '2025-09-27 14:00:00',
                'end_datetime' => '2025-09-29 23:00:00',
                'cover_image' => '/resized-win/dj-1.jpg',
                'tickets' => [
                    ['name' => 'Weekend Pass', 'price' => 45000, 'quantity' => 500],
                    ['name' => 'VIP Weekend', 'price' => 120000, 'quantity' => 100],
                    ['name' => 'Day Pass', 'price' => 20000, 'quantity' => 300],
                ],
            ],
            [
                'organizer_slug' => 'lake-of-stars-events',
                'title' => 'Afro Fusion Night',
                'slug' => 'afro-fusion-night',
                'description' => 'A night celebrating the best of Afrobeats, Amapiano, and traditional Malawian sounds.',
                'category' => 'music',
                'venue_name' => 'Bingu Conference Centre',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-04-12 19:00:00',
                'end_datetime' => '2025-04-12 23:59:00',
                'cover_image' => '/resized-win/pa-system-1.jpg',
                'tickets' => [
                    ['name' => 'General Admission', 'price' => 15000, 'quantity' => 400],
                    ['name' => 'VIP Table', 'price' => 75000, 'quantity' => 20],
                ],
            ],
            // Malawi Sports Council
            [
                'organizer_slug' => 'malawi-sports-council',
                'title' => 'African Cup Qualifiers - Malawi vs Zambia',
                'slug' => 'african-cup-qualifiers-malawi-vs-zambia',
                'description' => 'Watch the Flames take on Zambia in this crucial AFCON qualifier match.',
                'category' => 'sports',
                'venue_name' => 'Bingu National Stadium',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-06-15 15:00:00',
                'end_datetime' => '2025-06-15 18:00:00',
                'cover_image' => '/resized-win/venue-1.jpg',
                'tickets' => [
                    ['name' => 'General Stand', 'price' => 5000, 'quantity' => 20000],
                    ['name' => 'VIP Stand', 'price' => 25000, 'quantity' => 500],
                    ['name' => 'Corporate Box', 'price' => 150000, 'quantity' => 50],
                ],
            ],
            [
                'organizer_slug' => 'malawi-sports-council',
                'title' => 'Super League Finals 2025',
                'slug' => 'super-league-finals-2025',
                'description' => 'The biggest match of the season - witness history as two titans clash for the championship.',
                'category' => 'sports',
                'venue_name' => 'Kamuzu Stadium',
                'venue_city' => 'Blantyre',
                'start_datetime' => '2025-11-22 14:00:00',
                'end_datetime' => '2025-11-22 17:00:00',
                'cover_image' => '/resized-win/venue-5.jpg',
                'tickets' => [
                    ['name' => 'General Admission', 'price' => 3000, 'quantity' => 30000],
                    ['name' => 'Premium Seats', 'price' => 15000, 'quantity' => 1000],
                ],
            ],
            // Flame Entertainment
            [
                'organizer_slug' => 'flame-entertainment',
                'title' => 'Memories of Malawi Concert',
                'slug' => 'memories-of-malawi-concert',
                'description' => 'A nostalgic celebration of Malawian music through the decades featuring legendary artists.',
                'category' => 'music',
                'venue_name' => 'Bingu Conference Centre',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-01-15 18:00:00',
                'end_datetime' => '2025-01-15 23:00:00',
                'cover_image' => '/resized-win/wedding-photo-1.jpg',
                'tickets' => [
                    ['name' => 'Standard', 'price' => 20000, 'quantity' => 600],
                    ['name' => 'VIP', 'price' => 50000, 'quantity' => 150],
                    ['name' => 'VVIP Table', 'price' => 200000, 'quantity' => 30],
                ],
            ],
            [
                'organizer_slug' => 'flame-entertainment',
                'title' => 'Jazz Night Under the Stars',
                'slug' => 'jazz-night-under-the-stars',
                'description' => 'An elegant evening of smooth jazz performances in a beautiful outdoor setting.',
                'category' => 'music',
                'venue_name' => 'Latitude 13',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-04-10 19:00:00',
                'end_datetime' => '2025-04-10 23:00:00',
                'cover_image' => '/resized-win/mc-2.jpg',
                'tickets' => [
                    ['name' => 'General', 'price' => 25000, 'quantity' => 200],
                    ['name' => 'Dinner Package', 'price' => 75000, 'quantity' => 50],
                ],
            ],
            // Sunbird Events
            [
                'organizer_slug' => 'sunbird-events',
                'title' => 'Malawi Food & Wine Expo 2025',
                'slug' => 'malawi-food-wine-expo-2025',
                'description' => 'Experience the finest culinary delights and wines from across Malawi and the region.',
                'category' => 'expo',
                'venue_name' => 'Sunbird Capital',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-03-20 10:00:00',
                'end_datetime' => '2025-03-22 18:00:00',
                'cover_image' => '/resized-win/food-7.jpg',
                'tickets' => [
                    ['name' => 'Day Pass', 'price' => 15000, 'quantity' => 500],
                    ['name' => 'Weekend Pass', 'price' => 35000, 'quantity' => 200],
                    ['name' => 'VIP Experience', 'price' => 100000, 'quantity' => 50],
                ],
            ],
            // Capital FM Events
            [
                'organizer_slug' => 'capital-fm-events',
                'title' => 'Capital FM Beach Party',
                'slug' => 'capital-fm-beach-party',
                'description' => 'Join us for the ultimate beach party experience with top DJs and live performances.',
                'category' => 'music',
                'venue_name' => 'Cape Maclear Beach',
                'venue_city' => 'Mangochi',
                'start_datetime' => '2025-08-16 12:00:00',
                'end_datetime' => '2025-08-16 22:00:00',
                'cover_image' => '/resized-win/lighting-1.jpg',
                'tickets' => [
                    ['name' => 'Early Bird', 'price' => 10000, 'quantity' => 300],
                    ['name' => 'Regular', 'price' => 15000, 'quantity' => 500],
                ],
            ],
            // Crossroads Hospitality
            [
                'organizer_slug' => 'crossroads-hospitality',
                'title' => 'Roses at Lilongwe - Valentines Gala',
                'slug' => 'roses-at-lilongwe-valentines-gala',
                'description' => 'A romantic evening of fine dining, live music, and dancing for couples.',
                'category' => 'event',
                'venue_name' => 'Crossroads Hotel',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-02-14 18:00:00',
                'end_datetime' => '2025-02-14 23:59:00',
                'cover_image' => '/resized-win/decor-2.jpg',
                'tickets' => [
                    ['name' => 'Couples Package', 'price' => 75000, 'quantity' => 100],
                    ['name' => 'VIP Couples', 'price' => 150000, 'quantity' => 30],
                ],
            ],
            [
                'organizer_slug' => 'crossroads-hospitality',
                'title' => 'New Year Eve Extravaganza 2025',
                'slug' => 'new-year-eve-extravaganza-2025',
                'description' => 'Ring in the new year with style at our legendary NYE party featuring top entertainment.',
                'category' => 'event',
                'venue_name' => 'Crossroads Hotel',
                'venue_city' => 'Lilongwe',
                'start_datetime' => '2025-12-31 20:00:00',
                'end_datetime' => '2026-01-01 04:00:00',
                'cover_image' => '/resized-win/venue-2.jpg',
                'tickets' => [
                    ['name' => 'Standard', 'price' => 35000, 'quantity' => 300],
                    ['name' => 'VIP', 'price' => 75000, 'quantity' => 100],
                    ['name' => 'Platinum Table', 'price' => 500000, 'quantity' => 10],
                ],
            ],
        ];

        // Create organizers
        foreach ($organizers as $organizerData) {
            // Create a user for the organizer
            $user = User::firstOrCreate(
                ['email' => $organizerData['email']],
                [
                    'name' => $organizerData['business_name'],
                    'password' => bcrypt('password123'),
                    'role' => 'provider',
                ]
            );

            // Create the service provider
            ServiceProvider::firstOrCreate(
                ['slug' => $organizerData['slug']],
                [
                    'user_id' => $user->id,
                    'business_name' => $organizerData['business_name'],
                    'slug' => $organizerData['slug'],
                    'description' => $organizerData['description'],
                    'location' => $organizerData['city'] . ', Malawi',
                    'city' => $organizerData['city'],
                    'email' => $organizerData['email'],
                    'phone' => $organizerData['phone'],
                    'website' => $organizerData['website'],
                    'average_rating' => $organizerData['average_rating'],
                    'total_reviews' => $organizerData['total_reviews'],
                    'is_featured' => $organizerData['is_featured'],
                    'is_active' => true,
                    'verification_status' => $organizerData['is_verified'] ? 'approved' : 'pending',
                ]
            );
        }

        // Create events
        foreach ($events as $eventData) {
            $organizer = ServiceProvider::where('slug', $eventData['organizer_slug'])->first();

            if (!$organizer) {
                continue;
            }

            // Upload cover image to storage
            $coverImage = null;
            if (!empty($eventData['cover_image'])) {
                $coverImage = $this->uploadImage($eventData['cover_image'], 'events/covers');
            }

            $event = Event::firstOrCreate(
                ['slug' => $eventData['slug']],
                [
                    'service_provider_id' => $organizer->id,
                    'title' => $eventData['title'],
                    'slug' => $eventData['slug'],
                    'description' => $eventData['description'],
                    'category' => $eventData['category'],
                    'venue_name' => $eventData['venue_name'],
                    'venue_city' => $eventData['venue_city'],
                    'start_datetime' => $eventData['start_datetime'],
                    'end_datetime' => $eventData['end_datetime'],
                    'cover_image' => $coverImage,
                    'status' => 'published',
                    'is_featured' => rand(0, 1),
                ]
            );

            // Create ticket packages for this event
            foreach ($eventData['tickets'] as $ticketData) {
                TicketPackage::firstOrCreate(
                    [
                        'event_id' => $event->id,
                        'name' => $ticketData['name'],
                    ],
                    [
                        'price' => $ticketData['price'],
                        'quantity_available' => $ticketData['quantity'],
                        'quantity_sold' => 0,
                        'is_active' => true,
                    ]
                );
            }
        }

        $this->command->info('Event organizers and events seeded successfully!');
    }
}
