export interface OfferCapturePayload {
  name: string
  email: string
  phone: string
  source: string
  honeypot: string
  smsOptIn?: boolean
  emailOptIn?: boolean
}

export interface WatchAccessPayload {
  email: string
  page: 'watch'
  honeypot: string
}

export interface WatchTokenPayload {
  email: string
  honeypot: string
  name?: string
  source?: string
}

export type ScreeningState = 'open' | 'scheduled' | 'closed'

export interface WatchTokenResult {
  embedUrl: string
  screeningState: ScreeningState
  message?: string
}

export interface CloudflareApiClient {
  submitOfferCapture(payload: OfferCapturePayload): Promise<void>
  logWatchAccess(payload: WatchAccessPayload): Promise<void>
  requestWatchToken(payload: WatchTokenPayload): Promise<WatchTokenResult>
}

interface CloudflareApiClientConfig {
  baseUrl: string
  fetchImpl?: typeof fetch
}

interface WorkerResult {
  success?: boolean
  error?: string
  embedUrl?: string
  screeningState?: ScreeningState
  message?: string
}

export function createCloudflareApiClient(
  config: CloudflareApiClientConfig
): CloudflareApiClient {
  const baseUrl = config.baseUrl.replace(/\/+$/, '')
  const fetchImpl = config.fetchImpl || fetch

  async function post(
    path: string,
    body: Record<string, unknown>
  ): Promise<WorkerResult> {
    const response = await fetchImpl(baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const result = (await response.json()) as WorkerResult
    if (!response.ok || result.success === false) {
      throw new Error(result.error || 'The request failed.')
    }
    return result
  }

  return {
    submitOfferCapture(payload) {
      return post('/api/rsvp', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        source: payload.source,
        'hp-check': payload.honeypot,
        smsOptIn: Boolean(payload.smsOptIn),
        emailOptIn: payload.emailOptIn !== false
      }).then(() => undefined)
    },
    logWatchAccess(payload) {
      return post('/api/watch-access', {
        type: 'watch_access',
        email: payload.email,
        timestamp: new Date().toISOString(),
        page: payload.page,
        'hp-check-watch': payload.honeypot
      }).then(() => undefined)
    },
    async requestWatchToken(payload) {
      const result = await post('/api/watch-token', {
        email: payload.email,
        name: payload.name || '',
        source: payload.source || 'watch-gate',
        'hp-check-watch': payload.honeypot
      })

      return {
        embedUrl: result.embedUrl || '',
        screeningState: result.screeningState || 'open',
        message: result.message
      }
    }
  }
}

export const cloudflareApi = createCloudflareApiClient({
  baseUrl:
    import.meta.env.VITE_WORKER_API_BASE_URL ||
    'https://gwingz-worker.calebmills99.workers.dev'
})
