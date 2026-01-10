<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheHeaders
{
    /**
     * Cache durations for different content types (in seconds)
     */
    private const CACHE_DURATIONS = [
        'static' => 31536000,  // 1 year for static assets
        'images' => 2592000,    // 30 days for images
        'api' => 300,           // 5 minutes for API responses
        'html' => 0,            // No cache for HTML (Inertia pages)
        'shared' => 3600,       // 1 hour for shared data
    ];

    /**
     * Routes that should have specific cache settings
     */
    private const ROUTE_CACHE = [
        // Shared data that rarely changes
        'api.categories' => 'shared',
        'api.cities' => 'shared',
        'api.shared-data' => 'shared',

        // API endpoints
        'api.*' => 'api',

        // Static pages
        'terms' => 'static',
        'privacy' => 'static',
        'about' => 'static',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $type = null): Response
    {
        $response = $next($request);

        // Determine cache type
        $cacheType = $this->determineCacheType($request, $type);
        $duration = self::CACHE_DURATIONS[$cacheType] ?? 0;

        // Add cache headers
        if ($duration > 0) {
            $response->header('Cache-Control', "public, max-age={$duration}, immutable");
            $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $duration).' GMT');

            // Add ETag for conditional requests
            if ($response->getContent()) {
                $etag = md5($response->getContent());
                $response->header('ETag', $etag);

                // Check if client has valid cached version
                if ($request->header('If-None-Match') === $etag) {
                    $response->setStatusCode(304);
                    $response->setContent('');
                }
            }
        } else {
            // No cache for dynamic content
            $response->header('Cache-Control', 'no-cache, no-store, must-revalidate');
            $response->header('Pragma', 'no-cache');
            $response->header('Expires', '0');
        }

        // Add Vary header for proper caching with different representations
        $response->header('Vary', 'Accept, Accept-Encoding, X-Requested-With');

        return $response;
    }

    /**
     * Determine the cache type based on the request
     */
    private function determineCacheType(Request $request, ?string $type): string
    {
        // If type is explicitly provided
        if ($type) {
            return $type;
        }

        // Check route patterns
        $routeName = $request->route()?->getName();
        if ($routeName) {
            foreach (self::ROUTE_CACHE as $pattern => $cacheType) {
                if (fnmatch($pattern, $routeName)) {
                    return $cacheType;
                }
            }
        }

        // Check file extensions
        $path = $request->path();
        if (preg_match('/\.(js|css|woff2?|ttf|eot|svg|ico)$/i', $path)) {
            return 'static';
        }
        if (preg_match('/\.(jpg|jpeg|png|gif|webp|avif)$/i', $path)) {
            return 'images';
        }

        // Check if it's an API request
        if ($request->is('api/*')) {
            return 'api';
        }

        // Default to no cache for HTML/Inertia pages
        return 'html';
    }
}
