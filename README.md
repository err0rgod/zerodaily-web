# ZeroDaily Web (`zerodaily.in`)

[![Build & Deploy](https://github.com/err0rgod/zerodaily-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/err0rgod/zerodaily-web/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-zerodaily.in-c2410c)](https://zerodaily.in)
[![Edge](https://img.shields.io/badge/Edge-Cloudflare%20Pages-F38020)](https://pages.cloudflare.com)
[![Latest APK](https://img.shields.io/badge/Android%20APK-Download-1b1a17)](https://zerodaily.in/download)

The website for **ZeroDaily**, an Android app that delivers short, no-spin tech news across seven
desks: security, AI, software, robotics, defense, silicon and finance. The site introduces the app,
shows the latest stories, links the APK download, and runs the waitlist and feedback forms.

## Pages

| Path | What it is |
| :--- | :--- |
| `/` | Landing page with app screenshots and download links |
| `/wire` | Today's Wire: the latest stories, filterable by desk |
| `/join` | Waitlist signup with email verification |
| `/feedback` | Send feedback (verified email required) |
| `/contact` | Contact details (hi@zerodaily.in) |
| `/privacy`, `/terms`, `/delete-account` | Static legal and account-deletion pages |
| `/download` | Redirects to the latest APK (`media.zerodaily.in/downloads/ZeroDaily.apk`) |
| `/a/<id>` | Shared story link with rich link previews |

## Stack

- [Vite](https://vite.dev) + [Tailwind CSS v4](https://tailwindcss.com), plain JavaScript, no framework
- Newspaper look: Newsreader / Inter / JetBrains Mono, warm paper light theme and a night dark theme
- [Cloudflare Pages](https://pages.cloudflare.com) hosting, with Pages Functions for the `/api/*`
  proxy (waitlist and feedback) and the `/a/*` link previews
- Data from the ZeroDaily API (`api.zerodaily.in`) and the APK metadata file
  `media.zerodaily.in/downloads/latest.json`

## Local development

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

Pages Functions do not run under the Vite dev server; the waitlist and feedback forms then call
`api.zerodaily.in` directly.

## Deploy

Every push to `main` builds the site in GitHub Actions and deploys `dist/` to Cloudflare Pages
(`.github/workflows/deploy.yml`). Pull requests only build. Changes go through a feature branch and
a PR, and are checked in light mode, dark mode and on a phone-width screen before merging.

## More

Routing gotchas, the API proxy allowlist, visitor sessions, design tokens and other details for
contributors and coding agents are in [AGENTS.md](AGENTS.md).

## License

See [LICENSE](LICENSE).
