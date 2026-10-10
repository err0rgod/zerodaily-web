import { fetchTopBreakingNews, fetchArticleDetail, CATEGORIES, escapeHtml, safeUrl } from '../api.js';

const CHIP_ACTIVE = 'bg-ink dark:bg-paper-ink text-paper dark:text-night border-transparent';
const CHIP_IDLE = 'border-rule-dark dark:border-night-rule-dark text-ink-soft dark:text-paper-soft hover:text-ink dark:hover:text-paper-ink';

function categoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label || String(id || 'News').replace(/_/g, ' ');
}

/**
 * The latest stories as a simple, filterable list.
 */
export function renderStoryPreview() {
  const section = document.createElement('section');
  section.id = 'latest';
  section.className = 'w-full scroll-mt-16';

  let stories = [];
  let activeCategory = 'all';

  section.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 sm:px-5 pb-16">
      <h2 class="text-sm font-semibold text-ink dark:text-paper-ink">Latest</h2>

      <div id="feed-chips" class="mt-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
        ${CATEGORIES.map(cat => `
          <button type="button" data-category="${cat.id}" class="shrink-0 px-3 py-1.5 rounded-full border text-[13px] transition-colors cursor-pointer">
            ${escapeHtml(cat.label)}
          </button>
        `).join('')}
      </div>

      <ul id="feed-list" class="mt-4 divide-y divide-rule dark:divide-night-rule border-y border-rule dark:border-night-rule">
        ${Array.from({ length: 3 }, () => `
          <li class="py-6 animate-pulse">
            <div class="h-3 w-24 rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-3 h-5 w-4/5 rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-3 h-3 w-full rounded bg-paper-raised dark:bg-night-raised"></div>
            <div class="mt-2 h-3 w-2/3 rounded bg-paper-raised dark:bg-night-raised"></div>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  const list = section.querySelector('#feed-list');
  const chips = section.querySelectorAll('[data-category]');

  function paintChips() {
    chips.forEach(chip => {
      const active = chip.dataset.category === activeCategory;
      chip.className = `shrink-0 px-3 py-1.5 rounded-full border text-[13px] transition-colors cursor-pointer ${active ? CHIP_ACTIVE : CHIP_IDLE}`;
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function paintList() {
    const visible = activeCategory === 'all' ? stories : stories.filter(s => s.category === activeCategory);

    if (visible.length === 0) {
      list.innerHTML = `
        <li class="py-10 text-center text-sm text-ink-faint dark:text-paper-faint">
          Nothing from this desk right now. The app has the full feed.
        </li>`;
      return;
    }

    list.innerHTML = visible.map(story => `
      <li class="py-6">
        <p class="text-xs text-ink-faint dark:text-paper-faint">
          <span class="font-medium text-brand dark:text-brand-dark">${escapeHtml(categoryLabel(story.category))}</span>
          <span aria-hidden="true"> &middot; </span>${escapeHtml(story.publishedAgo || 'Recently')}
        </p>
        <h3 class="mt-2 font-serif text-xl sm:text-2xl font-semibold text-ink dark:text-paper-ink leading-snug text-balance">
          ${escapeHtml(story.heading)}
        </h3>
        ${story.roast && story.roast !== story.heading ? `
          <p class="mt-2 text-[15px] text-ink-soft dark:text-paper-soft leading-relaxed">${escapeHtml(story.roast)}</p>
        ` : ''}
        <a href="${escapeHtml(safeUrl(story.sourceUrl))}" target="_blank" rel="noopener" class="mt-3 inline-block text-sm text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink transition-colors">
          ${escapeHtml(story.source || 'Source')} &rarr;
        </a>
      </li>
    `).join('');
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      paintChips();
      paintList();
    });
  });

  async function load() {
    stories = await fetchTopBreakingNews();
    paintList();

    // Live stories only carry a punchline; swap in the full summary when it arrives.
    stories.filter(s => s.isLive).forEach(story => {
      fetchArticleDetail(story.id).then(detail => {
        const full = detail?.shortSummary || detail?.fullSummary;
        if (!full || !stories.includes(story)) return;
        story.roast = full;
        paintList();
      });
    });
  }

  paintChips();
  load();

  return {
    element: section,
    reload: () => load(),
  };
}
