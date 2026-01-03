<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class TicketPackage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'event_id',
        'name',
        'description',
        'price',
        'currency',
        'quantity_available',
        'quantity_sold',
        'min_per_order',
        'max_per_order',
        'sale_start',
        'sale_end',
        'features',
        'is_active',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'sale_start' => 'datetime',
            'sale_end' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function eventTickets()
    {
        return $this->hasMany(EventTicket::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
            ->where(function($q) {
                $q->where(function($sq) {
                    $sq->whereNull('sale_start')
                       ->orWhere('sale_start', '<=', now());
                })->where(function($sq) {
                    $sq->whereNull('sale_end')
                       ->orWhere('sale_end', '>=', now());
                });
            })
            ->where(function($q) {
                $q->whereNull('quantity_available')
                  ->orWhereColumn('quantity_sold', '<', 'quantity_available');
            });
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return "{$this->currency} " . number_format($this->price, 2, '.', ',');
    }

    public function getRemainingQuantityAttribute(): ?int
    {
        if (!$this->quantity_available) {
            return null; // Unlimited
        }

        return max(0, $this->quantity_available - $this->quantity_sold);
    }

    public function getIsAvailableAttribute(): bool
    {
        // Check if active
        if (!$this->is_active) {
            return false;
        }

        // Check sale period
        $now = Carbon::now();
        if ($this->sale_start && $this->sale_start > $now) {
            return false;
        }
        if ($this->sale_end && $this->sale_end < $now) {
            return false;
        }

        // Check quantity
        if ($this->quantity_available && $this->quantity_sold >= $this->quantity_available) {
            return false;
        }

        return true;
    }

    public function getIsSoldOutAttribute(): bool
    {
        return $this->quantity_available && $this->quantity_sold >= $this->quantity_available;
    }

    // Methods
    public function incrementSold(int $quantity = 1): void
    {
        $this->increment('quantity_sold', $quantity);
    }
}
