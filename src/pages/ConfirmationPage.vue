<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, MailCheck } from 'lucide-vue-next'
import SiteLayout from '../components/SiteLayout.vue'
import { filmOffer } from '../content/filmOffer'

const watchTarget = computed(() => {
  const email = String(sessionStorage.getItem('gw-watch-email') || '').trim()
  return email
    ? { name: 'watch' as const, query: { email } }
    : { name: 'watch' as const }
})
</script>

<template>
  <SiteLayout>
    <section class="confirmation-page">
      <div class="confirmation-copy">
        <p class="route-label">{{ filmOffer.confirmation.eyebrow }}</p>
        <MailCheck :size="38" aria-hidden="true" />
        <h1>{{ filmOffer.confirmation.heading }}</h1>
        <p>{{ filmOffer.confirmation.body }}</p>
        <div class="confirmation-actions">
          <RouterLink class="confirmation-primary" :to="watchTarget">
            <span>Open the screening room</span>
            <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
          <RouterLink class="text-link" to="/">Return to Golden Wings</RouterLink>
        </div>
      </div>
      <img
        :src="filmOffer.assets.poster"
        :alt="filmOffer.title + ' poster'"
      />
    </section>
  </SiteLayout>
</template>
