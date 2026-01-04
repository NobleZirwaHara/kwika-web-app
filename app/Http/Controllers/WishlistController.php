<?php

namespace App\Http\Controllers;

use App\Http\Middleware\WishlistCookieMiddleware;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServiceProvider;
use App\Models\UserWishlist;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class WishlistController extends Controller
{
    // ==================== Page Routes ====================

    /**
     * Display all wishlists overview
     */
    public function index(Request $request): InertiaResponse
    {
        $wishlists = $this->getUserWishlists($request);

        $categories = \App\Models\ServiceCategory::active()
            ->select('id', 'name', 'slug', 'description', 'icon')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlists' => $wishlists->map(fn ($w) => $this->formatWishlistForResponse($w)),
            'categories' => $categories,
            'isGuest' => ! Auth::check(),
        ]);
    }

    /**
     * Display a specific wishlist
     */
    public function show(Request $request, string $slug): InertiaResponse
    {
        $wishlist = $this->findWishlistBySlug($request, $slug);

        if (! $wishlist) {
            abort(404, 'Wishlist not found');
        }

        $categories = \App\Models\ServiceCategory::active()
            ->select('id', 'name', 'slug', 'description', 'icon')
            ->get();

        return Inertia::render('Wishlist/Show', [
            'wishlist' => $this->formatWishlistForResponse($wishlist, true),
            'categories' => $categories,
            'isGuest' => ! Auth::check(),
        ]);
    }

    /**
     * Create a new named wishlist
     */
    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        $existingCount = UserWishlist::query()
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId && $guestToken, fn ($q) => $q->forGuest($guestToken))
            ->where('name', $validated['name'])
            ->exists();

        if ($existingCount) {
            return response()->json([
                'success' => false,
                'message' => 'A wishlist with this name already exists.',
            ], 400);
        }

        $wishlist = UserWishlist::create([
            'user_id' => $userId,
            'guest_token' => $guestToken,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.Str::random(6),
            'is_default' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wishlist created successfully!',
            'wishlist' => $this->formatWishlistForResponse($wishlist),
        ]);
    }

    /**
     * Rename a wishlist
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $wishlist = $this->findWishlistById($request, $id);

        if (! $wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Wishlist not found.',
            ], 404);
        }

        $wishlist->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.Str::random(6),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wishlist renamed successfully!',
            'wishlist' => $this->formatWishlistForResponse($wishlist),
        ]);
    }

    /**
     * Delete a wishlist
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $wishlist = $this->findWishlistById($request, $id);

        if (! $wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Wishlist not found.',
            ], 404);
        }

        if ($wishlist->is_default) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete the default wishlist.',
            ], 400);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wishlist deleted successfully!',
        ]);
    }

    // ==================== API Routes ====================

    /**
     * Get all wishlist data for frontend context
     */
    public function getData(Request $request): JsonResponse
    {
        $wishlists = $this->getUserWishlists($request);

        return response()->json([
            'wishlists' => $wishlists->map(fn ($w) => $this->formatWishlistForResponse($w)),
            'isGuest' => ! Auth::check(),
        ]);
    }

    /**
     * Get all wishlisted item IDs grouped by type
     */
    public function getIds(Request $request): JsonResponse
    {
        $wishlists = $this->getUserWishlists($request);

        $providerIds = [];
        $packageIds = [];
        $serviceIds = [];

        foreach ($wishlists as $wishlist) {
            foreach ($wishlist->items as $item) {
                if ($item->isProvider()) {
                    $providerIds[] = $item->itemable_id;
                } elseif ($item->isPackage()) {
                    $packageIds[] = $item->itemable_id;
                } elseif ($item->isService()) {
                    $serviceIds[] = $item->itemable_id;
                }
            }
        }

        return response()->json([
            'providerIds' => array_unique($providerIds),
            'packageIds' => array_unique($packageIds),
            'serviceIds' => array_unique($serviceIds),
        ]);
    }

    /**
     * Check if a provider is wishlisted
     */
    public function checkProvider(Request $request, int $id): JsonResponse
    {
        return $this->checkItem($request, ServiceProvider::class, $id);
    }

    /**
     * Check if a package is wishlisted
     */
    public function checkPackage(Request $request, int $id): JsonResponse
    {
        return $this->checkItem($request, ServicePackage::class, $id);
    }

    /**
     * Check if a service is wishlisted
     */
    public function checkService(Request $request, int $id): JsonResponse
    {
        return $this->checkItem($request, Service::class, $id);
    }

    /**
     * Add a provider to wishlist
     */
    public function addProvider(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:service_providers,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->addItem($request, ServiceProvider::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    /**
     * Add a package to wishlist
     */
    public function addPackage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:service_packages,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->addItem($request, ServicePackage::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    /**
     * Add a service to wishlist
     */
    public function addService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:services,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->addItem($request, Service::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    /**
     * Remove an item from wishlist
     */
    public function removeItem(Request $request, int $id): JsonResponse
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        $item = WishlistItem::whereHas('wishlist', function ($q) use ($userId, $guestToken) {
            $q->when($userId, fn ($query) => $query->forUser($userId))
                ->when(! $userId && $guestToken, fn ($query) => $query->forGuest($guestToken));
        })->find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in your wishlists.',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from wishlist.',
        ]);
    }

    /**
     * Move item between wishlists
     */
    public function moveItem(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'wishlist_id' => 'required|integer',
        ]);

        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        $item = WishlistItem::whereHas('wishlist', function ($q) use ($userId, $guestToken) {
            $q->when($userId, fn ($query) => $query->forUser($userId))
                ->when(! $userId && $guestToken, fn ($query) => $query->forGuest($guestToken));
        })->find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in your wishlists.',
            ], 404);
        }

        $targetWishlist = $this->findWishlistById($request, $validated['wishlist_id']);

        if (! $targetWishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Target wishlist not found.',
            ], 404);
        }

        // Check if item already exists in target wishlist
        $exists = WishlistItem::where('user_wishlist_id', $targetWishlist->id)
            ->where('itemable_type', $item->itemable_type)
            ->where('itemable_id', $item->itemable_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Item already exists in the target wishlist.',
            ], 400);
        }

        $item->update(['user_wishlist_id' => $targetWishlist->id]);

        return response()->json([
            'success' => true,
            'message' => 'Item moved successfully!',
        ]);
    }

    /**
     * Toggle item in wishlist (add if not present, remove if present)
     */
    public function toggleProvider(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:service_providers,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->toggleItem($request, ServiceProvider::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    public function togglePackage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:service_packages,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->toggleItem($request, ServicePackage::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    public function toggleService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:services,id',
            'wishlist_id' => 'nullable|integer',
        ]);

        return $this->toggleItem($request, Service::class, $validated['id'], $validated['wishlist_id'] ?? null);
    }

    // ==================== Helper Methods ====================

    private function getUserWishlists(Request $request)
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        return UserWishlist::with(['items.itemable'])
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId && $guestToken, fn ($q) => $q->forGuest($guestToken))
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get();
    }

    private function findWishlistById(Request $request, int $id): ?UserWishlist
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        return UserWishlist::query()
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId && $guestToken, fn ($q) => $q->forGuest($guestToken))
            ->find($id);
    }

    private function findWishlistBySlug(Request $request, string $slug): ?UserWishlist
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        return UserWishlist::with(['items.itemable'])
            ->when($userId, fn ($q) => $q->forUser($userId))
            ->when(! $userId && $guestToken, fn ($q) => $q->forGuest($guestToken))
            ->where('slug', $slug)
            ->first();
    }

    private function checkItem(Request $request, string $type, int $id): JsonResponse
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        $isWishlisted = WishlistItem::whereHas('wishlist', function ($q) use ($userId, $guestToken) {
            $q->when($userId, fn ($query) => $query->forUser($userId))
                ->when(! $userId && $guestToken, fn ($query) => $query->forGuest($guestToken));
        })
            ->where('itemable_type', $type)
            ->where('itemable_id', $id)
            ->exists();

        return response()->json([
            'isWishlisted' => $isWishlisted,
        ]);
    }

    private function addItem(Request $request, string $type, int $id, ?int $wishlistId = null): JsonResponse
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        // Get or create the target wishlist
        if ($wishlistId) {
            $wishlist = $this->findWishlistById($request, $wishlistId);
            if (! $wishlist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wishlist not found.',
                ], 404);
            }
        } else {
            $wishlist = UserWishlist::getOrCreateDefault($userId, $guestToken);
        }

        // Check if already in wishlist
        if ($wishlist->hasItem($type, $id)) {
            return response()->json([
                'success' => false,
                'message' => 'Item is already in this wishlist.',
            ], 400);
        }

        $wishlist->addItem($type, $id);

        return response()->json([
            'success' => true,
            'message' => 'Item added to wishlist!',
            'wishlist_id' => $wishlist->id,
        ]);
    }

    private function toggleItem(Request $request, string $type, int $id, ?int $wishlistId = null): JsonResponse
    {
        $userId = Auth::id();
        $guestToken = $userId ? null : WishlistCookieMiddleware::getGuestToken($request);

        // For toggle, use default wishlist if none specified
        if ($wishlistId) {
            $wishlist = $this->findWishlistById($request, $wishlistId);
            if (! $wishlist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wishlist not found.',
                ], 404);
            }
        } else {
            $wishlist = UserWishlist::getOrCreateDefault($userId, $guestToken);
        }

        $isWishlisted = $wishlist->hasItem($type, $id);

        if ($isWishlisted) {
            $wishlist->removeItem($type, $id);

            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Item removed from wishlist.',
                'isWishlisted' => false,
            ]);
        } else {
            $wishlist->addItem($type, $id);

            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Item added to wishlist!',
                'isWishlisted' => true,
            ]);
        }
    }

    private function formatWishlistForResponse(UserWishlist $wishlist, bool $includeItems = false): array
    {
        // Get item IDs grouped by type for quick lookup
        $providerIds = [];
        $packageIds = [];
        $serviceIds = [];

        foreach ($wishlist->items as $item) {
            if ($item->isProvider()) {
                $providerIds[] = $item->itemable_id;
            } elseif ($item->isPackage()) {
                $packageIds[] = $item->itemable_id;
            } elseif ($item->isService()) {
                $serviceIds[] = $item->itemable_id;
            }
        }

        $data = [
            'id' => $wishlist->id,
            'name' => $wishlist->name,
            'slug' => $wishlist->slug,
            'is_default' => $wishlist->is_default,
            'provider_count' => $wishlist->provider_count,
            'package_count' => $wishlist->package_count,
            'service_count' => $wishlist->service_count,
            'total_items' => $wishlist->provider_count + $wishlist->package_count + $wishlist->service_count,
            'total_package_price' => $wishlist->total_package_price,
            'formatted_total' => $wishlist->formatted_total,
            'created_at' => $wishlist->created_at->toISOString(),
            // Include item IDs for quick lookup
            'provider_ids' => $providerIds,
            'package_ids' => $packageIds,
            'service_ids' => $serviceIds,
        ];

        if ($includeItems) {
            $data['providers'] = $wishlist->items
                ->filter(fn ($item) => $item->isProvider())
                ->map(fn ($item) => $item->formatted_item)
                ->values();

            $data['packages'] = $wishlist->items
                ->filter(fn ($item) => $item->isPackage())
                ->map(fn ($item) => $item->formatted_item)
                ->values();

            $data['services'] = $wishlist->items
                ->filter(fn ($item) => $item->isService())
                ->map(fn ($item) => $item->formatted_item)
                ->values();
        }

        return $data;
    }
}
