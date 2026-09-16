import { CATEGORIES } from '../api.js';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  try {
    const published = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - published) / 1000);

    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return '';
  }
}

function getCategoryMeta(key) {
  return CATEGORIES.find(c => c.key === key) || { name: key, color: '#06B6D4' };
}

export function renderFeedContainer() {
  const container = document.createElement('main');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10';

  container.innerHTML = `
    <!-- Feed Header / Count -->
    <div class="flex items-center justify-between pb-6 mb-6 border-b border-[#1E293B]">
      <div>
        <h2 id="feed-title" class="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Chronological Intelligence Feed</span>
        </h2>
        <p id="feed-subtitle" class="text-xs text-slate-400 font-mono mt-0.5">
          Showing latest roasted stories from verified technical feeds
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span id="article-count-badge" class="px-2.5 py-1 rounded-md bg-[#121927] border border-[#1E293B]">0 Stories</span>
      </div>
    </div>

    <!-- Feed Grid -->
    <div id="stories-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Story cards injected dynamically -->
    </div>

    <!-- Loading Skeleton -->
    <div id="feed-skeleton" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
      ${[1, 2, 3].map(() => `
        <div class="rounded-2xl bg-[#121927] border border-[#1E293B] p-4 space-y-4 animate-pulse">
          <div class="h-44 rounded-xl bg-[#172134]"></div>
          <div class="h-4 bg-[#172134] rounded w-1/3"></div>
          <div class="h-6 bg-[#172134] rounded w-4/5"></div>
          <div class="space-y-2">
            <div class="h-3 bg-[#172134] rounded w-full"></div>
            <div class="h-3 bg-[#172134] rounded w-2/3"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Empty State -->
    <div id="feed-empty" class="hidden text-center py-16 space-y-3">
      <div class="w-12 h-12 rounded-full bg-[#121927] border border-[#1E293B] flex items-center justify-center mx-auto text-slate-500">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-sm font-bold text-slate-300">No stories found</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">No articles matched the current category or filter query.</p>
    </div>

    <!-- Pagination Trigger -->
    <div class="pt-10 text-center">
      <button
        id="load-more-btn"
        class="hidden px-6 py-2.5 rounded-xl bg-[#121927] hover:bg-[#172134] border border-[#1E293B] hover:border-slate-600 text-slate-200 text-xs font-mono font-semibold transition-all shadow-sm"
      >
        Load More Stories &darr;
      </button>
    </div>
  `;

  return container;
}

export function createStoryCard(article, onOpenModal) {
  const card = document.createElement('article');
  card.className = 'story-card rounded-2xl bg-[#121927] border border-[#1E293B] overflow-hidden flex flex-col justify-between group cursor-pointer';

  const catMeta = getCategoryMeta(article.category);
  const timeText = formatRelativeTime(article.published_at);
  const isBreaking = Boolean(article.is_breaking);

  const fallbackImg = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
  const imgUrl = article.image_url || fallbackImg;

  card.innerHTML = `
    <div>
      <!-- Thumbnail Image -->
      <div class="relative h-48 w-full bg-[#0D131F] overflow-hidden">
        <img
          src="${imgUrl}"
          alt="${article.heading || 'ZeroDaily News'}"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onerror="this.src='${fallbackImg}'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-transparent"></div>

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider backdrop-blur-md"
            style="background-color: ${catMeta.color}20; color: ${catMeta.color}; border: 1px solid ${catMeta.color}40;"
          >
            ${catMeta.name}
          </span>

          ${isBreaking ? `
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse">
              BREAKING
            </span>
          ` : ''}
        </div>

        <!-- Relative Time -->
        <span class="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 bg-[#07090E]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#1E293B]">
          ${timeText}
        </span>
      </div>

      <!-- Card Body -->
      <div class="p-4 sm:p-5 space-y-2.5">
        <h3 class="text-base font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
          ${article.heading || 'Tech News Roast'}
        </h3>

        <p class="text-xs text-slate-400 leading-relaxed line-clamp-3">
          ${article.shortSummary || article.fullSummary || ''}
        </p>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-4 sm:px-5 pb-4 pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-mono">
      <button
        type="button"
        class="read-roast-btn text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 group-hover:underline"
      >
        <span>Full Roast</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="share-btn p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          title="Share Article"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>

        <a
          href="${article.link || '#'}"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          title="View Original Source"
          onclick="event.stopPropagation();"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>
  `;

  // Open modal on card click
  card.addEventListener('click', (e) => {
    // Avoid triggering if clicked directly on external source link or share button
    if (e.target.closest('.source-link') || e.target.closest('.share-btn')) {
      return;
    }
    onOpenModal(article);
  });

  // Share button
  const shareBtn = card.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const shareUrl = `${window.location.origin}/?id=${encodeURIComponent(article.id)}`;
      if (navigator.share) {
        navigator.share({
          title: article.heading,
          text: article.shortSummary,
          url: shareUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Article link copied to clipboard!');
        });
      }
    });
  }

  return card;
}
