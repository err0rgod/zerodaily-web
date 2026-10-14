import { escapeHtml } from '../api.js';
import { ApiError, apiPost } from '../webApi.js';
import { clearSession, getSession } from '../session.js';
import { UI, createEmailVerifier, setBusy, showMessage, spinnerButton } from './emailVerifier.js';

const MIN_CHARS = 3;
const MAX_CHARS = 2000;

export function renderFeedbackView() {
  document.title = 'Feedback — ZeroDaily';
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-paper dark:bg-night text-ink dark:text-paper-ink';

  container.innerHTML = `
    <div class="w-full max-w-[480px] text-center">
      <a href="/" class="inline-flex items-center gap-2 mb-6">
        <img src="/favicon.svg" alt="" class="w-7 h-7 rounded-md" />
        <span class="text-lg font-semibold tracking-tight">ZeroDaily</span>
      </a>
      <h1 class="font-serif text-3xl sm:text-4xl font-normal tracking-tight mb-2">send us feedback</h1>
      <p class="text-sm ${UI.muted} mb-7">Bugs, ideas, or a story we got wrong: we read every message.</p>
      <div id="feedback-body"></div>
    </div>
  `;
  const body = container.querySelector('#feedback-body');

  function showVerifier(notice) {
    body.innerHTML = `<p class="text-xs ${UI.muted} mb-3">First, confirm your email so we can reply.</p>`;
    const verifier = createEmailVerifier({
      sendRoute: 'feedback/send',
      verifyRoute: 'feedback/verify',
      submitLabel: 'Continue',
      onVerified: () => {
        const session = getSession();
        if (session) showForm(session);
        else showVerifier('Could not keep you signed in. Please enable cookies/storage and try again.');
      },
    });
    body.appendChild(verifier.element);
    if (notice) verifier.showMessage(notice);
    verifier.focus();
  }

  function showThanks(session) {
    body.innerHTML = `
      <div class="${UI.card} p-8 flex flex-col items-center gap-3">
        <h2 class="font-serif text-2xl sm:text-3xl font-normal">thank you!</h2>
        <p class="text-sm leading-relaxed ${UI.muted}">We got your feedback and may reply to ${escapeHtml(session.email)}.</p>
        <button type="button" id="feedback-again" class="${UI.link} text-sm mt-1">Send more feedback</button>
      </div>
    `;
    body.querySelector('#feedback-again').addEventListener('click', () => showForm(session));
  }

  function showForm(session) {
    let rating = null;
    body.innerHTML = `
      <form id="feedback-form" class="text-left">
        <div class="flex items-center justify-between text-xs ${UI.muted} mb-3">
          <span>Signed in as <span class="font-medium text-ink dark:text-paper-ink">${escapeHtml(session.email)}</span></span>
          <button type="button" id="feedback-switch" class="${UI.link}">Not you?</button>
        </div>

        <fieldset class="mb-4">
          <legend class="text-sm font-medium mb-2">How do you like ZeroDaily? <span class="${UI.muted} font-normal">(optional)</span></legend>
          <div id="feedback-rating" class="flex gap-2" role="radiogroup" aria-label="Rating">
            ${[1, 2, 3, 4, 5].map((n) => `
              <button type="button" role="radio" aria-checked="false" data-rating="${n}" aria-label="${n} out of 5"
                class="w-10 h-10 rounded-md border border-[#e2ded2] dark:border-[#232733] bg-card dark:bg-[#15171e] text-lg leading-none transition-colors hover:border-brand dark:hover:border-brand-dark">★</button>
            `).join('')}
          </div>
        </fieldset>

        <label for="feedback-message" class="block text-sm font-medium mb-2">Your feedback</label>
        <div class="${UI.box}">
          <textarea id="feedback-message" rows="6" maxlength="${MAX_CHARS}" required placeholder="What should we fix, add or keep?"
            class="w-full resize-y bg-transparent border-0 px-3 py-2 text-[15px] text-ink dark:text-paper-ink placeholder:text-[#7f7b6e] dark:placeholder:text-[#8c8f9b] focus:outline-none"></textarea>
        </div>
        <div class="flex items-center justify-between mt-3">
          <span id="feedback-count" class="text-xs ${UI.muted}">0 / ${MAX_CHARS}</span>
          ${spinnerButton('feedback-submit', 'Send feedback')}
        </div>
        <div id="feedback-msg" class="text-xs min-h-[20px] mt-3"></div>
      </form>
    `;

    const form = body.querySelector('#feedback-form');
    const textarea = body.querySelector('#feedback-message');
    const count = body.querySelector('#feedback-count');
    const submit = body.querySelector('#feedback-submit');
    const msg = body.querySelector('#feedback-msg');
    const stars = [...body.querySelectorAll('[data-rating]')];

    function paintStars() {
      stars.forEach((star) => {
        const on = rating !== null && Number(star.dataset.rating) <= rating;
        star.setAttribute('aria-checked', String(Number(star.dataset.rating) === rating));
        star.classList.toggle('text-brand', on);
        star.classList.toggle('dark:text-brand-dark', on);
        star.classList.toggle('text-[#c9c4b6]', !on);
        star.classList.toggle('dark:text-[#3a3e4a]', !on);
      });
    }
    stars.forEach((star) => star.addEventListener('click', () => {
      const value = Number(star.dataset.rating);
      rating = rating === value ? null : value;
      paintStars();
    }));
    paintStars();

    textarea.addEventListener('input', () => {
      count.textContent = `${textarea.value.length} / ${MAX_CHARS}`;
    });

    body.querySelector('#feedback-switch').addEventListener('click', () => {
      clearSession();
      showVerifier();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showMessage(msg, '');
      const message = textarea.value.trim();
      if (message.length < MIN_CHARS) {
        showMessage(msg, 'Please write a little more feedback.');
        return;
      }
      setBusy(submit, true);
      try {
        await apiPost('feedback', { message, rating, page: '/feedback' }, { token: session.token });
        showThanks(session);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          showVerifier('Your session expired. Please verify your email again.');
          return;
        }
        showMessage(msg, err.message);
        setBusy(submit, false);
      }
    });

    textarea.focus();
  }

  const session = getSession();
  if (session) showForm(session);
  else showVerifier();

  return container;
}
