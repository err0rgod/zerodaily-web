# ZeroDaily Web (`zerodaily.in`)

[![Build & Deploy](https://github.com/err0rgod/zerodaily-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/err0rgod/zerodaily-web/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-zerodaily.in-10B981)](https://zerodaily.in)
[![Edge](https://img.shields.io/badge/Edge-Cloudflare%20Pages-F38020)](https://pages.cloudflare.com)
[![Latest APK](https://img.shields.io/badge/Android%20APK-Download-emerald)](https://zerodaily.in/apk)

The ultra-fast, minimal intro website and app showcase for **ZeroDaily** — an automated, satirical tech intelligence platform delivering bite-sized 60-word roasted breakdowns across 6 technical domains.

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
│       ├── header.js           # Minimal navbar with dynamic APK CTA
│       ├── hero.js             # High-impact typography, copy, and key metrics
│       ├── roastPreview.js     # Interactive 60-word roast viewer with domain switcher
│       ├── domains.js          # The 6 core engineering domains
│       ├── howItWorks.js       # 3-step automated pipeline breakdown
│       ├── downloads.js        # Android APK & iOS TestFlight download cards
│       └── footer.js           # Status pulse, links, and MIT license
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD pipeline for Cloudflare Pages
└── README.md                   # Technical documentation
```

---

## 2. Key Highlights

- **Dynamic Latest APK Resolution**:
  - `https://zerodaily.in/apk` and `https://zerodaily.in/download` natively redirect (HTTP 302) to the newest release APK from [`err0rgod/zerodaily-app`](https://github.com/err0rgod/zerodaily-app).
  - Web UI dynamically queries the GitHub Releases API on load to display the live version tag (e.g., `v0.1.3`), file size (~71.2 MB), and direct download asset link.
- **Zero Fluff**: Minimalist, distraction-free intro website built with clean dark aesthetic and crisp typography (Inter + JetBrains Mono).
- **Interactive Roast Preview**: Instant showcase of ZeroDaily's 60-word cynical summaries with domain filters and one-click copy.
- **6 Covered Tech Domains**:
  - `cybersec`: Active 0-days, ransomware, and critical CVEs
  - `ai`: Foundation models, benchmark reality checks, and agent economics
  - `programming`: Software engineering, language churn, and distributed systems outages
  - `robotics`: Humanoids, industrial automation, and kinematics failure cases
  - `defense_aerospace`: Satellite swarms, hypersonics, and defense telemetry
  - `hardware`: Semiconductors, wafer fabs, GPU supply chain, and quantum architectures
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
