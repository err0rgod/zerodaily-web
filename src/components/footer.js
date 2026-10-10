import { REPO_URL } from '../api.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-rule dark:border-night-rule';

  const year = new Date().getFullYear();
  const link = 'hover:text-ink dark:hover:text-paper-ink transition-colors';

  footer.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 sm:px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-faint dark:text-paper-faint">
      <p>&copy; ${year} ZeroDaily</p>
      <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <a href="/privacy" class="${link}">Privacy</a>
        <a href="/terms" class="${link}">Terms</a>
        <a href="/delete-account" class="${link}">Delete account</a>
        <a href="${REPO_URL}" target="_blank" rel="noopener" class="${link}">GitHub</a>
      </nav>
    </div>
  `;

  return footer;
}
