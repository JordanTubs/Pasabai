# PasaBai System Design

## Architecture

```mermaid
flowchart TB
  Web[PasaBai React PWA] --> Auth[Supabase Auth]
  Web --> DB[(Supabase PostgreSQL + RLS)]
  Web --> Storage[Supabase Storage: private documents and avatars]
  Web -. configured only .-> Maps[Google Maps / route provider]
  Web -. test adapter .-> Payments[Cash, GCash, QR Ph payment adapter]
  Admin[Protected admin interface] --> DB
  DB --> Events[Notifications and audit records]
```

## Commuter Flow

```mermaid
flowchart LR
  A[Register or log in] --> B[Complete profile]
  B --> C[Student verification]
  C --> D[Search pickup, destination, time, seats]
  D --> E[View compatible approved offers]
  E --> F[Request a seat]
  F --> G{Driver decision}
  G -->|Accepted| H[Confirmed ride and pickup details]
  G -->|Rejected or cancelled| D
  H --> I[Ride in progress]
  I --> J[Complete ride]
  J --> K[Record payment]
  K --> L[Rating, history, achievements]
```

## Driver Flow

```mermaid
flowchart LR
  A[Register or log in] --> B[Student, license and vehicle review]
  B --> C{Approved?}
  C -->|No| D[View status and resubmit]
  C -->|Yes| E[Publish an existing planned trip]
  E --> F[Review requests]
  F --> G[Atomically reserve seats on acceptance]
  G --> H[Confirmed passenger list]
  H --> I[Start ride]
  I --> J[Complete ride]
  J --> K[Payment and fee record]
  K --> L[Earnings, ratings, milestones]
```

## Database ERD

```mermaid
erDiagram
  PROFILES ||--o{ USER_ROLES : has
  PROFILES ||--o{ STUDENT_VERIFICATIONS : submits
  PROFILES ||--o{ DRIVER_VERIFICATIONS : submits
  PROFILES ||--o{ VEHICLES : owns
  PROFILES ||--o{ RIDE_OFFERS : publishes
  VEHICLES ||--o{ RIDE_OFFERS : used_for
  RIDE_OFFERS ||--o{ RIDE_REQUESTS : receives
  PROFILES ||--o{ RIDE_REQUESTS : makes
  RIDE_REQUESTS ||--o| RIDES : confirms
  RIDE_OFFERS ||--o{ RIDES : produces
  RIDES ||--o{ PAYMENTS : records
  PAYMENTS ||--o{ PAYMENT_EVENTS : logs
  RIDES ||--o| PLATFORM_FEES : calculates
  DRIVER_PLANS ||--o{ SUBSCRIPTIONS : selected_in
  PROFILES ||--o{ SUBSCRIPTIONS : holds
  RIDES ||--o{ RATINGS : receives
  PROFILES ||--o{ RATINGS : writes
  PROFILES ||--o{ USER_ACHIEVEMENTS : earns
  ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : grants
  PROFILES ||--o{ MONTHLY_MILESTONES : tracks
  PROFILES ||--o{ NOTIFICATIONS : receives
  PROFILES ||--o{ REPORTS : files
  RIDES ||--o{ REPORTS : concerns
  PROFILES ||--o{ ADMIN_ACTIONS : audits
```

## State Rules

- Only approved drivers with an approved vehicle may publish a ride offer.
- A commuter may make one request per offer; database uniqueness enforces this.
- A driver accepts a request through `accept_ride_request`, which locks the offer, checks capacity, subtracts seats, marks the request accepted, and creates one ride in one transaction.
- Only a completed ride may create ratings, achievements, milestones, and finalized payment/fee records.
- Payment providers update provider-confirmed events server-side. The UI must never mark a real payment successful by itself.
- Admin approvals, suspensions, fee calculations, document access, and payment-provider callbacks require server-side privileged functions and audit records.

## Delivery Roadmap

1. Configure Supabase Auth, Storage, and the SQL schema.
2. Replace local demo state with a repository layer that chooses Supabase or explicit demo data.
3. Add commuter onboarding, search, offer details, requests, and ride lifecycle screens.
4. Add driver verification, vehicle management, trip publishing, request review, and earnings screens.
5. Add protected admin review workflows backed by server-side functions.
6. Add Maps, route matching, payment provider adapters, and notifications only when credentials and operational approvals are in place.
7. Add policy documents, consent, support/reporting, security monitoring, tests, and deployment review before public operation.
