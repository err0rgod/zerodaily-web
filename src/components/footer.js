import { REPO_URL } from '../api.js';
import { CONTAINER } from './header.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-rule dark:border-night-rule';

  const year = new Date().getFullYear();
  const link = 'underline underline-offset-2 hover:text-ink dark:hover:text-paper-ink';

  footer.innerHTML = `
    <div class="${CONTAINER} py-8 text-sm text-ink-faint dark:text-paper-faint leading-relaxed">
      <p>&copy; ${year} ZeroDaily</p>
      <p class="mt-2">
        <a href="/wire" class="${link}">Wire</a>
        <span aria-hidden="true"> · </span>
        <a href="/join" class="${link}">Waitlist</a>
        <span aria-hidden="true"> · </span>
        <a href="/privacy" class="${link}">Privacy</a>
        <span aria-hidden="true"> · </span>
        <a href="/terms" class="${link}">Terms</a>
        <span aria-hidden="true"> · </span>
        <a href="/delete-account" class="${link}">Delete account</a>
        <span aria-hidden="true"> · </span>
        <a href="${REPO_URL}" target="_blank" rel="noopener" class="${link}">GitHub</a>
      </p>
    </div>
  `;

  return footer;
}
