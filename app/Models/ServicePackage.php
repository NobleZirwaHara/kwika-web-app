<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServicePackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service_provider_id',
        'name',
        'slug',
        'description',
        'package_type',
        'base_service_id',
        'base_price',
        'final_price',
        'currency',
        'min_quantity',
        'max_quantity',
        'inclusions',
        'primary_image',
        'gallery_images',
        'is_active',
        'is_featured',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'final_price' => 'decimal:2',
            'inclusions' => 'array',
            'gallery_images' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'min_quantity' => 'integer',
            'max_quantity' => 'integer',
            'display_order' => 'integer',
        ];
    }

    // Relationships
    public function serviceProvider(): BelongsTo
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function baseService(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'base_service_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServicePackageItem::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeTiers($query)
    {
        return $query->where('package_type', 'tier');
    }

    public function scopeBundles($query)
    {
        return $query->where('package_type', 'bundle');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Methods
    public function isTier(): bool
    {
        return $this->package_type === 'tier';
    }

    public function isBundle(): bool
    {
        return $this->package_type === 'bundle';
    }

    public function calculateTotal(): float
    {
        $total = $this->items->sum('subtotal');
        return (float) $total;
    }

    public function getFormattedPrice(): string
    {
        return number_format($this->final_price, 2, '.', ',') . ' ' . $this->currency;
    }

    public function getFormattedPriceShort(): string
    {
        return number_format($this->final_price, 0, '.', ',') . ' ' . $this->currency;
    }
}
