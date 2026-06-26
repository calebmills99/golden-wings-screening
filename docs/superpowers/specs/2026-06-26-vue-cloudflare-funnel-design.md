# Vue Cloudflare Funnel Rebuild Design

Date: 2026-06-26
Project: Golden Wings screening site

## Goal

Replace the current Eleventy/static-page screening site with a modern Vue funnel that sells the Golden Wings experience and converts visitors into qualified viewers by collecting their email and sending the watch link.

This is not a live purchase/download build yet. It should be shaped so the same funnel step can later become a checkout, download entitlement, or account-based film library without another frontend rebuild.

## Current State

The repository currently contains:

- An Eleventy and Tailwind static site under `src/`, with generated output under `docs/`.
- Public pages for `/`, `/watch/`, and `/confirmation/`.
- A Cloudflare Worker in `gwingz-worker.js` that handles `/api/rsvp`, `/api/watch-access`, `/health`, and a Tailscale webhook endpoint.
- Older Google Apps Script, Webflow, and admin dashboard artifacts that do not match the desired future direction.
- Deployment history tied to GitHub Pages output, while the desired path is to avoid GitHub and use Cloudflare directly.

## Product Direction

The site should feel like a modern documentary funnel, not a patched event RSVP page.

Primary conversion today:

> Enter name and email to get the watch link.

Future conversion:

> Sign in, purchase, and download or stream the film.

The phase-one interface should therefore present the email capture as an offer conversion, not just an RSVP form. Copy and component names should make the future purchase/download transition straightforward.

## Recommended Architecture

Use Vue 3, Vite, Vue Router, and Tailwind for the public app.

Keep Cloudflare as the primary platform:

- Cloudflare Pages or Workers static assets hosts the built Vue app.
- Cloudflare Worker continues to own API endpoints.
- Cloudflare KV or D1 can later store leads, access records, purchases, and entitlement state.
- Cloudflare R2 can later store downloadable film files.
- Cloudflare Access or Auth0 by Okta can later protect account, library, watch, or download routes.
- Cloudflare Turnstile can be added later if spam appears.

Avoid GitHub as a deployment dependency. The implementation should support Cloudflare Pages Direct Upload or Wrangler-based deployment from the local repo or another Git host such as GitLab.

## Routes

### `/`

The main public funnel.

Responsibilities:

- Establish Golden Wings as an emotional film experience in the first viewport.
- Use real film imagery or video assets as primary visual signals.
- Present the film promise: Robyn Stewart, aviation history, legacy, and the viewer's invitation to watch.
- Include a preview or embedded player section.
- Repeat a single clear offer CTA throughout the page.
- Open or scroll to the offer capture form.
- Submit leads to the existing Worker `/api/rsvp` endpoint.

The page should avoid feeling like a generic SaaS landing page. It should feel cinematic, premium, and human.

### `/watch`

The screening-room page.

Responsibilities:

- Ask for email before revealing the player.
- Use the existing `/api/watch-access` endpoint to log access attempts.
- Reveal the embedded film player after email submission.
- Provide quiet support/contact copy.
- Feel like a private viewing area, not a form page.

Phase one does not require true authentication or entitlement checks on this route. The route should be easy to protect later.

### `/confirmation`

The post-capture confirmation page.

Responsibilities:

- Confirm that the watch link is being sent.
- Offer a direct path to `/watch`.
- Reinforce the film and future download ownership idea without implying a live checkout exists.

## Core Components

### `SiteLayout`

Owns shared page structure, metadata defaults, legal footer links, and global layout spacing.

### `FunnelHero`

The first-viewport experience for `/`. It should use film or aviation imagery/video and present the main offer CTA.

### `FilmStory`

Presents the short emotional story: Robyn, her career, and the aviation-history lens.

### `PreviewPlayer`

Holds a trailer, preview, or current stream embed. It should lazy-load heavy media where practical.

### `OfferCTA`

Reusable conversion button/link. Today its label is likely "Get the Watch Link" or "Watch Free Now." Later it can become "Buy the Download" or "Own the Film."

### `OfferCaptureForm`

The main conversion form.

Fields for phase one:

- Name
- Email
- Optional phone
- Optional source/how did you hear about us
- Honeypot field

Behavior:

- Validate required fields before submit.
- POST to `/api/rsvp` through a central API client.
- Show loading, success, and error states.
- On success, either show inline confirmation or route to `/confirmation`.

This component is the future checkout handoff point.

### `WatchGate`

Email gate for `/watch`.

Behavior:

- Validate email.
- POST watch-access analytics to `/api/watch-access`.
- Reveal `ScreeningRoom` immediately after a valid submit.
- Preserve honeypot behavior.

### `ScreeningRoom`

The embedded film viewing area and support CTA.

### `CloudflareApiClient`

Centralizes API calls and endpoint construction.

Responsibilities:

- Read API base URL from environment config.
- Normalize trailing slashes.
- Submit RSVP payloads.
- Submit watch-access payloads.
- Return typed success/error results.

## Data and Configuration

Use a single source for public offer copy, likely `src/content/filmOffer.ts`.

It should include:

- Film title
- Tagline
- Hero copy
- Story paragraphs
- CTA labels
- Contact email
- Current API base URL
- Current watch embed URL
- Future purchase/download teaser copy

Environment variables should configure:

- Worker API base URL
- Optional Auth0 domain/client ID values for future protected routes
- Optional future checkout/download URL

No secrets belong in the Vue app.

## Auth0 by Okta Readiness

Phase one should not force Auth0 login into the public funnel.

Reserve an auth boundary for future routes:

- `/login`
- `/account`
- `/library`
- `/download`

Implementation should keep Auth0 concerns isolated under `src/auth/` or a similar boundary so later integration does not spread through page components.

When purchase/download is ready, Auth0 can identify customers and Cloudflare Worker endpoints can validate entitlement before issuing stream or R2 download access.

## Cloudflare Worker Strategy

Keep `gwingz-worker.js` as the API spine for phase one.

Preserve:

- `POST /api/rsvp`
- `POST /api/watch-access`
- `GET /health`
- Existing Resend email behavior
- Existing honeypot handling

Improve later:

- Split Worker concerns into modules.
- Add tests for payload validation and endpoint routing.
- Add KV or D1 storage if durable lead records are needed.
- Add Turnstile verification if spam becomes a problem.
- Add entitlement endpoints when purchase/download is introduced.

## Deployment Strategy

The implementation should target Cloudflare-native deployment.

Preferred phase-one options:

1. Cloudflare Pages Direct Upload using Wrangler.
2. Cloudflare Pages connected to GitLab if a hosted Git workflow is wanted.
3. Workers Static Assets if keeping app and API under one Worker becomes simpler.

GitHub should not be required for normal deployment.

The generated `docs/` GitHub Pages output can be removed or deprecated once the Cloudflare deployment path is working.

## Testing

Frontend tests should cover:

- Main routes render.
- Offer capture validates missing name/email.
- Offer capture submits expected payload to API client.
- Success and failure states display.
- Watch gate validates email.
- Watch gate logs access and reveals the screening room.
- API client builds endpoint URLs correctly.

Worker tests should eventually cover:

- `/api/rsvp` validation.
- Honeypot no-op success.
- `/api/watch-access` success.
- Method-not-allowed responses.
- Health check response.

## Out of Scope for Phase One

- Live checkout.
- Real download delivery.
- Paid entitlement validation.
- Full admin dashboard rebuild.
- Forced SSO for viewers.
- Migration of Google Apps Script/Webflow artifacts unless needed for current operations.

## Acceptance Criteria

- The public site is rebuilt as a Vue/Vite funnel.
- The main conversion is email/name capture for a watch link.
- The watch page remains email-gated and logs access.
- Cloudflare Worker API behavior is preserved.
- Deployment no longer depends on GitHub Pages.
- The codebase has clear boundaries for future Auth0, purchase, library, and download features.
- Tests cover the core funnel behaviors before production code is changed.
