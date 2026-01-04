<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CartCookieMiddleware
{
    public const CART_COOKIE_NAME = 'cart_token';

    public const WISHLIST_COOKIE_NAME = 'wishlist_token';

    public const CART_COOKIE_LIFETIME_DAYS = 30;

    public const WISHLIST_COOKIE_LIFETIME_DAYS = 90;

    public function handle(Request $request, Closure $next): Response
    {
        $guestIdentifier = Str::uuid()->toString(); //use the same identifier for cart and wishlist
        $cartToken = $request->cookie(self::CART_COOKIE_NAME);
        $wishlistToken = $request->cookie(self::WISHLIST_COOKIE_NAME);

        if (! $cartToken) {
            $cartToken = $guestIdentifier;
        }

        if (! $wishlistToken) {
            $wishlistToken = $guestIdentifier;
        }

        $request->attributes->set(self::CART_COOKIE_NAME, $cartToken);
        $request->attributes->set(self::WISHLIST_COOKIE_NAME, $wishlistToken);

        $response = $next($request);

        if (! $request->cookie(self::CART_COOKIE_NAME)) {
            $response->cookie(
                self::CART_COOKIE_NAME,
                $cartToken,
                self::CART_COOKIE_LIFETIME_DAYS * 24 * 60,
                '/',
                null,
                config('session.secure', false),
                true,
                false,
                'Lax'
            );
        }

        if (! $request->cookie(self::WISHLIST_COOKIE_NAME)) {
            $response->cookie(
                self::WISHLIST_COOKIE_NAME,
                $wishlistToken,
                self::WISHLIST_COOKIE_LIFETIME_DAYS * 24 * 60,
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
}
