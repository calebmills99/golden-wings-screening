/**
 * ENHANCED DEBUG VERSION - Golden Wings RSVP Backend
 * Copy this ENTIRE file into your Google Apps Script Code.gs
 * Then deploy as Web App
 */

const CONFIG = {
  spreadsheetId: '1tepMKJ6WLnXCmfmkV_tmDfSg_Qkgl6xF3KBtFu6gXMM',
  sheetName: 'RSVPs',
  adminEmail: 'info@golden-wings-robyn.com',
  screening: {
    date: '2025-10-26',
    timePST: '16:30',
    timeCST: '18:30',
    timeEST: '19:30',
    durationMinutes: 90,
    venue: '747 First Class Lounge. Your boarding pass will arrive 24 hours before screening',
    documentaryDuration: '25 minutes'
  }
};

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Debug version running',
      version: 'DEBUG-5.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  console.log('🔵 BACKEND STEP 1: doPost called');
  console.log('📥 BACKEND STEP 2: Raw event object:', JSON.stringify(e));
  return handleRSVPSubmission(e);
}

function handleRSVPSubmission(e) {
  let result = { success: false, error: 'Unknown error' };

  try {
    const event = e || {};
    console.log('🔍 BACKEND STEP 3: Event initialized');

    // Debug: Show what we're working with
    console.log('📊 BACKEND STEP 4: event.parameter exists?', !!event.parameter);
    console.log('📊 BACKEND STEP 4b: event.postData exists?', !!event.postData);
    console.log('📊 BACKEND STEP 4c: event.postData.contents exists?', !!event.postData?.contents);

    // Parse form data - PRIORITIZE JSON BODY FIRST
    const formData = event.postData?.contents
      ? JSON.parse(event.postData.contents)
      : (event.parameter || {});

    console.log('✅ BACKEND STEP 5: Form data parsed:', JSON.stringify(formData));

    // Check if this is watch page analytics
    if (formData.type === 'watch_access') {
      console.log('🎬 WATCH ANALYTICS: Routing to watch handler');
      return handleWatchAccess(formData);
    }

    // Honeypot check
    if (formData['hp-check'] && formData['hp-check'].length > 0) {
      console.warn('🍯 BACKEND STEP 6: HONEYPOT TRIGGERED - Bot detected');
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Bot detected' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    console.log('✅ BACKEND STEP 6: Honeypot check passed');

    // Validate required fields
    if (!formData.name || !formData.email) {
      console.error('❌ BACKEND STEP 7: VALIDATION FAILED - Missing name or email');
      console.error('   - Name:', formData.name);
      console.error('   - Email:', formData.email);
      throw new Error('Missing required fields (name and email)');
    }
    console.log('✅ BACKEND STEP 7: Required fields validated');

    if (!validateEmail(formData.email)) {
      console.error('❌ BACKEND STEP 8: VALIDATION FAILED - Invalid email format');
      throw new Error('Invalid email format');
    }
    console.log('✅ BACKEND STEP 8: Email format validated');

    // Prepare RSVP data
    const rsvpData = {
      timestamp: new Date(),
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email.toLowerCase()),
      phone: sanitizeInput(formData.phone) || '',
      specialRequests: sanitizeInput(formData.specialRequests) || '',
      source: sanitizeInput(formData.source) || 'website',
      status: 'confirmed'
    };

    console.log('📋 BACKEND STEP 9: RSVP data prepared:', JSON.stringify(rsvpData));

    // Save to spreadsheet
    console.log('💾 BACKEND STEP 10: Attempting to save to spreadsheet...');
    saveToSpreadsheet(rsvpData);
    console.log('✅ BACKEND STEP 11: Spreadsheet save completed');

    // Send emails
    console.log('📧 BACKEND STEP 12: Sending confirmation email...');
    sendConfirmationEmail(rsvpData);
    console.log('✅ BACKEND STEP 13: Confirmation email sent');

    console.log('📧 BACKEND STEP 14: Sending admin notification...');
    sendAdminNotification(rsvpData);
    console.log('✅ BACKEND STEP 15: Admin notification sent');

    // Create calendar event
    console.log('📅 BACKEND STEP 16: Creating calendar event...');
    createCalendarEvent(rsvpData);
    console.log('✅ BACKEND STEP 17: Calendar event created');

    result = { success: true, message: 'RSVP confirmed' };
    console.log('🎉 BACKEND STEP 18: ALL STEPS COMPLETED SUCCESSFULLY');

  } catch (error) {
    console.error('💥 BACKEND ERROR:', error.message);
    console.error('💥 BACKEND ERROR STACK:', error.stack);
    result.error = error.message;

    try {
      MailApp.sendEmail({
        to: CONFIG.adminEmail,
        subject: 'Golden Wings RSVP Debug Error',
        body: `Error: ${error.message}\n\nStack: ${error.stack}\n\nEvent Data: ${JSON.stringify(e, null, 2)}`
      });
    } catch (mailError) {
      console.error('❌ Failed to send admin error notification:', mailError);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/^'|=/g, '');
}

function saveToSpreadsheet(rsvpData) {
  try {
    console.log('📊 SHEET STEP 1: Opening spreadsheet ID:', CONFIG.spreadsheetId);
    const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
    console.log('✅ SHEET STEP 2: Spreadsheet opened:', spreadsheet.getName());

    let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
    console.log('📋 SHEET STEP 3: Looking for sheet:', CONFIG.sheetName);

    if (!sheet) {
      console.log('⚠️ SHEET STEP 4: Sheet not found, creating new sheet...');
      sheet = createRSVPSheet(spreadsheet);
      console.log('✅ SHEET STEP 5: New sheet created');
    } else {
      console.log('✅ SHEET STEP 4: Sheet found');
    }

    const rowData = [
      rsvpData.timestamp,
      rsvpData.name,
      rsvpData.email,
      rsvpData.phone,
      rsvpData.specialRequests,
      rsvpData.source,
      rsvpData.status
    ];

    console.log('📝 SHEET STEP 6: Row data prepared:', JSON.stringify(rowData));
    console.log('🎯 SHEET STEP 7: Appending row to sheet...');

    sheet.appendRow(rowData);

    const lastRow = sheet.getLastRow();
    console.log('✅ SHEET STEP 8: Row appended successfully!');
    console.log('📍 SHEET STEP 9: Last row number is now:', lastRow);
    console.log('🔍 SHEET STEP 10: Verify data in row', lastRow, 'of sheet', CONFIG.sheetName);

  } catch (error) {
    console.error('❌ SHEET ERROR:', error.message);
    console.error('❌ SHEET ERROR STACK:', error.stack);
    throw new Error('Spreadsheet save failed: ' + error.message);
  }
}

function createRSVPSheet(spreadsheet) {
  console.log('🆕 Creating new sheet:', CONFIG.sheetName);
  const sheet = spreadsheet.insertSheet(CONFIG.sheetName);

  sheet.getRange(1, 1, 1, 7).setValues([[
    'Timestamp',
    'Name',
    'Email',
    'Phone',
    'Special Requests',
    'Source',
    'Status'
  ]]);

  sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 7);

  console.log('✅ Sheet created with headers');
  return sheet;
}

function sendConfirmationEmail(rsvpData) {
  const subject = 'Your Golden Wings Documentary Screening RSVP Confirmed';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you, ${rsvpData.name}!</h2>
      <p>Your RSVP has been confirmed.</p>
      <p><strong>Event:</strong> Golden Wings Documentary Screening</p>
      <p><strong>Date:</strong> October 26, 2025</p>
      <p><strong>Time:</strong> ${CONFIG.screening.timePST} PST / ${CONFIG.screening.timeCST} CST / ${CONFIG.screening.timeEST} EST</p>
      ${rsvpData.specialRequests ? `<p><strong>Your note:</strong> ${rsvpData.specialRequests}</p>` : ''}
      <p>See you there!</p>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: rsvpData.email,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: CONFIG.adminEmail
    });
    console.log('📧 Confirmation email sent to:', rsvpData.email);
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
}

function sendAdminNotification(rsvpData) {
  const subject = `New RSVP: ${rsvpData.name}`;
  const body = `
New RSVP received:

Name: ${rsvpData.name}
Email: ${rsvpData.email}
Phone: ${rsvpData.phone}
Special Requests: ${rsvpData.specialRequests || 'None'}
Source: ${rsvpData.source}
Timestamp: ${rsvpData.timestamp}

View sheet: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}
  `;

  try {
    MailApp.sendEmail({
      to: CONFIG.adminEmail,
      subject: subject,
      body: body
    });
    console.log('📧 Admin notification sent');
  } catch (error) {
    console.error('❌ Admin email failed:', error);
  }
}

function createCalendarEvent(rsvpData) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const startTime = new Date('2025-10-26T23:30:00Z');
    const endTime = new Date(startTime.getTime() + CONFIG.screening.durationMinutes * 60 * 1000);

    const event = calendar.createEvent(
      'Golden Wings Documentary Screening (with Q&A)',
      startTime,
      endTime,
      {
        description: `Screening + Q&A\n\nAttendee: ${rsvpData.name}`,
        location: CONFIG.screening.venue,
        guests: rsvpData.email,
        sendInvites: false
      }
    );

    console.log('📅 Calendar event created:', event.getId());
  } catch (error) {
    console.error('❌ Calendar creation failed:', error);
  }
}

function handleWatchAccess(formData) {
  console.log('🎬 WATCH STEP 1: Processing watch access');

  try {
    // Check honeypot
    if (formData['hp-check-watch'] && formData['hp-check-watch'].length > 0) {
      console.warn('🍯 WATCH STEP 2: HONEYPOT TRIGGERED - Bot blocked');
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Bot detected' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    console.log('✅ WATCH STEP 2: Honeypot check passed');

    // Prepare watch analytics data
    const watchData = {
      timestamp: new Date(),
      email: sanitizeInput(formData.email || 'anonymous'),
      page: formData.page || 'watch',
      submittedTimestamp: formData.timestamp || new Date().toISOString()
    };

    console.log('📊 WATCH STEP 3: Watch data prepared:', JSON.stringify(watchData));

    // Save to Watch Analytics sheet
    console.log('💾 WATCH STEP 4: Saving to Watch Analytics sheet...');
    saveWatchAnalytics(watchData);
    console.log('✅ WATCH STEP 5: Watch analytics saved');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Access logged' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('❌ WATCH ERROR:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveWatchAnalytics(watchData) {
  console.log('💾 SHEET WATCH STEP 1: Opening spreadsheet...');
  const ss = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  console.log('✅ SHEET WATCH STEP 2: Spreadsheet opened');

  // Get or create Watch Analytics sheet
  let sheet = ss.getSheetByName('Watch Analytics');
  if (!sheet) {
    console.log('📝 SHEET WATCH STEP 3: Creating new Watch Analytics sheet...');
    sheet = ss.insertSheet('Watch Analytics');
    sheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp',
      'Email',
      'Page',
      'Submitted Timestamp'
    ]]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f0f0f0');
    sheet.autoResizeColumns(1, 4);
    console.log('✅ SHEET WATCH STEP 4: Sheet created with headers');
  } else {
    console.log('✅ SHEET WATCH STEP 3: Watch Analytics sheet found');
  }

  // Append row
  console.log('💾 SHEET WATCH STEP 5: Appending row...');
  sheet.appendRow([
    watchData.timestamp,
    watchData.email,
    watchData.page,
    watchData.submittedTimestamp
  ]);
  console.log('✅ SHEET WATCH STEP 6: Row appended successfully');
}
