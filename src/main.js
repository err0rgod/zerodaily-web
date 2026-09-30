import './styles.css';
import { renderEditorialMasthead } from './components/editorialMasthead.js';
import { renderBreakingWire } from './components/breakingWire.js';
import { renderEditorialBriefing } from './components/editorialBriefing.js';
import { renderCoverageDirectory } from './components/coverageDirectory.js';
import { renderAppDock } from './components/appDock.js';
import { renderFooter } from './components/footer.js';
import { fetchLatestAppRelease, setBreakingEndpoint } from './api.js';

// Application State
const state = {
  activeCategory: 'all',
};

async function hydrateReleaseData() {
  const release = await fetchLatestAppRelease();
  if (!release) return;

  // 1. Update all APK download links dynamically
  document.querySelectorAll('[data-apk-link="true"]').forEach(el => {
    el.href = release.apkUrl;
  });

  // 2. Update Masthead APK button text
  const mastheadApkText = document.getElementById('masthead-apk-text');
  if (mastheadApkText && release.version !== 'Latest') {
    mastheadApkText.textContent = `APK ${release.version}`;
  }

  // 3. Update App Dock badge and buttons
  const appBadgeVersion = document.getElementById('app-badge-version');
  if (appBadgeVersion && release.version !== 'Latest') {
    appBadgeVersion.textContent = `STANDALONE ${release.version} AVAILABLE`;
  }

  const appBtnText = document.getElementById('app-btn-text');
  if (appBtnText && release.version !== 'Latest') {
    appBtnText.textContent = `Download APK (${release.version}${release.apkSize ? ' • ' + release.apkSize : ''})`;
  }

  const appSpecsTag = document.getElementById('app-specs-tag');
  if (appSpecsTag && release.version !== 'Latest') {
    appSpecsTag.textContent = `Active ${release.version}`;
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

    // Update Masthead Pills
    document.querySelectorAll('[data-category-tab]').forEach(tab => {
      const cat = tab.getAttribute('data-category-tab');
      if (cat === newCategory) {
        tab.className = 'masthead-cat-pill whitespace-nowrap px-3 py-1.5 rounded text-xs font-mono font-bold bg-white text-slate-950 shadow-sm transition-all';
      } else {
        tab.className = 'masthead-cat-pill whitespace-nowrap px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#131720] hover:bg-[#181e2b] text-slate-300 hover:text-white border border-[#1d2330] transition-all';
      }
    });

    if (breakingWireComp) {
      breakingWireComp.setCategory(newCategory);
    }
    if (editorialBriefingComp) {
      editorialBriefingComp.setCategory(newCategory);
    }
  }

  function handleSelectStory(story, shouldScroll = true) {
    if (editorialBriefingComp) {
      editorialBriefingComp.setStory(story, shouldScroll);
    }
  }

  // 1. Render Editorial Masthead
  const masthead = renderEditorialMasthead(state.activeCategory, (cat) => switchCategory(cat));
  appRoot.appendChild(masthead);

  // 2. Render Live Breaking Wire (Top 10)
  breakingWireComp = renderBreakingWire((story, shouldScroll) => handleSelectStory(story, shouldScroll), state.activeCategory);
  appRoot.appendChild(breakingWireComp.element);

  // 3. Render The Editorial Briefing (Lead + Wire Rail)
  editorialBriefingComp = renderEditorialBriefing(state.activeCategory);
  appRoot.appendChild(editorialBriefingComp.element);

  // 4. Render The 7 Domains Directory
  const coverageDir = renderCoverageDirectory((cat) => {
    switchCategory(cat);
    document.getElementById('briefing')?.scrollIntoView({ behavior: 'smooth' });
  });
  appRoot.appendChild(coverageDir);

  // 5. Render App Dock
  const appDock = renderAppDock();
  appRoot.appendChild(appDock);

  // 6. Render Footer
  const footer = renderFooter();
  appRoot.appendChild(footer);

  // Hydrate release info from GitHub
  hydrateReleaseData();

  // Allow setting live breaking endpoint via window helper for quick testing
  window.__setZeroDailyBreakingEndpoint = (url) => {
    setBreakingEndpoint(url);
    if (breakingWireComp) breakingWireComp.reload();
  };
}

// Start application
initApp();
