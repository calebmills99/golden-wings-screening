# 🐛 Complete RSVP Form Debug Tracking System

This tracks your form data from submit button → Google Sheet

## Step 1: Add Frontend Debug Logging

Replace your form script with this debug-enhanced version:

```javascript
<script>
const WEBHOOK_URL = '{{ site.webhookUrl }}';

document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  console.log('🚀 STEP 1: Form submitted');

  const feedback = document.getElementById('form-feedback');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Capture form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    source: document.getElementById('source').value,
    specialRequests: document.getElementById('specialRequests').value,
    'hp-check': document.getElementById('hp-check').value
  };

  console.log('📝 STEP 2: Form data captured:', formData);
  console.log('🍯 STEP 3: Honeypot value:', formData['hp-check'], '(should be empty)');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const payload = JSON.stringify(formData);
  console.log('📦 STEP 4: JSON payload created:', payload);
  console.log('🎯 STEP 5: Sending to webhook:', WEBHOOK_URL);

  try {
    const startTime = Date.now();
    console.log('⏱️ STEP 6: Fetch started at', new Date(startTime).toLocaleTimeString());

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      mode: 'no-cors'
    });

    const endTime = Date.now();
    console.log('✅ STEP 7: Fetch completed in', (endTime - startTime), 'ms');
    console.log('📨 STEP 8: Response received (no-cors mode, can\'t read body)');

    feedback.className = 'text-center p-4 rounded-lg bg-green-100 text-green-800';
    feedback.textContent = 'Thank you! Your RSVP has been confirmed. Check your email for details.';
    feedback.classList.remove('hidden');
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    e.target.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = '{{ site.rsvp.submitButton }}';

    console.log('🎉 STEP 9: Frontend complete - Check Google Apps Script logs now!');

  } catch (error) {
    console.error('❌ ERROR at fetch:', error);
    feedback.className = 'text-center p-4 rounded-lg bg-red-100 text-red-800';
    feedback.textContent = 'Something went wrong. Please try again or email {{ site.contact.email }}';
    feedback.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = '{{ site.rsvp.submitButton }}';
  }
});

console.log('✨ Form handler loaded and ready');
</script>
```

## Step 2: Enhanced Backend Debug Script

Replace your Google Apps Script `Code.gs` with this debug version:

```javascript
/**
 * ENHANCED DEBUG VERSION - Golden Wings RSVP Backend
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
    venue: '747 First Class Lounge',
    documentaryDuration: '25 minutes'
  }
};

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

    // Parse form data
    const formData = event.postData?.contents
      ? JSON.parse(event.postData.contents)
      : (event.parameter || {});

    console.log('✅ BACKEND STEP 5: Form data parsed:', JSON.stringify(formData));

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

    // Send error notification
    try {
      MailApp.sendEmail({
        to: CONFIG.adminEmail,
        subject: 'Golden Wings RSVP Error Notification',
        body: `Error processing RSVP: ${error.message}\n\nFull Error: ${error.stack}\n\nData received: ${JSON.stringify(e)}`
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

    console.log('✅ SHEET STEP 8: Row appended successfully!');
    console.log('📍 SHEET STEP 9: Last row number:', sheet.getLastRow());

  } catch (error) {
    console.error('❌ SHEET ERROR at step:', error.message);
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
  // Your existing email code here
  console.log('📧 Email sent to:', rsvpData.email);
}

function sendAdminNotification(rsvpData) {
  // Your existing admin email code here
  console.log('📧 Admin notification sent');
}

function createCalendarEvent(rsvpData) {
  // Your existing calendar code here
  console.log('📅 Calendar event created for:', rsvpData.email);
}
```

## Step 3: How to Use This Debug System

### A. Before Testing:
1. Deploy the enhanced backend script to Google Apps Script
2. Deploy the enhanced frontend to your site
3. Clear browser console (F12 → Console → Clear)

### B. Submit Test Form:
1. Open browser console (F12 → Console tab)
2. Fill out form with test data:
   - Name: "Debug Test"
   - Email: "debug@test.com"
   - Phone: "555-1234"
   - Source: "Debug"
   - Special Requests: "Test entry"
3. Submit form
4. Watch console logs in real-time

### C. Check Backend Logs:
1. Go to Google Apps Script editor
2. Click "Executions" (clock icon on left sidebar)
3. Click the most recent execution
4. View all BACKEND STEP logs

### D. Verify Sheet:
1. Open your Google Sheet
2. Check for new row with your test data

## Step 4: Read the Debug Trail

**Frontend Console Should Show:**
```
✨ Form handler loaded and ready
🚀 STEP 1: Form submitted
📝 STEP 2: Form data captured: {name: "Debug Test", email: "debug@test.com"...}
🍯 STEP 3: Honeypot value:  (should be empty)
📦 STEP 4: JSON payload created: {"name":"Debug Test"...}
🎯 STEP 5: Sending to webhook: https://script.google.com...
⏱️ STEP 6: Fetch started at 12:00:00 PM
✅ STEP 7: Fetch completed in 1234 ms
📨 STEP 8: Response received
🎉 STEP 9: Frontend complete
```

**Backend Logs Should Show:**
```
🔵 BACKEND STEP 1: doPost called
📥 BACKEND STEP 2: Raw event object: {...}
🔍 BACKEND STEP 3: Event initialized
📊 BACKEND STEP 4-4c: [existence checks]
✅ BACKEND STEP 5: Form data parsed
✅ BACKEND STEP 6: Honeypot check passed
✅ BACKEND STEP 7: Required fields validated
✅ BACKEND STEP 8: Email format validated
📋 BACKEND STEP 9: RSVP data prepared
💾 BACKEND STEP 10: Attempting to save to spreadsheet
📊 SHEET STEP 1-9: [all sheet steps]
✅ SHEET STEP 8: Row appended successfully!
📧 BACKEND STEP 12-17: [email and calendar steps]
🎉 BACKEND STEP 18: ALL STEPS COMPLETED
```

## Step 5: Diagnose Issues

**If frontend stops at STEP X:**
- STEP 1-5: Form/JS issue
- STEP 6-7: Network/fetch issue
- STEP 8-9: CORS or webhook URL issue

**If backend stops at STEP X:**
- STEP 1-2: Webhook not receiving data
- STEP 5: JSON parse error
- STEP 6: Honeypot triggered (bot)
- STEP 7-8: Validation failure
- SHEET STEP 1-3: Spreadsheet ID or name wrong
- SHEET STEP 7-8: Permission or write error

**If no errors but data missing:**
- Check SHEET STEP 9 for last row number
- Verify spreadsheet ID matches
- Check sheet name is exactly "RSVPs"

## Step 6: Common Fixes

| Symptom | Fix |
|---------|-----|
| Frontend completes but backend never logs | Wrong webhook URL |
| Backend STEP 5 fails | JSON parse error - check payload format |
| Backend STEP 7 fails | Name or email missing from form |
| SHEET STEP 1 fails | Wrong spreadsheet ID |
| SHEET STEP 3 fails | Sheet name mismatch |
| SHEET STEP 7 fails | Permission error - check script owner |
| Row appends but can't see it | Wrong sheet tab selected |

---

**Ready to debug? Deploy both enhanced scripts and submit a test!**
