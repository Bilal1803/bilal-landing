/* Калькулятор стоимости.
   Цены «от» синхронизированы с блоками услуг на главной:
   сайты — от 20 000 ₽ / 2 дней, боты — от 5 000 ₽ / 1 дня,
   системы — от 10 000 ₽ / 1 дня. */

const CATALOG = {
  web: {
    label: 'Сайт',
    caption: 'Лендинг, магазин или личный кабинет',
    products: [
      { id: 'landing', name: 'Лендинг', desc: 'Одна страница под один продукт или услугу', price: 20000, days: 2 },
      { id: 'shop', name: 'Интернет-магазин', desc: 'Каталог, корзина, оплата, админ-панель', price: 40000, days: 5 },
      { id: 'corp', name: 'Многостраничный сайт', desc: 'Личный кабинет, интеграции, своя логика', price: 65000, days: 10 }
    ],
    extras: [
      { id: 'photos', name: 'Создание фотографий', desc: 'Изображения товаров и оформление под проект', add: 5000, days: 1 },
      { id: 'copy', name: 'Копирайтинг и тексты', desc: 'Напишу тексты страниц, вам не нужно ничего готовить', add: 5000, days: 1 },
      { id: 'seo', name: 'SEO-оптимизация', desc: 'Мета-теги, скорость, структура, микроразметка', add: 6000, days: 2 },
      { id: 'tgbot', name: 'Telegram-бот к сайту', desc: 'Заказы админу, статус заказа и поддержка клиентам', add: 5000, days: 2 }
    ]
  },
  bot: {
    label: 'Telegram-бот',
    caption: 'Заявки, подписки, рассылки, мини-приложения',
    products: [
      { id: 'simple', name: 'Бот для заявок и рассылок', desc: 'Приём заявок, подписки и рассылки по базе', price: 5000, days: 1 },
      { id: 'shop', name: 'Бот для магазина с ИИ', desc: 'Каталог, заказы и техподдержка на ИИ', price: 15000, days: 2 },
      { id: 'tma', name: 'Бот с мини-приложением', desc: 'Полноценный интерфейс для бизнеса внутри Telegram', price: 25000, days: 3 }
    ],
    extras: [
      { id: 'photos', name: 'Фотографии и оформление', desc: 'Картинки товаров, обложки, кнопки в фирменном стиле', add: 5000, days: 1 },
      { id: 'script', name: 'Тексты и сценарий диалога', desc: 'Продумаю логику разговора и напишу все реплики', add: 5000, days: 1 },
      { id: 'payments', name: 'Приём оплат', desc: 'Карты, СБП и Telegram Stars прямо в чате', add: 5000, days: 1 },
      { id: 'crmint', name: 'Связь с таблицей или CRM', desc: 'Заявки уезжают туда, где вы работаете', add: 5000, days: 1 },
      { id: 'admin', name: 'Админ-панель и рассылки', desc: 'Статистика, сегменты, выгрузка заявок', add: 7000, days: 2 },
      { id: 'ai', name: 'ИИ-ответы клиентам', desc: 'Бот сам отвечает на типовые вопросы', add: 7000, days: 2 }
    ]
  },
  systems: {
    label: 'Бизнес-система',
    caption: 'Таблицы, парсеры, аналитика, CRM',
    products: [
      { id: 'analytics', name: 'Аналитика', desc: 'Сводки и отчёты по вашим данным', price: 5000, days: 1 },
      { id: 'sheets', name: 'Настройка таблиц', desc: 'Google Sheets и Excel: структура, формулы, выгрузки', price: 10000, days: 1 },
      { id: 'parser', name: 'Парсер данных', desc: 'Сбор товаров, цен, объявлений, контактов', price: 15000, days: 2 },
      { id: 'automation', name: 'Автоматизации', desc: 'Посты из канала сами уезжают в таблицу или в другой канал', price: 15000, days: 2 },
      { id: 'crm', name: 'Своя CRM', desc: 'Сделки, клиенты, роли, история — под ваш процесс', price: 50000, days: 7 }
    ],
    extras: [
      { id: 'server', name: 'Запуск на сервере', desc: 'Разверну и настрою, система работает без вашего компьютера', add: 5000, days: 1 },
      { id: 'schedule', name: 'Работа по расписанию', desc: 'Запускается сама — по часам или по событию', add: 5000, days: 1 },
      { id: 'alerts', name: 'Уведомления в Telegram', desc: 'Сообщение, когда произошло что-то важное', add: 5000, days: 1 },
      { id: 'export', name: 'Выгрузка в Excel и Sheets', desc: 'Готовые отчёты в привычном формате', add: 5000, days: 1 },
      { id: 'roles', name: 'Роли и доступы', desc: 'Каждый сотрудник видит только своё', add: 8000, days: 2 },
      { id: 'dash', name: 'Визуальный дашборд', desc: 'Графики и сводки вместо голых таблиц', add: 10000, days: 2 }
    ]
  },

  /* Отдельные услуги — когда не нужен проект целиком */
  extra: {
    label: 'Отдельная услуга',
    caption: 'Реклама, аналитика, оплата, доработки',
    products: [
      { id: 'domain', name: 'Домен, хостинг и SSL', desc: 'Куплю, подключу, настрою — сайт открывается по вашему адресу', price: 3000, days: 1 },
      { id: 'metrika', name: 'Аналитика и цели', desc: 'Яндекс Метрика: события, цели, отчёты по заявкам', price: 5000, days: 1 },
      { id: 'move', name: 'Перенос сайта', desc: 'Переезд на другой хостинг или домен без простоя', price: 5000, days: 1 },
      { id: 'payment', name: 'Подключение онлайн-оплаты', desc: 'Эквайринг или СБП на сайт либо в бота', price: 5000, days: 1 },
      { id: 'content', name: 'Фотографии и тексты', desc: 'Изображения и копирайтинг без остальной разработки', price: 5000, days: 1 },
      { id: 'fix', name: 'Доработка чужого проекта', desc: 'Починю или доделаю сайт либо бота, которые уже есть', price: 5000, days: 2 },
      { id: 'speed', name: 'Ускорение сайта', desc: 'Разгоню загрузку и приведу в порядок техническую часть', price: 7000, days: 2 },
      { id: 'direct', name: 'Настройка Яндекс Директ', desc: 'Соберу кампанию, объявления и ключи, запущу рекламу', price: 8000, days: 2 }
    ],
    extras: []
  }
};

const NICHES = ['Услуги', 'Розница и e-commerce', 'Образование', 'Общепит и доставка',
  'Недвижимость', 'Красота и медицина', 'B2B и производство', 'Другое'];

const TERMS = [
  { id: 'rush', name: 'Срочный запуск', desc: 'Беру в приоритет, срок сжимается примерно в полтора раза', mul: 1.2, daysMul: 0.6 }
];

/* Схема состава проекта: какие блоки добавляет каждый выбор.
   Намеренно описывает состав, а не внешний вид — обещать дизайн
   до проектирования нельзя. */
const SCHEMA = {
  web: {
    label: 'yourbrand.ru',
    base: ['Шапка и меню', 'Первый экран', 'Форма заявки'],
    products: {
      landing: ['Блок услуг', 'Отзывы и доверие'],
      shop: ['Каталог товаров', 'Карточка товара', 'Корзина', 'Оформление и оплата', 'Админ-панель'],
      corp: ['Внутренние страницы', 'Личный кабинет', 'Интеграции']
    },
    extras: {
      photos: ['Фотографии'], copy: ['Тексты страниц'],
      seo: ['SEO-разметка'], tgbot: ['Telegram-бот']
    }
  },
  bot: {
    label: 'Ваш бот',
    base: ['Меню бота', 'Приём заявок'],
    products: {
      simple: ['Подписки', 'Рассылки по базе'],
      shop: ['Каталог', 'Оформление заказа', 'ИИ-поддержка'],
      tma: ['Мини-приложение', 'Профиль клиента', 'История заказов']
    },
    extras: {
      photos: ['Оформление'], script: ['Сценарий диалога'], payments: ['Оплата в чате'],
      crmint: ['Связь с CRM'], admin: ['Админ-панель'], ai: ['ИИ-ответы']
    }
  },
  systems: {
    label: 'Панель управления',
    base: ['Источник данных', 'Хранилище'],
    products: {
      analytics: ['Сводка показателей', 'Отчёт'],
      sheets: ['Структура таблиц', 'Формулы и выгрузки'],
      parser: ['Сбор данных', 'Очистка и дубли'],
      automation: ['Триггер', 'Действие'],
      crm: ['Сделки', 'Клиенты', 'Роли и права', 'История']
    },
    extras: {
      server: ['Сервер 24/7'], schedule: ['Расписание'], alerts: ['Уведомления'],
      export: ['Выгрузка в Excel'], roles: ['Доступы'], dash: ['Дашборд']
    }
  },
  extra: {
    label: 'Отдельная работа',
    base: [],
    products: {
      domain: ['Домен и SSL'], metrika: ['Счётчики и цели'], move: ['Перенос проекта'],
      payment: ['Приём оплаты'], content: ['Фото и тексты'], fix: ['Правки в проекте'],
      speed: ['Оптимизация скорости'], direct: ['Рекламные кампании']
    },
    extras: {}
  }
};

const state = { dir: null, product: null, niche: null, extras: new Set(), terms: new Set() };

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat('ru-RU');
const money = (n) => nf.format(n) + ' ₽';

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

const days = (n) => n + ' ' + plural(n, 'день', 'дня', 'дней');

/* --- отрисовка --- */

function card(kind, id, name, desc, meta, checked) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'opt';
  el.dataset.kind = kind;
  el.dataset.id = id;
  el.setAttribute('role', kind === 'extra' || kind === 'term' ? 'checkbox' : 'radio');
  el.setAttribute('aria-checked', String(!!checked));
  el.classList.toggle('is-on', !!checked);
  el.innerHTML = `<span class="opt-mark"></span><span class="opt-body">
      <b>${name}</b>${desc ? `<small>${desc}</small>` : ''}</span>
      ${meta ? `<span class="opt-meta">${meta}</span>` : ''}`;
  return el;
}

function renderDirs() {
  const box = $('dirs');
  box.innerHTML = '';
  Object.entries(CATALOG).forEach(([key, d]) => {
    const from = Math.min(...d.products.map((p) => p.price));
    box.append(card('dir', key, d.label, d.caption, 'от ' + money(from), state.dir === key));
  });
}

function renderProducts() {
  const box = $('products');
  box.innerHTML = '';
  if (!state.dir) {
    box.innerHTML = '<p class="opts-empty">Сначала выберите направление выше.</p>';
    return;
  }
  CATALOG[state.dir].products.forEach((p) => {
    box.append(card('product', p.id, p.name, p.desc,
      money(p.price) + ' · ' + days(p.days), state.product === p.id));
  });
}

function renderExtras() {
  const box = $('extras');
  box.innerHTML = '';
  if (!state.dir) {
    box.innerHTML = '<p class="opts-empty">Опции появятся после выбора направления.</p>';
    return;
  }
  if (!CATALOG[state.dir].extras.length) {
    box.innerHTML = '<p class="opts-empty">Всё необходимое уже входит в выбранный формат. Если нужно что-то сверх — обсудим лично, посчитаю отдельно.</p>';
    return;
  }
  CATALOG[state.dir].extras.forEach((o) => {
    const meta = o.mul ? '+' + Math.round((o.mul - 1) * 100) + '%' : '+ ' + money(o.add);
    box.append(card('extra', o.id, o.name, o.desc, meta, state.extras.has(o.id)));
  });
}

function renderTerms() {
  const box = $('terms');
  box.innerHTML = '';
  TERMS.forEach((t) => {
    const meta = t.mul ? '+' + Math.round((t.mul - 1) * 100) + '%' : '+ ' + money(t.add);
    box.append(card('term', t.id, t.name, t.desc, meta, state.terms.has(t.id)));
  });
}

function renderNiches() {
  const box = $('niches');
  box.innerHTML = '';
  NICHES.forEach((n) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'pill' + (state.niche === n ? ' is-on' : '');
    el.dataset.kind = 'niche';
    el.dataset.id = n;
    el.setAttribute('role', 'radio');
    el.setAttribute('aria-checked', String(state.niche === n));
    el.textContent = n;
    box.append(el);
  });
}

/* --- расчёт --- */

function calc() {
  if (!state.dir || !state.product) return null;
  const dir = CATALOG[state.dir];
  const product = dir.products.find((p) => p.id === state.product);

  let sum = product.price;
  let mul = 1;
  let d = product.days;
  let daysMul = 1;
  const picked = [];
  const lines = [{ label: product.name, value: money(product.price) }];
  const pct = (m) => '+' + Math.round((m - 1) * 100) + '%';

  dir.extras.forEach((o) => {
    if (!state.extras.has(o.id)) return;
    if (o.mul) mul *= o.mul; else sum += o.add;
    d += o.days || 0;
    picked.push(o.name);
    lines.push({ label: o.name, value: o.mul ? pct(o.mul) : '+ ' + money(o.add) });
  });

  const termNames = [];
  TERMS.forEach((t) => {
    if (!state.terms.has(t.id)) return;
    if (t.mul) mul *= t.mul; else sum += t.add;
    if (t.daysMul) daysMul *= t.daysMul;
    termNames.push(t.name);
    lines.push({ label: t.name, value: t.mul ? pct(t.mul) : '+ ' + money(t.add) });
  });

  const total = sum * mul;
  const round = (n) => Math.round(n / 1000) * 1000;
  const dLow = Math.max(1, Math.round(d * daysMul));

  return {
    product, picked, termNames, lines,
    low: round(total),
    high: round(total * 1.25),
    dLow,
    dHigh: Math.max(dLow + 1, Math.ceil(dLow * 1.5))
  };
}

function brief(r) {
  return [
    'Здравствуйте, Билал!',
    '',
    'Собрал проект в калькуляторе на сайте:',
    '',
    '• Направление: ' + CATALOG[state.dir].label,
    '• Продукт: ' + r.product.name,
    '• Сфера: ' + (state.niche || 'не указана'),
    '• Дополнительно: ' + (r.picked.length ? r.picked.join(', ') : 'без опций'),
    '• Условия: ' + (r.termNames.length ? r.termNames.join(', ') : 'обычные сроки'),
    '• Ориентир: ' + money(r.low) + ' – ' + money(r.high) + ', ' + r.dLow + '–' + days(r.dHigh),
    '',
    'Хочу обсудить детали.'
  ].join('\n');
}

/* --- схема состава --- */

let shownBlocks = [];

function schemaBlocks() {
  if (!state.dir) return [];
  const s = SCHEMA[state.dir];
  let list = [...s.base];
  if (state.product && s.products[state.product]) list = list.concat(s.products[state.product]);
  Object.keys(s.extras).forEach((id) => {
    if (state.extras.has(id)) list = list.concat(s.extras[id]);
  });
  return list;
}

function renderSchema() {
  const frame = $('schemaFrame');
  const list = schemaBlocks();

  if (!list.length) {
    frame.className = 'schema-frame is-empty';
    frame.innerHTML = '<p class="schema-empty">Выберите направление и формат — здесь соберётся состав вашего проекта.</p>';
    shownBlocks = [];
    return;
  }

  // подсвечиваем только то, что появилось с прошлого раза
  const added = list.filter((b) => !shownBlocks.includes(b));
  frame.className = 'schema-frame';
  frame.innerHTML =
    `<div class="schema-top"><i></i><i></i><i></i><b>${SCHEMA[state.dir].label}</b></div>` +
    '<div class="schema-body">' +
    list.map((b) => `<div class="sblock${added.includes(b) ? ' is-new' : ''}"><i></i><span>${b}</span></div>`).join('') +
    '</div>';
  shownBlocks = list;
}

/* Панель липкая и прокручивается вместе со страницей. Если состав
   разросся и она выше экрана, прижимаем её низом к нижнему краю —
   так кнопка заказа и итог остаются на виду. */
function fitSummary() {
  const el = document.querySelector('.summary');
  if (!el || getComputedStyle(el).position !== 'sticky') return;
  const gap = 24;
  const h = el.offsetHeight;
  el.style.top = (h + gap + 96 > innerHeight ? innerHeight - h - gap : 96) + 'px';
}

addEventListener('resize', fitSummary);

function update() {
  renderSchema();
  const r = calc();
  const list = $('sumList');
  const rows = [];

  if (state.dir) rows.push(['Направление', CATALOG[state.dir].label]);
  if (state.niche) rows.push(['Сфера', state.niche]);

  const head = rows.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('');
  const breakdown = r
    ? `<div class="sum-lines"><small>Из чего складывается</small>${
        r.lines.map((l) => `<span><i>${l.label}</i><b>${l.value}</b></span>`).join('')}</div>`
    : '';

  list.innerHTML = head || breakdown
    ? head + breakdown
    : '<p class="sum-empty">Выберите направление и формат — расчёт появится здесь.</p>';

  const priceEl = $('sumPrice');
  const daysEl = $('sumDays');
  const barPrice = $('barPrice');
  const bar = $('orderBar');

  if (!r) {
    priceEl.textContent = '—';
    daysEl.textContent = state.dir ? 'Выберите формат' : 'Выберите направление';
    barPrice.textContent = '—';
    bar.classList.remove('is-ready');
    $('tgLink').href = 'https://t.me/pzlllv';
    $('barLink').href = 'https://t.me/pzlllv';
    $('mailLink').href = 'mailto:bilalpzlllv@gmail.com';
    fitSummary();
    return;
  }

  priceEl.textContent = money(r.low) + ' – ' + money(r.high);
  daysEl.textContent = 'Срок: ' + r.dLow + '–' + days(r.dHigh);
  barPrice.textContent = money(r.low) + ' – ' + money(r.high);
  bar.classList.add('is-ready');

  const text = brief(r);
  const tg = 'https://t.me/pzlllv?text=' + encodeURIComponent(text);
  $('tgLink').href = tg;
  $('barLink').href = tg;
  $('mailLink').href = 'mailto:bilalpzlllv@gmail.com'
    + '?subject=' + encodeURIComponent('Заявка на разработку: ' + r.product.name)
    + '&body=' + encodeURIComponent(text);
  fitSummary();
}

/* --- события --- */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-kind]');
  if (!el) return;
  const { kind, id } = el.dataset;

  if (kind === 'dir') {
    if (state.dir === id) return;
    state.dir = id;
    state.product = null;
    state.extras.clear();
    renderDirs(); renderProducts(); renderExtras();
    $('stepProduct').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (kind === 'product') {
    state.product = id;
    renderProducts();
  } else if (kind === 'niche') {
    state.niche = state.niche === id ? null : id;
    renderNiches();
  } else if (kind === 'extra') {
    state.extras.has(id) ? state.extras.delete(id) : state.extras.add(id);
    renderExtras();
  } else if (kind === 'term') {
    state.terms.has(id) ? state.terms.delete(id) : state.terms.add(id);
    renderTerms();
  }
  update();
});

$('copyBtn').addEventListener('click', async () => {
  const r = calc();
  const btn = $('copyBtn');
  if (!r) { btn.textContent = 'Сначала соберите проект'; setTimeout(() => (btn.textContent = 'Скопировать бриф'), 1800); return; }
  try {
    await navigator.clipboard.writeText(brief(r));
    btn.textContent = 'Скопировано';
  } catch {
    btn.textContent = 'Не удалось скопировать';
  }
  setTimeout(() => (btn.textContent = 'Скопировать бриф'), 1800);
});

/* Направление можно передать с главной: order.html?s=web */
const preset = new URLSearchParams(location.search).get('s');
if (preset && CATALOG[preset]) state.dir = preset;

renderDirs(); renderProducts(); renderNiches(); renderExtras(); renderTerms(); update();
