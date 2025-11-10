<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MediaController extends Controller
{
    /**
     * Show the media management page
     */
    public function index()
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->route('home')->withErrors(['error' => 'Provider profile not found']);
        }

        $portfolioImages = $provider->portfolioImages()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($media) {
                return [
                    'id' => $media->id,
                    'file_name' => $media->file_name,
                    'file_path' => $media->file_path,
                    'caption' => $media->caption,
                    'sort_order' => $media->sort_order,
                ];
            });

        return Inertia::render('Provider/Media', [
            'provider' => [
                'id' => $provider->id,
                'business_name' => $provider->business_name,
                'logo' => $provider->logo,
                'cover_image' => $provider->cover_image,
                'verification_status' => $provider->verification_status,
            ],
            'portfolio_images' => $portfolioImages,
        ]);
    }

    /**
     * Upload business logo
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        // Delete old logo file if exists
        if ($provider->logo) {
            Storage::disk('public')->delete($provider->logo);
        }

        // Store new logo
        $file = $request->file('logo');
        $filename = 'logos/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('', $filename, 'public');

        // Update provider
        $provider->update(['logo' => $path]);

        return redirect()->back()->with('success', 'Logo uploaded successfully');
    }

    /**
     * Upload cover image
     */
    public function uploadCover(Request $request)
    {
        $request->validate([
            'cover_image' => ['required', 'image', 'max:5120'], // 5MB max
        ]);

        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        // Delete old cover image if exists
        if ($provider->cover_image) {
            Storage::disk('public')->delete($provider->cover_image);
        }

        // Store new cover image
        $file = $request->file('cover_image');
        $filename = 'covers/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('', $filename, 'public');

        // Update provider
        $provider->update(['cover_image' => $path]);

        return redirect()->back()->with('success', 'Cover image uploaded successfully');
    }

    /**
     * Upload portfolio images
     */
    public function uploadPortfolio(Request $request)
    {
        $request->validate([
            'portfolio_images' => ['required', 'array', 'max:10'],
            'portfolio_images.*' => ['image', 'max:5120'], // 5MB max per image
        ]);

        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        // Check current portfolio count
        $currentCount = $provider->portfolioImages()->count();
        $newCount = count($request->file('portfolio_images'));

        if ($currentCount + $newCount > 10) {
            return redirect()->back()->withErrors([
                'error' => 'You can only have up to 10 portfolio images. Please delete some first.'
            ]);
        }

        // Get the highest sort order
        $maxSortOrder = $provider->portfolioImages()->max('sort_order') ?? 0;

        // Store each portfolio image
        foreach ($request->file('portfolio_images') as $index => $file) {
            $filename = 'portfolio/' . Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('', $filename, 'public');

            Media::create([
                'mediable_type' => ServiceProvider::class,
                'mediable_id' => $provider->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'disk' => 'public',
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'collection' => 'portfolio',
                'sort_order' => $maxSortOrder + $index + 1,
            ]);
        }

        return redirect()->back()->with('success', 'Portfolio images uploaded successfully');
    }

    /**
     * Delete a portfolio image
     */
    public function destroy($id)
    {
        $provider = Auth::user()->serviceProvider;

        if (!$provider) {
            return redirect()->back()->withErrors(['error' => 'Provider profile not found']);
        }

        $media = Media::where('id', $id)
            ->where('mediable_type', ServiceProvider::class)
            ->where('mediable_id', $provider->id)
            ->where('collection', 'portfolio')
            ->first();

        if (!$media) {
            return redirect()->back()->withErrors(['error' => 'Image not found']);
        }

        // Delete file from storage
        Storage::disk('public')->delete($media->file_path);

        // Delete media record
        $media->delete();

        return redirect()->back()->with('success', 'Image deleted successfully');
    }
}
