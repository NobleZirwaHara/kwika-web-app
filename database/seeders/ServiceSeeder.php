<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceProvider;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Database\Seeders\Traits\UploadsSeederImages;

class ServiceSeeder extends Seeder
{
    use UploadsSeederImages;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Helper arrays for images
        $imagesByCategory = [
            'cake' => ['cake-1.jpg', 'cake-2.jpg', 'cake-3.jpg', 'cake-4.jpg', 'cake-5.jpg', 'cake-6.jpg', 'cake-7.jpg', 'cake-8.jpg', 'cake-9.jpg', 'cake-10.jpg', 'cake-11.jpg'],
            'food' => ['food-1.jpg', 'food-2.jpg', 'food-3.jpg', 'food-4.jpg', 'food-5.jpg', 'food-6.jpg', 'food-7.jpg', 'food-8.jpg', 'food-9.jpg', 'food-10.jpg'],
            'decor' => ['decor-1.jpg', 'decor-2.jpg', 'decor-3.jpg', 'decor-4.jpg', 'decor-5.jpg', 'decor-6.jpg', 'decor-7.jpg', 'tent-decor.jpg'],
            'photography' => ['bride-groom-shoot-2.jpg', 'bride-groom-shoot-3.jpg', 'bride-groom-shoot-4.jpg', 'bride-groom-shoot-5.jpg', 'bride-groom-shoot-6.jpg', 'wedding-photo-1.jpg', 'bride-groom-photoshoot-1.jpg', 'bridal-party-shoot-1.jpg'],
            'sound' => ['pa-system-1.jpg', 'pa-system-2.jpg', 'pa-system-3.jpg', 'pa-system-4.jpg', 'pa-system-5.jpg', 'pa-system-6.jpg', 'pa-system-7.jpg', 'pa-system-8.jpg'],
            'tent' => ['tent-1.jpg', 'tent-3.jpg', 'tent-4.jpg', 'tent-decor.jpg', 'umbrella-chairs-tents-1.jpg'],
            'venue' => ['venue-1.jpg', 'venue-2.jpg', 'venue-5.jpg', 'decor-7.jpg', 'tent-decor.jpg'],
            'dj' => ['dj-1.jpg', 'lighting-1.jpg', 'pa-system-1.jpg', 'pa-system-4.jpg', 'recording-equip.jpg'],
            'mc' => ['mc-1.jpg', 'mc-2.jpg', 'mc-3.jpg', 'dj-1.jpg', 'pa-system-1.jpg'],
            'bridal' => ['bridal-party-clothes-1.jpg', 'bride-groom-shoot-3.jpg', 'bride-groom-shoot-4.jpg', 'wedding-photo-1.jpg', 'bridal-party-shoot-1.jpg'],
            'groom' => ['groom-men-shoot.jpg', 'groomsmen-shoot.jpg', 'groomsmen-shoot-1.jpg', 'bride-groom-shoot-2.jpg', 'bride-groom-shoot-5.jpg'],
            'videography' => ['videographer-1.jpg', 'bride-groom-photoshoot-1.jpg', 'random-shoot-2.jpg', 'random-shoot-3.jpg', 'wedding-photo-1.jpg'],
            'general' => ['decor-1.jpg', 'food-1.jpg', 'cake-1.jpg', 'venue-1.jpg', 'tent-1.jpg'],
        ];

        // Create services for each provider
        $this->createPhotographyServices($imagesByCategory);
        $this->createVideographyServices($imagesByCategory);
        $this->createDecorServices($imagesByCategory);
        $this->createCateringServices($imagesByCategory);
        $this->createBakeryServices($imagesByCategory);
        $this->createFloristServices($imagesByCategory);
        $this->createSoundServices($imagesByCategory);
        $this->createDJServices($imagesByCategory);
        $this->createMCServices($imagesByCategory);
        $this->createTentServices($imagesByCategory);
        $this->createVenueServices($imagesByCategory);
        $this->createRentalServices($imagesByCategory);
        $this->createWeddingPlannerServices($imagesByCategory);
        $this->createBridalWearServices($imagesByCategory);
        $this->createGroomWearServices($imagesByCategory);

        $this->command->info('Services seeded successfully!');
    }

    /**
     * Get rotated images for a service and upload to storage
     */
    private function getRotatedImages($categoryImages, $serviceIndex, $count = 6)
    {
        $imageOffset = $serviceIndex * 2; // Offset by 2 images for each service
        $galleryImages = [];

        for ($i = 0; $i < $count; $i++) {
            $publicPath = '/resized-win/' . $categoryImages[($imageOffset + $i) % count($categoryImages)];
            $storagePath = $this->uploadImage($publicPath, 'services/gallery');
            if ($storagePath) {
                $galleryImages[] = $storagePath;
            }
        }

        return $galleryImages;
    }

    private function createPhotographyServices($images)
    {
        $provider = ServiceProvider::where('slug', 'tiwonge-photography')->first();
        if (!$provider) return;

        $photographyCategory = ServiceCategory::where('name', 'Photographers')->first();
        if (!$photographyCategory) return;

        $services = [
            [
                'name' => 'Full Day Wedding Photography',
                'description' => 'Complete wedding photography coverage from preparation to reception. Includes 500+ edited photos, online gallery, and USB delivery.',
                'base_price' => 450000,
                'price_type' => 'fixed',
                'duration' => 480,
                'inclusions' => ['Pre-wedding consultation', 'Full day coverage (8 hours)', '500+ edited photos', 'Online gallery', 'USB with high-resolution images', 'Print rights'],
            ],
            [
                'name' => 'Engagement Photo Shoot',
                'description' => 'Professional engagement photography session at location of your choice. Capture your love story before the big day.',
                'base_price' => 85000,
                'price_type' => 'fixed',
                'duration' => 120,
                'inclusions' => ['2-hour photo session', 'Up to 50 edited photos', 'Online gallery', 'Print rights', 'Location consultation'],
            ],
            [
                'name' => 'Event Photography - Corporate',
                'description' => 'Professional photography for corporate events, conferences, and business functions.',
                'base_price' => 35000,
                'price_type' => 'hourly',
                'duration' => 60,
                'inclusions' => ['Hourly coverage', 'Edited photos delivered within 48 hours', 'Online gallery', 'Print rights'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['photography'], $index, 6);

            $service = Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $photographyCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'duration' => $serviceData['duration'],
                'max_attendees' => null,
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Valid ID', 'Event details', '50% deposit required'],
                'primary_image' => $galleryImages[0],
                'gallery_images' => $galleryImages,
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }

    private function createVideographyServices($images)
    {
        $provider = ServiceProvider::where('slug', 'motion-visions-video')->first();
        if (!$provider) return;

        $videographyCategory = ServiceCategory::where('name', 'Videographers')->first();
        if (!$videographyCategory) return;

        $services = [
            [
                'name' => 'Cinematic Wedding Videography',
                'description' => 'Full day wedding videography with cinematic editing. Includes highlight reel, full ceremony, and reception coverage.',
                'base_price' => 550000,
                'price_type' => 'fixed',
                'duration' => 480,
                'inclusions' => ['Full day coverage', '10-15 min highlight reel', 'Full ceremony video', 'Reception highlights', 'Drone footage', 'Professional editing', 'USB delivery'],
            ],
            [
                'name' => 'Event Videography Package',
                'description' => 'Professional videography for corporate events, birthday parties, and special occasions.',
                'base_price' => 45000,
                'price_type' => 'hourly',
                'duration' => 60,
                'inclusions' => ['Hourly coverage', 'Professional editing', 'Highlight video', 'USB delivery'],
            ],
            [
                'name' => 'Drone Coverage Add-on',
                'description' => 'Aerial drone footage to enhance your wedding or event video with breathtaking perspectives.',
                'base_price' => 85000,
                'price_type' => 'fixed',
                'duration' => 120,
                'inclusions' => ['2 hours of drone coverage', 'Aerial highlights', 'Integrated into main video'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['videography'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $videographyCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'duration' => $serviceData['duration'],
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Event details', 'Access to venue', '50% deposit'],
                'primary_image' => $galleryImages[0],
                'gallery_images' => $galleryImages,
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }

    private function createDecorServices($images)
    {
        $providers = ServiceProvider::whereIn('slug', ['elegant-events-decor', 'luxury-touch-decor'])->get();

        $decorCategory = ServiceCategory::where('name', 'Decorators')->first();
        if (!$decorCategory) return;

        $serviceCounter = 0;
        foreach ($providers as $provider) {
            $services = [
                [
                    'name' => 'Complete Wedding Decoration',
                    'description' => 'Full venue decoration including ceremony and reception areas. Custom color scheme and theme execution.',
                    'base_price' => 750000,
                    'price_type' => 'fixed',
                    'inclusions' => ['Venue consultation', 'Custom theme design', 'All decoration materials', 'Setup and takedown', 'Centerpieces', 'Backdrop design', 'Entrance decor'],
                ],
                [
                    'name' => 'Ceremony Backdrop',
                    'description' => 'Stunning backdrop for wedding ceremony or photo opportunities. Various styles available.',
                    'base_price' => 150000,
                    'price_type' => 'fixed',
                    'inclusions' => ['Custom backdrop design', 'Fresh or silk flowers', 'Draping', 'Setup and removal'],
                ],
                [
                    'name' => 'Table Centerpieces & Setup',
                    'description' => 'Beautiful table centerpieces and complete table decoration for your reception.',
                    'base_price' => 12000,
                    'price_type' => 'custom',
                    'max_price' => 25000,
                    'inclusions' => ['Centerpiece design', 'Table linens', 'Chair covers', 'Table runners', 'Place settings'],
                ],
            ];

            foreach ($services as $index => $serviceData) {
                $galleryImages = $this->getRotatedImages($images['decor'], $serviceCounter, 7);

                Service::create([
                    'service_provider_id' => $provider->id,
                    'service_category_id' => $decorCategory->id,
                    'name' => $serviceData['name'],
                    'slug' => \Str::slug($provider->slug . '-' . $serviceData['name']),
                    'description' => $serviceData['description'],
                    'base_price' => $serviceData['base_price'],
                    'max_price' => $serviceData['max_price'] ?? null,
                    'price_type' => $serviceData['price_type'],
                    'currency' => 'MWK',
                    'inclusions' => $serviceData['inclusions'],
                    'requirements' => ['Venue details', 'Guest count', 'Theme preferences', '60% deposit'],
                    'primary_image' => $galleryImages[0],
                    'gallery_images' => $galleryImages,
                    'is_active' => true,
                    'requires_deposit' => true,
                    'deposit_percentage' => 60,
                ]);

                $serviceCounter++;
            }
        }
    }

    private function createCateringServices($images)
    {
        $providers = ServiceProvider::whereIn('slug', ['gourmet-gatherings', 'traditional-feast'])->get();

        $cateringCategory = ServiceCategory::where('name', 'Full Service Catering')->first();
        if (!$cateringCategory) return;

        $serviceCounter = 0;
        foreach ($providers as $provider) {
            $services = $provider->slug == 'gourmet-gatherings' ? [
                [
                    'name' => 'International Buffet Catering',
                    'description' => 'Delicious international cuisine buffet with professional service. Perfect for weddings and large events.',
                    'base_price' => 18000,
                    'price_type' => 'custom',
                    'max_price' => 35000,
                    'inclusions' => ['4-course meal', 'Professional servers', 'Buffet setup', 'Cutlery and crockery', 'Chef on-site'],
                ],
                [
                    'name' => 'Plated Dinner Service',
                    'description' => 'Elegant plated dinner service for formal events and wedding receptions.',
                    'base_price' => 22000,
                    'price_type' => 'custom',
                    'max_price' => 40000,
                    'inclusions' => ['3 or 4-course meal', 'Professional waiters', 'Premium crockery', 'Menu customization', 'Dietary accommodations'],
                ],
            ] : [
                [
                    'name' => 'Traditional Malawian Feast',
                    'description' => 'Authentic Malawian cuisine for your cultural wedding or event. Nsima, chambo, and all the traditional favorites.',
                    'base_price' => 12000,
                    'price_type' => 'custom',
                    'max_price' => 20000,
                    'inclusions' => ['Nsima', 'Chambo', 'Chicken', 'Vegetables', 'Traditional sides', 'Professional service', 'Setup'],
                ],
                [
                    'name' => 'Mixed Cuisine Package',
                    'description' => 'Combination of traditional Malawian and modern cuisine to satisfy all guests.',
                    'base_price' => 15000,
                    'price_type' => 'custom',
                    'max_price' => 28000,
                    'inclusions' => ['Traditional dishes', 'Continental options', 'Professional service', 'Buffet setup'],
                ],
            ];

            foreach ($services as $index => $serviceData) {
                $galleryImages = $this->getRotatedImages($images['food'], $serviceCounter, 8);

                Service::create([
                    'service_provider_id' => $provider->id,
                    'service_category_id' => $cateringCategory->id,
                    'name' => $serviceData['name'],
                    'slug' => \Str::slug($provider->slug . '-' . $serviceData['name']),
                    'description' => $serviceData['description'],
                    'base_price' => $serviceData['base_price'],
                    'max_price' => $serviceData['max_price'],
                    'price_type' => $serviceData['price_type'],
                    'currency' => 'MWK',
                    'inclusions' => $serviceData['inclusions'],
                    'requirements' => ['Guest count', 'Menu selection', 'Venue details', '50% deposit', 'Minimum 50 guests'],
                    'primary_image' => $galleryImages[0],
                    'gallery_images' => $galleryImages,
                    'is_active' => true,
                    'requires_deposit' => true,
                    'deposit_percentage' => 50,
                ]);

                $serviceCounter++;
            }
        }
    }

    private function createBakeryServices($images)
    {
        $provider = ServiceProvider::where('slug', 'sweet-creations')->first();
        if (!$provider) return;

        $bakeryCategory = ServiceCategory::where('name', 'Bakers & Cake Designers')->first();
        if (!$bakeryCategory) return;

        $services = [
            [
                'name' => '3-Tier Wedding Cake',
                'description' => 'Stunning 3-tier custom wedding cake. Choose your flavors, fillings, and design. Serves 100-120 guests.',
                'base_price' => 180000,
                'price_type' => 'fixed',
                'inclusions' => ['Custom design consultation', 'Choice of flavors', 'Fondant or buttercream finish', 'Fresh flowers', 'Delivery and setup'],
            ],
            [
                'name' => '5-Tier Premium Wedding Cake',
                'description' => 'Elaborate 5-tier wedding cake perfect for large weddings. Exquisite design and premium ingredients. Serves 200-250 guests.',
                'base_price' => 350000,
                'price_type' => 'fixed',
                'inclusions' => ['Premium design consultation', 'Multiple flavor tiers', 'Fondant finish', 'Sugar flowers or fresh flowers', 'Gold or silver accents', 'Delivery and setup'],
            ],
            [
                'name' => 'Dessert Table Package',
                'description' => 'Complete dessert table with cupcakes, cookies, macarons, and cake pops. Perfect for weddings and parties.',
                'base_price' => 120000,
                'price_type' => 'fixed',
                'inclusions' => ['50 cupcakes', '100 cookies', '50 cake pops', 'Table setup and decor', 'Matching theme design'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['cake'], $index, 9);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $bakeryCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Event date', 'Design preferences', 'Flavor selection', '60% deposit', 'Minimum 2 weeks notice'],
                'primary_image' => $galleryImages[0],
                'gallery_images' => $galleryImages,
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 60,
            ]);
        }
    }

    private function createFloristServices($images)
    {
        $provider = ServiceProvider::where('slug', 'bloom-petal-florists')->first();
        if (!$provider) return;

        $floralCategory = ServiceCategory::where('name', 'Floral Designers')->first();
        if (!$floralCategory) return;

        $services = [
            [
                'name' => 'Bridal Bouquet & Accessories',
                'description' => 'Beautiful bridal bouquet with matching bridesmaid bouquets and boutonnieres for the groom and groomsmen.',
                'base_price' => 85000,
                'price_type' => 'fixed',
                'inclusions' => ['Bridal bouquet', '4 bridesmaid bouquets', 'Groom boutonniere', '6 groomsmen boutonnieres', 'Flower girl basket'],
            ],
            [
                'name' => 'Full Wedding Floral Package',
                'description' => 'Complete floral decoration for your wedding including ceremony and reception flowers.',
                'base_price' => 450000,
                'price_type' => 'fixed',
                'inclusions' => ['All bridal party flowers', 'Ceremony arch flowers', 'Aisle decorations', 'Reception centerpieces', 'Cake flowers', 'Welcome area arrangements'],
            ],
            [
                'name' => 'Table Centerpiece Arrangements',
                'description' => 'Elegant floral centerpieces for your reception tables. Fresh seasonal flowers in your chosen colors.',
                'base_price' => 12000,
                'price_type' => 'custom',
                'max_price' => 25000,
                'inclusions' => ['Fresh seasonal flowers', 'Premium vase or container', 'Greenery accents', 'Delivery and setup'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['decor'], $index, 6);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $floralCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'max_price' => $serviceData['max_price'] ?? null,
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Event date', 'Color scheme', 'Venue details', '50% deposit', 'Minimum 1 week notice'],
                'primary_image' => $galleryImages[0],
                'gallery_images' => $galleryImages,
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);

        }
    }

    private function createSoundServices($images)
    {
        $providers = ServiceProvider::whereIn('slug', ['crystal-sound-systems', 'prosound-malawi'])->get();

        $soundCategory = ServiceCategory::where('name', 'PA Systems')->first();
        if (!$soundCategory) return;

        $serviceCounter = 0;
        foreach ($providers as $provider) {
            $services = [
                [
                    'name' => 'Basic PA System Rental',
                    'description' => 'Professional PA system suitable for small to medium events (100-200 guests). Includes microphones and basic setup.',
                    'base_price' => 85000,
                    'price_type' => 'fixed',
                    'inclusions' => ['PA system', '2 wireless microphones', '1 wired microphone', 'Speakers', 'Mixer', 'Cables', 'Setup and operation'],
                ],
                [
                    'name' => 'Premium Sound Package',
                    'description' => 'High-end sound system for large weddings and events (300-500 guests). Professional sound engineer included.',
                    'base_price' => 200000,
                    'price_type' => 'fixed',
                    'inclusions' => ['Premium PA system', '4 wireless microphones', 'Large speakers', 'Subwoofers', 'Professional mixer', 'Sound engineer', 'Full day operation'],
                ],
                [
                    'name' => 'Sound & Lighting Combo',
                    'description' => 'Complete sound and lighting solution for your event. Transform your venue with professional audio-visual setup.',
                    'base_price' => 350000,
                    'price_type' => 'fixed',
                    'inclusions' => ['PA system', 'Stage lighting', 'Dance floor lights', 'LED effects', 'Technician', 'Full setup'],
                ],
            ];

            foreach ($services as $index => $serviceData) {
                $galleryImages = $this->getRotatedImages($images['sound'], $serviceCounter, 7);

                Service::create([
                    'service_provider_id' => $provider->id,
                    'service_category_id' => $soundCategory->id,
                    'name' => $serviceData['name'],
                    'slug' => \Str::slug($provider->slug . '-' . $serviceData['name']),
                    'description' => $serviceData['description'],
                    'base_price' => $serviceData['base_price'],
                    'price_type' => $serviceData['price_type'],
                    'currency' => 'MWK',
                    'duration' => 480,
                    'inclusions' => $serviceData['inclusions'],
                    'requirements' => ['Venue details', 'Power source confirmation', 'Event timeline', '50% deposit'],
                    'primary_image' => $galleryImages[0],
                    'gallery_images' => $galleryImages,
                    'is_active' => true,
                    'requires_deposit' => true,
                    'deposit_percentage' => 50,
                ]);

                $serviceCounter++;
            }
        }
    }

    private function createDJServices($images)
    {
        $provider = ServiceProvider::where('slug', 'dj-spinmaster')->first();
        if (!$provider) return;

        $djCategory = ServiceCategory::where('name', 'DJs')->first();
        if (!$djCategory) return;

        $services = [
            [
                'name' => '4-Hour DJ Package',
                'description' => 'Professional DJ service for your wedding or party. Extensive music library covering all genres and eras.',
                'base_price' => 150000,
                'price_type' => 'fixed',
                'duration' => 240,
                'inclusions' => ['4 hours of DJ service', 'Professional equipment', 'Music consultation', 'Requests accepted', 'Wireless microphone'],
            ],
            [
                'name' => 'Full Day DJ Service',
                'description' => 'Complete DJ coverage for your entire event from ceremony to reception. Keep your guests entertained all day.',
                'base_price' => 280000,
                'price_type' => 'fixed',
                'duration' => 480,
                'inclusions' => ['8 hours of DJ service', 'Ceremony music', 'Cocktail hour music', 'Reception entertainment', 'Professional equipment', 'MC services'],
            ],
            [
                'name' => 'DJ + Lighting Package',
                'description' => 'DJ service with dance floor lighting to create the perfect party atmosphere.',
                'base_price' => 220000,
                'price_type' => 'fixed',
                'duration' => 300,
                'inclusions' => ['5 hours DJ service', 'Dance floor lighting', 'LED effects', 'Professional equipment', 'Music consultation'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['dj'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $djCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'duration' => $serviceData['duration'],
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Playlist preferences', 'Event timeline', 'Venue details', '50% deposit'],
                'primary_image' => '/resized-win/' . $images['dj'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['dj']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);

        }
    }

    private function createMCServices($images)
    {
        $provider = ServiceProvider::where('slug', 'mc-chifundo')->first();
        if (!$provider) return;

        $mcCategory = ServiceCategory::where('name', 'MCs & Hosts')->first();
        if (!$mcCategory) return;

        $services = [
            [
                'name' => 'Wedding MC Services',
                'description' => 'Professional MC for your wedding. Bilingual (English/Chichewa) with excellent crowd engagement and program coordination.',
                'base_price' => 120000,
                'price_type' => 'fixed',
                'duration' => 360,
                'inclusions' => ['6 hours MC service', 'Program coordination', 'Bilingual hosting', 'Pre-event consultation', 'Professional attire'],
            ],
            [
                'name' => 'Corporate Event Hosting',
                'description' => 'Professional MC for corporate events, conferences, and business functions. Experienced and articulate.',
                'base_price' => 80000,
                'price_type' => 'fixed',
                'duration' => 240,
                'inclusions' => ['4 hours MC service', 'Program flow management', 'Professional presentation', 'Event coordination'],
            ],
            [
                'name' => 'Full Day Wedding MC Package',
                'description' => 'Complete MC coverage from ceremony through to reception. Ensure your wedding runs smoothly and guests are entertained.',
                'base_price' => 180000,
                'price_type' => 'fixed',
                'duration' => 480,
                'inclusions' => ['8 hours MC service', 'Ceremony coordination', 'Reception hosting', 'Games and entertainment', 'Pre-wedding consultation', 'Professional attire'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['mc'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $mcCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'duration' => $serviceData['duration'],
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Event program', 'VIP list', 'Timeline', '50% deposit'],
                'primary_image' => '/resized-win/' . $images['mc'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['mc']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }

    private function createTentServices($images)
    {
        $provider = ServiceProvider::where('slug', 'royal-tents')->first();
        if (!$provider) return;

        $tentCategory = ServiceCategory::where('name', 'Tents & Marquees')->first();
        if (!$tentCategory) return;

        $services = [
            [
                'name' => '100-Seater Tent Package',
                'description' => 'Complete tent rental for 100 guests. Includes setup, tables, and chairs.',
                'base_price' => 250000,
                'price_type' => 'fixed',
                'max_attendees' => 100,
                'inclusions' => ['Tent (10m x 20m)', '10 tables', '100 chairs', 'Setup and takedown', 'Transport'],
            ],
            [
                'name' => '200-Seater Tent Package',
                'description' => 'Large tent for 200 guests with complete furniture. Perfect for medium weddings.',
                'base_price' => 450000,
                'price_type' => 'fixed',
                'max_attendees' => 200,
                'inclusions' => ['Tent (15m x 30m)', '20 tables', '200 chairs', 'Setup and takedown', 'Transport', 'Lighting'],
            ],
            [
                'name' => 'Premium Marquee - 300 Guests',
                'description' => 'Elegant marquee tent for large weddings and events. High-quality with decoration options.',
                'base_price' => 750000,
                'price_type' => 'fixed',
                'max_attendees' => 300,
                'inclusions' => ['Premium marquee (20m x 40m)', '30 tables', '300 chairs', 'Interior decoration', 'Lighting', 'Flooring', 'Setup and takedown', 'Transport'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['tent'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $tentCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'max_attendees' => $serviceData['max_attendees'],
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Venue location', 'Setup space', 'Access for trucks', '60% deposit', 'Minimum 1 week notice'],
                'primary_image' => '/resized-win/' . $images['tent'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['tent']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 60,
            ]);
        }
    }

    private function createVenueServices($images)
    {
        $provider = ServiceProvider::where('slug', 'sunset-garden-venue')->first();
        if (!$provider) return;

        $venueCategory = ServiceCategory::where('name', 'Wedding Venues')->first();
        if (!$venueCategory) return;

        $services = [
            [
                'name' => 'Full Day Venue Hire',
                'description' => 'Beautiful outdoor garden venue for your wedding. Includes ceremony and reception areas with stunning sunset views.',
                'base_price' => 350000,
                'price_type' => 'fixed',
                'max_attendees' => 500,
                'inclusions' => ['Full day venue hire', 'Ceremony area', 'Reception area', 'Bridal suite', 'Parking', 'Security', 'Basic tables and chairs'],
            ],
            [
                'name' => 'Half Day Venue Package',
                'description' => 'Venue hire for ceremony or reception only. 6 hours of venue access.',
                'base_price' => 200000,
                'price_type' => 'fixed',
                'max_attendees' => 300,
                'inclusions' => ['6 hours venue hire', 'Chosen area (ceremony or reception)', 'Basic furniture', 'Parking', 'Security'],
            ],
            [
                'name' => 'Premium Wedding Package',
                'description' => 'Complete wedding venue package with additional services. Make your day stress-free.',
                'base_price' => 650000,
                'price_type' => 'fixed',
                'max_attendees' => 500,
                'inclusions' => ['Full day venue', 'Ceremony & reception setup', 'Decorated arch', 'Table centerpieces', 'Bridal suite', 'Parking', 'Security', 'Venue coordinator', 'Setup and cleanup'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['venue'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $venueCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'max_attendees' => $serviceData['max_attendees'],
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Guest count', 'Event timeline', 'Vendor list', '70% deposit', 'Minimum 2 months notice'],
                'primary_image' => '/resized-win/' . $images['venue'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['venue']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 70,
            ]);
        }
    }

    private function createRentalServices($images)
    {
        $provider = ServiceProvider::where('slug', 'premium-event-rentals')->first();
        if (!$provider) return;

        $rentalCategory = ServiceCategory::where('name', 'Chairs & Tables')->first();
        if (!$rentalCategory) return;

        $services = [
            [
                'name' => 'Chairs & Tables Package (100 pax)',
                'description' => 'Complete furniture rental for 100 guests. Quality chairs and tables delivered and set up.',
                'base_price' => 180000,
                'price_type' => 'fixed',
                'max_attendees' => 100,
                'inclusions' => ['100 chairs', '10 tables (10-seater)', 'Delivery', 'Setup', 'Collection'],
            ],
            [
                'name' => 'Premium White Chairs Package',
                'description' => 'Elegant white Tiffany chairs perfect for weddings. Available in quantities of 50+.',
                'base_price' => 1500,
                'price_type' => 'custom',
                'max_price' => 2000,
                'inclusions' => ['White Tiffany chairs', 'Delivery', 'Setup', 'Collection'],
            ],
            [
                'name' => 'Complete Event Rental Package',
                'description' => 'Everything you need for your event: furniture, cutlery, crockery, and glassware.',
                'base_price' => 350000,
                'price_type' => 'fixed',
                'max_attendees' => 150,
                'inclusions' => ['150 chairs', '15 tables', 'Cutlery set', 'Plates and bowls', 'Glasses', 'Table linens', 'Delivery', 'Setup', 'Collection'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['general'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $rentalCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'max_price' => $serviceData['max_price'] ?? null,
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'max_attendees' => $serviceData['max_attendees'] ?? null,
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Delivery address', 'Guest count', 'Event date', '50% deposit'],
                'primary_image' => '/resized-win/' . $images['tent'][4],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, array_slice($images['tent'], 0, 5)),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }

    private function createWeddingPlannerServices($images)
    {
        $provider = ServiceProvider::where('slug', 'dream-weddings')->first();
        if (!$provider) return;

        $plannerCategory = ServiceCategory::where('name', 'Wedding Planners')->first();
        if (!$plannerCategory) return;

        $services = [
            [
                'name' => 'Full Wedding Planning Service',
                'description' => 'Complete wedding planning from engagement to honeymoon. We handle every detail so you can enjoy your special day.',
                'base_price' => 1500000,
                'price_type' => 'fixed',
                'inclusions' => ['Unlimited consultations', 'Vendor sourcing and management', 'Budget management', 'Theme and design', 'Timeline creation', 'Rehearsal coordination', 'Day-of coordination', '12-month planning period'],
            ],
            [
                'name' => 'Partial Wedding Planning',
                'description' => 'Planning assistance for specific aspects of your wedding. Perfect if you\'ve started planning but need professional help.',
                'base_price' => 750000,
                'price_type' => 'fixed',
                'inclusions' => ['Consultations (up to 10)', 'Vendor recommendations', 'Design assistance', 'Timeline creation', 'Day-of coordination', '6-month support'],
            ],
            [
                'name' => 'Day-of Wedding Coordination',
                'description' => 'Professional coordination on your wedding day. Ensure everything runs smoothly while you enjoy every moment.',
                'base_price' => 350000,
                'price_type' => 'fixed',
                'inclusions' => ['Pre-wedding meeting', 'Vendor coordination', 'Timeline management', 'Setup supervision', 'Problem solving', 'Full day coordination', 'Assistant coordinator'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['general'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $plannerCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Wedding date', 'Guest count estimate', 'Budget range', 'Initial consultation', '40% deposit'],
                'primary_image' => '/resized-win/' . $images['photography'][1],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, array_slice($images['photography'], 0, 6)),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 40,
            ]);
        }
    }

    private function createBridalWearServices($images)
    {
        $provider = ServiceProvider::where('slug', 'bridal-elegance')->first();
        if (!$provider) return;

        $bridalCategory = ServiceCategory::where('name', 'Bridal Wear')->first();
        if (!$bridalCategory) return;

        $services = [
            [
                'name' => 'Designer Wedding Gown',
                'description' => 'Exclusive designer wedding gowns imported and locally crafted. Find your dream dress with our expert consultants.',
                'base_price' => 350000,
                'price_type' => 'custom',
                'max_price' => 1500000,
                'inclusions' => ['Personal consultant', 'Dress fitting', 'Alterations (up to 3)', 'Veil', 'Accessories advice'],
            ],
            [
                'name' => 'Bridesmaid Dresses',
                'description' => 'Beautiful bridesmaid dresses in various styles and colors. Coordinated look for your bridal party.',
                'base_price' => 80000,
                'price_type' => 'custom',
                'max_price' => 150000,
                'inclusions' => ['Dress', 'Basic alterations', 'Color matching', 'Style consultation'],
            ],
            [
                'name' => 'Bridal Wear Package',
                'description' => 'Complete bridal wear package including gown, veil, shoes, and accessories. Everything you need.',
                'base_price' => 500000,
                'price_type' => 'custom',
                'max_price' => 2000000,
                'inclusions' => ['Wedding gown', 'Veil', 'Shoes', 'Jewelry', 'Hair accessories', 'Multiple fittings', 'Alterations'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['bridal'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $bridalCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'max_price' => $serviceData['max_price'],
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Measurements', 'Wedding date', 'Appointment booking', '50% deposit', 'Minimum 2 months notice'],
                'primary_image' => '/resized-win/' . $images['bridal'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['bridal']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }

    private function createGroomWearServices($images)
    {
        $provider = ServiceProvider::where('slug', 'gentlemans-wardrobe')->first();
        if (!$provider) return;

        $groomCategory = ServiceCategory::where('name', 'Groom Wear')->first();
        if (!$groomCategory) return;

        $services = [
            [
                'name' => 'Groom Suit Rental',
                'description' => 'Premium suit rental for the groom. Choose from our collection of designer suits and tuxedos.',
                'base_price' => 120000,
                'price_type' => 'fixed',
                'inclusions' => ['Suit rental (3-piece)', 'Shirt', 'Tie/bow tie', 'Shoes', 'Fitting service', '3-day rental'],
            ],
            [
                'name' => 'Groomsmen Package',
                'description' => 'Coordinated suit rentals for the entire wedding party. Matching suits for groomsmen.',
                'base_price' => 75000,
                'price_type' => 'fixed',
                'inclusions' => ['Suit rental (2-piece)', 'Shirt', 'Tie', 'Fitting', '2-day rental'],
            ],
            [
                'name' => 'Custom Tailored Suit',
                'description' => 'Bespoke suit tailored to perfection. Own a perfectly fitted suit for your wedding and beyond.',
                'base_price' => 300000,
                'price_type' => 'custom',
                'max_price' => 800000,
                'inclusions' => ['Premium fabric selection', 'Multiple fittings', 'Custom tailoring', 'Shirt', 'Tie', 'Accessories', 'Suit ownership'],
            ],
        ];

        foreach ($services as $index => $serviceData) {
            $galleryImages = $this->getRotatedImages($images['groom'], $index, 5);

            Service::create([
                'service_provider_id' => $provider->id,
                'service_category_id' => $groomCategory->id,
                'name' => $serviceData['name'],
                'slug' => \Str::slug($serviceData['name']),
                'description' => $serviceData['description'],
                'base_price' => $serviceData['base_price'],
                'max_price' => $serviceData['max_price'] ?? null,
                'price_type' => $serviceData['price_type'],
                'currency' => 'MWK',
                'inclusions' => $serviceData['inclusions'],
                'requirements' => ['Measurements', 'Wedding date', 'Fitting appointment', '50% deposit'],
                'primary_image' => '/resized-win/' . $images['groom'][0],
                'gallery_images' => array_map(fn($img) => '/resized-win/' . $img, $images['groom']),
                'is_active' => true,
                'requires_deposit' => true,
                'deposit_percentage' => 50,
            ]);
        }
    }
}
