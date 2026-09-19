import './styles.css';
import { renderHeader } from './components/header.js';
import { renderHero } from './components/hero.js';
import { renderRoastPreview } from './components/roastPreview.js';
import { renderDomains } from './components/domains.js';
import { renderHowItWorks } from './components/howItWorks.js';
import { renderDownloads } from './components/downloads.js';
import { renderFooter } from './components/footer.js';
import { fetchLatestAppRelease } from './api.js';

async function hydrateReleaseData() {
  const release = await fetchLatestAppRelease();
  if (!release) return;

  // 1. Update all APK download links dynamically
  document.querySelectorAll('[data-apk-link="true"]').forEach(el => {
    el.href = release.apkUrl;
  });

  // 2. Update Nav Badge
  const navBadge = document.getElementById('nav-version-badge');
  if (navBadge && release.version !== 'Latest') {
    navBadge.textContent = `${release.version} READY`;
  }

  // 3. Update Hero version pill
  const heroPill = document.getElementById('hero-version-pill');
  if (heroPill && release.version !== 'Latest') {
    heroPill.textContent = release.version;
    heroPill.classList.remove('hidden');
  }

  // 4. Update Downloads section badge & metadata
  const downloadsBadge = document.getElementById('downloads-badge');
  if (downloadsBadge && release.version !== 'Latest') {
    downloadsBadge.textContent = `${release.version} AVAILABLE`;
  }

  const downloadsInfo = document.getElementById('downloads-apk-info');
  if (downloadsInfo) {
    const parts = [];
    if (release.version !== 'Latest') parts.push(release.version);
    if (release.apkSize) parts.push(release.apkSize);
    if (release.publishedAt) parts.push(`Updated ${release.publishedAt}`);
    if (parts.length > 0) {
      downloadsInfo.textContent = parts.join(' • ');
    }
  }

  const downloadsBtnText = document.getElementById('downloads-btn-text');
  if (downloadsBtnText && release.version !== 'Latest') {
    downloadsBtnText.textContent = `Download ZeroDaily.apk (${release.version})`;
  }

  const shaLink = document.getElementById('downloads-sha-link');
  if (shaLink && release.shaUrl) {
    shaLink.href = release.shaUrl;
  }

  const releaseLink = document.getElementById('downloads-release-link');
  if (releaseLink && release.releaseUrl) {
    releaseLink.href = release.releaseUrl;
  }
}

function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  // Clear any existing content
  appRoot.innerHTML = '';

  // Render minimal intro site sections
  appRoot.appendChild(renderHeader());
  appRoot.appendChild(renderHero());
  appRoot.appendChild(renderRoastPreview());
  appRoot.appendChild(renderDomains());
  appRoot.appendChild(renderHowItWorks());
  appRoot.appendChild(renderDownloads());
  appRoot.appendChild(renderFooter());

  // Dynamically hydrate latest GitHub release data
  hydrateReleaseData();
}

// Start application
initApp();
