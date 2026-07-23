<script setup lang="ts">
import { computed } from 'vue'
import { Clock3, Mail } from 'lucide-vue-next'
import { filmOffer, type ScreeningState } from '../content/filmOffer'

const props = defineProps<{
  embedUrl?: string
  screeningState?: ScreeningState
  statusMessage?: string
}>()

const screeningUrl = computed(() => props.embedUrl ?? '')
const roomState = computed<ScreeningState>(() => {
  if (screeningUrl.value) {
    return 'open'
  }
  return props.screeningState || filmOffer.screeningState
})

const pendingCopy = computed(() => {
  if (roomState.value === 'scheduled') {
    return {
      heading: filmOffer.watch.scheduledHeading,
      body: props.statusMessage || filmOffer.watch.scheduledBody
    }
  }
  if (roomState.value === 'closed') {
    return {
      heading: filmOffer.watch.closedHeading,
      body: props.statusMessage || filmOffer.watch.closedBody
    }
  }
  return {
    heading: filmOffer.watch.pendingHeading,
    body: props.statusMessage || filmOffer.watch.pendingBody
  }
})
</script>

<template>
  <section class="screening-room" aria-labelledby="screening-title">
    <div class="screening-heading">
      <p class="route-label">{{ filmOffer.watch.eyebrow }}</p>
      <h1 id="screening-title">Golden Wings</h1>
      <p>
        {{
          screeningUrl
            ? filmOffer.watch.readyBody
            : filmOffer.watch.pendingIntro
        }}
      </p>
    </div>

    <div
      class="screening-frame"
      :class="{ 'screening-frame--pending': !screeningUrl }"
    >
      <iframe
        v-if="screeningUrl"
        :src="screeningUrl"
        title="Golden Wings documentary"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      <div v-else class="screening-pending" role="status">
        <img :src="filmOffer.assets.hero" alt="" aria-hidden="true" />
        <div class="screening-pending-copy">
          <Clock3 :size="24" aria-hidden="true" />
          <h2>{{ pendingCopy.heading }}</h2>
          <p>{{ pendingCopy.body }}</p>
        </div>
      </div>
    </div>

    <a class="screening-contact" :href="'mailto:' + filmOffer.contactEmail">
      <Mail :size="18" aria-hidden="true" />
      <span>Contact the film team</span>
    </a>
  </section>
</template>
