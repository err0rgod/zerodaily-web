export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-[#1E293B] bg-[#07090E] text-slate-400 py-12 text-xs font-mono';

  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1E293B]/60">
        
        <!-- Col 1: Brand -->
        <div class="space-y-3 md:col-span-2">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white font-mono text-base">ZeroDaily</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">v2.0</span>
          </div>
          <p class="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
            ZeroDaily is an automated, satirical tech news engine that cuts through PR spin. We summarize critical tech developments across 6 domains with honest, cynical breakdowns.
          </p>
          <div class="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems operational &bull; us-east-1</span>
          </div>
        </div>

        <!-- Col 2: Domains -->
        <div class="space-y-2.5">
          <h5 class="text-white font-bold text-xs uppercase tracking-wider">Covered Domains</h5>
          <ul class="space-y-1.5 text-[11px]">
            <li><a href="/?category=cybersec" class="hover:text-cyan-400 transition-colors">Cybersecurity & CVEs</a></li>
            <li><a href="/?category=ai" class="hover:text-cyan-400 transition-colors">Artificial Intelligence</a></li>
            <li><a href="/?category=programming" class="hover:text-cyan-400 transition-colors">Software Engineering</a></li>
            <li><a href="/?category=robotics" class="hover:text-cyan-400 transition-colors">Robotics & Autonomy</a></li>
            <li><a href="/?category=hardware" class="hover:text-cyan-400 transition-colors">Hardware & Silicon</a></li>
          </ul>
        </div>

        <!-- Col 3: Platform -->
        <div class="space-y-2.5">
          <h5 class="text-white font-bold text-xs uppercase tracking-wider">Resources</h5>
          <ul class="space-y-1.5 text-[11px]">
            <li><a href="https://api.zerodaily.in/docs" target="_blank" class="hover:text-cyan-400 transition-colors">Public REST API (/docs)</a></li>
            <li><a href="https://github.com/err0rgod/zerodaily" target="_blank" class="hover:text-cyan-400 transition-colors">GitHub Repository</a></li>
            <li><a href="https://github.com/err0rgod/zerodaily/releases" target="_blank" class="hover:text-cyan-400 transition-colors">Mobile Releases (APK)</a></li>
            <li><a href="/privacy.html" class="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>&copy; ${new Date().getFullYear()} ZeroDaily. Satirical commentary on actual technology events.</p>
        <p class="flex items-center gap-1.5">
          <span>Engineered with zero fluff &bull; Edge cached globally via Cloudflare</span>
        </p>
      </div>
    </div>
  `;

  return footer;
}
