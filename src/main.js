import './styles.css';
import { renderMasthead } from './components/editorialMasthead.js';
import { renderStoryPreview } from './components/storyPreview.js';
import { renderAppSection } from './components/appDock.js';
import { renderFooter } from './components/footer.js';
import { fetchLatestAppRelease, setBreakingEndpoint } from './api.js';
import { handleSharedStoryView } from './components/sharedStoryModal.js';
import { renderJoinView } from './components/joinView.js';

async function hydrateReleaseData() {
  const release = await fetchLatestAppRelease();
  if (!release) return;

  // Point every download link at the freshest asset.
  document.querySelectorAll('[data-apk-link="true"]').forEach(el => {
    el.href = release.apkUrl;
  });

  if (release.version === 'Latest') return;

  const appSpecsTag = document.getElementById('app-specs-tag');
  if (appSpecsTag) {
    const parts = [`Android ${release.version}`, release.apkSize, release.publishedAt && `released ${release.publishedAt}`];
    appSpecsTag.textContent = parts.filter(Boolean).join(' · ');
  }

  const appShaLink = document.getElementById('app-sha-link');
  if (appShaLink && release.releaseUrl) appShaLink.href = release.releaseUrl;
}

function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  appRoot.innerHTML = '';

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/join') {
    appRoot.appendChild(renderJoinView());
    return;
  }

  const feed = renderStoryPreview();

  appRoot.appendChild(renderMasthead());
  appRoot.appendChild(feed.element);
  appRoot.appendChild(renderAppSection());
  appRoot.appendChild(renderFooter());

  hydrateReleaseData();
  handleSharedStoryView();

  // Handy for testing against a staging feed:
  // __setZeroDailyBreakingEndpoint('https://staging.example.com/feed')
  window.__setZeroDailyBreakingEndpoint = (url) => {
    setBreakingEndpoint(url);
    feed.reload();
  };
}

initApp();
