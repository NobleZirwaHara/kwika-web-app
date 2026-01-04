import { Message } from '@/hooks/useMessages'
import { cn, formatTime } from '@/lib/utils'
import { FileAttachment } from './FileAttachment'
import { ActionButton } from './ActionButton'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
  showSender?: boolean
}

export function MessageBubble({ message, isOwnMessage, showSender = true }: MessageBubbleProps) {
  const isSystem = message.sender_type === 'system' || message.message_type === 'system_notification'
  const isBookingRequest = message.message_type === 'booking_request'
  const isAdmin = message.sender_type === 'admin'

  // System messages are centered
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-full text-sm max-w-md text-center">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('flex gap-2 mb-4', isOwnMessage ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'flex flex-col max-w-[70%]',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name */}
        {showSender && !isOwnMessage && (
          <div className="text-xs text-muted-foreground mb-1 px-1">
            {message.sender_name}
            {isAdmin && (
              <span className="ml-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                Admin
              </span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2 shadow-sm',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : isAdmin
              ? 'bg-accent text-accent-foreground rounded-bl-sm border-2 border-accent'
              : 'bg-muted text-foreground rounded-bl-sm'
          )}
        >
          {/* File attachment */}
          {message.message_type === 'file' && message.file_url && (
            <FileAttachment
              fileUrl={message.file_url}
              fileName={message.file_name || 'File'}
              fileType={message.file_type || ''}
              fileSize={message.file_size || 0}
            />
          )}

          {/* Booking request card */}
          {isBookingRequest && message.metadata && (
            <div className="space-y-2 mb-2">
              <div className="font-semibold text-sm">
                {message.metadata.service_name}
              </div>
              <div className="text-xs opacity-90 space-y-1">
                <div>Booking #{message.metadata.booking_number}</div>
                <div>Event Date: {message.metadata.event_date}</div>
              </div>
            </div>
          )}

          {/* Message content */}
          {message.formatted_content ? (
            <div
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: message.formatted_content }}
            />
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          )}

          {/* Action buttons */}
          {message.metadata?.buttons && message.metadata.buttons.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {message.metadata.buttons.map((button, index) => (
                <ActionButton
                  key={index}
                  label={button.label}
                  action={button.action}
                  url={button.url}
                />
              ))}
            </div>
          )}

          {/* Timestamp and read status */}
          <div
            className={cn(
              'text-xs mt-1 flex items-center gap-1',
              isOwnMessage ? 'justify-end opacity-70' : 'opacity-60'
            )}
          >
            <span>{formatTime(message.created_at)}</span>
            {isOwnMessage && (
              <span>
                {message.is_read ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" transform="translate(3, 0)" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
