<?php

namespace Database\Seeders\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait UploadsSeederImages
{
    /**
     * Upload an image from the public folder to storage.
     * Uses the default filesystem disk configured in .env (local or s3).
     *
     * @param string $publicPath Path relative to public folder (e.g., '/resized-win/image.jpg')
     * @param string $storagePath Storage folder path (e.g., 'providers/logos')
     * @return string|null The storage path or null if upload failed
     */
    protected function uploadImage(string $publicPath, string $storagePath = 'seeder-images'): ?string
    {
        // Remove leading slash if present
        $publicPath = ltrim($publicPath, '/');

        // Full path to the source file
        $sourcePath = public_path($publicPath);

        // Check if source file exists
        if (!file_exists($sourcePath)) {
            $this->command->warn("Source image not found: {$sourcePath}");
            return null;
        }

        // Get file contents and extension
        $contents = file_get_contents($sourcePath);
        $extension = pathinfo($publicPath, PATHINFO_EXTENSION);

        // Generate unique filename
        $filename = Str::uuid() . '.' . $extension;
        $fullStoragePath = trim($storagePath, '/') . '/' . $filename;

        // Upload to storage (uses default disk from config)
        Storage::put($fullStoragePath, $contents);

        return $fullStoragePath;
    }

    /**
     * Upload multiple images and return array of storage paths.
     *
     * @param array $publicPaths Array of public paths
     * @param string $storagePath Storage folder path
     * @return array Array of storage paths
     */
    protected function uploadImages(array $publicPaths, string $storagePath = 'seeder-images'): array
    {
        $uploadedPaths = [];

        foreach ($publicPaths as $publicPath) {
            $uploaded = $this->uploadImage($publicPath, $storagePath);
            if ($uploaded) {
                $uploadedPaths[] = $uploaded;
            }
        }

        return $uploadedPaths;
    }

    /**
     * Get the public URL for a storage path.
     *
     * @param string|null $storagePath
     * @return string|null
     */
    protected function getStorageUrl(?string $storagePath): ?string
    {
        if (!$storagePath) {
            return null;
        }

        return Storage::url($storagePath);
    }
}
