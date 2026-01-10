<?php

namespace App\Services;

use App\Models\ServiceCategory;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ComponentCacheService
{
    /**
     * Cache TTL values in seconds
     */
    private const TTL = [
        'categories' => 3600,       // 1 hour
        'cities' => 3600,           // 1 hour
        'user_menu' => 300,         // 5 minutes
        'navigation' => 1800,       // 30 minutes
        'footer_links' => 86400,    // 1 day
        'provider_stats' => 600,    // 10 minutes
    ];

    /**
     * Get cached categories for dropdowns and navigation
     */
    public function getCategories(): array
    {
        return Cache::remember('component:categories', self::TTL['categories'], function () {
            return ServiceCategory::with('children')
                ->whereNull('parent_id')
                ->orderBy('name')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'parent_id' => $category->parent_id,
                        'children' => $category->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'slug' => $child->slug,
                                'parent_id' => $child->parent_id,
                            ];
                        })->toArray(),
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Get cached cities for location filters
     */
    public function getCities(): array
    {
        return Cache::remember('component:cities', self::TTL['cities'], function () {
            return ServiceProvider::query()
                ->whereNotNull('city')
                ->distinct()
                ->pluck('city')
                ->sort()
                ->values()
                ->toArray();
        });
    }

    /**
     * Get cached user menu data
     */
    public function getUserMenuData(?User $user): array
    {
        if (! $user) {
            return [
                'authenticated' => false,
                'user' => null,
                'roles' => [],
            ];
        }

        $cacheKey = "component:user_menu:{$user->id}";

        return Cache::remember($cacheKey, self::TTL['user_menu'], function () use ($user) {
            return [
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'initials' => $this->getInitials($user->name),
                ],
                'roles' => [
                    'is_provider' => $user->is_provider ?? false,
                    'is_admin' => $user->is_admin ?? false,
                    'is_customer' => true,
                ],
                'notifications_count' => $this->getNotificationsCount($user),
            ];
        });
    }

    /**
     * Get cached navigation items based on user role
     */
    public function getNavigationItems(?User $user, string $layout = 'public'): array
    {
        $cacheKey = "component:navigation:{$layout}";

        if ($user) {
            $cacheKey .= ":{$user->id}";
        }

        return Cache::remember($cacheKey, self::TTL['navigation'], function () use ($user, $layout) {
            switch ($layout) {
                case 'admin':
                    return $this->getAdminNavigation();
                case 'provider':
                    return $this->getProviderNavigation($user);
                case 'customer':
                    return $this->getCustomerNavigation($user);
                default:
                    return $this->getPublicNavigation();
            }
        });
    }

    /**
     * Get cached footer links and content
     */
    public function getFooterData(): array
    {
        return Cache::remember('component:footer', self::TTL['footer_links'], function () {
            return [
                'links' => [
                    'clients' => [
                        ['href' => '/search', 'label' => 'Find Providers'],
                        ['href' => '/categories', 'label' => 'Browse Categories'],
                        ['href' => '/how-it-works', 'label' => 'How It Works'],
                        ['href' => '/testimonials', 'label' => 'Testimonials'],
                        ['href' => '/contact', 'label' => 'Contact Support'],
                    ],
                    'providers' => [
                        ['href' => '/provider/register', 'label' => 'Become a Provider'],
                        ['href' => '/provider/benefits', 'label' => 'Provider Benefits'],
                        ['href' => '/provider/resources', 'label' => 'Resources'],
                        ['href' => '/provider/success-stories', 'label' => 'Success Stories'],
                        ['href' => '/provider/faq', 'label' => 'Provider FAQ'],
                    ],
                    'legal' => [
                        ['href' => '/privacy', 'label' => 'Privacy Policy'],
                        ['href' => '/terms', 'label' => 'Terms of Service'],
                        ['href' => '/sitemap', 'label' => 'Sitemap'],
                    ],
                ],
                'contact' => [
                    'address' => 'Lilongwe, Malawi',
                    'phone' => '+265 999 123 456',
                    'email' => 'info@kwikaevents.com',
                ],
                'social' => [
                    'facebook' => 'https://facebook.com/kwikaevents',
                    'twitter' => 'https://twitter.com/kwikaevents',
                    'instagram' => 'https://instagram.com/kwikaevents',
                    'linkedin' => 'https://linkedin.com/company/kwikaevents',
                ],
                'year' => date('Y'),
            ];
        });
    }

    /**
     * Clear all component caches
     */
    public function clearAll(): void
    {
        Cache::forget('component:categories');
        Cache::forget('component:cities');
        Cache::forget('component:footer');

        // Clear user-specific caches
        $this->clearUserCaches();

        // Clear navigation caches
        Cache::forget('component:navigation:public');
        Cache::forget('component:navigation:admin');
    }

    /**
     * Clear caches for a specific user
     */
    public function clearUserCache(int $userId): void
    {
        Cache::forget("component:user_menu:{$userId}");
        Cache::forget("component:navigation:admin:{$userId}");
        Cache::forget("component:navigation:provider:{$userId}");
        Cache::forget("component:navigation:customer:{$userId}");
    }

    /**
     * Clear category-related caches
     */
    public function clearCategoryCache(): void
    {
        Cache::forget('component:categories');
    }

    /**
     * Clear location-related caches
     */
    public function clearLocationCache(): void
    {
        Cache::forget('component:cities');
    }

    /**
     * Private helper methods
     */
    private function getInitials(string $name): string
    {
        $words = explode(' ', trim($name));
        $initials = '';

        foreach ($words as $word) {
            if (! empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }

        return substr($initials, 0, 2);
    }

    /**
     * Get notifications count safely (checks if notifications table exists)
     */
    private function getNotificationsCount(?User $user): int
    {
        if (! $user) {
            return 0;
        }

        try {
            // Check if notifications table exists
            if (\Schema::hasTable('notifications')) {
                return $user->unreadNotifications()->count();
            }
        } catch (\Exception $e) {
            // If there's any database error, return 0
            \Log::debug('Notifications table not found or error accessing it: '.$e->getMessage());
        }

        return 0;
    }

    private function getAdminNavigation(): array
    {
        return [
            ['href' => '/admin/dashboard', 'label' => 'Dashboard', 'icon' => 'LayoutDashboard'],
            ['href' => '/admin/users', 'label' => 'Users', 'icon' => 'Users'],
            ['href' => '/admin/providers', 'label' => 'Service Providers', 'icon' => 'Building'],
            ['href' => '/admin/categories', 'label' => 'Categories', 'icon' => 'FolderTree'],
            ['href' => '/admin/events', 'label' => 'Events', 'icon' => 'Calendar'],
            ['href' => '/admin/bookings', 'label' => 'Bookings', 'icon' => 'CalendarCheck'],
            ['href' => '/admin/payments', 'label' => 'Payments', 'icon' => 'CreditCard'],
            ['href' => '/admin/reports', 'label' => 'Reports', 'icon' => 'ChartBar'],
            ['href' => '/admin/settings', 'label' => 'Settings', 'icon' => 'Settings'],
        ];
    }

    private function getProviderNavigation(?User $user): array
    {
        $nav = [
            ['href' => '/provider/dashboard', 'label' => 'Overview', 'icon' => 'LayoutDashboard'],
            ['href' => '/provider/listings', 'label' => 'Listings', 'icon' => 'List'],
            ['href' => '/provider/packages', 'label' => 'Packages', 'icon' => 'Package'],
            ['href' => '/provider/bookings', 'label' => 'Bookings', 'icon' => 'Calendar'],
            ['href' => '/provider/messages', 'label' => 'Messages', 'icon' => 'MessageSquare'],
        ];

        $notificationCount = $this->getNotificationsCount($user);
        if ($user && $notificationCount > 0) {
            $nav[4]['badge'] = $notificationCount;
        }

        return $nav;
    }

    private function getCustomerNavigation(?User $user): array
    {
        // User parameter may be used for future personalization
        return [
            ['href' => '/user/bookings', 'label' => 'My Bookings', 'icon' => 'CalendarCheck'],
            ['href' => '/user/messages', 'label' => 'Messages', 'icon' => 'MessageSquare'],
            ['href' => '/user/wishlist', 'label' => 'Wishlist', 'icon' => 'Heart'],
            ['href' => '/user/profile', 'label' => 'Profile Settings', 'icon' => 'User'],
        ];
    }

    private function getPublicNavigation(): array
    {
        return [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/search', 'label' => 'Find Providers'],
            ['href' => '/categories', 'label' => 'Categories'],
            ['href' => '/how-it-works', 'label' => 'How It Works'],
            ['href' => '/contact', 'label' => 'Contact'],
        ];
    }

    private function clearUserCaches(): void
    {
        // Clear all user menu caches
        $users = User::pluck('id');
        foreach ($users as $userId) {
            $this->clearUserCache($userId);
        }
    }
}
