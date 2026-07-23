<script setup lang="ts">
import { filmOffer } from '../content/filmOffer'

withDefaults(
  defineProps<{
    chrome?: 'overlay' | 'solid'
  }>(),
  { chrome: 'overlay' }
)
</script>

<template>
  <div class="site-shell mr-shell" :class="'mr-shell--' + chrome">
    <a class="skip-link" href="#main-content">Skip to film</a>
    <header class="mr-header" :class="{ 'mr-header--solid': chrome === 'solid' }">
      <RouterLink class="mr-header__brand" to="/" aria-label="Golden Wings home">
        <span class="mr-header__script">Golden Wings</span>
      </RouterLink>
      <a class="mr-header__link" href="/#offer">Get the watch link</a>
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer class="mr-footer">
      <div class="mr-footer__brand">
        <span class="mr-footer__script">Golden Wings</span>
        <span class="mr-footer__sub">© 2026 Get Booked Studio</span>
      </div>
      <nav aria-label="Legal">
        <RouterLink :to="filmOffer.legal.privacy">Privacy</RouterLink>
        <RouterLink :to="filmOffer.legal.terms">Terms</RouterLink>
        <a :href="'mailto:' + filmOffer.contactEmail">Contact</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.mr-shell {
  background: var(--gw-midnight);
}

.mr-shell--solid {
  background: var(--gw-paper);
}

.mr-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 48px;
}

.mr-header--solid {
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(10, 18, 32, 0.96) 0%,
    rgba(10, 18, 32, 0.88) 70%,
    rgba(10, 18, 32, 0) 100%
  );
}

.mr-header__brand {
  display: grid;
  gap: 2px;
  text-decoration: none;
}

.mr-header__script {
  font-family: var(--gw-font-script);
  font-size: 28px;
  color: var(--gw-gold);
  line-height: 1;
}

.mr-header__link {
  font-family: var(--gw-font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gw-gold);
  text-decoration: none;
  border-bottom: 2px solid var(--gw-gold);
  padding-bottom: 4px;
}

.mr-header__link:hover {
  color: var(--gw-gold-bright);
  border-bottom-color: var(--gw-gold-bright);
}

.mr-footer {
  background: var(--gw-midnight);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 44px 48px;
}

.mr-footer__brand {
  display: grid;
  gap: 4px;
}

.mr-footer__script {
  font-family: var(--gw-font-script);
  font-size: 24px;
  color: var(--gw-gold);
}

.mr-footer__sub {
  font-family: var(--gw-font-mono);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(247, 238, 219, 0.6);
}

.mr-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  font-family: var(--gw-font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.mr-footer nav a {
  color: var(--gw-cream);
  text-decoration: none;
}

.mr-footer nav a:hover {
  color: var(--gw-gold-bright);
}

@media (max-width: 64rem) {
  .mr-header {
    padding: 16px 20px;
  }

  .mr-header__script {
    font-size: 22px;
  }

  .mr-header__link {
    font-size: 10px;
    letter-spacing: 0.16em;
    padding-bottom: 3px;
  }

  .mr-footer {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 36px 20px;
    text-align: center;
  }

  .mr-footer__brand {
    justify-items: center;
  }

  .mr-footer__script {
    font-size: 22px;
  }

  .mr-footer nav {
    gap: 20px;
    font-size: 10px;
    letter-spacing: 0.16em;
  }
}
</style>
