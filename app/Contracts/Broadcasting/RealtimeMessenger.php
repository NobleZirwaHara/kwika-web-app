<?php

namespace App\Contracts\Broadcasting;

use App\Models\Message;

interface RealtimeMessenger
{
    /**
     * Broadcast a new message to all participants in the conversation.
     *
     * @param Message $message
     * @return void
     */
    public function broadcastMessage(Message $message): void;

    /**
     * Broadcast typing indicator status.
     *
     * @param int $conversationId
     * @param int $userId
     * @param string $userName
     * @param bool $isTyping
     * @return void
     */
    public function broadcastTyping(int $conversationId, int $userId, string $userName, bool $isTyping): void;

    /**
     * Broadcast message read status.
     *
     * @param Message $message
     * @param string $readerType ('user' or 'provider')
     * @return void
     */
    public function broadcastRead(Message $message, string $readerType): void;

    /**
     * Broadcast user online/offline status.
     *
     * @param int $userId
     * @param bool $isOnline
     * @return void
     */
    public function broadcastPresence(int $userId, bool $isOnline): void;

    /**
     * Get channel name for a conversation.
     *
     * @param int $conversationId
     * @return string
     */
    public function getConversationChannel(int $conversationId): string;

    /**
     * Check if the driver is configured and ready.
     *
     * @return bool
     */
    public function isConfigured(): bool;
}
