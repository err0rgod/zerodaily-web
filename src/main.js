import './styles.css';
import { renderHeader } from './components/header.js';
import { renderHome } from './components/home.js';
import { renderWire } from './components/wire.js';
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

  appRoot.className = 'min-h-screen flex flex-col bg-paper dark:bg-night';

  if (path === '/wire') {
    document.title = "Today's Wire — ZeroDaily";
    const wire = renderWire();
    wire.element.classList.add('flex-1');
    appRoot.append(renderHeader('wire'), wire.element, renderFooter());

    // Handy for testing against a staging feed:
    // __setZeroDailyBreakingEndpoint('https://staging.example.com/feed')
    window.__setZeroDailyBreakingEndpoint = (url) => {
      setBreakingEndpoint(url);
      wire.reload();
    };
  } else {
    const home = renderHome();
    home.classList.add('flex-1');
    appRoot.append(renderHeader('home'), home, renderFooter());
    handleSharedStoryView();
  }

  hydrateReleaseData();
}

initApp();
