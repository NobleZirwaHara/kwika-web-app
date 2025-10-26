<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'billing_cycle', 'features',
        'max_services', 'max_images', 'featured_listing', 'priority_support',
        'analytics_access', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'featured_listing' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function providerSubscriptions()
    {
        return $this->hasMany(ProviderSubscription::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
