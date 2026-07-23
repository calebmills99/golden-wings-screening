<script setup lang="ts">
import { termsOfService } from '../content/legalPages'
import LegalDocumentPage from './LegalDocumentPage.vue'
</script>

<template>
  <LegalDocumentPage
    :title="termsOfService.title"
    :effective-date="termsOfService.effectiveDate"
    :intro="termsOfService.intro"
    :sections="termsOfService.sections"
  />
</template>
