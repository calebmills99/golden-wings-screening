# Admin Dashboard Guide

## Accessing the Dashboard

The admin dashboard is available at: **`/admin/`** (e.g., `https://yourdomain.com/admin/`)

## Dashboard Features

### Quick Stats Overview
At the top of the dashboard, you'll see four key metrics:
- **Total RSVPs**: All RSVP submissions received
- **Total Attendees**: Number of confirmed attendees
- **This Week**: RSVPs received in the current week
- **Days Until Event**: Countdown to October 26, 2025

### Dashboard Tabs

#### 1. Event Details Tab
Manage your screening event information:

**Editable Fields:**
- **Event Title**: Default is "Golden Wings"
- **Subtitle**: Event subtitle/tagline
- **Event Date**: The screening date
- **Duration**: Length of the screening
- **Time (PST/CST/EST)**: Screening times in different zones
- **Venue**: Location details
- **Description**: Full event description

**How to Update:**
1. Click the "Event Details" tab
2. Edit any field you want to change
3. Click "Save Changes" at the bottom
4. The changes will update your `siteConfig.json` file

#### 2. Video Settings Tab
Control the hero section video background:

**Available Options:**
- **Enable Background Video**: Toggle video on/off
- **Overlay Opacity**: Adjust darkness (0-100%) for text readability
- **Hide on Mobile**: Disable video on mobile devices for better performance

**Note:** The current simplified design has video background disabled. Use these settings to re-enable and customize if desired.

#### 3. Form Settings Tab
Configure form integration:

**Settings:**
- **Webhook URL**: Your Google Apps Script webhook endpoint
- **Contact Email**: Admin email for notifications

**Important:** After updating these settings, you need to deploy your changes (see "Deploying Changes" below).

#### 4. View RSVPs Tab
Access and manage your RSVP list:

**Features:**
- Quick preview of recent RSVPs
- Direct link to Google Sheets for full management
- View all submissions with timestamps

**To View Full RSVP List:**
1. Click the "View RSVPs" tab
2. Click the green "Open Google Sheets" button
3. This opens your complete RSVP database in Google Sheets

## Making Design Changes

### Current Design Philosophy
The site now uses a **simplified design approach** (intensity: 5/10):
- Clean, minimal styling
- Simple color palette (blue and white)
- No complex animations or effects
- Straightforward layout

### Adding Design Elements
If you want to enhance the design, you can:

1. **Add Video Background**
   - Go to Video Settings tab
   - Enable "Enable Background Video"
   - Adjust overlay opacity for readability
   - Save changes

2. **Customize Colors**
   - Edit `/src/_data/siteConfig.json`
   - Modify the `theme` section
   - Commit and deploy changes

3. **Add Custom CSS**
   - Edit CSS files in `/src/css/` directory:
     - `base.css` - Typography and base styles
     - `components.css` - Button and form styles
     - `sections.css` - Section-specific styles
     - `design-system.css` - Color variables and themes

4. **Modify Content**
   - Edit `/src/index.njk` for homepage content
   - Edit `/src/admin.njk` for dashboard layout
   - Edit `/src/confirmation.njk` for confirmation page

## Deploying Changes

### Method 1: Manual Deployment (Recommended for beginners)
1. Make changes in the dashboard
2. Download the updated `siteConfig.json` (via dashboard - coming soon)
3. Commit the file to your GitHub repository:
   ```bash
   git add src/_data/siteConfig.json
   git commit -m "Update site configuration"
   git push
   ```
4. Your hosting platform (DigitalOcean) will automatically rebuild

### Method 2: Direct File Editing
1. Edit files directly in your code editor
2. Test locally with `npm run build`
3. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```

### Method 3: GitHub Web Interface
1. Navigate to your repository on GitHub
2. Click on the file you want to edit
3. Click the pencil icon to edit
4. Make changes and commit directly

## File Structure Reference

```
golden-wings-screening/
├── src/
│   ├── _data/
│   │   └── siteConfig.json     # Main configuration file
│   ├── css/
│   │   ├── base.css            # Base styles
│   │   ├── components.css      # Component styles
│   │   ├── sections.css        # Section styles
│   │   ├── design-system.css   # Design tokens
│   │   └── video-background.css # Video styles
│   ├── index.njk               # Homepage template
│   ├── admin.njk               # Dashboard template
│   └── confirmation.njk        # Confirmation page
├── Code.gs                     # Google Apps Script backend
└── admin-dashboard.html        # Standalone dashboard (deprecated)
```

## Customization Tips

### Changing Hero Section
Edit `/src/index.njk`, find the `<header>` section:
- Modify heading text
- Change button text/link
- Update time/date display

### Modifying RSVP Form
Edit `/src/index.njk`, find the `#rsvp` section:
- Add/remove form fields
- Change labels and placeholders
- Modify button text

### Updating About Section
Edit `/src/index.njk`, find the "About the Film" section:
- Change description text
- Modify timeline cards
- Add/remove content sections

### Adjusting Colors
Edit `/src/css/design-system.css`:
```css
:root {
  --surface-page: #ffffff;      /* Background color */
  --ink-primary: #1f2937;       /* Main text color */
  --ink-secondary: #1e40af;     /* Accent color (blue) */
}
```

## Google Sheets Integration

### Viewing RSVPs
1. Open the dashboard at `/admin/`
2. Click "View RSVPs" tab
3. Click "Open Google Sheets" button
4. View all submissions in real-time

### Google Sheets Columns
- **Timestamp**: When the RSVP was submitted
- **Name**: Guest full name
- **Email**: Guest email address
- **Phone**: Guest phone number (optional)
- **Special Requests**: Dietary/accessibility needs
- **Source**: Where the RSVP came from
- **Status**: confirmed/pending/cancelled

### Managing RSVPs in Sheets
You can directly edit the spreadsheet to:
- Update guest information
- Change status (confirmed/cancelled)
- Add notes
- Export to CSV/PDF for reports

## Troubleshooting

### Dashboard not loading?
- Check that you're accessing `/admin/` with trailing slash
- Verify the site has been built and deployed
- Clear browser cache

### Changes not appearing?
- Ensure you committed changes to GitHub
- Check that DigitalOcean rebuild completed
- May take 2-3 minutes for changes to deploy

### RSVP form not working?
1. Check webhook URL in Form Settings tab
2. Verify Google Apps Script is deployed correctly
3. Check Google Sheets permissions

### Need to test locally?
```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally (use any static server)
cd _site
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Support

For questions or issues:
- Email: info@golden-wings-robyn.com
- Website: https://gwingz.com

## Quick Reference Commands

```bash
# Build the site
npm run build

# View built files
ls _site/

# Commit changes
git add .
git commit -m "Your message"
git push

# Check git status
git status
```

---

**Remember:** The simplified design gives you a clean foundation. Add enhancements gradually via the dashboard or by editing files directly, ensuring each change aligns with your vision for the screening event.
