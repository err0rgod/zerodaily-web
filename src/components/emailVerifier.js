import { apiPost } from '../webApi.js';
import { saveSession } from '../session.js';

const RESEND_COOLDOWN_SECONDS = 60;

export const UI = {
  box: 'bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-1.5 shadow-sm focus-within:border-brand dark:focus-within:border-brand-dark focus-within:ring-2 focus-within:ring-brand/20 transition-all',
  input: 'flex-1 min-w-0 bg-transparent border-0 px-3 py-2 text-[15px] text-ink dark:text-paper-ink placeholder:text-[#7f7b6e] dark:placeholder:text-[#8c8f9b] focus:outline-none',
  button: 'bg-brand hover:bg-[#b03224] dark:bg-brand-dark dark:hover:bg-[#f05a49] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center min-w-[80px] disabled:opacity-60 disabled:cursor-not-allowed',
  link: 'text-brand dark:text-brand-dark underline underline-offset-2 hover:opacity-80 disabled:opacity-50 disabled:no-underline cursor-pointer',
  muted: 'text-[#7f7b6e] dark:text-[#8c8f9b]',
  card: 'bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg shadow-sm',
};

export function spinnerButton(id, label, type = 'submit') {
  return `
    <button type="${type}" id="${id}" class="${UI.button}">
      <span class="btn-text">${label}</span>
      <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
    </button>`;
}

export function setBusy(button, busy) {
  button.disabled = busy;
  button.querySelector('.btn-text')?.classList.toggle('hidden', busy);
  button.querySelector('.spinner')?.classList.toggle('hidden', !busy);
}

export function showMessage(el, text, kind = 'error') {
  el.textContent = text || '';
  el.className = 'text-xs min-h-[20px] mt-3 ' + (kind === 'error' ? 'text-red-600 dark:text-red-400 font-medium' : UI.muted);
}

/**
 * Email -> 6-digit code -> verified. Shared by /join and /feedback.
 *
 * @param {object} opts
 * @param {string} opts.sendRoute    e.g. 'join/send'
 * @param {string} opts.verifyRoute  e.g. 'join/verify'
 * @param {string} opts.submitLabel  label of the email button
 * @param {(result: object) => void} opts.onVerified  called with the /verify (or no-code /send) result;
 *        the browser session is saved before this runs
 */
export function createEmailVerifier({ sendRoute, verifyRoute, submitLabel, onVerified }) {
  const el = document.createElement('div');
  el.innerHTML = `
    <div data-step="email">
      <div class="${UI.box}">
        <form data-form="email" class="flex gap-1.5 w-full">
          <input type="email" name="email" placeholder="you@domain.com" required autocomplete="email" spellcheck="false" class="${UI.input}" />
          ${spinnerButton('verifier-send', submitLabel)}
        </form>
      </div>
    </div>

    <div data-step="code" class="hidden">
      <p class="text-sm ${UI.muted} mb-4">We sent a 6-digit code to <span data-email class="font-medium text-ink dark:text-paper-ink"></span></p>
      <div class="${UI.box}">
        <form data-form="code" class="flex gap-1.5 w-full">
          <input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="123456" required class="${UI.input} tracking-[0.4em] text-center font-medium" />
          ${spinnerButton('verifier-verify', 'Verify')}
        </form>
      </div>
      <div class="flex items-center justify-center gap-4 mt-3 text-xs">
        <button type="button" data-action="resend" class="${UI.link}">Resend code</button>
        <span class="text-[#c9c4b6] dark:text-[#3a3e4a]">&middot;</span>
        <button type="button" data-action="change" class="${UI.link}">Change email</button>
      </div>
    </div>

    <div data-msg class="text-xs min-h-[20px] mt-3"></div>
  `;

  const $ = (sel) => el.querySelector(sel);
  const stepEmail = $('[data-step="email"]');
  const stepCode = $('[data-step="code"]');
  const emailInput = $('input[name="email"]');
  const codeInput = $('input[name="code"]');
  const btnSend = $('#verifier-send');
  const btnVerify = $('#verifier-verify');
  const btnResend = $('[data-action="resend"]');
  const msg = $('[data-msg]');

  let email = '';
  let cooldownTimer = null;

  function stopCooldown() {
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = null;
  }

  function startCooldown() {
    let remaining = RESEND_COOLDOWN_SECONDS;
    stopCooldown();
    btnResend.disabled = true;
    btnResend.textContent = `Resend code in ${remaining}s`;
    cooldownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        stopCooldown();
        btnResend.disabled = false;
        btnResend.textContent = 'Resend code';
      } else {
        btnResend.textContent = `Resend code in ${remaining}s`;
      }
    }, 1000);
  }

  function finish(result) {
    stopCooldown();
    saveSession(result);
    onVerified(result);
  }

  $('[data-form="email"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage(msg, '');
    email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    setBusy(btnSend, true);
    try {
      const result = await apiPost(sendRoute, { email });
      if (result && result.verification_required === false) {
        finish({ ...result, email });
        return;
      }
      $('[data-email]').textContent = email;
      stepEmail.classList.add('hidden');
      stepCode.classList.remove('hidden');
      codeInput.value = '';
      codeInput.focus();
      startCooldown();
    } catch (err) {
      showMessage(msg, err.message);
    } finally {
      setBusy(btnSend, false);
    }
  });

  $('[data-form="code"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage(msg, '');
    const code = codeInput.value.replace(/\D/g, '');
    if (code.length !== 6) {
      showMessage(msg, 'Enter the 6-digit code from the email');
      return;
    }
    setBusy(btnVerify, true);
    try {
      finish({ ...(await apiPost(verifyRoute, { email, code })), email });
    } catch (err) {
      showMessage(msg, err.message);
    } finally {
      setBusy(btnVerify, false);
    }
  });

  btnResend.addEventListener('click', async () => {
    showMessage(msg, '');
    btnResend.disabled = true;
    try {
      await apiPost(sendRoute, { email });
      showMessage(msg, 'New code sent. Check your inbox (and spam).', 'info');
      startCooldown();
    } catch (err) {
      showMessage(msg, err.message);
      btnResend.disabled = false;
    }
  });

  $('[data-action="change"]').addEventListener('click', () => {
    stopCooldown();
    showMessage(msg, '');
    stepCode.classList.add('hidden');
    stepEmail.classList.remove('hidden');
    emailInput.focus();
  });

  return {
    element: el,
    focus: () => emailInput.focus(),
    showMessage: (text, kind) => showMessage(msg, text, kind),
  };
}
