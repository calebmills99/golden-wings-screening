<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plane } from 'lucide-vue-next'
import { filmOffer } from '../content/filmOffer'
import { validateEmail } from '../domain/leadValidation'
import {
  cloudflareApi,
  type CloudflareApiClient
} from '../services/cloudflareApi'

const props = withDefaults(
  defineProps<{
    api?: Pick<CloudflareApiClient, 'logWatchAccess'>
  }>(),
  {
    api: () => cloudflareApi
  }
)

const emit = defineEmits<{
  unlocked: []
}>()

const form = reactive({
  email: '',
  honeypot: ''
})
const message = ref('')

function submit() {
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

  void props.api
    .logWatchAccess({
      email: form.email.trim().toLowerCase(),
      page: 'watch',
      honeypot: form.honeypot
    })
    .catch(() => undefined)

  emit('unlocked')
}
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

    <button type="submit">{{ filmOffer.watch.submitLabel }}</button>
    <p v-if="message" role="status">{{ message }}</p>
  </form>
</template>
