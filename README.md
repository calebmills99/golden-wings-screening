# Golden Wings screening funnel

Vue and Cloudflare application for Golden Wings.

## Local development

~~~powershell
npm install
npm run dev
~~~

The app opens at http://localhost:5173.

## Verification

~~~powershell
npm run test
npm run build
npm run e2e
~~~

## Cloudflare deployment

Live production origin:

- Site: https://goldenwings.caleb-portfolio.org
- API Worker: https://gwingz-worker.calebmills99.workers.dev
- Staging twin: https://golden-wings-screening.calebmills99.workers.dev

Deploy the Vue SPA as a Workers assets shell (preferred while the current API token lacks Pages write):

~~~powershell
$env:CLOUDFLARE_API_TOKEN = $env:CLOUDFLARE_EMAIL_TOKEN
npm run deploy:frontend
~~~

Or Pages Direct Upload when a pages:write token is available:

~~~powershell
npm run deploy:pages
~~~

Deploy the RSVP, watch-token, and audience Worker:

~~~powershell
npm run deploy:worker
~~~

Worker behavior uses these Cloudflare values:

- `RESEND_API_KEY` as a secret
- `FROM_EMAIL` as an optional sender address
- `PUBLIC_SITE_URL` as the public site origin
- `SCREENING_STATE` as `open`, `scheduled`, or `closed`
- `STREAM_VIDEO_UID` and `STREAM_CUSTOMER_CODE` for signed Stream playback
- `SCREENING_EMBED_URL` as an optional non-signed fallback
- `AUDIENCE_DB` D1 binding for durable leads and watch events
- `RSVP_SUBMISSIONS` as an optional KV binding

See docs/deployment-cloudflare.md and docs/audience-export.md for the full runbook.

## Routes

- `/` is the public film funnel.
- `/confirmation` confirms that the watch link is being sent.
- `/watch` opens the email-gated screening room and requests a playback token.

## Screening source

Production playback is issued by `POST /api/watch-token` as a short-lived
Cloudflare Stream embed. Set Worker `STREAM_VIDEO_UID` after the full film is
uploaded. `VITE_SCREENING_EMBED_URL` remains a local/build-time fallback only.
Change `SCREENING_STATE` on the Worker to open or close the room without
rebuilding the Vue app.
