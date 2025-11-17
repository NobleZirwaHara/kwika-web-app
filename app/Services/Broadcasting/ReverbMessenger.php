<?php

namespace App\Services\Broadcasting;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Models\Message;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

class ReverbMessenger implements RealtimeMessenger
{
    /**
     * Broadcast a new message to all participants in the conversation.
     */
    public function broadcastMessage(Message $message): void
    {
        if (!$this->isConfigured()) {
            Log::warning('Laravel Broadcasting not configured, skipping message broadcast');
            return;
        }

        try {
            $channel = $this->getConversationChannel($message->conversation_id);

            broadcast(new \App\Events\MessageSent(
                $message->id,
                $message->conversation_id,
                $message->sender_id,
                $message->sender->name,
                $message->sender_type,
                $message->message_type,
                $message->content,
                $message->formatted_content,
                $message->metadata,
                $message->file_url,
                $message->file_name,
                $message->file_type,
                $message->created_at
            ))->toOthers();
        } catch (\Exception $e) {
            Log::error('Exception broadcasting message via Reverb', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Broadcast typing indicator status.
     */
    public function broadcastTyping(int $conversationId, int $userId, string $userName, bool $isTyping): void
    {
        if (!$this->isConfigured()) {
            return;
        }

        try {
            broadcast(new \App\Events\UserTyping(
                $conversationId,
                $userId,
                $userName,
                $isTyping
            ))->toOthers();
        } catch (\Exception $e) {
            Log::error('Exception broadcasting typing indicator via Reverb', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Broadcast message read status.
     */
    public function broadcastRead(Message $message, string $readerType): void
    {
        if (!$this->isConfigured()) {
            return;
        }

        try {
            broadcast(new \App\Events\MessageRead(
                $message->id,
                $message->conversation_id,
                $readerType
            ))->toOthers();
        } catch (\Exception $e) {
            Log::error('Exception broadcasting read receipt via Reverb', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Broadcast user online/offline status.
     */
    public function broadcastPresence(int $userId, bool $isOnline): void
    {
        if (!$this->isConfigured()) {
            return;
        }

        try {
            broadcast(new \App\Events\UserPresence($userId, $isOnline))->toOthers();
        } catch (\Exception $e) {
            Log::error('Exception broadcasting presence via Reverb', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get channel name for a conversation.
     */
    public function getConversationChannel(int $conversationId): string
    {
        return "conversation.{$conversationId}";
    }

    /**
     * Check if the driver is configured and ready.
     */
    public function isConfigured(): bool
    {
        $driver = config('broadcasting.default');
        return in_array($driver, ['pusher', 'reverb', 'ably']);
    }
}
