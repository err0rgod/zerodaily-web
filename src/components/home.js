import { DIRECT_APK_URL, RELEASES_URL, CATEGORIES } from '../api.js';
import { CONTAINER } from './header.js';

const FEATURES = [
  ['Alerts that matter.', 'A push for a real zero-day or a market crash, not every launch.'],
  ['Private by default.', 'No account, no ads, no trackers. Works offline.'],
];

export function renderHome() {
  const main = document.createElement('main');
  const desks = CATEGORIES.filter(c => c.id !== 'all');

  main.innerHTML = `
    <section class="${CONTAINER} pt-12 pb-10 sm:pt-16">
      <h1 class="font-serif text-[2rem] sm:text-4xl font-normal text-ink dark:text-paper-ink leading-tight">
        Tech news, minus the noise.
      </h1>
      <p class="mt-4 text-ink-soft dark:text-paper-soft leading-relaxed">
        Short, honest summaries of what actually happened in security, AI, software,
        hardware and markets. Read the gist, skip the fluff.
      </p>
      <p class="mt-6">
        <a href="${DIRECT_APK_URL}" data-apk-link="true" download class="btn">Download for Android</a>
      </p>
      <p class="mt-3 text-sm text-ink-faint dark:text-paper-faint">
        Free. No account, no ads, no trackers.
        <a href="/wire" class="underline underline-offset-2 hover:text-ink dark:hover:text-paper-ink">Read today's wire</a>
      </p>
    </section>

    <section id="get-app" class="border-t border-rule dark:border-night-rule">
      <div class="${CONTAINER} py-10">
        <div class="flex items-center gap-3">
          <img src="/icon-192.png" alt="" width="40" height="40" class="w-10 h-10" />
          <div>
            <h2 class="text-lg font-medium text-ink dark:text-paper-ink">ZeroDaily for Android</h2>
            <p id="app-specs-tag" class="text-sm text-ink-faint dark:text-paper-faint">Latest release · iOS coming soon</p>
          </div>
        </div>

        <ul class="mt-5 space-y-3">
          ${FEATURES.map(([title, body]) => `
            <li class="text-ink-soft dark:text-paper-soft leading-relaxed">
              <span class="text-ink dark:text-paper-ink">${title}</span> ${body}
            </li>
          `).join('')}
        </ul>

        <p class="mt-5 text-sm">
          <a href="${DIRECT_APK_URL}" data-apk-link="true" download class="underline underline-offset-2 text-ink dark:text-paper-ink">Download the APK</a>
          <span class="text-ink-faint dark:text-paper-faint" aria-hidden="true"> · </span>
          <a id="app-sha-link" href="${RELEASES_URL}" target="_blank" rel="noopener" class="underline underline-offset-2 text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink">Release notes</a>
        </p>
      </div>
    </section>

    <section class="border-t border-rule dark:border-night-rule">
      <div class="${CONTAINER} py-10">
        <h2 class="text-lg font-medium text-ink dark:text-paper-ink">Desks</h2>
        <p class="mt-2 text-ink-soft dark:text-paper-soft">The same sections as the app.</p>
        <p class="mt-4 leading-relaxed">
          ${desks.map((desk, i) => `
            ${i ? '<span class="text-ink-faint dark:text-paper-faint" aria-hidden="true"> · </span>' : ''}
            <a href="/wire?desk=${desk.id}" class="underline underline-offset-2 text-ink dark:text-paper-ink">${desk.label}</a>
          `).join('')}
        </p>
      </div>
    </section>
  `;

  return main;
}
