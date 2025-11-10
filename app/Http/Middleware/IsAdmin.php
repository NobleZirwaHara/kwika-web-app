<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
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

        // Check if user is an admin
        if (!Auth::user()->is_admin) {
            return redirect()->route('home')->with('error', 'You do not have permission to access the admin panel.');
        }

        return $next($request);
    }
}
