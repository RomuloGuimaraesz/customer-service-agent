# Avecta AI Analytics Improvement - Conversation Log

## User Prompt 1
Evaluate the current analytics engine of this app

## Assistant Response 1
Here’s an evaluation of how “analytics” works in this app today.

### What it is

The app does not run a separate analytics product (no Segment, no funnel engine). It implements in-app usage telemetry: events go to Supabase (`analytics_events`), and metrics are computed in the browser in `getUsageStatistics`.

Flow:
1. `useTabAnalytics` (`AdminContext`) runs when `activeTab` / auth changes: it ends the previous tab session, records a `tab_click`, starts a `tab_session` row (`duration: null`), then updates that row when the tab changes or on `beforeunload`.
2. `services/analytics.js` wraps Supabase insert / update / select and implements `getUsageStatistics` by loading matching rows and folding them per user and per hard-coded tab id.
3. `AnalyticsView` is the architect UI: period filter, per-user breakdown, export JSON, clear data.

RLS matches that design: users insert/update their own rows; architects can select all and delete all (see `supabase/migrations/20240311000000_analytics_events_rls.sql`).

### Strengths
- Clear model: `tab_click` vs `tab_session` + `duration` is easy to reason about; session rows tie update to `endTabSession` via primary key.
- Privacy-oriented tracking rule: `architect` is excluded from tracking (`trackTabClick` / `startTabSession`), while architects can still read aggregate data—consistent with “don’t track internal admins.”
- Operational docs in-repo: migration explains why RLS matters for inserts.
- Tests: `analytics.test.js` and `useTabAnalytics.test.js` cover the main behaviors and mocks.

### Limitations and risks
1. Client-side aggregation at scale.
2. Hard-coded tab surface.
3. Race between async session start and tab changes.
4. `beforeunload` is unreliable.
5. User identity in the UI uses UUID as email fallback.
6. Duplicate code in `supabase_rbac`.
7. `exportAnalyticsData` does redundant querying.
8. `useDashboardStats` is unrelated to tracking analytics.

### Verdict
The “analytics engine” is a straightforward event log + client reducer for dashboard tab usage, with sensible RLS and role rules and a usable architect dashboard. It is not built for high volume, sub-second reporting, or flexible dimensions; the main technical debt is scale, async session bookkeeping, hard-coded tab keys, and duplicate modules.

---

## User Prompt 2
For a bespoke solution and for its initial purpose it has been doing a good job, but following paretto's law a want to make it more extensible for the newer features I'm planning to do

## Assistant Response 2
For your setup, “more extensible” usually means one place defines what can happen, events carry enough structure to grow, and aggregation/reporting isn’t scattered across three files. Pareto-wise, a small set of changes buys most of the flexibility.

### 1) Single source of truth for tracked surface
Move tab definitions to one registry and import it from hook/service/view instead of duplicating structures.

### 2) Event model: generic envelope + typed payload
Keep stable columns and add a flexible JSONB `properties` field for feature-specific metadata.

### 3) Thin analytics API in client
Use a generic `track(eventType, properties)` plus focused hooks per feature.

### 4) Isolate aggregation logic
Extract reducer logic into pure functions so data source can later switch to RPC/server rollups.

### 5) Fix session duration race
Guarantee session identifier availability before end/update operations to avoid orphan rows.

### 6) Centralize role-based tracking/read rules
Define shared helpers/policies (`shouldTrack`, `canViewAnalytics`) and avoid scattered role checks.

### Suggested implementation order (Pareto)
1. Registry
2. Generic tracking + event constants (+ optional JSONB)
3. Pure reducer extraction
4. Session reliability fix
5. RPC/server aggregation if needed at scale

---

## User Prompt 3
copy all we discussed in this prompt context including my prompts into @avecta-ai-analytics-improvement.md file

## Assistant Action
This file now contains the full conversation context (your prompts + my responses) in a structured, copyable format.

---

## User Prompt 4
ok, proceed with the update of the file with all your sugestions, dont make any code alteration without my permission, did you understood?

## Assistant Confirmation
Understood. This update only changes this markdown document. No application code, configuration, database, or infrastructure changes were made.

---

## Consolidated Suggestions (No-Code Plan)

### A) Decision Log (Draft)
- Keep current bespoke analytics architecture for now (Supabase event log + frontend reporting).
- Prioritize extensibility over full replatforming.
- Apply Pareto principle: deliver the highest-impact structural improvements first.
- Defer heavy backend rollups/RPC until actual scale pressure appears.

### B) Target Architecture (Incremental)
1. **Single tracking registry**
   - One source of truth for tracked surfaces (tabs/features).
   - Shared by hook (`useTabAnalytics`), service (`getUsageStatistics`), and view (`AnalyticsView`).

2. **Event contract**
   - Stable envelope fields for all events (user, timestamp, type, session/correlation IDs).
   - Flexible payload for feature-specific metadata (`properties` JSON-style model).
   - Event type catalog maintained as constants to avoid ad-hoc names.

3. **Tracking API**
   - Introduce a generic `track(eventType, properties)` conceptual interface.
   - Keep feature hooks thin and focused (tabs, modals, funnels, etc.).

4. **Aggregation layer isolation**
   - Separate “fetch raw events” from “compute stats.”
   - Keep reducer logic pure and testable.
   - Makes future move to server/RPC aggregates straightforward.

5. **Session reliability hardening**
   - Ensure session start/end flow cannot produce orphaned sessions.
   - Define fallback behavior for unload/navigation race conditions.

6. **Centralized policy logic**
   - One place for `shouldTrack(role)` and `canViewAnalytics(role)`.
   - Keep behavior aligned with RLS intent and UX permissioning.

### C) Pareto Roadmap (Recommended Execution Order)

#### Phase 1 - Foundation (highest ROI)
- Create unified tracking registry.
- Define event naming convention and event catalog.
- Document canonical event envelope and payload style.

#### Phase 2 - API and Consistency
- Standardize all new telemetry through a single tracking entry point.
- Remove duplicated per-feature event-writing patterns.
- Align all analytics consumers with registry-driven tab/feature definitions.

#### Phase 3 - Data Quality
- Address session timing/race edge cases.
- Add expected behavior rules for incomplete sessions.
- Define clear semantics for “click,” “session,” and “duration.”

#### Phase 4 - Scale Trigger (only when needed)
- Add server-side aggregation path (RPC/materialized strategy).
- Keep client reducer as fallback and test oracle.
- Optimize exports and heavy reports.

### D) Governance Rules for New Features
- Every new feature must define:
  - Event types it emits.
  - Minimum payload schema.
  - Owner team/person.
  - Dashboard consumer (who reads this metric and why).
- No new ad-hoc event names without catalog update.
- No duplicated tab/feature IDs outside registry.

### E) Quality Gates (Definition of Done for Analytics Changes)
- Event names follow catalog and naming convention.
- Payload keys documented and backward-compatible.
- Tracking behavior validated for role-based exclusions.
- Aggregation output verified with deterministic fixture data.
- Export and analytics view still work for selected period/user.

### F) KPIs to Evaluate Refactor Success
- **Extensibility KPI:** time required to add a new trackable feature.
- **Consistency KPI:** number of duplicated tracking definitions across files.
- **Data Quality KPI:** percentage of sessions with valid duration.
- **Performance KPI:** average load time for analytics view on 7/30/90-day periods.
- **Reliability KPI:** failed analytics writes per 1,000 events.

### G) Risk Register (with Mitigation)
- **Risk:** schema drift between old and new event shapes  
  **Mitigation:** versioned event contract and compatibility mapping.
- **Risk:** metric discontinuity during migration  
  **Mitigation:** overlap window and dual-read validation report.
- **Risk:** overengineering too early  
  **Mitigation:** gate scale features behind concrete thresholds.
- **Risk:** silent tracking failures  
  **Mitigation:** explicit error observability and alert criteria.

### H) Practical Backlog (Ready to Convert into Tasks)
1. Write analytics architecture RFC (scope, vocabulary, invariants).
2. Define event catalog v1 (tabs + near-term upcoming features).
3. Define payload contract templates per event family.
4. Map current code paths to future unified tracking interface.
5. Specify migration strategy for existing reports.
6. Specify validation test matrix (unit + integration + smoke).
7. Specify rollout plan and rollback plan.

### I) Suggested Feature-Planning Template (for each new feature)
- **Feature name**
- **Business question to answer**
- **Events to emit**
- **Payload fields**
- **Primary dashboard metric**
- **Secondary diagnostic metrics**
- **Roles tracked / roles excluded**
- **Data retention needs**
- **Acceptance checks**

---

## Explicit Constraint Acknowledgment
- You requested no code alteration without permission.
- This update respected that constraint.
- Next step can be: convert this plan into implementation tickets only (still no code), if you want.
