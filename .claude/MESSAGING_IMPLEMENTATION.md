# Messaging Implementation Guide

## Overview

A complete hybrid messaging system has been implemented with Laravel + Supabase Realtime. The system supports:

- ✅ User-to-Provider messaging after booking requests
- ✅ Automatic booking request messages in provider inbox
- ✅ Provider-initiated messages to customers
- ✅ Admin messaging with user search
- ✅ Action buttons in admin messages
- ✅ Typing indicators
- ✅ Read receipts
- ✅ File attachments (images, PDFs)
- ✅ WhatsApp-style text formatting (*bold*, _italic_, ~strikethrough~)
- ✅ Realtime updates via Supabase
- ✅ Ability to switch to Laravel Broadcasting/Reverb

## Architecture

### Backend (Laravel)

**Database Schema:**
- `conversations` - Stores conversation records between users and providers
- `messages` - Individual messages with metadata, files, and formatting
- `conversation_participants` - Supports multi-user conversations (for admin messaging)

**Models:**
- `Conversation` - Main conversation model with helper methods
- `Message` - Message model with automatic WhatsApp-style formatting
- `ConversationParticipant` - Participant management

**Services:**
- `MessageService` - Business logic for all messaging operations
- `RealtimeMessenger` (Interface) - Broadcasting abstraction layer
  - `SupabaseMessenger` - Supabase realtime implementation
  - `ReverbMessenger` - Laravel Broadcasting/Reverb implementation
  - `NullMessenger` - Null driver for testing

**Controllers:**
- `MessageController` - User/Provider messaging API
- `Admin\MessageController` - Admin messaging with search

**API Routes:**
```
GET    /api/conversations              - Get all conversations
POST   /api/conversations              - Create or get conversation
GET    /api/conversations/{id}/messages - Get messages
POST   /api/conversations/{id}/messages - Send message
POST   /api/conversations/{id}/read    - Mark as read
POST   /api/conversations/{id}/upload  - Upload file
POST   /api/conversations/{id}/typing  - Send typing indicator
```

**Admin Routes:**
```
GET    /admin/messages                 - Admin messages interface
POST   /admin/messages/search-users    - Search users
POST   /admin/messages/start-conversation - Start conversation
POST   /admin/messages/send            - Send admin message with buttons
```

### Frontend (React + TypeScript)

**Hooks:**
- `useConversations.ts` - Fetch conversations with realtime updates
- `useMessages.ts` - Fetch/send messages with realtime subscription
- `useTypingIndicator.ts` - Handle typing indicators
- `useFileUpload.ts` - File upload with validation

**Components:**
- `MessageBubble.tsx` - Display individual messages
- `FileAttachment.tsx` - Display file attachments
- `ActionButton.tsx` - Clickable action buttons
- `TypingIndicator.tsx` - Typing animation
- `ConversationListItem.tsx` - Conversation in list
- `MessageInput.tsx` - Message composer with file upload

**Pages:**
- `User/Messages.tsx` - Customer messaging interface
- `Provider/Messages.tsx` - Provider messaging interface
- `Admin/Messages.tsx` - Admin messaging with search

**Supabase Client:**
- `lib/supabase.ts` - Supabase initialization and types

## Configuration

### Environment Variables

Add to `.env`:

```env
# Messaging Configuration
MESSAGING_DRIVER=supabase

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend (Vite will expose these)
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
```

### Switching Broadcasting Drivers

To switch from Supabase to Laravel Broadcasting/Reverb:

1. Update `.env`:
   ```env
   MESSAGING_DRIVER=reverb
   ```

2. Configure Laravel Broadcasting (if not already done):
   ```bash
   php artisan install:broadcasting
   ```

3. No code changes needed! The abstraction layer handles it.

## Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Copy your project URL and API keys

### 2. Create Realtime Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for typing_indicators table (if using)
CREATE TABLE IF NOT EXISTS typing_indicators (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE typing_indicators;
```

### 3. Configure Row Level Security (RLS)

```sql
-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read messages from their conversations
CREATE POLICY "Users can read their own messages"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE user_id = auth.uid()
    OR service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  )
);

-- Allow authenticated users to insert messages
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE user_id = auth.uid()
    OR service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  )
);
```

## Usage

### User Flow

1. User requests a booking
2. System automatically creates conversation and sends booking request message
3. Provider sees message in their inbox with booking details and "View Booking" button
4. Both parties can chat in realtime with typing indicators and read receipts
5. File attachments supported (images, PDFs up to 5MB)
6. WhatsApp-style formatting: `*bold*`, `_italic_`, `~strikethrough~`

### Provider Flow

1. Provider receives booking request as a message
2. Can reply to customer directly
3. Can initiate new conversations with existing customers
4. Sees realtime updates, typing indicators, read receipts

### Admin Flow

1. Navigate to Admin → Messages
2. Click "New Message" to search for users
3. Search by name, email, or phone
4. Start conversation with any user
5. Send messages with optional action buttons:
   - Click "Add Button" to create action buttons
   - Configure button label, type (navigate/external), and URL
   - Send message with up to 3 action buttons

### Text Formatting

Users can format messages using:
- `*bold text*` → **bold text**
- `_italic text_` → _italic text_
- `~strikethrough~` → ~~strikethrough~~
- URLs are automatically linked

### File Attachments

Supported file types:
- Images: JPEG, PNG, GIF
- Documents: PDF
- Max size: 5MB

## Testing

### Without Supabase (Development)

1. Set `MESSAGING_DRIVER=null` in `.env`
2. Messages will be stored in database but no realtime updates
3. Useful for testing without Supabase setup

### With Supabase (Production)

1. Configure Supabase as described above
2. Set `MESSAGING_DRIVER=supabase` in `.env`
3. Test realtime features:
   - Open two browser windows (user and provider)
   - Send message from one, see it appear in other
   - Test typing indicators
   - Test read receipts

## Database Migrations

Migrations are already created. If needed to run:

```bash
php artisan migrate
```

This creates:
- `conversations` table
- `messages` table
- `conversation_participants` table

## API Authentication

All messaging APIs require authentication via Laravel Sanctum:

```javascript
// Axios is pre-configured with CSRF token
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Make authenticated requests
const response = await axios.get('/api/conversations')
```

## Features

### ✅ Implemented

- [x] User-Provider messaging after booking
- [x] Automatic booking request messages
- [x] Provider-initiated messaging
- [x] Admin user search and messaging
- [x] Action buttons in admin messages
- [x] Typing indicators
- [x] Read receipts
- [x] File attachments (images, PDFs)
- [x] WhatsApp-style text formatting
- [x] Realtime updates via Supabase
- [x] Broadcasting abstraction (Supabase/Reverb/Null)
- [x] Message pagination
- [x] Unread count tracking
- [x] Auto-scroll to new messages

### 🚀 Future Enhancements

- [ ] Message search
- [ ] Message reactions (emoji)
- [ ] Voice messages
- [ ] Video attachments
- [ ] Message editing/deletion
- [ ] Conversation archiving
- [ ] Push notifications
- [ ] Email notifications for missed messages
- [ ] Conversation templates (for admin)
- [ ] Scheduled messages
- [ ] Message translation

## File Structure

```
app/
├── Contracts/Broadcasting/
│   └── RealtimeMessenger.php         # Broadcasting interface
├── Services/
│   ├── MessageService.php            # Business logic
│   └── Broadcasting/
│       ├── SupabaseMessenger.php     # Supabase implementation
│       ├── ReverbMessenger.php       # Reverb implementation
│       └── NullMessenger.php         # Null driver
├── Models/
│   ├── Conversation.php              # Conversation model
│   ├── Message.php                   # Message model
│   └── ConversationParticipant.php   # Participant model
├── Http/Controllers/
│   ├── MessageController.php         # User/Provider API
│   └── Admin/
│       └── MessageController.php     # Admin API
└── Providers/
    └── MessagingServiceProvider.php  # Service provider

resources/js/
├── lib/
│   └── supabase.ts                   # Supabase client
├── hooks/
│   ├── useConversations.ts           # Conversations hook
│   ├── useMessages.ts                # Messages hook
│   ├── useTypingIndicator.ts         # Typing hook
│   └── useFileUpload.ts              # File upload hook
├── Components/
│   ├── MessageBubble.tsx             # Message bubble
│   ├── FileAttachment.tsx            # File display
│   ├── ActionButton.tsx              # Action button
│   ├── TypingIndicator.tsx           # Typing animation
│   ├── ConversationListItem.tsx      # Conversation item
│   └── MessageInput.tsx              # Message input
└── Pages/
    ├── User/Messages.tsx             # User interface
    ├── Provider/Messages.tsx         # Provider interface
    └── Admin/Messages.tsx            # Admin interface

config/
└── messaging.php                     # Messaging config

database/migrations/
├── *_create_conversations_table.php
├── *_create_messages_table.php
└── *_create_conversation_participants_table.php
```

## Troubleshooting

### Messages not appearing in realtime

1. Check Supabase configuration in `.env`
2. Verify Supabase tables have realtime enabled
3. Check browser console for connection errors
4. Verify RLS policies are correct

### File upload failing

1. Check file size (max 5MB)
2. Verify file type (images: jpg/png/gif, docs: pdf)
3. Check storage permissions
4. Verify `storage/app/public` is linked: `php artisan storage:link`

### Typing indicators not working

1. Verify Supabase realtime is enabled for `typing_indicators` table
2. Check that typing events are being broadcast
3. Verify user authentication

### Read receipts not updating

1. Check that `markAsRead()` is called when viewing messages
2. Verify Supabase realtime is working for message updates
3. Check that user type (user/provider) is correctly determined

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in controllers and services
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console for frontend errors
5. Verify Supabase dashboard for realtime connection status

## Security Notes

- All API routes require authentication
- File uploads are validated for type and size
- Supabase RLS policies restrict access to authorized users
- Admin routes require admin middleware
- CSRF protection enabled for all POST requests
- File paths are sanitized before storage
- SQL injection prevented via Eloquent ORM

## Performance Considerations

- Messages are paginated (default 50 per page)
- Conversations list shows last message only
- File uploads are limited to 5MB
- Realtime subscriptions are automatically cleaned up on component unmount
- Typing indicators auto-expire after 3 seconds
- Database indexes on conversation_id, sender_id for fast queries

---

**Implementation Complete!** 🎉

The messaging system is fully functional and ready for use. Configure Supabase environment variables and start messaging!
