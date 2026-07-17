<script setup lang="ts">
import { ArrowRight, MailCheck } from 'lucide-vue-next'
import SiteLayout from '../components/SiteLayout.vue'
import { filmOffer } from '../content/filmOffer'
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
          <RouterLink class="confirmation-primary" to="/watch">
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
