import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '../router'
import HomePage from './HomePage.vue'

const OfferCaptureStub = defineComponent({
  emits: ['captured'],
  template:
    '<button data-test="complete-capture" @click="$emit(\'captured\')">Complete capture</button>'
})

describe('HomePage', () => {
  it('composes the funnel and routes a completed capture', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/')
    await router.isReady()

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: { OfferCaptureForm: OfferCaptureStub }
      }
    })

    expect(wrapper.find('#story').exists()).toBe(true)
    expect(wrapper.find('#offer').exists()).toBe(true)

    await wrapper.get('[data-test="complete-capture"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('confirmation')
  })
})
