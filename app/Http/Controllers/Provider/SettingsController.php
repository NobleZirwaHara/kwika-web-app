<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Show the settings page
     */
    public function index()
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        if (!$provider) {
            return redirect()->route('home')->withErrors(['error' => 'Provider profile not found']);
        }

        return Inertia::render('Provider/Settings', [
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'description' => $provider->description,
                'business_registration_number' => $provider->business_registration_number,
                'location' => $provider->location,
                'city' => $provider->city,
                'phone' => $provider->phone,
                'email' => $provider->email,
                'website' => $provider->website,
                'social_links' => $provider->social_links,
                'logo' => $provider->logo,
                'verification_status' => $provider->verification_status,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
    }

    /**
     * Update provider settings
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'business_registration_number' => ['nullable', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'social_links' => ['nullable', 'array'],
            'social_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_links.twitter' => ['nullable', 'url', 'max:255'],
            'social_links.linkedin' => ['nullable', 'url', 'max:255'],
        ]);

        // Clean up empty social links
        if (isset($validated['social_links'])) {
            $validated['social_links'] = array_filter($validated['social_links'], function ($value) {
                return !empty($value);
            });
        }

        $provider->update($validated);

        return redirect()->back()->with('success', 'Settings updated successfully');
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully');
    }
}
