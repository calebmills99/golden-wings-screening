<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { filmOffer } from '../content/filmOffer'
import GwLaurel from './ds/GwLaurel.vue'

const heroVideo = ref<HTMLVideoElement | null>(null)

function nudgePlayback() {
  const video = heroVideo.value
  if (video && video.paused) {
    video.muted = true
    const playAttempt = video.play()
    if (playAttempt && playAttempt.catch) {
      playAttempt.catch(() => {})
    }
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', nudgePlayback)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', nudgePlayback)
})
</script>

<template>
  <section class="mr-hero" aria-labelledby="film-title">
    <video
      ref="heroVideo"
      class="mr-hero__video"
      :src="filmOffer.hero.video"
      :poster="filmOffer.hero.videoPoster"
      autoplay
      muted
      loop
      playsinline
    ></video>
    <div class="mr-hero__scrim" aria-hidden="true"></div>

    <div class="mr-hero__stack">
      <span class="mr-hero__chip">{{ filmOffer.hero.chip }}</span>
      <h1 id="film-title" class="mr-hero__title">
        {{ filmOffer.shortTitle }}
      </h1>
      <p class="mr-hero__tagline">{{ filmOffer.hero.tagline }}</p>
      <p class="mr-hero__meta">{{ filmOffer.hero.meta }}</p>
      <p class="mr-hero__logline">{{ filmOffer.hero.logline }}</p>
      <div class="mr-hero__cta-wrap">
        <a class="gw-button gw-button--gold gw-button--lg akira-cta" href="#offer">
          {{ filmOffer.hero.primaryCta }}
        </a>
      </div>
      <p class="mr-hero__cta-note">{{ filmOffer.hero.ctaNote }}</p>
    </div>

    <div class="mr-hero__laurels" aria-label="Festival recognition">
      <GwLaurel
        v-for="laurel in filmOffer.laurels"
        :key="laurel.festival"
        tone="cream"
        :award="laurel.award"
        :festival="laurel.festival"
        :year="laurel.year"
      />
    </div>
  </section>
</template>

<style scoped>
.mr-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 820px;
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  padding: 120px 80px 40px;
  background: var(--gw-midnight);
}

.mr-hero__video {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mr-hero__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(10, 18, 32, 0.55) 0%,
    rgba(10, 18, 32, 0.5) 45%,
    rgba(10, 18, 32, 0.94) 100%
  );
}

.mr-hero__stack {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  max-width: 900px;
}

.mr-hero__chip {
  display: inline-block;
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gw-cream);
  border: 1px solid var(--gw-gold);
  padding: 9px 16px;
}

.mr-hero__title {
  margin: 34px 0 0;
  font-family: var(--gw-font-display);
  font-size: 92px;
  line-height: 0.98;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--gw-cream);
  font-weight: 400;
}

.mr-hero__tagline {
  margin: 10px 0 0;
  font-family: var(--gw-font-script);
  font-size: 44px;
  color: var(--gw-gold);
  line-height: 1.1;
}

.mr-hero__meta {
  margin: 22px 0 0;
  font-family: var(--gw-font-mono);
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(247, 238, 219, 0.75);
}

.mr-hero__logline {
  margin: 22px 0 0;
  max-width: 640px;
  font-family: var(--gw-font-body);
  font-size: 17px;
  line-height: 1.7;
  color: rgba(247, 238, 219, 0.88);
}

.mr-hero__cta-wrap {
  display: grid;
  justify-items: center;
  margin-top: 36px;
}

.mr-hero__cta-note {
  margin: 18px 0 0;
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(247, 238, 219, 0.6);
}

.mr-hero__laurels {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 56px;
  margin-top: 56px;
}

@media (max-width: 64rem) {
  .mr-hero {
    min-height: 620px;
    padding: 96px 20px 40px;
  }

  .mr-hero__chip {
    font-size: 9px;
    letter-spacing: 0.18em;
    padding: 7px 12px;
  }

  .mr-hero__title {
    margin-top: 24px;
    font-size: 40px;
    line-height: 1;
  }

  .mr-hero__tagline {
    margin-top: 8px;
    font-size: 28px;
  }

  .mr-hero__meta {
    margin-top: 16px;
    font-size: 10px;
    letter-spacing: 0.14em;
    line-height: 1.8;
  }

  .mr-hero__logline {
    font-size: 15px;
  }

  .mr-hero__cta-wrap {
    width: 100%;
    max-width: 350px;
    margin-top: 24px;
  }

  .mr-hero__cta-wrap .akira-cta {
    width: 100%;
    font-size: 10px;
    letter-spacing: 0.04em;
    padding: 20px 16px;
  }

  .mr-hero__cta-note {
    margin-top: 14px;
    font-size: 9px;
    letter-spacing: 0.16em;
  }

  .mr-hero__laurels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 4px;
    margin-top: 40px;
    justify-items: center;
  }

  .mr-hero__laurels :deep(.gw-laurel) {
    transform: scale(0.68);
    transform-origin: center;
  }
}
</style>
