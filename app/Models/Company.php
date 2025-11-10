<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_provider_id',
        'name',
        'slug',
        'description',
        'business_registration_number',
        'tax_id',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
        'social_links',
        'logo',
        'cover_image',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function catalogues()
    {
        return $this->hasMany(Catalogue::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors & Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value) . '-' . Str::random(6);
    }
}
