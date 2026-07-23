<script setup lang="ts">
import SiteLayout from '../components/SiteLayout.vue'
import type { LegalSection } from '../content/legalPages'

defineProps<{
  title: string
  effectiveDate: string
  intro: string
  sections: LegalSection[]
}>()
</script>

<template>
  <SiteLayout chrome="solid">
    <article class="legal-page">
      <header class="legal-page__header">
        <p class="legal-page__eyebrow">Golden Wings · gwingz.com</p>
        <h1>{{ title }}</h1>
        <p class="legal-page__effective">Effective date: {{ effectiveDate }}</p>
        <p class="legal-page__intro">{{ intro }}</p>
      </header>

      <section
        v-for="section in sections"
        :key="section.heading"
        class="legal-page__section"
      >
        <h2>{{ section.heading }}</h2>
        <p v-for="(paragraph, index) in section.paragraphs" :key="index">
          {{ paragraph }}
        </p>
        <ul v-if="section.bullets?.length">
          <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </section>
    </article>
  </SiteLayout>
</template>

<style scoped>
.legal-page {
  background: var(--gw-paper, #fdf8ec);
  color: var(--gw-ink, #16130c);
  padding: 140px 48px 96px;
  max-width: 760px;
  margin: 0 auto;
}

.legal-page__eyebrow {
  margin: 0 0 12px;
  font-family: var(--gw-font-mono, 'Special Elite', monospace);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gw-signal, #d0451b);
}

.legal-page__header h1 {
  margin: 0;
  font-family: var(--gw-font-display, 'Monument Extended', sans-serif);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1.05;
}

.legal-page__effective {
  margin: 16px 0 0;
  font-family: var(--gw-font-mono, 'Special Elite', monospace);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gw-smoke, #6b6455);
}

.legal-page__intro {
  margin: 28px 0 0;
  font-family: var(--gw-font-body, Helvetica, Arial, sans-serif);
  font-size: 17px;
  line-height: 1.7;
}

.legal-page__section {
  margin-top: 40px;
}

.legal-page__section h2 {
  margin: 0 0 12px;
  font-family: var(--gw-font-display, 'Monument Extended', sans-serif);
  font-size: 18px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.legal-page__section p {
  margin: 0 0 12px;
  font-family: var(--gw-font-body, Helvetica, Arial, sans-serif);
  font-size: 16px;
  line-height: 1.7;
  color: var(--gw-ink, #16130c);
}

.legal-page__section ul {
  margin: 0 0 12px;
  padding-left: 1.2rem;
  font-family: var(--gw-font-body, Helvetica, Arial, sans-serif);
  font-size: 16px;
  line-height: 1.7;
}

@media (max-width: 64rem) {
  .legal-page {
    padding: 110px 20px 64px;
  }
}
</style>
