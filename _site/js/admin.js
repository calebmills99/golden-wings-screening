// Admin Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Update buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update content
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    });
  });

  // Opacity slider
  const opacitySlider = document.getElementById('opacity-slider');
  const opacityValue = document.getElementById('opacity-value');

  if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
      opacityValue.textContent = `${e.target.value}%`;
    });
  }

  // Form submissions
  const eventForm = document.getElementById('event-form');
  const videoForm = document.getElementById('video-form');
  const formSettings = document.getElementById('form-settings');

  function downloadConfig(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'siteConfig.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(eventForm);
      const config = {
        event: {
          title: formData.get('title'),
          subtitle: formData.get('subtitle'),
          date: formData.get('date'),
          timePST: formData.get('timePST'),
          timeCST: formData.get('timeCST'),
          timeEST: formData.get('timeEST'),
          venue: formData.get('venue'),
          duration: formData.get('duration'),
          description: formData.get('description')
        }
      };

      downloadConfig(config);
      alert('Event settings exported! Upload siteConfig.json to src/_data/ and push to GitHub to apply changes.');
    });
  }

  if (videoForm) {
    videoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(videoForm);
      const config = {
        video: {
          enabled: formData.get('enabled') === 'on',
          overlayOpacity: parseInt(formData.get('overlayOpacity')),
          hideOnMobile: formData.get('hideOnMobile') === 'on'
        }
      };

      downloadConfig(config);
      alert('Video settings exported! Upload siteConfig.json to src/_data/ and push to GitHub to apply changes.');
    });
  }

  if (formSettings) {
    formSettings.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formSettings);
      const config = {
        form: {
          webhookUrl: formData.get('webhookUrl'),
          confirmationUrl: '/confirmation'
        },
        contact: {
          email: formData.get('email'),
          website: 'https://gwingz.com'
        }
      };

      downloadConfig(config);
      alert('Form settings exported! Upload siteConfig.json to src/_data/ and push to GitHub to apply changes.');
    });
  }

  // Load RSVP stats (placeholder - would connect to Google Sheets API)
  function loadStats() {
    // For now, show sample data
    // In production, this would fetch from Google Sheets API
    document.getElementById('stat-total').textContent = '--';
    document.getElementById('stat-attendees').textContent = '--';
    document.getElementById('stat-week').textContent = '--';

    // Calculate days until event
    const eventDate = new Date('2025-10-26');
    const today = new Date();
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById('days-until').textContent = daysUntil;
  }

  loadStats();
});
