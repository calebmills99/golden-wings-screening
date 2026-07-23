<script setup lang="ts">
import { useRouter } from 'vue-router'
import FestivalDepartures from '../components/FestivalDepartures.vue'
import FilmStory from '../components/FilmStory.vue'
import FunnelHero from '../components/FunnelHero.vue'
import NowBoarding from '../components/NowBoarding.vue'
import PreviewPlayer from '../components/PreviewPlayer.vue'
import SiteLayout from '../components/SiteLayout.vue'

const router = useRouter()

async function continueToConfirmation() {
  await router.push({ name: 'confirmation' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
</script>

<template>
  <SiteLayout>
    <FunnelHero />
    <FilmStory />
    <PreviewPlayer />
    <FestivalDepartures />
    <NowBoarding @captured="continueToConfirmation" />
  </SiteLayout>
</template>
