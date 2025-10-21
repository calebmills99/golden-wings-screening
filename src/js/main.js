// Golden Wings RSVP Form Handler

const FALLBACK_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxnU3k4duWhFRaMPnUVyp7NaGxG6qPN2Py43eNwCBZz8S0DN5xcMLgUdMAMb7iQ-ewQsg/exec';
const BACKEND_CONFIG = window.GW_CONFIG?.backend ?? {};
const THEME_CONFIG = window.GW_CONFIG?.theme ?? {};

const API_BASE_URL = BACKEND_CONFIG.apiBaseUrl ?? '';
const RSVP_ENDPOINT = BACKEND_CONFIG.rsvpEndpoint ?? '';
const THEME_ENDPOINT = BACKEND_CONFIG.themeEndpoint ?? '';

const isBackendConfigured = Boolean(API_BASE_URL && RSVP_ENDPOINT);
const hasThemeEndpoint = Boolean(API_BASE_URL && THEME_ENDPOINT);

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const submitToFallback = async (formData) => {
  await fetch(FALLBACK_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
};

const submitToBackend = async (formData) => {
  if (!isBackendConfigured) {
    return submitToFallback(formData);
  }

  try {
    await fetchJson(`${API_BASE_URL}${RSVP_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
  } catch (error) {
    console.error('Backend RSVP submission failed, attempting fallback:', error);
    await submitToFallback(formData);
  }
};

const applyTheme = (theme) => {
  if (!theme) return;

  const root = document.documentElement;
  const heroTagline = document.getElementById('hero-theme-tagline');
  const mobileMessage = document.querySelector('.mobile-flight-info__message');
  const mobileAction = document.querySelector('.mobile-flight-info__action');

  if (theme.palette) {
    if (theme.palette.dusk) root.style.setProperty('--primary-blue', theme.palette.dusk);
    if (theme.palette.sky) root.style.setProperty('--primary-blue-light', theme.palette.sky);
    if (theme.palette.sunrise) root.style.setProperty('--scheme-background', theme.palette.sunrise);
  }

  if (heroTagline && theme.tagline) {
    heroTagline.textContent = theme.tagline;
  }

  if (mobileMessage && theme.mobileCta?.message) {
    mobileMessage.textContent = theme.mobileCta.message;
  }

  if (mobileAction && theme.mobileCta?.button) {
    mobileAction.textContent = theme.mobileCta.button;
  }
};

const initializeTheme = async () => {
  try {
    if (hasThemeEndpoint) {
      const theme = await fetchJson(`${API_BASE_URL}${THEME_ENDPOINT}`);
      applyTheme(theme);
      return;
    }
  } catch (error) {
    console.warn('Theme API unavailable, using embedded configuration.', error);
  }

  applyTheme(THEME_CONFIG);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');
  initializeTheme();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || '',
        specialRequests: document.getElementById('specialRequests').value || '',
        source: 'gwingz.com'
      };

      try {
        await submitToBackend(formData);

        // Redirect to confirmation page
        window.location.href = '/confirmation.html';

      } catch (error) {
        console.error('Error submitting RSVP:', error);
        alert('There was an error submitting your RSVP. Please try again or contact info@golden-wings-robyn.com');

        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
