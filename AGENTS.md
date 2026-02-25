# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Golden Wings Documentary Screening RSVP System — an Eleventy (11ty) static site with Tailwind CSS for the frontend. Backend services (Google Apps Script via `Code.gs`, Cloudflare Worker via `gwingz-worker.js`) are cloud-only and cannot be run locally. See `CLAUDE.md` and `README.md` for full architecture details.

### Running the dev server

```bash
npm run dev        # Eleventy dev server on http://localhost:8080
npm run build      # Full production build (Tailwind CSS + Eleventy)
npm run build:css  # Tailwind CSS only
```

### Key caveats

- **No test suite exists.** There are no unit tests, integration tests, or test frameworks configured. Manual testing via the browser is the primary validation method.
- **No linter configured.** The project has no ESLint, Prettier, or other linting tools set up.
- **Form submission targets a remote Cloudflare Worker** (`webhookUrl` in `src/_data/site.json`). The form UI works locally but actual email delivery requires the remote worker + Resend API key.
- **Tailwind CSS must be built separately** when not using `npm run build`. The `npm run dev` command only runs Eleventy's serve mode; to also watch CSS changes, run `npm run watch:css` in a separate terminal.
- **No pre-commit hooks or CI/CD** pipelines are configured in this repository.
