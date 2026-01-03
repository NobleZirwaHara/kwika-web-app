<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Catalogue;
use App\Models\Company;
use App\Models\ServiceProvider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Database\Seeders\Traits\UploadsSeederImages;

class ProductSeeder extends Seeder
{
    use UploadsSeederImages;

    private $catalogues = [];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First create product catalogues for a provider
        $this->createCatalogues();

        // Create products for various providers
        $this->createDecorationProducts();
        $this->createBakeryProducts();
        $this->createRentalProducts();
        $this->createPartySupplies();

        $this->command->info('Products seeded successfully!');
    }

    private function createCatalogues(): void
    {
        // Get first approved provider to create catalogues under their company
        $provider = ServiceProvider::where('verification_status', 'approved')->first();
        if (!$provider) {
            $this->command->warn('No approved provider found. Skipping catalogue creation.');
            return;
        }

        // Get or create a company for this provider
        $company = Company::firstOrCreate(
            ['service_provider_id' => $provider->id],
            [
                'name' => $provider->business_name,
                'slug' => Str::slug($provider->business_name) . '-' . Str::random(6),
                'description' => $provider->description ?? 'Event services company',
                'is_active' => true,
            ]
        );

        $catalogueData = [
            ['name' => 'Decorations', 'description' => 'Event decorations and accessories'],
            ['name' => 'Cakes & Desserts', 'description' => 'Wedding cakes, cupcakes, and sweet treats'],
            ['name' => 'Party Supplies', 'description' => 'Balloons, banners, and party accessories'],
            ['name' => 'Equipment Rentals', 'description' => 'Tables, chairs, and event equipment'],
            ['name' => 'Flowers & Arrangements', 'description' => 'Floral arrangements and bouquets'],
            ['name' => 'Tableware', 'description' => 'Plates, cutlery, and serving items'],
        ];

        foreach ($catalogueData as $cat) {
            $catalogue = Catalogue::firstOrCreate(
                ['name' => $cat['name'], 'type' => 'product', 'company_id' => $company->id],
                [
                    'slug' => Str::slug($cat['name']) . '-' . Str::random(6),
                    'description' => $cat['description'],
                    'is_active' => true,
                    'is_featured' => true,
                ]
            );
            $this->catalogues[$cat['name']] = $catalogue;
        }
    }

    private function getCatalogue(string $name): ?Catalogue
    {
        return $this->catalogues[$name] ?? Catalogue::where('name', $name)->where('type', 'product')->first();
    }

    /**
     * Create a product with uploaded images
     */
    private function createProductWithImages(array $data, ServiceProvider $provider, Catalogue $catalogue): void
    {
        // Upload primary image
        $primaryImage = null;
        if (!empty($data['image'])) {
            $primaryImage = $this->uploadImage($data['image'], 'products/primary');
        }

        // Upload gallery images
        $galleryImages = [];
        if (!empty($data['gallery_images'])) {
            $galleryImages = $this->uploadImages($data['gallery_images'], 'products/gallery');
        }

        Product::create([
            'service_provider_id' => $provider->id,
            'catalogue_id' => $catalogue->id,
            'name' => $data['name'],
            'slug' => Str::slug($data['name']) . '-' . Str::random(6),
            'description' => $data['description'],
            'price' => $data['price'],
            'sale_price' => $data['sale_price'] ?? null,
            'currency' => 'MWK',
            'stock_quantity' => $data['stock_quantity'],
            'track_inventory' => true,
            'unit' => $data['unit'] ?? null,
            'features' => $data['features'],
            'primary_image' => $primaryImage,
            'gallery_images' => $galleryImages,
            'is_active' => true,
            'is_featured' => true,
        ]);
    }

    private function createDecorationProducts(): void
    {
        $provider = ServiceProvider::where('slug', 'elegant-events-decor')->first();
        if (!$provider) {
            $provider = ServiceProvider::where('verification_status', 'approved')->first();
        }
        if (!$provider) return;

        $catalogue = $this->getCatalogue('Decorations');
        if (!$catalogue) return;

        $products = [
            [
                'name' => 'Gold Sequin Table Runner',
                'description' => 'Beautiful gold sequin table runner perfect for wedding receptions and elegant events. Adds sparkle and glamour to any table setting. Size: 30cm x 275cm.',
                'price' => 15000,
                'sale_price' => 12000,
                'stock_quantity' => 50,
                'features' => ['High-quality sequins', 'Washable', 'Reusable', '30cm x 275cm'],
                'image' => '/resized-win/decor-1.jpg',
            ],
            [
                'name' => 'LED Fairy Lights String (10m)',
                'description' => 'Warm white LED fairy lights perfect for venue decoration. Battery operated, 100 LED bulbs. Creates a magical atmosphere.',
                'price' => 25000,
                'stock_quantity' => 100,
                'features' => ['100 LED bulbs', 'Battery operated', 'Warm white', 'Indoor/Outdoor use'],
                'image' => '/resized-win/decor-2.jpg',
            ],
            [
                'name' => 'Artificial Rose Flower Heads (50 pcs)',
                'description' => 'Pack of 50 high-quality artificial rose flower heads. Perfect for DIY decorations, centerpieces, and backdrops. Various colors available.',
                'price' => 35000,
                'sale_price' => 28000,
                'stock_quantity' => 30,
                'features' => ['50 pieces per pack', 'Realistic look', 'Multiple colors', 'Reusable'],
                'image' => '/resized-win/decor-3.jpg',
            ],
            [
                'name' => 'White Feather Table Centerpiece',
                'description' => 'Elegant white feather centerpiece in a crystal vase. Ready to display, perfect for wedding tables.',
                'price' => 45000,
                'stock_quantity' => 20,
                'features' => ['Includes vase', 'Ready to display', '40cm height', 'Elegant design'],
                'image' => '/resized-win/decor-4.jpg',
            ],
            [
                'name' => 'Balloon Arch Kit - Rose Gold',
                'description' => 'Complete DIY balloon arch kit in rose gold theme. Includes 100 balloons, strip, and decorating tools.',
                'price' => 55000,
                'sale_price' => 45000,
                'stock_quantity' => 25,
                'features' => ['100 balloons', 'Decorating strip included', 'Rose gold theme', 'Instructions included'],
                'image' => '/resized-win/decor-5.jpg',
            ],
        ];

        foreach ($products as $productData) {
            $productData['gallery_images'] = ['/resized-win/decor-6.jpg', '/resized-win/decor-7.jpg'];
            $this->createProductWithImages($productData, $provider, $catalogue);
        }
    }

    private function createBakeryProducts(): void
    {
        $provider = ServiceProvider::where('slug', 'sweet-creations')->first();
        if (!$provider) {
            $provider = ServiceProvider::where('verification_status', 'approved')->skip(1)->first();
        }
        if (!$provider) return;

        $catalogue = $this->getCatalogue('Cakes & Desserts');
        if (!$catalogue) return;

        $products = [
            [
                'name' => 'Cupcake Box (12 pieces) - Assorted',
                'description' => 'Box of 12 delicious cupcakes in assorted flavors: vanilla, chocolate, red velvet, and lemon. Perfect for parties and celebrations.',
                'price' => 48000,
                'stock_quantity' => 15,
                'features' => ['12 cupcakes', '4 flavors', 'Beautifully decorated', 'Gift box included'],
                'image' => '/resized-win/cake-1.jpg',
            ],
            [
                'name' => 'Cake Pops (20 pieces)',
                'description' => 'Pack of 20 decorated cake pops. Perfect party treats for kids and adults alike. Available in various flavors.',
                'price' => 40000,
                'sale_price' => 35000,
                'stock_quantity' => 20,
                'features' => ['20 cake pops', 'Individually wrapped', 'Decorated', 'Fresh baked'],
                'image' => '/resized-win/cake-2.jpg',
            ],
            [
                'name' => 'Cookie Box - Wedding Favors (50 pcs)',
                'description' => 'Beautifully decorated sugar cookies, perfect as wedding favors. Customizable designs and flavors.',
                'price' => 75000,
                'stock_quantity' => 10,
                'features' => ['50 cookies', 'Individually wrapped', 'Custom designs', 'Wedding themed'],
                'image' => '/resized-win/cake-3.jpg',
            ],
            [
                'name' => 'Macarons Gift Box (24 pieces)',
                'description' => 'Elegant gift box with 24 French macarons in 6 delightful flavors. Perfect for special occasions.',
                'price' => 65000,
                'sale_price' => 55000,
                'stock_quantity' => 12,
                'features' => ['24 macarons', '6 flavors', 'Premium gift box', 'Handcrafted'],
                'image' => '/resized-win/cake-4.jpg',
            ],
            [
                'name' => 'Mini Cheesecakes (10 pieces)',
                'description' => 'Individual mini cheesecakes perfect for dessert tables. Choose from New York, strawberry, or Oreo.',
                'price' => 55000,
                'stock_quantity' => 8,
                'features' => ['10 mini cheesecakes', 'Individual servings', 'Premium ingredients', 'Fresh daily'],
                'image' => '/resized-win/cake-5.jpg',
            ],
        ];

        foreach ($products as $productData) {
            $productData['gallery_images'] = ['/resized-win/cake-6.jpg', '/resized-win/cake-7.jpg', '/resized-win/cake-8.jpg'];
            $this->createProductWithImages($productData, $provider, $catalogue);
        }
    }

    private function createRentalProducts(): void
    {
        $provider = ServiceProvider::where('slug', 'premium-event-rentals')->first();
        if (!$provider) {
            $provider = ServiceProvider::where('verification_status', 'approved')->skip(2)->first();
        }
        if (!$provider) return;

        $catalogue = $this->getCatalogue('Equipment Rentals');
        if (!$catalogue) return;

        $products = [
            [
                'name' => 'Gold Chiavari Chair',
                'description' => 'Elegant gold Chiavari chair for rent. Perfect for weddings and upscale events. Available in quantities.',
                'price' => 3500,
                'stock_quantity' => 200,
                'unit' => 'chair',
                'features' => ['Gold finish', 'Includes cushion', 'Stackable', 'Premium quality'],
                'image' => '/resized-win/tent-1.jpg',
            ],
            [
                'name' => 'White Tiffany Chair',
                'description' => 'Classic white Tiffany chair rental. Elegant and timeless design for wedding ceremonies and receptions.',
                'price' => 4000,
                'sale_price' => 3500,
                'stock_quantity' => 150,
                'unit' => 'chair',
                'features' => ['White finish', 'Includes cushion', 'Elegant design', 'Sturdy construction'],
                'image' => '/resized-win/tent-3.jpg',
            ],
            [
                'name' => 'Round Banquet Table (10-seater)',
                'description' => 'Round banquet table suitable for 10 guests. Standard for wedding receptions and formal dinners.',
                'price' => 15000,
                'stock_quantity' => 30,
                'unit' => 'table',
                'features' => ['10-seater', '180cm diameter', 'Foldable legs', 'Sturdy construction'],
                'image' => '/resized-win/tent-4.jpg',
            ],
            [
                'name' => 'Cocktail Table (High)',
                'description' => 'High cocktail standing table perfect for cocktail hours and networking events.',
                'price' => 8000,
                'stock_quantity' => 40,
                'unit' => 'table',
                'features' => ['Standing height', '60cm diameter', 'Includes cover', 'Black or white'],
                'image' => '/resized-win/umbrella-chairs-tents-1.jpg',
            ],
            [
                'name' => 'Red Carpet (10m)',
                'description' => 'Premium red carpet for VIP entrances and event walkways. 10 meters long, 1.2 meters wide.',
                'price' => 25000,
                'sale_price' => 20000,
                'stock_quantity' => 10,
                'unit' => 'roll',
                'features' => ['10m x 1.2m', 'Non-slip backing', 'Premium quality', 'Easy to lay'],
                'image' => '/resized-win/decor-7.jpg',
            ],
        ];

        foreach ($products as $productData) {
            $productData['gallery_images'] = ['/resized-win/tent-decor.jpg', '/resized-win/venue-1.jpg'];
            $this->createProductWithImages($productData, $provider, $catalogue);
        }
    }

    private function createPartySupplies(): void
    {
        $provider = ServiceProvider::where('verification_status', 'approved')->first();
        if (!$provider) return;

        $catalogue = $this->getCatalogue('Party Supplies');
        if (!$catalogue) return;

        $products = [
            [
                'name' => 'Happy Birthday Banner Set',
                'description' => 'Complete birthday decoration set including banner, balloons, and streamers. Everything you need for a party!',
                'price' => 18000,
                'sale_price' => 15000,
                'stock_quantity' => 50,
                'features' => ['Banner included', '20 balloons', 'Streamers', 'Multiple colors'],
                'image' => '/resized-win/decor-1.jpg',
            ],
            [
                'name' => 'Confetti Cannon (Pack of 4)',
                'description' => 'Set of 4 confetti cannons for celebrations. Perfect for weddings, parties, and special moments.',
                'price' => 20000,
                'stock_quantity' => 30,
                'features' => ['4 cannons', 'Biodegradable confetti', 'Easy to use', 'Safe'],
                'image' => '/resized-win/decor-2.jpg',
            ],
            [
                'name' => 'Wedding Photo Booth Props (30 pcs)',
                'description' => 'Fun photo booth props for wedding receptions. Includes signs, glasses, mustaches, and more.',
                'price' => 25000,
                'sale_price' => 20000,
                'stock_quantity' => 25,
                'features' => ['30 pieces', 'Wooden sticks', 'Durable cardstock', 'Wedding themed'],
                'image' => '/resized-win/wedding-photo-1.jpg',
            ],
            [
                'name' => 'Number Foil Balloons (0-9)',
                'description' => 'Large 40-inch gold number foil balloons. Perfect for age celebrations and milestone parties.',
                'price' => 8000,
                'stock_quantity' => 100,
                'unit' => 'balloon',
                'features' => ['40 inches tall', 'Self-sealing', 'Reusable', 'Gold color'],
                'image' => '/resized-win/decor-5.jpg',
            ],
            [
                'name' => 'Tissue Paper Pompoms (Set of 10)',
                'description' => 'Colorful tissue paper pompoms for venue decoration. Easy to assemble and hang.',
                'price' => 12000,
                'stock_quantity' => 40,
                'features' => ['10 pompoms', 'Assorted sizes', 'Multiple colors', 'Easy assembly'],
                'image' => '/resized-win/decor-6.jpg',
            ],
        ];

        foreach ($products as $productData) {
            $productData['gallery_images'] = ['/resized-win/decor-3.jpg', '/resized-win/decor-4.jpg'];
            $this->createProductWithImages($productData, $provider, $catalogue);
        }
    }
}
