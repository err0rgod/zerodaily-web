import { escapeHtml } from '../api.js';
import { ApiError, apiPost } from '../webApi.js';
import { clearSession, getSession } from '../session.js';
import { UI, createEmailVerifier, setBusy, showMessage, spinnerButton } from './emailVerifier.js';

export function renderJoinView() {
  document.title = 'Join the waitlist — ZeroDaily';
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col items-center justify-center px-4 bg-paper dark:bg-night text-ink dark:text-paper-ink';

  container.innerHTML = `
    <div class="w-full max-w-[420px] text-center">
      <h1 id="join-title" class="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink dark:text-paper-ink mb-7">join Zerodaily</h1>
      <div id="join-body"></div>
    </div>
  `;
  const title = container.querySelector('#join-title');
  const body = container.querySelector('#join-body');

  function showJoined(result) {
    title.classList.add('hidden');
    const already = Boolean(result?.already_joined);
    body.innerHTML = `
      <div class="${UI.card} p-8 flex flex-col items-center text-center gap-3">
        <h2 class="font-serif text-2xl sm:text-3xl font-normal text-ink dark:text-paper-ink">
          ${already ? "you're already on the list" : 'welcome to zerodaily'}
        </h2>
        <p class="text-sm leading-relaxed ${UI.muted}">
          ${already ? `${escapeHtml(result.email)} is on the waitlist. We'll email you at launch.` : "we will inform you when we launch."}
          Till then visit our <a href="/" class="${UI.link} font-medium">website</a>, try the app as an <a href="/download/apk" class="${UI.link} font-medium">.apk</a>,
          or <a href="/feedback" class="${UI.link} font-medium">send us feedback</a>.
        </p>
      </div>
    `;
  }

  function showVerifier(notice) {
    title.classList.remove('hidden');
    body.innerHTML = '';
    const verifier = createEmailVerifier({
      sendRoute: 'join/send',
      verifyRoute: 'join/verify',
      submitLabel: 'Join',
      onVerified: showJoined,
    });
    body.appendChild(verifier.element);
    if (notice) verifier.showMessage(notice);
    verifier.focus();
  }

  // Already verified in this browser: join in one click, without another code.
  function showSignedIn(session) {
    body.innerHTML = `
      <p class="text-sm ${UI.muted} mb-4">Verified as <span class="font-medium text-ink dark:text-paper-ink">${escapeHtml(session.email)}</span></p>
      <div class="flex justify-center">${spinnerButton('join-with-session', 'Join the waitlist', 'button')}</div>
      <p class="text-xs mt-3"><button type="button" id="join-other-email" class="${UI.link}">Use a different email</button></p>
      <div id="join-msg" class="text-xs min-h-[20px] mt-3"></div>
    `;
    const button = body.querySelector('#join-with-session');
    const msg = body.querySelector('#join-msg');
    button.addEventListener('click', async () => {
      setBusy(button, true);
      try {
        showJoined({ ...(await apiPost('join/session', {}, { token: session.token })), email: session.email });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          showVerifier('Your session expired. Please verify your email again.');
          return;
        }
        showMessage(msg, err.message);
        setBusy(button, false);
      }
    });
    body.querySelector('#join-other-email').addEventListener('click', () => {
      clearSession();
      showVerifier();
    });
  }

  const session = getSession();
  if (session) showSignedIn(session);
  else showVerifier();

  return container;
}
