<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePackageItem extends Model
{
    protected $fillable = [
        'service_package_id',
        'service_id',
        'quantity',
        'unit_price',
        'subtotal',
        'is_optional',
        'notes',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'is_optional' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    // Relationships
    public function package(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    // Methods
    public function calculateSubtotal(): float
    {
        return (float) ($this->quantity * $this->unit_price);
    }
}
