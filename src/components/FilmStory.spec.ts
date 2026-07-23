import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FilmStory from './FilmStory.vue'

describe('FilmStory', () => {
  it('renders the flight record with timeline and stats', () => {
    const wrapper = mount(FilmStory)

    expect(wrapper.text()).toContain('1971')
    expect(wrapper.text()).toContain('Jay R. Ricks')
    expect(wrapper.text()).toContain('Fifty-Five Years in the Cabin')
    expect(wrapper.text()).toContain('55+')
    expect(wrapper.findAll('.gw-timeline__item')).toHaveLength(3)
    expect(wrapper.findAll('.gw-stat')).toHaveLength(4)
    expect(wrapper.findAll('.mr-story__photo')).toHaveLength(2)
  })
})
