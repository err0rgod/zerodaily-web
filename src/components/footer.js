import { RELEASES_URL, REPO_URL } from '../api.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-[#1d2330] bg-[#08090d] py-12';

  footer.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <!-- Left: Brand & Tagline -->
        <div class="space-y-1.5 text-center sm:text-left">
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-serif font-bold text-white text-base tracking-tight">ZeroDaily</span>
            <span class="text-xs text-slate-600 font-mono">&bull;</span>
            <span class="text-xs text-slate-400 font-mono">MIT Licensed</span>
          </div>
          <p class="text-xs text-slate-400 font-sans">
            Editorial tech & market intelligence without PR spin. Strictly 60 words.
          </p>
        </div>

        <!-- Right: Links -->
        <div class="flex items-center gap-6 text-xs text-slate-400 font-mono">
          <a href="${RELEASES_URL}" target="_blank" rel="noopener" class="hover:text-white transition-colors">
            Releases
          </a>
          <a href="${REPO_URL}" target="_blank" rel="noopener" class="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#domains" class="hover:text-white transition-colors">
            Coverage
          </a>
          <a href="#app" class="hover:text-white transition-colors">
            Get App
          </a>
          <div class="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Edge Operational</span>
          </div>
        </div>

      </div>

      <div class="mt-8 pt-6 border-t border-[#1d2330]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
        <div>
          &copy; 2026 ZeroDaily. Engineered for engineers, researchers, and quants.
        </div>
        <div>
          zerodaily.in &bull; high-signal briefing wire
        </div>
      </div>
    </div>
  `;

  return footer;
}
