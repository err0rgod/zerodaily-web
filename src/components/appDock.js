import { DIRECT_APK_URL, REPO_URL } from '../api.js';

export function renderAppSection() {
  const section = document.createElement('section');
  section.id = 'app';
  section.className = 'w-full bg-paper-raised dark:bg-night-raised border-b border-rule dark:border-night-rule';

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-16">

      <div class="flex flex-col sm:flex-row items-center gap-10">

        <!-- App icon -->
        <div class="shrink-0">
          <img src="/icon-192.png" alt="ZeroDaily app icon" class="w-28 h-28 rounded-3xl shadow-md" />
        </div>

        <div class="min-w-0 flex-1 text-center sm:text-left">
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper-ink leading-tight">
            The app is the product.<br class="hidden sm:block" />
            <span class="text-ink-soft dark:text-paper-soft font-normal">This page is just the trailer.</span>
          </h2>

          <ul class="mt-6 space-y-3 text-sm sm:text-base text-ink-soft dark:text-paper-soft leading-relaxed max-w-md mx-auto sm:mx-0 text-left">
            <li class="flex gap-3">
              <span class="text-brand dark:text-brand-dark font-serif font-bold shrink-0">&mdash;</span>
              <span><strong class="text-ink dark:text-paper-ink font-semibold">Sixty words, hard cap.</strong> Every story fits one screen. No infinite scroll, no 4,000-word explainers.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-brand dark:text-brand-dark font-serif font-bold shrink-0">&mdash;</span>
              <span><strong class="text-ink dark:text-paper-ink font-semibold">Seven desks, one swipe.</strong> Cybersecurity, AI, software, robotics, defense, silicon, finance — filter with a tap.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-brand dark:text-brand-dark font-serif font-bold shrink-0">&mdash;</span>
              <span><strong class="text-ink dark:text-paper-ink font-semibold">Alerts only when it matters.</strong> A real zero-day or a market flash crash earns a push. Routine launches don't.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-brand dark:text-brand-dark font-serif font-bold shrink-0">&mdash;</span>
              <span><strong class="text-ink dark:text-paper-ink font-semibold">Nothing watching you.</strong> No accounts, no ads, no trackers. Works offline on the train.</span>
            </li>
          </ul>

          <div class="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <a
              href="${DIRECT_APK_URL}"
              data-apk-link="true"
              download
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand dark:bg-brand-dark text-white dark:text-night text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span id="app-btn-text">Download for Android</span>
            </a>
            <a href="${REPO_URL}" target="_blank" rel="noopener" class="text-sm text-ink-soft dark:text-paper-soft hover:text-brand dark:hover:text-brand-dark transition-colors underline underline-offset-4 decoration-rule-dark dark:decoration-night-rule-dark">
              Source on GitHub
            </a>
          </div>

          <p class="mt-4 font-mono text-[11px] text-ink-faint dark:text-paper-faint">
            <span id="app-specs-tag">Latest release</span>
            <span aria-hidden="true"> &middot; </span>
            <a id="app-sha-link" href="${REPO_URL}/releases" target="_blank" rel="noopener" class="hover:text-ink dark:hover:text-paper-ink transition-colors">checksums on the releases page</a>
            <span aria-hidden="true"> &middot; </span>
            iOS in review
          </p>
        </div>

      </div>

    </div>
  `;

  return section;
}
