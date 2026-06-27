# Vue Cloudflare Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Golden Wings screening site as a Vue/Vite funnel that uses presskit assets, captures leads for the watch link, preserves the Cloudflare Worker API, and avoids GitHub Pages as the deployment path.

**Architecture:** The Vue app owns the public funnel, confirmation page, and email-gated watch page. Cloudflare Worker endpoints remain the API spine for RSVP and watch-access logging. Presskit images and fonts are copied into `public/presskit/` with a small manifest so future design changes use stable asset names.

**Tech Stack:** Vue 3, Vite, Vue Router, TypeScript, Tailwind CSS, Vitest, Vue Test Utils, Cloudflare Wrangler, existing Cloudflare Worker.

## Global Constraints

- Use real film and presskit assets from `E:\GoldenWings\presskit`; do not rename, move, recompress, or overwrite source media in the presskit folder.
- Keep the primary phase-one conversion as name/email capture for a watch link.
- Preserve Worker endpoints: `POST /api/rsvp`, `POST /api/watch-access`, and `GET /health`.
- Do not require GitHub for normal deployment.
- Keep Auth0 by Okta integration isolated as a future-ready boundary; do not force login in phase one.
- No secrets in the Vue app.
- Use "synthetic media" when copy mentions reconstruction workflow; do not use "AI-generated."
- Tests cover core funnel behaviors before production code is changed.

---

## Design Direction

Subject: Golden Wings: Fifty Year Flight Path, a documentary funnel for viewers who may later purchase/download the film.

Audience: aviation-history viewers, documentary viewers, Robyn Stewart's community, festival/press visitors, and future buyers.

Single job: make visitors want the film enough to enter their email for the watch link.

Palette:

- `runway-night`: `#111827`
- `altitude-blue`: `#1E5AA8`
- `heritage-red`: `#B91C1C`
- `wing-gold`: `#D8A63F`
- `cloud-paper`: `#F7F2EA`
- `instrument-ink`: `#1F2933`

Typography:

- Display: `Miller-Display.otf` for cinematic section heads and emotional pull quotes.
- Utility/display accent: `HeadingNowTrial-67Extrabold.ttf` for labels, buttons, and cockpit-style callouts.
- Body: system sans stack first; optionally use local Helvetica only if licensing is acceptable for web deployment.

Signature element:

Use a "flight path" scroll structure: sections read like stages of a special screening flight, with subtle rule lines and checkpoint labels drawn from aviation language. This should encode the film's world, not decorate it.

Primary asset candidates:

- Hero/aviation texture: `E:\GoldenWings\presskit\Images\Stills_from_film\GW50YFP_still_AA_747_Postcard.png`
- Human story: `E:\GoldenWings\presskit\Images\Stills_from_film\GW50YFP_still_Robyn_Interview_Medium_closeupGW50YFP_still_Robyn_Interview_Medium_closeup.png`
- Brand title: `E:\GoldenWings\presskit\Images\Logo\GW50YFP_Title _Card.png`
- Poster/proof: `E:\GoldenWings\presskit\Images\Posters\GW50YFP_Forrest_Gump.png`
- Laurels: all four existing files under `E:\GoldenWings\presskit\Images\Laurels\`

Self-critique:

This avoids a generic dark streaming-app look by tying layout, copy rhythm, and visuals to aviation artifacts: 747 postcard, Robyn's uniform, flight-path language, and title-card gold. The aesthetic risk is using a premium "boarding/screening flight" structure without becoming kitschy; keep the UI restrained and let the assets do the lift.

---

## Planned File Structure

- `package.json`: replace Eleventy scripts with Vue/Vite, tests, build, preview, and Cloudflare deploy scripts.
- `index.html`: Vite app shell and metadata.
- `src/main.ts`: Vue app bootstrap.
- `src/App.vue`: top-level router outlet.
- `src/router.ts`: public routes.
- `src/content/filmOffer.ts`: copy, assets, embeds, and CTA labels.
- `src/services/cloudflareApi.ts`: API client for Worker endpoints.
- `src/auth/auth0Boundary.ts`: future Auth0 boundary, not active in phase one.
- `src/components/SiteLayout.vue`: shared layout and legal footer.
- `src/components/FunnelHero.vue`: hero section.
- `src/components/FilmStory.vue`: story/proof sections.
- `src/components/PreviewPlayer.vue`: preview embed component.
- `src/components/OfferCaptureForm.vue`: primary conversion form.
- `src/components/WatchGate.vue`: watch-page email gate.
- `src/components/ScreeningRoom.vue`: film player reveal.
- `src/pages/HomePage.vue`: composed funnel.
- `src/pages/WatchPage.vue`: watch route.
- `src/pages/ConfirmationPage.vue`: post-capture route.
- `src/styles/main.css`: Tailwind layers, fonts, tokens, and global styles.
- `src/test/setup.ts`: Vue test setup.
- `src/**/*.spec.ts`: component and service tests.
- `public/presskit/`: copied web assets with stable filenames.
- `public/presskit/asset-manifest.json`: maps stable filenames to source paths.
- `wrangler.toml`: update or preserve Worker deploy config; add Pages guidance if needed.
- `docs/deployment-cloudflare.md`: local/Cloudflare deployment path.

---

### Task 1: Curate Presskit Assets Into Stable Public Paths

**Files:**
- Create: `public/presskit/asset-manifest.json`
- Copy assets into: `public/presskit/images/`
- Copy fonts into: `public/presskit/fonts/`
- Modify: `.gitignore`

**Interfaces:**
- Produces: public asset paths such as `/presskit/images/aa-747-postcard.png`, consumed by `src/content/filmOffer.ts`.
- Produces: local font paths such as `/presskit/fonts/miller-display.otf`, consumed by `src/styles/main.css`.

- [ ] **Step 1: Write the asset manifest**

Create `public/presskit/asset-manifest.json` with:

```json
{
  "images": {
    "aa747Postcard": {
      "publicPath": "/presskit/images/aa-747-postcard.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Stills_from_film/GW50YFP_still_AA_747_Postcard.png",
      "usage": "Hero background and aviation-history section"
    },
    "robynInterview": {
      "publicPath": "/presskit/images/robyn-interview.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Stills_from_film/GW50YFP_still_Robyn_Interview_Medium_closeupGW50YFP_still_Robyn_Interview_Medium_closeup.png",
      "usage": "Human story section"
    },
    "titleCard": {
      "publicPath": "/presskit/images/golden-wings-title-card.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Logo/GW50YFP_Title _Card.png",
      "usage": "Brand title treatment"
    },
    "poster": {
      "publicPath": "/presskit/images/golden-wings-poster.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Posters/GW50YFP_Forrest_Gump.png",
      "usage": "Poster/proof section"
    },
    "laurelMobileShort": {
      "publicPath": "/presskit/images/laurel-best-mobile-short.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Laurels/Laurel_BEST MOBILE SHORT - Independent Shorts Awards - 2024.png",
      "usage": "Proof strip"
    },
    "laurelFinalist": {
      "publicPath": "/presskit/images/laurel-finalist-beyond-hollywood.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Laurels/Laurel_FINALIST - Beyond Hollywood International Film Festival - 2025.png",
      "usage": "Proof strip"
    },
    "laurelCinematography": {
      "publicPath": "/presskit/images/laurel-best-cinematography.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Laurels/Laurel_BEST_SHORT_CINEMATOGRAPHY_SILICON_BEACH.png",
      "usage": "Proof strip"
    },
    "laurelMagicFancy": {
      "publicPath": "/presskit/images/laurel-magic-fancy-director.png",
      "sourcePath": "E:/GoldenWings/presskit/Images/Laurels/Laurel_MAGIC FANCY DIRECTOR.png",
      "usage": "Proof strip"
    }
  },
  "fonts": {
    "millerDisplay": {
      "publicPath": "/presskit/fonts/miller-display.otf",
      "sourcePath": "E:/GoldenWings/presskit/Fonts/Miller-Display.otf"
    },
    "headingNowExtraBold": {
      "publicPath": "/presskit/fonts/heading-now-extra-bold.ttf",
      "sourcePath": "E:/GoldenWings/presskit/Fonts/HeadingNowTrial-67Extrabold.ttf"
    }
  }
}
```

- [ ] **Step 2: Copy the referenced assets**

Run in PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path .\public\presskit\images, .\public\presskit\fonts | Out-Null
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Stills_from_film\GW50YFP_still_AA_747_Postcard.png" -Destination ".\public\presskit\images\aa-747-postcard.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Stills_from_film\GW50YFP_still_Robyn_Interview_Medium_closeupGW50YFP_still_Robyn_Interview_Medium_closeup.png" -Destination ".\public\presskit\images\robyn-interview.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Logo\GW50YFP_Title _Card.png" -Destination ".\public\presskit\images\golden-wings-title-card.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Posters\GW50YFP_Forrest_Gump.png" -Destination ".\public\presskit\images\golden-wings-poster.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Laurels\Laurel_BEST MOBILE SHORT - Independent Shorts Awards - 2024.png" -Destination ".\public\presskit\images\laurel-best-mobile-short.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Laurels\Laurel_FINALIST - Beyond Hollywood International Film Festival - 2025.png" -Destination ".\public\presskit\images\laurel-finalist-beyond-hollywood.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Laurels\Laurel_BEST_SHORT_CINEMATOGRAPHY_SILICON_BEACH.png" -Destination ".\public\presskit\images\laurel-best-cinematography.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Images\Laurels\Laurel_MAGIC FANCY DIRECTOR.png" -Destination ".\public\presskit\images\laurel-magic-fancy-director.png"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Fonts\Miller-Display.otf" -Destination ".\public\presskit\fonts\miller-display.otf"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Fonts\HeadingNowTrial-67Extrabold.ttf" -Destination ".\public\presskit\fonts\heading-now-extra-bold.ttf"
```

Expected: all copied files exist under `public/presskit`.

- [ ] **Step 3: Verify manifest paths**

Run:

```powershell
Get-Content .\public\presskit\asset-manifest.json | ConvertFrom-Json | Out-Null
Test-Path .\public\presskit\images\aa-747-postcard.png
Test-Path .\public\presskit\fonts\miller-display.otf
```

Expected: JSON parse succeeds and both `Test-Path` commands print `True`.

- [ ] **Step 4: Commit**

```bash
git add public/presskit .gitignore
git commit -m "chore: add curated presskit assets"
```

---

### Task 2: Replace Eleventy Tooling With Vue/Vite Testable Scaffold

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/router.ts`
- Create: `src/styles/main.css`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: a Vue app entry mounted at `#app`.
- Produces: route names `home`, `watch`, and `confirmation`.
- Produces: `npm run test`, `npm run build`, `npm run dev`, and `npm run deploy:pages`.

- [ ] **Step 1: Install dependencies**

Run:

```powershell
npm install vue@latest vue-router@latest @vitejs/plugin-vue@latest vite@latest typescript@latest vitest@latest jsdom@latest @vue/test-utils@latest
```

Expected: packages install and `package-lock.json` updates.

- [ ] **Step 2: Update `package.json` scripts**

Replace the script block with:

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "deploy:pages": "npm run build && wrangler pages deploy dist --project-name golden-wings-screening"
  }
}
```

Add dev dependency `vue-tsc` if missing:

```powershell
npm install -D vue-tsc
```

- [ ] **Step 3: Write the first failing route test**

Create `src/App.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import { routes } from './router'

describe('App routing', () => {
  it('renders the home funnel route', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('Golden Wings')
    expect(wrapper.text()).toContain('Get the watch link')
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run:

```powershell
npm run test -- src/App.spec.ts
```

Expected: FAIL because `App.vue` or `routes` does not yet render the funnel copy.

- [ ] **Step 5: Add minimal Vue scaffold**

Create `src/router.ts`:

```ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const HomePage = { template: '<main><h1>Golden Wings</h1><a href="#offer">Get the watch link</a></main>' }
const WatchPage = { template: '<main><h1>Watch Golden Wings</h1></main>' }
const ConfirmationPage = { template: '<main><h1>Check your email</h1></main>' }

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/watch', name: 'watch', component: WatchPage },
  { path: '/confirmation', name: 'confirmation', component: ConfirmationPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

Create `src/App.vue`:

```vue
<template>
  <RouterView />
</template>
```

Create `src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

createApp(App).use(router).mount('#app')
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Watch Golden Wings: Fifty Year Flight Path." />
    <title>Golden Wings</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

If `@testing-library/jest-dom` is not installed, run:

```powershell
npm install -D @testing-library/jest-dom
```

Create `src/styles/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Miller Display";
  src: url("/presskit/fonts/miller-display.otf") format("opentype");
  font-display: swap;
}

@font-face {
  font-family: "Heading Now";
  src: url("/presskit/fonts/heading-now-extra-bold.ttf") format("truetype");
  font-display: swap;
}

:root {
  --runway-night: #111827;
  --altitude-blue: #1e5aa8;
  --heritage-red: #b91c1c;
  --wing-gold: #d8a63f;
  --cloud-paper: #f7f2ea;
  --instrument-ink: #1f2933;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--cloud-paper);
  color: var(--instrument-ink);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 6: Run test and build**

Run:

```powershell
npm run test -- src/App.spec.ts
npm run build
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json src
git commit -m "feat: scaffold Vue funnel app"
```

---

### Task 3: Add Offer Content and Cloudflare API Client

**Files:**
- Create: `src/content/filmOffer.ts`
- Create: `src/services/cloudflareApi.ts`
- Create: `src/services/cloudflareApi.spec.ts`
- Create: `src/auth/auth0Boundary.ts`

**Interfaces:**
- Produces: `filmOffer` object consumed by page/components.
- Produces: `createCloudflareApiClient(config)` with `submitOfferCapture(payload)` and `logWatchAccess(payload)`.
- Produces: `auth0Boundary` future methods that are intentionally inactive.

- [ ] **Step 1: Write failing API client tests**

Create `src/services/cloudflareApi.spec.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCloudflareApiClient } from './cloudflareApi'

describe('createCloudflareApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('posts offer capture payloads to /api/rsvp', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com/',
      fetchImpl: fetchMock
    })

    await client.submitOfferCapture({
      name: 'Robyn Stewart',
      email: 'robyn@example.com',
      phone: '',
      source: 'Press kit',
      honeypot: ''
    })

    expect(fetchMock).toHaveBeenCalledWith('https://worker.example.com/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Robyn Stewart',
        email: 'robyn@example.com',
        phone: '',
        source: 'Press kit',
        'hp-check': ''
      })
    })
  })

  it('posts watch access analytics to /api/watch-access', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com',
      fetchImpl: fetchMock
    })

    await client.logWatchAccess({
      email: 'viewer@example.com',
      honeypot: '',
      page: 'watch'
    })

    const call = fetchMock.mock.calls[0]
    expect(call[0]).toBe('https://worker.example.com/api/watch-access')
    expect(JSON.parse(call[1].body)).toMatchObject({
      type: 'watch_access',
      email: 'viewer@example.com',
      page: 'watch',
      'hp-check-watch': ''
    })
  })

  it('throws the worker error message when submission fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, error: 'Valid email is required' })
    })
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com',
      fetchImpl: fetchMock
    })

    await expect(client.submitOfferCapture({
      name: 'Robyn',
      email: 'bad',
      phone: '',
      source: '',
      honeypot: ''
    })).rejects.toThrow('Valid email is required')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
npm run test -- src/services/cloudflareApi.spec.ts
```

Expected: FAIL because `cloudflareApi.ts` does not exist.

- [ ] **Step 3: Implement API client**

Create `src/services/cloudflareApi.ts`:

```ts
export interface OfferCapturePayload {
  name: string
  email: string
  phone: string
  source: string
  honeypot: string
}

export interface WatchAccessPayload {
  email: string
  honeypot: string
  page: 'watch'
}

export interface CloudflareApiClient {
  submitOfferCapture(payload: OfferCapturePayload): Promise<void>
  logWatchAccess(payload: WatchAccessPayload): Promise<void>
}

interface CloudflareApiClientConfig {
  baseUrl: string
  fetchImpl?: typeof fetch
}

interface WorkerResponse {
  success?: boolean
  error?: string
}

export function createCloudflareApiClient(config: CloudflareApiClientConfig): CloudflareApiClient {
  const baseUrl = config.baseUrl.replace(/\/+$/, '')
  const fetchImpl = config.fetchImpl ?? fetch

  async function post(path: string, body: Record<string, unknown>) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const result = (await response.json()) as WorkerResponse

    if (!response.ok || result.success === false) {
      throw new Error(result.error || 'Submission failed')
    }
  }

  return {
    submitOfferCapture(payload) {
      return post('/api/rsvp', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        source: payload.source,
        'hp-check': payload.honeypot
      })
    },
    logWatchAccess(payload) {
      return post('/api/watch-access', {
        type: 'watch_access',
        email: payload.email,
        timestamp: new Date().toISOString(),
        page: payload.page,
        'hp-check-watch': payload.honeypot
      })
    }
  }
}

export const cloudflareApi = createCloudflareApiClient({
  baseUrl: import.meta.env.VITE_WORKER_API_BASE_URL || 'https://gwingz-worker.calebmills99.workers.dev'
})
```

- [ ] **Step 4: Add offer content**

Create `src/content/filmOffer.ts`:

```ts
export const filmOffer = {
  title: 'Golden Wings',
  fullTitle: 'Golden Wings: Fifty Year Flight Path',
  tagline: 'Find Your WINGS',
  eyebrow: 'A private screening flight through aviation history',
  hero: {
    headline: 'Fifty years in the air. One family story that refused to stay grounded.',
    body: 'Robyn Stewart began flying for American Airlines in 1971. Golden Wings turns that career into a warm, cinematic invitation: board the story, meet the people who shaped it, and watch the film free for now.',
    primaryCta: 'Get the watch link',
    secondaryCta: 'Enter the screening room'
  },
  story: {
    heading: 'A film about service, family, and what we inherit.',
    paragraphs: [
      'Robyn Stewart carried more than passengers. She carried a family legacy that reaches back to Jay R. Ricks and the 747 training program.',
      'The film traces aviation history through the people who lived it: uniforms, routes, recovery, grief, resilience, and the strange magic of staying in motion.'
    ]
  },
  proof: {
    heading: 'A festival-tested short with a long flight path.',
    items: [
      'Best Mobile Short',
      'Best Short Cinematography',
      'Festival finalist',
      'Directed by Caleb Mills Stewart'
    ]
  },
  offer: {
    heading: 'Get the watch link',
    body: 'Enter your name and email. We will send the screening link now, and later this same list becomes the first boarding group for the download release.',
    submitLabel: 'Send my watch link',
    success: 'You are on the list. Check your email for the watch link.',
    error: 'The link could not be sent. Check your email address or contact info@golden-wings-robyn.com.'
  },
  watch: {
    heading: 'Access your screening',
    body: 'Enter your email to open the screening room.',
    submitLabel: 'Open screening room',
    embedUrl: 'https://www.youtube.com/embed/RzkdMRHRblU'
  },
  contactEmail: 'info@golden-wings-robyn.com',
  assets: {
    aa747Postcard: '/presskit/images/aa-747-postcard.png',
    robynInterview: '/presskit/images/robyn-interview.png',
    titleCard: '/presskit/images/golden-wings-title-card.png',
    poster: '/presskit/images/golden-wings-poster.png',
    laurels: [
      '/presskit/images/laurel-best-mobile-short.png',
      '/presskit/images/laurel-finalist-beyond-hollywood.png',
      '/presskit/images/laurel-best-cinematography.png',
      '/presskit/images/laurel-magic-fancy-director.png'
    ]
  }
} as const
```

- [ ] **Step 5: Add Auth0 boundary stub**

Create `src/auth/auth0Boundary.ts`:

```ts
export interface Auth0RuntimeConfig {
  domain?: string
  clientId?: string
  audience?: string
}

export function getAuth0RuntimeConfig(): Auth0RuntimeConfig {
  return {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE
  }
}

export function isAuth0Configured(config = getAuth0RuntimeConfig()): boolean {
  return Boolean(config.domain && config.clientId)
}
```

- [ ] **Step 6: Run tests**

Run:

```powershell
npm run test -- src/services/cloudflareApi.spec.ts
npm run build
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/content src/services src/auth
git commit -m "feat: add funnel content and Cloudflare API client"
```

---

### Task 4: Build the Public Funnel Components

**Files:**
- Create: `src/components/SiteLayout.vue`
- Create: `src/components/FunnelHero.vue`
- Create: `src/components/FilmStory.vue`
- Create: `src/components/PreviewPlayer.vue`
- Create: `src/components/OfferCaptureForm.vue`
- Create: `src/pages/HomePage.vue`
- Modify: `src/router.ts`
- Create: `src/components/OfferCaptureForm.spec.ts`
- Create: `src/pages/HomePage.spec.ts`

**Interfaces:**
- Consumes: `filmOffer` and `cloudflareApi`.
- Produces: homepage with `#offer` capture target.
- Produces: form event `captured` after successful submit.

- [ ] **Step 1: Write failing form tests**

Create `src/components/OfferCaptureForm.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OfferCaptureForm from './OfferCaptureForm.vue'

describe('OfferCaptureForm', () => {
  it('requires name and email before submitting', async () => {
    const submitOfferCapture = vi.fn()
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(submitOfferCapture).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Enter your name and email')
  })

  it('submits lead payloads and shows success', async () => {
    const submitOfferCapture = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.find('#offer-name').setValue('Robyn Stewart')
    await wrapper.find('#offer-email').setValue('robyn@example.com')
    await wrapper.find('#offer-source').setValue('Friend')
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitOfferCapture).toHaveBeenCalledWith({
      name: 'Robyn Stewart',
      email: 'robyn@example.com',
      phone: '',
      source: 'Friend',
      honeypot: ''
    })
    expect(wrapper.text()).toContain('Check your email')
    expect(wrapper.emitted('captured')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
npm run test -- src/components/OfferCaptureForm.spec.ts
```

Expected: FAIL because `OfferCaptureForm.vue` does not exist.

- [ ] **Step 3: Implement `OfferCaptureForm.vue`**

Create `src/components/OfferCaptureForm.vue`:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { filmOffer } from '../content/filmOffer'
import { cloudflareApi, type CloudflareApiClient } from '../services/cloudflareApi'

const props = withDefaults(defineProps<{
  api?: Pick<CloudflareApiClient, 'submitOfferCapture'>
}>(), {
  api: () => cloudflareApi
})

const emit = defineEmits<{
  captured: []
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  source: '',
  honeypot: ''
})

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')

async function submit() {
  if (!form.name.trim() || !form.email.trim()) {
    status.value = 'error'
    message.value = 'Enter your name and email to get the watch link.'
    return
  }

  status.value = 'loading'
  message.value = ''

  try {
    await props.api.submitOfferCapture({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      source: form.source.trim(),
      honeypot: form.honeypot
    })
    status.value = 'success'
    message.value = 'Check your email for the watch link.'
    emit('captured')
  } catch {
    status.value = 'error'
    message.value = filmOffer.offer.error
  }
}
</script>

<template>
  <form class="offer-form" @submit.prevent="submit">
    <div>
      <label for="offer-name">Name</label>
      <input id="offer-name" v-model="form.name" name="name" autocomplete="name" />
    </div>
    <div>
      <label for="offer-email">Email</label>
      <input id="offer-email" v-model="form.email" name="email" type="email" autocomplete="email" />
    </div>
    <div>
      <label for="offer-phone">Phone</label>
      <input id="offer-phone" v-model="form.phone" name="phone" type="tel" autocomplete="tel" />
    </div>
    <div>
      <label for="offer-source">How did you hear about Golden Wings?</label>
      <input id="offer-source" v-model="form.source" name="source" />
    </div>
    <div class="hp-field" aria-hidden="true">
      <label for="offer-hp">Leave this field blank</label>
      <input id="offer-hp" v-model="form.honeypot" name="hp-check" tabindex="-1" autocomplete="off" />
    </div>
    <button type="submit" :disabled="status === 'loading'">
      {{ status === 'loading' ? 'Sending...' : filmOffer.offer.submitLabel }}
    </button>
    <p v-if="message" role="status">{{ message }}</p>
  </form>
</template>
```

- [ ] **Step 4: Implement layout and funnel components**

Create components that consume `filmOffer` and public asset paths. Keep component markup focused:

```vue
<!-- src/components/SiteLayout.vue -->
<template>
  <div class="site-shell">
    <slot />
    <footer class="site-footer">
      <a href="https://www.golden-wings-robyn.com/privacy-policy">Privacy Policy</a>
      <a href="https://www.golden-wings-robyn.com/terms-of-use">Terms of Use</a>
    </footer>
  </div>
</template>
```

```vue
<!-- src/components/FunnelHero.vue -->
<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="funnel-hero">
    <img class="hero-bg" :src="filmOffer.assets.aa747Postcard" alt="" />
    <div class="hero-copy">
      <p>{{ filmOffer.eyebrow }}</p>
      <img :src="filmOffer.assets.titleCard" :alt="filmOffer.fullTitle" />
      <h1>{{ filmOffer.hero.headline }}</h1>
      <p>{{ filmOffer.hero.body }}</p>
      <a href="#offer">{{ filmOffer.hero.primaryCta }}</a>
    </div>
  </section>
</template>
```

```vue
<!-- src/pages/HomePage.vue -->
<script setup lang="ts">
import SiteLayout from '../components/SiteLayout.vue'
import FunnelHero from '../components/FunnelHero.vue'
import FilmStory from '../components/FilmStory.vue'
import PreviewPlayer from '../components/PreviewPlayer.vue'
import OfferCaptureForm from '../components/OfferCaptureForm.vue'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <SiteLayout>
    <FunnelHero />
    <FilmStory />
    <PreviewPlayer />
    <section id="offer" class="offer-section">
      <div>
        <p>Now boarding</p>
        <h2>{{ filmOffer.offer.heading }}</h2>
        <p>{{ filmOffer.offer.body }}</p>
      </div>
      <OfferCaptureForm />
    </section>
  </SiteLayout>
</template>
```

- [ ] **Step 5: Update router to real pages**

Replace the temporary route components in `src/router.ts`:

```ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import WatchPage from './pages/WatchPage.vue'
import ConfirmationPage from './pages/ConfirmationPage.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/watch', name: 'watch', component: WatchPage },
  { path: '/confirmation', name: 'confirmation', component: ConfirmationPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

- [ ] **Step 6: Add production CSS for the public funnel**

Extend `src/styles/main.css` with stable classes:

```css
.site-shell {
  min-height: 100vh;
  background: var(--cloud-paper);
}

.site-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  font-size: 0.875rem;
}

.funnel-hero {
  position: relative;
  min-height: 92vh;
  overflow: hidden;
  display: grid;
  align-items: end;
  color: white;
  background: var(--runway-night);
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
}

.hero-copy {
  position: relative;
  max-width: 760px;
  padding: 8rem clamp(1.5rem, 6vw, 7rem);
}

.hero-copy h1,
.offer-section h2 {
  font-family: "Miller Display", Georgia, serif;
}

.hero-copy a,
.offer-form button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  border: 0;
  background: var(--wing-gold);
  color: #111827;
  font-family: "Heading Now", Impact, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0;
  padding: 0.9rem 1.25rem;
}

.offer-section {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(280px, 440px);
  gap: clamp(2rem, 5vw, 5rem);
  padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem);
  background: white;
}

.offer-form {
  display: grid;
  gap: 1rem;
}

.offer-form label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 700;
}

.offer-form input {
  width: 100%;
  box-sizing: border-box;
  min-height: 2.9rem;
  border: 1px solid #c7cbd1;
  padding: 0.75rem;
}

.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

@media (max-width: 760px) {
  .offer-section {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run component tests and build**

Run:

```powershell
npm run test -- src/components/OfferCaptureForm.spec.ts src/App.spec.ts
npm run build
```

Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: build public Golden Wings funnel"
```

---

### Task 5: Build Watch and Confirmation Routes

**Files:**
- Create: `src/components/WatchGate.vue`
- Create: `src/components/ScreeningRoom.vue`
- Create: `src/components/WatchGate.spec.ts`
- Create: `src/pages/WatchPage.vue`
- Create: `src/pages/ConfirmationPage.vue`

**Interfaces:**
- Consumes: `cloudflareApi.logWatchAccess`.
- Produces: email gate that reveals `ScreeningRoom`.

- [ ] **Step 1: Write failing watch gate tests**

Create `src/components/WatchGate.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WatchGate from './WatchGate.vue'

describe('WatchGate', () => {
  it('requires an email before opening the screening room', async () => {
    const logWatchAccess = vi.fn()
    const wrapper = mount(WatchGate, {
      props: { api: { logWatchAccess } }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(logWatchAccess).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Enter your email')
  })

  it('logs access and emits unlocked for a valid email', async () => {
    const logWatchAccess = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(WatchGate, {
      props: { api: { logWatchAccess } }
    })

    await wrapper.find('#viewer-email').setValue('viewer@example.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(logWatchAccess).toHaveBeenCalledWith({
      email: 'viewer@example.com',
      honeypot: '',
      page: 'watch'
    })
    expect(wrapper.emitted('unlocked')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
npm run test -- src/components/WatchGate.spec.ts
```

Expected: FAIL because `WatchGate.vue` does not exist.

- [ ] **Step 3: Implement `WatchGate.vue` and `ScreeningRoom.vue`**

Create `src/components/WatchGate.vue`:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { filmOffer } from '../content/filmOffer'
import { cloudflareApi, type CloudflareApiClient } from '../services/cloudflareApi'

const props = withDefaults(defineProps<{
  api?: Pick<CloudflareApiClient, 'logWatchAccess'>
}>(), {
  api: () => cloudflareApi
})

const emit = defineEmits<{
  unlocked: []
}>()

const form = reactive({ email: '', honeypot: '' })
const message = ref('')
const loading = ref(false)

async function submit() {
  if (!form.email.trim()) {
    message.value = 'Enter your email to open the screening room.'
    return
  }

  loading.value = true
  try {
    await props.api.logWatchAccess({
      email: form.email.trim(),
      honeypot: form.honeypot,
      page: 'watch'
    })
  } catch {
    // Access should remain frictionless in phase one even if analytics fails.
  } finally {
    loading.value = false
    emit('unlocked')
  }
}
</script>

<template>
  <form class="watch-gate" @submit.prevent="submit">
    <h1>{{ filmOffer.watch.heading }}</h1>
    <p>{{ filmOffer.watch.body }}</p>
    <label for="viewer-email">Email</label>
    <input id="viewer-email" v-model="form.email" type="email" autocomplete="email" />
    <div class="hp-field" aria-hidden="true">
      <label for="watch-hp">Leave this field blank</label>
      <input id="watch-hp" v-model="form.honeypot" tabindex="-1" autocomplete="off" />
    </div>
    <button type="submit" :disabled="loading">{{ loading ? 'Opening...' : filmOffer.watch.submitLabel }}</button>
    <p v-if="message" role="status">{{ message }}</p>
  </form>
</template>
```

Create `src/components/ScreeningRoom.vue`:

```vue
<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="screening-room">
    <div class="screening-frame">
      <iframe
        :src="filmOffer.watch.embedUrl"
        title="Golden Wings Documentary"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
    <p>Welcome aboard. Push play when you are ready.</p>
    <a :href="`mailto:${filmOffer.contactEmail}`">Contact the flight crew</a>
  </section>
</template>
```

- [ ] **Step 4: Implement pages**

Create `src/pages/WatchPage.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SiteLayout from '../components/SiteLayout.vue'
import WatchGate from '../components/WatchGate.vue'
import ScreeningRoom from '../components/ScreeningRoom.vue'

const unlocked = ref(false)
</script>

<template>
  <SiteLayout>
    <main class="watch-page">
      <WatchGate v-if="!unlocked" @unlocked="unlocked = true" />
      <ScreeningRoom v-else />
    </main>
  </SiteLayout>
</template>
```

Create `src/pages/ConfirmationPage.vue`:

```vue
<script setup lang="ts">
import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <main class="confirmation-page">
      <p>Access confirmed</p>
      <h1>Check your email for the watch link.</h1>
      <p>You can also go straight to the screening room and enter your email there.</p>
      <RouterLink to="/watch">Open screening room</RouterLink>
      <RouterLink to="/">Return to the flight path</RouterLink>
    </main>
  </SiteLayout>
</template>
```

- [ ] **Step 5: Add route CSS**

Add to `src/styles/main.css`:

```css
.watch-page,
.confirmation-page {
  min-height: 90vh;
  display: grid;
  place-items: center;
  padding: clamp(2rem, 6vw, 6rem);
  background: var(--runway-night);
  color: white;
}

.watch-gate,
.confirmation-page {
  width: min(100%, 520px);
}

.screening-room {
  width: min(100%, 1100px);
}

.screening-frame {
  aspect-ratio: 16 / 9;
  background: black;
}

.screening-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm run test -- src/components/WatchGate.spec.ts src/components/OfferCaptureForm.spec.ts
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add watch and confirmation flows"
```

---

### Task 6: Cloudflare-First Deployment Documentation and Config

**Files:**
- Modify: `wrangler.toml`
- Create: `docs/deployment-cloudflare.md`
- Modify: `README.md`

**Interfaces:**
- Produces: documented deployment path that does not require GitHub.
- Preserves: Worker deploy via `wrangler deploy`.
- Produces: Pages deploy via `npm run deploy:pages`.

- [ ] **Step 1: Update README deployment summary**

Add this section to `README.md`:

```md
## Cloudflare-first deployment

The Vue app is built with Vite and can be deployed without GitHub:

```bash
npm install
npm run build
npm run deploy:pages
```

The RSVP/watch API remains in `gwingz-worker.js` and deploys with:

```bash
wrangler deploy
```

Set `RESEND_API_KEY` as a Worker secret before deploying email behavior:

```bash
wrangler secret put RESEND_API_KEY
```
```

- [ ] **Step 2: Create deployment doc**

Create `docs/deployment-cloudflare.md`:

```md
# Cloudflare Deployment

This project should not depend on GitHub Pages for normal deployment.

## Public Vue app

Build and upload with Cloudflare Pages Direct Upload:

```bash
npm install
npm run build
npm run deploy:pages
```

The build output is `dist/`.

## Worker API

Deploy the RSVP/watch API:

```bash
wrangler deploy
```

Required secret:

```bash
wrangler secret put RESEND_API_KEY
```

Optional vars:

- `FROM_EMAIL`
- `RSVP_SUBMISSIONS` KV binding

## Environment variables

Create `.env.local` for local frontend development:

```bash
VITE_WORKER_API_BASE_URL=https://gwingz-worker.calebmills99.workers.dev
```

Future Auth0 values should use:

```bash
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
```

Do not put secrets in Vite variables.
```

- [ ] **Step 3: Verify deploy scripts**

Run:

```powershell
npm run build
npx wrangler --version
```

Expected: build passes and Wrangler prints a version.

- [ ] **Step 4: Commit**

```bash
git add README.md docs/deployment-cloudflare.md wrangler.toml package.json package-lock.json
git commit -m "docs: add Cloudflare deployment path"
```

---

### Task 7: Deprecate Eleventy/GitHub Pages Output After Vue Build Is Green

**Files:**
- Modify: `.eleventy.js` or delete it if no longer used
- Modify: `src/_layouts/base.njk` and old `.njk` files only if keeping as archive notes
- Modify: `docs/` generated output handling
- Modify: `.gitignore`

**Interfaces:**
- Produces: no normal development dependency on Eleventy.
- Preserves: Cloudflare Worker and Apps Script files until explicitly retired.

- [ ] **Step 1: Confirm Vue build output is the deployment artifact**

Run:

```powershell
npm run build
Get-ChildItem .\dist
```

Expected: `dist/index.html` and built assets exist.

- [ ] **Step 2: Remove Eleventy dependencies**

Run:

```powershell
npm uninstall @11ty/eleventy
```

Expected: `package.json` and `package-lock.json` no longer include `@11ty/eleventy`.

- [ ] **Step 3: Decide old generated docs handling**

If the Cloudflare Pages deploy path is working, add this to `.gitignore`:

```gitignore
dist/
```

Leave `docs/` committed for now unless the user explicitly approves deleting historical generated output.

- [ ] **Step 4: Run final verification**

Run:

```powershell
npm run test
npm run build
git status --short
```

Expected: tests pass, build passes, and only intentional cleanup files are changed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: deprecate Eleventy build path"
```

---

## Self-Review

Spec coverage:

- Vue/Vite funnel: Tasks 2, 4, and 5.
- Email/name capture for watch link: Tasks 3 and 4.
- Watch page email gate and logging: Task 5.
- Cloudflare Worker API preservation: Tasks 3 and 6.
- Cloudflare-first deployment without GitHub: Task 6.
- Auth0-ready future boundary: Task 3.
- Presskit asset usage: Task 1 and Task 4.
- Tests before production code: Tasks 2, 3, 4, and 5.

Red-flag wording scan:

- No incomplete-work markers are present.
- Future Auth0 and purchase/download are explicitly out of active phase-one behavior and isolated by config/boundaries.

Type consistency:

- `CloudflareApiClient`, `OfferCapturePayload`, and `WatchAccessPayload` are defined in Task 3 and consumed with matching names in Tasks 4 and 5.
- Route names and paths are defined once in `src/router.ts`.
- Asset public paths are defined in Task 1 and consumed in Task 3 content.
