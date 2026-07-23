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
      honeypot: '',
      smsOptIn: false,
      emailOptIn: true
    })
    expect(wrapper.emitted('captured')).toHaveLength(1)
    expect(wrapper.get('[role="status"]').text()).toContain('on its way')
  })

  it('requires SMS opt-in when a phone number is provided', async () => {
    const submitOfferCapture = vi.fn()
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('#offer-name').setValue('Robyn')
    await wrapper.get('#offer-email').setValue('robyn@example.com')
    await wrapper.get('#offer-phone').setValue('5625550100')
    await wrapper.get('form').trigger('submit')

    expect(submitOfferCapture).not.toHaveBeenCalled()
    expect(wrapper.get('[role="status"]').text()).toContain('SMS')
  })

  it('submits SMS opt-in with the phone number', async () => {
    const submitOfferCapture = vi.fn(async () => undefined)
    const wrapper = mount(OfferCaptureForm, {
      props: { api: { submitOfferCapture } }
    })

    await wrapper.get('#offer-name').setValue('Robyn')
    await wrapper.get('#offer-email').setValue('robyn@example.com')
    await wrapper.get('#offer-phone').setValue('5625550100')
    await wrapper.get('#offer-sms-opt-in').setValue(true)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitOfferCapture).toHaveBeenCalledWith({
      name: 'Robyn',
      email: 'robyn@example.com',
      phone: '5625550100',
      source: '',
      honeypot: '',
      smsOptIn: true,
      emailOptIn: true
    })
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
