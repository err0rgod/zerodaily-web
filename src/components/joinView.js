export function renderJoinView() {
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col items-center justify-center px-4 bg-paper dark:bg-night text-ink dark:text-paper-ink';

  container.innerHTML = `
    <div class="w-full max-w-[360px] text-center">
      <h1 class="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink dark:text-paper-ink mb-7">
        join Zerodaily
      </h1>

      <!-- Email Box -->
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
              id="join-btn-submit"
              class="bg-brand hover:bg-[#b03224] dark:bg-brand-dark dark:hover:bg-[#f05a49] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center min-w-[80px]"
            >
              <span class="btn-text">Join</span>
              <span class="hidden spinner w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
        <div id="join-msg" class="text-xs min-h-[20px] mt-3"></div>
      </div>

      <!-- Joined Status -->
      <div id="join-step-joined" class="hidden">
        <div class="bg-card dark:bg-[#15171e] border border-[#e2ded2] dark:border-[#232733] rounded-lg p-6 shadow-sm flex items-center justify-center gap-2.5 text-base font-medium">
          <svg class="text-green-600 dark:text-green-400 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>joined</span>
        </div>
      </div>
    </div>
  `;

  const stepEmail = container.querySelector('#join-step-email');
  const stepJoined = container.querySelector('#join-step-joined');
  const formEmail = container.querySelector('#join-form-email');
  const emailInput = container.querySelector('#join-email-input');
  const btnSubmit = container.querySelector('#join-btn-submit');
  const msg = container.querySelector('#join-msg');

  const API_HOSTS = [
    '/api/join',
    'https://api.zerodaily.in/api/v1/join',
    'https://gnur4xlnhnucw6kghv4lqx4cly0uioia.lambda-url.us-east-1.on.aws/api/v1/join',
    'https://urpkmq2bzf.execute-api.us-east-1.amazonaws.com/api/v1/join'
  ];

  async function apiSave(email) {
    let lastError = null;
    for (const host of API_HOSTS) {
      try {
        const url = `${host}/save`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          return data || { status: 'success' };
        } else {
          const errMsg = (data && (data.detail || data.message)) || 'Request failed';
          if (res.status === 400) throw new Error(errMsg);
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

  formEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'text-xs min-h-[20px] mt-3';

    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    btnSubmit.disabled = true;
    btnSubmit.querySelector('.btn-text').classList.add('hidden');
    btnSubmit.querySelector('.spinner').classList.remove('hidden');

    try {
      await apiSave(email);
      stepEmail.classList.add('hidden');
      stepJoined.classList.remove('hidden');
    } catch (err) {
      msg.textContent = err.message || 'Error submitting email';
      msg.className = 'text-xs min-h-[20px] mt-3 text-red-600 dark:text-red-400 font-medium';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.querySelector('.btn-text').classList.remove('hidden');
      btnSubmit.querySelector('.spinner').classList.add('hidden');
    }
  });

  return container;
}
