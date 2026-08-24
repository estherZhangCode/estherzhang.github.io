const header = document.querySelector('[data-header]');
const localTime = document.querySelector('[data-local-time]');
const year = document.querySelector('[data-year]');
const nav = document.querySelector('.nav-pill');
const navLinks = [...document.querySelectorAll('.nav-pill a')];
const navIndicator = document.querySelector('.nav-indicator');
const world = document.querySelector('.hero-world');
const depthItems = [...document.querySelectorAll('[data-depth]')];
const projectCards = [...document.querySelectorAll('.project-card')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const updateTime = () => {
  if (!localTime) return;
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai', hour: 'numeric', minute: '2-digit'
  }).format(new Date());
  localTime.textContent = `${time} · SHA`;
};

const moveIndicator = (link) => {
  if (!nav || !navIndicator || !link || window.innerWidth <= 760) return;
  const navBox = nav.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();
  navIndicator.style.width = `${linkBox.width}px`;
  navIndicator.style.transform = `translateX(${linkBox.left - navBox.left}px)`;
};

const updateNavigation = () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
  const aboutSection = document.querySelector('#about');
  const workBoundary = document.querySelector('.experience') || document.querySelector('#work');
  const marker = window.scrollY + window.innerHeight * .42;
  const isAbout = aboutSection && workBoundary && marker >= aboutSection.offsetTop && marker < workBoundary.offsetTop;
  const activeLink = navLinks.find((link) => link.hash === (isAbout ? '#about' : '#work')) || navLinks[0];
  navLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
  moveIndicator(activeLink);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const updateProjectMotion = () => {
  projectCards.forEach((card) => {
    const image = card.querySelector('img');
    if (reducedMotion.matches) {
      card.style.transform = 'none';
      card.style.opacity = '1';
      if (image) image.style.transform = 'scale(1.08)';
      return;
    }
    const rect = card.getBoundingClientRect();
    const viewportCenter = window.innerHeight * .52;
    const cardCenter = rect.top + rect.height / 2;
    const distance = (cardCenter - viewportCenter) / window.innerHeight;
    const focus = clamp(1 - Math.abs(distance) / .78, 0, 1);
    const scale = .78 + focus * .22;
    const tilt = (1 - focus) * 11;
    const y = clamp(distance * 64, -54, 54);
    card.style.transform = `perspective(1100px) translate3d(0, ${y}px, 0) rotateX(${tilt}deg) scale(${scale})`;
    card.style.opacity = `${.25 + focus * .75}`;
    if (image) image.style.transform = `scale(${1.14 - focus * .06}) translateX(${distance * -10}px)`;
  });
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (world && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  world.addEventListener('pointermove', (event) => {
    const box = world.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    depthItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 1);
      item.style.translate = `${x * 14 * depth}px ${y * 10 * depth}px`;
    });
  });
  world.addEventListener('pointerleave', () => {
    depthItems.forEach((item) => { item.style.translate = '0 0'; });
  });
}

navLinks.forEach((link) => link.addEventListener('mouseenter', () => moveIndicator(link)));
nav?.addEventListener('mouseleave', updateNavigation);
let navCloseTimer;
const openNav = () => {
  window.clearTimeout(navCloseTimer);
  nav?.classList.add('is-open');
  window.requestAnimationFrame(updateNavigation);
};
const closeNav = () => {
  window.clearTimeout(navCloseTimer);
  navCloseTimer = window.setTimeout(() => {
    if (!nav?.matches(':hover') && !nav?.contains(document.activeElement)) nav.classList.remove('is-open');
  }, 320);
};
nav?.addEventListener('pointerenter', openNav);
nav?.addEventListener('pointerleave', closeNav);
nav?.addEventListener('focusin', openNav);
nav?.addEventListener('focusout', closeNav);
window.setTimeout(closeNav, 1800);
const updateViewport = () => {
  updateNavigation();
  updateProjectMotion();
};
window.addEventListener('scroll', updateViewport, { passive: true });
window.addEventListener('resize', updateViewport);
if (year) year.textContent = new Date().getFullYear();
updateTime();
setInterval(updateTime, 30000);
updateViewport();
