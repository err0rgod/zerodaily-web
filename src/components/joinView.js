const RESEND_COOLDOWN_SECONDS = 60;

export function renderJoinView() {
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col items-center justify-center px-4 bg-paper dark:bg-night text-ink dark:text-paper-ink';

  const BOX = 'bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-1.5 shadow-sm focus-within:border-brand dark:focus-within:border-brand-dark focus-within:ring-2 focus-within:ring-brand/20 transition-all';
  const INPUT = 'flex-1 min-w-0 bg-transparent border-0 px-3 py-2 text-[15px] text-ink dark:text-paper-ink placeholder:text-[#7f7b6e] dark:placeholder:text-[#8c8f9b] focus:outline-none';
  const BUTTON = 'bg-brand hover:bg-[#b03224] dark:bg-brand-dark dark:hover:bg-[#f05a49] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center min-w-[80px] disabled:opacity-60';
  const LINK = 'text-brand dark:text-brand-dark underline underline-offset-2 hover:opacity-80 disabled:opacity-50 disabled:no-underline cursor-pointer';

  container.innerHTML = `
    <div class="w-full max-w-[420px] text-center">
      <h1 id="join-title" class="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink dark:text-paper-ink mb-7">
        join Zerodaily
      </h1>

      <!-- Step 1: email -->
      <div id="join-step-email">
        <div class="${BOX}">
          <form id="join-form-email" class="flex gap-1.5 w-full">
            <input type="email" id="join-email-input" name="email" placeholder="you@domain.com" required autofocus spellcheck="false" class="${INPUT}" />
            <button type="submit" id="join-btn-submit" class="${BUTTON}">
              <span class="btn-text">Join</span>
              <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
      </div>

      <!-- Step 2: verification code (only when the server asks for one) -->
      <div id="join-step-code" class="hidden">
        <p class="text-sm text-[#7f7b6e] dark:text-[#8c8f9b] mb-4">
          We sent a 6-digit code to <span id="join-code-email" class="font-medium text-ink dark:text-paper-ink"></span>
        </p>
        <div class="${BOX}">
          <form id="join-form-code" class="flex gap-1.5 w-full">
            <input type="text" id="join-code-input" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="123456" required class="${INPUT} tracking-[0.4em] text-center font-medium" />
            <button type="submit" id="join-btn-verify" class="${BUTTON}">
              <span class="btn-text">Verify</span>
              <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
        <div class="flex items-center justify-center gap-4 mt-3 text-xs">
          <button type="button" id="join-btn-resend" class="${LINK}">Resend code</button>
          <span class="text-[#c9c4b6] dark:text-[#3a3e4a]">&middot;</span>
          <button type="button" id="join-btn-change" class="${LINK}">Change email</button>
        </div>
      </div>

      <div id="join-msg" class="text-xs min-h-[20px] mt-3"></div>

      <!-- Done -->
      <div id="join-step-joined" class="hidden">
        <div class="bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-8 shadow-sm flex flex-col items-center text-center gap-3">
          <h2 class="font-serif text-2xl sm:text-3xl font-normal text-ink dark:text-paper-ink">
            welcome to zerodaily
          </h2>
          <p class="text-sm leading-relaxed text-[#7f7b6e] dark:text-[#8c8f9b]">
            we will inform you when we launch till then you can visit our <a href="/" class="text-brand dark:text-brand-dark underline underline-offset-2 hover:opacity-80 font-medium">website</a> and try our app by <a href="/download/apk" class="text-brand dark:text-brand-dark underline underline-offset-2 hover:opacity-80 font-medium">.apk</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const $ = (sel) => container.querySelector(sel);
  const mainTitle = $('#join-title');
  const stepEmail = $('#join-step-email');
  const stepCode = $('#join-step-code');
  const stepJoined = $('#join-step-joined');
  const emailInput = $('#join-email-input');
  const codeInput = $('#join-code-input');
  const btnSubmit = $('#join-btn-submit');
  const btnVerify = $('#join-btn-verify');
  const btnResend = $('#join-btn-resend');
  const msg = $('#join-msg');

  let currentEmail = '';
  let cooldownTimer = null;

  const API_HOSTS = [
    '/api/join',
    'https://api.zerodaily.in/api/v1/join',
  ];

  async function api(action, body) {
    let lastError = null;
    for (const host of API_HOSTS) {
      try {
        const res = await fetch(`${host}/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (res.ok) return data || { status: 'success' };

        const errMsg = (data && (data.detail || data.message)) || 'Request failed';
        // The server answered: show its message instead of trying another host.
        if (res.status < 500) throw new Error(errMsg);
        lastError = new Error(errMsg);
      } catch (err) {
        lastError = err;
        if (err.message && !err.message.includes('fetch')) throw err;
      }
    }
    throw lastError || new Error('Unable to connect to service');
  }

  function showMessage(text, kind = 'error') {
    msg.textContent = text || '';
    msg.className = 'text-xs min-h-[20px] mt-3 ' + (
      kind === 'error' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-[#7f7b6e] dark:text-[#8c8f9b]'
    );
  }

  function setBusy(button, busy) {
    button.disabled = busy;
    button.querySelector('.btn-text').classList.toggle('hidden', busy);
    button.querySelector('.spinner').classList.toggle('hidden', !busy);
  }

  function showJoined() {
    if (cooldownTimer) clearInterval(cooldownTimer);
    if (mainTitle) mainTitle.classList.add('hidden');
    stepEmail.classList.add('hidden');
    stepCode.classList.add('hidden');
    stepJoined.classList.remove('hidden');
    showMessage('');
  }

  function startCooldown() {
    let remaining = RESEND_COOLDOWN_SECONDS;
    btnResend.disabled = true;
    btnResend.textContent = `Resend code in ${remaining}s`;
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        btnResend.disabled = false;
        btnResend.textContent = 'Resend code';
      } else {
        btnResend.textContent = `Resend code in ${remaining}s`;
      }
    }, 1000);
  }

  function showCodeStep() {
    $('#join-code-email').textContent = currentEmail;
    stepEmail.classList.add('hidden');
    stepCode.classList.remove('hidden');
    codeInput.value = '';
    codeInput.focus();
    startCooldown();
  }

  $('#join-form-email').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('');
    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    setBusy(btnSubmit, true);
    try {
      const data = await api('send', { email });
      currentEmail = email;
      if (data && data.verification_required) {
        showCodeStep();
      } else {
        showJoined();
      }
    } catch (err) {
      showMessage(err.message || 'Error submitting email');
    } finally {
      setBusy(btnSubmit, false);
    }
  });

  $('#join-form-code').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('');
    const code = codeInput.value.replace(/\D/g, '');
    if (code.length !== 6) {
      showMessage('Enter the 6-digit code from the email');
      return;
    }

    setBusy(btnVerify, true);
    try {
      await api('verify', { email: currentEmail, code });
      showJoined();
    } catch (err) {
      showMessage(err.message || 'That code did not work');
    } finally {
      setBusy(btnVerify, false);
    }
  });

  btnResend.addEventListener('click', async () => {
    showMessage('');
    btnResend.disabled = true;
    try {
      await api('send', { email: currentEmail });
      showMessage('New code sent. Check your inbox (and spam).', 'info');
      startCooldown();
    } catch (err) {
      showMessage(err.message || 'Could not resend the code');
      btnResend.disabled = false;
    }
  });

  $('#join-btn-change').addEventListener('click', () => {
    if (cooldownTimer) clearInterval(cooldownTimer);
    showMessage('');
    stepCode.classList.add('hidden');
    stepEmail.classList.remove('hidden');
    emailInput.focus();
  });

  return container;
}
