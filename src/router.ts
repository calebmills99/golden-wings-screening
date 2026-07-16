import {
  createRouter,
  createWebHistory,
  type RouterHistory,
  type RouteRecordRaw
} from 'vue-router'
import ConfirmationPage from './pages/ConfirmationPage.vue'
import HomePage from './pages/HomePage.vue'
import WatchPage from './pages/WatchPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Golden Wings: Fifty Year Flight Path' }
  },
  {
    path: '/watch',
    name: 'watch',
    component: WatchPage,
    meta: { title: 'Watch Golden Wings' }
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ConfirmationPage,
    meta: { title: 'Check your email | Golden Wings' }
  }
]

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  const appRouter = createRouter({ history, routes })

  appRouter.afterEach((to) => {
    document.title = String(to.meta.title || 'Golden Wings')
  })

  return appRouter
}

export const router = createAppRouter()
