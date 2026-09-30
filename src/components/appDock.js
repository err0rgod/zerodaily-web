import { DIRECT_APK_URL, RELEASES_URL, REPO_URL } from '../api.js';

export function renderAppDock() {
  const section = document.createElement('section');
  section.id = 'app';
  section.className = 'w-full bg-[#08090d] py-16 border-b border-[#1d2330]';

  section.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      
      <div class="p-8 sm:p-10 rounded-2xl bg-[#0e1117] border border-[#1d2330] relative overflow-hidden">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left Column: Value Prop & Actions -->
          <div class="lg:col-span-8 space-y-4">
            
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span id="app-badge-version">STANDALONE ANDROID RELEASE AVAILABLE</span>
            </div>

            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              ZeroDaily in your pocket. <br />
              <span class="text-slate-400 font-normal">Swipe through the tech world in 60 words.</span>
            </h2>

            <p class="text-sm text-slate-300 max-w-xl font-sans leading-relaxed">
              Designed from the ground up for minimal battery usage and instant reading. 
              Features offline caching, domain filtering, and real-time push alerts for critical zero-days and flash crashes. 
              No tracking, no mandatory accounts.
            </p>

            <!-- Actions Row -->
            <div class="pt-2 flex flex-wrap items-center gap-3">
              <a
                id="app-apk-download-btn"
                href="${DIRECT_APK_URL}"
                data-apk-link="true"
                download
                class="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span id="app-btn-text">Download Android APK</span>
              </a>

              <a
                href="${REPO_URL}"
                target="_blank"
                rel="noopener"
                class="px-4 py-2.5 rounded-lg bg-[#131720] hover:bg-[#181e2b] border border-[#1d2330] text-slate-200 text-xs font-mono transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                <span>Star on GitHub</span>
              </a>
            </div>

            <!-- Direct URL & Checksum info -->
            <div class="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
              <div>
                Direct URL: <a href="/apk" class="text-emerald-400 hover:underline">zerodaily.in/apk</a>
              </div>
              <span>&bull;</span>
              <a id="app-sha-link" href="${RELEASES_URL}" target="_blank" rel="noopener" class="hover:text-slate-300 transition-colors">
                Verify SHA-256 Hash
              </a>
              <span>&bull;</span>
              <span class="text-amber-400/90">iOS TestFlight in review</span>
            </div>

          </div>

          <!-- Right Column: Minimal Specs Wire Box -->
          <div class="lg:col-span-4 p-5 rounded-xl bg-[#131720] border border-[#1d2330] space-y-3 font-mono text-xs">
            <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-[#1d2330]">
              Mobile Client Specifications
            </div>

            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Architecture</span>
              <span class="text-white">React Native Standalone</span>
            </div>

            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Telemetry Push</span>
              <span class="text-white">Firebase FCM (Zero-Day)</span>
            </div>

            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Offline Cache</span>
              <span class="text-white">MMKV Instant Storage</span>
            </div>

            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500">Trackers / Ads</span>
              <span class="text-emerald-400 font-bold">0.00%</span>
            </div>

            <div class="pt-2 border-t border-[#1d2330] flex items-center justify-between text-[11px] text-slate-400">
              <span>Status</span>
              <span id="app-specs-tag" class="text-emerald-400 font-bold">Active v0.1.4</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  return section;
}
