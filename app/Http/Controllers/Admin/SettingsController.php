<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index()
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Only super admins can access settings.');
        }

        // Get all settings grouped by category
        $settings = DB::table('settings')->get()->groupBy('group');

        // Convert to array format for frontend
        $settingsData = $settings->mapWithKeys(function ($items, $group) {
            return [$group => $items->mapWithKeys(function ($item) {
                return [$item->key => [
                    'value' => $item->value,
                    'type' => $item->type,
                    'description' => $item->description,
                ]];
            })];
        })->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'admin_role' => $admin->admin_role,
            ],
            'settings' => $settingsData,
            'env' => [
                'app_name' => config('app.name'),
                'app_env' => config('app.env'),
                'app_debug' => config('app.debug'),
            ],
        ]);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can update settings.');
        }

        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['settings'] as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    [
                        'value' => is_array($value) ? json_encode($value) : $value,
                        'updated_at' => now(),
                    ]
                );
            }

            // Log admin action
            $admin->logAdminAction(
                'updated',
                'Settings',
                null,
                null,
                $validated['settings'],
                'Settings updated by admin'
            );

            DB::commit();

            // Clear cache after settings update
            Cache::flush();

            return back()->with('success', 'Settings updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update settings: ' . $e->getMessage());
        }
    }

    /**
     * Clear application cache
     */
    public function clearCache()
    {
        $admin = Auth::user();

        if (!$admin->isSuperAdmin()) {
            return back()->with('error', 'Only super admins can clear cache.');
        }

        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            // Log admin action
            $admin->logAdminAction(
                'cache_cleared',
                'System',
                null,
                null,
                null,
                'Application cache cleared'
            );

            return back()->with('success', 'Cache cleared successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to clear cache: ' . $e->getMessage());
        }
    }
}
