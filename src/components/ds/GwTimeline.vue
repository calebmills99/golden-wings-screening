<script setup lang="ts">
defineProps<{
  items: ReadonlyArray<{
    year: string
    title: string
    description?: string
  }>
}>()
</script>

<template>
  <ol class="gw-timeline gw-timeline--on-paper">
    <li
      v-for="item in items"
      :key="item.year + '-' + item.title"
      class="gw-timeline__item"
    >
      <span class="gw-timeline__dot"></span>
      <span class="gw-timeline__year">{{ item.year }}</span>
      <h4 class="gw-timeline__title">{{ item.title }}</h4>
      <p v-if="item.description" class="gw-timeline__description">
        {{ item.description }}
      </p>
    </li>
  </ol>
</template>
