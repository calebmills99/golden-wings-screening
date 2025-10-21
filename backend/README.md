# Golden Wings Backend API

This Express + PostgreSQL service powers RSVP collection and dynamic theming for the Golden Wings documentary microsite. It is
 designed for deployment to DigitalOcean App Platform or Droplets with managed PostgreSQL.

## Features

- RESTful `/api/rsvps` endpoint for storing screening responses
- `/api/styles` endpoints for modular theme profiles that can drive different visual styles on the static frontend
- Health check endpoint at `/healthz`
- Migration script that provisions RSVP and style profile tables plus seed data
- JSON schema validation via Zod for reliable payload handling

## Getting Started

1. Duplicate `.env.example` to `.env` and update credentials:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies and run migrations:
   ```bash
   npm install
   npm run migrate
   ```

3. Start the API locally:
   ```bash
   npm run dev
   ```

The server listens on `PORT` (defaults to `8080`) and expects a `DATABASE_URL` that can connect to your DigitalOcean PostgreSQL
 database.

## Deployment Notes

- When using DigitalOcean App Platform, configure the `DATABASE_URL`, `PORT`, and `CORS_ORIGIN` environment variables in the app
  settings.
- Run the `npm run migrate` command as a pre-deploy job or one-off task after provisioning the database.
- Enable managed certificates and set `CORS_ORIGIN` to your Eleventy production domain to allow secure fetch requests from the
  static site.

## API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/healthz` | GET | Returns service status |
| `/api/rsvps` | POST | Create an RSVP record |
| `/api/rsvps` | GET | List recent RSVPs (admin use) |
| `/api/styles/active` | GET | Fetch the currently active theme token |
| `/api/styles` | POST | Create or update a theme profile |
| `/api/styles/active/:styleToken` | PATCH | Switch the active theme |

## Theming Payload Example

```json
{
  "styleToken": "sunrise-cabin",
  "label": "Sunrise Cabin",
  "settings": {
    "panel-backdrop": "rgba(124, 45, 18, 0.45)",
    "panel-border": "rgba(249, 115, 22, 0.25)"
  },
  "isActive": true
}
```

Activating a new style updates the Eleventy frontend through the fetch request executed in `src/js/main.js`.
