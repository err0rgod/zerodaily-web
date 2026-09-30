export function renderCoverageDirectory(onSelectCategory) {
  const section = document.createElement('section');
  section.id = 'domains';
  section.className = 'w-full bg-[#0b0d13] py-16 border-b border-[#1d2330]';

  const domains = [
    {
      id: 'cybersec',
      code: 'CYBERSEC',
      title: 'Cybersecurity & CVEs',
      signal: 'Critical Vulnerabilities & 0-Days',
      desc: 'Active zero-days, supply-chain backdoor tampering, firmware bugs, and kernel panics stripped of vendor PR spin.',
      telemetry: 'NVD, Exploit-DB, CERT, Kernel Mailing Lists'
    },
    {
      id: 'ai',
      code: 'AI_LLM',
      title: 'Artificial Intelligence',
      signal: 'Frontier Models & Reality Checks',
      desc: 'Foundation model releases, benchmark cherry-picking, compute burn rates, and autonomous agent failure states.',
      telemetry: 'arXiv, Model Weights, Evaluation Suites, SEC Filings'
    },
    {
      id: 'programming',
      code: 'SYSTEMS',
      title: 'Software Engineering',
      signal: 'Distributed Systems & Outages',
      desc: 'Distributed systems collapses, dependency deprecations, unnecessary monorepo rewrites, and framework churn.',
      telemetry: 'GitHub Diff Logs, Status Pages, Post-Mortems'
    },
    {
      id: 'robotics',
      code: 'ROBOTICS',
      title: 'Robotics & Automation',
      signal: 'Kinematics & Industrial Failure',
      desc: 'Bipedal humanoids, warehouse automation, actuator breakdowns, and physical reality versus promotional CGI videos.',
      telemetry: 'IEEE Papers, Robotics Lab Disclosures, Logistics Telemetry'
    },
    {
      id: 'defense_aerospace',
      code: 'DEFENSE',
      title: 'Defense & Aerospace',
      signal: 'Orbital Telemetry & Aerospace Systems',
      desc: 'Satellite megaconstellations, hypersonic telemetry, electronic warfare, and aerospace engineering milestones.',
      telemetry: 'Space Command Telemetry, Aviation Bulletins, Defense Feeds'
    },
    {
      id: 'hardware',
      code: 'SILICON',
      title: 'Silicon & Lithography',
      signal: 'Wafer Fabs & Physical Limits',
      desc: 'Wafer fabrication bottlenecks, sub-3nm quantum tunneling limits, EUV lithography, and GPU supply chain warfare.',
      telemetry: 'Fab Yield Reports, Foundry Disclosures, Semiconductor Patents'
    },
    {
      id: 'finance',
      code: 'FINANCE',
      title: 'Finance & Fintech',
      signal: 'Algorithmic Glitches & Market Plumbing',
      desc: 'High-frequency trading latency arbitrage, DeFi smart-contract collapses, algorithmic flash crashes, and neobank bugs.',
      telemetry: 'Order Book Telemetry, Smart Contract Audits, SEC Filings'
    }
  ];

  section.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#1d2330]">
        <div>
          <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ Coverage Directory ]</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mt-1">The Seven Intelligence Domains</h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
          Curated directly from raw technical telemetry. We deliberately ignore press releases, sponsored puff pieces, and marketing fluff.
        </p>
      </div>

      <!-- Directory Table / List -->
      <div class="divide-y divide-[#1d2330] border-y border-[#1d2330]">
        ${domains.map(d => `
          <div class="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#0e1117] px-3 -mx-3 rounded transition-colors">
            
            <div class="md:w-1/3">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-[10px] text-emerald-400 font-bold tracking-wider uppercase">${d.code}</span>
                <span class="text-slate-600 text-xs">&bull;</span>
                <span class="text-slate-400 text-xs font-mono">${d.signal}</span>
              </div>
              <h3 class="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                ${d.title}
              </h3>
            </div>

            <div class="md:w-1/2">
              <p class="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                ${d.desc}
              </p>
              <div class="mt-1 text-[11px] font-mono text-slate-500">
                Sources: ${d.telemetry}
              </div>
            </div>

            <div class="md:w-auto md:text-right shrink-0">
              <button
                type="button"
                data-select-domain="${d.id}"
                class="px-3 py-1.5 rounded bg-[#131720] hover:bg-[#181e2b] border border-[#1d2330] hover:border-slate-500 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>Filter ${d.title.split('&')[0].trim()}</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;

  // Bind domain filter buttons
  section.querySelectorAll('[data-select-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      const domId = btn.getAttribute('data-select-domain');
      if (typeof onSelectCategory === 'function') {
        onSelectCategory(domId);
      }
    });
  });

  return section;
}
