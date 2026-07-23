<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    kicker?: string
    align?: 'left' | 'center'
    rule?: boolean
    onDark?: boolean
    titleId?: string
  }>(),
  { align: 'left', rule: true, onDark: false }
)
</script>

<template>
  <header
    class="gw-section-header"
    :class="['gw-section-header--' + align, onDark ? 'gw-on-dark' : '']"
  >
    <span v-if="eyebrow" class="gw-section-header__eyebrow">{{ eyebrow }}</span>
    <h2 :id="titleId" class="gw-section-header__title">{{ title }}</h2>
    <p v-if="kicker" class="gw-section-header__kicker">{{ kicker }}</p>
    <hr v-if="rule" class="gw-section-header__rule" />
  </header>
</template>
