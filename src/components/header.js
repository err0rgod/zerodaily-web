import { DIRECT_APK_URL } from '../api.js';

export const CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-10';

const MOON = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
const SUN = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95l-1.414 1.414M7.464 16.536L6.05 17.95m11.9 0l-1.414-1.414M7.464 7.464L6.05 6.05M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';

const NAV = [
  { href: '/wire', label: "Today's Wire", page: 'wire' },
  { href: '/join', label: 'Waitlist', page: 'join' },
];

export function renderHeader(activePage = 'home') {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-20 bg-paper/85 dark:bg-night/85 backdrop-blur border-b border-rule dark:border-night-rule';

  const isDark = document.documentElement.classList.contains('dark');

  header.innerHTML = `
    <div class="${CONTAINER} h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-5 sm:gap-10 min-w-0">
        <a href="/" class="flex items-center gap-2 shrink-0">
          <img src="/favicon.svg" alt="" class="w-7 h-7 rounded-md" />
          <span class="text-lg font-semibold tracking-tight text-ink dark:text-paper-ink">ZeroDaily</span>
        </a>
        <nav class="flex items-center gap-4 sm:gap-6 text-sm">
          ${NAV.map(item => `
            <a
              href="${item.href}"
              ${item.page === activePage ? 'aria-current="page"' : ''}
              class="whitespace-nowrap transition-colors ${item.page === activePage
                ? 'text-ink dark:text-paper-ink font-semibold'
                : 'text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink'}"
            >${item.label}</a>
          `).join('')}
        </nav>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          id="theme-toggle"
          type="button"
          aria-label="${isDark ? 'Switch to light theme' : 'Switch to dark theme'}"
          class="w-9 h-9 grid place-items-center rounded-full text-ink-soft dark:text-paper-soft hover:bg-paper-raised dark:hover:bg-night-raised transition-colors cursor-pointer"
        >
          <svg id="theme-icon-moon" class="w-4 h-4 ${isDark ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${MOON}</svg>
          <svg id="theme-icon-sun" class="w-4 h-4 ${isDark ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${SUN}</svg>
        </button>
        <a
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="hidden sm:inline-block px-4 py-2 rounded-full bg-ink dark:bg-paper-ink text-paper dark:text-night text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Get the app
        </a>
      </div>
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
    header.querySelector('#theme-icon-moon')?.classList.toggle('hidden', nowDark);
    header.querySelector('#theme-icon-sun')?.classList.toggle('hidden', !nowDark);
    toggle.setAttribute('aria-label', nowDark ? 'Switch to light theme' : 'Switch to dark theme');
  });

  return header;
}
