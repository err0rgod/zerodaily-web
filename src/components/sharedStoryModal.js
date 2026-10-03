import { fetchArticleDetail, escapeHtml, DIRECT_APK_URL } from '../api.js';

/**
 * Checks URL pathname or query parameters for shared article link:
 * - /a/:id
 * - /story/:id
 * - ?id=:id
 */
export function getSharedArticleIdFromUrl() {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(?:a|story)\/([^/?#]+)/i);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id') || params.get('article_id');
  if (paramId) {
    return decodeURIComponent(paramId);
  }

  return null;
}

/**
 * Renders a rich preview modal/banner when visiting a shared story URL.
 * Automatically copies `zerodaily:<id>` to clipboard for deferred deep linking.
 */
export async function handleSharedStoryView() {
  const articleId = getSharedArticleIdFromUrl();
  if (!articleId) return;

  // 1. Deferred deep-link handshake: write to clipboard so app detects story on first launch
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`zerodaily:${articleId}`).catch(() => {});
    }
  } catch {}

  // 2. Fetch story details
  const article = await fetchArticleDetail(articleId);

  const nativeSchemeUrl = `zerodaily://a/${encodeURIComponent(articleId)}`;

  // Automatically attempt opening native app on mobile
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    // Attempt gentle iframe/location launch
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = nativeSchemeUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  }

  // 3. Render floating modal
  const heading = article?.heading || 'ZeroDaily Shared Story';
  const summary = article?.shortSummary || article?.fullSummary || article?.push_punchline || 'Read this 60-word intelligence dispatch on ZeroDaily.';
  const category = (article?.category || 'News').toUpperCase();
  const imageUrl = article?.image_url || '';

  const modal = document.createElement('div');
  modal.id = 'shared-story-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 dark:bg-black/80 backdrop-blur-sm animate-fade-in';

  modal.innerHTML = `
    <div class="relative w-full max-w-lg overflow-hidden border rounded-2xl bg-paper dark:bg-paper-dark border-rule dark:border-rule-dark shadow-2xl">
      ${imageUrl ? `
        <div class="relative w-full h-48 bg-paper-faint dark:bg-black overflow-hidden">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(heading)}" class="w-full h-full object-cover" onerror="this.style.display='none'" />
          <div class="absolute inset-0 bg-gradient-to-t from-paper dark:from-paper-dark via-transparent to-transparent"></div>
        </div>
      ` : ''}

      <div class="p-6">
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-brand/10 text-brand dark:text-brand-dark border border-brand/20">
            ${escapeHtml(category)}
          </span>
          <button id="close-shared-modal" class="p-1 rounded-full text-ink-faint hover:text-ink dark:hover:text-paper-ink text-sm">
            ✕
          </button>
        </div>

        <h2 class="text-xl font-serif font-bold text-ink dark:text-paper-ink leading-snug mb-3">
          ${escapeHtml(heading)}
        </h2>

        <p class="text-sm font-sans text-ink-muted dark:text-paper-muted leading-relaxed mb-6">
          ${escapeHtml(summary)}
        </p>

        <div class="flex flex-col sm:flex-row gap-3">
          <a href="${escapeHtml(nativeSchemeUrl)}" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-sans text-sm font-semibold bg-brand text-paper hover:bg-brand/90 transition-colors shadow-sm">
            📱 Open in App
          </a>
          <a href="${escapeHtml(DIRECT_APK_URL)}" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-sans text-sm font-semibold border border-rule dark:border-rule-dark text-ink dark:text-paper-ink hover:bg-paper-faint dark:hover:bg-paper-rule/20 transition-colors">
            ⬇️ Download APK
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#close-shared-modal')?.addEventListener('click', () => {
    modal.remove();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}
