<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_number', 'user_id', 'service_id', 'service_provider_id', 'booking_type', 'service_package_id',
        'event_date', 'start_time', 'end_time', 'event_end_date', 'event_location',
        'event_latitude', 'event_longitude',
        'attendees', 'special_requests', 'inspiration_images', 'total_amount', 'subtotal', 'discount_amount', 'deposit_amount',
        'remaining_amount', 'status', 'payment_status', 'cancellation_reason',
        'cancelled_at', 'confirmed_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
            'event_end_date' => 'datetime',
            'total_amount' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'remaining_amount' => 'decimal:2',
            'cancelled_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'inspiration_images' => 'array',
        ];
    }

    /**
     * Get the full URLs for inspiration images.
     */
    public function getInspirationImageUrlsAttribute(): array
    {
        if (! $this->inspiration_images) {
            return [];
        }

        return array_map(fn ($path) => Storage::disk('public')->url($path), $this->inspiration_images);
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

    public function conversation()
    {
        return $this->hasOne(Conversation::class);
    }

    public function servicePackage()
    {
        return $this->belongsTo(ServicePackage::class);
    }

    public function items()
    {
        return $this->hasMany(BookingItem::class);
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

    public function isSingleService(): bool
    {
        return $this->booking_type === 'single_service';
    }

    public function isPackage(): bool
    {
        return $this->booking_type === 'package';
    }

    public function isCustom(): bool
    {
        return $this->booking_type === 'custom';
    }
}
