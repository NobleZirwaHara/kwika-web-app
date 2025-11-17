import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { supabase, isSupabaseConfigured, SupabaseTypingIndicator } from '@/lib/supabase'

export interface TypingUser {
  user_id: number
  user_name: string
  timestamp: string
}

export function useTypingIndicator(conversationId: number | null, currentUserId: number | null) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  // Subscribe to typing indicators via Supabase
  useEffect(() => {
    if (!conversationId || !isSupabaseConfigured()) return

    const channel = supabase!
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_events',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          const event = payload.new
          const eventType = event.event_type

          // Only handle typing events
          if (eventType !== 'typing') return

          const typingData = event.payload

          // Ignore own typing
          if (typingData.user_id === currentUserId) return

          if (typingData.is_typing) {
            // Add user to typing list
            setTypingUsers((prev) => {
              const exists = prev.some((u) => u.user_id === typingData.user_id)
              if (exists) return prev

              return [
                ...prev,
                {
                  user_id: typingData.user_id,
                  user_name: typingData.user_name,
                  timestamp: new Date().toISOString(),
                },
              ]
            })

            // Auto-remove after 3 seconds of inactivity
            setTimeout(() => {
              setTypingUsers((prev) =>
                prev.filter((u) => u.user_id !== typingData.user_id)
              )
            }, 3000)
          } else {
            // Remove user from typing list
            setTypingUsers((prev) =>
              prev.filter((u) => u.user_id !== typingData.user_id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [conversationId, currentUserId])

  // Send typing indicator (debounced)
  const sendTypingIndicator = useCallback(
    async (isTyping: boolean) => {
      if (!conversationId) return

      try {
        await axios.post(`/api/conversations/${conversationId}/typing`, {
          is_typing: isTyping,
        })
      } catch (err) {
        console.error('Failed to send typing indicator:', err)
      }
    },
    [conversationId]
  )

  // Start typing
  const startTyping = useCallback(() => {
    if (isTypingRef.current) return

    isTypingRef.current = true
    sendTypingIndicator(true)

    // Auto-stop typing after 3 seconds if no activity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }, [sendTypingIndicator])

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!isTypingRef.current) return

    isTypingRef.current = false
    sendTypingIndicator(false)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [sendTypingIndicator])

  // Handle input change (for auto-detection)
  const handleTyping = useCallback(() => {
    startTyping()

    // Reset timeout on each keystroke
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }, [startTyping, stopTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTyping()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [stopTyping])

  // Format typing indicator text
  const getTypingText = useCallback(() => {
    if (typingUsers.length === 0) return null
    if (typingUsers.length === 1) return `${typingUsers[0].user_name} is typing...`
    if (typingUsers.length === 2)
      return `${typingUsers[0].user_name} and ${typingUsers[1].user_name} are typing...`
    return `${typingUsers[0].user_name} and ${typingUsers.length - 1} others are typing...`
  }, [typingUsers])

  return {
    typingUsers,
    typingText: getTypingText(),
    startTyping,
    stopTyping,
    handleTyping,
  }
}
