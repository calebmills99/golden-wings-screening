import {
  createRouter,
  createWebHistory,
  type RouterHistory,
  type RouteRecordRaw
} from 'vue-router'
import ConfirmationPage from './pages/ConfirmationPage.vue'
import HomePage from './pages/HomePage.vue'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.vue'
import TermsOfServicePage from './pages/TermsOfServicePage.vue'
import WatchPage from './pages/WatchPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Golden Wings' }
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
  },
  {
    path: '/privacy-policy',
    name: 'privacy',
    component: PrivacyPolicyPage,
    meta: { title: 'Privacy Policy | Golden Wings' }
  },
  {
    path: '/terms-of-service',
    name: 'terms',
    component: TermsOfServicePage,
    meta: { title: 'Terms of Service | Golden Wings' }
  },
  {
    path: '/terms-of-use',
    redirect: { name: 'terms' }
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
