import { fetchTopBreakingNews, fetchArticleDetail, safeUrl } from '../api.js';

/**
 * A single-story preview: one card that reads exactly like the app does.
 * Category tabs filter which story is shown; arrows cycle the wire.
 */
export function renderStoryPreview(activeCategory = 'all') {
  const section = document.createElement('section');
  section.id = 'taste';
  section.className = 'w-full bg-paper dark:bg-night border-b border-rule dark:border-night-rule';

  let stories = [];
  let activeStory = null;

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-14">

      <div class="flex items-baseline justify-between pb-3">
        <p class="font-mono text-[11px] uppercase tracking-widest text-ink-faint dark:text-paper-faint">A taste of the app</p>
        <div class="flex items-center gap-3">
          <span id="preview-position" class="font-mono text-[11px] text-ink-faint dark:text-paper-faint"></span>
          <button id="preview-next" type="button" class="font-mono text-[11px] text-ink-faint dark:text-paper-faint hover:text-brand dark:hover:text-brand-dark transition-colors">next &rarr;</button>
        </div>
      </div>

      <!-- The card — deliberately phone-shaped, like the app -->
      <div class="mx-auto max-w-lg rounded-2xl border border-rule-dark dark:border-night-rule-dark bg-paper dark:bg-night-card shadow-sm p-7 sm:p-9">

        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-faint dark:text-paper-faint mb-5">
          <span id="preview-category" class="uppercase tracking-wide text-brand dark:text-brand-dark font-semibold"></span>
          <span aria-hidden="true">&middot;</span>
          <span id="preview-timestamp"></span>
          <span aria-hidden="true">&middot;</span>
          <span id="preview-wordcount"></span>
        </div>

        <h3 id="preview-heading" class="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper-ink tracking-tight leading-tight text-balance min-h-[4rem]">
          <span class="text-ink-faint dark:text-paper-faint">Reading the wire…</span>
        </h3>

        <p id="preview-roast" class="dropcap mt-5 font-serif text-lg text-ink dark:text-paper-ink leading-relaxed min-h-[7rem]"></p>

        <div class="mt-7 pt-5 border-t border-rule dark:border-night-rule flex items-center justify-between gap-3">
          <p class="text-sm text-ink-soft dark:text-paper-soft truncate">
            <span id="preview-source-name"></span>
          </p>
          <a id="preview-source-link" href="#" target="_blank" rel="noopener" class="shrink-0 text-sm font-medium text-brand dark:text-brand-dark hover:underline underline-offset-4">
            Original &rarr;
          </a>
        </div>

      </div>

      <p class="mt-6 text-center text-sm text-ink-faint dark:text-paper-faint">
        The app is an endless stack of these. Swipe, read, move on.
      </p>

    </div>
  `;

  function filteredStories() {
    if (!activeCategory || activeCategory === 'all') return stories;
    const f = stories.filter(s => s.category === activeCategory);
    return f.length > 0 ? f : stories;
  }

  function show(story) {
    if (!story) return;
    activeStory = story;

    const heading = section.querySelector('#preview-heading');
    const roast = section.querySelector('#preview-roast');
    const cat = section.querySelector('#preview-category');
    const timestamp = section.querySelector('#preview-timestamp');
    const wordcount = section.querySelector('#preview-wordcount');
    const sourceName = section.querySelector('#preview-source-name');
    const sourceLink = section.querySelector('#preview-source-link');
    const position = section.querySelector('#preview-position');

    if (heading) heading.textContent = story.heading;
    if (roast) roast.textContent = story.roast;
    if (cat) cat.textContent = String(story.category || 'briefing').replace(/_/g, ' ');
    if (timestamp) timestamp.textContent = story.publishedAgo || 'recently';
    if (wordcount) wordcount.textContent = `${story.wordCount || 60} words`;
    if (sourceName) sourceName.textContent = story.source || 'Original source';
    if (sourceLink) sourceLink.href = safeUrl(story.sourceUrl);

    const list = filteredStories();
    const idx = list.findIndex(s => String(s.id) === String(story.id));
    if (position && idx >= 0) position.textContent = `${idx + 1} / ${list.length}`;

    // Live stories carry a full roast behind the API.
    if (story.id && String(story.id).startsWith('http')) {
      fetchArticleDetail(story.id).then(detail => {
        if (!detail || !activeStory || activeStory.id !== story.id) return;
        const fullText = detail.shortSummary || detail.fullSummary;
        if (fullText) {
          if (roast) roast.textContent = fullText;
          const wc = fullText.split(/\s+/).filter(Boolean).length;
          if (wordcount) wordcount.textContent = `${wc} words`;
        }
      });
    }
  }

  async function load() {
    stories = await fetchTopBreakingNews();
    const list = filteredStories();
    show(list[0]);
  }

  const nextBtn = section.querySelector('#preview-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const list = filteredStories();
      if (list.length === 0) return;
      const idx = list.findIndex(s => activeStory && String(s.id) === String(activeStory.id));
      show(list[(idx + 1) % list.length]);
    });
  }

  load();

  return {
    element: section,
    setCategory: (newCategory) => {
      activeCategory = newCategory;
      const list = filteredStories();
      show(list[0]);
    },
    reload: () => load(),
  };
}
