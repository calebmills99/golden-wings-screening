import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FunnelHero from './FunnelHero.vue'

describe('FunnelHero', () => {
  it('puts the film and primary offer in the first section', () => {
    const wrapper = mount(FunnelHero)

    expect(wrapper.get('h1').text()).toBe('Golden Wings')
    expect(wrapper.text()).toContain('Fifty Year Flight Path')
    expect(wrapper.get('a[href="#offer"]').text()).toContain(
      'Send me the watch link'
    )
    expect(wrapper.get('img.hero-portrait').attributes('alt')).toContain(
      'Robyn Stewart'
    )
  })
})
