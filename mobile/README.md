# PasaBai Mobile

The React Native PasaBai app, built with Expo and React Native. It shares the Supabase schema in `../supabase/schema.sql` with the web application.

## Run locally

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

Open the QR code with Expo Go on a phone, or select an iOS/Android simulator. The app works in preview mode without a `.env` file; add real Supabase values to enable account authentication.

## Environment values

Use only the Supabase project URL and its public publishable (or anon) key in `.env`. Never place a service-role key in a React Native app.

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-mobile-maps-key
```

## Current Native Flows

- Secure sign-in and session persistence through Supabase Auth and Expo Secure Store.
- Commuter search, seat-request preview, and confirmed-ride state.
- Driver trip workspace, request state, verification prompts, and wallet/pay-later management.
- Profile, safety, location-privacy, and sign-out controls.

Ride search, offer publishing, request acceptance, wallet persistence, verification uploads, map display, and notifications must be connected to the Supabase tables and protected server functions before public launch. The database contract and security rules live in `../supabase/schema.sql`.

## Validate

```bash
npx tsc --noEmit
npx expo export --platform web
```
