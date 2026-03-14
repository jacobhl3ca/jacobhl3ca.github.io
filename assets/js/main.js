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

// HTML defaults to data-theme="dark" and sun icon; only switch to light if user previously chose light
if (currentTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.classList.replace('bx-sun', 'bx-moon');
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
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('theme', 'dark');
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

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 
