<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
import GwSectionHeader from './ds/GwSectionHeader.vue'
</script>

<template>
  <section class="mr-preview" aria-labelledby="preview-title">
    <div>
      <GwSectionHeader
        title-id="preview-title"
        on-dark
        :eyebrow="filmOffer.preview.eyebrow"
        :title="filmOffer.preview.heading"
        :kicker="filmOffer.preview.kicker"
      />
      <div class="mr-preview__runtime">{{ filmOffer.preview.runtimeLine }}</div>
    </div>
    <div>
      <div class="mr-preview__labels">
        <span>Cabin screen 01</span>
        <span>GW · 1971</span>
      </div>
      <div class="preview-frame mr-preview__frame">
        <iframe
          :src="filmOffer.preview.embedUrl"
          title="Golden Wings preview"
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mr-preview {
  background: var(--gw-midnight);
  color: var(--gw-cream);
  padding: 80px;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 64px;
  align-items: center;
}

.mr-preview__runtime {
  margin-top: 28px;
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gw-gold);
}

.mr-preview__labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(247, 238, 219, 0.6);
  padding-bottom: 10px;
}

.mr-preview__frame {
  aspect-ratio: 16 / 9;
  background: #000;
  border: 1px solid rgba(245, 177, 32, 0.45);
  overflow: hidden;
}

.mr-preview__frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

@media (max-width: 64rem) {
  .mr-preview {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 48px 20px;
  }

  .mr-preview__runtime {
    margin-top: 14px;
    font-size: 10px;
    letter-spacing: 0.18em;
  }
}
</style>
