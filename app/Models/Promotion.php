<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_provider_id',
        'type',
        'title',
        'description',
        'code',
        'discount_value',
        'min_booking_amount',
        'max_discount_amount',
        'applicable_to',
        'service_ids',
        'category_ids',
        'start_date',
        'end_date',
        'usage_limit',
        'usage_count',
        'per_customer_limit',
        'is_active',
        'priority',
        'terms_conditions',
        'banner_image',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'min_booking_amount' => 'decimal:2',
            'max_discount_amount' => 'decimal:2',
            'service_ids' => 'array',
            'category_ids' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_ids');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->where(function($q) {
                $q->whereNull('usage_limit')
                  ->orWhereColumn('usage_count', '<', 'usage_limit');
            });
    }

    // Accessors
    public function getStatusAttribute(): string
    {
        if (!$this->is_active) {
            return 'inactive';
        }

        $now = Carbon::now();

        if ($this->start_date > $now) {
            return 'upcoming';
        }

        if ($this->end_date < $now) {
            return 'expired';
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return 'exhausted';
        }

        return 'active';
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date < Carbon::now();
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->start_date > Carbon::now();
    }

    public function getIsExhaustedAttribute(): bool
    {
        return $this->usage_limit && $this->usage_count >= $this->usage_limit;
    }

    public function getRemainingUsesAttribute(): ?int
    {
        if (!$this->usage_limit) {
            return null; // Unlimited
        }

        return max(0, $this->usage_limit - $this->usage_count);
    }

    public function getDiscountDisplayAttribute(): string
    {
        if ($this->type === 'percentage') {
            return $this->discount_value . '%';
        }

        return 'MWK ' . number_format($this->discount_value, 2, '.', ',');
    }

    // Methods
    public function canBeUsed(): bool
    {
        return $this->is_active
            && !$this->is_expired
            && !$this->is_upcoming
            && !$this->is_exhausted;
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
