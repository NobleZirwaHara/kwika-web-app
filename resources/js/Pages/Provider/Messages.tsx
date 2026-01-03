import { useState, useEffect } from 'react'
import ProviderLayout from '@/components/ProviderLayout'
import { Head, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Send, MoreVertical } from 'lucide-react'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { ConversationListItem } from '@/components/ConversationListItem'
import { MessageBubble } from '@/components/MessageBubble'
import { MessageInput } from '@/components/MessageInput'
import { TypingIndicator } from '@/components/TypingIndicator'

export default function Messages({ provider }: { provider: any }) {
  const { props } = usePage()
  const user = props.auth?.user as any

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { conversations, loading: conversationsLoading, refetch: refetchConversations } = useConversations()
  const {
    messages,
    loading: messagesLoading,
    sending,
    messagesEndRef,
    sendMessage,
    markAsRead,
    fetchMessages,
  } = useMessages(selectedConversationId)

  const { typingText, handleTyping } = useTypingIndicator(
    selectedConversationId,
    user?.id || null
  )

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  const filteredConversations = conversations.filter((conv) =>
    conv.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [conversations, selectedConversationId])

  // Mark as read when viewing conversation
  useEffect(() => {
    if (selectedConversationId && messages.length > 0) {
      markAsRead()
    }
  }, [selectedConversationId, messages.length])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, messagesEndRef])

  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
    // Refetch messages to show new messages instantly
    await fetchMessages()
    // Refetch conversations to update the preview
    await refetchConversations()
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <ProviderLayout title="Messages" provider={provider}>
      <Head title="Messages" />

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="w-full lg:w-96 border rounded-xl bg-card overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-muted-foreground">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">
                  When customers message you, they'll appear here
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={selectedConversationId === conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  showProviderInfo={false}
                />
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 border rounded-xl bg-card overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.user_avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedConversation.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.user_name}</h3>
                    {selectedConversation.service_name && (
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.service_name}
                        {selectedConversation.booking_number &&
                          ` • #${selectedConversation.booking_number}`}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading messages...</p>
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.sender_id === user?.id}
                        showSender={false}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}

                {/* Typing Indicator */}
                <TypingIndicator typingText={typingText} />
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 border-t border-border">
                <MessageInput
                  conversationId={selectedConversationId}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  disabled={sending}
                  placeholder="Type a message..."
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Send className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  )
}
