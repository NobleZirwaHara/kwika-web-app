<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_provider_id', 'service_id', 'date', 'start_time', 'end_time',
        'is_available', 'availability_type', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_available' => 'boolean',
        ];
    }

    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
            ->where('availability_type', 'available');
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }
}
