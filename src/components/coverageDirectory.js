export function renderCoverageDirectory(onSelectCategory) {
  const section = document.createElement('section');
  section.id = 'desks';
  section.className = 'w-full bg-paper dark:bg-night border-b border-rule dark:border-night-rule';

  const desks = [
    {
      id: 'cybersec',
      name: 'Cybersecurity',
      covers: 'Zero-days, ransomware crews, supply-chain tampering, and the patches that arrive six months late.',
    },
    {
      id: 'ai',
      name: 'AI & Models',
      covers: 'Frontier model launches, benchmark theatre, compute bills, and agents that almost work.',
    },
    {
      id: 'programming',
      name: 'Software',
      covers: 'Outages, deprecations, framework churn, and the monorepo rewrites nobody asked for.',
    },
    {
      id: 'robotics',
      name: 'Robotics',
      covers: 'Humanoids, warehouse automation, and the gap between demo videos and your kitchen floor.',
    },
    {
      id: 'defense_aerospace',
      name: 'Defense & Aerospace',
      covers: 'Satellite swarms, hypersonics, launch cadence, and orbital debris with a business model.',
    },
    {
      id: 'hardware',
      name: 'Silicon',
      covers: 'Fabs, yields, sub-3nm physics, and why your GPU costs more than your car.',
    },
    {
      id: 'finance',
      name: 'Finance',
      covers: 'HFT glitches, DeFi implosions, neobank bugs, and the plumbing under the market.',
    },
  ];

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-14">

      <div class="pb-6 border-b border-rule dark:border-night-rule">
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper-ink">The desks</h2>
        <p class="mt-2 font-serif italic text-base text-ink-soft dark:text-paper-soft">
          Seven beats, read end to end every day. Press releases are filed directly in the bin.
        </p>
      </div>

      <ol class="divide-y divide-rule dark:divide-night-rule">
        ${desks.map((d, i) => `
          <li class="py-5 flex items-baseline gap-5">
            <span class="font-mono text-[11px] text-ink-faint dark:text-paper-faint tabular-nums shrink-0">${String(i + 1).padStart(2, '0')}</span>
            <div class="min-w-0">
              <button
                type="button"
                data-select-domain="${d.id}"
                class="font-serif text-xl font-semibold text-ink dark:text-paper-ink hover:text-brand dark:hover:text-brand-dark transition-colors"
              >${d.name}</button>
              <p class="mt-1 text-sm text-ink-soft dark:text-paper-soft leading-relaxed">${d.covers}</p>
            </div>
          </li>
        `).join('')}
      </ol>

    </div>
  `;

  section.querySelectorAll('[data-select-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      const domId = btn.getAttribute('data-select-domain');
      if (typeof onSelectCategory === 'function') onSelectCategory(domId);
    });
  });

  return section;
}
