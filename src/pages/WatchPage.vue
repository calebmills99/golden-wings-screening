<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ScreeningRoom from '../components/ScreeningRoom.vue'
import SiteLayout from '../components/SiteLayout.vue'
import WatchGate from '../components/WatchGate.vue'
import type {
  ScreeningState,
  WatchTokenResult
} from '../services/cloudflareApi'

const route = useRoute()
const unlocked = ref(false)
const embedUrl = ref('')
const screeningState = ref<ScreeningState>('open')
const statusMessage = ref('')
const prefilledEmail = ref('')
const watchGate = ref<{ submitWithEmail: (email: string) => Promise<void> } | null>(
  null
)

async function openScreeningRoom(result: WatchTokenResult) {
  embedUrl.value = result.embedUrl || ''
  screeningState.value = result.screeningState
  statusMessage.value = result.message || ''
  unlocked.value = true
  await nextTick()
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

onMounted(async () => {
  const queryEmail = String(route.query.email || '').trim().toLowerCase()
  const storedEmail = String(
    sessionStorage.getItem('gw-watch-email') || ''
  ).trim().toLowerCase()
  const email = queryEmail || storedEmail
  if (!email) {
    return
  }

  prefilledEmail.value = email
  await nextTick()
  await watchGate.value?.submitWithEmail(email)
})
</script>

<template>
  <SiteLayout>
    <section class="watch-page">
      <WatchGate
        v-if="!unlocked"
        ref="watchGate"
        :initial-email="prefilledEmail"
        @unlocked="openScreeningRoom"
      />
      <ScreeningRoom
        v-else
        :embed-url="embedUrl"
        :screening-state="screeningState"
        :status-message="statusMessage"
      />
    </section>
  </SiteLayout>
</template>
