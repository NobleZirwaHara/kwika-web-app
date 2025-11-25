<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();

        if ($customers->isEmpty()) {
            $this->command->warn('No customer users found. Please run UserSeeder first.');
            return;
        }

        // Malawian event locations
        $eventLocations = [
            ['name' => 'Bingu International Convention Centre', 'city' => 'Lilongwe', 'lat' => -13.9626, 'lng' => 33.7741],
            ['name' => 'Sunbird Capital Hotel', 'city' => 'Lilongwe', 'lat' => -13.9897, 'lng' => 33.7869],
            ['name' => 'Crossroads Hotel', 'city' => 'Lilongwe', 'lat' => -13.9833, 'lng' => 33.7833],
            ['name' => 'Latitude 13 Hotel', 'city' => 'Lilongwe', 'lat' => -13.9744, 'lng' => 33.7869],
            ['name' => 'Sunbird Mount Soche Hotel', 'city' => 'Blantyre', 'lat' => -15.7861, 'lng' => 35.0058],
            ['name' => 'Protea Hotel Ryalls', 'city' => 'Blantyre', 'lat' => -15.7833, 'lng' => 35.0167],
            ['name' => 'Amaryllis Hotel', 'city' => 'Blantyre', 'lat' => -15.8000, 'lng' => 35.0333],
            ['name' => 'Sunbird Ku Chawe Inn', 'city' => 'Zomba', 'lat' => -15.3333, 'lng' => 35.3167],
            ['name' => 'Mzuzu Hotel', 'city' => 'Mzuzu', 'lat' => -11.4587, 'lng' => 34.0217],
            ['name' => 'Kumbali Country Lodge', 'city' => 'Lilongwe', 'lat' => -14.0167, 'lng' => 33.8500],
        ];

        $bookingNumber = 1;

        // Create completed bookings (past events)
        $this->createCompletedBookings($customers, $eventLocations, $bookingNumber);

        // Create confirmed bookings (upcoming events)
        $this->createConfirmedBookings($customers, $eventLocations, $bookingNumber);

        // Create pending bookings (awaiting confirmation)
        $this->createPendingBookings($customers, $eventLocations, $bookingNumber);

        // Create cancelled bookings
        $this->createCancelledBookings($customers, $eventLocations, $bookingNumber);

        $this->command->info('Bookings seeded successfully!');
    }

    /**
     * Create completed bookings for past events
     */
    private function createCompletedBookings($customers, $eventLocations, &$bookingNumber): void
    {
        $completedBookings = [
            [
                'service_slug' => 'full-day-wedding-photography',
                'event_date' => now()->subMonths(2),
                'attendees' => 150,
                'special_requests' => 'Please capture lots of candid moments during the ceremony and reception.',
            ],
            [
                'service_slug' => 'cinematic-wedding-videography',
                'event_date' => now()->subMonths(2),
                'attendees' => 150,
                'special_requests' => 'We want a same-day highlights reel for our reception.',
            ],
            [
                'service_slug' => 'complete-wedding-decoration',
                'event_date' => now()->subMonths(3),
                'attendees' => 200,
                'special_requests' => 'Theme colors are burgundy and gold. Need setup by 8am.',
            ],
            [
                'service_slug' => 'international-buffet-catering',
                'event_date' => now()->subMonths(3),
                'attendees' => 200,
                'special_requests' => 'Please include vegetarian options. Guest count confirmed at 180.',
            ],
            [
                'service_slug' => '3-tier-wedding-cake',
                'event_date' => now()->subMonths(1),
                'attendees' => 100,
                'special_requests' => 'Vanilla flavor with buttercream frosting. Delivery by 2pm.',
            ],
            [
                'service_slug' => 'full-wedding-floral-package',
                'event_date' => now()->subMonths(1),
                'attendees' => 100,
                'special_requests' => 'White roses and baby breath. Need 5 bridesmaid bouquets.',
            ],
            [
                'service_slug' => 'premium-sound-package',
                'event_date' => now()->subMonth(),
                'attendees' => 250,
                'special_requests' => 'Outdoor venue, please bring extra speakers for coverage.',
            ],
            [
                'service_slug' => 'full-day-dj-service',
                'event_date' => now()->subMonth(),
                'attendees' => 250,
                'special_requests' => 'Mix of Malawian hits and international music. No explicit lyrics.',
            ],
            [
                'service_slug' => 'wedding-mc-services',
                'event_date' => now()->subWeeks(3),
                'attendees' => 180,
                'special_requests' => 'Bilingual MC needed - Chichewa and English.',
            ],
            [
                'service_slug' => '200-seater-tent-package',
                'event_date' => now()->subWeeks(3),
                'attendees' => 180,
                'special_requests' => 'Please setup the day before. Event is at a private residence.',
            ],
            [
                'service_slug' => 'full-day-venue-hire',
                'event_date' => now()->subWeeks(2),
                'attendees' => 120,
                'special_requests' => 'Need access from 8am for decoration setup.',
            ],
            [
                'service_slug' => 'complete-event-rental-package',
                'event_date' => now()->subWeeks(2),
                'attendees' => 120,
                'special_requests' => 'White chiavari chairs preferred. Delivery and pickup included?',
            ],
            [
                'service_slug' => 'designer-wedding-gown',
                'event_date' => now()->subWeeks(4),
                'attendees' => 150,
                'special_requests' => 'Size 10, prefer ball gown style with lace details.',
            ],
            [
                'service_slug' => 'groom-suit-rental',
                'event_date' => now()->subWeeks(4),
                'attendees' => 150,
                'special_requests' => 'Navy blue suit, size 42R. Need 3 groomsmen suits as well.',
            ],
            [
                'service_slug' => 'engagement-photo-shoot',
                'event_date' => now()->subMonths(4),
                'attendees' => 2,
                'special_requests' => 'Sunset shoot at Lilongwe Wildlife Centre preferred.',
            ],
        ];

        foreach ($completedBookings as $index => $bookingData) {
            $service = Service::where('slug', $bookingData['service_slug'])->first();

            if (!$service) {
                continue;
            }

            $customer = $customers->random();
            $location = $eventLocations[array_rand($eventLocations)];
            $eventDate = $bookingData['event_date'];

            $totalAmount = $service->base_price;
            if ($bookingData['service_slug'] === 'international-buffet-catering') {
                $totalAmount = $service->base_price * $bookingData['attendees'];
            }

            $depositAmount = $totalAmount * ($service->deposit_percentage / 100);
            $remainingAmount = 0; // Completed bookings are fully paid

            Booking::create([
                'booking_number' => 'BK' . str_pad($bookingNumber++, 6, '0', STR_PAD_LEFT),
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'service_provider_id' => $service->service_provider_id,
                'event_date' => $eventDate,
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'event_location' => $location['name'] . ', ' . $location['city'],
                'event_latitude' => $location['lat'],
                'event_longitude' => $location['lng'],
                'attendees' => $bookingData['attendees'],
                'special_requests' => $bookingData['special_requests'],
                'total_amount' => $totalAmount,
                'deposit_amount' => $depositAmount,
                'remaining_amount' => $remainingAmount,
                'status' => 'completed',
                'payment_status' => 'fully_paid',
                'confirmed_at' => $eventDate->copy()->subWeeks(2),
                'completed_at' => $eventDate->copy()->addDay(),
            ]);
        }
    }

    /**
     * Create confirmed bookings for upcoming events
     */
    private function createConfirmedBookings($customers, $eventLocations, &$bookingNumber): void
    {
        $confirmedBookings = [
            [
                'service_slug' => 'full-day-wedding-photography',
                'event_date' => now()->addWeeks(3),
                'attendees' => 180,
                'special_requests' => 'Include drone shots of the venue and surrounding area.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'cinematic-wedding-videography',
                'event_date' => now()->addWeeks(3),
                'attendees' => 180,
                'special_requests' => 'We want interviews with family members included.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'elegant-decor-package',
                'event_date' => now()->addWeeks(4),
                'attendees' => 150,
                'special_requests' => 'Garden theme with pastel colors. Need floral centerpieces.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'traditional-malawian-feast',
                'event_date' => now()->addWeeks(4),
                'attendees' => 150,
                'special_requests' => 'Include nsima, chicken, beef, and fish options.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'custom-cake-design',
                'event_date' => now()->addWeeks(5),
                'attendees' => 120,
                'special_requests' => 'Chocolate cake with fondant covering. Theme: rustic elegance.',
                'payment_status' => 'fully_paid',
            ],
            [
                'service_slug' => 'bridal-bouquet-package',
                'event_date' => now()->addWeeks(5),
                'attendees' => 120,
                'special_requests' => 'Pink peonies and white roses. Delivery to church at 9am.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'basic-sound-system',
                'event_date' => now()->addWeeks(6),
                'attendees' => 100,
                'special_requests' => 'Indoor venue, community hall setup.',
                'payment_status' => 'fully_paid',
            ],
            [
                'service_slug' => 'wedding-reception-dj',
                'event_date' => now()->addWeeks(6),
                'attendees' => 100,
                'special_requests' => 'More traditional Malawian music, less international.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'half-day-mc-service',
                'event_date' => now()->addMonth(),
                'attendees' => 80,
                'special_requests' => 'English only, corporate style event.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => '100-seater-tent-package',
                'event_date' => now()->addMonth(),
                'attendees' => 80,
                'special_requests' => 'Backyard event, need setup 2 days before.',
                'payment_status' => 'fully_paid',
            ],
            [
                'service_slug' => 'half-day-venue-package',
                'event_date' => now()->addMonths(2),
                'attendees' => 60,
                'special_requests' => 'Evening event, 5pm-10pm. Need sound system included.',
                'payment_status' => 'deposit_paid',
            ],
            [
                'service_slug' => 'chairs-and-tables-rental',
                'event_date' => now()->addMonths(2),
                'attendees' => 60,
                'special_requests' => '50 chairs, 10 tables. Church hall event.',
                'payment_status' => 'fully_paid',
            ],
        ];

        foreach ($confirmedBookings as $bookingData) {
            $service = Service::where('slug', $bookingData['service_slug'])->first();

            if (!$service) {
                continue;
            }

            $customer = $customers->random();
            $location = $eventLocations[array_rand($eventLocations)];
            $eventDate = $bookingData['event_date'];

            $totalAmount = $service->base_price;
            if (in_array($bookingData['service_slug'], ['traditional-malawian-feast'])) {
                $totalAmount = $service->base_price * $bookingData['attendees'];
            }

            $depositAmount = $totalAmount * ($service->deposit_percentage / 100);
            $remainingAmount = $bookingData['payment_status'] === 'fully_paid' ? 0 : $totalAmount - $depositAmount;

            Booking::create([
                'booking_number' => 'BK' . str_pad($bookingNumber++, 6, '0', STR_PAD_LEFT),
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'service_provider_id' => $service->service_provider_id,
                'event_date' => $eventDate,
                'start_time' => '10:00:00',
                'end_time' => '18:00:00',
                'event_location' => $location['name'] . ', ' . $location['city'],
                'event_latitude' => $location['lat'],
                'event_longitude' => $location['lng'],
                'attendees' => $bookingData['attendees'],
                'special_requests' => $bookingData['special_requests'],
                'total_amount' => $totalAmount,
                'deposit_amount' => $depositAmount,
                'remaining_amount' => $remainingAmount,
                'status' => 'confirmed',
                'payment_status' => $bookingData['payment_status'],
                'confirmed_at' => now()->subDays(rand(3, 10)),
            ]);
        }
    }

    /**
     * Create pending bookings awaiting confirmation
     */
    private function createPendingBookings($customers, $eventLocations, &$bookingNumber): void
    {
        $pendingBookings = [
            [
                'service_slug' => 'event-photography',
                'event_date' => now()->addMonths(3),
                'attendees' => 200,
                'special_requests' => 'Corporate event photography needed.',
            ],
            [
                'service_slug' => 'event-videography',
                'event_date' => now()->addMonths(3),
                'attendees' => 200,
                'special_requests' => 'Need highlights video within 1 week of event.',
            ],
            [
                'service_slug' => 'ceremony-backdrop-decoration',
                'event_date' => now()->addMonths(4),
                'attendees' => 100,
                'special_requests' => 'White and silver theme for church ceremony.',
            ],
            [
                'service_slug' => 'cocktail-reception-catering',
                'event_date' => now()->addMonths(4),
                'attendees' => 100,
                'special_requests' => 'Mix of hot and cold appetizers. Bar service included?',
            ],
            [
                'service_slug' => 'cupcake-tower',
                'event_date' => now()->addMonths(5),
                'attendees' => 80,
                'special_requests' => '100 cupcakes in assorted flavors. Can you do custom toppers?',
            ],
            [
                'service_slug' => 'event-entertainment-dj',
                'event_date' => now()->addMonths(5),
                'attendees' => 150,
                'special_requests' => 'Birthday party, mix of old and new hits.',
            ],
        ];

        foreach ($pendingBookings as $bookingData) {
            $service = Service::where('slug', $bookingData['service_slug'])->first();

            if (!$service) {
                continue;
            }

            $customer = $customers->random();
            $location = $eventLocations[array_rand($eventLocations)];
            $eventDate = $bookingData['event_date'];

            $totalAmount = $service->base_price;
            if (in_array($bookingData['service_slug'], ['cocktail-reception-catering'])) {
                $totalAmount = $service->base_price * $bookingData['attendees'];
            }

            $depositAmount = $totalAmount * ($service->deposit_percentage / 100);

            Booking::create([
                'booking_number' => 'BK' . str_pad($bookingNumber++, 6, '0', STR_PAD_LEFT),
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'service_provider_id' => $service->service_provider_id,
                'event_date' => $eventDate,
                'start_time' => '11:00:00',
                'end_time' => '19:00:00',
                'event_location' => $location['name'] . ', ' . $location['city'],
                'event_latitude' => $location['lat'],
                'event_longitude' => $location['lng'],
                'attendees' => $bookingData['attendees'],
                'special_requests' => $bookingData['special_requests'],
                'total_amount' => $totalAmount,
                'deposit_amount' => $depositAmount,
                'remaining_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);
        }
    }

    /**
     * Create cancelled bookings
     */
    private function createCancelledBookings($customers, $eventLocations, &$bookingNumber): void
    {
        $cancelledBookings = [
            [
                'service_slug' => 'full-day-wedding-photography',
                'event_date' => now()->addWeeks(8),
                'attendees' => 120,
                'special_requests' => 'Full day coverage with second shooter.',
                'cancellation_reason' => 'Event postponed to next year',
                'cancelled_at' => now()->subDays(5),
            ],
            [
                'service_slug' => '200-seater-tent-package',
                'event_date' => now()->addWeeks(10),
                'attendees' => 180,
                'special_requests' => 'White tent with clear sides.',
                'cancellation_reason' => 'Found alternative venue with built-in facilities',
                'cancelled_at' => now()->subDays(3),
            ],
            [
                'service_slug' => 'full-wedding-planning-service',
                'event_date' => now()->addMonths(6),
                'attendees' => 200,
                'special_requests' => 'Complete planning from start to finish.',
                'cancellation_reason' => 'Budget constraints, planning ourselves',
                'cancelled_at' => now()->subDays(7),
            ],
        ];

        foreach ($cancelledBookings as $bookingData) {
            $service = Service::where('slug', $bookingData['service_slug'])->first();

            if (!$service) {
                continue;
            }

            $customer = $customers->random();
            $location = $eventLocations[array_rand($eventLocations)];
            $eventDate = $bookingData['event_date'];

            $totalAmount = $service->base_price;
            $depositAmount = $totalAmount * ($service->deposit_percentage / 100);

            Booking::create([
                'booking_number' => 'BK' . str_pad($bookingNumber++, 6, '0', STR_PAD_LEFT),
                'user_id' => $customer->id,
                'service_id' => $service->id,
                'service_provider_id' => $service->service_provider_id,
                'event_date' => $eventDate,
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'event_location' => $location['name'] . ', ' . $location['city'],
                'event_latitude' => $location['lat'],
                'event_longitude' => $location['lng'],
                'attendees' => $bookingData['attendees'],
                'special_requests' => $bookingData['special_requests'],
                'total_amount' => $totalAmount,
                'deposit_amount' => $depositAmount,
                'remaining_amount' => $totalAmount,
                'status' => 'cancelled',
                'payment_status' => 'pending',
                'cancellation_reason' => $bookingData['cancellation_reason'],
                'cancelled_at' => $bookingData['cancelled_at'],
            ]);
        }
    }
}
