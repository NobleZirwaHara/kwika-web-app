<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Photographers',
                'slug' => 'photographers',
                'description' => 'Professional event and wedding photographers',
                'icon' => 'camera',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Videographers',
                'slug' => 'videographers',
                'description' => 'Cinematic event and wedding videography services',
                'icon' => 'video',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Decorators',
                'slug' => 'decorators',
                'description' => 'Event decoration and styling services',
                'icon' => 'sparkles',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'PA Systems',
                'slug' => 'pa-systems',
                'description' => 'Professional audio equipment and sound systems',
                'icon' => 'music',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Caterers',
                'slug' => 'caterers',
                'description' => 'Professional catering and food services',
                'icon' => 'utensils',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Florists',
                'slug' => 'florists',
                'description' => 'Floral arrangements and bouquet services',
                'icon' => 'flower',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Venues',
                'slug' => 'venues',
                'description' => 'Event venues and spaces for hire',
                'icon' => 'building',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'DJs',
                'slug' => 'djs',
                'description' => 'Professional DJ and entertainment services',
                'icon' => 'disc',
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            \App\ServiceCategory::create($category);
        }
    }
}
