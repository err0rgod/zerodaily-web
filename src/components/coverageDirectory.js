export function renderCoverageDirectory(onSelectCategory) {
  const section = document.createElement('section');
  section.id = 'desks';
  section.className = 'w-full bg-paper dark:bg-night border-b border-rule dark:border-night-rule';

  const desks = [
    { id: 'cybersec', name: 'Cybersecurity' },
    { id: 'ai', name: 'AI & Models' },
    { id: 'programming', name: 'Software' },
    { id: 'robotics', name: 'Robotics' },
    { id: 'defense_aerospace', name: 'Defense & Aerospace' },
    { id: 'hardware', name: 'Silicon' },
    { id: 'finance', name: 'Finance' },
  ];

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-12 text-center">

      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-faint dark:text-paper-faint">Seven desks, read daily</p>

      <p class="mt-4 font-serif text-xl sm:text-2xl text-ink dark:text-paper-ink leading-relaxed">
        ${desks.map((d, i) => `<button type="button" data-select-domain="${d.id}" class="hover:text-brand dark:hover:text-brand-dark transition-colors font-medium">${d.name}</button>${i < desks.length - 1 ? '<span class="text-ink-faint dark:text-paper-faint mx-1.5">&middot;</span>' : ''}`).join('')}
      </p>

      <p class="mt-4 text-sm text-ink-faint dark:text-paper-faint">
        Tap one to preview a story from that desk.
      </p>

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
