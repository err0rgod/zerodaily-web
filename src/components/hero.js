import { DIRECT_APK_URL, REPO_URL } from '../api.js';

export function renderHero() {
  const section = document.createElement('section');
  section.className = 'relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden';

  section.innerHTML = `
    <!-- Subtle top ambient light -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full"></div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
      
      <!-- Eyebrow Pill -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121722] border border-[#1e2638] text-[11px] font-mono font-medium text-slate-300 mb-6 hover:border-emerald-500/40 transition-colors">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot"></span>
        <span id="hero-status-pill">STANDALONE ANDROID APK RELEASE READY</span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
        Tech intelligence. <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500">
          Without the PR fluff.
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-9">
        ZeroDaily cuts through corporate hype, venture capital buzzwords, and marketing spin. 
        Raw, cynical, high-signal breakdowns across cybersecurity, AI, software engineering, defense, and silicon.
      </p>

      <!-- Primary Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        <a
          id="hero-download-btn"
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/60 transition-all hover:scale-[1.02]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span id="hero-btn-text">Download Android APK</span>
          <span id="hero-version-pill" class="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-950/20 text-slate-900 font-bold hidden sm:inline">v0.1.3</span>
        </a>

        <a
          href="${REPO_URL}"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121722] hover:bg-[#161e2c] border border-[#1e2638] hover:border-slate-600 text-slate-200 font-medium text-sm transition-all"
        >
          <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>GitHub</span>
        </a>

        <a
          href="#preview"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium text-slate-400 hover:text-white transition-colors"
        >
          <span>Preview Roast</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
      </div>

      <!-- Stats Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 border-t border-[#1e2638]/80 text-left">
        <div class="p-3 rounded-lg bg-[#0e121a]/60 border border-[#1e2638]/60">
          <div class="font-mono text-lg font-bold text-white">60 words</div>
          <div class="text-[11px] text-slate-400">Strict story ceiling</div>
        </div>
        <div class="p-3 rounded-lg bg-[#0e121a]/60 border border-[#1e2638]/60">
          <div class="font-mono text-lg font-bold text-white">6 domains</div>
          <div class="text-[11px] text-slate-400">Deep technical focus</div>
        </div>
        <div class="p-3 rounded-lg bg-[#0e121a]/60 border border-[#1e2638]/60">
          <div class="font-mono text-lg font-bold text-white">0 PR spin</div>
          <div class="text-[11px] text-slate-400">Cynical & factual</div>
        </div>
        <div class="p-3 rounded-lg bg-[#0e121a]/60 border border-[#1e2638]/60">
          <div class="font-mono text-lg font-bold text-white">&lt;20ms</div>
          <div class="text-[11px] text-slate-400">Edge delivery</div>
        </div>
      </div>

    </div>
  </section>
  `;

  return section;
}
