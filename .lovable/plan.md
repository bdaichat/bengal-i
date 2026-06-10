# Milestone 1 — Team-Ready Core

Goal: make Build Bengal AI good enough and collaborative enough for your team to sign in, build, and test internally. Payments, usage-limit enforcement, and multi-file projects are explicitly deferred to later milestones.

This milestone has two focused parts: **(A) Advanced AI upgrade** and **(B) Team access + roles**.

---

## Part A — Advanced AI Upgrade

### A1. Stronger system prompt (`supabase/functions/chat/index.ts`)
Replace the current generic prompt with a strict, quality-focused one (both EN + BN versions) that instructs the model to:
- Return one complete, self-contained React + TypeScript + Tailwind component in a single ```tsx fenced block, with a default export and no external/UI-library imports the preview can't resolve.
- Produce polished, responsive UI (good spacing, semantic HTML, accessible) — not skeletal output.
- Keep a short, friendly explanation (in the chat language) outside the code block.
This directly improves preview reliability and output quality.

### A2. Model selection
- Add a small model picker in the chat header: **Fast** (`google/gemini-3-flash-preview`, default) and **Quality** (`google/gemini-2.5-pro`).
- Pass the chosen model from `useChat` → chat function body.
- Validate the model server-side against an allowlist (reject anything else) before calling the gateway.

### A3. Regenerate
- Add a "Regenerate" action on the last assistant message that re-sends the previous user prompt (replacing the last assistant reply) so the team can quickly retry for better results.

---

## Part B — Team Access & Roles

### B1. Google sign-in
- Enable managed Google OAuth (keep email/password).
- Add a "Continue with Google" button to the auth form using the Lovable managed `lovable.auth.signInWithOAuth("google", ...)` flow.

### B2. Roles foundation
- Add `app_role` enum (`admin`, `member`), a `user_roles` table, and a `has_role()` security-definer function (roles never stored on profiles).
- New users default to `member`; you (admin) can be promoted via a one-time data update.

### B3. Lightweight teams
- Add `teams` and `team_members` (with per-member role) tables, plus an invite-by-email flow so teammates can join a shared team.
- Add nullable `team_id` to `projects`; team members can view (and optionally edit) projects shared to their team, via RLS using `has_role`/team membership checks.
- A simple "Team" section (in Settings or a new page) to create a team, invite members by email, and see members.

---

## Technical Notes

- **DB migrations** (single approval each): `app_role` enum + `user_roles` + `has_role()`; `teams` + `team_members`; `team_id` on `projects` + updated RLS. Every new public table gets GRANTs + RLS + policies in the same migration.
- **Auth**: use `supabase--configure_social_auth` for Google; managed credentials, no manual setup needed.
- **Edge function**: extend the existing `chat` function to accept and validate a `model` field; no new function needed.
- **No payment/billing code, no usage quotas** in this milestone (deferred per your direction).

## Deferred to later milestones
- M2: Usage-limit enforcement (10 gens/mo, 3 projects) once you're ready for public tiers.
- M3: Payments (Stripe first, bKash/Nagad later) + subscription/plan tracking; fix the Pricing FAQ claims at that time.
- M4: Multi-file project generation & export, in-preview editing.

---

Confirm and I'll start with Part A (AI upgrade) and the Google sign-in, then the roles/teams migrations.
