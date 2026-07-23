# Cloudflare deployment

The Vue app and Worker deploy independently from the local repository. No hosted Git provider is required.

## One-time setup

Authenticate Wrangler:

~~~powershell
npx wrangler login
~~~

Create the Pages project before the first direct upload:

~~~powershell
npx wrangler pages project create golden-wings-screening
~~~

Choose the public origin that will serve the Vue build before deploying the
Worker. Either use `https://golden-wings-screening.pages.dev`, or attach
`golden-wings-robyn.com` to this Pages project in Cloudflare's Custom domains
panel using the [Pages custom-domain workflow](https://developers.cloudflare.com/pages/configuration/custom-domains/).
Set `PUBLIC_SITE_URL` in `wrangler.toml` to that exact origin so emailed watch
links and the deployed app stay together.

Deploy the built `dist` directory to the `golden-wings-screening` Pages project:

~~~powershell
npx wrangler pages deploy dist --project-name golden-wings-screening
~~~

For repeat deploys, the repository shorthand runs the build and the same Pages command:

~~~powershell
npm run deploy:pages
~~~

## Frontend environment

For local development, copy .env.example to .env.local and set:

~~~dotenv
VITE_WORKER_API_BASE_URL=https://gwingz-worker.calebmills99.workers.dev
~~~

Auth0 values are public application configuration and remain inactive until protected account routes are built:

~~~dotenv
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
~~~

Reserve the future purchase or download destination without exposing it in phase one:

~~~dotenv
VITE_FUTURE_OFFER_URL=
~~~

Add the private film player URL when the screening is ready:

~~~dotenv
VITE_SCREENING_EMBED_URL=
VITE_SCREENING_STATE=open
~~~

Vite reads these values when the frontend is built. Leave the embed blank for the
pre-launch screening state, or set it before `npm run build` as a local-only
fallback. Production playback tokens are issued by the Worker from Stream.

## Audience database

Create and migrate the D1 database once:

~~~powershell
npx wrangler d1 create golden-wings-audience
~~~

Copy the returned database id into `wrangler.toml`, then apply migrations:

~~~powershell
npx wrangler d1 migrations apply golden-wings-audience --remote
~~~

Export leads with the commands in docs/audience-export.md.

## Worker configuration

Set the Resend secret:

~~~powershell
npx wrangler secret put RESEND_API_KEY
~~~

Optional Worker vars in `wrangler.toml`:

- `SCREENING_STATE` — `open`, `scheduled`, or `closed`
- `STREAM_VIDEO_UID` — Cloudflare Stream uid for the full film
- `STREAM_CUSTOMER_CODE` — customer subdomain code
- `SCREENING_EMBED_URL` — optional non-signed fallback embed
- `FROM_EMAIL` — verified Resend sender

The checked-in `wrangler.toml` uses `https://goldenwings.caleb-portfolio.org`.
That hostname is the live Workers custom domain for the SPA. `watch.gwingz.com`
is also registered on the Worker, but the `gwingz.com` zone currently returns a
self-redirect loop until its SSL mode is set to Full in the dashboard. Keep
`PUBLIC_SITE_URL` pointed at a hostname that actually serves the SPA.
Deploy:

~~~powershell
npm run deploy:worker
~~~

SPA deploy (Workers assets):

~~~powershell
npm run deploy:frontend
~~~

Verify:

~~~powershell
Invoke-RestMethod https://gwingz-worker.calebmills99.workers.dev/health
Invoke-WebRequest https://goldenwings.caleb-portfolio.org/watch
~~~

Expected health JSON:

~~~json
{
  "ok": true,
  "service": "gwingz-rsvp-worker",
  "screeningState": "open"
}
~~~

## Release sequence

1. Run npm run verify.
2. Run npm run e2e.
3. Run `npm run deploy:frontend` (or Pages deploy with a pages:write token).
4. Confirm the custom hostname serves `/`, `/confirmation`, and `/watch`.
5. Make `PUBLIC_SITE_URL` match that origin exactly, then `npm run deploy:worker`.
6. Optional: `npx wrangler secret put RESEND_API_KEY` so confirmation mail sends.
7. Submit one RSVP, open `/watch?email=...`, and confirm the D1 lead + watch event.
