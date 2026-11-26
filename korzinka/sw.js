/* Корзинка без интернета. Файл собирается скриптом parser/build_sw.py — руками не править. */
const VER='k-ba251d6536',CORE=["./", "index.html", "app.js", "data.js", "config.js", "geo.js", "motion.js", "prices.json", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "img2/ui/bags.webp", "img2/ui/calendar.webp", "img2/ui/cart.webp", "img2/ui/coin.webp", "img2/ui/family.webp", "img2/ui/gem.webp", "img2/ui/heart.webp", "img2/ui/house.webp", "img2/ui/middle.webp", "img2/ui/money.webp", "img2/ui/plate.webp", "img2/store/azbuka.webp", "img2/store/chizhik.webp", "img2/store/dixy.webp", "img2/store/lavka.webp", "img2/store/magnit.webp", "img2/store/ozon.webp", "img2/store/perek.webp", "img2/store/pyat.webp", "img2/store/samokat.webp", "img2/store/svetofor.webp", "img2/store/vkusvill.webp", "img2/prod/banany.webp", "img2/prod/chechevitsa.webp", "img2/prod/chesnok.webp", "img2/prod/farsh.webp", "img2/prod/farsh_kur.webp", "img2/prod/fasol.webp", "img2/prod/goroh.webp", "img2/prod/goroshek.webp", "img2/prod/govyadina.webp", "img2/prod/grechka.webp", "img2/prod/hek.webp", "img2/prod/hleb.webp", "img2/prod/hleb_r.webp", "img2/prod/kabachok.webp", "img2/prod/kapusta.webp", "img2/prod/kartofel.webp", "img2/prod/kefir.webp", "img2/prod/kurica_bedro.webp", "img2/prod/kurica_file.webp", "img2/prod/luk.webp", "img2/prod/makarony.webp", "img2/prod/manka.webp", "img2/prod/maslo_podsoln.webp", "img2/prod/maslo_sliv.webp", "img2/prod/mintay.webp", "img2/prod/moloko.webp", "img2/prod/morkov.webp", "img2/prod/muka.webp", "img2/prod/ogurcy.webp", "img2/prod/ogurcy_sol.webp", "img2/prod/ovoshi_smes.webp", "img2/prod/ovsyanka.webp", "img2/prod/pechen.webp", "img2/prod/pelmeni.webp", "img2/prod/perec.webp", "img2/prod/perlovka.webp", "img2/prod/pomidory.webp", "img2/prod/psheno.webp", "img2/prod/ris.webp", "img2/prod/sahar.webp", "img2/prod/smetana.webp", "img2/prod/sol.webp", "img2/prod/sosiski.webp", "img2/prod/svekla.webp", "img2/prod/svinina.webp", "img2/prod/syr.webp", "img2/prod/tomatnaya_pasta.webp", "img2/prod/tunets.webp", "img2/prod/tvorog.webp", "img2/prod/yabloki.webp", "img2/prod/yaytsa.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER&&k!=='k-media').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(name,req,res)=>{if(res&&(res.ok||res.type==='opaque')){const cl=res.clone();caches.open(name).then(c=>c.put(req,cl))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  const same=u.origin===location.origin;
  /* картинки блюд и значки — из кэша, при первом показе запоминаем */
  if(same&&/\.(jpg|jpeg|png|webp)$/.test(u.pathname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(u.pathname.includes('/dish/')||u.pathname.startsWith('/img/')?'k-media':VER,r,res))));return}
  /* страница, код и цены — сначала сеть (чтобы видеть обновления), без сети — сохранённое */
  if(same){e.respondWith(fetch(r).then(res=>put(VER,r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return}
  /* шрифт Google — сохраняем, чтобы без сети буквы были те же */
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put('k-media',r,res))))}
});
