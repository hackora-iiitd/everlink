# Everlink authentication

## Who can join

| Role | How they sign in | What proves membership |
|---|---|---|
| Student | `name@igdtuw.ac.in` + password | Verified email link |
| Professor | `name@igdtuw.ac.in` + password | Verified email link |
| Alumni | "Continue with LinkedIn" only (no password) | LinkedIn identity **plus** confirmation of an IGDTUW education entry |

## Frontend status (this build)

Everything is simulated in the browser (`frontend/src/lib/demoSession.ts`). It is a UX preview, **not security**:
the domain check, route guards and alumni "approval" can all be bypassed from the browser console.
`VITE_DEMO_MODE=false` hides the demo shortcuts (simulated email, simulated LinkedIn, "Simulate approval").

The Opportunities & Stories publishing roles and admin hide/restore controls are also client-side only. Posts and moderation state are stored in browser `localStorage`; there is no server-side content API or authorization yet. Do not treat authorship, verification, moderation, or post visibility as trusted security decisions.

Flows:
- Student / professor: register → `/verify-email` → onboarding → dashboard. Login rejects non-`@igdtuw.ac.in` addresses.
- Alumni: `/join/alumni` → LinkedIn → `/join/alumni/details` (IGDTUW claim + work + mentoring) → `/verify/alumni` (pending) → dashboard only once `verified`.

## What the backend must do

1. **Email domain**: accept exactly `@igdtuw.ac.in` (reject look-alikes such as `x@igdtuw.ac.in.evil.com`), send a one-time verification link, and mark the account verified only after it is clicked. Never trust the client's role or verified flag.
2. **Student vs professor**: the email domain is shared, so it cannot tell them apart. Keep a faculty allowlist (or have an admin approve professor accounts) before granting faculty permissions such as publishing projects.
3. **LinkedIn**: use "Sign In with LinkedIn using OpenID Connect" (authorization-code flow, with `state` and PKCE). Redirect `VITE_API_URL/auth/linkedin/start` → LinkedIn → backend callback → session cookie → frontend `/auth/linkedin/callback`.
4. **Alumni verification (important)**: LinkedIn's standard sign-in returns name, email and photo only. It does **not** return education, so LinkedIn alone cannot prove someone attended IGDTUW. Pick at least one:
   - match against the institute's alumni records (name + graduation year + degree), and/or
   - an admin reviews the submitted LinkedIn profile URL and approves or rejects, and/or
   - require a one-time code sent to an old `@igdtuw.ac.in` address where it still works.
   Alumni stay `pending` and are blocked from alumni APIs until `verified`.
5. Enforce roles on every API route; the frontend `RequireRole` guard only improves navigation.
6. Rate-limit sign-in, verification-email and password-reset endpoints.

## Env vars (frontend)

- `VITE_DEMO_MODE` (default on): simulated email, LinkedIn and approval.
- `VITE_API_URL`: backend base URL used for the LinkedIn redirect when demo mode is off.
