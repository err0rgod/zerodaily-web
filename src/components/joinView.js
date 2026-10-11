import { CONTAINER } from './header.js';

export function renderJoinView() {
  const container = document.createElement('main');

  container.innerHTML = `
    <div class="${CONTAINER} py-12 sm:py-16">
      <h1 id="join-title" class="font-serif text-[2rem] sm:text-4xl font-normal text-ink dark:text-paper-ink leading-tight">
        join Zerodaily
      </h1>

      <div id="join-step-email" class="mt-6">
        <p class="text-ink-soft dark:text-paper-soft">An email when there's something worth sending.</p>
        <form id="join-form-email" class="mt-6">
          <label for="join-email-input" class="text-sm text-ink-soft dark:text-paper-soft">Email</label>
          <input
            type="email"
            id="join-email-input"
            name="email"
            placeholder="you@domain.com"
            required
            autofocus
            spellcheck="false"
            class="field"
          />
          <button
            type="submit"
            id="join-btn-submit"
            class="btn mt-3 min-w-16 cursor-pointer"
          >
            <span class="btn-text">Join</span>
            <span class="spinner hidden"></span>
          </button>
        </form>
        <div id="join-msg" class="text-sm min-h-5 mt-3"></div>
      </div>

      <div id="join-step-joined" class="hidden mt-6">
        <h2 class="font-serif text-2xl font-normal text-ink dark:text-paper-ink">welcome to zerodaily</h2>
        <p class="mt-3 text-ink-soft dark:text-paper-soft leading-relaxed max-w-md">
          we will inform you when we launch till then you can visit our <a href="/" class="underline underline-offset-2 text-ink dark:text-paper-ink">website</a> and try our app by <a href="/download/apk" class="underline underline-offset-2 text-ink dark:text-paper-ink">.apk</a>
        </p>
      </div>
    </div>
  `;

  const mainTitle = container.querySelector('#join-title');
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
    msg.className = 'text-sm min-h-5 mt-3';

    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    btnSubmit.disabled = true;
    btnSubmit.querySelector('.btn-text').classList.add('hidden');
    btnSubmit.querySelector('.spinner').classList.remove('hidden');

    try {
      await apiSave(email);
      if (mainTitle) mainTitle.classList.add('hidden');
      stepEmail.classList.add('hidden');
      stepJoined.classList.remove('hidden');
    } catch (err) {
      msg.textContent = err.message || 'Error submitting email';
      msg.className = 'text-sm min-h-5 mt-3 text-red-700 dark:text-red-400';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.querySelector('.btn-text').classList.remove('hidden');
      btnSubmit.querySelector('.spinner').classList.add('hidden');
    }
  });

  return container;
}
