<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'catalogue_id',
        'service_provider_id',
        'name',
        'slug',
        'description',
        'sku',
        'price',
        'sale_price',
        'currency',
        'stock_quantity',
        'track_inventory',
        'unit',
        'weight',
        'dimensions',
        'specifications',
        'features',
        'primary_image',
        'gallery_images',
        'is_active',
        'is_featured',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'specifications' => 'array',
            'features' => 'array',
            'gallery_images' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'track_inventory' => 'boolean',
        ];
    }

    // Relationships
    public function catalogue()
    {
        return $this->belongsTo(Catalogue::class);
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where(function($q) {
            $q->where('track_inventory', false)
              ->orWhere('stock_quantity', '>', 0);
        });
    }

    // Accessors
    public function getDisplayPriceAttribute(): string
    {
        if ($this->sale_price && $this->sale_price < $this->price) {
            return "{$this->currency} " . number_format($this->sale_price, 2, '.', ',');
        }
        return "{$this->currency} " . number_format($this->price, 2, '.', ',');
    }

    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    public function getIsInStockAttribute(): bool
    {
        return !$this->track_inventory || $this->stock_quantity > 0;
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        if (!isset($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value) . '-' . Str::random(6);
        }
    }
}
