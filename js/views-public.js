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
function lpHouse(roof='var(--lp-roof)',body='#f4ece0',panels=true){return `<g><path d="m20 65 75-43 75 43-75 43Z" fill="${roof}"/><path d="M25 68v55l70 41v-56Z" fill="${body}"/><path d="M95 108v56l70-41V68Z" fill="#d6cbbd"/><path d="m42 84 17 10v25l-17-10Zm32 19 12 7v34l-12-7Z" fill="#4a4652"/><path d="m111 107 16-9v24l-16 9Zm26-15 15-8v24l-15 9Z" fill="#625d6c"/>${panels?'<path d="m47 61 47-27 48 28-47 27Z" fill="#2c2b3a" stroke="#9c9db1"/><path d="m59 54 48 28m-35-35 48 28M83 40l48 28M63 71l47-27m-31 36 47-27" stroke="#87889f" stroke-width=".7"/>':''}</g>`}
function lpScene(){return `<svg viewBox="0 0 580 500" role="img" aria-label="Dom s fotovoltikou zdieľa elektrinu s ďalšou domácnosťou a elektromobilom">
 <defs><radialGradient id="lpglow"><stop stop-color="var(--accent-dark)" stop-opacity=".2"/><stop offset="1" stop-color="var(--accent-dark)" stop-opacity="0"/></radialGradient><linearGradient id="lpbase" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".14"/><stop offset="1" stop-color="#ffffff" stop-opacity=".04"/></linearGradient></defs>
 <circle cx="300" cy="220" r="225" fill="url(#lpglow)"/><circle cx="316" cy="220" r="176" fill="none" stroke="#ffffff12"/><circle cx="316" cy="220" r="218" fill="none" stroke="#ffffff0b"/>
 <circle cx="190" cy="82" r="33" fill="var(--yellow)"/><g stroke="var(--yellow)" stroke-width="2"><path d="M190 36v-9m0 100v9m-46-54h-9m100 0h9m-87-33-6-6m72 72 6 6m-72-6-6 6m72-72 6-6"/></g>
 <path d="m41 297 269-153 242 140-272 158Z" fill="url(#lpbase)" stroke="#ffffff26"/><path d="M41 297v16l239 145v-16Zm239 145v16l272-158v-16" fill="#00000033"/>
 <path d="m140 293 122 70 193-109" fill="none" stroke="var(--yellow)" stroke-width="4" stroke-dasharray="5 8"/><path d="m263 362 1 38 86-49" fill="none" stroke="var(--yellow)" stroke-width="3" stroke-dasharray="5 8"/>
 <g transform="translate(80 135) scale(1.2)">${lpHouse()}</g><g transform="translate(330 210) scale(.91)">${lpHouse('#a1b5a0','#eee8d9',false)}</g>
 <g transform="translate(327 334)"><path d="m0 8 24-14 46 26-23 15Z" fill="#b8ccb3"/><path d="m9 5 17-21 25 15 7 18Z" fill="#e8e9cf"/><path d="m17 2 11-12 17 10 2 13Z" fill="#514c62"/><path d="M0 8v13l46 27V35Z" fill="#90a992"/><path d="m46 35 24-15v13L46 48Z" fill="#789080"/><ellipse cx="12" cy="28" rx="6" ry="9" fill="#2f293a"/><ellipse cx="58" cy="36" rx="6" ry="9" fill="#2f293a"/></g>
 <g fill="#789b82"><path d="m74 343-14-7v-37l14 7Z"/><ellipse cx="65" cy="290" rx="15" ry="25"/><path d="m488 264-5-2v-40l5 2Z"/><ellipse cx="486" cy="211" rx="14" ry="24"/></g>
 <g transform="translate(267 260)"><circle r="23" fill="var(--brand)" stroke="#fff" stroke-width="2"/><path d="m4-15-17 19H0l-4 13L14-3H2Z" fill="#fff"/></g>
 <g fill="var(--yellow)"><circle cx="265" cy="363" r="5"/><circle cx="399" cy="286" r="4"/><circle cx="347" cy="351" r="4"/></g>
 </svg>`}
/* čísla na úvode počíta ten istý engine ako aplikácia */
function lpNums(){
 const r=potRun(),a=agg(r),P=r.P,win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),d=S.sim.days;
 const succ=a.anna.offered>0?a.anna.shared/a.anna.offered:0;
 return {gainMonth:a.anna.vsVykup*d,win:win?I2T(win.a)+' – '+I2T(win.b):'11:00 – 14:00',goal:Math.min(1,succ/.8),pts:gainFor(recAppTime()).pts};
}
function vLanding(){
 const l=S.landing||{},n=lpNums();
 const offers=[
  ['Slnečné poludnie','Prebytky zo strechy, keď slnko ide naplno.',fm(S.p.price,2),`${S.p.pStart} – ${S.p.pEnd}`,'FVE','sun','landingoffer:0'],
  ['Energia po západe','Večerná ponuka z fyzickej batérie.',fm(S.bat.price,2),`${S.bat.eStart} – ${S.bat.eEnd}`,'FVE + batéria','battery','landingoffer:1'],
  ['Slnko pre dobrú vec','Darované prebytky pre vybraných príjemcov.','0,00','Podľa dostupnosti','Solidárna ponuka','heart','landingfeature:solidarity']];
 return `<div class="lp">
 <section class="lp-hero" aria-labelledby="lp-heading"><div class="lp-wrap"><div class="lp-hero-grid"><div>
 <span class="kicker">Zdieľňa · zdieľanie elektriny</span>
 <h1 id="lp-heading">Zelená energia je ešte lepšia, <em>keď sa zdieľa<span class="sig">.</span></em></h1>
 <p class="lp-intro">Máte elektrinu navyše? Podeľte sa o ňu a získajte viac. Nemáte vlastné panely? Využite slnečnú energiu od susedov.</p>
 <form id="lp-eic-form" novalidate><label class="lp-eic-label" for="lp-eic">Zistite, čo môže zdieľanie priniesť vám</label><div class="lp-eic-box"><input id="lp-eic" name="eic" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="lp-eic-help${l.error?' lp-eic-error':''}" aria-invalid="${l.error?'true':'false'}" placeholder="Váš 16-miestny EIC kód" maxlength="24" value="${esc(l.eic||'')}"><button class="btn pri" type="button" data-act="eiccheck">Zistiť môj potenciál <span aria-hidden="true">→</span></button></div>${l.error?`<div class="lp-error" id="lp-eic-error" role="alert">${esc(l.error)}</div>`:''}
 <p class="lp-eic-help" id="lp-eic-help">EIC nájdete na faktúre za elektrinu. <a href="#eic-faq">Kde presne?</a> Nemáte ho poruke? <button type="button" class="lp-chip" data-act="eicfill">Vložiť ukážkový kód</button></p></form>
 <div class="lp-demo-links"><span>Nemáte kód poruke?</span><button class="link" data-act="eicdemo:anna">Skúsiť výrobcu</button><span aria-hidden="true">·</span><button class="link" data-act="eicdemo:peter">Skúsiť odberateľa</button></div>
 <div class="lp-hero-checks"><span><i class="lp-dot"></i> Bez záväzku</span><span><i class="lp-dot"></i> Bez vlastných panelov</span><span><i class="lp-dot"></i> Cena pod kontrolou</span></div>
 </div><div class="lp-scene">${lpScene()}<div class="lp-float one"><span class="tag">Keď strecha nezaháľa</span><b>+ ${eur(n.gainMonth)}</b><span class="positive">oproti výkupu za ${S.sim.days} modelových dní</span></div><div class="lp-float two"><div class="lp-live"><i></i> Slnko práve spája</div><b>${n.win}</b><span>Čas na slnečnú elektrinu</span></div></div></div>
 <div class="lp-hero-foot"><span>Hackathon 2026 · modelové dáta</span></div></div></section>
 <div class="lp-wrap"><div class="lp-promises">${[['shield','Vy rozhodujete','Cenu poznáte vopred.'],['home','S panelmi aj bez nich','Svoje miesto si nájde každý.'],['clock','Správna energia, správny čas','Spájame výrobu so spotrebou.'],['chart','Žiadne hádanie','kWh aj eurá v jednom prehľade.']].map(([i,h,p])=>`<div class="lp-promise">${icon(i)}<div><b>${h}</b><small>${p}</small></div></div>`).join('')}</div></div>
 <section class="lp-section" id="lp-benefits"><div class="lp-wrap"><div class="lp-section-head"><div><span class="kicker">Dve strany. Jedna dobrá myšlienka.</span><h2>Zo slnka môže mať viac každý<span class="sig">.</span></h2></div></div><div class="lp-paths">
 <article class="lp-path"><span class="kicker">Mám fotovoltiku</span><h3>Nech vaša strecha pracuje aj pre vás.</h3><p>Dajte prebytkom lepšie využitie. Ponúknite ich za vlastnú cenu a sledujte, čo vám zostane po provízii.</p><ul><li>Vlastná cena a prehľadný čistý príjem</li><li>Odporúčané prepojenia s odberateľmi</li><li>Porovnanie so súčasným výkupom</li></ul><button class="btn dark" data-act="eicdemo:anna">Pozrieť môj potenciál →</button>${icon('sun','path-art')}</article>
 <article class="lp-path consumer"><span class="kicker">Nemám fotovoltiku</span><h3>Na slnečnú elektrinu nepotrebujete strechu.</h3><p>Vyberte si elektrinu od ľudí, ktorí jej majú navyše. Najväčší zmysel dáva vtedy, keď ju práve využijete.</p><ul><li>Výhodnejšia cena zdieľanej elektriny</li><li>Odporúčanie vhodného času spotreby</li><li>Bez provízie platforme pre odberateľa</li></ul><button class="btn dark" data-act="eicdemo:peter">Nájsť svoju príležitosť →</button>${icon('home','path-art')}</article>
 </div></div></section>
 <section class="lp-section lp-how" id="lp-how"><div class="lp-wrap"><div class="lp-how-grid"><div><span class="kicker">Menej vybavovania. Viac energie.</span><h2>Začína sa to jedným kódom<span class="sig">.</span></h2><p class="lead">Žiadne hľadanie susedov ani tabuľky. Prevedieme vás od prvého odhadu po prehľad výsledkov.</p></div><div class="lp-step-grid"><article><span class="lp-step-num">01</span><h3>Zadajte EIC</h3><p>Identifikujte svoje odberné miesto. V ukážke si bezpečne vyskúšate modelový profil.</p></article><article><span class="lp-step-num">02</span><h3>Nájdite svoju zhodu</h3><p>Porovnajte cenu aj čas. Vyberte si ponuku alebo nastavte vlastné prebytky.</p></article><article><span class="lp-step-num">03</span><h3>Zdieľajte a sledujte</h3><p>Po schválení zapojenia uvidíte zdieľané kWh, príjem, úsporu aj zúčtovanie.</p></article></div></div><p class="note">V ostrej službe bude načítanie dát vyžadovať overenie a oprávnenie. Samotný EIC nie je prihlásenie ani súhlas so zdieľaním.</p></div></section>
 <div class="lp-wrap" id="lp-club"><section class="lp-club"><div><span class="kicker">Zoznámte sa so Slnečným klubom</span><h2>Dobré návyky. Ešte lepší pocit<span class="sig">.</span></h2><p class="lead">Zbierajte body za rozumný presun spotreby, plňte slnečné výzvy a pomáhajte svojej skupine využiť viac prebytkov.</p><button class="btn light lg" data-act="landingfeature:rewards">Objaviť slnečné výzvy →</button></div><div class="lp-challenge"><span class="pill y">+ ${n.pts} bodov · dnešná výzva</span><h3>Dnes perieme so slnkom.</h3><p>Presuňte plánované pranie do okna ${n.win}. Malá zmena pre vás, lepšie využité prebytky pre všetkých.</p><div class="lp-progress" role="img" aria-label="Komunitný cieľ splnený na ${pct(n.goal)}"><span style="width:${(n.goal*100).toFixed(0)}%"></span></div><div class="lp-challenge-bottom"><span>Cieľ skupiny Slnečný kruh 17</span><b>${pct(n.goal)} splnené</b></div><p class="note">Body nemajú peňažnú hodnotu; prideľujú sa po overení podľa IMS, nie za vyššiu spotrebu.</p></div></section></div>
 <section class="lp-section" id="lp-offers"><div class="lp-wrap"><div class="lp-section-head"><div><span class="kicker">Trhovisko plné možností</span><h2>Elektrina, ktorá zapadne do vášho dňa<span class="sig">.</span></h2></div><p class="lead">Od obedného slnka po večernú energiu z batérie. Vyberajte podľa toho, ako žijete.</p></div><div class="lp-offers">${offers.map(([h,p,price,time,tag,i,act],idx)=>`<article class="lp-offer"><div class="lp-offer-art"><span class="pill c">${tag}</span>${idx===0?`<svg viewBox="0 0 190 175" aria-hidden="true">${lpHouse()}</svg>`:icon(i)}</div><div class="lp-offer-body"><h3>${h}</h3><p>${p}</p><div class="lp-offer-price">${price} € <span>/ kWh</span></div><div class="lp-offer-meta"><span>${time}</span><b>${idx===2?'bez provízie':'ponuka v deme'}</b></div><button class="btn out block" data-act="${act}">${idx===2?'Ako funguje darovanie':'Preskúmať v deme'} →</button></div></article>`).join('')}</div><p class="note">Ceny elektriny bez distribučných, regulovaných a fixných poplatkov. Ceny a časy sú aktuálne parametre dema – zmeníte ich v ⚙. Darovanie závisí od zapojenia oprávneného príjemcu.</p></div></section>
 <section class="lp-section lp-smart"><div class="lp-wrap lp-smart-grid"><div><span class="kicker">Trochu iný čas. Lepší výsledok.</span><h2>Slnko má svoj plán. Vy z neho môžete vyťažiť viac<span class="sig">.</span></h2><p class="lead">Umývačka po obede. Nabíjanie cez deň. Malý posun plánovanej spotreby môže znamenať viac využitej elektriny a väčšiu úsporu.</p><p class="lead">Predikcia ukáže vhodný čas. Vy rozhodnete, čo sa vám hodí.</p><button class="btn dark lg" style="margin-top:24px" data-act="landingfeature:forecast">Vyskúšať posun spotreby →</button></div><div class="lp-chart-card"><div class="row between"><h3>Váš slnečný zajtrajšok</h3><span class="pill c">Ukážka predikcie</span></div><div class="lp-chart-legend"><span><i class="prod"></i> Dostupné prebytky</span><span><i class="cons"></i> Vaša spotreba</span></div><svg viewBox="0 0 430 205" role="img" aria-label="Ilustračný graf: dostupné prebytky vrcholia na poludnie a presun spotreby zvyšuje ich využitie"><path d="M20 40h390M20 90h390M20 140h390M20 175h390" stroke="var(--line)" fill="none"/><rect x="156" y="20" width="120" height="155" fill="var(--yellow-t)" rx="8"/><path d="M20 175C70 175 90 160 123 127S164 43 209 37 262 72 299 118 345 169 410 175Z" fill="var(--c-prod)" fill-opacity=".28"/><path d="M20 175C70 175 90 160 123 127S164 43 209 37 262 72 299 118 345 169 410 175" stroke="var(--c-prod)" stroke-width="3" fill="none"/><path d="M20 149 75 143 120 151 158 95 185 115 217 68 249 104 277 127 318 140 365 147 410 139" stroke="var(--c-cons)" stroke-width="3" fill="none"/><g fill="var(--mut)" font-family="Figtree,sans-serif" font-size="11"><text x="14" y="199">06:00</text><text x="140" y="199">10:00</text><text x="267" y="199">14:00</text><text x="380" y="199">18:00</text></g></svg><div class="lp-chart-result"><b>Vaše slnečné okno: ${n.win}</b>Skúste sem presunúť plánované nabíjanie alebo umývanie riadu.</div><p class="note">Ilustračná predikcia. Skutočná výroba aj spotreba sa môžu líšiť.</p></div></div></section>
 <section class="lp-section"><div class="lp-wrap"><div class="lp-section-head"><div><span class="kicker">Viac než predaj prebytkov</span><h2>Každá domácnosť má svoju supervýhodu<span class="sig">.</span></h2></div><p class="lead">Panely, batéria, elektromobil alebo len chuť využívať energiu rozumnejšie.</p></div><div class="lp-ecosystem">${[['battery','Máte batériu?','Slnko nemusí skončiť západom. Pozrite si, kedy má zmysel ponúknuť energiu uloženú vo fyzickej batérii.','Preskúmať batériu','battery'],['car','Nabíjate doma?','Spojte plánované nabíjanie s časom prebytkov. V deme uvidíte, čo presun spraví s využitím aj cenou.','Nabíjať v správny čas','ev'],['chart','Chcete mať jasno?','Prebytky, využitie, príjem aj provízia. V jednom prehľade, s vysvetlením každej sumy.','Pozrieť prehľady','reports']].map(([i,h,p,b,a])=>`<article class="lp-eco">${icon(i)}<h3>${h}</h3><p>${p}</p><button class="link" data-act="landingfeature:${a}">${b} →</button></article>`).join('')}</div></div></section>
 <section class="lp-section" id="lp-faq"><div class="lp-wrap lp-faq"><div><span class="kicker">Dobré otázky si zaslúžia jasné odpovede</span><h2>Poďme si to rozsvietiť<span class="sig">.</span></h2><p class="lead">Zdieľanie bez zbytočného žargónu. Ak niečo chýba, opýtajte sa nášho demo asistenta.</p><button class="link" style="margin-top:24px" data-act="chat">Opýtať sa asistenta →</button></div><div>
 <details id="eic-faq"><summary>Kde nájdem EIC a čo sa po zadaní stane?</summary><p>EIC je 16-miestny identifikátor odberného miesta. Nájdete ho na faktúre alebo v zákazníckom účte pri údajoch o odbernom mieste. V tomto prototype kód neoverujeme v externom systéme. Ukážkové kódy načítajú len modelový profil; vlastný kód neposielame na server.</p></details>
 <details><summary>Môžem sa zapojiť aj bez fotovoltiky?</summary><p>Áno. Ako odberateľ môžete využívať prebytky iných výrobcov. Rozhoduje dostupnosť vhodnej ponuky a časový súbeh vašej spotreby s výrobou.</p></details>
 <details><summary>Ušetrím uvedenú sumu z celého účtu?</summary><p>Ukazujeme úsporu na cene zdieľanej elektriny oproti porovnávanej cene dodávky. Distribučné, regulované a fixné poplatky tým automaticky nezanikajú. Odhad nie je garantovaný výsledok.</p></details>
 <details><summary>Čo ak ešte nemám inteligentný elektromer?</summary><p>V deme si môžete pozrieť odhad aj bez neho. Pre aktívne zdieľanie potrebujete vhodné intervalové meranie a splnenie podmienok zapojenia. Prototyp obsahuje aj virtuálnu žiadosť o IMS.</p></details>
 <details><summary>Začne sa zdieľanie hneď po zadaní EIC?</summary><p>Nie. Najskôr si pozriete ponuku, potvrdíte potrebné údaje a súhlasy a odošlete žiadosť. Zdieľanie začne až po schválení a aktivácii. Jedno odberné miesto môže byť aktívne len v jednej skupine zdieľania.</p></details>
 <details><summary>Môžem si elektrinu z obeda nechať na večer?</summary><p>Zdieľanie sa vyhodnocuje v rovnakých 15-minútových intervaloch. Presun na večer vyžaduje skutočné uloženie energie, napríklad do fyzickej batérie. Samotné zdieľanie ju neukladá.</p></details>
 </div></div></section>
 <div class="lp-wrap"><section class="lp-final"><span class="kicker">Vaša energia môže viac</span><h2>Začnite jedným kódom. Objavte nové možnosti<span class="sig">.</span></h2><p>Či máte panely alebo ich slnko chcete využiť — svoje miesto si nájdete.</p><a class="btn pri lg" href="#lp-eic">Zistiť môj potenciál →</a></section>
 <footer class="lp-footer"><div><b>Zdieľňa<span class="dot">.</span></b>Slnko od suseda</div><nav class="lp-footer-links" aria-label="Odkazy v pätičke"><a href="#lp-how">Ako to funguje</a><a href="#lp-club">Slnečný klub</a><a href="#lp-offers">Ponuky</a><a href="#lp-faq">Otázky a odpovede</a></nav></footer><div class="lp-disclaimer">Hackathonový koncept. Nie je to dostupná komerčná služba ani záväzná ponuka. Čísla na tejto stránke počíta model dema z ilustračných dát. Reálne zapojenie vyžaduje overenie zákazníka, oprávnenie na prístup k dátam, vhodné meranie a aktiváciu skupiny.</div></div>
 </div>`;
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
   <div class="grid g2 ben">${benCol('prod',b,{hl:hl==='anna',kicker:hl==='anna'?'Váš profil':'Mám fotovoltiku',btn:`<button class="btn pri" style="margin-top:18px" data-act="potrole:anna">Som výrobca →</button>`})}${benCol('cons',b,{hl:hl==='peter',kicker:hl==='peter'?'Váš profil':'Nemám fotovoltiku',btn:`<button class="btn pri" style="margin-top:18px" data-act="potrole:peter">Som odberateľ →</button>`})}</div>
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
const SSO={anna:{name:'Anna Kováčová',role:'výrobca',addr:{zse:'Krajinská 8, Piešťany',vse:'Levočská 21, Prešov'},id:{zse:'SK-OM-1101',vse:'SK-OM-8811'},type:'Domácnosť',pv:true},peter:{name:'Peter Malý',role:'odberateľ',addr:{zse:'Hlavná 12, Trnava',vse:'Hlavná 48, Košice'},id:{zse:'SK-OM-0001',vse:'SK-OM-7001'},type:'Podnikanie (bistro)',pv:false}};
const SSO_STEPS=['Overujem zákaznícky účet','Načítavam odberné miesta','Kontrolujem inteligentné meranie (IMS)','Načítavam zmluvy'];
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
function vRegister(){
  const R=S.reg,per=S.persona==='admin'?'peter':S.persona,sso=SSO[per],co=R.company,coN=SKN[co];
  if(R.step==='full')return vOnb();
  const demo=`<div class="pill vis" style="margin-bottom:10px">🔒 Simulované prihlásenie (demo) – nezadávate meno ani heslo</div>`;
  const L=S.landing||{};
  if(R.step==='choose')return `<div class="gap">${hero({kicker:L.checked&&L.eic?`Registrácia · EIC ${maskEic(L.eic)} ✓`:'Registrácia',title:'Zaregistrujte sa <em>za minútu.</em>',lead:'Vyberte, u koho máte dnes elektrinu. Dodávateľa meniť nemusíte.',extra:`<div class="hero-checks"><span><i></i> Bez záväzku</span><span><i></i> Výkupná zmluva ostáva</span><span><i></i> Aktivácia k 1. dňu mesiaca</span></div>`})}
   <div class="grid g2">
    <div class="choice" style="border-color:var(--brand)">${icon('bolt')}<h2 style="margin-top:10px">Som zákazník ZSE / VSE</h2><p class="sm mut" style="margin-top:6px">Kliknite na svoju spoločnosť – prihlásime vás automaticky a údaje o odberných miestach, IMS a zmluvách doplníme sami.</p>
     <div class="logos"><button data-act="sso:zse" aria-label="Som zákazník ZSE – automatické prihlásenie"><img src="${LOGOS.zse}" alt="">Zákazník ZSE</button><button data-act="sso:vse" aria-label="Som zákazník VSE – automatické prihlásenie"><img src="${LOGOS.vse}" alt="">Zákazník VSE</button></div>
     <div class="row" style="margin-top:12px"><span class="xs mut">Demo účet:</span><span class="seg" role="group" aria-label="Demo účet">${[['anna','Anna – FVE + batéria'],['peter','Peter – bistro']].map(([k,l])=>`<button data-act="persona:${k}" aria-pressed="${per===k}">${l}</button>`).join('')}</span></div></div>
    <button class="choice" data-act="regfull">${icon('pen')}<h2 style="margin-top:10px">Som zákazník SPP alebo inej spoločnosti</h2><p class="sm mut" style="margin-top:6px">Spustite registráciu – za pár krokov pridáte odberné miesto, overíme IMS a odporučíme skupinu. Dodávateľa meniť nemusíte.</p><span class="btn pri" style="margin-top:14px">Spustiť registráciu →</span></button>
   </div></div>`;
  if(R.step==='load')return `<div class="gap"><div class="card" style="max-width:560px;margin:0 auto">${demo}<div class="row"><img src="${LOGOS[co]}" alt="${coN}" style="height:34px;border-radius:6px"><h2>Načítavam váš účet…</h2></div><div class="chk-list" style="margin-top:12px">${SSO_STEPS.map((s,i)=>`<div class="${i<R.load?'ok':'wait'}">${i<R.load?'✓':i===R.load?'<span class="spin" aria-hidden="true"></span>':'○'} ${s}</div>`).join('')}</div></div></div>`;
  const om=S.om[per],ims=per==='anna'?S.p.ims:S.c.ims,m=S.mem[per],isP=per==='anna';
  const sent=!!R.sent,g=GROUPS.find(x=>x.id===(sent?R.group:S.ob.group))||GROUPS[0];
  const reg=regionOf(geo(om.addr).ll),best=sent?g:grpBest(isP),bm=grpEst(best,isP).m*12;
  const ok=(t,sub,c='ok')=>`<div class="vf ${c}"><span class="vf-i" aria-hidden="true">${c==='ok'?'✓':c==='no'?'✕':'!'}</span><div><b>${t}</b>${sub?`<div class="xs mut">${sub}</div>`:''}</div></div>`;
  const rows=[
   ok(`Zákaznícky účet ${coN} overený`,`${sso.name} · č. ${co==='zse'?'4100':'7300'}${isP?'2187':'5530'} (ilustračné) · bez zadávania hesla`),
   ok(`${esc(om.id)} – ${ims?'môže zdieľať':'zatiaľ nemôže zdieľať'}`,`${esc(om.addr)} · ${esc(om.type)} · ${ims?'inteligentné meranie (IMS) s 15-min údajmi ✓':'chýba inteligentné meranie <button class="link" data-act="imsreq">Požiadať o IMS</button>'}`,ims?'ok':'no'),
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
    ${sent?`<div class="row" style="margin-top:16px"><button class="btn pri" data-act="view:group">Moja skupina →</button><button class="btn" data-act="view:home">Pozrieť, ako bude vyzerať Domov</button></div>`:''}</div></div>`;
}

