import { DIRECT_APK_URL, CATEGORIES } from '../api.js';
import { CONTAINER } from './header.js';
import { mockupHtml, hydrateMockups } from './appMockups.js';

const FEATURES = [
  ['Seven desks', 'Security, AI/ML, engineering, robotics, defense, VLSI and finance.'],
  ['Alerts that matter', 'A push for a real zero-day or a market crash, not every launch.'],
  ['Private by default', 'No account needed, no trackers. Works offline.'],
];

// Each phone is a live HTML mockup of the app (appMockups.js); `src` is the static screenshot
// shown instead when the feed API is unavailable.
const SCREENS = [
  { kind: 'feed', src: '/screens/feed.webp', title: 'A clean feed', body: 'One story per screen with the image, the gist and the source.', alt: 'ZeroDaily app feed showing a full-screen story card' },
  { kind: 'desks', src: '/screens/desks.webp', title: 'Pick a topic', body: 'Open the menu to jump to security, AI/ML, VLSI and more.', alt: 'ZeroDaily app with the topic menu open over the feed' },
  { kind: 'onboarding', src: '/screens/onboarding.webp', title: 'Make it yours', body: 'Choose the topics you care about. Change them any time.', alt: 'ZeroDaily topic picker with seven topics' },
  { kind: 'saved', src: '/screens/saved.webp', title: 'Saved for offline', body: 'Bookmark a story and read it later, even without a signal.', alt: 'ZeroDaily saved offline stories list' },
  { kind: 'settings', src: '/screens/settings.webp', title: 'Alerts you control', body: 'Choose exactly which topics are allowed to buzz your phone.', alt: 'ZeroDaily settings with theme and notification channels' },
];

const DOWNLOAD_ICON = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>';

/** A phone frame around a live app mockup (decorative inside; the frame carries the label). */
function phone(screen, extra = '', eager = false, role = 'row') {
  return `
    <div role="img" aria-label="${screen.alt}" class="aspect-[390/844] rounded-[2.4rem] bg-ink dark:bg-[#2a2d36] p-[7px] shadow-2xl shadow-black/25 ${extra}">
      <div class="w-full h-full rounded-[2rem] overflow-hidden bg-paper-raised dark:bg-night-raised">
        ${mockupHtml(screen, role, eager)}
      </div>
    </div>`;
}

export function renderHome() {
  const main = document.createElement('main');
  const desks = CATEGORIES.filter(c => c.id !== 'all');

  main.innerHTML = `
    <section class="${CONTAINER} pt-14 pb-16 sm:pt-20 sm:pb-24 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center overflow-hidden">
      <div>
        <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink dark:text-paper-ink tracking-tight leading-[1.02] text-balance">
          Zero fluff. Daily stop for Tech News.
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-ink-soft dark:text-paper-soft leading-relaxed max-w-xl">
          The stories that matter across security, AI/ML, engineering, robotics, defense, VLSI and finance, each in 60 words.
        </p>

        <div class="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="${DIRECT_APK_URL}"
            data-apk-link="true"
            download
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand dark:bg-brand-dark text-white dark:text-night text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            ${DOWNLOAD_ICON}
            <span>Download for Android</span>
          </a>
          <a href="/wire" class="px-6 py-3 rounded-full text-sm font-medium text-ink dark:text-paper-ink border border-rule-dark dark:border-night-rule-dark hover:bg-paper-raised dark:hover:bg-night-raised transition-colors">
            Read Today's Wire &rarr;
          </a>
        </div>

        <p class="mt-4 text-sm text-ink-faint dark:text-paper-faint">Free. No account needed, no trackers.</p>
      </div>

      <div class="relative mx-auto w-full max-w-[26rem] lg:max-w-none h-[28rem] sm:h-[40rem]">
        ${phone(SCREENS[1], 'absolute right-[2%] top-0 w-[48%] sm:w-[44%] translate-y-10 rotate-[5deg]', true, 'hero-back')}
        ${phone(SCREENS[0], 'absolute left-[6%] top-0 w-[56%] sm:w-[52%] -rotate-[3deg] z-10', true, 'hero-front')}
      </div>
    </section>

    <section id="screens" class="border-t border-rule dark:border-night-rule bg-paper-raised/60 dark:bg-night-raised/50 scroll-mt-16">
      <div class="${CONTAINER} py-14 sm:py-20">
        <h2 class="text-2xl sm:text-3xl font-semibold text-ink dark:text-paper-ink tracking-tight">Inside the app</h2>
        <p class="mt-2 text-ink-soft dark:text-paper-soft">Live stories, laid out exactly as the app shows them.</p>

        <ul class="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar lg:grid lg:grid-cols-5 lg:overflow-visible">
          ${SCREENS.map(screen => `
            <li class="snap-start shrink-0 w-[62%] sm:w-[34%] lg:w-auto">
              ${phone(screen)}
              <h3 class="mt-5 text-base font-semibold text-ink dark:text-paper-ink">${screen.title}</h3>
              <p class="mt-1 text-sm text-ink-soft dark:text-paper-soft leading-relaxed">${screen.body}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    </section>

    <section id="get-app" class="scroll-mt-16">
      <div class="${CONTAINER} py-14 sm:py-20">
        <div class="rounded-3xl border border-rule dark:border-night-rule p-6 sm:p-10 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div class="flex items-center gap-4">
            <img src="/icon-192.png" alt="" class="w-16 h-16 rounded-2xl" />
            <div>
              <h2 class="text-xl sm:text-2xl font-semibold text-ink dark:text-paper-ink tracking-tight">ZeroDaily for Android</h2>
              <p id="app-specs-tag" class="text-sm text-ink-faint dark:text-paper-faint">Latest release &middot; iOS coming soon</p>
            </div>
          </div>

          <div>
            <ul class="grid gap-5 sm:grid-cols-3">
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
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink dark:bg-paper-ink text-paper dark:text-night text-sm font-semibold hover:opacity-85 transition-opacity"
              >
                ${DOWNLOAD_ICON}
                <span>Download APK</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-rule dark:border-night-rule">
      <div class="${CONTAINER} py-14 sm:py-20">
        <h2 class="text-2xl sm:text-3xl font-semibold text-ink dark:text-paper-ink tracking-tight">Browse by desk</h2>
        <p class="mt-2 text-ink-soft dark:text-paper-soft">Jump straight into the stories you care about.</p>
        <div class="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
          ${desks.map(desk => `
            <a href="/wire?desk=${desk.id}" class="group rounded-2xl border border-rule dark:border-night-rule px-4 py-5 hover:border-ink dark:hover:border-paper-ink transition-colors">
              <span class="block text-sm font-semibold text-ink dark:text-paper-ink">${desk.label}</span>
              <span class="mt-1 block text-xs text-ink-faint dark:text-paper-faint group-hover:text-brand dark:group-hover:text-brand-dark transition-colors">Read &rarr;</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  hydrateMockups(main);
  return main;
}
