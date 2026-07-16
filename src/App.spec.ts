import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from './App.vue'
import { createAppRouter } from './router'

describe('App routes', () => {
  it.each([
    ['/', 'Golden Wings'],
    ['/watch', 'Access your screening'],
    ['/confirmation', 'Check your email']
  ])('renders %s', async (path, heading) => {
    const router = createAppRouter(createMemoryHistory())
    await router.push(path)
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] }
    })

    expect(wrapper.get('h1').text()).toContain(heading)
  })
})
