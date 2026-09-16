export function renderDownloads() {
  const section = document.createElement('section');
  section.id = 'access';
  section.className = 'py-16 md:py-24 border-t border-[#1e2638] bg-[#090a0f]';

  section.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ 04 / Access ]</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">Get ZeroDaily.</h2>
        <p class="text-slate-400 text-sm">
          No mandatory accounts. No tracking. Free, fast, and open source.
        </p>
      </div>

      <!-- Access Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <!-- Android Card -->
        <div class="p-6 rounded-xl bg-[#0e121a] border border-[#1e2638] flex flex-col justify-between hover-card">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                AVAILABLE NOW
              </span>
              <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.61-.924V2.738c.11-.343.32-.66.61-.924zm11.59 11.59l2.42-2.42a1.39 1.39 0 0 0 0-1.968l-2.42-2.42-7.58 7.58 7.58-7.58zm1.406-3.376l-2.185-1.261-3.648 3.648 3.648 3.648 2.185-1.261a1.442 1.442 0 0 0 0-2.398l-.001-.001zM4.995 1.428l8.016 8.016-8.016 8.016a.48.48 0 0 1-.386-.145L4.61 17.3a1.41 1.41 0 0 0 0-1.996l3.99-3.99-3.99-3.99a1.41 1.41 0 0 0 0-1.996L4.61 5.313a.478.478 0 0 1 .385-.145z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-white mb-2">Android App (APK)</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              Swipe-based 60-word feed with offline caching, category filtering, and instant breaking 0-day push alerts.
            </p>
          </div>
          <a
            href="https://github.com/err0rgod/zerodaily/releases"
            target="_blank"
            rel="noopener"
            class="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5"
          >
            <span>Download APK</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <!-- iOS Card -->
        <div class="p-6 rounded-xl bg-[#0e121a] border border-[#1e2638] flex flex-col justify-between hover-card">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                IN REVIEW
              </span>
              <svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.55.63-1.03 1.68-.9 2.71 1 .08 2-.45 2.59-1.2z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-white mb-2">iOS TestFlight</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              Apple App Store review is currently in progress. Watch GitHub releases or star the project for release updates.
            </p>
          </div>
          <a
            href="https://github.com/err0rgod/zerodaily"
            target="_blank"
            rel="noopener"
            class="w-full py-2.5 px-4 rounded-lg bg-[#121722] hover:bg-[#161e2c] border border-[#1e2638] text-slate-300 font-medium text-xs text-center transition-all flex items-center justify-center gap-1.5"
          >
            <span>Star on GitHub</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

        <!-- API / Hacker Card -->
        <div class="p-6 rounded-xl bg-[#0e121a] border border-[#1e2638] flex flex-col justify-between hover-card">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                REST API
              </span>
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="text-base font-semibold text-white mb-2">Public Edge API</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              Query the feed directly from your CLI, scripts, or terminal dashboard:
            </p>
            
            <div class="relative bg-[#121722] border border-[#1e2638] rounded-lg p-2.5 mb-6">
              <code class="font-mono text-[11px] text-emerald-400 block truncate">
                curl -s https://api.zerodaily.in/api/v1/feed
              </code>
            </div>
          </div>

          <a
            href="https://api.zerodaily.in/docs"
            target="_blank"
            rel="noopener"
            class="w-full py-2.5 px-4 rounded-lg bg-[#121722] hover:bg-[#161e2c] border border-[#1e2638] text-slate-300 font-medium text-xs text-center transition-all flex items-center justify-center gap-1.5"
          >
            <span>View API Docs</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

      </div>

    </div>
  `;

  return section;
}
