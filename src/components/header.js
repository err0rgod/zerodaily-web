import { DIRECT_APK_URL } from '../api.js';

export const CONTAINER = 'max-w-2xl mx-auto px-5';

const NAV = [
  { href: '/wire', label: 'Wire', page: 'wire' },
  { href: '/join', label: 'Waitlist', page: 'join' },
];

export function renderHeader(activePage = 'home') {
  const header = document.createElement('header');
  header.className = 'border-b border-rule dark:border-night-rule';

  const isDark = document.documentElement.classList.contains('dark');

  header.innerHTML = `
    <div class="${CONTAINER} py-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <a href="/" class="text-base font-medium text-ink dark:text-paper-ink">ZeroDaily</a>
      <nav class="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-soft dark:text-paper-soft">
        ${NAV.map(item => `
          <a
            href="${item.href}"
            ${item.page === activePage ? 'aria-current="page"' : ''}
            class="${item.page === activePage ? 'text-ink dark:text-paper-ink underline underline-offset-4' : 'hover:text-ink dark:hover:text-paper-ink'}"
          >${item.label}</a>
        `).join('')}
        <a href="${DIRECT_APK_URL}" data-apk-link="true" download class="hover:text-ink dark:hover:text-paper-ink">Download</a>
        <button
          id="theme-toggle"
          type="button"
          aria-label="${isDark ? 'Switch to light theme' : 'Switch to dark theme'}"
          class="cursor-pointer hover:text-ink dark:hover:text-paper-ink"
        >${isDark ? 'Light' : 'Dark'}</button>
      </nav>
    </div>
  `;

  const toggle = header.querySelector('#theme-toggle');
  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const nowDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nowDark);
    root.style.colorScheme = nowDark ? 'dark' : 'light';
    try { localStorage.setItem('zd-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nowDark ? '#0d0e12' : '#faf8f3');
    toggle.textContent = nowDark ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', nowDark ? 'Switch to light theme' : 'Switch to dark theme');
  });

  return header;
}
