<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="screening-room" aria-labelledby="screening-title">
    <div class="screening-heading">
      <p class="route-label">{{ filmOffer.watch.eyebrow }}</p>
      <h1 id="screening-title">Golden Wings</h1>
      <p>Welcome aboard. Your private screening is ready.</p>
    </div>

    <div class="screening-frame">
      <iframe
        :src="filmOffer.watch.embedUrl"
        title="Golden Wings documentary"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <a class="screening-contact" :href="'mailto:' + filmOffer.contactEmail">
      <Mail :size="18" aria-hidden="true" />
      <span>Contact the film team</span>
    </a>
  </section>
</template>
