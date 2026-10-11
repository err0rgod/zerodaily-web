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
  const summary = article?.shortSummary || article?.fullSummary || article?.push_punchline || 'Read this story on ZeroDaily.';
  const category = String(article?.category || 'News').replace(/_/g, ' ');
  const imageUrl = article?.image_url || '';

  // 4. Render compact, non-intrusive preview modal
  const modal = document.createElement('div');
  modal.id = 'shared-story-modal';
  modal.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm';

  modal.innerHTML = `
    <div class="relative w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-paper dark:bg-night-card shadow-2xl">
      ${imageUrl ? `
        <div class="w-full h-36 bg-paper-raised dark:bg-night-raised overflow-hidden shrink-0">
          <img src="${escapeHtml(imageUrl)}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.style.display='none'" />
        </div>
      ` : ''}

      <div class="p-5 sm:p-6 flex flex-col overflow-y-auto">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium capitalize text-brand dark:text-brand-dark">${escapeHtml(category)}</span>
          <button id="close-shared-modal" type="button" class="w-8 h-8 -mr-2 grid place-items-center rounded-full text-ink-faint dark:text-paper-faint hover:bg-paper-raised dark:hover:bg-night-raised transition-colors cursor-pointer" aria-label="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <h2 class="mt-1 font-serif text-xl font-semibold text-ink dark:text-paper-ink leading-snug">
          ${escapeHtml(heading)}
        </h2>

        <p class="mt-3 text-[15px] text-ink-soft dark:text-paper-soft leading-relaxed">
          ${escapeHtml(summary)}
        </p>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <a href="${escapeHtml(appLaunchUrl)}" class="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold bg-brand dark:bg-brand-dark text-white dark:text-night hover:opacity-90 transition-opacity">
            Open in app
          </a>
          <a href="${escapeHtml(DIRECT_APK_URL)}" class="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium border border-rule-dark dark:border-night-rule-dark text-ink dark:text-paper-ink hover:bg-paper-raised dark:hover:bg-night-raised transition-colors">
            Get the app
          </a>
        </div>

        <button id="dismiss-shared-modal" type="button" class="mt-3 text-sm text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink transition-colors cursor-pointer">
          Continue on web
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
