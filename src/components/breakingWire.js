import { fetchTopBreakingNews } from '../api.js';

export function renderBreakingWire(onSelectStory, activeCategory = 'all') {
  const section = document.createElement('section');
  section.className = 'w-full bg-paper dark:bg-night border-b border-rule dark:border-night-rule';

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-8">

      <div class="flex items-baseline justify-between pb-3 border-b border-rule dark:border-night-rule">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-dark beacon"></span>
          <h2 class="font-serif text-lg font-semibold text-ink dark:text-paper-ink">The Wire</h2>
          <span class="font-mono text-[11px] text-ink-faint dark:text-paper-faint">latest ten</span>
        </div>
        <button
          id="refresh-wire-btn"
          type="button"
          class="font-mono text-[11px] text-ink-faint dark:text-paper-faint hover:text-brand dark:hover:text-brand-dark transition-colors"
        >
          <span id="refresh-btn-label">refresh</span>
        </button>
      </div>

      <ol id="breaking-items-container" class="divide-y divide-rule dark:divide-night-rule"></ol>

    </div>
  `;

  let lastItems = [];

  function renderList(items) {
    const list = section.querySelector('#breaking-items-container');
    if (!list) return;

    const filtered = (activeCategory && activeCategory !== 'all')
      ? items.filter(i => i.category === activeCategory)
      : items;

    list.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'py-8 text-center text-sm text-ink-faint dark:text-paper-faint font-serif italic';
      empty.textContent = 'Nothing on the wire for this desk right now.';
      list.appendChild(empty);
      return;
    }

    filtered.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'rise';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left py-4 group flex items-baseline gap-4';

      const num = document.createElement('span');
      num.className = 'font-mono text-[11px] text-ink-faint dark:text-paper-faint shrink-0 w-6 tabular-nums';
      num.textContent = String(index + 1).padStart(2, '0');

      const body = document.createElement('span');
      body.className = 'min-w-0';

      const meta = document.createElement('span');
      meta.className = 'flex items-center gap-2 mb-1 font-mono text-[11px] text-ink-faint dark:text-paper-faint';

      const cat = document.createElement('span');
      cat.className = 'uppercase tracking-wide text-brand dark:text-brand-dark font-medium';
      cat.textContent = item.isLive ? 'breaking' : String(item.category || '').replace(/_/g, ' ');
      meta.appendChild(cat);

      if (item.isLive) {
        const dot = document.createElement('span');
        dot.className = 'w-1 h-1 rounded-full bg-brand dark:bg-brand-dark beacon';
        meta.appendChild(dot);
      }

      const ago = document.createElement('span');
      ago.textContent = item.publishedAgo || 'recently';
      meta.appendChild(ago);

      const headline = document.createElement('span');
      headline.className = 'block font-serif text-lg sm:text-xl font-medium text-ink dark:text-paper-ink leading-snug group-hover:text-brand dark:group-hover:text-brand-dark transition-colors';
      headline.textContent = item.heading;

      body.appendChild(meta);
      body.appendChild(headline);
      btn.appendChild(num);
      btn.appendChild(body);

      btn.addEventListener('click', () => {
        if (typeof onSelectStory === 'function') onSelectStory(item, true);
      });

      li.appendChild(btn);
      list.appendChild(li);
    });

    return filtered;
  }

  async function loadWireItems(triggerSelect = false) {
    const refreshLabel = section.querySelector('#refresh-btn-label');
    if (refreshLabel) refreshLabel.textContent = 'checking…';

    lastItems = await fetchTopBreakingNews();

    if (refreshLabel) refreshLabel.textContent = 'refresh';

    const filtered = renderList(lastItems);

    if (triggerSelect && filtered && filtered.length > 0 && typeof onSelectStory === 'function') {
      onSelectStory(filtered[0], false);
    }
  }

  const refreshBtn = section.querySelector('#refresh-wire-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadWireItems(false));
  }

  loadWireItems(true);

  return {
    element: section,
    reload: () => loadWireItems(false),
    setCategory: (newCategory) => {
      activeCategory = newCategory;
      renderList(lastItems);
    }
  };
}
