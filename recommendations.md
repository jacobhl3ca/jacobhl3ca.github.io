# jacobhl.com — Recommendations

Things to consider for future improvements. Not bugs — these are enhancements.

---

## 1. Add newer projects (Cellar Tonight, Subway Times)
Cellar Tonight and Subway Times are both actively maintained, deployed apps — but neither appears on the site. These are your most impressive live projects and would strengthen the portfolio significantly.

## ~~2. Trim the About section copy~~ ✓ Done
Completed 2026-03-27. V1 (original) and V2 (first draft) preserved as HTML comments. V3 (active) uses "hundreds of thousands of hours and dollars".

## 3. Make project tiles clickable
All the `<a href="">` links around project images are commented out. Visitors can't click through to see the actual projects. At minimum, link to the public GitHub repos (Spotify Analytics, Safari Unpinner, etc.).

## ~~4. Move inline JS to main.js~~ ✓ Done
Completed 2026-03-27. ~476 lines moved to `assets/js/main.js`. Only scroll-restoration snippet stays inline.

## ~~5. Remove duplicate image assets~~ ✓ Done
Completed 2026-03-27. Deleted `preview.png` (identical to `og_image.png`). Kept `og_image_centered.png` (different file, used by `light/index.html`).

## 6. Add resume download or link
The resume icon scrolls to contact and pre-fills a message asking for the resume. Consider adding a direct PDF download or at least making it clearer what the icon does (tooltip, etc.).
