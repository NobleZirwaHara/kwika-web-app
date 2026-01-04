<?php

namespace App\Http\Controllers;

use App\Http\Middleware\WishlistCookieMiddleware;
use App\Models\User;
use App\Models\UserWishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            // Merge guest wishlists to user account
            $this->mergeGuestWishlists($request, Auth::id());

            // Redirect to admin dashboard if user is admin
            if (Auth::user()->is_admin) {
                return redirect()->intended(route('admin.dashboard'));
            }

            // Redirect to home for regular users
            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Show the registration form
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration request
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        // Merge guest wishlists to new user account
        $this->mergeGuestWishlists($request, $user->id);

        return redirect()->route('home');
    }

    /**
     * Merge guest wishlists to user account after login/register
     */
    private function mergeGuestWishlists(Request $request, int $userId): void
    {
        $guestToken = $request->cookie(WishlistCookieMiddleware::COOKIE_NAME);

        if ($guestToken) {
            UserWishlist::mergeGuestToUser($guestToken, $userId);

            // Clear the guest cookie
            Cookie::queue(Cookie::forget(WishlistCookieMiddleware::COOKIE_NAME));
        }
    }
}
