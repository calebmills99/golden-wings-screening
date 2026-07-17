<script setup lang="ts">
import { nextTick, ref } from 'vue'
import ScreeningRoom from '../components/ScreeningRoom.vue'
import SiteLayout from '../components/SiteLayout.vue'
import WatchGate from '../components/WatchGate.vue'

const unlocked = ref(false)

async function openScreeningRoom() {
  unlocked.value = true
  await nextTick()
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
</script>

<template>
  <SiteLayout>
    <section class="watch-page">
      <WatchGate v-if="!unlocked" @unlocked="openScreeningRoom" />
      <ScreeningRoom v-else />
    </section>
  </SiteLayout>
</template>
