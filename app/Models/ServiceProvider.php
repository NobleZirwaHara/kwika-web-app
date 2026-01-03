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

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function packages()
    {
        return $this->hasMany(ServicePackage::class);
    }

    public function activePackages()
    {
        return $this->hasMany(ServicePackage::class)->where('is_active', true);
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

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
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

    public function categories()
    {
        return $this->belongsToMany(ServiceCategory::class, 'category_service_provider');
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('service_providers.verification_status', 'approved');
    }

    public function scopeFeatured($query)
    {
        return $query->where('service_providers.is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('service_providers.is_active', true);
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
