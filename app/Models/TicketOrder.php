<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number',
        'user_id',
        'event_id',
        'total_amount',
        'currency',
        'status',
        'payment_id',
        'payment_status',
        'billing_name',
        'billing_email',
        'billing_phone',
        'promo_code',
        'discount_amount',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user who placed this order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event this order is for.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the payment associated with this order.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Get all tickets in this order.
     */
    public function eventTickets(): HasMany
    {
        return $this->hasMany(EventTicket::class, 'order_id');
    }

    /**
     * Check if the order is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the order is confirmed.
     */
    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if the order is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if the order is refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Check if the payment is completed.
     */
    public function isPaymentCompleted(): bool
    {
        return $this->payment_status === 'completed';
    }

    /**
     * Get the total ticket count for this order.
     */
    public function getTicketCountAttribute(): int
    {
        return $this->eventTickets()->count();
    }

    /**
     * Get the final amount after discount.
     */
    public function getFinalAmountAttribute(): float
    {
        return $this->total_amount - $this->discount_amount;
    }
}
