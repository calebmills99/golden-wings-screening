/**
 * Calendar Integration for Golden Wings Documentary Screening
 * Generates .ics files and handles calendar events
 */

/**
 * Generate ICS calendar file content
 */
function generateICSFile(attendeeData) {
  const startDate = '20251026T233000Z'; // 4:30 PM PST in UTC
  const endDate = '20251027T010000Z';   // 6:00 PM PST in UTC (90 minutes)
  const eventId = `golden-wings-${Date.now()}@golden-wings-robyn.com`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Golden Wings//Documentary Screening//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${eventId}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Golden Wings Documentary Screening
DESCRIPTION:Join us for the screening of Golden Wings\\, a powerful documentary following Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant.\\n\\nDirected by Caleb Mills Stewart\\n\\nAttendee: ${attendeeData.name}\\nParty Size: ${attendeeData.partySize}\\n\\nThis film captures stories of courage\\, dedication\\, and the evolution of aviation through one woman's extraordinary journey.
LOCATION:TBD - Details will be provided closer to the screening date
ORGANIZER;CN=Golden Wings Team:mailto:info@golden-wings-robyn.com
ATTENDEE;CN=${attendeeData.name};RSVP=TRUE:mailto:${attendeeData.email}
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: Golden Wings Documentary Screening tomorrow at 4:30 PM PST
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Golden Wings Documentary Screening starts in 2 hours
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

/**
 * Create calendar download link for web
 */
function createCalendarDownloadLink(attendeeData) {
  const icsContent = generateICSFile(attendeeData);
  const encodedContent = encodeURIComponent(icsContent);

  return `data:text/calendar;charset=utf8,${encodedContent}`;
}

/**
 * Generate Google Calendar add link
 */
function createGoogleCalendarLink(attendeeData) {
  const startDate = '20251026T233000Z';
  const endDate = '20251027T010000Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Golden Wings Documentary Screening',
    dates: `${startDate}/${endDate}`,
    details: `Join us for the screening of Golden Wings, a powerful documentary following Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant.\n\nDirected by Caleb Mills Stewart\n\nAttendee: ${attendeeData.name}\nParty Size: ${attendeeData.partySize}\n\nThis film captures stories of courage, dedication, and the evolution of aviation through one woman's extraordinary journey.`,
    location: 'TBD - Details will be provided closer to the screening date',
    trp: 'false'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook calendar link
 */
function createOutlookCalendarLink(attendeeData) {
  const startDate = '2025-10-26T23:30:00.000Z';
  const endDate = '2025-10-27T01:00:00.000Z';

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: 'Golden Wings Documentary Screening',
    startdt: startDate,
    enddt: endDate,
    body: `Join us for the screening of Golden Wings, a powerful documentary following Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant.\n\nDirected by Caleb Mills Stewart\n\nAttendee: ${attendeeData.name}\nParty Size: ${attendeeData.partySize}\n\nThis film captures stories of courage, dedication, and the evolution of aviation through one woman's extraordinary journey.`,
    location: 'TBD - Details will be provided closer to the screening date'
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Enhanced calendar integration for Google Apps Script
 */
function createCalendarEventWithReminders(rsvpData) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();

    // Create event times (4:30 PM PST = 11:30 PM UTC)
    const startTime = new Date('2025-10-26T23:30:00Z');
    const endTime = new Date('2025-10-27T01:00:00Z');

    // Create the event
    const event = calendar.createEvent(
      'Golden Wings Documentary Screening',
      startTime,
      endTime,
      {
        description: createEventDescription(rsvpData),
        location: 'TBD - Location details will be provided closer to the screening date',
        guests: rsvpData.email,
        sendInvites: false
      }
    );

    // Add custom reminders
    event.removeAllReminders();
    event.addEmailReminder(24 * 60); // 1 day before
    event.addEmailReminder(2 * 60);  // 2 hours before
    event.addPopupReminder(30);      // 30 minutes before

    console.log(`Calendar event created with ID: ${event.getId()}`);
    return event.getId();

  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

/**
 * Create detailed event description
 */
function createEventDescription(rsvpData) {
  return `🎬 Golden Wings Documentary Screening

Join us for an exclusive screening of "Golden Wings," a powerful documentary that follows Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant.

📅 Event Details:
• Date: Sunday, October 26, 2025
• Time: 4:30 PM PST / 6:30 PM CST / 7:30 PM EST
• Duration: Approximately 90 minutes
• Location: TBD (Details will be provided)

👤 Your Reservation:
• Name: ${rsvpData.name}
• Party Size: ${rsvpData.partySize} ${rsvpData.partySize === 1 ? 'person' : 'people'}
${rsvpData.specialRequests ? `• Special Requests: ${rsvpData.specialRequests}` : ''}

🎭 About the Film:
Directed by Caleb Mills Stewart, "Golden Wings" captures stories of courage, dedication, and the evolution of aviation through one woman's extraordinary journey. This intimate documentary explores multi-generational aviation legacy, personal struggles, and the changing face of the airline industry.

📧 Contact:
For questions or changes to your RSVP, contact us at info@golden-wings-robyn.com

🌐 More Information:
Visit gwingz.com for additional details about the film and screening.

"Golden wings carry stories of courage, and every flight tells a tale of dedication that spans generations."`;
}

/**
 * Generate all calendar format options for confirmation email
 */
function generateAllCalendarOptions(attendeeData) {
  return {
    icsDownload: createCalendarDownloadLink(attendeeData),
    googleCalendar: createGoogleCalendarLink(attendeeData),
    outlookCalendar: createOutlookCalendarLink(attendeeData),
    icsContent: generateICSFile(attendeeData)
  };
}

/**
 * Create calendar buttons HTML for confirmation page
 */
function createCalendarButtonsHTML(attendeeData) {
  const calendarOptions = generateAllCalendarOptions(attendeeData);

  return `
    <div class="calendar-integration" style="text-align: center; margin: 30px 0;">
      <h3 style="color: #1e3a8a; margin-bottom: 20px;">Add to Your Calendar</h3>

      <div class="calendar-buttons" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; max-width: 400px; margin: 0 auto;">

        <!-- Google Calendar -->
        <a href="${calendarOptions.googleCalendar}"
           target="_blank"
           style="display: inline-flex; align-items: center; gap: 8px; background: #4285f4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background-color 0.3s;"
           onmouseover="this.style.backgroundColor='#3367d6'"
           onmouseout="this.style.backgroundColor='#4285f4'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          Google Calendar
        </a>

        <!-- Outlook Calendar -->
        <a href="${calendarOptions.outlookCalendar}"
           target="_blank"
           style="display: inline-flex; align-items: center; gap: 8px; background: #0078d4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background-color 0.3s;"
           onmouseover="this.style.backgroundColor='#106ebe'"
           onmouseout="this.style.backgroundColor='#0078d4'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 3h10c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v4h10V5H7zm0 6v8h10v-8H7z"/>
          </svg>
          Outlook
        </a>

        <!-- Download ICS -->
        <a href="${calendarOptions.icsDownload}"
           download="golden-wings-screening.ics"
           style="display: inline-flex; align-items: center; gap: 8px; background: #6b7280; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background-color 0.3s;"
           onmouseover="this.style.backgroundColor='#4b5563'"
           onmouseout="this.style.backgroundColor='#6b7280'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Download .ics
        </a>

      </div>

      <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
        Choose your preferred calendar app to save the event details
      </p>
    </div>
  `;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateICSFile,
    createCalendarDownloadLink,
    createGoogleCalendarLink,
    createOutlookCalendarLink,
    createCalendarEventWithReminders,
    generateAllCalendarOptions,
    createCalendarButtonsHTML
  };
}