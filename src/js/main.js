// Golden Wings RSVP Form Handler

const { body } = document;
const dataset = body?.dataset || {};

const API_BASE_URL = (dataset.apiBaseUrl || '').trim().replace(/\/$/, '');
const DEFAULT_THEME = dataset.defaultTheme || 'soaring-classic';
const FALLBACK_WEBHOOK_URL = dataset.fallbackWebhook || '';
const CONFIRMATION_URL = dataset.confirmationUrl || '/confirmation';
const CONTACT_EMAIL = dataset.contactEmail || 'info@golden-wings-robyn.com';

const RSVP_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/rsvps` : '';
const ACTIVE_STYLE_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/styles/active` : '';
const CSRF_TOKEN_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/csrf-token` : '';

const endpoints = [];
if (RSVP_ENDPOINT) {
  endpoints.push(RSVP_ENDPOINT);
}
if (FALLBACK_WEBHOOK_URL) {
  endpoints.push(FALLBACK_WEBHOOK_URL);
}

let csrfToken;

async function ensureCsrfToken() {
  if (!CSRF_TOKEN_ENDPOINT) {
    return null;
  }

  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch(CSRF_TOKEN_ENDPOINT, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Unable to retrieve CSRF token: ${response.status}`);
    }
    const payload = await response.json();
    csrfToken = payload?.csrfToken || null;
    return csrfToken;
  } catch (error) {
    console.error('Failed to obtain CSRF token:', error);
    return null;
  }
}

function normalizeFetchResponse(url, init) {
  return fetch(url, init).then((response) => {
    if (init.mode === 'no-cors') {
      return response;
    }
    if (!response.ok) {
      return response.text().then((text) => {
        const message = text || response.statusText || 'Request failed';
        throw new Error(message);
      });
    }
    return response;
  });
}

function firstSuccessful(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let pending = promises.length;

    promises.forEach((promise, index) => {
      promise.then(resolve).catch((error) => {
        errors[index] = error;
        pending -= 1;
        if (pending === 0) {
          reject(new AggregateError(errors, 'All RSVP submissions failed'));
        }
      });
    });
  });
}

function notifyFailure(error) {
  const supportMessage = CONTACT_EMAIL
    ? `Please try again or contact ${CONTACT_EMAIL}`
    : 'Please try again later.';
  console.error('Error submitting RSVP:', error);
  alert(`There was an error submitting your RSVP. ${supportMessage}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');
  const themeManager = window.ThemeManager;
  if (themeManager) {
    themeManager.init({
      defaultTheme: DEFAULT_THEME,
      activeStyleEndpoint: ACTIVE_STYLE_ENDPOINT,
      siteSettings: window.__SITE_SETTINGS__ || {}
    });
  }

  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    const formData = Object.fromEntries(new FormData(form));
    formData.source = 'gwingz.com';
    formData.submittedAt = new Date().toISOString();

    try {
      if (endpoints.length === 0) {
        throw new Error('No RSVP endpoints configured.');
      }

      const csrf = await ensureCsrfToken();
      const fetchPayload = JSON.stringify(formData);

      const requests = endpoints.map((endpoint) => {
        const init = {
          method: 'POST',
          body: fetchPayload
        };

        if (endpoint === RSVP_ENDPOINT) {
          init.credentials = 'include';
          init.headers = { 'Content-Type': 'application/json' };
          if (csrf) {
            init.headers['X-CSRF-Token'] = csrf;
          }
        } else {
          init.headers = { 'Content-Type': 'application/json' };
        }

        if (/script\.google\.com/.test(endpoint)) {
          init.mode = 'no-cors';
          delete init.headers;
        }

        return normalizeFetchResponse(endpoint, init);
      });

      const executor = Promise.any ? Promise.any.bind(Promise) : firstSuccessful;
      await executor(requests);

      window.location.href = CONFIRMATION_URL;
    } catch (error) {
      notifyFailure(error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
