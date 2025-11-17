-- Supabase Schema for Real-time Messaging Events
-- This table is used ONLY for real-time event broadcasting
-- The main application data is stored in Laravel's SQLite database

-- Create message_events table for real-time broadcasts
CREATE TABLE IF NOT EXISTS message_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL CHECK (event_type IN ('message', 'typing', 'read', 'presence')),
    conversation_id BIGINT NOT NULL,
    channel TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on conversation_id for faster queries
CREATE INDEX IF NOT EXISTS idx_message_events_conversation_id ON message_events(conversation_id);

-- Create index on created_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_message_events_created_at ON message_events(created_at);

-- Create index on event_type for filtering
CREATE INDEX IF NOT EXISTS idx_message_events_type ON message_events(event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE message_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all events
CREATE POLICY "Allow authenticated users to read events"
ON message_events
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow service role to insert events (from Laravel backend)
CREATE POLICY "Allow service role to insert events"
ON message_events
FOR INSERT
TO service_role
WITH CHECK (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE message_events;

-- Create a function to automatically delete old events (older than 1 hour)
-- This keeps the table small and performant
CREATE OR REPLACE FUNCTION delete_old_message_events()
RETURNS void AS $$
BEGIN
    DELETE FROM message_events
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every 10 minutes
-- Note: This requires pg_cron extension. If not available, you can run this manually or via a cron job
-- SELECT cron.schedule('cleanup-message-events', '*/10 * * * *', 'SELECT delete_old_message_events();');

-- Optional: Create a trigger to auto-delete events after 5 minutes
-- This is more aggressive and keeps the table very lean
CREATE OR REPLACE FUNCTION auto_delete_message_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Schedule this row for deletion after 5 minutes
    PERFORM pg_sleep(300); -- 5 minutes
    DELETE FROM message_events WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The above trigger with pg_sleep is not recommended for production
-- Instead, use pg_cron or an external cron job to periodically clean up old events
