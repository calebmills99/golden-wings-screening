<script setup lang="ts">
import { computed, ref } from 'vue'
import { filmOffer } from '../content/filmOffer'
import GwBoardingPass from './ds/GwBoardingPass.vue'
import GwSectionHeader from './ds/GwSectionHeader.vue'
import OfferCaptureForm from './OfferCaptureForm.vue'

const emit = defineEmits<{
  captured: []
}>()

const liveName = ref('')
const liveEmail = ref('')
const sent = ref(false)

function handleLive(payload: { name: string; email: string }) {
  liveName.value = payload.name
  liveEmail.value = payload.email
}

function handleCaptured() {
  sent.value = true
  emit('captured')
}

const passenger = computed(() => {
  const name = liveName.value.trim()
  return (name || filmOffer.boardingPass.passengerFallback).toUpperCase()
})

const gate = computed(() => {
  const email = liveEmail.value.trim()
  return email ? email.toLowerCase() : filmOffer.boardingPass.gateFallback
})

const note = computed(() => {
  if (!sent.value) {
    return filmOffer.boardingPass.noteIdle
  }
  return (
    filmOffer.boardingPass.noteSentPrefix +
    (liveEmail.value.trim() || filmOffer.boardingPass.gateFallback) +
    filmOffer.boardingPass.noteSentSuffix
  )
})

const passFields = computed(() => [
  { label: 'Flight', value: filmOffer.boardingPass.flight },
  { label: 'Gate', value: gate.value },
  { label: 'Seat', value: filmOffer.boardingPass.seat }
])
</script>

<template>
  <section id="offer" class="mr-boarding" aria-labelledby="offer-title">
    <div class="mr-boarding__header">
      <GwSectionHeader
        title-id="offer-title"
        align="center"
        :eyebrow="filmOffer.offer.eyebrow"
        :title="filmOffer.offer.heading"
        :kicker="filmOffer.offer.kicker"
      />
    </div>

    <div class="mr-boarding__notice">
      <div class="mr-boarding__notice-label">
        {{ filmOffer.editionNotice.label }}
      </div>
      <p>
        {{ filmOffer.editionNotice.leadIn
        }}<strong>{{ filmOffer.editionNotice.edition }}</strong
        >{{ filmOffer.editionNotice.body }}
      </p>
    </div>

    <div class="mr-boarding__grid">
      <OfferCaptureForm @live="handleLive" @captured="handleCaptured" />

      <div class="mr-boarding__ticket">
        <div class="mr-boarding__ticket-caption">
          {{ filmOffer.offer.ticketCaption }}
        </div>
        <div class="mr-boarding__ticket-tilt">
          <GwBoardingPass
            :passenger="passenger"
            :from="filmOffer.boardingPass.from"
            :to="filmOffer.boardingPass.to"
            :cabin="filmOffer.boardingPass.cabin"
            :note="note"
            :fields="passFields"
          />
          <div v-if="sent" class="mr-boarding__stamp" aria-hidden="true">
            Seat Held
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mr-boarding {
  background: var(--gw-paper);
  padding: 80px 80px 96px;
}

.mr-boarding__header {
  display: grid;
  justify-items: center;
}

.mr-boarding__notice {
  max-width: 780px;
  margin: 32px auto 0;
  border: 1px dashed var(--gw-gold-deep);
  background: var(--gw-cream);
  padding: 18px 28px;
  text-align: center;
}

.mr-boarding__notice-label {
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gw-signal);
}

.mr-boarding__notice p {
  margin: 10px 0 0;
  font-family: var(--gw-font-mono);
  font-size: 13px;
  line-height: 1.8;
  color: var(--gw-ink);
}

.mr-boarding__grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 64px;
  align-items: start;
  margin-top: 48px;
}

.mr-boarding__ticket {
  padding-top: 8px;
}

.mr-boarding__ticket-caption {
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gw-smoke);
  margin-bottom: 18px;
}

.mr-boarding__ticket-tilt {
  position: relative;
  transform: rotate(-1.5deg);
  filter: drop-shadow(0 18px 30px rgba(22, 19, 12, 0.25));
}

.mr-boarding__stamp {
  position: absolute;
  top: 34%;
  left: 22%;
  transform: rotate(-12deg);
  border: 3px solid var(--gw-signal);
  color: var(--gw-signal);
  font-family: var(--gw-font-mono);
  font-size: 22px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 10px 20px;
  background: rgba(253, 248, 236, 0.85);
}

@media (max-width: 64rem) {
  .mr-boarding {
    padding: 48px 20px 64px;
  }

  .mr-boarding__notice {
    margin-top: 24px;
    padding: 14px 16px;
  }

  .mr-boarding__notice p {
    font-size: 11px;
    line-height: 1.75;
  }

  .mr-boarding__grid {
    grid-template-columns: 1fr;
    gap: 28px;
    margin-top: 28px;
  }

  .mr-boarding__ticket {
    order: -1;
    padding-top: 0;
  }

  .mr-boarding__ticket-caption {
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.18em;
    margin-bottom: 12px;
  }

  .mr-boarding__ticket-tilt {
    transform: rotate(-1.5deg) scale(0.95);
    filter: drop-shadow(0 12px 22px rgba(22, 19, 12, 0.22));
  }

  .mr-boarding__ticket-tilt :deep(.gw-boarding-pass) {
    flex-direction: column;
  }

  .mr-boarding__ticket-tilt :deep(.gw-boarding-pass__stub) {
    flex-basis: auto;
    border-left: none;
    border-top: 2px dashed rgba(22, 19, 12, 0.35);
  }

  .mr-boarding__stamp {
    top: 30%;
    left: 14%;
    font-size: 18px;
    letter-spacing: 0.26em;
    padding: 8px 16px;
  }
}
</style>
