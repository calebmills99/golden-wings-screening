<script setup lang="ts">
defineProps<{
  passenger: string
  from: { code: string; city?: string }
  to: { code: string; city?: string }
  cabin?: string
  note?: string
  fields?: ReadonlyArray<{ label: string; value: string }>
}>()
</script>

<template>
  <div class="gw-boarding-pass gw-boarding-pass--cream">
    <div class="gw-boarding-pass__main">
      <div class="gw-boarding-pass__topline">
        <span class="gw-boarding-pass__brand">Golden Wings</span>
        <span class="gw-boarding-pass__class">{{ cabin || 'Golden Wings' }}</span>
      </div>
      <div class="gw-boarding-pass__route">
        <div>
          <div class="gw-boarding-pass__code">{{ from.code }}</div>
          <div v-if="from.city" class="gw-boarding-pass__city">
            {{ from.city }}
          </div>
        </div>
        <div class="gw-boarding-pass__plane">
          <span class="gw-boarding-pass__plane-line"></span>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M21.5 15.5v-2l-8-5v-5a1.5 1.5 0 0 0-3 0v5l-8 5v2l8-2.5v5l-2.5 2v1.5l4-1 4 1V19.5l-2.5-2v-5l8 3z"
            />
          </svg>
          <span class="gw-boarding-pass__plane-line"></span>
        </div>
        <div>
          <div class="gw-boarding-pass__code">{{ to.code }}</div>
          <div v-if="to.city" class="gw-boarding-pass__city">{{ to.city }}</div>
        </div>
      </div>
      <div class="gw-boarding-pass__fields">
        <div class="gw-boarding-pass__field">
          <div class="gw-boarding-pass__field-label">Passenger</div>
          <div class="gw-boarding-pass__field-value">{{ passenger }}</div>
        </div>
        <div
          v-for="field in fields || []"
          :key="field.label"
          class="gw-boarding-pass__field"
        >
          <div class="gw-boarding-pass__field-label">{{ field.label }}</div>
          <div class="gw-boarding-pass__field-value">{{ field.value }}</div>
        </div>
      </div>
      <div v-if="note" class="gw-boarding-pass__note">{{ note }}</div>
    </div>
    <div class="gw-boarding-pass__stub">
      <div>
        <div class="gw-boarding-pass__field-label">Passenger</div>
        <div class="gw-boarding-pass__field-value">{{ passenger }}</div>
      </div>
      <div>
        <div class="gw-boarding-pass__field-label">Route</div>
        <div class="gw-boarding-pass__field-value">
          {{ from.code }} → {{ to.code }}
        </div>
      </div>
      <div class="gw-boarding-pass__barcode"></div>
    </div>
  </div>
</template>
