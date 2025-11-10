<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Catalogue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'type',
        'name',
        'slug',
        'description',
        'cover_image',
        'display_order',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
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

    public function scopeService($query)
    {
        return $query->where('type', 'service');
    }

    public function scopeProduct($query)
    {
        return $query->where('type', 'product');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Accessors & Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value) . '-' . Str::random(6);
    }
}
