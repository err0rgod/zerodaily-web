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
 * Renders a compact preview when visiting a shared story URL.
 * Attempts redirect to the native app if installed,
 * and copies `zerodaily:<id>` to clipboard for deferred deep linking.
 */
export async function handleSharedStoryView() {
  const articleId = getSharedArticleIdFromUrl();
  if (!articleId) return;

  const encodedId = encodeURIComponent(articleId);
  const isAndroid = /Android/i.test(navigator.userAgent);

  const currentUrl = encodeURIComponent(window.location.href);
  // Standard Android Intent URI with web fallback if app is not installed
  const androidIntentUrl = `intent://a/${encodedId}#Intent;scheme=zerodaily;package=in.zerodaily.app;S.browser_fallback_url=${currentUrl};end;`;
  const customSchemeUrl = `zerodaily://a/${encodedId}`;
  const appLaunchUrl = isAndroid ? androidIntentUrl : customSchemeUrl;

  // Deferred deep-link handshake: write token to clipboard so app detects story on first boot
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`zerodaily:${articleId}`).catch(() => {});
    }
  } catch {}

  const article = await fetchArticleDetail(articleId);

  const heading = article?.heading || 'ZeroDaily Shared Dispatch';
  const summary = article?.shortSummary || article?.fullSummary || article?.push_punchline || 'Read this story on ZeroDaily.';
  const category = String(article?.category || 'News').replace(/_/g, ' ');
  const imageUrl = article?.image_url || '';

  const modal = document.createElement('div');
  modal.id = 'shared-story-modal';
  modal.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40';

  modal.innerHTML = `
    <div class="relative w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden bg-paper dark:bg-night border border-rule dark:border-night-rule">
      ${imageUrl ? `
        <img src="${escapeHtml(imageUrl)}" alt="" class="w-full max-h-40 object-cover shrink-0" onerror="this.remove()" />
      ` : ''}

      <div class="p-5 flex flex-col overflow-y-auto">
        <p class="text-sm capitalize text-brand dark:text-brand-dark">${escapeHtml(category)}</p>
        <h2 class="mt-1 text-xl font-medium text-ink dark:text-paper-ink leading-snug">
          ${escapeHtml(heading)}
        </h2>
        <p class="mt-3 text-ink-soft dark:text-paper-soft leading-relaxed">
          ${escapeHtml(summary)}
        </p>
        <p class="mt-5 text-sm">
          <a href="${escapeHtml(appLaunchUrl)}" class="underline underline-offset-2 text-ink dark:text-paper-ink">Open in the app</a>
          <span class="text-ink-faint dark:text-paper-faint" aria-hidden="true"> · </span>
          <a href="${escapeHtml(DIRECT_APK_URL)}" class="underline underline-offset-2 text-ink dark:text-paper-ink">Get the app</a>
        </p>
        <button id="dismiss-shared-modal" type="button" class="mt-4 text-sm text-left text-ink-faint dark:text-paper-faint underline underline-offset-2 cursor-pointer hover:text-ink dark:hover:text-paper-ink">
          Stay on this page
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#dismiss-shared-modal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
