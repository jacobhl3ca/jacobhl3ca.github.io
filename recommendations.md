# jacobhl.com — Recommendations

Things to consider for future improvements. Not bugs — these are enhancements.

---

## 1. Add newer projects (Cellar Tonight, Subway Times)
Cellar Tonight and Subway Times are both actively maintained, deployed apps — but neither appears on the site. These are your most impressive live projects and would strengthen the portfolio significantly.

## 2. Trim the About section copy
Phrases like "geek out on blending my technical chops" and emojis read more LinkedIn than personal site. A shorter, more direct version would hit harder. Consider dropping the emojis and trimming to 2 concise paragraphs.

## 3. Make project tiles clickable
All the `<a href="">` links around project images are commented out. Visitors can't click through to see the actual projects. At minimum, link to the public GitHub repos (Spotify Analytics, Safari Unpinner, etc.).

## 4. Move inline JS to main.js
There are ~500 lines of inline JS in `index.html` (confetti, code snippets, mega-explosion, auto-fire, scroll buttons). Moving this to `assets/js/main.js` would clean up the HTML and make it easier to maintain.

## 5. Remove duplicate image assets
- `preview.png` in root is identical to `assets/img/og_image.png` (same 205KB file)
- `og_image.png` and `og_image_centered.png` both exist — pick one and delete the other

## 6. Add resume download or link
The resume icon scrolls to contact and pre-fills a message asking for the resume. Consider adding a direct PDF download or at least making it clearer what the icon does (tooltip, etc.).
