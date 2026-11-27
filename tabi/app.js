'use strict';
/* =====================================================================
   tabi — продукты по бюджету, меню и КБЖУ
   data.js: магазины, продукты, цены, рецепты, картинки
   app.js : расчёты + интерфейс
   ===================================================================== */

const IMG=n=>`img/${n}_3d.png`;
const I={
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M3.5 16.5L7 20l3.5-3.5M14 6h7M14 12h5M14 18h3"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-3.5v-6h-7v6H5A1.5 1.5 0 0 1 3.5 19z"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.3 11h10.8l2.2-8H6.3"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/></svg>',
  chev:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrows:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l6 6-6 6M13 6l6 6-6 6"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  /* заливные значки для категорий (как в Health) */
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c.6 3-1.2 4.7-2.7 6.3C7.7 10.5 6 12.3 6 15a6 6 0 0 0 12 0c0-2.3-1-4.2-2.4-5.6-.3 1.4-1 2.4-2.1 2.9.4-3.6-.6-7-1.5-9.8z"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 7V6a4 4 0 0 1 8 0v1h2.2a1 1 0 0 1 1 .9l1 12A2 2 0 0 1 18.2 22H5.8a2 2 0 0 1-2-2.1l1-12a1 1 0 0 1 1-.9zm2 0h4V6a2 2 0 0 0-4 0z"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2.5 19.5c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5zM16 19.5c-.2-1.9-.9-3.4-2-4.5 3.6-.8 6.6.8 7.3 4.5z"/></svg>',
  fork:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2.5a1 1 0 0 1 1 1V8h1V3.5a1 1 0 0 1 2 0V9a3 3 0 0 1-2 2.8V20.5a1 1 0 0 1-2 0v-8.7A3 3 0 0 1 5 9V3.5a1 1 0 0 1 2 0V8zM17.5 2.5c1.7 0 3 2.4 3 6 0 2.4-1 3.8-2.5 4.2v7.8a1 1 0 0 1-2 0v-17a1 1 0 0 1 1.5-1z"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4a2 2 0 0 1 1.4.6l8.6 8.6a2 2 0 0 1 0 2.8l-6.4 6.4a2 2 0 0 1-2.8 0L3.6 12.8a2 2 0 0 1-.6-1.4zM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2-4.3-4.3 1.4-1.4 2.9 2.9 5.9-5.9 1.4 1.4z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>'
};

/* ------------------------------ состояние ------------------------------ */
const DEF={budget:5000,days:7,city:'Москва',maxStores:2,snack:true,cook:'shared',prep:1,prepB:false,home:null,near:null,stores:{magnit:true,dixy:true,pyat:true,chizhik:true,svetofor:true,perek:true,vkusvill:true,azbuka:true,samokat:true,lavka:true,ozon:true},tiers:{eco:true,mid:true,dlv:true,prem:false},
  family:[{name:'Я',sex:'m',age:30,weight:75,height:178,act:1.375,goal:'keep'}],
  ate:{},prefs:{},dislikes:[],likes:[],nodish:[],eatOff:[],baseOut:[],hideApprox:false,halalMode:'mark',kit:{stove:true,oven:true,mc:false,air:false,blender:false,micro:false},pantry:{sol:1000,sahar:500},prices:{},seed:1,
  onb:false,plan:null,bought:{},paid:{},shopMode:false,day:0,member:0,tab:'home',rf:'all',rs:'def',dirty:false};
const KEY='korzinka_v2';
let S;
try{S=Object.assign(structuredClone(DEF),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=structuredClone(DEF)}
S.stores=Object.assign({},DEF.stores,S.stores);S.tiers=Object.assign({},DEF.tiers,S.tiers);
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
let WPV=false;      // мастер: показываем готовое меню после шага «Бюджет»
let WIZ=null;      // шаг мастера настройки или null
let SH=null;       // кеш расчёта корзины
let FEED=null;     // цены из prices.json (если файл есть рядом)

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* примерная цена (≈) — целыми рублями; копейки показываем только у цен с чека */
const rubR=v=>rub(Math.round(v));
const rub=v=>v.toLocaleString('ru-RU',{minimumFractionDigits:Number.isInteger(Math.round(v*100)/100)?0:2,maximumFractionDigits:2})+' ₽';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const plural=(n,a,b,c)=>{n=Math.abs(n)%100;const m=n%10;return n>10&&n<20?c:m>1&&m<5?b:m===1?a:c};
const AVC=['#7BC043','#F59E0B','#3B82F6','#EC4899','#8B5CF6','#14B8A6'];

function fmtQty(pid,g){
  if(pid==='yaytsa')return Math.max(1,Math.round(g/EGG))+' шт';
  const l=LIQ.has(pid);
  if(g>=1000)return (Math.round(g/100)/10).toString().replace('.',',')+(l?' л':' кг');
  return Math.max(5,Math.round(g/5)*5)+(l?' мл':' г');
}

/* ------------------------------ расчёты ------------------------------ */
/* Норма КБЖУ. Взрослым — формула Миффлина-Сан Жеора × активность; похудение −15 %, набор +15 %.
   Белок и жиры — от веса: похудение Б 2,0 г/кг, Ж 0,9 г/кг; поддержание Б 1,6, Ж 1,0; набор Б 1,8, Ж 1,0. Остаток калорий — углеводы.
   Страховка: если белок и жиры съедают больше 75 % калорий (большой вес при низкой норме), уменьшаем их пропорционально,
   чтобы углеводы не ушли в ноль. Детям до 15 — возрастная норма 20/30/50 %.
   Своя норма (m.custom), вписанная в профиле, главнее авторасчёта. */
const GOAL_GK={lose:[2.0,.9],keep:[1.6,1.0],gain:[1.8,1.0]};
function autoTarget(m){
  const a=+m.age||0;let k;
  if(a<15)k=a<=3?1200:a<=6?1600:a<=10?1950:(m.sex==='m'?2400:2150);
  else{k=(10*(+m.weight||70)+6.25*(+m.height||170)-5*a+(m.sex==='m'?5:-161))*(+m.act||1.375);k*=m.goal==='lose'?.85:m.goal==='gain'?1.15:1}
  k=Math.round(k/10)*10;
  if(a<15)return{kcal:k,p:Math.round(k*.2/4),f:Math.round(k*.3/9),c:Math.round(k*.5/4)};
  const w=+m.weight||70,[pk,fk]=GOAL_GK[m.goal]||GOAL_GK.keep;
  let p=w*pk,f=w*fk;const pf=p*4+f*9;
  if(pf>k*.75){const s=k*.75/pf;p*=s;f*=s}
  p=Math.round(p);f=Math.round(f);
  return{kcal:k,p,f,c:Math.max(0,Math.round((k-p*4-f*9)/4))};
}
function target(m){
  const c=m?.custom;
  if(c&&+c.kcal>0)return{kcal:Math.round(+c.kcal),p:Math.round(+c.p||0),f:Math.round(+c.f||0),c:Math.round(+c.c||0),custom:true};
  return autoTarget(m);
}
/* магазины, доступные пользователю: если указан адрес и рядом что-то нашлось — только сети в радиусе 3 км (+ доставка по городу) */
const nearOn=()=>S.home&&S.near&&Object.keys(S.near).length>0;
/* магазины: если указан дом — те, что карта нашла рядом (список города не важен);
   доставку можно включить всегда, но если не знаем, возит ли она в этот город, — только вручную (dlvOn) */
const nrm=t=>(t||'').toLowerCase().replace(/ё/g,'е').trim();
/* город и область дома: из адреса; у старых адресов город берём из подписи «улица · Город» */
const homeTown=()=>S.home?(S.home.town||(S.home.label||'').split(' · ').pop()):(S.city!=='Другой город'?S.city:'');
/* возит ли сервис доставки к нам: 'yes' / 'no' (нет в их списке) / '?' (город не знаем) */
function dlvStatus(s){const t=nrm(homeTown()),r=nrm(S.home&&S.home.region);if(!t&&!r)return '?';
  if((DLV_CITY[s]||[]).some(c=>nrm(c)===t)||(r&&(DLV_REGION[s]||[]).some(c=>nrm(c)===r)))return 'yes';
  return 'no'}
const dlvKnown=s=>dlvStatus(s)==='yes';
const dlvOk=s=>ST(s)!=='dlv'||dlvKnown(s)||!!(S.dlvOn&&S.dlvOn[s]);
const cityStores=()=>{const c=CITY[S.city].s,dl=SK.filter(s=>ST(s)==='dlv');
  return nearOn()?SK.filter(s=>ST(s)==='dlv'||S.near[s]):[...new Set([...c,...dl])]};
/* настоящие ли цены у магазина: есть свежий сбор (скрипт, расширение, файл) или пока только встроенные примерные.
   date — дата последнего обновления, how — откуда. Статус сети st (data.js): active — сборщик есть, soon — скоро */
function priceInfo(s){
  const u=S.priceSrc?.[s],f=FEED?.sources?.[s],fd=f&&f.items!==0&&priceDate(f.date)?f:null;
  let date=null,how='';
  if(u&&(!fd||u.date>=fd.date)){date=u.date;how=u.how}else if(fd){date=fd.date;how='сборщик цен'}
  if(!date&&S.ext&&Object.values(S.ext).some(r=>r&&r[s]!=null)){date=new Date().toISOString().slice(0,10);how='расширение'}
  return{live:!!date,date,how,soon:STORES.find(x=>x.id===s)?.st==='soon'};
}
/* дата самых свежих НАСТОЯЩИХ цен: только источники, где что-то собралось (пустой запуск сборщика не считается) */
const feedDate=()=>Object.values(FEED?.sources||{}).filter(f=>f&&f.items!==0&&f.date).map(f=>f.date).sort().pop()||'';
const dmy=d=>d?d.split('-').reverse().slice(0,2).join('.'):'';
/* значок у магазина: «Цены 08.11» или «Скоро» (цены примерные) */
const pbadge=s=>{const i=priceInfo(s);return i.live?`<span class="pst live" title="Цены обновлены ${dmy(i.date)} · ${esc(i.how)}">Цены ${dmy(i.date)}</span>`
  :`<span class="pst soon" title="Настоящих цен пока нет, считаем по примерным">${i.soon?'Скоро':'Примерные'}</span>`};
const activeStores=()=>SK.filter(s=>S.stores[s]&&S.tiers[ST(s)]&&cityStores().includes(s)&&dlvOk(s)&&(!S.hideApprox||priceInfo(s).live));
function validPrice(value){
  if(typeof value!=='number'&&(typeof value!=='string'||!value.trim()))return null;
  const p=Number(value);
  return Number.isSafeInteger(Math.round(p*100))&&p>=.01?p:null;
}
function price(pid,s){
  if(!cityStores().includes(s))return null;
  const o=S.prices[pid]?.[s];
  if(o==='-')return null;
  const override=validPrice(o)??validPrice(S.ext?.[pid]?.[s])??validPrice(FEED?.prices?.[pid]?.[s]);
  if(override!=null)return override;
  const b=PROD[pid].base[s];
  return b==null?null:Math.round(b*CITY[S.city].k);
}
function unitMin(pid){
  let best=Infinity;
  activeStores().forEach(s=>{const p=price(pid,s);if(p!=null)best=Math.min(best,p/PROD[pid].pack)});
  return best===Infinity?null:best;
}
const rCost=r=>Object.entries(r.ing).reduce((a,[id,g])=>a+(unitMin(id)??0)*g,0);
/* продукты, которые нельзя: по предпочтениям («Без свинины»…) и «не люблю» */
// Generic exclusions cover every variant; old specific exclusions stay specific.
const FOOD_GROUPS={pelmeni:['pelmeni','pelmeni_kur'],sosiski:['sosiski','sosiski_kur'],farsh:['farsh','farsh_gov','farsh_kur']};
const FOOD_NAMES={pelmeni:'Пельмени · любые',sosiski:'Сосиски · любые',farsh:'Фарш · любой'};
const dislikedProduct=id=>S.dislikes.some(x=>x===id||(FOOD_GROUPS[x]||[]).includes(id));
const dietProduct=id=>PREFS.some(p=>S.prefs[p.id]&&ptags(id).some(t=>p.ex.includes(t)));
function toggleFood(id){
 const ids=FOOD_GROUPS[id]||[id];
 if(S.dislikes.includes(id))S.dislikes=S.dislikes.filter(x=>!ids.includes(x));
 else {S.dislikes=S.dislikes.filter(x=>!ids.includes(x));S.dislikes.push(id)}
 markDirty();resub();rerenderBody();
}
function uniqueDishes(list){const seen=new Set();return list.filter(r=>{const k=r.n.toLocaleLowerCase('ru').replace(/ё/g,'е').trim();if(seen.has(k))return false;seen.add(k);return true})}
function badProd(id){const ex=new Set();PREFS.forEach(p=>{if(S.prefs[p.id])p.ex.forEach(t=>ex.add(t))});
  return ptags(id).some(t=>ex.has(t))||dislikedProduct(id)}
/* «База на кухне» (соль, масло, сахар): считаем, что есть дома, пока человек не отметит «закончилось» */
const isBase=id=>BASE.includes(id)&&!(S.baseOut||[]).includes(id);
const canGet=id=>isBase(id)||unitMin(id)!=null||(S.pantry[id]||0)>0;
/* блюда не выкидываем, а подставляем замены: фарш → говяжий/куриный, свинина → говядина/курица и т. д. */
function resub(){
  const available=new Set(Object.keys(PROD).filter(canGet));
  applySubs(badProd,id=>available.has(id));
}
/* техника на кухне: без духовки запекаем в мультиварке; без плиты — тоже в мультиварке, кроме блинов */
const KIT=[['stove','Плита','варить, жарить'],['oven','Духовка','запекать'],['mc','Мультиварка','заменит духовку или плиту'],
  ['air','Аэрогриль','заменит духовку'],['blender','Блендер','пюре, взбить'],['micro','Микроволновка','разогреть, разморозить']];
const kit=()=>Object.assign({stove:true,oven:true,mc:false,air:false,blender:false,micro:false},S.kit);
function kitOk(r){const k=kit();
  if(r.need.oven&&!k.oven&&!k.mc&&!k.air)return false;
  if(r.need.stove&&!k.stove&&!(k.mc&&!r.pan))return false;
  return true}
function kitNote(r){const k=kit(),n=[];
  if(r.need.oven&&!k.oven)n.push(k.air?'Духовки нет, запекайте в аэрогриле. Температуру ставьте на 20 °C ниже, чем в рецепте, а время примерно на пятую часть меньше. Готовность проверьте.'
    :'Духовки нет, готовьте в мультиварке в режиме «Выпечка» примерно столько же, проверьте готовность.');
  if(/блендер/i.test(r.st)&&!k.blender)n.push('Блендера нет, разомните вилкой или толкушкой. Получится чуть грубее.');
  if(r.need.stove&&!k.stove)n.push('Плиты нет, готовьте в мультиварке: режимы «Жарка», «Тушение», «Суп» или «Каша».');
  return n.join(' ')}
function excluded(r){
  return r.blocked||!kitOk(r)||(S.nodish||[]).includes(r.id)||Object.keys(r.ing).some(badProd)||!Object.keys(r.ing).every(canGet);
}
/* «Что вы едите»: блюда каждого приёма пищи разбиты на привычные виды. Выключенный вид не попадает
   в этот приём (например, гречка с яйцом на завтрак). Вид определяем по названию блюда. */
const EAT={
  b:[['pan','Блины и оладьи','Сладкие и с сыром','x3',/блин|оладь|овсяноблин|манник/i],
     ['curd','Творог и сырники','Запеканка, вареники','b4',/твор|сырник|вареник/i],
     ['egg','Омлет и яичница','','x5',/омлет|яичниц/i],
     ['bread','Бутерброды и тосты','Гренки, горячие бутерброды','x7',/бутерброд|тост|гренк/i],
     ['drink','Кефир с фруктами','','x10',/кефир/i],
     ['porr','Каши','Овсянка, манка, рисовая','b1',/каш|овсянк|манн/i],
     ['grain','Крупа с яйцом','Гречка с яйцом и овощами','b14',/гречка с яйцом/i]],
  l:[['soup','Супы','Борщ, щи, куриный, уха','l1',/суп|борщ|щи |^щи|рассольник|уха|харчо|солянка|свекольник/i],
     ['hot','Второе на обед','Мясо или рыба с гарниром','m4',/./]],
  d:[['light','Лёгкий ужин','Омлет, творог, оладьи','m13',/омлет|творож|вареник|кабачков|драник/i],
     ['salad','Сытные салаты','Винегрет, оливье','x44',/винегрет|оливье/i],
     ['hot','Горячее с гарниром','Мясо, рыба, макароны','x42',/./]]
};
function eatCat(r,m){const L=EAT[m];if(!L)return null;const c=L.find(c=>c[4].test(r.n0||r.n));return c?c[0]:null}
const eatOk=(r,m)=>{const c=eatCat(r,m);return !c||!(S.eatOff||[]).includes(m+':'+c)};
function mealPool(allowed,m){return allowed.filter(r=>r.m.includes(m)&&eatOk(r,m))}
const allowedRecipes=()=>uniqueDishes(RECIPES.filter(r=>!excluded(r)));
const mealsList=()=>S.snack?['b','l','d','s']:['b','l','d'];
const mealShare=()=>S.snack?{b:.25,l:.35,d:.3,s:.1}:{b:.28,l:.39,d:.33};
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return(s%100000)/100000}}
function cpk(r){let c=0;for(const[id,g] of Object.entries(r.ing)){c+=isBase(id)?0:(unitMin(id)??0)*g*((S.pantry[id]||0)>0?.3:1)}return c/Math.max(r.kcal,1)}
const facFor=(r,meal,targets)=>targets.map(t=>clamp(t.kcal*mealShare()[meal]/r.kcal,.4,2.5));
/* режим готовки: shared — общие блюда, у каждого своя граммовка; sep — каждому свои блюда */
const sepMode=()=>S.cook==='sep'&&S.family.length>1;
/* ---------- готовка впрок ----------
   prep = на сколько дней готовим за раз (1 — каждый день, 2 или 3). Больше 3 не даём: готовую еду
   держат в холодильнике 3–4 дня, берём с запасом. Впрок идут обед и ужин (и завтрак, если prepB). */
const PREP=()=>clamp(+S.prep||1,1,3);
const isPrep=m=>PREP()>1&&(m==='l'||m==='d'||(m==='b'&&S.prepB));
const cookDay=d=>d-d%PREP();
/* все приёмы одного «котла»: этот же приём пищи в дни от дня готовки */
function batchOf(di,mi){
  const x=S.plan.days[di].meals[mi];if(!x||!x.rid||!(x.prep||x.from!=null))return null;
  const cd=x.from!=null?x.from:di,out=[];
  for(let d=cd;d<S.plan.days.length;d++){const k=S.plan.days[d].meals.findIndex(y=>y.meal===x.meal&&y.who===x.who&&y.rid===x.rid&&(d===cd?y.prep:y.from===cd));if(k>=0)out.push([d,k])}
  return{cd,items:out};
}
const facOne=(r,meal,targets,j)=>targets.map((t,i)=>i===j?clamp(t.kcal*mealShare()[meal]/r.kcal,.4,2.5):0);
const facX=(x,targets)=>x.who!=null?facOne(RID[x.rid],x.meal,targets,x.who):facFor(RID[x.rid],x.meal,targets);
/* насколько блюдо подходит под цель: при похудении — больше белка и меньше жира, при наборе — больше белка */
function goalScore(r,goal){const ps=r.p*4/Math.max(r.kcal,1),fs=r.f*9/Math.max(r.kcal,1);return goal==='lose'?-4*ps+1.5*fs:goal==='gain'?-2*ps:0}

/* личные добавки: закрывают нехватку белка, не меняя общего меню семьи */
const ADDON={lose:['tvorog','kurica_file','kefir','yaytsa'],gain:['tvorog','yaytsa','kurica_file','moloko'],keep:['tvorog','yaytsa','kefir']};
const ADDCAP={tvorog:250,kurica_file:200,yaytsa:165,kefir:500,moloko:500};
const ADDTAG={tvorog:'dairy',kefir:'dairy',moloko:'dairy',yaytsa:'eggs',kurica_file:'chicken'};
const ADDWHEN={tvorog:'на перекус или завтрак',kefir:'на перекус или на ночь',moloko:'на перекус',yaytsa:'варёные, на перекус',kurica_file:'запечь к ужину'};
function addonOK(pid){const ex=new Set();PREFS.forEach(p=>{if(S.prefs[p.id])p.ex.forEach(t=>ex.add(t))});
  const k=kit();
  if((pid==='yaytsa'&&!k.stove&&!k.mc)||(pid==='kurica_file'&&!k.oven&&!k.mc))return false;
  return !ex.has(ADDTAG[pid])&&!dislikedProduct(pid)&&(unitMin(pid)!=null||(S.pantry[pid]||0)>0)}
function personalize(day,d,targets){
  day.extra=[];
  S.family.forEach((m,j)=>{
    if((+m.age||0)<15)return;
    const t=targets[j],c=(ADDON[m.goal]||ADDON.keep).filter(addonOK);if(!c.length)return;
    /* чередуем два главных продукта по дням, при нехватке белка добавляем следующий */
    const first=c[d%Math.min(2,c.length)],order=[first,...c.filter(x=>x!==first)].slice(0,2);
    const g={};order.forEach(pid=>g[pid]=0);
    for(let it=0;it<5;it++){
      let k=0,p=0;day.meals.forEach(x=>{if(!x.rid)return;const r=RID[x.rid];k+=r.kcal*x.fac[j];p+=r.p*x.fac[j]});
      order.forEach(pid=>{
        const P=PROD[pid],other=order.reduce((a,q)=>q===pid?a:a+g[q]*PROD[q].p/100,0);
        let v=clamp((t.p-p-other)/(P.p/100),0,ADDCAP[pid]);
        if(pid!==first&&g[first]<ADDCAP[first]-1)v=0;          // второй продукт — только если первого уже максимум
        g[pid]=pid==='yaytsa'?Math.round(v/EGG)*EGG:Math.round(v/10)*10;
      });
      const addK=order.reduce((a,q)=>a+g[q]*PROD[q].k/100,0);
      /* чтобы не перебрать калории, порции общих блюд для этого человека подстраиваем */
      const sc=clamp((t.kcal-addK)/Math.max(k,1),.5,1.6);
      day.meals.forEach(x=>{if(x.rid&&x.fac[j]>0)x.fac[j]=clamp(x.fac[j]*sc,.3,2.5)});
    }
    order.forEach(pid=>{if(g[pid]>=50)day.extra.push({j,pid,g:g[pid]})});
  });
}

/* Добор белка: после сборки дня считаем белок каждого взрослого. Недобор больше 15 % — меняем перекус
   (а если его нет или не помогло — ужин) на самое белковое блюдо того же приёма пищи (творог, яйца, курица, рыба, бобовые),
   но не дороже ~1,5 раза текущего и не дороже средней цены меню ×1,3 — чтобы не вылететь из бюджета.
   Блюда «впрок» и «из контейнера» не трогаем — их ест несколько дней подряд. Потом personalize добирает остаток добавками. */
function proteinFix(day,targets,allowed,C,med){
  const dayP=()=>{const t=S.family.map(()=>0);day.meals.forEach(x=>{if(!x.rid)return;const r=RID[x.rid];x.fac.forEach((f,j)=>{if(t[j]!=null)t[j]+=r.p*f})});return t};
  const done=new Set();
  for(const meal of ['s','d']){
    const P=dayP();
    const short=S.family.map((m,j)=>(+m.age||0)>=15&&P[j]<targets[j].p*.85);
    if(!short.some(Boolean))return;
    day.meals.forEach((x,k)=>{
      if(x.meal!==meal||!x.rid||x.from!=null||x.prep||done.has(k))return;
      if(x.who!=null&&!short[x.who])return;
      const cur=RID[x.rid],dens=r=>r.p*4/Math.max(r.kcal,1),inDay=new Set(day.meals.map(y=>y.rid));
      const cap=Math.max(C[cur.id]*1.5,med*1.3);
      const c=mealPool(allowed,meal).filter(r=>!inDay.has(r.id)&&C[r.id]<=cap&&dens(r)>dens(cur)+.05);
      if(!c.length)return;
      c.sort((a,b)=>dens(b)-dens(a)+.3*(C[a.id]-C[b.id])/med);
      const best=c[0];x.rid=best.id;x.fac=x.who!=null?facOne(best,meal,targets,x.who):facFor(best,meal,targets);x.pfix=true;done.add(k);
    });
  }
}
/* сколько раз блюдо было за последние 7 дней (hist — массив наборов блюд по дням) */
const week=(hist,id)=>hist.slice(-6).reduce((a,t)=>a+(t.has(id)?1:0),0);
function buildPlan(costW,seed){
  const N=S.days;
  const R=rng(seed),meals=mealsList(),targets=S.family.map(target),allowed=allowedRecipes();
  const C={};allowed.forEach(r=>C[r.id]=cpk(r));
  const vals=Object.values(C).sort((a,b)=>a-b);const med=vals[Math.floor(vals.length/2)]||1;
  const days=[];
  if(sepMode()){
    const used=S.family.map(()=>({})),prev=S.family.map(()=>new Set()),hist=S.family.map(()=>[]);
    for(let d=0;d<N;d++){
      const day={meals:[]},today=S.family.map(()=>new Set());
      meals.forEach(m=>{
        let pool=mealPool(allowed,m);const slot=[];
        if(isPrep(m)){const k=pool.filter(r=>r.keeps);if(k.length)pool=k}
        S.family.forEach((mem,j)=>{
          if(isPrep(m)&&d!==cookDay(d)){const src=days[cookDay(d)].meals.find(y=>y.meal===m&&y.who===j&&y.prep);
            if(src){const r=RID[src.rid];used[j][r.id]=(used[j][r.id]||0)+1;today[j].add(r.id);day.meals.push({meal:m,rid:r.id,who:j,fac:facOne(r,m,targets,j),from:cookDay(d)});return}}
          let c=pool.filter(r=>!today[j].has(r.id)&&week(hist[j],r.id)<2);if(!c.length)c=pool.filter(r=>!today[j].has(r.id));if(!c.length)c=pool;
          if(!c.length){day.meals.push({meal:m,rid:null,who:j});return}
          let best=null,bs=Infinity;
          c.forEach(r=>{const sc=costW*(C[r.id]/med)+.7*(used[j][r.id]||0)+(prev[j].has(r.id)?1.5:0)-(S.likes.includes(r.id)?.6:0)+goalScore(r,mem.goal)+(slot.includes(r.id)?.8:0)+R()*.6;if(sc<bs){bs=sc;best=r}});
          used[j][best.id]=(used[j][best.id]||0)+1;today[j].add(best.id);slot.push(best.id);
          day.meals.push({meal:m,rid:best.id,who:j,fac:facOne(best,m,targets,j),...(isPrep(m)&&best.keeps&&d===cookDay(d)?{prep:true}:{})});
        });
      });
      proteinFix(day,targets,allowed,C,med);
      personalize(day,d,targets);
      S.family.forEach((_,j)=>{prev[j]=today[j];hist[j].push(today[j])});days.push(day);
    }
    return{days,targets};
  }
  const used={},hist=[];let prev=new Set();
  for(let d=0;d<N;d++){
    const today=new Set(),day={meals:[]};
    meals.forEach(m=>{
      /* впрок: не день готовки — едим то, что сварили в день готовки */
      if(isPrep(m)&&d!==cookDay(d)){const src=days[cookDay(d)].meals.find(y=>y.meal===m&&y.prep);
        if(src){const r=RID[src.rid];used[r.id]=(used[r.id]||0)+1;today.add(r.id);day.meals.push({meal:m,rid:r.id,fac:facFor(r,m,targets),from:cookDay(d)});return}}
      let pool=mealPool(allowed,m);
      if(isPrep(m)){const k=pool.filter(r=>r.keeps);if(k.length)pool=k}
      let c=pool.filter(r=>!today.has(r.id)&&week(hist,r.id)<2);if(!c.length)c=pool.filter(r=>!today.has(r.id));if(!c.length)c=pool;
      if(!c.length){day.meals.push({meal:m,rid:null});return}
      let best=null,bs=Infinity;
      c.forEach(r=>{const s=costW*(C[r.id]/med)+.7*(used[r.id]||0)+(prev.has(r.id)?1.5:0)-(S.likes.includes(r.id)?.6:0)+R()*.6;if(s<bs){bs=s;best=r}});
      used[best.id]=(used[best.id]||0)+1;today.add(best.id);
      day.meals.push({meal:m,rid:best.id,fac:facFor(best,m,targets),...(isPrep(m)&&best.keeps&&d===cookDay(d)?{prep:true}:{})});
    });
    proteinFix(day,targets,allowed,C,med);
    personalize(day,d,targets);
    prev=today;hist.push(today);days.push(day);
  }
  return{days,targets};
}

/* готовый вес одной стандартной порции, г. Не готовится (салат, бутерброд) — вес как есть.
   Каша на молоке: крупа набухает в молоке, которое уже посчитано, — крупе коэффициент 1.
   Суп: крупа набухает в бульоне (коэффициент 1), а воды добавляем ~200 мл на порцию (в списке продуктов её нет). Это оценка — так и подписываем. */
const SOUP=/суп|борщ|щи|уха|рассольн|харчо|свекольник|солянк/i;
function cookedG(r){
  const st=(r.st||'').toLowerCase(),cooked=!/готовить не нужно/.test(st)&&/вар|жар|туш|запе[кч]|печ|духовк|подсуш/.test(st);
  const ing=r.ing||{},sum=f=>Object.keys(ing).filter(f).reduce((a,id)=>a+ing[id],0);
  const cer=sum(id=>PROD[id]?.cat==='Крупы'),liq=sum(id=>id==='moloko'||id==='kefir');
  const soup=cooked&&SOUP.test(r.n0||r.n);
  let w=0;for(const[id,g] of Object.entries(ing)){let y=cooked?yieldOf(id):1;if(y>2&&(soup||liq>=cer*2))y=1;w+=g*y}
  if(soup)w+=200;
  return Math.max(1,Math.round(w));
}
const plannedRecipe=(plan,id)=>plan?.recipes?.[id]||RID[id];
function shopping(plan){
  const need={};
  plan.days.forEach(d=>{d.meals.forEach(x=>{if(!x.rid)return;const r=plannedRecipe(plan,x.rid),f=x.fac.reduce((a,b)=>a+b,0);for(const[id,g] of Object.entries(r.ing))need[id]=(need[id]||0)+g*f});
    (d.extra||[]).forEach(e=>need[e.pid]=(need[e.pid]||0)+e.g)});
  const items=Object.keys(need).map(pid=>{
    if(isBase(pid))return{pid,need:need[pid],have:need[pid],buy:0,packs:0,left:0,base:true};
    const have=S.pantry[pid]||0,buy=Math.max(0,need[pid]-have),pk=PROD[pid].pack;
    const packs=Math.max(0,Math.ceil(buy/pk-1e-10));
    return{pid,need:need[pid],have,buy,packs,left:Math.max(0,packs*pk-buy)};
  }).sort((a,b)=>PROD[a.pid].cat.localeCompare(PROD[b.pid].cat)||PROD[a.pid].n.localeCompare(PROD[b.pid].n));
  const toBuy=items.filter(i=>i.packs>0);
  const st=activeStores();
  /* сравниваем магазины по стоимости нужного количества в ИХ фасовке, а не по цене одной пачки */
  const offers=Object.fromEntries(toBuy.map(i=>[i.pid,Object.fromEntries(st.map(s=>[s,offer(i.pid,s,i.buy)]))]));
  const costFor=set=>{
    let total=0;const missing=[],alloc={};
    toBuy.forEach(i=>{let bs=null,bo=null;set.forEach(s=>{const o=offers[i.pid][s];if(o&&(!bo||o.cost<bo.cost)){bo=o;bs=s}});
      if(bs==null){missing.push(i.pid);return}
      total+=bo.cost;(alloc[bs]=alloc[bs]||[]).push({...i,price:bo.price,packs:bo.packs,left:bo.left,pl:bo.pl})});
    return{set,total:Math.round(total*100)/100,missing,alloc};
  };
  const best=a=>a.slice().sort((x,y)=>x.missing.length-y.missing.length||x.total-y.total||Object.keys(x.alloc).length-Object.keys(y.alloc).length)[0];
  const singles=st.map(s=>costFor([s]));
  const pairs=[];for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++)pairs.push(costFor([st[i],st[j]]));
  const all=costFor(st),bestSingle=best(singles),bestPair=best(pairs);
  const recommended=(S.maxStores==1?bestSingle:S.maxStores==2?best([...singles,...pairs]):all)||all;
  return{items,toBuy,offers,singles,bestSingle,bestPair,all,recommended};
}
const shop=()=>SH||(SH=S.plan?shopping(S.plan):null);
/* фасовка в магазине: вес из названия найденного товара («Томатная паста Кухмастер 480г» → 480 г).
   Цены у нас хранятся за НАШУ упаковку (сборщики пересчитывают), поэтому цена пачки магазина = цена × вес / наша упаковка.
   Нет веса в названии (картофель на развес) или вес странный — считаем нашей упаковкой. */
const SPK={};
function storeName(pid,s){for(const nm of [S.extName,S.pasteName,FEED?.names]){const n=nm?.[pid]?.[s];if(typeof n==='string'&&n)return n}return ''}
function storePack(pid,s){
  const n=storeName(pid,s),k=pid+'|'+s+'|'+n;if(k in SPK)return SPK[k];
  const P=PROD[pid],t=n.toLowerCase().replace(/(\d),(\d)/g,'$1.$2');let g=null,m;
  if(/шт/.test(P.pl)){if((m=t.match(/(\d+)\s*шт/)))g=+m[1]*P.pack/parseFloat(P.pl)}
  else if((m=t.match(/(\d+(?:\.\d+)?)\s*(кг|л)(?![а-я])/)))g=+m[1]*1000;
  else if((m=t.match(/(\d+(?:\.\d+)?)\s*(г|гр|мл)(?![а-я])/)))g=+m[1];
  if(!g||g<P.pack*.2||g>P.pack*5||Math.abs(g-P.pack)<1)g=null;
  return SPK[k]=g;
}
const fmtPack=(pid,g)=>{const P=PROD[pid];if(/шт/.test(P.pl))return Math.round(g/(P.pack/parseFloat(P.pl)))+' шт';
  const liq=/мл|л$/.test(P.pl),n=v=>(Math.round(v*100)/100).toLocaleString('ru-RU');
  return g>=1000?n(g/1000)+(liq?' л':' кг'):Math.round(g)+(liq?' мл':' г')};
/* предложение магазина на нужное количество: цена пачки, сколько пачек, остаток */
function offer(pid,s,buy){
  const p=price(pid,s);if(p==null)return null;
  const P=PROD[pid],g=storePack(pid,s)||P.pack,pp=g===P.pack?p:Math.round(p*g/P.pack);
  const packs=Math.max(0,Math.ceil(buy/g-1e-10));
  return{price:pp,packs,pk:g,pl:g===P.pack?P.pl:fmtPack(pid,g),cost:pp*packs,left:Math.max(0,packs*g-buy)};
}
/* сколько стоит позиция: цена с чека, если вписали, иначе по плану */
const icost=i=>S.paid?.[i.pid]!=null?S.paid[i.pid]:i.price*i.packs;
const effTotal=rec=>Math.round(Object.values(rec.alloc).flat().reduce((a,i)=>a+icost(i),0)*100)/100;
const spentNow=rec=>Object.values(rec.alloc).flat().filter(i=>S.bought[i.pid]).reduce((a,i)=>a+icost(i),0);
/* строка товара в корзине. В режиме магазина цена — отдельная кнопка (вписать сумму с чека) */
function itemRow(i,s){
  const b=!!S.bought[i.pid],pd=S.paid?.[i.pid],plan=i.price*i.packs,P=PROD[i.pid];
  const prc=pd!=null?`${rub(pd)}${Math.round(pd)!==Math.round(plan)?`<s>${rub(plan)}</s>`:''}`:rub(plan);
  if(!S.shopMode)return `<button class="it ${b?'done':''}" data-act="bought" data-v="${i.pid}" aria-pressed="${b}">
        ${pthumb(i.pid,s)}
        <div class="nm">${pname(i.pid)}<div>${i.packs} × ${i.pl||P.pl} · нужно ${fmtQty(i.pid,i.buy)}</div>${pnote(i.pid,s)}</div>
        <span class="pr">${prc}</span><span class="chk">${I.check}</span></button>`;
  return `<div class="it shopm ${b?'done':''}"><button class="itb" data-act="bought" data-v="${i.pid}" aria-pressed="${b}">${pthumb(i.pid,s)}<div class="nm">${pname(i.pid)}<div>${i.packs} × ${i.pl||P.pl}</div></div></button>
    <button class="pr ed ${pd!=null?'set':''}" data-act="paid" data-v="${i.pid}" aria-label="Цена с чека: ${P.n}">${prc}</button>
    <button class="chk" data-act="bought" data-v="${i.pid}" aria-pressed="${b}" aria-label="Куплено">${I.check}</button></div>`;
}
const shopList=(list,s)=>{const rest=list.filter(i=>!S.bought[i.pid]),got=list.filter(i=>S.bought[i.pid]);
  return (rest.length?rest.map(i=>itemRow(i,s)).join(''):`<div class="sdone">${I.check}Здесь всё куплено</div>`)
    +(got.length?`<div class="sdiv">В корзине · ${got.length}</div>`+got.map(i=>itemRow(i,s)).join(''):'')};
/* поиск в сервисах доставки. Целую корзину передать нельзя — открываем поиск по каждому товару.
   Самокат: samokat.ru/search?value=…; Лавка: lavka.yandex.ru/<код города>/search?text=… (213 — Москва, 2 — Петербург);
   Ozon fresh: раздел supermarket-25000 с поиском text=… */
const DLV_IN={samokat:'в Самокате',lavka:'в Яндекс Лавке',ozon:'в Ozon fresh'};
const dlvQ=pid=>PROD[pid].n.replace(/\s*\d+([,.]\d+)?%/,'').replace(/\s+С1$/,'')+(isHalalItem(pid)?' халяль':'');
const DLV_URL={samokat:q=>`https://samokat.ru/search?value=${encodeURIComponent(q)}`,
  lavka:q=>`https://lavka.yandex.ru/${{'Москва':'213/','Санкт-Петербург':'2/'}[S.city]||''}search?text=${encodeURIComponent(q)}`,
  ozon:q=>`https://www.ozon.ru/category/supermarket-25000/?miniapp=supermarket&text=${encodeURIComponent(q)}`};
/* халяль с маркировкой: мясо и курицу в покупках подписываем «халяль» */
const halalMark=()=>!!S.prefs.halal&&S.halalMode!=='pork';
const isHalalItem=id=>halalMark()&&ptags(id).some(t=>t==='chicken'||t==='beef');
const pname=id=>PROD[id].n+(isHalalItem(id)?' · халяль':'');
/* ---- приложение на телефон: работа без интернета и установка на экран «Домой» ---- */
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let INSTALL=null; // событие установки (Android, Chrome) — показываем системное окно по кнопке
addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTALL=e});
addEventListener('appinstalled',()=>{INSTALL=null;toast('tabi на экране телефона','sparkles')});
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>{
  navigator.serviceWorker.register('sw.js').catch(()=>{});
  /* картинки блюд текущего меню заранее сохраняем — без интернета меню будет с фото */
  setTimeout(()=>{if(!S.plan)return;[...new Set(S.plan.days.flatMap(d=>d.meals.map(x=>x.rid).filter(Boolean)))].forEach(id=>fetch(`img2/dish/${id}.jpg`).catch(()=>{}))},4000);
});
addEventListener('offline',()=>toast('Нет интернета, показываем сохранённое','gear'));
const copyTxt=t=>{if(!navigator.clipboard){toast('В этом браузере копирование недоступно','gear');return}
  navigator.clipboard.writeText(t).then(()=>toast('Список скопирован, вставьте его в мессенджер','shopping_cart'),()=>toast('Не удалось скопировать','gear'))};

function fitsBudget(rec){
  return !rec.missing.length&&rec.total<=S.budget;
}
function partialDay(template){
  const day={meals:template.days[0].meals.map(({meal,who})=>({meal,who,rid:null,limited:true})),extra:[]};
  const plan={days:[day],targets:template.targets,partial:true};
  const allowed=allowedRecipes();
  for(const x of day.meals){
    const pool=mealPool(allowed,x.meal);
    let best=null,cost=Infinity;
    for(const r of pool){
      x.rid=r.id;x.fac=facX(x,plan.targets);
      const rec=shopping(plan).recommended;
      if(fitsBudget(rec)&&rec.total<cost){best={rid:x.rid,fac:x.fac};cost=rec.total}
    }
    Object.assign(x,best?{...best,limited:false}:{rid:null,fac:undefined,limited:!!pool.length});
  }
  return plan;
}

function longestAffordablePrefix(plan,minDays){
  let lo=minDays,hi=plan.days.length-1;
  let best=null;
  // With the same recipes and portions, adding days cannot reduce the checkout total.
  while(lo<=hi){
    const n=Math.floor((lo+hi)/2),prefix={...plan,days:plan.days.slice(0,n)};
    if(fitsBudget(shopping(prefix).recommended)){best=prefix;lo=n+1}
    else hi=n-1;
  }
  return best;
}

/* Остатки: при новой сборке меню переносим в «Что есть дома» то, что лежит дома после старого плана.
   Купленное (отмечено в корзине) + бывшее дома − съеденное за прошедшие дни старого плана.
   Неделя кончилась — съедено всё по плану, остаются хвосты упаковок (300 г сметаны − 150 г = 150 г).
   Меню пересобрали посреди недели — купленное целиком минус съеденное до сегодня. Повторная сборка в тот же
   день ничего не добавит: отметки «куплено» сбрасываются, начало нового плана — сегодня. База на кухне не учитывается. */
function settlePantry(old){
  if(!old?.days?.length||!old.start)return[];
  const N=old.days.length,E=clamp(Math.floor((new Date().setHours(0,0,0,0)-old.start)/864e5),0,N);
  const ate={};
  old.days.slice(0,E).forEach(d=>{d.meals.forEach(x=>{if(!x.rid)return;const r=plannedRecipe(old,x.rid),f=(x.fac||[1]).reduce((a,b)=>a+b,0);
    for(const[id,g] of Object.entries(r.ing))ate[id]=(ate[id]||0)+g*f});(d.extra||[]).forEach(e=>ate[e.pid]=(ate[e.pid]||0)+e.g)});
  const moved=[],today=new Date().setHours(0,0,0,0);S.pantryAt||={};
  shopping(old).items.forEach(i=>{
    if(i.base||!PROD[i.pid])return;
    const got=S.bought?.[i.pid]?i.packs*PROD[i.pid].pack:0,was=S.pantry[i.pid]||0;
    if(!got&&!was)return;
    let v=Math.max(0,was+got-(ate[i.pid]||0));
    v=i.pid==='yaytsa'?Math.round(v/EGG)*EGG:Math.round(v/5)*5;
    if(got)S.pantryAt[i.pid]=old.start; // остаток считаем от свежей покупки
    if(v<10)delete S.pantry[i.pid];else S.pantry[i.pid]=v;
    if(got&&v>=10&&(today-old.start)/864e5<=shelf(i.pid))moved.push(`${PROD[i.pid].n} ${fmtQty(i.pid,v)}`);
  });
  /* испорченное (дольше срока хранения) из «Что есть дома» убираем; соль и всё, что человек внёс сам без даты, не трогаем */
  for(const id of Object.keys(S.pantry)){const at=S.pantryAt[id];
    if(at&&(today-at)/864e5>shelf(id)){delete S.pantry[id];delete S.pantryAt[id]}}
  for(const id of Object.keys(S.pantryAt))if(!S.pantry[id])delete S.pantryAt[id];
  return moved;
}
let MOVED=null; // что перенесли в «Что есть дома» при последней сборке (для подсказки)
function generate(reseed){
  if(!activeStores().length){toast('Включите хотя бы один магазин','shopping_cart');return false}
  if(!S.family.length){toast('Добавьте хотя бы одного человека','smiling_face');return false}
  MOVED=S.plan?settlePantry(S.plan):[];
  resub();
  if(reseed)S.seed++;
  let p=null,cheapest=Infinity,template;
  for(const w of [1,2,4,8,16,32,64,128,256]){
    template=buildPlan(w,S.seed);
    const options=[template];
    if(template.days.some(d=>d.extra.length)){
      options.push({...template,days:template.days.map(d=>({...d,extra:[]}))});
    }
    for(const candidate of options){
      const rec=shopping(candidate).recommended;
      if(!rec.missing.length&&candidate.days.every(d=>d.meals.every(x=>x.rid)))cheapest=Math.min(cheapest,rec.total);
      if(fitsBudget(rec)){p=candidate;break}
      p=longestAffordablePrefix(candidate,(p?.days.length||0)+1)||p;
    }
    if(p?.days.length===S.days)break;
  }
  p=p||partialDay(template);
  if(p.partial||p.days.length<S.days){
    p.short={want:S.days,full:Number.isFinite(cheapest)?cheapest:null};
  }
  const recipeIds=new Set(p.days.flatMap(d=>d.meals.map(x=>x.rid).filter(Boolean)));
  p.recipes=Object.fromEntries([...recipeIds].map(id=>[id,structuredClone(RID[id])]));
  p.start=new Date().setHours(0,0,0,0);
  S.plan=p;S.bought={};S.paid={};S.day=0;S.dayAt=new Date().toDateString();S.dirty=false;SH=null;save();return true;
}
function swapMeal(di,mi){
  const d=S.plan.days[di],x=d.meals[mi],bt=batchOf(di,mi);
  let pool=mealPool(allowedRecipes(),x.meal).filter(r=>!d.meals.some((y,j)=>j!==mi&&y.who===x.who&&y.rid===r.id));
  if(bt)pool=pool.filter(r=>r.keeps);
  pool.sort((a,b)=>cpk(a)-cpk(b));
  const i=pool.findIndex(r=>r.id===x.rid);
  const alternatives=[...pool.slice(i+1),...pool.slice(0,Math.max(0,i))];
  for(const nr of alternatives){
    const days=[...S.plan.days];
    for(const [dd,k] of bt?bt.items:[[di,mi]]){
      const D=structuredClone(days[dd]);
      D.meals[k].rid=nr.id;
      D.meals[k].fac=facX(D.meals[k],S.plan.targets);
      days[dd]=D;
    }
    const recipes={...S.plan.recipes,[nr.id]:structuredClone(nr)};
    const rec=shopping({...S.plan,days,recipes}).recommended;
    if(fitsBudget(rec)){S.plan={...S.plan,days,recipes};SH=null;save();return nr}
  }
  toast(alternatives.length?'Замены не укладываются в бюджет или недоступны':'Других подходящих блюд нет','fork_and_knife_with_plate');
  return null;
}
function dayTotals(d){
  const tot=S.family.map(()=>({k:0,p:0,f:0,c:0}));
  d.meals.forEach(x=>{if(!x.rid)return;const r=plannedRecipe(S.plan,x.rid);x.fac.forEach((f,j)=>{if(!tot[j])return;tot[j].k+=r.kcal*f;tot[j].p+=r.p*f;tot[j].f+=r.f*f;tot[j].c+=r.c*f})});
  (d.extra||[]).forEach(e=>{const P=PROD[e.pid],t=tot[e.j];if(!t)return;t.k+=P.k*e.g/100;t.p+=P.p*e.g/100;t.f+=P.f*e.g/100;t.c+=P.c*e.g/100});
  return tot;
}

/* ------------------------------ UI-кирпичики ------------------------------ */
function ring(pct,size,sw,color,track,inner=''){
  const r=(size-sw)/2,c=2*Math.PI*r,o=c*(1-clamp(pct,0,1));
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${o}" style="transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)"/></svg><div class="rv">${inner}</div></div>`;
}
const tbadge=s=>`<span class="tier t-${ST(s)}">${TIERS[ST(s)].n}</span>`;
const tierPills=()=>`<div class="pills wrapc">${TK.map(t=>`<button class="pill tap ${S.tiers[t]?'on':''}" data-act="tier" data-v="${t}">${TIERS[t].n}</button>`).join('')}</div>`;
/* 3D-логотип сети (img2/store/<id>.webp); нет картинки — кружок с буквой */
const smark=s=>`<img class="smark" src="img2/store/${s}.webp" alt="" loading="lazy" onerror="this.outerHTML='<i class=&quot;smark l&quot; style=&quot;background:${SC(s)}&quot;>${STORE_MARK[s]}</i>'">`;
const seg=(act,cur,opts)=>`<div class="seg">${opts.map(([v,n])=>`<button data-act="${act}" data-v="${v}" class="${String(cur)===String(v)?'on':''}">${n}</button>`).join('')}</div>`;
const dish=(rid,cls)=>`<img class="ph ${cls}" src="img2/dish/${rid}.jpg" alt="" loading="lazy" onerror="this.onerror=null;this.src='${IMG(RIMG[rid]||'pot_of_food')}';this.classList.add('emo')">`;
const rubN=v=>v.toLocaleString('ru-RU',{maximumFractionDigits:2});
const ini=s=>esc((s||'?').trim().charAt(0).toUpperCase()||'?');
const thumb=(rid,size)=>`<div class="thumb" style="background:${TINT[RID[rid].m[0]]};${size?`width:${size}px;height:${size}px`:''}"><img src="${IMG(RIMG[rid])}" alt=""></div>`;
function toast(t,img){
  document.querySelectorAll('.toast').forEach(e=>e.remove());clearTimeout(toast.t);
  const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.innerHTML=I.ok+esc(t);
  document.body.appendChild(el);toast.t=setTimeout(()=>toastOut(el),2600);
}
const MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const WDN=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const todayLabel=()=>{const d=new Date();return `${WDN[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`};
const greet=()=>{const h=new Date().getHours();return h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер'};
const WD=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const WDF=['воскресенье','понедельник','вторник','среду','четверг','пятницу','субботу'];
/* какой день плана сегодня (может быть за пределами плана: неделя кончилась) */
const todayIdx=()=>S.plan?.start?Math.floor((new Date().setHours(0,0,0,0)-S.plan.start)/864e5):0;
const planOver=()=>!!S.plan&&todayIdx()>=S.plan.days.length;
/* при открытии приложения (и каждый новый день) лента дней встаёт на сегодня; выбор внутри дня запоминаем */
function syncToday(){if(!S.plan)return;const k=new Date().toDateString();if(S.dayAt===k)return;
  S.dayAt=k;S.day=clamp(todayIdx(),0,S.plan.days.length-1);save()}
/* выбранный день — в центр ленты (только сама лента, страница не прокручивается) */
function centerDay(smooth){const d=$('.days'),c=d?.querySelector('.dchip.on');if(!d||!c)return;
  d.scrollTo({left:c.offsetLeft-(d.clientWidth-c.offsetWidth)/2,behavior:smooth?'smooth':'auto'})}
const dayDate=i=>new Date((S.plan?.start||Date.now())+i*864e5);

/* ------------------------------ экраны ------------------------------ */
/* пояснение, если на весь срок денег не хватило: сколько дней покрывает сумма и сколько стоит полный срок */
function shortNote(total){
  const sh=S.plan&&S.plan.short;if(!sh)return '';
  const n=S.plan.days.length,want=sh.want===7?'неделю':sh.want===30?'месяц':sh.want+' '+plural(sh.want,'день','дня','дней');
  const t=S.plan.partial
    ?(S.plan.days[0].meals.some(x=>x.rid)?'Подобрали часть блюд на один день.':'При этих настройках не удалось подобрать блюдо в пределах бюджета.')
    :`План на ${n} ${plural(n,'день','дня','дней')} из ${sh.want}.`;
  return `<div class="short"><b>${t}</b>${Number.isFinite(sh.full)?`<span>Самый дешёвый из найденных полных планов на ${want} стоил ${rub(sh.full)}.</span>`:''}<button class="tap" data-act="tab" data-v="profile">Изменить сумму</button></div>`;
}
const missingNote=rec=>rec.missing.length?`<div class="warn">В сумму не входят недоступные товары: ${rec.missing.map(id=>PROD[id].n).join(', ')}</div>`:'';
/* день готовки: что варим впрок, сколько порций и контейнеров */
function cookRows(di){
  const d=S.plan.days[di];if(!d)return[];
  return d.meals.map((x,k)=>[x,k]).filter(([x])=>x.prep&&x.rid).map(([x,k])=>{
    const bt=batchOf(di,k),n=bt?bt.items.length:1;if(n<2)return null;
    /* порции = тарелки: сколько раз это блюдо съедят за все дни; контейнеры — всё, кроме сегодняшнего */
    let por=0,box=0;bt.items.forEach(([dd,kk])=>{const y=S.plan.days[dd].meals[kk],n=y.fac.filter(f=>f>.05).length;por+=n;if(dd!==di)box+=n});
    return{x,k,n,por,box};
  }).filter(Boolean);
}
function cookCard(){
  if(!S.plan)return '';
  const di=clamp(S.day,0,S.plan.days.length-1),rows=cookRows(di);
  if(!rows.length)return '';
  const box=rows.reduce((a,r)=>a+r.box,0),n=Math.max(...rows.map(r=>r.n));
  return `<div class="cook"><div class="ch"><span class="ci">${I.fork}</span><div><b>Сегодня день готовки</b><span>варим сразу на ${n} ${plural(n,'день','дня','дней')}</span></div></div>
    ${rows.map(r=>`<button class="row tap" data-act="recipe" data-v="${r.x.rid}" data-di="${di}" data-mi="${r.k}">${dish(r.x.rid,'dp sm')}<span class="rl">${esc(plannedRecipe(S.plan,r.x.rid).n)}<div>${MEAL[r.x.meal]} · на ${r.n} ${plural(r.n,'день','дня','дней')} · ${Math.round(r.por)} ${plural(Math.round(r.por),'порция','порции','порций')}</div></span><span class="chev">${I.chev}</span></button>`).join('')}
    <div class="cf">Понадобится контейнеров: <b>${box}</b>. Остудите и уберите в холодильник в течение 2 часов, съешьте за 3 дня. ${kit().micro?'Порцию из контейнера разогрейте в микроволновке 2–3 минуты, перемешав на середине.':'Порцию из контейнера разогрейте на сковороде или в кастрюле под крышкой.'}</div></div>`;
}
/* накануне дня готовки: что разморозить, что замочить, что ещё не куплено и сколько нужно контейнеров */
const THAW_SKIP=new Set(['sosiski','sosiski_kur','pelmeni','pelmeni_kur','tunets']); // варятся из морозилки или консервы
const SOAK={goroh:'горох на 2–3 часа или на ночь',perlovka:'перловку на ночь'};
function prepTip(){
  if(!S.plan)return '';
  const di=clamp(S.day,0,S.plan.days.length-1),rows=cookRows(di+1);
  if(!rows.length)return '';
  const ids=[...new Set(rows.flatMap(r=>Object.keys(plannedRecipe(S.plan,r.x.rid).ing)))];
  const thaw=ids.filter(id=>!THAW_SKIP.has(id)&&ptags(id).some(t=>['chicken','pork','beef','fish'].includes(t)));
  const soak=ids.filter(id=>SOAK[id]);
  const need=shop().toBuy.filter(i=>ids.includes(i.pid)&&!S.bought[i.pid]);
  const box=rows.reduce((a,r)=>a+r.box,0),dt=dayDate(di+1);
  const L=[];
  if(thaw.length)L.push(`<b>Разморозить.</b> Если ${thaw.map(id=>PROD[id].n.toLowerCase()).join(', ')} в морозилке, вечером переложите в холодильник. ${kit().micro?'Если забыли, утром разморозьте в микроволновке в режиме «Разморозка».':'Если забыли, разморозьте в закрытом пакете в холодной воде, меняя воду каждые полчаса.'}`);
  if(soak.length)L.push(`<b>Замочить на ночь.</b> ${cap(soak.map(id=>SOAK[id]).join(', '))}. Так сварится быстрее.`);
  if(need.length)L.push(`<b>Докупить.</b> Ещё не отмечено купленным: ${need.slice(0,5).map(i=>PROD[i.pid].n.toLowerCase()).join(', ')}${need.length>5?` и ещё ${need.length-5}`:''}.`);
  if(box)L.push(`<b>Контейнеры.</b> Понадобится ${box} ${plural(box,'штука','штуки','штук')}, проверьте, что они чистые.`);
  if(!L.length)return '';
  return `<div class="cook tip"><div class="ch"><span class="ci">${I.bolt}</span><div><b>${di+1<S.plan.days.length?'Завтра':''} день готовки</b><span>${WD[dt.getDay()]}, ${dt.getDate()} · что сделать сегодня вечером</span></div></div>
    <ul class="tipl">${L.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}
/* «Съел»: отметки хранятся по дате и человеку — S.ate['2026-11-20|0'] = [индексы приёмов, 'e0' — добавки] */
const dkey=i=>{const t=dayDate(i);return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`};
const ateKey=m=>dkey(clamp(S.day,0,(S.plan?.days.length||1)-1))+'|'+clamp(m??S.member,0,S.family.length-1);
const ateList=m=>(S.ate||{})[ateKey(m)]||[];
function eaten(d,mi){
  const L=ateList(mi),t={k:0,p:0,f:0,c:0,n:0};
  L.forEach(k=>{
    if(String(k).startsWith('e')){const e=d.extra?.[+String(k).slice(1)];if(!e||e.j!==mi)return;const P=PROD[e.pid],q=e.g/100;t.k+=P.k*q;t.p+=P.p*q;t.f+=P.f*q;t.c+=P.c*q;t.n++;return}
    const x=d.meals[+k];if(!x?.rid)return;const r=plannedRecipe(S.plan,x.rid),f=x.fac[mi]||0;if(!f)return;
    t.k+=r.kcal*f;t.p+=r.p*f;t.f+=r.f*f;t.c+=r.c*f;t.n++});
  return t;
}
const ateBtn=(k,m)=>{const on=ateList(m).map(String).includes(String(k));
  return `<span class="atec ${on?'on':''}" data-act="ate" data-v="${k}"${m!=null?` data-m="${m}"`:''} role="checkbox" tabindex="0" aria-checked="${on}" aria-label="Съел">${I.check}</span>`};
function vHome(){
  if(!S.plan)return `<div class="empty screen"><h2 class="lt" style="font-size:28px">Меню ещё не собрано</h2><p>Ответьте на пару вопросов, и приложение соберёт продукты под ваш бюджет.</p><button class="btn" data-act="wizard">Начать настройку</button></div>`;
  const sh=shop(),rec=sh.recommended,tot=effTotal(rec),spent=spentNow(rec),pct=S.budget?tot/S.budget:0,left=S.budget-tot;
  const me=S.family[0]||{name:''};
  const d=S.plan.days[clamp(S.day,0,S.plan.days.length-1)];
  const mi=clamp(S.member,0,S.family.length-1),t=S.plan.targets[mi]||target(S.family[mi]),v=dayTotals(d)[mi]||{k:0,p:0,f:0,c:0};
  const nd=S.plan.days.length,per=nd===7?'неделю':nd===30?'месяц':nd+' '+plural(nd,'день','дня','дней');
  const m=S.family[mi]||me,goal=m.goal==='lose'?'худеет':m.goal==='gain'?'набирает':'держит вес';
  let h=`<div class="screen">
  <div class="top"><button class="ava tap" data-act="tab" data-v="profile" aria-label="Профиль">${TabiPersonal.avatar(me)}</button>
    <div class="who"><span>${greet()}${me.name&&me.name!=='Я'?', '+esc(me.name):''}</span><b>${todayLabel()}</b></div>
    ${S.dirty||planOver()?'':`<button class="rb tap" data-act="fab" aria-label="Другой вариант меню" title="Другой вариант меню">${I.spark}</button>`}</div>
  ${planOver()?`<div class="banner"><div class="t">Меню закончилось ${dayDate(S.plan.days.length-1).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}. Собрать на ${per}?</div><button data-act="fab">Собрать</button></div>`
   :S.dirty?`<div class="banner"><div class="t">Настройки изменились. Пересобрать меню?</div><button data-act="regen">Обновить</button></div>`:''}
  <button class="hero tap" data-act="tab" data-v="basket">
    <div class="k">Корзина на ${per}</div>
    ${S.budget?`<span class="badge dark corner">${Math.round(pct*100)}% бюджета</span>`:''}
    <div class="big"><span class="cn" data-ck="sumH" data-n="${tot}">${rubN(tot)}</span><small>₽</small></div>
    <div class="sub">${spent>0?`потрачено ${rub(spent)} · `:''}${left>=0?`из ${rub(S.budget)} · останется <b>${rub(left)}</b>`:`<b>Не хватает ${rub(-left)}</b>`}</div>
    <div class="bar"><i style="width:${Math.min(pct,1)*100}%"></i></div>
    <div class="chips">${rec.set.filter(s=>rec.alloc[s]).map(s=>`<span class="tap" data-act="toStore" data-v="${s}" role="link" aria-label="${SN(s)} в корзине">${smark(s)}${SN(s)}</span>`).join('')}</div>
    <img class="fig" src="img2/ui/middle.webp" alt="" onerror="this.remove()">
  </button>
  ${shortNote(rec.total)}
  ${missingNote(rec)}
  <div class="days">${S.plan.days.map((_,i)=>{const dt=dayDate(i);const ck=S.plan.days[i].meals.some(x=>x.prep),ti=todayIdx();return `<button class="dchip tap ${i===S.day?'on':''} ${ck?'ck':''} ${i<ti?'past':''} ${i===ti?'today':''}" data-act="day" data-v="${i}" ${ck?'title="День готовки"':''}>${WD[dt.getDay()]}<b>${dt.getDate()}</b>${ck?'<i class="pot"></i>':''}</button>`}).join('')}</div>
  ${S.family.length>1?`<div class="ctl">${seg('member',mi,S.family.map((x,i)=>[i,esc(x.name||'Без имени')]))}</div>`:''}
  ${(()=>{const e=eaten(d,mi),pc=(a,b)=>Math.min(a/Math.max(b,1),1)*100,mini=(l,a,b,col)=>`<div class="km"><span>${l} <b>${Math.round(a)}</b>/${b} г</span><div class="mb"><i style="width:${pc(a,b)}%;background:${col}"></i></div></div>`;
    return `<div class="kcard" role="group" aria-label="Съедено за день"><div class="kc1"><span class="kt">${e.n?'Съедено':'Отмечайте съеденное ✓'}</span><span class="kv"><b class="cn" data-ck="ate" data-n="${Math.round(e.k)}">${Math.round(e.k).toLocaleString('ru-RU')}</b> / ${t.kcal.toLocaleString('ru-RU')} ккал</span></div>
    <div class="kb2"><i style="width:${pc(e.k,t.kcal)}%"></i><s style="left:${pc(v.k,t.kcal)}%" title="по меню"></s></div>
    <div class="kms">${mini('Б',e.p,t.p,'var(--pro)')}${mini('Ж',e.f,t.f,'var(--fat)')}${mini('У',e.c,t.c,'var(--carb)')}</div></div>`})()}
  ${cookCard()}${prepTip()}
  <div class="h2">Меню на день<small>${S.family.length>1?'порция: '+esc(m.name):''}</small></div><div class="dayx">`;
  d.meals.forEach((x,j)=>{
    if(x.who!=null&&x.who!==mi)return;
    if(!x.rid){h+=`<div class="meal empty">${MEAL[x.meal]} · ${x.limited?'не вошло в бюджет':'нет подходящих блюд'}</div>`;return}
    const r=plannedRecipe(S.plan,x.rid),f=x.fac[mi]||1;
    h+=`<button class="meal tap" data-act="recipe" data-v="${r.id}" data-di="${S.day}" data-mi="${j}">
      ${dish(r.id,'dp')}<div class="mt"><span class="badge">${MEAL[x.meal]}</span>${x.prep?`<span class="badge pk">Готовим на ${batchOf(S.day,j)?.items.length||PREP()} ${plural(batchOf(S.day,j)?.items.length||PREP(),'день','дня','дней')}</span>`:x.from!=null?`<span class="badge fr">Из контейнера</span>`:''}<div class="mn">${esc(r.n)}</div>
      <div class="mm"><b>${Math.round(r.kcal*f)}</b> ккал · Б ${Math.round(r.p*f)} г · ≈ ${rubR(rCost(r)*f)}</div></div>
      ${ateBtn(j)}</button>`;
  });
  h+=`</div>`;
  const ex=(d.extra||[]).filter(e=>S.family[e.j]&&(!sepMode()||e.j===mi));
  if(ex.length)h+=`<div class="h2">${sepMode()?'Добавка к меню':'Лично для каждого'}<small>для белка</small></div><div class="list dayx">${ex.map(e=>{const mm=S.family[e.j],P=PROD[e.pid];
    return `<div class="row">${pthumb(e.pid)}<span class="rl">${esc(mm.name||'Без имени')}: ${P.n.toLowerCase()}, ${fmtQty(e.pid,e.g)}<div>${ADDWHEN[e.pid]} · ${mm.goal==='lose'?'худеет':mm.goal==='gain'?'набирает':'держит вес'}</div></span><span class="badge">+${Math.round(P.p*e.g/100)} г</span>${ateBtn('e'+d.extra.indexOf(e),e.j)}</div>`}).join('')}</div>`;
  /* «План на день»: сколько даст меню, если съесть всё, — рядом с нормой человека. Статус словами, а не «100 %» */
  const st=(a,b,tol)=>{const d=(a-b)/Math.max(b,1);return Math.abs(d)<=tol?['ok','в норме']:d>0?['hi',`на ${Math.round(d*100)} % больше нормы`]:['lo',`на ${Math.round(-d*100)} % меньше нормы`]};
  const ks=st(v.k,t.kcal,.05),dl=dayDate(clamp(S.day,0,S.plan.days.length-1)).toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  const sp=(lab,val,tg,col)=>{const[c]=st(val,tg,.1);return `<div><span><i style="background:${col}"></i>${lab}</span><b>${Math.round(val)}<small> г</small></b><div class="nrm ${c}">норма ${tg} г</div><div class="mb"><i style="width:${Math.min(val/tg,1)*100}%;background:${col}"></i></div></div>`};
  h+=`<div class="h2" id="nut">План на день<small>${esc(m.name)} · ${goal}</small></div>
  <div class="card nut"><div class="bigk"><div><div class="cap" style="margin-bottom:6px">Меню на ${dl} даст</div><div class="v"><span class="cn" data-ck="plan" data-n="${Math.round(v.k)}">${Math.round(v.k).toLocaleString('ru-RU')}</span><small> ккал</small></div><div class="cap" style="margin-top:4px">норма ${t.kcal.toLocaleString('ru-RU')} ккал${t.custom?' · своя':''}</div></div>
    <span class="badge st-${ks[0]}">${ks[1]}</span></div>
    <div class="kbar"><i style="width:${Math.min(v.k/t.kcal,1)*100}%"></i></div>
    <div class="split">${sp('Белки',v.p,t.p,'var(--pro)')}${sp('Жиры',v.f,t.f,'var(--fat)')}${sp('Углеводы',v.c,t.c,'var(--carb)')}</div>
    <p class="foot" style="margin:12px 2px 0">Столько получится, если съесть всё меню дня. Что уже съели, видно в карточке «Съедено» вверху.</p></div>
  </div>`;
  return h;
}
/* фото товара из магазина (расширение, закладка, скрипт), иначе — иллюстрация */
function photoOf(pid,s){
  const ok=u=>typeof u==='string'&&/^https:\/\//.test(u);
  const pick=st=>{for(const[img,nm] of [[S.extImg,S.extName],[S.pasteImg,S.pasteName],[FEED?.images,FEED?.names]]){const u=img?.[pid]?.[st];if(ok(u))return{u,st,name:nm?.[pid]?.[st]||''}}return null};
  /* только фото этого же магазина; своего нет — наша нарисованная картинка товара (img2/prod), чужие фото не берём */
  const own=pick(s);return own?{...own,own:true}:null;
}
const pthumb=(pid,s)=>{const p=photoOf(pid,s),m=pimg(pid),fb=`this.onerror=null;this.removeAttribute('referrerpolicy');this.parentNode.className='pi ${m.k}';this.parentNode.removeAttribute('style');this.src='${m.src}'`;
  if(!p)return `<div class="pi ${m.k}"><img src="${m.src}" alt="" loading="lazy"></div>`;
  return `<div class="pi photo${p.own?'':' ex'}" style="--ph:url('${m.src}')" title="${p.own?'Фото товара из магазина':'Фото для примера из другого магазина'}"><img src="${esc(p.u)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="${fb}"></div>`};
const pnote=(pid,s)=>{const p=photoOf(pid,s);if(!p)return '';
  return p.own?(p.name?`<div class="pn">${esc(p.name)}</div>`:''):`<div class="pn ex">фото из ${SNgen(p.st)}</div>`};
const pic=id=>{const m=pimg(id);return `<img class="pic ${m.k}" src="${m.src}" alt="" loading="lazy">`};
const SNgen=s=>({chizhik:'Чижика',svetofor:'Светофора',magnit:'Магнита',dixy:'Дикси',pyat:'Пятёрочки',perek:'Перекрёстка',vkusvill:'ВкусВилла',azbuka:'Азбуки вкуса',samokat:'Самоката',lavka:'Яндекс Лавки',ozon:'Ozon fresh'}[s]||SN(s));
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

function vBasket(){
  if(!S.plan)return vHome();
  const sh=shop(),rec=sh.recommended,st=activeStores(),tot=effTotal(rec);
  const singles=sh.singles.slice().sort((a,b)=>a.missing.length-b.missing.length||a.total-b.total);
  const complete=singles.filter(s=>!s.missing.length);
  const worst=complete[complete.length-1];
  const save_=worst&&!rec.missing.length?worst.total-rec.total:0;
  const all=sh.toBuy.length,done=sh.toBuy.filter(i=>S.bought[i.pid]).length;
  let h=`<div class="screen"><div class="top"><div class="who"><span>${all} ${plural(all,'товар','товара','товаров')}</span><b class="lt">Корзина</b></div></div>
  ${S.dirty?`<div class="banner"><div class="t">Настройки изменились. Пересобрать меню?</div><button data-act="regen">Обновить</button></div>`:''}
  ${S.shopMode&&all?`<div class="smode">${I.bag}<span>Режим магазина: купленное уходит вниз</span></div>`:''}
  <div class="hero dark"><div class="k">${!all?'Покупки не нужны':rec.missing.length?'Доступные покупки':'Выгоднее всего'}</div>
    ${save_>0?`<span class="badge corner">−${rub(save_)}</span>`:''}
    <div class="big"><span class="cn" data-ck="sumB" data-n="${tot}">${rubN(tot)}</span><small>₽</small></div>
    <div class="sub" style="color:rgba(255,255,255,.7)">${rec.missing.length?'Сумма за доступные товары':tot<=S.budget?`в бюджете ${rub(S.budget)} · останется ${rub(S.budget-tot)}`:`выше бюджета на ${rub(tot-S.budget)}`}${save_>0?' · экономия против самого дорогого':''}</div>
    <div class="bar"><i style="width:${all?done/all*100:0}%"></i></div>
    <div class="chips">${rec.set.filter(s=>rec.alloc[s]).map(s=>`<span>${smark(s)}${SN(s)}</span>`).join('')}<span style="padding-left:10px">Куплено ${done} из ${all}</span></div></div>
  ${shortNote(rec.total)}
  ${missingNote(rec)}
  ${all?`<div class="bact"><button class="btn ${S.shopMode?'lime':'soft'} tap" data-act="shopMode" aria-pressed="${!!S.shopMode}">${I.bag}${S.shopMode?'Закончить покупки':'Я в магазине'}</button><button class="btn soft tap" data-act="share">${I.copy}Поделиться</button></div>
  ${S.shopMode?`<p class="foot">Положили в корзину, нажмите на товар. Если на ценнике другая цена, нажмите на цену и впишите свою. Остаток бюджета пересчитается.</p>`:''}`:''}
  ${all&&!S.shopMode?`<p class="foot">Считаем целыми упаковками, как продают в магазине. Значки «Скоро» и «Примерные» значат, что цены у сети пока примерные.</p>`:''}
  ${S.shopMode?'':`<div class="ctl">${seg('maxStores',S.maxStores>2?9:S.maxStores,[[1,'1 магазин'],[2,'2 магазина'],[9,'Где дешевле']])}</div>
  <div class="ctl"><div class="pills fill">${TK.map(t=>`<button class="pill tap ${S.tiers[t]?'on':''}" data-act="tier" data-v="${t}">${TIERS[t].n}</button>`).join('')}</div></div>`}`;
  if(S.shopMode&&all)h+=`<div class="shopbar" role="status"><div class="sbt"><span><b>${done}</b> из ${all} в корзине</span><span>осталось ≈ <b>${rub(Math.max(0,tot-spentNow(rec)))}</b></span></div><div class="sbb"><i style="width:${done/all*100}%"></i></div></div>`;
  rec.set.filter(s=>rec.alloc[s]).forEach(s=>{
    const list=S.shopMode?rec.alloc[s].slice().sort((a,b)=>!!S.bought[a.pid]-!!S.bought[b.pid]):rec.alloc[s],t=list.reduce((a,i)=>a+icost(i),0);
    h+=`<details class="sgd" data-k="b:${s}" ${dOpen('b:'+s,true)?'open':''}><summary class="sh">${smark(s)}<span class="shn">${SN(s)}${pbadge(s)}${nearOn()&&S.near[s]?`<small>${fmtD(S.near[s].d)}${S.near[s].addr?' · '+esc(S.near[s].addr):''}</small>`:''}</span><span class="t">${rub(t)}</span><span class="chev">${I.chev}</span></summary><div class="sgroup">
      ${S.shopMode?shopList(list,s):list.map(i=>itemRow(i,s)).join('')}
      ${DLV_URL[s]?`<button class="dlvgo tap" data-act="dlvList" data-v="${s}">${I.cart}Заказать ${DLV_IN[s]}<span class="chev">${I.chev}</span></button>`:''}</div></details>`;
  });
  if(S.shopMode)return h+`<button class="btn soft tap" style="margin-top:18px" data-act="shopMode">Закончить покупки</button></div>`;
  /* «если всё в одном»: сначала обычные магазины, ниже — доставка */
  const srow=o=>`<div class="row">${smark(o.set[0])}<span class="rl">${SN(o.set[0])}<div class="pstl">${pbadge(o.set[0])}${o.missing.length?`нет ${o.missing.length} ${plural(o.missing.length,'товара','товаров','товаров')}`:''}</div></span><span class="rp">${rub(o.total)}</span></div>`;
  const off=singles.filter(o=>ST(o.set[0])!=='dlv'),dlv=singles.filter(o=>ST(o.set[0])==='dlv');
  if(off.length)h+=`<div class="h2">Магазины<small>если всё в одном</small></div><div class="list">${off.map(srow).join('')}</div>`;
  if(dlv.length)h+=`<div class="h2">Доставка<small>без стоимости доставки</small></div><div class="list">${dlv.map(o=>srow(o).replace('</span><span class="rp">',`</span><button class="dlvs tap" data-act="dlvList" data-v="${o.set[0]}" data-all="1">Заказать</button><span class="rp">`)).join('')}</div>`;
  h+=`<details class="glass"><summary>Цены по каждому товару <span class="chev">${I.chev}</span></summary><div class="tsc"><table><tr><th>Товар</th>${st.map(s=>`<th>${smark(s)}</th>`).join('')}</tr>
    ${sh.toBuy.map(i=>{const os=st.map(s=>sh.offers[i.pid]?.[s]),mn=Math.min(...os.filter(Boolean).map(o=>o.cost)),bs=Object.keys(rec.alloc).find(x=>rec.alloc[x].some(y=>y.pid===i.pid));
      return `<tr><td>${PROD[i.pid].n}<div class="cap">нужно ${fmtQty(i.pid,i.buy)}</div></td>${os.map((o,k)=>!o?'<td class="muted">нет</td>':`<td class="num ${o.cost===mn?'best':''} ${st[k]===bs?'pick':''}">${rub(o.cost)}<div class="cap">${o.packs} × ${o.pl}</div>${st[k]===bs?'<div class="cap in">в списке</div>':''}</td>`).join('')}</tr>`}).join('')}</table></div></details><p class="foot">В каждой клетке цена нужного количества в фасовке этого магазина. Рамкой отмечен магазин, где товар стоит в вашем списке.</p>`;
  const home=sh.items.filter(i=>i.have>0&&i.need>0&&!i.base),base=sh.items.filter(i=>i.base),left=Object.values(rec.alloc).flat().filter(i=>i.left>PROD[i.pid].pack*.15);
  const plist=arr=>`<div class="list">${arr.map(([id,q])=>`<div class="row">${pic(id)}<span class="rl">${PROD[id].n}</span><span class="rv">${q}</span></div>`).join('')}</div>`;
  if(home.length)h+=`<div class="h2">Берём из дома</div>${plist(home.map(i=>[i.pid,fmtQty(i.pid,Math.min(i.have,i.need))]))}`;
  if(base.length)h+=`<div class="h2">База на кухне<small>не входит в сумму</small></div><div class="list">${base.map(i=>`<div class="row">${pic(i.pid)}<span class="rl">${PROD[i.pid].n}<div>нужно ${fmtQty(i.pid,i.need)}</div></span><button class="addb tap" data-act="baseOut" data-v="${i.pid}" aria-label="Купить: ${PROD[i.pid].n}">${I.plus}</button></div>`).join('')}</div><p class="foot">Считаем, что это у вас есть. Если закончилось, нажмите «+», и продукт попадёт в покупки.</p>`;
  if(left.length)h+=`<div class="h2">Останется на потом</div>${plist(left.map(i=>[i.pid,'~'+fmtQty(i.pid,i.left)]))}<p class="foot">Упаковки продаются целиком. Отмеченное купленным само попадёт в «Что есть дома», когда соберёте меню на следующую неделю. Второй раз покупать не придётся.</p>`;
  return h+'</div>';
}

/* ---- время готовки: считаем из шагов рецепта ----
   Есть в тексте «варить 20 минут», «1,5 часа» — берём (диапазон — верхнюю границу; «по 3 минуты с каждой стороны» ×4:
   две стороны и две партии). Нет — оцениваем по действию и продукту: отварить свёклу ~50 мин, рис ~20 и т. п.
   Замачивание не считаем (оно накануне, есть в подсказке дня готовки). Плюс подготовка: 3 мин + по минуте на продукт. */
const BOIL=[[/свекл|свёкл/,50],[/говяд/,90],[/горох/,60],[/перлов/,50],[/кур/,30],[/картоф/,25],[/гречк|рис|пшен|чечевиц/,20],[/макарон/,12],[/яйц|яйко/,10],[/лапш/,7]];
const RTIME={};
function rTime(r){
  if(RTIME[r.id]!=null)return RTIME[r.id];
  const st=(r.st||'').toLowerCase();let t=0;
  if(/готовить не нужно/.test(st))return RTIME[r.id]=2;
  for(const sent of st.split(/\.\s+/)){
    if(/замоч/.test(sent))continue;
    let e=0,has=false;
    for(const m of sent.matchAll(/(\d+(?:,\d+)?)(?:\s*[–-]\s*(\d+(?:,\d+)?))?\s*(минут|мин|час)/g)){
      let v=parseFloat((m[2]||m[1]).replace(',','.'));if(m[3]==='час')v*=60;
      if(/кажд[а-я]* сторон/.test(sent.slice(m.index)))v*=4;e+=v;has=true}
    if(/полчаса/.test(sent)){e+=30;has=true}
    if(/по минуте/.test(sent)){e+=/блин/.test(sent)?20:4;has=true}
    if(!has){
      if(/отвар|свар|варить/.test(sent))e=Math.max(15,...BOIL.filter(([re])=>re.test(sent)).map(([,v])=>v));
      else if(/туш/.test(sent))e=25;
      else if(/запе[кч]|духовк/.test(sent))e=30;
      else if(/напеч|блин/.test(sent))e=20;
      else if(/жар|подсуш/.test(sent))e=8;
    }
    t+=e;
  }
  t+=Math.min(12,3+Object.keys(r.ing||{}).length);
  return RTIME[r.id]=Math.max(5,Math.ceil(t/5)*5);
}
const fmtTime=m=>m<60?`${m} мин`:`${Math.floor(m/60)} ч${m%60?' '+m%60+' мин':''}`;

/* ---- рецепты: поиск, избранное, сортировка ---- */
let RQ=''; // строка поиска — не сохраняем, живёт до перезагрузки
const RSORT=[['def','Как обычно','избранное сверху'],['cheap','Сначала дешевле','по цене порции'],['kcal','Меньше калорий','по калориям порции'],['fast','Быстрее готовить','по времени']];
function rList(){
  /* тот же разбор слов, что у «пожеланий своими словами»: начало слова, по названию и по составу */
  const q=norm(RQ).split(/\s+/).filter(w=>w.length>1).map(stem);
  const hit=r=>{if(!q.length)return true;const t=(rText(r)+' '+rIng(r)).split(/\s+/);return q.every(w=>t.some(x=>x.startsWith(w)))};
  if(RLC)return RLC.list;
  const L=RECIPES.filter(r=>(S.rf==='all'||(S.rf==='fav'?S.likes.includes(r.id):r.m.includes(S.rf)))&&hit(r));
  /* один проход: цена и «исключено» на каждое блюдо, цены продуктов один раз (раньше сотни повторов при сортировке) */
  const st=activeStores(),um={},ex={},co={};
  const umin=pid=>pid in um?um[pid]:(um[pid]=(()=>{let b=Infinity;st.forEach(s=>{const p=price(pid,s);if(p!=null)b=Math.min(b,p/PROD[pid].pack)});return b===Infinity?null:b})());
  L.forEach(r=>{ex[r.id]=excluded(r);co[r.id]=Object.entries(r.ing).reduce((a,[id,g])=>a+(umin(id)??0)*g,0)});
  const key={cheap:r=>co[r.id],kcal:r=>r.kcal,fast:r=>rTime(r)}[S.rs];
  L.sort((a,b)=>ex[a.id]-ex[b.id]||(key?key(a)-key(b):S.likes.includes(b.id)-S.likes.includes(a.id)));
  RLC={list:L,ex,co};queueMicrotask(()=>{RLC=null});
  return L;
}
let RLC=null; // кэш списка рецептов на одну отрисовку
function rGrid(){
  const list=rList();
  if(!list.length)return `<div class="rempty">${S.rf==='fav'&&!RQ.trim()
    ?`<b>В избранном пока пусто</b><span>Нажмите ${I.star} на карточке блюда, и оно появится здесь и будет чаще попадать в меню.</span>`
    :`<b>Ничего не нашли</b><span>Попробуйте другое слово. Ищем по названию блюда и продуктам.</span>${RQ.trim()?`<button class="btn soft tap" data-act="rqClear">Очистить поиск</button>`:''}`}</div>`;
  const C=RLC||{ex:{},co:{}};
  return `<div class="rgrid" data-clamp="12" data-ck="rg:${S.rf}:${S.rs}:${esc(RQ)}">${list.map(r=>{const off=C.ex[r.id]??excluded(r),on=S.likes.includes(r.id);return `<div class="rc tap ${off?'off':''}" data-act="recipe" data-v="${r.id}">
    ${dish(r.id,'rt')}<span class="badge white kb">${Math.round(r.kcal)} ккал</span>
    <button class="star ${on?'on':''}" data-act="like" data-v="${r.id}" aria-label="${on?'Убрать из избранного':'В избранное'}">${I.star}</button>
    <div class="rn">${esc(r.n)}</div><div class="rm"><span class="rtm">${I.clock}${fmtTime(rTime(r))}</span><b>≈ ${rubR(C.co[r.id]??rCost(r))}</b></div><div class="rk">${MEAL[r.m[0]]}</div></div>`}).join('')}</div>`;
}
const rHead=()=>{const n=rList().length,so=RSORT.find(x=>x[0]===S.rs)||RSORT[0];
  return `${n} ${plural(n,'блюдо','блюда','блюд')}${n===RECIPES.length?'':' из '+RECIPES.length}${S.rs!=='def'?' · '+so[1].toLowerCase():''}`};
function vRecipes(){
  const F=[['all','Все'],['fav',`Избранное${S.likes.length?' · '+S.likes.length:''}`],['b','Завтраки'],['l','Обеды'],['d','Ужины'],['s','Перекусы']];
  const so=RSORT.find(x=>x[0]===S.rs)||RSORT[0];
  return `<div class="screen"><div class="top"><div class="who"><span id="rcount">${rHead()}</span><b class="lt">Рецепты</b></div>
    <button class="rb tap sortb ${S.rs!=='def'?'on':''}" data-act="rsort" aria-label="Сортировка: ${so[1]}">${I.sort}</button></div>
  <label class="rsearch">${I.search}<input id="rq" type="search" enterkeyhint="search" autocomplete="off" placeholder="Блюдо или продукт" value="${esc(RQ)}" aria-label="Поиск рецептов"><button type="button" class="rqx tap" data-act="rqClear" aria-label="Очистить поиск" ${RQ?'':'hidden'}>${I.x}</button></label>
  <div class="pills ctl">${F.map(([v,n])=>`<button class="pill tap ${S.rf===v?'on':''}" data-act="rf" data-v="${v}">${v==='fav'?I.star:''}${n}</button>`).join('')}</div>
  <div id="rbox">${rGrid()}</div>
  <p class="foot" style="text-align:center;margin-top:16px">Калории и цена указаны на одну стандартную порцию, время примерное, по шагам рецепта. Бледные блюда исключены вашими предпочтениями.</p></div>`;
}
/* поиск перерисовывает только сетку — поле не теряет фокус и клавиатура не прячется */
function rRefresh(){const b=$('#rbox');if(!b)return;b.innerHTML=rGrid();if(typeof clampAll==='function')clampAll(b);
  const c=$('#rcount');if(c)c.textContent=rHead();
  const x=$('.rqx');if(x)x.hidden=!RQ}
document.addEventListener('input',e=>{if(e.target.id==='rq'){RQ=e.target.value;rRefresh()}});

/* ----- панели настроек (используются и в мастере, и в профиле) ----- */
function pFamily(){
  const o=(v,arr)=>arr.map(([k,n])=>`<option value="${k}"${String(v)===String(k)?' selected':''}>${n}</option>`).join('');
  return S.family.map((m,i)=>{const t=target(m);return `<div class="member">
    <div class="mh"><button type="button" class="mava avatar-button tap" data-personal="avatar-open" data-member="${i}" aria-label="Изменить аватар ${esc(m.name||'участника семьи')}">${TabiPersonal.avatar(m)}</button>
      <input data-f="${i}" data-k="name" value="${esc(m.name)}" placeholder="Имя">
      ${S.family.length>1?`<button class="rb" data-act="delMember" data-v="${i}" aria-label="Удалить: ${esc(m.name||'без имени')}">${I.x}</button>`:''}</div>
    ${seg('sex:'+i,m.sex,[['m','Мужчина'],['f','Женщина']])}
    <div class="g3" style="margin-top:10px">
      <label><span class="mini">Возраст</span><input class="field num" data-f="${i}" data-k="age" type="number" min="1" max="100" inputmode="numeric" value="${m.age}"></label>
      <label><span class="mini">Вес, кг</span><input class="field num" data-f="${i}" data-k="weight" type="number" min="5" inputmode="numeric" value="${m.weight}"></label>
      <label><span class="mini">Рост, см</span><input class="field num" data-f="${i}" data-k="height" type="number" min="50" inputmode="numeric" value="${m.height}"></label></div>
    <div class="g2" style="margin-top:10px">
      <label><span class="mini">Активность</span><select class="field" data-f="${i}" data-k="act">${o(m.act,[[1.2,'Сидячая'],[1.375,'Лёгкая'],[1.55,'Средняя'],[1.725,'Высокая']])}</select></label>
      <label><span class="mini">Цель</span><select class="field" data-f="${i}" data-k="goal">${o(m.goal,[['keep','Держать вес'],['lose','Похудеть'],['gain','Набрать']])}</select></label></div>
    <button type="button" class="mk tap" id="kc${i}" data-act="kbju" data-v="${i}" aria-label="Изменить норму КБЖУ">${kcLine(m,t)}</button></div>`}).join('')+`<button class="add tap" data-act="addMember">${I.plus} Добавить человека</button>`+
  (S.family.length>1?`<span class="lbl" style="margin-top:18px">Как готовите</span>${seg('cook',S.cook==='sep'?'sep':'shared',[['shared','Общие блюда'],['sep','Каждому своё']])}
  <div class="note" style="margin-top:8px">${S.cook==='sep'?'У каждого своё меню под его цель. Кто худеет, получит больше белка и меньше жира, кто набирает, сытнее.':'Одно блюдо на всех, но у каждого своя порция в граммах под его калории и цель.'}</div>`:'');
}
const kcLine=(m,t)=>`<span class="k">${t.custom?'Своя норма':'Норма'} <b>${t.kcal.toLocaleString('ru-RU')}</b> ккал</span><span>Б <b>${t.p}</b> г</span><span>Ж <b>${t.f}</b> г</span><span>У <b>${t.c}</b> г</span>${+m.age<15&&!t.custom?'<span>детская норма</span>':''}<span class="ed">${I.pen||'Изменить'}</span>`;
/* быстрые суммы и предел ползунка — под выбранный срок (для недели 3–12 тыс, для месяца 15–45 тыс) */
const BPRE=()=>({3:[1500,2000,3000,5000],5:[2000,3000,5000,8000],7:[3000,5000,8000,12000],14:[6000,10000,15000,20000],30:[15000,20000,30000,45000]}[S.days]||[3000,5000,8000,12000]);
const BMAX=()=>S.days>=30?100000:S.days>=14?60000:40000;
const bfmt=v=>(+v||0).toLocaleString('ru-RU').replace(/\s/g,'\u00a0');
const bk=v=>(v/1000).toLocaleString('ru-RU')+' тыс';
function pBudget(){
  const p=clamp((S.budget-1000)/(BMAX()-1000),0,1)*100;
  return `<div class="card" style="text-align:center;padding-top:18px">
    <span class="cap2">Бюджет на продукты</span>
    <div class="money"><input id="budgetIn" class="num" type="text" inputmode="numeric" autocomplete="off" aria-label="Бюджет, рублей" value="${bfmt(S.budget)}"><span>₽</span></div>
    <input id="budgetRange" type="range" min="1000" max="${BMAX()}" step="500" value="${clamp(S.budget,1000,BMAX())}" style="--p:${p}%" aria-label="Бюджет">
    <div class="pills fill">${BPRE().map(v=>`<button class="pill tap ${S.budget===v?'on':''}" data-act="budget" data-v="${v}">${bk(v)}</button>`).join('')}</div></div>
  <span class="lbl ico" style="margin-left:4px"><img src="img2/ui/calendar.webp" alt="">На какой срок</span>${seg('days',S.days,[[3,'3 дня'],[5,'5 дней'],[7,'Неделя'],[14,'2 нед.'],[30,'Месяц']])}
  <span class="lbl" style="margin-left:4px">Сколько магазинов обходить</span>${seg('maxStores',S.maxStores>2?9:S.maxStores,[[1,'Один'],[2,'Два'],[9,'Сколько угодно']])}
  <div class="list" style="margin-top:20px"><label class="row"><span class="ri">${I.fork}</span><span class="rl">Перекус<div>Четвёртый приём пищи</div></span><input type="checkbox" class="sw" data-act="snack" ${S.snack?'checked':''}></label></div>`;
}
function pStores(){
  return `${geoPanel()}
  <span class="lbl">Класс магазинов</span>
  <div class="tiers">${TK.map(t=>`<button class="tcard tap ${S.tiers[t]?'on':''}" data-act="tier" data-v="${t}"><img class="tico" src="img2/ui/${{eco:'coin',mid:'middle',prem:'gem',dlv:'bags'}[t]}.webp" alt=""><b>${TIERS[t].n}</b><span>${TIERS[t].d}</span><i class="chk">${I.check}</i></button>`).join('')}</div>
  ${TK.map(t=>{const ss=STORES.filter(s=>s.tier===t);return `<div class="tgroup ${S.tiers[t]?'':'off'}"><span class="lbl">${TIERS[t].n}${S.tiers[t]?'':' · выключен'}</span><div class="list">${ss.map(s=>{const av=cityStores().includes(s.id),en=av&&S.tiers[t];return `<label class="row">${smark(s.id)}<span class="rl">${s.n}${pbadge(s.id)}${!av?`<div>${nearOn()?'Нет рядом с домом (до 3 км)':'Нет в этом городе'}</div>`:nearOn()&&S.near[s.id]?`<div>${fmtD(S.near[s.id].d)}${S.near[s.id].addr?' · '+esc(S.near[s.id].addr):''}</div>`:s.tier==='dlv'?`<div>${dlvKnown(s.id)?'Возит в '+esc(homeTown()):dlvOk(s.id)?'Включено вами':dlvStatus(s.id)==='no'?'По их списку в '+esc(homeTown())+' не возят. Если возят, включите':'Укажите адрес, и мы проверим, возит ли'}</div>`:''}</span><input type="checkbox" class="sw" data-act="store" data-v="${s.id}" ${S.stores[s.id]&&en&&dlvOk(s.id)?'checked':''} ${en?'':'disabled'}></label>`}).join('')}</div></div>`}).join('')}
  <span class="lbl">Цены</span><div class="list"><label class="row"><span class="rl">Только магазины с настоящими ценами<div>Сейчас: ${STORES.filter(x=>priceInfo(x.id).live).map(x=>x.n).join(', ')||'пока ни одного'}. Остальные со значком «Скоро» считаются по примерным ценам</div></span><input type="checkbox" class="sw" data-act="hideApprox" ${S.hideApprox?'checked':''}></label></div>
  <div class="foot">В экономе самые низкие цены, в премиуме шире выбор и выше качество, но дороже. «Цены 08.11» значит, когда последний раз собрали настоящие цены. «Скоро» значит, что для этой сети цены пока примерные.</div>`;
}
/* ---------- пожелания своими словами: «не люблю каши на воде», «морковный салат» ---------- */
let WQ='';
const norm=t=>t.toLowerCase().replace(/ё/g,'е').replace(/[^а-яa-z0-9 ]/g,' ');
const STOP=new Set('не на с и в из по со для без люблю хочу ем ешь нравится нравятся очень совсем блюдо блюда еда'.split(' '));
/* грубая основа слова: «морковный» → «морко», «каши» → «каш», «яблоком» → «яблок» */
const stem=w=>w.slice(0,Math.min(5,Math.max(3,w.length-2)));
/* к названию блюда добавляем общие слова, которыми его могут назвать */
const rText=r=>{const n=norm(r.n);return n+(/каш|овсян/.test(n)?' каша':'')+(/суп|борщ|щи|уха|рассольн/.test(n)?' суп':'')+(/салат/.test(n)?' салат':'')
  +(/котлет|фрикадел|фарш|гуляш|свинин|говяд|флотск/.test(n)?' мясо':'')+(/минтай|хек|тунец|тунц|уха/.test(n)?' рыба':'')};
const rIng=r=>Object.keys(r.ing).map(id=>norm(PROD[id].n)).join(' ');
function wishFind(q){
  const ws=norm(q).split(/\s+/).filter(w=>w.length>1&&!STOP.has(w)).map(stem);
  if(!ws.length)return{rs:[],ps:[]};
  /* слово запроса должно совпасть с НАЧАЛОМ слова в блюде: «печень» не цепляет «запечённый» */
  const has=(txt,w)=>txt.split(/\s+/).some(x=>x.startsWith(w));
  /* сначала по названию блюда; если так не нашлось — по составу («всё с печенью») */
  let rs=RECIPES.filter(r=>{const t=rText(r);return ws.every(w=>has(t,w))});
  if(!rs.length)rs=RECIPES.filter(r=>{const t=rText(r)+' '+rIng(r);return ws.every(w=>has(t,w))});
  rs=uniqueDishes(rs.filter(r=>!r.blocked&&!Object.keys(r.ing).some(badProd)));
  const ps=preferenceProducts().filter(p=>ws.every(w=>has(norm(p.n),w)));
  return{rs,ps};
}
function wishRes(){
  if(norm(WQ).trim().length<2)return '';
  const{rs,ps}=wishFind(WQ);
  if(!rs.length&&!ps.length)return `<div class="cap" style="padding:8px 4px">Не нашли такого блюда. Попробуйте одним словом: «каша», «салат», «печень».</div>`;
  const nd=S.nodish||[];const allOff=rs.length&&rs.every(r=>nd.includes(r.id));
  return `<div class="list wres" data-noclamp>${rs.length>1?`<button class="row tap" data-act="nodishAll"><span class="rl"><b>${allOff?'Снова предлагать все':'Не предлагать все'} (${rs.length})</b></span></button>`:''}
    ${rs.map(r=>`<label class="row">${dish(r.id,'dp sm')}<span class="rl">${esc(r.n)}<div>${nd.includes(r.id)?'не предлагаем':MEAL[r.m[0]]||''}</div></span><input type="checkbox" class="sw no" data-act="nodish" data-v="${r.id}" ${nd.includes(r.id)?'checked':''}></label>`).join('')}
    ${ps.map(p=>`<label class="row"><span class="ri">${I.fork}</span><span class="rl">${p.n}<div>уберём из всех блюд</div></span><input type="checkbox" class="sw no" data-act="dislikeSw" data-v="${p.id}" ${S.dislikes.includes(p.id)?'checked':''}></label>`).join('')}</div>`;
}
function preferenceProducts(){
  const children=Object.values(FOOD_GROUPS).flat().filter(id=>!FOOD_GROUPS[id]);
  return Object.values(PROD).filter(p=>!['sol','sahar'].includes(p.id)&&(!children.includes(p.id)||S.dislikes.includes(p.id)))
    .filter(p=>S.dislikes.includes(p.id)||(FOOD_GROUPS[p.id]||[p.id]).some(id=>!dietProduct(id)))
    .map(p=>({...p,n:FOOD_NAMES[p.id]||p.n}))
    .sort((a,b)=>Number(S.dislikes.includes(b.id))-Number(S.dislikes.includes(a.id))||a.n.localeCompare(b.n,'ru'));
}
let FQ='';
const FOOD_CATEGORIES=[['Овощи','Овощи'],['Фрукты','Фрукты'],['Мясо','Мясо и птица'],['Рыба','Рыба'],['Молочное','Молочные продукты'],['Яйца','Яйца'],['Крупы','Крупы и макароны'],['Хлеб','Хлеб'],['Бакалея','Бакалея и консервы']];
function preferenceProductGroups(prods){
  return FOOD_CATEGORIES.map(([cat,title])=>{
    const items=prods.filter(p=>p.cat===cat);if(!items.length)return '';
    const selected=items.filter(p=>S.dislikes.includes(p.id)).length,key='food:'+cat;
    return `<details class="food-group" data-k="${key}" ${dOpen(key,true)?'open':''}><summary><span>${title}</span><small>${selected?'Исключено '+selected+' из ':''}${items.length}</small><span class="chev">${I.chev}</span></summary><div class="pills wrapc">${items.map(p=>`<button class="pill no tap ${S.dislikes.includes(p.id)?'on':''}" data-act="dislike" data-v="${p.id}" aria-pressed="${S.dislikes.includes(p.id)}">${esc(p.n)}</button>`).join('')}</div></details>`;
  }).join('');
}
function favoriteChoices(){
 const list=uniqueDishes(RECIPES.filter(r=>!excluded(r))).filter(r=>norm(r.n).includes(norm(FQ)));
 return list.length?list.sort((a,b)=>Number(S.likes.includes(b.id))-Number(S.likes.includes(a.id))).map(r=>`<button class="pill tap ${S.likes.includes(r.id)?'on':''}" data-act="like" data-v="${r.id}" aria-pressed="${S.likes.includes(r.id)}"><img src="img2/dish/${r.id}.jpg" alt="" style="width:26px;height:26px;border-radius:50%;object-fit:cover;margin-left:-10px">${esc(r.n)}</button>`).join(''):'<p class="foot">Подходящих блюд не найдено. Измените поиск или ограничения.</p>';
}
function pPrefs(){
  const prods=preferenceProducts();
  const nd=(S.nodish||[]).filter(id=>RID[id]);
  return `  <span class="lbl">Ограничения</span><div class="pills wrapc" style="margin-bottom:18px">${PREFS.map(p=>`<button class="pill tap ${S.prefs[p.id]?'on':''}" data-act="pref" data-v="${p.id}">${p.n}</button>`).join('')}</div>
  ${S.prefs.halal?`<span class="lbl">Халяль</span><div class="ctl" style="margin-bottom:8px">${seg('halalMode',halalMark()?'mark':'pork',[['mark','С маркировкой «Халяль»'],['pork','Просто без свинины']])}</div>`:''}
  ${PREFS.filter(p=>S.prefs[p.id]&&p.note).map(p=>`<p class="foot" style="margin:${p.id==='halal'?'0':'-8px'} 4px 14px"><b>${p.n}.</b> ${p.id==='halal'?(halalMark()?'Свинину убрали. Мясо и курицу в списке покупок помечаем «халяль» и ищем в доставке с этим словом. Такое мясо бывает дороже, поэтому сумма примерная.':'Только убираем свинину, а мясо и курица обычные.'):p.note}</p>`).join('')}
<span class="lbl">Не люблю блюда</span>
  <div class="wish"><input class="field" id="wishIn" type="text" autocomplete="off" enterkeyhint="search" placeholder="Что не любите? Например: каши на воде" value="${esc(WQ)}">
  <div id="wishRes">${wishRes()}</div></div>
  ${nd.length?`<span class="lbl">Не предлагаем</span><div class="pills wrapc" style="margin-bottom:18px">${nd.map(id=>`<button class="pill tap" data-act="nodishDel" data-v="${id}" title="Снова предлагать">${esc(RID[id].n)} <span style="color:var(--ink3)">✕</span></button>`).join('')}</div>`:''}
  <span class="lbl">Не ем продукты</span><p class="foot">Исключаем из всех блюд. Пельмени, сосиски и фарш — сразу всех видов. Продукты, запрещённые ограничениями выше, здесь скрыты.</p><div class="food-groups">${preferenceProductGroups(prods)}</div>
  <span class="lbl">Любимые блюда, будут чаще</span>
  <p class="foot">Здесь только подходящие блюда. Ограничения важнее избранного; временно неподходящие любимые блюда сохранятся и вернутся после снятия ограничения.</p>
  <input class="field" id="favoriteIn" type="search" aria-label="Поиск любимых блюд" placeholder="Найти любимое блюдо" value="${esc(FQ)}">
  <div id="favoriteChoices" class="pills wrapc" data-clamp="8" data-ck="likes">${favoriteChoices()}</div>`;
}
const MEALN={b:'Завтрак',l:'Обед',d:'Ужин'};
function pEat(){
  const off=S.eatOff||[],al=allowedRecipes(),CNT={};
  /* сколько блюд в каждом виде: один проход по рецептам вместо прохода на каждую плитку */
  Object.keys(EAT).forEach(m=>al.forEach(r=>{if(r.m.includes(m)){const k=m+':'+eatCat(r,m);CNT[k]=(CNT[k]||0)+1}}));
  return Object.entries(EAT).map(([m,L])=>{
    const on=L.filter(c=>CNT[m+':'+c[0]]&&!off.includes(m+':'+c[0])).length;
    return `<span class="lbl">${MEALN[m]}<em>${on} выбрано · ${L.filter(c=>CNT[m+':'+c[0]]).length} доступно</em></span>
    <div class="eat">${L.map(([id,n,d,rid])=>{const k=m+':'+id,cnt=CNT[k]||0;
      const sample=al.find(r=>r.m.includes(m)&&eatCat(r,m)===id);
      return `<button ${cnt?'':'disabled'} class="ecard tap ${cnt&&!off.includes(k)?'on':''}" data-act="eat" data-v="${k}" aria-pressed="${!!cnt&&!off.includes(k)}">${sample?dish(sample.id,'eph'):'<div class="eph" style="opacity:.25">'+I.fork+'</div>'}<i class="chk">${I.check}</i><b>${n}</b><span>${cnt?cnt+' '+plural(cnt,'блюдо','блюда','блюд'):'Не подходит под настройки'}</span></button>`}).join('')}</div>${on?'':'<p class="foot">Для этого приёма пищи ничего не выбрано. Включите подходящий вариант или измените ограничения.</p>'}`}).join('')
  +`<p class="foot">Отметки можно поменять потом в профиле, меню пересоберётся само.</p>`;
}
function pKitchen(){
  const k=kit(),off=RECIPES.filter(r=>!kitOk(r)).length,P=PREP();
  return `<span class="lbl">Как часто готовите</span>${seg('prep',P,[[1,'Каждый день'],[2,'Раз в 2 дня'],[3,'Раз в 3 дня']])}
  ${P>1?`<div class="list" style="margin-top:10px"><label class="row"><span class="ri">${I.fork}</span><span class="rl">Завтраки тоже впрок<div>Иначе завтрак готовите утром, он быстрый</div></span><input type="checkbox" class="sw" data-act="prepB" ${S.prepB?'checked':''}></label></div>`:''}
  <div class="note" style="margin:8px 4px 18px">${P>1?`Обед и ужин варим один раз на ${P} ${plural(P,'день','дня','дней')} и раскладываем по контейнерам. В меню только блюда, которые хорошо хранятся: супы, каши, рагу, котлеты. Яичницу и свежие салаты впрок не ставим.`:'Каждый день свежие блюда. Если готовите сразу на несколько дней, выберите «Раз в 2 дня» или «Раз в 3 дня».'}</div>
  <span class="lbl">Техника на кухне</span>
  <div class="tiers kit">${KIT.map(([id,n,d])=>`<button class="tcard tap ${k[id]?'on':''}" data-act="kit" data-v="${id}"><b>${n}</b><span>${d}</span><i class="chk">${I.check}</i></button>`).join('')}</div>
  <div class="cap" style="margin:8px 4px 18px">${off?`Без нужной техники не получится ${off} ${plural(off,'блюдо','блюда','блюд')}, их не предложим.`:'Все блюда можно приготовить.'}</div>`;
}
function pPantry(){
  const ids=Object.keys(S.pantry).filter(id=>S.pantry[id]>0&&PROD[id]);
  return pKitchen()+`<span class="lbl">База на кухне</span>
  <div class="pills wrapc">${BASE.map(id=>{const out=(S.baseOut||[]).includes(id);return `<button class="pill tap ${out?'':'on'}" data-act="baseOut" data-v="${id}" aria-pressed="${!out}">${PROD[id].n}${out?' · закончилось':''}</button>`}).join('')}</div>
  <p class="foot" style="margin-bottom:18px">Это есть дома почти всегда, поэтому в покупки не попадает и бюджет не тратит. Закончилось, нажмите, и добавим в корзину.</p>
  <span class="lbl">Продукты дома</span><div class="card"><div class="g2" style="grid-template-columns:1.6fr 1fr">
    <label><span class="mini">Продукт</span><select class="field" id="panP">${Object.values(PROD).map(p=>`<option value="${p.id}">${p.n}</option>`).join('')}</select></label>
    <label><span class="mini" id="panU">Сколько, г</span><input class="field num" id="panA" type="number" min="0" inputmode="numeric" placeholder="500"></label></div>
    <button class="btn gray tap" style="margin-top:12px" data-act="panAdd">${I.plus} Добавить</button></div>
  <div class="pills wrapc">${ids.length?ids.map(id=>`<button class="pill tap" data-act="panDel" data-v="${id}" title="Убрать">${PROD[id].n} · ${fmtQty(id,S.pantry[id])} <span style="color:var(--ink3)">✕</span></button>`).join(''):'<span class="cap">Пока ничего</span>'}</div>
  <p class="foot">Эти продукты вычитаются из покупок, а блюда с ними попадают в меню чаще.</p>`;
}

function vProfile(){
  /* разделы сворачиваются; при входе в профиль все свёрнуты — сводка видна в шапке раздела */
  const sec=(title,body,k,def,hint,ic)=>k?`<details class="sec" data-k="p:${k}" ${dOpen('p:'+k,def)?'open':''}><summary class="h2">${ic?`<img class="sico" src="img2/ui/${ic}.webp" alt="">`:''}${title}<small>${hint||''}</small><span class="chev">${I.chev}</span></summary><div class="secb">${body}</div></details>`:`<div class="h2">${title}</div>${body}`;
  const ri=(cls,ic)=>`<span class="ri ${cls}">${ic}</span>`;
  return `<div class="screen"><div class="top"><div class="who"><span>Семья, бюджет, магазины</span><b class="lt">Профиль</b></div><img class="brand-signature" src="brand/tabi-wordmark.svg" alt="tabi"></div>
  ${TabiPersonal.profileCard(S.family[0])}
  ${sec('Оформление',TabiPersonal.appearancePanel(),'appearance',false,TabiPersonal.appearanceHint())}
  ${sec('Семья',pFamily(),'fam',false,S.family.length+' '+plural(S.family.length,'человек','человека','человек'),'family')}
  ${sec('Бюджет',pBudget(),'bud',false,rub(S.budget),'money')}
  ${sec('Магазины',pStores(),'st',false,S.home?esc(S.home.label.split(' · ')[0]):activeStores().length+' вкл.','cart')}
  ${sec('Что едите',pEat(),'eat',false,(S.eatOff||[]).length?'выключено '+(S.eatOff||[]).length:'всё подходит','plate')}
  ${sec('Вкусы',pPrefs(),'taste',false,[PREFS.filter(p=>S.prefs[p.id]).length&&PREFS.filter(p=>S.prefs[p.id]).map(p=>p.n).join(', '),S.likes.length&&S.likes.length+' любимых',(S.nodish||[]).length&&'не предлагаем '+S.nodish.length].filter(Boolean).join(' · ')||'','heart')}
  ${sec('Кухня и запасы',pPantry(),'pan',false,[PREP()>1&&'готовка раз в '+PREP()+' дня',!kit().oven&&'без духовки',!kit().stove&&'без плиты',kit().mc&&'мультиварка',Object.keys(S.pantry).length&&Object.keys(S.pantry).length+' дома'].filter(Boolean).join(' · '),'house')}
  ${sec('Ещё',`<div class="list">
    <button class="row tap" data-act="prices">${ri('',I.tag)}<span class="rl">Цены в магазинах<div>${FEED||S.priceSrc&&Object.keys(S.priceSrc).length?'Есть настоящие цены'+(feedDate()?' от '+dmy(feedDate()):''):'Встроенные, примерные'}</div></span><span class="chev">${I.chev}</span></button>
    ${standalone()?'':`<button class="row tap" data-act="install">${ri('lime',I.plus)}<span class="rl">Поставить на экран телефона<div>Со значком, работает без интернета</div></span><span class="chev">${I.chev}</span></button>`}
    <button class="row tap" data-act="wizard">${ri('dark',I.spark)}<span class="rl">Пройти настройку заново</span><span class="chev">${I.chev}</span></button>
    <button class="row tap" data-act="reset">${ri('red',I.trash)}<span class="rl" style="color:var(--red)">Сбросить все данные</span></button></div>`)}
  </div>`;
}

/* ------------------------------ шторки ------------------------------ */
function openSheet(html){
  const cur=$('#layer .sheet:not(.out) .pnl');
  if(cur){const sc=cur.scrollTop;morph(cur,`<div class="grab"></div>${html}`);clampAll(cur);cur.scrollTop=sc;return}
  $('#layer').innerHTML=`<div class="sheet" data-act="closeSheet"><div class="pnl"><div class="grab"></div>${html}</div></div>`;
  clampAll($('#layer .pnl'));
  $('#app').style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;document.body.classList.add('sheet-on');
  document.body.style.overflow='hidden';
}
function closeSheet(){
  const sh=$('#layer .sheet');
  if(sh){sh.classList.add('out');sheetOut(()=>{if(sh.isConnected)sh.remove()})}
  document.body.classList.remove('sheet-on');
  document.body.style.overflow='';
}
let SLOT=null;
let RMEM=null,RARGS=null;   // чью порцию показывать в рецепте
function sheetRecipe(rid,di,mi){
  RARGS=[rid,di,mi];
  SLOT=di!=null?{di:+di,mi:+mi}:null;
  let x=SLOT?S.plan?.days[SLOT.di]?.meals[SLOT.mi]:null;
  if(x?.rid!==rid){SLOT=null;x=null}
  const r=SLOT?plannedRecipe(S.plan,rid):RID[rid];
  if(x&&x.who!=null)RMEM=x.who;else if(RMEM!=null&&(!x||!x.fac[RMEM]))RMEM=null;
  const facOf=y=>RMEM!=null?(y.fac[RMEM]||0):y.fac.reduce((a,b)=>a+b,0);
  const bt=x&&x.prep?batchOf(SLOT.di,SLOT.mi):null,bn=bt?bt.items.length:1;
  const fs=x?(bt&&bn>1?bt.items.reduce((a,[d,k])=>a+facOf(S.plan.days[d].meals[k]),0):facOf(x)):1;
  const fam=S.family.length;
  const prepNote=bt&&bn>1?`<div class="subs">${I.fork}<span><b>Готовим сразу на ${bn} ${plural(bn,'день','дня','дней')}</b>. Продукты и цена ниже на все дни. Остудите, разложите по контейнерам и уберите в холодильник в течение 2 часов. Съешьте за 3 дня, разогревайте до горячего.</span></div>`
    :x&&x.from!=null?`<div class="subs">${I.fork}<span>Приготовлено ${dayDate(x.from).getDay()===2?'во':'в'} ${WDF[dayDate(x.from).getDay()]}. Достаньте порцию из холодильника и разогрейте до горячего.</span></div>`:'';
  openSheet(`<div class="rhero"><img src="img2/dish/${r.id}.jpg" alt=""><button class="x" data-act="closeSheet" aria-label="Закрыть">${I.x}</button><button class="lk ${S.likes.includes(r.id)?'on':''}" data-act="like" data-v="${r.id}" data-keep="1" aria-label="В любимые">${I.star}</button></div>
   <div class="rbody"><span class="badge">${r.m.map(m=>MEAL[m]).join(' · ')}</span><span class="cap2" hidden>${r.m.map(m=>MEAL[m]).join(' · ')}</span>
   <h2 class="lt" style="font-size:28px;margin:10px 0 6px">${esc(r.n)}</h2>
   <div class="cap">${I.clock.replace('<svg','<svg class="ic"')} ${fmtTime(rTime(r))} · ≈ ${rubR(rCost(r)*fs)} ${x?((fam>1&&RMEM==null?'на всех':'за порцию')+(bt&&bn>1?' на '+bn+' '+plural(bn,'день','дня','дней'):'')):'за порцию'}${excluded(r)?' · <b style="color:#C2271B">исключено предпочтениями</b>':''}</div>
   ${prepNote}
   ${kitNote(r)?`<div class="subs">${I.fork}<span>${kitNote(r)}</span></div>`:''}
   ${r.subs&&r.subs.length?`<div class="subs">${I.swap}<span>Заменили под ваши предпочтения: ${r.subs.map(([a,b])=>`${PROD[a].n.toLowerCase()} → <b>${PROD[b].n.toLowerCase()}</b>`).join(', ')}</span></div>`:''}
   ${(()=>{/* КБЖУ: из меню — на порцию конкретного человека, иначе — на 1 стандартную порцию */
     const pf=x&&(fam===1||RMEM!=null)?(x.fac[RMEM!=null?RMEM:0]||1):1,who=x&&(fam===1||RMEM!=null);
     return `<div class="flab">${who?(fam===1?'Ваша порция':'Порция: '+esc(S.family[RMEM].name)):'1 порция'}${who&&Math.abs(pf-1)>.05?` <span>· ${(Math.round(pf*10)/10).toString().replace('.',',')} станд. порции</span>`:''}</div>
     <div class="facts">${[['Ккал',r.kcal,''],['Белки',r.p,' г'],['Жиры',r.f,' г'],['Углев.',r.c,' г']].map(([n,v,u])=>`<div class="fact${n==='Ккал'?' k':''}"><b>${Math.round(v*pf)}${u?`<small>${u.trim()}</small>`:''}</b><span>${n}</span></div>`).join('')}</div>
     <div class="per100">${(()=>{const cg=cookedG(r),q=100/cg,d1=v=>(Math.round(v*10)/10).toLocaleString('ru-RU');return `На 100 г готового: <b>${Math.round(r.kcal*q)}</b> ккал · Б ${d1(r.p*q)} · Ж ${d1(r.f*q)} · У ${d1(r.c*q)} г${who?` · ваша порция ≈ ${Math.round(cg*pf/5)*5} г`:''}`})()}</div>`})()}
   ${x&&fam>1&&x.who==null?`<div class="pills" style="margin-bottom:6px"><button class="pill tap ${RMEM==null?'on':''}" data-act="rmem" data-v="all" data-keep="1">На всех</button>${x.fac.map((f,j)=>S.family[j]?`<button class="pill tap ${RMEM===j?'on':''}" data-act="rmem" data-v="${j}" data-keep="1">${esc(S.family[j].name)} · ${Math.round(r.kcal*f)} ккал</button>`:'').join('')}</div>`:''}
   ${(()=>{/* «кастрюля» — сырой вес на всех (и на все дни, если готовим впрок); «тарелка» — готовый вес каждому */
     const all=y=>y.fac.reduce((a,b)=>a+b,0);
     const pot=x?(bt&&bn>1?bt.items.reduce((a,[d,k])=>a+all(S.plan.days[d].meals[k]),0):all(x)):1;
     const cg=cookedG(r),raw=Object.values(r.ing).reduce((a,g)=>a+g,0);
     const plates=x?x.fac.map((f,j)=>f>0&&S.family[j]?[S.family[j].name||'Без имени',f]:null).filter(Boolean):[['1 стандартная порция',1]];
     return `<div class="h2" style="margin-top:20px">Ингредиенты (сырой вес) <small>${x?(fam>1?'на всю семью':'на вас'):'на 1 порцию'}${bt&&bn>1?' на '+bn+' '+plural(bn,'день','дня','дней'):''}</small></div>
   <div class="list" data-noclamp style="padding:2px 0">${Object.entries(r.ing).map(([id,g])=>`<div class="ing">${pic(id)}<span class="n">${PROD[id].n}</span><span class="q">${fmtQty(id,g*pot)}</span></div>`).join('')}</div>
   <div class="h2">Накладываем в тарелку <small>готовый вес${bt&&bn>1?' · на один раз':''}</small></div>
   <div class="list plates" data-noclamp>${plates.map(([n,f])=>`<div class="row"><span class="mava sm">${esc(String(n).trim().charAt(0).toUpperCase()||'?')}</span><span class="rl">${esc(n)}<div>${Math.round(r.kcal*f)} ккал · Б ${Math.round(r.p*f)} г · Ж ${Math.round(r.f*f)} г · У ${Math.round(r.c*f)} г</div></span><span class="rv"><b>${Math.round(cg*f/5)*5}</b> г</span></div>`).join('')}</div>
   ${Math.abs(cg-raw)<raw*.1?`<p class="foot">Вес при приготовлении почти не меняется: около ${cg} г на стандартную порцию.</p>`:`<p class="foot">Готовый вес примерный: крупы при варке тяжелеют почти втрое, мясо теряет около четверти${SOUP.test(r.n0||r.n)?', в суп добавили ~200 мл воды на порцию':''}. Сырого ${Math.round(raw)} г, готового ≈ ${cg} г на стандартную порцию.</p>`}`})()}
   <div class="h2">Как готовить</div>
   <ol class="steps">${r.st.split(/(?<=\.)\s+/).filter(Boolean).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
   <div class="acts">
     <button class="btn soft tap" data-act="like" data-v="${r.id}" data-keep="1">${I.star}${S.likes.includes(r.id)?'В любимых':'В любимые'}</button>
     ${SLOT?`<button class="btn tap" data-act="swap">${I.swap} Заменить</button>`:`<button class="btn tap" data-act="closeSheet">Готово</button>`}
   </div>
   <button class="nodish tap" data-act="nodishR" data-v="${r.id}">${(S.nodish||[]).includes(r.id)?'Снова предлагать это блюдо':'Не люблю, больше не предлагать'}</button></div>`);
}
function applyPrices(j){
  const prices=readPrices(j?.prices||j),stores=new Set();
  let n=0;
  for(const [pid,row] of Object.entries(prices)){
    S.prices[pid]||={};
    for(const [s,p] of Object.entries(row)){
      S.prices[pid][s]=String(p);stores.add(s);n++;
      const name=j.names?.[pid]?.[s],image=j.images?.[pid]?.[s];
      if(typeof name==='string')((S.pasteName||={})[pid]||={})[s]=name;
      if(typeof image==='string'&&/^https:\/\//.test(image))((S.pasteImg||={})[pid]||={})[s]=image;
    }
  }
  if(!n){toast('В файле не нашлось подходящих цен','gear');return 0}
  S.priceSrc||={};
  stores.forEach(s=>S.priceSrc[s]={date:priceDate(j.date||j.updated)||new Date().toISOString().slice(0,10),how:j.source==='korzinka-collector'?'закладка':'файл'});
  markDirty();sheetPrices();render(true);toast(`Обновлено цен: ${n}`,'money_bag');return n;
}
const priceDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)?d:'';
function readPrices(src){
  const result={};
  if(!src||typeof src!=='object')return result;
  for(const [pid,row] of Object.entries(src)){
    if(!Object.hasOwn(PROD,pid)||!row||typeof row!=='object')continue;
    for(const [s,value] of Object.entries(row)){
      if(!SK.includes(s))continue;
      const p=validPrice(value);
      if(p!=null)(result[pid]||={})[s]=p;
    }
  }
  return result;
}
/* цены из расширения «tabi — сборщик цен» (папка extension): оно присылает их через postMessage */
function extPrices(d){
  const prices=readPrices(d.prices);
  const sig=JSON.stringify([prices,d.images||{},d.names||{},d.dates||{}]);
  if(sig===S.extSig)return;
  const first=S.extSig==null;S.extSig=sig;S.ext=prices;S.extImg=d.images||{};S.extName=d.names||{};
  const n=Object.values(prices).reduce((sum,row)=>sum+Object.keys(row).length,0);
  S.priceSrc=S.priceSrc||{};
  for(const[s,dt] of Object.entries(d.dates||{}))if(SK.includes(s)&&priceDate(dt))S.priceSrc[s]={date:dt,how:'расширение'};
  markDirty();
  if(WIZ==null&&S.onb){
    if($('.pt'))sheetPrices();
    else render(true);
  }
  if(n)toast(`${first?'Расширение подключено':'Расширение обновило цены'}: ${n} ${plural(n,'цена','цены','цен')}`,'money_bag');
}
window.addEventListener('message',e=>{if(e.source===window&&e.origin===location.origin&&e.data?.source==='korzinka-ext')extPrices(e.data)});
if(location.protocol!=='file:')window.postMessage({source:'korzinka-app',ask:'prices'},location.origin);
function srcLine(){
  const fd=d=>priceDate(d).split('-').reverse().slice(0,2).join('.');
  return STORES.map(s=>{const u=S.priceSrc?.[s.id],f=FEED?.sources?.[s.id];
    const t=u&&(!f||u.date>=f.date)?`${fd(u.date)} · ${u.how}`:f?`${fd(f.date)} · скрипт`:'примерные';
    return `<span class="pill" style="padding:6px 11px">${smark(s.id)}${esc(t)}</span>`}).join('');
}
function sheetPrices(){
  const k=CITY[S.city].k;let cat='';
  let rows=`<tr><th>Товар</th>${STORES.map(s=>`<th>${smark(s.id)}</th>`).join('')}</tr>`;
  Object.values(PROD).forEach(p=>{
    if(p.cat!==cat){cat=p.cat;rows+=`<tr><td colspan="${1+STORES.length}" class="cap2" style="padding-top:16px">${cat}</td></tr>`}
    rows+=`<tr><td>${p.n}<div class="cap">${p.pl}</div></td>${STORES.map(s=>{const o=S.prices[p.id]?.[s.id],e=validPrice(S.ext?.[p.id]?.[s.id]),f=validPrice(FEED?.prices?.[p.id]?.[s.id]),b=p.base[s.id];
      const ph=e!=null?e:f!=null?f:(b==null?'':Math.round(b*k));
      return `<td><input data-pp="${p.id}" data-ps="${s.id}" value="${esc(o??'')}" placeholder="${ph}" inputmode="decimal"></td>`}).join('')}</tr>`;
  });
  openSheet(`<div class="shead"><h2 class="lt" style="font-size:28px">Цены</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
   <div class="note" style="margin-bottom:12px">Серые числа это встроенные примерные цены или цены из обновления${S.city!=='Москва'?` с поправкой на город (×${k})`:''}${FEED?' или цены из prices.json'+(FEED.updated?` от ${esc(FEED.updated)}`:''):''}. Впишите цену с ценника или из приложения магазина, расчёт сразу обновится. «-» значит, что товара нет в магазине. Пустое поле вернёт встроенную цену.</div>
   <span class="lbl">Откуда цены</span><div class="pills wrapc" style="margin-bottom:16px">${srcLine()}</div>
   <button class="btn lime tap" style="margin-bottom:10px" data-act="pasteOpen">Вставить цены из закладки</button>
   <div id="pasteBox" style="display:none;margin-bottom:12px"><textarea id="pasteTxt" class="field" rows="4" placeholder="Вставьте сюда текст, скопированный закладкой «tabi: собрать цены»" style="resize:vertical;font-size:13px"></textarea>
     <button class="btn tap" style="margin-top:8px;height:48px" data-act="pasteApply">Применить</button></div>
   ${document.documentElement.dataset.korzinkaExt?'<div class="note ok" style="margin-bottom:10px">Расширение подключено. Цены, которые оно собирает на сайтах магазинов, появляются здесь сами.</div>':''}
   <a class="btn soft tap" style="margin-bottom:10px;text-decoration:none" href="collector.html">Как обновлять цены: расширение, закладка, скрипты</a>
   <div class="g2" style="margin-bottom:12px"><button class="btn soft tap" data-act="exportPrices">Сохранить в файл</button><button class="btn soft tap" data-act="importPrices">Загрузить файл</button></div>
   <input type="file" id="priceFile" accept=".json,application/json" hidden>
   <div class="tsc pt"><table>${rows}</table></div>
   <button class="btn soft tap" style="margin-top:14px;color:var(--redT)" data-act="resetPrices">Сбросить мои цены</button>`);
}

/* ------------------------------ онбординг и мастер ------------------------------ */
function vOnb(){
  /* бегущая строка логотипов сетей: список дважды подряд — сдвиг на половину даёт бесконечную ленту */
  const ids=['magnit','pyat','chizhik','svetofor','perek','dixy','vkusvill','azbuka','samokat','lavka','ozon'];
  const row=ids.map(s=>`<span class="ml"><img src="img2/store/${s}.webp" alt="${esc(SN(s))}" loading="eager"></span>`).join('');
  const r=RID.b1,kc=Math.round(r.kcal),pr=Math.round(r.p);
  return `<div class="onb onb2"><div class="in">
    <div class="logo" aria-label="tabi — таби"><img class="tabi-mark" src="brand/tabi-app-icon.svg" alt=""><img class="tabi-wordmark" src="brand/tabi-wordmark.svg" alt="tabi"></div>
    <div class="marq" aria-hidden="true"><div class="mtrack">${row}${row}</div></div>
    <div class="ohero" aria-hidden="true"><div class="gstack">
      <div class="gcard gmain"><span class="gk">Корзина на неделю</span><b class="gsum">3 850 <small>₽</small></b><span class="gsave">−1 420 ₽</span>
        <div class="gbar"><i></i></div><span class="gmeta">1 поход · 7 дней · 21 блюдо</span></div>
      <div class="gcard gdish"><img src="img2/dish/b1.jpg" alt=""><div><b>${esc(r.n)}</b><span>${kc} ккал · Б ${pr} г</span></div></div>
      <div class="gcard gchip"><img src="img2/store/magnit.webp" alt=""><img src="img2/store/pyat.webp" alt="">Магнит + Пятёрочка</div>
    </div></div>
    <h1>Закупились раз, <em>и готовите всю неделю</em></h1>
    <p class="sub">Соберём выгодную корзину под ваш бюджет и срок, без ежедневных походов и лишних трат.</p>
    <div class="ostats"><div><b>1 поход</b><span>в неделю</span></div><div><b>−20%</b><span>на чеке</span></div><div><b>КБЖУ</b><span>на семью</span></div></div>
    <button class="btn go tap" data-act="start">Собрать моё меню<span class="arr">${I.arrows}</span></button>
    <p class="fine">Около минуты. Данные хранятся только на этом телефоне.</p>
  </div></div>`;
}
const WSTEPS=[
  {t:'Кто в семье?',s:'Посчитаем норму калорий и БЖУ для каждого.',img:'smiling_face',ui:'family',b:pFamily},
  {t:'Какой бюджет?',s:'Сумма на продукты и срок, на который покупаем.',img:'money_bag',ui:'money',b:pBudget},
  {t:'Что вы любите?',s:'Исключим лишнее и чаще будем ставить любимое.',img:'red_heart',ui:'heart',b:pPrefs},
  {t:'Где покупаете?',s:'Сравним цены в магазинах вашего города.',img:'shopping_cart',ui:'cart',b:pStores},
  {t:'Что вы едите?',s:'Отметьте, что у вас обычно бывает на завтрак, обед и ужин. Остальное в меню ставить не будем.',img:'fork_and_knife_with_plate',ui:'plate',b:pEat},
  {t:'Что есть на кухне?',s:'Отметьте технику, и мы предложим только то, что получится приготовить. И что уже лежит дома, чтобы не покупать.',img:'house',ui:'house',b:pPantry}
];
/* Первое меню только после проверки ограничений и вкусов. */
function vPreview(){
  const rec=shop().recommended,tot=effTotal(rec),d=S.plan.days[0],nd=S.plan.days.length,left=S.budget-tot;
  const meals=d.meals.filter(x=>x.rid&&x.who==null).slice(0,4);
  return `<div class="wiz"><div class="in">
    <div class="wbar"><button class="rb tap" data-act="wizBack" aria-label="Назад">${I.back}</button><div class="wprog">${WSTEPS.map((_,i)=>`<i class="${i<=2?'on':''}"></i>`).join('')}</div><span class="badge lime">Меню готово</span></div>
    <div class="whead"><h1 class="lt">Меню уже собрано</h1><img class="wico" src="img2/ui/plate.webp" alt=""></div>
    <p class="sub">Под вашу семью и бюджет на ${nd} ${plural(nd,'день','дня','дней')}. Ограничения и вкусы уже учтены. Магазины и технику можно уточнить сейчас или потом в профиле.</p>
    <div class="hero dark pv"><div class="k">Корзина на ${nd} ${plural(nd,'день','дня','дней')}</div>
      <div class="big"><span class="cn" data-ck="sumW" data-n="${tot}">${rubN(tot)}</span><small>₽</small></div>
      <div class="sub" style="color:rgba(255,255,255,.7)">${left>=0?`из ${rub(S.budget)} · останется <b style="color:var(--lime)">${rub(left)}</b>`:`<b>Не хватает ${rub(-left)}</b>`}</div></div>
    <div class="h2">Так выглядит первый день</div>
    ${meals.map(x=>{const r=plannedRecipe(S.plan,x.rid);return `<div class="meal">${dish(r.id,'dp')}<div class="mt"><span class="badge">${MEAL[x.meal]}</span><div class="mn">${esc(r.n)}</div><div class="mm"><b>${Math.round(r.kcal)}</b> ккал · ≈ ${rubR(rCost(r))}</div></div></div>`}).join('')}
    </div>
    <div class="wfoot"><button class="btn go tap" data-act="wizDone">Открыть меню<span class="arr">${I.arrows}</span></button>
      <button class="wskip tap" data-act="wizMore">Уточнить магазины и кухню</button></div></div>`;
}
function vWiz(){
  if(WPV)return vPreview();
  const st=WSTEPS[WIZ],last=WIZ===WSTEPS.length-1;
  return `<div class="wiz"><div class="in">
    <div class="wbar"><button class="rb tap" data-act="wizBack" aria-label="Назад">${I.back}</button><div class="wprog">${WSTEPS.map((_,i)=>`<i class="${i<=WIZ?'on':''}"></i>`).join('')}</div><span class="badge">${WIZ+1} из ${WSTEPS.length}</span></div>
    <div class="whead"><h1 class="lt">${st.t}</h1>${st.ui?`<img class="wico" src="img2/ui/${st.ui}.webp" alt="">`:''}</div><p class="sub">${st.s}</p>
    <div id="wbody">${st.b()}</div></div>
    <div class="wfoot"><button class="btn go tap" data-act="wizNext">${last?'Собрать корзину':'Дальше'}<span class="arr">${I.arrows}</span></button>${WIZ>=3&&!last?'<button class="wskip tap" data-act="wizDone">Пропустить и настроить позже</button>':''}</div></div>`;
}
function bindSlide(){
  const sl=$('#slide'),kn=$('#knob');if(!sl)return;
  let x0=null,max=0;
  const go=()=>{S.onb=true;save();WIZ=0;render()};
  kn.addEventListener('pointerdown',e=>{x0=e.clientX;max=sl.clientWidth-kn.offsetWidth-12;kn.setPointerCapture(e.pointerId);kn.style.transition='none'});
  kn.addEventListener('pointermove',e=>{if(x0==null)return;kn.style.transform=`translateX(${clamp(e.clientX-x0,0,max)}px)`});
  kn.addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;kn.style.transition='transform .35s cubic-bezier(.2,.8,.2,1)';
    if(dx>max*.6||Math.abs(dx)<6){kn.style.transform=`translateX(${max}px)`;setTimeout(go,260)}else kn.style.transform=''});
  sl.querySelector('.lab').addEventListener('click',go);
}

/* ------------------------------ отрисовка ------------------------------ */
const TABS=[['home','Сегодня',I.home],['basket','Корзина',I.cart],['recipes','Рецепты',I.book],['profile','Профиль',I.user]];
function render(keepScroll){ resub();
  const y=scrollY;
  const app=$('#app'),tb=$('#tabbar');
  if(!S.onb&&WIZ==null){app.innerHTML='';tb.style.display='none';$('#layer').innerHTML=vOnb();bindSlide();return}
  if(WIZ!=null){app.innerHTML='';tb.style.display='none';$('#layer').innerHTML=vWiz();bindInputs();afterRender($('#layer'));return}
  if($('#layer .onb,#layer .wiz'))$('#layer').innerHTML='';
  tb.style.display='';
  const html={home:vHome,basket:vBasket,recipes:vRecipes,profile:vProfile}[S.tab]();
  /* тот же экран — меняем только изменившееся (переходы кнопок и переключателей проигрываются);
     другой экран — рисуем заново с появлением блоков */
  if(keepScroll&&app.dataset.tab===S.tab&&app.firstElementChild){morph(app,html.replace('class="screen','class="screen still'))}
  else{app.innerHTML=html;app.dataset.tab=S.tab;if(keepScroll)app.firstElementChild?.classList.add('still')}
  const tabs=`<div class="tw">${TABS.map(t=>`<button class="tab ${S.tab===t[0]?'on':''}" data-act="tab" data-v="${t[0]}" aria-label="${t[1]}" ${S.tab===t[0]?'aria-current="page"':''}>${t[2]}<span class="tl">${t[1]}</span></button>`).join('')}</div>`;
  if(tb.firstElementChild)morph(tb,tabs);else tb.innerHTML=tabs;
  clampAll(app);
  bindInputs();
  if(keepScroll)scrollTo(0,y);
  if(S.tab==='home')centerDay(false);
  afterRender(app);
}
function rerenderBody(){ // перерисовать текущий экран/шаг без прыжка прокрутки
  if(WIZ!=null&&WPV)render();
  else if(WIZ!=null){const w=$('.wiz'),y=w?w.scrollTop:0;morph($('#wbody'),WSTEPS[WIZ].b());bindInputs();afterRender($('#wbody'));if(w)w.scrollTop=y}
  else render(true);
}
function markDirty(){S.likes=S.likes.filter(id=>!(S.nodish||[]).includes(id));S.dirty=!!S.plan;SH=null;save()}
function autoRegen(){if(generate(false))toast(movedNote()||'Меню пересобрано под новые настройки',movedNote()?'house':'sparkles')}
const movedNote=()=>MOVED?.length?'В «Что есть дома» перенесли: '+MOVED.slice(0,3).join(', ')+(MOVED.length>3?` и ещё ${MOVED.length-3}`:''):'';

/* ------------------------------ ввод ------------------------------ */
function bindInputs(){
  geoBind();
  document.querySelectorAll('[data-f]').forEach(el=>{
    el.oninput=el.onchange=()=>{const i=+el.dataset.f,k=el.dataset.k,m=S.family[i];
      m[k]=['age','weight','height','act'].includes(k)?+el.value:el.value;markDirty();
      const kc=$('#kc'+i);if(kc)kc.innerHTML=kcLine(m,target(m));
      if(k==='name'){const av=el.parentNode.querySelector('.mava');if(av&&!TabiPersonal.avatarSrc(m.avatar))av.textContent=(el.value.trim().charAt(0)||'?').toUpperCase()}};
  });
  const bi=$('#budgetIn'),br=$('#budgetRange');
  const setB=(v,src)=>{S.budget=Math.max(0,Math.round(+v||0));markDirty();
    if(src!=='in'&&bi)bi.value=bfmt(S.budget);
    if(br){if(src!=='range')br.value=clamp(S.budget,1000,BMAX());br.style.setProperty('--p',clamp((S.budget-1000)/(BMAX()-1000),0,1)*100+'%')}
    document.querySelectorAll('[data-act=budget]').forEach(b=>b.classList.toggle('on',+b.dataset.v===S.budget))};
  /* поле с пробелами между разрядами: «20 000» — берём только цифры и сразу форматируем */
  if(bi)bi.oninput=()=>{const d=bi.value.replace(/\D/g,'').slice(0,7);setB(d,'in');bi.value=d?bfmt(+d):''};
  if(br)br.oninput=()=>setB(br.value,'range');
  const fi=$('#favoriteIn');if(fi)fi.oninput=()=>{FQ=fi.value;$('#favoriteChoices').innerHTML=favoriteChoices()};
  const wi=$('#wishIn');if(wi)wi.oninput=()=>{WQ=wi.value;$('#wishRes').innerHTML=wishRes()};
  const pp=$('#panP');if(pp)pp.onchange=()=>{$('#panU').textContent=pp.value==='yaytsa'?'Сколько, шт':LIQ.has(pp.value)?'Сколько, мл':'Сколько, г'};
}
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.pp){const v=t.value.trim().replace(',','.'),p=validPrice(v),pid=t.dataset.pp,s=t.dataset.ps;
    if(v&&v!=='-'&&p==null){t.value=S.prices[pid]?.[s]??'';toast('Введите положительную цену или «-»','gear');return}
    S.prices[pid]||={};
    if(v==='')delete S.prices[pid][s];else S.prices[pid][s]=v==='-'?'-':String(p);
    if(!Object.keys(S.prices[pid]).length)delete S.prices[pid];markDirty();render(true)}
  if(t.id==='priceFile'&&t.files[0]){const fr=new FileReader();fr.onload=()=>{try{applyPrices(JSON.parse(fr.result))}catch(err){toast('Не получилось прочитать файл','gear')}};fr.readAsText(t.files[0])}
});

/* ------------------------------ действия ------------------------------ */
const toggleIn=(arr,v)=>arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];
const A={
  tab:a=>{const was=S.tab;if(was===a.dataset.v){scrollTo({top:0,behavior:'smooth'});return}
    S.tab=a.dataset.v;save();if(was==='profile'&&S.dirty&&S.plan)autoRegen();
    if(S.tab==='profile')Object.keys(DK).forEach(k=>{if(k.startsWith('p:'))delete DK[k]});
    scrollTo(0,0);render()},
  day:a=>{const n=+a.dataset.v;if(n===S.day)return;const dir=n>S.day?1:-1;S.day=n;save();
    daySwap(dir);centerDay(true)},
  member:a=>{S.member=+a.dataset.v;save();render(true)},
  rf:a=>{S.rf=a.dataset.v;save();render(true)},
  rqClear:()=>{RQ='';const i=$('#rq');if(i){i.value='';i.focus()}rRefresh()},
  rsort:()=>openSheet(`<div class="shead"><h2 class="lt" style="font-size:26px">Сортировка</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <div class="list" data-noclamp>${RSORT.map(([v,n,d])=>`<button class="row tap" data-act="rsortSet" data-v="${v}"><span class="rl">${n}<div>${d}</div></span>${S.rs===v?`<span class="sok">${I.check}</span>`:''}</button>`).join('')}</div>`),
  rsortSet:a=>{S.rs=a.dataset.v;save();closeSheet();render(true)},
  recipe:(a,e)=>{if(e.target.closest('[data-act=like]'))return;RMEM=null;sheetRecipe(a.dataset.v,a.dataset.di,a.dataset.mi)},
  like:a=>{const id=a.dataset.v;
    if(!S.likes.includes(id)&&excluded(RID[id])){toast('Это блюдо не подходит под ваши настройки. Сначала измените ограничения.');return}
    S.likes=toggleIn(S.likes,id);markDirty();
    if($('.sheet')&&a.dataset.keep){const s=SLOT;sheetRecipe(a.dataset.v,s?.di,s?.mi)}
    if(WIZ!=null)rerenderBody();else render(true)},
  swap:()=>{if(!SLOT)return;
    if(S.dirty){toast('Сначала обновите меню','gear');return}
    const many=(batchOf(SLOT.di,SLOT.mi)?.items.length||1)>1;const nr=swapMeal(SLOT.di,SLOT.mi);if(nr){sheetRecipe(nr.id,SLOT.di,SLOT.mi);render(true);toast('Заменили на «'+nr.n+'»'+(many?' во всех днях':''),RIMG[nr.id])}},
  closeSheet:(a,e)=>{if(e.target.closest('.pnl')&&!a.closest('.pnl'))return;closeSheet()},
  bought:a=>{const id=a.dataset.v;S.bought[id]=!S.bought[id];if(!S.bought[id])delete S.paid[id];save();render(true)},
  /* поделиться списком: что ещё купить, по магазинам, простым текстом */
  share:()=>{const rec=shop().recommended,L=[];
    rec.set.filter(s=>rec.alloc[s]).forEach(s=>{const rest=rec.alloc[s].filter(i=>!S.bought[i.pid]);if(!rest.length)return;
      L.push(`${SN(s)}:\n`+rest.map(i=>`- ${pname(i.pid)}, ${i.packs} × ${i.pl||PROD[i.pid].pl}`).join('\n'))});
    if(!L.length){toast('Всё уже куплено','shopping_cart');return}
    if(rec.missing.length)L.push('Нет в выбранных магазинах: '+rec.missing.map(id=>PROD[id].n).join(', '));
    const done=Object.values(rec.alloc).flat().filter(i=>S.bought[i.pid]).length;
    const txt=`Список покупок\n\n${L.join('\n\n')}\n\nПримерно ${rub(effTotal(rec)-spentNow(rec))}${done?` · уже куплено ${done} ${plural(done,'товар','товара','товаров')}`:''}`.replace(/\u00a0/g,' ');
    if(navigator.share)navigator.share({title:'Список покупок',text:txt}).catch(e=>{if(e?.name!=='AbortError')copyTxt(txt)});else copyTxt(txt)},
  dlvList:a=>{const s=a.dataset.v,sh=shop(),rec=sh.recommended;
    const list=(a.dataset.all?sh.toBuy:(rec.alloc[s]||[])).filter(i=>!S.bought[i.pid]);
    openSheet(`<div class="shead"><h2 class="lt" style="font-size:26px">${smark(s)} ${SN(s)}</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <p class="note" style="margin-bottom:12px">Корзину целиком сервисы принять не умеют. Нажмите на товар, откроется поиск ${DLV_IN[s]}, добавьте нужное в корзину там и вернитесь сюда. Купленное отмечайте в «Корзине».</p>
    ${list.length?`<div class="list">${list.map(i=>`<a class="row tap" href="${DLV_URL[s](dlvQ(i.pid))}" target="_blank" rel="noopener noreferrer">${pic(i.pid)}<span class="rl">${pname(i.pid)}<div>${i.packs} × ${i.pl||PROD[i.pid].pl}</div></span><span class="go">${I.chev}</span></a>`).join('')}</div>`:'<p class="note">Всё уже куплено.</p>'}
    <p class="foot">Если откроется общий каталог, а не поиск, наберите название в поиске сервиса. Цены там могут отличаться от наших примерных.</p>`)},
  halalMode:a=>{S.halalMode=a.dataset.v;save();rerenderBody()},
  install:()=>{
    if(INSTALL){INSTALL.prompt();INSTALL.userChoice.finally(()=>{INSTALL=null});return}
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
    openSheet(`<div class="shead"><h2 class="lt" style="font-size:26px">На экран телефона</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <div class="list">${(ios?[['1','Откройте tabi в Safari'],['2','Нажмите «Поделиться», это квадрат со стрелкой вверх внизу экрана'],['3','Выберите «На экран „Домой“» и нажмите «Добавить»']]
      :[['1','Откройте tabi в Chrome'],['2','Нажмите ⋮ в правом верхнем углу'],['3','Выберите «Добавить на главный экран» или «Установить приложение»']]).map(([n,t])=>`<div class="row"><span class="ri lime">${n}</span><span class="rl">${t}</span></div>`).join('')}</div>
    <p class="foot">Появится значок tabi. Открывается без строки браузера, а меню, корзина и рецепты работают без интернета. Он нужен только для обновления цен.</p>`)},
  shopMode:()=>{S.shopMode=!S.shopMode;save();render(true);},
  paid:a=>{const id=a.dataset.v,it=Object.values(shop().recommended.alloc).flat().find(i=>i.pid===id);if(!it)return;const plan=it.price*it.packs;
    openSheet(`<div class="shead"><h2 class="lt" style="font-size:24px">${PROD[id].n}</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <p class="note" style="margin-bottom:12px">${it.packs} × ${it.pl||PROD[id].pl} · по плану ${rub(plan)}. Впишите, сколько вышло на самом деле, и остаток бюджета пересчитаем.</p>
    <label><span class="mini">Цена с чека, ₽</span><input id="paidIn" class="field num" type="text" inputmode="decimal" autocomplete="off" placeholder="${Math.round(plan)}" value="${S.paid[id]??''}" style="font-size:22px;height:56px"></label>
    <button class="btn go tap" style="margin-top:12px" data-act="paidSave" data-v="${id}">Сохранить</button>
    ${S.paid[id]!=null?`<button class="btn soft tap" style="margin-top:8px" data-act="paidClear" data-v="${id}">Вернуть цену из плана</button>`:''}`);
    setTimeout(()=>$('#paidIn')?.focus(),280)},
  paidSave:a=>{const v=parseFloat(String($('#paidIn').value).replace(/\s/g,'').replace(',','.'));
    if(!(v>=0)||v>200000){toast('Впишите сумму в рублях, например 89,90','gear');return}
    S.paid[a.dataset.v]=Math.round(v*100)/100;S.bought[a.dataset.v]=true;save();closeSheet();render(true);toast('Цена учтена, остаток пересчитан','shopping_cart')},
  paidClear:a=>{delete S.paid[a.dataset.v];save();closeSheet();render(true)},
  fab:a=>{a.classList.add('spin');if(!S.plan&&!S.onb)return;if(generate(true)){render();toast(movedNote()||'Новый вариант меню',movedNote()?'house':'sparkles')}},
  regen:()=>{autoRegen();render(true)},
  /* чипс магазина на карточке бюджета → корзина, раскрытая на этом магазине */
  toStore:(a,e)=>{e?.stopPropagation();const s=a.dataset.v;DK['b:'+s]=true;S.tab='basket';save();
    transition(()=>{render();const d=document.querySelector(`[data-k="b:${s}"]`);if(d)scrollTo(0,d.getBoundingClientRect().top+scrollY-12);else scrollTo(0,0)},'fwd')},
  ate:(a,e)=>{e?.stopPropagation();S.ate||={};const k=ateKey(a.dataset.m!=null?+a.dataset.m:null),v=a.dataset.v,L=(S.ate[k]||[]).map(String);
    S.ate[k]=L.includes(v)?L.filter(x=>x!==v):[...L,v];if(!S.ate[k].length)delete S.ate[k];
    /* храним отметки за последние 60 дней */
    const old=Object.keys(S.ate).filter(x=>(Date.now()-new Date(x.split('|')[0]))/864e5>60);old.forEach(x=>delete S.ate[x]);
    save();render(true)},
  /* своя норма КБЖУ: вписать вручную или вернуть авторасчёт */
  kbju:a=>{const i=+a.dataset.v,m=S.family[i];if(!m)return;const t=target(m),au=autoTarget(m);
    const f=(k,l,u)=>`<label><span class="mini">${l}, ${u}</span><input class="field num" id="kb_${k}" type="text" inputmode="numeric" autocomplete="off" value="${t[k]}" placeholder="${au[k]}"></label>`;
    openSheet(`<div class="shead"><h2 class="lt" style="font-size:24px">Норма ${esc(m.name||'')}</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <p class="note" style="margin-bottom:12px">Авторасчёт: ${au.kcal.toLocaleString('ru-RU')} ккал · Б ${au.p} г · Ж ${au.f} г · У ${au.c} г. Если врач или тренер дал свои цифры, впишите их, и меню соберём под них.</p>
    <div class="g2">${f('kcal','Калории','ккал')}${f('p','Белки','г')}${f('f','Жиры','г')}${f('c','Углеводы','г')}</div>
    <p class="foot" id="kb_hint" style="margin:10px 4px 0"></p>
    <button class="btn go tap" style="margin-top:12px" data-act="kbjuSave" data-v="${i}">Сохранить</button>
    ${m.custom?`<button class="btn soft tap" style="margin-top:8px" data-act="kbjuReset" data-v="${i}">Сбросить на авторасчёт</button>`:''}`);
    const hint=()=>{const g=k=>+($('#kb_'+k)?.value||'').replace(/\D/g,'')||0,kc=g('p')*4+g('f')*9+g('c')*4,h=$('#kb_hint');
      if(h)h.textContent=kc?`По белкам, жирам и углеводам выходит ${kc.toLocaleString('ru-RU')} ккал${Math.abs(kc-g('kcal'))>g('kcal')*.1?', это заметно расходится с калориями, проверьте цифры':''}.`:''};
    ['kcal','p','f','c'].forEach(k=>{const el=$('#kb_'+k);if(el)el.oninput=hint});hint()},
  kbjuSave:a=>{const i=+a.dataset.v,m=S.family[i];if(!m)return;const g=k=>+($('#kb_'+k)?.value||'').replace(/\D/g,'')||0;
    const c={kcal:g('kcal'),p:g('p'),f:g('f'),c:g('c')};
    if(c.kcal<800||c.kcal>6000){toast('Калории можно от 800 до 6 000','gear');return}
    m.custom=c;markDirty();closeSheet();rerenderBody();toast('Своя норма сохранена','sparkles')},
  kbjuReset:a=>{const m=S.family[+a.dataset.v];if(!m)return;delete m.custom;markDirty();closeSheet();rerenderBody();toast('Норма снова по авторасчёту','sparkles')},
  toNut:()=>{const n=$('#nut');if(n)scrollTo({top:n.getBoundingClientRect().top+scrollY-12,behavior:'smooth'})},
  tier:a=>{const t=a.dataset.v;S.tiers[t]=!S.tiers[t];if(!TK.some(k=>S.tiers[k])){S.tiers[t]=true;toast('Нужен хотя бы один класс магазинов','shopping_cart');return}markDirty();rerenderBody()},
  rmem:a=>{RMEM=a.dataset.v==='all'?null:+a.dataset.v;sheetRecipe(...RARGS)},
  maxStores:a=>{S.maxStores=+a.dataset.v;markDirty();rerenderBody()},
  cook:a=>{S.cook=a.dataset.v;markDirty();rerenderBody()},
  days:a=>{S.days=+a.dataset.v;markDirty();rerenderBody()},
  budget:a=>{S.budget=+a.dataset.v;markDirty();rerenderBody()},
  snack:a=>{S.snack=a.checked;markDirty()},
  store:a=>{const v=a.dataset.v;S.stores[v]=a.checked;if(ST(v)==='dlv'&&!dlvKnown(v)){S.dlvOn=Object.assign({},S.dlvOn,{[v]:a.checked})}markDirty();rerenderBody()},
  geoLocate:()=>geoLocate(),
  retryNear:()=>{if(!GBUSY&&S.home){findNear();rerenderBody()}},
  clearHome:()=>{const h=S.home;setHome(h?.lat,h?.lon,{scope:'city',city:h?.town||S.city,region:h?.region})},
  prep:a=>{S.prep=+a.dataset.v;markDirty();rerenderBody()},
  prepB:a=>{S.prepB=a.checked;markDirty();rerenderBody()},
  kit:a=>{const k=kit();k[a.dataset.v]=!k[a.dataset.v];S.kit=k;markDirty();rerenderBody()},
  pref:a=>{S.prefs[a.dataset.v]=!S.prefs[a.dataset.v];markDirty();resub();rerenderBody()},
  dislike:a=>toggleFood(a.dataset.v),
  dislikeSw:a=>toggleFood(a.dataset.v),
  eat:a=>{const k=a.dataset.v,m=k.split(':')[0],off=S.eatOff||[];
    if(!off.includes(k)&&new Set(allowedRecipes().filter(r=>r.m.includes(m)&&!off.includes(m+':'+eatCat(r,m))).map(r=>eatCat(r,m))).size<=1){toast('Хотя бы что-то одно на '+MEALN[m].toLowerCase()+' оставьте');return}
    S.eatOff=toggleIn(off,k);markDirty();rerenderBody()},
  baseOut:a=>{const id=a.dataset.v;S.baseOut=toggleIn(S.baseOut||[],id);
    /* из корзины: продукт сразу в покупках, меню не пересобираем — меняется только список */
    if(S.tab==='basket'&&WIZ==null){SH=null;save();render(true);toast(`Добавили в покупки: ${PROD[id].n.toLowerCase()}`,'shopping_cart');return}
    markDirty();rerenderBody()},
  hideApprox:a=>{S.hideApprox=a.checked;if(!activeStores().length){S.hideApprox=false;a.checked=false;toast('Тогда не останется ни одного магазина','shopping_cart');return}markDirty();rerenderBody()},
  nodish:a=>{S.nodish=toggleIn(S.nodish||[],a.dataset.v);markDirty();rerenderBody()},
  nodishDel:a=>{S.nodish=(S.nodish||[]).filter(x=>x!==a.dataset.v);markDirty();rerenderBody()},
  nodishAll:()=>{const{rs}=wishFind(WQ),nd=new Set(S.nodish||[]),off=rs.every(r=>nd.has(r.id));rs.forEach(r=>off?nd.delete(r.id):nd.add(r.id));S.nodish=[...nd];markDirty();rerenderBody();
    if(!off)toast('Больше не предложим: '+rs.length+' '+plural(rs.length,'блюдо','блюда','блюд'),'sparkles')},
  nodishR:a=>{const id=a.dataset.v,was=(S.nodish||[]).includes(id);S.nodish=toggleIn(S.nodish||[],id);markDirty();
    if(!was){closeSheet();if(S.plan&&S.tab!=='profile')generate(false);render(true);toast('Больше не предложим «'+RID[id].n+'»','sparkles')}else{sheetRecipe(id);render(true)}},
  addMember:()=>{S.family.push({name:'',sex:'f',age:30,weight:62,height:165,act:1.375,goal:'keep'});markDirty();rerenderBody();
    const ins=document.querySelectorAll('[data-k=name]');ins[ins.length-1]?.focus()},
  /* удаление человека — только после подтверждения; последнего удалить нельзя */
  delMember:a=>{const i=+a.dataset.v,m=S.family[i];if(!m)return;
    if(S.family.length<2){toast('В семье должен остаться хотя бы один человек','gear');return}
    openSheet(`<div class="shead"><h2 class="lt" style="font-size:24px">${m.name&&m.name.trim()?'Удалить '+esc(m.name)+'?':'Удалить этого человека?'}</h2><button class="rb" data-act="closeSheet" aria-label="Закрыть">${I.x}</button></div>
    <p class="note" style="margin-bottom:14px">Порции и меню пересчитаем на ${S.family.length-1} ${plural(S.family.length-1,'человека','человек','человек')}. Вернуть можно, добавив человека заново.</p>
    <button class="btn tap" style="background:var(--red);color:#fff" data-act="delMemberOk" data-v="${i}">Удалить</button>
    <button class="btn soft tap" style="margin-top:8px" data-act="closeSheet">Отмена</button>`)},
  delMemberOk:a=>{if(S.family.length<2)return;S.family.splice(+a.dataset.v,1);S.member=0;markDirty();closeSheet();rerenderBody()},
  panAdd:()=>{const id=$('#panP').value;let v=+$('#panA').value;if(!Number.isFinite(v)||v<=0){$('#panA').focus();return}if(id==='yaytsa')v*=EGG;S.pantry[id]=(S.pantry[id]||0)+v;(S.pantryAt||={})[id]=new Date().setHours(0,0,0,0);markDirty();rerenderBody()},
  panDel:a=>{delete S.pantry[a.dataset.v];delete S.pantryAt?.[a.dataset.v];markDirty();rerenderBody()},
  prices:()=>sheetPrices(),
  resetPrices:()=>{if(confirm('Удалить все цены, которые вы вписали вручную?')){S.prices={};markDirty();sheetPrices();render(true)}},
  exportPrices:()=>{const out={};Object.keys(PROD).forEach(pid=>{out[pid]={};SK.forEach(s=>{const p=price(pid,s);if(p!=null)out[pid][s]=p})});
    const blob=new Blob([JSON.stringify({city:S.city,updated:new Date().toISOString().slice(0,10),prices:out},null,1)],{type:'application/json'});
    const l=document.createElement('a');l.href=URL.createObjectURL(blob);l.download='prices.json';l.click();URL.revokeObjectURL(l.href)},
  importPrices:()=>$('#priceFile').click(),
  pasteOpen:async()=>{const box=$('#pasteBox');box.style.display='block';try{const t=await navigator.clipboard.readText();if(t&&t.includes('"prices"'))$('#pasteTxt').value=t}catch(e){}$('#pasteTxt').focus()},
  pasteApply:()=>{const t=$('#pasteTxt').value.trim();if(!t){toast('Вставьте текст из закладки','gear');return}try{applyPrices(JSON.parse(t))}catch(e){toast('Это не похоже на цены из закладки','gear')}},
  wizard:()=>{WIZ=0;WPV=false;closeSheet();transition(render,'fwd')},
  start:()=>{S.onb=true;save();WIZ=0;transition(render,'fwd')},
  wizBack:()=>transition(()=>{if(WPV){WPV=false;render();$('.wiz').scrollTop=0;return}if(WIZ>0){WIZ--;render();$('.wiz').scrollTop=0}else{WIZ=null;if(!S.plan)S.onb=false;save();render()}},'back'),
  wizNext:()=>{
    if(WIZ===0&&!S.family.length){toast('Добавьте хотя бы одного человека','smiling_face');return}
    if(WIZ===0)S.family.forEach((m,i)=>{if(!m.name.trim())m.name=i?'Человек '+(i+1):'Я'});
    if(WIZ===2){if(generate(false))transition(()=>{WPV=true;render();$('.wiz').scrollTop=0},'fwd');return}
    if(WIZ===3&&!activeStores().length){toast('Включите хотя бы один магазин','shopping_cart');return}
    if(WIZ<WSTEPS.length-1){transition(()=>{WIZ++;render();$('.wiz').scrollTop=0},'fwd');return}
    if(generate(false)){transition(()=>{WIZ=null;S.onb=true;S.tab='home';save();render();scrollTo(0,0)},'fade');toast('Готово! Меню и корзина собраны','sparkles')}},
  wizMore:()=>transition(()=>{WPV=false;WIZ=3;render();$('.wiz').scrollTop=0},'fwd'),
  /* закончить мастер сейчас: меню пересобираем, только если на шагах что-то поменяли */
  wizDone:()=>{if(WIZ===3&&!WPV&&!activeStores().length){toast('Включите хотя бы один магазин','shopping_cart');return}
    if((!S.plan||S.dirty)&&!generate(false))return;
    transition(()=>{WIZ=null;WPV=false;S.onb=true;S.tab='home';save();render();scrollTo(0,0)},'fade');toast('Готово! Меню и корзина собраны','sparkles')},
  reset:()=>{if(confirm('Удалить все данные приложения и начать заново?')){localStorage.removeItem(KEY);location.reload()}}
};
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]');if(!a)return;
  if(a.type==='checkbox'||a.tagName==='LABEL')return; // переключатели обрабатываются в change
  const k=a.dataset.act;
  if(k.startsWith('sex:')){S.family[+k.slice(4)].sex=a.dataset.v;markDirty();rerenderBody();return}
  A[k]?.(a,e);
});
document.addEventListener('change',e=>{const a=e.target;if(a.type==='checkbox'&&a.dataset.act)A[a.dataset.act]?.(a,e)});
document.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&e.target.matches?.('.atec[data-act]')){e.preventDefault();A.ate(e.target,e);return}
  if(e.key==='Escape'&&$('.sheet'))closeSheet();if(e.key==='Enter'&&e.target.id==='paidIn')$('[data-act="paidSave"]')?.click()});

/* ------------------------------ старт ------------------------------ */
syncToday();
/* норма посчитана по-новому (обновили формулу или вписали свою) — меню собрано под старую: предлагаем пересобрать */
if(S.plan&&!S.dirty){const sig=a=>JSON.stringify((a||[]).map(t=>t&&[t.kcal,t.p,t.f,t.c]));
  if(sig(S.plan.targets)!==sig(S.family.map(target))){S.dirty=true;save()}}
addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.plan&&S.dayAt!==new Date().toDateString()){syncToday();if(WIZ==null&&S.onb)render(true)}});
let feedLoading=false;
async function refreshPrices(){
  if(feedLoading)return;
  feedLoading=true;
  try{
    const response=await fetch('prices.json',{cache:'no-store'});
    if(!response.ok)return;
    const j=await response.json();
    if(!j?.prices||JSON.stringify(j)===JSON.stringify(FEED))return;
    FEED=j;SH=null;
    if(WIZ==null&&S.onb)render(true);
  }catch(e){}finally{feedLoading=false}
}
addEventListener('focus',refreshPrices);
addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshPrices()});
setInterval(()=>{if(document.visibilityState==='visible')refreshPrices()},60000);
refreshPrices();
render();
