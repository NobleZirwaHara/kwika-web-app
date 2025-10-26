<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'mediable_type', 'mediable_id', 'file_name', 'file_path', 'disk',
        'mime_type', 'file_size', 'collection', 'alt_text', 'caption', 'sort_order',
    ];

    public function mediable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
