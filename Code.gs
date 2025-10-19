/**
 * Golden Wings Documentary Screening RSVP Backend
 * Google Apps Script for handling form submissions and automation
 * Email: info@golden-wings-robyn.com
 * Screening: October 26, 2025 at 4:30 PM PST / 6:30 PM CST / 7:30 PM EST
 */

// Configuration
const CONFIG = {
  spreadsheetId: '1tepMKJ6WLnXCmfmkV_tmDfSg_Qkgl6xF3KBtFu6gXMM',
  sheetName: 'RSVPs',
  adminEmail: 'info@golden-wings-robyn.com',
  screening: {
    date: '2025-10-26',
    timePST: '16:30',
    timeCST: '18:30',
    timeEST: '19:30',
    venue: '747 First Class Lounge. Your boarding pass will arrive 24 hours before screening',
    duration: '25 minutes'
  }
};

/**
 * Google Apps Script entry point for GET requests
 * Returns a simple status message
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Golden Wings RSVP webhook is running',
      endpoint: 'POST to this URL with RSVP data'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Google Apps Script entry point for POST requests
 * This is automatically called when the webhook receives a POST
 */
function doPost(e) {
  return handleRSVPSubmission(e);
}

/**
 * Main function to handle Webflow form submissions
 * This will be triggered via webhook from Webflow
 */
function handleRSVPSubmission(e) {
  try {
    // Parse the incoming data
    const formData = e.parameter || e.postData?.contents ? JSON.parse(e.postData.contents) : e;

    // Extract form fields
    const rsvpData = {
      timestamp: new Date(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      specialRequests: formData.specialRequests || '',
      source: formData.source || 'website',
      status: 'confirmed'
    };

    // Validate required fields
    if (!rsvpData.name || !rsvpData.email) {
      throw new Error('Missing required fields: name and email');
    }

    // Save to Google Sheets
    saveToSpreadsheet(rsvpData);

    // Send confirmation email
    sendConfirmationEmail(rsvpData);

    // Send admin notification
    sendAdminNotification(rsvpData);

    // Create calendar event for attendee
    createCalendarEvent(rsvpData);

    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'RSVP confirmed'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error handling RSVP:', error);

    // Send error notification to admin
    MailApp.sendEmail({
      to: CONFIG.adminEmail,
      subject: 'Golden Wings RSVP Error',
      body: `Error processing RSVP: ${error.message}\n\nData: ${JSON.stringify(e)}`
    });

    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save RSVP data to Google Sheets
 */
function saveToSpreadsheet(rsvpData) {
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(CONFIG.sheetName);

  // If sheet doesn't exist, create it with headers
  if (!sheet) {
    createRSVPSheet();
    return saveToSpreadsheet(rsvpData);
  }

  // Add row with RSVP data
  sheet.appendRow([
    rsvpData.timestamp,
    rsvpData.name,
    rsvpData.email,
    rsvpData.phone,
    rsvpData.specialRequests,
    rsvpData.source,
    rsvpData.status
  ]);
}

/**
 * Create the RSVP tracking sheet with headers
 */
function createRSVPSheet() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.insertSheet(CONFIG.sheetName);

  // Add headers
  sheet.getRange(1, 1, 1, 7).setValues([[
    'Timestamp',
    'Name',
    'Email',
    'Phone',
    'Special Requests',
    'Source',
    'Status'
  ]]);

  // Format headers
  sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 7);
}

/**
 * Send confirmation email to attendee
 */
function sendConfirmationEmail(rsvpData) {
  const subject = 'Your Golden Wings Documentary Screening RSVP Confirmed';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Golden Wings</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Documentary Screening</p>
      </div>

      <div style="padding: 30px; background: white;">
        <h2 style="color: #1e3a8a; margin-bottom: 20px;">Thank you for your RSVP, ${rsvpData.name}!</h2>

        <p>We're excited to confirm your reservation for the Golden Wings documentary screening.</p>

        <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e3a8a;">Screening Details</h3>
          <p><strong>Date:</strong> Sunday, October 26, 2025</p>
          <p><strong>Time:</strong> 4:30 PM PST / 6:30 PM CST / 7:30 PM EST</p>
          <p><strong>Duration:</strong> ${CONFIG.screening.duration}</p>
          ${rsvpData.specialRequests ? `<p><strong>Special Requests:</strong> ${rsvpData.specialRequests}</p>` : ''}
        </div>

        <p>This powerful documentary follows Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant, capturing stories of courage, dedication, and the evolution of aviation.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Golden Wings//Documentary Screening//EN
BEGIN:VEVENT
UID:golden-wings-${Date.now()}@golden-wings-robyn.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251026T233000Z
DTEND:20251027T003000Z
SUMMARY:Golden Wings Documentary Screening
DESCRIPTION:Join us for the screening of Golden Wings, a documentary about Robyn Stewart's 50+ year career as an American Airlines flight attendant.
LOCATION:TBD
END:VEVENT
END:VCALENDAR"
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Add to Calendar
          </a>
        </div>

        <p>We'll send additional details about the venue and any final information closer to the screening date.</p>

        <p>If you have any questions or need to modify your RSVP, please contact us at <a href="mailto:info@golden-wings-robyn.com">info@golden-wings-robyn.com</a>.</p>

        <p>We look forward to seeing you there!</p>

        <p style="margin-top: 30px; color: #6b7280; font-style: italic;">
          "Golden wings carry stories of courage, and every flight tells a tale of dedication that spans generations."
        </p>
      </div>

      <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>Golden Wings Documentary | Directed by Caleb Mills Stewart</p>
        <p>For more information, visit <a href="https://gwingz.com" style="color: #3b82f6;">gwingz.com</a></p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: rsvpData.email,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: CONFIG.adminEmail
  });
}

/**
 * Send notification to admin about new RSVP
 */
function sendAdminNotification(rsvpData) {
  const subject = `New RSVP: ${rsvpData.name}`;

  const body = `
New RSVP received for Golden Wings screening:

Name: ${rsvpData.name}
Email: ${rsvpData.email}
Phone: ${rsvpData.phone}
Special Requests: ${rsvpData.specialRequests || 'None'}
Source: ${rsvpData.source}
Timestamp: ${rsvpData.timestamp}

View all RSVPs: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}
  `;

  MailApp.sendEmail({
    to: CONFIG.adminEmail,
    subject: subject,
    body: body
  });
}

/**
 * Create calendar event for the attendee
 */
function createCalendarEvent(rsvpData) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();

    const startTime = new Date('2025-10-26T23:30:00Z'); // 4:30 PM PST in UTC
    const endTime = new Date('2025-10-27T01:00:00Z');   // 6:00 PM PST in UTC (90 min duration)

    const event = calendar.createEvent(
      'Golden Wings Documentary Screening',
      startTime,
      endTime,
      {
        description: `Golden Wings documentary screening\n\nAttendee: ${rsvpData.name}\n\nA powerful documentary following Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant.`,
        location: '747 First Class Lounge. Your boarding pass will arrive 24 hours before screening',
        guests: rsvpData.email,
        sendInvites: false // We handle email confirmation separately
      }
    );

    console.log(`Calendar event created: ${event.getId()}`);
  } catch (error) {
    console.error('Error creating calendar event:', error);
  }
}

/**
 * Get RSVP statistics for admin dashboard
 */
function getRSVPStats() {
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();

  // Skip header row
  const rsvps = data.slice(1);

  const stats = {
    totalRSVPs: rsvps.length,
    totalAttendees: rsvps.length,
    confirmedRSVPs: rsvps.filter(row => row[6] === 'confirmed').length,
    recentRSVPs: rsvps.filter(row => {
      const rsvpDate = new Date(row[0]);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return rsvpDate > weekAgo;
    }).length
  };

  return stats;
}

/**
 * Send weekly RSVP report to admin
 */
function sendWeeklyReport() {
  const stats = getRSVPStats();

  const subject = `Golden Wings Screening - Weekly RSVP Report`;
  const body = `
Weekly RSVP Report for Golden Wings Documentary Screening
October 26, 2025 at 4:30 PM PST

Current Stats:
- Total RSVPs: ${stats.totalRSVPs}
- Total Attendees: ${stats.totalAttendees}
- Confirmed RSVPs: ${stats.confirmedRSVPs}
- New RSVPs This Week: ${stats.recentRSVPs}

View full RSVP list: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}

Next steps:
- Confirm venue details
- Send reminder emails 1 week before screening
- Prepare final headcount for venue

Golden Wings Team
  `;

  MailApp.sendEmail({
    to: CONFIG.adminEmail,
    subject: subject,
    body: body
  });
}

// Set up time-driven trigger for weekly reports
function createWeeklyReportTrigger() {
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}