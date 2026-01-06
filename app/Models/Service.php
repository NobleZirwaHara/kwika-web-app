<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_provider_id', 'service_category_id', 'catalogue_id', 'name', 'slug', 'description',
        'base_price', 'price_type', 'max_price', 'currency', 'duration', 'max_attendees', 'minimum_quantity',
        'inclusions', 'requirements', 'primary_image', 'gallery_images', 'is_active', 'requires_deposit',
        'deposit_percentage', 'cancellation_hours',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'max_price' => 'decimal:2',
            'deposit_percentage' => 'decimal:2',
            'minimum_quantity' => 'integer',
            'inclusions' => 'array',
            'requirements' => 'array',
            'gallery_images' => 'array',
            'is_active' => 'boolean',
            'requires_deposit' => 'boolean',
        ];
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function catalogue()
    {
        return $this->belongsTo(Catalogue::class);
    }

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availability()
    {
        return $this->hasMany(Availability::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function packages()
    {
        return $this->hasMany(ServicePackage::class, 'base_service_id');
    }

    public function packageItems()
    {
        return $this->hasMany(ServicePackageItem::class);
    }

    public function wishlistItems()
    {
        return $this->morphMany(WishlistItem::class, 'itemable');
    }

    public function scopeActive($query)
    {
        return $query->where('services.is_active', true);
    }

    public function getFormattedPrice(): string
    {
        if ($this->price_type === 'custom' && $this->max_price) {
            return "{$this->currency} ".number_format($this->base_price, 2, '.', ',').' - '.number_format($this->max_price, 2, '.', ',');
        }

        return "{$this->currency} ".number_format($this->base_price, 2, '.', ',').' per '.$this->price_type;
    }
}
