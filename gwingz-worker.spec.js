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
