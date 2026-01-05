<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingChecklist extends Model
{
    protected $fillable = [
        'booking_id',
        'checklist_template_id',
        'name',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ChecklistTemplate::class, 'checklist_template_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingChecklistItem::class)->orderBy('display_order');
    }

    public function getProgress(): array
    {
        $total = $this->items()->count();
        $completed = $this->items()->where('is_completed', true)->count();

        return [
            'total' => $total,
            'completed' => $completed,
            'percentage' => $total > 0 ? round(($completed / $total) * 100) : 0,
        ];
    }

    public function getOverdueCount(): int
    {
        return $this->items()
            ->where('is_completed', false)
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->startOfDay())
            ->count();
    }

    public function isComplete(): bool
    {
        return $this->items()->where('is_completed', false)->count() === 0
            && $this->items()->count() > 0;
    }
}
