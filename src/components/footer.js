import { REPO_URL } from '../api.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'bg-paper dark:bg-night py-10';

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2.5">
        <img src="/favicon.svg" alt="" class="w-5 h-5 rounded" />
        <span class="font-serif font-bold text-ink dark:text-paper-ink">ZeroDaily</span>
        <span class="font-mono text-[11px] text-ink-faint dark:text-paper-faint">&copy; ${year} &middot; MIT</span>
      </div>
      <nav class="flex items-center gap-5 text-sm text-ink-soft dark:text-paper-soft">
        <a href="#app" class="hover:text-brand dark:hover:text-brand-dark transition-colors">Get the app</a>
        <a href="${REPO_URL}" target="_blank" rel="noopener" class="hover:text-brand dark:hover:text-brand-dark transition-colors">GitHub</a>
      </nav>
    </div>
  `;

  return footer;
}
