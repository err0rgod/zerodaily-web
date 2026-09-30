# ZeroDaily Web (`zerodaily.in`)

[![Build & Deploy](https://github.com/err0rgod/zerodaily-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/err0rgod/zerodaily-web/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-zerodaily.in-10B981)](https://zerodaily.in)
[![Edge](https://img.shields.io/badge/Edge-Cloudflare%20Pages-F38020)](https://pages.cloudflare.com)
[![Latest APK](https://img.shields.io/badge/Android%20APK-Download-emerald)](https://zerodaily.in/apk)

The ultra-fast, minimal intro website and app showcase for **ZeroDaily** — an automated, satirical tech intelligence platform delivering bite-sized 60-word roasted breakdowns across 7 technical & financial domains.

---

## 1. Project Structure

```text
zerodaily-web/
├── index.html                  # Minimal single-page app entrypoint
├── vite.config.js              # Vite bundler configuration
├── package.json                # Project dependencies and npm scripts
├── public/
│   ├── favicon.svg             # Vector brand icon
│   ├── _headers                # Cloudflare Pages edge cache & security headers
│   └── _redirects              # Direct dynamic redirects (/apk, /download -> latest APK)
├── src/
│   ├── api.js                  # Data service & dynamic GitHub Releases resolver
│   ├── main.js                 # App orchestrator & client-side release hydrator
│   ├── styles.css              # Minimal dark aesthetic & typography
│   └── components/
│       ├── editorialMasthead.js # Editorial header with dynamic date, issue metadata, and 7-domain navigation
│       ├── breakingWire.js      # Real-time top 10 breaking dispatches wire from live scraper pipeline
│       ├── editorialBriefing.js # Featured lead dispatch commanded by Newsreader serif + wire rail
│       ├── coverageDirectory.js # 7 core engineering & market domains directory
│       ├── appDock.js           # Standalone APK download showcase with specs & checksums
│       └── footer.js            # Editorial footer with system status & links
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated CI/CD pipeline for Cloudflare Pages
└── README.md                    # Technical documentation
```

---

## 2. Key Highlights

- **Live Breaking News Wire (Top 10)**:
  - Consumes real-time notifications directly from `https://api.zerodaily.in/api/v1/notifications/history?limit=10`.
  - Automatically promotes newly scraped breaking news to the top of the wire with live pulse indicators and one-click full roasted breakdowns.
- **Editorial Intelligence Design**:
  - Replaces generic AI SaaS templates with a publication-grade editorial layout featuring **Newsreader** serif typography, asymmetric hierarchy, and dense wire scannability.
- **Dynamic Latest APK Resolution**:
  - `https://zerodaily.in/apk` and `https://zerodaily.in/download` natively redirect (HTTP 302) to the newest release APK from [`err0rgod/zerodaily-app`](https://github.com/err0rgod/zerodaily-app).
  - Web UI dynamically queries the GitHub Releases API on load to display the live version tag (e.g., `v0.1.4`), file size (~71.2 MB), and direct download asset link.
- **7 Covered Technical & Market Domains**:
  - `cybersec`: Active 0-days, ransomware, and critical CVEs
  - `ai`: Foundation models, benchmark reality checks, and agent economics
  - `programming`: Software engineering, language churn, and distributed systems outages
  - `robotics`: Humanoids, industrial automation, and kinematics failure cases
  - `defense_aerospace`: Satellite swarms, hypersonics, and defense telemetry
  - `hardware`: Semiconductors, wafer fabs, GPU supply chain, and quantum architectures
  - `finance`: High-frequency trading, DeFi smart contract collapses, market glitches, and fintech realities
- **Sub-20ms Global Edge**: Static client-side bundle built with Vite, deployed to Cloudflare Pages edge network.

---

## 3. Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Getting Started

1. Navigate to directory:
   ```bash
   cd D:/zerodaily-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 4. CI/CD & Deployment

Automated deployments trigger on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`), deploying the static `dist/` directory to **Cloudflare Pages**.
