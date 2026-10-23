'use strict';
/* ---------- nápady ---------- */
/* stav: ok = rozvíjame (dá sa otvoriť), soon = pripravujeme (sivá karta, neotvára sa) */
const IDEAS=[
 ['i_badge','award','Varíme zo slnka od suseda','Značka a certifikát pre malé podniky, ktoré varia z lokálneho slnka.','ok'],
 ['i_sol','heart','Solidárne slnko','Darujte časť prebytku tým, ktorí to potrebujú – bez provízie a poplatkov.','ok']];
const ideaCard=([id,ic,t,d,st])=>st==='soon'?`<div class="idea soon" aria-disabled="true"><span class="idea-soon">Pripravujeme…</span><span class="ico">${icon(ic)}</span><b style="font-size:18px;letter-spacing:-.02em">${t}</b><span class="sm mut">${d}</span></div>`:`<button class="idea ${st==='q'?'q':''}" data-act="view:${id}"><span class="row between" style="width:100%"><span class="ico">${icon(ic)}</span>${st==='q'?pill('o','? na zváženie'):''}</span><b style="font-size:18px;letter-spacing:-.02em">${t}</b><span class="sm mut">${d}</span><span class="b go">Otvoriť →</span></button>`;
function vIdeas(){
  return `<div class="gap">${hero({kicker:'Vízie',title:'Kam môže Zdieľňa <em>rásť.</em>',lead:'Vízie s vlastnou interaktívnou ukážkou – počítajú tým istým enginom ako celá aplikácia. Ide o koncepty, nie existujúce produkty.',aside:hstat('Rozvíjame',String(IDEAS.filter(x=>x[4]!=='soon').length),'nápady s ukážkou')+hstat('Pripravujeme',String(IDEAS.filter(x=>x[4]==='soon').length),IDEAS.filter(x=>x[4]==='soon').map(x=>x[2]).join(', '))})}
  ${secHead('Rozvíjame','Nápady, ktoré rozvíjame.')}<div class="ideas">${IDEAS.map(ideaCard).join('')}</div></div>`;
}
function ideaHead(id,story){
  const L=IDEAS.filter(x=>x[4]!=='soon'||x[0]===id),k=L.findIndex(x=>x[0]===id),[,ic,t,,st]=L[k],prev=L[(k+L.length-1)%L.length],next=L[(k+1)%L.length];
  return hero({cls:'ihero compact',top:`<button class="btn ghost sm" data-act="view:ideas">← Všetky nápady</button><span class="pill n">Nápad ${k+1} / ${L.length}</span><span class="pill n">Vízia / koncept</span>${st==='q'?pill('o','? na zváženie'):''}`,
    kicker:'Nápad',title:t,lead:story,
    foot:`<button class="btn ghost sm" data-act="view:${prev[0]}">← ${prev[2]}</button><button class="btn ghost sm" data-act="view:${next[0]}">${next[2]} →</button>`});
}
const gains=(cu,co)=>`<div class="gains"><div class="card" style="border-top:5px solid var(--green)"><h3>Čo z toho má zákazník</h3><ul class="sm">${cu.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card" style="border-top:5px solid var(--brand)"><h3>Čo z toho má ${BR()}</h3><ul class="sm">${co.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`;
function badgeShare(){const a=agg(dayRun()),sh=a.peter.cons>0?a.peter.recv/a.peter.cons:0,lv=sh>=.6?'zlato':sh>=.4?'striebro':sh>=.2?'bronz':null;return {sh,lv,a}}
const LVC={zlato:['#b8860b','🥇'],striebro:['#8a94a6','🥈'],bronz:['#a0522d','🥉']};
/* ---------- Dobrý sused: znak iba pre prevádzky, ktoré spĺňajú všetky tri podmienky ----------
   1 – energia zo slnka od susedov (aspoň 20 % spotreby), 2 – darujú cez Solidárne slnko, 3 – overené meraním (IMS).
   Bez všeobecných „zelených“ tvrdení – na nálepke aj profile iba merateľné čísla.
   QR kód na nálepke otvorí verejný profil prevádzky s ponukou pridať sa do Zdieľne (s odporúčacím kódom prevádzky). */
const ESG_MIN=.2;
const esgSlug=n=>String(n||'prevadzka').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esgRef=n=>'ZDIELNA-'+esgSlug(n).replace(/-/g,'').slice(0,6).toUpperCase();
const esgUrl=n=>`https://zdielna.sk/p/${esgSlug(n)}?ref=${esgRef(n)}`;
function esgStats(){
  const {sh,a}=badgeShare(),d=S.sim.days,E=S.esg,r=RCP[E.rcp]||RCP.r2;
  const saved=a.peter.saved*d,donKwh=E.on?E.kwh:0,unit=a.peter.recv>0?a.peter.paid/a.peter.recv:S.p.price,donEur=donKwh*unit,val=donKwh*S.c.ref;
  const okE=sh>=ESG_MIN,okS=E.on&&donKwh>0,okG=!!S.c.ims;
  return {sh,a,d,saved,donEur,donKwh,unit,val,r,okE,okS,okG,ok:okE&&okS&&okG,co2:a.peter.recv*d*S.twin.co2};
}
const esgOk=()=>isShop()&&esgStats().ok;
/* nálepka na dvere – znak + QR kód s odkazom na verejný profil */
function stickerSvg(name,sh){
  const qr=QR(esgUrl(name)),n=qr.length;let q='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr[y][x])q+=`M${x},${y}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Nálepka Dobrý sused"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1424"/><stop offset=".65" stop-color="#0b3b2e"/><stop offset="1" stop-color="#0e9f6e"/></linearGradient></defs>
  <circle cx="200" cy="200" r="196" fill="url(#sg)"/><circle cx="200" cy="200" r="182" fill="none" stroke="#5eeab5" stroke-width="3" stroke-dasharray="6 7" opacity=".8"/>
  <text x="200" y="62" fill="#5eeab5" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="800" letter-spacing="3" text-anchor="middle">ZDIEĽŇA</text>
  <text x="200" y="104" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="800" text-anchor="middle">DOBRÝ SUSED</text>
  <g transform="translate(140,124)"><rect width="120" height="120" rx="10" fill="#fff"/><g transform="translate(8,8) scale(${(104/n).toFixed(4)})"><path d="${q}" fill="#0b1424"/></g></g>
  <text x="200" y="288" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="800" text-anchor="middle">NASKENUJTE A POZRITE,</text>
  <text x="200" y="310" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">koľko slnka berieme od susedov</text><text x="200" y="328" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">a komu pomáhame</text>
  <text x="200" y="354" fill="#5eeab5" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" text-anchor="middle">${esc(String(name).slice(0,28))}</text></svg>`;
}
const esgPill=(k,t,ok)=>`<span class="esg-p ${ok?'ok':''}"><b>${k}</b>${t}</span>`;
function vCert(){
  const x=esgStats(),name=S.badge.name||'Bistro',month=new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'});
  const crit=[['1','Slnko od susedov',`${pct(x.sh)} spotreby z prebytkov susedov (potrebné aspoň ${pct(ESG_MIN)})`,x.okE,x.okE?'':'<button class="link" data-act="view:challenges">Ako zvýšiť podiel →</button>'],
   ['2','Pomáha v okolí',x.okS?`Darujete ${fm(x.donKwh,0)} kWh mesačne pre ${x.r.name}`:'Darujte kWh zo slnka susedov cez Solidárne slnko – nastavíte nižšie.',x.okS,''],
   ['3','Overené meraním','Údaje z inteligentného elektromera (IMS), zúčtovanie cez Zdieľňu.',x.okG,'']];
  const head=hero({kicker:'Slnečný klub · Dobrý sused',title:x.ok?'Ste dobrý sused. <em>Ukážte to zákazníkom.</em>':'Staňte sa <em>dobrým susedom.</em>',
    lead:x.ok?'Vaša prevádzka spĺňa všetky tri podmienky. Nálepka s QR kódom ukáže zákazníkom konkrétne čísla – koľko slnka beriete od susedov a komu pomáhate – a pozve ich do Zdieľne.':'Znak dostanú iba prevádzky, ktoré berú elektrinu zo slnka od susedov a zároveň pomáhajú tým, ktorí to potrebujú. Splňte všetky tri podmienky.',
    aside:hstat('Splnené podmienky',`${[x.okE,x.okS,x.okG].filter(Boolean).length} / 3`,x.ok?'znak je aktívny':'znak sa odomkne po splnení všetkých')});
  const checks=`<div class="card"><span class="kicker">Podmienky znaku</span><h3>Tri podmienky</h3><div class="esg-crit">${crit.map(([k,t,d,ok,act])=>`<div class="esg-c ${ok?'ok':''}"><span class="esg-k">${ok?'✓':k}</span><div><b>${t}</b><p class="sm mut">${d}</p>${act}</div></div>`).join('')}</div></div>`;
  const don=`<div class="card" id="esg-don"><h3>${icon('heart')} Solidárne slnko pre prevádzky</h3><p class="sm mut" style="margin-top:4px">Darujte kWh elektriny zo slnka vašich susedov. Odoberieme ich vo vašom mene a doručíme rodine, škole alebo charite vo vašom okolí – bez provízie a poplatkov.</p>
   <div class="fields" style="margin-top:10px">${F('Darovať kWh mesačne','esg.on',{t:'c'})}${S.esg.on?F('Koľko kWh mesačne','esg.kwh',{t:'r',min:5,max:100,step:5,u:' kWh'})+F('Príjemca','esg.rcp',{t:'s',opts:Object.entries(RCP).map(([k,v])=>[k,v.ic+' '+v.name])}):''}</div>
   ${S.esg.on?`<p class="sm" style="margin-top:8px">Mesačne <b>${fm(x.donKwh,0)} kWh</b> pre ${x.r.name} (${x.r.via}) – pre príjemcu hodnota ${eur(x.val)}. Vás to stojí ${eur(x.donEur)} za cenu zdieľania ${fpr(x.unit)} €/kWh, teda ${pct(x.donEur/Math.max(.01,x.saved))} z vašej mesačnej úspory ${eur(x.saved)}.</p>`:''}</div>`;
  const profile=`<div class="card"><span class="kicker">Čo uvidí zákazník po naskenovaní</span><h3>Verejný profil prevádzky</h3>
   <div class="esg-phone"><div class="esg-scr"><span class="esg-badge">${icon('heart')} Dobrý sused</span><b class="esg-name">${esc(name)}</b><span class="xs mut">Trnava · člen Zdieľne od ${esc(month)}</span>
    <div class="esg-pills">${esgPill('1',`${pct(x.sh)} elektriny zo slnka susedov`,x.okE)}${esgPill('2',x.okS?`${fm(x.donKwh,0)} kWh mesačne pre ${x.r.name}`:'darovanie zatiaľ nezapnuté',x.okS)}${esgPill('3','overené meraním IMS',x.okG)}</div>
    <div class="esg-cta"><b>Chcete aj vy elektrinu od susedov?</b><span class="xs">Pridajte sa do Zdieľne s kódom <b>${esgRef(name)}</b> – zákazník aj prevádzka získajú iWatt.</span><button class="btn pri sm" data-act="view:landing">Pridať sa do Zdieľne</button></div></div></div>
   <p class="xs mut" style="margin-top:8px">QR kód vedie na <code>${esc(esgUrl(name))}</code> (ukážka). Odporúčanie sa započíta podľa pravidiel prémie za odporúčanie.</p></div>`;
  const sticker=`<div class="card esg-st ${x.ok?'':'off'}" style="text-align:center"><h3>Nálepka na dvere s QR kódom</h3><div class="esg-st-img" id="sticker">${stickerSvg(name,x.sh)}</div>
   ${x.ok?'<div class="row" style="justify-content:center"><button class="btn pri sm" data-act="stickerpng">⬇ Stiahnuť nálepku (PNG)</button></div>':`<p class="sm mut">Nálepku si stiahnete po splnení všetkých troch podmienok.</p>`}
   <div class="fields one" style="margin-top:10px;text-align:left">${F('Názov prevádzky na nálepke','badge.name',{t:'x'})}</div></div>`;
  return `<div class="gap">${head}<div class="grid g2">${checks}${sticker}</div><div class="grid g2">${don}${profile}</div></div>`;
}
function vIdeaSol(){
  const on=S.don.on,res=on?dayRun():runDay(S.c.appTime,{cfg:{...manualCfg(),donPct:S.don.pct}}),a=agg(res),A=a.anna,d=S.sim.days,r=RCP[S.don.rcp];
  const mon=A.don*d,val=mon*S.c.ref,lost=mon*S.p.feedin,hh=S.don.need>0?Math.floor(mon/S.don.need):0;
  const ok=Math.abs(a.debT-a.netT-a.comT)<1e-9;
  return `<div class="gap">${ideaHead('i_sol','Anna má cez víkend viac slnka, než susedia minú. Časť zvyšku, ktorý by inak išiel výkupcovi za pár centov, daruje rodine v núdzi alebo škole. Energiu doručí obec – bez provízie a bez poplatkov.')}
  <div class="grid g2"><div class="card"><h3>Nastavenie daru</h3><div class="fields one" style="margin-top:8px">${F('Zapojiť Solidárne slnko do výpočtu','don.on',{t:'c'})}${F('Darovať zo zvyšku prebytku (po skupine a batérii)','don.pct',{t:'r',u:' %'})}${F('Príjemca','don.rcp',{t:'s',opts:Object.entries(RCP).map(([k,v])=>[k,v.ic+' '+v.name])})}${F('Mesačná podpora na domácnosť','don.need',{step:5,min:1,u:'kWh'})}</div>
    ${on?'':`<p class="sm" style="margin-top:8px;color:var(--orange)">Náhľad – darovanie zatiaľ nie je zapnuté v enginu. Po zapnutí sa premietne do ledgera, auditu aj mapy.</p>`}</div>
   <div class="card" style="border-left:5px solid #f5b400"><h3>${r.ic} ${r.name}</h3><div class="xs mut">${r.via}</div>
    <div class="grid g2" style="margin-top:10px;gap:8px">${kpi('Darované dnes',fm(A.don,2)+' kWh')}${kpi('Darované mesačne',fm(mon,0)+' kWh')}${kpi('Hodnota pre príjemcu',eur(val),'pri cene '+fpr(S.c.ref)+' €/kWh')}${kpi('Podporené domácnosti',String(hh),'pri '+fm(S.don.need,0)+' kWh/mesiac')}</div>
    <p class="sm mut" style="margin-top:8px">Vy sa vzdávate výkupu ${eur(lost)} mesačne – príjemca ušetrí ${eur(val)}. Každé darované euro výkupu má pre príjemcu ${fm(S.c.ref/Math.max(.001,S.p.feedin),1)}× vyššiu hodnotu.</p></div></div>
  <div class="grid g2"><div class="card"><h3>Bez poplatkov – overené v zúčtovaní</h3><table style="margin-top:6px"><tbody><tr><td>Platba príjemcu</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Provízia ${BR()} z darovanej energie</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Poplatky výrobcovi</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Provízia z predanej energie (bez zmeny)</td><td class="n">${fm(a.comT,3)} €</td></tr></tbody></table><div class="pill ${ok?'g':'r'}" style="margin-top:8px">${ok?'✓':'✕'} Audit: platby odberateľov ${fm(a.debT,3)} € = výplata ${fm(a.netT,3)} € + provízia ${fm(a.comT,3)} €</div><p class="xs mut" style="margin-top:6px">Darované kWh majú v ledgeri typ „dar“, cenu 0 € a províziu 0 €.</p></div>
   <div class="card" style="background:var(--yellow-t)"><h3>💌 Poďakovanie od príjemcu</h3><p style="margin-top:8px;font-style:italic">„Ďakujeme! Vďaka vášmu slnku sme tento mesiac ušetrili ${eur(val)} na elektrine. ${S.don.rcp==='r2'?'Deti mali teplú vodu v telocvični aj počas sychravých dní.':'Je to pre nás veľká pomoc.'}“</p><p class="xs mut" style="margin-top:8px">— ${r.name} (ilustračné)</p></div></div>
  ${gains(['Zmysel: zvyšok, ktorý by išiel výkupcovi za pár centov, pomôže susedom.','Žiadne poplatky ani provízia – celá hodnota ide príjemcovi.','Prehľad dopadu: kWh, eurá, počet domácností.'],['Silný príbeh komunitnej energetiky a spoločenskej zodpovednosti.','Spolupráca so samosprávami a sociálnymi službami.','Lojalita výrobcov – zapojenie nad rámec zisku.'])}</div>`;
}
function moreSheet(){
  const L=[['group','Skupina zdieľania','group'],['reports','Prehľady','chart'],['rewards','Odmeny','star'],['profile','Nastavenia','user']];
  return `<div class="modal-bg" data-act="closemodal" style="align-items:flex-end;padding:0"><div class="more" role="dialog" aria-modal="true" aria-label="Viac"><div class="row between"><h2>Viac</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div><div class="gridm">${L.map(([k,l,i])=>`<button data-act="view:${k}">${icon(i)}${l}</button>`).join('')}</div><button class="btn sm jury-btn" style="width:100%;margin-top:14px" data-act="jury" aria-pressed="${!!S.jury}">🎬 ${S.jury?'Vypnúť režim poroty':'Režim poroty'}</button></div></div>`;
}


