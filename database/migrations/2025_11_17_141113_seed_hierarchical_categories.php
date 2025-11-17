<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clear existing categories
        DB::table('service_categories')->truncate();

        // Define hierarchical categories
        $categories = [
            [
                'name' => 'Venues',
                'subcategories' => [
                    'Wedding Venues', 'Conference Centers', 'Hotels & Resorts', 'Outdoor Venues',
                    'Banquet Halls', 'Community Centres', 'Garden Venues', 'Private Homes & Estates',
                    'Churches & Religious Venues', 'Corporate Meeting Rooms'
                ]
            ],
            [
                'name' => 'Catering & Food Services',
                'subcategories' => [
                    'Full Service Catering', 'Buffet Catering', 'Corporate Catering', 'Traditional Catering',
                    'Private Chefs', 'Food Trucks', 'Desserts & Pastries', 'Bakers & Cake Designers',
                    'Bar Services', 'Cocktail Bars & Mixologists', 'Ice Sculptures & Specialty Displays'
                ]
            ],
            [
                'name' => 'Decor & Styling',
                'subcategories' => [
                    'Planners', 'Wedding Planners', 'Corporate Planners', 'Decorators',
                    'Thematic Decor', 'Floral Arrangements', 'Stage & Backdrop Design', 'Balloon Decor',
                    'Table Setup & Centerpieces', 'Draping & Lighting Decor'
                ]
            ],
            [
                'name' => 'Photography & Videography',
                'subcategories' => [
                    'Photographers', 'Videographers', 'Drone Operators', 'Photo Booth Services',
                    'Live Streaming Services', 'Editing & Post Production'
                ]
            ],
            [
                'name' => 'Entertainment',
                'subcategories' => [
                    'DJs', 'Live Bands', 'MCs & Hosts', 'Traditional Dancers', 'Comedians',
                    'Magicians', 'Kids Entertainment', 'Instrumentalists', 'Choirs & Vocal Groups',
                    'Cultural Performers'
                ]
            ],
            [
                'name' => 'Sound, Stage & Lighting',
                'subcategories' => [
                    'PA Systems', 'Sound Engineers', 'Stage Hire', 'Lighting Equipment',
                    'LED Screens & Projectors', 'Broadcasting Equipment', 'Generators', 'Technical Crew'
                ]
            ],
            [
                'name' => 'Rentals',
                'subcategories' => [
                    'Tents & Marquees', 'Chairs & Tables', 'Decor Furniture', 'Cutlery & Crockery',
                    'Glassware', 'Dance Floors', 'Portable Toilets', 'Cooling & Heating Equipment',
                    'Carpets & Rugs', 'Linen & Draping Rentals'
                ]
            ],
            [
                'name' => 'Fashion & Beauty',
                'subcategories' => [
                    'Bridal Wear', 'Groom Wear', 'Makeup Artists', 'Hair Stylists',
                    'Traditional Attire Rentals', 'Tailors & Designers', 'Jewelry & Accessories'
                ]
            ],
            [
                'name' => 'Transport & Logistics',
                'subcategories' => [
                    'Transport', 'VIP Cars', 'Wedding Cars', 'Party Buses',
                    'Shuttle Services', 'Logistics Companies', 'Delivery Services'
                ]
            ],
            [
                'name' => 'Security & Safety',
                'subcategories' => [
                    'Security', 'Bouncers', 'Private Security Firms', 'Fire & Safety Services',
                    'Emergency Medical Technicians', 'Crowd Control Teams'
                ]
            ],
            [
                'name' => 'Printing & Branding',
                'subcategories' => [
                    'Invitation Cards', 'Signage', 'Backdrop Printing', 'Banners & Posters',
                    'Branded Merchandise', 'Name Tags & Badges', 'Corporate Branding'
                ]
            ],
            [
                'name' => 'Gifts & Crafts',
                'subcategories' => [
                    'Gift Shops', 'Wedding Favours', 'Corporate Gifts', 'Custom Handcrafted Items',
                    'Gift Packaging Services'
                ]
            ],
            [
                'name' => 'Technology',
                'subcategories' => [
                    'Ticketing Solutions', 'Apps', 'Registration Systems', 'RFID Wristbands',
                    'Live Streaming Tech', 'Projectors & Screens', 'Virtual Platforms'
                ]
            ],
            [
                'name' => 'Staffing',
                'subcategories' => [
                    'Waiters & Waitresses', 'Ushers', 'Managers', 'Logistics Assistants',
                    'Stage Hands', 'Hosts & Hostesses'
                ]
            ],
            [
                'name' => 'Flowers & Plants',
                'subcategories' => [
                    'Floral Designers', 'Bouquets', 'Table Arrangements', 'Flower Walls',
                    'Greenery Rentals', 'Artificial Flowers'
                ]
            ],
            [
                'name' => 'Kids Party Services',
                'subcategories' => [
                    'Jumping Castles', 'Face Painting', 'Clowns', 'Kids Entertainers',
                    'Kids Party Decor', 'Kids Catering', 'Slides & Play Equipment'
                ]
            ],
            [
                'name' => 'Utility Services',
                'subcategories' => [
                    'Cleaning Services', 'Waste Management', 'Post-Clean Up', 'Janitorial Services',
                    'Sanitation & Hygiene', 'Fumigation & Pest Control', 'Water Supply',
                    'Power Supply & Backup', 'Portable Handwashing Stations'
                ]
            ],
        ];

        $sortOrder = 1;

        foreach ($categories as $categoryData) {
            // Insert parent category
            $parentId = DB::table('service_categories')->insertGetId([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => null,
                'icon' => null,
                'parent_id' => null,
                'is_active' => true,
                'sort_order' => $sortOrder,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $sortOrder++;

            // Insert subcategories
            $subSortOrder = 1;
            foreach ($categoryData['subcategories'] as $subcategoryName) {
                DB::table('service_categories')->insert([
                    'name' => $subcategoryName,
                    'slug' => Str::slug($subcategoryName),
                    'description' => null,
                    'icon' => null,
                    'parent_id' => $parentId,
                    'is_active' => true,
                    'sort_order' => $subSortOrder,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $subSortOrder++;
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('service_categories')->truncate();
    }
};
