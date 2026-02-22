export default {
  async fetch(request, env) {
    // 1. Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const data = await request.json();

      // 2. Validate honeypot
      if (data['hp-check']) {
        console.log("Honeypot triggered");
        return new Response(JSON.stringify({ success: true, message: "Spam filtered" }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 3. Send email via Resend API
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Once verified, change to info@gwingz.com
          to: ["ceo@gwingz.studio"], // Sending to your email for testing
          subject: "Golden Wings - New Lead: " + data.name,
          html: `
            <h1>New Lead Received!</h1>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Source:</strong> ${data.source}</p>
            <br>
            <p>Congrats on sending your <strong>first email</strong> via Resend!</p>
          `,
        }),
      });

      const resendResult = await resendResponse.json();

      if (!resendResponse.ok) {
        throw new Error(`Resend error: ${JSON.stringify(resendResult)}`);
      }

      return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });

    } catch (error) {
      console.error("Worker error:", error.message);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  },
};
