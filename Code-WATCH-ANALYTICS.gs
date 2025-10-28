/**
 * WATCH ANALYTICS - Separate webhook for tracking video page access
 * Deploy this as a NEW Web App (separate from RSVP handler)
 *
 * SETUP:
 * 1. Create NEW Google Apps Script project: "Golden Wings Watch Analytics"
 * 2. Copy this entire file
 * 3. Update spreadsheetId below (line 9)
 * 4. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 5. Copy webhook URL and give it to Claude to update watch page
 */

const CONFIG = {
  spreadsheetId: '1tepMKJ6WLnXCmfmkV_tmDfSg_Qkgl6xF3KBtFu6gXMM', // UPDATE THIS
  sheetName: 'Watch Analytics'
};

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      service: 'Golden Wings Watch Analytics',
      version: '1.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  console.log('🎬 Watch Analytics: Request received');

  try {
    const event = e || {};
    const formData = event.postData?.contents
      ? JSON.parse(event.postData.contents)
      : (event.parameter || {});

    console.log('📊 Form data:', JSON.stringify(formData));

    // Honeypot check
    if (formData['hp-check-watch'] && formData['hp-check-watch'].length > 0) {
      console.warn('🍯 Honeypot triggered - bot blocked');
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Bot detected' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Prepare watch data
    const watchData = {
      timestamp: new Date(),
      email: sanitizeInput(formData.email || 'anonymous'),
      page: formData.page || 'watch',
      userAgent: event.parameter?.userAgent || 'unknown'
    };

    console.log('💾 Saving to sheet:', JSON.stringify(watchData));

    // Save to spreadsheet
    saveToSheet(watchData);

    console.log('✅ Watch analytics logged successfully');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Access logged' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('❌ Error:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(watchData) {
  const ss = SpreadsheetApp.openById(CONFIG.spreadsheetId);

  // Get or create sheet
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    console.log('📝 Creating new sheet...');
    sheet = ss.insertSheet(CONFIG.sheetName);

    // Add headers
    sheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp',
      'Email',
      'Page',
      'User Agent'
    ]]);

    // Format headers
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
    sheet.autoResizeColumns(1, 4);
    sheet.setFrozenRows(1);
    console.log('✅ Sheet created');
  }

  // Append row
  sheet.appendRow([
    watchData.timestamp,
    watchData.email,
    watchData.page,
    watchData.userAgent
  ]);

  console.log('✅ Row added to sheet');
}

function sanitizeInput(input) {
  if (!input) return '';
  return String(input).trim().substring(0, 500);
}
