/* Мобильное меню. До этого ссылки навигации на телефоне просто
   скрывались — попасть в разделы было нельзя. */

const burger = document.querySelector('.nav-burger');
const menu = document.getElementById('mobileMenu');

if (burger && menu) {
  /* Атрибут hidden тут бесполезен: авторское правило .mobile-menu{display:flex}
     перекрывает [hidden] из браузерных стилей, и меню оставалось на экране.
     Поэтому видимостью управляет только класс is-open. */
  menu.removeAttribute('hidden');

  const isOpen = () => menu.classList.contains('is-open');

  /* Прокрутку запираем через overflow, а не position:fixed на body:
     фиксация ломала отрисовку — страница двоилась. */
  const lock = (on) => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
  };

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    lock(open);
  };

  burger.addEventListener('click', () => setOpen(!isOpen()));

  /* Переход по пункту: сначала закрываем меню и снимаем блокировку,
     и только потом прокручиваем — иначе прокрутка уходит в никуда. */
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    setOpen(false);

    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }));
    }
  });

  addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) setOpen(false); });

  // При повороте экрана на десктопную ширину меню не должно залипать
  addEventListener('resize', () => { if (innerWidth > 800 && isOpen()) setOpen(false); });

  // Страховка: не оставляем страницу запертой после возврата из истории
  addEventListener('pageshow', () => { if (!isOpen()) lock(false); });
}

/* Шапка закреплена, поэтому в зазоре над ней проступал контент.
   Наверху страницы она остаётся плавающей «пилюлей», а при прокрутке
   пристыковывается к верхнему краю сплошной полосой. */
const header = document.querySelector('.nav');
if (header) {
  const dock = () => document.body.classList.toggle('nav-docked', window.scrollY > 40);
  addEventListener('scroll', dock, { passive: true });
  dock();
}
