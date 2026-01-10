<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PushSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'endpoint',
        'public_key',
        'auth_token',
        'content_encoding',
        'preferences',
        'device_type',
        'browser',
        'active',
    ];

    protected $casts = [
        'preferences' => 'array',
        'active' => 'boolean',
    ];

    /**
     * Get the user that owns the subscription
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Get subscriptions for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Update preferences
     */
    public function updatePreferences(array $preferences): bool
    {
        return $this->update(['preferences' => $preferences]);
    }

    /**
     * Deactivate subscription
     */
    public function deactivate(): bool
    {
        return $this->update(['active' => false]);
    }
}
