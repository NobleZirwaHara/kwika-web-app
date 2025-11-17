import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Conversation {
  id: number
  user_id: number
  provider_id: number
  provider_name: string
  provider_logo: string | null
  user_name: string
  user_avatar: string | null
  service_name: string | null
  booking_number: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number
  created_at: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch conversations from Laravel API
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/api/conversations')
      setConversations(response.data.conversations)
    } catch (err: any) {
      console.error('Failed to fetch conversations:', err)
      setError(err.response?.data?.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  // Subscribe to realtime updates via Supabase
  useEffect(() => {
    fetchConversations()

    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, realtime updates disabled')
      return
    }

    // Subscribe to message events to update conversation list
    const channel = supabase!
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_events',
        },
        (payload: any) => {
          const event = payload.new
          const eventType = event.event_type

          // Refresh conversations when new message or read receipt arrives
          if (eventType === 'message' || eventType === 'read') {
            fetchConversations()
          }
        }
      )
      .subscribe()

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [fetchConversations])

  // Get or create conversation with a provider
  const getOrCreateConversation = useCallback(
    async (providerId: number, bookingId?: number) => {
      try {
        const response = await axios.post('/api/conversations', {
          provider_id: providerId,
          booking_id: bookingId,
        })

        // Refresh conversations list
        await fetchConversations()

        return response.data.conversation
      } catch (err: any) {
        console.error('Failed to create conversation:', err)
        throw new Error(err.response?.data?.message || 'Failed to create conversation')
      }
    },
    [fetchConversations]
  )

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    getOrCreateConversation,
  }
}
