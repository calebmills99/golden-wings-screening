<script setup lang="ts">
import { computed } from 'vue'
import { Clock3, Mail } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'

const props = defineProps<{
  embedUrl?: string
}>()

const screeningUrl = computed(
  () => props.embedUrl ?? filmOffer.watch.embedUrl
)
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
          <h2>{{ filmOffer.watch.pendingHeading }}</h2>
          <p>{{ filmOffer.watch.pendingBody }}</p>
        </div>
      </div>
    </div>

    <a class="screening-contact" :href="'mailto:' + filmOffer.contactEmail">
      <Mail :size="18" aria-hidden="true" />
      <span>Contact the film team</span>
    </a>
  </section>
</template>
