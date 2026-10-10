import { DIRECT_APK_URL, RELEASES_URL } from '../api.js';

const FEATURES = [
  ['Seven desks', 'Security, AI, software, robotics, defense, silicon and finance.'],
  ['Alerts that matter', 'A push for a real zero-day or a market crash, not every launch.'],
  ['Private by default', 'No account, no ads, no trackers. Works offline.'],
];

export function renderAppSection() {
  const section = document.createElement('section');
  section.id = 'app';
  section.className = 'w-full scroll-mt-16';

  section.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 sm:px-5 pb-16">
      <div class="rounded-3xl bg-paper-raised dark:bg-night-raised p-6 sm:p-10">
        <div class="flex items-center gap-4">
          <img src="/icon-192.png" alt="" class="w-14 h-14 rounded-2xl" />
          <div>
            <h2 class="text-xl sm:text-2xl font-semibold text-ink dark:text-paper-ink tracking-tight">Get ZeroDaily</h2>
            <p id="app-specs-tag" class="text-sm text-ink-faint dark:text-paper-faint">Android &middot; iOS coming soon</p>
          </div>
        </div>

        <ul class="mt-8 grid gap-5 sm:grid-cols-3">
          ${FEATURES.map(([title, body]) => `
            <li>
              <p class="text-sm font-semibold text-ink dark:text-paper-ink">${title}</p>
              <p class="mt-1 text-sm text-ink-soft dark:text-paper-soft leading-relaxed">${body}</p>
            </li>
          `).join('')}
        </ul>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="${DIRECT_APK_URL}"
            data-apk-link="true"
            download
            class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand dark:bg-brand-dark text-white dark:text-night text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span id="app-btn-text">Download for Android</span>
          </a>
          <a id="app-sha-link" href="${RELEASES_URL}" target="_blank" rel="noopener" class="text-sm text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink transition-colors">
            Release notes &amp; checksums
          </a>
        </div>
      </div>
    </div>
  `;

  return section;
}
