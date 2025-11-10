<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_number', 'user_id', 'service_id', 'service_provider_id',
        'event_date', 'event_end_date', 'event_location', 'attendees',
        'special_requests', 'total_amount', 'deposit_amount', 'remaining_amount',
        'status', 'payment_status', 'cancellation_reason', 'cancelled_at',
        'confirmed_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
            'event_end_date' => 'datetime',
            'total_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'remaining_amount' => 'decimal:2',
            'cancelled_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>', now())
            ->whereIn('status', ['pending', 'confirmed']);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canBeReviewed(): bool
    {
        return $this->isCompleted() && !$this->review;
    }
}
