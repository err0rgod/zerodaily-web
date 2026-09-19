import { RELEASES_URL, REPO_URL } from '../api.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-[#1e2638] bg-[#090a0f] py-12';

  footer.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <!-- Left: Brand & Tagline -->
        <div class="space-y-1.5 text-center sm:text-left">
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 status-dot"></span>
            <span class="font-bold text-white text-sm tracking-tight">ZeroDaily</span>
            <span class="text-xs text-slate-500 font-mono">•</span>
            <span class="text-xs text-slate-500 font-mono">MIT Licensed</span>
          </div>
          <p class="text-xs text-slate-400">
            Tech intelligence without corporate PR. Built for developers and engineers.
          </p>
        </div>

        <!-- Center / Right: Links -->
        <div class="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <a href="${RELEASES_URL}" target="_blank" rel="noopener" class="hover:text-white transition-colors">
            Releases
          </a>
          <a href="${REPO_URL}" target="_blank" rel="noopener" class="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://api.zerodaily.in/docs" target="_blank" rel="noopener" class="hover:text-white transition-colors">
            API Docs
          </a>
          <div class="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Edge Operational</span>
          </div>
        </div>

      </div>

      <div class="mt-8 pt-6 border-t border-[#1e2638]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
        <div>
          &copy; 2026 ZeroDaily. All claims roasted with technical precision.
        </div>
        <div class="font-mono text-slate-400">
          zerodaily.in &bull; edge serverless
        </div>
      </div>
    </div>
  `;

  return footer;
}
