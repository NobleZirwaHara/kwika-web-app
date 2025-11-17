<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'sender_type',
        'message_type',
        'content',
        'formatted_content',
        'metadata',
        'read_by_user_at',
        'read_by_provider_at',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'parent_message_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
        'read_by_user_at' => 'datetime',
        'read_by_provider_at' => 'datetime',
        'file_size' => 'integer',
    ];

    /**
     * Get the conversation that owns the message.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the parent message (if this is a reply).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'parent_message_id');
    }

    /**
     * Get the replies to this message.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'parent_message_id');
    }

    /**
     * Check if the message has been read by the user.
     */
    public function isReadByUser(): bool
    {
        return $this->read_by_user_at !== null;
    }

    /**
     * Check if the message has been read by the provider.
     */
    public function isReadByProvider(): bool
    {
        return $this->read_by_provider_at !== null;
    }

    /**
     * Mark the message as read by the user.
     */
    public function markAsReadByUser(): void
    {
        if (!$this->isReadByUser()) {
            $this->update(['read_by_user_at' => now()]);
        }
    }

    /**
     * Mark the message as read by the provider.
     */
    public function markAsReadByProvider(): void
    {
        if (!$this->isReadByProvider()) {
            $this->update(['read_by_provider_at' => now()]);
        }
    }

    /**
     * Check if the message has a file attachment.
     */
    public function hasAttachment(): bool
    {
        return $this->file_path !== null;
    }

    /**
     * Get the full file URL.
     */
    public function getFileUrlAttribute(): ?string
    {
        if ($this->file_path) {
            return asset('storage/' . $this->file_path);
        }

        return null;
    }

    /**
     * Check if this is a system message.
     */
    public function isSystemMessage(): bool
    {
        return $this->sender_type === 'system';
    }

    /**
     * Check if this message has action buttons.
     */
    public function hasActionButtons(): bool
    {
        return isset($this->metadata['buttons']) && is_array($this->metadata['buttons']);
    }

    /**
     * Get the action buttons from metadata.
     */
    public function getActionButtons(): array
    {
        return $this->metadata['buttons'] ?? [];
    }

    /**
     * Format the content with WhatsApp-style formatting.
     */
    public function getFormattedContentAttribute($value): string
    {
        if ($value) {
            return $value;
        }

        // Apply WhatsApp-style formatting
        $content = $this->content;

        // *bold*
        $content = preg_replace('/\*([^\*]+)\*/', '<strong>$1</strong>', $content);

        // _italic_
        $content = preg_replace('/_([^_]+)_/', '<em>$1</em>', $content);

        // ~strikethrough~
        $content = preg_replace('/~([^~]+)~/', '<del>$1</del>', $content);

        // Auto-link URLs
        $content = preg_replace(
            '/(https?:\/\/[^\s]+)/',
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>',
            $content
        );

        return $content;
    }
}
