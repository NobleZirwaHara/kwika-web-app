<?php

namespace App\Http\Controllers;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    protected MessageService $messageService;
    protected RealtimeMessenger $messenger;

    public function __construct(MessageService $messageService, RealtimeMessenger $messenger)
    {
        $this->messageService = $messageService;
        $this->messenger = $messenger;
    }

    /**
     * Get all conversations for the authenticated user.
     */
    public function getConversations(Request $request)
    {
        $user = Auth::user();
        $conversations = $this->messageService->getConversationsForUser($user);

        return response()->json([
            'conversations' => $conversations->map(function ($conversation) use ($user) {
                $isProvider = $conversation->provider && $user->id === $conversation->provider->user_id;

                return [
                    'id' => $conversation->id,
                    'user_id' => $conversation->user_id,
                    'provider_id' => $conversation->service_provider_id,
                    'provider_name' => $conversation->provider?->business_name ?? 'Admin Support',
                    'provider_logo' => $conversation->provider?->logo ?? null,
                    'user_name' => $conversation->user->name,
                    'user_avatar' => $conversation->user->avatar ?? null,
                    'service_name' => $conversation->booking?->service->name,
                    'booking_number' => $conversation->booking?->booking_number,
                    'last_message' => $conversation->lastMessage?->content,
                    'last_message_at' => $conversation->last_message_at,
                    'unread_count' => $conversation->getUnreadCountFor($user),
                    'created_at' => $conversation->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get or create a conversation.
     */
    public function getOrCreateConversation(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|exists:service_providers,id',
            'booking_id' => 'nullable|exists:bookings,id',
        ]);

        $user = Auth::user();
        $conversation = $this->messageService->getOrCreateConversation(
            $user->id,
            $request->provider_id,
            $request->booking_id
        );

        return response()->json([
            'conversation' => $conversation->load(['user', 'provider', 'booking']),
        ]);
    }

    /**
     * Get messages for a conversation.
     */
    public function getMessages(Request $request, int $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Authorize access
        $user = Auth::user();
        if (!$this->canAccessConversation($user, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $this->messageService->getMessages($conversation);

        return response()->json([
            'messages' => $messages->map(function ($message) use ($user, $conversation) {
                $isProvider = $conversation->provider && $user->id === $conversation->provider->user_id;

                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'sender_type' => $message->sender_type,
                    'message_type' => $message->message_type,
                    'content' => $message->content,
                    'formatted_content' => $message->formatted_content,
                    'metadata' => $message->metadata,
                    'file_url' => $message->file_url,
                    'file_name' => $message->file_name,
                    'file_type' => $message->file_type,
                    'file_size' => $message->file_size,
                    'is_read' => $isProvider ? $message->isReadByProvider() : $message->isReadByUser(),
                    'created_at' => $message->created_at,
                ];
            }),
            'pagination' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }

    /**
     * Send a message.
     */
    public function sendMessage(Request $request, int $conversationId)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'metadata' => 'nullable|array',
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Authorize access
        if (!$this->canAccessConversation($user, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Determine sender type
        $senderType = $this->getSenderType($user, $conversation);

        $message = $this->messageService->sendMessage(
            $conversation,
            $user,
            $request->content,
            $senderType,
            'text',
            $request->metadata
        );

        // Broadcast message via configured driver
        $this->messenger->broadcastMessage($message);

        return response()->json([
            'message' => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'sender_name' => $message->sender->name,
                'sender_type' => $message->sender_type,
                'content' => $message->content,
                'formatted_content' => $message->formatted_content,
                'metadata' => $message->metadata,
                'created_at' => $message->created_at,
            ],
        ], 201);
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, int $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Authorize access
        if (!$this->canAccessConversation($user, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->messageService->markAsRead($conversation, $user);

        // Broadcast read receipt - get the last message
        $lastMessage = $conversation->lastMessage;
        if ($lastMessage) {
            $userType = $this->getUserType($user, $conversation);
            $readerType = $userType === 'provider' ? 'provider' : 'user';
            $this->messenger->broadcastRead($lastMessage, $readerType);
        }

        return response()->json(['message' => 'Messages marked as read']);
    }

    /**
     * Upload a file attachment.
     */
    public function uploadFile(Request $request, int $conversationId)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,gif,pdf|max:5120', // 5MB max
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Authorize access
        if (!$this->canAccessConversation($user, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $fileData = $this->messageService->uploadFile($request->file('file'), $conversationId);

            // Determine sender type
            $senderType = $this->getSenderType($user, $conversation);

            // Create message with file
            $message = $this->messageService->sendMessage(
                $conversation,
                $user,
                $request->input('caption', 'Sent a file'),
                $senderType,
                'file',
                null,
                $fileData
            );

            // Broadcast message via configured driver
            $this->messenger->broadcastMessage($message);

            return response()->json([
                'message' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender->name,
                    'sender_type' => $message->sender_type,
                    'content' => $message->content,
                    'file_url' => $message->file_url,
                    'file_name' => $message->file_name,
                    'file_type' => $message->file_type,
                    'created_at' => $message->created_at,
                ],
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Broadcast typing indicator.
     */
    public function typing(Request $request, int $conversationId)
    {
        $request->validate([
            'is_typing' => 'required|boolean',
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Authorize access
        if (!$this->canAccessConversation($user, $conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Broadcast typing indicator via configured driver
        $this->messenger->broadcastTyping(
            $conversationId,
            $user->id,
            $user->name,
            $request->is_typing
        );

        return response()->json([
            'conversation_id' => $conversationId,
            'user_id' => $user->id,
            'is_typing' => $request->is_typing,
        ]);
    }

    /**
     * Check if user can access conversation.
     */
    private function canAccessConversation($user, Conversation $conversation): bool
    {
        // User is the customer in the conversation
        if ($user->id === $conversation->user_id) {
            return true;
        }

        // User is the provider in the conversation
        if ($conversation->provider && $user->id === $conversation->provider->user_id) {
            return true;
        }

        // User is an admin
        if ($user->is_admin) {
            return true;
        }

        return false;
    }

    /**
     * Get sender type for the user.
     */
    private function getSenderType($user, Conversation $conversation): string
    {
        return $this->getUserType($user, $conversation);
    }

    /**
     * Get user type in the conversation.
     */
    private function getUserType($user, Conversation $conversation): string
    {
        if ($user->is_admin) {
            return 'admin';
        }

        if ($user->id === $conversation->user_id) {
            return 'user';
        }

        if ($conversation->provider && $user->id === $conversation->provider->user_id) {
            return 'provider';
        }

        return 'user';
    }
}
