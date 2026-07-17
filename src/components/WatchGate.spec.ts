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
