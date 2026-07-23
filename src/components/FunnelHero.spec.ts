import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FunnelHero from './FunnelHero.vue'

describe('FunnelHero', () => {
  it('boards the Midnight Rocket from the first section', () => {
    const wrapper = mount(FunnelHero)

    expect(wrapper.get('h1').text()).toBe('Golden Wings')
    expect(wrapper.text()).toContain('Find Your Wings')
    expect(wrapper.get('a[href="#offer"]').text()).toContain(
      'Board the Midnight Rocket'
    )
    expect(wrapper.get('video').attributes('src')).toContain('clouds-aerial')
    expect(wrapper.findAll('.gw-laurel')).toHaveLength(4)
  })
})
