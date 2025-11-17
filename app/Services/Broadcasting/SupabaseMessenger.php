<?php

namespace App\Services\Broadcasting;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Models\Message;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseMessenger implements RealtimeMessenger
{
    protected string $url;
    protected string $anonKey;
    protected string $serviceRoleKey;

    public function __construct()
    {
        $this->url = config('messaging.drivers.supabase.url', '');
        $this->anonKey = config('messaging.drivers.supabase.anon_key', '');
        $this->serviceRoleKey = config('messaging.drivers.supabase.service_role_key', '');
    }

    /**
     * Broadcast a new message to all participants in the conversation.
     */
    public function broadcastMessage(Message $message): void
    {
        if (!$this->isConfigured()) {
            Log::warning('Supabase not configured, skipping message broadcast');
            return;
        }

        try {
            $channel = $this->getConversationChannel($message->conversation_id);

            // Insert event into Supabase message_events table (triggers realtime notification)
            $response = Http::withHeaders([
                'apikey' => $this->serviceRoleKey,
                'Authorization' => "Bearer {$this->serviceRoleKey}",
                'Content-Type' => 'application/json',
                'Prefer' => 'return=minimal',
            ])->post("{$this->url}/rest/v1/message_events", [
                'event_type' => 'message',
                'conversation_id' => $message->conversation_id,
                'channel' => $channel,
                'payload' => [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'sender_type' => $message->sender_type,
                    'message_type' => $message->message_type,
                    'content' => $message->content,
                    'formatted_content' => $message->formatted_content,
                    'metadata' => $message->metadata,
                    'file_path' => $message->file_path,
                    'file_name' => $message->file_name,
                    'file_type' => $message->file_type,
                    'created_at' => $message->created_at->toISOString(),
                ],
                'created_at' => now()->toISOString(),
            ]);

            if (!$response->successful()) {
                Log::error('Failed to broadcast message to Supabase', [
                    'message_id' => $message->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception broadcasting message to Supabase', [
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
            $channel = $this->getConversationChannel($conversationId);

            // Insert event into Supabase message_events table for typing indicator
            Http::withHeaders([
                'apikey' => $this->serviceRoleKey,
                'Authorization' => "Bearer {$this->serviceRoleKey}",
                'Content-Type' => 'application/json',
                'Prefer' => 'return=minimal',
            ])->post("{$this->url}/rest/v1/message_events", [
                'event_type' => 'typing',
                'conversation_id' => $conversationId,
                'channel' => $channel,
                'payload' => [
                    'user_id' => $userId,
                    'user_name' => $userName,
                    'is_typing' => $isTyping,
                ],
                'created_at' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Exception broadcasting typing indicator', [
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
            $channel = $this->getConversationChannel($message->conversation_id);

            // Insert event into Supabase message_events table for read receipt
            Http::withHeaders([
                'apikey' => $this->serviceRoleKey,
                'Authorization' => "Bearer {$this->serviceRoleKey}",
                'Content-Type' => 'application/json',
                'Prefer' => 'return=minimal',
            ])->post("{$this->url}/rest/v1/message_events", [
                'event_type' => 'read',
                'conversation_id' => $message->conversation_id,
                'channel' => $channel,
                'payload' => [
                    'message_id' => $message->id,
                    'reader_type' => $readerType,
                    'read_at' => now()->toISOString(),
                ],
                'created_at' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Exception broadcasting read receipt', [
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
            // Insert event into Supabase message_events table for presence
            Http::withHeaders([
                'apikey' => $this->serviceRoleKey,
                'Authorization' => "Bearer {$this->serviceRoleKey}",
                'Content-Type' => 'application/json',
                'Prefer' => 'return=minimal',
            ])->post("{$this->url}/rest/v1/message_events", [
                'event_type' => 'presence',
                'conversation_id' => 0, // Global presence, not conversation-specific
                'channel' => 'presence',
                'payload' => [
                    'user_id' => $userId,
                    'is_online' => $isOnline,
                    'last_seen' => now()->toISOString(),
                ],
                'created_at' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Exception broadcasting presence', [
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
        return "conversation:{$conversationId}";
    }

    /**
     * Check if the driver is configured and ready.
     */
    public function isConfigured(): bool
    {
        return !empty($this->url) && !empty($this->serviceRoleKey);
    }
}
