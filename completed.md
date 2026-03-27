# jacobhl.com — Completed Fixes

Log of fixes applied to the site.

---

## 2026-03-27 — Code review and cleanup

### 1. Removed .DS_Store files from repo
- Removed `.DS_Store` from root, `assets/`, `assets/css/`, `assets/img/`
- Added `.gitignore` to prevent them from being re-committed

### 2. Replaced deprecated `<center>` tags
- Removed all 15 `<center>` / `</center>` tag pairs from `index.html` (active and commented-out project sections)
- Added `text-align: center` to `.work__description` in `styles.css`

### 3. Fixed OG image URLs
- Changed `og:image` and `twitter:image` meta tags from `https://jacobhl3ca.github.io/...` to `https://jacobhl.com/...` so social previews use the correct domain

### 4. Removed unused scrollReveal from 404.html
- Removed `<script src="https://unpkg.com/scrollreveal">` — was loaded but never used on the 404 page

### 5. Removed commented-out Plausible analytics
- Deleted the commented-out Plausible script block that referenced internal NAS IP `192.168.99.97:8001` — prevents accidental uncommenting from leaking internal network info

### 6. Fixed email obfuscation in 404.html
- Replaced plain `mailto:hi@jacobhl.com` with the same JS string-concatenation approach used in `index.html` to deter email scrapers

### 7. Added `rel="noopener noreferrer"` to external links
- Added to all LinkedIn and GitHub links in both `index.html` and `404.html`
- Removed unnecessary `target="_blank"` from email/contact links (they use `onclick` and don't open new tabs)
- Added missing `aria-label` attributes to 404.html footer links

### 8. Added JSON-LD structured data
- Added `Person` schema markup to `index.html` `<head>` with name, job title, description, social links, education, and skills
- Helps Google show a rich result when someone searches "Jacob Heifetz-Licht"
- Added `<link rel="canonical">` pointing to `https://jacobhl.com`

### 9. Created sitemap.xml
- Single-URL sitemap pointing to `https://jacobhl.com/`
- Helps search engines discover and index the site

### 10. Created robots.txt
- Allows all crawlers, points to sitemap
- Basic SEO hygiene for any public site

### 11. Added GoatCounter analytics
- Added GoatCounter script tag to both `index.html` and `404.html`
- Dashboard at `jacobhl.goatcounter.com`
- Privacy-friendly, no cookies, open source, free tier (100k views/month)
- Note: adblockers may block `goatcounter.com` / `gc.zgo.at` domains
