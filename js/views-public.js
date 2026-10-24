'use strict';
/* ---------- úvod, výhody, registrácia ---------- */
const EIC_DEMO={
 '24ZZS0000000001A':{persona:'anna',role:'prod',title:'Vaša strecha má čo ponúknuť.',name:'Anna · domácnosť s FVE a batériou'},
 '24ZZS0000000002B':{persona:'peter',role:'cons',title:'Slnečná elektrina aj pre vás.',name:'Peter · odberateľ bez FVE'},
 '24ZZS0000000003C':{persona:null,role:null,title:'Priemerná domácnosť',name:'priemerná domácnosť'}
};
/* ukážkový kód priemernej domácnosti – čip „Vložiť ukážkový kód“ na úvode */
const EIC_SAMPLE='24ZZS0000000003C';
const maskEic=e=>e&&e.length>=10?e.slice(0,5)+'••••••'+e.slice(-5):'ukážkový profil';
/* ilustrácia domu; farby berie z tokenov, aby sa menila so značkou */
function lpHouse(roof='var(--lp-roof)',body='#f4ece0',panels=true){return `<g><path d="m20 65 75-43 75 43-75 43Z" fill="${roof}"/><path d="M25 68v55l70 41v-56Z" fill="${body}"/><path d="M95 108v56l70-41V68Z" fill="#d6cbbd"/><path class="lp-win" d="m42 84 17 10v25l-17-10Zm32 19 12 7v34l-12-7Z" fill="#4a4652"/><path class="lp-win side" d="m111 107 16-9v24l-16 9Zm26-15 15-8v24l-15 9Z" fill="#625d6c"/>${panels?'<path d="m47 61 47-27 48 28-47 27Z" fill="#2c2b3a" stroke="#9c9db1"/><path d="m59 54 48 28m-35-35 48 28M83 40l48 28M63 71l47-27m-31 36 47-27" stroke="#87889f" stroke-width=".7"/>':''}</g>`}
/* úrovne Slnečného klubu: body posúvajú zákazníka vyššie, s úrovňou rastú výhody od dodávateľa */
const LEVELS=[['Bronz',0],['Striebro',250],['Zlato',500],['Slnko',1000]];
function lvlOf(p){let i=0;LEVELS.forEach(([,t],k)=>{if(p>=t)i=k});const nx=LEVELS[i+1];return {i,name:LEVELS[i][0],next:nx&&nx[0],need:nx?nx[1]-p:0}}
/* bežná dodávka pre domácnosti – jednopásmová sadzba DD2, VT bez DPH (doc/cenniky.md) */
const SUPPLY_HH=0.1233;
/* čísla na úvode počíta ten istý engine ako aplikácia */
function lpNums(){
 const r=potRun(),a=agg(r),P=r.P,win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),d=S.sim.days;
 const succ=a.anna.offered>0?a.anna.shared/a.anna.offered:0;
 return {gainMonth:a.anna.vsVykup*d,win:win?I2T(win.a)+' – '+I2T(win.b):'11:00 – 14:00',goal:Math.min(1,succ/.8),pts:gainFor(recAppTime()).pts};
}
/* úvod – ukážka skutočnej karty výziev z aplikácie (rovnaké údaje ako Výzvy pre odberateľa) */
function lpChallengeCard(){
  try{
    const P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));if(!win)return '';
    const items=chItems('peter').filter(x=>x.st==='new').sort((a,b)=>b.eur-a.eur).slice(0,3);
    const hours=Array.from({length:24},(_,h)=>sum(P.fp.slice(h*4,h*4+4))),mx=Math.max(...hours,.01),inW=h=>h*4>=win.a-3&&h*4<win.b;
    const row=(it,k)=>`<div class="lpc-row ${k?'':'best'}"><span class="svc-ic">${icon(it.ic)}</span><div><b>${it.verb} ${it.t}</b><span class="xs">namiesto ${it.o.orig} · ušetríte ~${eur(Math.max(0,it.eur))}/mes.</span></div><span class="lpc-iw">+${fm(CH_IW,0)} iWatt</span></div>`;
    return `<div class="lp-challenge lpc"><div class="lpc-h"><span class="pill y">Dnes · slnečné okno ${I2T(win.a)} – ${I2T(win.b)}</span><span class="xs">ukážka z aplikácie</span></div>
     <div class="lpc-tl" aria-hidden="true">${hours.map((x,h)=>`<i class="${inW(h)?'w':''}" style="height:${Math.max(4,x/mx*100)}%"></i>`).join('')}</div><div class="lpc-tl-l"><span>00:00</span><span>slnečné okno</span><span>24:00</span></div>
     ${items.map(row).join('')}
     <p class="note">Overuje inteligentný elektromer · ${fm(CH_IW,0)} iWatt za výzvu · nikdy nie za vyššiu spotrebu.</p></div>`;
  }catch(e){return ''}
}
function vLanding(){
 const l=S.landing||{},n=lpNums();
 /* ponuky z pohľadu spotrebiteľa: cena, úspora oproti bežnej dodávke pre domácnosti, kedy a pre koho */
 const sv=p=>Math.round((SUPPLY_HH-p)/SUPPLY_HH*100);
 /* ponuky = stratégie párovania z registrácie (WZ_STRAT) + solidárna ponuka */
 const offers=[...['match','bal','price'].map(k=>{const x=WZ_STRAT[k];return {h:x.t,p:x.d,price:x.buy,tag:k==='bal'?'Odporúčame':'Stratégia',i:{match:'group',bal:'sliders',price:'coins'}[k],save:`šanca spárovania ${x.ch} %`,cta:'Vybrať stratégiu'}}),
  {h:'Lúč pomoci',p:'Výrobcovia darujú časť prebytkov škole alebo rodine v núdzi.',price:0,tag:'Solidárna ponuka',i:'heart',save:'bez provízie',time:'Podľa dostupnosti',who:'Školy a rodiny v núdzi',cta:'Darovať prebytky',out:1}];
 return `<div class="lp">
 <section class="lp-hero bg" style="background-image:url(assets/hero-bg.jpg)" aria-labelledby="lp-heading"><div class="lp-wrap"><div class="lp-hero-grid"><div>
 <span class="kicker">Zdieľňa · zdieľanie elektriny</span>
 <h1 id="lp-heading">Zelená energia je ešte lepšia, <em>keď sa zdieľa<span class="sig">.</span></em></h1>
 <p class="lp-intro">Máte elektrinu navyše? Podeľte sa o ňu a získajte viac. Nemáte vlastné panely? Využite slnečnú energiu od susedov.</p>
 <button class="lp-quick" type="button" data-act="view:register"><span class="lp-quick-q">Chcete sa pridať do sveta zdieľania energie?</span><span class="lp-quick-btn">Pridať sa <span class="lp-quick-arr" aria-hidden="true">→</span></span></button>
 <div class="lp-hero-checks"><span><i class="lp-chk-dot"></i>Energia na autopilota</span><span><i class="lp-chk-dot"></i>Inteligentné párovanie</span><span><i class="lp-chk-dot"></i>Efektívne zdieľanie</span></div>
 </div><div class="lp-scene bg-cards"><div class="lp-float one">${icon('chart','lp-float-ic')}<span class="tag">Keď strecha nezaháľa</span><b>+ ${eur(n.gainMonth)}</b><span class="positive">oproti výkupu za mesiac</span></div><div class="lp-float two">${icon('clock','lp-float-ic')}<div class="lp-live"><i></i> Slnko práve spája</div><b>${n.win}</b><span>Čas na slnečnú elektrinu</span></div></div></div>
 </div></section>
 <div class="lp-wrap"><div class="lp-promises">${[['shield','Vy rozhodujete','Cenu poznáte vopred.'],['home','S panelmi aj bez nich','Svoje miesto si nájde každý.'],['clock','Správna energia, správny čas','Spájame výrobu so spotrebou.'],['chart','Žiadne hádanie','kWh aj eurá v jednom prehľade.']].map(([i,h,p])=>`<div class="lp-promise">${icon(i)}<div><b>${h}</b><small>${p}</small></div></div>`).join('')}</div></div>
 <section class="lp-section" id="lp-benefits"><div class="lp-wrap"><div class="lp-section-head"><div><span class="kicker">Dve strany. Jedna dobrá myšlienka.</span><h2>Zo slnka môže mať viac každý<span class="sig">.</span></h2></div></div><div class="lp-paths">
 <article class="lp-path consumer"><span class="kicker">Mám spotrebu</span><h3>Na slnečnú elektrinu nepotrebujete strechu.</h3><p>Vyberte si elektrinu od ľudí, ktorí jej majú navyše. Najväčší zmysel dáva vtedy, keď ju práve využijete.</p><ul><li>Výhodnejšia cena zdieľanej elektriny</li><li>Odporúčanie vhodného času spotreby</li><li>Bez provízie platforme pre odberateľa</li></ul><button class="btn dark lg" data-act="view:register">Nájsť lacnejšiu elektrinu <span aria-hidden="true">→</span></button>${icon('home','path-art')}</article>
 <article class="lp-path"><span class="kicker">Mám výrobu</span><h3>Nech vaša strecha pracuje aj pre vás.</h3><p>Dajte prebytkom lepšie využitie. Ponúknite ich za vlastnú cenu a sledujte, čo vám zostane po provízii.</p><ul><li>Vlastná alebo odporúčaná cena</li><li>Odporúčané prepojenia s odberateľmi</li><li>Prebytky môžete aj darovať – škole alebo rodine v núdzi, bez provízie</li></ul><button class="btn dark lg" data-act="view:register">Ponúknuť prebytky <span aria-hidden="true">→</span></button>${icon('sun','path-art')}</article>
 </div></div></section>
 <section class="lp-section lp-how" id="lp-how"><div class="lp-wrap"><div class="lp-how-grid"><div><span class="kicker">Menej vybavovania. Viac energie.</span><h2>Začína sa to jedným klikom<span class="sig">.</span></h2><p class="lead">Nájdeme vám vhodných partnerov na zdieľanie a postaráme sa o prehľad aj vyúčtovanie. Vy máte svoju energiu pod kontrolou.</p></div><div class="lp-step-grid"><article><span class="lp-step-num">01</span><h3>Zaregistrujte sa</h3><p>Prihláste sa účtom ZSE alebo VSE a údaje doplníme za vás. Máte iného dodávateľa? Stačí registrácia s EIC kódom z faktúry.</p></article><article><span class="lp-step-num">02</span><h3>Nájdite svoju zhodu</h3><p>Porovnajte cenu aj čas. Vyberte si ponuku alebo nastavte vlastné prebytky.</p></article><article><span class="lp-step-num">03</span><h3>Zdieľajte a sledujte</h3><p>Po schválení zapojenia uvidíte zdieľané kWh, príjem, úsporu aj zúčtovanie.</p></article></div></div></div></section>
 <section class="lp-section lp-smart" id="lp-forecast"><div class="lp-wrap lp-smart-grid"><div><span class="kicker">Trochu iný čas. Lepší výsledok.</span><h2>Slnko má svoj plán. Vy z neho môžete vyťažiť viac<span class="sig">.</span></h2><p class="lead">Umývačka po obede. Nabíjanie cez deň. Malý posun plánovanej spotreby môže znamenať viac využitej elektriny a väčšiu úsporu.</p><button class="btn dark lg" style="margin-top:24px" data-act="landingfeature:forecast">Vyskúšať posun spotreby →</button></div><div class="lp-chart-card"><div class="row between"><h3>Váš slnečný zajtrajšok</h3><span class="pill c">Ukážka predikcie</span></div><div class="lp-chart-legend"><span><i class="prod"></i> Dostupné prebytky</span><span><i class="cons"></i> Vaša spotreba</span></div><svg viewBox="0 0 430 205" role="img" aria-label="Ilustračný graf: dostupné prebytky vrcholia na poludnie a presun spotreby zvyšuje ich využitie"><path d="M20 40h390M20 90h390M20 140h390M20 175h390" stroke="var(--line)" fill="none"/><rect x="156" y="20" width="120" height="155" fill="var(--yellow-t)" rx="8"/><path d="M20 175C70 175 90 160 123 127S164 43 209 37 262 72 299 118 345 169 410 175Z" fill="var(--c-prod)" fill-opacity=".28"/><path d="M20 175C70 175 90 160 123 127S164 43 209 37 262 72 299 118 345 169 410 175" stroke="var(--c-prod)" stroke-width="3" fill="none"/><path d="M20 149 75 143 120 151 158 95 185 115 217 68 249 104 277 127 318 140 365 147 410 139" stroke="var(--c-cons)" stroke-width="3" fill="none"/><g fill="var(--mut)" font-family="Figtree,sans-serif" font-size="11"><text x="14" y="199">06:00</text><text x="140" y="199">10:00</text><text x="267" y="199">14:00</text><text x="380" y="199">18:00</text></g></svg><div class="lp-chart-result"><b>Vaše slnečné okno: ${n.win}</b>Skúste sem presunúť plánované nabíjanie alebo umývanie riadu.</div></div></div></section>
 <div class="lp-wrap" id="lp-club"><section class="lp-club"><div><span class="kicker">Výzvy a odmeny</span><h2>Váš čas na výhody<span class="sig">.</span></h2><p class="lead">Aplikácia vám každý deň ukáže slnečné okno a poradí, čo presunúť – pranie, riad či nabíjanie. Za každý overený presun ušetríte a získate iWatt, ktoré vymeníte za zľavy u partnerov a v e-shope.</p><button class="btn light lg" data-act="landingfeature:challenges">Pozrieť výzvy →</button></div>${lpChallengeCard()}</section></div>
 <section class="lp-section" id="lp-offers"><div class="lp-wrap"><div class="lp-section-head"><div><span class="kicker">Trhovisko plné možností</span><h2>Elektrina, ktorá zapadne do vášho dňa<span class="sig">.</span></h2></div></div><div class="lp-offers">${offers.map(({h,p,price,time,tag,i,save,who,cta,out})=>`<article class="lp-offer"><div class="lp-offer-art"><span class="pill c">${tag}</span>${icon(i)}</div><div class="lp-offer-body"><h3>${h}</h3><p>${p}</p><div class="lp-offer-price">${fm(price,price?3:2)} € <span>/ kWh</span></div><span class="pill g lp-offer-save">${save}</span>${time?`<div class="lp-offer-meta"><span>${time}</span><b>${who}</b></div>`:''}<button class="btn ${out?'out':'dark'} block" data-act="view:register">${cta} <span aria-hidden="true">→</span></button></div></article>`).join('')}</div><p class="note">Stratégiu si zvolíte pri registrácii a kedykoľvek ju zmeníte. Šanca spárovania a podiel sú modelové odhady. Ceny sú bez DPH a bez distribučných, regulovaných a fixných poplatkov; bežná sadzba pre domácnosti ${fm(SUPPLY_HH,4)} €/kWh bez DPH. Darovanie závisí od zapojenia oprávneného príjemcu.</p></div></section>
 <section class="lp-section" id="lp-faq"><div class="lp-wrap lp-faq"><div><span class="kicker">Dobré otázky si zaslúžia jasné odpovede</span><h2>Poďme si to rozsvietiť<span class="sig">.</span></h2><p class="lead">Zdieľanie bez zbytočného žargónu.${isOn('chat')?' Ak niečo chýba, opýtajte sa nášho demo asistenta.':''}</p><button class="link" style="margin-top:24px" data-act="chat">Opýtať sa asistenta →</button></div><div>
 <details><summary>Kto za Zdieľňou stojí?</summary><p>Zdieľňu prevádzkuje váš dodávateľ elektriny. Ktorý to je, uvidíte po zadaní EIC – podľa neho sa aplikácia prispôsobí. Údaje o výrobe a spotrebe pochádzajú z vášho inteligentného elektromera a vyúčtovanie zdieľanej elektriny vám pripraví dodávateľ, nie cudzí človek.</p></details>
 <details id="eic-faq"><summary>Ako sa zaregistrujem?</summary><p>Zákazníci ZSE a VSE sa prihlásia svojím účtom jedným klikom – odberné miesto, meranie aj zmluvy doplníme za vás. Máte iného dodávateľa? Stačí registrácia s EIC kódom z faktúry. Registrácia je bez záväzku.</p></details>
 <details><summary>Môžem sa zapojiť aj bez fotovoltiky?</summary><p>Áno. Ako odberateľ môžete využívať prebytky iných výrobcov. Rozhoduje dostupnosť vhodnej ponuky a časový súbeh vašej spotreby s výrobou.</p></details>
 <details><summary>Ušetrím uvedenú sumu z celého účtu?</summary><p>Ukazujeme úsporu na cene zdieľanej elektriny oproti porovnávanej cene dodávky. Distribučné, regulované a fixné poplatky tým automaticky nezanikajú. Odhad nie je garantovaný výsledok.</p></details>
 <details><summary>Čo ak ešte nemám inteligentný elektromer?</summary><p>V deme si môžete pozrieť odhad aj bez neho. Pre aktívne zdieľanie potrebujete vhodné intervalové meranie a splnenie podmienok zapojenia. Prototyp obsahuje aj virtuálnu žiadosť o IMS.</p></details>
 <details><summary>Začne sa zdieľanie hneď po registrácii?</summary><p>Nie. Najskôr si vyberiete ponuku alebo skupinu, potvrdíte súhlas a odošlete žiadosť. Zdieľanie začne až po jej schválení, spravidla k prvému dňu mesiaca. Jedno odberné miesto môže byť aktívne len v jednej skupine zdieľania.</p></details>
 <details><summary>Môžem si elektrinu z obeda nechať na večer?</summary><p>Zdieľanie sa vyhodnocuje v rovnakých 15-minútových intervaloch. Presun na večer vyžaduje skutočné uloženie energie, napríklad do fyzickej batérie. Samotné zdieľanie ju neukladá.</p></details>
 </div></div></section>
 <div class="lp-wrap"><section class="lp-final"><span class="kicker">Vaša energia môže viac</span><h2>Začnite jedným klikom. Objavte nové možnosti<span class="sig">.</span></h2><p>Máte elektrinu navyše alebo ju chcete využívať výhodnejšie? Zdieľanie je pre vás.</p><button class="btn pri lg" data-act="view:register">Pridať sa →</button></section>
 <footer class="lp-footer"><div><b>Zdieľňa<span class="dot">.</span></b></div><nav class="lp-footer-links" aria-label="Odkazy v pätičke"><a href="#lp-how">Ako to funguje</a><a href="#lp-forecast">Predikcia</a><a href="#lp-club">Výzvy a odmeny</a><a href="#lp-offers">Ponuky</a><a href="#lp-faq">Otázky a odpovede</a></nav></footer></div>
 </div>`;
}

/* pridanie sa – zadanie EIC (z úvodu cez „Pridať sa“); neutrálny vzhľad ako úvod, značka až podľa EIC */
function vJoin(){
 const l=S.landing||{},ok=l.checked&&!l.error;
 return `<div class="lp"><section class="lp-hero lp-join" aria-labelledby="join-heading"><div class="lp-wrap"><div class="lp-join-card">
 <span class="kicker">Pridajte sa do Zdieľne</span>
 <h1 id="join-heading">Začnite jedným kódom<span class="sig">.</span></h1>
 <p class="lp-intro">Zadajte EIC kód svojho odberného miesta. Podľa neho pripravíme odhad, čo vám zdieľanie prinesie, a spojíme vás s vaším dodávateľom elektriny.</p>
 <form id="lp-eic-form" novalidate><label class="lp-eic-label" for="lp-eic">Zistite, čo môže zdieľanie priniesť vám</label><div class="lp-eic-box"><input id="lp-eic" name="eic" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="lp-eic-help${l.error?' lp-eic-error':''}" aria-invalid="${l.error?'true':'false'}" placeholder="Váš 16-miestny EIC kód" maxlength="24" value="${esc(l.eic||'')}"><button class="btn pri" type="button" data-act="eiccheck">Zistiť môj potenciál <span aria-hidden="true">→</span></button></div>${l.error?`<div class="lp-error" id="lp-eic-error" role="alert">${esc(l.error)}</div>`:''}
 <p class="lp-eic-help" id="lp-eic-help">EIC nájdete na faktúre za elektrinu. Nemáte ho poruke? <button type="button" class="lp-chip" data-act="eicfill">Vložiť ukážkový kód</button></p></form>
 <div class="lp-demo-links"><span>Nemáte kód poruke?</span><button class="link" data-act="eicdemo:anna">Skúsiť výrobcu</button><span aria-hidden="true">·</span><button class="link" data-act="eicdemo:peter">Skúsiť odberateľa</button></div>
 ${ok?`<p class="lp-ok" role="status">✓ Kód ${esc(maskEic(l.eic))} je v poriadku.</p>`:''}
 <details class="lp-join-faq"><summary>Kde nájdem EIC kód?</summary><p>EIC je 16-miestny kód odberného miesta. Nájdete ho na faktúre za elektrinu alebo v zákazníckom účte pri údajoch o odbernom mieste. Samotný kód nie je prihlásenie ani súhlas so zdieľaním – zdieľanie začne až po vašom potvrdení a schválení žiadosti.</p></details>
 </div></div></section></div>`;
}

function benefitNums(){
  const pa=agg(potRun()),d=S.sim.days,u=UNC[S.p.conf]||.2;
  return {u,yP:pa.anna.vsVykup*d*12,yNet:pa.anna.net*d*12,yBat:pa.anna.batGain*d*12,yC:pa.peter.saved*d*12,kP:(pa.anna.shared+pa.anna.batSold)*d*12,kC:pa.peter.recv*d*12};
}
/* stĺpec výrobcu / odberateľa – spoločný pre Výhody aj Váš potenciál (žiadna duplicitná logika) */
function benCol(kind,b,o={}){
  const hi=v=>v*(1+b.u),lo=v=>v*(1-b.u);
  if(kind==='prod')return `<div class="card col ${o.hl?'hl':''}">${o.kicker?`<span class="kicker">${o.kicker}</span>`:''}<div class="row between"><h2>☀ Výrobca s fotovoltikou</h2>${S.bat.on?pill('p','🔋 s batériou'):''}</div>
    <div class="mut sm" style="margin-top:12px">Zarobíte</div><div class="big">až ${eur0(hi(b.yP))}</div><div class="b" style="margin-top:2px">ročne navyše oproti výkupu</div><div class="xs mut">odhad ${eur0(lo(b.yP))} – ${eur0(hi(b.yP))}</div>
    <ul class="sm" style="margin:14px 0 0 18px;padding:0;line-height:1.8">
     <li>Čistý príjem zo zdieľania: <b>${eur0(b.yNet)} / rok</b> (po provízii ${BR()})</li>
     <li>Cena ${fpr(S.p.price)} €/kWh → vám zostane <b>${fpr(netPrice(S.p.price))} €/kWh</b>, výkup dá ${fpr(S.p.feedin)} €</li>
     ${S.bat.on?`<li>Večer z batérie za ${fpr(S.bat.price)} €/kWh: <b>+${eur0(b.yBat)} / rok</b></li>`:''}
     <li>Predáte susedom približne <b>${fm(b.kP,0)} kWh ročne</b></li></ul>${o.btn||''}</div>`;
  return `<div class="card col c2 ${o.hl?'hl':''}">${o.kicker?`<span class="kicker">${o.kicker}</span>`:''}<h2>🔌 Odberateľ (domácnosť alebo podnik)</h2>
    <div class="mut sm" style="margin-top:12px">Ušetríte</div><div class="big" style="color:var(--green)">až ${eur0(hi(b.yC))}</div><div class="b" style="margin-top:2px">ročne na cene elektriny</div><div class="xs mut">odhad ${eur0(lo(b.yC))} – ${eur0(hi(b.yC))}</div>
    <ul class="sm" style="margin:14px 0 0 18px;padding:0;line-height:1.8">
     <li>Cez deň ${fpr(S.p.price)} €/kWh namiesto <b>${fpr(S.c.ref)} €/kWh</b> zo siete</li>
     ${S.bat.on?`<li>Aj večer – z batérie suseda za ${fpr(S.bat.price)} €/kWh</li>`:''}
     <li><b>0 € poplatky</b> – žiadna provízia pre odberateľa</li>
     <li>Približne <b>${fm(b.kC,0)} kWh ročne</b> zo susedných striech</li></ul>${o.btn||''}</div>`;
}
/* úloha 5 – obrazovka po zadaní EIC: priemerné porovnanie výrobcu a odberateľa */
function vPotential(){
  const l=S.landing||{},d=EIC_DEMO[l.eic],b=benefitNums(),hl=d&&d.persona,mx=Math.max(1,b.yP*(1+b.u),b.yC*(1+b.u)),kmx=Math.max(1,b.kP,b.kC);
  const bar=(lab,v,max,c,txt)=>`<div class="pot-bar"><div class="row between sm"><span>${lab}</span><b>${txt}</b></div><div class="bar" style="height:14px"><i style="width:${(v/max*100).toFixed(1)}%;background:${c}"></i></div></div>`;
  return `<div class="gap">${hero({kicker:`Váš potenciál · EIC ${maskEic(l.eic)}`,title:'Toto môže zdieľanie <em>priniesť vám.</em>',
    lead:'Priemerné porovnanie domácnosti s panelmi a bez nich – vypočítané tým istým modelom ako aplikácia.',
    acts:`<button class="btn ghost" data-act="view:landing">← Späť na úvod</button><button class="btn ghost" data-act="view:home">Pozrieť aplikáciu</button>`})}
   <div class="card"><span class="kicker">Porovnanie za rok</span><h3>Výrobca zarobí, odberateľ ušetrí</h3><div class="gap" style="margin-top:14px">
    ${bar('☀ Výrobca – zárobok navyše oproti výkupu',b.yP*(1+b.u),mx,'var(--c-prod)','až '+eur0(b.yP*(1+b.u)))}
    ${bar('🔌 Odberateľ – úspora na cene elektriny',b.yC*(1+b.u),mx,'var(--c-shared)','až '+eur0(b.yC*(1+b.u)))}
    ${bar('☀ Výrobca – predané susedom',b.kP,kmx,'var(--c-prod)',fm(b.kP,0)+' kWh')}
    ${bar('🔌 Odberateľ – elektrina od susedov',b.kC,kmx,'var(--c-shared)',fm(b.kC,0)+' kWh')}</div></div>
   ${secHead('Kto ste vy?','Vyberte si svoju cestu.','Podľa toho vám pripravíme registráciu aj aplikáciu.')}
   <div class="grid g2 ben">${benCol('prod',b,{hl:hl==='anna',kicker:hl==='anna'?'Váš profil':'Mám výrobu',btn:`<button class="btn pri" style="margin-top:18px" data-act="potrole:anna">Som výrobca →</button>`})}${benCol('cons',b,{hl:hl==='peter',kicker:hl==='peter'?'Váš profil':'Mám spotrebu',btn:`<button class="btn pri" style="margin-top:18px" data-act="potrole:peter">Som odberateľ →</button>`})}</div>
   <p class="note">Ide o odhad pre priemerný profil, nie výsledok vypočítaný z vášho reálneho EIC. Nezahŕňa distribučné, regulované ani fixné poplatky.</p></div>`;
}
function vBenefits(){
  const b=benefitNums(),hi=v=>v*(1+b.u),lo=v=>v*(1-b.u);
  return `<div class="gap ben">${hero({kicker:'Výhody zdieľania',title:'Zo slnka môže mať <em>viac každý.</em>',lead:`Ročný odhad vypočítaný tým istým enginom ako celá aplikácia (denný profil × ${S.sim.days} dní × 12 mesiacov).`,acts:`<button class="btn pri" data-act="view:register">Zaregistrovať sa →</button><button class="btn ghost" data-act="calc">🧮 Prepočítať kWh</button>`,aside:hstat('Výrobca zarobí ročne','až '+eur0(hi(b.yP)),'navyše oproti výkupu')+hstat('Odberateľ ušetrí ročne','až '+eur0(hi(b.yC)),'bez poplatkov')})}
  <div class="grid g2">${benCol('prod',b)}${benCol('cons',b)}</div>
  <div class="bens">
   <div>${icon('home')}<b>Lokálna energia</b><span class="xs mut">Elektrina zo striech vo vašom okolí.</span></div>
   <div>${icon('shield')}<b>Bez poplatkov pre odberateľa</b><span class="xs mut">Platíte iba cenu, ktorú vidíte vopred.</span></div>
   <div>${icon('clock')}<b>Prehľad každých 15 minút</b><span class="xs mut">Každá kWh a každé euro je vysvetliteľné.</span></div>
   <div>${icon('star')}<b>Odmeny a výzvy</b><span class="xs mut">Body za presun spotreby do slnka.</span></div>
  </div>
  <div class="card" style="text-align:center"><button class="btn pri lg" data-act="view:register">Zaregistrovať sa →</button>
   <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sm" data-act="calc">🧮 Prepočítať kWh</button><button class="btn sm" data-act="chat">💬 Opýtať sa AI asistenta</button><button class="btn sm" data-act="view:home">Pozrieť aplikáciu (demo)</button></div>
   <p class="xs mut" style="margin-top:10px">Všetky sumy sú odhady, nie garancia. Predpoklady: prebytok ${fm(S.p.surplus,1)} kWh/deň, ${S.bat.on?`batéria ${fm(S.bat.cap,0)} kWh, `:''}výkup ${fpr(S.p.feedin)} €/kWh, provízia ${feeTxt()}. Dajú sa zmeniť v „⚙ Upraviť čísla a časy“.</p></div>
  </div>`;
}
/* ponuka dodávky ZSE · VSE (dual brand) pre zákazníkov iných dodávateľov – nenápadná, nikdy podmienka zdieľania.
   Jedna ponuka, jedna cena; konkrétneho dodávateľa určí adresa odberného miesta. */
const SUP_PRICE=0.1137;
/* zákazník ZSE · VSE bez online účtu: overíme ho podľa údajov z faktúry a účet mu založíme na pozadí.
   Heslo nepýtame – na e-mail pošleme odkaz na jeho nastavenie. */
function accModal(){
 const a=S.acc;
 const brand=`<div class="supply-brand"><img src="${LOGO_OFF.zse}" alt="ZSE"><span aria-hidden="true"></span><img src="${LOGO_OFF.vse}" alt="VSE"></div>`;
 const wrap=b=>`<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Vytvorenie zákazníckeho účtu"><div class="row between">${brand}<button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>${b}</div></div>`;
 if(a.done)return wrap(`<h2 style="margin-top:14px">Účet sme vám vytvorili</h2>
  <div class="supply-done"><span class="supply-ok" aria-hidden="true">✓</span><p>Overili sme vás ako zákazníka a založili zákaznícky účet. Prihlasovacie meno je <b>${esc(a.email)}</b>. Odkaz na nastavenie hesla sme poslali na tento e-mail.</p></div>
  <div class="row" style="margin-top:18px"><button class="btn pri" data-act="sso:auto">Pokračovať v registrácii →</button></div>`);
 return wrap(`<h2 style="margin-top:14px">Vytvoríme vám zákaznícky účet</h2>
  <p class="sm mut" style="margin:6px 0 16px">Stačia dva údaje z faktúry za elektrinu. Účet založíme za vás a hneď pokračujete v registrácii.</p>
  <div class="fields">${F('Zákaznícke číslo','acc.cno',{t:'x'})}${F('PSČ odberného miesta','acc.psc',{t:'x'})}</div>
  <div class="fields one" style="margin-top:12px">${F('E-mail (bude vaším prihlasovacím menom)','acc.email',{t:'x'})}</div>
  <p class="xs mut" style="margin-top:8px">Zákaznícke číslo nájdete na faktúre vpravo hore. Nemáte ju poruke? <button class="lp-chip acc-chip" type="button" data-act="accdemo">Vyplniť ukážkové údaje</button></p>
  <div style="margin-top:12px">${F('Súhlasím s vytvorením zákazníckeho účtu a spracovaním uvedených údajov.','acc.ok',{t:'c'})}</div>
  ${a.err?`<p class="supply-err" role="alert">${esc(a.err)}</p>`:''}
  <div class="row" style="margin-top:16px"><button class="btn pri" data-act="accreq">Vytvoriť účet</button><button class="btn" data-act="closemodal">Zrušiť</button></div>
  <p class="xs mut" style="margin-top:12px">Heslo od vás nežiadame – nastavíte si ho cez odkaz v e-maile.</p>`);
}
/* prihlásenie zákazníckym účtom ZSE · VSE – iba demo: polia sú predvyplnené, nič sa neodosiela ani neukladá */
function loginModal(){
 const brand=`<div class="supply-brand"><img src="${LOGO_OFF.zse}" alt="ZSE"><span aria-hidden="true"></span><img src="${LOGO_OFF.vse}" alt="VSE"></div>`;
 return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Prihlásenie zákazníckym účtom"><div class="row between">${brand}<button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <h2 style="margin-top:14px">Prihlásenie do zákazníckeho účtu</h2>
  <p class="sm mut" style="margin:6px 0 16px">Vyberte testovací účet z databázového exportu. Celý proces prebieha lokálne v prehliadači.</p>
  <div class="pill vis" style="margin-bottom:14px">🔒 Demo prihlásenie – údaje sú predvyplnené a nikam sa neodosielajú</div>
  <div class="fields one">${demoPicker()}</div><p class="xs mut">1 zákazník · 12 odberných miest. Dodávateľ nie je v exporte; značka ZSE je iba ukážková. Bez pripojenia k backendu.</p>
  <div class="row" style="margin-top:16px"><button class="btn pri" data-act="sso:auto">Prihlásiť sa</button><button class="btn" data-act="closemodal">Zrušiť</button></div>
  <p class="xs mut" style="margin-top:14px">Ešte nemáte online účet? <button class="link" data-act="acc">Vytvoríme vám ho →</button></p></div></div>`;
}
function supplyModal(){
 const u=S.sup;
 const brand=`<div class="supply-brand"><img src="${LOGO_OFF.zse}" alt="ZSE"><span aria-hidden="true"></span><img src="${LOGO_OFF.vse}" alt="VSE"></div>`;
 const head=t=>`<div class="row between">${brand}<button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div><h2 style="margin-top:14px">${t}</h2>`;
 const wrap=b=>`<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Ponuka dodávky ZSE a VSE">${b}</div></div>`;
 if(u.sent)return wrap(`${head('Ďakujeme, máte to vybavené')}
  <div class="supply-done"><span class="supply-ok" aria-hidden="true">✓</span><p>Ponuku dodávky vám pošleme na <b>${esc(u.email)}</b>${u.tel?` a ozveme sa aj na číslo <b>${esc(u.tel)}</b>`:''} do 2 pracovných dní.</p></div>
  <p class="sm mut" style="margin-top:12px">Medzitým môžete pokojne pokračovať v registrácii – zdieľanie funguje aj s vaším súčasným dodávateľom.</p>
  <div class="row" style="margin-top:18px"><button class="btn pri" data-act="closemodal">Pokračovať v registrácii</button></div>`);
 const b=(t,d)=>`<li><b>${t}</b><span class="xs mut">${d}</span></li>`;
 return wrap(`${head('Elektrina od ZSE a VSE')}
  <p style="margin:8px 0 16px">Zdieľanie funguje s akýmkoľvek dodávateľom. Ako zákazník ZSE alebo VSE z neho však máte najviac.</p>
  <ul class="supply-list">${b('Prihlásenie jedným klikom','Odberné miesto, meranie aj zmluvy doplníme za vás.')}${b('Výhody navyše v Slnečnom klube','Od úrovne Zlato zľava na dodávku a nižšia provízia pri zdieľaní.')}${b('Jedno vyúčtovanie','Dodávka aj zdieľaná elektrina na jednej faktúre.')}</ul>
  <div class="supply-price"><span class="xs mut">Dodávka elektriny pre domácnosti 2026</span><b>od ${fm(SUP_PRICE,4)} € <span>/ kWh bez DPH</span></b><span class="xs mut">jednopásmová sadzba · bez distribučných a fixných poplatkov</span></div>
  <h3 class="supply-h">Kam vám máme poslať ponuku?</h3>
  <div class="fields">${F('E-mail','sup.email',{t:'x'})}${F('Telefón (nepovinné)','sup.tel',{t:'x'})}</div>
  <div style="margin-top:10px">${F('Súhlasím so spracovaním e-mailu a telefónu na zaslanie ponuky dodávky elektriny.','sup.ok',{t:'c'})}</div>
  ${u.err?`<p class="supply-err" role="alert">${esc(u.err)}</p>`:''}
  <div class="row" style="margin-top:16px"><button class="btn pri" data-act="supplyreq">Poslať mi ponuku</button><button class="btn" data-act="closemodal">Teraz nie</button></div>
  <p class="xs mut" style="margin-top:12px">Zmena dodávateľa je dobrovoľná a nie je podmienkou zdieľania.</p>`);
}
function calcModal(){
  const c=S.calc;
  const pg=c.pkwh*c.pprice,pc=feeOf(c.pkwh,pg),pn=pg-pc,pv=c.pkwh*c.pfeed,pd=pn-pv;
  const cpay=c.ckwh*c.cprice,cnorm=c.ckwh*c.cref,csav=cnorm-cpay;
  return `<div class="modal-bg" data-act="closemodal"><div class="modal wide" role="dialog" aria-modal="true" aria-label="Prepočítať kWh"><div class="row between"><h2>🧮 Prepočítať kWh</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <div class="grid g2" style="margin-top:12px">
   <div class="card"><h3>Kalkulačka výrobcu</h3><div class="fields" style="margin:10px 0">${F('Predané za mesiac','calc.pkwh',{step:5,u:'kWh'})}${F('Vaša cena','calc.pprice',{step:.005,u:'€/kWh'})}${F('Výkupná cena','calc.pfeed',{step:.005,u:'€/kWh'})}</div>
    <table><tbody><tr><td>Tržba z ponuky</td><td class="n">${eur(pg)}</td></tr><tr><td>− Provízia ${BR()} (${feeTxt()})</td><td class="n">−${eur(pc)}</td></tr><tr style="font-weight:700"><td>Čistý príjem</td><td class="n">${eur(pn)}</td></tr><tr><td class="mut">Pri výkupe by ste dostali</td><td class="n mut">${eur(pv)}</td></tr></tbody></table>
    <div style="margin-top:10px"><div class="xs mut">Zisk oproti výkupu</div><div class="b upd" style="font-size:26px;color:${pd>=0?'var(--green)':'var(--red)'}">${pd>=0?'+':''}${eur(pd)} / mesiac</div><div class="xs mut">ročne ${eur(pd*12)}</div></div></div>
   <div class="card"><h3>Kalkulačka odberateľa</h3><div class="fields" style="margin:10px 0">${F('Odobraté za mesiac','calc.ckwh',{step:5,u:'kWh'})}${F('Cena zdieľania','calc.cprice',{step:.005,u:'€/kWh'})}${F('Vaša súčasná cena komodity','calc.cref',{step:.005,u:'€/kWh'})}</div>
    <table><tbody><tr><td>Zaplatíte za zdieľanú energiu</td><td class="n">${eur(cpay)}</td></tr><tr><td class="mut">Pri súčasnej cene by ste platili</td><td class="n mut">${eur(cnorm)}</td></tr><tr style="font-weight:700"><td>Poplatky za službu</td><td class="n">0,00 €</td></tr></tbody></table>
    <div style="margin-top:10px"><div class="xs mut">Úspora komodity</div><div class="b upd" style="font-size:26px;color:${csav>=0?'var(--green)':'var(--red)'}">${csav>=0?'+':''}${eur(csav)} / mesiac</div><div class="xs mut">ročne ${eur(csav*12)}</div></div></div></div>
  <p class="xs mut" style="margin-top:10px">Zisk = kWh × (cena − provízia − výkupná cena); úspora = kWh × (súčasná cena − cena zdieľania). Rovnaký vzorec ako v celej aplikácii. Odhad, nie garancia.</p>
  <div class="row" style="margin-top:10px"><button class="btn pri" data-act="view:register">Zaregistrovať sa</button><button class="btn" data-act="closemodal">Zavrieť</button></div></div></div>`;
}
const SSO={anna:{name:'Anna Kováčová',role:'výrobca',addr:{zse:'Krajinská 8, Piešťany',vse:'Levočská 21, Prešov'},id:{zse:'SK-OM-1101',vse:'SK-OM-8811'},type:'om_house',pv:true},peter:{name:'Peter Malý',role:'odberateľ',addr:{zse:'Hlavná 12, Trnava',vse:'Hlavná 48, Košice'},id:{zse:'SK-OM-0001',vse:'SK-OM-7001'},type:'om_shop',pv:false}};
const SSO_STEPS=['Overujeme váš zákaznícky účet','Hľadáme vaše odberné miesta','Kontrolujeme inteligentné elektromery','Načítavame zmluvy'];
/* čo sme pri jednotlivých krokoch našli – musí sedieť s miestami v sprievodcovi (wzLoad) */
function ssoFound(per,co){if(S.reg.demoCustomer){const rows=demoRows();return [`Testovací zákazník ${demoCustomerId()}`,`${rows.length} pripojenie / pripojenia, ${rows.reduce((n,r)=>n+r.meters.length,0)} elektromerov`,rows.every(r=>r.has_ims)?'IMS a úplné profily podľa exportu':'Bez IMS a bez úplných profilov','Zmluvy nie sú v exporte – overenie je simulované']} const isP=per==='anna',n=isP?2:3;return [`Účet ${SKN[co]} je overený`,`Našli sme ${n} odberné miesta`,`${n-1} s inteligentným elektromerom, 1 bez neho`,`Zmluva o dodávke ${SKN[co]}${isP?' a o výkupe prebytkov':''}`]}
/* ---------- registrácia, krok 2: porovnanie skupín a ďalší postup ---------- */
/* odhad pre skupinu z enginu: objem × zhoda skupiny (f), cena posunutá o typický rozdiel v skupine (dp) */
function grpEst(g,isP){
  const a=agg(potRun()),d=S.sim.days,f=g.f,dp=g.dp||0;
  if(isP){const k=(a.anna.shared+a.anna.batSold)*d*f;return {k,m:a.anna.vsVykup*d*f+dp*k,price:(a.anna.shared+a.anna.batSold>0?(a.anna.shared*S.p.price+a.anna.batSold*S.bat.price)/(a.anna.shared+a.anna.batSold):S.p.price)+dp}}
  const k=a.peter.recv*d*f;return {k,m:a.peter.saved*d*f-dp*k,price:(a.peter.recv>0?a.peter.paid/a.peter.recv:S.p.price)+dp};
}
const grpBest=isP=>GROUPS.filter(g=>!gOcc(g).full).sort((x,y)=>grpEst(y,isP).m-grpEst(x,isP).m)[0]||GROUPS[0];
function grpCompare(isP,sel,name){
  const u=UNC[S.p.conf]||.2,r=potRun(),base=matchScore(r.P.fp,S.p.price,r.P.fc,S.c.max,S.c.ref,S.p.conf).total,best=grpBest(isP);
  const reg=regionOf(geo(S.om[isP?'anna':'peter'].addr).ll);
  return `<div class="gcmp" role="radiogroup" aria-label="Skupiny na výber">${GROUPS.map(g=>{const e=grpEst(g,isP),o=gOcc(g),on=sel===g.id,y=e.m*12;
   return `<label class="gcmp-card ${on?'on':''} ${o.full?'off':''}"><span class="row between" style="flex-wrap:nowrap"><span class="row" style="flex-wrap:nowrap"><input type="radio" name="${name}" data-act="obgroup:${g.id}" ${on?'checked':''} ${o.full?'disabled':''}><b>${g.name}</b></span>${g.id===best.id?pill('g','★ Odporúčame'):''}</span>
    <span class="xs mut">${g.town} · ${REG[g.reg].co}${g.reg!==reg?' · ďalej od vás':''} · ${g.tag.toLowerCase()}</span>
    <span class="gcmp-big">${eur0(y)}<small> / rok</small></span>
    <span class="xs">${isP?'zarobíte navyše oproti výkupu':'ušetríte na cene elektriny'} · <b>${eur(e.m)}</b> mesačne<br><span class="mut">odhad ${eur0(y*(1-u))} – ${eur0(y*(1+u))}</span></span>
    <dl class="gcmp-dl"><div><dt>${isP?'Predáte susedom':'Dostanete od susedov'}</dt><dd>${fm(e.k,0)} kWh / mes.</dd></div><div><dt>${isP?'Priemerná cena':'Priemerne zaplatíte'}</dt><dd>${fpr(e.price)} €/kWh${isP?'':` <span class="mut">(sieť ${fpr(S.c.ref)})</span>`}</dd></div><div><dt>Zhoda s vaším profilom</dt><dd>${pct(Math.min(1,base*g.f))}</dd></div><div><dt>Voľné miesta</dt><dd>${o.full?'plná':o.free+' z '+o.cap}</dd></div></dl>
    <span class="xs mut">Prečo: ${g.why}.</span></label>`}).join('')}</div>`;
}
/* 1 = prihlásenie hotové, 2 = žiadosť odoslaná, 3 = zdieľa */
function regSteps(n){
  const L=['Prihlásenie a overenie','Nájdite svoju zhodu','Zdieľajte a sledujte'];
  return `<ol class="regsteps">${L.map((l,i)=>`<li class="${i<n?'is-done':i===n?'is-now':''}"><span aria-hidden="true">${i<n?'✓':i+1}</span>${l}</li>`).join('')}</ol>`;
}
function regTimeline(isP,m,g){
  const now=new Date(),act=new Date(now.getFullYear(),now.getMonth()+1,1),inv=new Date(act.getFullYear(),act.getMonth()+1,10),pay=new Date(act.getFullYear(),act.getMonth()+1,20);
  const D=x=>x.toLocaleDateString('sk-SK',{day:'numeric',month:'numeric',year:'numeric'});
  const cur=m==='PENDING'?1:isAct(m)?3:0;
  const L=[
   ['Dnes','Odošlete žiadosť','Potvrdenie dostanete e-mailom aj v aplikácii (zvonček). Nič nepodpisujete a nič neplatíte.'],
   ['Do 5 pracovných dní','Kontrola distribútora','Distribútor overí odberné miesto, meranie a zmluvy. Ak by žiadosť zamietol, napíšeme vám dôvod a čo s tým.'],
   [D(act),'Začína zdieľanie',`Členstvo v skupine ${g.name} sa aktivuje. Elektromer, dodávateľ ani zmluvy sa nemenia – zdieľa sa automaticky podľa 15-minútových meraní.`],
   ['Každý deň',isP?'Prebytky idú susedom':'Slnečné okno a výzvy',isP?'Ráno uvidíte predikciu prebytku a cenu. Čo susedia nespotrebujú, ide ako doteraz vášmu výkupcovi.':'Ráno uvidíte, kedy je elektrina od susedov najlacnejšia. Keď vtedy zapnete práčku či umývačku, ušetríte viac a získate slnečné body.'],
   ['Do '+D(inv),'Prvé vyúčtovanie',isP?`Uvidíte každú predanú kWh a sumu. Výplata po provízii ${BR()} príde do ${D(pay)}.`:'Zdieľané kWh uvidíte na vyúčtovaní – platíte iba ich cenu, žiadne poplatky za službu.']];
  return `<ol class="tl">${L.map(([w,t,x],i)=>`<li class="${i<cur?'is-done':i===cur?'is-now':''}"><span class="tl-d" aria-hidden="true"></span><div><span class="tl-w">${w}${i===cur?' · teraz':''}</span><b>${t}</b><p class="sm mut">${x}</p></div></li>`).join('')}</ol>`;
}
/* ---------- sprievodca po prihlásení účtom ZSE · VSE: 1 Odberné miesta a zdieľanie → 2 Nastavenia → 3 Kontrola ---------- */
const WZ_STEPS=['Odberné miesta a zdieľanie','Nastavenia','Kontrola a potvrdenie'];
/* nadpis a podnadpis v hornom banneri podľa kroku (inak názov kroku) */
const WZ_HEAD={2:['Nájdite cenu, ktorá vám sedí','Porovnajte cenové stratégie podľa svojho profilu.']};
/* cenové stratégie: ponuková cena (výroba) alebo max. nákupná cena (iba spotreba); šanca a podiel sú modelové */
const WZ_STRAT={match:{t:'Uprednostniť spárovanie',d:'Viac možností na prepojenie',sell:0.084,buy:0.122,ch:75,sh:55},
 bal:{t:'Vyvážená voľba',d:'Kompromis medzi cenou a využitím',sell:0.103,buy:0.103,ch:56,sh:42},
 price:{t:'Uprednostniť cenu',d:'Výhodnejšia cena, menej možností',sell:0.122,buy:0.084,ch:33,sh:26}};
const wzSide=(o,side)=>side==='cons'?{...o,pv:false,strat:o.consStrat||null,own:o.consOwn??null,priceSide:'cons'}:o;
const wzProd=o=>o.pv;                                   /* miesto vyrába (FVE) */
const wzRec=o=>wzProd(o)?'bal':o.mwh>=10?'match':'bal'; /* odporúčanie podľa profilu miesta */
const wzImported=o=>o.august?.[o.priceSide==='cons'||!o.pv?'consumption_price':'production_price'];
const wzPrice=(o,k)=>{if(k===undefined&&!o.strat&&wzImported(o))return wzImported(o).price_eur_kwh;k=k||o.strat||wzRec(o);return k==='own'?o.own:WZ_STRAT[k][wzProd(o)?'sell':'buy']};
const wzStratName=k=>k==='own'?'Vlastná cena':WZ_STRAT[k].t;
/* upozornenie pri vlastnej cene mimo cenového okna výkup – dodávka (cenníky bez DPH); cenu neblokuje */
const wzOwnWarn=(o,p)=>!(p>0)?'Zadajte cenu v €/kWh.':wzProd(o)?(p<=S.p.feedin?`Nižšia ako výkup ${fpr(S.p.feedin)} €/kWh – do výkupu by ste predali výhodnejšie.`:p>=WZ_SUP[1]?'Vyššia ako dodávková cena susedov – ponuku pravdepodobne nikto neprijme.':''):(p>=WZ_SUP[1]?'Vyššia ako dodávková cena – na zdieľaní neušetríte.':p<=S.p.feedin?'Nižšia ako výkup – za túto cenu výrobcovia pravdepodobne nepredajú.':'');
const wzPriceLbl=o=>wzProd(o)?'Predáte za':'Zaplatíte najviac';
/* kontext ceny podľa doc/cenniky.md (bez DPH): výrobca vs. výkup, odberateľ vs. dodávka domácností DD1–DD6 */
const WZ_SUP=[0.1137,0.1533];
const wzCtx=(o,p=wzPrice(o))=>wzImported(o)?`Referencia ${fm(wzImported(o).reference_price_eur_kwh,5)} €/kWh · ${wzProd(o)?'výkup':'dodávka'}`:wzProd(o)?(p>S.p.feedin?`${fm(p/S.p.feedin,1)}× viac ako výkup ${fpr(S.p.feedin)} €/kWh`:`výkup ${fpr(S.p.feedin)} €/kWh`):`dodávka ${fpr(WZ_SUP[0])} – ${fpr(WZ_SUP[1])} €/kWh`;
/* stav miesta bez inteligentného merania – zapojí sa až po inštalácii; po žiadosti o IMS to ukáže všade */
const wzNoIms=o=>o.imsReq?'<span class="pill y" title="Žiadosť o inteligentný elektromer (IMS) je podaná">Čaká na IMS · žiadosť podaná</span>':'<span class="pill y" title="Čaká na inteligentný elektromer (IMS)">Čaká na IMS</span>';
const wzImsReq=o=>o.imsReq?'<span class="pill g">Žiadosť o IMS podaná</span>':`<button class="link" data-act="wzims:${S.wz.oms.indexOf(o)}">Požiadať o inštaláciu</button>`;
const EIC=`<abbr title="Kód odberného miesta – nájdete ho na faktúre">EIC</abbr>`;
const wzTags=o=>omTags(wzProd(o));
const WZ_OPTS={cons:['Využívať zdieľanú elektrinu','Elektrinu od susedov dostanete lacnejšie, keď ju práve spotrebujete.'],
 prod:['Ponúkať prebytky z výroby','Prebytky z fotovoltiky ponúknete susedom za vlastnú alebo odporúčanú cenu.'],
 bat:['Ponúkať energiu z batérie','Večer ponúknete energiu uloženú v batérii, keď už slnko nesvieti.']};
/* odberné miesta načítané z účtu (demo podľa persony); dostupné možnosti podľa údajov z databázy */
function wzLoad(per,co){
 if(S.reg.demoCustomer){demoLoad();return}
 const s=SSO[per],isP=per==='anna';
 const main={id:'om1',eic:isP?'24ZZS0000000001A':'24ZZS0000000002B',addr:s.addr[co],name:isP?'Dom':'Bistro',icon:isP?'om_house':'om_shop',mwh:isP?4.2:18.6,pmwh:isP?6.8:0,on:true,ims:true,pv:isP,bat:isP&&S.bat.on};
 const cot={id:'om2',eic:isP?'24ZZS0000000011K':'24ZZS0000000012L',addr:'Záhradná 3, Piešťany',name:'Chata',icon:'om_cabin',mwh:1.1,on:true,ims:false,pv:false,bat:false};
 /* príklad miesta s výrobou aj spotrebou (rodinný dom s FVE) – Anna ho má ako hlavné miesto */
 const home={id:'om3',eic:'24ZZS0000000022P',addr:co==='vse'?'Južná 9, Košice':'Ružová 5, Trnava',name:'Rodinný dom',icon:'om_house',mwh:5.4,pmwh:5.6,on:true,ims:true,pv:true,bat:false};
 const oms=isP?[main,cot]:[main,home,cot];
 /* batéria: jedna otázka Áno / Nie pri mieste s výrobou (null = neodpovedané); Áno otvorí okno s výhodami a žiadosťou o kontakt */
 oms.forEach(o=>{o.opts={cons:o.ims,prod:o.ims&&o.pv,bat:false};o.strat=null;o.own=null;o.batAns=null;o.imsReq=o.id==='om2'&&!!(S.imsReqd||{}).chata});
 /* elektromobil: jedna otázka za zákazníka, nie za odberné miesto */
 S.wz={step:1,oms,ev:null,sent:false,err:'',edit:-1,pick:null,own:null};
}
/* kroky registrácie – rovnaké na výbere spôsobu (n=1) aj v sprievodcovi (n=2–4) */
const REG_STEPS=['Prihlásenie',...WZ_STEPS];
function wzBar(n){
 return `<ol class="wz-steps" aria-label="Kroky registrácie">${REG_STEPS.map((t,i)=>{const k=i+1,c=k<n?'done':k===n?'cur':'';return `<li class="${c}" ${k===n?'aria-current="step"':''}><span class="n">${k<n?'✓':k}</span><span class="t">${t}</span></li>`}).join('')}</ol>`;
}
/* cls: 'pri' (zelené Ďalej) alebo 'dark' – podpisové tlačidlo značky (čierne, biely text, červená bodka) */
function wzNav(back,next,nextLbl='Ďalej',dis=false,cls='pri'){
 return `<div class="wz-nav">${back?`<button class="btn lg" data-act="wzgo:${back}">← Späť</button>`:'<span></span>'}<button class="btn ${cls} lg" data-act="${next}" ${dis?'disabled':''}>${nextLbl} <span aria-hidden="true">→</span></button></div>`;
}
const wzPlaceName=o=>{const name=String(o.name||'').trim();return !name||/^Odberné miesto \d+$/.test(name)?(o.addr||'Energetické miesto'):name};
 function regNextQuestions(){return `<div class="card reg-next"><span class="kicker">Po odoslaní žiadosti</span><h3>Čo ďalej po odoslaní žiadosti?</h3>
 <details open><summary>Musím ešte niečo urobiť?</summary><p>Pri miestach s IMS teraz čakáte na overenie. V prehľade sledujte stav každého energetického miesta. Ak bude potrebné niečo doplniť, v tomto prototype zobrazíme ďalší krok simulovane.</p></details>
 <details><summary>Čo ak moje miesto ešte nemá IMS?</summary><p>V detaile miesta požiadajte o inštaláciu IMS. Zachovali sme váš výber riešenia za 1 € alebo 170 €. Samotný výber riešenia nie je odoslaním žiadosti o inštaláciu. Miesto začne zdieľať až po inštalácii a overení.</p></details>
 <details><summary>Kedy sa začne zdieľanie?</summary><p>Po schválení a splnení podmienok merania. Časová os nižšie ukazuje modelový termín; odoslanie žiadosti ešte nie je aktiváciou. V prototype možno schválenie spustiť tlačidlom „Simulovať schválenie“.</p></details>
 <details><summary>Kde uvidím výsledky a prínosy?</summary><p>Po aktivácii sa odomknú prehľady zdieľanej energie a vyúčtovania. Výpočty v registrácii sú modelové odhady; skutočný prínos závisí od nameraného priebehu spotreby a výroby.</p></details></div>`}
 const wzHead=(o)=>`<div class="wz-om-head">${omIc(o.icon)}<div><b>${esc(wzPlaceName(o))}</b><span class="wz-om-meta"><span class="xs mut">${esc(o.addr)} · ${EIC} ${esc(o.eic)}</span>${wzTags(o)}</span></div></div>`;
/* okno po „Áno“ pri batérii: výhody, čo je potrebné, žiadosť o kontakt */
function battModal(i){
 const o=S.wz&&S.wz.oms[i];if(!o)return '';
 return `<div class="modal-bg" data-act="closemodal"><div class="modal wz-bm" role="dialog" aria-modal="true" aria-labelledby="bm-h">
  <div class="row between">${omIc(o.icon)}<button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <h2 id="bm-h" style="margin-top:14px">Zdieľanie energie z batérie</h2>
  <p class="mut">${esc(o.name||o.addr)} · ${esc(o.addr)}</p>
  <ul class="wz-bm-list">
   <li><b>Zarábate aj večer.</b> Energiu z batérie ponúknete susedom vo chvíľach, keď slnko nesvieti a elektrina je najcennejšia.</li>
   <li><b>Batéria sa vám viac oplatí.</b> Uložené prebytky nekončia za nízku výkupnú cenu, ale idú susedom za cenu zdieľania.</li>
   <li><b>Pomôžete susedom aj sieti.</b> Vyrovnávate rozdiel medzi poludňajšou výrobou a večernou spotrebou v skupine.</li>
  </ul>
  <div class="wz-bm-req"><b>Čo je potrebné</b><p class="sm">Na využitie tejto služby je potrebné funkčné diaľkové riadenie batérie a splnenie ďalších technických podmienok. Možnosti s vami prejde naše zákaznícke centrum – spoločne overíme, či sa dá vaša batéria zapojiť.</p></div>
  <div class="wz-bm-act"><button class="btn" data-act="wzbatok:${i}:0">Zatiaľ nie</button><button class="btn pri" data-act="wzbatok:${i}:1">Mám záujem, kontaktujte ma</button></div>
 </div></div>`;
}
function vWizard(){
 const W=S.wz,n=W.step,sel=W.oms.filter(o=>o.on);
 let top=`<div class="lp"><section class="lp-hero lp-reg" aria-labelledby="wz-heading"><div class="lp-wrap"><span class="kicker">${W.sent?'Registrácia · hotovo':`Registrácia · krok ${n+1} z ${REG_STEPS.length}`}</span><h1 id="wz-heading">${W.sent?'Žiadosť sme prijali':(WZ_HEAD[n]||[WZ_STEPS[n-1]])[0]}<span class="sig">.</span></h1>${!W.sent&&WZ_HEAD[n]?`<p class="lead">${WZ_HEAD[n][1]}</p>`:''}${W.sent?'':wzBar(n+1)}</div></section><section class="lp-section wz"><div class="lp-wrap">`;
 const end='</div></section></div>';
 const demoNotice=S.reg.demoCustomer?'<p class="wz-info sm">Prototyp · údaje z lokálneho exportu. Ceny, párovanie, úspory a schválenie sú simulované; K dispozícii sú augustové súčty a počty 15-minútových intervalov; časové rady a zmluvy zatiaľ chýbajú.</p>':'';
 top+=demoNotice;
 const err=W.err?`<p class="supply-err" role="alert">${esc(W.err)}</p>`:'';
 const isP=(S.persona==='admin'?'peter':S.persona)==='anna';
 if(W.sent){const g=GROUPS.find(x=>x.id===S.group)||GROUPS[0];
  return top+`<div class="wz-card wz-done"><span class="supply-ok" aria-hidden="true">✓</span><div><h2>Ďakujeme, žiadosť je odoslaná</h2><p class="mut">Odoslanie žiadosti ešte neznamená aktiváciu zdieľania. Distribútor overí odberné miesta a o výsledku vás budeme informovať e-mailom aj v aplikácii.</p></div></div>
  <h2 class="wz-h">Stav odberných miest</h2><div class="wz-list">${W.oms.map(o=>{const st=!o.on?['n','Nezapojené']:!o.ims?(o.imsReq?['y','Čaká na IMS · žiadosť podaná']:['y','Čaká na IMS']):['b','Čaká na kontrolu distribútora'];return `<div class="wz-card">${wzHead(o)}<span class="pill ${st[0]}">${st[1]}</span></div>`}).join('')}</div>
  <h2 class="wz-h">Od žiadosti po prvé vyúčtovanie</h2><div class="wz-card">${regTimeline(isP,'PENDING',g)}</div>
  <div class="wz-card wz-club"><span class="wz-ic">${icon('star')}</span><div><b>Výzvy a odmeny</b><p class="sm mut">Od prvého dňa získavate iWatt za každú overenú výzvu – keď presuniete spotrebu do slnečného okna.</p></div><button class="link" data-act="view:rewards">Pozrieť odmeny →</button></div>
  <div class="wz-nav"><span></span><button class="btn pri lg" data-act="view:landing">Hotovo <span aria-hidden="true">→</span></button></div>`+end;}
 /* otázka Áno / Nie pri odbernom mieste */
 const yn=(id,v,act,q)=>`<div class="wz-q"><span id="wzq-${id}">${q}</span><span class="seg" role="group" aria-labelledby="wzq-${id}">${[[1,'Áno'],[0,'Nie']].map(([b,l])=>`<button type="button" aria-pressed="${v===!!b}" data-act="${act}:${b}">${l}</button>`).join('')}</span></div>`;
 /* možnosti zdieľania jedného odberného miesta – dostupné podľa údajov z databázy */
 const opts=(o,i)=>`<div class="wz-opts"><span class="wz-opts-h">Možnosti zdieľania</span>${Object.entries(WZ_OPTS).map(([k,[t,d]])=>{
    if(k==='bat')return '';   /* batéria má vlastné otázky nižšie */
    const avail=k==='cons'?o.ims:o.ims&&o.pv;
    if(!avail)return (k==='cons'&&!o.ims)?`<div class="wz-opt miss"><b>${t}</b><span class="xs">Chýbajú údaje na overenie: odberné miesto nemá inteligentný elektromer (IMS). ${wzImsReq(o)}</span></div>`:'';
    return `<label class="wz-opt"><input type="checkbox" data-k="wz.oms.${i}.opts.${k}" data-t="c" ${o.opts[k]?'checked':''}><span><b>${t}</b><span class="xs mut">${d}</span></span></label>`}).join('')}
   ${o.pv?yn('bat-'+i,o.batAns,'wzbat:'+i,'Máte na tomto mieste batériu a chcete z nej zdieľať energiu vo vybraných časoch?'):''}
   ${o.pv&&o.batAns?`<p class="wz-info sm">✓ Zákaznícke centrum vás bude kontaktovať a spoločne overíme možnosti zapojenia batérie.</p>`:''}</div>`;
 if(n===1)return top+`<p class="wz-lead">Vyberte, ktoré miesta zapojíte a ako budú zdieľať.</p>
  ${demoBenefitSummary()}<div class="wz-list">${W.oms.map((o,i)=>`<div class="wz-card ${o.on?'on':''}"><div class="wz-om-top"><div class="wz-om-id">${omIc(o.icon)}<div><b class="wz-addr">${esc(o.addr)}</b><span class="wz-om-meta"><span class="xs mut">${EIC} ${esc(o.eic)}</span>${wzTags(o)}</span></div></div>${F('Zapojiť','wz.oms.'+i+'.on',{t:'c'})}</div>
   <div class="wz-om-edit">${F('Názov objektu','wz.oms.'+i+'.name',{t:'x'})}${omTypeField('wz.oms.'+i+'.icon',o.icon)}</div>
   ${demoDetails(o)}${demoBenefitCard(o)}${o.on?opts(o,i):''}</div>`).join('')}</div>
  <div class="wz-card wz-extra">${yn('ev',W.ev,'wzev','Vlastníte elektromobil? <span class="xs mut">Nepovinné</span>')}</div>
  ${err}
  ${wzNav(0,'wznext')}`+end;
 if(n===2){
  const strat=(o,k)=>{const x=WZ_STRAT[k],rec=k===wzRec(o),on=W.pick===k,vol=Math.round(o.mwh*1000/12*x.sh/100);
   return `<label class="wz-st ${rec?'rec':''} ${on?'on':''}"><input type="radio" name="wz-st" data-act="wzpick:${k}" ${on?'checked':''}>
    <span class="wz-st-h"><b>${x.t}</b>${rec?'<span class="pill g">Odporúčame pre vás</span>':''}</span><span class="xs mut">${x.d}</span>
    <span class="wz-st-p"><b>${fpr(wzPrice(o,k))}</b> €/kWh</span><span class="xs mut">${wzCtx(o,wzPrice(o,k))}</span>
    <span class="wz-st-ch"><b>${x.ch} %</b><span class="xs mut">modelová šanca spárovania*</span></span><span class="bar" aria-hidden="true"><i style="width:${x.ch}%"></i></span>
    <span class="xs mut">Odhad spárovaného objemu</span><b>${vol} kWh / modelový mesiac</b>
    <span class="xs mut">Priemerný spárovaný podiel</span><b>${x.sh} %</b></label>`};
  return top+`<p class="lead wz-lead">Pre každé odberné miesto sme podľa jeho profilu prednastavili odporúčanú cenu. Môžete ju rovno prijať a pokračovať, alebo si ju upraviť. Ceny sú bez DPH.</p>
  <div class="wz-list">${sel.map(o=>{const i=W.oms.indexOf(o),ed=W.edit===i,e=wzSide(o,W.editSide),k=o.strat||wzRec(o);
   const priceBlock=side=>{const p=wzSide(o,side),st=p.strat||wzRec(p),imported=!p.strat&&wzImported(p);return `<div class="wz-pr-col"><span class="xs mut">${side==='prod'?'Cena výroby · predáte za':'Cena spotreby · zaplatíte najviac'}</span><b>${fm(wzPrice(p),5)} €/kWh</b><span class="xs mut">${wzCtx(p)}</span><span class="xs ${st===wzRec(p)?'wz-ok':'mut'}">${imported?'Simulácia · august 2026':st===wzRec(p)?'Odporúčaná cena':wzStratName(st)}</span></div>`};
   return `<div class="wz-card wz-pr ${ed?'on':''}"><div class="wz-pr-row">
    <div class="wz-pr-name">${omIc(o.icon)}<div><b>${esc(o.addr||o.name||'Bez názvu')}</b><span class="xs mut">${esc(o.name||'')}</span><span class="xs mut">${EIC} ${esc(o.eic)}</span></div></div>${wzTags(o)}
    <div class="wz-pr-col"><span class="xs mut">Ročná spotreba</span><b>${fm(o.mwh,1)} MWh</b>${o.pv?`<span class="xs mut">Ročná výroba</span><b>${o.pmwh==null?'Chýba ročný profil':fm(o.pmwh,1)+' MWh'}</b>`:''}</div>
    ${!o.ims?`<div class="wz-pr-col"><span class="xs mut">Cena</span><span class="xs mut">Nastavíte po inštalácii inteligentného elektromera</span></div>${wzNoIms(o)}`:`<div class="wz-price-pair">${o.pv?priceBlock('prod'):''}${priceBlock('cons')}</div><div class="wz-price-actions">${o.pv?`<button class="btn" data-act="wzedit:${i}:prod">Upraviť cenu výroby</button>`:''}<button class="btn" data-act="wzedit:${i}:cons">Upraviť cenu spotreby</button></div>`}</div>
    ${demoAugustDetails(o)}${ed?`<fieldset class="wz-strats"><legend>${W.editSide==='cons'?'Cena spotreby':'Cena výroby'} – ${esc(o.addr||o.name)}</legend>${['match','bal','price'].map(k=>strat(e,k)).join('')}</fieldset>
    <div class="wz-own ${W.pick==='own'?'on':''}"><label class="wz-own-h"><input type="radio" name="wz-st" data-act="wzpick:own" ${W.pick==='own'?'checked':''}><span><b>Vlastná cena</b><span class="xs mut">Nastavte si cenu sami – ${wzProd(e)?'za koľko chcete susedom predávať':'koľko najviac chcete platiť'}.</span></span></label>
     ${W.pick==='own'?`<div class="wz-own-in">${F(wzPriceLbl(e),'wz.own',{step:.001,min:0,max:1,u:'€/kWh'})}<div class="xs"><span class="mut">${wzCtx(e,W.own)}</span>${wzOwnWarn(e,W.own)?`<p class="wz-warn">${wzOwnWarn(e,W.own)}</p>`:''}</div></div>`:''}</div>
    <p class="xs mut">* Modelový odhad podľa profilu miesta a ponúk v skupine, nie záväzný prísľub.</p>
    <div class="wz-pr-act"><button class="btn" data-act="wzedit:-1">Zrušiť</button><button class="btn pri" data-act="wzprice:${i}">Potvrdiť výber</button></div>`:''}</div>`}).join('')}</div>${err}
  ${wzNav(1,'wznext')}`+end;}
 const yn3=v=>v===true?'Áno':v===false?'Nie':'Neuvedené';
 const batTxt=o=>o.batAns?'Áno – zákaznícke centrum vás bude kontaktovať':o.batAns===false?'Nie':'Neuvedené';
 const optTxt=o=>{const L=Object.entries(o.opts).filter(([,v])=>v).map(([k])=>WZ_OPTS[k][0]);return L.length?L.join(' · '):(o.ims?'Žiadna možnosť nevybraná':'Čaká na inteligentné meranie')};
 /* odhad prínosu pred odoslaním – z enginu pre odporúčanú skupinu, s rozptylom podľa istoty predikcie */
 const best=grpBest(isP),y=grpEst(best,isP).m*12,u=UNC[S.p.conf]||.2;
 return top+`<p class="lead wz-lead">Skontrolujte údaje a vstúpte do Zdieľne. Upraviť ich môžete v ktoromkoľvek kroku – vyplnené údaje zostanú.</p>
  ${S.reg.demoCustomer?demoBenefitSummary():`<div class="wz-card wz-est"><span class="xs mut">${isP?'Odhad zárobku navyše oproti výkupu':'Odhad úspory na cene elektriny'}</span><b class="wz-est-n">${eur0(y)} <small>ročne</small></b><span class="xs mut">rozpätie ${eur0(y*(1-u))} – ${eur0(y*(1+u))} · modelový odhad pri odporúčaných cenách, nie garancia</span></div>`}
  <div class="wz-list">${sel.map(o=>`<div class="wz-card wz-sum"><div class="wz-sum-top">${wzHead(o)}${o.ims?'':wzNoIms(o)}</div>
   <div class="wz-sum-row"><span class="xs mut">Odberné miesto</span><span>${esc(o.name)} · ${esc(o.addr)}</span><button class="link" data-act="wzgo:1">Upraviť</button></div>${!o.ims?`
   <div class="wz-sum-row"><span class="xs mut">Stav</span><span>${o.imsOption?'Zvolené IMS za '+esc(o.imsOption)+' € · ':''}${o.imsReq?'Žiadosť o inteligentný elektromer je podaná. Miesto zapojíme hneď po jeho inštalácii.':'Zapojíme ho hneď po inštalácii inteligentného elektromera.'}</span>${o.imsReq?'':wzImsReq(o)}</div>`:`
   <div class="wz-sum-row"><span class="xs mut">Možnosti zdieľania</span><span>${optTxt(o)}</span><button class="link" data-act="wzgo:1">Upraviť</button></div>${o.pv?`
   <div class="wz-sum-row"><span class="xs mut">Zdieľanie z batérie</span><span>${batTxt(o)}</span><button class="link" data-act="wzgo:1">Upraviť</button></div>`:''}
   <div class="wz-sum-row"><span class="xs mut">Cenové nastavenia</span><span>${o.pv?'Výroba: '+fm(wzPrice(o),5)+' €/kWh · ':''}Spotreba: ${fm(wzPrice(wzSide(o,'cons')),5)} €/kWh</span><button class="link" data-act="wzgo:2">Upraviť</button></div>`}</div>`).join('')}</div>
  <div class="wz-card wz-sum wz-extra"><div class="wz-sum-row"><span class="xs mut">Elektromobil</span><span>${yn3(W.ev)}</span><button class="link" data-act="wzgo:1">Upraviť</button></div></div>
  ${err}
  ${wzNav(2,'wzsubmit','Vstúpiť do Zdieľne<span class="sig">.</span>',false,'dark sig-btn')}`+end;
}
/* ---------- portál po „Vstúpiť do Zdieľne“: kým distribútor žiadosť neschváli, časť funkcií je zamknutá ---------- */
const REG_LOCKED={challenges:['Výzvy','Denné výzvy na presun spotreby do slnečného okna a slnečné body.'],group:['Skupina zdieľania','Uvidíte svoju skupinu, susedov, s ktorými zdieľate, a stav členstva.'],
 reports:['Prehľady','Uvidíte, koľko elektriny ste zdieľali alebo prijali a akú to malo hodnotu v €.'],
 cert:['Dobrý sused','Darovanie cez Lúč pomoci a odporúčanie Zdieľne susedom.'],
 rewards:['Odmeny','Začnete zbierať '+IWT+' a odznaky a meniť ich za výhody.']};
const regPer=()=>S.persona==='admin'?'peter':S.persona;
const regPending=()=>!!(S.wz&&S.wz.sent)&&S.mem[regPer()]==='PENDING';
/* kroky žiadosti – rovnaké ako v časovej osi regTimeline */
function regSteps4(){
 const now=new Date(),act=new Date(now.getFullYear(),now.getMonth()+1,1),inv=new Date(act.getFullYear(),act.getMonth()+1,10);
 const D=x=>x.toLocaleDateString('sk-SK',{day:'numeric',month:'numeric',year:'numeric'});
 return [['Žiadosť odoslaná','dnes','done'],['Kontrola distribútora','do 5 pracovných dní','cur'],['Začína zdieľanie',D(act),''],['Prvé vyúčtovanie','do '+D(inv),'']];
}
/* stavový riadok – na každej obrazovke portálu, kým žiadosť nie je schválená */
function pendingBar(){
 const L=regSteps4();
 return `<section class="pend-bar" aria-label="Stav žiadosti"><div class="pend-bar-head"><span class="pend-ic">${icon('clock')}</span><div><b>Žiadosť čaká na schválenie</b><span class="xs mut">Kým ju distribútor neschváli, Výzvy, Skupina zdieľania, Prehľady, Odmeny a Dobrý sused sú zamknuté.</span></div>
  ${(S.jury||S.reg.demoCustomer)?'<button class="btn sm" data-act="regapprove">🎬 Simulovať schválenie</button>':''}</div>
  <ol class="pend-steps">${L.map(([t,w,c],i)=>`<li class="${c}" ${c==='cur'?'aria-current="step"':''}><span class="n">${c==='done'?'✓':i+1}</span><span><b>${t}</b><span class="xs mut">${w}</span></span></li>`).join('')}</ol></section>`;
}
/* Domov počas čakania: stav žiadosti, odberné miesta, odhad a čo sa odomkne */
function vHomePending(){
 const per=regPer(),isP=per==='anna',W=S.wz,g=GROUPS.find(x=>x.id===S.group)||GROUPS[0],best=grpBest(isP),y=grpEst(best,isP).m*12;
 const st=o=>!o.on?['n','Nezapojené']:!o.ims?['y',o.imsReq?'Čaká na IMS · žiadosť podaná':'Čaká na IMS']:['b','Čaká na kontrolu distribútora'];
 return `<div class="gap">${hero({kicker:'Vitajte v Zdieľni',title:`${esc(S.reg.demoCustomer?demoCustomerName():SSO[per].name.split(' ')[0])}, <em>vaša žiadosť je na ceste.</em>`,
   lead:'Distribútor overí vaše odberné miesta do 5 pracovných dní. Hneď po schválení sa odomkne celá Zdieľňa a začnete zdieľať.',
   acts:S.jury?'<button class="btn" data-act="regapprove">🎬 Simulovať schválenie</button>':'',
   aside:hstat(isP?'Odhad zárobku navyše':'Odhad úspory',eur0(y)+' ročne','modelový odhad, nie garancia')})}
  ${pendingBar()}
  <div class="card"><span class="kicker">Vaše energetické miesta</span><h3>Stav zapojenia</h3><div class="pend-oms">${(W.oms||[]).map(o=>{const s=st(o);return `<div class="pend-om">${wzHead(o)}<div class="pend-place-status">${!o.ims&&o.imsOption?`<span class="xs mut">Zvolené IMS za ${esc(o.imsOption)} €</span>`:''}<span class="pill ${s[0]}">${s[1]}</span>${o.on&&!o.ims?wzImsReq(o):''}</div></div>`}).join('')}</div></div>
  ${regNextQuestions()}
  <div class="card"><span class="kicker">Od žiadosti po prvé vyúčtovanie</span><h3>Čo sa bude diať</h3>${regTimeline(isP,'PENDING',g)}</div>
  <div class="card"><span class="kicker">Po schválení</span><h3>Čo sa vám odomkne</h3><div class="pend-locks">${Object.entries(REG_LOCKED).map(([k,[t,d]])=>`<div class="pend-lock"><span class="pend-ic">${icon('lock')}</span><div><b>${t}</b><p class="sm mut">${d}</p></div></div>`).join('')}</div>
   <p class="sm mut" style="margin-top:12px">Medzitým si môžete pozrieť <button class="link" data-act="view:map">mapu zdieľania</button> alebo upraviť <button class="link" data-act="view:profile">nastavenia</button>.</p></div></div>`;
}
/* zamknutá obrazovka počas čakania na schválenie */
function vLocked(v){
 const [t,d]=REG_LOCKED[v];
 return `<div class="gap"><div class="card pend-locked"><span class="pend-ic lg">${icon('lock')}</span><h2>${t} sprístupníme po schválení<span class="sig">.</span></h2><p class="mut">${d} Sprístupní sa hneď, ako distribútor schváli vašu žiadosť – dáme vám vedieť e-mailom aj v aplikácii.</p><button class="btn pri" data-act="view:home">Späť na Domov</button></div></div>`;
}
function vRegister(){
  const R=S.reg,per=S.persona==='admin'?'peter':S.persona,sso=SSO[per],co=R.company,coN=SKN[co];
  if(R.step==='full')return vOnb();
  if(R.step==='wiz'&&S.wz)return vWizard();
  const demo=`<div class="pill vis" style="margin-bottom:10px">🔒 Simulované prihlásenie (demo) – nezadávate meno ani heslo</div>`;
  const L=S.landing||{};
  /* výber spôsobu registrácie – v dizajne úvodnej stránky, bez značky (ZSE/VSE sa zapne až po výbere) */
  if(R.step==='choose')return `<div class="lp"><section class="lp-hero lp-reg" aria-labelledby="reg-heading"><div class="lp-wrap">
   <span class="kicker">${L.checked&&L.eic?`Registrácia · EIC ${maskEic(L.eic)} ✓`:'Registrácia'}</span>
   <h1 id="reg-heading">Zaregistrujte sa <em>za minútu<span class="sig">.</span></em></h1>
   <div class="lp-reg-grid"><div><p class="lp-intro">Vyberte spôsob registrácie nižšie.</p></div><ol class="lp-steps" aria-label="Kroky registrácie">${REG_STEPS.map((t,k)=>`<li class="${k===0?'cur':''}" ${k===0?'aria-current="step"':''}><span class="n">${k+1}</span><span class="t">${t}</span></li>`).join('')}</ol></div>
  </div></section>
  <section class="lp-section lp-reg-choose"><div class="lp-wrap"><div class="lp-paths">
   <article class="lp-path"><span class="kicker">Rýchla cesta</span><h3>Som zákazník ZSE alebo VSE</h3><p>Prihláste sa svojím zákazníckym účtom – spoločnosť rozpoznáme sami a údaje o odberných miestach, inteligentnom meraní a zmluvách doplníme za vás.</p>
    <div class="logos dual"><button class="login-btn" data-act="login" aria-label="Prihlásiť sa účtom ZSE alebo VSE"><span class="dual-logos"><img src="${LOGO_OFF.zse}" alt=""><i aria-hidden="true"></i><img src="${LOGO_OFF.vse}" alt=""></span><span>Prihlásiť sa</span><span aria-hidden="true">→</span></button><button class="btn out acc-btn" data-act="acc">Vytvoriť online účet</button></div><p class="lp-reg-tip">Nemáte online účet? Založíme vám ho z údajov na faktúre – stačí minúta.</p>${icon('bolt','path-art')}</article>
   <article class="lp-path consumer"><span class="kicker">Iný dodávateľ</span><h3>Som zákazník inej spoločnosti</h3><p>Spustite registráciu – za pár krokov pridáte odberné miesto, overíme inteligentné meranie a odporučíme skupinu. Dodávateľa meniť nemusíte.</p>
    <button class="btn dark" data-act="regfull">Spustiť registráciu →</button><p class="lp-reg-tip">Zákazníci ZSE a VSE sa prihlásia jedným klikom a v Slnečnom klube majú výhody navyše. <button class="link" data-act="supply">Pozrieť ponuku dodávky →</button></p>${icon('pen','path-art')}</article>
  </div></div></section></div>`;
  /* načítanie účtu – priebeh v percentách, kroky s výsledkom, oznámenie pre čítačky, istota bezpečia, Zrušiť; po dokončení krátky stav „pripravené“ */
  if(R.step==='load'){const n=SSO_STEPS.length,done=Math.min(R.load,n),ok=done>=n,fd=ssoFound(per,co),pc=Math.round(done/n*100);
   return `<div class="lp"><section class="lp-hero lp-reg" aria-labelledby="load-heading"><div class="lp-wrap"><span class="kicker">Registrácia · krok 1 z ${REG_STEPS.length}</span><h1 id="load-heading">${ok?'Účet je pripravený':'Načítavame váš účet'}<span class="sig">.</span></h1>${wzBar(1)}</div></section>
   <section class="lp-section wz"><div class="lp-wrap"><div class="wz-card ssl ${ok?'done':''}">
    <div class="ssl-head"><div><b>Zákaznícky účet ${coN}</b><span class="xs mut">${ok?'Všetko sme načítali. O chvíľu pokračujeme na vaše odberné miesta.':'Zvyčajne to trvá pár sekúnd. Nezatvárajte okno.'}</span></div><b class="ssl-pc">${pc} %</b></div>
    <div class="ssl-bar" role="progressbar" aria-label="Priebeh načítania účtu" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pc}"><i style="width:${pc}%"></i></div>
    <ol class="ssl-steps">${SSO_STEPS.map((s,i)=>{const st=i<done?'ok':i===done?'run':'wait';return `<li class="${st}"><span class="ssl-i" aria-hidden="true">${st==='ok'?'✓':st==='run'?'<span class="spin"></span>':i+1}</span><span class="ssl-t"><b>${s}</b>${st==='ok'?`<span class="xs mut">${fd[i]}</span>`:''}<span class="sr">${st==='ok'?' – hotovo':st==='run'?' – prebieha':' – čaká'}</span></span></li>`}).join('')}</ol>
    <p class="sr" role="status" aria-live="polite">${ok?'Účet je pripravený.':done?fd[done-1]+'.':SSO_STEPS[0]+'.'}</p>
    <div class="ssl-foot"><span class="ssl-sec">${icon('shield')}<span class="xs mut">Lokálne testovacie údaje. Prihlásenie aj kontrola zmlúv sú simulované.</span></span>${ok?'':'<button class="btn" data-act="regback">Zrušiť</button>'}</div>
    ${S.jury?`<p class="xs mut">Demo: prihlásenie je simulované – nezadávate meno ani heslo.</p>`:''}
   </div></div></section></div>`}
  const om=S.om[per],ims=per==='anna'?S.p.ims:S.c.ims,m=S.mem[per],isP=per==='anna';
  const sent=!!R.sent,g=GROUPS.find(x=>x.id===(sent?R.group:S.ob.group))||GROUPS[0];
  const reg=regionOf(geo(om.addr).ll),best=sent?g:grpBest(isP),bm=grpEst(best,isP).m*12;
  const ok=(t,sub,c='ok')=>`<div class="vf ${c}"><span class="vf-i" aria-hidden="true">${c==='ok'?'✓':c==='no'?'✕':'!'}</span><div><b>${t}</b>${sub?`<div class="xs mut">${sub}</div>`:''}</div></div>`;
  const rows=[
   ok(`Zákaznícky účet ${coN} overený`,`${sso.name} · č. ${co==='zse'?'4100':'7300'}${isP?'2187':'5530'} (ilustračné) · bez zadávania hesla`),
   ok(`${esc(om.id)} – ${ims?'môže zdieľať':'zatiaľ nemôže zdieľať'}`,`${esc(om.addr)} · ${omLabel(om.type)} · ${ims?'inteligentné meranie (IMS) s 15-min údajmi ✓':'chýba inteligentné meranie <button class="link" data-act="imsreq">Požiadať o IMS</button>'}`,ims?'ok':'no'),
   ok('SK-OM-0002 – zatiaľ nemôže zdieľať','Záhradná 3, Piešťany · chata · chýba inteligentné meranie <button class="link" data-act="imsreq">Požiadať o IMS</button>','no'),
   ok(isP?`Rola: výrobca – fotovoltika ${fm(om.kwp||6.5,1)} kWp${S.bat.on?` + batéria ${fm(S.bat.cap,0)} kWh`:''}`:'Rola: odberateľ – bez vlastných panelov',isP?'Prebytky ponúknete susedom, zvyšok ide ako doteraz výkupcovi.':'Budete dostávať slnečnú elektrinu zo striech susedov.'),
   ok(`Zmluvy ostávajú: dodávka ${coN}${isP?' aj výkup prebytkov':''}`,'Dodávateľa ani elektromer meniť nemusíte.'),
   ok(`Oblasť ${REG[reg]?REG[reg].name+' ('+REG[reg].co+')':''} – služba je dostupná`,(n=>n===1?'V okolí je 1 skupina s voľnými miestami.':`V okolí sú ${n} skupiny s voľnými miestami.`)(GROUPS.filter(x=>x.reg===reg&&!gOcc(x).full).length),REG[reg]&&REG[reg].on===false?'warn':'ok')];
  const todo=sent?`<div class="todo done"><b>Teraz nemusíte robiť nič.</b> Žiadosť do skupiny <b>${g.name}</b> je odoslaná – odhad ${isP?'zárobku navyše':'úspory'} v nej je <b>${eur0(grpEst(g,isP).m*12)} ročne</b>. Ozveme sa e-mailom aj v aplikácii, keď ju distribútor potvrdí.</div>`
   :`<ol class="todo"><li><b>Porovnajte skupiny.</b> Pri každej vidíte, koľko ${isP?'zarobíte navyše':'ušetríte'} za rok a koľko kWh sa vymení.</li><li><b>Vyberte jednu.</b> Odporúčanú ★ sme predvybrali podľa vášho profilu – stačí ju nechať.</li><li><b>Potvrďte súhlas a odošlite žiadosť.</b> Nič nepodpisujete ani neplatíte, bez záväzku.</li></ol>`;
  return `<div class="gap">${hero({top:demo.replace('margin-bottom:10px','margin:0'),kicker:sent?'Registrácia · žiadosť odoslaná':'Registrácia · krok 2 z 3',title:`Vitajte, ${sso.name.split(' ')[0]}. <em>${sent?'Žiadosť je odoslaná.':'Nájdime vám skupinu.'}</em>`,
    lead:sent?`Skupina ${g.name} · čaká na kontrolu distribútora. Nižšie vidíte, čo sa bude diať ďalej.`:`Účet ${coN} sme overili a načítali vaše odberné miesta. Vyberte skupinu susedov – ukážeme, koľko v ktorej ${isP?'zarobíte':'ušetríte'}.`,
    extra:regSteps(sent?2:1),
    aside:hstat(isP?'Odhad zárobku navyše':'Odhad úspory','až '+eur0(bm*(1+(UNC[S.p.conf]||.2))),'ročne v skupine '+best.name)+hstat('Môže zdieľať',`${ims?1:0} z 2 OM`,'chata potrebuje IMS')})}
   <div class="card"><span class="kicker">Výsledok overenia</span><h3>Čo sme o vás zistili</h3><div class="vf-grid">${rows.join('')}</div></div>
   <div class="card"><span class="kicker">Krok 2 · Nájdite svoju zhodu</span><h3>${sent?'Čo robiť teraz':'Čo máte urobiť'}</h3>${todo}
    ${sent?'':`<div style="margin-top:16px">${grpCompare(isP,S.ob.group,'grp2')}</div><p class="xs mut" style="margin-top:8px">Odhad pre vaše odberné miesto z modelového dňa (${S.sim.days} slnečných dní v mesiaci), nie garancia. Skutočná suma závisí od počasia a od toho, kedy spotrebúvate.</p>`}</div>
   ${sent?'':`<div class="card"><h3>Potvrďte súhlas a odošlite žiadosť</h3><div style="margin-top:8px">${F('Súhlasím s použitím 15-minútových dát z inteligentného merania','ob.consent',{t:'c'})}</div>${condList()}
    <div class="row" style="margin-top:14px"><button class="btn pri lg" data-act="ssosubmit" ${S.ob.consent?'':'disabled'}>Odoslať žiadosť do skupiny ${g.name} →</button><button class="btn" data-act="regback">Zmeniť spôsob</button></div>${S.ob.consent?'':'<p class="xs mut" style="margin-top:6px">Tlačidlo sa odomkne po zaškrtnutí súhlasu.</p>'}</div>`}
   <div class="card"><span class="kicker">${sent?'Čo bude ďalej':'Čo sa stane po odoslaní'}</span><h3>Od žiadosti po prvé vyúčtovanie</h3>${regTimeline(isP,sent?'PENDING':'NONE',g)}
    ${sent?`<div class="row" style="margin-top:16px"><button class="btn pri" data-act="view:group">Skupina zdieľania →</button><button class="btn" data-act="view:home">Pozrieť, ako bude vyzerať Domov</button></div>`:''}</div></div>`;
}


