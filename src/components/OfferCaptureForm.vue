<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Mail } from 'lucide-vue-next'
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
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  source: '',
  honeypot: ''
})

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')

async function submit() {
  const validationMessage = validateOfferCapture(form.name, form.email)
  if (validationMessage) {
    state.value = 'error'
    message.value = validationMessage
    return
  }

  if (form.honeypot) {
    return
  }

  state.value = 'loading'
  message.value = ''

  try {
    await props.api.submitOfferCapture({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      source: form.source.trim(),
      honeypot: form.honeypot
    })
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
  <form class="offer-form" novalidate @submit.prevent="submit">
    <div class="field field--wide">
      <label for="offer-name">Name</label>
      <input
        id="offer-name"
        v-model="form.name"
        name="name"
        autocomplete="name"
        required
      />
    </div>

    <div class="field field--wide">
      <label for="offer-email">Email</label>
      <input
        id="offer-email"
        v-model="form.email"
        name="email"
        type="email"
        autocomplete="email"
        required
      />
    </div>

    <div class="field">
      <label for="offer-phone">Phone <span>Optional</span></label>
      <input
        id="offer-phone"
        v-model="form.phone"
        name="phone"
        type="tel"
        autocomplete="tel"
      />
    </div>

    <div class="field">
      <label for="offer-source">
        How did you hear about the film? <span>Optional</span>
      </label>
      <input id="offer-source" v-model="form.source" name="source" />
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
      class="submit-offer"
      type="submit"
      :disabled="state === 'loading'"
    >
      <Mail :size="18" aria-hidden="true" />
      <span>
        {{ state === 'loading' ? 'Sending your link' : filmOffer.offer.submitLabel }}
      </span>
    </button>

    <p
      v-if="message"
      class="form-status"
      :class="'form-status--' + state"
      role="status"
    >
      {{ message }}
    </p>
  </form>
</template>
