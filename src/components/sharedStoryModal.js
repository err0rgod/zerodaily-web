import { fetchArticleDetail, escapeHtml, DIRECT_APK_URL } from '../api.js';

/**
 * Checks URL pathname or query parameters for shared article link:
 * - /a/:id
 * - /story/:id
 * - ?id=:id
 */
export function getSharedArticleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id') || params.get('article_id');
  if (paramId) {
    return decodeURIComponent(paramId);
  }

  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(?:a|story)\/(.+?)(?:[?#]|$)/i);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

/**
 * Renders a compact, aesthetic preview card when visiting a shared story URL.
 * Automatically attempts redirect to the native app if installed,
 * and copies `zerodaily:<id>` to clipboard for seamless deferred deep linking.
 */
export async function handleSharedStoryView() {
  const articleId = getSharedArticleIdFromUrl();
  if (!articleId) return;

  const encodedId = encodeURIComponent(articleId);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const currentUrl = encodeURIComponent(window.location.href);
  // Standard Android Intent URI with web fallback if app is not installed
  const androidIntentUrl = `intent://a/${encodedId}#Intent;scheme=zerodaily;package=in.zerodaily.app;S.browser_fallback_url=${currentUrl};end;`;
  const customSchemeUrl = `zerodaily://a/${encodedId}`;
  const appLaunchUrl = isAndroid ? androidIntentUrl : customSchemeUrl;

  // 1. Deferred deep-link handshake: write token to clipboard so app detects story on first boot
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`zerodaily:${articleId}`).catch(() => {});
    }
  } catch {}

  // 3. Fetch story details for clean web preview
  const article = await fetchArticleDetail(articleId);

  const heading = article?.heading || 'ZeroDaily Shared Dispatch';
  const summary = article?.shortSummary || article?.fullSummary || article?.push_punchline || 'Read this 60-word intelligence dispatch on ZeroDaily.';
  const category = (article?.category || 'News').toUpperCase();
  const imageUrl = article?.image_url || '';

  // 4. Render compact, non-intrusive preview modal
  const modal = document.createElement('div');
  modal.id = 'shared-story-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in';

  modal.innerHTML = `
    <div class="relative w-full max-w-sm sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden border rounded-2xl bg-paper dark:bg-paper-dark border-rule dark:border-rule-dark shadow-2xl transition-all">
      ${imageUrl ? `
        <div class="relative w-full h-28 sm:h-32 bg-paper-faint dark:bg-black overflow-hidden flex-shrink-0">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(heading)}" class="w-full h-full object-cover" onerror="this.parentElement.style.display='none'" />
          <div class="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-paper/60 dark:from-paper-dark/60 to-transparent pointer-events-none"></div>
          <div class="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-paper dark:from-paper-dark to-transparent pointer-events-none"></div>
        </div>
      ` : ''}

      <div class="p-4 sm:p-5 flex flex-col overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-brand/10 text-brand dark:text-brand-dark border border-brand/20">
            ${escapeHtml(category)}
          </span>
          <button id="close-shared-modal" class="p-1 rounded-full text-ink-faint hover:text-ink dark:hover:text-paper-ink text-xs transition-colors" aria-label="Close modal">
            ✕
          </button>
        </div>

        <h2 class="text-sm sm:text-base font-serif font-bold text-ink dark:text-paper-ink leading-snug mb-2 line-clamp-2">
          ${escapeHtml(heading)}
        </h2>

        <p class="text-xs sm:text-[13px] font-sans text-ink-muted dark:text-paper-muted leading-relaxed mb-3 line-clamp-3 sm:line-clamp-4">
          ${escapeHtml(summary)}
        </p>

        <div class="flex items-center gap-1.5 text-[11px] font-mono font-medium text-brand dark:text-brand-dark mb-2.5">
          <span>⚡</span>
          <span>Download ZeroDaily for fastest tech news</span>
        </div>

        <div class="flex flex-row gap-2 mt-auto">
          <a href="${escapeHtml(appLaunchUrl)}" class="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold bg-brand text-paper hover:bg-brand/90 transition-colors shadow-sm text-center">
            📱 Open in App
          </a>
          <a href="${escapeHtml(DIRECT_APK_URL)}" class="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold border border-rule dark:border-rule-dark text-ink dark:text-paper-ink hover:bg-paper-faint dark:hover:bg-paper-rule/20 transition-colors text-center">
            ⬇️ Download APK
          </a>
        </div>

        <button id="dismiss-shared-modal" class="w-full text-center text-[11px] text-ink-faint hover:text-ink dark:hover:text-paper-ink mt-2.5 py-0.5 transition-colors">
          Continue reading on web
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#close-shared-modal')?.addEventListener('click', closeModal);
  modal.querySelector('#dismiss-shared-modal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
