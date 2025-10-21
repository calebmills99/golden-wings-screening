# Golden Wings Modular Backend

This backend powers the Golden Wings RSVP capture and theming API when the static Eleventy site is deployed on DigitalOcean App Platform.

## Features
- **PostgreSQL storage** for RSVPs and optional theme overrides.
- **Modular architecture** with dedicated folders for configuration, controllers, models, routes, services, and validators.
- **Theme API** that enables the static site and mobile experiences to adapt new visual styles without code changes.
- **Validation & security** middleware powered by Zod, Helmet, and configurable CORS rules.

## Getting started
1. Copy `.env.example` to `.env` and update the values for your DigitalOcean managed database.
2. Apply the SQL migrations located in `sql/001_create_tables.sql` to provision the `rsvps` and `themes` tables.
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run backend:start
   ```
4. Deploy the backend on DigitalOcean (App Platform or Droplet) and expose the `/api` base path.

## API overview

### `POST /api/rsvps`
Stores an RSVP submission. Request body must include `name` and `email`, and can optionally include `phone`, `specialRequests`, and `source`.

### `GET /api/rsvps`
Returns the latest RSVPs and the total count for admin dashboards.

### `GET /api/theme`
Responds with the active theme (tagline, motif, palette, and mobile CTA copy). If no theme is saved in the database, a film-inspired default is returned.

## Mobile-friendly enhancements
The `/api/theme` response feeds the Eleventy front-end so that CTA copy, palette accents, and the mobile sticky banner can evolve alongside new creative directions without rebuilding the site.
