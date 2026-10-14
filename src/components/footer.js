import { CONTAINER } from './header.js';

export const CONTACT_EMAIL = 'hi@zerodaily.in';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/wire', label: "Today's Wire" },
      { href: '/download', label: 'Download for Android' },
      { href: '/join', label: 'Join the waitlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: 'Contact us' },
      { href: '/feedback', label: 'Send feedback' },
      { href: `mailto:${CONTACT_EMAIL}?subject=Press%20enquiry`, label: 'Press' },
      { href: `mailto:${CONTACT_EMAIL}?subject=Partnership%20enquiry`, label: 'Partnerships' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
      { href: '/delete-account', label: 'Delete account' },
    ],
  },
];

const MAIL_ICON = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-rule dark:border-night-rule bg-paper-raised/60 dark:bg-night-raised';

  const year = new Date().getFullYear();
  const link = 'text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors';

  footer.innerHTML = `
    <div class="${CONTAINER} pt-14 pb-10 grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div class="max-w-sm">
        <a href="/" class="inline-flex items-center gap-2">
          <img src="/favicon.svg" alt="" class="w-7 h-7 rounded-md" />
          <span class="text-lg font-semibold tracking-tight text-ink dark:text-paper-ink">ZeroDaily</span>
        </a>
        <p class="mt-4 font-serif text-xl leading-snug text-ink dark:text-paper-ink">Tech news, minus the noise.</p>
        <p class="mt-2 text-sm leading-relaxed text-ink-soft dark:text-paper-soft">
          The stories that matter across security, AI, software, robotics, defense, silicon and finance, each in 60 words.
        </p>
        <a href="mailto:${CONTACT_EMAIL}" class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink dark:text-paper-ink hover:text-brand dark:hover:text-brand-dark transition-colors">
          ${MAIL_ICON}<span>${CONTACT_EMAIL}</span>
        </a>
        <a href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener" class="mt-5 flex w-fit items-center gap-2 rounded-full border border-rule dark:border-night-rule px-3 py-1.5 text-xs font-medium text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors">
          <span class="h-2 w-2 rounded-full bg-[#76b900]" aria-hidden="true"></span>
          <span>Member of NVIDIA Inception</span>
        </a>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:contents">
        ${COLUMNS.map(col => `
          <nav aria-label="${col.title}">
            <h2 class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint dark:text-paper-faint">${col.title}</h2>
            <ul class="mt-4 space-y-3 text-sm">
              ${col.links.map(l => `<li><a href="${l.href}" class="${link}">${l.label}</a></li>`).join('')}
            </ul>
          </nav>
        `).join('')}
      </div>
    </div>

    <div class="border-t border-rule dark:border-night-rule">
      <div class="${CONTAINER} py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint dark:text-paper-faint">
        <p>&copy; ${year} ZeroDaily. All rights reserved.</p>
        <p>Seven desks &middot; Updated hourly</p>
      </div>
    </div>
  `;

  return footer;
}
