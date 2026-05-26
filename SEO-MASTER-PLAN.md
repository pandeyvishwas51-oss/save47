# Save47 SEO Master Plan

A complete reference for the Save47 SEO setup — what's already shipped,
what each piece does, and the exact sequence to take it live in
Google Search Console, Bing Webmaster Tools, and IndexNow.

---

## Phase 1 — Immediate (do this today, ~30 minutes)

### 1.1 Verify the production deploy is live with the new code

Open `https://save47.com/sitemap.xml` and confirm you see a sitemap index
with 4 sub-sitemaps (`/sitemap/0.xml` through `/sitemap/3.xml`).

```
curl -s https://save47.com/sitemap.xml | head -20
curl -s https://save47.com/sitemap/0.xml | head -20
curl -s https://save47.com/robots.txt
```

If you don't see them, trigger a Vercel redeploy from the dashboard.

### 1.2 Set up Google Search Console

1. Go to https://search.google.com/search-console
2. Click **Add property** → choose **Domain** (not URL prefix). This
   covers `http://`, `https://`, `www`, and `non-www` in one shot.
3. Enter `save47.com`.
4. Google will give you a TXT record. Add it as a DNS record at your
   domain registrar (probably wherever the CNAME for save47.com lives).
   - Record type: **TXT**
   - Host: **@** (or leave blank)
   - Value: the `google-site-verification=...` string from GSC
   - TTL: default (3600s)
5. Wait 5-10 minutes for DNS propagation, then click **Verify** in GSC.
6. **Once verified**, immediately add the same token as a meta tag too,
   for redundancy. On Vercel, add the env var:
   ```
   NEXT_PUBLIC_GOOGLE_VERIFICATION=<the-token-without-google-site-verification=>
   ```
   (We've already wired this into `app/layout.tsx`.)

### 1.3 Submit the sitemap

In Google Search Console:
1. Sidebar → **Sitemaps**
2. Enter `sitemap.xml` and click **Submit**
3. Within a few minutes GSC will discover the sub-sitemaps automatically.

Verify discovery worked: refresh the page after 10 minutes; you should
see "Discovered" with 40+ URLs.

### 1.4 Set up Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Click **Add site**
3. Enter `https://save47.com`
4. Choose verification method **Import from Google Search Console** —
   this is the fastest because GSC is already verified.
5. If that's not available, use the same TXT DNS record approach as
   Google (Bing accepts a separate TXT record).
6. Submit `https://save47.com/sitemap.xml` under **Sitemaps**.

### 1.5 Activate IndexNow (Bing + Yandex auto-indexing)

The IndexNow key is already deployed at
`https://save47.com/save47-2026-indexnow-verify-9f3a8c2d1b4e.txt`.

To submit fresh URLs every time you deploy:
```
cd apps/web
npm run indexnow
```

Or wire it into your deploy hook automatically — see Phase 2.

---

## Phase 2 — Week 1 (do these within 7 days)

### 2.1 Set up a postdeploy IndexNow hook on Vercel

In Vercel dashboard → save47 project → Settings → Git → Deploy Hooks.
Create a hook called "IndexNow" pointing to a URL that triggers our
script. Easiest: add a Vercel cron that runs daily.

Or simpler, run it manually after each major content update:
```
npm run indexnow
```

### 2.2 Set up monitoring with the GSC API

Google Search Console has an API that lets you pull keyword data,
indexing stats, and CWV scores into a dashboard. The script in
`scripts/gsc-monitor.mjs` (template below) can be cron'd to alert on:
- 404 spikes
- Indexing drops
- New manual actions
- Mobile usability regressions

### 2.3 Submit to other major search engines

- **Yandex Webmaster**: https://webmaster.yandex.com — important for
  Russian-language traffic and as another IndexNow consumer.
- **DuckDuckGo**: indexes from Bing, so once Bing has you, DDG will too.
- **Baidu**: only worth it if targeting China; requires Chinese-language
  content + ICP filing, generally skip.

### 2.4 Build the topical authority cluster

We've shipped 9 long-form guides. Add 5 more over the next 30 days:
- "How to download YouTube playlists" (high search volume)
- "Best YouTube to MP3 converter Reddit recommends" (long-tail brand-jacking)
- "Why YouTube downloads fail and how to fix them" (intent: troubleshooting)
- "Save47 review — is it safe?" (brand defensive content)
- "How to download a Vimeo video without Vimeo Pro"

Each one targets a specific search intent and links back to the relevant
platform page. The internal linking compounds.

### 2.5 Set up Google Business Profile (if applicable)

Save47 is a software product without a physical address, so Google
Business Profile (formerly Google My Business) is not strictly needed.
**Skip this** unless you want a "Knowledge Panel" sidebar in search —
that requires a real business address and verification by postcard.

---

## Phase 3 — First month (compound the work)

### 3.1 Internal linking matrix

We've built the foundation:
- Homepage → 9 popular downloaders
- Each platform page → 3 related platform pages → /all-platforms
- Each guide → 3 related guides
- Footer on every page → 14 platform pages + 4 SEO landing pages

Next move: **add contextual in-content links**. In every guide, when
"YouTube" is mentioned, link the first instance to `/youtube-downloader`.
Same for Instagram, TikTok, etc. This is high-impact and we should
script it (see `scripts/contextual-links.mjs` template).

### 3.2 The "history-making" differentiator: Trending Probe Index

This is the radical white-hat tactic. Save47's API already collects
which video URLs are being probed (in Redis, behind admin auth).
We expose a **public** `/trending` page that shows the most-popular
videos people are downloading right now (anonymized, top-level domain
counts only — never specific user data).

**Why it works:**
- Each trending video gets a real `VideoObject` JSON-LD schema with
  title, thumbnail, duration, uploader pulled from yt-dlp's metadata.
- Google indexes these as rich-result-eligible video pages.
- The page self-refreshes every hour with the freshest content the
  internet is currently consuming — Google's freshness algorithm
  prioritizes this kind of "recency" signal heavily.
- It captures long-tail traffic ("download <famous video name>") that
  no static page can target.
- Privacy-respecting: we expose only video URLs and anonymous counts,
  never IPs, sessions, or personally identifiable info.

**Implementation outline** (build this in week 2):
1. Add `/trending` route in `apps/web/app/trending/page.tsx`
2. Backend exposes `/v1/trending?limit=50` (already partially there
   in metrics service — extend to surface URLs).
3. The trending page renders a list of cards: thumbnail, title, "save
   this video" button → links to homepage with URL prefilled.
4. Each card has VideoObject JSON-LD inline.
5. ISR: revalidate every 1 hour (`export const revalidate = 3600`).
6. Privacy review: only top-level domains exposed in counts; URLs are
   only shown if they're public + the publisher's robots.txt allows it.

**No competitor does this** because they don't have the API
infrastructure. It's not a hack — it's surfacing data we already
collect, in a way that's useful to humans (discovering what's trending)
and SEO-magnetic (real, fresh, structured content).

### 3.3 E-E-A-T signals

- **Experience**: write an "About" page with the founder's name and
  background.
- **Expertise**: each guide already has author + date + Article
  schema. Strong.
- **Authoritativeness**: pursue 3-5 backlinks from coding/dev blogs
  (post the open-source repo on Hacker News, Lobsters, IndieHackers).
- **Trustworthiness**: HTTPS ✓, privacy policy ✓, DMCA contact ✓,
  open source ✓. We are already strong here.

### 3.4 Content velocity

Google's freshness algorithm rewards consistent updates. Target:
- 1 new guide every 2 weeks
- Update each existing guide's "Updated:" date once per quarter
- Refresh the homepage hero copy seasonally (small change is enough
  to trigger re-crawl)

### 3.5 Backlink outreach (the 25-year insider playbook)

The guide structure was deliberately chosen to attract these
backlinks naturally. Specifically:
- "Best video downloader 2026" — gets cited by people writing
  "best of" lists.
- "Is it legal to download YouTube videos?" — gets cited by people
  writing legal explainers.
- "Safe video downloader" — gets cited by security blogs.

Outreach template (use sparingly, only with sites that genuinely
match):
```
Subject: Resource for your <article topic>

Hi <name>,

I've been reading <site>'s coverage of <topic> and I noticed you
linked to <competitor> for <specific anchor>. Save47 has a more
recent breakdown that doesn't have ads or trackers — would you
consider linking to it instead/as well?

Link: https://save47.com/<relevant-page>

We're open source if it matters: <github>

— <your name>, Save47
```

Do not buy backlinks. Do not exchange backlinks. Do not use private
blog networks. All of those will get a manual action and tank the
domain. The above outreach is the only durable approach.

---

## Reference: what's already shipped

### Pages live on save47.com

**Core**:
- `/` — homepage with downloader, FAQ, popular platforms grid
- `/all-platforms` — directory of every supported platform
- `/online-video-downloader`, `/free-video-downloader`,
  `/hd-video-downloader` — fat-head keyword landing pages
- `/api`, `/pricing`, `/download/apk`, `/compare`, `/guides`

**Platform-specific (15 pages)**:
- YouTube: `/youtube-downloader`, `/youtube-mp4-downloader`,
  `/youtube-to-mp3`, `/youtube-shorts-downloader`
- Instagram: `/instagram-reel-downloader`, `/instagram-video-downloader`
- TikTok: `/tiktok-downloader`
- Facebook: `/facebook-video-downloader`
- Twitter / X: `/twitter-video-downloader`
- Reddit: `/reddit-video-downloader`
- SoundCloud: `/soundcloud-downloader`
- Pinterest: `/pinterest-video-downloader`
- Vimeo: `/vimeo-downloader`
- Twitch: `/twitch-clip-downloader`
- Dailymotion: `/dailymotion-downloader`

**Guides (9 articles, 800-1500 words each, full Article schema)**:
- iPhone, Android, MP3-quality, Instagram-photos,
  best-downloader, legal, safe-downloader, Reels, TikTok-watermark.

**Total indexable URLs**: ~37 (will grow to 50+ as we add more guides
and the Trending page).

### Schemas implemented (Schema.org JSON-LD)

| Schema | Where | Purpose |
|---|---|---|
| `WebSite` (with `SearchAction`) | every page | Sitelinks searchbox in Google |
| `Organization` (with `@id`, contactPoint) | every page | Knowledge graph entity |
| `BreadcrumbList` | every non-home page | Breadcrumb-trail in SERPs |
| `SoftwareApplication` | home + platform pages | Star ratings + "free" badge |
| `FAQPage` | home + platform pages + guides | FAQ rich result |
| `HowTo` | every platform page | "How to" step-by-step rich result |
| `Article` | every guide | Article rich result with date/author |
| `Blog` + `BlogPosting` | guides listing | Blog-level rich result |
| `ItemList` | homepage popular grid | Carousel-eligible |

All schemas use `@id` references so Google sees `Organization`,
`WebSite`, and `Article` as one connected entity — that's the knowledge-
graph pattern that makes Google treat the site as authoritative.

### Technical SEO

- ✅ `metadataBase` set to production URL
- ✅ Canonical URL on every page
- ✅ `hreflang` (`en-US` + `x-default`)
- ✅ Robots.txt allows `/`, blocks `/admin`, `/api/probe`, `/og`,
  blocks `GPTBot`/`ChatGPT-User`/`CCBot`/`anthropic-ai`/`Claude-Web`
- ✅ Image-aware sitemap with 4-way split
- ✅ `humans.txt`, `security.txt` (RFC 9116)
- ✅ IndexNow key for Bing/Yandex auto-pinging
- ✅ AVIF/WebP image format
- ✅ HTTP compression, no `X-Powered-By` leak
- ✅ Strong CSP-friendly headers (Permissions-Policy,
  Referrer-Policy, X-Frame-Options, X-Content-Type-Options)
- ✅ Cache-Control: long for `/og`, medium for sitemap/robots
- ✅ Preconnect + dns-prefetch to Railway API host

### Content strategy

- ✅ Topical authority hub: `/all-platforms` + 14 platform pages +
  9 guides + 4 SEO landing pages all interlinked
- ✅ Internal linking: every page has 3+ related-content links
- ✅ Footer with 14 platform downloaders on every page
- ✅ Header with primary nav (Pricing, API, APK)
- ✅ Open Graph + Twitter Cards on every page (custom OG images
  generated dynamically via `/og`)

---

## Quick reference: where things live in code

| What | File |
|---|---|
| Site-wide schemas + brand info | `apps/web/lib/seo.ts` |
| Page metadata helper | `apps/web/lib/seo.ts → pageMetadata()` |
| Sitemap generator (multi-split) | `apps/web/app/sitemap.ts` |
| Robots policy | `apps/web/app/robots.ts` |
| Layout + meta tags | `apps/web/app/layout.tsx` |
| Platform landing template | `apps/web/components/seo/PlatformLandingPage.tsx` |
| FAQ data | `apps/web/lib/faq.ts` |
| Guides data | `apps/web/lib/guides.ts` |
| Footer (internal linking) | `apps/web/components/layout/Footer.tsx` |
| OG image generator | `apps/web/app/og/route.tsx` |
| IndexNow ping script | `apps/web/scripts/indexnow-ping.mjs` |
| IndexNow verification key | `apps/web/public/save47-indexnow-key.txt` |
| Manifest + PWA | `apps/web/public/manifest.json` |
| humans.txt | `apps/web/public/humans.txt` |
| security.txt | `apps/web/public/.well-known/security.txt` |
