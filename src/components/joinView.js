export function renderJoinView() {
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col items-center justify-center px-4 bg-paper dark:bg-night text-ink dark:text-paper-ink';

  container.innerHTML = `
    <div class="w-full max-w-[360px] text-center">
      <h1 class="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink dark:text-paper-ink mb-7">
        join Zerodaily
      </h1>

      <!-- Step 1: Email Box -->
      <div id="join-step-email">
        <div class="bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-1.5 shadow-sm focus-within:border-brand dark:focus-within:border-brand-dark focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          <form id="join-form-email" class="flex gap-1.5 w-full">
            <input
              type="email"
              id="join-email-input"
              name="email"
              placeholder="you@domain.com"
              required
              autofocus
              spellcheck="false"
              class="flex-1 min-w-0 bg-transparent border-0 px-3 py-2 text-[15px] text-ink dark:text-paper-ink placeholder:text-[#7f7b6e] dark:placeholder:text-[#8c8f9b] focus:outline-none"
            />
            <button
              type="submit"
              id="join-btn-send"
              class="bg-brand hover:bg-[#b03224] dark:bg-brand-dark dark:hover:bg-[#f05a49] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center min-w-[90px]"
            >
              <span class="btn-text">Send code</span>
              <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
        <div id="join-msg-email" class="text-xs min-h-[20px] mt-3"></div>
      </div>

      <!-- Step 2: Code Verification Box -->
      <div id="join-step-code" class="hidden">
        <div class="bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-1.5 shadow-sm focus-within:border-brand dark:focus-within:border-brand-dark focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          <form id="join-form-code" class="flex gap-1.5 w-full">
            <input
              type="text"
              id="join-code-input"
              name="code"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]{6}"
              inputmode="numeric"
              required
              spellcheck="false"
              class="flex-1 min-w-0 bg-transparent border-0 px-3 py-2 font-mono text-center tracking-[0.25em] text-lg text-ink dark:text-paper-ink placeholder:text-[#7f7b6e] placeholder:tracking-normal dark:placeholder:text-[#8c8f9b] focus:outline-none"
            />
            <button
              type="submit"
              id="join-btn-verify"
              class="bg-brand hover:bg-[#b03224] dark:bg-brand-dark dark:hover:bg-[#f05a49] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center min-w-[80px]"
            >
              <span class="btn-text">Verify</span>
              <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
        <div id="join-msg-code" class="text-xs min-h-[20px] mt-3"></div>
        <button type="button" id="join-btn-change" class="text-xs text-[#7f7b6e] dark:text-[#8c8f9b] hover:text-ink dark:hover:text-paper-ink mt-3 transition-colors cursor-pointer">
          change email
        </button>
      </div>

      <!-- Step 3: Verified Status -->
      <div id="join-step-verified" class="hidden">
        <div class="bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-6 shadow-sm flex items-center justify-center gap-2.5 text-base font-medium">
          <svg class="text-green-600 dark:text-green-400 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>verified</span>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  const stepEmail = container.querySelector('#join-step-email');
  const stepCode = container.querySelector('#join-step-code');
  const stepVerified = container.querySelector('#join-step-verified');

  const formEmail = container.querySelector('#join-form-email');
  const formCode = container.querySelector('#join-form-code');

  const emailInput = container.querySelector('#join-email-input');
  const codeInput = container.querySelector('#join-code-input');

  const btnSend = container.querySelector('#join-btn-send');
  const btnVerify = container.querySelector('#join-btn-verify');
  const btnChange = container.querySelector('#join-btn-change');

  const msgEmail = container.querySelector('#join-msg-email');
  const msgCode = container.querySelector('#join-msg-code');

  let currentEmail = '';
  let sessionToken = '';

  const API_HOSTS = [
    '/api/join',
    'https://api.zerodaily.in/api/v1/join',
    'https://gnur4xlnhnucw6kghv4lqx4cly0uioia.lambda-url.us-east-1.on.aws/api/v1/join',
    'https://urpkmq2bzf.execute-api.us-east-1.amazonaws.com/api/v1/join'
  ];

  async function apiPost(endpoint, body) {
    let lastError = null;
    for (const host of API_HOSTS) {
      try {
        const url = `${host}/${endpoint}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          return data || { status: 'success' };
        } else {
          const errMsg = (data && (data.detail || data.message)) || 'Request failed';
          if (res.status === 400) {
            throw new Error(errMsg);
          }
          lastError = new Error(errMsg);
        }
      } catch (err) {
        lastError = err;
        if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
          throw err;
        }
      }
    }
    throw lastError || new Error('Unable to connect to service');
  }

  function showMsg(el, text, isError = false) {
    el.textContent = text;
    el.className = isError
      ? 'text-xs min-h-[20px] mt-3 text-red-600 dark:text-red-400 font-medium'
      : 'text-xs min-h-[20px] mt-3 text-green-600 dark:text-green-400 font-medium';
  }

  function clearMsg(el) {
    el.textContent = '';
    el.className = 'text-xs min-h-[20px] mt-3';
  }

  formEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg(msgEmail);

    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    btnSend.disabled = true;
    btnSend.querySelector('.btn-text').classList.add('hidden');
    btnSend.querySelector('.spinner').classList.remove('hidden');

    try {
      const res = await apiPost('send', { email });
      currentEmail = email;
      sessionToken = res.token || '';

      stepEmail.classList.add('hidden');
      stepCode.classList.remove('hidden');
      codeInput.value = '';
      codeInput.focus();
    } catch (err) {
      showMsg(msgEmail, err.message || 'Error sending code', true);
    } finally {
      btnSend.disabled = false;
      btnSend.querySelector('.btn-text').classList.remove('hidden');
      btnSend.querySelector('.spinner').classList.add('hidden');
    }
  });

  formCode.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg(msgCode);

    const code = codeInput.value.trim();
    if (!code || code.length !== 6) {
      showMsg(msgCode, 'Enter 6-digit code', true);
      return;
    }

    btnVerify.disabled = true;
    btnVerify.querySelector('.btn-text').classList.add('hidden');
    btnVerify.querySelector('.spinner').classList.remove('hidden');

    try {
      await apiPost('verify', {
        email: currentEmail,
        code,
        token: sessionToken
      });

      stepCode.classList.add('hidden');
      stepVerified.classList.remove('hidden');
    } catch (err) {
      showMsg(msgCode, err.message || 'Invalid code', true);
    } finally {
      btnVerify.disabled = false;
      btnVerify.querySelector('.btn-text').classList.remove('hidden');
      btnVerify.querySelector('.spinner').classList.add('hidden');
    }
  });

  btnChange.addEventListener('click', () => {
    stepCode.classList.add('hidden');
    stepEmail.classList.remove('hidden');
    clearMsg(msgEmail);
    emailInput.focus();
  });

  return container;
}
