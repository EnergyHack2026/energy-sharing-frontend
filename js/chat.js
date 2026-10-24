'use strict';
/* ---------- AI asistent (demo): znalostná báza + rozpoznávanie zámeru, čísla zo živého stavu ---------- */
const CHIPS=['Koľko ušetrím?','Koľko zarobím?','Kedy zapnúť pračku?','Čo sú iWatt?','Ktorú stratégiu?','Ako sa zaregistrujem?','Čo je Lúč pomoci?'];
/* Odpovedá len z toho, čo Zdieľňa naozaj ukazuje: otázky a odpovede z úvodu (LP_FAQ), ponuky a stratégie,
   výzvy a iWatt, Lúč pomoci a čísla z Prehľadov. Čo na stránke nie je, nevymýšľa. */
function botAnswer(q){
  const n=' '+norm(q)+' ',has=(...w)=>w.some(x=>n.includes(x)),pub=PUB.includes(curView());
  const d=S.sim.days,pa=agg(potRun()),P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),wt=win?I2T(win.a)+' – '+I2T(win.b):'—';
  const A=(t,acts=[])=>({html:t,acts}),faq=k=>A(LP_FAQ[k].a,k===1?[['Zaregistrovať sa','view:register']]:[]);
  const pctBuy=x=>Math.round((1-x.buy/SUPPLY_HH)*100),xSell=x=>fm(x.sell/S.p.feedin,1);
  if(/^\s*(ahoj|dobry|cau|zdravim|servus|hello|hi|dobre rano)\b/.test(n))return A(`Ahoj! Som asistent Zdieľne (demo). Odpovedám len z toho, čo nájdete v Zdieľni – z úvodnej stránky, otázok a odpovedí, ponúk, výziev a vašich prehľadov.`);
  if(has('celeho uctu','z uctu'))return faq(3);
  if(has('usetr','uspor','lacnej'))return pub
    ?A(`🔌 Ako odberateľ kupujete zdieľanú elektrinu lacnejšie ako bežnú dodávku (${fm(SUPPLY_HH,4)} €/kWh bez DPH) – podľa stratégie: ${['match','bal','price'].map(k=>`${WZ_STRAT[k].t.toLowerCase()} ${fpr(WZ_STRAT[k].buy)} € (o ${pctBuy(WZ_STRAT[k])} %)`).join(', ')}. ${LP_FAQ[3].a}`,[['Zaregistrovať sa','view:register']])
    :A(`🔌 Podľa vašich Prehľadov ušetríte približne <b>${eur(pa.peter.saved*d)} mesačne</b> – zdieľaná elektrina za ${fpr(S.p.price)} €/kWh namiesto ${fpr(S.c.ref)} € zo siete. ${LP_FAQ[3].a}`,[['Otvoriť Prehľady','view:reports']]);
  if(has('zarob','zisk','prijem','zarab','kolko dostan','kolko mi zostane','predat','predam'))return pub
    ?A(`☀ Ako výrobca predáte prebytky drahšie ako za výkup – podľa stratégie ${['match','bal','price'].map(k=>`${fpr(WZ_STRAT[k].sell)} € (${xSell(WZ_STRAT[k])}× výkup)`).join(', ')}. Príklad z úvodu: rodinný dom zarobí <b>+${eur(lpNums().gainMonth)} mesačne</b> oproti výkupu. Ide o odhad, nie garantovaný výsledok.`,[['Zaregistrovať sa','view:register']])
    :A(`☀ Podľa Prehľadov Anna zarobí čisto približne <b>${eur(pa.anna.net*d)} mesačne</b> po provízii, čo je <b>+${eur(pa.anna.vsVykup*d)}</b> oproti výkupu (${fpr(S.p.feedin)} €/kWh). Ide o odhad, nie garantovaný výsledok.`,[['Otvoriť Prehľady','view:reports']]);
  if(has('prack','umyvack','kedy zapnut','zapnut','najlepsi cas','okno','presun'))return (()=>{
    const it=chItems('peter').filter(x=>x.st==='new').sort((a,b)=>b.eur-a.eur)[0];
    return A(`Dnešné slnečné okno je <b>${wt}</b>.${it?` Odporúčanie z Výziev: <b>${it.verb} ${it.t}</b> namiesto ${it.o.orig} – ušetríte ~${eur(Math.max(0,it.eur))}/mes. a získate +${fm(CH_IW,0)} iWatt.`:''}`,[[pub?'Pozrieť výzvy':'Otvoriť Výzvy',pub?'landingfeature:challenges':'chgo:home']])})();
  if(has('iwatt','odmen','body','bod ','vyzv','odznak'))return A(`🏅 Za každú overenú výzvu získate <b>${fm(CH_IW,0)} iWatt</b> (najviac ${fm(CH_CAP,0)} denne), za nový odznak ${fm(IW_BDG,0)} iWatt a za pozvaného suseda ${fm(IW_REF,0)} iWatt, keď začne zdieľať. 1 000 iWatt ≈ 2 € – vymeníte ich za zľavy u partnerov a v e-shope. Overuje inteligentný elektromer, nikdy nie za vyššiu spotrebu.`,[[pub?'Pozrieť výzvy':'Odmeny',pub?'landingfeature:challenges':'view:rewards']]);
  if(has('solidar','daro','daruj','charit','v nudzi','luc pomoci','luc'))return A(`🤝 Lúč pomoci: výrobcovia darujú časť prebytkov školám, neziskovkám a rodinám v núdzi – <b>bez provízie</b>. Darovanie závisí od zapojenia oprávneného príjemcu.`,pub?[]:[['Otvoriť Dobrý sused','view:cert']]);
  if(has('strateg','sparovan','vyvazen'))return A(`Stratégiu si zvolíte pri registrácii: ${['match','bal','price'].map(k=>`<b>${WZ_STRAT[k].t}</b> – ${WZ_STRAT[k].d.toLowerCase()}, šanca spárovania ${WZ_STRAT[k].ch} %`).join('; ')}. Ak zistíme, že pre vás nie je účinná, navrhneme vám jej zmenu. Šanca je orientačný modelový odhad.`,[['Zaregistrovať sa','view:register']]);
  if(has('provizi','kolko stoji','cena sluzby'))return A(`Províziu platí <b>iba výrobca</b> z predanej energie${pub?'':` (${feeTxt()})`}. Odberateľ províziu neplatí a darovanie cez Lúč pomoci je bez provízie.`);
  if(has('kde najdem eic','eic'))return A(`EIC je 16-miestny kód odberného miesta. Nájdete ho na faktúre za elektrinu alebo v zákazníckom účte pri údajoch o odbernom mieste.`,[['Zaregistrovať sa','view:register']]);
  for(let k=0;k<LP_FAQ.length;k++)if(has(...LP_FAQ[k].k))return faq(k);
  if(has('mapa','mape','kde su'))return A(`Na mape vidíte svoje odberné miesto aj ostatných členov skupiny anonymizovane.`,pub?[]:[['Otvoriť mapu','view:map']]);
  return A(`Na toto v Zdieľni zatiaľ odpoveď nemám. Skúste sa opýtať na úsporu, zárobok, slnečné okno, iWatt a výzvy, stratégie, Lúč pomoci alebo registráciu.`);
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
  if(!c.msgs.length)c.msgs.push({html:`Ahoj! Som asistent Zdieľne (demo). Odpovedám len z toho, čo nájdete v Zdieľni – vyberte otázku nižšie alebo napíšte vlastnú.`,acts:[]});
  el.innerHTML=`<header><span class="av" aria-hidden="true">🤖</span><div><b>AI asistent (demo)</b><div class="xs" style="opacity:.85">odpovedá len z obsahu Zdieľne</div></div><button data-act="chat" aria-label="Zavrieť asistenta">✕</button></header>
   <div class="msgs" id="msgs" aria-live="polite">${c.msgs.map(m=>`<div class="msg ${m.me?'me':'bot'}">${m.me?esc(m.txt):m.html}${m.acts&&m.acts.length?`<div class="acts">${m.acts.map(([l,a])=>`<button class="btn sm" data-act="${esc(a)}">${l}</button>`).join('')}</div>`:''}</div>`).join('')}${c.typing?'<div class="msg bot"><span class="typing" role="status" aria-label="Asistent píše"><i></i><i></i><i></i></span></div>':''}</div>
   <div class="chips" role="group" aria-label="Návrhy otázok">${CHIPS.map(q=>`<button data-act="ask:${esc(q)}">${q}</button>`).join('')}</div>
   <form id="chatf"><input id="chatin" placeholder="Napíšte otázku…" aria-label="Otázka pre AI asistenta" autocomplete="off" value="${esc(val)}"><button class="btn pri sm" type="submit">Poslať</button></form>`;
  const ms=$('#msgs');ms.scrollTop=ms.scrollHeight;
  if(foc||c.focus){const i=$('#chatin');i.focus();c.focus=false}
}


