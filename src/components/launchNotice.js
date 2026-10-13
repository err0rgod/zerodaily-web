import { CONTAINER } from './header.js';

/**
 * Launch target date for Google Play Store.
 * 30 days from the campaign announcement date (October 13, 2026) -> November 12, 2026.
 */
export const PLAY_STORE_LAUNCH_TARGET_DATE = '2026-11-12';

/**
 * Calculates calendar days remaining until the target launch date.
 * Decreases by 1 each day at midnight local time.
 *
 * @param {Date} [now=new Date()]
 * @param {string} [targetDateStr=PLAY_STORE_LAUNCH_TARGET_DATE]
 * @returns {number}
 */
export function calculateDaysRemaining(now = new Date(), targetDateStr = PLAY_STORE_LAUNCH_TARGET_DATE) {
  // Support manual override in DevTools for testing: window.__ZERO_DAILY_DAYS_LEFT = 20;
  if (typeof window !== 'undefined' && typeof window.__ZERO_DAILY_DAYS_LEFT === 'number') {
    return window.__ZERO_DAILY_DAYS_LEFT;
  }

  const targetStr = (typeof window !== 'undefined' && window.__ZERO_DAILY_LAUNCH_DATE) || targetDateStr;
  const [targetYear, targetMonth, targetDay] = targetStr.split('-').map(Number);
  const targetMidnight = new Date(targetYear, targetMonth - 1, targetDay);
  const currentMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetMidnight.getTime() - currentMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats the launch notice message based on the remaining days.
 *
 * @param {number} days
 * @returns {string}
 */
export function getLaunchNoticeMarkup(days) {
  if (days > 1) {
    return `ZeroDaily is launching in the Play Store in just <strong class="font-semibold text-ink dark:text-paper-ink font-mono"><span id="playstore-days-count">${days}</span> days</strong>.`;
  }
  if (days === 1) {
    return `ZeroDaily is launching in the Play Store in just <strong class="font-semibold text-ink dark:text-paper-ink font-mono"><span id="playstore-days-count">1</span> day</strong>.`;
  }
  if (days === 0) {
    return `ZeroDaily is launching in the Play Store <strong class="font-semibold text-ink dark:text-paper-ink font-mono">today</strong>!`;
  }
  return `ZeroDaily is now available in the Play Store!`;
}

/**
 * Renders the small notification notice displayed just under the header.
 *
 * @returns {HTMLElement}
 */
export function renderLaunchNotice() {
  const notice = document.createElement('aside');
  notice.id = 'playstore-launch-notice';
  notice.setAttribute('aria-label', 'Play Store launch notice');
  notice.className = 'w-full border-b border-rule dark:border-night-rule bg-paper-raised/85 dark:bg-night-raised/85 backdrop-blur-sm text-xs sm:text-sm text-ink-soft dark:text-paper-soft py-2 px-4 transition-all duration-300';

  const days = calculateDaysRemaining();

  notice.innerHTML = `
    <div class="${CONTAINER} flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0 mx-auto sm:mx-0 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark border border-brand/20 dark:border-brand-dark/25 shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-dark animate-pulse"></span>
          PLAY STORE
        </span>
        <span id="playstore-notice-text" class="text-ink-soft dark:text-paper-soft">
          ${getLaunchNoticeMarkup(days)}
        </span>
        <a
          href="/join"
          class="inline-flex items-center gap-0.5 text-brand dark:text-brand-dark font-medium underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Join waitlist &rarr;
        </a>
      </div>
      <button
        id="dismiss-launch-notice"
        type="button"
        aria-label="Dismiss notice"
        title="Dismiss notice"
        class="p-1 rounded text-ink-faint hover:text-ink dark:text-paper-faint dark:hover:text-paper-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;

  // Dismiss button handler: smooth collapse
  const dismissBtn = notice.querySelector('#dismiss-launch-notice');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      notice.style.maxHeight = `${notice.offsetHeight}px`;
      notice.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        notice.style.maxHeight = '0px';
        notice.style.paddingTop = '0px';
        notice.style.paddingBottom = '0px';
        notice.style.opacity = '0';
        setTimeout(() => notice.remove(), 300);
      });
    });
  }

  // Live update method for midnight rollover or manual testing
  function refreshNoticeContent() {
    const currentDays = calculateDaysRemaining();
    const textEl = notice.querySelector('#playstore-notice-text');
    if (textEl) {
      textEl.innerHTML = getLaunchNoticeMarkup(currentDays);
    }
  }

  // Hook for DevTools manual testing: window.__updateZeroDailyLaunchNotice()
  if (typeof window !== 'undefined') {
    window.__updateZeroDailyLaunchNotice = refreshNoticeContent;
  }

  // Automatically update counter when midnight arrives
  function scheduleMidnightUpdate() {
    const now = new Date();
    const tomorrowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrowMidnight.getTime() - now.getTime() + 1000;

    const timer = setTimeout(() => {
      refreshNoticeContent();
      scheduleMidnightUpdate();
    }, msUntilMidnight);
    if (timer && typeof timer.unref === 'function') {
      timer.unref();
    }
  }

  scheduleMidnightUpdate();

  return notice;
}
