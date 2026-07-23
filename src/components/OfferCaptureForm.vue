<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { filmOffer } from '../content/filmOffer'
import { validateOfferCapture } from '../domain/leadValidation'
import {
  cloudflareApi,
  type CloudflareApiClient
} from '../services/cloudflareApi'

const props = withDefaults(
  defineProps<{
    api?: Pick<CloudflareApiClient, 'submitOfferCapture'>
  }>(),
  {
    api: () => cloudflareApi
  }
)

const emit = defineEmits<{
  captured: []
  live: [payload: { name: string; email: string }]
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  source: '',
  honeypot: '',
  smsOptIn: false
})

watch(
  () => [form.name, form.email],
  ([name, email]) => {
    emit('live', { name, email })
  }
)

watch(
  () => form.phone,
  (phone) => {
    if (!phone.trim()) {
      form.smsOptIn = false
    }
  }
)

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')

async function submit() {
  const validationMessage = validateOfferCapture(form.name, form.email)
  if (validationMessage) {
    state.value = 'error'
    message.value = validationMessage
    return
  }

  if (form.phone.trim() && !form.smsOptIn) {
    state.value = 'error'
    message.value = filmOffer.offer.smsOptInRequired
    return
  }

  if (form.honeypot) {
    return
  }

  state.value = 'loading'
  message.value = ''

  try {
    const email = form.email.trim().toLowerCase()
    await props.api.submitOfferCapture({
      name: form.name.trim(),
      email,
      phone: form.phone.trim(),
      source: form.source.trim(),
      honeypot: form.honeypot,
      smsOptIn: form.smsOptIn,
      emailOptIn: true
    })
    sessionStorage.setItem('gw-watch-email', email)
    state.value = 'success'
    message.value = filmOffer.offer.success
    emit('captured')
  } catch {
    state.value = 'error'
    message.value = filmOffer.offer.error
  }
}
</script>

<template>
  <form class="manifest-form" novalidate @submit.prevent="submit">
    <div class="manifest-form__header">
      <span>{{ filmOffer.offer.manifestLabel }}</span>
      <span class="manifest-form__admit">{{ filmOffer.offer.admitLabel }}</span>
    </div>

    <div class="manifest-form__fields">
      <div class="manifest-field">
        <label for="offer-name">Passenger name</label>
        <input
          id="offer-name"
          v-model="form.name"
          name="name"
          autocomplete="name"
          required
        />
      </div>

      <div class="manifest-field">
        <label for="offer-email">Email — where the link lands</label>
        <input
          id="offer-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
        />
      </div>

      <div class="manifest-form__optional">
        <div class="manifest-field">
          <label for="offer-phone">Phone — optional</label>
          <input
            id="offer-phone"
            v-model="form.phone"
            name="phone"
            type="tel"
            autocomplete="tel"
          />
        </div>

        <div class="manifest-field">
          <label for="offer-source">How did you hear? — optional</label>
          <input id="offer-source" v-model="form.source" name="source" />
        </div>
      </div>

      <div v-if="form.phone.trim()" class="manifest-consent">
        <label class="manifest-consent__check" for="offer-sms-opt-in">
          <input
            id="offer-sms-opt-in"
            v-model="form.smsOptIn"
            name="sms-opt-in"
            type="checkbox"
          />
          <span>{{ filmOffer.offer.smsOptInLabel }}</span>
        </label>
        <p class="manifest-consent__copy">
          {{ filmOffer.offer.smsConsent }}
          <a :href="filmOffer.legal.privacy">Privacy Policy</a>
          ·
          <a :href="filmOffer.legal.terms">Terms of Service</a>
        </p>
      </div>

      <div class="hp-field" aria-hidden="true">
        <label for="offer-hp">Leave blank</label>
        <input
          id="offer-hp"
          v-model="form.honeypot"
          name="hp-check"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <button
        class="gw-button gw-button--gold gw-button--lg gw-button--full"
        type="submit"
        :disabled="state === 'loading'"
      >
        {{ state === 'loading' ? 'Sending your link' : filmOffer.offer.submitLabel }}
      </button>

      <p
        v-if="message"
        class="manifest-status"
        :class="'manifest-status--' + state"
        role="status"
      >
        {{ message }}
      </p>

      <p class="manifest-consent__email">
        {{ filmOffer.offer.emailConsent }}
        <a :href="filmOffer.legal.privacy">Privacy</a>
        ·
        <a :href="filmOffer.legal.terms">Terms</a>
      </p>

      <p class="manifest-form__trust">{{ filmOffer.offer.trustLine }}</p>
    </div>
  </form>
</template>

<style scoped>
.manifest-form {
  background: var(--gw-cream);
  border: 1px solid var(--gw-line);
  box-shadow: var(--gw-shadow-card);
  padding: 36px 36px 30px;
}

.manifest-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gw-gold);
  padding-bottom: 14px;
  margin-bottom: 26px;
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gw-ink);
}

.manifest-form__admit {
  color: var(--gw-signal);
}

.manifest-form__fields {
  display: grid;
  gap: 20px;
}

.manifest-field {
  display: grid;
  gap: 8px;
}

.manifest-field label {
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gw-smoke);
}

.manifest-field input {
  font-family: var(--gw-font-mono);
  font-size: 16px;
  color: var(--gw-ink);
  background: var(--gw-paper);
  border: 1px solid var(--gw-line);
  border-radius: 0;
  padding: 13px 14px;
  width: 100%;
  outline: none;
}

.manifest-field input:focus {
  border-color: var(--gw-gold);
}

.manifest-form__optional {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.manifest-consent {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border: 1px dashed var(--gw-gold-deep);
  background: var(--gw-paper);
}

.manifest-consent__check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gw-ink);
  cursor: pointer;
}

.manifest-consent__check input {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  flex: none;
  accent-color: var(--gw-gold);
}

.manifest-consent__copy,
.manifest-consent__email {
  margin: 0;
  font-family: var(--gw-font-body);
  font-size: 13px;
  line-height: 1.55;
  color: var(--gw-smoke);
}

.manifest-consent__copy a,
.manifest-consent__email a {
  color: var(--gw-gold-deep);
}

.hp-field {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.manifest-status {
  margin: 0;
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.manifest-status--error {
  color: var(--gw-signal);
}

.manifest-status--success {
  color: var(--gw-gold-deep);
}

.manifest-form__trust {
  margin: 0;
  text-align: center;
  font-family: var(--gw-font-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gw-smoke);
  padding-top: 4px;
}

@media (max-width: 40rem) {
  .manifest-form {
    padding: 24px 20px;
  }

  .manifest-form__optional {
    grid-template-columns: 1fr;
  }
}
</style>
