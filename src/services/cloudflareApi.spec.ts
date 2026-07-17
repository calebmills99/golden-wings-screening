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
