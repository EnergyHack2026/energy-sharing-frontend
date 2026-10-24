'use strict';
/* ---------- iWatt: zbierate v hre a za aktivity, meníte za zľavy u partnerov a v e-shope dodávateľa ----------
   iWatt nie sú peniaze – dajú sa vymeniť iba za zľavy a výhody (rovnaký princíp ako slnečné body). Ponuky sú ukážkové. */
/* úrovne hry: [min. slniečok, odmena v iWatt]; odmenu za každú úroveň si vyzdvihnete raz za deň */
/* úrovne hry: [min. slniečok, odmena]; z hry spolu najviac IW_DAY denne (vyššia úroveň doplní rozdiel) */
/* hodnota: 1 000 iWatt ≈ 2 € (podľa cien v e-shope) → odmeny malé voči reálnej úspore, aby sa nehralo len kvôli iWatt */
const IW_LV=[[5,5],[15,10],[30,15]],IW_DAY=15;
const IW_REF=2500,IW_BDG=100;   /* odporúčanie suseda (≈ 5 €), nový odznak */
const iwLevel=n=>IW_LV.reduce((l,[min],i)=>n>=min?i+1:l,0);
const IW_EARN=[['sun','Slnečný deň',`+30 za dokončený deň, +5 za každý rozsvietený dom, najviac 150 ${IWT} denne`],['star','Splnená výzva',`+${fm(CH_IW,0)} ${IWT} po overení elektromerom, najviac ${fm(CH_CAP,0)} denne`],['group','Odporúčanie suseda',`+${fm(IW_REF,0)} ${IWT}, keď začne zdieľať`],['award','Nový odznak',`+${fm(IW_BDG,0)} ${IWT} za každý odznak`]];
const IW_PARTNERS=[
 {id:'p1',ic:'gift',who:'Kaviareň Pri fontáne',where:'Trnava',t:'Káva k zákusku zadarmo',c:4000,img:'assets/partner-kaviaren.jpg',pos:'40% 70%',alt:'Káva a čokoládový zákusok na stolíku v kaviarni'},
 {id:'p2',ic:'market',who:'Pekáreň Klások',where:'Hlohovec',t:'−15 % na celý nákup',c:6000,img:'assets/partner-pekaren.jpg',pos:'50% 50%',alt:'Čerstvý remeselný chlieb v pekárni'},
 {id:'p3',ic:'leaf',who:'Kvetinárstvo Lúka',where:'Piešťany',t:'−10 % na kytice a rastliny',c:5000,img:'assets/partner-kvetinarstvo.jpg',pos:'45% 55%',alt:'Farebné kytice vo vázach v kvetinárstve'},
 {id:'p4',ic:'heart',who:'Bistro U Petra',where:'Trnava',t:'Obedové menu −20 %',c:8000,img:'assets/partner-bistro.jpg',pos:'50% 60%',alt:'Naservírované obedové jedlo na drevenom stole v bistre'}];
const IW_SHOP=()=>[
 {id:'s1',ic:'battery',t:'Mesiac Virtuálnej batérie bez poplatku',d:'Prebytky uložíte na neskôr bez mesačného poplatku.',c:12000,img:'assets/shop-virtualna-bateria.jpg',pos:'30% 60%',alt:'Rodinný dom so solárnymi panelmi na streche'},
 {id:'s3',ic:'plug',t:'Montáž wallboxu so zľavou 50 €',d:'Domáca nabíjacia stanica s inštaláciou.',c:30000,img:'assets/shop-wallbox.jpg',pos:'50% 0%',zoom:'scale(1.1)',org:'60% 0%',alt:'Nástenný wallbox pri rodinnom dome s pripojeným elektromobilom'},
 {id:'s4',ic:'pump',t:'Zľava 50 € na tepelné čerpadlo',d:'Kúrenie a ohrev vody z lacnej elektriny.',c:30000,img:'assets/shop-tepelne-cerpadlo.jpg',pos:'50% 50%',zoom:'scale(1.35)',org:'45% 100%',alt:'Vonkajšia jednotka tepelného čerpadla pri rodinnom dome'},
 {id:'s5',ic:'sun',t:'Zľava 100 € na fotovoltiku',d:'Vlastná výroba – prebytky predáte susedom.',c:40000,img:'assets/shop-fotovoltika.jpg',pos:'50% 50%',alt:'Solárne panely na streche rodinného domu'}];
/* denný stav: got = úrovne vyzdvihnuté dnes, pend = odmeny na vyzdvihnutie neskôr */
/* rekord v Slnečnom behu – pamätá si ho prehliadač pre každého používateľa */
function iwBest(n){const k='zdielna:iwbest:'+regPer();if(n==null){let v=0;try{v=+localStorage.getItem(k)||0}catch(e){}return Math.max(v,(S.iw.bestBy||{})[k]||0)}(S.iw.bestBy||(S.iw.bestBy={}))[k]=n;try{localStorage.setItem(k,String(n))}catch(e){}}
const iwS=()=>{const w=S.iw;if(w.day!==S.day){w.day=S.day;w.got={};w.today=0}w.got=w.got||{};w.pend=w.pend||[];return w};
/* maskot iWattík – svetielkujúca postavička zo sveta polárnej žiary (obrázok v priečinku assets) */
const IW_IMG='assets/iwattik.png';
const IW_BANNER='assets/iwatt-banner.png';   /* banner – polárna žiara s iWattíkom */
const wattik=(cls='')=>`<img class="wattik ${cls}" src="${IW_IMG}" alt="" aria-hidden="true">`;
/* ilustrácie ponúk – kreslené, farby z tokenov (nahraditeľné fotkami produktov) */
const IW_ART={
 p1:'<rect x="96" y="70" width="70" height="56" rx="10" style="fill:var(--card)"/><path d="M166 84h10a12 12 0 0 1 0 24h-10" style="fill:none;stroke:var(--card);stroke-width:7"/><ellipse cx="131" cy="128" rx="58" ry="9" style="fill:var(--line)"/><path d="M114 58c-6-10 6-14 0-24M132 58c-6-10 6-14 0-24M150 58c-6-10 6-14 0-24" style="fill:none;stroke:var(--mut);stroke-width:4;stroke-linecap:round;opacity:.6"/><path d="M200 126l40-40 30 40z" style="fill:var(--yellow-t)"/><path d="M200 126l40-40 30 40" style="fill:none;stroke:var(--orange);stroke-width:4"/><rect x="214" y="104" width="44" height="8" style="fill:var(--sig)"/>',
 p2:'<ellipse cx="130" cy="100" rx="70" ry="30" style="fill:var(--orange)"/><path d="M95 86l14 22M125 80l14 24M155 82l14 22" style="stroke:var(--yellow-t);stroke-width:5;stroke-linecap:round"/><path d="M196 112c0-30 30-46 60-36 22 8 30 30 18 40-10-14-24-14-30-4-8-12-28-12-34 2-6-6-14-4-14-2z" style="fill:var(--yellow)"/><ellipse cx="160" cy="132" rx="110" ry="8" style="fill:var(--line)"/>',
 p3:'<path d="M140 132h40l8-50h-56z" style="fill:var(--blue)"/><path d="M160 82c-4-20-20-30-34-26M160 82c0-24 4-40 12-46M160 82c6-18 22-26 36-22" style="fill:none;stroke:var(--green);stroke-width:4"/><g style="fill:var(--sig)"><circle cx="124" cy="54" r="12"/><circle cx="172" cy="34" r="12"/></g><circle cx="198" cy="58" r="12" style="fill:var(--yellow)"/><circle cx="146" cy="40" r="10" style="fill:var(--purple)"/><ellipse cx="160" cy="134" rx="70" ry="6" style="fill:var(--line)"/>',
 p4:'<circle cx="160" cy="88" r="48" style="fill:var(--card)"/><circle cx="160" cy="88" r="36" style="fill:var(--yellow-t)"/><circle cx="148" cy="80" r="12" style="fill:var(--green)"/><path d="M152 98h28" style="stroke:var(--orange);stroke-width:12;stroke-linecap:round"/><circle cx="172" cy="78" r="7" style="fill:var(--sig)"/><path d="M88 52v74M84 52v20M92 52v20M232 52c10 10 10 30 0 36v38" style="fill:none;stroke:var(--mut);stroke-width:4;stroke-linecap:round"/>',
 s1:'<rect x="104" y="56" width="98" height="56" rx="10" style="fill:var(--card);stroke:var(--green);stroke-width:5"/><rect x="202" y="72" width="10" height="24" rx="3" style="fill:var(--green)"/><rect x="114" y="66" width="56" height="36" rx="5" style="fill:var(--green)"/><path d="M80 120c-16 0-16-24 2-22 2-14 24-16 28-2 14-2 16 18 2 24z" style="fill:var(--card)"/><circle cx="244" cy="44" r="16" style="fill:var(--yellow)"/>',
 s2:'<rect x="62" y="44" width="34" height="84" rx="8" style="fill:var(--card)"/><rect x="70" y="54" width="18" height="14" rx="3" style="fill:var(--green)"/><path d="M96 92c30 0 30 18 56 18" style="fill:none;stroke:var(--ink);stroke-width:4"/><path d="M146 100l14-26h72l20 26v22H146z" style="fill:var(--sig)"/><path d="M168 80h22v16h-34zM198 80h26l12 16h-38z" style="fill:var(--blue-t)"/><circle cx="170" cy="124" r="11" style="fill:var(--ink)"/><circle cx="230" cy="124" r="11" style="fill:var(--ink)"/>',
 s3:'<rect x="70" y="20" width="180" height="120" style="fill:var(--card)"/><rect x="138" y="46" width="44" height="58" rx="10" style="fill:var(--surface-dark)"/><circle cx="160" cy="66" r="7" style="fill:var(--accent-dark)"/><path d="M160 104c0 30-40 10-40 34" style="fill:none;stroke:var(--ink);stroke-width:5"/><path d="M150 84l8-10h-6l6-8" style="fill:none;stroke:var(--yellow);stroke-width:3"/>',
 s4:'<rect x="96" y="58" width="130" height="70" rx="8" style="fill:var(--card);stroke:var(--line-2);stroke-width:3"/><circle cx="140" cy="93" r="26" style="fill:var(--bg);stroke:var(--mut);stroke-width:3"/><path d="M140 93l0-20M140 93l18 10M140 93l-18 10" style="stroke:var(--mut);stroke-width:5;stroke-linecap:round"/><path d="M182 74h30M182 86h30M182 98h30M182 110h30" style="stroke:var(--line-2);stroke-width:3"/><path d="M236 64c8-8 8-16 0-24M248 64c8-8 8-16 0-24" style="fill:none;stroke:var(--sig);stroke-width:4;stroke-linecap:round"/>',
 s5:'<path d="M60 132V84l70-44 70 44v48z" style="fill:var(--card)"/><path d="M48 90l82-58 82 58" style="fill:none;stroke:var(--surface-dark);stroke-width:8"/><path d="M92 72l38-26 38 26-38 0z" style="fill:var(--blue)"/><path d="M111 59h38M101 66h58M130 46v26" style="stroke:var(--blue-t);stroke-width:2"/><circle cx="246" cy="44" r="20" style="fill:var(--yellow)"/><path d="M246 14v-8M246 82v-8M216 44h-8M284 44h-8" style="stroke:var(--yellow);stroke-width:4;stroke-linecap:round"/>'};
const iwArt=id=>`<div class="iw-art"><svg viewBox="0 0 320 160" aria-hidden="true">${IW_ART[id]||''}</svg></div>`;
const iwSun=`<svg class="iw-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6" style="fill:var(--yellow)"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4M4.2 4.2l2.8 2.8m10 10 2.8 2.8M4.2 19.8 7 17m10-10 2.8-2.8" style="stroke:var(--yellow);stroke-width:2;stroke-linecap:round"/></svg>`;
function vIwatt(){
  const w=iwS();
  const offer=(o,brand)=>{const code=w.red[o.id],can=w.bal>=o.c;
    return `<article class="iw-card">${o.img?`<div class="iw-photo"><img src="${o.img}" alt="${o.alt}" loading="lazy" style="object-position:${o.pos}${o.zoom?`;transform:${o.zoom};transform-origin:${o.org}`:''}"></div>`:`<span class="svc-ic">${icon(o.ic)}</span>`}<div class="iw-card-t"><b>${o.t}</b><span class="xs mut">${brand?o.d:`${o.who} · ${o.where}`}</span></div>
     <div class="iw-card-f"><span class="iw-cost">${iwSun}${fm(o.c,0)} ${IWT}</span>${code?pill('g','Kód '+code):`<button class="btn sm ${can?'pri':''}" data-act="iwbuy:${o.id}" ${can?'':'disabled'}>${can?'Vymeniť':'Chýba '+fm(o.c-w.bal,0)}</button>`}</div></article>`};
  const pend=w.pend.reduce((s,p)=>s+p.amt,0);
  return `<div class="gap"><section class="card iw-hero" style="background-image:url(${IW_BANNER})"><div class="iw-hero-txt"><span class="kicker">Slnečný klub · ${IWT}</span><h1>Zbierajte ${IWT_SIG}. <em>Vymeňte ich za výhody<span class="sig">.</span></em></h1>
    <p class="lead">${IWT} získate v hre, za splnené výzvy aj za odporúčanie. Vymeníte ich za zľavy u partnerov v okolí a za produkty a služby v našom e-shope.</p>
    <div class="iw-hero-row"><button class="btn lg iw-play" data-act="iwplay">Spustiť hru</button><button class="btn lg iw-how" data-act="detail:iwhow">Ako hrať?</button></div></div>
    <p class="iw-bal">Zostatok <b>${fm(w.bal,0)} ${IWT}</b><span aria-hidden="true">·</span>Rekord v behu <b>${iwBest()} ☀</b>${pend?`<span aria-hidden="true">·</span>+${fm(pend,0)} ${IWT} na vyzdvihnutie`:''}</p></section>
   ${pend?`<div class="card iw-pend"><span class="pend-ic">${icon('gift')}</span><div><b>Nevyzdvihnuté odmeny z hry: ${fm(pend,0)} ${IWT}</b><p class="sm mut">${w.pend.map(p=>`úroveň ${p.lv} · ${fm(p.amt,0)} ${IWT}`).join(' · ')}</p></div><button class="btn pri" data-act="iwclaimall">Vyzdvihnúť</button></div>`:''}
   ${chEarnSection(S.persona==='admin'?'peter':S.persona)}
   ${secHead('Míňajte · E-shop '+BR(),`Produkty a služby za ${IWT}.`,'')}
   <div class="iw-grid iw-shop">${IW_SHOP().map(o=>offer(o,true)).join('')}</div>
   ${secHead('Partneri v okolí','Zľavy u susedov.')}
   <div class="iw-grid">${IW_PARTNERS.map(o=>offer(o,false)).join('')}</div>
   ${secHead('Vaše odznaky','Míľniky, ktoré ste dosiahli.',`+${fm(IW_BDG,0)} ${IWT} za každý nový odznak – overený elektromerom.`)}
   <div class="card">${bdgStrip(S.persona==='admin'?'peter':S.persona)}</div>
   </div>`;
}
function iwHowModal(){
  return `<div class="modal-bg" data-act="closemodal"><div class="modal wz-bm" role="dialog" aria-modal="true" aria-labelledby="iwh-h"><div class="row between"><span class="svc-ic">${icon('sun')}</span><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
   <h2 id="iwh-h" style="margin-top:14px">Ako hrať?</h2>
   <ul class="wz-bm-list"><li><b>Cez deň zbierajte slnko.</b> Ťuknite do hry alebo stlačte medzerník – iWattík vyskočí, v skoku ešte raz. Slniečka nabíjajú jeho batériu.</li><li><b>Pozor na prekážky a mraky.</b> Náraz do plota či kríka vezme kus batérie, za mrakom majú slniečka menej energie.</li><li><b>Večer rozsvieťte domy susedov.</b> Skočte k domu – ak máte v batérii dosť energie, dom sa rozsvieti.</li></ul>
   <div class="wz-bm-req"><b>Odmeny</b><p class="sm">+30 ${IWT} za dokončený deň, +5 za každý rozsvietený dom, +40 za celú ulicu. Z hry najviac 150 ${IWT} denne, každý 7. deň v rade +300 navyše. Pripíšu sa hneď po skončení dňa.</p></div>
   <div class="wz-bm-act"><button class="btn" data-act="closemodal">Zavrieť</button><button class="btn pri" data-act="iwplay">Spustiť hru</button></div></div></div>`;
}
/* ---------- hra: nekonečný beh letnou krajinou (canvas vo vlastnej vrstve – prekreslenie aplikácie ju nezruší) ---------- */
let IWG=null;
function iwStart(){
  S.modal=null;render(false);iwClose(true);
  const ov=document.createElement('div');ov.id='iw-ov';ov.className='iw-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Hra Slnečný deň');
  ov.innerHTML=`<div class="iw-frame iw-game"><div class="iw-top"><b>Slnečný deň</b><button class="btn sm" id="iw-x" aria-label="Zavrieť hru">✕</button></div><iframe id="iw-if" title="Hra Slnečný deň"></iframe></div>`;
  document.body.appendChild(ov);
  const f=ov.querySelector('#iw-if');
  try{f.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(GAME_B64),ch=>ch.charCodeAt(0)))}catch(e){f.src='game/slnecny-den.html'}
  f.addEventListener('load',()=>{try{f.contentWindow.focus()}catch(e){}});
  const key=e=>{if(e.code==='Escape')iwClose()};document.addEventListener('keydown',key);IWG={key};
  ov.querySelector('#iw-x').addEventListener('click',()=>iwClose());
}
/* vyzdvihnutie odmien z hry (hneď na konci hry alebo neskôr v záložke iWatt) */
function iwClaim(){const w=iwS();if(!w.pend.length)return 0;const amt=w.pend.reduce((s,p)=>s+p.amt,0);w.bal+=amt;w.today=(w.today||0)+amt;w.pend=[];logEv(`${nm(regPer())}: vyzdvihnuté +${fm(amt,0)} iWatt zo Slnečného behu`);toast(`+${fm(amt,0)} iWatt pripísaných · zostatok ${fm(w.bal,0)} iWatt`);return amt}
function iwClose(silent){
  const ov=document.getElementById('iw-ov');if(IWG){if(IWG.raf)cancelAnimationFrame(IWG.raf);if(IWG.key)document.removeEventListener('keydown',IWG.key);if(IWG.vis)document.removeEventListener('visibilitychange',IWG.vis);IWG=null}
  if(ov)ov.remove();if(!silent)render(false);
}
