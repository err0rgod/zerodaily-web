import { EDITORIAL_BRIEFINGS, fetchArticleDetail, safeUrl } from '../api.js';

export function renderEditorialBriefing(activeCategory = 'all', initialStory = null) {
  const section = document.createElement('section');
  section.id = 'briefing';
  section.className = 'w-full bg-paper dark:bg-night border-b border-rule dark:border-night-rule';

  let currentCategory = activeCategory;
  let activeStories = getFilteredStories(currentCategory);
  let activeStory = initialStory || activeStories[0];

  function getFilteredStories(cat) {
    if (!cat || cat === 'all') return [...EDITORIAL_BRIEFINGS];
    const filtered = EDITORIAL_BRIEFINGS.filter(s => s.category === cat);
    return filtered.length > 0 ? filtered : [...EDITORIAL_BRIEFINGS];
  }

  section.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 py-12">

      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-faint dark:text-paper-faint pb-6">
        Today's briefing
      </p>

      <article>
        <!-- Kicker -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-faint dark:text-paper-faint mb-4">
          <span id="lead-category-badge" class="uppercase tracking-wide text-brand dark:text-brand-dark font-semibold"></span>
          <span aria-hidden="true">&middot;</span>
          <span id="lead-urgency-badge"></span>
          <span aria-hidden="true">&middot;</span>
          <span id="lead-timestamp"></span>
          <span aria-hidden="true">&middot;</span>
          <span id="lead-wordcount"></span>
        </div>

        <!-- Headline -->
        <h3 id="lead-heading" class="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper-ink tracking-tight leading-tight text-balance"></h3>

        <!-- Roast -->
        <p id="lead-roast" class="dropcap mt-6 font-serif text-lg sm:text-xl text-ink dark:text-paper-ink leading-relaxed"></p>

        <!-- Byline & actions -->
        <div class="mt-8 pt-5 border-t border-rule dark:border-night-rule flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-ink-soft dark:text-paper-soft">
            Source:
            <a id="lead-source-link" href="#" target="_blank" rel="noopener" class="font-medium text-ink dark:text-paper-ink underline decoration-rule-dark dark:decoration-night-rule-dark underline-offset-4 hover:text-brand dark:hover:text-brand-dark transition-colors">
              <span id="lead-source-name"></span>
            </a>
          </p>

          <div class="flex items-center gap-4 text-sm">
            <button
              id="copy-roast-btn"
              type="button"
              class="text-ink-faint dark:text-paper-faint hover:text-brand dark:hover:text-brand-dark transition-colors"
            >
              <span id="copy-btn-label">Copy</span>
            </button>
            <button
              id="next-dispatch-btn"
              type="button"
              class="font-medium text-brand dark:text-brand-dark hover:underline underline-offset-4"
            >
              Next story &rarr;
            </button>
          </div>
        </div>
      </article>

      <!-- More from the desk -->
      <div class="mt-14">
        <div class="flex items-baseline justify-between pb-3 border-b border-rule dark:border-night-rule">
          <h4 class="font-serif text-lg font-semibold text-ink dark:text-paper-ink">More from the desk</h4>
          <span id="wire-count" class="font-mono text-[11px] text-ink-faint dark:text-paper-faint"></span>
        </div>
        <ol id="briefing-wire-list" class="divide-y divide-rule dark:divide-night-rule"></ol>
      </div>

    </div>
  `;

  function updateLeadCard(story) {
    if (!story) return;
    activeStory = story;

    const heading = section.querySelector('#lead-heading');
    const roast = section.querySelector('#lead-roast');
    const catBadge = section.querySelector('#lead-category-badge');
    const urgencyBadge = section.querySelector('#lead-urgency-badge');
    const wordcount = section.querySelector('#lead-wordcount');
    const timestamp = section.querySelector('#lead-timestamp');
    const sourceName = section.querySelector('#lead-source-name');
    const sourceLink = section.querySelector('#lead-source-link');

    if (heading) heading.textContent = story.heading;
    if (roast) roast.textContent = story.roast;
    if (catBadge) catBadge.textContent = String(story.category || 'briefing').replace(/_/g, ' ');
    if (urgencyBadge) urgencyBadge.textContent = story.badge || 'dispatch';
    if (wordcount) wordcount.textContent = `${story.wordCount || 60} words`;
    if (timestamp) timestamp.textContent = story.publishedAgo || 'recently';
    if (sourceName) sourceName.textContent = story.source || 'Original source';
    if (sourceLink) sourceLink.href = safeUrl(story.sourceUrl);

    // Live stories carry a full article behind the API — fetch the complete roast.
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

    // Mark the active story in the list
    section.querySelectorAll('.wire-list-item').forEach(el => {
      const isActive = el.getAttribute('data-story-id') === String(story.id);
      el.querySelector('h5')?.classList.toggle('text-brand', isActive);
      el.querySelector('h5')?.classList.toggle('dark:text-brand-dark', isActive);
    });
  }

  function renderWireList() {
    const list = section.querySelector('#briefing-wire-list');
    const countEl = section.querySelector('#wire-count');
    if (!list) return;

    if (countEl) countEl.textContent = `${activeStories.length} stories`;

    list.innerHTML = '';

    activeStories.forEach(s => {
      const li = document.createElement('li');
      li.setAttribute('data-story-id', String(s.id));
      li.className = 'wire-list-item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left py-3.5 group flex items-baseline gap-3';

      const meta = document.createElement('span');
      meta.className = 'font-mono text-[11px] uppercase tracking-wide text-ink-faint dark:text-paper-faint shrink-0 w-20 truncate';
      meta.textContent = String(s.category || '').replace(/_/g, ' ');

      const title = document.createElement('h5');
      title.className = 'font-serif text-base font-medium text-ink dark:text-paper-ink leading-snug group-hover:text-brand dark:group-hover:text-brand-dark transition-colors';
      title.textContent = s.heading;

      btn.appendChild(meta);
      btn.appendChild(title);
      btn.addEventListener('click', () => {
        updateLeadCard(s);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  const nextBtn = section.querySelector('#next-dispatch-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!activeStory || activeStories.length === 0) return;
      const currIdx = activeStories.findIndex(s => String(s.id) === String(activeStory.id));
      const nextIdx = (currIdx + 1) % activeStories.length;
      updateLeadCard(activeStories[nextIdx]);
    });
  }

  const copyBtn = section.querySelector('#copy-roast-btn');
  const copyLabel = section.querySelector('#copy-btn-label');
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', () => {
      if (!activeStory) return;
      const textToCopy = `"${activeStory.heading}"\n\n${activeStory.roast}\n\n— ZeroDaily (${activeStory.sourceUrl})`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyLabel.textContent = 'Copied';
        setTimeout(() => { copyLabel.textContent = 'Copy'; }, 1600);
      }).catch(() => {
        copyLabel.textContent = 'Failed';
        setTimeout(() => { copyLabel.textContent = 'Copy'; }, 1600);
      });
    });
  }

  renderWireList();
  updateLeadCard(activeStory);

  return {
    element: section,
    setStory: (story, shouldScroll = true) => {
      updateLeadCard(story);
      if (shouldScroll) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    setCategory: (newCategory) => {
      currentCategory = newCategory;
      activeStories = getFilteredStories(newCategory);
      activeStory = activeStories[0];
      renderWireList();
      updateLeadCard(activeStory);
    }
  };
}
