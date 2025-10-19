# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golden Wings Documentary Screening RSVP System - A complete backend automation system for managing RSVPs for the Golden Wings documentary screening event (October 26, 2025).

**Tech Stack**: Google Apps Script (backend), Google Sheets (database), Webflow (frontend forms), HTML/CSS/JavaScript

**Core Purpose**: Automated RSVP handling with email confirmations, calendar integration, and admin dashboard for event management.

## System Architecture

### Backend Flow
1. **Webflow Form** → Webhook POST request → **Google Apps Script** (`golden-wings-backend.js`)
2. **Google Apps Script** processes submission:
   - Validates data
   - Saves to Google Sheets
   - Sends confirmation email to attendee
   - Sends notification to admin
   - Creates calendar event
3. Returns JSON response to Webflow

### Key Components

**golden-wings-backend.js** (Google Apps Script)
- Main webhook handler: `handleRSVPSubmission(e)` - Entry point for all form submissions
- Database operations: `saveToSpreadsheet()`, `createRSVPSheet()`
- Email system: `sendConfirmationEmail()`, `sendAdminNotification()`, `sendWeeklyReport()`
- Calendar integration: `createCalendarEvent()`
- Admin utilities: `getRSVPStats()`, `createWeeklyReportTrigger()`
- Configuration stored in `CONFIG` object (spreadsheetId, adminEmail, screening details)

**calendar-integration.js** (Utility module)
- Generates .ics calendar files: `generateICSFile()`
- Creates platform-specific calendar links: `createGoogleCalendarLink()`, `createOutlookCalendarLink()`
- Enhanced event descriptions with reminders
- Multi-platform calendar support (Google, Outlook, .ics download)

**webflow-form-integration.html** (Frontend)
- Embedded RSVP form with validation
- Required fields: name, email, partySize
- Optional fields: phone, specialRequests, source (hidden)
- Client-side phone formatting and form state management
- Success/loading states for UX

**admin-dashboard.html** (Management interface)
- Statistics dashboard (total RSVPs, attendees, confirmed, weekly count)
- RSVP table with search/filter capabilities
- Quick actions: refresh, export, weekly reports
- Sample data for demonstration (replace with real Google Sheets API integration)

### Database Schema (Google Sheets)
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | Date | Form submission time |
| Name | Text | Attendee full name |
| Email | Email | Contact email |
| Phone | Text | Phone number (optional) |
| Party Size | Number | Number of attendees |
| Special Requests | Text | Accessibility/dietary needs |
| Source | Text | Traffic source |
| Status | Text | confirmed/pending/cancelled |

## Development Commands

### Testing the Backend
```bash
# Test webhook with curl (replace YOUR_WEB_APP_URL)
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "partySize": "2",
    "specialRequests": "Test request"
  }'
```

### Deployment Workflow

**Google Apps Script Setup** (first-time deployment):
1. Go to script.google.com
2. Create new project: "Golden Wings RSVP Handler"
3. Copy code from `golden-wings-backend.js`
4. Update `CONFIG.spreadsheetId` with your Google Sheets ID
5. Deploy as web app (Execute as: "Me", Access: "Anyone")
6. Copy webhook URL for Webflow configuration

**Webflow Integration**:
1. Add webhook URL to Webflow site settings → Integrations → Webhooks
2. Trigger: Form submissions
3. Replace existing form with `webflow-form-integration.html` code

**Weekly Report Trigger** (run once in Apps Script):
```javascript
createWeeklyReportTrigger() // Sends reports every Monday at 9 AM
```

## Configuration Requirements

### Required Updates Before Deployment

**golden-wings-backend.js**:
- `CONFIG.spreadsheetId` → Your Google Sheets ID
- `CONFIG.screening.venue` → Update "TBD" with actual venue address

**admin-dashboard.html**:
- `CONFIG.spreadsheetId` → Your Google Sheets ID
- `CONFIG.apiKey` → Google Sheets API key (for real-time dashboard)

**calendar-integration.js**:
- Location field → Update "TBD" with venue details

## Email System

**Confirmation Email** (`sendConfirmationEmail`):
- Sent from: `info@golden-wings-robyn.com` (requires Google Workspace delegation)
- Includes: Screening details, party size, special requests, calendar download link
- Branded HTML template with gradient header

**Admin Notification** (`sendAdminNotification`):
- Sent to: `CONFIG.adminEmail`
- Contains: All RSVP details and link to Google Sheets

**Weekly Reports** (`sendWeeklyReport`):
- Automated via time-based trigger
- Statistics: Total RSVPs, attendees, confirmed, new this week

## Important Notes

### Security
- No sensitive data in client-side code
- All credentials in Google Apps Script properties or CONFIG
- SSL encryption via Google infrastructure
- Form validation and sanitization in `handleRSVPSubmission()`

### Error Handling
- Try-catch blocks in main handler with admin email notifications
- Graceful fallback if sheet doesn't exist (auto-creates via `createRSVPSheet()`)
- JSON error responses returned to webhook caller

### Calendar Event Details
- Screening: October 26, 2025
- Times: 4:30 PM PST / 6:30 PM CST / 7:30 PM EST
- Duration: 90 minutes
- UTC conversion: startTime = 11:30 PM UTC (Oct 26), endTime = 1:00 AM UTC (Oct 27)
- Reminders: 1 day before, 2 hours before, 30 minutes before

## File Structure

```
/
├── golden-wings-backend.js          # Main backend (Google Apps Script)
├── calendar-integration.js          # Calendar utilities
├── webflow-form-integration.html    # RSVP form for Webflow
├── admin-dashboard.html             # Admin management interface
├── landing.html                     # Landing page (Relume-generated)
├── confirmation.html                # Post-RSVP confirmation page
├── setup-instructions.md            # Deployment guide
├── deployment-checklist.md          # Feature overview and checklist
├── docs/                            # Documentary context PDFs and transcripts
└── .gitignore                       # Excludes credentials and env files
```

## Common Tasks

### View RSVP Statistics
In Google Apps Script editor, run `getRSVPStats()` function to see current counts.

### Manual RSVP Entry
Add rows directly to Google Sheets following the schema. Status defaults to "confirmed".

### Modify Email Templates
Edit HTML in `sendConfirmationEmail()` function (lines 136-194 in golden-wings-backend.js).

### Change Screening Details
Update `CONFIG` object at top of golden-wings-backend.js (lines 9-21).

## Documentation Resources

- Setup guide: `setup-instructions.md`
- Feature checklist: `deployment-checklist.md`
- Documentary context: `docs/` directory (PDFs and transcripts)
- GitHub instructions: `PUSH_TO_GITHUB.md`, `COPILOT_PUSH_INSTRUCTIONS.md`
