# Save47

A free, no-ads, no-login, privacy-first downloader for videos and audio from YouTube, Instagram, TikTok, Facebook, Twitter/X, Reddit, SoundCloud, Pinterest, Vimeo, Dailymotion, Twitch clips, and 1,000+ more sites supported by yt-dlp. Save47 proxies media directly from the source platform to your browser — nothing is stored server-side.

- **Web:** dark-mode, mobile-friendly downloader.
- **APK:** Trusted Web Activity wrapper, share-target enabled.
- **CLI:** `save47-cli` for terminal + bulk workflows.
- **API:** REST endpoints with API-key auth, free tier, and Stripe-billed Pro / Unlimited plans.
- **Admin panel:** live metrics dashboard at `/admin`.

## Monorepo layout

```
save47/
├── apps/
│   ├── web/        # Next.js 15 app (Vercel)
│   ├── api/        # Fastify backend (Railway / Fly.io / Render)
│   ├── cli/        # save47-cli (npm package)
│   └── android/    # Bubblewrap TWA → APK
├── .github/workflows/  # APK build CI
└── docker-compose.yml  # local Redis + API
```

## Local development

### Prerequisites

- Node 20+, pnpm 9+
- yt-dlp (`pip install -U yt-dlp`)
- ffmpeg (`brew install ffmpeg` / `apt install ffmpeg`)
- Redis (`brew install redis`, or `docker compose up redis -d`)

### Run

```bash
pnpm install
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local

# Optional: enable the admin panel
echo "ADMIN_TOKEN=$(openssl rand -hex 32)" >> apps/api/.env

redis-server --daemonize yes      # or docker compose up redis -d
pnpm --filter @save47/api dev    # http://localhost:4000
pnpm --filter @save47/web dev    # http://localhost:3000
```

Visit:
- `http://localhost:3000` — landing page + downloader
- `http://localhost:3000/api` — API docs + free key issuance
- `http://localhost:3000/pricing` — paid plans
- `http://localhost:3000/admin` — admin dashboard (paste the `ADMIN_TOKEN` you set)

## Deployment

### Recommended split

| Component | Where | Why |
| --- | --- | --- |
| `apps/web` | **Vercel** | First-class Next.js, edge caching, free TLS, free tier. |
| `apps/api` | **Railway** or **Fly.io** | Needs a long-running Node container with `yt-dlp` + `ffmpeg`. Vercel functions can't host this. |
| Redis | **Upstash** (free) | TLS, regional, zero-ops. |
| APK hosting | GitHub Releases | The Android APK is built by `.github/workflows/android.yml` on every `v*` tag and uploaded to the release. |

### 1. Push the repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<you>/save47.git
git push -u origin main
```

### 2. Provision Redis on Upstash

1. Create a free database at [upstash.com](https://upstash.com).
2. Copy the **REDIS** (TCP) endpoint host, port, and password.

### 3. Deploy the API to Railway

1. New project → Deploy from GitHub repo → pick `save47`.
2. Set the root directory to `apps/api` (Railway will detect the Dockerfile).
3. Environment variables:
   ```
   REDIS_HOST=<upstash-host>
   REDIS_PORT=<upstash-port>
   REDIS_PASSWORD=<upstash-password>
   ADMIN_TOKEN=<openssl rand -hex 32>
   ALLOWED_ORIGINS=https://<your-vercel-domain>,https://save47.com
   CF_TURNSTILE_SECRET_KEY=<from Cloudflare>
   STRIPE_SECRET_KEY=sk_live_…
   STRIPE_WEBHOOK_SECRET=whsec_…
   STRIPE_PRICE_PRO=price_…
   STRIPE_PRICE_UNLIMITED=price_…
   SITE_URL=https://<your-vercel-domain>
   NODE_ENV=production
   ```
4. Deploy. Note the public URL — e.g. `https://save47-api.up.railway.app`.
5. **Add Stripe webhook** in Stripe Dashboard → Developers → Webhooks. Endpoint: `https://save47-api.up.railway.app/billing/webhook`. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

Alternative on **Fly.io**: `fly launch --copy-config` from `apps/api/`, then `fly secrets set ...` and `fly deploy`. The provided `fly.toml` is preconfigured.

### 4. Deploy the web app to Vercel

1. Vercel → New Project → import the GitHub repo.
2. **Root directory: `apps/web`** (this is critical for the monorepo).
3. Build command: `pnpm --filter @save47/web build` (set in `vercel.json`).
4. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://save47-api.up.railway.app
   NEXT_PUBLIC_SITE_URL=https://save47.com
   NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY=0x4AAA…
   NEXT_PUBLIC_APK_URL=https://github.com/<you>/save47/releases/latest/download/save47-latest.apk
   NEXT_PUBLIC_APK_VERSION=1.0.0
   ```
5. Deploy. Add your custom domain → Vercel handles TLS.

### 5. Build and ship the APK

The first time:

```bash
cd apps/android
npm i -g @bubblewrap/cli
bubblewrap init --manifest=twa-manifest.json   # creates android.keystore — KEEP THIS SAFE
bubblewrap fingerprint generate                # prints assetlinks.json
# Copy the generated assetlinks.json to apps/web/public/.well-known/
```

After that, every `git tag v1.x.y && git push --tags` triggers `.github/workflows/android.yml` and uploads the APK to the GitHub release. Add these repo secrets first:

- `ANDROID_KEYSTORE_B64` — `base64 < apps/android/android.keystore`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS` (defaults to `android`)
- `ANDROID_KEY_PASSWORD`

The `/download/apk` page links to the GitHub release, so the latest APK is always one click away.

### 6. Publish the CLI to npm

```bash
cd apps/cli
pnpm build
npm publish --access public
```

After publishing, anyone can run:
```bash
npm i -g save47-cli
save47 login YOUR_API_KEY
save47 download "https://www.youtube.com/watch?v=…"
```

## API reference

Base URL: `https://api.save47.com` (or your Railway/Fly URL).

Auth: `Authorization: Bearer <token>` or `?api_key=<token>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | none | Liveness check (Redis + yt-dlp). |
| GET | `/probe?url=…` | optional | Metadata for a URL. Anonymous = per-IP rate limited; with key = quota only. |
| GET | `/download?url=…&formatId=…&quality=…` | optional | Streams the file. Anonymous = Turnstile + IP limit. With key = quota only. |
| GET | `/v1/probe?url=…` | required | Same as `/probe` but always API-key gated. |
| POST | `/v1/bulk` | required | `{ urls: string[], concurrency?: 1-8 }`. Up to 50 URLs. |
| GET | `/v1/me` | required | Returns `{ id, plan, monthlyQuota, label, createdAt }`. |
| POST | `/keys/request` | none (rate limited) | `{ email, label? }` → free-tier `{ token, id, plan, monthlyQuota }`. |
| POST | `/billing/checkout` | none | `{ email, plan }` → Stripe Checkout URL. |
| POST | `/billing/webhook` | Stripe sig | Stripe → API webhook. |
| GET | `/admin/metrics` | admin | Totals, daily series, top platforms, top errors, recent events. |
| GET | `/admin/keys` | admin | List all API keys. |
| POST | `/admin/keys` | admin | Issue a key for any plan / user. |
| DELETE | `/admin/keys/:id` | admin | Revoke. |
| GET | `/admin/keys/:id/usage` | admin | Per-key usage breakdown (today, total, last 30 days). |

### Plans (default quotas)

| Plan | Monthly requests | Price |
| --- | --- | --- |
| Free | 200 | $0 |
| Pro | 10,000 | $9 / month |
| Unlimited | 1,000,000 | $49 / month |

Configure Stripe price IDs in `STRIPE_PRICE_PRO` / `STRIPE_PRICE_UNLIMITED`.

### Error codes

```
no_video_found          — URL invalid or empty
unsupported_platform    — DRM or unknown source
youtube_rate_limited    — too many requests (you, or upstream)
private_video           — content gated
geo_blocked             — region-restricted
instagram_login_required — login-only content
expired_link            — link no longer valid
dmca_blocked            — copyright takedown
default                 — anything else
```

## Admin panel

`/admin` requires `ADMIN_TOKEN` (set on the API server). The token is stored client-side in `localStorage` and only used to call `/admin/*` endpoints. Two tabs:

- **Overview** — totals, today's counters, 14-day chart of probes/downloads/errors, top 10 platforms, top 10 error codes, recent activity feed.
- **Keys** — issue new keys (any plan), revoke, see plan + quota.

The dashboard polls every 15s.

## Monetization

You earn money in two ways:

1. **Pro / Unlimited subscriptions** — set `STRIPE_PRICE_PRO` and `STRIPE_PRICE_UNLIMITED` to your Stripe price IDs. Visitors hit `/pricing`, click upgrade, and get redirected to Stripe Checkout. The `/billing/webhook` endpoint handles the entire lifecycle: it issues an API key for new customers, upgrades existing keys on renewal, and downgrades to free on cancellation.

2. **Optional sponsorships / donations** — easy to add: drop a "Sponsor on GitHub" link into the footer.

You explicitly do **not** earn through ads or tracking — the entire pitch is "no ads, no tracking" so adding either would torch the brand. Keep it clean.

## Self-hosting

Spin up a $5 VPS, install Docker, copy the repo, and run `docker compose up -d`. Put Caddy in front for TLS. Set the same env vars listed in the Railway section. The CLI works out-of-the-box if you point users at your hostname via `SAVE47_API_URL`.

## Legal

Save47 is a tool for downloading content you own or have permission to download. You are responsible for complying with the terms of service of the platforms you use and applicable copyright laws. We never store or redistribute media.

DMCA: dmca@save47.com

## License

MIT.
