export function renderHowItWorks() {
  const section = document.createElement('section');
  section.id = 'pipeline';
  section.className = 'py-16 md:py-24 border-t border-[#1e2638] bg-[#090a0f]';

  const steps = [
    {
      num: '01',
      title: 'Raw Telemetry Ingestion',
      desc: 'Automated scrapers poll primary sources continuously: CVE registries, arXiv papers, kernel mailing lists, and security advisories—ignoring company press releases entirely.'
    },
    {
      num: '02',
      title: 'Cynical LLM Synthesis',
      desc: 'DeepSeek reasoning models extract verified technical facts and roast the corporate spin into a punchy, 60-word summary with zero ad filler or fluff.'
    },
    {
      num: '03',
      title: 'Edge Caching & Push',
      desc: 'Stories are distributed globally across 300+ Cloudflare edge locations and delivered instantly to the ZeroDaily mobile app with sub-20ms latency.'
    }
  ];

  section.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ 03 / Pipeline ]</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">Engineered for zero bullshit.</h2>
        <p class="text-slate-400 text-sm">
          From raw vulnerability disclosure to roasted breakdown on your phone in under 90 seconds.
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${steps.map(s => `
          <div class="p-6 rounded-xl bg-[#0e121a] border border-[#1e2638] relative flex flex-col justify-between hover-card">
            <div>
              <div class="font-mono text-xs font-bold text-emerald-400 mb-4 flex items-center justify-between">
                <span>STEP ${s.num}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/40"></span>
              </div>
              <h3 class="text-base font-semibold text-white mb-2">
                ${s.title}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                ${s.desc}
              </p>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  return section;
}
