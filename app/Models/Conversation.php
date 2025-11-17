<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'service_provider_id',
        'booking_id',
        'last_message_id',
        'last_message_at',
        'user_unread_count',
        'provider_unread_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_message_at' => 'datetime',
        'user_unread_count' => 'integer',
        'provider_unread_count' => 'integer',
    ];

    /**
     * Get the user that owns the conversation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service provider in the conversation.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProvider::class, 'service_provider_id');
    }

    /**
     * Get the booking associated with the conversation.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the last message in the conversation.
     */
    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    /**
     * Get all messages in the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get all participants in the conversation.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    /**
     * Increment unread count for a specific participant type.
     */
    public function incrementUnreadCount(string $participantType): void
    {
        if ($participantType === 'user') {
            $this->increment('user_unread_count');
        } elseif ($participantType === 'provider') {
            $this->increment('provider_unread_count');
        }
    }

    /**
     * Reset unread count for a specific participant type.
     */
    public function resetUnreadCount(string $participantType): void
    {
        if ($participantType === 'user') {
            $this->update(['user_unread_count' => 0]);
        } elseif ($participantType === 'provider') {
            $this->update(['provider_unread_count' => 0]);
        }
    }

    /**
     * Update the last message details.
     */
    public function updateLastMessage(Message $message): void
    {
        $this->update([
            'last_message_id' => $message->id,
            'last_message_at' => $message->created_at,
        ]);
    }

    /**
     * Get unread count for a specific participant.
     */
    public function getUnreadCountFor(User $user): int
    {
        // If user is the customer
        if ($user->id === $this->user_id) {
            return $this->user_unread_count;
        }

        // If user is the provider (check through provider relationship)
        if ($this->provider && $user->id === $this->provider->user_id) {
            return $this->provider_unread_count;
        }

        return 0;
    }
}
