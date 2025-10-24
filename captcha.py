    #!/usr/bin/env python3
import os
import re
import subprocess

def prompt_keys():
    print("🔐 Let's set up reCAPTCHA integration.")
    site_key = input("Enter your Google reCAPTCHA SITE key: ").strip()
    secret_key = input("Enter your Google reCAPTCHA SECRET key: ").strip()
    return site_key, secret_key

def patch_index_njk(site_key):
    path = "src/index.njk"
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ Cannot find {path}")

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Insert reCAPTCHA widget if not present
    if "g-recaptcha" not in content:
        content = content.replace(
            '</button>',
            '</button>\n\n<div class="flex justify-center mt-4">\n'
            f'  <div class="g-recaptcha" data-sitekey="{site_key}"></div>\n</div>'
        )

    # Insert the script tag if missing
    if "https://www.google.com/recaptcha/api.js" not in content:
        content += '\n<script src="https://www.google.com/recaptcha/api.js" async defer></script>\n'

    # Update the JS submission logic
    if "grecaptcha.getResponse" not in content:
        new_script = f"""
<script>
const WEBHOOK_URL = '{{{{ site.webhookUrl }}}}';
document.getElementById('rsvp-form').addEventListener('submit', async function(e) {{
  e.preventDefault();
  const recaptchaResponse = grecaptcha.getResponse();
  const feedback = document.getElementById('form-feedback');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!recaptchaResponse) {{
    feedback.className = 'text-center p-4 rounded-lg bg-red-100 text-red-800';
    feedback.textContent = 'Please complete the reCAPTCHA before submitting.';
    feedback.classList.remove('hidden');
    return;
  }}

  const formData = {{
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    referral: document.getElementById('specialRequests')?.value || '',
    recaptcha: recaptchaResponse,
    source: 'website'
  }};

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {{
    await fetch(WEBHOOK_URL, {{
      method: 'POST',
      headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify(formData)
    }});
    feedback.className = 'text-center p-4 rounded-lg bg-green-100 text-green-800';
    feedback.textContent = 'Thank you! Your RSVP has been confirmed.';
    feedback.classList.remove('hidden');
    e.target.reset();
    grecaptcha.reset();
  }} catch (error) {{
    feedback.className = 'text-center p-4 rounded-lg bg-red-100 text-red-800';
    feedback.textContent = 'Something went wrong. Please try again.';
    feedback.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = '{{{{ site.rsvp.submitButton }}}}';
  }}
}});
</script>
"""
        content += new_script

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print("✅ Updated index.njk with reCAPTCHA integration.")

def create_backend_template(secret_key):
    backend_path = "recaptcha_backend.gs"
    with open(backend_path, "w", encoding="utf-8") as f:
        f.write(f"""// Google Apps Script reCAPTCHA backend
function doPost(e) {{
  const data = JSON.parse(e.postData.contents);
  const recaptchaSecret = '{secret_key}';
  const recaptchaResponse = data.recaptcha;
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  const payload = {{
    secret: recaptchaSecret,
    response: recaptchaResponse,
  }};
  const options = {{
    method: 'post',
    payload,
  }};
  const verification = JSON.parse(UrlFetchApp.fetch(verifyUrl, options));
  if (!verification.success) {{
    return ContentService.createTextOutput(
      JSON.stringify({{ status: 'error', message: 'Failed reCAPTCHA verification' }})
    ).setMimeType(ContentService.MimeType.JSON);
  }}
  return ContentService.createTextOutput(
    JSON.stringify({{ status: 'success', message: 'RSVP recorded' }})
  ).setMimeType(ContentService.MimeType.JSON);
}}
""")
    print("✅ Created recaptcha_backend.gs — upload to Google Apps Script and publish it as Web App.")

def rebuild_and_commit():
    print("⚙️ Rebuilding site...")
    subprocess.run(["npx", "@11ty/eleventy", "--output", "_site"], check=True)
    subprocess.run(["git", "add", "-A"])
    subprocess.run(["git", "commit", "-m", "Add reCAPTCHA integration"], check=False)
    subprocess.run(["git", "push", "origin", "main"], check=True)
    print("🚀 Build complete and pushed for redeploy!")

def main():
    site_key, secret_key = prompt_keys()
    patch_index_njk(site_key)
    create_backend_template(secret_key)
    rebuild_and_commit()
    print("\n🎉 All done!\nVisit your site and confirm the reCAPTCHA appears on the RSVP form.")

if __name__ == "__main__":
    main()
