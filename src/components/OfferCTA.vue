<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    href: string
    label: string
    tone?: 'gold' | 'light'
  }>(),
  {
    tone: 'gold'
  }
)
</script>

<template>
  <a class="offer-cta" :class="'offer-cta--' + tone" :href="href">
    <span>{{ label }}</span>
    <ArrowDown :size="18" aria-hidden="true" />
  </a>
</template>
