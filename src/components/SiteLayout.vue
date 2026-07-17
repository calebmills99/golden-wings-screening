<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Skip to film</a>
    <header class="site-header">
      <RouterLink class="wordmark" to="/" aria-label="Golden Wings home">
        <span>Golden Wings</span>
        <small>Fifty Year Flight Path</small>
      </RouterLink>
      <a class="header-offer-link" href="/#offer">Get the watch link</a>
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer class="site-footer">
      <p>{{ filmOffer.title }}</p>
      <nav aria-label="Legal">
        <a :href="filmOffer.legal.privacy">Privacy</a>
        <a :href="filmOffer.legal.terms">Terms</a>
        <a :href="'mailto:' + filmOffer.contactEmail">Contact</a>
      </nav>
    </footer>
  </div>
</template>
