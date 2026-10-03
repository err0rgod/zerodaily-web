import './styles.css';
import { renderMasthead } from './components/editorialMasthead.js';
import { renderStoryPreview } from './components/storyPreview.js';
import { renderCoverageDirectory } from './components/coverageDirectory.js';
import { renderAppSection } from './components/appDock.js';
import { renderFooter } from './components/footer.js';
import { fetchLatestAppRelease, setBreakingEndpoint } from './api.js';

const state = {
  activeCategory: 'all',
};

const TAB_ACTIVE = 'whitespace-nowrap px-2.5 py-1 text-[13px] font-sans transition-colors border-b-2 -mb-px border-brand dark:border-brand-dark text-ink dark:text-paper-ink font-semibold';
const TAB_IDLE = 'whitespace-nowrap px-2.5 py-1 text-[13px] font-sans transition-colors border-b-2 -mb-px border-transparent text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink';

async function hydrateReleaseData() {
  const release = await fetchLatestAppRelease();
  if (!release) return;

  // Point every download link at the freshest asset.
  document.querySelectorAll('[data-apk-link="true"]').forEach(el => {
    el.href = release.apkUrl;
  });

  const versionSuffix = release.version !== 'Latest' ? ` (${release.version}${release.apkSize ? ' · ' + release.apkSize : ''})` : '';

  const mastheadApkText = document.getElementById('masthead-apk-text');
  if (mastheadApkText && release.version !== 'Latest') {
    mastheadApkText.textContent = `Get the app (${release.version})`;
  }

  const heroApkText = document.getElementById('hero-apk-text');
  if (heroApkText) heroApkText.textContent = `Download for Android${versionSuffix}`;

  const appBtnText = document.getElementById('app-btn-text');
  if (appBtnText) appBtnText.textContent = `Download for Android${versionSuffix}`;

  const appSpecsTag = document.getElementById('app-specs-tag');
  if (appSpecsTag && release.version !== 'Latest') {
    appSpecsTag.textContent = `${release.version} · released ${release.publishedAt || 'recently'}`;
  }

  const appShaLink = document.getElementById('app-sha-link');
  if (appShaLink && release.shaUrl) {
    appShaLink.href = release.shaUrl;
  }
}

function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  appRoot.innerHTML = '';

  const preview = renderStoryPreview(state.activeCategory);

  function switchCategory(newCategory) {
    state.activeCategory = newCategory;

    document.querySelectorAll('[data-category-tab]').forEach(tab => {
      const cat = tab.getAttribute('data-category-tab');
      tab.className = cat === newCategory ? TAB_ACTIVE : TAB_IDLE;
    });

    preview.setCategory(newCategory);
    document.getElementById('taste')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  appRoot.appendChild(renderMasthead(state.activeCategory, switchCategory));
  appRoot.appendChild(preview.element);
  appRoot.appendChild(renderAppSection());
  appRoot.appendChild(renderCoverageDirectory(switchCategory));
  appRoot.appendChild(renderFooter());

  hydrateReleaseData();

  // Handy for testing against a staging feed:
  // __setZeroDailyBreakingEndpoint('https://staging.example.com/feed')
  window.__setZeroDailyBreakingEndpoint = (url) => {
    setBreakingEndpoint(url);
    preview.reload();
  };
}

initApp();
