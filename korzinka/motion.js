/* Плавность интерфейса.
   1) morph — вместо полной перерисовки экрана меняем только то, что изменилось: кнопки, переключатели и галочки
      остаются теми же элементами, поэтому их CSS-переходы (цвет, сдвиг, масштаб) успевают проиграться.
   2) Раскрывающиеся блоки (<details>) открываются и закрываются по высоте, а не рывком.
   3) Длинные списки показывают первые пункты и кнопку «Показать все»; раскрытие плавное, состояние запоминается.
   4) Переход между вкладками и шагами настройки — через View Transitions (где браузер умеет), иначе как раньше. */
const CALM=matchMedia('(prefers-reduced-motion: reduce)');
const EASE='cubic-bezier(.2,0,0,1)';

/* ---------- 1. точечное обновление DOM ---------- */
function morph(live,html){
  const t=document.createElement(live.tagName==='TBODY'?'table':'div');t.innerHTML=html;
  morphKids(live,t);
}
function morphKids(a,b){
  const an=[...a.childNodes],bn=[...b.childNodes];
  bn.forEach((y,i)=>{if(i<an.length)patch(an[i],y);else a.appendChild(y)});
  for(let i=bn.length;i<an.length;i++)an[i].remove();
}
function patch(x,y){
  if(x.nodeType!==y.nodeType||x.nodeName!==y.nodeName||(x.nodeType===1&&(x.dataset.v!==y.dataset.v||x.dataset.act!==y.dataset.act))){x.replaceWith(y);return}
  if(x.nodeType!==1){if(x.nodeValue!==y.nodeValue)x.nodeValue=y.nodeValue;return}
  const tag=x.tagName;
  for(const{name,value}of y.attributes)if(x.getAttribute(name)!==value)x.setAttribute(name,value);
  for(const{name}of[...x.attributes])if(!y.hasAttribute(name)&&!(tag==='DETAILS'&&name==='open'))x.removeAttribute(name);
  if(tag==='INPUT'||tag==='TEXTAREA'){
    if(document.activeElement!==x&&x.value!==y.value)x.value=y.value;
    if(x.checked!==y.checked)x.checked=y.checked;
    return}
  if(x.id==='map'||x.classList.contains('keep'))return; // карту и живые виджеты не трогаем
  if(x.isEqualNode(y))return;
  morphKids(x,y);
  if(tag==='SELECT'){const s=[...y.options].findIndex(o=>o.selected);if(s>=0&&x.selectedIndex!==s)x.selectedIndex=s}
}

/* ---------- 2. плавные <details> ---------- */
const DK={}; // открыт ли блок с data-k (переживает перерисовку)
const dOpen=(k,def)=>k in DK?DK[k]:def;
function heightAnim(el,from,to,done){
  if(CALM.matches){done&&done();return}
  el.style.overflow='hidden';
  const a=el.animate({height:[from+'px',to+'px']},{duration:Math.min(420,240+Math.abs(to-from)*.12),easing:EASE});
  a.onfinish=a.oncancel=()=>{el.style.overflow='';done&&done()};
  return a;
}
function fadeIn(nodes,shift=6){
  if(CALM.matches)return;
  nodes.forEach((n,i)=>n.animate({opacity:[0,1],transform:[`translateY(${shift}px)`,'none']},{duration:260,delay:Math.min(i,8)*18,easing:EASE,fill:'backwards'}));
}
document.addEventListener('click',e=>{
  const sm=e.target.closest('summary');if(!sm)return;
  const d=sm.parentElement;if(d.tagName!=='DETAILS'||d._busy)return;
  e.preventDefault();
  const h0=d.offsetHeight,opening=!d.open;d._busy=true;
  if(d.dataset.k)DK[d.dataset.k]=opening;
  if(opening){
    d.open=true;const h1=d.offsetHeight;
    fadeIn([...d.children].filter(c=>c!==sm));
    heightAnim(d,h0,h1,()=>{d._busy=false;d.dispatchEvent(new Event('opened'))});
  }else{
    const h1=sm.offsetHeight+(parseFloat(getComputedStyle(d).paddingTop)||0)+(parseFloat(getComputedStyle(d).paddingBottom)||0);
    heightAnim(d,h0,h1,()=>{d.open=false;d._busy=false});
  }
});
document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.k)DK[d.dataset.k]=d.open},true);

/* ---------- 3. длинные списки ---------- */
const EXP=new Set();
/* data-clamp="N" — показать N пунктов (плюс выбранные .on), остальное под кнопкой.
   Автоматически: .list длиннее 7 строк (список покупок не режем — магазин и так сворачивается). data-ck — ключ для запоминания. */
function clampAll(root){
  root.querySelectorAll('.list:not([data-noclamp])').forEach(el=>{if(!el.dataset.clamp&&el.children.length>7)el.dataset.clamp=5});
  let n=0;
  root.querySelectorAll('[data-clamp]').forEach(el=>{
    const key=el.dataset.ck||(S.tab+':'+(n++));el.dataset.ck=key;
    el.querySelectorAll(':scope>.more').forEach(b=>b.remove());
    const kids=[...el.children],lim=+el.dataset.clamp;
    const hide=kids.filter((c,i)=>i>=lim&&!c.classList.contains('on'));
    if(hide.length<2){kids.forEach(c=>c.classList.remove('cx'));return}
    const open=EXP.has(key);
    kids.forEach(c=>c.classList.toggle('cx',!open&&hide.includes(c)));
    const b=document.createElement('button');b.type='button';b.className='more tap';b.dataset.more=key;
    b.innerHTML=open?`Свернуть <span class="chev up">${I.chev}</span>`:`Показать все · ещё ${hide.length} <span class="chev">${I.chev}</span>`;
    el.appendChild(b);
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-more]');if(!b)return;
  e.stopPropagation();
  const el=b.parentElement,key=b.dataset.more,h0=el.offsetHeight;
  if(!EXP.has(key)){
    EXP.add(key);const was=[...el.querySelectorAll(':scope>.cx')];clampAll(el.parentElement);
    heightAnim(el,h0,el.offsetHeight);fadeIn(was.slice(0,24));
  }else{
    EXP.delete(key);const top=el.getBoundingClientRect().top;clampAll(el.parentElement);const h1=el.offsetHeight;
    heightAnim(el,h0,h1);
    if(top<0)scrollBy({top:top-90,behavior:CALM.matches?'auto':'smooth'}); // вернуть начало списка в поле зрения
  }
},true);

/* ---------- 4. переходы экранов ---------- */
/* Важно: экран обязан смениться, даже если браузер пропустит анимацию (вкладка в фоне, быстрые нажатия,
   старый браузер). Поэтому fn выполняется ровно один раз при любом исходе. */
let VT=null;
function transition(fn,dir){
  let ran=false;const run=()=>{if(ran)return;ran=true;fn()};
  if(CALM.matches||!document.startViewTransition||document.visibilityState!=='visible'){run();return}
  try{VT&&VT.skipTransition()}catch(e){}
  document.documentElement.dataset.vt=dir||'fade';
  let t;
  try{t=document.startViewTransition(run)}catch(e){run();return}
  VT=t;
  t.updateCallbackDone.catch(()=>{}).finally(run);           // пропущена — всё равно переключаем
  t.finished.catch(()=>{}).finally(()=>{if(VT===t){VT=null;delete document.documentElement.dataset.vt}});
  t.ready.catch(()=>{});
  setTimeout(run,400);                                        // страховка: браузер завис с анимацией
}

/* закрытие шторки: фон гаснет, панель уезжает вниз */
function sheetOut(done){
  const sh=$('#layer .sheet');if(!sh||CALM.matches){done();return}
  if(sh._out)return;sh._out=true;
  const p=sh.querySelector('.pnl');
  sh.animate({opacity:[1,0]},{duration:260,easing:EASE,fill:'forwards'});
  const from=getComputedStyle(p).transform;const a=p.animate({transform:[from==='none'?'none':from,'translateY(100%)']},{duration:300,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  a.onfinish=done;
}

/* смена дня: блюда уезжают в сторону, новые въезжают с той стороны, куда листаем */
let DSEQ=0;
function daySwap(dir){
  const old=[...document.querySelectorAll('.dayx')],seq=++DSEQ;
  if(CALM.matches||!old.length){render(true);return}
  const outs=old.map(el=>el.animate({opacity:[1,0],transform:['none',`translateX(${-dir*20}px)`]},{duration:140,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}));
  Promise.all(outs.map(a=>a.finished)).catch(()=>{}).then(()=>{
    if(seq!==DSEQ)return; // успели нажать другой день — рисует последний
    outs.forEach(a=>a.cancel());render(true);
    document.querySelectorAll('.dayx').forEach(el=>el.animate({opacity:[0,1],transform:[`translateX(${dir*20}px)`,'none']},{duration:300,easing:EASE}));
  });
}

/* шторка закрывается свайпом вниз (как на iPhone): тянем, пока содержимое прокручено до верха */
(function(){
  let p=null,y0=0,dy=0,t0=0;
  document.addEventListener('touchstart',e=>{
    const pn=e.target.closest('.sheet .pnl');if(!pn||pn.scrollTop>0||e.touches.length>1)return;
    p=pn;y0=e.touches[0].clientY;dy=0;t0=Date.now();
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!p)return;dy=e.touches[0].clientY-y0;
    if(dy<=0||p.scrollTop>0){p.style.transform='';if(dy<0)p=null;return}
    e.preventDefault();p.style.transition='none';p.style.transform=`translateY(${dy}px)`;
    p.parentElement.style.opacity=String(Math.max(.4,1-dy/600));
  },{passive:false});
  document.addEventListener('touchend',()=>{
    if(!p)return;const pn=p;p=null;const fast=dy>60&&Date.now()-t0<250;
    if(dy>120||fast){pn.style.transition='';closeSheet();return}
    pn.style.transition='transform .3s cubic-bezier(.2,0,0,1)';pn.style.transform='';pn.parentElement.style.opacity='';
    setTimeout(()=>{pn.style.transition=''},320);
  });
})();

/* ---------- 5. после каждой отрисовки: цифры, переключатели, картинки ---------- */
let RENDER_AT=0;
const CNT={};               // последнее показанное значение счётчика по ключу
const easeOut=x=>1-Math.pow(1-x,3);
/* <span class="cn" data-ck="ключ" data-n="число"> — число плавно «докручивается» от прошлого значения */
function countUp(root){
  root.querySelectorAll('.cn[data-ck]').forEach(el=>{
    const k=el.dataset.ck,to=+el.dataset.n,fin=el.textContent,from=CNT[k];
    if(el._raf){cancelAnimationFrame(el._raf);el._raf=0}
    CNT[k]=to;
    if(from==null||from===to||!isFinite(from)||CALM.matches)return;
    const t0=performance.now(),dur=Math.min(900,420+Math.abs(to-from)/Math.max(1,Math.abs(to))*900);
    const step=now=>{const p=Math.min(1,(now-t0)/dur),v=from+(to-from)*easeOut(p);
      if(p<1){el.textContent=Math.round(v).toLocaleString('ru-RU');el._cur=v;el._raf=requestAnimationFrame(step)}
      else{el.textContent=fin;el._raf=0}};
    el._raf=requestAnimationFrame(step);
  });
}
/* сегменты (1 магазин / 2 магазина …): тёмная плашка переезжает к выбранной кнопке */
let SEGW=null;
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest('.seg button');if(!b||b.classList.contains('on'))return;
  const sg=b.parentElement,on=sg.querySelector('button.on');if(!on)return;
  SEGW={act:b.dataset.act,r:on.getBoundingClientRect(),t:performance.now()};
},true);
function segSlide(){
  if(!SEGW||performance.now()-SEGW.t>1500||CALM.matches){SEGW=null;return}
  const w=SEGW;SEGW=null;
  const b=document.querySelector(`.seg button.on[data-act="${w.act}"]`);if(!b)return;
  const sg=b.parentElement,r1=b.getBoundingClientRect(),rs=sg.getBoundingClientRect();
  if(Math.abs(r1.left-w.r.left)<2)return;
  sg.querySelectorAll('.sgi').forEach(x=>x.remove());
  const g=document.createElement('i');g.className='sgi';
  Object.assign(g.style,{left:(r1.left-rs.left)+'px',top:(r1.top-rs.top)+'px',width:r1.width+'px',height:r1.height+'px'});
  sg.classList.add('sliding');sg.prepend(g);
  const a=g.animate({transform:[`translateX(${w.r.left-r1.left}px) scaleX(${w.r.width/r1.width})`,'none']},{duration:420,easing:'cubic-bezier(.32,.72,0,1)'});
  a.onfinish=a.oncancel=()=>{g.remove();sg.classList.remove('sliding')};
}
/* картинки, догрузившиеся позже отрисовки (прокрутка, медленная сеть), проявляются, а не «выпрыгивают» */
document.addEventListener('load',e=>{
  const im=e.target;if(im.tagName!=='IMG'||CALM.matches||performance.now()-RENDER_AT<120)return;
  im.animate({opacity:[0,1]},{duration:380,easing:EASE});
},true);
function afterRender(root){RENDER_AT=performance.now();countUp(root||document);segSlide()}

/* ---------- 6. всплывающая подсказка уходит плавно ---------- */
function toastOut(el){
  if(CALM.matches||!el.isConnected){el.remove();return}
  const a=el.animate({opacity:[1,0],transform:['none','translateY(-10px) scale(.96)']},{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  a.onfinish=()=>el.remove();
}
