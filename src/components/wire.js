import { fetchTopBreakingNews, fetchArticleDetail, CATEGORIES, escapeHtml, safeUrl } from '../api.js';
import { CONTAINER } from './header.js';

const CHIP_ACTIVE = 'text-ink dark:text-paper-ink underline underline-offset-4';
const CHIP_IDLE = 'text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink';

function categoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label || String(id || 'News').replace(/_/g, ' ');
}

/**
 * Today's Wire: the latest stories in a filterable list. Its own page at /wire.
 */
export function renderWire() {
  const main = document.createElement('main');

  const requested = new URLSearchParams(window.location.search).get('desk');
  let activeCategory = CATEGORIES.some(c => c.id === requested) ? requested : 'all';
  let stories = [];

  main.innerHTML = `
    <div class="${CONTAINER} py-10 sm:py-14">
      <h1 class="font-serif text-[2rem] sm:text-4xl font-normal text-ink dark:text-paper-ink leading-tight">Today's Wire</h1>
      <p class="mt-3 text-ink-soft dark:text-paper-soft">The latest stories, summarized. Updated through the day.</p>

      <div class="mt-6 flex flex-wrap gap-x-1 gap-y-2 text-sm">
        ${CATEGORIES.map((cat, i) => `
          ${i ? '<span class="text-ink-faint dark:text-paper-faint" aria-hidden="true">·</span>' : ''}
          <button type="button" data-category="${cat.id}" class="cursor-pointer"></button>
        `).join('')}
      </div>

      <div id="wire-grid" class="mt-8">
        <p class="text-ink-faint dark:text-paper-faint">Loading stories…</p>
      </div>
    </div>
  `;

  const grid = main.querySelector('#wire-grid');
  const chips = main.querySelectorAll('[data-category]');

  function paintChips() {
    chips.forEach(chip => {
      const active = chip.dataset.category === activeCategory;
      const label = CATEGORIES.find(c => c.id === chip.dataset.category)?.label || chip.dataset.category;
      chip.textContent = label;
      chip.className = `cursor-pointer ${active ? CHIP_ACTIVE : CHIP_IDLE}`;
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function paintGrid() {
    const visible = activeCategory === 'all' ? stories : stories.filter(s => s.category === activeCategory);

    if (visible.length === 0) {
      grid.innerHTML = `
        <p class="py-10 text-ink-faint dark:text-paper-faint">
          Nothing from this desk right now. The app has the full feed.
        </p>`;
      return;
    }

    grid.innerHTML = visible.map(story => `
      <article class="py-5 border-b border-rule dark:border-night-rule">
        <p class="text-sm text-ink-faint dark:text-paper-faint">
          <span class="text-brand dark:text-brand-dark">${escapeHtml(categoryLabel(story.category))}</span>
          <span aria-hidden="true"> · </span>${escapeHtml(story.publishedAgo || 'Recently')}
        </p>
        <h2 class="mt-1 text-lg font-medium text-ink dark:text-paper-ink leading-snug">
          ${escapeHtml(story.heading)}
        </h2>
        ${story.roast && story.roast !== story.heading ? `
          <p class="mt-2 text-ink-soft dark:text-paper-soft leading-relaxed">${escapeHtml(story.roast)}</p>
        ` : ''}
        <p class="mt-2 text-sm">
          <a href="${escapeHtml(safeUrl(story.sourceUrl))}" target="_blank" rel="noopener" class="underline underline-offset-2 text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink">
            ${escapeHtml(story.source || 'Source')}
          </a>
        </p>
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
