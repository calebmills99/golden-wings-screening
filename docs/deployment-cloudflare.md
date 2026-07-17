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
~~~

Vite reads this value when the frontend is built. Leave it blank for the
pre-launch screening state, or set it before `npm run build` to render the film
player after the email gate.

## Worker configuration

Set the Resend secret:

~~~powershell
npx wrangler secret put RESEND_API_KEY
~~~

The checked-in `wrangler.toml` uses `https://golden-wings-robyn.com`. Keep it
only when that domain is attached to this Pages project; otherwise replace it
with the project's `pages.dev` origin before deploying the Worker.

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
3. Run `npx wrangler pages deploy dist --project-name golden-wings-screening`.
4. Attach the chosen custom domain, if used, and open `/watch` on that origin.
5. Make `PUBLIC_SITE_URL` match the verified origin exactly.
6. Deploy the Worker if its code or configuration changed.
7. Submit one RSVP and open the emailed `/watch` link.
