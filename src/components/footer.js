import { REPO_URL } from '../api.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'bg-paper dark:bg-night py-12';

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="max-w-3xl mx-auto px-5">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-rule dark:border-night-rule">
        <p class="font-serif text-xl font-bold text-ink dark:text-paper-ink">ZeroDaily</p>
        <nav class="flex items-center gap-5 text-sm text-ink-soft dark:text-paper-soft">
          <a href="#desks" class="hover:text-brand dark:hover:text-brand-dark transition-colors">Desks</a>
          <a href="#app" class="hover:text-brand dark:hover:text-brand-dark transition-colors">App</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener" class="hover:text-brand dark:hover:text-brand-dark transition-colors">GitHub</a>
        </nav>
      </div>

      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-ink-faint dark:text-paper-faint">
        <p>&copy; ${year} ZeroDaily. MIT licensed.</p>
        <p class="font-serif italic normal-case text-xs">Written by humans who read the whole paper.</p>
      </div>

    </div>
  `;

  return footer;
}
