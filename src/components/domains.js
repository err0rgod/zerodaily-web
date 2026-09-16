export function renderDomains() {
  const section = document.createElement('section');
  section.id = 'domains';
  section.className = 'py-16 md:py-24 border-t border-[#1e2638] bg-[#090a0f]';

  const domains = [
    {
      code: 'CYBERSEC',
      title: 'Cybersecurity & CVEs',
      desc: 'Active zero-days, supply chain tampering, firmware bugs, and kernel panics stripped of vendor damage control.',
      accent: 'text-rose-400',
      border: 'hover:border-rose-500/40',
      icon: `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`
    },
    {
      code: 'AI_LLM',
      title: 'Artificial Intelligence',
      desc: 'Frontier foundation models, cherry-picked benchmarks, compute burn rates, and autonomous agent reality checks.',
      accent: 'text-purple-400',
      border: 'hover:border-purple-500/40',
      icon: `<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
    },
    {
      code: 'SYSTEMS',
      title: 'Software Engineering',
      desc: 'Distributed systems collapses, dependency deprecations, unnecessary rewrites, and framework churn.',
      accent: 'text-cyan-400',
      border: 'hover:border-cyan-500/40',
      icon: `<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`
    },
    {
      code: 'ROBOTICS',
      title: 'Robotics & Automation',
      desc: 'Bipedal humanoids, warehouse logistics, actuator failures, and reality versus promotional CGI videos.',
      accent: 'text-amber-400',
      border: 'hover:border-amber-500/40',
      icon: `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    },
    {
      code: 'DEFENSE',
      title: 'Defense & Aerospace',
      desc: 'Satellite megaconstellations, hypersonic telemetry, electronic warfare, and aerospace engineering milestones.',
      accent: 'text-blue-400',
      border: 'hover:border-blue-500/40',
      icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`
    },
    {
      code: 'SILICON',
      title: 'Silicon & Hardware',
      desc: 'Wafer fabrication bottlenecks, quantum limits, EUV lithography, and GPU supply chain warfare.',
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-500/40',
      icon: `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>`
    }
  ];

  section.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ 02 / Coverage ]</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">Six critical technical domains.</h2>
        <p class="text-slate-400 text-sm">
          No lifestyle puff pieces. No generic startup gossip. Only core engineering, computing infrastructure, and physical systems.
        </p>
      </div>

      <!-- Domain Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${domains.map(d => `
          <div class="p-5 rounded-xl bg-[#0e121a] border border-[#1e2638] transition-all hover-card ${d.border} group">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2 rounded-lg bg-[#121722] border border-[#1e2638]">
                ${d.icon}
              </div>
              <span class="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                ${d.code}
              </span>
            </div>
            <h3 class="text-base font-semibold text-white group-hover:text-slate-100 mb-1.5 transition-colors">
              ${d.title}
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              ${d.desc}
            </p>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  return section;
}
