# Golden Wings RSVP Cloudflare Setup Instructions

## 1) Cloudflare Worker Setup
1. Install Wrangler CLI:
   ```bash
   npm i -g wrangler
   ```
2. Authenticate:
   ```bash
   wrangler login
   ```
3. From this repo, deploy:
   ```bash
   wrangler deploy
   ```

## 2) Configure Worker Secrets and Vars
Set required Resend key:
```bash
wrangler secret put RESEND_API_KEY
```

Optional sender address (must be verified in Resend):
```toml
# wrangler.toml
[vars]
FROM_EMAIL = "info@gwingz.com"
```

## 3) RSVP API Endpoints
- `POST /api/rsvp` → Main RSVP form submissions
- `POST /api/watch-access` → Watch-page analytics pings
- `GET /health` → Health check

Main site data config (`src/_data/site.json`) should point to the Worker origin, for example:
```json
"webhookUrl": "https://gwingz-worker.<account>.workers.dev"
```

The site appends endpoint paths automatically.

## 4) Configure Webflow/Form Submission
Send JSON `POST` to:
```
https://gwingz-worker.<account>.workers.dev/api/rsvp
```

Expected body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "555-123-4567",
  "source": "webflow",
  "specialRequests": "Wheelchair accessible seating"
}
```

## 5) Testing
```bash
curl -X POST "https://gwingz-worker.<account>.workers.dev/api/rsvp" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"555-123-4567","source":"manual-test"}'
```

Health check:
```bash
curl "https://gwingz-worker.<account>.workers.dev/health"
```