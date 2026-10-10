/**
 * Cloudflare Pages Function: /api/join/[[catchall]]
 * Proxies join requests (send OTP, verify OTP) directly to the ZeroDaily backend
 * running on AWS Lambda.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const match = url.pathname.match(/^\/api\/join\/(save|send|verify)(?:[?#]|$)/i);
  const action = match ? match[1].toLowerCase() : 'save';

  if (!action) {
    return new Response(JSON.stringify({ detail: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Target Lambda endpoint
  const targetUrl = `https://gnur4xlnhnucw6kghv4lqx4cly0uioia.lambda-url.us-east-1.on.aws/api/v1/join/${action}`;

  // Forward request with headers
  const forwardHeaders = new Headers();
  forwardHeaders.set("Content-Type", context.request.headers.get("Content-Type") || "application/json");
  forwardHeaders.set("Accept", "application/json");

  try {
    const backendResponse = await fetch(targetUrl, {
      method: context.request.method,
      headers: forwardHeaders,
      body: context.request.method !== "GET" && context.request.method !== "HEAD" ? await context.request.text() : undefined,
    });

    const bodyText = await backendResponse.text();

    const responseHeaders = new Headers({
      "Content-Type": backendResponse.headers.get("Content-Type") || "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Cache-Control": "no-store"
    });

    return new Response(bodyText, {
      status: backendResponse.status,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ detail: "Gateway communication failure", error: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
}
