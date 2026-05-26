# save47 — Full Project Context (Agent Handoff)

> Comprehensive handoff doc. Read this top-to-bottom before doing any work on this project.
> Last updated: 2026-05-26 by Claude (Opus 4.7). Maintainer: vishwas@opptra.com.

---

## TL;DR — what's broken right now

1. **YouTube downloads fail** with "login required (YouTube bot check)" — Railway datacenter IPs are bot-walled. **Fix: set `YTDLP_COOKIES_B64` env var on Railway** (see [Cookies setup](#cookies-setup)) OR add a residential proxy.
2. **Instagram downloads fail** for the same reason. Same fix.
3. **Everything else works**: TikTok, Twitter/X, Reddit, Facebook (public), SoundCloud. The frontend, admin panel, Redis cache, API key system, and Vercel deploy are all live and healthy.

## TL;DR — what to NOT redo

- Don't re-deploy frontend — Vercel is current and pointing to `save47-api-production.up.railway.app`.
- Don't try to use the Railway MCP — it's auth'd to the wrong account. Use `railway` CLI (after `railway login` as ritiktech970@gmail.com).
- Don't try to use GitHub auto-deploy — Railway service deploys **via CLI only** (`railway up`). All 4 deployments in history are "via CLI".
- Don't add error handling for the format selector — already fixed in `157ad08`. Muxed formats are tried first.

---

## Project overview

**save47** is a free, no-ads, no-login video downloader. It supports 1000+ sites via yt-dlp (YouTube, Instagram, TikTok, Twitter/X, Reddit, Facebook, SoundCloud, etc.).

**Surfaces**:
- Web: https://save47.com (Vercel-hosted Next.js)
- API: https://api.save47.com / https://save47-api-production.up.railway.app (Railway)
- Android APK: built from [apps/android](apps/android/)
- CLI: [apps/cli](apps/cli/)

**Repo layout** (pnpm monorepo):
```
/
├── apps/
│   ├── api/        Fastify + yt-dlp + Redis (TypeScript)  ← the backend
│   ├── web/        Next.js 15 frontend
│   ├── cli/        Node CLI
│   └── android/    Capacitor APK wrapper
├── package.json    pnpm workspace root
├── pnpm-workspace.yaml
├── docker-compose.yml   Local dev: api + redis
└── CONTEXT.md      ← you are here
```

**Tech stack**:
- Backend: Node 20 + Fastify 4 + Redis + yt-dlp (binary) + ffmpeg
- Frontend: Next.js 15 + React 18 + Tailwind
- Build: pnpm 9, TypeScript 5.4
- Deploy: Railway (API) + Vercel (web)

---

## Deployment infrastructure

### Railway (API)

**Account**: ritiktech970@gmail.com — NOT vishwas@opptra.com. Important.

| Resource | ID | Notes |
|---|---|---|
| Workspace | `Tech Was's Projects` | Default workspace for the Railway account |
| Project | `d5e36dc1-0356-4781-ac41-030b67d76e7d` | name: `save47` |
| Environment | `480a9cee-ad24-4cbd-8510-6a62f9a0e3ef` | name: `production` |
| Service (API) | `ca13b24b-203c-4ca3-9670-662589254524` | name: `save47-api` |
| Public URL | https://save47-api-production.up.railway.app | Railway-default |
| Custom domain | https://api.save47.com | Configured |
| Region | sfo | US West |
| Replicas | 1 | |
| Redis service | (separate) | Online, attached via `REDIS_URL` |

**Deploy method**: `railway up --service save47-api --ci` from repo root.
- NOT connected to GitHub — pushing to `main` does NOT auto-deploy. You must run `railway up`.
- The CLI tarballs the current working directory and uploads it. Docker build happens on Railway.
- Dockerfile path is `apps/api/Dockerfile` (set via `RAILWAY_DOCKERFILE_PATH` env var).
- Typical build time: 2–4 min.

**To deploy, from `/Users/vishwaspandey/Desktop/stalshy`**:
```bash
railway whoami                          # verify auth (ritiktech970@gmail.com)
railway status                          # confirm linked project/service
railway up --service save47-api --ci    # bundle + deploy
```
If `railway whoami` says unauthorized → `railway login` (browser) or `railway login --browserless`.

**Local Railway link state**: `~/.railway/config.json` already has the project/service/environment IDs linked to `/Users/vishwaspandey/Desktop/stalshy`. Only re-auth is needed when the token expires.

### Vercel (Frontend)

**Account**: pandeyvishwas51-oss (vishwas@opptra.com login)
**Project**: `save47` (`prj_BNDay5y3bnm22q5gI5ahvOT9xjBq`, org `team_I3ImHgFiibQdHvtTC2fkmd2U`)
**Production URL**: https://save47.com (also reachable at save47.vercel.app)
**Deploy method**: Vercel auto-deploys from GitHub pushes. CLI: `vercel --prod`.

**Critical env var** (set in Vercel project settings):
- `NEXT_PUBLIC_API_URL=https://save47-api-production.up.railway.app`
  - Previously was empty/missing → frontend fell back to localhost:4000 → all API calls failed. Fixed earlier.

---

## Environment variables — current state

### Railway `save47-api` (production)

**Already set** (visible in dashboard Variables tab):
- `ADMIN_TOKEN` — legacy bearer token for admin auth (CLI/curl)
- `ALLOWED_ORIGINS` — CORS allowlist
- `NODE_ENV=production`
- `PORT=4000`
- `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`
- `REDIS_URL` — internal Railway Redis service ref
- `ADMIN_EMAIL` — set by user 2026-05-26 (for email/password admin login)
- `ADMIN_PASSWORD` — set by user 2026-05-26

**NOT yet set** (and what they unlock):
- `YTDLP_COOKIES_B64` — base64-encoded cookies.txt. **Decoded at container start** by [apps/api/entrypoint.sh](apps/api/entrypoint.sh), written to `/tmp/cookies.txt`, then exposed to yt-dlp via `YTDLP_COOKIES_FILE`. **This is the only realistic way to unblock YouTube + Instagram downloads.**
- `YTDLP_COOKIES_FILE` — direct path override. Don't set if using `_B64`.
- `YTDLP_YT_CLIENTS` — comma-separated player_client list. Default `android,ios,tv,web`. Tune if you find a working combo.
- `ADMIN_SESSION_SECRET` — optional. Falls back to `ADMIN_TOKEN` (line 70 of `apps/api/src/middleware/auth.ts`). **Do not need to set.**
- `ADMIN_SESSION_TTL_SECONDS` — defaults to 7 days.
- `TURNSTILE_SECRET` — Cloudflare Turnstile secret for download bot protection. If unset, Turnstile is effectively a no-op (see `apps/api/src/middleware/turnstile.ts`).

### Vercel
- `NEXT_PUBLIC_API_URL=https://save47-api-production.up.railway.app` ✅

---

## API surface — what each route does

All in `apps/api/src/routes/`:

| File | Endpoints | Purpose |
|---|---|---|
| `health.ts` | `GET /health` | Liveness + Redis + yt-dlp checks |
| `probe.ts` | `GET /probe?url=` | Fetch metadata only (titles, thumbnails, formats). Cached 10 min in Redis. |
| `download.ts` | `GET /download?url=&formatId=&quality=&token=` | Stream video bytes. Spawns yt-dlp, pipes to response. Requires Turnstile token (web) or API key. |
| `stream.ts` | `GET /stream/:jobId` | (Used for job-based streaming, less critical) |
| `proxy.ts` | `GET /proxy/thumb?url=` | CORS proxy for thumbnails |
| `keys.ts` | `POST /keys` | Public — create an API key (email-gated) |
| `v1.ts` | `GET /v1/info`, `POST /v1/bulk`, `GET /v1/me` | Public API requiring API key |
| `billing.ts` | `POST /billing/checkout`, `POST /billing/webhook` | Stripe |
| `admin.ts` | `GET /admin/config`, `POST /admin/login`, `GET /admin/me`, `GET /admin/metrics`, `GET/POST/DELETE /admin/keys[/:id[/usage]]` | Admin panel backend |

### Admin auth (two modes — both work)

Implemented in `apps/api/src/middleware/auth.ts`:

1. **Email + password** (preferred, used by web UI):
   - `POST /admin/login` with `{email, password}` → returns signed session token.
   - Token = `base64url(payload).hex(hmac-sha256(payload, secret))`, where secret = `ADMIN_SESSION_SECRET || ADMIN_TOKEN`.
   - Default `ADMIN_EMAIL` = `pandeyvishwas51@gmail.com` if unset.
   - Requires `ADMIN_PASSWORD` env var.
   - Session TTL: 7 days.
2. **Raw `ADMIN_TOKEN` bearer** (legacy, used by CLI/curl):
   - Still accepted for back-compat.

Both checked in `requireAdmin()`. `/admin/login` and `/admin/config` are public; everything else under `/admin/` is gated.

---

## yt-dlp integration — how it actually works

### Probe (metadata-only)
File: `apps/api/src/services/ytdlp.ts:47` — `probeUrl(url)`.
Spawns `yt-dlp --dump-json --no-download <commonArgs> <url>`.
- Output: JSON metadata.
- Common args include: random user agent, `--geo-bypass`, `--extractor-args youtube:player_client=...`, `--retries 3`.
- 30 s timeout.

### Stream (actual download)
File: `apps/api/src/services/ytdlp.ts:107` — `streamVideo(url, formatSelector, audioOnly)`.
Spawns `yt-dlp --format <selector> --output - --merge-output-format mp4 --ppa 'Merger+ffmpeg_o:-movflags frag_keyframe+empty_moov -strict -2' <commonArgs> <url>`.
- Returns a Readable stream of raw media bytes.
- `--ppa` flag is **critical**: when yt-dlp needs to merge separate video+audio streams, ffmpeg must produce a fragmented MP4 (because we're piping to stdout, which isn't seekable). Without this, downloads produce 0-byte or unplayable files.

### Format selector
File: `apps/api/src/services/formats.ts`.
Order matters — yt-dlp tries left to right:
```
best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best
```
Prefers **already-muxed mp4** first (Instagram, most social) to avoid the slow merge path. Falls back to merge only for sites that serve separate streams (YouTube high-res).

### Cookies (the bot-wall bypass)
- Set `YTDLP_COOKIES_FILE` to a path → yt-dlp adds `--cookies <path>`.
- For Railway (no persistent files), `apps/api/entrypoint.sh` decodes `YTDLP_COOKIES_B64` to `/tmp/cookies.txt` at container start and exports `YTDLP_COOKIES_FILE`.

### Error classification
`parseYtdlpError(stderr)` in `apps/api/src/services/ytdlp.ts:163` maps yt-dlp stderr text to stable error codes:
- "sign in" / "confirm you" / "login required" → `instagram_login_required` (403)
- "429" / "rate-limit" → `youtube_rate_limited` (429)
- "private video" → `private_video` (403)
- etc.

Note: the `instagram_login_required` code is shared across YouTube and Instagram bot-wall errors. Misleading name but the user-facing message in `parseYtdlpError` correctly says "Login required (YouTube bot check)".

---

## Recent commits — what shipped this week

Top of `git log --oneline`:

| Commit | Title | What it does |
|---|---|---|
| `c8ec63a` | fix(download): defer headers until first byte | Stops "Reply was already sent" crash when yt-dlp fails before producing output. Now sends a clean JSON error instead of dropping the connection. |
| `157ad08` | fix: prefer muxed formats | Format selector now tries `best[ext=mp4]` first, falls back to merge. + `--ppa` flag for pipe-safe MP4. |
| `c690112` | feat: admin email/password login + cookies entrypoint | New `/admin/login` route with session tokens. Entrypoint decodes `YTDLP_COOKIES_B64`. |
| `abe3311` | ytdlp: YouTube bot-check workarounds | `player_client` flag + cookies file support in `ytdlp.ts`. |
| `7a05c9f` | api: REDIS_URL support | TLS auto-detect for Upstash/Railway managed Redis. |
| `80ab61d` | deploy: harden Dockerfile | Monorepo-safe Docker build for Railway. |
| `413b2e5` | PWA icons + APK build prep | |
| `3a2add6` | Initial commit | |

---

## Open issues / pending work

### Priority 1 — Get downloads actually working

**The blocker**: YouTube & Instagram bot wall. Railway IP is flagged.

**Two options to unblock** (combining them is best):

#### A. Cookies — free, 5-min setup, user must do this {#cookies-setup}

1. User installs "Get cookies.txt LOCALLY" Chrome extension.
2. Logs into YouTube + Instagram in browser.
3. Exports `youtube-cookies.txt` and `instagram-cookies.txt`.
4. Combines + base64-encodes:
   ```bash
   cat youtube-cookies.txt instagram-cookies.txt > combined.txt
   base64 -i combined.txt | tr -d '\n' | pbcopy
   ```
5. Sets Railway env var `YTDLP_COOKIES_B64=<paste>`.
6. Railway auto-redeploys → cookies live.

**Caveats**: cookies expire (Instagram ~weeks, YouTube ~months). Account using the cookies risks bans if traffic is heavy. Use throwaway accounts.

#### B. Residential proxy — paid, more reliable {#proxy-setup}

Not yet wired up. To add (~5 lines of code in `apps/api/src/services/ytdlp.ts` `commonArgs()`):
```ts
const PROXY = process.env.YTDLP_PROXY;
// ...
if (PROXY) args.push('--proxy', PROXY);
```
Then sign up for Webshare ($3/mo for 10GB residential) → set `YTDLP_PROXY=http://user:pass@proxy.host:port` on Railway.

**Status**: User asked about Vidmate-style bypass. I explained the trade-offs. User has not yet decided.

### Priority 2 — Cookie rotation / monitoring

When cookies expire, downloads silently start failing. Need:
- Admin metrics endpoint already exists (`/admin/metrics`) → wire up alerting if error rate for `instagram_login_required` spikes.
- Or build an admin UI that flashes red when cookies look stale.

### Priority 3 — `passwordLoginEnabled: false` until admin re-checks

After user set `ADMIN_PASSWORD`, the next deploy will flip `passwordLoginEnabled` to `true`. **Verify with**:
```bash
curl -s https://save47-api-production.up.railway.app/admin/config | python3 -m json.tool
```
Should show `passwordLoginEnabled: true`.

---

## Common operations cheat sheet

```bash
# --- Health checks ---
curl -s https://save47-api-production.up.railway.app/health | python3 -m json.tool
curl -s https://save47-api-production.up.railway.app/admin/config | python3 -m json.tool

# --- Deploy API to Railway ---
cd /Users/vishwaspandey/Desktop/stalshy
railway whoami                          # verify ritiktech970@gmail.com
railway up --service save47-api --ci    # ~3 min build

# --- Watch logs ---
railway logs --service save47-api 2>&1 | tail -50
railway logs --service save47-api 2>&1 | grep -E "/download|/probe|statusCode\":[45]"

# --- Set env var on Railway ---
railway variables --service save47-api --set YTDLP_COOKIES_B64="$(base64 -i ~/Downloads/cookies.txt | tr -d '\n')"

# --- Restart Railway service ---
# No direct command. Either redeploy (`railway up`) or change an env var to force restart.

# --- Test probe locally ---
curl "https://save47-api-production.up.railway.app/probe?url=https://www.tiktok.com/@user/video/123"

# --- Vercel ---
vercel ls save47 --yes                  # list deployments
vercel --prod                           # deploy current branch
vercel env ls                           # list env vars

# --- Frontend smoke ---
curl -sI https://save47.com | head -5
```

---

## Files you'll edit most often

| Path | When |
|---|---|
| `apps/api/src/routes/download.ts` | Stream bugs, format issues |
| `apps/api/src/routes/probe.ts` | Metadata bugs, caching |
| `apps/api/src/services/ytdlp.ts` | yt-dlp args, error classification, proxy/cookies |
| `apps/api/src/services/formats.ts` | Format selector logic, quality mapping |
| `apps/api/src/middleware/auth.ts` | Auth changes (admin or API key) |
| `apps/api/src/routes/admin.ts` | Admin panel endpoints |
| `apps/api/entrypoint.sh` | Container startup (cookies decode) |
| `apps/api/Dockerfile` | Build image (yt-dlp, ffmpeg pinning) |
| `apps/web/app/admin/page.tsx` | Admin UI (login form, key management) |
| `apps/web/components/downloader/UrlInput.tsx` | Main downloader UI |
| `apps/web/.env.local` / Vercel env | `NEXT_PUBLIC_API_URL` etc |

---

## Local dev

```bash
cd /Users/vishwaspandey/Desktop/stalshy
pnpm install
docker compose up -d redis     # start Redis
pnpm dev                       # runs api + web in parallel
```
API on http://localhost:4000, web on http://localhost:3000.

---

## Known gotchas

1. **Railway uses CLI deploys, not GitHub.** Pushing to main does nothing on Railway. You must `railway up`.
2. **The Railway account is on a different email** (ritiktech970@gmail.com) than the Vercel and GitHub accounts (vishwas@opptra.com / pandeyvishwas51-oss). Railway MCP will fail if it's not auth'd to the Railway account.
3. **`--output -` + `bestvideo+bestaudio` produces broken files unless `--ppa Merger+ffmpeg_o:-movflags frag_keyframe+empty_moov` is set.** This is why `apps/api/src/services/ytdlp.ts:130-133` exists. Don't remove these.
4. **Once `reply.raw.pipe()` is called or headers are set, you cannot use `reply.code().send()` anymore** — it throws `FST_ERR_REP_ALREADY_SENT`. That's why `download.ts` defers headers until first byte (commit `c8ec63a`).
5. **Probe success does not imply download success.** Probe fetches metadata (often public). Download fetches the actual media URL (often gated). You can get a 200 on probe and 403 on download for the same URL.
6. **Instagram cookies expire much faster than YouTube cookies.** Plan for weekly refresh on Instagram, monthly on YouTube.
7. **YouTube `player_client=android` worked great until 2024. Now it's ~30% reliable from datacenter IPs.** Don't trust it as the only mitigation — pair with cookies or proxy.

---

## What I (Claude) did in the last session — chronological

1. Diagnosed why downloads produced unplayable files → format selector preferred merge path → fixed in `formats.ts` (`157ad08`). Added pipe-safe ffmpeg flags in `ytdlp.ts`.
2. Set Vercel `NEXT_PUBLIC_API_URL` (was empty → frontend was talking to localhost).
3. Built admin email/password login system (`c690112`) — `/admin/config`, `/admin/login`, `/admin/me` endpoints + session tokens. UI in `apps/web/app/admin/page.tsx`.
4. Built cookies entrypoint — `apps/api/entrypoint.sh` decodes `YTDLP_COOKIES_B64` at container start.
5. Discovered Railway service was 17h stale because all deploys are via CLI, not GitHub. Re-auth'd Railway CLI as ritiktech970, ran `railway up`. New container live.
6. Verified `/admin/config` and `/admin/login` return 200 (admin endpoints live).
7. User reported downloads still fail. Traced to two causes:
   - **Code bug**: `FST_ERR_REP_ALREADY_SENT` when yt-dlp errored before output (fixed in `c8ec63a`, deployed).
   - **Infra issue**: YouTube/Instagram bot-wall blocking Railway IP. **Requires cookies or proxy** — explained options to user.
8. Created this CONTEXT.md handoff doc.

---

## Useful URLs

- Vercel project: https://vercel.com/pandeyvishwas51-oss-projects/save47
- Railway dashboard: https://railway.app/project/d5e36dc1-0356-4781-ac41-030b67d76e7d
- Production frontend: https://save47.com
- Production API: https://api.save47.com / https://save47-api-production.up.railway.app
- GitHub: (private repo on pandeyvishwas51-oss account)

---

## When the next agent picks this up

**First thing to do**: read this entire file, then:
```bash
cd /Users/vishwaspandey/Desktop/stalshy
git status
git log --oneline -10
curl -s https://save47-api-production.up.railway.app/health
curl -s https://save47-api-production.up.railway.app/admin/config
railway whoami    # may need `railway login`
```

This confirms repo state, recent commits, API liveness, and Railway auth — everything you need to be productive in 30 seconds.

If the user asks about Instagram/YouTube downloads not working → it's almost certainly the bot wall. Set up cookies (Section "Cookies setup" above) before debugging code.
