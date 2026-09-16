import './styles.css';
import { renderHeader } from './components/header.js';
import { renderHero } from './components/hero.js';
import { renderRoastPreview } from './components/roastPreview.js';
import { renderDomains } from './components/domains.js';
import { renderHowItWorks } from './components/howItWorks.js';
import { renderDownloads } from './components/downloads.js';
import { renderFooter } from './components/footer.js';

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
}

// Start application
initApp();
