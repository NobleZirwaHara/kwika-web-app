<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChecklistTemplateItem extends Model
{
    protected $fillable = [
        'checklist_template_id',
        'title',
        'notes',
        'default_days_before_event',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'default_days_before_event' => 'integer',
            'display_order' => 'integer',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ChecklistTemplate::class, 'checklist_template_id');
    }
}
