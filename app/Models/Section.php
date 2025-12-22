<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'capacity',
        'row_count',
        'seat_numbering_type',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'row_count' => 'integer',
    ];

    /**
     * Get the event this section belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get all seats in this section.
     */
    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }

    /**
     * Get available seats count.
     */
    public function getAvailableSeatsCountAttribute(): int
    {
        return $this->seats()->where('status', 'available')->count();
    }

    /**
     * Get sold seats count.
     */
    public function getSoldSeatsCountAttribute(): int
    {
        return $this->seats()->where('status', 'sold')->count();
    }

    /**
     * Check if section is fully booked.
     */
    public function isFullyBooked(): bool
    {
        return $this->available_seats_count === 0;
    }
}
