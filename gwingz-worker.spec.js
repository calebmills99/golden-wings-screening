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
      service: 'gwingz-rsvp-worker',
      screeningState: 'open'
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
    expect(viewerEmail.html).toContain(
      'https://screening.example/watch?email=robyn%40example.com'
    )
    expect(viewerEmail.html).not.toContain('github.io')
  })

  it('keeps the RSVP when Resend is not configured', async () => {
    const prepare = vi.fn(() => ({
      bind: vi.fn(() => ({
        run: vi.fn(async () => ({ success: true }))
      }))
    }))

    const response = await worker.fetch(
      jsonRequest('/api/rsvp', {
        name: 'Caleb Stewart',
        email: 'caleb@example.com',
        phone: '',
        source: 'Website',
        'hp-check': ''
      }),
      {
        PUBLIC_SITE_URL: 'https://screening.example',
        AUDIENCE_DB: { prepare }
      }
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      screeningState: 'open',
      emailDelivered: false,
      watchUrl: 'https://screening.example/watch?email=caleb%40example.com'
    })
    expect(prepare).toHaveBeenCalled()
  })

  it('returns a watch token when the screening is open', async () => {
    const prepare = vi.fn(() => ({
      bind: vi.fn(() => ({
        run: vi.fn(async () => ({ success: true }))
      }))
    }))
    const streamVideo = vi.fn(() => ({
      generateToken: vi.fn(async () => 'signed-token')
    }))
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ id: 'email_123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    )

    const response = await worker.fetch(
      jsonRequest('/api/watch-token', {
        email: 'viewer@example.com',
        'hp-check-watch': ''
      }),
      {
        RESEND_API_KEY: 'test-key',
        SCREENING_STATE: 'open',
        STREAM_CUSTOMER_CODE: 'abc123',
        STREAM_VIDEO_UID: 'video-uid',
        STREAM: { video: streamVideo },
        AUDIENCE_DB: { prepare }
      }
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      screeningState: 'open',
      embedUrl: 'https://customer-abc123.cloudflarestream.com/signed-token/iframe'
    })
    expect(streamVideo).toHaveBeenCalledWith('video-uid')
    expect(prepare).toHaveBeenCalled()
  })

  it('withholds the player when the screening is closed', async () => {
    const prepare = vi.fn(() => ({
      bind: vi.fn(() => ({
        run: vi.fn(async () => ({ success: true }))
      }))
    }))

    const response = await worker.fetch(
      jsonRequest('/api/watch-token', {
        email: 'viewer@example.com',
        'hp-check-watch': ''
      }),
      {
        SCREENING_STATE: 'closed',
        AUDIENCE_DB: { prepare }
      }
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      screeningState: 'closed',
      embedUrl: ''
    })
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
