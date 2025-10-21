(function () {
  const { body } = document;
  const appliedTokens = new Set();
  let themePanel;
  let videoElement;
  let defaultTheme = body?.dataset?.defaultTheme || 'soaring-classic';
  let activeStyleEndpoint = '';
  let siteSettings = {};

  const clearCustomProperties = () => {
    if (!themePanel) {
      return;
    }
    appliedTokens.forEach((token) => {
      themePanel.style.removeProperty(`--${token}`);
    });
    appliedTokens.clear();
  };

  const applyCustomProperties = (tokens = {}) => {
    if (!themePanel) {
      return;
    }
    Object.entries(tokens).forEach(([token, value]) => {
      themePanel.style.setProperty(`--${token}`, value);
      appliedTokens.add(token);
    });
  };

  const handleVideoPreferences = (overrides = {}) => {
    if (!videoElement) {
      return;
    }
    const videoConfig = {
      ...(siteSettings.video || {}),
      ...(overrides.video || {})
    };

    if (videoConfig.hideOnMobile && window.matchMedia('(max-width: 768px)').matches) {
      if (typeof videoElement.pause === 'function') {
        videoElement.pause();
      }
      videoElement.removeAttribute('autoplay');
      videoElement.removeAttribute('loop');
      videoElement.removeAttribute('muted');
      videoElement.parentNode?.removeChild(videoElement);
      videoElement = null;
    }
  };

  const resolveTokens = (styleToken, overrides = {}) => {
    const { tokens = {}, palette = {}, video: _video, ...rest } = overrides;
    return {
      ...(siteSettings.theme?.palette?.[styleToken] || {}),
      ...palette,
      ...tokens,
      ...rest
    };
  };

  const applyTheme = (styleToken, overrides = {}) => {
    const resolvedToken = styleToken || defaultTheme;
    if (body) {
      body.dataset.theme = resolvedToken;
    }
    clearCustomProperties();
    applyCustomProperties(resolveTokens(resolvedToken, overrides));
    handleVideoPreferences(overrides);
  };

  const fetchActiveTheme = async () => {
    if (!activeStyleEndpoint) {
      applyTheme(defaultTheme);
      return;
    }
    try {
      const response = await fetch(activeStyleEndpoint, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Theme request failed with status ${response.status}`);
      }
      const payload = await response.json();
      applyTheme(payload?.styleToken || defaultTheme, payload?.settings || {});
    } catch (error) {
      console.warn('Falling back to default theme:', error);
      applyTheme(defaultTheme);
    }
  };

  const init = ({
    defaultTheme: incomingDefaultTheme,
    activeStyleEndpoint: incomingActiveStyleEndpoint,
    siteSettings: incomingSiteSettings
  } = {}) => {
    themePanel = document.querySelector('[data-theme-panel]');
    videoElement = document.querySelector('[data-hero-video]');
    defaultTheme = incomingDefaultTheme || defaultTheme;
    activeStyleEndpoint = incomingActiveStyleEndpoint || '';
    siteSettings = incomingSiteSettings || {};

    applyTheme(defaultTheme);
    fetchActiveTheme();
  };

  window.ThemeManager = { init, applyTheme };
})();
