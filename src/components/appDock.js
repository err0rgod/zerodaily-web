import { DIRECT_APK_URL, REPO_URL } from '../api.js';

export function renderAppDock() {
  const section = document.createElement('section');
  section.id = 'app';
  section.className = 'w-full bg-paper-raised dark:bg-night-raised border-b border-rule dark:border-night-rule';

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-14">

      <div class="flex flex-col sm:flex-row sm:items-center gap-8">

        <!-- Phone glyph -->
        <div class="shrink-0 mx-auto sm:mx-0">
          <div class="w-24 h-44 rounded-2xl border-2 border-ink dark:border-paper-ink p-1.5 opacity-90">
            <div class="w-full h-full rounded-xl bg-paper dark:bg-night border border-rule dark:border-night-rule flex flex-col p-2 gap-1.5">
              <div class="h-1.5 w-8 mx-auto rounded-full bg-rule-dark dark:bg-night-rule-dark"></div>
              <div class="h-2 w-3/4 rounded-sm bg-ink/80 dark:bg-paper-ink/80"></div>
              <div class="h-1.5 w-full rounded-sm bg-rule-dark dark:bg-night-rule-dark"></div>
              <div class="h-1.5 w-5/6 rounded-sm bg-rule-dark dark:bg-night-rule-dark"></div>
              <div class="h-1.5 w-full rounded-sm bg-rule-dark dark:bg-night-rule-dark"></div>
              <div class="mt-auto h-1 w-6 mx-auto rounded-full bg-brand dark:bg-brand-dark"></div>
            </div>
          </div>
        </div>

        <div class="min-w-0 text-center sm:text-left">
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper-ink leading-tight">
            Take it with you.
          </h2>
          <p class="mt-3 text-sm sm:text-base text-ink-soft dark:text-paper-soft leading-relaxed max-w-md">
            The same briefing as an Android app — offline reading, alerts when something actually breaks,
            and no accounts, ads, or trackers. iOS is still arguing with review.
          </p>

          <div class="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <a
              href="${DIRECT_APK_URL}"
              data-apk-link="true"
              download
              class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ink dark:bg-paper-ink text-paper dark:text-night text-sm font-semibold hover:bg-brand dark:hover:bg-brand-dark transition-colors"
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
          </p>
        </div>

      </div>

    </div>
  `;

  return section;
}
