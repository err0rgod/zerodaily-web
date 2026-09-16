import './styles.css';
import { fetchFeed, fetchRecentAlerts, fetchArticle } from './api.js';
import { renderHeader } from './components/header.js';
import { renderHero } from './components/hero.js';
import { renderFeedContainer, createStoryCard } from './components/feed.js';
import { renderArticleModal } from './components/articleModal.js';
import { renderFooter } from './components/footer.js';

// Application State
const state = {
  activeCategory: 'all',
  searchQuery: '',
  articles: [],
  nextCursor: null,
  hasMore: false,
  isLoading: false,
};

async function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  // 1. Parse URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  const initialArticleId = urlParams.get('id');

  state.activeCategory = initialCategory;

  // 2. Instantiate Modal
  const modal = renderArticleModal();
  document.body.appendChild(modal.element);

  // 3. Render Header
  const header = renderHeader(
    state.activeCategory,
    (newCategory) => switchCategory(newCategory),
    (query) => handleSearch(query)
  );

  // 4. Render Hero
  const hero = renderHero();

  // 5. Render Feed Container
  const feedContainer = renderFeedContainer();

  // 6. Render Footer
  const footer = renderFooter();

  // Mount components
  appRoot.appendChild(header);
  appRoot.appendChild(hero);
  appRoot.appendChild(feedContainer);
  appRoot.appendChild(footer);

  // Bind Load More Button
  const loadMoreBtn = feedContainer.querySelector('#load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadMoreArticles(modal));
  }

  // 7. Check for deep-linked article ID
  if (initialArticleId) {
    fetchArticle(initialArticleId).then(article => {
      if (article) modal.open(article);
    });
  }

  // 8. Fetch Breaking News Alert Ticker
  loadBreakingAlerts();

  // 9. Initial Feed Load
  loadArticles(modal);

  // Listen to popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || 'all';
    if (cat !== state.activeCategory) {
      state.activeCategory = cat;
      updateHeaderPills(cat);
      loadArticles(modal);
    }
  });
}

function updateHeaderPills(activeCat) {
  document.querySelectorAll('.category-pill').forEach(pill => {
    const cat = pill.getAttribute('data-category');
    if (cat === activeCat) {
      pill.className = 'category-pill whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]';
    } else {
      pill.className = 'category-pill whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#121927] border-transparent';
    }
  });
}

function switchCategory(newCategory) {
  if (state.activeCategory === newCategory) return;
  state.activeCategory = newCategory;

  // Update browser URL without reload
  const url = new URL(window.location);
  if (newCategory === 'all') {
    url.searchParams.delete('category');
  } else {
    url.searchParams.set('category', newCategory);
  }
  window.history.pushState({}, '', url);

  updateHeaderPills(newCategory);
  const modal = { open: (art) => document.querySelector('#article-modal')?.open?.(art) };
  loadArticles(modal);
}

function handleSearch(query) {
  state.searchQuery = (query || '').trim().toLowerCase();
  renderArticlesList();
}

async function loadBreakingAlerts() {
  const alerts = await fetchRecentAlerts(3);
  const tickerContainer = document.getElementById('breaking-ticker-container');
  const tickerText = document.getElementById('breaking-ticker-text');

  if (alerts && alerts.length > 0 && tickerContainer && tickerText) {
    const latest = alerts[0];
    tickerText.textContent = latest.push_punchline || latest.heading;
    tickerContainer.classList.remove('hidden');
  }
}

async function loadArticles(modal) {
  state.isLoading = true;
  state.articles = [];
  state.nextCursor = null;

  const skeleton = document.getElementById('feed-skeleton');
  const emptyState = document.getElementById('feed-empty');
  const grid = document.getElementById('stories-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (skeleton) skeleton.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');
  if (grid) grid.innerHTML = '';
  if (loadMoreBtn) loadMoreBtn.classList.add('hidden');

  const res = await fetchFeed(state.activeCategory, null, 18);
  state.isLoading = false;
  if (skeleton) skeleton.classList.add('hidden');

  if (res.success && res.articles.length > 0) {
    state.articles = res.articles;
    state.hasMore = res.hasMore;
    state.nextCursor = res.nextCursor;
    renderArticlesList();
  } else {
    if (emptyState) emptyState.classList.remove('hidden');
  }
}

async function loadMoreArticles(modal) {
  if (state.isLoading || !state.hasMore || !state.nextCursor) return;
  state.isLoading = true;

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading Stories...';
  }

  const res = await fetchFeed(state.activeCategory, state.nextCursor, 18);
  state.isLoading = false;

  if (loadMoreBtn) {
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerHTML = 'Load More Stories &darr;';
  }

  if (res.success && res.articles.length > 0) {
    state.articles = [...state.articles, ...res.articles];
    state.hasMore = res.hasMore;
    state.nextCursor = res.nextCursor;
    renderArticlesList();
  } else {
    state.hasMore = false;
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
  }
}

function renderArticlesList() {
  const grid = document.getElementById('stories-grid');
  const emptyState = document.getElementById('feed-empty');
  const countBadge = document.getElementById('article-count-badge');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (!grid) return;

  // Apply search filter if query is set
  let displayed = state.articles;
  if (state.searchQuery) {
    displayed = displayed.filter(a =>
      (a.heading && a.heading.toLowerCase().includes(state.searchQuery)) ||
      (a.shortSummary && a.shortSummary.toLowerCase().includes(state.searchQuery)) ||
      (a.fullSummary && a.fullSummary.toLowerCase().includes(state.searchQuery))
    );
  }

  grid.innerHTML = '';

  if (countBadge) {
    countBadge.textContent = `${displayed.length} Stories`;
  }

  if (displayed.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // Modal open helper
  const onOpenModal = (article) => {
    const modalComp = renderArticleModal(); // Will find existing modal in DOM
    const existingModal = document.getElementById('article-modal');
    if (existingModal) {
      // Open using modal logic
      const catMeta = { name: article.category, color: '#06B6D4' };
      existingModal.querySelector('#modal-image').src = article.image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
      existingModal.querySelector('#modal-heading').textContent = article.heading || 'ZeroDaily News';
      existingModal.querySelector('#modal-short-roast').textContent = article.shortSummary || '';
      existingModal.querySelector('#modal-full-summary').textContent = article.fullSummary || article.shortSummary || '';
      existingModal.querySelector('#modal-source-link').href = article.link || '#';

      existingModal.classList.remove('hidden');
      existingModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  };

  displayed.forEach(article => {
    const card = createStoryCard(article, onOpenModal);
    grid.appendChild(card);
  });

  if (loadMoreBtn) {
    if (state.hasMore && !state.searchQuery) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }
  }
}

// Start application
initApp();
