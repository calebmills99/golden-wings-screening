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
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      env: {
        VITE_SCREENING_EMBED_URL: 'https://screening.example/embed'
      }
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4174',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
      env: {
        VITE_SCREENING_EMBED_URL: ''
      }
    }
  ]
})
