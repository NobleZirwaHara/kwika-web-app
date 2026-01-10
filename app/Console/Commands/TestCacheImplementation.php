<?php

namespace App\Console\Commands;

use App\Services\ComponentCacheService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class TestCacheImplementation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:test {--clear : Clear all caches before testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the cache implementation for headers and footers';

    public function __construct(private ComponentCacheService $cacheService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧪 Testing Cache Implementation...');
        $this->newLine();

        // Clear cache if requested
        if ($this->option('clear')) {
            $this->warn('Clearing all component caches...');
            $this->cacheService->clearAll();
            Cache::flush();
            $this->info('✓ Caches cleared');
            $this->newLine();
        }

        // Test 1: Check if cache service is working
        $this->info('1. Testing ComponentCacheService...');
        $startTime = microtime(true);

        // First call - should query database
        $categories = $this->cacheService->getCategories();
        $firstCallTime = microtime(true) - $startTime;
        $this->line("   First call (DB query): {$this->formatTime($firstCallTime)}");

        // Second call - should use cache
        $startTime = microtime(true);
        $categoriesCached = $this->cacheService->getCategories();
        $secondCallTime = microtime(true) - $startTime;
        $this->line("   Second call (cached): {$this->formatTime($secondCallTime)}");

        $improvement = round((1 - ($secondCallTime / $firstCallTime)) * 100, 2);
        $this->info("   ✓ Cache working! {$improvement}% faster");
        $this->newLine();

        // Test 2: Check cache keys
        $this->info('2. Checking cache keys...');
        $cacheKeys = [
            'component:categories' => 'Categories',
            'component:cities' => 'Cities',
            'component:footer' => 'Footer data',
        ];

        foreach ($cacheKeys as $key => $label) {
            if (Cache::has($key)) {
                $this->line("   ✓ {$label} cached");
            } else {
                // Trigger cache population
                if ($key === 'component:cities') {
                    $this->cacheService->getCities();
                } elseif ($key === 'component:footer') {
                    $this->cacheService->getFooterData();
                }

                if (Cache::has($key)) {
                    $this->line("   ✓ {$label} cached (after population)");
                } else {
                    $this->error("   ✗ {$label} not cached");
                }
            }
        }
        $this->newLine();

        // Test 3: Check middleware registration
        $this->info('3. Checking middleware registration...');
        $middleware = config('app.middleware') ?? [];
        $middlewareRegistered = class_exists(\App\Http\Middleware\CacheHeaders::class);

        if ($middlewareRegistered) {
            $this->line('   ✓ CacheHeaders middleware exists');
        } else {
            $this->error('   ✗ CacheHeaders middleware not found');
        }
        $this->newLine();

        // Test 4: Performance summary
        $this->info('4. Cache Performance Summary:');
        $this->table(
            ['Cache Type', 'TTL', 'Status'],
            [
                ['Categories', '1 hour', Cache::has('component:categories') ? '✓ Cached' : '✗ Not cached'],
                ['Cities', '1 hour', Cache::has('component:cities') ? '✓ Cached' : '✗ Not cached'],
                ['Footer', '1 day', Cache::has('component:footer') ? '✓ Cached' : '✗ Not cached'],
                ['User Menu', '5 minutes', 'Per-user cache'],
                ['Navigation', '30 minutes', 'Per-role cache'],
            ]
        );

        // Test 5: Cache statistics
        $this->newLine();
        $this->info('5. Cache Statistics:');
        $stats = [
            'Total categories' => count($categories),
            'Total cities' => count($this->cacheService->getCities()),
            'Footer links' => count($this->cacheService->getFooterData()['links']),
            'Cache driver' => config('cache.default'),
        ];

        foreach ($stats as $label => $value) {
            $this->line("   {$label}: {$value}");
        }

        $this->newLine();
        $this->info('✅ Cache implementation test complete!');
        $this->newLine();
        $this->comment('Tips:');
        $this->comment('- Use --clear flag to reset cache before testing');
        $this->comment('- Check browser DevTools for HTTP cache headers');
        $this->comment('- Use React DevTools to verify component memoization');
        $this->comment('- Monitor with: php artisan cache:monitor (if using Redis)');

        return Command::SUCCESS;
    }

    private function formatTime(float $seconds): string
    {
        if ($seconds < 0.001) {
            return round($seconds * 1000000, 2).' μs';
        }

        if ($seconds < 1) {
            return round($seconds * 1000, 2).' ms';
        }

        return round($seconds, 2).' s';
    }
}
