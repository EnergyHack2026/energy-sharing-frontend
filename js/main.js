'use strict';
/* ---------- shell render ---------- */
const PUB=['landing','join','potential','benefits','register'];
/* neutrálne obrazovky – bez značky ZSE/VSE (značka sa určí až podľa EIC) */
const NEUTRAL=['landing','join'];
const isNeutral=v=>NEUTRAL.includes(v)||(v==='register'&&S.reg.step==='choose');
const NAV=[['home','Domov','home'],['market','Trhovisko','market'],['group','Moja skupina','group'],['reports','Prehľady','chart'],['rewards','Odmeny','star'],['map','Mapa','map'],['ideas','Nápady','bulb']];
const NAV_ADMIN=[['admin','Konzola','console'],['map','Mapa','map'],['ideas','Nápady','bulb']];
/* cesta zákazníka: začiatok → koniec */
const NAV_PUB=[['landing','Úvod','info'],['benefits','Výhody','coins'],['register','Registrácia','pen']];
const ADMIN_OK=['admin','profile','landing','potential','benefits','register','map','ideas'];
const curView=()=>{let v=S.view;if(S.persona==='admin'&&!ADMIN_OK.includes(v)&&!v.startsWith('i_'))v='admin';if(S.persona!=='admin'&&v==='admin')v='home';if(!isOn(v))v='landing';return v};
/* kam vedie tlačidlo (data-act) – odkazy na vypnuté časti finálnej verzie sa skryjú */
const ACT_VIEW={eiccheck:'join',eicdemo:'join',eicfill:'join',landingoffer:'market',chat:'chat',tour:'tour',
  landingfeature:a=>({battery:'home',solidarity:'i_sol',reports:'reports'}[a]||'rewards')};
function gateActs(root){
  root.querySelectorAll('[data-act]').forEach(el=>{const [n,...r]=el.dataset.act.split(':'),a=r.join(':'),m=ACT_VIEW[n];
    const t=n==='view'?a:typeof m==='function'?m(a):m;if(t&&!isOn(t))el.hidden=true});
}
/* zákaznícky režim: značka podľa oblasti adresy, Operátor iba v režime poroty */
function customerSkin(){
  if(isNeutral(curView())){S.skin='neutral';return}  /* úvod je bez značky ZSE/VSE */
  if(S.jury&&S.skin!=='neutral')return;
  if(!S.jury&&S.persona==='admin')S.persona='peter';
  const rg=regionOf(geo(S.om[S.persona].addr).ll);S.skin=rg==='vse'?'vse':'zse';
}
function renderShell(){
  const p=S.persona,v=curView(),pub=PUB.includes(v),J=S.jury;
  document.body.classList.toggle('pub',pub);document.body.classList.toggle('marketing',isNeutral(v));document.body.classList.toggle('jury',J);
  const brandSeg=J&&!isNeutral(v)?`<span class="seg" role="group" aria-label="Značka">${[['zse','ZSE'],['vse','VSE']].map(([k,l])=>`<button data-act="skin:${k}" aria-pressed="${S.skin===k}">${l}</button>`).join('')}</span>`:'';
  const logo=`<button class="brand" data-act="view:landing" aria-label="${APP_NAME} – úvodná stránka">${S.skin==='neutral'?'':`<img src="${LOGOS[S.skin]}" alt="${BR()}">`}<span>${APP_NAME}<span class="dot">.</span></span></button>`;
  const juryTag=J?`<span class="jury-tag">🎬 Režim poroty <button data-act="jury" aria-label="Vypnúť režim poroty">✕</button></span>`:'';
  const unread=pub||p==='admin'?0:myNotes().filter(n=>!n.read).length;
  const bell=pub||p==='admin'?'':`<button class="btn sm bell" data-act="bell" aria-label="Notifikácie${unread?', neprečítané: '+unread:''}">${icon('bell')}${unread?`<span class="bell-n">${unread}</span>`:''}</button>`;
  const gear=J?`<button class="btn sm" data-act="drawer" aria-label="Upraviť čísla a časy">${icon('sliders')}<span class="hide-m">Čísla a časy</span></button>`:'';
  $('#top').innerHTML=v!=='landing'&&isNeutral(v)?`${logo}<span class="spacer"></span>${juryTag}<button class="btn sm" data-act="view:landing">← Späť na úvod</button>`
   :v==='landing'?`${logo}<nav class="market-nav" aria-label="Hlavná navigácia"><a href="#lp-benefits">Prečo zdieľať</a><a href="#lp-how">Ako to funguje</a><a href="#lp-club">Slnečný klub</a><a href="#lp-offers">Ponuky</a></nav><span class="spacer"></span>${juryTag}${brandSeg}<button class="btn sm dark" data-act="view:home">Vstúpiť do aplikácie →</button>`
   :pub?`${logo}<span class="spacer"></span>${juryTag}${brandSeg}${gear}${J?`<button class="btn sm hide-m" data-act="tour">🎬 Demo príbeh</button>`:''}<button class="btn sm pri" data-act="view:home">Prejsť do aplikácie →</button>`
   :`${logo}${J?`<span class="seg" role="group" aria-label="Prepínač persón (demo)">${[['anna','Anna','výrobca'],['peter','Peter','odberateľ'],['admin','Operátor','']].map(([k,l,r])=>`<button data-act="persona:${k}" aria-pressed="${p===k}">${l}${r?`<span class="hide-m"> · ${r}</span>`:''}</button>`).join('')}</span>`:''}<span class="spacer"></span>${juryTag}${brandSeg}${bell}<button class="btn sm" data-act="view:profile" aria-label="Profil">${icon('user')}<span class="hide-m">Profil</span></button>${gear}`;
  const items=(p==='admin'?NAV_ADMIN:NAV).filter(([k])=>isOn(k));
  const isCur=k=>v===k||(k==='ideas'&&v.startsWith('i_'))||(k==='landing'&&v==='potential');
  const btn=([k,l,i])=>`<button data-act="view:${k}" ${isCur(k)?'aria-current="page"':''}><span class="ic">${icon(i)}</span><span>${l}</span></button>`;
  const sub=(v==='ideas'||v.startsWith('i_'))?IDEAS.filter(([k])=>isOn(k)).map(([k,i,l,,st])=>`<button data-act="view:${k}" ${v===k?'aria-current="page"':''} class="sub"><span class="ic">${icon(i)}</span><span>${l}${st==='q'?' <span class="q-mark" title="na zváženie">?</span>':''}</span></button>`).join(''):'';
  $('#side').innerHTML=`<div class="lbl">Začíname</div>`+NAV_PUB.filter(([k])=>isOn(k)).map(btn).join('')+`<div class="lbl">${p==='admin'?'Operátor':'Moja Zdieľňa'}</div>`+items.map(it=>btn(it)+(it[0]==='ideas'?sub:'')).join('')
    +`<div class="side-foot"><button class="jury-btn" data-act="jury" aria-pressed="${J}">🎬 ${J?'Vypnúť režim poroty':'Režim poroty'}</button></div>`;
  const bn=(p==='admin'?NAV_ADMIN:[NAV[0],NAV[1],NAV[5],NAV[6]]).filter(([k])=>isOn(k));
  $('#bnav').innerHTML=bn.map(btn).join('')+`<button data-act="more"><span class="ic">${icon('menu')}</span><span>Viac</span></button>`;
  gateActs($('#top'));$('#fab').hidden=!isOn('chat');
  const tc=document.querySelector('meta[name=theme-color]');if(tc)tc.content=tokHex('--surface-dark');
}
const VIEWS={home:vHome,market:vMarket,group:vGroup,reports:vReports,rewards:vRewards,profile:vProfile,admin:vAdmin,landing:vLanding,join:vJoin,potential:vPotential,benefits:vBenefits,register:vRegister,map:vMap,ideas:vIdeas,i_badge:vIdeaBadge,i_sol:vIdeaSol,i_bank:vIdeaBank,i_agent:vIdeaAgent,i_twin:vIdeaTwin,i_send:vIdeaSend,i_ev:vIdeaEv};
function modalHtml(){
  const m=S.modal;if(!m)return '';
  if(m==='welcome')return welcomeModal();
  if(m==='player')return playerModal();
  if(m==='bell')return bellPanel();
  if(String(m).startsWith('bdgnew:'))return bdgModal(m.slice(7),true);
  if(String(m).startsWith('bdg:'))return bdgModal(m.slice(4),false);
  if(m==='exit')return exitModal();if(m==='cmp')return cmpModal();if(m==='calc')return calcModal();if(m==='more')return moreSheet();
  if(String(m).startsWith('ver:'))return verModal(m.slice(4));
  return detailModal(m);
}
/* prekreslí iba modál a zachová fokus (prehrávač dňa) */
function renderModal(){
  const act=document.activeElement,inM=act&&$('#modal').contains(act)&&act.dataset,fa=inM?act.dataset.act:null,fk=inM?act.dataset.k:null;
  $('#modal').innerHTML=modalHtml();gateActs($('#modal'));
  const el=fk?$('#modal').querySelector(`[data-k="${fk}"]`):fa?$('#modal').querySelector(`[data-act="${CSS.escape(fa)}"]`):null;if(el)el.focus({preventScroll:true})
}
function renderMain(){
  const act=document.activeElement,inMain=act&&$('#main').contains(act),inModal=act&&$('#modal').contains(act);
  const fk=(inMain||inModal)&&act.dataset?act.dataset.k:null,fa=(inMain||inModal)&&act.dataset&&!fk?act.dataset.act:null,fd=act&&act.dataset?act.dataset.drag:null;
  let sel=null;try{if(fk&&act.type==='text')sel=[act.selectionStart,act.selectionEnd]}catch(e){}
  const v=curView();
  checkWelcome();
  $('#main').innerHTML=(VIEWS[v]||vHome)();
  $('#modal').innerHTML=modalHtml();
  gateActs($('#main'));gateActs($('#modal'));
  const root=inModal?$('#modal'):$('#main');
  if(fk){const el=root.querySelector(`[data-k="${fk}"]`);if(el){el.focus();if(sel)try{el.setSelectionRange(sel[0],sel[1])}catch(e){}}}
  else if(fa){const el=root.querySelector(`[data-act="${CSS.escape(fa)}"]`);if(el)el.focus({preventScroll:true})}
  else if(fd){const el=document.querySelector(`[data-drag="${fd}"]`);if(el)el.focus({preventScroll:true})}
  if(S.modal&&!inModal){const m=$('#modal [role=dialog]');if(m&&!m.contains(document.activeElement)){const b=m.querySelector('button');if(b)b.focus({preventScroll:true})}}
  checkFU();checkBadges();startFlows();
}
function drawerHtml(){
  return `<div class="row between"><h2>⚙ Parametre dema</h2><button class="btn sm" data-act="drawer" aria-label="Zavrieť">✕</button></div><p class="sm mut" style="margin-top:4px">Zmena akejkoľvek hodnoty okamžite prepočíta zisk, alokácie, najlepší interval aj percento zhody.</p>
  <h3>Anna – výrobca</h3><div class="fields">${F('Ponuková cena','p.price',{step:.005,u:'€/kWh'})}${F('Ponúkaný podiel prebytku','p.share',{step:5,max:100,u:'%'})}${F('Predikovaný prebytok / deň','p.surplus',{step:.1,u:'kWh'})}${F('Počasie (výroba)','p.weather',{step:5,max:150,u:'%'})}${F('Prebytky od','p.pStart',{t:'t'})}${F('Prebytky do','p.pEnd',{t:'t'})}${F('Istota predikcie','p.conf',{t:'s',opts:['vysoká','stredná','nízka']})}${F('Podiel vlastnej spotreby','p.own',{step:1,max:95,u:'%'})}${F('Automatické obnovovanie ponuky','p.auto',{t:'c'})}${F('Výkupná cena','p.feedin',{step:.005,u:'€/kWh'})}${F('Obsadenosť (odberateľov)','p.occ',{step:1,max:10})}${F('Viditeľnosť ponuky','p.vis',{t:'s',opts:[VIS_PUB,VIS_HID,VIS_LOCK]})}${F('Individuálna cena pre Petra','p.indiv.on',{t:'c'})}${F('Cena pre Petra','p.indiv.price',{step:.005,u:'€/kWh'})}${F('Anna má IMS','p.ims',{t:'c'})}</div>
  <h3>🔋 Batéria Anny</h3><div class="fields">${F('Mám batériu','bat.on',{t:'c'})}${F('Kapacita','bat.cap',{step:.5,min:.5,u:'kWh'})}${F('Max. výkon','bat.pow',{step:.25,min:.25,u:'kWh/15 min'})}${F('Účinnosť','bat.eff',{step:1,min:50,max:100,u:'%'})}${F('Min. stav nabitia','bat.minSoc',{step:5,max:90,u:'%'})}${F('Ukladať zo zvyšku','bat.pct',{step:5,max:100,u:'%'})}${F('Večer od','bat.eStart',{t:'t'})}${F('Večer do','bat.eEnd',{t:'t'})}${F('Večerná cena','bat.price',{step:.005,u:'€/kWh'})}${F('Najprv vlastná spotreba','bat.ownFirst',{t:'c'})}${F('Zostatok z predch. dňa','bat.carry',{step:.5,u:'kWh'})}</div>
  <h3>Provízia ${BR()} (od výrobcu)</h3><div class="fields">${F('Spôsob provízie','fee.mode',{t:'s',opts:[FEE_FIX,FEE_PCT]})}${F('Pevná provízia (vr. DPH)','fee.fix',{step:.5,u:'€/MWh'})}${F('Provízia v %','fee.pct',{step:.5,max:100,u:'%'})}</div><p class="xs mut">Účtuje sa iba výrobcovi z predanej energie. Odberateľ neplatí nič. Darovaná energia je bez provízie.</p>
  <h3>Peter – odberateľ</h3><div class="fields">${F('Maximálna cena','c.max',{step:.005,u:'€/kWh'})}${F('Max. cena večer','c.maxEve',{step:.005,u:'€/kWh'})}${F('Referenčná cena komodity','c.ref',{step:.005,u:'€/kWh'})}${F('Spotreba v okne / deň','c.daily',{step:.1,u:'kWh'})}${F('Základná spotreba mimo okna','c.base',{step:.01,u:'kWh/15 min'})}${F('Preferovaný čas od','c.cStart',{t:'t'})}${F('Preferovaný čas do','c.cEnd',{t:'t'})}${F('Umývačka – pôvodný čas','c.appOrig',{t:'t'})}${F('Umývačka – aktuálny čas','c.appTime',{t:'t'})}${F('Spotreba umývačky','c.appKwh',{step:.1,u:'kWh'})}${F('Elektromobil – spotreba','c.ev.kwh',{step:.1,u:'kWh'})}${F('Elektromobil – pôvodný čas','c.ev.orig',{t:'t'})}${F('Elektromobil – aktuálny čas','c.ev.time',{t:'t'})}${F('Ohrev vody – spotreba','c.wh.kwh',{step:.1,u:'kWh'})}${F('Ohrev vody – pôvodný čas','c.wh.orig',{t:'t'})}${F('Ohrev vody – aktuálny čas','c.wh.time',{t:'t'})}${F('Výrobník ľadu – spotreba','c.ice.kwh',{step:.1,u:'kWh'})}${F('Výrobník ľadu – pôvodný čas','c.ice.orig',{t:'t'})}${F('Peter má IMS','c.ims',{t:'c'})}</div>
  <h3>Anna – vlastné spotrebiče (výzvy výrobcu)</h3><div class="fields">${F('Pračka – spotreba','p.pw.kwh',{step:.1,u:'kWh'})}${F('Pračka – pôvodný čas','p.pw.orig',{t:'t'})}${F('Bojler – spotreba','p.pb.kwh',{step:.1,u:'kWh'})}${F('Bojler – pôvodný čas','p.pb.orig',{t:'t'})}${F('Elektromobil – spotreba','p.pev.kwh',{step:.1,u:'kWh'})}${F('Elektromobil – pôvodný čas','p.pev.orig',{t:'t'})}</div>
  <h3>Test podvodu (skutočné meranie IMS)</h3><p class="xs mut">Zapnutím simulujete, že spotrebič v skutočnosti stále beží v pôvodnom čase, hoci výzva bola prijatá.</p><div class="fields one">${F('Peter: umývačka nebola presunutá','c.washCheat',{t:'c'})}${F('Peter: nabíjanie vozidla nebolo presunuté','c.ev.cheat',{t:'c'})}${F('Peter: ohrev vody nebol presunutý','c.wh.cheat',{t:'c'})}${F('Peter: výrobník ľadu nebol presunutý','c.ice.cheat',{t:'c'})}${F('Anna: pračka nebola presunutá','p.pw.cheat',{t:'c'})}${F('Anna: bojler nebol presunutý','p.pb.cheat',{t:'c'})}${F('Anna: elektromobil nebol presunutý','p.pev.cheat',{t:'c'})}</div>
  <h3>Skutočné meranie (demo interval)</h3><div class="fields">${F('Interval','meter.idx',{t:'i'})}${F('Skutočný prebytok Anny','meter.anna',{step:.05,u:'kWh'})}${F('Skutočná spotreba Petra','meter.peter',{step:.05,u:'kWh'})}</div>
  <h3>Nápady (vízie)</h3><div class="fields">${F('Solidárne slnko zapnuté','don.on',{t:'c'})}${F('Darovať zo zvyšku','don.pct',{step:5,max:100,u:'%'})}${F('Slnečná banka zapnutá','bank.on',{t:'c'})}${F('Do banky zo zvyšku','bank.pct',{step:5,max:100,u:'%'})}${F('Kurz leto → zima','bank.rate',{step:5,min:10,max:150,u:'%'})}${F('Zimná cena','bank.winter',{step:.005,u:'€/kWh'})}${F('AI správca zapnutý','agent.on',{t:'c'})}${F('Priorita AI správcu','agent.prio',{t:'s',opts:PRIO})}${F('Provízia za Pošli slnko','send.fee',{step:.005,u:'€/kWh'})}${F('Faktor CO₂','twin.co2',{step:.01,u:'kg/kWh'})}</div>
  <h3>Simulácia a report</h3><div class="fields">${F('Pracovných dní v mesiaci','sim.days',{step:1,min:1,max:31})}${F('Odchýlka skutočnosti od odhadu','sim.dev',{step:1,max:50,u:'%'})}${F('Dĺžka najlepšieho okna','sim.win',{step:.25,min:.25,max:8,u:'h'})}${F('Denný limit bodov','pts.cap',{step:5,u:'b'})}${F('Zahrnúť ďalších členov skupiny','sim.others',{t:'c'})}</div>
  <h3>Ďalší členovia skupiny</h3><div class="fields">${F('Výrobca B – cena','o.bPrice',{step:.005,u:'€/kWh'})}${F('Odberateľ C – max. cena','o.cMax',{step:.005,u:'€/kWh'})}${F('Odberateľ D – max. cena','o.dMax',{step:.005,u:'€/kWh'})}</div>
  <div class="row" style="margin-top:18px"><button class="btn" data-act="resetall">↺ Obnoviť demo dáta</button><button class="btn pri" data-act="drawer">Hotovo</button></div>
  <p class="xs mut" style="margin-top:12px">Prepínač značky (ZSE / VSE) mení logo a farebnú tému. Časy sa zaokrúhľujú na 15 minút. Ponuka sa prideľuje: nižšia cena najprv, pri nedostatku pomerne; zvyšok prebytku ide do batérie, banky, daru, darčekov a nakoniec výkupcovi.</p>`;
}
function syncInputs(){
  document.querySelectorAll('[data-k]').forEach(el=>{if(el===document.activeElement)return;const v=getPath(el.dataset.k);if(v===undefined)return;if(el.type==='checkbox')el.checked=!!v;else if(String(el.value)!==String(v))el.value=v});
}
function render(full=true){
  customerSkin();
  document.documentElement.dataset.skin=S.skin;
  {const ic=document.querySelector('link[rel=icon]');if(ic)ic.href=S.skin==='neutral'?LOGO_APP:LOGOS[S.skin]}
  if(full){renderShell();const dr=$('#drawer');const st=dr.scrollTop;dr.innerHTML=drawerHtml();dr.scrollTop=st}
  $('#drawer').classList.toggle('open',S.drawer);$('#drawer').setAttribute('aria-hidden',String(!S.drawer));
  renderMain();
}

/* ---------- events ---------- */
document.addEventListener('input',e=>{
  const el=e.target,k=el.dataset&&el.dataset.k;if(!k)return;const t=el.dataset.t;let v;
  if(t==='n'){v=parseFloat(String(el.value).replace(',','.'));if(isNaN(v))return;const mn=el.min!==''?+el.min:-Infinity,mx=el.max!==''?+el.max:Infinity;v=Math.min(mx,Math.max(mn,v))}
  else if(t==='c')v=el.checked;else if(t==='i')v=parseInt(el.value,10);else if(t==='t'){if(!el.value)return;v=el.value}else v=el.value;
  setPath(k,v);
  {const pr=k.split('.');if(pr.length===3&&pr[2]==='orig'&&(pr[0]==='p'||pr[0]==='c')){const o=getPath(pr[0]+'.'+pr[1]);if(o&&!o.accepted)setPath(pr[0]+'.'+pr[1]+'.time',v)}}
  if(k==='sim.idx'&&S.sim.playing){S.sim.playing=false;stopTimer()}
  if(k==='pl.idx'){S.pl.playing=false;clearInterval(plT);renderModal();return}
  if(k==='bank.month'&&S.bank.playing){S.bank.playing=false;clearInterval(bankT)}
  if(k==='p.price'||k==='p.indiv.price'||k==='p.indiv.on'){const ip=S.p.indiv.on;notify('price','peter',ip?'Individuálna cena od Anny':'Výrobca zmenil cenu',`Anna teraz ponúka ${fpr(ip?S.p.indiv.price:S.p.price)} €/kWh${ip?' – iba pre vás':''}.`,'market',{key:'price'})}
  render(false);syncInputs();
});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.k&&(el.dataset.t==='c'||el.dataset.t==='s'))render(true)});
let timer=null,bankT=null,plT=null;
function stopTimer(){clearInterval(timer);timer=null}
function startTimer(){stopTimer();timer=setInterval(()=>{
  if(S.sim.idx>=96){S.sim.playing=false;stopTimer();render(false);return}
  const i=S.sim.idx;S.sim.idx++;notifyTick(i,S.sim.idx);
  if(curView()==='home'){const res=dayRun(),per=S.persona==='admin'?null:S.persona,r=res.recs.filter(x=>x.i===i&&!x.kind&&(!per||x.from===per||x.to===per));
    if(r.length){const k=sum(r.map(x=>x.kwh)),amt=sum(r.map(x=>x.amt)),bat=r.some(x=>x.src==='bat');toast(`${I2T(i)}–${I2T(i+1)} · ${fm(k,2)} kWh ${bat?'🔋 z batérie ':''}${per==='anna'?'→ odberateľom':per==='peter'?'od suseda → Peter':'zdieľaných'} · ${fm(amt,2)} €`)}}
  render(false);syncInputs();
},Math.max(16,1000/S.sim.speed))}
function pubGo(v){S.view=v;S.modal=null;window.scrollTo(0,0);render(true)}

/* platný EIC → rovno do registrácie (rola podľa EIC, ak ju poznáme) */
function lpLookup(raw){
 const eic=String(raw||'').replace(/\s/g,'').toUpperCase();
 if(!/^[A-Z0-9-]{16}$/.test(eic)){S.landing={eic,error:'Zadajte 16 znakov EIC kódu z faktúry alebo vložte ukážkový kód.',checked:false};render(false);document.getElementById('lp-eic')?.focus();return false}
 S.landing={eic,error:'',checked:true};const d=EIC_DEMO[eic];if(d&&d.persona){S.persona=d.persona;S.ob.role=d.role}
 /* ďalší krok: registrácia, inak odhad potenciálu; kým nie sú vo finále zapnuté, kód sa iba overí */
 const nx=isOn('register')?'register':isOn('potential')?'potential':null;
 if(!nx){render(false);return true}
 if(nx==='register')S.reg.step='choose';pubGo(nx);return true;
}
document.addEventListener('submit',e=>{if(e.target.id!=='lp-eic-form')return;e.preventDefault();lpLookup(document.getElementById('lp-eic').value)});
/* tlačidlo aj Enter fungujú aj tam, kde prehliadač blokuje odoslanie formulára (náhľady so sandboxom) */
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='lp-eic'){e.preventDefault();lpLookup(e.target.value)}});
document.addEventListener('input',e=>{if(e.target.id==='lp-eic'){S.landing=S.landing||{};S.landing.eic=e.target.value;S.landing.checked=false}});
const ACT={
  eicdemo:a=>{S.persona=a==='anna'?'anna':'peter';S.ob.role=a==='anna'?'prod':'cons';const eic=a==='anna'?'24ZZS0000000001A':'24ZZS0000000002B';S.view='join';lpLookup(eic)},
  eiccheck:()=>lpLookup(($('#lp-eic')||{}).value),
  eicfill:()=>{const i=$('#lp-eic');S.landing={eic:EIC_SAMPLE,error:'',checked:false};if(i){i.value=EIC_SAMPLE;i.focus()}render(false);const j=$('#lp-eic');if(j)j.focus()},
  /* „Som výrobca / Som odberateľ“ na obrazovke Váš potenciál */
  potrole:a=>{S.persona=a==='anna'?'anna':'peter';S.ob.role=a==='anna'?'prod':'cons';S.reg.step='choose';logEv(`Váš potenciál: zvolená rola ${a==='anna'?'výrobca':'odberateľ'}`);pubGo('register')},
  /* režim poroty */
  jury:()=>{S.jury=!S.jury;S.modal=null;if(!S.jury){S.drawer=false;if(S.persona==='admin'){S.persona='peter';if(S.view==='admin')S.view='home'}}toast(S.jury?'🎬 Režim poroty zapnutý – persony, ZSE/VSE a ⚙ sú v hornej lište':'Režim poroty vypnutý');render(true)},
  /* notifikácie */
  bell:()=>{S.modal=S.modal==='bell'?null:'bell';render(true)},
  note:id=>{const n=S.notes.find(x=>x.id===id);S.modal=null;if(!n){render(true);return}n.read=true;const [v,t]=String(n.go||'home').split(':');if(v==='reports'&&t)S.rtab=t;if(v==='market'&&t)S.mtab=t;if(v==='rewards'&&t)S.rwtab=t;pubGo(v)},
  notesread:()=>{myNotes().forEach(n=>n.read=true);render(true)},
  /* prehrávač dňa (Domov) */
  player:()=>{S.pl.idx=24;S.pl.playing=false;S.modal='player';render(false);ACT.plplay()},
  plplay:()=>{const P=S.pl;if(P.playing){P.playing=false;clearInterval(plT);renderModal();return}if(P.idx>=92)P.idx=24;P.playing=true;clearInterval(plT);
    plT=setInterval(()=>{if(S.modal!=='player'){clearInterval(plT);P.playing=false;return}P.idx++;if(P.idx>=92){P.idx=92;P.playing=false;clearInterval(plT)}renderModal()},RM()?90:Math.round(250/P.speed));renderModal()},
  plrestart:()=>{S.pl.idx=24;S.pl.playing=false;clearInterval(plT);ACT.plplay()},
  plspeed:a=>{S.pl.speed=+a;if(S.pl.playing){S.pl.playing=false;ACT.plplay()}else renderModal()},
  plest:()=>{S.pl.est=!S.pl.est;renderModal()},
  plseek:a=>{S.pl.idx=clamp(+a,24,92);S.pl.playing=false;clearInterval(plT);renderModal()},
  /* mapa: klikateľná legenda */
  maphi:a=>{S.mapHi=S.mapHi===a?null:a;render(false)},
  print:()=>{try{window.print()}catch(e){toast('Tlač sa nepodarila')}},
  landingoffer:a=>{S.persona='peter';S.ob.role='cons';if(a==='1')S.bat.on=true;pubGo('market')},
  landingfeature:a=>{if(a==='battery'){S.persona='anna';S.bat.on=true;pubGo('home')}else if(a==='solidarity'){S.persona='anna';pubGo('i_sol')}else if(a==='reports'){S.persona='peter';pubGo('reports')}else{S.persona='peter';pubGo('rewards')}},
  persona:a=>{S.persona=a;if(a==='admin'&&!ADMIN_OK.includes(S.view)&&!S.view.startsWith('i_'))S.view='admin';else if(a!=='admin'&&S.view==='admin')S.view='home';render(true)},
  view:a=>{if(a==='register'&&S.reg.step==='load')S.reg.step='choose';if(a==='map'&&!S.sim.playing&&(S.sim.idx<36||S.sim.idx>=88))S.sim.idx=48;pubGo(a)},
  rtab:a=>{S.rtab=a;render(false)},
  mtab:a=>{S.mtab=a;render(false)},
  mtabgo:a=>{S.mtab=a;pubGo('market')},
  /* výber skupiny priamo z trhoviska */
  grpsel:a=>{const p=S.persona==='admin'?'peter':S.persona,g=GROUPS.find(x=>x.id===a);if(!g)return;S.group=a;S.ob.group=a;S.mem[p]='READY';logEv(`${nm(p)}: vybraná skupina ${g.name} (z trhoviska)`);toast('Skupina '+g.name+' vybraná – odošlite žiadosť');notify('state',p,'Vybraná skupina '+g.name,'Žiadosť je pripravená – odošlite ju.','group');pubGo('group')},
  /* prestup = výstup z terajšej skupiny + rezervácia vybranej */
  grpres:a=>{const p=S.persona==='admin'?'peter':S.persona;if(S.mem[p]==='ENDING'){S.reserve[p]=gname(a)+' (rezervácia po skončení členstva)';toast('Rezervácia uložená: '+gname(a));render(true);return}S.exitSel=a;S.modal='exit';render(false)},
  rwtab:a=>{S.rwtab=a;S.modal=null;if(S.view!=='rewards')S.view='rewards';render(true)},
  bdg:a=>{S.modal='bdg:'+a;render(false)},
  bdgnav:a=>{bdgNav(S.persona,+a);render(false)},
  bdgshare:a=>bdgShare(a),
  bdgopen:a=>{S.rwtab='bdg';S.modal=null;BDG().sel[S.persona]=a;pubGo('rewards')},
  rtabgo:a=>{S.rtab=a;pubGo('reports')},
  drawer:()=>{if(!S.jury&&!S.drawer)return;S.drawer=!S.drawer;render(true);if(S.drawer){const b=$('#drawer button');if(b)b.focus()}},
  play:()=>{if(S.sim.playing){S.sim.playing=false;stopTimer()}else{if(S.sim.idx>=96)S.sim.idx=0;S.sim.playing=true;startTimer()}render(false)},
  speed:a=>{S.sim.speed=+a;if(S.sim.playing)startTimer();render(false)},
  simreset:()=>{S.sim.playing=false;stopTimer();S.sim.idx=0;render(false);syncInputs()},
  sort:a=>{S.match.sort=a;render(false)},
  smart:()=>{S.match.loading=true;S.match.done=false;render(false);setTimeout(()=>{S.match.loading=false;S.match.done=true;S.match.sort='match';render(false);toast('Najlepšie spojenie nájdené')},650)},
  skin:a=>{S.skin=a;render(true)},
  addom:()=>{S.ob.step=2;S.reg.step='full';S.view='register';render(true)},
  cmp:a=>{const i=S.cmp.indexOf(a);if(i>=0)S.cmp.splice(i,1);else if(S.cmp.length>=3){toast('Porovnať môžete najviac 3 ponuky');return}else S.cmp.push(a);render(false)},
  cmpshow:()=>{if(S.cmp.length<2){toast('Vyberte aspoň 2 ponuky');return}S.modal='cmp';render(false)},
  cmpclear:()=>{S.cmp=[];render(false)},
  detail:a=>{S.modal=a;render(false)},
  closemodal:()=>{const was=S.modal;S.modal=null;if(was==='player'){clearInterval(plT);S.pl.playing=false}render(was==='bell'||was==='welcome')},
  calc:()=>{S.modal='calc';render(false)},
  more:()=>{S.modal='more';render(false)},
  interest:a=>{S.modal=null;const p=S.persona;if(p==='admin')return;const m=S.mem[p];
    if(m==='NONE'||m==='MATCH'){S.mem[p]='READY';logEv(`${nm(p)}: žiadosť pripravená (${gname(S.group)})`);toast('Žiadosť pripravená – odošlite ju v časti Moja skupina');notify('state',p,'Žiadosť je pripravená','Odošlite ju v časti Moja skupina.','group');S.view='group'}
    else if(m==='READY'){S.view='group'}
    else{S.reserve[p]=gname(S.group)+' (ponuka '+a+')';logEv(`${nm(p)}: uložená budúca rezervácia`);toast('Jedno OM môže byť iba v jednej skupine – uložená budúca rezervácia')}
    render(true)},
  submit:()=>{const p=S.persona==='admin'?'peter':S.persona;S.mem[p]='PENDING';logEv(`${nm(p)}: virtuálna žiadosť odoslaná`);toast('Žiadosť odoslaná – čaká na aktiváciu');notify('state',p,'Žiadosť odoslaná',`Skupina ${gname(S.group)} – čaká na kontrolu distribútora a aktiváciu.`,'group');render(true)},
  obsubmit:()=>{S.group=S.ob.group;ACT.submit()},
  activate:a=>{const ims=a==='anna'?S.p.ims:S.c.ims;if(!ims){toast('Aktivácia zablokovaná: OM nemá IMS');logEv(`${nm(a)}: aktivácia zamietnutá – chýba IMS`);render(false);return}
    S.mem[a]='ACTIVE';logEv(`${nm(a)}: členstvo aktivované`);toast('Členstvo aktivované');notify('state',a,'Členstvo je aktívne 🎉',`Vitajte v skupine ${gname(S.group)} – zdieľanie začína k 1. dňu mesiaca.`,'group');render(true)},
  exit:()=>{S.exitSel='';S.modal='exit';render(false)},
  exitok:()=>{const p=S.persona,r=(($('input[name=exitRes]:checked')||{}).value)||'';S.modal=null;S.mem[p]='ENDING';if(r)S.reserve[p]=gname(r)+' (rezervácia po skončení členstva)';logEv(`${nm(p)}: žiadosť o výstup${r?' + rezervácia '+gname(r):''}`);toast('Výstup nie je okamžitý – členstvo skončí ku koncu nasledujúceho mesiaca');notify('state',p,'Žiadosť o vystúpenie prijatá',`Zdieľanie pokračuje do konca nasledujúceho mesiaca.${r?' Rezervácia: '+gname(r)+'.':''}`,'group');render(true)},
  endmem:a=>{S.mem[a]='NONE';logEv(`${nm(a)}: členstvo ukončené`);toast('Členstvo ukončené');notify('state',a,'Členstvo ukončené','Novú skupinu si môžete vybrať v Trhovisku.','market:grp');render(true)},
  accept:()=>{S.c.appTime=recAppTime();S.c.accepted=true;logEv('Peter prijal výzvu: presun umývačky na '+S.c.appTime);toast('Výzva prijatá – umývačka presunutá na '+S.c.appTime);render(true);syncInputs()},
  acceptx:a=>{const [ow,k]=a.split('.'),o=A_(ow,k),who=ow==='p'?'Anna':'Peter';o.time=recKey(ow,k);o.accepted=true;logEv(who+' prijal(a) výzvu: '+o.label+' presunutý na '+o.time);toast(who+': '+o.label+' presunutý na '+o.time);render(true);syncInputs()},
  ver:a=>{S.modal='ver:'+a;render(false)},
  setvis:a=>{S.p.vis=a;logEv('Anna: viditeľnosť ponuky → '+a);toast('Viditeľnosť ponuky: '+a);render(true)},
  newcode:()=>{S.p.code='SLNKO-'+(1000+Math.floor(Math.random()*9000));S.codeOk=false;logEv('Anna: nový prepájací kód');toast('Vygenerovaný nový prepájací kód');render(true)},
  copycode:()=>{try{navigator.clipboard.writeText(S.p.code).catch(()=>{})}catch(e){}toast('Kód '+S.p.code+' skopírovaný')},
  usecode:()=>{const v=(($('#codeIn')||{}).value||'').trim().toUpperCase();
    if(S.p.vis===VIS_LOCK){toast('Výrobňa je uzamknutá – kód nefunguje')}
    else if(v&&v===S.p.code.toUpperCase()){S.codeOk=true;logEv('Peter: uplatnený prepájací kód');toast('Kód uplatnený – súkromná ponuka sa zobrazila')}
    else toast('Neplatný kód');
    render(false)},
  setauto:()=>{S.p.auto=true;logEv('Anna: zapnuté automatické obnovovanie ponuky');toast('Automatické obnovovanie ponuky zapnuté');render(true);syncInputs()},
  midnight:()=>{stopTimer();S.sim.playing=false;bdgCommitDay();
    const res=dayRun(),a=agg(res);
    S.pts.base+=earnedToday('peter');S.pts.baseA+=earnedToday('anna');
    if(S.bat.on)S.bat.carry=Math.round(Math.max(0,a.socEnd-res.minK)*100)/100;
    if(a.anna.bank>0)S.bank.bal=Math.round((S.bank.bal+a.anna.bank)*100)/100;
    for(const g of S.gifts)if(g.src==='today'){const dl=sum(res.recs.filter(r=>r.gid===g.id).map(r=>r.kwh));g.kwh=Math.max(0,g.kwh-dl);if(g.kwh<1e-6)g.src='done'}
    S.day++;S.sim.idx=0;
    for(const [ow,ks] of Object.entries(KEYS))for(const k of ks){const o=A_(ow,k);o.accepted=false;o.time=o.orig}
    S.agent.done=[];
    notify('chal','both','Nové výzvy na deň '+S.day,'Presuňte spotrebu do slnečného okna a získajte body.','rewards');
    if(!S.notes.some(n=>n.kind==='month'&&n.day>0))notify('month','both','Vyúčtovanie za október je pripravené','Ukážka mesačného vyúčtovania – stiahnete ju ako PDF.','reports:inv');
    logEv('Polnoc – začal sa deň '+S.day+'; odomknuté nové výzvy'+(S.bat.on?`, v batérii zostáva ${fm(S.bat.carry,1)} kWh nad minimom`:''));toast('🌙 Deň '+S.day+' – odomknuté výzvy sú dostupné');render(true);syncInputs()},
  imsreq:()=>{logEv('Žiadosť o inštaláciu IMS odoslaná');toast('Žiadosť o IMS odoslaná. Presná cena a podmienky budú potvrdené po posúdení žiadosti.')},
  obrole:a=>{S.ob.role=a;render(false)},obgroup:a=>{S.ob.group=a;const m=S.mem[S.persona==='admin'?'peter':S.persona];if(m==='NONE'||m==='MATCH'||m==='READY')S.group=a;render(false)},
  obnext:()=>{S.ob.step=Math.min(7,S.ob.step+1);render(false)},obprev:()=>{S.ob.step=Math.max(1,S.ob.step-1);render(false)},
  regfull:()=>{S.reg.step='full';S.ob.step=1;window.scrollTo(0,0);render(false)},
  regback:()=>{S.reg.step='choose';window.scrollTo(0,0);render(false)},
  sso:co=>{const per=S.persona==='admin'?'peter':S.persona;if(S.persona==='admin')S.persona='peter';const s=SSO[per];
    S.skin=co;S.reg.company=co;S.reg.step='load';S.reg.load=0;S.reg.sent=false;S.om[per].addr=s.addr[co];S.om[per].id=s.id[co];S.om[per].type=s.type;S.om[per].pv=s.pv;
    logEv(`${s.name}: automatické prihlásenie (zákazník ${SKN[co]}, demo)`);render(true);
    const tick=()=>{if(S.reg.step!=='load')return;S.reg.load++;if(S.reg.load>=SSO_STEPS.length){S.reg.step='acc';window.scrollTo(0,0)}render(false);if(S.reg.step==='load')setTimeout(tick,420)};setTimeout(tick,420)},
  ssosubmit:()=>{const per=S.persona==='admin'?'peter':S.persona;const m=S.mem[per];S.reg.sent=true;S.reg.group=S.ob.group;window.scrollTo(0,0);
    if(m==='NONE'||m==='MATCH'||m==='READY'){S.group=S.ob.group;S.mem[per]='PENDING';logEv(`${nm(per)}: žiadosť odoslaná cez účet ${BR()} (${gname(S.group)})`);toast('Žiadosť odoslaná – čaká na kontrolu distribútora a aktiváciu');notify('state',per,'Žiadosť odoslaná',`Skupina ${gname(S.group)} – čaká na kontrolu distribútora.`,'group')}else toast(`Demo: žiadosť do skupiny ${gname(S.reg.group)} odoslaná (${nm(per)} je v demo dátach už aktívny člen)`);
    render(true)},
  mapsel:a=>{S.mapSel=a||null;render(false)},
  mapt:a=>{S.sim.playing=false;stopTimer();S.sim.idx=+a;render(false);syncInputs()},
  twoff:a=>{S.twin.off[a]=!S.twin.off[a];toast((S.twin.off[a]?'Vypnuté: ':'Zapnuté: ')+(TWH.find(h=>h.id===a)||{}).n);render(false)},
  bankplay:()=>{if(S.bank.playing){S.bank.playing=false;clearInterval(bankT);render(false);return}
    S.bank.playing=true;if(S.bank.month>=5)S.bank.month=0;render(false);clearInterval(bankT);
    bankT=setInterval(()=>{if(S.bank.month>=5||!S.bank.playing){S.bank.playing=false;clearInterval(bankT);render(false);return}S.bank.month++;render(false)},1100)},
  paysun:k=>{const it=[['Obed dňa',8.9],['Polievka',3.5],['Káva',2.4]][+k],coins=it[1]/coinEur();
    if(S.bank.bal<coins){toast('Na účte nie je dosť slnečných mincí');return}
    S.bank.bal=Math.round((S.bank.bal-coins)*100)/100;S.bank.pays.unshift({t:new Date().toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'}),item:it[0],coins});
    logEv(`Anna zaplatila slnkom: ${it[0]} (${fm(coins,1)} mincí)`);toast(`☀ Zaplatené slnkom: ${it[0]} = ${fm(coins,1)} mincí`);render(false)},
  agenton:()=>{S.agent.on=true;logEv('AI správca zapnutý');toast('🤖 AI správca zapnutý');render(true)},
  agentappl:()=>{const ap=S.agent.appl,done=[];
    const mark=(ow,k)=>{if(!S.agent.done.some(([a,b])=>a===ow&&b===k))S.agent.done.push([ow,k])};
    if(ap.pw&&!S.p.pw.accepted){S.p.pw.time=recKey('p','pw');S.p.pw.accepted=true;mark('p','pw');done.push('pračka Anny → '+S.p.pw.time)}
    if(ap.pb&&!S.p.pb.accepted){S.p.pb.time=recKey('p','pb');S.p.pb.accepted=true;mark('p','pb');done.push('bojler Anny → '+S.p.pb.time)}
    if(ap.wash&&!S.c.accepted){S.c.appTime=recAppTime();S.c.accepted=true;mark('c','wash');done.push('umývačka Petra → '+S.c.appTime)}
    if(ap.ev&&!S.c.ev.accepted){S.c.ev.time=recKey('c','ev');S.c.ev.accepted=true;mark('c','ev');done.push('nabíjanie Petra → '+S.c.ev.time)}
    if(done.length){logEv('AI správca naplánoval: '+done.join(', '));toast('🤖 Naplánované: '+done.join(', '))}else toast('Všetky povolené spotrebiče sú už naplánované');render(true)},
  agentreset:()=>{S.agent.cancel={};render(false)},
  agcx:k=>{S.agent.cancel[k]=!S.agent.cancel[k];logEv(`AI správca: rozhodnutie „${k}“ ${S.agent.cancel[k]?'zrušené používateľom':'obnovené'}`);render(false)},
  stickerpng:()=>{const {sh,lv}=badgeShare(),month=new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'}),svg=stickerSvg(S.badge.name||'Bistro',sh,lv,month);
    const img=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    img.onload=()=>{try{const c=document.createElement('canvas');c.width=c.height=800;const x=c.getContext('2d');x.drawImage(img,0,0,800,800);URL.revokeObjectURL(url);c.toBlob(b=>{const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='nalepka-varime-zo-slnka.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)},'image/png');toast('Nálepka stiahnutá')}catch(e){toast('Sťahovanie sa nepodarilo')}};
    img.onerror=()=>{URL.revokeObjectURL(url);toast('Sťahovanie sa nepodarilo')};img.src=url},
  sendto:k=>{S.send.to=k;render(false)},
  sendsun:()=>{const s=S.send,kwh=Math.max(0,+s.kwh||0),c=CONTACTS[s.to];
    if(!c||kwh<=0){toast('Vyberte príjemcu a množstvo');return}
    if(s.src==='bank'&&S.bank.bal<kwh){toast(`V Slnečnej banke je len ${fm(S.bank.bal,1)} kWh`);return}
    if(s.src==='bank')S.bank.bal=Math.round((S.bank.bal-kwh)*100)/100;
    const g={id:'g'+Date.now(),to:s.to,kwh,src:s.src,fee:Math.max(0,+s.fee||0),occ:s.occ,msg:s.msg,t:new Date().toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'})};
    S.gifts.push(g);s.last=g.id;s.anim={t0:performance.now(),to:s.to};
    logEv(`Anna poslala slnko: ${fm(kwh,1)} kWh → ${c.name} (${c.town})`);render(false);
    setTimeout(()=>{if(S.send.anim){S.send.anim=null;render(false)}toast(`🎁 ${c.name} dostala ${fm(kwh,1)} kWh slnka`)},RM()?50:2400)},
  chat:()=>{S.chat.open=!S.chat.open;if(S.chat.open)S.chat.focus=true;renderChat();if(!S.chat.open)$('#fab').focus()},
  ask:q=>{S.chat.open=true;chatSend(q)},
  resetall:()=>{S.sim.playing=false;stopTimer();clearInterval(bankT);clearInterval(plT);const d=S.drawer,v=S.view,p=S.persona,ch=S.chat,j=S.jury;S=defaults();S.drawer=d;S.view=v;S.persona=p;S.chat=ch;S.jury=j;if(!j)S.sim.idx=realIdx();render(true);toast('Demo dáta obnovené')},
  csv:()=>{const res=dayRun(),per=S.persona;const ft=per!=='peter';const rows=[['Datum','Interval','Vyrobca','Odberatel','Typ','kWh','Cena EUR/kWh','Suma EUR'].concat(ft?['Provizia '+BR()+' EUR','Vyplata vyrobcovi EUR']:[])];
    res.recs.filter(r=>r.i<S.sim.idx&&(per==='admin'||r.from===per||r.to===per)).forEach(r=>rows.push([new Date().toLocaleDateString('sk-SK'),I2T(r.i)+'-'+I2T(r.i+1),nm(r.from),nm(r.to),r.kind||r.src||'predaj',r.kwh.toFixed(3),r.price,r.amt.toFixed(4)].concat(ft?[r.com.toFixed(4),(r.amt-r.com).toFixed(4)]:[])));
    const b=new Blob(['﻿'+rows.map(r=>r.join(';')).join('\n')],{type:'text/csv'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='econnect-ledger.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},
  tour:()=>runTour(),tourstop:()=>{S.tourOn=false;caption('')}
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;if(el.classList.contains('modal-bg')&&e.target!==el)return;
  if(el.tagName==='LABEL')return;
  const [n,...r]=el.dataset.act.split(':');if(ACT[n]){ACT[n](r.join(':'))}});
document.addEventListener('submit',e=>{if(e.target.id==='chatf'){e.preventDefault();const i=$('#chatin');const q=i.value;i.value='';S.chat.focus=true;chatSend(q)}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(S.modal){ACT.closemodal()}else if(S.chat.open){ACT.chat()}else if(S.drawer){ACT.drawer();$('[data-act="drawer"]')?.focus()}return}
  const t=e.target;
  if(t&&t.dataset&&t.dataset.drag&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();const dir=(e.key==='ArrowLeft'||e.key==='ArrowDown')?-1:1;
    if(t.dataset.drag==='sun'){S.sim.playing=false;stopTimer();S.sim.idx=e.key==='Home'?24:e.key==='End'?80:clamp(S.sim.idx+dir,24,80)}else S.twin.cloud=e.key==='Home'?40:e.key==='End'?720:clamp(S.twin.cloud+dir*20,40,720);render(false);return}
  if((e.key==='Enter'||e.key===' ')&&t&&t.getAttribute&&t.getAttribute('role')==='button'&&t.dataset.act&&t.tagName!=='BUTTON'){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
});
/* ťahanie slnka a oblaku v dvojčati mesta */
let drag=null,dragRAF=0;
document.addEventListener('pointerdown',e=>{const g=e.target.closest&&e.target.closest('[data-drag]');if(!g)return;drag=g.dataset.drag;e.preventDefault();if(S.sim.playing){S.sim.playing=false;stopTimer()}});
document.addEventListener('pointermove',e=>{if(!drag)return;const svg=document.getElementById('twinsvg');if(!svg)return;const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*760;
  if(drag==='sun')S.sim.idx=Math.round(clamp(24+(x-40)/680*56,24,80));else S.twin.cloud=clamp(x,40,720);
  if(!dragRAF)dragRAF=requestAnimationFrame(()=>{dragRAF=0;render(false)})});
document.addEventListener('pointerup',()=>{drag=null});document.addEventListener('pointercancel',()=>{drag=null});

/* ---------- demo príbeh ---------- */
async function runTour(){
  if(S.tourOn)return;stopTimer();clearInterval(bankT);
  clearInterval(plT);const ch=S.chat;S=defaults();S.chat=ch;S.tourOn=true;S.jury=true;S.mem={anna:'NONE',peter:'NONE'};S.persona='anna';S.view='landing';S.sim.idx=0;render(true);window.scrollTo(0,0);
  const step=async(msg,fn,ms=2600)=>{if(!S.tourOn)return false;caption(msg);if(fn){fn();window.scrollTo(0,0)}await sleep(ms);return S.tourOn};
  try{
  if(!await step('<b>1/10</b> Úvod: jeden vstup cez EIC pre výrobcu aj odberateľa.',null,2400))return;
  if(!await step('<b>2/10</b> Ukážkový EIC → rovno do registrácie.',()=>{S.landing={eic:EIC_SAMPLE,error:'',checked:true};S.reg.step='choose';pubGo('register')},2600))return;
  if(!await step('<b>3/10</b> Anna je zákazníčka ZSE – stačí kliknúť a prihlási sa automaticky.',null,2200))return;
  if(!await step('Načítavame odberné miesto, IMS aj zmluvy z účtu ZSE…',()=>ACT.sso('zse'),2600))return;
  if(!await step('Súhlas, výber skupiny a žiadosť je odoslaná. Peter sa pridal tiež.',()=>{S.ob.consent=true;ACT.ssosubmit();S.mem.peter='PENDING'},2400))return;
  if(!await step('<b>4/10</b> Operátor ZSE skontroluje distribútora a aktivuje členstvá.',()=>{S.persona='admin';pubGo('admin')},2200))return;
  if(!await step('Členstvá sú aktívne.',()=>{S.mem.anna='ACTIVE';S.mem.peter='ACTIVE';logEv('Operátor aktivoval členstvá');render(true)},1500))return;
  if(!await step('<b>5/10</b> Peter v trhovisku: Smart Match nájde najlepšie spojenie – aj večernú ponuku z batérie.',()=>{S.persona='peter';pubGo('market');ACT.smart()},3200))return;
  if(!await step('<b>6/10</b> Mapa: domčeky ZSE (červené) a VSE (modré), elektrina tečie virtuálnou sieťou.',()=>{S.sim.idx=44;S.sim.speed=10;pubGo('map');S.sim.playing=true;startTimer();render(false)},4400))return;
  if(!await step('<b>7/10</b> Večer predáva Annina batéria – drahšie ako na obed, lacnejšie ako zo siete.',()=>{S.sim.playing=false;stopTimer();S.sim.idx=78;S.persona='anna';pubGo('map')},2800))return;
  if(!await step('Anna vidí stav batérie a zisk z nej.',()=>{S.sim.idx=96;pubGo('home');setTimeout(()=>{const c=[...document.querySelectorAll('#main h3')].find(h=>h.textContent.includes('Večerná ponuka'));c&&c.scrollIntoView({behavior:RM()?'auto':'smooth',block:'center'})},200)},3200))return;
  if(!await step('<b>8/10</b> Slnečná banka: uložte si júlové slnko na Vianoce.',()=>{S.bank.on=true;S.bank.month=0;pubGo('i_bank');ACT.bankplay()},4800))return;
  if(!await step('…a AI správca vyjedná cenu a rozhodne, koľko uložiť do batérie a banky.',()=>{S.bank.playing=false;clearInterval(bankT);S.agent.on=true;S.sim.idx=0;S.sim.speed=60;pubGo('i_agent');S.sim.playing=true;startTimer()},4400))return;
  if(!await step('<b>9/10</b> Mesačný report: deň, batéria, banka – všetko z jedného enginu.',()=>{S.sim.playing=false;stopTimer();S.sim.idx=96;S.rtab='rep';pubGo('reports')},3200))return;
  if(!await step('<b>10/10</b> Operátor vidí províziu iba od výrobcu, bilanciu každej kWh a audit súčtov.',()=>{S.persona='admin';pubGo('admin');setTimeout(()=>window.scrollTo({top:900,behavior:RM()?'auto':'smooth'}),200)},4200))return;
  }finally{S.tourOn=false;caption('')}
}

/* ---------- štart: deep link → živý čas ---------- */
/* priamy odkaz na obrazovku dema, napr. index.html#view=reports&persona=anna&t=48 */
{const h=new URLSearchParams(location.hash.slice(1));
 if(h.has('jury'))S.jury=h.get('jury')!=='0';
 if(h.get('persona')==='admin'||h.has('skin'))S.jury=true;
 if(['anna','peter','admin'].includes(h.get('persona')))S.persona=h.get('persona');
 if(VIEWS[h.get('view')])S.view=h.get('view');
 if(h.get('skin')in SKN)S.skin=h.get('skin');
 if(h.has('t'))S.sim.idx=clamp(parseInt(h.get('t'),10)||0,0,96);
 if(['ch','bdg'].includes(h.get('tab')))S.rwtab=h.get('tab')}
/* zákaznícky režim: „Práve teraz“ ide podľa hodín (ak deep link neurčil čas) */
if(!S.jury&&!new URLSearchParams(location.hash.slice(1)).has('t'))S.sim.idx=realIdx();
render(true);
/* priesvitná lišta nad hero: po začatí scrollovania je plná, aby menu ostalo čitateľné nad obsahom */
{const onScroll=()=>document.body.classList.toggle('scrolled',window.scrollY>24);addEventListener('scroll',onScroll,{passive:true});onScroll()}
setInterval(()=>{if(S.jury||S.sim.playing||S.tourOn)return;const r=realIdx();if(r===S.sim.idx)return;notifyTick(S.sim.idx,r);S.sim.idx=r;if(!S.modal&&!PUB.includes(curView()))render(false)},30000);
/* aplikácia v mobile (PWA) – service worker iba cez http(s), nie z file:// ani zo samostatného zdielna.html */
if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol)&&!window.__STANDALONE)navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__S=()=>S;

