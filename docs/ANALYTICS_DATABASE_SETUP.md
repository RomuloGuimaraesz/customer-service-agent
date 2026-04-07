# Analytics Database Setup - Supabase RLS

## Problem

Analytics tracking does not work for admin users (or any non-architect role). The frontend correctly calls the analytics service, but **Supabase Row Level Security (RLS)** blocks the INSERT operations because no policies are defined.

## Root Cause

When RLS is enabled on a table (default for Supabase tables), **all operations are denied** until you create explicit policies. Without policies:

- `INSERT` from `trackTabClick` and `startTabSession` → **fails silently**
- Errors are logged to console: `"Erro ao registrar clique:"` or `"Erro ao iniciar sessão:"`

## How to Verify

1. Open DevTools → Console while using the app as an admin user
2. Switch between tabs (Pedidos, Agendamentos, WhatsApp)
3. If you see `"Erro ao registrar clique:"` or `"Erro ao iniciar sessão:"` with a Supabase/Postgres error → **it's an RLS/database issue**

## Solution

Run the migration in your Supabase project:

1. Go to [Supabase Dashboard](https://app.supabase.com) → your project
2. Open **SQL Editor**
3. Copy the contents of `supabase/migrations/20240311000000_analytics_events_rls.sql`
4. Run the script

## If the Table Already Exists

If `analytics_events` already exists with a different schema (e.g. `created_at` instead of `timestamp`):

1. Check your current columns in Supabase → Table Editor → `analytics_events`
2. If you have `created_at` but the app expects `timestamp`, either:
   - Add a column: `ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS timestamp timestamptz DEFAULT now();`
   - Or update the analytics service to use `created_at` instead of `timestamp`

## Policies Created

| Operation | Policy | Who can do it |
|-----------|--------|---------------|
| INSERT | `analytics_users_insert_own` | Authenticated users (admin, user) can insert their own events |
| UPDATE | `analytics_users_update_own` | Users can update their own session duration |
| SELECT | `analytics_architects_select_all` | Architects see all; others see only their own |
| DELETE | `analytics_architects_delete_all` | Only architects can clear analytics data |

## After Applying

1. Log out and log in again with an admin account
2. Switch between tabs
3. As an architect, open the Statistics button and verify data appears
