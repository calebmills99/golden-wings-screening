<script setup lang="ts">
defineProps<{
  award: string
  festival: string
  year?: string
  tone?: 'gold' | 'cream'
}>()
</script>

<template>
  <div class="gw-laurel" :class="'gw-laurel--' + (tone || 'gold')">
    <svg
      class="gw-laurel__branch"
      width="28"
      height="64"
      viewBox="0 0 28 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 4C10 14 6 28 8 44c1.6 9 6 14 12 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <ellipse
        v-for="(y, i) in [10, 19, 28, 37, 46]"
        :key="y"
        :cx="12 - i * 0.8"
        :cy="y"
        rx="7"
        ry="3"
        :transform="`rotate(${-38 + i * 6} ${12 - i * 0.8} ${y})`"
        fill="currentColor"
      />
    </svg>
    <div class="gw-laurel__body">
      <span class="gw-laurel__award">{{ award }}</span>
      <span class="gw-laurel__festival">{{ festival }}</span>
      <span v-if="year" class="gw-laurel__year">{{ year }}</span>
    </div>
    <svg
      class="gw-laurel__branch"
      width="28"
      height="64"
      viewBox="0 0 28 64"
      fill="none"
      aria-hidden="true"
      style="transform: scaleX(-1)"
    >
      <path
        d="M24 4C10 14 6 28 8 44c1.6 9 6 14 12 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <ellipse
        v-for="(y, i) in [10, 19, 28, 37, 46]"
        :key="y"
        :cx="12 - i * 0.8"
        :cy="y"
        rx="7"
        ry="3"
        :transform="`rotate(${-38 + i * 6} ${12 - i * 0.8} ${y})`"
        fill="currentColor"
      />
    </svg>
  </div>
</template>
