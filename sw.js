/* Zdieľňa – service worker (úloha 12): aplikácia funguje aj bez internetu.
   Pri novej verzii zmeňte CACHE – stará cache sa zmaže. Funguje iba cez http(s). */
const CACHE='zdielna-v48';
const ASSETS=['./','./index.html','./manifest.webmanifest',
  './css/tokens.css','./css/app.css','./css/landing.css',
  './js/core.js','./js/engine.js','./js/ui.js','./js/views-app.js','./js/demo-august.js','./js/demo-customers.js','./js/demo-benefits.js','./js/demo-groups.js','./js/demo-profile.js','./js/demo-challenges.js','./js/views-public.js','./js/views-map.js','./js/views-ideas.js','./js/badges.js','./js/notify.js','./js/chat.js','./js/game-data.js','./js/iwatt.js','./js/main.js',
  './assets/zse.png','./assets/vse.png','./assets/zse-logo.svg','./assets/vse-logo.png','./assets/zdielna-dot.svg','./assets/hero-bg.jpg','./assets/iwattik.png','./assets/iwatt-banner.png','./assets/partner-kaviaren.jpg','./assets/partner-pekaren.jpg','./assets/partner-kvetinarstvo.jpg','./assets/partner-bistro.jpg','./assets/shop-virtualna-bateria.jpg','./assets/shop-wallbox.jpg','./assets/shop-tepelne-cerpadlo.jpg','./assets/shop-fotovoltika.jpg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* cache first, potom sieť; Google Fonts sa uložia pri prvom načítaní (offline → systémové písmo) */
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    const u=new URL(r.url);
    if(res.ok&&(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}
    return res;
  }).catch(()=>r.mode==='navigate'?caches.match('./index.html'):Response.error())));
});
