# jacobhl.com

Personal portfolio site for Jacob Heifetz-Licht — analytics manager and web/app
developer in New York. Hand-built with plain HTML, CSS, and JavaScript and served
as static files from GitHub Pages. No framework, no build step.

**Live at [jacobhl.com](https://jacobhl.com)**

## What's here

- **Portfolio homepage** (`index.html`) — a projects-first view of the apps and
  sites Jacob has shipped (HideScore, Tonight NYC, Subway Times, The Island,
  TidyTab, and more), each with an in-page live-preview modal, plus
  about, skills, and a contact form.
- **Weather dashboard** (`weather/`) — a single-page live weather app for any
  city, powered by the Open-Meteo API: current conditions, hourly rain chance,
  a 5-day forecast, air quality, and sun times.
- **Retired stub** (`building.html`) — a former offer page, now a noindex redirect
  to the homepage so old printed-QR links don't 404. Retired 2026-09-07; see the
  guard comment in the file before changing it.
- **Referral links** (`refer/`) — services Jacob uses, with referral links.

## Notes

- Light and dark themes, with the choice remembered across visits.
- Mobile-first, responsive layout.
- Built with an eye on accessibility (landmarks, ARIA, keyboard focus,
  reduced-motion), performance (resource hints, lazy media, WebP thumbnails),
  and SEO (structured data, Open Graph, sitemap, canonical URLs).
