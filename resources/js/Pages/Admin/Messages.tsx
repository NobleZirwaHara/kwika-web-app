import { useState, useEffect } from 'react'
import { usePage, router } from '@inertiajs/react'
import axios from 'axios'
import AdminLayout from '@/components/AdminLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Send, Plus, X, UserPlus } from 'lucide-react'
import { useMessages } from '@/hooks/useMessages'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { ConversationListItem } from '@/components/ConversationListItem'
import { MessageBubble } from '@/components/MessageBubble'
import { MessageInput } from '@/components/MessageInput'
import { TypingIndicator } from '@/components/TypingIndicator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface SearchedUser {
  id: number
  name: string
  email: string
  phone: string
  role: string
  avatar: string | null
  is_provider: boolean
  provider_name: string | null
  provider_id: number | null
}

interface ActionButtonInput {
  label: string
  action: 'navigate' | 'external'
  url: string
}

interface Props {
  conversations: any[]
}

export default function Messages({ conversations: initialConversations }: Props) {
  const { props } = usePage()
  const user = props.auth?.user as any

  const [conversations, setConversations] = useState(initialConversations || [])
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([])
  const [searchingUsers, setSearchingUsers] = useState(false)
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)

  // Admin message state
  const [adminMessageContent, setAdminMessageContent] = useState('')
  const [actionButtons, setActionButtons] = useState<ActionButtonInput[]>([])

  // Update conversations when props change (after Inertia reload)
  useEffect(() => {
    setConversations(initialConversations || [])
  }, [initialConversations])
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
      conv.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.provider_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Search users
  const handleUserSearch = async (query: string) => {
    setUserSearchQuery(query)

    if (query.length < 2) {
      setSearchedUsers([])
      return
    }

    try {
      setSearchingUsers(true)
      const response = await axios.post('/admin/messages/search-users', { query })
      setSearchedUsers(response.data.users)
    } catch (error) {
      console.error('Failed to search users:', error)
    } finally {
      setSearchingUsers(false)
    }
  }

  // Start conversation with user
  const handleStartConversation = async (userId: number) => {
    try {
      console.log('Starting conversation with user:', userId)

      const response = await axios.post('/admin/messages/start-conversation', {
        user_id: userId,
      })

      console.log('Conversation created:', response.data)

      // Close dialog first
      setShowNewMessageDialog(false)
      setUserSearchQuery('')
      setSearchedUsers([])

      // Reload the page to get updated conversations via Inertia
      router.reload({
        preserveScroll: true,
        preserveState: true,
        only: ['conversations'],
        onSuccess: () => {
          // Select the new conversation after reload
          setSelectedConversationId(response.data.conversation.id)
        },
      })
    } catch (error: any) {
      console.error('Failed to start conversation:', error)
      console.error('Error response:', error.response?.data)
      alert(`Failed to start conversation: ${error.response?.data?.message || error.message}`)
    }
  }

  // Send admin message with action buttons
  const handleSendAdminMessage = async (content: string) => {
    if (!selectedConversationId) return

    try {
      const payload: any = {
        conversation_id: selectedConversationId,
        content,
      }

      // Add action buttons if any
      if (actionButtons.length > 0) {
        payload.buttons = actionButtons.filter(
          (btn) => btn.label && btn.url
        )
      }

      await axios.post('/admin/messages/send', payload)
      await sendMessage(content)
      // Clear action buttons after sending
      setActionButtons([])
      setAdminMessageContent('')

      // Refetch messages to show the new message
      await fetchMessages()

      // Reload conversations to update the preview
      router.reload({
        preserveScroll: true,
        preserveState: true,
        only: ['conversations'],
      })
    } catch (error) {
      console.error('Failed to send admin message:', error)
      throw error
    }
  }

  // Add action button
  const addActionButton = () => {
    setActionButtons([...actionButtons, { label: '', action: 'navigate', url: '' }])
  }

  // Remove action button
  const removeActionButton = (index: number) => {
    setActionButtons(actionButtons.filter((_, i) => i !== index))
  }

  // Update action button
  const updateActionButton = (
    index: number,
    field: keyof ActionButtonInput,
    value: string
  ) => {
    const updated = [...actionButtons]
    updated[index] = { ...updated[index], [field]: value }
    setActionButtons(updated)
  }

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

  const getInitials = (name: string) => {
    if (!name) return 'A'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            <p className="text-muted-foreground mt-1">
              Manage conversations and message users
            </p>
          </div>

          <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-search">Search Users</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="user-search"
                      placeholder="Search by name, email, or phone..."
                      value={userSearchQuery}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchingUsers && (
                  <p className="text-sm text-muted-foreground text-center">
                    Searching...
                  </p>
                )}

                {searchedUsers.length > 0 && (
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {searchedUsers.map((searchedUser) => (
                      <button
                        key={searchedUser.id}
                        onClick={() => handleStartConversation(searchedUser.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={searchedUser.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials(searchedUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {searchedUser.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {searchedUser.email}
                          </div>
                          {searchedUser.is_provider && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              Provider: {searchedUser.provider_name}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {userSearchQuery.length >= 2 &&
                  !searchingUsers &&
                  searchedUsers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No users found
                    </p>
                  )}
              </div>
            </DialogContent>
          </Dialog>
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
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <ConversationListItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={selectedConversationId === conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      showProviderInfo={false}
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
                        src={selectedConversation.user_avatar || undefined}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(selectedConversation.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedConversation.user_name}
                      </p>
                      {selectedConversation.service_name && (
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.service_name}
                        </p>
                      )}
                    </div>
                  </div>
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

                {/* Admin Message Composer */}
                <div className="border-t border-border bg-background p-4 space-y-3 flex-shrink-0">
                  {/* Action Buttons Manager */}
                  {actionButtons.length > 0 && (
                    <div className="space-y-2">
                      {actionButtons.map((button, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-start p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Button label (e.g., View Booking)"
                              value={button.label}
                              onChange={(e) =>
                                updateActionButton(index, 'label', e.target.value)
                              }
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <select
                                value={button.action}
                                onChange={(e) =>
                                  updateActionButton(
                                    index,
                                    'action',
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 text-sm border rounded-md bg-background"
                              >
                                <option value="navigate">Navigate</option>
                                <option value="external">External Link</option>
                              </select>
                              <Input
                                placeholder="URL (e.g., /bookings/123)"
                                value={button.url}
                                onChange={(e) =>
                                  updateActionButton(index, 'url', e.target.value)
                                }
                                className="flex-1 text-sm"
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeActionButton(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addActionButton}
                      disabled={actionButtons.length >= 3}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Button
                    </Button>
                  </div>

                  <MessageInput
                    conversationId={selectedConversationId}
                    onSendMessage={handleSendAdminMessage}
                    onTyping={handleTyping}
                    disabled={sending}
                    placeholder="Type an admin message..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Send className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No Conversation Selected</p>
                  <p className="text-sm">
                    Select a conversation or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
