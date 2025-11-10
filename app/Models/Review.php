<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'service_provider_id', 'booking_id', 'rating', 'comment',
        'images', 'is_verified', 'is_featured', 'is_approved',
        'admin_response', 'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'is_approved' => 'boolean',
            'responded_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}
