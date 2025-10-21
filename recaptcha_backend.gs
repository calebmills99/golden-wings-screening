// Google Apps Script reCAPTCHA backend
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const recaptchaSecret = '6LfXQvIrAAAAABzdyLniSfbnc0nlU6H4q14evTSt';
  const recaptchaResponse = data.recaptcha;
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  const payload = {
    secret: recaptchaSecret,
    response: recaptchaResponse,
  };
  const options = {
    method: 'post',
    payload,
  };
  const verification = JSON.parse(UrlFetchApp.fetch(verifyUrl, options));
  if (!verification.success) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'Failed reCAPTCHA verification' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success', message: 'RSVP recorded' })
  ).setMimeType(ContentService.MimeType.JSON);
}
