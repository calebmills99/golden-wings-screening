import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FilmStory from './FilmStory.vue'

describe('FilmStory', () => {
  it('renders factual waypoints and four award marks', () => {
    const wrapper = mount(FilmStory)

    expect(wrapper.text()).toContain('1971')
    expect(wrapper.text()).toContain('Jay R. Ricks')
    expect(wrapper.text()).toContain('Gold wings')
    expect(wrapper.findAll('.award-mark')).toHaveLength(4)
  })
})
