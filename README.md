# Golden Wings screening funnel

Vue and Cloudflare application for Golden Wings: Fifty Year Flight Path.

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

Deploy the Vue app through Cloudflare Pages Direct Upload:

~~~powershell
npm run deploy:pages
~~~

Deploy the RSVP and watch-access Worker:

~~~powershell
npm run deploy:worker
~~~

Worker behavior uses these Cloudflare values:

- RESEND_API_KEY as a secret
- FROM_EMAIL as an optional sender address
- PUBLIC_SITE_URL as the public site origin
- RSVP_SUBMISSIONS as an optional KV binding

See docs/deployment-cloudflare.md for the full runbook.

## Routes

- / is the public film funnel.
- /confirmation confirms that the watch link is being sent.
- /watch opens the email-gated screening room.

## Screening source

Set `VITE_SCREENING_EMBED_URL` before building to load the private film player.
When it is blank, the gated route shows the intentional pre-launch screening
state and keeps the RSVP funnel available.
