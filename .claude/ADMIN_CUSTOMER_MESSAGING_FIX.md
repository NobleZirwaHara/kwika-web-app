# Admin-to-Customer Messaging Fix

## Problem
When admins searched for and selected a regular customer (non-provider) in the Messages interface, the popup closed but no conversation was created. The error was: "Direct admin-to-customer conversations not yet implemented".

## Root Cause
The conversations table required both `user_id` and `service_provider_id`, but regular customers don't have a provider profile, so there was no provider_id to use.

## Solution

### 1. Database Migration Update
**File**: `database/migrations/2025_11_16_110804_create_conversations_table.php`

Made `service_provider_id` nullable:
```php
$table->foreignId('service_provider_id')->nullable()->constrained()->onDelete('cascade');
```

### 2. MessageService Update
**File**: `app/Services/MessageService.php`

Updated `startAdminConversation()` to create conversations for regular customers:
```php
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
```

Updated `getConversationsForUser()` to show all conversations to admins:
```php
public function getConversationsForUser(User $user)
{
    $query = Conversation::with([...]);

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
```

### 3. Admin Controller Update
**File**: `app/Http/Controllers/Admin/MessageController.php`

Updated to handle null providers gracefully:
```php
'provider_name' => $conversation->provider?->business_name ?? 'Admin Support',
'provider_logo' => $conversation->provider?->logo ?? null,
```

## How It Works Now

### For Providers:
When admin selects a provider user:
- Conversation created with both `user_id` and `service_provider_id`
- Works exactly as before

### For Regular Customers:
When admin selects a regular customer:
- Conversation created with `user_id` and `service_provider_id = null`
- Shows as "Admin Support" in the conversation list
- Fully functional messaging between admin and customer

## Testing

1. **Admin → Provider**: Search and select a provider user → Conversation created ✅
2. **Admin → Customer**: Search and select a regular customer → Conversation created ✅
3. **Admin View**: Admins see ALL conversations in the system ✅
4. **Customer View**: Customers see only their own conversations ✅
5. **Provider View**: Providers see only their own conversations ✅

## Migration

To apply the changes:
```bash
php artisan migrate:fresh
```

Note: This will drop all existing data. In production, create a new migration to alter the existing table:
```php
Schema::table('conversations', function (Blueprint $table) {
    $table->foreignId('service_provider_id')->nullable()->change();
});
```

## Files Modified

1. `database/migrations/2025_11_16_110804_create_conversations_table.php`
2. `app/Services/MessageService.php`
3. `app/Http/Controllers/Admin/MessageController.php`

## No Breaking Changes

- Existing user-to-provider conversations continue to work
- Provider conversations still have both user_id and provider_id
- Only admin-to-customer conversations use null provider_id
- All existing code that checks `$conversation->provider` already uses null-safe operators
