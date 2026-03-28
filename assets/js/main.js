/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

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

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme');

// Swap project images based on theme
function setThemeImages(theme) {
    document.querySelectorAll('img[data-dark][data-light]').forEach(img => {
        img.src = theme === 'light' ? img.dataset.light : img.dataset.dark;
        if (img.style.background) {
            img.style.background = theme === 'light' ? '#ffffff' : '#121212';
        }
    });
}

// HTML defaults to data-theme="dark" and sun icon; only switch to light if user previously chose light
if (currentTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.classList.replace('bx-sun', 'bx-moon');
    setThemeImages('light');
} else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('bx-moon', 'bx-sun');
    if (currentTheme !== 'dark') {
        localStorage.setItem('theme', 'dark');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('bx-sun', 'bx-moon');
        localStorage.setItem('theme', 'light');
        setThemeImages('light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('theme', 'dark');
        setThemeImages('dark');
    }
    themeToggle.blur();
});

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL CASCADE =====*/
const revealElements = document.querySelectorAll(
  '.section-title, .about__img, .about__subtitle, .about__text, ' +
  '.skills__subtitle, .skills__text, .skills__category, ' +
  '.work__img, ' +
  '.contact__input, .contact__button'
);

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

function handleSkillsClick(e) {
    const snippet = codeSnippets[codeIdx % codeSnippets.length];
    codeIdx++;
    const popup = document.createElement('div');
    popup.classList.add('code-popup');
    popup.textContent = snippet;
    popup.style.left = e.clientX + 'px';
    popup.style.top = e.clientY + 'px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1900);
}

(function() {
    const el = document.getElementById('skills-photo');
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
        popup.textContent = snippet;
        popup.style.left = mouseX + 'px';
        popup.style.top = mouseY + 'px';
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1900);
        autoFireDelay = Math.max(250, autoFireDelay * 0.93);
        autoFireTimer = setTimeout(fireOnce, autoFireDelay);
    }

    function startAutoFire(e) {
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
const sectionIds = ['home', 'about', 'skills', 'Projects', 'contact'];
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
// 3s for home (first impression nudge), 5s for other sections
let downArrowTimer = null;
let lastSectionIdx = -1;

function startDownArrowTimer() {
    clearTimeout(downArrowTimer);
    scrollDownBtn.classList.remove('visible');
    const idx = getCurrentSectionIndex();
    const atContact = idx >= sectionIds.length - 1;
    if (atContact) return;
    const delay = idx === 0 ? 3000 : 5000;
    downArrowTimer = setTimeout(() => {
        scrollDownBtn.classList.add('visible');
        downArrowTimer = null;
    }, delay);
}

// Start timer on initial load
startDownArrowTimer();

let backToTopTimer = null;
window.addEventListener('scroll', () => {
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
                const delay = currentIdx === 0 ? 3000 : 5000;
                downArrowTimer = setTimeout(() => {
                    scrollDownBtn.classList.add('visible');
                    downArrowTimer = null;
                }, delay);
            }
        }, 200); // debounce scroll events
    }

    // Up arrow: show with 2s delay when at contact, hide otherwise
    if (atContact) {
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
});

scrollDownBtn.addEventListener('click', () => {
    const idx = getCurrentSectionIndex();
    const nextIdx = Math.min(idx + 1, sectionIds.length - 1);
    const target = document.getElementById(sectionIds[nextIdx]);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    const form = document.querySelector('.contact__form');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    nameInput.value = 'Your Name';
    emailInput.value = 'your@email.com';
    messageInput.value = 'Hi Jacob,\n\nI\'d love a copy of your resume.\n\nThanks!';

    nameInput.focus();
}

/*===== CONTACT FORM SUBMIT =====*/
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('.contact__button');
        const origText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        }).then(res => {
            if (res.ok) {
                contactForm.reset();
                btn.textContent = 'Sent!';
                setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 3000);
            } else {
                btn.textContent = 'Error — try again';
                setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 3000);
            }
        }).catch(() => {
            btn.textContent = 'Error — try again';
            setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 3000);
        });
    });
}

