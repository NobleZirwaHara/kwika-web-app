<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get completed bookings (only completed bookings can be reviewed)
        $completedBookings = Booking::where('status', 'completed')
            ->with(['user', 'serviceProvider', 'service'])
            ->get();

        if ($completedBookings->isEmpty()) {
            $this->command->warn('No completed bookings found. Please run BookingSeeder first.');
            return;
        }

        // Not all bookings get reviews - about 70% review rate is realistic
        $bookingsToReview = $completedBookings->random(min(11, $completedBookings->count()));

        $reviewTemplates = $this->getReviewTemplates();

        foreach ($bookingsToReview as $booking) {
            $serviceType = $this->getServiceType($booking->service->slug);
            $templates = $reviewTemplates[$serviceType] ?? $reviewTemplates['general'];

            $template = $templates[array_rand($templates)];

            $daysAfterEvent = rand(1, 7); // Reviews typically come 1-7 days after event
            $reviewDate = $booking->completed_at->addDays($daysAfterEvent);

            $review = Review::create([
                'user_id' => $booking->user_id,
                'service_provider_id' => $booking->service_provider_id,
                'booking_id' => $booking->id,
                'rating' => $template['rating'],
                'comment' => $template['comment'],
                'images' => $template['images'] ?? [],
                'is_verified' => true,
                'is_featured' => $template['featured'],
                'is_approved' => true,
                'created_at' => $reviewDate,
                'updated_at' => $reviewDate,
            ]);

            // Some reviews get provider responses
            if ($template['has_response']) {
                $responseDate = $reviewDate->copy()->addDays(rand(1, 3));
                $review->update([
                    'admin_response' => $template['provider_response'],
                    'responded_at' => $responseDate,
                    'updated_at' => $responseDate,
                ]);
            }
        }

        $this->command->info('Reviews seeded successfully!');
    }

    /**
     * Get service type from slug
     */
    private function getServiceType(string $slug): string
    {
        if (str_contains($slug, 'photography')) return 'photography';
        if (str_contains($slug, 'videography')) return 'videography';
        if (str_contains($slug, 'decor')) return 'decor';
        if (str_contains($slug, 'catering') || str_contains($slug, 'feast')) return 'catering';
        if (str_contains($slug, 'cake') || str_contains($slug, 'cupcake')) return 'bakery';
        if (str_contains($slug, 'floral') || str_contains($slug, 'bouquet')) return 'florist';
        if (str_contains($slug, 'sound')) return 'sound';
        if (str_contains($slug, 'dj')) return 'dj';
        if (str_contains($slug, 'mc')) return 'mc';
        if (str_contains($slug, 'tent')) return 'tent';
        if (str_contains($slug, 'venue')) return 'venue';
        if (str_contains($slug, 'rental')) return 'rental';
        if (str_contains($slug, 'wedding-gown') || str_contains($slug, 'bridal')) return 'bridal';
        if (str_contains($slug, 'suit') || str_contains($slug, 'groom')) return 'groom';

        return 'general';
    }

    /**
     * Get review templates by service type
     */
    private function getReviewTemplates(): array
    {
        return [
            'photography' => [
                [
                    'rating' => 5,
                    'comment' => 'Absolutely amazing work! Tiwonge captured every special moment of our wedding day. The photos are stunning and we couldn\'t be happier. Very professional and made everyone feel comfortable. Highly recommend!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you so much! It was an honor to capture your special day. Wishing you both a lifetime of happiness!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Exceptional photography service! The engagement shoot at Lilongwe Wildlife Centre turned out beautifully. Great eye for detail and perfect lighting. Will definitely book again for the wedding.',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'So glad you loved the photos! Looking forward to capturing your wedding day!',
                ],
                [
                    'rating' => 4,
                    'comment' => 'Great photographer with good equipment. Photos came out nice though we had to wait a bit longer than expected for the final album. Overall satisfied with the service.',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'Thank you for your feedback! We apologize for the delay. We\'re working on improving our turnaround time.',
                ],
            ],
            'videography' => [
                [
                    'rating' => 5,
                    'comment' => 'The wedding video is absolutely perfect! Mphatso did an incredible job capturing the emotions and all the important moments. The same-day highlights reel at our reception was a huge hit with our guests. Worth every kwacha!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you! It was a beautiful wedding to film. Wishing you all the best!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Professional videography team that knew exactly what they were doing. The cinematic quality is outstanding - feels like a movie! Audio was crystal clear and the editing is top-notch.',
                    'featured' => true,
                    'has_response' => false,
                ],
            ],
            'decor' => [
                [
                    'rating' => 5,
                    'comment' => 'Chikondi and team transformed our venue into a dream! The burgundy and gold theme was executed perfectly. They arrived early for setup and everything was ready on time. Guests couldn\'t stop talking about how beautiful everything looked.',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you for trusting us with your special day! It was a pleasure working with you.',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Elegant Events Décor exceeded our expectations! The ceremony backdrop was stunning and the table centerpieces were exactly what we wanted. Very creative and professional team.',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'We\'re so happy you loved it! Thank you for choosing us!',
                ],
                [
                    'rating' => 4,
                    'comment' => 'Beautiful decoration work. The garden theme with pastel colors came out lovely. Minor issue with setup timing but they resolved it quickly. Overall very pleased.',
                    'featured' => false,
                    'has_response' => false,
                ],
            ],
            'catering' => [
                [
                    'rating' => 5,
                    'comment' => 'Kondwani\'s team provided excellent catering service! The international buffet was delicious with great variety. Food was hot, fresh, and beautifully presented. All our guests were impressed. The vegetarian options were also fantastic!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you! We\'re thrilled your guests enjoyed the food. It was a pleasure serving at your wedding!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Authentic Malawian feast that everyone loved! The nsima was perfect, and the variety of meats (chicken, beef, fish) was well prepared. Traditional Feast really knows their craft. Highly recommend for traditional weddings!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Zikomo kwambiri! We\'re glad to have been part of your traditional celebration!',
                ],
            ],
            'bakery' => [
                [
                    'rating' => 5,
                    'comment' => 'The wedding cake from Sweet Creations was absolutely stunning and delicious! The vanilla buttercream was perfect - not too sweet. Delivery was on time and Tamanda was very accommodating with our design requests. Best wedding cake in Lilongwe!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you so much! We loved creating your special cake. Congratulations!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Beautiful custom cake design. The chocolate fondant cake was moist and the rustic elegance theme was executed perfectly. Great craftsmanship!',
                    'featured' => false,
                    'has_response' => false,
                ],
            ],
            'florist' => [
                [
                    'rating' => 5,
                    'comment' => 'Grace at Bloom & Petal did an amazing job! The white roses and baby breath bouquets were exactly what I envisioned. All 5 bridesmaid bouquets matched perfectly and stayed fresh throughout the day. Beautiful work!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'It was such a joy creating your floral arrangements! Thank you for choosing Bloom & Petal!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Full wedding floral package was worth it! The pink peonies and white roses were gorgeous. Delivery to church was punctual. Highly recommend!',
                    'featured' => false,
                    'has_response' => false,
                ],
            ],
            'sound' => [
                [
                    'rating' => 5,
                    'comment' => 'Crystal Sound provided excellent audio for our outdoor wedding! Thokozani brought extra speakers for good coverage as requested. Sound quality was crystal clear throughout the ceremony and reception. Very professional setup.',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you! We\'re glad the sound quality met your expectations. Congratulations!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Premium sound package was excellent. All guests could hear clearly even in our large venue. Equipment was top quality and the team was professional.',
                    'featured' => false,
                    'has_response' => false,
                ],
            ],
            'dj' => [
                [
                    'rating' => 5,
                    'comment' => 'DJ SpinMaster Limbani was fantastic! Perfect mix of Malawian hits and international music. He read the crowd well and kept everyone dancing all night. No explicit lyrics as requested. Professional and fun!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'It was a blast! Thank you for letting me be part of your celebration!',
                ],
                [
                    'rating' => 4,
                    'comment' => 'Good DJ service. Music selection was appropriate and guests enjoyed dancing. Would have preferred more traditional Malawian songs but overall a great night.',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'Thank you for the feedback! We\'ll keep that in mind for future events.',
                ],
            ],
            'mc' => [
                [
                    'rating' => 5,
                    'comment' => 'MC Chifundo was excellent! Bilingual hosting in both Chichewa and English was perfect for our mixed crowd. Very engaging and kept the program flowing smoothly. Everyone loved his energy and humor!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Zikomo! It was an honor to host your wonderful celebration!',
                ],
                [
                    'rating' => 5,
                    'comment' => 'Professional MC for our corporate event. English only as requested, very polished and kept everything on schedule. Highly recommended for formal events.',
                    'featured' => false,
                    'has_response' => false,
                ],
            ],
            'tent' => [
                [
                    'rating' => 5,
                    'comment' => 'Royal Tents did an amazing job! The 200-seater tent was set up the day before as requested. Quality tents with good weather protection. Patrick\'s team was professional and cleaned up perfectly after. Excellent service!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you! We\'re glad everything went smoothly for your event!',
                ],
            ],
            'venue' => [
                [
                    'rating' => 5,
                    'comment' => 'Sunset Garden is a beautiful venue! Stella was very accommodating and gave us access from 8am for decoration setup as needed. The space is perfect for weddings with stunning views. Highly recommend!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'Thank you for choosing Sunset Garden! We\'re so happy your day was special!',
                ],
            ],
            'rental' => [
                [
                    'rating' => 5,
                    'comment' => 'Premium Event Rentals provided everything we needed! The white chiavari chairs were elegant and all equipment was in excellent condition. Delivery and pickup were seamless. Great service from Isaac and team!',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'Thank you! We\'re glad we could contribute to your successful event!',
                ],
            ],
            'bridal' => [
                [
                    'rating' => 5,
                    'comment' => 'Found my dream wedding gown at Bridal Elegance! Linda helped me find the perfect ball gown with beautiful lace details. Size 10 fit perfectly. The quality is excellent and the service was outstanding!',
                    'featured' => true,
                    'has_response' => true,
                    'provider_response' => 'You looked absolutely stunning! Thank you for trusting us with your special day!',
                ],
            ],
            'groom' => [
                [
                    'rating' => 5,
                    'comment' => 'Gentleman\'s Wardrobe provided excellent suit rental service! The navy blue suit size 42R fit perfectly. James also sorted out suits for my 3 groomsmen - all looked sharp! Great quality and fair prices.',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'Thank you! We\'re glad you all looked your best on the big day!',
                ],
            ],
            'general' => [
                [
                    'rating' => 5,
                    'comment' => 'Excellent service from start to finish! Very professional, delivered exactly what was promised. Would definitely recommend and book again for future events.',
                    'featured' => false,
                    'has_response' => true,
                    'provider_response' => 'Thank you for your kind words! We appreciate your business!',
                ],
            ],
        ];
    }
}
