<script setup lang="ts">
import { ref } from 'vue'
import ScreeningRoom from '../components/ScreeningRoom.vue'
import SiteLayout from '../components/SiteLayout.vue'
import WatchGate from '../components/WatchGate.vue'

const unlocked = ref(false)
</script>

<template>
  <SiteLayout>
    <section class="watch-page">
      <WatchGate v-if="!unlocked" @unlocked="unlocked = true" />
      <ScreeningRoom v-else />
    </section>
  </SiteLayout>
</template>
