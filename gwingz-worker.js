const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      ...CORS_HEADERS,
    },
  });
}

function normalizeScreeningState(value) {
  const state = String(value || "open").toLowerCase();
  if (state === "scheduled" || state === "closed") {
    return state;
  }
  return "open";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/health" && request.method === "GET") {
      return jsonResponse({
        ok: true,
        service: "gwingz-rsvp-worker",
        screeningState: normalizeScreeningState(env.SCREENING_STATE),
      });
    }

    if (path === "/v1/api") {
      return handleTailscaleWebhook(request, env);
    }

    if (request.method !== "POST") {
      return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    try {
      const data = await parseJson(request);

      if (data["hp-check"] || data["hp-check-watch"]) {
        return jsonResponse({ success: true, message: "OK" });
      }

      if (path === "/api/watch-token") {
        return handleWatchToken(data, env);
      }

      if (path === "/api/watch-access" || data.type === "watch_access") {
        return handleWatchAnalytics(data, env);
      }

      if (path === "/api/rsvp" || path === "/") {
        return handleRSVPSubmission(data, env);
      }

      return jsonResponse({ success: false, error: "Not found" }, 404);
    } catch (error) {
      console.error("Worker error:", error.message);
      return jsonResponse(
        { success: false, error: error.message || "Internal server error" },
        error.status || 500
      );
    }
  },
};

async function parseJson(request) {
  try {
    return await request.json();
  } catch (_) {
    const error = new Error("Invalid JSON body");
    error.status = 400;
    throw error;
  }
}

async function handleTailscaleWebhook(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const data = await request.json();
    console.log("Tailscale webhook received:", JSON.stringify(data));

    const notification = {
      to: ["ceo@gwingz.studio"],
      subject: "Tailscale Webhook Event",
      html: `
        <h2>Tailscale Webhook</h2>
        <p><strong>Received:</strong> ${new Date().toISOString()}</p>
        <pre style="background:#f3f4f6;padding:16px;border-radius:8px;overflow-x:auto;">${esc(JSON.stringify(data, null, 2))}</pre>
      `,
    };

    try {
      await sendEmail(env, notification);
    } catch (_) {}

    return jsonResponse({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Tailscale webhook error:", error.message);
    return jsonResponse({ success: false, error: error.message }, 400);
  }
}

async function handleRSVPSubmission(data, env) {
  const payload = normalizeRSVPData(data);
  validateRSVPPayload(payload);

  await upsertLead(env, payload);
  await storeRSVPIfConfigured(env, payload);

  const adminEmail = buildAdminNotification(payload);
  const userEmail = buildUserConfirmation(payload, env);

  const results = await Promise.allSettled([
    sendEmail(env, adminEmail),
    sendEmail(env, userEmail),
  ]);

  const adminResult = results[0];
  const userResult = results[1];
  const emailDelivered =
    adminResult.status === "fulfilled" || userResult.status === "fulfilled";

  if (!emailDelivered) {
    console.error(
      "RSVP emails unavailable:",
      adminResult.reason?.message || userResult.reason?.message || "unknown"
    );
  }

  const publicSiteUrl = String(
    env.PUBLIC_SITE_URL || "https://golden-wings-robyn.com"
  ).replace(/\/+$/, "");

  return jsonResponse({
    success: true,
    screeningState: normalizeScreeningState(env.SCREENING_STATE),
    emailDelivered,
    watchUrl:
      publicSiteUrl + "/watch?email=" + encodeURIComponent(payload.email),
  });
}

async function handleWatchToken(data, env) {
  const email = clean(data.email, 320).toLowerCase();
  validateEmail(email);

  const screeningState = normalizeScreeningState(env.SCREENING_STATE);
  const timestamp = new Date().toISOString();

  await upsertLead(env, {
    name: clean(data.name, 120),
    email,
    phone: "",
    source: clean(data.source, 120) || "watch-gate",
    submittedAt: timestamp,
  });
  await logWatchEvent(env, email, "watch", timestamp);

  if (screeningState !== "open") {
    return jsonResponse({
      success: true,
      screeningState,
      embedUrl: "",
      message:
        screeningState === "scheduled"
          ? "The next screening is being prepared."
          : "This screening is closed.",
    });
  }

  const embedUrl = await resolveScreeningEmbedUrl(env);
  if (!embedUrl) {
    return jsonResponse({
      success: true,
      screeningState: "closed",
      embedUrl: "",
      message: "The screening room is being prepared.",
    });
  }

  try {
    await sendEmail(env, buildWatchNotification({ email, timestamp, page: "watch" }));
  } catch (_) {}

  return jsonResponse({
    success: true,
    screeningState: "open",
    embedUrl,
  });
}

async function handleWatchAnalytics(data, env) {
  const email = clean(data.email, 320).toLowerCase();
  if (email) {
    await logWatchEvent(
      env,
      email,
      clean(data.page, 40) || "watch",
      clean(data.timestamp, 64) || new Date().toISOString()
    );
  }

  const notification = buildWatchNotification(data);
  try {
    await sendEmail(env, notification);
  } catch (_) {}
  return jsonResponse({ success: true });
}

function normalizeRSVPData(data) {
  return {
    name: clean(data.name, 120),
    email: clean(data.email, 320).toLowerCase(),
    phone: clean(data.phone, 40),
    source: clean(data.source, 120),
    specialRequests: clean(data.specialRequests, 1200),
    submittedAt: new Date().toISOString(),
    emailOptIn: data.emailOptIn === false || data.email_opt_in === false ? 0 : 1,
    smsOptIn: data.smsOptIn || data.sms_opt_in ? 1 : 0,
  };
}

function validateRSVPPayload(payload) {
  if (!payload.name) {
    const error = new Error("Name is required");
    error.status = 400;
    throw error;
  }
  validateEmail(payload.email);
}

function validateEmail(email) {
  if (!email) {
    const error = new Error("Email is required");
    error.status = 400;
    throw error;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    const error = new Error("Valid email is required");
    error.status = 400;
    throw error;
  }
}

async function upsertLead(env, payload) {
  if (!env.AUDIENCE_DB || typeof env.AUDIENCE_DB.prepare !== "function") {
    return;
  }

  const now = payload.submittedAt || new Date().toISOString();
  const emailOptIn = payload.emailOptIn === 0 ? 0 : 1;
  const smsOptIn = payload.smsOptIn ? 1 : 0;

  try {
    await env.AUDIENCE_DB.prepare(
      `INSERT INTO leads (email, name, phone, source, email_opt_in, sms_opt_in, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         name = CASE WHEN excluded.name != '' THEN excluded.name ELSE leads.name END,
         phone = CASE WHEN excluded.phone != '' THEN excluded.phone ELSE leads.phone END,
         source = CASE WHEN excluded.source != '' THEN excluded.source ELSE leads.source END,
         email_opt_in = CASE WHEN excluded.email_opt_in = 1 THEN 1 ELSE leads.email_opt_in END,
         sms_opt_in = CASE WHEN excluded.sms_opt_in = 1 THEN 1 ELSE leads.sms_opt_in END,
         updated_at = excluded.updated_at`
    )
      .bind(
        payload.email,
        payload.name || "",
        payload.phone || "",
        payload.source || "",
        emailOptIn,
        smsOptIn,
        now,
        now
      )
      .run();
    return;
  } catch (error) {
    // Schema may not have opt-in columns yet — fall back and stamp consent into source.
    console.error("Lead upsert with opt-in columns failed:", error?.message || error);
  }

  const sourceWithConsent = [
    payload.source || "",
    emailOptIn ? "email_opt_in=1" : "email_opt_in=0",
    smsOptIn ? "sms_opt_in=1" : "sms_opt_in=0",
  ]
    .filter(Boolean)
    .join(" | ")
    .slice(0, 120);

  await env.AUDIENCE_DB.prepare(
    `INSERT INTO leads (email, name, phone, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = CASE WHEN excluded.name != '' THEN excluded.name ELSE leads.name END,
       phone = CASE WHEN excluded.phone != '' THEN excluded.phone ELSE leads.phone END,
       source = CASE WHEN excluded.source != '' THEN excluded.source ELSE leads.source END,
       updated_at = excluded.updated_at`
  )
    .bind(
      payload.email,
      payload.name || "",
      payload.phone || "",
      sourceWithConsent,
      now,
      now
    )
    .run();
}

async function logWatchEvent(env, email, page, createdAt) {
  if (!env.AUDIENCE_DB || typeof env.AUDIENCE_DB.prepare !== "function") {
    return;
  }

  await env.AUDIENCE_DB.prepare(
    `INSERT INTO watch_events (email, page, created_at) VALUES (?, ?, ?)`
  )
    .bind(email, page, createdAt)
    .run();
}

async function storeRSVPIfConfigured(env, payload) {
  if (!env.RSVP_SUBMISSIONS || typeof env.RSVP_SUBMISSIONS.put !== "function") {
    return;
  }

  const key = `rsvp:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  await env.RSVP_SUBMISSIONS.put(key, JSON.stringify(payload));
}

async function resolveScreeningEmbedUrl(env) {
  const customerCode = clean(env.STREAM_CUSTOMER_CODE, 120);
  const videoUid = clean(env.STREAM_VIDEO_UID, 120);

  // Private cut: signed playback only. Never return a public UID iframe.
  if (
    !env.STREAM ||
    typeof env.STREAM.video !== "function" ||
    !videoUid ||
    !customerCode
  ) {
    return "";
  }

  const token = await env.STREAM.video(videoUid).generateToken();
  const tokenValue =
    typeof token === "string" ? token : token?.token || token?.result?.token;
  if (!tokenValue) {
    return "";
  }

  return `https://customer-${customerCode}.cloudflarestream.com/${tokenValue}/iframe`;
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

async function sendEmail(env, emailPayload) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const fromAddress = env.FROM_EMAIL || "onboarding@resend.dev";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromAddress, ...emailPayload }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Resend error: ${JSON.stringify(result)}`);
  }

  return result;
}

function buildAdminNotification(data) {
  return {
    to: ["ceo@gwingz.studio"],
    subject: `Golden Wings - New RSVP: ${data.name}`,
    html: `
      <h1>New RSVP Received</h1>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${esc(data.name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${esc(data.email)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${esc(data.phone || "N/A")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">SMS opt-in</td><td style="padding:8px;">${esc(data.smsOptIn ? "Yes" : "No")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email opt-in</td><td style="padding:8px;">${esc(data.emailOptIn === 0 ? "No" : "Yes")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Source</td><td style="padding:8px;">${esc(data.source || "N/A")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Notes</td><td style="padding:8px;">${esc(data.specialRequests || "None")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Submitted</td><td style="padding:8px;">${esc(data.submittedAt || "N/A")}</td></tr>
      </table>
    `,
  };
}

function buildUserConfirmation(data, env) {
  const publicSiteUrl = String(
    env.PUBLIC_SITE_URL || "https://golden-wings-robyn.com"
  ).replace(/\/+$/, "");
  const watchUrl =
    publicSiteUrl + "/watch?email=" + encodeURIComponent(data.email);

  return {
    to: [data.email],
    subject: "Your Golden Wings Watch Link",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="https://imgur.com/0TQ8Vy9.png" alt="Golden Wings" style="width:80px;height:auto;">
        </div>
        <h1 style="color:#1e3a5f;text-align:center;">Welcome Aboard, ${esc(data.name)}!</h1>
        <p style="font-size:16px;color:#333;line-height:1.6;">
          Thank you for your interest in <strong>Golden Wings</strong> — the story of Robyn Stewart's
          incredible 55+ year career as an American Airlines flight attendant.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${watchUrl}" style="background:#2563eb;color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;font-size:18px;font-weight:bold;display:inline-block;">
            Watch Now
          </a>
        </div>
        <p style="font-size:14px;color:#666;text-align:center;">
          Or copy this link: <a href="${watchUrl}" style="color:#2563eb;">${watchUrl}</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
        <p style="font-size:12px;color:#999;text-align:center;">
          Golden Wings Documentary &bull; <a href="https://gwingz.com" style="color:#999;">gwingz.com</a>
        </p>
      </div>
    `,
  };
}

function buildWatchNotification(data) {
  return {
    to: ["ceo@gwingz.studio"],
    subject: `Golden Wings - Viewer Access: ${data.email}`,
    html: `
      <h2>Watch Page Access</h2>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      <p><strong>Time:</strong> ${esc(data.timestamp)}</p>
      <p><strong>Page:</strong> ${esc(data.page)}</p>
    `,
  };
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
