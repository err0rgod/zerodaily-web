# ZeroDaily Web (`zerodaily.in`)

[![Build & Deploy](https://github.com/err0rgod/zerodaily-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/err0rgod/zerodaily-web/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-zerodaily.in-06B6D4)](https://zerodaily.in)
[![API](https://img.shields.io/badge/API-api.zerodaily.in-10B981)](https://api.zerodaily.in/docs)
[![Edge](https://img.shields.io/badge/Edge-Cloudflare%20Pages-F38020)](https://pages.cloudflare.com)

The modern, ultra-fast client-side web application and mobile app showcase for **ZeroDaily** — an automated, satirical tech intelligence platform delivering bite-sized 60-word roasted breakdowns across 6 technical domains.

---

## 1. Architecture Overview

ZeroDaily Web is an event-driven, serverless client running on **Cloudflare's global edge network**. It directly consumes the ZeroDaily serving API with sub-20ms edge latency and zero server runtime costs.

```
[ Ingestion Pipeline (D:/bot1) ]
         │
         ▼
[ AWS DynamoDB (us-east-1) ] ───► [ Cloudflare Edge CDN (api.zerodaily.in) ]
         │                                       │
         ▼                                       ▼
[ AWS S3 Images (media.zerodaily.in) ]  [ ZeroDaily Web (zerodaily.in) ]
                                                 │
                                                 ▼
                                     [ ZeroDaily Mobile App ]
```

---

## 2. Key Features

- **Blazing Fast Global Delivery**: Static client-side bundle built with Vite, cached across 300+ Cloudflare edge locations with automatic Brotli/Gzip compression.
- **Dynamic Chronological Feeds**: Real-time cursor-paginated feed queries to `https://api.zerodaily.in/api/v1/feed` with instant category filtering.
- **6 Covered Tech Domains**:
  - `cybersec`: Cybersecurity, active 0-days, and critical CVEs
  - `ai`: Foundation models, benchmark battles, and autonomous agents
  - `programming`: Software engineering, language updates, and runtimes
  - `robotics`: Humanoids, industrial automation, and robotic systems
  - `defense_aerospace`: Satellite swarms, hypersonics, and defense tech
  - `hardware`: Semiconductors, GPUs, wafer fabrication, and quantum chips
- **Full Story Reader Modal**: Clean deep-linking modal view (`/?id=...`) with satirical roast, factual breakdown, and direct original source links.
- **Live Breaking News Ticker**: Dynamically polls recent breaking alerts from `/api/v1/notifications/history`.
- **Mobile App Showcase**: Prominent hero banner and modals driving mobile downloads for Android (APK) and iOS (TestFlight).
- **Resilient Offline Fallback**: Built-in cache fallback so the web UI renders gracefully even during network downtime.

---

## 3. Project Structure

```text
zerodaily-web/
├── index.html                  # Single Page Application entrypoint
├── vite.config.js              # Vite bundler configuration
├── package.json                # Project dependencies and npm scripts
├── public/
│   ├── favicon.svg             # Vector brand icon
│   └── _headers                # Cloudflare Pages edge cache & security headers
├── src/
│   ├── api.js                  # Typed API client for https://api.zerodaily.in
│   ├── main.js                 # App state orchestrator, router, and event bus
│   ├── styles.css              # Cyberpunk/terminal dark aesthetic & animations
│   └── components/
│       ├── header.js           # Navigation bar, search, and category pills
│       ├── hero.js             # Mobile app showcase & download banner
│       ├── feed.js             # Story card grid & cursor pagination
│       ├── articleModal.js     # Full story reader modal
│       └── footer.js           # Domain links, status pulse, and disclaimer
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD pipeline for Cloudflare Pages
└── README.md                   # Technical documentation
```

---

## 4. Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Getting Started

1. Clone or navigate to the repository:
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
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Production assets will be emitted to `dist/`.

---

## 5. Configuration (`.env`)

Create a `.env` file for local development overrides (optional):

```bash
# Base URL for the ZeroDaily serving API (defaults to production API)
VITE_API_BASE_URL=https://api.zerodaily.in
```

---

## 6. CI/CD & Deployment

This project uses **GitHub Actions** (`.github/workflows/deploy.yml`) to automatically build and deploy `dist/` to **Cloudflare Pages** on every push to `main`.

### Required GitHub Secrets

To enable automated deployment, add these two secrets to your GitHub repository:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with `Cloudflare Pages: Edit` permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID found in the Cloudflare dashboard URL or Workers/Pages overview.

### Cloudflare Pages Setup

1. In the Cloudflare Dashboard, go to **Workers & Pages > Create application > Pages > Connect to Git**.
2. Select `zerodaily-web` repository.
3. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Custom Domain:
   - Attach your custom domain: `zerodaily.in` and `www.zerodaily.in`.
