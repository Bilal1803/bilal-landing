/* ---------- Адрес дома и магазины рядом ----------
   Карта: Leaflet + плитки OpenStreetMap (для большого трафика — свой сервер плиток или платный провайдер). Подсказки адреса: Photon (komoot), магазины: Overpass API.
   Всё бесплатно и без ключей. Храним только координаты дома, улицу и номер дома (без квартиры) — в localStorage.
   S.home = {lat, lon, label, city}; S.near = {pyat:{d, addr, lat, lon}, ...} — ближайший магазин каждой сети.
   Если в config.js есть ключ Яндекса — карта, подсказки адреса и поиск магазинов идут через Яндекс Карты (API 2.1),
   при любой ошибке Яндекса — тихо возвращаемся к OpenStreetMap. */
const YA=()=>typeof YMAPS_KEY==='string'&&YMAPS_KEY.trim().length>10;
const CHAIN_Q={chizhik:'Чижик',svetofor:'Светофор',pyat:'Пятёрочка',magnit:'Магнит',perek:'Перекрёсток',dixy:'Дикси',vkusvill:'ВкусВилл',azbuka:'Азбука вкуса'};
function loadYmaps(){
  if(window.ymaps&&ymaps.ready)return new Promise(r=>ymaps.ready(r));
  if(loadYmaps.p)return loadYmaps.p;
  return loadYmaps.p=new Promise((ok,no)=>{const s=document.createElement('script');
    s.src=`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(YMAPS_KEY.trim())}&lang=ru_RU`+(typeof YSUGGEST_KEY==='string'&&YSUGGEST_KEY.trim()?`&suggest_apikey=${encodeURIComponent(YSUGGEST_KEY.trim())}`:'');
    s.onload=()=>ymaps.ready(ok);s.onerror=()=>{loadYmaps.p=null;no(new Error('ymaps'))};document.head.appendChild(s)});
}
/* адрес из ответа геокодера Яндекса: улица, дом, город */
function yaProps(g){
  return{street:g.getThoroughfare()||g.properties.get('name'),housenumber:g.getPremiseNumber()||'',
    city:(g.getLocalities()||[])[0]||(g.getAdministrativeAreas()||[])[0]||'',region:(g.getAdministrativeAreas()||[])[0]||''};
}
async function yaSuggest(q){
  await loadYmaps();
  if(typeof YSUGGEST_KEY==='string'&&YSUGGEST_KEY.trim()){
    const items=await ymaps.suggest(q,{results:6});
    return items.map(it=>({title:it.displayName.split(', ').slice(-2).join(', ')||it.displayName,sub:it.displayName.split(', ').slice(0,-2).reverse().join(', '),pick:async()=>{
      const r=await ymaps.geocode(it.value,{results:1}),g=r.geoObjects.get(0);if(!g)throw new Error('geocode');
      const[la,lo]=g.geometry.getCoordinates();return[la,lo,yaProps(g)]}}));
  }
  const r=await ymaps.geocode(q,{results:6}),out=[];
  r.geoObjects.each(g=>{const p=yaProps(g),[la,lo]=g.geometry.getCoordinates();
    out.push({title:[p.street,p.housenumber].filter(Boolean).join(', '),sub:p.city,pick:async()=>[la,lo,p]})});
  return out;
}
/* магазины сетей вокруг дома — поиск организаций Яндекса, по одному запросу на сеть.
   С ключом «API Поиска по организациям» — его HTTP-запрос (точнее и с адресами), иначе — поиск внутри JavaScript API */
async function yaOrgAround(h,dLa,dLo){
  const key=YORG_KEY.trim();
  const res=await Promise.all(OFFLINE.map(id=>fetch(`https://search-maps.yandex.ru/v1/?apikey=${encodeURIComponent(key)}&text=${encodeURIComponent(CHAIN_Q[id])}&type=biz&lang=ru_RU&ll=${h.lon},${h.lat}&spn=${2*dLo},${2*dLa}&rspn=1&results=20`)
    .then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>(j.features||[]).map(f=>{const m=f.properties.CompanyMetaData||{},nm=(m.name||f.properties.name||'').toLowerCase();
      if(!CHAINS[id].test(nm)||/космет|аптек|опт/.test(nm))return null;
      return{lat:f.geometry.coordinates[1],lon:f.geometry.coordinates[0],id,addr:(m.address||'').split(', ').slice(-2).join(', ')}}).filter(Boolean))));
  return res.flat();
}
/* «Демократическая ул., 53/А, Сочи» → «Демократическая ул., 53/А»: улица и дом, без города и района */
function shortAddr(d){const p=d.split(', ');const i=p.findIndex(x=>/\d/.test(x));return(i>0?p.slice(i-1,i+1):p.slice(0,2)).join(', ')}
async function yaStoresAround(h){
  const dLa=NEAR_R/111000,dLo=NEAR_R/(111000*Math.cos(h.lat*Math.PI/180)),bb=[[h.lat-dLa,h.lon-dLo],[h.lat+dLa,h.lon+dLo]];
  if(typeof YORG_KEY==='string'&&YORG_KEY.trim())try{const l=await yaOrgAround(h,dLa,dLo);if(l.length)return l}catch(e){/* ниже — поиск внутри JS API */}
  await loadYmaps();
  const res=await Promise.all(OFFLINE.map(id=>ymaps.search(CHAIN_Q[id],{boundedBy:bb,strictBounds:true,results:20}).then(r=>{const out=[];
    r.geoObjects.each(g=>{const nm=(g.properties.get('name')||'').toLowerCase();
      if(!CHAINS[id].test(nm)||/космет|аптек|опт/.test(nm))return;
      const[la,lo]=g.geometry.getCoordinates();out.push({lat:la,lon:lo,id,addr:shortAddr(g.properties.get('description')||'')})});return out}).catch(()=>[])));
  return res.flat();
}
const NEAR_R=3000;                       // радиус поиска, м
const CHAINS={chizhik:/чижик/,svetofor:/светофор/,pyat:/пят[её]рочка/,magnit:/магнит/,perek:/перекр[её]сток/,dixy:/дикси/,vkusvill:/вкусвилл/,azbuka:/азбука вкуса/};
const OFFLINE=Object.keys(CHAINS);
const LEAF='https://unpkg.com/leaflet@1.9.4/dist/';
const UA_NOTE='tabi/1.0 (family grocery budget app)';
let GMAP=null,GTIMER=null,GBUSY=false,GNEAR=0;

const fmtD=m=>m<1000?Math.round(m/10)*10+' м':(m/1000).toFixed(1).replace('.',',')+' км';
function haversine(a,b,c,d){const R=6371e3,r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
/* подпись адреса из ответа Photon: улица и дом, без квартир и индексов */
function addrLabel(p){const st=[p.street||p.name,p.housenumber].filter(Boolean).join(', ');return [st,p.city||p.town||p.village||p.state].filter(Boolean).join(' · ')}
function cityOf(p){const c=p.city||p.town||p.village||p.state||'';return Object.keys(CITY).find(k=>k!=='Другой город'&&c.includes(k))||'Другой город'}

/* блок для экрана «Где покупаете?» и профиля */
function geoPanel(){
  const h=S.home,near=S.near||{};
  const list=h?OFFLINE.filter(id=>near[id]).sort((a,b)=>near[a].d-near[b].d):[];
  return `<span class="lbl">Ваш адрес</span>
  <div class="addr"><input class="field" id="addrIn" type="text" autocomplete="off" enterkeyhint="search" placeholder="Город, улица и дом, без квартиры" value="${h?esc(h.label):''}">
    <button class="rb tap" data-act="geoLocate" aria-label="Определить по геопозиции" title="Определить по геопозиции">${I.pin}</button>
    <div class="sug" id="addrSug" role="listbox"></div></div>
  ${h?`<button class="pill tap" data-act="clearHome" style="margin-bottom:10px">Убрать адрес</button>
  <div class="map" id="map" aria-label="Карта: дом и магазины рядом"></div>
  <div class="nearl">${GBUSY?'<div class="cap">Ищем магазины рядом…</div>':list.length?`<div class="list">${list.map(id=>`<div class="row">${smark(id)}<span class="rl">${SN(id)}<div>${esc(near[id].addr||'адрес не указан на карте')}</div></span><span class="rv">${fmtD(near[id].d)}</span></div>`).join('')}</div>`
    :S.near==null?'<div class="cap">Поиск магазинов не завершён. Пока используем список сетей города.</div><button class="pill tap" data-act="retryNear">Повторить поиск</button>'
    :`<div class="cap">В радиусе ${fmtD(NEAR_R)} магазинов этих сетей не нашли. Оставим все сети вашего города.</div>`}</div>`
  :`<p class="foot" style="margin:6px 0 14px">Найдём ближайшие магазины и будем считать корзину только по ним. Квартира не нужна, адрес хранится только на этом телефоне.</p>`}`;
}

/* подключить обработчики после отрисовки */
function geoBind(){
  const inp=$('#addrIn'),sug=$('#addrSug');
  if(inp){
    inp.oninput=()=>{clearTimeout(GTIMER);sug.innerHTML='';const q=inp.value.trim();if(q.length<3)return;
      GTIMER=setTimeout(()=>suggest(q),350)};
    inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const f=sug.querySelector('button');if(f)f.click()}};
  }
  /* карту пересоздаём, только если поменялись дом или магазины; в свёрнутом разделе — при раскрытии */
  const m=$('#map');
  if(m){const k=JSON.stringify([S.home,S.near]);
    if(m.offsetParent&&m._mk!==k){m._mk=k;mountMap()}
    const d=m.closest('details');if(d&&!d._mapHook){d._mapHook=1;d.addEventListener('opened',()=>geoBind())}}
}
async function suggest(q){
  const sug=$('#addrSug');if(!sug)return;
  if(YA())try{
    const items=await yaSuggest(q);if(sug!==$('#addrSug')||$('#addrIn')?.value.trim()!==q)return;
    sug.innerHTML=items.length?items.map((it,i)=>`<button type="button" class="tap" data-i="${i}"><b>${esc(it.title)}</b><span>${esc(it.sub)}</span></button>`).join('')
      :'<div class="none">Не нашли. Попробуйте «Город, улица, дом».</div>';
    sug.querySelectorAll('button').forEach(b=>b.onclick=async()=>{sug.innerHTML='';
      try{const[la,lo,p]=await items[+b.dataset.i].pick();setHome(la,lo,p)}catch(e){toast('Не удалось найти этот адрес на карте','shopping_cart')}});
    return;
  }catch(e){/* Яндекс недоступен — ниже бесплатный поиск */}
  const bias=S.home?`&lat=${S.home.lat}&lon=${S.home.lon}`:'&lat=55.75&lon=37.62';
  try{
    const r=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=12${bias}&lang=default&layer=house&layer=street`);
    const j=await r.json(),seen=new Set();
    /* один дом в OSM бывает несколькими объектами (здание, адрес, организация) — оставляем по одному */
    const fs=(j.features||[]).filter(f=>{const p=f.properties;if(p.countrycode!=='RU')return false;
      const k=[p.street||p.name,p.housenumber,p.city||p.town||p.village].join('|');if(seen.has(k))return false;seen.add(k);return true});
    if(sug!==$('#addrSug')||$('#addrIn')?.value.trim()!==q)return;
    sug.innerHTML=fs.length?fs.map((f,i)=>`<button type="button" class="tap" data-i="${i}"><b>${esc([f.properties.street||f.properties.name,f.properties.housenumber].filter(Boolean).join(', '))}</b><span>${esc([f.properties.city||f.properties.town||f.properties.village,f.properties.state].filter((x,k,a)=>x&&a.indexOf(x)===k).join(', '))}</span></button>`).join('')
      :'<div class="none">Не нашли. Попробуйте «Город, улица, дом».</div>';
    sug.querySelectorAll('button').forEach(b=>b.onclick=()=>{const f=fs[+b.dataset.i];sug.innerHTML='';
      setHome(f.geometry.coordinates[1],f.geometry.coordinates[0],f.properties)});
  }catch(e){sug.innerHTML='<div class="none">Нет связи с поиском адресов. Проверьте интернет.</div>'}
}
async function setHome(lat,lon,props){
  S.home={lat:+lat.toFixed(5),lon:+lon.toFixed(5),label:addrLabel(props),city:cityOf(props),
    town:props.city||props.town||props.village||'',region:props.region||props.state||''};
  S.city=S.home.city;S.near=null;GBUSY=true;markDirty();rerenderBody();
  await findNear();
}
/* ближайший магазин каждой сети в радиусе NEAR_R.
   Основной источник — своя база stores/<квадрат>.json (собирает parser/build_stores.py раз в месяц);
   если базы нет — живой запрос к Overpass (медленно и не всегда отвечает). */
async function storesAround(h){
  const dLa=NEAR_R/111000,dLo=NEAR_R/(111000*Math.cos(h.lat*Math.PI/180)),cells=new Set();
  for(const la of [h.lat-dLa,h.lat+dLa])for(const lo of [h.lon-dLo,h.lon+dLo])cells.add(Math.floor(la*2)+'_'+Math.floor(lo*2));
  const idx=await fetch('stores/index.json').then(r=>r.ok?r.json():null).catch(()=>null);
  if(idx){
    const parts=await Promise.all([...cells].map(c=>fetch(`stores/${c}.json`).then(r=>r.ok?r.json():[]).catch(()=>[])));
    return parts.flat().map(([lat,lon,id,addr])=>({lat,lon,id,addr}));
  }
  const re='Пят[её]рочка|Магнит|Перекр[её]сток|Дикси|ВкусВилл|Азбука вкуса';
  const q=`[out:json][timeout:20];(nwr["shop"]["brand"~"${re}",i](around:${NEAR_R},${h.lat},${h.lon});nwr["shop"]["name"~"${re}",i](around:${NEAR_R},${h.lat},${h.lon}););out center tags;`;
  const ac=new AbortController(),t=setTimeout(()=>ac.abort(),25000);
  try{
    const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',signal:ac.signal,body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'}});
    const j=await r.json();
    return (j.elements||[]).map(e=>{const t=e.tags||{},nm=((t.brand||'')+' '+(t.name||'')).toLowerCase();
      return{lat:e.lat??e.center?.lat,lon:e.lon??e.center?.lon,id:OFFLINE.find(k=>CHAINS[k].test(nm)),addr:[t['addr:street'],t['addr:housenumber']].filter(Boolean).join(', ')}}).filter(x=>x.id&&x.lat!=null);
  }finally{clearTimeout(t)}
}
async function findNear(){
  const home=S.home;if(!home)return;
  const h={...home},request=++GNEAR;GBUSY=true;
  const current=()=>request===GNEAR&&S.home===home&&home.lat===h.lat&&home.lon===h.lon;
  try{
    const near={};
    let list=[];
    if(YA())list=await yaStoresAround(h).catch(()=>[]);
    if(!list.length)list=await storesAround(h);
    list.forEach(x=>{const d=haversine(h.lat,h.lon,x.lat,x.lon);if(d>NEAR_R)return;
      if(!OFFLINE.includes(x.id)||!Number.isFinite(d))return;
      if(!near[x.id]||d<near[x.id].d)near[x.id]={d:Math.round(d),lat:x.lat,lon:x.lon,addr:x.addr}});
    if(!current())return;
    S.near=near;S.nearAt=new Date().toISOString().slice(0,10);
  }catch(e){if(!current())return;S.near=null}
  GBUSY=false;markDirty();rerenderBody();
}
/* геопозиция телефона: только по нажатию кнопки */
function geoLocate(){
  if(!navigator.geolocation){toast('Телефон не даёт геопозицию, введите адрес','shopping_cart');return}
  navigator.geolocation.getCurrentPosition(async p=>{
    const{latitude:la,longitude:lo}=p.coords;
    if(YA())try{await loadYmaps();const r=await ymaps.geocode([la,lo],{results:1,kind:'house'}),g=r.geoObjects.get(0);if(g){setHome(la,lo,yaProps(g));return}}catch(e){}
    try{const r=await fetch(`https://photon.komoot.io/reverse?lat=${la}&lon=${lo}&limit=1&lang=default`),j=await r.json();
      setHome(la,lo,(j.features&&j.features[0]&&j.features[0].properties)||{name:'Моё место'})}
    catch(e){setHome(la,lo,{name:'Моё место'})}
  },()=>toast('Нет доступа к геопозиции, введите адрес','shopping_cart'),{enableHighAccuracy:false,timeout:10000});
}

/* Leaflet грузим только когда карта на экране */
function loadLeaflet(){
  if(window.L)return Promise.resolve();
  if(loadLeaflet.p)return loadLeaflet.p;
  const css=document.createElement('link');css.rel='stylesheet';css.href=LEAF+'leaflet.css';document.head.appendChild(css);
  return loadLeaflet.p=new Promise((ok,no)=>{const s=document.createElement('script');s.src=LEAF+'leaflet.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
}
async function mountYaMap(){
  await loadYmaps();
  const el=$('#map'),h=S.home;if(!el||!h)return;
  if(GMAP&&GMAP.destroy)GMAP.destroy();else if(GMAP&&GMAP.remove)GMAP.remove();GMAP=null;
  GMAP=new ymaps.Map(el,{center:[h.lat,h.lon],zoom:15,controls:[]},{suppressMapOpenBlock:true});
  GMAP.behaviors.disable('scrollZoom');
  const lay=html=>ymaps.templateLayoutFactory.createClass(html);
  const home=new ymaps.Placemark([h.lat,h.lon],{},{draggable:true,iconLayout:lay(`<div class="mk-home ya"><i>${I.home}</i></div>`),iconShape:{type:'Circle',coordinates:[0,0],radius:20}});
  /* дом можно подвинуть пальцем, если поиск поставил точку не туда */
  home.events.add('dragend',()=>{const[la,lo]=home.geometry.getCoordinates();S.home.lat=+la.toFixed(5);S.home.lon=+lo.toFixed(5);S.near=null;GBUSY=true;rerenderBody();findNear()});
  GMAP.geoObjects.add(home);
  const pts=[[h.lat,h.lon]];
  OFFLINE.forEach(id=>{const n=(S.near||{})[id];if(!n)return;pts.push([n.lat,n.lon]);
    GMAP.geoObjects.add(new ymaps.Placemark([n.lat,n.lon],{hintContent:`${SN(id)} · ${fmtD(n.d)}`},
      {iconLayout:lay(`<div class="mk-shop ya"><i style="background:${SC(id)}">${STORE_MARK[id]}</i></div>`),iconShape:{type:'Circle',coordinates:[0,0],radius:15}}))});
  const map=GMAP;
  if(pts.length>1)map.setBounds(ymaps.util.bounds.fromPoints(pts),{checkZoomRange:true,zoomMargin:34}).then(()=>{if(GMAP===map&&map.getZoom()>16)map.setZoom(16)});
}
async function mountMap(){
  if(YA())try{await mountYaMap();return}catch(e){/* Яндекс не загрузился — бесплатная карта */}
  try{await loadLeaflet()}catch(e){const m=$('#map');if(m)m.innerHTML='<div class="cap" style="padding:16px">Карта не загрузилась</div>';return}
  const el=$('#map'),h=S.home;if(!el||!h)return;
  if(GMAP){GMAP.destroy?GMAP.destroy():GMAP.remove();GMAP=null}
  GMAP=L.map(el,{zoomControl:false,attributionControl:true,scrollWheelZoom:false}).setView([h.lat,h.lon],15);
  GMAP.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
    attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(GMAP);
  const home=L.marker([h.lat,h.lon],{draggable:true,icon:L.divIcon({className:'mk-home',html:`<i>${I.home}</i>`,iconSize:[40,40],iconAnchor:[20,20]})}).addTo(GMAP);
  /* дом можно подвинуть пальцем, если поиск поставил точку не туда */
  home.on('dragend',()=>{const p=home.getLatLng();S.home.lat=+p.lat.toFixed(5);S.home.lon=+p.lng.toFixed(5);S.near=null;GBUSY=true;rerenderBody();findNear()});
  const pts=[[h.lat,h.lon]];
  OFFLINE.forEach(id=>{const n=(S.near||{})[id];if(!n)return;pts.push([n.lat,n.lon]);
    L.marker([n.lat,n.lon],{icon:L.divIcon({className:'mk-shop',html:`<i style="background:${SC(id)}">${STORE_MARK[id]}</i>`,iconSize:[30,30],iconAnchor:[15,15]})})
      .bindTooltip(`${SN(id)} · ${fmtD(n.d)}`,{direction:'top',offset:[0,-14]}).addTo(GMAP)});
  if(pts.length>1)GMAP.fitBounds(pts,{padding:[34,34],maxZoom:16});
}
