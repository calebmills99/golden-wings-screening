# Golden Wings Backend Service

A modular Express API designed to pair with the Golden Wings Eleventy site. It provides:

- A style registry for orchestrating multiple visual treatments (desktop + mobile) in sync with the documentary's "Connecting Hearts at 35,000 Feet" theme.
- RSVP persistence that can be served through DigitalOcean App Platform or Droplet deployments.
- JSON endpoints that the static front-end can consume to personalise colours, copy and layout without rebuilding the Eleventy project.

## Features

| Endpoint | Description |
| --- | --- |
| `GET /health` | Lightweight uptime probe for DigitalOcean load balancers. |
| `GET /api/styles` | Lists the registered style variants. |
| `GET /api/styles/:variant` | Retrieves a single style bundle containing CSS variables, hero copy and mobile layout hints. |
| `POST /api/styles` | Creates or updates a style variant. |
| `PUT /api/styles/:variant` | Alias for `POST` to ease CMS integrations. |
| `GET /api/registrations` | Paginated list of RSVP submissions. |
| `POST /api/registrations` | Persists a new RSVP entry. |

## Getting Started Locally

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your DigitalOcean Managed Database credentials. Example connection string:

```
DATABASE_URL=postgres://doadmin:supersecretpassword@db-postgresql-nyc3-12345-do-user-67890-0.b.db.ondigitalocean.com:25060/goldenwings?sslmode=require
```

Run the SQL schema once to initialise tables:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

Start the API:

```bash
npm run dev
```

The Eleventy site will automatically request `GET /api/styles/default` to hydrate CSS variables at runtime. When the backend is offline the front-end gracefully falls back to its baked-in palette.

## Deploying on DigitalOcean

1. **Managed Database** – Create a PostgreSQL cluster and load `database/schema.sql` using the SQL Console.
2. **App Platform** – Create a new App from this repository. Point the backend component to `/backend`, choose the `web service` type, and expose port `8080`.
3. **Environment Variables** – Add `DATABASE_URL`, `DATABASE_SSL=true`, and optionally `CORS_ORIGIN=https://gwingz.com,https://golden-wings-robyn.com`.
4. **Static Site** – Configure a second component pointing to the Eleventy build (`npm install && npm run build`). Use the backend service URL as the `apiBase` if you decide to proxy requests during builds.

## Extending Themes

- **Hero Copy** – Update `heroCopy` fields to swap taglines and supporting text that echo the film's compassionate aviation motif.
- **CSS Variables** – The front-end reads each entry under `cssVariables` and applies them directly to `document.documentElement`. This makes it simple to experiment with sunrise palettes, gold accents, or noir night-flight tones.
- **Mobile Layout** – Use `mobileLayout.hero.showVideo=false` to disable autoplay on smaller devices and control overlay intensity with `overlayOpacity`.

## Admin Integrations

The REST structure is intentionally simple so it can be wired to Netlify CMS, 11ty data pipelines, or custom DigitalOcean Functions. Each layer (controller → service → repository) is isolated for testing and maintenance, keeping future features such as authentication or analytics export self-contained.
