/* Zdieľňa – service worker (úloha 12): aplikácia funguje aj bez internetu.
   Pri novej verzii zmeňte CACHE – stará cache sa zmaže. Funguje iba cez http(s). */
const CACHE='zdielna-v5';
const ASSETS=['./','./index.html','./manifest.webmanifest',
  './css/tokens.css','./css/app.css','./css/landing.css',
  './js/core.js','./js/engine.js','./js/ui.js','./js/views-app.js','./js/views-public.js','./js/views-map.js','./js/views-ideas.js','./js/badges.js','./js/notify.js','./js/chat.js','./js/main.js',
  './assets/zse.png','./assets/vse.png','./assets/zdielna.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png'];
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
