<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'is_verified',
        'national_id',
        'is_admin',
        'admin_role',
        'admin_permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'is_verified' => 'boolean',
            'is_admin' => 'boolean',
            'admin_permissions' => 'array',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function serviceProvider()
    {
        return $this->hasOne(ServiceProvider::class);
    }

    // Alias for convenience
    public function provider()
    {
        return $this->serviceProvider();
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @deprecated Use userWishlists() instead - keeping for backward compatibility during migration
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * @deprecated Use userWishlists() instead - keeping for backward compatibility during migration
     */
    public function wishlistedServices()
    {
        return $this->belongsToMany(Service::class, 'wishlists')->withTimestamps();
    }

    /**
     * Get all user's wishlists (new system)
     */
    public function userWishlists()
    {
        return $this->hasMany(UserWishlist::class);
    }

    /**
     * Get user's default wishlist (new system)
     */
    public function defaultWishlist()
    {
        return $this->hasOne(UserWishlist::class)->where('is_default', true);
    }

    public function adminLogs()
    {
        return $this->hasMany(AdminLog::class, 'admin_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function conversationParticipations()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    // Helper methods
    public function isProvider(): bool
    {
        return $this->role === 'provider';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

    public function hasVerifiedPhone(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    // Admin helper methods
    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    public function isSuperAdmin(): bool
    {
        return $this->is_admin && $this->admin_role === 'super_admin';
    }

    public function isModerator(): bool
    {
        return $this->is_admin && $this->admin_role === 'moderator';
    }

    public function canAdmin(string $permission = null): bool
    {
        if (!$this->is_admin) {
            return false;
        }

        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($permission === null) {
            return true;
        }

        $permissions = $this->admin_permissions ?? [];
        return in_array($permission, $permissions);
    }

    /**
     * Log an admin action performed by this user
     */
    public function logAdminAction(
        string $action,
        string $resourceType,
        int $resourceId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $notes = null
    ): ?AdminLog {
        if (!$this->is_admin) {
            return null;
        }

        return AdminLog::logAction(
            $this->id,
            $action,
            $resourceType,
            $resourceId,
            $oldValues,
            $newValues,
            $notes
        );
    }
}
