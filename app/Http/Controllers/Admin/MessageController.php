<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Broadcasting\RealtimeMessenger;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
     * Show the admin messages interface.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $conversations = $this->messageService->getConversationsForUser($user);

        return Inertia::render('Admin/Messages', [
            'conversations' => $conversations->map(function ($conversation) use ($user) {
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
                    'messages' => $conversation->messages->map(function ($message) use ($user, $conversation) {
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
                            'is_read' => $isProvider ? $message->isReadByProvider() : $message->isReadByUser(),
                            'created_at' => $message->created_at,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Search for users to message.
     */
    public function searchUsers(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $users = $this->messageService->searchUsers($request->input('query'));

        return response()->json([
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'avatar' => $user->avatar ?? null,
                    'is_provider' => $user->provider !== null,
                    'provider_name' => $user->provider?->business_name,
                    'provider_id' => $user->provider?->id,
                ];
            }),
        ]);
    }

    /**
     * Start a conversation with a user (admin only).
     */
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        try {
            $admin = auth()->user();
            $conversation = $this->messageService->startAdminConversation($admin, $request->user_id);

            return response()->json([
                'conversation' => $conversation->load(['user', 'provider', 'booking']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Send an admin message with optional action buttons.
     */
    public function sendAdminMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required|string|max:5000',
            'buttons' => 'nullable|array',
            'buttons.*.label' => 'required|string|max:50',
            'buttons.*.action' => 'required|in:navigate,external',
            'buttons.*.url' => 'required|string|max:500',
        ]);

        $conversation = \App\Models\Conversation::findOrFail($request->conversation_id);
        $admin = auth()->user();

        $metadata = [];
        if ($request->has('buttons') && count($request->buttons) > 0) {
            $metadata['buttons'] = $request->buttons;
        }

        $message = $this->messageService->sendMessage(
            $conversation,
            $admin,
            $request->content,
            'admin',
            'text',
            $metadata
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
}
