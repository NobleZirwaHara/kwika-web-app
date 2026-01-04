<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class WishlistItem extends Model
{
    protected $fillable = [
        'user_wishlist_id',
        'itemable_type',
        'itemable_id',
        'notes',
    ];

    // ==================== Relationships ====================

    public function wishlist(): BelongsTo
    {
        return $this->belongsTo(UserWishlist::class, 'user_wishlist_id');
    }

    public function itemable(): MorphTo
    {
        return $this->morphTo();
    }

    // ==================== Type Checks ====================

    public function isProvider(): bool
    {
        return $this->itemable_type === ServiceProvider::class;
    }

    public function isPackage(): bool
    {
        return $this->itemable_type === ServicePackage::class;
    }

    public function isService(): bool
    {
        return $this->itemable_type === Service::class;
    }

    // ==================== Helper Methods ====================

    /**
     * Get the item type as a short string
     */
    public function getItemTypeAttribute(): string
    {
        return match ($this->itemable_type) {
            ServiceProvider::class => 'provider',
            ServicePackage::class => 'package',
            Service::class => 'service',
            default => 'unknown',
        };
    }

    /**
     * Format item data for API responses
     */
    public function getFormattedItemAttribute(): array
    {
        $item = $this->itemable;

        if (! $item) {
            return [
                'id' => $this->id,
                'type' => $this->item_type,
                'item_id' => $this->itemable_id,
                'exists' => false,
            ];
        }

        $base = [
            'id' => $this->id,
            'type' => $this->item_type,
            'item_id' => $this->itemable_id,
            'notes' => $this->notes,
            'added_at' => $this->created_at->toISOString(),
            'exists' => true,
        ];

        if ($this->isProvider()) {
            return array_merge($base, [
                'business_name' => $item->business_name,
                'slug' => $item->slug,
                'logo' => $item->logo,
                'city' => $item->city,
                'average_rating' => $item->average_rating,
                'total_reviews' => $item->total_reviews,
                'is_verified' => $item->verification_status === 'approved',
            ]);
        }

        if ($this->isPackage()) {
            return array_merge($base, [
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'final_price' => $item->final_price,
                'currency' => $item->currency,
                'primary_image' => $item->primary_image,
                'package_type' => $item->package_type,
                'provider' => $item->serviceProvider ? [
                    'id' => $item->serviceProvider->id,
                    'business_name' => $item->serviceProvider->business_name,
                    'slug' => $item->serviceProvider->slug,
                ] : null,
            ]);
        }

        if ($this->isService()) {
            return array_merge($base, [
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'base_price' => $item->base_price,
                'price_type' => $item->price_type,
                'currency' => $item->currency,
                'primary_image' => $item->primary_image,
                'provider' => $item->serviceProvider ? [
                    'id' => $item->serviceProvider->id,
                    'business_name' => $item->serviceProvider->business_name,
                    'slug' => $item->serviceProvider->slug,
                ] : null,
            ]);
        }

        return $base;
    }
}
