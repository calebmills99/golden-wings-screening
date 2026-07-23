<script setup lang="ts">
import { privacyPolicy } from '../content/legalPages'
import LegalDocumentPage from './LegalDocumentPage.vue'
</script>

<template>
  <LegalDocumentPage
    :title="privacyPolicy.title"
    :effective-date="privacyPolicy.effectiveDate"
    :intro="privacyPolicy.intro"
    :sections="privacyPolicy.sections"
  />
</template>
