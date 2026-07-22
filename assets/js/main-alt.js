/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        // The toggle is a div[role=button]; make it keyboard-operable and announce its open/closed state.
        if(!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', '0')
        toggle.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false')
        const toggleMenu = ()=>{
            const open = nav.classList.toggle('show')
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
        }
        toggle.addEventListener('click', toggleMenu)
        toggle.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault()
                toggleMenu()
            }
        })
        // Escape closes the open menu and returns focus to the toggle (disclosure-widget
        // convention), so a keyboard/mobile user who opened it can dismiss without tabbing
        // through every link. No-op when the menu is closed. Mirrors the preview modal's Esc-to-close.
        document.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape' && nav.classList.contains('show')){
                nav.classList.remove('show')
                toggle.setAttribute('aria-expanded', 'false')
                toggle.focus()
            }
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*===== SAFE localStorage =====*/
// Some browsers throw on localStorage access (Safari private mode throws on
// setItem; disabled cookies make even reading it raise SecurityError). Wrap
// reads/writes so a storage failure never breaks the theme/view code below.
const safeGetItem = (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
const safeSetItem = (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable — ignore */ }
}

/*===== PASSWORD MODAL (commented out — kept for reference) =====*/
/*
function showPasswordModal(type) {
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('passwordError');

    modal.style.display = 'block';
    input.value = '';
    error.style.display = 'none';
    input.focus();

    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    };
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
}

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('passwordError');
    const password = input.value.trim();

    const encodedPassword = 'aG9wZV95b3VfZW5qb3kh';
    const correctPassword = atob(encodedPassword);

    if (password === correctPassword) {
        const resumeUrl = 'assets/resume/Jacob_Heifetz_Licht_Resume.pdf';
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'Jacob_Heifetz_Licht_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closePasswordModal();
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
        input.style.animation = 'shake 0.5s';
        setTimeout(() => { input.style.animation = ''; }, 500);
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('passwordModal');
    if (event.target === modal) {
        closePasswordModal();
    }
}
*/

/*===== VIEW PILL (projects-only / full site) =====*/
const viewPill = document.getElementById('view-pill');
if (viewPill) {
    const pillBtns = viewPill.querySelectorAll('.view-pill__btn');
    const applyView = (mode) => {
        const projectsOnly = mode !== 'full';
        document.documentElement.classList.toggle('projects-only', projectsOnly);
        pillBtns.forEach((b) => {
            const active = (b.dataset.view === 'full') ? !projectsOnly : projectsOnly;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    };
    // Default = projects-only; honor saved preference.
    // Also honor an incoming deep link: #home/#about/#skills/#contact are display:none in
    // projects-only view (see styles.css), so arriving at /#about (e.g. from the 404 page's
    // nav, the sitemap, or a shared link) would otherwise land in the projects view with the
    // anchor pointing at a hidden element — the visitor never reaches the section. If the hash
    // targets one of those full-view-only sections, start in full view and scroll to it (the
    // browser already tried to resolve the anchor against the then-hidden element, so it won't
    // scroll on its own). #Projects stays visible in projects-only, so it needs none of this.
    var hashId = (location.hash || '').slice(1);
    var fullOnlySection = { home: 1, about: 1, skills: 1, contact: 1 };
    var deepLink = hashId && fullOnlySection[hashId];
    applyView((deepLink || safeGetItem('viewMode') === 'full') ? 'full' : 'projects');
    if (deepLink) {
        var deepTarget = document.getElementById(hashId);
        // Plain scrollIntoView() (no behavior override) honors the CSS scroll-behavior, which is
        // set to auto under prefers-reduced-motion — so this stays reduced-motion-safe.
        if (deepTarget) deepTarget.scrollIntoView();
    }
    pillBtns.forEach((b) => b.addEventListener('click', () => {
        const mode = b.dataset.view === 'full' ? 'full' : 'projects';
        safeSetItem('viewMode', mode);
        applyView(mode);
        b.blur();
        if (mode === 'full') window.scrollTo(0, 0);
    }));
}

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const currentTheme = safeGetItem('theme');

// Swap project images based on theme
function setThemeImages(theme) {
    document.querySelectorAll('img[data-dark][data-light]').forEach(img => {
        img.src = theme === 'light' ? img.dataset.light : img.dataset.dark;
        if (img.style.background) {
            img.style.background = theme === 'light' ? '#ffffff' : '#121212';
        }
    });
}

// Warm the OTHER theme's project images so the first toggle is instant.
// setThemeImages() only reassigns src; if the incoming file has never been fetched the
// browser keeps painting the old frame until it downloads and decodes — measured at ~370ms
// cold vs ~10ms warm across the ten cards. The alternates are now 640px WebP thumbs
// (~110 KB for the whole set), so prefetching them on idle costs little; do it after load
// so it never competes with the visible theme's images, and skip it when the visitor has
// asked us to conserve (Save-Data / 2g).
function warmOtherTheme() {
    const c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
    const other = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('img[data-dark][data-light]').forEach(img => {
        const href = img.dataset[other];
        if (href) new Image().src = href;   // fetch + decode into cache; never enters the DOM
    });
}
// requestIdleCallback's 2nd arg is an options object, not a delay — the two APIs are not
// interchangeable, so branch instead of picking whichever exists.
const scheduleWarm = () => window.requestIdleCallback
    ? window.requestIdleCallback(warmOtherTheme, { timeout: 3000 })
    : window.setTimeout(warmOtherTheme, 1200);
if (document.readyState === 'complete') scheduleWarm();
else window.addEventListener('load', scheduleWarm, { once: true });

// Keep the mobile address-bar colour (theme-color meta) in sync with the active
// theme — the light header is #fff, the dark page bg is #090f20.
function setThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#090f20');
}

// HTML now defaults to LIGHT (no data-theme) + moon icon; only switch to dark if user previously chose dark.
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.classList.replace('bx-moon', 'bx-sun');
    if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    setThemeImages('dark');
    setThemeColor('dark');
} else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.classList.replace('bx-sun', 'bx-moon');
    if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    setThemeImages('light');
    setThemeColor('light');
}

// Guard the toggle wiring: this block runs first in main.js, so an uncaught throw here
// (were the toggle markup ever renamed/removed) would halt the rest of the file — nav,
// scroll reveal, contact-form submit, scroll arrows. Every other DOM dependency below is
// already guarded this way; the toggle exists on every page that loads main.js today, so
// this is purely defensive with no behavior change.
if (themeToggle) themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    root.classList.add('theme-switching'); // make the swap instant (no color-transition lag)
    const currentTheme = root.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('bx-sun', 'bx-moon');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        safeSetItem('theme', 'light');
        setThemeImages('light');
        setThemeColor('light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        safeSetItem('theme', 'dark');
        setThemeImages('dark');
        setThemeColor('dark');
    }
    themeToggle.blur();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
});

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
    // Keep the toggle's announced state in sync now that the menu is closed.
    const navToggle = document.getElementById('nav-toggle')
    if(navToggle) navToggle.setAttribute('aria-expanded', 'false')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== REDUCED MOTION (programmatic scrolling) ====================*/
// scrollIntoView/scrollTo with an explicit behavior:'smooth' override the CSS
// scroll-behavior:auto we set under prefers-reduced-motion, so resolve it in JS
// too — otherwise reduced-motion users still get animated scrolling.
const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              // Exact-hash match (href="#id"), not a substring match (href*="id"): the nav link for
              // each section is its "#id" anchor, so exact matching is what's meant. Substring
              // matching silently mis-targets if one section id ever becomes a substring of another
              // (e.g. a future "#skills-detail" alongside "#skills") — a hard-to-spot highlight bug.
              // Behaviour is identical for the current ids; this only removes that latent footgun.
              sectionsClass = document.querySelector('.nav__menu a[href="#' + sectionId + '"]')

        // Some sections (e.g. the hidden "ccu" section) have no matching nav link.
        if(!sectionsClass){ return }

        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
            // aria-current="location", not "page": these nav links are in-page anchors (#home, #about,
            // …) and this is scroll-spy highlighting of the section currently in view. Per ARIA, "page"
            // means the current page within a SET of pages (breadcrumb / multi-page nav) — a screen
            // reader announces it as "current page", which misdescribes an in-document position. The
            // "location" token is defined for exactly this case ("current location within a scrolling
            // context"), so it announces the section as the current location without implying page
            // navigation. Both are valid aria-current tokens; behaviour is otherwise identical. Mirrors
            // the same fix already in main.js (this file, main-alt.js, is the homepage's active script).
            sectionsClass.setAttribute('aria-current', 'location') // tell assistive tech which section is current
        }else{
            sectionsClass.classList.remove('active-link')
            sectionsClass.removeAttribute('aria-current')
        }
    })
}
// rAF-throttle the scroll-spy. scrollActive reads each section's offsetTop/offsetHeight (a
// synchronous layout read) in a loop, and the scroll event can fire many times per animation
// frame — so calling it raw forces repeated layout on the scroll path (jank on long/low-end
// scrolls). Coalesce to at most one run per painted frame with a ticking guard: the highlighted
// section is identical (recomputed once each frame the browser will actually paint), only the
// redundant same-frame recomputations are dropped. The direct call below still sets the initial
// top-of-page state before any scroll fires.
let scrollActiveTicking = false
window.addEventListener('scroll', () => {
    if (scrollActiveTicking) return
    scrollActiveTicking = true
    requestAnimationFrame(() => { scrollActive(); scrollActiveTicking = false })
}, { passive: true })
scrollActive() // reflect the initial (top-of-page) active section for assistive tech

/*===== SCROLL REVEAL CASCADE =====*/
const revealElements = document.querySelectorAll(
  '.section-title, .about__img, .about__subtitle, .about__text, ' +
  '.skills__subtitle, .skills__text, .skills__category, ' +
  '.work__img, ' +
  '.contact__input, .contact__button'
);

// Only run the hide-then-reveal enhancement when IntersectionObserver is available. Adding the
// .reveal class sets opacity:0, and the observer is what adds .visible to fade each element in —
// so if the observer is missing (unsupported browsers) or its construction throws, that .visible
// is never applied and the reveal content (section titles, about/skills text, contact form) would
// stay permanently invisible. Worse, an uncaught throw here at top level would halt the rest of
// main.js below (contact-form submit, scroll arrows, live-dot observer). Guard the whole block so
// unsupported browsers simply keep the default visible layout. Mirrors the live-dot observer's
// feature guard further down; no change in modern browsers.
if ('IntersectionObserver' in window) {
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Stagger siblings so they cascade
  let lastParent = null;
  let staggerIndex = 0;
  revealElements.forEach(el => {
    if (el.parentElement !== lastParent) {
      lastParent = el.parentElement;
      staggerIndex = 0;
    }
    el.style.transitionDelay = (staggerIndex * 0.1) + 's';
    staggerIndex++;
    revealObserver.observe(el);
  });
}

/*===== IMAGE CLICK EFFECTS (confetti, bursts, mega-explosion) =====*/
function spawnConfetti(x, y, count) {
    const colors = ['#6c63ff', '#ff6584', '#43e97b', '#f9d423', '#00d2ff', '#ff4e50', '#fc5c7d', '#4361ee'];
    const shapes = ['circle', 'square', 'triangle'];
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.classList.add('confetti-piece');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 6 + Math.random() * 10;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.background = color;
        if (shape === 'circle') el.style.borderRadius = '50%';
        else if (shape === 'triangle') {
            el.style.width = '0'; el.style.height = '0';
            el.style.background = 'transparent';
            el.style.borderLeft = size/2 + 'px solid transparent';
            el.style.borderRight = size/2 + 'px solid transparent';
            el.style.borderBottom = size + 'px solid ' + color;
        }
        document.body.appendChild(el);
        const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.8;
        const distance = 120 + Math.random() * 200;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 80;
        const spin = (Math.random() - 0.5) * 1080;
        const duration = 800 + Math.random() * 600;
        el.animate([
            { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' },
            { opacity: 0.8, transform: `translate(${dx*0.4}px, ${dy*0.3}px) rotate(${spin*0.4}deg) scale(1.1)`, offset: 0.3 },
            { opacity: 0, transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg) scale(0.2)` }
        ], { duration: duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });
        setTimeout(() => el.remove(), duration + 100);
    }
}

function wiggleElement(el) {
    el.style.transition = 'transform 0.1s ease';
    const steps = [
        'rotate(3deg) scale(1.05)',
        'rotate(-3deg) scale(1.05)',
        'rotate(2deg) scale(1.03)',
        'rotate(-2deg) scale(1.03)',
        'rotate(0deg) scale(1)',
    ];
    let i = 0;
    const interval = setInterval(() => {
        if (i >= steps.length) { clearInterval(interval); el.style.transition = ''; el.style.transform = ''; return; }
        el.style.transform = steps[i]; i++;
    }, 80);
}

let confettiClickCount = 0;

const burstStyles = [
    { name: 'starburst', colors: ['#FFD700', '#FF4500', '#FF6347', '#FFA500', '#FFFF00'], shape: 'star', glow: true },
    { name: 'hearts', colors: ['#FF1493', '#FF69B4', '#FF007F', '#DC143C', '#FF4081'], shape: 'heart', glow: false },
    { name: 'neon', colors: ['#00FF41', '#00FFFF', '#FF00FF', '#FFFF00', '#7B68EE'], shape: 'circle', glow: true },
    { name: 'firework', colors: ['#FF0000', '#FF7700', '#FFFF00', '#FFFFFF', '#00BFFF'], shape: 'spark', glow: true },
    { name: 'confetti-rain', colors: ['#6c63ff', '#ff6584', '#43e97b', '#f9d423', '#fc5c7d'], shape: 'rect', glow: false },
    { name: 'galaxy', colors: ['#9B59B6', '#3498DB', '#1ABC9C', '#E8DAEF', '#AED6F1'], shape: 'circle', glow: true },
    { name: 'fire', colors: ['#FF4500', '#FF6600', '#FF8C00', '#FFD700', '#FFF8DC'], shape: 'triangle', glow: true },
    { name: 'ocean', colors: ['#006994', '#00CED1', '#20B2AA', '#48D1CC', '#AFEEEE'], shape: 'circle', glow: true },
    { name: 'rainbow', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'], shape: 'mixed', glow: false },
];

function spawnBurst(x, y, style) {
    const count = 60 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.classList.add('confetti-piece');
        const color = style.colors[Math.floor(Math.random() * style.colors.length)];
        const size = 6 + Math.random() * 12;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.background = color;
        if (style.glow) el.style.boxShadow = `0 0 ${size}px ${color}`;

        const s = style.shape === 'mixed' ? ['circle','square','triangle'][i%3] : style.shape;
        if (s === 'circle') el.style.borderRadius = '50%';
        else if (s === 'star') el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        else if (s === 'heart') el.style.clipPath = 'polygon(50% 85%, 15% 45%, 0% 25%, 5% 5%, 25% 0%, 50% 20%, 75% 0%, 95% 5%, 100% 25%, 85% 45%)';
        else if (s === 'spark') { el.style.width = '2px'; el.style.height = (size*1.5)+'px'; el.style.borderRadius = '1px'; }
        else if (s === 'rect') { el.style.width = (size*0.4)+'px'; el.style.height = (size*1.2)+'px'; }
        else if (s === 'triangle') { el.style.background = 'transparent'; el.style.borderLeft = size/2+'px solid transparent'; el.style.borderRight = size/2+'px solid transparent'; el.style.borderBottom = size+'px solid '+color; }

        document.body.appendChild(el);
        const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.8;
        const distance = 150 + Math.random() * 250;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 100;
        const spin = (Math.random() - 0.5) * 1440;
        const duration = 1000 + Math.random() * 800;
        el.animate([
            { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' },
            { opacity: 1, transform: `translate(${dx*0.5}px, ${dy*0.3}px) rotate(${spin*0.5}deg) scale(1.3)`, offset: 0.35 },
            { opacity: 0, transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg) scale(0.1)` }
        ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });
        setTimeout(() => el.remove(), duration + 100);
    }
}

function megaExplosion() {
    const overlay = document.createElement('div');
    // Decorative easter-egg flourish: hide the "MEGA-EXPLOSION" text from assistive tech so a
    // screen reader doesn't announce it. Matches the site-wide convention of aria-hidden on every
    // decorative element (icons, arrows, spinner). The separate flash overlay carries no text.
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;display:flex;align-items:center;justify-content:center;';
    const text = document.createElement('div');
    text.textContent = 'MEGA-EXPLOSION';
    text.style.cssText = `
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: clamp(3rem, 12vw, 10rem);
        font-weight: 900;
        font-style: italic;
        color: #FF0000;
        text-shadow:
            0 0 20px #FF4500,
            0 0 40px #FFD700,
            0 0 80px #FF6347,
            4px 4px 0 #FFD700,
            -2px -2px 0 #FFA500;
        letter-spacing: 0.05em;
        -webkit-text-stroke: 2px #FFD700;
        opacity: 0;
        transform: scale(0.1) rotate(-10deg);
        white-space: nowrap;
    `;
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    text.animate([
        { opacity: 0, transform: 'scale(0.1) rotate(-10deg)', filter: 'blur(20px)' },
        { opacity: 1, transform: 'scale(1.15) rotate(2deg)', filter: 'blur(0px)', offset: 0.3 },
        { opacity: 1, transform: 'scale(1) rotate(0deg)', filter: 'blur(0px)', offset: 0.5 },
        { opacity: 1, transform: 'scale(1.05) rotate(-1deg)', filter: 'blur(0px)', offset: 0.7 },
        { opacity: 0, transform: 'scale(2) rotate(5deg)', filter: 'blur(10px)' }
    ], { duration: 2500, easing: 'ease-out', fill: 'forwards' });

    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;background:white;';
    document.body.appendChild(flash);
    flash.animate([
        { opacity: 0.8 },
        { opacity: 0 }
    ], { duration: 400, fill: 'forwards' });
    setTimeout(() => flash.remove(), 500);

    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const ox = cx + (Math.random() - 0.5) * window.innerWidth * 0.6;
            const oy = cy + (Math.random() - 0.5) * window.innerHeight * 0.4;
            spawnBurst(ox, oy, burstStyles[i % burstStyles.length]);
        }, i * 150);
    }

    setTimeout(() => overlay.remove(), 3000);
}

/*===== AUTO-FIRE: hold mousedown = accelerating confetti =====*/
function setupAutoFire(el) {
    if (!el) return; // photo only exists on the homepage
    let autoFireTimer = null;
    let autoFireDelay = 300;
    let mouseX = 0;
    let mouseY = 0;

    el.setAttribute('draggable', 'false');
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';

    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    el.addEventListener('touchmove', function(e) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        var target = document.elementFromPoint(mouseX, mouseY);
        if (!el.contains(target)) stopAutoFire();
    }, { passive: true });

    function fireOnce() {
        if (el.classList.contains('clickable-img')) {
            el.classList.toggle('bg-removed');
        }
        const centerX = mouseX;
        const centerY = mouseY;
        confettiClickCount++;

        if (confettiClickCount >= 100) {
            megaExplosion();
            confettiClickCount = 0;
            stopAutoFire();
            return;
        } else if (confettiClickCount % 10 === 0) {
            const tier = Math.floor(confettiClickCount / 10);
            const idx = (tier - 1) % burstStyles.length;
            const scaledCount = 60 + tier * 15;
            const scaledDist = 150 + tier * 30;
            spawnScaledBurst(centerX, centerY, burstStyles[idx], scaledCount, scaledDist);
        } else {
            spawnConfetti(centerX, centerY, 40);
        }
        wiggleElement(el);
        autoFireDelay = Math.max(40, autoFireDelay * 0.92);
        autoFireTimer = setTimeout(fireOnce, autoFireDelay);
    }

    function startAutoFire(e) {
        // Honor prefers-reduced-motion: the confetti/burst/mega-explosion effects run via the
        // Web Animations API, which the site's reduced-motion CSS can't disable, so gate them here.
        if (prefersReducedMotion()) return;
        e.preventDefault();
        e.stopPropagation();
        if (autoFireTimer) return;
        if (e.touches) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        } else {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
        autoFireDelay = 300;
        fireOnce();
    }

    function stopAutoFire() {
        clearTimeout(autoFireTimer);
        autoFireTimer = null;
    }

    el.addEventListener('mousedown', startAutoFire);
    el.addEventListener('touchstart', startAutoFire, { passive: false });
    window.addEventListener('mouseup', stopAutoFire);
    window.addEventListener('touchend', stopAutoFire);
    window.addEventListener('touchcancel', stopAutoFire);
    el.addEventListener('mouseleave', stopAutoFire);
    el.addEventListener('click', e => e.preventDefault());
}

function spawnScaledBurst(x, y, style, count, maxDist) {
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.classList.add('confetti-piece');
        const color = style.colors[Math.floor(Math.random() * style.colors.length)];
        const size = 6 + Math.random() * 14;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.background = color;
        if (style.glow) el.style.boxShadow = `0 0 ${size}px ${color}`;
        const s = style.shape === 'mixed' ? ['circle','square','triangle'][i%3] : style.shape;
        if (s === 'circle') el.style.borderRadius = '50%';
        else if (s === 'star') el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        else if (s === 'heart') el.style.clipPath = 'polygon(50% 85%, 15% 45%, 0% 25%, 5% 5%, 25% 0%, 50% 20%, 75% 0%, 95% 5%, 100% 25%, 85% 45%)';
        else if (s === 'spark') { el.style.width = '2px'; el.style.height = (size*1.5)+'px'; el.style.borderRadius = '1px'; }
        else if (s === 'rect') { el.style.width = (size*0.4)+'px'; el.style.height = (size*1.2)+'px'; }
        else if (s === 'triangle') { el.style.background = 'transparent'; el.style.borderLeft = size/2+'px solid transparent'; el.style.borderRight = size/2+'px solid transparent'; el.style.borderBottom = size+'px solid '+color; }
        document.body.appendChild(el);
        const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.8;
        const distance = maxDist + Math.random() * (maxDist * 0.6);
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 100;
        const spin = (Math.random() - 0.5) * 1440;
        const duration = 1000 + Math.random() * 800;
        el.animate([
            { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' },
            { opacity: 1, transform: `translate(${dx*0.5}px, ${dy*0.3}px) rotate(${spin*0.5}deg) scale(1.3)`, offset: 0.35 },
            { opacity: 0, transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg) scale(0.1)` }
        ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });
        setTimeout(() => el.remove(), duration + 100);
    }
}

setupAutoFire(document.getElementById('about-photo'));
setupAutoFire(document.getElementById('home-photo'));

/*===== CODE SNIPPET POPUPS (skills photo) =====*/
const codeSnippets = [
    'SELECT * FROM insights WHERE impact > 9000;',
    'import pandas as pd',
    'df.groupby("channel").agg({"revenue": "sum"})',
    'for row in dataset: optimize(row)',
    'CREATE VIEW kpi_dashboard AS ...',
    'plt.plot(dates, conversions, color="blue")',
    'docker compose up -d',
    'git push origin main',
    'def automate(boring_stuff):',
    'WHERE date BETWEEN @start AND @end',
    'pip install streamlit plotly',
    'tableau.publish(workbook, server)',
    'df["roi"] = df["revenue"] / df["cost"]',
    'spark.sql("SELECT COUNT(*) FROM events")',
    'echo "ETL pipeline complete"',
    'requests.get(api_endpoint).json()',
    'crontab -e  # schedule the magic',
    'ALTER TABLE metrics ADD COLUMN trend FLOAT;',
    'sns.heatmap(corr_matrix, annot=True)',
    'print("Hello, recruiter!")',
];
let codeIdx = 0;

(function() {
    const el = document.getElementById('skills-photo');
    if (!el) return; // photo only exists on the homepage
    let autoFireTimer = null;
    let autoFireDelay = 350;
    let mouseX = 0, mouseY = 0;

    el.setAttribute('draggable', 'false');
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';

    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    el.addEventListener('touchmove', function(e) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        var target = document.elementFromPoint(mouseX, mouseY);
        if (!el.contains(target)) stopAutoFire();
    }, { passive: true });

    function fireOnce() {
        const snippet = codeSnippets[codeIdx % codeSnippets.length];
        codeIdx++;
        const popup = document.createElement('div');
        popup.classList.add('code-popup');
        // Decorative easter-egg flourish: hide the injected snippet text from assistive tech so a
        // screen reader doesn't announce stray code ("SELECT * FROM …") mid-page. Matches the
        // site-wide convention of aria-hidden on every decorative element (icons, arrows, spinner).
        popup.setAttribute('aria-hidden', 'true');
        popup.textContent = snippet;
        popup.style.left = mouseX + 'px';
        popup.style.top = mouseY + 'px';
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1900);
        autoFireDelay = Math.max(250, autoFireDelay * 0.93);
        autoFireTimer = setTimeout(fireOnce, autoFireDelay);
    }

    function startAutoFire(e) {
        // Honor prefers-reduced-motion: the code-snippet popups float in via JS animation, which
        // the site's reduced-motion CSS can't disable, so gate the effect here.
        if (prefersReducedMotion()) return;
        e.preventDefault();
        e.stopPropagation();
        if (autoFireTimer) return;
        if (e.touches) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }
        else { mouseX = e.clientX; mouseY = e.clientY; }
        autoFireDelay = 350;
        fireOnce();
    }

    function stopAutoFire() {
        clearTimeout(autoFireTimer);
        autoFireTimer = null;
    }

    el.addEventListener('mousedown', startAutoFire);
    el.addEventListener('touchstart', startAutoFire, { passive: false });
    window.addEventListener('mouseup', stopAutoFire);
    window.addEventListener('touchend', stopAutoFire);
    window.addEventListener('touchcancel', stopAutoFire);
    el.addEventListener('mouseleave', stopAutoFire);
    el.addEventListener('click', e => e.preventDefault());
})();

/*===== SECTION NAVIGATION (scroll arrows) =====*/
const sectionIds = ['home', 'about', 'Projects', 'skills', 'contact'];
const scrollDownBtn = document.getElementById('scrollDown');
const backToTop = document.getElementById('backToTop');

function getCurrentSectionIndex() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollPos >= el.offsetTop) return i;
    }
    return 0;
}

// Down arrow: shows on any section except contact after idle time
// 3s for home (first impression nudge), 10s for projects, 8s for others
let downArrowTimer = null;
let lastSectionIdx = -1;

function getDownArrowDelay(idx) {
    if (idx === 0) return 3000;
    if (idx === 2) return 10000;
    return 8000;
}

function startDownArrowTimer() {
    if (!scrollDownBtn) return; // scroll arrows only exist on the homepage
    clearTimeout(downArrowTimer);
    scrollDownBtn.classList.remove('visible');
    const idx = getCurrentSectionIndex();
    const atContact = idx >= sectionIds.length - 1;
    if (atContact) return;
    downArrowTimer = setTimeout(() => {
        scrollDownBtn.classList.add('visible');
        downArrowTimer = null;
    }, getDownArrowDelay(idx));
}

// Start timer on initial load
startDownArrowTimer();

let backToTopTimer = null;
window.addEventListener('scroll', () => {
    if (!scrollDownBtn || !backToTop) return; // scroll arrows only exist on the homepage
    const idx = getCurrentSectionIndex();
    const atContact = idx >= sectionIds.length - 1;

    // When user scrolls, hide arrow and restart idle timer for new section
    clearTimeout(downArrowTimer);
    downArrowTimer = null;
    scrollDownBtn.classList.remove('visible');

    if (!atContact) {
        // Restart idle timer after scroll settles
        downArrowTimer = setTimeout(() => {
            const currentIdx = getCurrentSectionIndex();
            if (currentIdx < sectionIds.length - 1) {
                downArrowTimer = setTimeout(() => {
                    scrollDownBtn.classList.add('visible');
                    downArrowTimer = null;
                }, getDownArrowDelay(currentIdx));
            }
        }, 200); // debounce scroll events
    }

    // Up arrow: only near the actual bottom of the page (so it never floats
    // mid-scroll overlapping card buttons). 2s delay, hide otherwise.
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 120);
    if (nearBottom) {
        if (!backToTopTimer && !backToTop.classList.contains('visible')) {
            backToTopTimer = setTimeout(() => {
                backToTop.classList.add('visible');
                backToTopTimer = null;
            }, 2000);
        }
    } else {
        clearTimeout(backToTopTimer);
        backToTopTimer = null;
        backToTop.classList.remove('visible');
    }
}, { passive: true });

if (scrollDownBtn) scrollDownBtn.addEventListener('click', () => {
    const idx = getCurrentSectionIndex();
    const nextIdx = Math.min(idx + 1, sectionIds.length - 1);
    const target = document.getElementById(sectionIds[nextIdx]);
    if (target) target.scrollIntoView({ behavior: scrollBehavior() });
});

if (backToTop) backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
});

// Easter egg (uncomment to enable)
// const egg = document.getElementById('easterEgg');
// egg.addEventListener('click', () => {
//     if (egg.classList.contains('hatched')) return;
//     egg.classList.add('hatched');
//     setTimeout(() => egg.classList.remove('hatched'), 4000);
// });

/*===== RESUME REQUEST =====*/
function requestResume() {
    document.getElementById('contact').scrollIntoView({ behavior: scrollBehavior() });
    const form = document.querySelector('.contact__form');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    // Pre-fill only the message (and only if empty, so a half-written one isn't clobbered).
    // Leave name/email untouched: their placeholders already show the format, and overwriting
    // them with placeholder-looking strings ("Your Name"/"your@email.com") meant a user had to
    // delete that junk first — or, if they'd already typed real values, lost them.
    if (!messageInput.value.trim()) {
        messageInput.value = 'Hi Jacob,\n\nI\'d love a copy of your resume.\n\nThanks!';
    }

    // Focus the first field still needing input so they can start typing right away.
    (!nameInput.value.trim() ? nameInput : !emailInput.value.trim() ? emailInput : messageInput).focus();
}

/*===== CONTACT FORM SUBMIT =====*/
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
    // Screen-reader status region: on submit the button is set disabled (which drops it
    // from the accessibility tree), so its visible "Sending…/Sent!/Error" text change is
    // never announced — screen-reader users get no feedback that the message went through.
    // Mirror the button's state into a polite live region, created once up front so AT
    // registers it before the first update. Mirrors the weather dashboard's #srStatus.
    const srStatus = document.createElement('div');
    srStatus.setAttribute('role', 'status');
    srStatus.setAttribute('aria-live', 'polite');
    srStatus.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    contactForm.appendChild(srStatus);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('.contact__button');
        const origText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        srStatus.textContent = 'Sending your message…';

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        }).then(res => {
            if (res.ok) {
                contactForm.reset();
                btn.textContent = 'Sent!';
                btn.style.transition = 'none';
                btn.style.background = '#28a745';
                srStatus.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
                setTimeout(() => { btn.textContent = origText; btn.disabled = false; btn.style.background = ''; btn.style.transition = ''; }, 4000);
            } else {
                btn.textContent = 'Error — try again';
                btn.style.background = '#dc3545';
                srStatus.textContent = 'Something went wrong sending your message. Please try again.';
                setTimeout(() => { btn.textContent = origText; btn.disabled = false; btn.style.background = ''; }, 3000);
            }
        }).catch(() => {
            btn.textContent = 'Error — try again';
            btn.style.background = '#dc3545';
            srStatus.textContent = 'Something went wrong sending your message. Please try again.';
            setTimeout(() => { btn.textContent = origText; btn.disabled = false; btn.style.background = ''; }, 3000);
        });
    });
}

(function () {
    const dots = document.querySelectorAll('.live-dot');
    if (!dots.length || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    dots.forEach(d => obs.observe(d));
})();

