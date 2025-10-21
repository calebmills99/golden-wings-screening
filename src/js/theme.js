// Theme bootstrapper for modular styling and mobile enhancements
(function () {
  const configElement = document.getElementById('site-config');
  const body = document.body;
  const root = document.documentElement;
  let siteConfig = {};

  try {
    siteConfig = configElement ? JSON.parse(configElement.textContent || '{}') : {};
  } catch (error) {
    console.warn('Unable to parse site configuration for theming.', error);
  }

  const themeConfig = siteConfig.theme || {};
  const backendConfig = siteConfig.backend || {};
  const videoConfig = siteConfig.video || {};

  function applyTheme(theme) {
    if (!theme || typeof theme !== 'object') {
      return;
    }

    if (theme.id) {
      body.dataset.theme = theme.id;
    }

    if (theme.palette && typeof theme.palette === 'object') {
      Object.entries(theme.palette).forEach(([token, value]) => {
        const normalizedToken = token.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--color-${normalizedToken}`, value);
      });
    }
  }

  function enhanceVideoForMobile() {
    const videoElement = document.querySelector('.hero__media video');
    if (!videoElement) {
      return;
    }

    if (videoConfig.hideOnMobile && window.matchMedia('(max-width: 768px)').matches) {
      videoElement.classList.add('video-muted');
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) {
      videoElement.pause();
      videoElement.classList.add('video-muted');
    }
  }

  async function fetchThemeFromApi() {
    if (!backendConfig.useDigitalOcean || !backendConfig.apiBase) {
      return null;
    }

    const normalizedApiBase = backendConfig.apiBase.replace(/\/$/, '');
    const themeEndpoint = `${normalizedApiBase}/theme`;

    try {
      const response = await fetch(themeEndpoint, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Theme request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Falling back to bundled theme configuration.', error);
      return null;
    }
  }

  applyTheme(themeConfig);

  fetchThemeFromApi().then((remoteTheme) => {
    if (remoteTheme) {
      applyTheme(remoteTheme);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    enhanceVideoForMobile();
  });
})();
