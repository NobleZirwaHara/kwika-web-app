<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    // Relationships
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Accessors
    public function getFormattedUnitPriceAttribute(): string
    {
        $currency = $this->cart?->currency ?? 'MWK';
        return $currency . ' ' . number_format($this->unit_price, 0, '.', ',');
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        $currency = $this->cart?->currency ?? 'MWK';
        return $currency . ' ' . number_format($this->total_price, 0, '.', ',');
    }
}
