const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Счётчик добегает до значения, когда блок появляется на экране.
   Разряды разделяет так же, как в вёрстке: 3 700+, 200+ */
const numberFormat = new Intl.NumberFormat('ru-RU');

function countUp(element) {
  if (element.dataset.counted) return;
  const parts = element.textContent.trim().match(/^(\d[\d\s ]*)(.*)$/);
  if (!parts) return;
  const target = parseInt(parts[1].replace(/[\s ]/g, ''), 10);
  if (!Number.isFinite(target) || target < 20) return;

  element.dataset.counted = '1';
  const suffix = parts[2];
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / 1200);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = numberFormat.format(Math.round(target * eased)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (!calm) entry.target.querySelectorAll('.metric strong, .proof-grid strong').forEach(countUp);
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

/* Полоса прогресса прокрутки */
const progress = document.querySelector('.scroll-bar i');
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

/* Ссылки мобильного меню обрабатывает menu.js: там прокрутка идёт
   после снятия блокировки, иначе она уходит в никуда. */
document.querySelectorAll('a[href^="#"]:not(.mobile-menu a)').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

const hero = document.querySelector('.hero');
const heroCopy = document.querySelector('.hero-copy');

if (hero && heroCopy && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroCopy.style.setProperty('--hero-x', `${x * 10}px`);
    heroCopy.style.setProperty('--hero-y', `${y * 8}px`);
  });
  hero.addEventListener('pointerleave', () => {
    heroCopy.style.setProperty('--hero-x', '0px');
    heroCopy.style.setProperty('--hero-y', '0px');
  });
}

document.querySelectorAll('.button, .nav-cta').forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    const box = button.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    button.style.transform = `translate(${x * 5}px, ${y * 4}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});
