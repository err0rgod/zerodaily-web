# ZeroDaily Web (`zerodaily.in`)

[![Build & Deploy](https://github.com/err0rgod/zerodaily-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/err0rgod/zerodaily-web/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-zerodaily.in-10B981)](https://zerodaily.in)
[![Edge](https://img.shields.io/badge/Edge-Cloudflare%20Pages-F38020)](https://pages.cloudflare.com)
[![Latest APK](https://img.shields.io/badge/Android%20APK-Download-emerald)](https://zerodaily.in/apk)

The landing page for **ZeroDaily** — an Android app that roasts tech news in 60 words. The site pitches the app, shows one live story as a taste, and links the download. The app is the product; this page is the trailer.

---

## 1. Project Structure

```text
zerodaily-web/
├── index.html                  # Entry point (theme bootstrap, fonts, meta)
├── vite.config.js              # Vite + Tailwind v4 build
├── package.json
├── public/
│   ├── favicon.svg             # Brand mark (Z slash logo)
│   ├── icon-192.png / icon-512.png / apple-touch-icon.png  # Rasterized icons
│   ├── og-image.png            # Social share card
│   ├── site.webmanifest        # Installable PWA manifest
│   ├── _headers                # Cloudflare Pages cache & security headers
│   └── _redirects              # /apk, /download -> latest GitHub release APK
├── src/
│   ├── api.js                  # Wire/release fetching (3x retry), fallbacks, escaping helpers
│   ├── main.js                 # Page orchestrator (sections + category state)
│   ├── styles.css              # Tailwind v4 theme (paper/night) + editorial touches
│   └── components/
│       ├── editorialMasthead.js # Top bar, hero pitch, desk strip, theme toggle
│       ├── storyPreview.js      # A single app-style story card ("a taste of the app")
│       ├── appDock.js           # The product: app icon, feature list, download CTA
│       ├── coverageDirectory.js # The seven desks, one compact line
│       └── footer.js
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD: build -> Cloudflare Pages
└── README.md
```

---

## 2. Design Notes

- **Landing page, not a feed.** Hero pitch → one live story preview (exactly like the app renders it) → app features → desks → download. The app is the product.
- **Newspaper, not SaaS.** Warm paper background, black serif headlines (Newsreader), one rust-red accent, hairline rules. Dark mode via the moon toggle persists in `localStorage`; light is the house style.
- **All API-provided strings are rendered via `textContent`** (never raw `innerHTML`), and link URLs pass through an http(s) allow-list — no XSS surface from the feed.
- **Tailwind CSS v4 is bundled and purged by Vite** (~4.8 KB gzipped CSS), replacing the old CDN script.
- **Live story preview**: pulls the last 10 items from `https://api.zerodaily.in/api/v1/notifications/history?limit=10` (3 attempts, 3s apart), topped up with curated fallback dispatches when the wire is quiet.
- **Dynamic APK links**: version, size and download URL are hydrated from the GitHub Releases API for [`err0rgod/zerodaily-app`](https://github.com/err0rgod/zerodaily-app); `/apk` and `/download` 302 to the latest asset.

---

## 3. Local Development

### Prerequisites
- Node.js >= 18
- npm >= 9

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

---

## 4. CI/CD & Deployment

Every push to `main` builds the site in GitHub Actions and deploys `dist/` to **Cloudflare Pages** (`.github/workflows/deploy.yml`).
