import './styles.css';
import { renderEditorialMasthead } from './components/editorialMasthead.js';
import { renderBreakingWire } from './components/breakingWire.js';
import { renderEditorialBriefing } from './components/editorialBriefing.js';
import { renderCoverageDirectory } from './components/coverageDirectory.js';
import { renderAppDock } from './components/appDock.js';
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

  const mastheadApkText = document.getElementById('masthead-apk-text');
  if (mastheadApkText && release.version !== 'Latest') {
    mastheadApkText.textContent = `Get the app (${release.version})`;
  }

  const appBtnText = document.getElementById('app-btn-text');
  if (appBtnText && release.version !== 'Latest') {
    appBtnText.textContent = `Download for Android (${release.version}${release.apkSize ? ' · ' + release.apkSize : ''})`;
  }

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

  let breakingWireComp = null;
  let editorialBriefingComp = null;

  function switchCategory(newCategory) {
    state.activeCategory = newCategory;

    document.querySelectorAll('[data-category-tab]').forEach(tab => {
      const cat = tab.getAttribute('data-category-tab');
      tab.className = cat === newCategory ? TAB_ACTIVE : TAB_IDLE;
    });

    breakingWireComp?.setCategory(newCategory);
    editorialBriefingComp?.setCategory(newCategory);
  }

  function handleSelectStory(story, shouldScroll = true) {
    editorialBriefingComp?.setStory(story, shouldScroll);
  }

  const masthead = renderEditorialMasthead(state.activeCategory, switchCategory);
  appRoot.appendChild(masthead);

  breakingWireComp = renderBreakingWire(handleSelectStory, state.activeCategory);
  appRoot.appendChild(breakingWireComp.element);

  editorialBriefingComp = renderEditorialBriefing(state.activeCategory);
  appRoot.appendChild(editorialBriefingComp.element);

  const desks = renderCoverageDirectory((cat) => {
    switchCategory(cat);
    document.getElementById('briefing')?.scrollIntoView({ behavior: 'smooth' });
  });
  appRoot.appendChild(desks);

  appRoot.appendChild(renderAppDock());
  appRoot.appendChild(renderFooter());

  hydrateReleaseData();

  // Handy for testing against a staging feed:
  // __setZeroDailyBreakingEndpoint('https://staging.example.com/feed')
  window.__setZeroDailyBreakingEndpoint = (url) => {
    setBreakingEndpoint(url);
    breakingWireComp?.reload();
  };
}

initApp();
