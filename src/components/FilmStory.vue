<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <section id="story" class="story-section" aria-labelledby="story-title">
    <div class="story-intro">
      <p class="route-label route-label--dark">Flight record</p>
      <h2 id="story-title">{{ filmOffer.story.heading }}</h2>
      <p>{{ filmOffer.story.introduction }}</p>
      <p>{{ filmOffer.story.family }}</p>
    </div>

    <div class="story-image-pair" aria-label="Robyn Stewart then and now">
      <figure>
        <img
          :src="filmOffer.assets.robyn1971"
          alt="Robyn Stewart with her parents at her 1971 graduation"
          loading="lazy"
        />
        <figcaption>Robyn and her parents, 1971</figcaption>
      </figure>
      <figure>
        <img
          :src="filmOffer.assets.robynHeadshot"
          alt="Robyn Stewart today"
          loading="lazy"
        />
        <figcaption>More than fifty years in the cabin</figcaption>
      </figure>
    </div>

    <ol class="flight-path">
      <li v-for="waypoint in filmOffer.story.waypoints" :key="waypoint.year">
        <span class="waypoint-year">{{ waypoint.year }}</span>
        <span>{{ waypoint.label }}</span>
      </li>
    </ol>

    <div class="award-strip" aria-label="Festival recognition">
      <img
        v-for="award in filmOffer.awards"
        :key="award.label"
        class="award-mark"
        :src="award.image"
        :alt="award.label"
        loading="lazy"
      />
    </div>
  </section>
</template>
