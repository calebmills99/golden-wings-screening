# Golden Wings RSVP Backend Setup Instructions

## Google Apps Script Setup

### 1. Create Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "Golden Wings RSVP Handler"
4. Replace the default code with the contents of `golden-wings-backend.js`

### 2. Create Google Sheets Database
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet named "Golden Wings RSVPs"
3. Copy the spreadsheet ID from the URL (long string between `/d/` and `/edit`)
4. Update the `CONFIG.spreadsheetId` in your Apps Script

### 3. Deploy as Web App
1. In Apps Script, click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL - this is your webhook endpoint

### 4. Configure Webflow Integration
1. In Webflow, go to your site settings
2. Navigate to "Integrations" → "Webhooks"
3. Add new webhook:
   - **Trigger**: Form submissions
   - **URL**: Your Google Apps Script web app URL
   - **Method**: POST

## Email Configuration

### Set up email sending from info@golden-wings-robyn.com:
1. In Google Apps Script, go to "Settings" → "General settings"
2. Under "Google Services", ensure Gmail API is enabled
3. The script will send from your Google account by default
4. To send from info@golden-wings-robyn.com:
   - Set up email delegation in Google Workspace Admin
   - Or configure SMTP settings in the script

## Testing

### Test the webhook:
```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "partySize": "2",
    "specialRequests": "Wheelchair accessible seating"
  }'
```

## Monitoring

### Set up weekly reports:
1. In Apps Script, run the `createWeeklyReportTrigger()` function once
2. This will send weekly RSVP summaries to info@golden-wings-robyn.com every Monday at 9 AM

### View RSVPs:
- Access your Google Sheets to see all RSVP data
- Use `getRSVPStats()` function for quick statistics

## Screening Details
- **Date**: October 26, 2025
- **Time**: 4:30 PM PST / 6:30 PM CST / 7:30 PM EST
- **Admin Email**: info@golden-wings-robyn.com

## Next Steps
1. Update venue information in the CONFIG object
2. Test the complete flow from Webflow form to email confirmation
3. Set up reminder email system (add to script if needed)
4. Configure final headcount reporting