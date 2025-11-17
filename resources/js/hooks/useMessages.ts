import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { supabase, isSupabaseConfigured, SupabaseMessage } from '@/lib/supabase'

export interface Message {
  id: number
  sender_id: number
  sender_name: string
  sender_type: 'user' | 'provider' | 'admin' | 'system'
  message_type: 'text' | 'file' | 'system_notification' | 'booking_request'
  content: string
  formatted_content: string | null
  metadata: {
    buttons?: Array<{
      label: string
      action: 'navigate' | 'external'
      url: string
    }>
    booking_id?: number
    booking_number?: string
    service_name?: string
    event_date?: string
  } | null
  file_url: string | null
  file_name: string | null
  file_type: string | null
  file_size: number | null
  is_read: boolean
  created_at: string
}

export interface MessagePagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export function useMessages(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [pagination, setPagination] = useState<MessagePagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages from Laravel API
  const fetchMessages = useCallback(
    async (page: number = 1) => {
      if (!conversationId) return

      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`/api/conversations/${conversationId}/messages`, {
          params: { page },
        })
        setMessages(response.data.messages)
        setPagination(response.data.pagination)
      } catch (err: any) {
        console.error('Failed to fetch messages:', err)
        setError(err.response?.data?.message || 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    },
    [conversationId]
  )

  // Subscribe to realtime message updates via Supabase
  useEffect(() => {
    if (!conversationId) return

    fetchMessages()

    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, realtime updates disabled')
      return
    }

    // Subscribe to message events in this conversation
    console.log('[useMessages] Subscribing to conversation:', conversationId)

    const channel = supabase!
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_events',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          console.log('[useMessages] Received event:', payload)
          const event = payload.new
          const eventType = event.event_type
          const eventPayload = event.payload

          // Handle new message events
          if (eventType === 'message') {
            console.log('[useMessages] New message event:', eventPayload)
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === eventPayload.id)) {
                console.log('[useMessages] Duplicate message, skipping:', eventPayload.id)
                return prev
              }
              console.log('[useMessages] Adding new message to state:', eventPayload.id)
              return [
                ...prev,
                {
                  id: eventPayload.id,
                  sender_id: eventPayload.sender_id,
                  sender_name: eventPayload.sender_name || '',
                  sender_type: eventPayload.sender_type,
                  message_type: eventPayload.message_type,
                  content: eventPayload.content,
                  formatted_content: eventPayload.formatted_content,
                  metadata: eventPayload.metadata,
                  file_url: eventPayload.file_path,
                  file_name: eventPayload.file_name,
                  file_type: eventPayload.file_type,
                  file_size: eventPayload.file_size || null,
                  is_read: false,
                  created_at: eventPayload.created_at,
                },
              ]
            })

            // Scroll to bottom on new message
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }

          // Handle read receipt events
          if (eventType === 'read') {
            console.log('[useMessages] Read receipt event:', eventPayload)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === eventPayload.message_id
                  ? {
                      ...msg,
                      is_read: true,
                    }
                  : msg
              )
            )
          }
        }
      )
      .subscribe((status, err) => {
        console.log('[useMessages] Subscription status:', status, err)
      })

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [conversationId, fetchMessages])

  // Send a text message
  const sendMessage = useCallback(
    async (content: string, metadata?: Record<string, any>) => {
      if (!conversationId || !content.trim()) return

      try {
        setSending(true)
        setError(null)

        const response = await axios.post(`/api/conversations/${conversationId}/messages`, {
          content: content.trim(),
          metadata,
        })

        // Message will be added via realtime subscription
        // But also add optimistically for immediate feedback
        const newMessage = response.data.message
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)

        return newMessage
      } catch (err: any) {
        console.error('Failed to send message:', err)
        setError(err.response?.data?.message || 'Failed to send message')
        throw err
      } finally {
        setSending(false)
      }
    },
    [conversationId]
  )

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return

    try {
      await axios.post(`/api/conversations/${conversationId}/read`)
      // Update local state
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          is_read: true,
        }))
      )
    } catch (err: any) {
      console.error('Failed to mark as read:', err)
    }
  }, [conversationId])

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return {
    messages,
    pagination,
    loading,
    error,
    sending,
    messagesEndRef,
    fetchMessages,
    sendMessage,
    markAsRead,
    scrollToBottom,
  }
}
