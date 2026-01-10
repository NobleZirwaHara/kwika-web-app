<?php

namespace App\Http\Middleware;

use App\Services\ComponentCacheService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cacheService = app(ComponentCacheService::class);

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'is_admin' => $request->user()->is_admin,
                    'is_provider' => $request->user()->provider, // && $request->user()->provider->status === 'approved',
                ] : null,
            ],
            'ziggy' => fn () => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Cached shared data for headers/footers
            'shared' => [
                'categories' => fn () => $cacheService->getCategories(),
                'cities' => fn () => $cacheService->getCities(),
                'footerData' => fn () => $cacheService->getFooterData(),
                'userMenu' => fn () => $cacheService->getUserMenuData($request->user()),
            ],
        ]);
    }
}
