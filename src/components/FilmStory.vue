<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
import GwSectionHeader from './ds/GwSectionHeader.vue'
import GwStatStrip from './ds/GwStatStrip.vue'
import GwTimeline from './ds/GwTimeline.vue'
import GwWingDivider from './ds/GwWingDivider.vue'
</script>

<template>
  <section id="story" class="mr-story" aria-labelledby="story-title">
    <div class="mr-story__grid">
      <div>
        <GwSectionHeader
          title-id="story-title"
          :eyebrow="filmOffer.story.eyebrow"
          :title="filmOffer.story.heading"
          :kicker="filmOffer.story.kicker"
        />
        <p class="mr-story__lead">{{ filmOffer.story.introduction }}</p>
        <p class="mr-story__follow">{{ filmOffer.story.family }}</p>
        <div class="mr-story__timeline">
          <GwTimeline :items="filmOffer.timeline" />
        </div>
      </div>

      <div class="mr-story__photos" aria-label="Robyn Stewart then and now">
        <figure class="mr-story__photo mr-story__photo--1971">
          <img
            :src="filmOffer.assets.robyn1971"
            alt="Robyn Stewart with her parents at her 1971 graduation"
            loading="lazy"
          />
          <figcaption>Robyn and her parents — 1971</figcaption>
        </figure>
        <figure class="mr-story__photo mr-story__photo--today">
          <img
            :src="filmOffer.assets.robynHeadshot"
            alt="Robyn Stewart today"
            loading="lazy"
          />
          <figcaption>Fifty-five years in the cabin</figcaption>
        </figure>
      </div>
    </div>

    <div class="mr-story__stats">
      <GwStatStrip :items="filmOffer.stats" />
      <div class="mr-story__divider">
        <GwWingDivider />
      </div>
    </div>
  </section>
</template>

<style scoped>
.mr-story {
  background: var(--gw-cream);
  color: var(--gw-ink);
}

.mr-story__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 24px 72px;
  padding: 80px 80px 24px;
}

.mr-story__lead {
  margin: 26px 0 0;
  font-family: var(--gw-font-body);
  font-size: 17px;
  line-height: 1.75;
  color: var(--gw-ink);
}

.mr-story__follow {
  margin: 16px 0 0;
  font-family: var(--gw-font-body);
  font-size: 17px;
  line-height: 1.75;
  color: var(--gw-smoke);
}

.mr-story__timeline {
  margin-top: 40px;
}

.mr-story__photos {
  position: relative;
  min-height: 660px;
}

.mr-story__photo {
  margin: 0;
}

.mr-story__photo img {
  display: block;
  width: 100%;
  border: 10px solid #fff;
  background: #fff;
  box-shadow: var(--gw-shadow-card);
}

.mr-story__photo figcaption {
  margin-top: 12px;
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gw-smoke);
}

.mr-story__photo--1971 {
  width: 64%;
  transform: rotate(-2deg);
}

.mr-story__photo--today {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 46%;
  transform: rotate(2.5deg);
}

.mr-story__photo--today img {
  aspect-ratio: 4 / 5;
  object-fit: cover;
  box-shadow: var(--gw-shadow-pop);
}

.mr-story__photo--today figcaption {
  text-align: right;
}

.mr-story__stats {
  padding: 24px 80px 56px;
}

.mr-story__divider {
  padding-top: 40px;
}

@media (max-width: 64rem) {
  .mr-story__grid {
    grid-template-columns: 1fr;
    padding: 48px 20px 0;
  }

  .mr-story__lead,
  .mr-story__follow {
    font-size: 15px;
    line-height: 1.7;
  }

  .mr-story__photos {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 14px;
    align-items: end;
    min-height: 0;
    margin-top: 28px;
  }

  .mr-story__photo img {
    border-width: 6px;
  }

  .mr-story__photo figcaption {
    margin-top: 8px;
    font-size: 9px;
    letter-spacing: 0.14em;
  }

  .mr-story__photo--1971 {
    width: auto;
    transform: rotate(-1.5deg);
  }

  .mr-story__photo--today {
    position: static;
    width: auto;
    transform: rotate(1.5deg);
  }

  .mr-story__photo--today img {
    box-shadow: var(--gw-shadow-card);
  }

  .mr-story__photo--today figcaption {
    text-align: left;
  }

  .mr-story__stats {
    padding: 36px 20px 48px;
  }

  .mr-story__stats :deep(.gw-stat-strip) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 12px;
    border-top-width: 3px;
    border-bottom-width: 3px;
    padding: 28px 4px;
  }
}
</style>
