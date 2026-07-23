import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScreeningRoom from './ScreeningRoom.vue'

describe('ScreeningRoom', () => {
  it('shows a deliberate pre-launch state without a screening source', () => {
    const wrapper = mount(ScreeningRoom, {
      props: { embedUrl: '', screeningState: 'open' }
    })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toContain(
      'The screening room is being prepared.'
    )
  })

  it('renders scheduled and closed messaging', () => {
    const scheduled = mount(ScreeningRoom, {
      props: { embedUrl: '', screeningState: 'scheduled' }
    })
    expect(scheduled.get('[role="status"]').text()).toContain(
      'The next screening is being prepared.'
    )

    const closed = mount(ScreeningRoom, {
      props: { embedUrl: '', screeningState: 'closed' }
    })
    expect(closed.get('[role="status"]').text()).toContain(
      'This screening is closed.'
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
