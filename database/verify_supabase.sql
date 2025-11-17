-- Run these queries in Supabase SQL Editor to verify setup

-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'message_events'
);

-- 2. Check table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'message_events'
ORDER BY ordinal_position;

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'message_events';

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'message_events';

-- 5. Check if realtime is enabled (this might not work, check in UI instead)
SELECT * FROM pg_publication_tables
WHERE tablename = 'message_events';

-- 6. View recent events to confirm backend is writing
SELECT id, event_type, conversation_id, channel, created_at
FROM message_events
ORDER BY created_at DESC
LIMIT 10;
