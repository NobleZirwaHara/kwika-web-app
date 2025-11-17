import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Realtime features will be disabled.')
}

// Create Supabase client with realtime capabilities
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// Database types for Supabase realtime
export interface SupabaseMessage {
  id: number
  conversation_id: number
  sender_id: number
  sender_type: 'user' | 'provider' | 'admin' | 'system'
  message_type: 'text' | 'file' | 'system_notification' | 'booking_request'
  content: string
  formatted_content: string | null
  metadata: Record<string, any> | null
  file_url: string | null
  file_name: string | null
  file_type: string | null
  file_size: number | null
  read_by_user_at: string | null
  read_by_provider_at: string | null
  created_at: string
  updated_at: string
}

export interface SupabaseTypingIndicator {
  conversation_id: number
  user_id: number
  user_name: string
  is_typing: boolean
  timestamp: string
}

export interface SupabaseReadReceipt {
  message_id: number
  conversation_id: number
  reader_type: 'user' | 'provider'
  read_at: string
}
