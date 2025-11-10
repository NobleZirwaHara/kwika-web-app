<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_provider_id', 'subscription_plan_id', 'start_date', 'end_date',
        'status', 'auto_renew', 'amount_paid', 'cancelled_at', 'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'amount_paid' => 'decimal:2',
            'auto_renew' => 'boolean',
            'cancelled_at' => 'datetime',
        ];
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('end_date', '>=', now());
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date >= now();
    }
}
