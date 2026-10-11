import { fetchTopBreakingNews, fetchArticleDetail, CATEGORIES, escapeHtml, safeUrl } from '../api.js';
import { CONTAINER } from './header.js';

const CHIP_ACTIVE = 'bg-ink dark:bg-paper-ink text-paper dark:text-night border-transparent';
const CHIP_IDLE = 'border-rule-dark dark:border-night-rule-dark text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink';

function categoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label || String(id || 'News').replace(/_/g, ' ');
}

/**
 * Today's Wire: the latest stories in a filterable grid. Its own page at /wire.
 */
export function renderWire() {
  const main = document.createElement('main');

  const requested = new URLSearchParams(window.location.search).get('desk');
  let activeCategory = CATEGORIES.some(c => c.id === requested) ? requested : 'all';
  let stories = [];

  main.innerHTML = `
    <div class="${CONTAINER} py-10 sm:py-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="font-serif text-4xl sm:text-5xl font-semibold text-ink dark:text-paper-ink tracking-tight">Today's Wire</h1>
          <p class="mt-2 text-ink-soft dark:text-paper-soft">The latest stories, summarized. Updated through the day.</p>
        </div>
      </div>

      <div class="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
        ${CATEGORIES.map(cat => `
          <button type="button" data-category="${cat.id}" class="shrink-0 px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer">
            ${escapeHtml(cat.label)}
          </button>
        `).join('')}
      </div>

      <div id="wire-grid" class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        ${Array.from({ length: 6 }, () => `
          <div class="rounded-2xl border border-rule dark:border-night-rule p-6 animate-pulse">
            <div class="h-3 w-24 rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-4 h-5 w-4/5 rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-4 h-3 w-full rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-2 h-3 w-full rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-2 h-3 w-2/3 rounded bg-paper-raised dark:bg-night-raised"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const grid = main.querySelector('#wire-grid');
  const chips = main.querySelectorAll('[data-category]');

  function paintChips() {
    chips.forEach(chip => {
      const active = chip.dataset.category === activeCategory;
      chip.className = `shrink-0 px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${active ? CHIP_ACTIVE : CHIP_IDLE}`;
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function paintGrid() {
    const visible = activeCategory === 'all' ? stories : stories.filter(s => s.category === activeCategory);

    if (visible.length === 0) {
      grid.innerHTML = `
        <p class="col-span-full py-16 text-center text-ink-faint dark:text-paper-faint">
          Nothing from this desk right now. The app has the full feed.
        </p>`;
      return;
    }

    grid.innerHTML = visible.map(story => `
      <article class="flex flex-col rounded-2xl border border-rule dark:border-night-rule bg-paper dark:bg-night-card p-6">
        <p class="text-xs text-ink-faint dark:text-paper-faint">
          <span class="font-medium text-brand dark:text-brand-dark">${escapeHtml(categoryLabel(story.category))}</span>
          <span aria-hidden="true"> &middot; </span>${escapeHtml(story.publishedAgo || 'Recently')}
        </p>
        <h2 class="mt-3 font-serif text-xl font-semibold text-ink dark:text-paper-ink leading-snug text-balance">
          ${escapeHtml(story.heading)}
        </h2>
        ${story.roast && story.roast !== story.heading ? `
          <p class="mt-3 text-[15px] text-ink-soft dark:text-paper-soft leading-relaxed">${escapeHtml(story.roast)}</p>
        ` : ''}
        <a href="${escapeHtml(safeUrl(story.sourceUrl))}" target="_blank" rel="noopener" class="mt-auto pt-5 text-sm text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink transition-colors truncate">
          ${escapeHtml(story.source || 'Source')} &rarr;
        </a>
      </article>
    `).join('');
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      const url = new URL(window.location.href);
      if (activeCategory === 'all') url.searchParams.delete('desk');
      else url.searchParams.set('desk', activeCategory);
      history.replaceState(null, '', url);
      paintChips();
      paintGrid();
    });
  });

  async function load() {
    stories = await fetchTopBreakingNews();
    paintGrid();

    // Live stories only carry a punchline; swap in the full summary when it arrives.
    stories.filter(s => s.isLive).forEach(story => {
      fetchArticleDetail(story.id).then(detail => {
        const full = detail?.shortSummary || detail?.fullSummary;
        if (!full || !stories.includes(story)) return;
        story.roast = full;
        paintGrid();
      });
    });
  }

  paintChips();
  load();

  return {
    element: main,
    reload: () => load(),
  };
}
