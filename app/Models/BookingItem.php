<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingItem extends Model
{
    protected $fillable = [
        'booking_id',
        'service_id',
        'service_package_id',
        'item_type',
        'name',
        'description',
        'quantity',
        'unit_price',
        'subtotal',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    // Relationships
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    // Methods
    public function isService(): bool
    {
        return $this->item_type === 'service';
    }

    public function isPackage(): bool
    {
        return $this->item_type === 'package';
    }

    public function isCustom(): bool
    {
        return $this->item_type === 'custom';
    }

    public function calculateSubtotal(): float
    {
        return (float) ($this->quantity * $this->unit_price);
    }
}
