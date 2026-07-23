import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WatchGate from './WatchGate.vue'

describe('WatchGate', () => {
  it('requires a valid email', async () => {
    const requestWatchToken = vi.fn(async () => ({
      embedUrl: '',
      screeningState: 'open' as const
    }))
    const wrapper = mount(WatchGate, {
      props: { api: { requestWatchToken } }
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
    expect(requestWatchToken).not.toHaveBeenCalled()
  })

  it('requests a watch token and unlocks for a valid email', async () => {
    const requestWatchToken = vi.fn(async () => ({
      embedUrl: 'https://screening.example/embed',
      screeningState: 'open' as const
    }))
    const wrapper = mount(WatchGate, {
      props: { api: { requestWatchToken } }
    })

    await wrapper.get('#viewer-email').setValue(' VIEWER@example.com ')
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()

    expect(requestWatchToken).toHaveBeenCalledWith({
      email: 'viewer@example.com',
      honeypot: '',
      source: 'watch-gate'
    })
    expect(wrapper.emitted('unlocked')?.[0]?.[0]).toEqual({
      embedUrl: 'https://screening.example/embed',
      screeningState: 'open'
    })
  })

  it('shows an error when the token request fails', async () => {
    const requestWatchToken = vi.fn(async () => {
      throw new Error('offline')
    })
    const wrapper = mount(WatchGate, {
      props: { api: { requestWatchToken } }
    })

    await wrapper.get('#viewer-email').setValue('viewer@example.com')
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()

    expect(wrapper.emitted('unlocked')).toBeUndefined()
    expect(wrapper.get('[role="status"]').text()).toContain(
      'The screening room could not be opened.'
    )
  })
})
