<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsProvider
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('home')->with('error', 'You must be logged in to access this area.');
        }

        // Check if user has a provider account
        if (!Auth::user()->provider) {
            return redirect()->route('home')->with('error', 'You must be a registered provider to access this area.');
        }

        // Check if provider is approved
        // if (Auth::user()->provider->status !== 'approved') {
        //     return redirect()->route('home')->with('error', 'Your provider account is pending approval.');
        // }

        return $next($request);
    }
}
