# ToolNova

Free, browser-based online tools — PDF, image, text, developer, color, QR and calculator utilities. No backend beyond static file hosting, no paid APIs. Everything that isn't marked "coming soon" actually works.

## Project structure

```
toolnova/
├── index.html                 Homepage
├── tools.html                  All 34 tools (this is the main app)
├── blog.html                    Blog index — loads posts live from content/blog/
├── blog-post.html                Article template — renders any post via ?slug=
├── blog-*.html                    Old article URLs — now redirect to blog-post.html
├── about.html / contact.html / privacy.html / terms.html
├── icon-export.html              Internal-only tool to export favicons + social image (noindexed)
├── admin/                         Decap CMS admin panel
│   ├── index.html
│   └── config.yml
├── content/                       CMS-managed content (edited via /admin, or by hand)
│   ├── blog/*.json                 One file per blog post
│   └── settings/ads.json            Ad codes for every placement
├── robots.txt / sitemap.xml
├── netlify.toml                   Headers + caching config
├── BRAND-GUIDELINES.md
└── assets/
    ├── style.css                   All design tokens + components
    ├── config.js                    Your GitHub owner/repo — fill in after deploying
    ├── cms-loader.js                 Fetches blog posts + ad settings from GitHub
    ├── main.js                       Theme toggle, nav, FAQ, toasts, search index
    ├── tools.js                      All tool logic
    └── logo-*.svg                    Brand marks (dark/light/icon-only)
```

No build step. It's static HTML/CSS/JS — open `index.html` directly, or serve the folder with any static host. The blog and ads are the one part that needs the real GitHub repo to be live (see below) — everything else works instantly.

## Deploying (GitHub + Netlify)

I can't push to your GitHub or log into your Netlify from this sandbox — that needs your credentials. Here's the exact path, matching how your other projects (Ink & Ayaat, AL SYED FRAGRANCE) are set up:

1. **Create the repo** (if it doesn't exist yet):
   ```bash
   cd toolnova
   git init
   git add .
   git commit -m "ToolNova — initial build"
   git branch -M main
   git remote add origin https://github.com/<your-username>/toolnova.git
   git push -u origin main
   ```
2. **Connect to Netlify:** New site from Git → pick the repo → build command: *none* → publish directory: `.` (root). Netlify will pick up `netlify.toml` automatically.
3. **Custom domain (optional):** Netlify → Domain settings → add your domain, update DNS as instructed.
4. Once live, update the `https://toolnova.app/` URLs in `sitemap.xml` and every page's `<link rel="canonical">` / Open Graph tags to your real domain — they're currently placeholders.

## Setting up the CMS (Decap)

This is what lets you add, edit, or delete blog posts and ad codes from a visual panel at `yoursite.com/admin/`, instead of touching code — same pattern as your other projects.

1. **Deploy the repo first** (steps above) — the CMS needs a live Netlify site to attach to.
2. **Enable Identity:** Netlify site dashboard → Identity → Enable Identity.
3. **Restrict signups:** Identity → Settings → set registration to "Invite only" (so strangers can't create themselves an account).
4. **Enable Git Gateway:** Identity → Services → Git Gateway → Enable. This lets the CMS commit to your repo on your behalf without you managing a GitHub token.
5. **Invite yourself:** Identity → Invite users → enter your email → accept the invite email → set a password.
6. **Fill in `assets/config.js`** with your GitHub username and repo name, commit, and push. This is what lets `blog.html` and `blog-post.html` fetch content.
7. **Go to `yoursite.com/admin/`**, log in, and you'll see two sections: **Blog Posts** and **Site Settings**.

**Editing blog posts:** Add, edit, or delete posts from the Blog Posts collection. Each post has a title, URL slug, excerpt, meta description, read time, a markdown body editor, optional FAQ entries, and optional related-tool links. To add an image, use the image field on the post (or embed one inline in the markdown body) — uploads go to `assets/uploads/` in your repo automatically.

**Editing ad codes:** Go to Site Settings → Ad Codes. Paste your Adsterra (or any network's) `<script>` snippet into any of the seven placements — header, below-hero, between tool cards, inside blog content, end of blog post, sidebar, footer. Leave a field blank and that spot shows nothing (not even the placeholder — it's designed to fail gracefully). Saving updates `content/settings/ads.json`, and every page picks up the new code on next load.

**One known limitation:** `sitemap.xml` is a static file — it won't automatically pick up new blog posts you publish through the CMS. Add new post URLs to it by hand (`blog-post.html?slug=your-slug`) after publishing, or treat this as a future automation task (a Netlify Function or scheduled build could regenerate it).

**CMS version note:** `admin/index.html` is pinned to Decap CMS 3.1.2 — a newer version caused a white-screen issue on a previous project. Only bump this deliberately, and test the admin panel after doing so.

## Icons and social image

`icon-export.html` is a working in-browser tool (open it in any browser, no install needed) that renders the SVG logo to canvas and gives you real downloadable PNGs: favicons (16/32/48px), Apple touch icon (180px), Android/PWA icons (192/512px), an app-store-ready 1024px icon, and a 1200×630 Open Graph share image.

To wire them in: download the files into `assets/icons/`, then add to each page's `<head>`:
```html
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon-180.png">
```
and swap the `og:image` / `twitter:image` meta values to point at `assets/icons/og-image.png` once uploaded somewhere with a public URL (Netlify will do this automatically after deploy).

## What's real vs. what's intentionally not built

**Working (34 tools):** all Text, Developer, Color, and Calculator tools; Merge/Split/Rotate/Compress PDF; Image to PDF; Image Compress/Resize/Crop/Rotate/Convert; QR Generate + Scan (upload and live camera). File inputs reset themselves after each successful action so the UI is ready for the next file.

**Working (content):** blog posts and ad codes are both live-editable from `/admin/` once the CMS setup above is done — no code changes needed for either.

**Not built — by choice, not oversight:**
- **Word ↔ PDF** — needs a real document-rendering engine; nothing reliable runs fully client-side yet
- **PDF Unlock / Protect** — needs actual encryption handling; out of scope for a static site without a backend

If you want Word↔PDF or PDF encryption eventually, the honest options are: a small serverless function (Netlify Functions) calling a real conversion library, or a paid conversion API — both are backend work, which breaks the "no backend" constraint from the original brief. Worth a conversation before building either.

## SEO status

Meta titles/descriptions, canonical URLs, Open Graph, Twitter Cards, JSON-LD (Organization, WebSite, FAQPage, Article, BreadcrumbList) are in place on the homepage, tools hub, and all blog posts (generated dynamically per-post on `blog-post.html`). `robots.txt` and `sitemap.xml` exist and list every current page, and `/admin/` is disallowed from indexing. Not yet done: Google Search Console verification, keeping `sitemap.xml` in sync with new CMS posts (see CMS section above), and a Lighthouse/Core Web Vitals pass (can only be measured once the site is actually deployed).
