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

## Worker configuration

Set the Resend secret:

~~~powershell
npx wrangler secret put RESEND_API_KEY
~~~

The checked-in wrangler.toml sets PUBLIC_SITE_URL. Update that value when the production domain changes.

Deploy:

~~~powershell
npm run deploy:worker
~~~

Verify:

~~~powershell
Invoke-RestMethod https://gwingz-worker.calebmills99.workers.dev/health
~~~

Expected JSON:

~~~json
{
  "ok": true,
  "service": "gwingz-rsvp-worker"
}
~~~

## Release sequence

1. Run npm run verify.
2. Run npm run e2e.
3. Deploy the Worker if its code or configuration changed.
4. Run `npx wrangler pages deploy dist --project-name golden-wings-screening`.
5. Open /, /confirmation, and /watch on the Pages domain.
