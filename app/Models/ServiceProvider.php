<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceProvider extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'description',
        'business_registration_number',
        'location',
        'city',
        'latitude',
        'longitude',
        'phone',
        'email',
        'website',
        'social_links',
        'logo',
        'cover_image',
        'average_rating',
        'total_reviews',
        'total_bookings',
        'is_verified',
        'is_featured',
        'is_active',
        'verification_status',
        'rejection_reason',
        'verified_at',
        'onboarding_step',
        'onboarding_completed',
        'onboarding_data',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'average_rating' => 'decimal:2',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'verified_at' => 'datetime',
            'onboarding_completed' => 'boolean',
            'onboarding_data' => 'array',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function availability()
    {
        return $this->hasMany(Availability::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(ProviderSubscription::class);
    }

    public function currentSubscription()
    {
        return $this->hasOne(ProviderSubscription::class)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->latest();
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function logo()
    {
        return $this->morphOne(Media::class, 'mediable')->where('collection', 'logo');
    }

    public function coverImage()
    {
        return $this->morphOne(Media::class, 'mediable')->where('collection', 'cover');
    }

    public function portfolioImages()
    {
        return $this->morphMany(Media::class, 'mediable')->where('collection', 'portfolio');
    }

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInCity($query, $city)
    {
        return $query->where('city', 'like', "%{$city}%");
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->verification_status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->verification_status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->verification_status === 'rejected';
    }

    public function hasActiveSubscription(): bool
    {
        return $this->currentSubscription()->exists();
    }
}
