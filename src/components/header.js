import { DIRECT_APK_URL, REPO_URL } from '../api.js';

export function renderHeader() {
  const nav = document.createElement('header');
  nav.className = 'sticky top-0 z-50 w-full border-b border-[#1e2638] bg-[#090a0f]/80 backdrop-blur-md transition-all';

  nav.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-[#121722] border border-[#1e2638] flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
          <span class="w-2 h-2 rounded-full bg-emerald-400 status-dot"></span>
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-bold tracking-tight text-white text-base">ZeroDaily</span>
          <span id="nav-version-badge" class="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">APK READY</span>
        </div>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <a href="#preview" class="hover:text-white transition-colors">Preview</a>
        <a href="#domains" class="hover:text-white transition-colors">Domains</a>
        <a href="#pipeline" class="hover:text-white transition-colors">Architecture</a>
        <a href="#access" class="hover:text-white transition-colors">Get App</a>
      </nav>

      <!-- Action Buttons -->
      <div class="hidden sm:flex items-center gap-3">
        <a
          href="${REPO_URL}"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2638] bg-[#121722] hover:bg-[#161e2c] hover:border-slate-600 text-xs font-medium text-slate-300 transition-all"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>GitHub</span>
        </a>

        <a
          id="nav-download-btn"
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-all"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span class="btn-text">Download APK</span>
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button id="mobile-menu-btn" aria-label="Toggle menu" class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121722] border border-transparent hover:border-[#1e2638] transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
      </button>

    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-[#1e2638] bg-[#0e121a] px-4 py-4 space-y-3">
      <a href="#preview" class="block text-sm font-medium text-slate-300 hover:text-white py-1">Preview</a>
      <a href="#domains" class="block text-sm font-medium text-slate-300 hover:text-white py-1">Domains</a>
      <a href="#pipeline" class="block text-sm font-medium text-slate-300 hover:text-white py-1">Architecture</a>
      <a href="#access" class="block text-sm font-medium text-slate-300 hover:text-white py-1">Get App</a>
      <div class="pt-2 flex gap-3">
        <a
          id="mobile-download-btn"
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="w-full text-center px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold"
        >
          Download APK
        </a>
        <a href="${REPO_URL}" target="_blank" rel="noopener" class="w-full text-center px-4 py-2 rounded-lg border border-[#1e2638] bg-[#121722] text-slate-300 text-xs font-medium">
          GitHub
        </a>
      </div>
    </div>
  `;

  // Bind mobile menu toggle
  const btn = nav.querySelector('#mobile-menu-btn');
  const menu = nav.querySelector('#mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }

  return nav;
}
