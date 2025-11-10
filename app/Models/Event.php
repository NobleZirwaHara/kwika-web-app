<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_provider_id',
        'title',
        'slug',
        'description',
        'type',
        'category',
        'venue_name',
        'venue_address',
        'venue_city',
        'venue_country',
        'venue_latitude',
        'venue_longitude',
        'venue_map_url',
        'is_online',
        'online_meeting_url',
        'start_datetime',
        'end_datetime',
        'timezone',
        'registration_start',
        'registration_end',
        'max_attendees',
        'registered_count',
        'checked_in_count',
        'status',
        'is_featured',
        'requires_approval',
        'cover_image',
        'gallery_images',
        'terms_conditions',
        'agenda',
        'speakers',
        'sponsors',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'start_datetime' => 'datetime',
            'end_datetime' => 'datetime',
            'registration_start' => 'datetime',
            'registration_end' => 'datetime',
            'gallery_images' => 'array',
            'speakers' => 'array',
            'sponsors' => 'array',
            'tags' => 'array',
            'is_online' => 'boolean',
            'is_featured' => 'boolean',
            'requires_approval' => 'boolean',
        ];
    }

    // Relationships
    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function ticketPackages()
    {
        return $this->hasMany(TicketPackage::class)->orderBy('display_order');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_datetime', '>', now())
            ->where('status', 'published');
    }

    public function scopeOngoing($query)
    {
        return $query->where('start_datetime', '<=', now())
            ->where('end_datetime', '>=', now())
            ->where('status', 'published');
    }

    public function scopePast($query)
    {
        return $query->where('end_datetime', '<', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Accessors
    public function getIsUpcomingAttribute(): bool
    {
        return $this->start_datetime > Carbon::now();
    }

    public function getIsOngoingAttribute(): bool
    {
        $now = Carbon::now();
        return $this->start_datetime <= $now && $this->end_datetime >= $now;
    }

    public function getIsPastAttribute(): bool
    {
        return $this->end_datetime < Carbon::now();
    }

    public function getIsFullAttribute(): bool
    {
        if (!$this->max_attendees) {
            return false; // Unlimited capacity
        }

        return $this->registered_count >= $this->max_attendees;
    }

    public function getRegistrationOpenAttribute(): bool
    {
        if ($this->status !== 'published') {
            return false;
        }

        $now = Carbon::now();

        if ($this->registration_start && $this->registration_start > $now) {
            return false;
        }

        if ($this->registration_end && $this->registration_end < $now) {
            return false;
        }

        return !$this->is_full;
    }

    public function getDurationHoursAttribute(): float
    {
        return $this->start_datetime->diffInHours($this->end_datetime);
    }

    public function getCapacityPercentageAttribute(): ?float
    {
        if (!$this->max_attendees) {
            return null;
        }

        return ($this->registered_count / $this->max_attendees) * 100;
    }

    public function getSpotsRemainingAttribute(): ?int
    {
        if (!$this->max_attendees) {
            return null;
        }

        return max(0, $this->max_attendees - $this->registered_count);
    }

    // Mutators
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        if (!isset($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value) . '-' . Str::random(6);
        }
    }

    // Methods
    public function incrementRegistrations(int $count = 1): void
    {
        $this->increment('registered_count', $count);
    }

    public function incrementCheckIns(int $count = 1): void
    {
        $this->increment('checked_in_count', $count);
    }
}
