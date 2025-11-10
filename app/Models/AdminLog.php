<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminLog extends Model
{
    protected $fillable = [
        'admin_id',
        'action',
        'resource_type',
        'resource_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'notes',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the admin user who performed the action
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the resource that was acted upon
     */
    public function resource()
    {
        if (!$this->resource_type || !$this->resource_id) {
            return null;
        }

        try {
            return $this->resource_type::find($this->resource_id);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Log an admin action
     */
    public static function logAction(
        int $adminId,
        string $action,
        string $resourceType,
        int $resourceId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $notes = null
    ): self {
        return self::create([
            'admin_id' => $adminId,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'notes' => $notes,
        ]);
    }

    /**
     * Scope to filter by admin
     */
    public function scopeByAdmin($query, int $adminId)
    {
        return $query->where('admin_id', $adminId);
    }

    /**
     * Scope to filter by action
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to filter by resource type
     */
    public function scopeByResourceType($query, string $resourceType)
    {
        return $query->where('resource_type', $resourceType);
    }

    /**
     * Scope to get recent logs
     */
    public function scopeRecent($query, int $limit = 50)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }
}
