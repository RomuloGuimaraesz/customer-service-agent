-- Analytics Events Table & RLS Policies
-- Run this in Supabase SQL Editor if analytics tracking is not working for admin users.
--
-- Root cause: Supabase Row Level Security (RLS) blocks all operations by default.
-- Without proper policies, INSERT from authenticated users (including admin) fails silently.
--
-- This migration:
-- 1. Creates analytics_events table if it doesn't exist
-- 2. Enables RLS with correct policies for INSERT, UPDATE, SELECT, DELETE

-- Create table if not exists (idempotent)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  tab_id text,
  tab_name text,
  session_id text,
  duration integer,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "analytics_users_insert_own" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_users_update_own" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_architects_select_all" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_architects_delete_all" ON public.analytics_events;

-- INSERT: Authenticated users can insert their own events (admin, user roles)
-- Required for trackTabClick and startTabSession
CREATE POLICY "analytics_users_insert_own"
ON public.analytics_events
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE: Authenticated users can update their own events (for endTabSession)
CREATE POLICY "analytics_users_update_own"
ON public.analytics_events
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- SELECT: Architects can read all events (for AnalyticsView)
-- Other roles can read only their own (for future use)
CREATE POLICY "analytics_architects_select_all"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'architect'
  OR (SELECT auth.uid()) = user_id
);

-- DELETE: Only architects can delete (for clearAnalyticsData)
CREATE POLICY "analytics_architects_delete_all"
ON public.analytics_events
FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'architect');

-- Index for performance (RLS policies use user_id)
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON public.analytics_events(timestamp);
