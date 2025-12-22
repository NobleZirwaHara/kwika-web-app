<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\TicketPackage;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get an event organizer (service provider)
        $user = User::firstOrCreate(
            ['email' => 'organizer@kwika.events'],
            [
                'name' => 'Kwika Events Organizer',
                'password' => bcrypt('password'),
                'role' => 'provider',
            ]
        );

        $provider = ServiceProvider::firstOrCreate(
            ['user_id' => $user->id],
            [
                'business_name' => 'Kwika Events',
                'slug' => 'kwika-events',
                'email' => 'organizer@kwika.events',
                'phone' => '+265 999 123 456',
                'description' => 'Premier event organizer in Malawi',
                'location' => 'Lilongwe',
                'city' => 'Lilongwe',
                'verification_status' => 'approved',
            ]
        );

        // Event data matching the frontend
        $events = [
            [
                'title' => 'Goodyear Cotton Bowl Classic - CFP Quarterfinal: #2 Ohio State vs #3 Georgia',
                'description' => 'Experience the thrill of college football at its finest! Watch top-ranked teams battle it out in this CFP Quarterfinal match.',
                'category' => 'sports',
                'venue_name' => 'National Stadium',
                'venue_city' => 'Lilongwe',
                'cover_image' => '/resized-win/venue-1.jpg',
                'start_datetime' => Carbon::parse('2025-12-31 18:00:00'),
                'end_datetime' => Carbon::parse('2025-12-31 22:00:00'),
                'max_attendees' => 50000,
                'packages' => [
                    ['name' => 'VIP', 'price' => 450, 'quantity' => 500],
                    ['name' => 'General Admission', 'price' => 225, 'quantity' => 5000],
                ],
            ],
            [
                'title' => 'Memories of Malawi',
                'description' => 'A spectacular concert featuring Malawi\'s finest musicians. Celebrate our culture through music and dance.',
                'category' => 'music-arts',
                'venue_name' => 'Bingu Convention Centre',
                'venue_city' => 'Lilongwe',
                'cover_image' => '/resized-win/wedding-photo-1.jpg',
                'start_datetime' => Carbon::parse('2026-01-15 19:00:00'),
                'end_datetime' => Carbon::parse('2026-01-15 23:00:00'),
                'max_attendees' => 2000,
                'packages' => [
                    ['name' => 'VIP Table', 'price' => 120, 'quantity' => 50],
                    ['name' => 'General Admission', 'price' => 50, 'quantity' => 1500],
                ],
            ],
            [
                'title' => 'New Year Championship - CFP Quarterfinal: #1 Alabama vs #4 Texas',
                'description' => 'Start the new year with championship football! Alabama takes on Texas in this epic CFP showdown.',
                'category' => 'sports',
                'venue_name' => 'Kamuzu Stadium',
                'venue_city' => 'Blantyre',
                'cover_image' => '/resized-win/venue-2.jpg',
                'start_datetime' => Carbon::parse('2026-01-01 15:00:00'),
                'end_datetime' => Carbon::parse('2026-01-01 19:00:00'),
                'max_attendees' => 40000,
                'packages' => [
                    ['name' => 'Premium Seats', 'price' => 350, 'quantity' => 1000],
                    ['name' => 'Standard', 'price' => 180, 'quantity' => 8000],
                ],
            ],
            [
                'title' => 'Roses at Lilongwe',
                'description' => 'Valentine\'s special event featuring romantic performances, dinner, and entertainment.',
                'category' => 'music-arts',
                'venue_name' => 'Crossroads Hotel',
                'venue_city' => 'Lilongwe',
                'cover_image' => '/resized-win/decor-2.jpg',
                'start_datetime' => Carbon::parse('2026-02-14 18:00:00'),
                'end_datetime' => Carbon::parse('2026-02-14 23:00:00'),
                'max_attendees' => 300,
                'packages' => [
                    ['name' => 'Couple Package', 'price' => 150, 'quantity' => 150],
                    ['name' => 'Single Ticket', 'price' => 75, 'quantity' => 100],
                ],
            ],
            [
                'title' => 'Lake of Stars Music Festival 2026',
                'description' => '3-day music festival on the shores of Lake Malawi featuring international and local artists.',
                'category' => 'festival',
                'venue_name' => 'Lake Malawi Beach',
                'venue_city' => 'Mangochi',
                'cover_image' => '/resized-win/dj-1.jpg',
                'start_datetime' => Carbon::parse('2026-09-27 12:00:00'),
                'end_datetime' => Carbon::parse('2026-09-29 23:00:00'),
                'max_attendees' => 10000,
                'packages' => [
                    ['name' => '3-Day Pass VIP', 'price' => 250, 'quantity' => 500],
                    ['name' => '3-Day Pass', 'price' => 120, 'quantity' => 5000],
                    ['name' => 'Day Pass', 'price' => 50, 'quantity' => 3000],
                ],
            ],
            [
                'title' => 'Malawi Food & Wine Expo',
                'description' => 'Discover the best of Malawian cuisine and wines. Featuring celebrity chefs and wine tasting sessions.',
                'category' => 'exhibition',
                'venue_name' => 'Sunbird Capital',
                'venue_city' => 'Lilongwe',
                'cover_image' => '/resized-win/food-7.jpg',
                'start_datetime' => Carbon::parse('2026-03-20 10:00:00'),
                'end_datetime' => Carbon::parse('2026-03-20 18:00:00'),
                'max_attendees' => 1000,
                'packages' => [
                    ['name' => 'Premium Access', 'price' => 70, 'quantity' => 200],
                    ['name' => 'General Entry', 'price' => 35, 'quantity' => 800],
                ],
            ],
            [
                'title' => 'Jazz Night Under the Stars',
                'description' => 'An intimate evening of smooth jazz performances in a beautiful garden setting.',
                'category' => 'concert',
                'venue_name' => 'Garden Lounge',
                'venue_city' => 'Lilongwe',
                'cover_image' => '/resized-win/mc-2.jpg',
                'start_datetime' => Carbon::parse('2026-04-10 19:00:00'),
                'end_datetime' => Carbon::parse('2026-04-10 23:00:00'),
                'max_attendees' => 200,
                'packages' => [
                    ['name' => 'VIP Table (4 people)', 'price' => 200, 'quantity' => 20],
                    ['name' => 'General Admission', 'price' => 45, 'quantity' => 120],
                ],
            ],
            [
                'title' => 'African Cup Qualifiers - Malawi vs Zambia',
                'description' => 'Support the Flames! Watch Malawi take on Zambia in this crucial Africa Cup qualifier match.',
                'category' => 'sports',
                'venue_name' => 'Kamuzu Stadium',
                'venue_city' => 'Blantyre',
                'cover_image' => '/resized-win/venue-5.jpg',
                'start_datetime' => Carbon::parse('2026-06-15 15:00:00'),
                'end_datetime' => Carbon::parse('2026-06-15 17:30:00'),
                'max_attendees' => 60000,
                'packages' => [
                    ['name' => 'VIP', 'price' => 50, 'quantity' => 500],
                    ['name' => 'Covered Stand', 'price' => 25, 'quantity' => 10000],
                    ['name' => 'General Stand', 'price' => 15, 'quantity' => 40000],
                ],
            ],
        ];

        // Create events and their ticket packages
        foreach ($events as $eventData) {
            $packages = $eventData['packages'];
            unset($eventData['packages']);

            // Generate slug
            $slug = Str::slug($eventData['title']) . '-' . Str::random(6);

            $event = Event::create(array_merge($eventData, [
                'service_provider_id' => $provider->id,
                'slug' => $slug,
                'type' => 'public',
                'status' => 'published',
                'is_featured' => rand(0, 1) == 1,
                'venue_country' => 'Malawi',
                'timezone' => 'Africa/Blantyre',
                'registered_count' => rand(50, 500),
            ]));

            // Create ticket packages for this event
            foreach ($packages as $index => $package) {
                TicketPackage::create([
                    'event_id' => $event->id,
                    'name' => $package['name'],
                    'description' => 'Access to ' . strtolower($package['name']) . ' area',
                    'price' => $package['price'],
                    'currency' => 'MWK',
                    'quantity_available' => $package['quantity'],
                    'quantity_sold' => rand(0, (int)($package['quantity'] * 0.3)),
                    'min_per_order' => 1,
                    'max_per_order' => 10,
                    'is_active' => true,
                    'display_order' => $index,
                    'features' => json_encode([
                        'Event access',
                        $package['name'] . ' seating area',
                    ]),
                ]);
            }
        }

        $this->command->info('✅ Created ' . count($events) . ' sample events with ticket packages!');
    }
}
