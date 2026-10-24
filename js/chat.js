'use strict';
/* ---------- AI asistent (demo): znalostná báza + rozpoznávanie zámeru, čísla zo živého stavu ---------- */
const CHIPS=['Koľko zarobím?','Koľko ušetrím?','Kedy zapnúť pračku?','Koľko zarobí batéria?','Aká je provízia?','Ako sa zaregistrujem?','Čo je Lúč pomoci?'];
function botAnswer(q){
  const n=' '+norm(q)+' ',has=(...w)=>w.some(x=>n.includes(x));
  const d=S.sim.days,pa=agg(potRun()),b=benefitNums(),P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),wt=win?I2T(win.a)+' – '+I2T(win.b):'—';
  const A=(t,acts=[])=>({html:t,acts});
  if(/^\s*(ahoj|dobry|cau|zdravim|servus|hello|hi|dobre rano)\b/.test(n))return A(`Ahoj! Som AI asistent Zdieľne (demo). Spýtajte sa ma na zárobok, úsporu, batériu, províziu, registráciu alebo ktorýkoľvek z nápadov – odpovedám z aktuálnych čísel aplikácie.`);
  if(has('bateri','vecer','vecerna','vecerny'))return A(`🔋 S batériou ${fm(S.bat.cap,0)} kWh ${nm('anna')} cez deň uloží ${fm(pa.anna.batCh,1)} kWh zvyšku a večer (${S.bat.eStart}–${S.bat.eEnd}) predá ${fm(pa.anna.batSold,1)} kWh za <b>${fpr(S.bat.price)} €/kWh</b> – viac ako obedných ${fpr(S.p.price)} €, menej ako ${fpr(S.c.ref)} € zo siete. Zisk z batérie je približne <b>${eur(pa.anna.batGain)} denne</b>, t. j. ${eur0(pa.anna.batGain*d*12)} ročne (odhad, po provízii a stratách ${fm(100-S.bat.eff,0)} %).${batWarn().length?' ⚠ '+batWarn()[0][1]+'.':''}`,[['Nastaviť batériu','view:group']]);
  if(has('solidar','daro','daruj','charit','v nudzi','pomoct'))return A(`🤝 Lúč pomoci: časť zvyšku prebytku darujete domácnosti v núdzi, škole alebo charite cez obec. <b>Bez provízie a bez poplatkov</b> – príjemca platí 0 €. ${S.don.on?`Dnes sa daruje ${fm(agg(dayRun()).anna.don,2)} kWh.`:'Momentálne je vypnuté.'}`,[['Otvoriť Lúč pomoci','view:i_sol']]);
  if(has('elektromobil','v2g',' auto ',' auta ',' aute '))return A(`🚗 Elektromobil ako batéria ulice (pripravujeme): auto sa cez deň nabije z ${S.ev.roofs} striech a večer vráti ${fm(evSim(dayRun()).disT,1)} kWh bistru. Nikdy neklesne pod ${fm(S.ev.minSoc,0)} % potrebných na ranný odchod.`);
  if(has('certifik','nalepk','znack','dobry sused','podnik'))return A(`❤ Dobrý sused: znak dostanú prevádzky, ktoré berú aspoň 20 % elektriny zo slnka od susedov, darujú cez Lúč pomoci a majú overené meranie. ${esc(S.badge.name)} ${esgStats().ok?'znak má – QR kód na nálepke ukáže profil a pozve zákazníkov do Zdieľne.':'zatiaľ spĺňa '+[esgStats().okE,esgStats().okS,esgStats().okG].filter(Boolean).length+' z 3 podmienok.'}`);
  if(has('mapa','mape','domcek','kde su'))return A(`🗺 Na mape vidíte svoje OM aj ostatných členov (anonymizovane) – domčeky v oblasti ZSE majú červenú strechu, vo VSE modrú. Svetielka ukazujú tok elektriny v aktuálnom 15-min intervale.`,[['Otvoriť mapu','view:map']]);
  if(has('zacne','zacina','spusti sa','aktivac','aktivuje'))return A(`Zdieľanie začne po aktivácii žiadosti: operátor ${BR()} ju potvrdí po kontrole distribútora a spustí sa <b>k 1. dňu nasledujúceho mesiaca</b>. Vstup ani výstup nie sú okamžité.`,[['Moja skupina','view:group']]);
  if(has('vystup','odist','ukoncit','zmen skupin','zmenit skupin','zmenim skupin','zmena skupin'))return A(`Výstup nie je okamžitý – členstvo sa končí <b>ku koncu nasledujúceho mesiaca</b> a zdieľanie dovtedy pokračuje. Pri výstupe si môžete uložiť rezerváciu do inej skupiny; aktivuje sa až po skončení terajšieho členstva.`,[['Moja skupina','view:group']]);
  if(has('vypocit','suma','ledger','ako sa poc','vzorec'))return A(`Každá suma je súčet 15-minútových alokácií: množstvo × cena. Výrobcovi sa odpočíta provízia (${feeTxt()}). Kontrola: platby odberateľov = výplata výrobcom + provízia. Všetko nájdete v Prehľady → Ledger.`,[['Otvoriť ledger','rtabgo:led']]);
  if(has('zarob','zisk','prijem','zarab','kolko dostan','kolko mi zostane'))return A(`☀ ${nm('anna')} (prebytok ${fm(S.p.surplus,1)} kWh/deň) zarobí čisto približne <b>${eur(pa.anna.net*d)} mesačne</b> po provízii ${BR()}. Oproti výkupu je to <b>+${eur(pa.anna.vsVykup*d)} mesačne</b>, ročne až ${eur0(b.yP*(1+b.u))}. Cena ${fpr(S.p.price)} €/kWh → po provízii ${fpr(netPrice(S.p.price))} €, výkup by dal ${fpr(S.p.feedin)} €. Odhad, nie garancia.`,[['Pozrieť výhody','view:benefits'],['Prepočítať kWh','calc']]);
  if(has('usetr','uspor','lacnej'))return A(`🔌 Peter ušetrí približne <b>${eur(pa.peter.saved*d)} mesačne</b> (ročne až ${eur0(b.yC*(1+b.u))}) – zdieľaná elektrina za ${fpr(S.p.price)} €/kWh namiesto ${fpr(S.c.ref)} € zo siete${S.bat.on?`, večer z batérie suseda za ${fpr(S.bat.price)} €`:''}. Žiadne poplatky navyše.`,[['Pozrieť výhody','view:benefits']]);
  if(has('prack','umyvack','kedy','zapnut','najlepsi cas','interval','okno'))return A(`Najlepší čas na spotrebu je dnes <b>${wt}</b>. Umývačku odporúčam spustiť o <b>${recAppTime()}</b> (pôvodne ${S.c.appOrig}); ${nm('anna')} by mala presunúť pračku na ${recKey('p','pw')}, aby uvoľnila prebytok pre skupinu.`,[['Výzvy a odmeny','view:rewards']]);
  if(has('provizi','poplat','kolko stoji','cena sluzby'))return A(`Províziu ${BR()} platí <b>iba výrobca</b> a iba z predanej energie: ${feeTxt()}. Odberateľ neplatí nič navyše. Darovaná energia (Lúč pomoci) je bez provízie. Dnes by provízia v skupine bola ${eur(agg(dayRun()).comT)}.`);
  if(has('vykup'))return A(`Výkupná zmluva vám zostáva – čo sa nenasdieľa (a neuloží do batérie či banky), predáte výkupcovi za ${fpr(S.p.feedin)} €/kWh. Zisk oproti výkupu = predané kWh × (cena − provízia − výkupná cena).`);
  if(has('ims','merani','elektromer','smart meter'))return A(`Na aktívne zdieľanie treba inteligentné meranie (IMS) s 15-minútovými údajmi. Bez IMS vidíte iba odhad potenciálu a aktivácia je zablokovaná. O inštaláciu môžete požiadať v Profile.`,[['Profil','view:profile']]);
  if(has('podmienk','kto sa moze','zapojit'))return A(`Podmienky: jedno OM = jedna skupina, výkupná zmluva ostáva, potrebné je IMS, vstup potvrdzuje distribútor a zdieľanie sa spúšťa k 1. dňu mesiaca. Zapojiť sa môžu domácnosti aj malé podniky.`,[['Zaregistrovať sa','view:register']]);
  if(has('vyuctov','faktur','inkas','plati','platba'))return A(`Vyúčtovanie je mesačné: do 5. dňa návrh, do 10. dňa vyúčtovanie (odberateľ platí inkasom), do 20. dňa výplata výrobcovi po odpočítaní provízie.`,[['Prehľady','view:reports']]);
  if(has('odmen','body','vyzv','podvod'))return A(`Za presun spotreby do slnečného okna získate body (denný limit ${S.pts.cap}). Body sa pripíšu až po overení podľa IMS – v novom čase musí spotreba vzrásť a v pôvodnom klesnúť (prah 60 %). „Test podvodu“ overenie neprejde.`,[['Odmeny','view:rewards']]);
  if(has('registr','prihlas','ucet','spp','zakaznik'))return A(`Registrácia má dve cesty: <b>zákazník ZSE alebo VSE</b> sa prihlási automaticky (údaje o OM, IMS a zmluvách doplníme), <b>zákazník SPP alebo inej spoločnosti</b> prejde krátkou registráciou v 7 krokoch. Dodávateľa meniť netreba.`,[['Zaregistrovať sa','view:register']]);
  if(has('zhoda','smart','match','skupin','ponuk'))return A(`Zhoda = 50 % časový prekryv + 25 % cena + 15 % spoľahlivosť predikcie + 10 % rovnováha. ${nm('anna')} ↔ Peter majú dnes ${pct(matchScore(P.fp,S.p.price,P.fc,S.c.max,S.c.ref,S.p.conf).total)}. Skupinu vám odporučíme pri registrácii – vidíte pri nej, koľko v ktorej ušetríte.`,[['Moja skupina','view:group']]);
  if(has('kontakt','clovek','operator','podpor','zavolat'))return A(`Rád vás prepojím s človekom (v deme ilustračne): zákaznícka linka ${BR()} alebo e-mail cez formulár v aplikácii ${BR()}. Medzitým sa pokojne pýtajte ďalej.`);
  return A(`Na toto zatiaľ nepoznám presnú odpoveď. Skúste sa opýtať napríklad na zárobok, batériu, províziu, registráciu, výstup zo skupiny alebo na niektorý z nápadov. Ak chcete, prepojím vás s človekom.`,[['Kontakt na človeka','ask:Chcem kontakt na človeka']]);
}
function chatSend(q){
  q=String(q||'').trim();if(!q)return;
  const c=S.chat;c.open=true;c.msgs.push({me:true,txt:q});c.typing=true;renderChat();
  clearTimeout(chatSend.h);chatSend.h=setTimeout(()=>{let a;try{a=botAnswer(q)}catch(e){a={html:'Prepáčte, niečo sa pokazilo pri výpočte. Skúste to znova.',acts:[]}}c.typing=false;c.msgs.push(a);renderChat()},650+Math.min(700,q.length*12));
}
function renderChat(){
  const c=S.chat,el=$('#chat');el.classList.toggle('open',c.open);$('#fab').setAttribute('aria-expanded',String(c.open));
  if(!c.open){el.innerHTML='';return}
  const old=$('#chatin'),val=old?old.value:'',foc=document.activeElement===old;
  if(!c.msgs.length)c.msgs.push({html:`Ahoj! Som AI asistent Zdieľne (demo). Odpovedám z aktuálnych čísel aplikácie – vyberte otázku nižšie alebo napíšte vlastnú.`,acts:[]});
  el.innerHTML=`<header><span class="av" aria-hidden="true">🤖</span><div><b>AI asistent (demo)</b><div class="xs" style="opacity:.85">odpovedá zo živých čísel aplikácie</div></div><button data-act="chat" aria-label="Zavrieť asistenta">✕</button></header>
   <div class="msgs" id="msgs" aria-live="polite">${c.msgs.map(m=>`<div class="msg ${m.me?'me':'bot'}">${m.me?esc(m.txt):m.html}${m.acts&&m.acts.length?`<div class="acts">${m.acts.map(([l,a])=>`<button class="btn sm" data-act="${esc(a)}">${l}</button>`).join('')}</div>`:''}</div>`).join('')}${c.typing?'<div class="msg bot"><span class="typing" role="status" aria-label="Asistent píše"><i></i><i></i><i></i></span></div>':''}</div>
   <div class="chips" role="group" aria-label="Návrhy otázok">${CHIPS.map(q=>`<button data-act="ask:${esc(q)}">${q}</button>`).join('')}</div>
   <form id="chatf"><input id="chatin" placeholder="Napíšte otázku…" aria-label="Otázka pre AI asistenta" autocomplete="off" value="${esc(val)}"><button class="btn pri sm" type="submit">Poslať</button></form>`;
  const ms=$('#msgs');ms.scrollTop=ms.scrollHeight;
  if(foc||c.focus){const i=$('#chatin');i.focus();c.focus=false}
}


