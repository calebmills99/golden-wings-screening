<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plane } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
import { validateEmail } from '../domain/leadValidation'
import {
  cloudflareApi,
  type CloudflareApiClient,
  type WatchTokenResult
} from '../services/cloudflareApi'

const props = withDefaults(
  defineProps<{
    api?: Pick<CloudflareApiClient, 'requestWatchToken'>
    initialEmail?: string
  }>(),
  {
    api: () => cloudflareApi,
    initialEmail: ''
  }
)

const emit = defineEmits<{
  unlocked: [WatchTokenResult]
}>()

const form = reactive({
  email: props.initialEmail,
  honeypot: ''
})
const message = ref('')
const loading = ref(false)

async function submit() {
  if (!form.email.trim()) {
    message.value = 'Enter your email address.'
    return
  }

  if (!validateEmail(form.email)) {
    message.value = 'Enter a valid email address.'
    return
  }

  if (form.honeypot) {
    return
  }

  loading.value = true
  message.value = ''

  try {
    const result = await props.api.requestWatchToken({
      email: form.email.trim().toLowerCase(),
      honeypot: form.honeypot,
      source: 'watch-gate'
    })
    emit('unlocked', result)
  } catch {
    message.value =
      'The screening room could not be opened. Try again or email ' +
      filmOffer.contactEmail +
      '.'
  } finally {
    loading.value = false
  }
}

defineExpose({
  submitWithEmail(email: string) {
    form.email = email
    return submit()
  }
})
</script>

<template>
  <form class="watch-gate" novalidate @submit.prevent="submit">
    <p class="route-label">{{ filmOffer.watch.eyebrow }}</p>
    <Plane :size="32" aria-hidden="true" />
    <h1>{{ filmOffer.watch.heading }}</h1>
    <p>{{ filmOffer.watch.body }}</p>

    <label for="viewer-email">Email</label>
    <input
      id="viewer-email"
      v-model="form.email"
      name="email"
      type="email"
      autocomplete="email"
      required
    />

    <div class="hp-field" aria-hidden="true">
      <label for="watch-hp">Leave blank</label>
      <input
        id="watch-hp"
        v-model="form.honeypot"
        name="hp-check-watch"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <button type="submit" :disabled="loading">
      {{
        loading
          ? filmOffer.watch.loadingLabel
          : filmOffer.watch.submitLabel
      }}
    </button>
    <p v-if="message" role="status">{{ message }}</p>
  </form>
</template>
