// Golden Wings RSVP Form Handler

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxnU3k4duWhFRaMPnUVyp7NaGxG6qPN2Py43eNwCBZz8S0DN5xcMLgUdMAMb7iQ-ewQsg/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');
  const heroVideo = document.querySelector('header video');
  const apiBase = (document.body?.dataset?.apiBase ?? '').replace(/\/$/, '');
  const buildApiUrl = (path) => `${apiBase}${path}`;

  const shouldDisableHeroVideo = () => {
    return window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const handleHeroVideo = () => {
    if (!heroVideo) return;

    if (shouldDisableHeroVideo()) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
      heroVideo.currentTime = 0;
    } else {
      heroVideo.setAttribute('autoplay', '');
      const playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // ignore autoplay prevention errors
        });
      }
    }
  };

  ['(max-width: 768px)', '(prefers-reduced-motion: reduce)'].forEach(query => {
    const mediaQuery = window.matchMedia(query);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleHeroVideo);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleHeroVideo);
    }
  });

  handleHeroVideo();

  const applyDynamicStyles = (config) => {
    if (!config || !config.cssVariables) return;
    const root = document.documentElement;
    Object.entries(config.cssVariables).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  };

  fetch(buildApiUrl('/api/styles/default'))
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data && data.payload) {
        applyDynamicStyles(data.payload);
      }
    })
    .catch(() => {
      // API unavailable in static mode; safely ignore to keep the default palette
    });

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
        // Submit to webhook
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Required for Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

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
