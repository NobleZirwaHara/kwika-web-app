import { useState, useEffect } from 'react'
import CustomerLayout from '@/components/CustomerLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Package } from 'lucide-react'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { ConversationListItem } from '@/components/ConversationListItem'
import { MessageBubble } from '@/components/MessageBubble'
import { MessageInput } from '@/components/MessageInput'
import { TypingIndicator } from '@/components/TypingIndicator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePage } from '@inertiajs/react'

export default function Messages() {
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

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!name) return 'P'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <CustomerLayout title="Messages">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground mt-1">
            Chat with service providers about your bookings
          </p>
        </div>

        {/* Messages Interface */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-280px)] min-h-[500px]">
            {/* Conversations List */}
            <div className="border-r border-border flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Loading conversations...</p>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <ConversationListItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={selectedConversationId === conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      showProviderInfo={true}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Thread */}
            {selectedConversation ? (
              <div className="flex flex-col overflow-hidden">
                {/* Thread Header */}
                <div className="p-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedConversation.provider_logo || undefined}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(selectedConversation.provider_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedConversation.provider_name}
                      </p>
                      {selectedConversation.service_name && (
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.service_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking Info */}
                  {selectedConversation.booking_number && (
                    <div className="mt-3 p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Booking #{selectedConversation.booking_number}
                        </span>
                      </div>
                    </div>
                  )}
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
                          showSender={true}
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
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No Conversation Selected</p>
                  <p className="text-sm">
                    Select a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </CustomerLayout>
  )
}
