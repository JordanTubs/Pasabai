# PasaBai

PasaBai is a student commute coordination platform for Davao City. The current app has a polished driver-side demo experience and a Supabase foundation for a verified commuter, driver, and administrator system.

## Current Modes

- **Driver demo:** works locally without external credentials for passenger QR check-in, ride history, Pay Later tracking, wallet summaries, profile controls, and the visual mobile experience.
- **System foundation:** provides a secure Supabase database model, role design, RLS policies, plans, payments architecture, verification records, and an atomic seat-reservation function.
- **External services:** Google Maps, Supabase Auth, Supabase Storage, real-time updates, push notifications, payment providers, and live GPS are intentionally not claimed as live until their credentials and operating arrangements are configured.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

For a Supabase-backed environment:

1. Create a new Supabase project.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env.local`.
3. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL Editor.
4. Run [supabase/seed.sql](supabase/seed.sql).
5. Create private Storage buckets: `verification-documents` and `profile-avatars`.
6. Add a browser-restricted Google Maps key as `VITE_GOOGLE_MAPS_API_KEY` when Maps is configured.

Never add a Supabase service-role key, payment secret, or unrestricted Maps key to a Vite environment file.

## Database and Flows

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for the app flows, architecture, ERD, security model, and implementation roadmap.

## Checks

```bash
npm run build
```

The schema should be applied and tested in a dedicated Supabase project before any live user data is collected.
