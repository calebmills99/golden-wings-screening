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
