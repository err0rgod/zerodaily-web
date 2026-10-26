/**
 * Cloudflare Pages Function: /api/*
 * Same-origin proxy from zerodaily.in to the ZeroDaily API for the visitor flows
 * (waitlist join, feedback, account deletion). Only the routes below are forwarded.
 */
const BACKEND = 'https://gnur4xlnhnucw6kghv4lqx4cly0uioia.lambda-url.us-east-1.on.aws/api/v1';
const ALLOWED = /^\/api\/(join(\/(save|send|verify|session))?|feedback(\/(send|verify))?|account\/delete\/(send|verify))$/;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS_HEADERS },
  });
}

export async function onRequest(context) {
  const { request } = context;
  const path = new URL(request.url).pathname.replace(/\/+$/, '');

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (!ALLOWED.test(path)) return json({ detail: 'Not found' }, 404);
  if (request.method !== 'POST') return json({ detail: 'Method not allowed' }, 405);

  const headers = new Headers({
    'Content-Type': request.headers.get('Content-Type') || 'application/json',
    Accept: 'application/json',
  });
  const auth = request.headers.get('Authorization');
  if (auth) headers.set('Authorization', auth);
  const userAgent = request.headers.get('User-Agent');
  if (userAgent) headers.set('User-Agent', userAgent);
  // Pass the visitor's IP on, so per-IP limits count each visitor rather than this proxy.
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) headers.set('X-Forwarded-For', clientIp);
  // Shared origin secret the backend requires (encrypted Pages env var). Never log it.
  const originSecret = context.env && context.env.ORIGIN_SECRET;
  if (originSecret) headers.set('X-ZD-Origin-Key', originSecret);

  try {
    const upstream = await fetch(`${BACKEND}${path.slice('/api'.length)}`, {
      method: 'POST',
      headers,
      body: await request.text(),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    return json({ detail: 'Unable to reach ZeroDaily. Please try again.' }, 502);
  }
}
