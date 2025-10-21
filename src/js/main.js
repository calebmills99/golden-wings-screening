// Golden Wings RSVP Form Handler with DigitalOcean backend support

const configElement = document.getElementById('site-config');
let siteConfig = {};

if (configElement) {
  try {
    siteConfig = JSON.parse(configElement.textContent || '{}');
  } catch (error) {
    console.warn('Unable to parse site configuration JSON.', error);
  }
}

const formConfig = siteConfig.form || {};
const backendConfig = siteConfig.backend || {};
const fallbackWebhook = document.body.dataset.fallbackWebhook || formConfig.webhookUrl || '';
const confirmationUrl = document.body.dataset.confirmationUrl || formConfig.confirmationUrl || '/confirmation';

const endpoints = [];

if (backendConfig.useDigitalOcean && backendConfig.apiBase) {
  const normalizedApiBase = backendConfig.apiBase.replace(/\/$/, '');
  endpoints.push(`${normalizedApiBase}/rsvps`);
}

if (fallbackWebhook) {
  endpoints.push(fallbackWebhook);
}

function buildPayload(form) {
  return {
    name: form.querySelector('#name')?.value || '',
    email: form.querySelector('#email')?.value || '',
    phone: form.querySelector('#phone')?.value || '',
    specialRequests: form.querySelector('#specialRequests')?.value || '',
    source: 'gwingz.com',
    submittedAt: new Date().toISOString()
  };
}

async function sendToEndpoint(url, payload) {
  const isGoogleWebhook = /script\.google\.com/.test(url);
  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  if (isGoogleWebhook) {
    fetchConfig.mode = 'no-cors';
  }

  const response = await fetch(url, fetchConfig);

  if (isGoogleWebhook) {
    return true;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return true;
}

async function submitPayload(payload) {
  if (!endpoints.length) {
    throw new Error('No submission endpoints configured.');
  }

  let lastError;

  for (const endpoint of endpoints) {
    try {
      await sendToEndpoint(endpoint, payload);
      return true;
    } catch (error) {
      lastError = error;
      console.warn(`Submission to ${endpoint} failed`, error);
    }
  }

  throw lastError || new Error('All submission endpoints failed.');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton?.textContent || '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      try {
        const payload = buildPayload(form);
        await submitPayload(payload);
        window.location.href = confirmationUrl;
      } catch (error) {
        console.error('Error submitting RSVP:', error);
        alert('There was an error submitting your RSVP. Please try again or contact info@golden-wings-robyn.com');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
