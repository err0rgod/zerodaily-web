# ZeroDaily Web (`zerodaily.in`) — Agent & Developer Guide

The public website for ZeroDaily: a Vite + Tailwind CSS v4 single-page app written in plain
JavaScript (no framework), deployed to **Cloudflare Pages**, with two **Pages Functions** in
`functions/`. The backend API contract (feed, articles, join/feedback OTP, sessions) lives in the
backend repo's `AGENTS.md` (`D:\zerodaily`, `api.zerodaily.in`).

> Merging to `main` deploys the live site. Work on a feature branch, open a PR, verify, then merge.

---

## Commit & PR attribution

- **Never add AI attribution.** No `Co-Authored-By: Claude ...` (or any AI co-author) trailer in commit messages, and no "Generated with Claude Code" or similar AI credit lines in PR titles or descriptions. Commits and PRs are authored by the repo owner only. This applies to every agent and tool working in this repo.

## 1. Quick orientation

### Commands

```bash
npm install
npm run dev        # Vite dev server on http://localhost:3000
npm run build      # production build -> dist/
npm run preview    # serve dist/ locally (vite preview)
```

Vite 8 needs Node `^20.19.0 || >=22.12.0`; CI uses Node 22.

The Vite dev server does not run Pages Functions, so `/api/*` calls fall back to
`https://api.zerodaily.in/api/v1` (see `src/webApi.js`), and `/a/*` gets no meta rewriting.

### Routes

Client routing is a plain `if` chain in `src/main.js` on `location.pathname` (trailing slashes stripped):

| Path | Rendered by | Layout |
| :--- | :--- | :--- |
| `/` (and any unknown path) | `renderHome()` + `handleSharedStoryView()` | header + launch notice + home + footer |
| `/wire` | `renderWire()` (supports `?desk=<category>`) | header + launch notice + wire + footer |
| `/join` | `renderJoinView()` | standalone centered page (no header/footer) |
| `/feedback` | `renderFeedbackView()` | standalone centered page (no header/footer) |
| `/contact` | `renderContactView()` | header + contact + footer |
| `/a/<id>`, `/story/<id>`, `?id=` / `?article_id=` | home + shared-story modal | see "Shared story links" |

Static pages in `public/` (not part of the SPA), each present twice with identical content —
`public/<name>.html` and `public/<name>/index.html` (the folder form avoids a Pages 308 loop). Keep both copies in sync:

- `/privacy` — privacy policy
- `/terms` — terms of service
- `/delete-account` — account deletion portal (Google Play requirement)

Redirects (`public/_redirects`): `/download`, `/download/apk` and `/apk` 302 to
`https://media.zerodaily.in/downloads/ZeroDaily.apk` (the latest APK, see "APK download" in §6).
`/.well-known/assetlinks.json` is a 200 passthrough.

### Component map (`src/`)

| File | Purpose |
| :--- | :--- |
| `main.js` | Router (above) and `hydrateReleaseData()`, which reads `latest.json`, points every `[data-apk-link="true"]` at the versioned APK, fills version/size/date into `#app-specs-tag` and shows the SHA-256 in `#app-sha`. |
| `api.js` | Read-only data: `escapeHtml`, `safeUrl`, categories, wire fetch (`/api/v1/notifications/history?limit=10`) with fallback dispatches, `fetchArticleDetail`, `fetchLatestAppRelease` (APK metadata; `DIRECT_APK_URL`, `APK_METADATA_URL`). |
| `webApi.js` | `apiPost(route, body, { token })` for visitor endpoints: tries same-origin `/api` first, then `https://api.zerodaily.in/api/v1`. A 4xx is reported immediately (`ApiError` with `.status`); only network errors and 5xx try the next host. |
| `session.js` | Verified-visitor session in `localStorage` (`getSession`, `saveSession`, `clearSession`). |
| `components/header.js` | Sticky header, nav (Today's Wire, Waitlist), theme toggle, "Get the app" button. Exports `CONTAINER`. |
| `components/launchNotice.js` | Play Store launch countdown banner (`PLAY_STORE_LAUNCH_TARGET_DATE`). |
| `components/home.js` | Landing page with phone-framed screenshots from `public/screens/*.webp`. |
| `components/wire.js` | Today's Wire: filterable story grid. |
| `components/sharedStoryModal.js` | Shared-story preview modal and app deep-link handoff. |
| `components/emailVerifier.js` | Shared email -> 6-digit code -> verified widget, plus shared UI classes (`UI`, `spinnerButton`, `setBusy`, `showMessage`). |
| `components/joinView.js` | `/join` waitlist page. |
| `components/feedbackView.js` | `/feedback` page. |
| `components/contactView.js` | `/contact` page. |
| `components/footer.js` | Footer; exports `CONTACT_EMAIL` (`hi@zerodaily.in`). |
| `styles.css` | Tailwind v4 `@theme` tokens and global styles. |

### Design tokens (`src/styles.css`)

Dark mode is class-based (`@variant dark (&:where(.dark, .dark *))`). `index.html` sets the `dark`
class before first paint from `localStorage['zd-theme']`, falling back to the system color scheme;
the header toggle writes `zd-theme`.

- **Paper (light):** `paper` `#faf8f3`, `paper-raised`, `ink` `#1b1a17`, `ink-soft`, `ink-faint`, `rule`, `rule-dark`.
- **Night (dark):** `night` `#0d0e12`, `night-raised`, `night-card`, `paper-ink` `#e9e7e0`, `paper-soft`, `paper-faint`, `night-rule`, `night-rule-dark`.
- **Brand accent:** `brand` `#c2410c` (light), `brand-dark` `#f26f3f` (dark). Use sparingly.
- **Fonts:** `font-serif` Newsreader (headlines), `font-sans` Inter (UI), `font-mono` JetBrains Mono — loaded from Google Fonts in `index.html`.

Typical pairing: `bg-paper dark:bg-night text-ink dark:text-paper-ink`, accents `text-brand dark:text-brand-dark`.
The `/join` and `/feedback` widgets also use a few literal hex colors (see `UI` in `emailVerifier.js`).

API-provided strings must go through `escapeHtml` / `textContent` and links through `safeUrl`.

---

## 2. Deploy

- `.github/workflows/deploy.yml`: every push to `main` runs **build** (Node 22, `npm ci`, `npm run build`,
  uploads `dist/` including hidden files so `.well-known/` ships) and then **deploy**
  (`wrangler pages deploy dist --project-name=zerodaily-web --branch=main`).
  Pull requests into `main` only run the build job.
- **Gotcha:** occasionally a merge push did not trigger the workflow. If a merge does not show a run
  in GitHub Actions, push an empty commit to `main` to re-trigger it
  (`git commit --allow-empty -m "chore: redeploy" && git push`).
- Workflow: feature branch -> PR (build must pass) -> verify visually -> merge. Never deploy by hand.
- Verify before merging in **light, dark and at 390px width**, e.g. `npm run build`,
  `npx vite preview --host 127.0.0.1`, then screenshot the changed pages with Playwright.

---

## 3. Routing gotchas

- `/join`, `/feedback`, `/contact` and `/wire` are served by the SPA through Pages' **SPA fallback**:
  there is no `404.html`, so Pages serves `index.html` for any path that is not a file.
- **Do not add `_redirects` rewrites to `/index.html`** (e.g. `/join /index.html 200`). Pages answers
  those with a 308 redirect to `/`, which breaks the page.
- Do not add standalone HTML for SPA routes. An old `public/join/index.html` once shadowed the app's
  `/join` and broke signups; it was removed.

---

## 4. Pages Functions (`functions/`)

### API proxy — `functions/api/[[path]].js`

Same-origin proxy from `zerodaily.in/api/*` to the backend Lambda function URL (`BACKEND` constant,
`.../api/v1`). Only paths matching this allowlist are forwarded:

```js
const ALLOWED = /^\/api\/(join(\/(save|send|verify|session))?|feedback(\/(send|verify))?)$/;
```

That is: `/api/join`, `/api/join/save`, `/api/join/send`, `/api/join/verify`, `/api/join/session`,
`/api/feedback`, `/api/feedback/send`, `/api/feedback/verify` (trailing slash ignored).

- `OPTIONS` -> `204` with CORS headers; non-allowlisted path -> `404`; non-`POST` -> `405`.
- Forwards `Content-Type`, `Authorization`, `User-Agent`, and the visitor IP (`CF-Connecting-IP`)
  as `X-Forwarded-For`, so the backend's per-IP limits count visitors, not the proxy.
- **`ORIGIN_SECRET` (Pages env var):** when set, the proxy adds `X-ZD-Origin-Key: <ORIGIN_SECRET>`
  to every upstream request, because the backend rejects requests without it. The value must equal
  the backend's `ORIGIN_SECRET` (on the `zerodaily-api` Lambda) and the header value set by the
  Cloudflare transform rule on `api.zerodaily.in`. It is configured as an **encrypted** Pages
  environment variable for production (Pages project settings), never in code; never log it.
  If unset, the header is omitted.
- Responses are passed through with `Cache-Control: no-store`; an unreachable backend returns `502`.
- To expose a new visitor endpoint, extend `ALLOWED` and document it here.

### Shared story links — `functions/a/[[catchall]].js`

Handles `/a/<article-id>`: fetches the article from `https://api.zerodaily.in/api/v1/article?id=...`
(2 s timeout) and rewrites the title and Open Graph/Twitter meta tags of `index.html` with
`HTMLRewriter`, so link previews (WhatsApp, X, Discord, Telegram, Slack, ...) show the story.
In the browser, `sharedStoryModal.js` shows a preview card, tries to open the Android app
(`intent://` / `zerodaily://`), and copies `zerodaily:<id>` to the clipboard for deferred deep linking.
(`/story/<id>` is recognized by the client but has no meta-rewriting function.)

---

## 5. Visitor flows (`/join`, `/feedback`)

- **Shared verifier** (`createEmailVerifier`): email -> `POST <flow>/send` -> 6-digit code ->
  `POST <flow>/verify`. Resend has a 60 s cooldown in the UI. If `/send` answers
  `verification_required: false` (backend OTP disabled), the flow finishes without a code.
- **Session:** `/verify` returns a server-signed `session_token` + `session_expires_at` (30 days).
  It is saved in `localStorage` key **`zd-session`** as `{ email, token, expiresAt }` and dropped once
  expired. The email there is only a display copy; the token is what the server trusts.
  A `401` from the server clears the session and shows the verifier again.
- **`/join`:** duplicate-safe — a repeat join shows "you're already on the list" (`already_joined`).
  With a stored session it offers one-click join via `POST join/session` (Bearer token), plus
  "Use a different email".
- **`/feedback`:** requires a session (verifies via `feedback/send` / `feedback/verify`, which does not
  join the waitlist), then posts `{ message, rating, page: '/feedback' }` to `feedback` with the
  Bearer token. Message 3–2000 characters; rating 1–5 optional.
- Server-side rules (code expiry, attempt and rate limits, storage) are defined in the backend
  `AGENTS.md`, not here.

---

## 6. Other facts

- **Contact:** footer and `/contact` use `hi@zerodaily.in` (`CONTACT_EMAIL`); privacy requests use
  `privacy@zerodaily.in`.
- **NVIDIA Inception:** the footer shows a text badge "Member of NVIDIA Inception" (green dot, links to
  nvidia.com/startups). The official badge artwork is still to be swapped in.
- **Android App Links:** `public/.well-known/assetlinks.json` (and a copy at `public/assetlinks.json`)
  for package `in.zerodaily.app` lists two SHA-256 fingerprints: the new release signing key and the
  old debug key (kept until sideload users migrate). Keep both files identical. `.gitignore` ignores
  `*.json` except these files and `package*.json`.
- **APK download:** the app repo `err0rgod/zerodaily-app` is **private**, so GitHub release URLs and
  the GitHub Releases API do not work for visitors — never link to them. APKs are served publicly from
  the S3 bucket `zerodaily-media-339087217625` (prefix `downloads/`) through Cloudflare at
  `media.zerodaily.in`:
  - `https://media.zerodaily.in/downloads/ZeroDaily.apk` — always the latest APK (`DIRECT_APK_URL`;
    target of the `/download`, `/apk`, `/download/apk` redirects and the static `href` of every
    download button).
  - `https://media.zerodaily.in/downloads/ZeroDaily-<version>.apk` — versioned copy.
  - `https://media.zerodaily.in/downloads/latest.json` — metadata
    `{ version, versionCode, file, latest, size, sha256, published_at }` (S3 CORS allows GET from any
    origin). `fetchLatestAppRelease()` fetches it (4 s timeout), points download buttons at `file`,
    and shows `Android v<version> · <size> MB · released <date>` plus the SHA-256. If it fails, the
    buttons keep `DIRECT_APK_URL` and the page shows the static "Latest release" text.
  Publishing a new APK (upload + `latest.json`) is done from the app repo, not here.
- **Cloudflare Email Obfuscation** rewrites `mailto:` addresses in the static HTML pages
  (`/privacy`, `/terms`, `/delete-account`). This is expected; the SPA renders its links in JS.
- **Cloudflare Bot Fight Mode is intentionally OFF** — it blocked Google Play's URL checker
  (privacy policy / deletion URLs). Do not turn it on.
- **Headers** (`public/_headers`): security headers on all paths, `max-age=0, must-revalidate` for
  HTML, one-year immutable caching for hashed `/assets/*`, JSON + CORS for `assetlinks.json`.
- No secrets live in this repo; the Cloudflare API token and account ID are GitHub Actions secrets.
