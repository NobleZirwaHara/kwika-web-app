<?php

namespace App\Services\Broadcasting;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Models\Message;

class NullMessenger implements RealtimeMessenger
{
    /**
     * Broadcast a new message to all participants in the conversation.
     */
    public function broadcastMessage(Message $message): void
    {
        // Do nothing - null driver
    }

    /**
     * Broadcast typing indicator status.
     */
    public function broadcastTyping(int $conversationId, int $userId, string $userName, bool $isTyping): void
    {
        // Do nothing - null driver
    }

    /**
     * Broadcast message read status.
     */
    public function broadcastRead(Message $message, string $readerType): void
    {
        // Do nothing - null driver
    }

    /**
     * Broadcast user online/offline status.
     */
    public function broadcastPresence(int $userId, bool $isOnline): void
    {
        // Do nothing - null driver
    }

    /**
     * Get channel name for a conversation.
     */
    public function getConversationChannel(int $conversationId): string
    {
        return "conversation:{$conversationId}";
    }

    /**
     * Check if the driver is configured and ready.
     */
    public function isConfigured(): bool
    {
        return false;
    }
}
