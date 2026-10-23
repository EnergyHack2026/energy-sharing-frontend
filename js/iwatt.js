'use strict';
/* ---------- iWatt: zbierate v hre a za aktivity, meníte za zľavy u partnerov a v e-shope dodávateľa ----------
   iWatt nie sú peniaze – dajú sa vymeniť iba za zľavy a výhody (rovnaký princíp ako slnečné body). Ponuky sú ukážkové. */
/* úrovne hry: [min. slniečok, odmena v iWatt]; odmenu za každú úroveň si vyzdvihnete raz za deň */
/* úrovne hry: [min. slniečok, odmena]; z hry spolu najviac IW_DAY denne (vyššia úroveň doplní rozdiel) */
const IW_LV=[[5,100],[15,200],[30,300]],IW_DAY=300;
const iwLevel=n=>IW_LV.reduce((l,[min],i)=>n>=min?i+1:l,0);
const IW_EARN=[['sun','Slnečný beh',`Úroveň 1 / 2 / 3: ${IW_LV.map(x=>fm(x[1],0)).join(' / ')} ${IWT}, spolu najviac ${IW_DAY} denne`],['star','Splnená výzva',`+1 000 ${IWT} po overení elektromerom`],['group','Odporúčanie suseda',`+5 000 ${IWT}, keď začne zdieľať`],['award','Nový odznak',`+2 000 ${IWT} za každý odznak`]];
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
   ${secHead(`Ako získať ${IWT}`,'Každá aktivita sa ráta.')}
   <div class="iw-earn">${IW_EARN.map(([ic,t,d])=>`<div class="iw-earn-i"><span class="svc-ic">${icon(ic)}</span><div><b>${t}</b><span class="xs mut">${d}</span></div></div>`).join('')}</div>
   ${secHead('E-shop '+BR(),`Produkty a služby za ${IWT}.`,'')}
   <div class="iw-grid iw-shop">${IW_SHOP().map(o=>offer(o,true)).join('')}</div>
   ${secHead('Partneri v okolí','Zľavy u susedov.')}
   <div class="iw-grid">${IW_PARTNERS.map(o=>offer(o,false)).join('')}</div>
   </div>`;
}
function iwHowModal(){
  return `<div class="modal-bg" data-act="closemodal"><div class="modal wz-bm" role="dialog" aria-modal="true" aria-labelledby="iwh-h"><div class="row between"><span class="svc-ic">${icon('sun')}</span><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
   <h2 id="iwh-h" style="margin-top:14px">Ako hrať?</h2>
   <ul class="wz-bm-list"><li><b>Skákanie.</b> Ťuknite kdekoľvek do hry alebo stlačte medzerník – iWattík vyskočí. V skoku môžete skočiť ešte raz.</li><li><b>Prekážky.</b> Preskakujte balíky sena a ploty – náraz hru ukončí. Hra sa postupne zrýchľuje.</li><li><b>Slniečka.</b> Cestou ich zbierajte. Čím viac ich máte, tým vyššiu úroveň a väčšiu odmenu získate.</li></ul>
   <div class="wz-bm-req"><b>Úrovne a odmeny</b><p class="sm">${IW_LV.map(([min,amt],i)=>`Úroveň ${i+1}: ${min}+ slniečok = ${fm(amt,0)} ${IWT}`).join(' · ')}. Z hry získate spolu najviac ${IW_DAY} ${IWT} denne – lepšia úroveň doplní rozdiel. Odmenu si vyzdvihnete hneď alebo neskôr.</p></div>
   <div class="wz-bm-act"><button class="btn" data-act="closemodal">Zavrieť</button><button class="btn pri" data-act="iwplay">Spustiť hru</button></div></div></div>`;
}
/* ---------- hra: nekonečný beh letnou krajinou (canvas vo vlastnej vrstve – prekreslenie aplikácie ju nezruší) ---------- */
let IWG=null;
function iwStart(){
  S.modal=null;render(false);iwClose(true);
  const ov=document.createElement('div');ov.id='iw-ov';ov.className='iw-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Hra Slnečný beh s iWattíkom');
  ov.innerHTML=`<div class="iw-frame"><div class="iw-top"><span class="iw-hud">${iwSun}<b id="iw-n">0</b><span class="xs" id="iw-l">úroveň 0</span></span><span class="xs" id="iw-m">0 m</span><button class="btn sm" id="iw-x" aria-label="Ukončiť hru">✕</button></div><canvas id="iw-c" width="800" height="360"></canvas>
   <div class="iw-msg" id="iw-msg"><b>Ťuknite a bežte!</b><span class="sm">Medzerník alebo ťuknutie = skok · v skoku ešte raz</span></div><div class="iw-end" id="iw-end" hidden></div></div>`;
  document.body.appendChild(ov);
  const cv=ov.querySelector('#iw-c'),cx=cv.getContext('2d'),cs=getComputedStyle(document.documentElement),C=k=>cs.getPropertyValue(k).trim();
  const col={sky:C('--blue-t'),sky2:C('--card'),hill:C('--tint-green'),hill2:C('--green-t'),ground:C('--green'),wheat:C('--yellow-t'),wheat2:C('--yellow'),tree:C('--green'),trunk:C('--yellow-ink'),cloud:C('--card'),sun:C('--yellow'),ink:C('--ink'),card:C('--card'),red:C('--sig'),hay:C('--yellow'),hay2:C('--yellow-ink'),wood:C('--yellow-ink'),flower:[C('--sig'),C('--yellow'),C('--card'),C('--purple')],body:C('--accent-dark'),tuft:C('--aurora-3'),tip:C('--aurora-2'),glow:C('--aurora-1'),roof:C('--surface-dark'),panel:C('--blue')};
  const G={t:0,run:false,over:false,y:0,vy:0,jumps:0,sp:280,dist:0,n:0,obs:[],suns:[],far:[],near:[],clouds:[],flowers:[],nextO:1.4,nextS:.6,last:0,raf:0};IWG=G;
  const GY=300,PX=110,PS=46;G.y=GY-PS/2;
  for(let i=0;i<6;i++)G.far.push({x:i*170,k:Math.random()<.35?'house':'tree',s:.7+Math.random()*.5});
  for(let i=0;i<4;i++)G.clouds.push({x:i*230+60,y:40+Math.random()*60,s:.7+Math.random()*.6});
  for(let i=0;i<40;i++)G.flowers.push({x:Math.random()*820,y:GY+8+Math.random()*44,c:i%4});
  const jump=()=>{if(G.over)return;if(!G.run){G.run=true;ov.querySelector('#iw-msg').hidden=true;G.last=performance.now();loop(G.last);return}if(G.jumps<2){G.vy=-740;G.jumps++}};
  const key=e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump()}if(e.code==='Escape')iwClose()};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();jump()});ov.querySelector('#iw-msg').addEventListener('pointerdown',jump);
  ov.querySelector('#iw-x').addEventListener('click',()=>iwClose());document.addEventListener('keydown',key);G.key=key;
  const vis=()=>{if(document.hidden&&G.run&&!G.over){cancelAnimationFrame(G.raf);G.run=false;const m=ov.querySelector('#iw-msg');m.hidden=false;m.innerHTML='<b>Pauza</b><span class="sm">Ťuknite a pokračujte</span>'}};document.addEventListener('visibilitychange',vis);G.vis=vis;
  const tree=(x,s)=>{cx.fillStyle=col.trunk;cx.fillRect(x-3*s,GY-30*s,6*s,30*s);cx.fillStyle=col.tree;cx.beginPath();cx.arc(x,GY-40*s,20*s,0,7);cx.arc(x-12*s,GY-30*s,14*s,0,7);cx.arc(x+12*s,GY-30*s,14*s,0,7);cx.fill()};
  const house=(x,s)=>{cx.fillStyle=col.card;cx.fillRect(x-24*s,GY-40*s,48*s,40*s);cx.fillStyle=col.roof;cx.beginPath();cx.moveTo(x-30*s,GY-40*s);cx.lineTo(x,GY-64*s);cx.lineTo(x+30*s,GY-40*s);cx.fill();cx.fillStyle=col.panel;cx.save();cx.translate(x+4*s,GY-52*s);cx.rotate(-.65);cx.fillRect(-10*s,-3*s,20*s,6*s);cx.restore()};
  const cloud=(c)=>{cx.fillStyle=col.cloud;cx.beginPath();cx.arc(c.x,c.y,16*c.s,0,7);cx.arc(c.x+18*c.s,c.y-8*c.s,20*c.s,0,7);cx.arc(c.x+38*c.s,c.y,16*c.s,0,7);cx.fill()};
  function draw(){
    const g=cx.createLinearGradient(0,0,0,GY);g.addColorStop(0,col.sky);g.addColorStop(1,col.sky2);cx.fillStyle=g;cx.fillRect(0,0,800,360);
    cx.fillStyle=col.sun;cx.beginPath();cx.arc(680,72,36,0,7);cx.fill();cx.strokeStyle=col.sun;cx.lineWidth=4;for(let a=0;a<12;a++){const an=a*Math.PI/6+G.t*.3;cx.beginPath();cx.moveTo(680+Math.cos(an)*46,72+Math.sin(an)*46);cx.lineTo(680+Math.cos(an)*58,72+Math.sin(an)*58);cx.stroke()}
    for(const c of G.clouds)cloud(c);
    const o1=G.dist*.08%900;cx.fillStyle=col.hill2;cx.beginPath();for(const hx of [0,900])cx.ellipse(hx+200-o1,GY+30,360,110,0,0,7),cx.ellipse(hx+680-o1,GY+30,320,95,0,0,7);cx.fill();
    cx.fillStyle=col.wheat;const o2=G.dist*.2%400;for(let i=-1;i<3;i++)cx.fillRect(i*400-o2+40,GY-14,240,14);
    for(const f of G.far)f.k==='tree'?tree(f.x,f.s):house(f.x,f.s);
    cx.fillStyle=col.ground;cx.fillRect(0,GY,800,60);
    for(const f of G.flowers){cx.fillStyle=col.flower[f.c];cx.beginPath();cx.arc(f.x,f.y,3,0,7);cx.fill()}
    for(const o of G.obs){if(o.k==='hay'){cx.fillStyle=col.hay;cx.beginPath();cx.arc(o.x+o.w/2,GY-o.h/2,o.h/2,0,7);cx.fill();cx.strokeStyle=col.hay2;cx.lineWidth=2;cx.beginPath();cx.arc(o.x+o.w/2,GY-o.h/2,o.h/4,0,7);cx.arc(o.x+o.w/2,GY-o.h/2,o.h/2.6,0,5);cx.stroke()}
      else{cx.fillStyle=col.wood;for(let i=0;i<3;i++){cx.beginPath();cx.roundRect(o.x+i*13,GY-o.h,9,o.h,[4,4,0,0]);cx.fill()}cx.fillRect(o.x-2,GY-o.h*.7,o.w+4,6);cx.fillRect(o.x-2,GY-o.h*.35,o.w+4,6)}}
    for(const s of G.suns){if(s.got)continue;cx.strokeStyle=col.sun;cx.lineWidth=3;for(let a=0;a<8;a++){const an=a*Math.PI/4+G.t*2;cx.beginPath();cx.moveTo(s.x+Math.cos(an)*11,s.y+Math.sin(an)*11);cx.lineTo(s.x+Math.cos(an)*16,s.y+Math.sin(an)*16);cx.stroke()}cx.fillStyle=col.sun;cx.beginPath();cx.arc(s.x,s.y,8,0,7);cx.fill()}
    /* iWattík: tyrkysový svetielkujúci tvor s chocholkou, veľkými očami a svetielkom v ruke */
    const air=G.jumps>0,run=G.run&&!air,b=run?Math.sin(G.t*18)*2:0,cxp=PX+PS/2,cyp=G.y+b,leg=run?Math.sin(G.t*20)*5:2,wv=Math.sin(G.t*6)*3;
    cx.save();cx.translate(cxp,cyp);cx.rotate(air?-.1:0);
    cx.fillStyle=col.body;cx.beginPath();cx.ellipse(-9-leg,PS/2-2,7,5,0,0,7);cx.ellipse(9+leg,PS/2-2,7,5,0,0,7);cx.fill();
    cx.shadowColor=col.glow;cx.shadowBlur=14;
    cx.fillStyle=col.tuft;cx.beginPath();cx.moveTo(-6,-PS/2+6);cx.quadraticCurveTo(-4,-PS/2-22+wv,16,-PS/2-26+wv);cx.quadraticCurveTo(4,-PS/2-12,8,-PS/2+6);cx.fill();
    cx.fillStyle=col.tip;cx.beginPath();cx.arc(15,-PS/2-25+wv,4,0,7);cx.fill();
    cx.fillStyle=col.body;cx.beginPath();cx.ellipse(0,0,PS/2-1,PS/2+1,0,0,7);cx.fill();cx.shadowBlur=0;
    cx.beginPath();cx.ellipse(-PS/2+2,4,5,10,.6,0,7);cx.ellipse(PS/2-2,2,5,10,-.6,0,7);cx.fill();
    cx.fillStyle=col.ink;cx.beginPath();cx.ellipse(-8,-4,5,6.5,0,0,7);cx.ellipse(9,-3,5,6.5,0,0,7);cx.fill();
    cx.fillStyle=col.card;cx.beginPath();cx.arc(-6.5,-6,2,0,7);cx.arc(10.5,-5,2,0,7);cx.fill();
    cx.strokeStyle=col.ink;cx.lineWidth=2;cx.beginPath();cx.arc(1,4,5,.4,2.7);cx.stroke();
    cx.shadowColor=col.sun;cx.shadowBlur=12;cx.fillStyle=col.sun;cx.beginPath();cx.moveTo(1,8);cx.lineTo(4,13);cx.lineTo(1,18);cx.lineTo(-2,13);cx.fill();
    cx.beginPath();cx.arc(-PS/2-6,0,5,0,7);cx.fill();cx.shadowBlur=0;cx.restore();
  }
  function end(){
    G.over=true;G.run=false;cancelAnimationFrame(G.raf);
    const w=iwS(),lv=iwLevel(G.n),today=(w.today||0)+w.pend.reduce((a,p)=>a+p.amt,0),amt=lv?Math.max(0,Math.min(IW_LV[lv-1][1],IW_DAY)-today):0,got=lv&&amt<=0;const rec=G.n>iwBest();if(rec)iwBest(G.n);
    logEv(`${nm(regPer())}: Slnečný beh – ${G.n} slniečok (úroveň ${lv})`);
    const e=ov.querySelector('#iw-end');e.hidden=false;
    const txt=!lv?`Na úroveň 1 potrebujete aspoň ${IW_LV[0][0]} slniečok. Skúste to znova!`
     :got?`Podarilo sa vám dosiahnuť úroveň ${lv}. Dnešný limit odmien z hry (${IW_DAY} ${IWT}) ste už vyčerpali – zajtra môžete získať ďalšie.`
     :`Podarilo sa vám dosiahnuť úroveň ${lv}. Získavate <b>${fm(amt,0)} ${IWT}</b>. Vyzdvihnúť si ich môžete hneď, alebo aj neskôr – je to na vás.`;
    e.innerHTML=`<div class="iw-end-in">${wattik('iw-end-art')}<h2>Vaše skóre: <span class="iw-score">${G.n}</span> ${iwSun}</h2><p class="sm">${rec?'🏆 Nový rekord!':'Váš rekord: '+iwBest()+' slniečok'}</p><p>${txt}</p>${lv&&!got?`<p class="sm iw-end-note">${IW_DAY-today-amt>0?`Lepšou úrovňou dnes ešte získate až ${IW_DAY-today-amt} ${IWT} navyše.`:`Tým ste dosiahli dnešný limit z hry (${IW_DAY} ${IWT}).`}</p>`:''}
     <div class="iw-end-act">${lv&&!got?'<button class="btn lg dark sig-btn" id="iw-claim">Vyzdvihnúť odmenu</button>':''}<button class="btn lg" id="iw-again">Hrať znova</button></div></div>`;
    if(lv&&!got){w.pend.push({lv,amt});   /* odmena čaká – vyzdvihnúť hneď alebo neskôr v záložke ${IWT} */
      e.querySelector('#iw-claim').addEventListener('click',()=>{iwClaim();const b=e.querySelector('#iw-claim');b.disabled=true;b.textContent='Vyzdvihnuté ✓ · zostatok '+fm(iwS().bal,0)+' iWatt'})}
    e.querySelector('#iw-again').addEventListener('click',()=>iwStart());
  }
  function loop(now){
    const dt=Math.max(0,Math.min(.04,(now-G.last)/1000));G.last=now;G.t+=dt;
    G.sp=Math.min(620,280+G.t*9);G.dist+=G.sp*dt;
    G.vy+=2200*dt;G.y+=G.vy*dt;if(G.y>=GY-PS/2){G.y=GY-PS/2;G.vy=0;G.jumps=0}
    for(const f of G.far){f.x-=G.sp*.35*dt;if(f.x<-80){f.x+=1020;f.k=Math.random()<.35?'house':'tree';f.s=.7+Math.random()*.5}}
    for(const c of G.clouds){c.x-=G.sp*.06*dt;if(c.x<-100)c.x+=950}
    for(const f of G.flowers){f.x-=G.sp*dt;if(f.x<-5)f.x+=820}
    G.nextO-=dt;if(G.nextO<=0){const fence=Math.random()<.35;G.obs.push(fence?{k:'fence',x:820,w:35,h:58}:{k:'hay',x:820,w:42,h:42});G.nextO=Math.max(.75,1.6-G.t*.012)+Math.random()*.7}
    G.nextS-=dt;if(G.nextS<=0){const n=3+Math.floor(Math.random()*3),hi=Math.random()<.5,base=hi?150:236;for(let i=0;i<n;i++)G.suns.push({x:830+i*34,y:base-(hi?Math.sin(i/(n-1)*Math.PI)*40:0)});G.nextS=1.1+Math.random()*1.2}
    for(const o of G.obs)o.x-=G.sp*dt;G.obs=G.obs.filter(o=>o.x>-60);
    for(const s of G.suns)s.x-=G.sp*dt;G.suns=G.suns.filter(s=>s.x>-30);
    const pl={x:PX+4,y:G.y-PS/2+4,w:PS-8,h:PS-4};
    for(const s of G.suns)if(!s.got&&s.x>pl.x-10&&s.x<pl.x+pl.w+10&&s.y>pl.y-10&&s.y<pl.y+pl.h+10){s.got=true;G.n++;ov.querySelector('#iw-n').textContent=G.n;ov.querySelector('#iw-l').textContent='úroveň '+iwLevel(G.n)}
    ov.querySelector('#iw-m').textContent=fm(G.dist/40,0)+' m';
    for(const o of G.obs){const hit=o.k==='hay'?(Math.hypot(Math.max(o.x,Math.min(pl.x+pl.w/2,o.x+o.w))-(o.x+o.w/2),0)<o.w/2&&pl.y+pl.h>GY-o.h+6&&pl.x<o.x+o.w-4&&pl.x+pl.w>o.x+4):(pl.x<o.x+o.w-4&&pl.x+pl.w>o.x+4&&pl.y+pl.h>GY-o.h+4);if(hit){draw();end();return}}
    draw();G.raf=requestAnimationFrame(loop);
  }
  draw();
}
/* vyzdvihnutie odmien z hry (hneď na konci hry alebo neskôr v záložke iWatt) */
function iwClaim(){const w=iwS();if(!w.pend.length)return 0;const amt=w.pend.reduce((s,p)=>s+p.amt,0);w.bal+=amt;w.today=(w.today||0)+amt;w.pend=[];logEv(`${nm(regPer())}: vyzdvihnuté +${fm(amt,0)} iWatt zo Slnečného behu`);toast(`+${fm(amt,0)} iWatt pripísaných · zostatok ${fm(w.bal,0)} iWatt`);return amt}
function iwClose(silent){
  const ov=document.getElementById('iw-ov');if(IWG){cancelAnimationFrame(IWG.raf);if(IWG.key)document.removeEventListener('keydown',IWG.key);if(IWG.vis)document.removeEventListener('visibilitychange',IWG.vis);IWG=null}
  if(ov)ov.remove();if(!silent)render(false);
}
