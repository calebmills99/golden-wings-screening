# Vue Cloudflare Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Rebuild Golden Wings as a Vue funnel that turns a visitor into a viewer by collecting a name and email, sending the watch link, and opening an email-gated screening room.[^1]

**Architecture:** A Vue 3 single-page app owns the public funnel, confirmation route, and screening room. The existing Cloudflare Worker remains the API and email boundary, with its public-site URL moved to Worker configuration so emailed links no longer point at GitHub Pages. Cloudflare Pages Direct Upload deploys the Vue build without a GitHub dependency.[^1][^2]

**Tech stack:** Vue 3.5.40, Vue Router 4.6.4, TypeScript 6.0.2 via `"typescript": "npm:@typescript/typescript6@6.0.2"`, Vite 8.1.5, Tailwind CSS 3.4.18, Vitest 4.1.10, Vue Test Utils 2.4.11, Playwright 1.61.1, Wrangler 4.111.0, and the existing Cloudflare Worker.[^5][^6]

**Vue toolchain note:** TypeScript 7.0 does not ship a programmatic API; use the TypeScript 6 compatibility alias for Vue/Volar tooling such as `vue-tsc`.[^6]

## Global constraints

- Keep phase one focused on name and email capture for a watch link. No checkout, payment, entitlement, or download delivery.
- Preserve POST /api/rsvp, POST /api/watch-access, GET /health, Resend email behavior, and honeypot behavior.
- Use Cloudflare Pages Direct Upload and Wrangler. Normal deployment must not require GitHub.
- Keep Auth0 by Okta configuration isolated under src/auth. Do not force viewer login in phase one.
- Use the canonical title Golden Wings: Fifty Year Flight Path and facts from the presskit fact sheet. Do not publish a runtime because the current cut is not confirmed.[^3]
- Use real film, archival, and presskit assets. Source media under E:\GoldenWings\presskit remains untouched; only optimized derivatives are written into this repository.[^4]
- Use "synthetic media" if reconstruction work appears in copy.
- Use straight quotes and no em dashes in public copy.
- Write tests before production behavior for every testable task.
- Do not remove the Cloudflare Worker, Apps Script files, Webflow artifacts, or generated docs snapshot in this phase.

---

## File map

- package.json: Vue, test, build, preview, and Cloudflare deployment commands.
- index.html: Vite app shell, metadata, and the existing Google Tag Manager container.
- vite.config.ts: Vue and Vitest configuration.
- tsconfig.json: strict browser TypeScript configuration.
- tailwind.config.cjs and postcss.config.cjs: Vue-aware Tailwind pipeline.
- public/_redirects: explicit Cloudflare Pages SPA fallback.
- public/media/: optimized film imagery, laurels, poster, and local display fonts.
- src/main.ts: Vue bootstrap.
- src/App.vue: top-level router outlet.
- src/router.ts: route records, page titles, and router factory for tests.
- src/content/filmOffer.ts: verified public copy, media paths, CTA labels, embeds, and contact data.
- src/domain/leadValidation.ts: shared name and email validation.
- src/services/cloudflareApi.ts: typed Worker client.
- src/auth/auth0Config.ts: inactive phase-one Auth0 configuration boundary.
- src/components/SiteLayout.vue: shared shell, header, skip link, and footer.
- src/components/OfferCTA.vue: reusable conversion link.
- src/components/FunnelHero.vue: first-viewport film signal.
- src/components/FilmStory.vue: 1971-to-present family and aviation sequence.
- src/components/PreviewPlayer.vue: lazy Cloudflare Stream preview.
- src/components/OfferCaptureForm.vue: name and email conversion.
- src/components/WatchGate.vue: email gate and access logging.
- src/components/ScreeningRoom.vue: full film embed and contact path.
- src/pages/HomePage.vue: complete funnel.
- src/pages/WatchPage.vue: screening route.
- src/pages/ConfirmationPage.vue: post-capture route.
- src/styles/main.css: tokens, responsive layout, motion, forms, and focus states.
- gwingz-worker.spec.js: Worker route and email-link contract tests.
- playwright.config.ts and e2e/funnel.spec.ts: desktop and mobile browser checks.
- docs/deployment-cloudflare.md: direct-upload runbook.

## Design direction

Subject: Golden Wings: Fifty Year Flight Path, centered on Robyn Stewart and the family history carried through American Airlines.

Audience: documentary viewers, aviation-history viewers, Robyn's community, festival visitors, and future download buyers.

Single job: make the visitor want the film enough to request the watch link.

Palette:

- runway black: #101114
- cabin paper: #F4F5F2
- brushed silver: #D7D9DC
- wing gold: #E3B341
- signal red: #B8312F
- cabin teal: #187681
- sky blue: #5CA0C6

Type:

- Miller Display for the film title and emotional section headings.
- Heading Now Extra Bold for navigation labels, buttons, and route markers.
- A system sans stack for readable body copy.

Layout:

- The first viewport is one full-bleed JFK Worldport film still with the Golden Wings title, offer, and Robyn's cutout portrait layered directly into the scene.
- The next band begins inside the viewport edge so the page clearly continues.
- The story section uses a real chronological flight path: 1971, the 747 family connection, and Robyn's gold wings.
- The offer is a full-width boarding-call band, not a floating card.

Signature:

The page carries one vertical flight path through the story. Its waypoints correspond to real events, so the aviation language conveys information instead of acting as decoration.

Self-critique:

The earlier plan leaned on a cream-and-serif streaming-page default and selected a 747 still with a baked-in caption. This revision uses a silver, teal, red, and gold system drawn from the film's American Airlines imagery; the hero uses the caption-free JFK Worldport still, and Robyn appears in the first viewport. The flight path is reserved for the factual timeline so it does not become airport-theme kitsch.[^4]

---

### Task 1: Create web-ready derivatives from verified presskit assets

**Files:**

- Create: public/media/README.md
- Create binary assets under: public/media/images/
- Create font copies under: public/media/fonts/

**Interfaces:**

- Produces the exact media paths consumed by src/content/filmOffer.ts.
- Preserves every source file under E:\GoldenWings\presskit.

- [ ] **Step 1: Create optimized image derivatives and copy fonts**

Run from the repository root in PowerShell:

~~~powershell
New-Item -ItemType Directory -Force -Path .\public\media\images, .\public\media\fonts | Out-Null

& magick "E:\GoldenWings\presskit\Images\Stills_from_film\GW50YFP_still_JFK_Worldport_1960s.png" -auto-orient -resize "2400x2400>" -strip -quality 84 ".\public\media\images\hero-worldport.webp"
& magick "E:\GoldenWings\presskit\Images\Headshots\Robyn_Headshot.png" -auto-orient -resize "1000x1400>" -background none -strip -quality 90 ".\public\media\images\robyn-headshot.webp"
& magick "E:\GoldenWings\presskit\Images\Archival\Robyn_1971grad.png" -auto-orient -resize "1600x1600>" -strip -quality 86 ".\public\media\images\robyn-1971.webp"
& magick "E:\GoldenWings\presskit\Images\Posters\GW50YFP_Poster_2026.jpeg" -auto-orient -resize "1200x1600>" -strip -quality 86 ".\public\media\images\poster-2026.webp"
& magick "E:\GoldenWings\presskit\Images\Laurels\Guadalajara_Best_Short_Doc.png" -auto-orient -resize "700x360>" -background none -strip -quality 88 ".\public\media\images\laurel-guadalajara.webp"
& magick "E:\GoldenWings\presskit\Images\Laurels\Laurel_BEST MOBILE SHORT - Independent Shorts Awards - 2024.png" -auto-orient -resize "700x360>" -background none -strip -quality 88 ".\public\media\images\laurel-mobile-short.webp"
& magick "E:\GoldenWings\presskit\Images\Laurels\Laurel_BEST_SHORT_CINEMATOGRAPHY_SILICON_BEACH.png" -auto-orient -resize "700x360>" -background none -strip -quality 88 ".\public\media\images\laurel-cinematography.webp"
& magick "E:\GoldenWings\presskit\Images\Laurels\Laurel_FINALIST - Beyond Hollywood International Film Festival - 2025.png" -auto-orient -resize "700x360>" -background none -strip -quality 88 ".\public\media\images\laurel-finalist.webp"

Copy-Item -LiteralPath "E:\GoldenWings\presskit\Fonts\Miller-Display.otf" -Destination ".\public\media\fonts\miller-display.otf"
Copy-Item -LiteralPath "E:\GoldenWings\presskit\Fonts\HeadingNowTrial-67Extrabold.ttf" -Destination ".\public\media\fonts\heading-now-extra-bold.ttf"
~~~

Expected: ImageMagick exits successfully and ten files exist under public/media.

- [ ] **Step 2: Record the source mapping**

Create public/media/README.md:

~~~markdown
# Golden Wings web media

These are web derivatives copied from the Golden Wings presskit. Source media remains unchanged.

| Public file | Presskit source |
| --- | --- |
| images/hero-worldport.webp | Images/Stills_from_film/GW50YFP_still_JFK_Worldport_1960s.png |
| images/robyn-headshot.webp | Images/Headshots/Robyn_Headshot.png |
| images/robyn-1971.webp | Images/Archival/Robyn_1971grad.png |
| images/poster-2026.webp | Images/Posters/GW50YFP_Poster_2026.jpeg |
| images/laurel-guadalajara.webp | Images/Laurels/Guadalajara_Best_Short_Doc.png |
| images/laurel-mobile-short.webp | Images/Laurels/Laurel_BEST MOBILE SHORT - Independent Shorts Awards - 2024.png |
| images/laurel-cinematography.webp | Images/Laurels/Laurel_BEST_SHORT_CINEMATOGRAPHY_SILICON_BEACH.png |
| images/laurel-finalist.webp | Images/Laurels/Laurel_FINALIST - Beyond Hollywood International Film Festival - 2025.png |
| fonts/miller-display.otf | Fonts/Miller-Display.otf |
| fonts/heading-now-extra-bold.ttf | Fonts/HeadingNowTrial-67Extrabold.ttf |
~~~

- [ ] **Step 3: Verify every derivative**

Run:

~~~powershell
$expected = @(
  ".\public\media\images\hero-worldport.webp",
  ".\public\media\images\robyn-headshot.webp",
  ".\public\media\images\robyn-1971.webp",
  ".\public\media\images\poster-2026.webp",
  ".\public\media\images\laurel-guadalajara.webp",
  ".\public\media\images\laurel-mobile-short.webp",
  ".\public\media\images\laurel-cinematography.webp",
  ".\public\media\images\laurel-finalist.webp",
  ".\public\media\fonts\miller-display.otf",
  ".\public\media\fonts\heading-now-extra-bold.ttf"
)
$expected | ForEach-Object {
  if (-not (Test-Path -LiteralPath $_)) { throw "Missing asset: $_" }
}
& magick identify .\public\media\images\*.webp
~~~

Expected: no missing-asset error; identify prints eight valid WebP images.

- [ ] **Step 4: Commit**

~~~powershell
git add public/media
git commit -m "chore: add Golden Wings web media"
~~~

---

### Task 2: Replace the Eleventy toolchain with a tested Vue shell

**Files:**

- Modify: package.json
- Modify: package-lock.json
- Modify: index.html
- Create: vite.config.ts
- Create: tsconfig.json
- Delete: tailwind.config.js
- Create: tailwind.config.cjs
- Delete: postcss.config.js
- Create: postcss.config.cjs
- Create: public/_redirects
- Create: src/env.d.ts
- Create: src/main.ts
- Create: src/App.vue
- Create: src/App.spec.ts
- Create: src/router.ts
- Create: src/pages/HomePage.vue
- Create: src/pages/WatchPage.vue
- Create: src/pages/ConfirmationPage.vue
- Create: src/styles/main.css
- Create: src/test/setup.ts
- Modify: .gitignore

**Interfaces:**

- Produces createAppRouter(history?) and the named routes home, watch, and confirmation.
- Produces npm run dev, npm run test, npm run build, npm run verify, npm run e2e, npm run deploy:pages, and npm run deploy:worker.

- [ ] **Step 1: Replace package metadata and scripts**

Replace package.json:

~~~json
{
  "name": "golden-wings-screening",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "description": "Golden Wings documentary watch-link funnel and screening room.",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "node -e \"require('vue-tsc').run(require.resolve('@typescript/old/lib/tsc.js'))\" -- --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "verify": "npm run test && npm run build",
    "deploy:pages": "npm run build && wrangler pages deploy dist --project-name golden-wings-screening",
    "deploy:worker": "wrangler deploy"
  },
  "dependencies": {
    "lucide-vue-next": "1.0.0",
    "vue": "3.5.40",
    "vue-router": "4.6.4"
  },
  "devDependencies": {
    "@playwright/test": "1.61.1",
    "@testing-library/jest-dom": "6.9.1",
    "@vitejs/plugin-vue": "6.0.8",
    "@vue/test-utils": "2.4.11",
    "autoprefixer": "10.5.4",
    "jsdom": "29.1.1",
    "postcss": "8.5.19",
    "tailwindcss": "3.4.18",
    "typescript": "npm:@typescript/typescript6@6.0.2",
    "vite": "8.1.5",
    "vitest": "4.1.10",
    "vue-tsc": "3.3.7",
    "wrangler": "4.111.0"
  }
}
~~~

Run:

~~~powershell
npm install
~~~

Expected: package-lock.json is regenerated with no Eleventy dependency.

- [ ] **Step 2: Add build and test configuration**

Create vite.config.ts:

~~~ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    clearMocks: true,
    css: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
~~~

Create tsconfig.json:

~~~json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "vitest/globals"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "vite.config.ts"
  ]
}
~~~

Create tailwind.config.cjs:

~~~js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
~~~

Create postcss.config.cjs:

~~~js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
~~~

Delete tailwind.config.js and postcss.config.js.

Create src/env.d.ts:

~~~ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKER_API_BASE_URL?: string
  readonly VITE_AUTH0_DOMAIN?: string
  readonly VITE_AUTH0_CLIENT_ID?: string
  readonly VITE_AUTH0_AUDIENCE?: string
  readonly VITE_FUTURE_OFFER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
~~~

Create src/test/setup.ts:

~~~ts
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
~~~

- [ ] **Step 3: Write the failing route test**

Create src/App.spec.ts:

~~~ts
import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from './App.vue'
import { createAppRouter } from './router'

describe('App routes', () => {
  it.each([
    ['/', 'Golden Wings'],
    ['/watch', 'Access your screening'],
    ['/confirmation', 'Check your email']
  ])('renders %s', async (path, heading) => {
    const router = createAppRouter(createMemoryHistory())
    await router.push(path)
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] }
    })

    expect(wrapper.get('h1').text()).toContain(heading)
  })
})
~~~

- [ ] **Step 4: Run the test and confirm the red state**

Run:

~~~powershell
npm run test -- src/App.spec.ts
~~~

Expected: FAIL because App.vue and router.ts do not exist.

- [ ] **Step 5: Add the minimal Vue router shell**

Create src/App.vue:

~~~vue
<template>
  <RouterView />
</template>
~~~

Create src/router.ts:

~~~ts
import {
  createRouter,
  createWebHistory,
  type RouterHistory,
  type RouteRecordRaw
} from 'vue-router'
import ConfirmationPage from './pages/ConfirmationPage.vue'
import HomePage from './pages/HomePage.vue'
import WatchPage from './pages/WatchPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Golden Wings: Fifty Year Flight Path' }
  },
  {
    path: '/watch',
    name: 'watch',
    component: WatchPage,
    meta: { title: 'Watch Golden Wings' }
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ConfirmationPage,
    meta: { title: 'Check your email | Golden Wings' }
  }
]

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  const appRouter = createRouter({ history, routes })

  appRouter.afterEach((to) => {
    document.title = String(to.meta.title || 'Golden Wings')
  })

  return appRouter
}

export const router = createAppRouter()
~~~

Create src/pages/HomePage.vue:

~~~vue
<template>
  <main>
    <h1>Golden Wings</h1>
  </main>
</template>
~~~

Create src/pages/WatchPage.vue:

~~~vue
<template>
  <main>
    <h1>Access your screening</h1>
  </main>
</template>
~~~

Create src/pages/ConfirmationPage.vue:

~~~vue
<template>
  <main>
    <h1>Check your email</h1>
  </main>
</template>
~~~

Create src/main.ts:

~~~ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

createApp(App).use(router).mount('#app')
~~~

Replace index.html:

~~~html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Request the Golden Wings watch link and enter the private screening room."
    />
    <meta name="theme-color" content="#101114" />
    <title>Golden Wings: Fifty Year Flight Path</title>
    <script>
      ;(function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        var f = d.getElementsByTagName(s)[0]
        var j = d.createElement(s)
        var dl = l !== 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'GTM-KTKKLD3G')
    </script>
  </head>
  <body>
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-KTKKLD3G"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe>
    </noscript>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
~~~

Create src/styles/main.css:

~~~css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Miller Display";
  src: url("/media/fonts/miller-display.otf") format("opentype");
  font-display: swap;
}

@font-face {
  font-family: "Heading Now";
  src: url("/media/fonts/heading-now-extra-bold.ttf") format("truetype");
  font-display: swap;
}

:root {
  color-scheme: light;
  --runway-black: #101114;
  --cabin-paper: #f4f5f2;
  --brushed-silver: #d7d9dc;
  --wing-gold: #e3b341;
  --signal-red: #b8312f;
  --cabin-teal: #187681;
  --sky-blue: #5ca0c6;
  --body-ink: #20242a;
  --muted-ink: #5c646d;
  --focus-ring: #f7cf68;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 20rem;
  background: var(--cabin-paper);
  color: var(--body-ink);
}

button,
input,
select {
  font: inherit;
}

a {
  color: inherit;
}

img,
video,
iframe {
  display: block;
  max-width: 100%;
}

:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 100;
  transform: translateY(-180%);
  background: white;
  color: var(--runway-black);
  padding: 0.75rem 1rem;
}

.skip-link:focus {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
~~~

Create public/_redirects:

~~~text
/* /index.html 200
~~~

Append to .gitignore:

~~~gitignore
dist/
.wrangler/
test-results/
playwright-report/
~~~

- [ ] **Step 6: Run the test and build**

Run:

~~~powershell
npm run test -- src/App.spec.ts
npm run build
~~~

Expected: the route test passes and dist/index.html exists.

- [ ] **Step 7: Commit**

~~~powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tailwind.config.cjs postcss.config.cjs public/_redirects src .gitignore
git add -u tailwind.config.js postcss.config.js
git commit -m "feat: scaffold Vue screening app"
~~~

---

### Task 3: Add verified content, shared validation, Worker client, and Auth0 configuration boundary

**Files:**

- Create: src/content/filmOffer.ts
- Create: src/domain/leadValidation.ts
- Create: src/domain/leadValidation.spec.ts
- Create: src/services/cloudflareApi.ts
- Create: src/services/cloudflareApi.spec.ts
- Create: src/auth/auth0Config.ts

**Interfaces:**

- Produces filmOffer as the only source for public offer copy and media paths.
- Produces validateOfferCapture(name, email) and validateEmail(email).
- Produces createCloudflareApiClient(config), submitOfferCapture(payload), and logWatchAccess(payload).
- Produces auth0Config, futureProtectedRoutes, and isAuth0Ready() without activating login.

- [ ] **Step 1: Write failing validation and API tests**

Create src/domain/leadValidation.spec.ts:

~~~ts
import { describe, expect, it } from 'vitest'
import { validateEmail, validateOfferCapture } from './leadValidation'

describe('lead validation', () => {
  it('requires a name and email for an offer capture', () => {
    expect(validateOfferCapture('', '')).toBe('Enter your name and email.')
  })

  it('rejects an invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateOfferCapture('Robyn', 'not-an-email')).toBe('Enter a valid email address.')
  })

  it('accepts a trimmed valid lead', () => {
    expect(validateOfferCapture(' Robyn ', ' robyn@example.com ')).toBeNull()
  })
})
~~~

Create src/services/cloudflareApi.spec.ts:

~~~ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCloudflareApiClient } from './cloudflareApi'

describe('createCloudflareApiClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-16T12:00:00.000Z'))
  })

  it('normalizes the base URL and posts the RSVP payload', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com/',
      fetchImpl
    })

    await client.submitOfferCapture({
      name: 'Robyn Stewart',
      email: 'robyn@example.com',
      phone: '',
      source: 'Festival',
      honeypot: ''
    })

    expect(fetchImpl).toHaveBeenCalledWith('https://worker.example.com/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Robyn Stewart',
        email: 'robyn@example.com',
        phone: '',
        source: 'Festival',
        'hp-check': ''
      })
    })
  })

  it('posts watch access with the current timestamp', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com',
      fetchImpl
    })

    await client.logWatchAccess({
      email: 'viewer@example.com',
      page: 'watch',
      honeypot: ''
    })

    const request = fetchImpl.mock.calls[0]
    const options = request[1] as RequestInit
    expect(request[0]).toBe('https://worker.example.com/api/watch-access')
    expect(JSON.parse(String(options.body))).toEqual({
      type: 'watch_access',
      email: 'viewer@example.com',
      timestamp: '2026-07-16T12:00:00.000Z',
      page: 'watch',
      'hp-check-watch': ''
    })
  })

  it('surfaces a Worker error message', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ success: false, error: 'Valid email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    const client = createCloudflareApiClient({
      baseUrl: 'https://worker.example.com',
      fetchImpl
    })

    await expect(
      client.submitOfferCapture({
        name: 'Robyn',
        email: 'bad',
        phone: '',
        source: '',
        honeypot: ''
      })
    ).rejects.toThrow('Valid email is required')
  })
})
~~~

- [ ] **Step 2: Run the tests and confirm the red state**

Run:

~~~powershell
npm run test -- src/domain/leadValidation.spec.ts src/services/cloudflareApi.spec.ts
~~~

Expected: FAIL because the implementation files do not exist.

- [ ] **Step 3: Implement validation**

Create src/domain/leadValidation.ts:

~~~ts
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): boolean {
  return emailPattern.test(email.trim())
}

export function validateOfferCapture(name: string, email: string): string | null {
  if (!name.trim() && !email.trim()) {
    return 'Enter your name and email.'
  }

  if (!name.trim()) {
    return 'Enter your name.'
  }

  if (!email.trim()) {
    return 'Enter your email address.'
  }

  if (!validateEmail(email)) {
    return 'Enter a valid email address.'
  }

  return null
}
~~~

- [ ] **Step 4: Implement the Worker client**

Create src/services/cloudflareApi.ts:

~~~ts
export interface OfferCapturePayload {
  name: string
  email: string
  phone: string
  source: string
  honeypot: string
}

export interface WatchAccessPayload {
  email: string
  page: 'watch'
  honeypot: string
}

export interface CloudflareApiClient {
  submitOfferCapture(payload: OfferCapturePayload): Promise<void>
  logWatchAccess(payload: WatchAccessPayload): Promise<void>
}

interface CloudflareApiClientConfig {
  baseUrl: string
  fetchImpl?: typeof fetch
}

interface WorkerResult {
  success?: boolean
  error?: string
}

export function createCloudflareApiClient(
  config: CloudflareApiClientConfig
): CloudflareApiClient {
  const baseUrl = config.baseUrl.replace(/\/+$/, '')
  const fetchImpl = config.fetchImpl || fetch

  async function post(path: string, body: Record<string, unknown>): Promise<void> {
    const response = await fetchImpl(baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const result = (await response.json()) as WorkerResult
    if (!response.ok || result.success === false) {
      throw new Error(result.error || 'The request failed.')
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
  baseUrl:
    import.meta.env.VITE_WORKER_API_BASE_URL ||
    'https://gwingz-worker.calebmills99.workers.dev'
})
~~~

- [ ] **Step 5: Add verified content and Auth0 configuration**

Create src/content/filmOffer.ts:

~~~ts
export const filmOffer = {
  shortTitle: 'Golden Wings',
  title: 'Golden Wings: Fifty Year Flight Path',
  director: 'Caleb Mills Stewart',
  hero: {
    eyebrow: 'A documentary short by Caleb Mills Stewart',
    headline: 'Fifty years in the cabin. A family history carried at altitude.',
    body:
      "Robyn Stewart joined American Airlines in 1971. Her gold wings carry the work of her father Jay R. Ricks, the routes she flew, the losses she survived, and the second chance she chose.",
    primaryCta: 'Send me the watch link',
    secondaryCta: 'Enter the screening room'
  },
  story: {
    heading: 'Robyn kept flying. The family story kept gathering altitude.',
    introduction:
      "Golden Wings follows Robyn from stewardess college to more than five decades at American Airlines. Her father Jay helped build the airline's 747 training program, and Jock Bethune remembers the people who made that rollout possible.",
    family:
      "The film stays close to the family inside that history. It includes Robyn's recovery, Henry Stewart's death during a Frankfurt layover, and Caleb's letter to the father he still carries with him.",
    waypoints: [
      { year: '1971', label: 'Robyn joins American Airlines' },
      { year: '747', label: "Jay R. Ricks's training work connects two careers" },
      { year: '50+', label: 'Gold wings and a life still in flight' }
    ]
  },
  preview: {
    eyebrow: 'In-flight preview',
    heading: 'Meet the people behind the wings.',
    embedUrl:
      'https://customer-e46l63ee4ck01nmz.cloudflarestream.com/a4ad2ae7bcf9a68035416570b045edfa/iframe'
  },
  offer: {
    eyebrow: 'Now boarding',
    heading: 'Get the watch link',
    body:
      'Leave your name and email. We will send the current screening link. When the download release opens, this is where the ownership offer will live.',
    submitLabel: 'Send my watch link',
    success: 'Your watch link is on its way.',
    error:
      'The link could not be sent. Try again or email info@golden-wings-robyn.com.',
    futureUrl: import.meta.env.VITE_FUTURE_OFFER_URL || ''
  },
  watch: {
    eyebrow: 'Private screening',
    heading: 'Access your screening',
    body: 'Enter your email and the screening room will open.',
    submitLabel: 'Open the screening room',
    embedUrl: 'https://www.youtube.com/embed/RzkdMRHRblU'
  },
  confirmation: {
    eyebrow: 'Access confirmed',
    heading: 'Check your email',
    body:
      'Your Golden Wings watch link is being sent. You can also continue straight to the screening room.'
  },
  awards: [
    {
      label: 'Best Short Documentary, Guadalajara',
      image: '/media/images/laurel-guadalajara.webp'
    },
    {
      label: 'Best Mobile Short, Independent Shorts Awards',
      image: '/media/images/laurel-mobile-short.webp'
    },
    {
      label: 'Best Short Cinematography, Silicon Beach',
      image: '/media/images/laurel-cinematography.webp'
    },
    {
      label: 'Finalist, Beyond Hollywood',
      image: '/media/images/laurel-finalist.webp'
    }
  ],
  assets: {
    hero: '/media/images/hero-worldport.webp',
    robynHeadshot: '/media/images/robyn-headshot.webp',
    robyn1971: '/media/images/robyn-1971.webp',
    poster: '/media/images/poster-2026.webp'
  },
  contactEmail: 'info@golden-wings-robyn.com',
  legal: {
    privacy: 'https://www.golden-wings-robyn.com/privacy-policy',
    terms: 'https://www.golden-wings-robyn.com/terms-of-use'
  }
} as const
~~~

Create src/auth/auth0Config.ts:

~~~ts
export interface Auth0Config {
  domain: string
  clientId: string
  audience: string
}

export const auth0Config: Auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || ''
}

export const futureProtectedRoutes = [
  '/login',
  '/account',
  '/library',
  '/download'
] as const

export function isAuth0Ready(config: Auth0Config = auth0Config): boolean {
  return Boolean(config.domain && config.clientId)
}
~~~

- [ ] **Step 6: Run tests and build**

Run:

~~~powershell
npm run test -- src/domain/leadValidation.spec.ts src/services/cloudflareApi.spec.ts
npm run build
~~~

Expected: tests and typecheck pass.

- [ ] **Step 7: Commit**

~~~powershell
git add src/content src/domain src/services src/auth
git commit -m "feat: add funnel content and Worker client"
~~~

---

### Task 4: Remove the GitHub Pages URL from Worker email behavior

**Files:**

- Create: gwingz-worker.spec.js
- Modify: gwingz-worker.js
- Modify: wrangler.toml

**Interfaces:**

- Preserves the existing endpoint response contracts.
- Adds PUBLIC_SITE_URL as the source for emailed watch links.

- [ ] **Step 1: Write failing Worker contract tests**

Create gwingz-worker.spec.js:

~~~js
import { afterEach, describe, expect, it, vi } from 'vitest'
import worker from './gwingz-worker.js'

const workerUrl = 'https://worker.example.com'

function jsonRequest(path, body) {
  return new Request(workerUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('gwingz Worker', () => {
  it('returns the health contract', async () => {
    const response = await worker.fetch(new Request(workerUrl + '/health'), {})
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: 'gwingz-rsvp-worker'
    })
  })

  it('keeps honeypot submissions as a no-op success', async () => {
    const resend = vi.fn()
    vi.stubGlobal('fetch', resend)

    const response = await worker.fetch(
      jsonRequest('/api/rsvp', {
        name: 'Bot',
        email: 'bot@example.com',
        'hp-check': 'filled'
      }),
      {}
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ success: true })
    expect(resend).not.toHaveBeenCalled()
  })

  it('uses PUBLIC_SITE_URL in the viewer email', async () => {
    const resend = vi.fn(async () =>
      new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', resend)

    const response = await worker.fetch(
      jsonRequest('/api/rsvp', {
        name: 'Robyn Stewart',
        email: 'robyn@example.com',
        phone: '',
        source: 'Website',
        'hp-check': ''
      }),
      {
        RESEND_API_KEY: 'test-key',
        FROM_EMAIL: 'info@example.com',
        PUBLIC_SITE_URL: 'https://screening.example'
      }
    )

    expect(response.status).toBe(200)
    const emails = resend.mock.calls.map((call) =>
      JSON.parse(String(call[1].body))
    )
    const viewerEmail = emails.find((email) =>
      email.to.includes('robyn@example.com')
    )
    expect(viewerEmail.html).toContain('https://screening.example/watch')
    expect(viewerEmail.html).not.toContain('github.io')
  })

  it('accepts watch access even when the analytics email fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('Resend unavailable')
    }))

    const response = await worker.fetch(
      jsonRequest('/api/watch-access', {
        type: 'watch_access',
        email: 'viewer@example.com',
        timestamp: '2026-07-16T12:00:00.000Z',
        page: 'watch',
        'hp-check-watch': ''
      }),
      { RESEND_API_KEY: 'test-key' }
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
  })

  it('rejects unsupported methods', async () => {
    const response = await worker.fetch(
      new Request(workerUrl + '/api/rsvp', { method: 'GET' }),
      {}
    )
    expect(response.status).toBe(405)
  })
})
~~~

- [ ] **Step 2: Run the Worker tests and confirm the red state**

Run:

~~~powershell
npm run test -- gwingz-worker.spec.js
~~~

Expected: the PUBLIC_SITE_URL test fails because the current email still contains github.io.

- [ ] **Step 3: Make the watch URL configurable**

Apply these exact changes in gwingz-worker.js:

~~~diff
 async function handleRSVPSubmission(data, env) {
   const payload = normalizeRSVPData(data);
   validateRSVPPayload(payload);

   await storeRSVPIfConfigured(env, payload);

   const adminEmail = buildAdminNotification(payload);
-  const userEmail = buildUserConfirmation(payload);
+  const userEmail = buildUserConfirmation(payload, env);
@@
-function buildUserConfirmation(data) {
-  const watchUrl = "https://calebmills99.github.io/golden-wings-screening/watch/";
+function buildUserConfirmation(data, env) {
+  const publicSiteUrl = String(
+    env.PUBLIC_SITE_URL || "https://golden-wings-robyn.com"
+  ).replace(/\/+$/, "");
+  const watchUrl = publicSiteUrl + "/watch";
~~~

Under [vars] in wrangler.toml, add:

~~~toml
PUBLIC_SITE_URL = "https://golden-wings-robyn.com"
~~~

- [ ] **Step 4: Run Worker and frontend verification**

Run:

~~~powershell
npm run test -- gwingz-worker.spec.js
npm run verify
~~~

Expected: all Worker tests, frontend tests, typecheck, and Vite build pass.

- [ ] **Step 5: Commit**

~~~powershell
git add gwingz-worker.js gwingz-worker.spec.js wrangler.toml
git commit -m "fix: send Cloudflare-hosted watch links"
~~~

---

### Task 5: Build the shared cinematic funnel components

**Files:**

- Create: src/components/SiteLayout.vue
- Create: src/components/OfferCTA.vue
- Create: src/components/FunnelHero.vue
- Create: src/components/FunnelHero.spec.ts
- Create: src/components/FilmStory.vue
- Create: src/components/FilmStory.spec.ts
- Create: src/components/PreviewPlayer.vue
- Modify: src/styles/main.css

**Interfaces:**

- Produces a shared page shell with main-content target and legal links.
- Produces OfferCTA with href and label props.
- Produces presentational hero, story, awards, and preview components that consume filmOffer.

- [ ] **Step 1: Write failing hero and story tests**

Create src/components/FunnelHero.spec.ts:

~~~ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FunnelHero from './FunnelHero.vue'

describe('FunnelHero', () => {
  it('puts the film and primary offer in the first section', () => {
    const wrapper = mount(FunnelHero)

    expect(wrapper.get('h1').text()).toBe('Golden Wings')
    expect(wrapper.text()).toContain('Fifty Year Flight Path')
    expect(wrapper.get('a[href="#offer"]').text()).toContain(
      'Send me the watch link'
    )
    expect(wrapper.get('img.hero-portrait').attributes('alt')).toContain(
      'Robyn Stewart'
    )
  })
})
~~~

Create src/components/FilmStory.spec.ts:

~~~ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FilmStory from './FilmStory.vue'

describe('FilmStory', () => {
  it('renders factual waypoints and four award marks', () => {
    const wrapper = mount(FilmStory)

    expect(wrapper.text()).toContain('1971')
    expect(wrapper.text()).toContain('Jay R. Ricks')
    expect(wrapper.text()).toContain('Gold wings')
    expect(wrapper.findAll('.award-mark')).toHaveLength(4)
  })
})
~~~

- [ ] **Step 2: Run the tests and confirm the red state**

Run:

~~~powershell
npm run test -- src/components/FunnelHero.spec.ts src/components/FilmStory.spec.ts
~~~

Expected: FAIL because FunnelHero.vue and FilmStory.vue do not exist.

- [ ] **Step 3: Implement the shared shell and CTA**

Create src/components/SiteLayout.vue:

~~~vue
<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Skip to film</a>
    <header class="site-header">
      <RouterLink class="wordmark" to="/" aria-label="Golden Wings home">
        <span>Golden Wings</span>
        <small>Fifty Year Flight Path</small>
      </RouterLink>
      <a class="header-offer-link" href="/#offer">Get the watch link</a>
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer class="site-footer">
      <p>{{ filmOffer.title }}</p>
      <nav aria-label="Legal">
        <a :href="filmOffer.legal.privacy">Privacy</a>
        <a :href="filmOffer.legal.terms">Terms</a>
        <a :href="'mailto:' + filmOffer.contactEmail">Contact</a>
      </nav>
    </footer>
  </div>
</template>
~~~

Create src/components/OfferCTA.vue:

~~~vue
<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    href: string
    label: string
    tone?: 'gold' | 'light'
  }>(),
  {
    tone: 'gold'
  }
)
</script>

<template>
  <a class="offer-cta" :class="'offer-cta--' + tone" :href="href">
    <span>{{ label }}</span>
    <ArrowDown :size="18" aria-hidden="true" />
  </a>
</template>
~~~

- [ ] **Step 4: Implement the hero**

Create src/components/FunnelHero.vue:

~~~vue
<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
import OfferCTA from './OfferCTA.vue'
</script>

<template>
  <section class="funnel-hero" aria-labelledby="film-title">
    <img
      class="hero-background"
      :src="filmOffer.assets.hero"
      alt=""
      fetchpriority="high"
    />
    <div class="hero-scrim" aria-hidden="true"></div>
    <img
      class="hero-portrait"
      :src="filmOffer.assets.robynHeadshot"
      alt="Robyn Stewart, the flight attendant at the center of Golden Wings"
      fetchpriority="high"
    />

    <div class="hero-copy">
      <p class="route-label">{{ filmOffer.hero.eyebrow }}</p>
      <h1 id="film-title">{{ filmOffer.shortTitle }}</h1>
      <p class="hero-subtitle">Fifty Year Flight Path</p>
      <p class="hero-headline">{{ filmOffer.hero.headline }}</p>
      <p class="hero-body">{{ filmOffer.hero.body }}</p>
      <div class="hero-actions">
        <OfferCTA href="#offer" :label="filmOffer.hero.primaryCta" />
        <RouterLink class="text-link" to="/watch">
          {{ filmOffer.hero.secondaryCta }}
        </RouterLink>
      </div>
    </div>

    <a class="continue-cue" href="#story">
      <span>Continue the flight path</span>
      <span aria-hidden="true">↓</span>
    </a>
  </section>
</template>
~~~

- [ ] **Step 5: Implement the story and preview**

Create src/components/FilmStory.vue:

~~~vue
<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section id="story" class="story-section" aria-labelledby="story-title">
    <div class="story-intro">
      <p class="route-label route-label--dark">Flight record</p>
      <h2 id="story-title">{{ filmOffer.story.heading }}</h2>
      <p>{{ filmOffer.story.introduction }}</p>
      <p>{{ filmOffer.story.family }}</p>
    </div>

    <div class="story-image-pair" aria-label="Robyn Stewart then and now">
      <figure>
        <img
          :src="filmOffer.assets.robyn1971"
          alt="Robyn Stewart with her parents at her 1971 graduation"
          loading="lazy"
        />
        <figcaption>Robyn and her parents, 1971</figcaption>
      </figure>
      <figure>
        <img
          :src="filmOffer.assets.robynHeadshot"
          alt="Robyn Stewart today"
          loading="lazy"
        />
        <figcaption>More than fifty years in the cabin</figcaption>
      </figure>
    </div>

    <ol class="flight-path">
      <li v-for="waypoint in filmOffer.story.waypoints" :key="waypoint.year">
        <span class="waypoint-year">{{ waypoint.year }}</span>
        <span>{{ waypoint.label }}</span>
      </li>
    </ol>

    <div class="award-strip" aria-label="Festival recognition">
      <img
        v-for="award in filmOffer.awards"
        :key="award.label"
        class="award-mark"
        :src="award.image"
        :alt="award.label"
        loading="lazy"
      />
    </div>
  </section>
</template>
~~~

Create src/components/PreviewPlayer.vue:

~~~vue
<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="preview-section" aria-labelledby="preview-title">
    <div class="preview-copy">
      <p class="route-label">{{ filmOffer.preview.eyebrow }}</p>
      <Play :size="30" aria-hidden="true" />
      <h2 id="preview-title">{{ filmOffer.preview.heading }}</h2>
      <p>
        A first look at Robyn, the 747 family connection, and the film waiting
        inside the screening room.
      </p>
    </div>
    <div class="preview-frame">
      <iframe
        :src="filmOffer.preview.embedUrl"
        title="Golden Wings preview"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </section>
</template>
~~~

- [ ] **Step 6: Add exact component styles**

Append to src/styles/main.css:

~~~css
.site-shell {
  min-height: 100vh;
  overflow: clip;
  background: var(--cabin-paper);
}

.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.75rem;
  padding: 1rem 1.25rem;
  color: white;
}

.wordmark {
  display: grid;
  text-decoration: none;
}

.wordmark span {
  font-family: "Miller Display", Georgia, serif;
  font-size: 1.55rem;
  line-height: 1;
}

.wordmark small,
.route-label,
.hero-subtitle,
.header-offer-link,
.offer-cta,
.waypoint-year {
  font-family: "Heading Now", Impact, sans-serif;
  letter-spacing: 0;
  text-transform: uppercase;
}

.wordmark small {
  margin-top: 0.2rem;
  font-size: 0.62rem;
}

.header-offer-link {
  border-bottom: 2px solid var(--wing-gold);
  font-size: 0.72rem;
  text-decoration: none;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem 1.25rem;
  border-top: 1px solid #c5c9cd;
  font-size: 0.86rem;
}

.site-footer p {
  margin: 0;
}

.site-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.offer-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 3.25rem;
  padding: 0.85rem 1.15rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.78rem;
  text-decoration: none;
}

.offer-cta--gold {
  background: var(--wing-gold);
  color: var(--runway-black);
}

.offer-cta--light {
  border-color: currentColor;
  background: white;
  color: var(--runway-black);
}

.funnel-hero {
  position: relative;
  display: grid;
  min-height: calc(100svh - 4rem);
  align-items: center;
  isolation: isolate;
  overflow: hidden;
  background: var(--runway-black);
  color: white;
}

.hero-background,
.hero-scrim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-background {
  z-index: -3;
  object-fit: cover;
  object-position: center;
}

.hero-scrim {
  z-index: -2;
  background: rgba(8, 10, 14, 0.7);
}

.hero-portrait {
  position: absolute;
  z-index: -1;
  right: -1.5rem;
  bottom: -7rem;
  width: min(45vw, 38rem);
  max-height: 90%;
  object-fit: contain;
  object-position: bottom right;
  opacity: 0.88;
}

.hero-copy {
  width: min(100%, 47rem);
  padding: 7rem 1.25rem 5.5rem;
}

.route-label {
  margin: 0 0 1rem;
  color: var(--wing-gold);
  font-size: 0.72rem;
}

.route-label--dark {
  color: var(--signal-red);
}

.hero-copy h1,
.hero-copy h2,
.story-intro h2,
.preview-copy h2 {
  font-family: "Miller Display", Georgia, serif;
  font-weight: 400;
  letter-spacing: 0;
}

.hero-copy h1 {
  margin: 0;
  font-size: 4.5rem;
  line-height: 0.88;
}

.hero-subtitle {
  margin: 0.8rem 0 2rem;
  color: var(--brushed-silver);
  font-size: 1rem;
}

.hero-headline {
  max-width: 36rem;
  margin: 0;
  font-family: "Miller Display", Georgia, serif;
  font-size: 1.9rem;
  line-height: 1.12;
}

.hero-body {
  max-width: 39rem;
  margin: 1.25rem 0 0;
  color: #eef0f2;
  font-size: 1rem;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.25rem;
  margin-top: 1.8rem;
}

.text-link {
  text-underline-offset: 0.35rem;
}

.continue-cue {
  position: absolute;
  right: 1.25rem;
  bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.75rem;
  text-decoration: none;
}

.story-section {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(18rem, 1.1fr);
  gap: 3rem 5rem;
  padding: 5rem 1.25rem;
  background: var(--cabin-paper);
}

.story-intro {
  max-width: 41rem;
}

.story-intro h2,
.preview-copy h2 {
  margin: 0 0 1.4rem;
  font-size: 2.65rem;
  line-height: 1.05;
}

.story-intro > p:not(.route-label),
.preview-copy p {
  color: var(--muted-ink);
  font-size: 1rem;
  line-height: 1.7;
}

.story-image-pair {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1rem;
  align-items: end;
}

.story-image-pair figure {
  margin: 0;
}

.story-image-pair img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--brushed-silver);
}

.story-image-pair figure:last-child img {
  object-fit: contain;
  object-position: bottom;
}

.story-image-pair figcaption {
  padding-top: 0.65rem;
  font-size: 0.76rem;
}

.flight-path {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  border-top: 2px solid var(--runway-black);
}

.flight-path li {
  position: relative;
  display: grid;
  gap: 0.65rem;
  min-height: 8.5rem;
  padding: 1.5rem 1.5rem 0 0;
}

.flight-path li::before {
  position: absolute;
  top: -0.48rem;
  left: 0;
  width: 0.8rem;
  height: 0.8rem;
  border: 2px solid var(--runway-black);
  border-radius: 50%;
  background: var(--wing-gold);
  content: "";
}

.waypoint-year {
  color: var(--signal-red);
  font-size: 1.1rem;
}

.award-strip {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  gap: 1.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid #c5c9cd;
}

.award-mark {
  width: 100%;
  max-height: 7rem;
  object-fit: contain;
}

.preview-section {
  display: grid;
  grid-template-columns: minmax(17rem, 0.62fr) minmax(0, 1.38fr);
  align-items: center;
  gap: 3rem;
  padding: 5rem 1.25rem;
  background: var(--cabin-teal);
  color: white;
}

.preview-copy {
  max-width: 32rem;
}

.preview-copy p {
  color: #edf8f8;
}

.preview-frame {
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  background: black;
}

.preview-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

@media (min-width: 64rem) {
  .site-header,
  .site-footer,
  .hero-copy,
  .story-section,
  .preview-section {
    padding-right: 6vw;
    padding-left: 6vw;
  }

  .hero-copy h1 {
    font-size: 6.75rem;
  }

  .hero-headline {
    font-size: 2.4rem;
  }
}

@media (max-width: 48rem) {
  .site-header {
    min-height: 4rem;
  }

  .header-offer-link {
    display: none;
  }

  .funnel-hero {
    min-height: calc(100svh - 3rem);
  }

  .hero-copy {
    padding-top: 5.5rem;
    padding-bottom: 4.5rem;
  }

  .hero-copy h1 {
    font-size: 3.55rem;
  }

  .hero-headline {
    font-size: 1.55rem;
  }

  .hero-portrait {
    right: -6rem;
    bottom: -3rem;
    width: 25rem;
    opacity: 0.32;
  }

  .continue-cue span:first-child {
    display: none;
  }

  .story-section,
  .preview-section {
    grid-template-columns: 1fr;
  }

  .story-intro h2,
  .preview-copy h2 {
    font-size: 2.15rem;
  }

  .flight-path {
    grid-template-columns: 1fr;
    border-top: 0;
    border-left: 2px solid var(--runway-black);
  }

  .flight-path li {
    min-height: 6.5rem;
    padding: 0 0 1.5rem 1.5rem;
  }

  .flight-path li::before {
    top: 0.2rem;
    left: -0.48rem;
  }

  .award-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 24rem) {
  .hero-copy {
    padding-top: 4.5rem;
    padding-bottom: 3rem;
  }

  .hero-copy h1 {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 0.85rem;
  }

  .hero-headline {
    font-size: 1.35rem;
  }

  .hero-body {
    display: none;
  }

  .hero-actions {
    margin-top: 1.2rem;
  }

  .story-image-pair {
    grid-template-columns: 1fr;
  }
}
~~~

- [ ] **Step 7: Run component tests and build**

Run:

~~~powershell
npm run test -- src/components/FunnelHero.spec.ts src/components/FilmStory.spec.ts
npm run build
~~~

Expected: tests and build pass.

- [ ] **Step 8: Commit**

~~~powershell
git add src/components src/styles/main.css
git commit -m "feat: build Golden Wings visual system"
~~~

---

### Task 6: Build the offer capture and compose the home funnel

**Files:**

- Create: src/components/OfferCaptureForm.vue
- Create: src/components/OfferCaptureForm.spec.ts
- Modify: src/pages/HomePage.vue
- Create: src/pages/HomePage.spec.ts
- Modify: src/styles/main.css

**Interfaces:**

- OfferCaptureForm accepts an optional submitOfferCapture client and emits captured after success.
- HomePage routes a successful capture to the named confirmation route.

- [ ] **Step 1: Write failing offer and home-page tests**

Create src/components/OfferCaptureForm.spec.ts:

~~~ts
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import OfferCaptureForm from './OfferCaptureForm.vue'

describe('OfferCaptureForm', () => {
  it('shows a specific error before calling the API', async () => {
    const submitOfferCapture = vi.fn()
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('form').trigger('submit')

    expect(submitOfferCapture).not.toHaveBeenCalled()
    expect(wrapper.get('[role="status"]').text()).toBe(
      'Enter your name and email.'
    )
  })

  it('rejects a malformed email', async () => {
    const submitOfferCapture = vi.fn()
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('#offer-name').setValue('Robyn')
    await wrapper.get('#offer-email').setValue('bad')
    await wrapper.get('form').trigger('submit')

    expect(submitOfferCapture).not.toHaveBeenCalled()
    expect(wrapper.get('[role="status"]').text()).toBe(
      'Enter a valid email address.'
    )
  })

  it('submits the normalized lead and emits captured', async () => {
    const submitOfferCapture = vi.fn(async () => undefined)
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('#offer-name').setValue(' Robyn Stewart ')
    await wrapper.get('#offer-email').setValue(' ROBYN@example.com ')
    await wrapper.get('#offer-source').setValue(' Festival ')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitOfferCapture).toHaveBeenCalledWith({
      name: 'Robyn Stewart',
      email: 'robyn@example.com',
      phone: '',
      source: 'Festival',
      honeypot: ''
    })
    expect(wrapper.emitted('captured')).toHaveLength(1)
    expect(wrapper.get('[role="status"]').text()).toContain('on its way')
  })

  it('shows the configured failure message', async () => {
    const submitOfferCapture = vi.fn(async () => {
      throw new Error('offline')
    })
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('#offer-name').setValue('Robyn')
    await wrapper.get('#offer-email').setValue('robyn@example.com')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="status"]').text()).toContain(
      'The link could not be sent'
    )
  })
})
~~~

Create src/pages/HomePage.spec.ts:

~~~ts
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '../router'
import HomePage from './HomePage.vue'

const OfferCaptureStub = defineComponent({
  emits: ['captured'],
  template:
    '<button data-test="complete-capture" @click="$emit(\'captured\')">Complete capture</button>'
})

describe('HomePage', () => {
  it('composes the funnel and routes a completed capture', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/')
    await router.isReady()

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: { OfferCaptureForm: OfferCaptureStub }
      }
    })

    expect(wrapper.find('#story').exists()).toBe(true)
    expect(wrapper.find('#offer').exists()).toBe(true)

    await wrapper.get('[data-test="complete-capture"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('confirmation')
  })
})
~~~

- [ ] **Step 2: Run the tests and confirm the red state**

Run:

~~~powershell
npm run test -- src/components/OfferCaptureForm.spec.ts src/pages/HomePage.spec.ts
~~~

Expected: FAIL because OfferCaptureForm and the composed HomePage do not exist.

- [ ] **Step 3: Implement the capture form**

Create src/components/OfferCaptureForm.vue:

~~~vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
import { validateOfferCapture } from '../domain/leadValidation'
import {
  cloudflareApi,
  type CloudflareApiClient
} from '../services/cloudflareApi'

const props = withDefaults(
  defineProps<{
    api?: Pick<CloudflareApiClient, 'submitOfferCapture'>
  }>(),
  {
    api: () => cloudflareApi
  }
)

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

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')

async function submit() {
  const validationMessage = validateOfferCapture(form.name, form.email)
  if (validationMessage) {
    state.value = 'error'
    message.value = validationMessage
    return
  }

  if (form.honeypot) {
    return
  }

  state.value = 'loading'
  message.value = ''

  try {
    await props.api.submitOfferCapture({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      source: form.source.trim(),
      honeypot: form.honeypot
    })
    state.value = 'success'
    message.value = filmOffer.offer.success
    emit('captured')
  } catch {
    state.value = 'error'
    message.value = filmOffer.offer.error
  }
}
</script>

<template>
  <form class="offer-form" novalidate @submit.prevent="submit">
    <div class="field field--wide">
      <label for="offer-name">Name</label>
      <input
        id="offer-name"
        v-model="form.name"
        name="name"
        autocomplete="name"
        required
      />
    </div>

    <div class="field field--wide">
      <label for="offer-email">Email</label>
      <input
        id="offer-email"
        v-model="form.email"
        name="email"
        type="email"
        autocomplete="email"
        required
      />
    </div>

    <div class="field">
      <label for="offer-phone">Phone <span>Optional</span></label>
      <input
        id="offer-phone"
        v-model="form.phone"
        name="phone"
        type="tel"
        autocomplete="tel"
      />
    </div>

    <div class="field">
      <label for="offer-source">How did you hear about the film? <span>Optional</span></label>
      <input id="offer-source" v-model="form.source" name="source" />
    </div>

    <div class="hp-field" aria-hidden="true">
      <label for="offer-hp">Leave blank</label>
      <input
        id="offer-hp"
        v-model="form.honeypot"
        name="hp-check"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <button
      class="submit-offer"
      type="submit"
      :disabled="state === 'loading'"
    >
      <Mail :size="18" aria-hidden="true" />
      <span>
        {{ state === 'loading' ? 'Sending your link' : filmOffer.offer.submitLabel }}
      </span>
    </button>

    <p
      v-if="message"
      class="form-status"
      :class="'form-status--' + state"
      role="status"
    >
      {{ message }}
    </p>
  </form>
</template>
~~~

- [ ] **Step 4: Compose the full home funnel**

Replace src/pages/HomePage.vue:

~~~vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import FilmStory from '../components/FilmStory.vue'
import FunnelHero from '../components/FunnelHero.vue'
import OfferCaptureForm from '../components/OfferCaptureForm.vue'
import PreviewPlayer from '../components/PreviewPlayer.vue'
import SiteLayout from '../components/SiteLayout.vue'
import { filmOffer } from '../content/filmOffer'

const router = useRouter()

function continueToConfirmation() {
  void router.push({ name: 'confirmation' })
}
</script>

<template>
  <SiteLayout>
    <FunnelHero />
    <FilmStory />
    <PreviewPlayer />

    <section id="offer" class="offer-section" aria-labelledby="offer-title">
      <div class="offer-copy">
        <p class="route-label route-label--dark">{{ filmOffer.offer.eyebrow }}</p>
        <h2 id="offer-title">{{ filmOffer.offer.heading }}</h2>
        <p>{{ filmOffer.offer.body }}</p>
        <img
          :src="filmOffer.assets.poster"
          :alt="filmOffer.title + ' poster'"
          loading="lazy"
        />
      </div>
      <OfferCaptureForm @captured="continueToConfirmation" />
    </section>
  </SiteLayout>
</template>
~~~

- [ ] **Step 5: Add offer styles**

Append to src/styles/main.css:

~~~css
.offer-section {
  display: grid;
  grid-template-columns: minmax(16rem, 0.85fr) minmax(20rem, 1.15fr);
  gap: 3rem 5rem;
  padding: 5rem 1.25rem;
  background: var(--brushed-silver);
}

.offer-copy {
  position: relative;
  min-height: 35rem;
  padding-right: 11rem;
}

.offer-copy h2 {
  margin: 0;
  font-family: "Miller Display", Georgia, serif;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
}

.offer-copy > p:not(.route-label) {
  max-width: 31rem;
  color: var(--muted-ink);
  line-height: 1.7;
}

.offer-copy img {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12.5rem;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 1px solid #91979d;
}

.offer-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: center;
  gap: 1rem;
  padding: 2rem;
  border-left: 5px solid var(--signal-red);
  background: white;
}

.field--wide,
.submit-offer,
.form-status {
  grid-column: 1 / -1;
}

.field label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.4rem;
  font-weight: 700;
}

.field label span {
  color: var(--muted-ink);
  font-size: 0.78rem;
  font-weight: 400;
}

.field input {
  width: 100%;
  min-height: 3rem;
  border: 1px solid #a9afb5;
  border-radius: 2px;
  background: #fbfbfa;
  padding: 0.75rem;
}

.field input:focus {
  border-color: var(--cabin-teal);
}

.hp-field {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.submit-offer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 3.35rem;
  margin-top: 0.5rem;
  border: 0;
  border-radius: 4px;
  background: var(--runway-black);
  color: white;
  font-family: "Heading Now", Impact, sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
  cursor: pointer;
}

.submit-offer:disabled {
  cursor: wait;
  opacity: 0.68;
}

.form-status {
  margin: 0;
  padding: 0.85rem;
  border-left: 3px solid currentColor;
}

.form-status--success {
  color: #155b39;
  background: #e9f6ef;
}

.form-status--error {
  color: #84211f;
  background: #fbeceb;
}

@media (min-width: 64rem) {
  .offer-section {
    padding-right: 6vw;
    padding-left: 6vw;
  }
}

@media (max-width: 48rem) {
  .offer-section {
    grid-template-columns: 1fr;
  }

  .offer-copy {
    min-height: 28rem;
    padding-right: 8rem;
  }

  .offer-copy h2 {
    font-size: 2.4rem;
  }

  .offer-copy img {
    width: 9rem;
  }

  .offer-form {
    grid-template-columns: 1fr;
    padding: 1.25rem;
  }

  .field,
  .field--wide,
  .submit-offer,
  .form-status {
    grid-column: 1;
  }
}
~~~

- [ ] **Step 6: Run tests and build**

Run:

~~~powershell
npm run test -- src/components/OfferCaptureForm.spec.ts src/pages/HomePage.spec.ts src/App.spec.ts
npm run build
~~~

Expected: all tests and build pass.

- [ ] **Step 7: Commit**

~~~powershell
git add src/components/OfferCaptureForm.vue src/components/OfferCaptureForm.spec.ts src/pages/HomePage.vue src/pages/HomePage.spec.ts src/styles/main.css
git commit -m "feat: add watch-link conversion funnel"
~~~

---

### Task 7: Build the screening room and confirmation route

**Files:**

- Create: src/components/WatchGate.vue
- Create: src/components/WatchGate.spec.ts
- Create: src/components/ScreeningRoom.vue
- Modify: src/pages/WatchPage.vue
- Modify: src/pages/ConfirmationPage.vue
- Modify: src/styles/main.css

**Interfaces:**

- WatchGate accepts an optional logWatchAccess client and emits unlocked immediately after a valid email.
- ScreeningRoom consumes filmOffer.watch.embedUrl.
- WatchPage swaps the gate for the screening room without requiring authentication.

- [ ] **Step 1: Write failing gate tests**

Create src/components/WatchGate.spec.ts:

~~~ts
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WatchGate from './WatchGate.vue'

describe('WatchGate', () => {
  it('requires a valid email', async () => {
    const logWatchAccess = vi.fn(async () => undefined)
    const wrapper = mount(WatchGate, {
      props: { api: { logWatchAccess } }
    })

    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[role="status"]').text()).toBe(
      'Enter your email address.'
    )

    await wrapper.get('#viewer-email').setValue('bad')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[role="status"]').text()).toBe(
      'Enter a valid email address.'
    )
    expect(logWatchAccess).not.toHaveBeenCalled()
  })

  it('logs access and opens immediately for a valid email', async () => {
    const logWatchAccess = vi.fn(async () => undefined)
    const wrapper = mount(WatchGate, {
      props: { api: { logWatchAccess } }
    })

    await wrapper.get('#viewer-email').setValue(' VIEWER@example.com ')
    await wrapper.get('form').trigger('submit')

    expect(logWatchAccess).toHaveBeenCalledWith({
      email: 'viewer@example.com',
      page: 'watch',
      honeypot: ''
    })
    expect(wrapper.emitted('unlocked')).toHaveLength(1)
  })

  it('opens even when analytics cannot be recorded', async () => {
    const logWatchAccess = vi.fn(async () => {
      throw new Error('offline')
    })
    const wrapper = mount(WatchGate, {
      props: { api: { logWatchAccess } }
    })

    await wrapper.get('#viewer-email').setValue('viewer@example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('unlocked')).toHaveLength(1)
  })
})
~~~

- [ ] **Step 2: Run the tests and confirm the red state**

Run:

~~~powershell
npm run test -- src/components/WatchGate.spec.ts
~~~

Expected: FAIL because WatchGate.vue does not exist.

- [ ] **Step 3: Implement the gate and screening room**

Create src/components/WatchGate.vue:

~~~vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plane } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
import { validateEmail } from '../domain/leadValidation'
import {
  cloudflareApi,
  type CloudflareApiClient
} from '../services/cloudflareApi'

const props = withDefaults(
  defineProps<{
    api?: Pick<CloudflareApiClient, 'logWatchAccess'>
  }>(),
  {
    api: () => cloudflareApi
  }
)

const emit = defineEmits<{
  unlocked: []
}>()

const form = reactive({
  email: '',
  honeypot: ''
})
const message = ref('')

function submit() {
  if (!form.email.trim()) {
    message.value = 'Enter your email address.'
    return
  }

  if (!validateEmail(form.email)) {
    message.value = 'Enter a valid email address.'
    return
  }

  if (form.honeypot) {
    return
  }

  void props.api
    .logWatchAccess({
      email: form.email.trim().toLowerCase(),
      page: 'watch',
      honeypot: form.honeypot
    })
    .catch(() => undefined)

  emit('unlocked')
}
</script>

<template>
  <form class="watch-gate" novalidate @submit.prevent="submit">
    <p class="route-label">{{ filmOffer.watch.eyebrow }}</p>
    <Plane :size="32" aria-hidden="true" />
    <h1>{{ filmOffer.watch.heading }}</h1>
    <p>{{ filmOffer.watch.body }}</p>

    <label for="viewer-email">Email</label>
    <input
      id="viewer-email"
      v-model="form.email"
      name="email"
      type="email"
      autocomplete="email"
      required
    />

    <div class="hp-field" aria-hidden="true">
      <label for="watch-hp">Leave blank</label>
      <input
        id="watch-hp"
        v-model="form.honeypot"
        name="hp-check-watch"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <button type="submit">{{ filmOffer.watch.submitLabel }}</button>
    <p v-if="message" role="status">{{ message }}</p>
  </form>
</template>
~~~

Create src/components/ScreeningRoom.vue:

~~~vue
<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="screening-room" aria-labelledby="screening-title">
    <div class="screening-heading">
      <p class="route-label">{{ filmOffer.watch.eyebrow }}</p>
      <h1 id="screening-title">Golden Wings</h1>
      <p>Welcome aboard. Your private screening is ready.</p>
    </div>

    <div class="screening-frame">
      <iframe
        :src="filmOffer.watch.embedUrl"
        title="Golden Wings documentary"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <a class="screening-contact" :href="'mailto:' + filmOffer.contactEmail">
      <Mail :size="18" aria-hidden="true" />
      <span>Contact the film team</span>
    </a>
  </section>
</template>
~~~

- [ ] **Step 4: Replace the route pages**

Replace src/pages/WatchPage.vue:

~~~vue
<script setup lang="ts">
import { ref } from 'vue'
import ScreeningRoom from '../components/ScreeningRoom.vue'
import SiteLayout from '../components/SiteLayout.vue'
import WatchGate from '../components/WatchGate.vue'

const unlocked = ref(false)
</script>

<template>
  <SiteLayout>
    <section class="watch-page">
      <WatchGate v-if="!unlocked" @unlocked="unlocked = true" />
      <ScreeningRoom v-else />
    </section>
  </SiteLayout>
</template>
~~~

Replace src/pages/ConfirmationPage.vue:

~~~vue
<script setup lang="ts">
import { ArrowRight, MailCheck } from 'lucide-vue-next'
import SiteLayout from '../components/SiteLayout.vue'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <SiteLayout>
    <section class="confirmation-page">
      <div class="confirmation-copy">
        <p class="route-label">{{ filmOffer.confirmation.eyebrow }}</p>
        <MailCheck :size="38" aria-hidden="true" />
        <h1>{{ filmOffer.confirmation.heading }}</h1>
        <p>{{ filmOffer.confirmation.body }}</p>
        <div class="confirmation-actions">
          <RouterLink class="confirmation-primary" to="/watch">
            <span>Open the screening room</span>
            <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
          <RouterLink class="text-link" to="/">Return to Golden Wings</RouterLink>
        </div>
      </div>
      <img
        :src="filmOffer.assets.poster"
        :alt="filmOffer.title + ' poster'"
      />
    </section>
  </SiteLayout>
</template>
~~~

- [ ] **Step 5: Add screening and confirmation styles**

Append to src/styles/main.css:

~~~css
.watch-page {
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: 7rem 1.25rem 4rem;
  background: var(--runway-black);
  color: white;
}

.watch-gate {
  display: grid;
  width: min(100%, 34rem);
  gap: 0.9rem;
  padding: 2rem 0;
  border-top: 4px solid var(--wing-gold);
}

.watch-gate h1,
.screening-heading h1,
.confirmation-copy h1 {
  margin: 0;
  font-family: "Miller Display", Georgia, serif;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
}

.watch-gate > p:not(.route-label),
.screening-heading p,
.confirmation-copy > p:not(.route-label) {
  color: #d9dde1;
  line-height: 1.65;
}

.watch-gate label {
  margin-top: 0.75rem;
  font-weight: 700;
}

.watch-gate input {
  min-height: 3.2rem;
  border: 1px solid #7f878f;
  border-radius: 2px;
  background: #f8f9f9;
  color: var(--runway-black);
  padding: 0.8rem;
}

.watch-gate button,
.confirmation-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 3.3rem;
  margin-top: 0.5rem;
  border: 0;
  border-radius: 4px;
  background: var(--wing-gold);
  color: var(--runway-black);
  font-family: "Heading Now", Impact, sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
}

.screening-room {
  width: min(100%, 72rem);
}

.screening-heading {
  margin-bottom: 1.5rem;
}

.screening-frame {
  width: 100%;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid #4b525a;
  border-radius: 4px;
  background: black;
}

.screening-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.screening-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.25rem;
  text-underline-offset: 0.3rem;
}

.confirmation-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 24rem);
  min-height: 100svh;
  align-items: center;
  gap: 3rem;
  padding: 7rem 1.25rem 4rem;
  background: var(--cabin-teal);
  color: white;
}

.confirmation-copy {
  max-width: 42rem;
}

.confirmation-copy h1 {
  font-size: 4rem;
}

.confirmation-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 2rem;
}

.confirmation-primary {
  padding: 0.85rem 1.1rem;
}

.confirmation-page > img {
  width: 100%;
  max-height: 37rem;
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.45);
}

@media (min-width: 64rem) {
  .watch-page,
  .confirmation-page {
    padding-right: 6vw;
    padding-left: 6vw;
  }
}

@media (max-width: 48rem) {
  .watch-gate h1,
  .screening-heading h1 {
    font-size: 2.45rem;
  }

  .confirmation-page {
    grid-template-columns: 1fr;
    padding-top: 6rem;
  }

  .confirmation-copy h1 {
    font-size: 3rem;
  }

  .confirmation-page > img {
    width: min(100%, 18rem);
  }
}
~~~

- [ ] **Step 6: Run route and gate tests**

Run:

~~~powershell
npm run test -- src/components/WatchGate.spec.ts src/App.spec.ts
npm run build
~~~

Expected: tests and build pass; the App route test now exercises the real watch and confirmation pages.

- [ ] **Step 7: Commit**

~~~powershell
git add src/components/WatchGate.vue src/components/WatchGate.spec.ts src/components/ScreeningRoom.vue src/pages/WatchPage.vue src/pages/ConfirmationPage.vue src/styles/main.css
git commit -m "feat: add private screening flow"
~~~

---

### Task 8: Document Cloudflare direct deployment and retire active Eleventy source

**Files:**

- Create: .env.example
- Modify: README.md
- Create: docs/deployment-cloudflare.md
- Delete: eleventy.config.js
- Delete: src/index.njk
- Delete: src/index.njk.bk
- Delete: src/watch.njk
- Delete: src/confirmation.njk
- Delete: src/_layouts/base.njk
- Delete: src/_data/site.json
- Delete: src/_data/colors.json
- Delete: src/css/styles.css

**Interfaces:**

- Produces a local-to-Cloudflare deployment runbook with no hosted Git provider requirement.
- Leaves the generated docs snapshot and non-Eleventy operational artifacts intact.

- [ ] **Step 1: Add public environment examples**

Create .env.example:

~~~dotenv
VITE_WORKER_API_BASE_URL=https://gwingz-worker.calebmills99.workers.dev
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
VITE_FUTURE_OFFER_URL=
~~~

- [ ] **Step 2: Replace the repository README**

Replace README.md:

~~~~markdown
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
~~~~

- [ ] **Step 3: Add the deployment runbook**

Create docs/deployment-cloudflare.md:

~~~~markdown
# Cloudflare deployment

The Vue app and Worker deploy independently from the local repository. No hosted Git provider is required.

## One-time setup

Authenticate Wrangler:

~~~powershell
npx wrangler login
~~~

Create the Pages project during the first direct upload:

~~~powershell
npm run deploy:pages
~~~

Wrangler deploys the dist directory to the golden-wings-screening Pages project.

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
4. Run npm run deploy:pages.
5. Open /, /confirmation, and /watch on the Pages domain.
~~~~

- [ ] **Step 4: Remove the inactive Eleventy source**

Delete the exact files listed in this task. Do not delete docs/, gwingz-worker.js, Apps Script files, Webflow files, or admin-dashboard.html.

Expected: rg --files src contains Vue, TypeScript, tests, styles, and retained media only; no .njk files remain.

- [ ] **Step 5: Verify the direct-upload command and clean build**

Run:

~~~powershell
npm run verify
npx wrangler pages deploy --help
$njk = @(rg --files src | rg "\.njk$")
if ($njk.Count -gt 0) {
  $njk
  throw "Eleventy templates remain under src"
}
~~~

Expected: verification passes, Wrangler prints Pages deploy help, and the final command prints nothing.

- [ ] **Step 6: Commit**

~~~powershell
git add .env.example README.md docs/deployment-cloudflare.md
git add -u eleventy.config.js src
git commit -m "docs: switch to Cloudflare direct deployment"
~~~

---

### Task 9: Verify the complete funnel in desktop and mobile browsers

**Files:**

- Create: playwright.config.ts
- Create: e2e/funnel.spec.ts

**Interfaces:**

- Starts the Vite server at http://127.0.0.1:4173.
- Verifies conversion, screening access, route rendering, viewport fit, and screenshots at desktop, mobile, and small-mobile sizes.

- [ ] **Step 1: Write the browser test configuration**

Create playwright.config.ts:

~~~ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    colorScheme: 'light',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 1000 } }
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 } }
    },
    {
      name: 'small-mobile',
      use: { viewport: { width: 320, height: 568 } }
    }
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true
  }
})
~~~

- [ ] **Step 2: Write end-to-end funnel tests**

Create e2e/funnel.spec.ts:

~~~ts
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/rsvp', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    })
  })

  await page.route('**/api/watch-access', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    })
  })
})

test('home funnel renders, hints at the next section, and converts', async ({
  page
}, testInfo) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Golden Wings' })
  ).toBeVisible()

  const viewport = page.viewportSize()
  const storyTop = await page.locator('#story').evaluate((element) => {
    return element.getBoundingClientRect().top
  })
  expect(viewport).not.toBeNull()
  expect(storyTop).toBeLessThan(viewport?.height || 0)

  await page.screenshot({
    path: testInfo.outputPath('home-full.png'),
    fullPage: true
  })

  await page.locator('#offer-name').fill('Robyn Stewart')
  await page.locator('#offer-email').fill('robyn@example.com')
  await page.getByRole('button', { name: 'Send my watch link' }).click()

  await expect(page).toHaveURL(/\/confirmation$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Check your email' })
  ).toBeVisible()
})

test('watch gate opens the screening room', async ({ page }, testInfo) => {
  await page.goto('/watch')
  await page.locator('#viewer-email').fill('viewer@example.com')
  await page.getByRole('button', { name: 'Open the screening room' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'Golden Wings' })
  ).toBeVisible()
  await expect(page.getByTitle('Golden Wings documentary')).toBeVisible()

  await page.screenshot({
    path: testInfo.outputPath('screening-room.png'),
    fullPage: true
  })
})

test('public routes do not overflow the viewport', async ({ page }) => {
  for (const path of ['/', '/confirmation', '/watch']) {
    await page.goto(path)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    expect(hasHorizontalOverflow, path).toBe(false)
  }
})
~~~

- [ ] **Step 3: Install Chromium and run browser tests**

Run:

~~~powershell
npx playwright install chromium
npm run e2e
~~~

Expected: nine tests pass, three tests across each of the three viewport projects.

- [ ] **Step 4: Inspect the screenshots and correct visual defects**

Open the desktop, mobile, and small-mobile home-full.png and screening-room.png files under test-results with the local image viewer.

Check all of the following:

- The image output is nonblank.
- Golden Wings, Robyn, and the CTA are visible in the first viewport.
- A visible portion of the story band appears at the bottom of the first viewport.
- No copy, portrait, button, form field, poster, iframe, or laurel overlaps another control.
- The 320-pixel viewport has no clipped text or horizontal scroll.
- The screening iframe keeps a stable 16:9 frame.

If any check fails, adjust only the responsible selector in src/styles/main.css, rerun npm run e2e, and inspect the replacement screenshot.

- [ ] **Step 5: Run final verification**

Run:

~~~powershell
npm run test
npm run build
npm run e2e
git status --short
~~~

Expected: unit tests, Worker tests, build, and browser tests pass; git status lists only Playwright files and any intentional visual correction.

- [ ] **Step 6: Commit**

~~~powershell
git add playwright.config.ts e2e src/styles/main.css
git commit -m "test: verify funnel across viewports"
~~~

- [ ] **Step 7: Start the local app for handoff**

Run and leave the process active:

~~~powershell
npm run dev -- --host 127.0.0.1 --port 5173
~~~

Expected: Vite reports http://127.0.0.1:5173 and the three public routes are available for local review.

---

## Self-review

Spec coverage:

- Vue, Vite, Vue Router, and Tailwind app: Tasks 2, 5, 6, and 7.
- Name and email watch-link conversion: Tasks 3 and 6.
- Worker API preservation and Cloudflare-hosted email link: Task 4.
- Email-gated screening room and access logging: Task 7.
- Confirmation route: Task 7.
- Cloudflare Direct Upload without GitHub: Task 8.
- Auth0-ready boundary without forced login: Task 3.
- Real film and presskit media: Tasks 1 and 5.
- Unit, Worker, build, desktop, and mobile verification: Tasks 2 through 9.
- Live checkout, download delivery, entitlement, and account routes remain outside phase one.

Wording scan:

- No unfinished markers, incomplete instructions, or undefined neighboring interfaces remain.
- The only future behavior is the explicitly inactive Auth0 configuration and the out-of-scope purchase/download phase.

Type consistency:

- createAppRouter, CloudflareApiClient, OfferCapturePayload, WatchAccessPayload, validateEmail, validateOfferCapture, and filmOffer retain the same names everywhere they are consumed.
- Form event names are captured and unlocked in both implementation and tests.
- Route names are home, watch, and confirmation throughout.
- Public media paths created in Task 1 exactly match filmOffer in Task 3.

## Basis

[^1]: Approved design spec: docs/superpowers/specs/2026-06-26-vue-cloudflare-funnel-design.md.
[^2]: Existing API and email behavior: gwingz-worker.js; Cloudflare Pages Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/.
[^3]: Canonical title, synopsis, awards, contacts, and unresolved runtime: E:\GoldenWings\presskit\FACT_SHEET.md, last updated 2026-07-03.
[^4]: Verified source paths and presskit handling rules: E:\GoldenWings\presskit\AGENTS.md plus successful Test-Path and ImageMagick identify output on 2026-07-16.
[^5]: Package versions checked with npm view on 2026-07-16; Vue Router is pinned to 4.6.4 because its only peer is Vue 3.5, while 5.2.0 adds unrelated Pinia peers. Local runtime was Node v26.4.0 and npm 11.17.0.
[^6]: TypeScript 7.0 release guidance, "Running Side-by-Side with TypeScript 6.0": https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/.
