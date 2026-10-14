/**
 * Verified-visitor session (waitlist / feedback), kept in this browser for up to 30 days.
 * The token is a signed server session; the email shown here is only a display copy.
 */
const STORAGE_KEY = 'zd-session';

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.token || !session?.email || !session?.expiresAt) return null;
    if (session.expiresAt * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Saves the session returned by a /verify call ({ email, session_token, session_expires_at }). */
export function saveSession(result) {
  if (!result?.session_token) return null;
  const session = { email: result.email, token: result.session_token, expiresAt: result.session_expires_at };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* private mode: the visitor just verifies again next time */
  }
  return session;
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
