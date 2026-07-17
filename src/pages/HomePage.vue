<script setup lang="ts">
import { useRouter } from 'vue-router'
import FilmStory from '../components/FilmStory.vue'
import FunnelHero from '../components/FunnelHero.vue'
import OfferCaptureForm from '../components/OfferCaptureForm.vue'
import PreviewPlayer from '../components/PreviewPlayer.vue'
import SiteLayout from '../components/SiteLayout.vue'
import { filmOffer } from '../content/filmOffer'

const router = useRouter()

function continueToConfirmation() {
  void router.push({ name: 'confirmation' })
}
</script>

<template>
  <SiteLayout>
    <FunnelHero />
    <FilmStory />
    <PreviewPlayer />

    <section id="offer" class="offer-section" aria-labelledby="offer-title">
      <div class="offer-copy">
        <p class="route-label route-label--dark">{{ filmOffer.offer.eyebrow }}</p>
        <h2 id="offer-title">{{ filmOffer.offer.heading }}</h2>
        <p>{{ filmOffer.offer.body }}</p>
        <img
          :src="filmOffer.assets.poster"
          :alt="filmOffer.title + ' poster'"
          loading="lazy"
        />
      </div>
      <OfferCaptureForm @captured="continueToConfirmation" />
    </section>
  </SiteLayout>
</template>
