<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
import GwDepartureBoard from './ds/GwDepartureBoard.vue'
import GwSectionHeader from './ds/GwSectionHeader.vue'
import GwWingDivider from './ds/GwWingDivider.vue'
</script>

<template>
  <section class="mr-departures" aria-labelledby="departures-title">
    <div class="mr-departures__divider">
      <GwWingDivider />
    </div>
    <div class="mr-departures__header">
      <GwSectionHeader
        title-id="departures-title"
        on-dark
        align="center"
        :eyebrow="filmOffer.departures.eyebrow"
        :title="filmOffer.departures.heading"
        :kicker="filmOffer.departures.kicker"
      />
    </div>
    <div class="mr-departures__board">
      <div class="mr-departures__board-inner">
        <GwDepartureBoard
          :title="filmOffer.departures.boardTitle"
          :subtitle="filmOffer.departures.boardSubtitle"
          :rows="filmOffer.departures.rows"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.mr-departures {
  background: var(--gw-midnight);
  color: var(--gw-cream);
  padding: 0 80px 88px;
}

.mr-departures__divider {
  padding-bottom: 56px;
}

.mr-departures__header {
  display: grid;
  justify-items: center;
}

.mr-departures__board {
  max-width: 1120px;
  margin: 40px auto 0;
}

@media (max-width: 64rem) {
  .mr-departures {
    padding: 0 20px 56px;
  }

  .mr-departures__divider {
    padding-bottom: 32px;
  }

  .mr-departures__board {
    margin-top: 20px;
    overflow-x: auto;
  }

  .mr-departures__board-inner {
    min-width: 600px;
  }
}
</style>
