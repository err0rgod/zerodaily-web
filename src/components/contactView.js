import { CONTAINER } from './header.js';
import { CONTACT_EMAIL } from './footer.js';


const ROWS = [
  {
    label: 'Send feedback',
    detail: 'Bugs, ideas or a story we got wrong',
    value: 'zerodaily.in/feedback',
    href: '/feedback',
  },
  {
    label: 'Press',
    detail: 'Interviews, coverage and media kits',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`,
  },
  {
    label: 'Partnerships',
    detail: 'Publishers, distribution and collaborations',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=Partnership%20enquiry`,
  },
  {
    label: 'Privacy questions',
    detail: 'Your data, account deletion and privacy requests',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=Privacy%20request`,
  },
  {
    label: 'Website',
    detail: 'News, the app and Today’s Wire',
    value: 'zerodaily.in',
    href: 'https://zerodaily.in',
  },
];

const MAIL_ICON = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>';
const ARROW_ICON = '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5l7 7-7 7"/></svg>';

export function renderContactView() {
  document.title = 'Contact us — ZeroDaily';

  const main = document.createElement('main');
  main.className = 'text-ink dark:text-paper-ink';

  main.innerHTML = `
    <div class="${CONTAINER} py-14 sm:py-20">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand dark:text-brand-dark">Get in touch</p>
        <h1 class="mt-3 font-serif text-4xl sm:text-5xl font-semibold tracking-tight leading-tight text-ink dark:text-paper-ink">Contact us</h1>
        <p class="mt-4 text-base sm:text-lg leading-relaxed text-ink-soft dark:text-paper-soft">
          Questions, corrections, press or partnerships: we read every message.
        </p>

        <section aria-labelledby="contact-email-label" class="mt-10 rounded-3xl border border-rule dark:border-night-rule bg-paper-raised/60 dark:bg-night-card p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <span class="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-brand/10 dark:bg-brand-dark/15 text-brand dark:text-brand-dark">${MAIL_ICON}</span>
            <div class="min-w-0">
              <h2 id="contact-email-label" class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint dark:text-paper-faint">Email</h2>
              <a href="mailto:${CONTACT_EMAIL}" class="mt-1 block font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-ink dark:text-paper-ink hover:text-brand dark:hover:text-brand-dark transition-colors break-words">${CONTACT_EMAIL}</a>
              <p class="mt-2 text-sm leading-relaxed text-ink-soft dark:text-paper-soft">The fastest way to reach the team for anything at all.</p>
            </div>
          </div>
        </section>

        <ul class="mt-6 divide-y divide-rule dark:divide-night-rule rounded-3xl border border-rule dark:border-night-rule overflow-hidden">
          ${ROWS.map(row => `
            <li>
              <a href="${row.href}" class="group flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-paper-raised dark:hover:bg-night-raised transition-colors">
                <div class="min-w-0 flex-1 sm:flex sm:items-center sm:gap-6">
                  <div class="sm:w-56 sm:shrink-0">
                    <p class="text-sm font-semibold text-ink dark:text-paper-ink">${row.label}</p>
                    <p class="text-xs text-ink-faint dark:text-paper-faint">${row.detail}</p>
                  </div>
                  <p class="mt-1 sm:mt-0 text-sm text-ink-soft dark:text-paper-soft group-hover:text-brand dark:group-hover:text-brand-dark transition-colors break-words">${row.value}</p>
                </div>
                <span class="text-ink-faint dark:text-paper-faint group-hover:text-brand dark:group-hover:text-brand-dark transition-colors">${ARROW_ICON}</span>
              </a>
            </li>
          `).join('')}
        </ul>

        <p class="mt-8 text-sm leading-relaxed text-ink-soft dark:text-paper-soft border-l-2 border-rule-dark dark:border-night-rule-dark pl-4">
          ZeroDaily summarizes news from third-party publishers, and every story links to its original source.
          Spotted an error? Send corrections to
          <a href="mailto:${CONTACT_EMAIL}" class="font-medium text-ink dark:text-paper-ink underline underline-offset-2 hover:text-brand dark:hover:text-brand-dark">${CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  `;

  return main;
}
