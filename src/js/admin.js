// Admin Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
  const adminApp = document.getElementById('admin-app');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const syncBanner = document.getElementById('sync-banner');
  const lastSyncEl = document.getElementById('last-sync');
  const statsEls = {
    total: document.getElementById('stat-total'),
    confirmed: document.getElementById('stat-confirmed'),
    week: document.getElementById('stat-week'),
    days: document.getElementById('days-until')
  };
  const eventDetails = {
    date: document.getElementById('event-date'),
    time: document.getElementById('event-time'),
    venue: document.getElementById('event-venue'),
    duration: document.getElementById('event-duration'),
    headerDate: document.getElementById('header-event-date')
  };
  const rsvpTableBody = document.getElementById('rsvp-table-body');
  const copyButtons = document.querySelectorAll('[data-copy-button]');

  const numberFormatter = new Intl.NumberFormat('en-US');
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const syncStates = {
    info: 'rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-600 text-sm transition-colors',
    success: 'rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm transition-colors',
    error: 'rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm transition-colors'
  };

  function setSyncState(type, message) {
    if (!syncBanner) return;
    syncBanner.className = syncStates[type] || syncStates.info;
    syncBanner.textContent = message;
  }

  function setStat(target, value) {
    const el = statsEls[target];
    if (!el) return;
    el.textContent = typeof value === 'number' ? numberFormatter.format(value) : value;
  }

  function renderRSVPs(recent, options = {}) {
    if (!rsvpTableBody) {
      return;
    }

    rsvpTableBody.innerHTML = '';

    if (options.loading) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'px-6 py-10 text-center text-slate-400';
      cell.textContent = 'Syncing with Google Sheets…';
      row.appendChild(cell);
      rsvpTableBody.appendChild(row);
      return;
    }

    if (!recent || recent.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'px-6 py-10 text-center text-slate-400';
      cell.textContent = 'No RSVPs recorded yet.';
      row.appendChild(cell);
      rsvpTableBody.appendChild(row);
      return;
    }

    recent.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-slate-50 transition-colors';

      const nameCell = document.createElement('td');
      nameCell.className = 'px-6 py-4 whitespace-nowrap font-medium text-slate-900';
      nameCell.textContent = item.name || '—';

      const emailCell = document.createElement('td');
      emailCell.className = 'px-6 py-4 text-slate-600';
      emailCell.textContent = item.email || '—';

      const statusCell = document.createElement('td');
      statusCell.className = 'px-6 py-4';
      statusCell.innerHTML = `<span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold ${item.status && item.status.toLowerCase() === 'confirmed'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-slate-100 text-slate-600'}">${item.status || 'pending'}</span>`;

      const receivedCell = document.createElement('td');
      receivedCell.className = 'px-6 py-4 text-slate-500';
      receivedCell.textContent = item.timestamp ? dateTimeFormatter.format(new Date(item.timestamp)) : '—';

      row.appendChild(nameCell);
      row.appendChild(emailCell);
      row.appendChild(statusCell);
      row.appendChild(receivedCell);
      rsvpTableBody.appendChild(row);
    });
  }

  function updateEventDetails(eventPayload) {
    if (!eventPayload) return;

    if (eventDetails.date) {
      eventDetails.date.textContent = eventPayload.date || eventDetails.date.textContent;
    }
    if (eventDetails.headerDate) {
      eventDetails.headerDate.textContent = eventPayload.date || eventDetails.headerDate.textContent;
    }
    if (eventDetails.time) {
      eventDetails.time.textContent = eventPayload.timePST ? `${eventPayload.timePST} PST` : eventDetails.time.textContent;
    }
    if (eventDetails.venue) {
      eventDetails.venue.textContent = eventPayload.venue || eventDetails.venue.textContent;
    }
    if (eventDetails.duration) {
      eventDetails.duration.textContent = eventPayload.duration || eventDetails.duration.textContent;
    }
  }

  async function loadStats() {
    if (!adminApp || !adminApp.dataset.endpoint) {
      setSyncState('error', 'Analytics endpoint is not configured. Update siteConfig.admin.analyticsEndpoint.');
      return;
    }

    setSyncState('info', 'Syncing with Google Sheets telemetry…');
    Object.keys(statsEls).forEach(key => setStat(key, '--'));
    renderRSVPs([], { loading: true });

    try {
      const response = await fetch(`${adminApp.dataset.endpoint}?mode=stats`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.error || 'Unknown error retrieving stats');
      }

      setStat('total', payload.stats.totalRSVPs || 0);
      setStat('confirmed', payload.stats.confirmedRSVPs || 0);
      setStat('week', payload.stats.recentRSVPs || 0);
      setStat('days', payload.stats.daysUntilEvent ?? '--');

      if (lastSyncEl && payload.generatedAt) {
        lastSyncEl.textContent = dateTimeFormatter.format(new Date(payload.generatedAt));
      }

      updateEventDetails(payload.event);
      renderRSVPs(payload.recent);

      const total = payload.stats.totalRSVPs || 0;
      const confirmed = payload.stats.confirmedRSVPs || 0;
      setSyncState('success', `Connection healthy — tracking ${numberFormatter.format(total)} RSVPs (${numberFormatter.format(confirmed)} confirmed).`);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
      setSyncState('error', `Unable to reach Google Apps Script analytics endpoint. ${error.message}`);
      if (lastSyncEl) {
        lastSyncEl.textContent = 'Sync failed';
      }
    }
  }

  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      const target = document.getElementById(`tab-${tabName}`);
      if (target) {
        target.classList.remove('hidden');
      }
    });
  });

  // Opacity slider
  const opacitySlider = document.getElementById('opacity-slider');
  const opacityValue = document.getElementById('opacity-value');

  if (opacitySlider && opacityValue) {
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
          overlayOpacity: parseInt(formData.get('overlayOpacity'), 10),
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

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      if (!adminApp || !adminApp.dataset.webhook) {
        return;
      }

      const originalText = button.textContent;
      try {
        await navigator.clipboard.writeText(adminApp.dataset.webhook);
        button.textContent = 'Copied!';
        button.classList.add('bg-emerald-600');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-emerald-600');
        }, 2000);
      } catch (error) {
        console.error('Clipboard copy failed', error);
        button.textContent = 'Copy failed';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  });

  loadStats();
});
