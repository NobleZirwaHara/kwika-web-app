<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventTicket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'ticket_number',
        'event_id',
        'ticket_package_id',
        'user_id',
        'order_id',
        'attendee_name',
        'attendee_email',
        'attendee_phone',
        'qr_code',
        'status',
        'checked_in_at',
        'checked_in_by',
        'seat_id',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the event that owns the ticket.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the ticket package for this ticket.
     */
    public function ticketPackage(): BelongsTo
    {
        return $this->belongsTo(TicketPackage::class);
    }

    /**
     * Get the user who owns this ticket.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order this ticket belongs to.
     */
    public function ticketOrder(): BelongsTo
    {
        return $this->belongsTo(TicketOrder::class, 'order_id');
    }

    /**
     * Get the seat assigned to this ticket (optional).
     */
    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    /**
     * Get the user who checked in this ticket.
     */
    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    /**
     * Check if the ticket has been used.
     */
    public function isUsed(): bool
    {
        return $this->status === 'used';
    }

    /**
     * Check if the ticket is valid.
     */
    public function isValid(): bool
    {
        return $this->status === 'valid';
    }

    /**
     * Check if the ticket has been cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if the ticket has been refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Check if the ticket has been checked in.
     */
    public function isCheckedIn(): bool
    {
        return !is_null($this->checked_in_at);
    }
}
