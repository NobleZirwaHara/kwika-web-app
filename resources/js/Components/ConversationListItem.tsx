import { Conversation } from '@/hooks/useConversations'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface ConversationListItemProps {
  conversation: Conversation
  isActive?: boolean
  onClick?: () => void
  showProviderInfo?: boolean
}

export function ConversationListItem({
  conversation,
  isActive = false,
  onClick,
  showProviderInfo = true,
}: ConversationListItemProps) {
  const displayName = showProviderInfo
    ? conversation.provider_name
    : conversation.user_name
  const displayAvatar = showProviderInfo
    ? conversation.provider_logo
    : conversation.user_avatar

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 hover:bg-accent/50 transition-colors border-b border-border',
        isActive && 'bg-primary text-primary-foreground'
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={displayAvatar || undefined} alt={displayName} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="font-semibold text-sm truncate">{displayName}</div>
            {conversation.last_message_at && (
              <span className={cn(
                "text-xs flex-shrink-0",
                isActive ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {formatDistanceToNow(new Date(conversation.last_message_at), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          {/* Service/Booking info */}
          {(conversation.service_name || conversation.booking_number) && (
            <div className={cn(
              "text-xs mb-1",
              isActive ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {conversation.service_name && (
                <span className="mr-2">{conversation.service_name}</span>
              )}
              {conversation.booking_number && (
                <span className="opacity-70">#{conversation.booking_number}</span>
              )}
            </div>
          )}

          {/* Last message */}
          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              "text-sm truncate flex-1",
              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {conversation.last_message || 'No messages yet'}
            </p>
            {conversation.unread_count > 0 && (
              <Badge
                variant="default"
                className="rounded-full px-2 py-0.5 text-xs flex-shrink-0"
              >
                {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
