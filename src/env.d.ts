/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKER_API_BASE_URL?: string
  readonly VITE_AUTH0_DOMAIN?: string
  readonly VITE_AUTH0_CLIENT_ID?: string
  readonly VITE_AUTH0_AUDIENCE?: string
  readonly VITE_FUTURE_OFFER_URL?: string
  readonly VITE_SCREENING_EMBED_URL?: string
  readonly VITE_SCREENING_STATE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
