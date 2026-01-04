<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class UserWishlist extends Model
{
    protected $fillable = [
        'user_id',
        'guest_token',
        'name',
        'slug',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($wishlist) {
            if (empty($wishlist->slug)) {
                $wishlist->slug = Str::slug($wishlist->name);
            }
        });

        static::updating(function ($wishlist) {
            if ($wishlist->isDirty('name')) {
                $wishlist->slug = Str::slug($wishlist->name);
            }
        });
    }

    // ==================== Relationships ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(WishlistItem::class);
    }

    // ==================== Computed Attributes ====================

    public function getProviderCountAttribute(): int
    {
        return $this->items()->where('itemable_type', ServiceProvider::class)->count();
    }

    public function getPackageCountAttribute(): int
    {
        return $this->items()->where('itemable_type', ServicePackage::class)->count();
    }

    public function getServiceCountAttribute(): int
    {
        return $this->items()->where('itemable_type', Service::class)->count();
    }

    public function getTotalItemCountAttribute(): int
    {
        return $this->items()->count();
    }

    public function getTotalPackagePriceAttribute(): float
    {
        $packageItems = $this->items()
            ->where('itemable_type', ServicePackage::class)
            ->with('itemable')
            ->get();

        return $packageItems->sum(function ($item) {
            return $item->itemable?->final_price ?? 0;
        });
    }

    public function getFormattedTotalAttribute(): string
    {
        return 'MWK ' . number_format($this->total_package_price, 0, '.', ',');
    }

    // ==================== Static Methods ====================

    /**
     * Get or create a default wishlist for a user or guest
     */
    public static function getOrCreateDefault(?int $userId, ?string $guestToken): self
    {
        // For authenticated users
        if ($userId) {
            return self::firstOrCreate(
                ['user_id' => $userId, 'is_default' => true],
                ['name' => 'My Wishlist', 'slug' => 'my-wishlist']
            );
        }

        // For guests
        if ($guestToken) {
            return self::firstOrCreate(
                ['guest_token' => $guestToken, 'is_default' => true],
                ['name' => 'My Wishlist', 'slug' => 'my-wishlist']
            );
        }

        throw new \InvalidArgumentException('Either user_id or guest_token must be provided');
    }

    /**
     * Get all wishlists for a user or guest
     */
    public static function getAllForOwner(?int $userId, ?string $guestToken)
    {
        if ($userId) {
            return self::forUser($userId)->orderBy('is_default', 'desc')->orderBy('name')->get();
        }

        if ($guestToken) {
            return self::forGuest($guestToken)->orderBy('is_default', 'desc')->orderBy('name')->get();
        }

        return collect();
    }

    /**
     * Merge guest wishlists into user account on login
     */
    public static function mergeGuestToUser(string $guestToken, int $userId): void
    {
        $guestWishlists = self::forGuest($guestToken)->with('items')->get();

        foreach ($guestWishlists as $guestWishlist) {
            // Find or create matching user wishlist
            $userHasDefault = self::forUser($userId)->default()->exists();

            $userWishlist = self::firstOrCreate(
                ['user_id' => $userId, 'name' => $guestWishlist->name],
                [
                    'slug' => $guestWishlist->slug,
                    'is_default' => $guestWishlist->is_default && ! $userHasDefault,
                ]
            );

            // Merge items (skip duplicates)
            foreach ($guestWishlist->items as $item) {
                WishlistItem::firstOrCreate([
                    'user_wishlist_id' => $userWishlist->id,
                    'itemable_type' => $item->itemable_type,
                    'itemable_id' => $item->itemable_id,
                ], [
                    'notes' => $item->notes,
                ]);
            }

            // Delete guest wishlist after merge
            $guestWishlist->delete();
        }
    }

    // ==================== Scopes ====================

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForGuest($query, string $token)
    {
        return $query->where('guest_token', $token);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // ==================== Helper Methods ====================

    /**
     * Add an item to this wishlist
     */
    public function addItem(string $itemableType, int $itemableId, ?string $notes = null): WishlistItem
    {
        return WishlistItem::firstOrCreate([
            'user_wishlist_id' => $this->id,
            'itemable_type' => $itemableType,
            'itemable_id' => $itemableId,
        ], [
            'notes' => $notes,
        ]);
    }

    /**
     * Check if an item exists in this wishlist
     */
    public function hasItem(string $itemableType, int $itemableId): bool
    {
        return $this->items()
            ->where('itemable_type', $itemableType)
            ->where('itemable_id', $itemableId)
            ->exists();
    }

    /**
     * Remove an item from this wishlist
     */
    public function removeItem(string $itemableType, int $itemableId): bool
    {
        return $this->items()
            ->where('itemable_type', $itemableType)
            ->where('itemable_id', $itemableId)
            ->delete() > 0;
    }

    /**
     * Get providers in this wishlist
     */
    public function getProvidersAttribute()
    {
        return $this->items()
            ->where('itemable_type', ServiceProvider::class)
            ->with('itemable')
            ->get()
            ->map(fn($item) => $item->itemable)
            ->filter();
    }

    /**
     * Get packages in this wishlist
     */
    public function getPackagesAttribute()
    {
        return $this->items()
            ->where('itemable_type', ServicePackage::class)
            ->with('itemable.serviceProvider')
            ->get()
            ->map(fn($item) => $item->itemable)
            ->filter();
    }

    /**
     * Get services in this wishlist
     */
    public function getServicesAttribute()
    {
        return $this->items()
            ->where('itemable_type', Service::class)
            ->with('itemable.serviceProvider')
            ->get()
            ->map(fn($item) => $item->itemable)
            ->filter();
    }
}
