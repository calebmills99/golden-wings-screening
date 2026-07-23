<script setup lang="ts">
defineProps<{
  items: ReadonlyArray<{
    value: string
    label: string
    sublabel?: string
  }>
}>()
</script>

<template>
  <div class="gw-stat-strip gw-stat-strip--paper">
    <div v-for="item in items" :key="item.label" class="gw-stat">
      <span class="gw-stat__value">{{ item.value }}</span>
      <span class="gw-stat__label">{{ item.label }}</span>
      <span v-if="item.sublabel" class="gw-stat__sublabel">
        {{ item.sublabel }}
      </span>
    </div>
  </div>
</template>
