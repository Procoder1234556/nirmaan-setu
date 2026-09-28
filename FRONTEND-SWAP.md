# Frontend swap — legacy Nirmaan Setu UI

> **Branch**: `frontend/legacy-ui-swap`
> **Source of the frontend**: [`Procoder1234556/project-reality-os`](https://github.com/Procoder1234556/project-reality-os) @ `fb141ff` (main)
> **Target**: [`Procoder1234556/nirmaan-setu`](https://github.com/Procoder1234556/nirmaan-setu) @ `eb84198` (master)
> **Approach**: static drop-in — the legacy pages are served as-is, the Next.js app keeps running underneath.

---

## 1. What changed

The visible product UI is now the legacy static frontend. The Next.js application keeps running (and keeps building) underneath, but no longer owns any user-facing route.

| Area | Change |
| :--- | :--- |
| `public/` | **+20 legacy HTML pages**, `nirmaan-setu.css`, `ns-demo.js`, `ns-demo-core.js`, `ns-cookies.js`, `ns-loader.js`, `ns-sw.js`, `recommendation-card.js`, and `assets/` (40 files, screenshots/crew photos/hero video) |
| `next.config.ts` | **+`redirects()`** mapping every old Next route to its legacy equivalent, **+`rewrites()`** putting the landing page on `/`, restoring `cleanUrls`, and adding `/faq`, `/help`, `/onboarding`, `/settings` |
| `public/sw.js` | Replaced the portal shell worker with a **cleanup stub** so browsers that already installed the old cache-first worker self-heal |
| `src/nirmaan/client/components/PwaRegistration.tsx` | Registers the legacy offline shell (`/ns-sw.js`) instead of `/sw.js` |
| `public/manifest.webmanifest` | `start_url` now points at the legacy site-report page; legacy theme colours and logo |
| `src/app/layout.tsx` | Title/description aligned with the legacy branding; `themeColor` moved to the `viewport` export |
| `docs/legacy-frontend/` | **+** legacy `design.md` and `DEMO-GUIDE.md` (run instructions updated for the new hosting) |
| `tests/` | **+** the legacy regression suite, `legacy-demo.test.cjs` (5 domain tests) and `legacy-browser.cjs` (Chromium end-to-end), rewired to the new paths |
| `README.md` | Frontend section, route map, structure, and run instructions updated |

Nothing was deleted. The React portal screens (`src/landing-page`, `src/nirmaan/client/pages`, `src/admin`, Open SaaS leftovers) are still in the tree and still compile — they are simply unreachable.

## 2. Route map

Extension-free URLs work exactly as they did on the original static deployment: `/nirmaan-setu-dashboard` and `/nirmaan-setu-dashboard.html` both resolve.

| URL | Serves |
| :--- | :--- |
| `/` | Landing page |
| `/onboarding` | Onboarding tour |
| `/faq`, `/help` | Help centre |
| `/settings`, `/account` | Account / settings |
| `/nirmaan-setu-*.html` | Any legacy screen, addressed directly |

| Previous route | Redirects to | Legacy page |
| :--- | :--- | :--- |
| `/projects` | `/nirmaan-setu-dashboard.html` | Live dashboard |
| `/projects/[projectId]` | `/nirmaan-setu-weekly.html` | Weekly / milestone summary |
| `/reviewer-queue` | `/nirmaan-setu-planner-review.html` | Planner review queue |
| `/field-log` | `/nirmaan-setu-site-report.html` | Site report |
| `/knowledge-base` | `/nirmaan-setu-history.html` | Report & task history |
| `/evidence` | `/nirmaan-setu-history.html` | Report & task history |
| `/login` | `/nirmaan-setu-auth.html` | Sign in |
| `/signup` | `/nirmaan-setu-auth-signup.html` | Create account |
| `/password-reset`, `/request-password-reset` | `/nirmaan-setu-auth-reset.html` | Reset password |
| `/email-verification` | `/nirmaan-setu-auth-otp.html` | Verify code |
| `/pricing`, `/checkout`, `/file-upload`, `/demo-app`, `/admin`, `/admin/*` | `/nirmaan-setu-landing.html` | Landing page (Open SaaS template leftovers) |

Every redirect is **temporary (307)** on purpose: nothing is baked into browser caches, so the mapping can be adjusted or reverted in a later deploy.

Other legacy screens with no previous route: `nirmaan-setu-auth-role.html`, `nirmaan-setu-auth-chooser.html`, `nirmaan-setu-ai-processing.html`, `nirmaan-setu-match-confirmation.html`, `nirmaan-setu-sync.html`, `nirmaan-setu-weekly.html`, `nirmaan-setu-delay-conflict.html`, `nirmaan-setu-logo.html`.

## 3. PWA / service worker handling

The legacy site and the earlier portal both ship a service worker, and two workers on the same origin fight over the cache. This is handled explicitly:

- The legacy **`ns-sw.js`** is kept and is now the only active worker. It is network-first, and it only intercepts requests whose path ends with one of its own shell assets — it cannot interfere with Next routes or the API.
- The old **`public/sw.js`** is replaced with a self-destroying stub. It deletes the retired `nirmaan-setu-shell-*` caches, unregisters itself, and reloads open clients once. The file must exist for the update check to succeed; deleting it outright would leave the old worker installed forever.
- This supersedes commit `7e2f428` ("Fix stale PWA page cache after deployments"), which made the portal worker network-first. That fix was correct for the portal, but with the portal retired there is nothing left for it to cache; the stub keeps the same goal (no stale shell after deploy) and adds clean handover to the legacy worker. The stub also clears `nirmaan-setu-shell-v3` and any earlier shell cache by prefix.

## 4. Verification

All of this was run against the swapped repository, not the original one.

```bash
npx pnpm@10 install --frozen-lockfile   # lockfile untouched, no new dependencies
npx pnpm@10 build                       # production build: passed, all 27 routes compiled
npx pnpm@10 exec next start -H 0.0.0.0  # serve the production build
node --test tests/legacy-demo.test.cjs  # 5/5 domain tests passed
NODE_PATH=... node tests/legacy-browser.cjs
```

Results:

| Check | Result |
| :--- | :--- |
| Production build | Passed, no config errors from the new redirects/rewrites |
| `/` serves the legacy landing | Passed — `<title>Nirman Setu \| Daily site reports become live schedule truth`, legacy markup present |
| Clean URLs (`/nirmaan-setu-dashboard`) | Passed — 200 |
| All 17 redirects | Passed — 307 to the intended legacy page (checked individually) |
| Static legacy pages, CSS, JS, assets (`.mp4`, logo PNGs) | Passed — 200 |
| `/api/health` | Untouched — returns the backend status JSON (503 in a sandbox with no `DATABASE_URL`, as expected) |
| Internal link crawl across all 20 pages | 38 unique targets, **0 broken** |
| `node --check` on all 6 legacy scripts | Passed |
| Chromium end-to-end demo flow | **Passed** — `PASS: draft reload, offline submit/reload, reconnect, dynamic matches, confirmation, cross-tab 18→19, crane flow, rejection, audit, reset; no page errors.` |

The end-to-end run is the important one: it drives the real flow (write a report offline → reload → reconnect → match → confirm → approve → counter updates in a second tab → crane conflict → reject → audit → reset) **against the Next.js server**, which is what proves the legacy frontend actually works in its new hosting context.

## 5. Known trade-offs

These are deliberate consequences of the static drop-in approach, not defects:

1. **The UI does not use the backend.** Reports, matches, approvals, and the audit trail live in `localStorage` under the key `ns_demo_v1`. The CPM engine, `.XER` parser, semantic matcher, Prisma persistence, and Groq routes are present and compile but are not called.
2. **Single-device demo.** No accounts, no server persistence, no multi-user sync. Different devices do not share state.
3. **Keyword matching, not AI.** Confidence is a match-strength score from `ns-demo-core.js` over six task categories, not a calibrated probability.
4. **No voice capture.** The earlier portal's `/field-log` voice-to-text (`/api/transcribe`) has no legacy UI equivalent.
5. **Photo upload is disabled** in the legacy site report page — the code hides the control rather than showing fake stored photos.
6. **Two of the earlier capabilities are unreachable from the UI**: schedule baseline upload (`.XER`/`.XML`) and the historical benchmark knowledge base.

If the backend should drive the legacy UI, the next step is to replace the `NSDemo` localStorage adapter in `public/ns-demo.js` with calls to the existing server actions, keeping the legacy markup and CSS as the view layer. That is a per-screen port, not a rewrite.

## 6. Rollback

The swap is contained in a single commit.

```bash
# Revert just this commit (keeps history, safest on a shared branch)
git revert --no-edit <commit-sha>   # 3cf249b on frontend/legacy-ui-swap

# Or drop the branch entirely
git checkout master
git branch -D frontend/legacy-ui-swap
```

Because every redirect is temporary and the React screens were never deleted, reverting restores the previous portal immediately.
