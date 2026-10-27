# PasaBai Software Requirements Specification: User Stories

## 1. Product Summary

PasaBai is a student commute platform that connects verified student commuters with verified student drivers for scheduled shared rides. The mobile app has commuter, driver, and administrator roles. It uses Supabase for authentication, data, storage, and real-time updates; maps and traffic require a separately configured map provider.

## 2. Roles

| Role | Description |
| --- | --- |
| Commuter | A verified student who searches for, requests, pays for, and rates rides. |
| Driver | A verified student driver who publishes trips, manages requests, carries out rides, and records payments. |
| Administrator | An authorized PasaBai team member who reviews verification, safety reports, and moderation actions. |

## 3. Authentication And Profile

### US-01: Create an account
**As a** new user, **I want to** sign up with my email and password, **so that** I can securely use PasaBai.

**Acceptance criteria**
- The system validates email and password inputs.
- A new authenticated user receives a profile record.
- The user chooses commuter or driver during onboarding.
- The app does not expose administrator access through self-registration.

### US-02: Sign in and manage a session
**As a** returning user, **I want to** sign in and remain signed in securely, **so that** I can continue using the app without logging in repeatedly.

**Acceptance criteria**
- The app uses Supabase Auth for sign-in and sign-out.
- Native sessions are stored with device-secure storage.
- The user can sign out from settings.

### US-03: Manage my profile
**As a** user, **I want to** update my display name, photo, contact number, and emergency contact, **so that** my account information stays current.

**Acceptance criteria**
- The app validates required profile fields.
- Profile images use controlled storage and size/type checks.
- Only the owner and authorized administrators can access private profile details.

## 4. Verification And Safety

### US-04: Submit student verification
**As a** user, **I want to** submit my student ID or school verification, **so that** PasaBai can restrict rides to students.

**Acceptance criteria**
- Users can submit a document and see pending, approved, or rejected status.
- Private documents are not publicly accessible.
- A rejection includes a safe explanation and resubmission path.

### US-05: Submit driver and vehicle verification
**As a** driver, **I want to** submit my license and vehicle details, **so that** I can publish rides once approved.

**Acceptance criteria**
- A driver cannot publish a ride without approved driver and vehicle verification.
- The system tracks verification status and review dates.
- The administrator can approve, reject, or suspend verification and records the action in an audit log.

### US-06: Report a safety concern
**As a** rider or driver, **I want to** report another user or a ride, **so that** PasaBai can investigate safety issues.

**Acceptance criteria**
- A report can reference a user and/or ride.
- Reports include a reason, description, status, and review record.
- Only authorized staff can read all reports and take moderation action.

## 5. Commuter Journey

### US-07: Search available rides
**As a** commuter, **I want to** search by pickup, destination, date, time, and seats, **so that** I can find a suitable ride.

**Acceptance criteria**
- Results show only published, compatible offers with remaining seats.
- The app displays driver, vehicle, route, pickup window, price, and availability.
- Map and traffic information display only when the map provider has been configured.

### US-08: Request a seat
**As a** commuter, **I want to** request one or more seats on a ride, **so that** the driver can decide whether to include me.

**Acceptance criteria**
- A commuter can submit only one active request for the same offer.
- The commuter receives a notification when the request is accepted, rejected, or cancelled.
- The request does not reserve a seat until the driver accepts it.

### US-09: View confirmed ride details
**As a** commuter, **I want to** view my confirmed ride and pickup details, **so that** I know when and where to meet the driver.

**Acceptance criteria**
- The confirmed ride includes pickup instructions, fare, and status.
- The app updates the ride state in real time where available.
- Live driver location is shared only during the configured ride window and with consent.

### US-10: Pay and view ride history
**As a** commuter, **I want to** see the amount due, payment status, and prior rides, **so that** I can settle my fare and keep records.

**Acceptance criteria**
- Payment states include pending, paid, refunded, failed, and disputed.
- Cash or pay-later entries are clearly marked as pending until recorded as paid.
- Only a server-side payment integration may mark external digital payments as confirmed.

### US-11: Rate a completed ride
**As a** commuter, **I want to** rate my completed ride, **so that** I can share accountable feedback.

**Acceptance criteria**
- Ratings are permitted only after a completed ride.
- A user can submit one rating per ride.
- The rating includes one to five stars and an optional moderated comment.

## 6. Driver Journey

### US-12: Publish a ride offer
**As a** approved driver, **I want to** publish a planned ride with route, schedule, seats, and fare, **so that** commuters can request it.

**Acceptance criteria**
- A ride offer includes pickup, destination, departure time, seats, fare, and the approved vehicle.
- Only approved drivers with approved vehicles can publish.
- The driver can cancel an offer before or during request review according to the cancellation policy.

### US-13: Review and accept requests
**As a** driver, **I want to** accept or reject commuter requests, **so that** I control who joins the trip.

**Acceptance criteria**
- Acceptance checks remaining capacity in a single database transaction.
- Accepting a request creates a confirmed ride and reduces available seats.
- The app prevents overselling when requests are accepted concurrently.

### US-14: Manage the active ride
**As a** driver, **I want to** start and complete a confirmed ride, **so that** riders and payment records reflect the actual trip.

**Acceptance criteria**
- A driver can transition a confirmed ride to in-progress and completed.
- Location sharing only occurs while an active ride is enabled and consented to.
- The system records timestamps for the ride lifecycle.

### US-15: Record a payment
**As a** driver, **I want to** mark a pending cash or pay-later balance as paid after receiving it, **so that** my wallet is accurate.

**Acceptance criteria**
- The driver can see paid and unpaid ride balances.
- Marking payment as paid records the acting user and timestamp.
- The action is auditable and cannot impersonate an external payment-provider confirmation.

## 7. Administration

### US-16: Review verification submissions
**As an** administrator, **I want to** review student, driver, and vehicle verification submissions, **so that** only qualified users can participate.

**Acceptance criteria**
- The administrator sees a controlled review queue.
- Approval, rejection, and suspension actions require a reason where appropriate.
- Every administrative action creates an audit record.

### US-17: Moderate reports and accounts
**As an** administrator, **I want to** investigate reports and suspend accounts where required, **so that** the platform remains safe.

**Acceptance criteria**
- The administrator can move reports through open, under-review, resolved, and dismissed statuses.
- Suspended users cannot create, request, or operate rides.
- The system retains required audit data according to the retention policy.

## 8. Non-Functional Requirements

- **Security:** Row Level Security protects every Supabase table; privileged actions use server-side functions only.
- **Privacy:** Location is limited to the active ride context, has clear consent, and follows a documented retention policy.
- **Reliability:** Seat acceptance is transactional and idempotent where applicable.
- **Accessibility:** Mobile screens support readable text, touch targets, color contrast, and screen-reader labels.
- **Auditability:** Verification, payment-state changes, account moderation, and report reviews create audit events.
- **Compliance:** Privacy policy, terms, consent language, retention/deletion process, incident response, and local transport/legal review are required before public launch.

## 9. Out Of Scope For The First Release

- Automatic verification of third-party payment accounts without a formal payment-provider integration.
- Public continuous location tracking outside an active, consented ride.
- Automated driver background checks unless supported by an approved local process.
- Marketplace pricing or dispatch algorithms that make legal, insurance, or transport claims without professional review.
