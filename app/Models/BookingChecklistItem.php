<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingChecklistItem extends Model
{
    protected $fillable = [
        'booking_checklist_id',
        'title',
        'notes',
        'due_date',
        'is_completed',
        'completed_at',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
            'display_order' => 'integer',
        ];
    }

    public function checklist(): BelongsTo
    {
        return $this->belongsTo(BookingChecklist::class, 'booking_checklist_id');
    }

    public function markComplete(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function markIncomplete(): void
    {
        $this->update([
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }

    public function isOverdue(): bool
    {
        return ! $this->is_completed
            && $this->due_date
            && $this->due_date->isPast();
    }

    public function isDueToday(): bool
    {
        return ! $this->is_completed
            && $this->due_date
            && $this->due_date->isToday();
    }
}
