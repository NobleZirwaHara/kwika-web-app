<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class WishlistCookieMiddleware
{
    public const COOKIE_NAME = 'wishlist_token';

    public const COOKIE_LIFETIME_DAYS = 7;

    public function handle(Request $request, Closure $next): Response
    {
        $guestToken = $request->cookie(self::COOKIE_NAME);

        if (! $guestToken) {
            $guestToken = Str::uuid()->toString();
        }

        $request->attributes->set(self::COOKIE_NAME, $guestToken);

        $response = $next($request);

        if (! $request->cookie(self::COOKIE_NAME)) {
            $response->cookie(
                self::COOKIE_NAME,
                $guestToken,
                self::COOKIE_LIFETIME_DAYS * 24 * 60,
                '/',
                null,
                config('session.secure', false),
                true,
                false,
                'Lax'
            );
        }

        return $response;
    }

    /**
     * Get the guest token from the request
     */
    public static function getGuestToken(Request $request): ?string
    {
        return $request->attributes->get(self::COOKIE_NAME)
            ?? $request->cookie(self::COOKIE_NAME);
    }
}
