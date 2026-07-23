<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  rows: ReadonlyArray<{
    time: string
    destination: string
    remark?: string
    status: string
  }>
}>()
</script>

<template>
  <div class="gw-departure-board">
    <div class="gw-departure-board__header">
      <span>{{ title || 'Departures' }}</span>
      <span v-if="subtitle">{{ subtitle }}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Destination</th>
          <th>Remark</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.time + '-' + row.destination">
          <td>{{ row.time }}</td>
          <td>{{ row.destination }}</td>
          <td>{{ row.remark || '' }}</td>
          <td :class="'gw-departure-board__status--' + row.status.replace(' ', '')">
            {{ row.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
