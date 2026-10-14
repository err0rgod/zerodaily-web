/**
 * POST helper for the visitor endpoints (join, feedback). Goes through the same-origin Pages
 * proxy first and falls back to the public API host if the proxy is unreachable.
 */
const HOSTS = ['/api', 'https://api.zerodaily.in/api/v1'];

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiPost(route, body, { token } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let lastError = null;
  for (const host of HOSTS) {
    try {
      const res = await fetch(`${host}/${route}`, { method: 'POST', headers, body: JSON.stringify(body ?? {}) });
      const data = await res.json().catch(() => null);
      if (res.ok) return data || { status: 'success' };

      const detail = data && (data.detail || data.message);
      const message = typeof detail === 'string' ? detail : 'Something went wrong. Please try again.';
      // The server answered: report it instead of trying the next host.
      if (res.status < 500) throw new ApiError(message, res.status);
      lastError = new ApiError(message, res.status);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      lastError = err;
    }
  }
  throw lastError instanceof ApiError ? lastError : new ApiError('Unable to reach ZeroDaily. Check your connection.', 0);
}
