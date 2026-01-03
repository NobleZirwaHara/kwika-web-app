<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProviderOnboardingController extends Controller
{
    /**
     * Show the onboarding start/welcome page
     */
    public function welcome()
    {
        return Inertia::render('Onboarding/Welcome');
    }

    /**
     * Step 1: Personal Details
     */
    public function step1()
    {
        $user = Auth::user();

        // If already completed, redirect to appropriate step
        if ($user && $user->isProvider() && $user->serviceProvider) {
            $provider = $user->serviceProvider;
            if ($provider->onboarding_completed) {
                return redirect()->route('provider.dashboard');
            }

            return redirect()->route('onboarding.step', ['step' => $provider->onboarding_step]);
        }

        return Inertia::render('Onboarding/Step1PersonalDetails', [
            'user' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ] : null,
        ]);
    }

    /**
     * Store Step 1: Personal Details
     */
    public function storeStep1(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', Password::defaults(), 'confirmed'],
            'national_id' => ['nullable', 'string', 'max:50'],
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'role' => 'provider',
                'national_id' => $validated['national_id'] ?? null,
            ]);

            // Create provider record
            $provider = ServiceProvider::create([
                'user_id' => $user->id,
                'business_name' => 'Pending',
                'slug' => Str::slug($user->name.'-'.$user->id),
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'location' => 'Pending',
                'city' => 'Pending',
                'onboarding_step' => 2,
                'onboarding_completed' => false,
                'verification_status' => 'pending',
                'is_active' => false,
            ]);

            DB::commit();

            // Log in the user
            Auth::login($user);

            return redirect()->route('onboarding.step2');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create account. Please try again.']);
        }
    }

    /**
     * Step 2: Business Information
     */
    public function step2()
    {
        $user = Auth::user();

        if (! $user || ! $user->isProvider()) {
            return redirect()->route('onboarding.step1');
        }

        $provider = $user->serviceProvider;

        if (! $provider || $provider->onboarding_step < 2) {
            return redirect()->route('onboarding.step1');
        }

        $categories = ServiceCategory::active()->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('Onboarding/Step2BusinessInfo', [
            'provider' => [
                'business_name' => $provider->business_name !== 'Pending' ? $provider->business_name : '',
                'description' => $provider->description,
                'business_registration_number' => $provider->business_registration_number,
                'location' => $provider->location !== 'Pending' ? $provider->location : '',
                'city' => $provider->city !== 'Pending' ? $provider->city : '',
                'phone' => $provider->phone,
                'email' => $provider->email,
                'website' => $provider->website,
                'social_links' => $provider->social_links ?? [],
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Store Step 2: Business Information
     */
    public function storeStep2(Request $request)
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:50'],
            'business_registration_number' => ['nullable', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'social_links' => ['nullable', 'array'],
            'social_links.facebook' => ['nullable', 'url'],
            'social_links.instagram' => ['nullable', 'url'],
            'social_links.twitter' => ['nullable', 'url'],
            'social_links.linkedin' => ['nullable', 'url'],
        ]);

        $provider->update([
            'business_name' => $validated['business_name'],
            'slug' => Str::slug($validated['business_name']),
            'description' => $validated['description'],
            'business_registration_number' => $validated['business_registration_number'] ?? null,
            'location' => $validated['location'],
            'city' => $validated['city'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'website' => $validated['website'] ?? null,
            'social_links' => $validated['social_links'] ?? null,
            'onboarding_step' => 3,
        ]);

        return redirect()->route('onboarding.step3');
    }

    /**
     * Step 3: Services & Media
     */
    public function step3()
    {
        $user = Auth::user();

        if (! $user || ! $user->isProvider()) {
            return redirect()->route('onboarding.step1');
        }

        $provider = $user->serviceProvider;

        if (! $provider || $provider->onboarding_step < 3) {
            return redirect()->route('onboarding.step2');
        }

        // Get parent categories with their subcategories
        $parentCategories = ServiceCategory::with('children')
            ->parents()
            ->active()
            ->get(['id', 'name', 'slug', 'icon'])
            ->map(function ($parent) {
                return [
                    'id' => $parent->id,
                    'name' => $parent->name,
                    'slug' => $parent->slug,
                    'icon' => $parent->icon,
                    'subcategories' => $parent->children->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'name' => $child->name,
                            'slug' => $child->slug,
                        ];
                    }),
                ];
            });

        return Inertia::render('Onboarding/Step3ServicesMedia', [
            'provider' => [
                'id' => $provider->id,
                'logo' => $provider->logo,
                'cover_image' => $provider->cover_image,
            ],
            'categories' => $parentCategories,
        ]);
    }

    /**
     * Store Step 3: Services & Media
     */
    public function storeStep3(Request $request)
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        $validated = $request->validate([
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['exists:service_categories,id'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'portfolio_images' => ['nullable', 'array', 'max:10'],
            'portfolio_images.*' => ['image', 'max:5120'],
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('providers/logos', 'public');
            $provider->logo = $logoPath;
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('providers/covers', 'public');
            $provider->cover_image = $coverPath;
        }

        // Store category selection in onboarding_data for now
        $onboardingData = $provider->onboarding_data ?? [];
        $onboardingData['category_ids'] = $validated['category_ids'];

        $provider->update([
            'onboarding_data' => $onboardingData,
            'onboarding_step' => 4,
        ]);

        // Handle portfolio images if provided
        if ($request->hasFile('portfolio_images')) {
            foreach ($request->file('portfolio_images') as $image) {
                $path = $image->store('providers/portfolio', 'public');
                $provider->media()->create([
                    'file_name' => $image->getClientOriginalName(),
                    'file_path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getMimeType(),
                    'file_size' => $image->getSize(),
                    'collection' => 'portfolio',
                ]);
            }
        }

        return redirect()->route('onboarding.step4');
    }

    /**
     * Step 4: Review & Submit
     */
    public function step4()
    {
        $user = Auth::user();

        if (! $user || ! $user->isProvider()) {
            return redirect()->route('onboarding.step1');
        }

        $provider = $user->serviceProvider;

        if (! $provider || $provider->onboarding_step < 4) {
            return redirect()->route('onboarding.step3');
        }

        $categoryIds = $provider->onboarding_data['category_ids'] ?? [];
        $categories = ServiceCategory::whereIn('id', $categoryIds)->get(['id', 'name']);

        return Inertia::render('Onboarding/Step4Review', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'provider' => [
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
                'cover_image' => $provider->cover_image,
            ],
            'categories' => $categories,
            'portfolioImages' => $provider->portfolioImages->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => Storage::url($media->file_path),
                ];
            }),
        ]);
    }

    /**
     * Complete onboarding
     */
    public function complete(Request $request)
    {
        $user = Auth::user();
        $provider = $user->serviceProvider;

        if (! $provider || $provider->onboarding_step < 4) {
            return back()->withErrors(['error' => 'Please complete all onboarding steps.']);
        }

        // Sync categories from onboarding_data to pivot table
        $onboardingData = $provider->onboarding_data ?? [];
        if (isset($onboardingData['category_ids']) && !empty($onboardingData['category_ids'])) {
            // Validate that all selected categories are subcategories
            $categoryIds = $onboardingData['category_ids'];
            $validCategories = ServiceCategory::whereIn('id', $categoryIds)
                ->whereNotNull('parent_id') // Only subcategories
                ->pluck('id')
                ->toArray();

            if (!empty($validCategories)) {
                $provider->categories()->sync($validCategories);
            }
        }

        $provider->update([
            'onboarding_completed' => true,
            'is_active' => true,
            'verification_status' => 'pending',
        ]);

        return redirect()->route('provider.dashboard')->with('success', 'Onboarding completed! Your profile is pending verification.');
    }

    /**
     * Skip to a specific step (for navigation within wizard)
     */
    public function goToStep($step)
    {
        $user = Auth::user();

        if (! $user || ! $user->isProvider()) {
            return redirect()->route('onboarding.step1');
        }

        $provider = $user->serviceProvider;

        // Can only navigate to current step or earlier steps
        if ($step > $provider->onboarding_step) {
            return redirect()->route('onboarding.step'.$provider->onboarding_step);
        }

        return redirect()->route('onboarding.step'.$step);
    }
}
