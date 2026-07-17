<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section class="preview-section" aria-labelledby="preview-title">
    <div class="preview-copy">
      <p class="route-label">{{ filmOffer.preview.eyebrow }}</p>
      <Play :size="30" aria-hidden="true" />
      <h2 id="preview-title">{{ filmOffer.preview.heading }}</h2>
      <p>
        A first look at Robyn, the 747 family connection, and the film waiting
        inside the screening room.
      </p>
    </div>
    <div class="preview-frame">
      <iframe
        :src="filmOffer.preview.embedUrl"
        title="Golden Wings preview"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </section>
</template>
