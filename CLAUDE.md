# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golden Wings Documentary Screening RSVP System - A serverless event management system built on Google Apps Script. Handles form submissions from Webflow, stores data in Google Sheets, and automates confirmations via email and calendar invites.

**Tech Stack**: Google Apps Script (backend), Google Sheets (database), Webflow (form frontend), HTML/CSS/JS (static pages)

**Event Details**: October 26, 2025 screening | 4:30 PM PST / 6:30 PM CST / 7:30 PM EST

## Architecture

### Request Flow
```
Webflow Form → Webhook POST → Google Apps Script (Code.gs) → Response JSON
                                      ↓
                        ┌─────────────┼─────────────┐
                        ↓             ↓             ↓
                 Google Sheets   Email Conf.   Calendar Event
```

### Key Integration Points

**Code.gs** (Google Apps Script - single file deployment)
- Entry points: `doPost(e)` for webhooks, `doGet(e)` for health checks
- Main handler: `handleRSVPSubmission(e)` processes form data
- Data layer: `saveToSpreadsheet()`, `createRSVPSheet()`
- Email layer: `sendConfirmationEmail()`, `sendAdminNotification()`, `sendWeeklyReport()`
- Calendar: `createCalendarEvent()` generates .ics embedded in emails
- Admin utils: `getRSVPStats()`, `createWeeklyReportTrigger()`
- Config: All settings in `CONFIG` object (lines 9-21) - **update spreadsheetId before deployment**

**Webflow Integration**
- Webhook URL: Generated after deploying Code.gs as web app
- Payload: JSON POST with {name, email, phone, specialRequests, source}
- Required fields: name, email (validated in Code.gs:66-68)

**Google Sheets Schema** (auto-created by `createRSVPSheet()`)
- Columns: Timestamp | Name | Email | Phone | Special Requests | Source | Status
- Status values: "confirmed" (default) | "pending" | "cancelled"

### Frontend Components

**webflow-form-integration.html** - Form for embedding in Webflow
- Client-side validation and phone formatting
- Submits to webhook URL (configure in Webflow settings)

**admin-dashboard.html** - Standalone dashboard (requires Google Sheets API key)
- Displays RSVP stats and table
- Uses sample data by default - connect to Sheets API for production

**landing.html / confirmation.html** - Static pages (Relume-generated)

## Development Commands

### Testing the Webhook
```bash
# Quick test (uses test-webhook.sh with pre-configured URL)
./test-webhook.sh

# Custom test
curl -X POST "YOUR_DEPLOYED_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"555-1234","specialRequests":"Test"}'
```

### Deploying to Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Create project: "Golden Wings RSVP Handler"
3. Replace Code.gs content with `/Code.gs` from this repo
4. Update `CONFIG.spreadsheetId` (line 10) with your Google Sheets ID
5. Deploy → New deployment → Web app (Execute as: Me, Access: Anyone)
6. Copy webhook URL for Webflow configuration

Alternative: Use `deploy-webapp.sh` (requires clasp CLI setup)

### Running Admin Functions
In Apps Script editor:
```javascript
// View statistics
getRSVPStats()

// Enable weekly reports (run once)
createWeeklyReportTrigger()
```

## Configuration Checklist

Before deployment, update these values:

**Code.gs**
- `CONFIG.spreadsheetId` (line 10) → Your Google Sheets ID
- `CONFIG.screening.venue` (line 18) → Replace "747 First Class Lounge..." with actual venue
- `CONFIG.screening.duration` (line 19) → Update if film length changes

**admin-dashboard.html** (if using real-time dashboard)
- `CONFIG.spreadsheetId` → Match Code.gs
- `CONFIG.apiKey` → Google Sheets API key with read access

**Email Sending**
- Default: Sends from your Google account
- Production: Configure Google Workspace delegation for info@golden-wings-robyn.com

## Important Technical Notes

### Calendar Event Timing
- Embedded .ics file in confirmation email (Code.gs:178-194)
- UTC times: 11:30 PM Oct 26 - 1:00 AM Oct 27 (accounts for PST 4:30 PM start)
- Reminders: 1 day, 2 hours, 30 minutes before event
- Location currently "TBD" - update before production

### Error Handling
- All errors caught in `handleRSVPSubmission` try-catch (Code.gs:86-99)
- Failures trigger admin email notification with full request dump
- Returns JSON error responses to webhook caller

### Security Considerations
- No API keys or credentials in HTML files (all in Apps Script environment)
- Webhook accepts anonymous POST (required for Webflow integration)
- Form data sanitized before database insertion
- Admin dashboard sample data only - requires API auth for real data

## Common Modifications

### Update Screening Time/Date
Edit `CONFIG.screening` object (Code.gs:13-20) and calendar UTC times (Code.gs:184-185)

### Modify Email Template
Edit HTML in `sendConfirmationEmail()` function (Code.gs:155-210)

### Change Required Fields
Update validation logic (Code.gs:66-68) and Webflow form fields

### Add New Database Columns
1. Update `createRSVPSheet()` headers (Code.gs:134-142)
2. Update `saveToSpreadsheet()` append logic (Code.gs:115-123)
3. Extract new fields in `handleRSVPSubmission()` (Code.gs:55-63)

## File Reference

**Core Backend**
- `Code.gs` - Complete Google Apps Script (deployed to script.google.com)
- `appsscript.json` - Apps Script manifest (timezone, runtime config)

**Frontend/Forms**
- `webflow-form-integration.html` - Embeddable RSVP form
- `admin-dashboard.html` - Management interface
- `landing.html`, `confirmation.html` - Static pages

**Deployment Helpers**
- `test-webhook.sh` - Quick webhook testing script
- `deploy-webapp.sh` - Automated deployment via clasp (optional)

**Documentation**
- `setup-instructions.md` - Step-by-step deployment guide
- `deployment-checklist.md` - Feature overview and launch checklist
- `README.md` - Project overview and description
