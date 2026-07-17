<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
import OfferCTA from './OfferCTA.vue'
</script>

<template>
  <section class="funnel-hero" aria-labelledby="film-title">
    <img
      class="hero-background"
      :src="filmOffer.assets.hero"
      alt=""
      fetchpriority="high"
    />
    <div class="hero-scrim" aria-hidden="true"></div>
    <img
      class="hero-portrait"
      :src="filmOffer.assets.robynHeadshot"
      alt="Robyn Stewart, the flight attendant at the center of Golden Wings"
      fetchpriority="high"
    />

    <div class="hero-copy">
      <p class="route-label">{{ filmOffer.hero.eyebrow }}</p>
      <h1 id="film-title">{{ filmOffer.shortTitle }}</h1>
      <p class="hero-subtitle">Fifty Year Flight Path</p>
      <p class="hero-headline">{{ filmOffer.hero.headline }}</p>
      <p class="hero-body">{{ filmOffer.hero.body }}</p>
      <div class="hero-actions">
        <OfferCTA href="#offer" :label="filmOffer.hero.primaryCta" />
        <RouterLink class="text-link" to="/watch">
          {{ filmOffer.hero.secondaryCta }}
        </RouterLink>
      </div>
    </div>

    <a class="continue-cue" href="#story">
      <span>Continue the flight path</span>
      <span aria-hidden="true">↓</span>
    </a>
  </section>
</template>
