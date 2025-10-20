# GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### 1. Enable GitHub Pages
1. Go to your repository settings on GitHub
2. Navigate to **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

### 2. Your Site Will Be Live At:
```
https://calebmills99.github.io/golden-wings-screening/
```

## What's Deployed

The `index.html` file is a complete, single-page RSVP system:

- ✅ Hero section with event branding
- ✅ Screening details (date, time, venue)
- ✅ RSVP form connected to your Google Apps Script webhook
- ✅ Phone number auto-formatting
- ✅ Form validation
- ✅ Success/error messaging
- ✅ Mobile responsive design
- ✅ About section
- ✅ Contact footer

## How It Works

1. **User visits** `index.html` (served by GitHub Pages)
2. **User fills out** RSVP form
3. **Form submits** to Google Apps Script webhook (already configured)
4. **Backend processes** RSVP:
   - Saves to Google Sheets
   - Sends confirmation email
   - Creates calendar event
5. **User sees** success message

## Files for GitHub Pages

```
/
├── index.html          # Main RSVP page (all-in-one)
├── .nojekyll          # Tells GitHub Pages to serve files as-is
└── README-GITHUB-PAGES.md  # This file
```

## Alternative: DigitalOcean App Platform

If you prefer DigitalOcean like your guardrv6 project:

### Quick Deploy to DigitalOcean
1. Push this repo to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click **Create App** → **GitHub** → Select this repo
4. Configure:
   - **Type**: Static Site
   - **Build Command**: (leave empty)
   - **Output Directory**: `/`
5. Click **Deploy**

Your site will be live at: `https://your-app-name.ondigitalocean.app`

## Testing Locally

Open `index.html` in a web browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use a simple HTTP server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (if you have npx)
npx http-server

# Then visit: http://localhost:8000
```

## Configuration

The webhook URL is already configured in `index.html` (line 283):
```javascript
const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

This matches your existing Google Apps Script deployment from `test-webhook.sh`.

## Custom Domain (Optional)

### For GitHub Pages:
1. Add a `CNAME` file with your domain (e.g., `golden-wings-screening.com`)
2. Configure DNS at your domain registrar:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `calebmills99.github.io`

### For DigitalOcean:
1. Go to your app settings → **Domains**
2. Click **Add Domain**
3. Follow DNS configuration instructions

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify webhook URL in `index.html` matches your Google Apps Script deployment

### CORS errors?
- The form uses `mode: 'no-cors'` which is required for Google Apps Script
- This is normal and expected

### Page not showing up?
- Wait 2-3 minutes after enabling GitHub Pages
- Check that `index.html` is in the root directory
- Verify branch is set to `main` in GitHub Pages settings

## Next Steps

1. ✅ Enable GitHub Pages (settings → Pages → main branch → Save)
2. ✅ Test the form submission
3. ✅ Verify confirmation emails are being sent
4. ✅ Check Google Sheets for new RSVP entries
5. ✅ Share the link: `https://calebmills99.github.io/golden-wings-screening/`

## Support

Questions? Email: info@golden-wings-robyn.com
