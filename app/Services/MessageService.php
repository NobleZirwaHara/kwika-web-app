<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageService
{
    /**
     * Get or create a conversation between user and provider.
     */
    public function getOrCreateConversation(int $userId, int $providerId, ?int $bookingId = null): Conversation
    {
        return Conversation::firstOrCreate(
            [
                'user_id' => $userId,
                'service_provider_id' => $providerId,
                'booking_id' => $bookingId,
            ],
            [
                'user_unread_count' => 0,
                'provider_unread_count' => 0,
            ]
        );
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(
        Conversation $conversation,
        User $sender,
        string $content,
        string $senderType = 'user',
        string $messageType = 'text',
        ?array $metadata = null,
        ?array $fileData = null
    ): Message {
        return DB::transaction(function () use ($conversation, $sender, $content, $senderType, $messageType, $metadata, $fileData) {
            // Create the message
            $message = $conversation->messages()->create([
                'sender_id' => $sender->id,
                'sender_type' => $senderType,
                'message_type' => $messageType,
                'content' => $content,
                'metadata' => $metadata,
                'file_path' => $fileData['path'] ?? null,
                'file_name' => $fileData['name'] ?? null,
                'file_type' => $fileData['type'] ?? null,
                'file_size' => $fileData['size'] ?? null,
            ]);

            // Update conversation
            $conversation->updateLastMessage($message);

            // Increment unread count for the recipient
            $this->incrementUnreadCount($conversation, $senderType);

            return $message;
        });
    }

    /**
     * Send a system notification message.
     */
    public function sendSystemMessage(
        Conversation $conversation,
        string $content,
        ?array $metadata = null
    ): Message {
        $systemUser = User::where('is_admin', true)->first();

        if (!$systemUser) {
            // Create a system user if none exists
            $systemUser = User::create([
                'name' => 'System',
                'email' => 'system@kwikaevents.com',
                'password' => bcrypt(str()->random(32)),
                'is_admin' => true,
                'role' => 'customer',
            ]);
        }

        return $this->sendMessage(
            $conversation,
            $systemUser,
            $content,
            'system',
            'system_notification',
            $metadata
        );
    }

    /**
     * Send a booking request message.
     */
    public function sendBookingRequestMessage(Booking $booking): Message
    {
        $conversation = $this->getOrCreateConversation(
            $booking->user_id,
            $booking->service_provider_id,
            $booking->id
        );

        $content = "New booking request for {$booking->service->name}";

        $metadata = [
            'booking_id' => $booking->id,
            'booking_number' => $booking->booking_number,
            'service_name' => $booking->service->name,
            'event_date' => $booking->event_date->format('F d, Y'),
            'buttons' => [
                [
                    'label' => 'View Booking',
                    'action' => 'navigate',
                    'url' => '/provider/bookings/' . $booking->id,
                ],
            ],
        ];

        return $this->sendMessage(
            $conversation,
            $booking->user,
            $content,
            'user',
            'booking_request',
            $metadata
        );
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Conversation $conversation, User $user): void
    {
        $userType = $this->getUserType($user, $conversation);

        if (!$userType) {
            return;
        }

        DB::transaction(function () use ($conversation, $userType) {
            // Mark all unread messages as read
            $unreadMessages = $conversation->messages()
                ->when($userType === 'user', function ($query) {
                    $query->whereNull('read_by_user_at');
                })
                ->when($userType === 'provider', function ($query) {
                    $query->whereNull('read_by_provider_at');
                })
                ->get();

            foreach ($unreadMessages as $message) {
                if ($userType === 'user') {
                    $message->markAsReadByUser();
                } else {
                    $message->markAsReadByProvider();
                }
            }

            // Reset unread count
            $conversation->resetUnreadCount($userType);
        });
    }

    /**
     * Upload a file attachment.
     */
    public function uploadFile($file, int $conversationId): array
    {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

        if (!in_array($file->getMimeType(), $allowedTypes)) {
            throw new \InvalidArgumentException('Invalid file type. Only images and PDFs are allowed.');
        }

        if ($file->getSize() > 5 * 1024 * 1024) { // 5MB limit
            throw new \InvalidArgumentException('File size exceeds 5MB limit.');
        }

        $path = $file->store('message-attachments/' . $conversationId, 'public');

        return [
            'path' => $path,
            'name' => $file->getClientOriginalName(),
            'type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ];
    }

    /**
     * Get conversations for a user.
     */
    public function getConversationsForUser(User $user)
    {
        $query = Conversation::with(['user', 'provider', 'booking', 'lastMessage', 'messages' => function ($query) {
            $query->latest()->limit(50);
        }]);

        // Admins see all conversations
        if ($user->is_admin) {
            return $query->orderBy('last_message_at', 'desc')->get();
        }

        // Regular users and providers see their own conversations
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhereHas('provider', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                });
        })
            ->orderBy('last_message_at', 'desc')
            ->get();
    }

    /**
     * Get messages for a conversation.
     */
    public function getMessages(Conversation $conversation, int $perPage = 50)
    {
        return $conversation->messages()
            ->with('sender')
            ->oldest()
            ->paginate($perPage);
    }

    /**
     * Increment unread count for the recipient.
     */
    private function incrementUnreadCount(Conversation $conversation, string $senderType): void
    {
        // If sender is user, increment provider's unread count
        if ($senderType === 'user') {
            $conversation->incrementUnreadCount('provider');
        } else {
            // If sender is provider or admin or system, increment user's unread count
            $conversation->incrementUnreadCount('user');
        }
    }

    /**
     * Determine the user type in the conversation.
     */
    private function getUserType(User $user, Conversation $conversation): ?string
    {
        if ($user->id === $conversation->user_id) {
            return 'user';
        }

        if ($conversation->provider && $user->id === $conversation->provider->user_id) {
            return 'provider';
        }

        return null;
    }

    /**
     * Search users for admin messaging.
     */
    public function searchUsers(string $query, int $limit = 20)
    {
        return User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->orWhere('phone', 'like', "%{$query}%");
        })
            ->with('provider')
            ->limit($limit)
            ->get();
    }

    /**
     * Start a conversation for admin.
     */
    public function startAdminConversation(User $admin, int $userId): Conversation
    {
        $targetUser = User::with('provider')->findOrFail($userId);

        // If target user is a provider, create conversation with their provider profile
        if ($targetUser->provider) {
            return $this->getOrCreateConversation($targetUser->id, $targetUser->provider->id);
        }

        // If target user is a regular customer, create admin-to-customer conversation
        // For admin-customer conversations, service_provider_id is null
        $conversation = Conversation::firstOrCreate(
            [
                'user_id' => $targetUser->id,
                'service_provider_id' => null,
                'booking_id' => null,
            ]
        );

        return $conversation;
    }
}
