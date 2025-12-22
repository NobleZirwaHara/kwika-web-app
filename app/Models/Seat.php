<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Seat extends Model
{
    protected $fillable = [
        'section_id',
        'seat_number',
        'row',
        'column',
        'status',
        'reserved_until',
        'price_modifier',
    ];

    protected $casts = [
        'column' => 'integer',
        'price_modifier' => 'decimal:2',
        'reserved_until' => 'datetime',
    ];

    /**
     * Get the section this seat belongs to.
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get the ticket assigned to this seat.
     */
    public function eventTicket(): HasOne
    {
        return $this->hasOne(EventTicket::class);
    }

    /**
     * Check if the seat is available.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Check if the seat is reserved.
     */
    public function isReserved(): bool
    {
        return $this->status === 'reserved';
    }

    /**
     * Check if the seat is sold.
     */
    public function isSold(): bool
    {
        return $this->status === 'sold';
    }

    /**
     * Check if the seat is blocked.
     */
    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    /**
     * Check if the reservation has expired.
     */
    public function isReservationExpired(): bool
    {
        if (!$this->isReserved() || !$this->reserved_until) {
            return false;
        }

        return now()->isAfter($this->reserved_until);
    }

    /**
     * Reserve the seat for a specific duration.
     */
    public function reserve(int $minutes = 15): bool
    {
        if (!$this->isAvailable()) {
            return false;
        }

        $this->update([
            'status' => 'reserved',
            'reserved_until' => now()->addMinutes($minutes),
        ]);

        return true;
    }

    /**
     * Release the seat reservation.
     */
    public function release(): bool
    {
        if (!$this->isReserved()) {
            return false;
        }

        $this->update([
            'status' => 'available',
            'reserved_until' => null,
        ]);

        return true;
    }

    /**
     * Mark the seat as sold.
     */
    public function markAsSold(): bool
    {
        $this->update([
            'status' => 'sold',
            'reserved_until' => null,
        ]);

        return true;
    }
}
