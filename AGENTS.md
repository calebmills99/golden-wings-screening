# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Golden Wings is a static site (Eleventy + Tailwind CSS) with a Google Apps Script serverless backend. The frontend builds and runs locally; the backend (Code.gs) runs only on Google's infrastructure.

### Development server

- `npm run dev` starts Eleventy at **http://localhost:8080/** with live reload and file watching.
- `npm run build` runs both Tailwind CSS (`build:css`) and Eleventy (`build:11ty`).
- The dev server does **not** build Tailwind CSS automatically. If you change Tailwind classes, run `npm run build:css` first or run `npm run watch:css` in a separate terminal.

### Backend (Google Apps Script)

- `Code.gs` cannot run locally — it deploys to script.google.com.
- The RSVP form on the Eleventy site posts to a remote Google Apps Script webhook URL. Locally, the form submission shows a client-side success message but does not reach a real backend.
- `test-webhook.sh` sends a curl POST to the deployed webhook for integration testing (requires the webhook URL to be configured).

### No linter configured

This project has no ESLint, Prettier, or other linter configured. There are no lint scripts in `package.json`.

### Key paths

- `src/` — Eleventy source (Nunjucks templates, CSS, data)
- `_site/` — Build output (gitignored)
- `.eleventy.js` — Eleventy config
- `tailwind.config.js` — Tailwind config
- See `CLAUDE.md` for full architecture and configuration details.
