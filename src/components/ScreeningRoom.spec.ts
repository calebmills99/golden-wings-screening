import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScreeningRoom from './ScreeningRoom.vue'

describe('ScreeningRoom', () => {
  it('shows a deliberate pre-launch state without a screening source', () => {
    const wrapper = mount(ScreeningRoom, {
      props: { embedUrl: '' }
    })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toContain(
      'The screening room is being prepared.'
    )
  })

  it('renders the configured screening source', () => {
    const embedUrl = 'https://screening.example/embed'
    const wrapper = mount(ScreeningRoom, {
      props: { embedUrl }
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.get('iframe').attributes()).toMatchObject({
      src: embedUrl,
      title: 'Golden Wings documentary'
    })
  })
})
