'use strict';
/* ---------- nápady ---------- */
/* stav podľa pripomienok (obr. 8): ok = ponechať, q = na zváženie */
const IDEAS=[
 ['i_badge','award','Varíme zo slnka od suseda','Značka a certifikát pre malé podniky, ktoré varia z lokálneho slnka.','ok'],
 ['i_sol','heart','Solidárne slnko','Darujte časť prebytku tým, ktorí to potrebujú – bez provízie a poplatkov.','ok'],
 ['i_agent','bot','AI správca','Agenti vyjednávajú ceny a spravujú vašu energiu každých 15 minút.','ok'],
 ['i_send','gift','Pošli slnko','Pošlite kWh babke do Košíc ako darček.','ok'],
 ['i_ev','car','Elektromobil ako batéria ulice','Auto sa cez deň nabije zo striech a večer pomôže bistru.','ok'],
 ['i_bank','bank','Slnečná banka','Uložte si júlové slnko na Vianoce a plaťte ním v bistre.','q'],
 ['i_twin','city','Živé dvojča mesta','Potiahnite slnko a oblak – celé mestečko sa prepočíta naživo.','q']];
const ideaCard=([id,ic,t,d,st])=>`<button class="idea ${st==='q'?'q':''}" data-act="view:${id}"><span class="row between" style="width:100%"><span class="ico">${icon(ic)}</span>${st==='q'?pill('o','? na zváženie'):''}</span><b style="font-size:18px;letter-spacing:-.02em">${t}</b><span class="sm mut">${d}</span><span class="b go">Otvoriť →</span></button>`;
function vIdeas(){
  const ok=IDEAS.filter(x=>x[4]==='ok'),q=IDEAS.filter(x=>x[4]==='q');
  return `<div class="gap">${hero({kicker:'Vízie',title:'Kam môže Zdieľňa <em>rásť.</em>',lead:'Sedem vízií s vlastnou interaktívnou ukážkou – všetky počítajú tým istým enginom ako celá aplikácia. Ide o koncepty, nie existujúce produkty.',aside:hstat('Ponechávame',String(ok.length),'nápadov')+hstat('Na zváženie',String(q.length),'Slnečná banka, Živé dvojča')})}
  ${secHead('Ponechávame','Nápady, ktoré rozvíjame.')}<div class="ideas">${ok.map(ideaCard).join('')}</div>
  ${secHead('Otvorená otázka','Na zváženie.','Tieto vízie zatiaľ nie sú rozhodnuté – ponechať, alebo odstrániť?')}<div class="ideas">${q.map(ideaCard).join('')}</div></div>`;
}
function ideaHead(id,story){
  const k=IDEAS.findIndex(x=>x[0]===id),[,ic,t,,st]=IDEAS[k],prev=IDEAS[(k+IDEAS.length-1)%IDEAS.length],next=IDEAS[(k+1)%IDEAS.length];
  return hero({cls:'ihero compact',top:`<button class="btn ghost sm" data-act="view:ideas">← Všetky nápady</button><span class="pill n">Nápad ${k+1} / ${IDEAS.length}</span><span class="pill n">Vízia / koncept</span>${st==='q'?pill('o','? na zváženie'):''}`,
    kicker:'Nápad',title:t,lead:story,
    foot:`<button class="btn ghost sm" data-act="view:${prev[0]}">← ${prev[2]}</button><button class="btn ghost sm" data-act="view:${next[0]}">${next[2]} →</button>`});
}
const gains=(cu,co)=>`<div class="gains"><div class="card" style="border-top:5px solid var(--green)"><h3>Čo z toho má zákazník</h3><ul class="sm">${cu.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card" style="border-top:5px solid var(--brand)"><h3>Čo z toho má ${BR()}</h3><ul class="sm">${co.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`;
function badgeShare(){const a=agg(dayRun()),sh=a.peter.cons>0?a.peter.recv/a.peter.cons:0,lv=sh>=.6?'zlato':sh>=.4?'striebro':sh>=.2?'bronz':null;return {sh,lv,a}}
const LVC={zlato:['#b8860b','🥇'],striebro:['#8a94a6','🥈'],bronz:['#a0522d','🥉']};
function stickerSvg(name,sh,lv,month){
  const [c,md]=LVC[lv]||['#5d6675','☀'],qr=QR(`Zdieľňa | ${name.slice(0,24)} | ${Math.round(sh*100)} % slnka od susedov | ${month}`),n=qr.length;
  let q='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr[y][x])q+=`M${x},${y}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Nálepka Varíme zo slnka od suseda"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d3b1f"/><stop offset=".6" stop-color="#14833b"/><stop offset="1" stop-color="#e7a400"/></linearGradient></defs><circle cx="200" cy="200" r="196" fill="url(#sg)"/><circle cx="200" cy="200" r="182" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 7" opacity=".8"/>
  <text x="200" y="74" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">VARÍME ZO SLNKA</text><text x="200" y="100" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">OD SUSEDA</text>
  <g transform="translate(130,116)"><rect width="140" height="140" rx="10" fill="#fff"/><g transform="translate(10,10) scale(${(120/n).toFixed(4)})"><path d="${q}" fill="#111"/></g></g>
  <text x="200" y="292" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">NASKENUJTE</text>
  <text x="200" y="320" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">a pozrite, koľko slnka je vo vašom obede</text>
  <text x="200" y="350" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" text-anchor="middle">${esc(name.slice(0,26))} · ${esc(month)}</text>
  <circle cx="330" cy="88" r="30" fill="${c}" stroke="#fff" stroke-width="3"/><text x="330" y="96" font-size="24" text-anchor="middle">${md}</text></svg>`;
}
function vIdeaBadge(){
  const {sh,lv,a}=badgeShare(),month=new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'}),name=S.badge.name||'Bistro';
  const months=[['máj',1.25],['jún',1.35],['júl',1.4],['aug',1.3],['sep',1.0],['okt',0.7]].map(([m,mul])=>{const r=agg(runDay(S.c.appTime,{mul}));return [m,r.peter.cons>0?r.peter.recv/r.peter.cons:0]});
  const nb=[['Kaviareň Pri fontáne','Trnava',.64],['Pekáreň Klások','Hlohovec',.47],['Kvetinárstvo Lúka','Piešťany',.28],[name,'Trnava',sh]].sort((x,y)=>y[2]-x[2]);
  const lvOf=s=>s>=.6?'zlato':s>=.4?'striebro':s>=.2?'bronz':null;
  return `<div class="gap">${ideaHead('i_badge','Peter varí obedy z elektriny, ktorú ráno vyrobila strecha suseda – hostia naskenujú QR kód a vidia, koľko slnka bolo v ich obede.')}
  <div class="grid g2"><div class="cert"><div class="lv">${lv?LVC[lv][1]+' '+lv:'zatiaľ bez úrovne'} · certifikát ${esc(month)}</div><div style="margin-top:14px;font-size:18px;font-weight:700">${esc(name)}</div><div class="pc" style="margin-top:8px">${Math.round(sh*100)} %</div><div style="margin-top:4px;font-weight:600">elektriny zo susedných striech</div><div class="sm" style="opacity:.9;margin-top:12px">Dnes ${fm(a.peter.recv,1)} kWh zo ${fm(a.peter.cons,1)} kWh spotreby${a.peter.recvBat>0?` (z toho ${fm(a.peter.recvBat,1)} kWh večer z batérie suseda)`:''}. Vypočítané z 15-minútových alokácií.</div><div class="sm" style="margin-top:10px">Úrovne: 🥉 od 20 % · 🥈 od 40 % · 🥇 od 60 %</div></div>
   <div class="card" style="text-align:center"><h3>Nálepka na dvere s QR kódom</h3><div style="max-width:260px;margin:10px auto" id="sticker">${stickerSvg(name,sh,lv,month)}</div><div class="row" style="justify-content:center"><button class="btn pri sm" data-act="stickerpng">⬇ Stiahnuť nálepku (PNG)</button></div><p class="xs mut" style="margin-top:6px">Nálepka neuvádza percento – aktuálny podiel slnka hosť uvidí po naskenovaní QR kódu. QR kód je skutočný.</p></div></div>
  <div class="grid g2"><div class="card"><h3>Nastavenie</h3><div class="fields one" style="margin-top:8px">${F('Názov podniku','badge.name',{t:'x'})}</div><p class="xs mut" style="margin-top:8px">Podiel zvýšite presunom spotreby do slnečného okna (Odmeny), vyššou max. cenou alebo večerným nákupom z batérie suseda.</p>
    <h3 style="margin-top:12px">Posledných 6 mesiacov</h3><div class="gap" style="margin-top:6px">${months.map(([m,v])=>`<div><div class="row between sm"><span>${m}</span><b>${pct(v)} ${lvOf(v)?LVC[lvOf(v)][1]:''}</b></div><div class="bar"><i style="width:${Math.min(100,v*100)}%"></i></div></div>`).join('')}</div><p class="xs mut" style="margin-top:6px">Mesiace sa líšia počasím (ilustračne 70–140 % dnešnej výroby).</p></div>
   <div class="card"><h3>Náhľad verejnej stránky podniku</h3><div style="border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:8px"><div class="row between"><b style="font-size:17px">${esc(name)}</b>${lv?pill('g',LVC[lv][1]+' '+lv):''}</div><div class="xs mut">Trnava · člen skupiny ${gname(S.group)}</div><p class="sm" style="margin-top:8px">„Tento mesiac sme varili z <b>${Math.round(sh*100)} %</b> zo slnka našich susedov.“</p><div class="row" style="margin-top:8px">${pill('y','☀ '+fm(a.peter.recv*S.sim.days,0)+' kWh / mesiac')}${pill('n','CO₂ −'+fm(a.peter.recv*S.sim.days*S.twin.co2,0)+' kg')}</div></div>
    <h3 style="margin-top:14px">Zapojené podniky v okolí</h3><table style="margin-top:4px"><tbody>${nb.map(([n,t,s])=>`<tr><td><b>${esc(n)}</b><div class="xs mut">${t}</div></td><td class="n">${pct(s)} ${lvOf(s)?LVC[lvOf(s)][1]:''}</td></tr>`).join('')}</tbody></table><p class="xs mut" style="margin-top:4px">Ostatné podniky sú ilustračné.</p></div></div>
  ${gains(['Podnik dostane marketing zadarmo: certifikát, nálepku a verejnú stránku.','Silný ESG argument pre hostí aj odberateľov.','Motivácia presúvať spotrebu do slnka – vyšší podiel, vyššia úroveň.'],['Značka ZSE/VSE na dverách stoviek podnikov – reklama, ktorá sa vysvetlí sama.','Dôvod pre ďalšie podniky pridať sa ako odberatelia.','Overiteľné dáta o lokálnej energii pre ESG reporty partnerov.'])}</div>`;
}
function vIdeaSol(){
  const on=S.don.on,res=on?dayRun():runDay(S.c.appTime,{cfg:{...manualCfg(),donPct:S.don.pct}}),a=agg(res),A=a.anna,d=S.sim.days,r=RCP[S.don.rcp];
  const mon=A.don*d,val=mon*S.c.ref,lost=mon*S.p.feedin,hh=S.don.need>0?Math.floor(mon/S.don.need):0;
  const ok=Math.abs(a.debT-a.netT-a.comT)<1e-9;
  return `<div class="gap">${ideaHead('i_sol','Anna má cez víkend viac slnka, než susedia minú. Časť zvyšku, ktorý by inak išiel výkupcovi za pár centov, daruje rodine v núdzi alebo škole. Energiu doručí obec – bez provízie a bez poplatkov.')}
  <div class="grid g2"><div class="card"><h3>Nastavenie daru</h3><div class="fields one" style="margin-top:8px">${F('Zapojiť Solidárne slnko do výpočtu','don.on',{t:'c'})}${F('Darovať zo zvyšku prebytku (po skupine a batérii)','don.pct',{t:'r',u:' %'})}${F('Príjemca','don.rcp',{t:'s',opts:Object.entries(RCP).map(([k,v])=>[k,v.ic+' '+v.name])})}${F('Mesačná podpora na domácnosť','don.need',{step:5,min:1,u:'kWh'})}</div>
    ${on?'':`<p class="sm" style="margin-top:8px;color:var(--orange)">Náhľad – darovanie zatiaľ nie je zapnuté v enginu. Po zapnutí sa premietne do ledgera, auditu aj mapy.</p>`}${A.don<1e-6&&res.cfg.bankPct>=100?`<p class="sm" style="margin-top:8px;color:var(--orange)">Slnečná banka teraz ukladá celý zvyšok – kaskáda ide skupina → batéria → banka → dar. Znížte podiel banky, aby zostalo aj na dar.</p>`:''}</div>
   <div class="card" style="border-left:5px solid #f5b400"><h3>${r.ic} ${r.name}</h3><div class="xs mut">${r.via}</div>
    <div class="grid g2" style="margin-top:10px;gap:8px">${kpi('Darované dnes',fm(A.don,2)+' kWh')}${kpi('Darované mesačne',fm(mon,0)+' kWh')}${kpi('Hodnota pre príjemcu',eur(val),'pri cene '+fpr(S.c.ref)+' €/kWh')}${kpi('Podporené domácnosti',String(hh),'pri '+fm(S.don.need,0)+' kWh/mesiac')}</div>
    <p class="sm mut" style="margin-top:8px">Vy sa vzdávate výkupu ${eur(lost)} mesačne – príjemca ušetrí ${eur(val)}. Každé darované euro výkupu má pre príjemcu ${fm(S.c.ref/Math.max(.001,S.p.feedin),1)}× vyššiu hodnotu.</p></div></div>
  <div class="grid g2"><div class="card"><h3>Bez poplatkov – overené v zúčtovaní</h3><table style="margin-top:6px"><tbody><tr><td>Platba príjemcu</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Provízia ${BR()} z darovanej energie</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Poplatky výrobcovi</td><td class="n"><b>0,00 €</b></td></tr><tr><td>Provízia z predanej energie (bez zmeny)</td><td class="n">${fm(a.comT,3)} €</td></tr></tbody></table><div class="pill ${ok?'g':'r'}" style="margin-top:8px">${ok?'✓':'✕'} Audit: platby odberateľov ${fm(a.debT,3)} € = výplata ${fm(a.netT,3)} € + provízia ${fm(a.comT,3)} €</div><p class="xs mut" style="margin-top:6px">Darované kWh majú v ledgeri typ „dar“, cenu 0 € a províziu 0 €.</p></div>
   <div class="card" style="background:var(--yellow-t)"><h3>💌 Poďakovanie od príjemcu</h3><p style="margin-top:8px;font-style:italic">„Ďakujeme! Vďaka vášmu slnku sme tento mesiac ušetrili ${eur(val)} na elektrine. ${S.don.rcp==='r2'?'Deti mali teplú vodu v telocvični aj počas sychravých dní.':'Je to pre nás veľká pomoc.'}“</p><p class="xs mut" style="margin-top:8px">— ${r.name} (ilustračné)</p></div></div>
  ${gains(['Zmysel: zvyšok, ktorý by išiel výkupcovi za pár centov, pomôže susedom.','Žiadne poplatky ani provízia – celá hodnota ide príjemcovi.','Prehľad dopadu: kWh, eurá, počet domácností.'],['Silný príbeh komunitnej energetiky a spoločenskej zodpovednosti.','Spolupráca so samosprávami a sociálnymi službami.','Lojalita výrobcov – zapojenie nad rámec zisku.'])}</div>`;
}
function vIdeaBank(){
  const on=S.bank.on,res=on?dayRun():runDay(S.c.appTime,{cfg:{...manualCfg(),bankPct:S.bank.pct}}),A=agg(res).anna,dep=A.bank,bp=bankProj(dep),m=clamp(S.bank.month,0,5),B=S.bank;
  let cum=0;const upto=bp.rows.map(r=>(cum+=r.dep));const maxB=Math.max(1,bp.depT),fill=m<5?upto[m]/maxB:0,lit=m===5;
  const coins=Math.round(fill*14),coinV=coinEur(),bal=B.bal+(on?dep:0);
  const items=[['Obed dňa',8.9],['Polievka',3.5],['Káva',2.4]];
  let jar=`<svg viewBox="0 0 520 240" width="100%" role="img" aria-label="Pohár slnečných mincí a vianočný stromček – mesiac ${MONTHS[m]}"><g transform="translate(40,20)"><path d="M10,30 Q0,30 0,44 L6,196 Q8,210 24,210 L136,210 Q152,210 154,196 L160,44 Q160,30 150,30Z" fill="var(--blue-t)" stroke="var(--mut)" stroke-width="2"/><rect x="18" y="14" width="124" height="18" rx="6" fill="var(--line)"/>
   <rect x="8" y="${208-178*fill}" width="144" height="${178*fill}" rx="10" fill="#ffd23f" opacity=".35"/>`;
  for(let k=0;k<coins;k++){const cx=30+(k%5)*25+(Math.floor(k/5)%2)*12,cy=196-Math.floor(k/5)*18;jar+=`<g class="coin" style="animation-delay:${(k*.05).toFixed(2)}s"><circle cx="${cx}" cy="${cy}" r="11" fill="#f5b400" stroke="#b8860b" stroke-width="2"/><text x="${cx}" y="${cy+4}" font-size="11" text-anchor="middle">☀</text></g>`}
  jar+=`<text x="80" y="232" font-size="12" font-weight="700" fill="var(--ink)" text-anchor="middle">Slnečný účet</text></g>`;
  jar+=`<g transform="translate(330,10)"><polygon points="80,10 20,90 50,90 0,160 40,160 -10,215 170,215 120,160 160,160 110,90 140,90" fill="#1f7a3a"/><rect x="68" y="215" width="24" height="18" fill="#7a4a1f"/><text x="80" y="18" font-size="26" text-anchor="middle">⭐</text>`;
  [[60,70],[95,82],[45,125],[80,135],[115,120],[30,180],[70,190],[110,178],[140,195],[15,200]].forEach(([x,y],k)=>{jar+=`<circle class="${lit?'lit':''}" cx="${x}" cy="${y}" r="6" fill="${lit?['#ffd23f','#ff6a3d','#6aa2ff','#fff'][k%4]:'#3d5a45'}" style="animation-delay:${(k*.15).toFixed(2)}s"/>`});
  if(m>=4)[[55,100],[105,112],[38,172],[88,160],[128,182]].forEach(([x,y],k)=>{jar+=`<g class="fly" style="animation-delay:${(k*.12).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="9" fill="#f5b400" stroke="#b8860b" stroke-width="2"/><text x="${x}" y="${y+4}" font-size="9" text-anchor="middle">☀</text></g>`});
  jar+=`</g></svg>`;
  return `<div class="gap">${ideaHead('i_bank','V júli má Anna slnka nazvyš a výkupca za neho dá pár centov. Namiesto toho si ho uloží na Slnečný účet ako slnečné mince. V decembri, keď je elektrina drahá, si ich vyberie – a rozsvieti si stromček júlovým slnkom. Mincami môže zaplatiť aj obed v bistre suseda.')}
  <div class="grid g2"><div class="card"><div class="row between"><h3>Júl → december</h3><button class="btn sm pri" data-act="bankplay">${B.playing?'⏸ Pauza':'▶ Prehrať'}</button></div>
    <input type="range" min="0" max="5" step="1" value="${m}" data-k="bank.month" data-t="n" aria-label="Mesiac" style="margin-top:8px"><div class="row between xs mut">${MONTHS.map((x,i)=>`<span style="${i===m?'color:var(--ink);font-weight:800':''}">${x.slice(0,3)}</span>`).join('')}</div>
    <div style="margin-top:8px">${jar}</div>
    <p class="sm" style="margin-top:6px">${m<5?`<b>${MONTHS[m]}:</b> na účte ${fm(upto[m],0)} slnečných mincí (kWh).`:`<b>December:</b> vyberiete <b>${fm(bp.winterKwh,0)} kWh</b> (kurz ${fm(B.rate,0)} %) v hodnote <b>${eur(bp.winterEur)}</b> pri zimnej cene ${fpr(B.winter)} €/kWh. V lete by ste od výkupcu dostali ${eur(bp.summerEur)} → <b style="color:var(--green)">+${eur(bp.gain)}</b>.`}</p></div>
   <div class="card"><h3>Nastavenie banky</h3><div class="fields" style="margin-top:8px">${F('Zapojiť banku do výpočtu','bank.on',{t:'c'})}${F('Ukladať zo zvyšku (po batérii)','bank.pct',{step:5,max:100,u:'%'})}${F('Kurz leto → zima','bank.rate',{step:5,min:10,max:150,u:'%'})}${F('Poplatok banky','bank.fee',{step:1,max:50,u:'%'})}${F('Zimná cena elektriny','bank.winter',{step:.005,u:'€/kWh'})}${F('Zostatok na účte dnes','bank.bal',{step:5,u:'kWh'})}</div>
    <table style="margin-top:10px"><thead><tr><th>Mesiac</th><th class="n">Vklad</th><th class="n">Výber</th><th class="n">Zostatok</th></tr></thead><tbody>${bp.rows.map(r=>`<tr><td>${r.m}</td><td class="n">${fm(r.dep,0)} kWh</td><td class="n">${r.wd?fm(r.wd,0)+' kWh':'—'}</td><td class="n">${fm(r.bal,0)} kWh</td></tr>`).join('')}</tbody></table>
    <p class="xs mut" style="margin-top:6px">Dnešný vklad z enginu: ${fm(dep,2)} kWh/deň${on?'':' (náhľad)'}; mesiace sú škálované sezónou (júl 140 % … október 70 %), po odpočítaní poplatku banky. Ide o finančný kredit, nie fyzické uskladnenie.</p></div></div>
  <div class="grid g2"><div class="card"><h3>☀ Zaplatiť slnkom – ${esc(S.badge.name)}</h3><p class="sm mut" style="margin-top:4px">1 slnečná minca = ${fpr(coinV)} € (kurz × zimná cena). Zostatok: <b>${fm(bal,1)} mincí</b> (≈ ${eur(bal*coinV)}).</p>
    <div class="row" style="margin-top:10px">${items.map(([n,p],k)=>`<button class="btn sm" data-act="paysun:${k}">${n} ${eur(p)} = ${fm(p/coinV,1)} ☀</button>`).join('')}</div>
    ${B.pays.length?`<div class="row" style="margin-top:12px;align-items:flex-start;flex-wrap:nowrap"><div class="qrbox" style="flex:none">${qrSvg(`Platba slnkom | ${S.badge.name.slice(0,20)} | ${B.pays[0].item} | ${fm(B.pays[0].coins,1)} mincí (demo)`)}</div><div><b>✓ Zaplatené: ${esc(B.pays[0].item)}</b><p class="sm" style="margin-top:4px">„Anna zaplatila obed slnkom, na ktorom jej ho Peter uvaril.“</p><table style="margin-top:6px"><tbody>${B.pays.slice(0,4).map(p=>`<tr><td>${p.t}</td><td>${esc(p.item)}</td><td class="n">−${fm(p.coins,1)} ☀</td></tr>`).join('')}</tbody></table></div></div>`:''}</div>
   <div class="card" style="border-left:5px solid var(--purple)"><h3>🤖 Spravuje AI správca</h3>${S.agent.on?`<p class="sm" style="margin-top:6px">${esc(agentPlan().why.bank||'')}</p><p class="xs mut" style="margin-top:6px">Cieľ: ${fm(S.agent.goal,0)} kWh do Vianoc (${daysToXmas()} dní). Správca dnes ukladá ${agentPlan().bankPct} % zvyšku po batérii.</p>`:`<p class="sm mut" style="margin-top:6px">Zapnite AI správcu – nastaví si cieľ (napr. ${fm(S.agent.goal,0)} kWh do Vianoc) a sám rozhodne, koľko ukladať do batérie a koľko do Slnečnej banky.</p>`}<div class="row" style="margin-top:10px">${S.agent.on?'':`<button class="btn pri sm" data-act="agenton">Zapnúť AI správcu</button>`}<button class="btn sm" data-act="view:i_agent">Otvoriť AI správcu →</button></div></div></div>
  ${gains(['Leto sa premení na zimnú úsporu – lepší kurz než výkup.','Platba slnkom v lokálnych podnikoch – zážitok, ktorý si zapamätáte.','Cieľ „Vianoce zo slnka“ spravuje AI správca za vás.'],['Zákazník s nasporeným letom v zime nemení dodávateľa – silná retencia.','ZSE/VSE ako „banka energie“: kurz, zostatky, sieť podnikov.','Marketing, ktorý sa vysvetlí sám: „Uložte si leto.“'])}</div>`;
}
/* AI správca – záznam vyjednávania odvodený z alokácií enginu */
function agentLog(){
  const was=S.agent.on;if(!was)S.agent.on=true;
  let res,plan,base,withA;
  try{plan=agentPlan();res=dayRun();withA=agg(res)}finally{S.agent.on=was}
  /* ručný režim = bez správcu a bez spotrebičov, ktoré naplánoval správca */
  const saved=(S.agent.done||[]).map(([ow,k])=>{const o=A_(ow,k);return [o,o.time,o.accepted]});
  S.agent.on=false;saved.forEach(([o])=>{o.time=o.orig;o.accepted=false});
  try{base=agg(dayRun())}finally{S.agent.on=was;saved.forEach(([o,t,ac])=>{o.time=t;o.accepted=ac})}
  const msgs=[],cx=S.agent.cancel,first=f=>{for(let i=0;i<96;i++)if(f(i))return i;return -1};
  const bid=Math.min(S.agent.maxP,S.c.max);
  msgs.push({i:0,who:'sys',txt:`Správcovia sa pripojili. Pravidlá Anny: min. ${fpr(S.agent.minA)} €/kWh, priorita „${S.agent.prio}“, cieľ ${fm(S.agent.goal,0)} kWh v Slnečnej banke do Vianoc. Pravidlá Petra: max. ${fpr(bid)} €/kWh.`});
  const iD=first(i=>res.recs.some(r=>r.i===i&&r.from==='anna'&&r.to==='peter'&&!r.src&&!r.kind));
  if(iD>=0){const k=sum(res.recs.filter(r=>r.from==='anna'&&r.to==='peter'&&!r.src&&!r.kind).map(r=>r.kwh));
    msgs.push({i:Math.max(0,iD-1),who:'a',txt:`Od ${I2T(iD)} mám prebytok. Ponúkam ${fpr(Math.max(S.agent.minA,S.p.price))} €/kWh.`});
    if(plan.deal){msgs.push({i:Math.max(0,iD-1),who:'p',txt:`Dám najviac ${fpr(bid)} €. Navrhujem ${fpr(plan.deal)} €/kWh, ak mi pošleš aj ${fm(res.R.offer[iD+2]||0.3,1)} kWh o ${I2T(iD+2)}.`});
      msgs.push({i:iD,who:'a',key:'deal',txt:`Dohoda: ${fpr(plan.deal)} €/kWh, dnes približne ${fm(k,1)} kWh.`,why:plan.why.deal})}
    else msgs.push({i:iD,who:'p',key:'deal',txt:cx.deal?'Dohoda zrušená – platí verejná cena ponuky.':'Za túto cenu nekúpim – platí verejná ponuka.',why:plan.why.deal||'Používateľ zrušil dohodu.'});}
  const iC=first(i=>res.R.ch[i]>1e-6);if(iC>=0)msgs.push({i:iC,who:'a',key:'bat',txt:`Zvyšok ukladám do batérie (${fm(sum(res.R.ch),1)} kWh dnes) – večer predám za ${fpr(S.bat.price)} €/kWh.`,why:plan.why.bat});
  const iB=first(i=>res.R.bank[i]>1e-6);if(iB>=0||plan.why.bank)msgs.push({i:iB>=0?iB:Math.max(0,iC),who:'a',key:'bank',txt:iB>=0?`Do Slnečnej banky ukladám ${fm(sum(res.R.bank),2)} kWh (${plan.bankPct} % zvyšku po batérii).`:'Do Slnečnej banky dnes neukladám.',why:plan.why.bank});
  const iDo=first(i=>res.recs.some(r=>r.i===i&&r.kind==='don'));if(iDo>=0)msgs.push({i:iDo,who:'a',key:'don',txt:`Posielam ${fm(withA.anna.don,2)} kWh cez Solidárne slnko – bez provízie.`,why:plan.why.don});
  for(const [ow,k,w] of [['c','wash','p'],['c','ev','p'],['p','pw','a'],['p','pb','a']]){const o=A_(ow,k);if(o.accepted)msgs.push({i:Math.max(0,T2I(o.time)-1),who:w,txt:`Spúšťam ${o.label} o ${o.time} (pôvodne ${o.orig}).`,why:ow==='c'?'V tomto čase je v skupine najviac prebytku – energia je lacnejšia.':'Mimo slnečného okna – uvoľní sa viac prebytku na predaj.'})}
  const iE=first(i=>res.R.dis[i]>1e-6);if(iE>=0){msgs.push({i:iE,who:'a',txt:`Je ${I2T(iE)}. Ponúkam z batérie ${fpr(S.bat.price)} €/kWh.`});msgs.push({i:iE,who:'p',txt:`Beriem ${fm(withA.peter.recvBat,1)} kWh – zo siete by to stálo ${fpr(S.c.ref)} €. Úspora ${eur(withA.peter.recvBat*(S.c.ref-S.bat.price))}.`})}
  const valA=annaValue;
  const dA=valA(withA)-valA(base),dP=withA.peter.saved-base.peter.saved;
  msgs.push({i:95,who:'sys',txt:`Koniec dňa: Annin správca ${dA>=0?'získal':'stratil'} ${eur(Math.abs(dA))} oproti ručnému režimu (vrátane hodnoty v banke), Petrov ${dP>=0?'ušetril navyše':'ušetril o'} ${eur(Math.abs(dP))}${dP<0?' menej (vyššia dohodnutá cena)':''}.`});
  msgs.sort((x,y)=>x.i-y.i);
  return {msgs,plan,dA,dP,withA,base};
}
function vIdeaAgent(){
  const L=agentLog(),on=S.agent.on,shown=L.msgs.filter(m=>m.i<=S.sim.idx||m.i===0),cx=S.agent.cancel,d=S.sim.days;
  const av={a:['A','var(--orange)','Annin agent'],p:['P','var(--blue)','Petrov agent'],sys:['🤖','var(--purple)','Zdieľňa']};
  return `<div class="gap">${ideaHead('i_agent','Anna ani Peter nemusia nič sledovať. Ich AI správcovia sa každých 15 minút dohodnú na cene, rozhodnú, koľko uložiť do batérie a do Slnečnej banky, a naplánujú spotrebiče. Každé rozhodnutie vysvetlia jednou vetou a dá sa zrušiť.')}
  <div class="grid g2"><div class="card"><div class="row between"><h3>Pravidlá</h3>${on?pill('g','● zapnutý'):pill('n','vypnutý – náhľad')}</div><div class="fields" style="margin-top:8px">${F('AI správca zapnutý (dohody idú do ledgera)','agent.on',{t:'c'})}${F('Priorita Anny','agent.prio',{t:'s',opts:PRIO})}${F('Anna: minimálna cena','agent.minA',{step:.005,u:'€/kWh'})}${F('Peter: maximálna cena','agent.maxP',{step:.005,u:'€/kWh'})}${F('Cieľ v Slnečnej banke do Vianoc','agent.goal',{step:10,u:'kWh'})}</div>
    <h3 style="margin-top:12px">Povolené spotrebiče</h3><div class="fields" style="margin-top:6px">${F('Anna: pračka','agent.appl.pw',{t:'c'})}${F('Anna: bojler','agent.appl.pb',{t:'c'})}${F('Peter: umývačka','agent.appl.wash',{t:'c'})}${F('Peter: nabíjanie vozidla','agent.appl.ev',{t:'c'})}</div>
    <div class="row" style="margin-top:10px"><button class="btn pri sm" data-act="agentappl">Nechať správcu naplánovať spotrebiče</button>${Object.keys(cx).some(k=>cx[k])?`<button class="btn sm" data-act="agentreset">Obnoviť zrušené rozhodnutia</button>`:''}</div></div>
   <div class="card"><h3>Výsledok oproti ručnému režimu</h3><div class="grid g2" style="margin-top:8px;gap:8px">${kpi('Anna dnes',(L.dA>=0?'+':'')+eur(L.dA),'výplata + výkup + batéria + banka')}${kpi('Anna mesačne',(L.dA>=0?'+':'')+eur(L.dA*d))}${kpi('Peter dnes',(L.dP>=0?'+':'')+eur(L.dP),'úspora komodity')}${kpi('Dohodnutá cena',L.plan.deal?fpr(L.plan.deal)+' €':'—','cez deň Anna → Peter')}</div>
    <table style="margin-top:10px"><tbody><tr><td>Do batérie zo zvyšku</td><td class="n">${L.plan.batPct} %</td></tr><tr><td>Do Slnečnej banky (po batérii)</td><td class="n">${L.plan.bankPct} %</td></tr><tr><td>Solidárne slnko</td><td class="n">${L.plan.donPct} %</td></tr><tr><td>Batéria najprv pre vlastnú spotrebu</td><td class="n">${L.plan.ownFirst?'áno':'nie'}</td></tr></tbody></table>
    <p class="xs mut" style="margin-top:6px">Rovnaký engine: ${on?'dohody sa už premietajú do alokácie, ledgera („🤖 dohoda“) aj auditu.':'zapnite správcu, aby sa dohody premietli do ledgera.'}</p></div></div>
  ${simBar()}
  <div class="card"><div class="row between"><h3>💬 Vyjednávanie agentov – ${I2T(S.sim.idx)}</h3><span class="xs mut">správy pribúdajú počas dňa</span></div><div class="chatlog" style="margin-top:10px" aria-live="polite">${shown.map(m=>{const[ch,c,n]=av[m.who],x=m.key&&cx[m.key];return `<div class="ag ${x?'cx':''}"><span class="who" style="background:${c}" aria-hidden="true">${ch}</span><div class="bub"><div class="row between"><b class="sm">${n}</b><span class="xs mut">${I2T(m.i)}</span></div><div class="sm" style="margin-top:2px">${esc(m.txt)}</div>${m.why?`<div class="xs mut" style="margin-top:4px">Prečo: ${esc(m.why)}</div>`:''}${m.key?`<button class="btn sm" style="margin-top:6px" data-act="agcx:${m.key}">${x?'↺ Obnoviť':'✕ Zrušiť rozhodnutie'}</button>`:''}</div></div>`}).join('')}</div></div>
  ${gains(['Nemusíte nič sledovať – správca obchoduje a plánuje za vás.','Každé rozhodnutie je vysvetlené jednou vetou a dá sa zrušiť.','Viac peňazí: lepšie ceny, batéria aj banka v jednom.'],['Trhovisko agentov ako platforma – vyššie objemy aj provízie.','Predvídateľné správanie skupín, lepšie plánovanie odchýlok.','Technologický náskok a príbeh, ktorý zaujme.'])}</div>`;
}
const TWH=[{id:'anna',x:130,y:330,pv:true,bat:true,n:'Anna'},{id:'B',x:270,y:390,pv:true,n:'Výrobca B'},{id:'SK',x:300,y:250,n:'Škola',w:96},{id:'peter',x:450,y:320,n:'Bistro Peter',bistro:true,w:84},{id:'NB',x:560,y:240,n:'Nabíjačka',ch:true},{id:'C',x:590,y:390,n:'Odberateľ C'},{id:'D',x:690,y:310,n:'Odberateľ D'}];
function isoHouse(h,o){
  const w=h.w||64,dp=34,ht=h.ch?0:46,off=o.off,roof=S.skin==='vse'?'var(--vse)':'var(--zse)',g=clamp(o.glow||0,0,1);
  const x=h.x-w/2,y=h.y;
  if(h.ch)return `<g class="house ${off?'':''}" data-act="twoff:${h.id}" tabindex="0" role="button" aria-label="${h.n}: ${off?'vypnutá – zapnúť':'zapnutá – vypnúť'}" opacity="${off?.35:1}"><rect x="${h.x-14}" y="${y-56}" width="28" height="56" rx="6" fill="var(--card)" stroke="var(--mut)" stroke-width="2"/><rect x="${h.x-8}" y="${y-48}" width="16" height="14" rx="2" fill="${o.dem>0?'#2fd36b':'var(--line)'}"/><text x="${h.x}" y="${y-18}" font-size="18" text-anchor="middle">🔌</text><text x="${h.x}" y="${y+16}" font-size="11" font-weight="700" fill="var(--ink)" text-anchor="middle">${h.n}${off?' (vyp.)':''}</text></g>`;
  return `<g class="house" data-act="twoff:${h.id}" tabindex="0" role="button" aria-label="${h.n}: ${off?'vypnutý – zapnúť':'zapnutý – vypnúť'}" opacity="${off?.35:1}">
   <polygon points="${x},${y} ${x+w},${y} ${x+w+dp*.6},${y-dp*.5} ${x+dp*.6},${y-dp*.5}" fill="#000" opacity=".08"/>
   <rect x="${x}" y="${y-ht}" width="${w}" height="${ht}" fill="#f6efe4" stroke="#8a7f70"/>
   <polygon points="${x+w},${y} ${x+w+dp*.6},${y-dp*.5} ${x+w+dp*.6},${y-ht-dp*.5} ${x+w},${y-ht}" fill="#e2d6c3" stroke="#8a7f70"/>
   <polygon points="${x-4},${y-ht} ${x+w/2},${y-ht-30} ${x+w+4},${y-ht}" fill="${roof}" stroke="#fff"/>
   <polygon points="${x+w/2},${y-ht-30} ${x+w/2+dp*.6},${y-ht-30-dp*.5} ${x+w+4+dp*.6},${y-ht-dp*.5} ${x+w+4},${y-ht}" fill="${roof}" opacity=".78" stroke="#fff"/>
   ${h.pv?`<polygon points="${x+w/2+6},${y-ht-27} ${x+w/2+dp*.5+2},${y-ht-27-dp*.42} ${x+w+dp*.5-2},${y-ht-6-dp*.42} ${x+w-2},${y-ht-6}" fill="#1b2f5e" stroke="#fff" stroke-width=".8"/><polygon points="${x+w/2+6},${y-ht-27} ${x+w/2+dp*.5+2},${y-ht-27-dp*.42} ${x+w+dp*.5-2},${y-ht-6-dp*.42} ${x+w-2},${y-ht-6}" fill="#ffd23f" opacity="${(g*.9).toFixed(2)}"/>`:''}
   <rect x="${x+w/2-7}" y="${y-22}" width="14" height="22" fill="#8a7f70"/><rect x="${x+8}" y="${y-ht+10}" width="12" height="10" fill="${o.dem>0.05?'#ffe58a':'#cfd8e6'}"/><rect x="${x+w-20}" y="${y-ht+10}" width="12" height="10" fill="${o.dem>0.05?'#ffe58a':'#cfd8e6'}"/>
   ${h.bat?`<g transform="translate(${x-16},${y-30})"><rect width="12" height="28" rx="3" fill="var(--purple)"/><rect x="2" y="${2+24*(1-clamp(o.soc||0,0,1))}" width="8" height="${24*clamp(o.soc||0,0,1)}" fill="#b9f5c9"/></g>`:''}
   ${h.bistro?`<text x="${x+w/2}" y="${y-ht-6}" font-size="13" text-anchor="middle">🍽</text>`:''}${h.id==='SK'?`<text x="${x+w/2}" y="${y-ht-6}" font-size="13" text-anchor="middle">🏫</text>`:''}
   <text x="${x+w/2}" y="${y+16}" font-size="11" font-weight="700" fill="var(--ink)" text-anchor="middle">${h.n}${off?' (vyp.)':''}</text></g>`;
}
function twinRun(){
  const cl=S.twin.cloud,cov=hx=>{const dx=Math.abs(cl-hx);return dx<95?0.75*(1-dx/95):0};
  const mulA=1-cov(TWH[0].x),mulB=1-cov(TWH[1].x);
  return {res:runDay(S.c.appTime,{twin:true,potential:true,off:S.twin.off,mul:mulA,mulB}),mulA,mulB};
}
function vIdeaTwin(){
  const {res,mulA,mulB}=twinRun(),cur=Math.min(95,S.sim.idx),a=agg(res),P=res.P,pos=Object.fromEntries(TWH.map(h=>[h.id,h]));
  const t=clamp((cur-24)/56,0,1),sx=40+t*680,sy=150-Math.sin(t*Math.PI)*120,night=cur<24||cur>=80;
  const maxP=Math.max(.2,...P.fpFull);
  const prodNow={anna:res.A.a[cur]*res.share,B:P.fpFull[cur]*.6*mulB};
  const dem={};for(const r of res.recs)if(r.i===cur&&!r.kind)dem[r.to]=(dem[r.to]||0)+r.kwh;
  const loc=sum(res.recs.filter(r=>!r.kind).map(r=>r.kwh)),sav=sum(res.recs.filter(r=>!r.kind).map(r=>r.kwh*(S.c.ref-r.price))),ms=matchScore(profiles(S.c.appTime,mulA).fp,S.p.price,P.fc,S.c.max,S.c.ref,S.p.conf);
  let s=`<svg id="twinsvg" viewBox="0 0 760 460" role="img" aria-label="Živé dvojča mesta – ${I2T(cur)}">${arrowDefs()}
   <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night?'#1b2440':'#9fd0ff'}"/><stop offset="1" stop-color="${night?'#2f3a5c':'#e9f5ff'}"/></linearGradient><radialGradient id="sunG"><stop offset="0" stop-color="#fff6c2"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient></defs>
   <rect width="760" height="460" fill="url(#sky)"/><path d="M0,250 Q380,200 760,250 L760,460 L0,460Z" fill="${night?'#2a3b2e':'#cfe8c4'}"/><path d="M60,420 L700,420 L760,360 L120,360Z" fill="#000" opacity=".04"/>
   <path d="M40,150 Q380,${150-240} 720,150" fill="none" stroke="#fff" stroke-dasharray="3 7" opacity=".6"/>`;
  s+=`<g class="drag" data-drag="sun" tabindex="0" role="slider" aria-label="Slnko – čas dňa" aria-valuemin="6" aria-valuemax="20" aria-valuenow="${(cur/4).toFixed(2)}" aria-valuetext="${I2T(cur)}" transform="translate(${sx.toFixed(1)},${sy.toFixed(1)})"><circle r="44" fill="url(#sunG)"/><circle r="20" fill="${night?'#e6e9f2':'#ffd23f'}" stroke="#fff" stroke-width="2"/><text y="5" font-size="13" font-weight="800" text-anchor="middle" fill="#5a4300">${night?'🌙':''}</text><text y="40" font-size="11" font-weight="800" text-anchor="middle" fill="${night?'#fff':'#5a4300'}">${I2T(cur)}</text></g>`;
    const flows=[];for(const r of res.recs)if(r.i===cur&&!r.kind&&pos[r.from]&&pos[r.to]){const k=r.from+(r.src||'')+'_'+r.to,f=flows.find(z=>z.k===k);if(f)f.v+=r.kwh;else flows.push({k,from:r.from,to:r.to,bat:r.src==='bat',v:r.kwh})}
  for(const f of flows){const A=pos[f.from],B=pos[f.to];s+=flowSvg('tw_'+f.k,[A.x+(f.bat?-10:10),A.y-(f.bat?20:70)],[B.x,B.y-60],f.v,f.bat?'var(--purple)':'var(--green)',{mk:f.bat?'p':'g',bend:.25,scale:14,n:4})}
  for(const h of TWH){const off=!!S.twin.off[h.id];s+=isoHouse(h,{off,glow:h.pv?(prodNow[h.id]||0)/maxP:0,soc:h.bat?res.R.soc[cur]/Math.max(.1,S.bat.cap):0,dem:dem[h.id]||0})}
  s+=`<g class="drag" data-drag="cloud" tabindex="0" role="slider" aria-label="Oblak – posun nad mestom" aria-valuemin="40" aria-valuemax="720" aria-valuenow="${Math.round(S.twin.cloud)}" transform="translate(${S.twin.cloud.toFixed(1)},95)"><ellipse rx="70" ry="26" fill="#fff" opacity=".95" stroke="#cfd8e6"/><ellipse cx="-34" cy="8" rx="38" ry="20" fill="#fff"/><ellipse cx="36" cy="10" rx="40" ry="20" fill="#fff"/><ellipse cx="0" cy="-14" rx="34" ry="22" fill="#fff"/><text y="6" font-size="11" font-weight="800" text-anchor="middle" fill="#5d6675">☁ potiahni ma</text></g>`;
  s+=`</svg>`;
  return `<div class="gap">${ideaHead('i_twin','Celé mestečko na jednej obrazovke: strechy svietia podľa výroby a energia tečie medzi domami. Potiahnite slnko a zmeníte čas dňa, potiahnite oblak nad strechu a výroba klesne – všetko sa prepočíta tým istým enginom.')}
  <div class="card twin" style="padding:10px"><div class="mapwrap">${s}</div><p class="xs mut" style="margin-top:6px">Ťahajte myšou alebo prstom; s klávesnicou: Tab na slnko alebo oblak a šípky ←/→. Kliknutím na dom ho vypnete/zapnete.</p></div>
  ${simBar()}
  <div class="grid g4">${kpi('Lokálne spotrebované dnes',fm(loc,1)+' kWh','všetci členovia mestečka')}${kpi('Úspora odberateľov',eur(sav),'oproti cene zo siete')}${kpi('CO₂ ušetrené',fm(loc*S.twin.co2,1)+' kg','pri '+fpr(S.twin.co2)+' kg/kWh (ilustračne)')}${kpi('Provízia '+BR(),eur(a.comT),'zhoda Anna ↔ Peter '+pct(ms.total))}</div>
  <div class="card"><div class="row between"><h3>Stav mestečka</h3><span class="xs mut">oblak: Anna ${pct(1-mulA)} tieň · B ${pct(1-mulB)} tieň</span></div><div class="fields three" style="margin-top:8px">${F('Faktor CO₂','twin.co2',{step:.01,u:'kg/kWh'})}${F('Cena Anny','p.price',{step:.005,u:'€/kWh'})}${F('Prebytok Anny / deň','p.surplus',{step:.5,u:'kWh'})}</div></div>
  ${gains(['Pochopí systém za 10 sekúnd – vidí, odkiaľ jeho energia ide.','Hravé „čo ak“: oblak, čas, vypnutý dom.','Dôvera: čísla počíta ten istý engine ako vyúčtovanie.'],['Nástroj pre obce a developerov na plánovanie energetických komunít.','Wau efekt na veľtrhoch, v pobočkách aj v kampani.','Vizualizácia, ktorá predáva fotovoltiku a batérie.'])}</div>`;
}
function vIdeaSend(){
  const s=S.send,c=CONTACTS[s.to],bal=S.bank.bal,res=dayRun(),last=S.gifts.find(g=>g.id===s.last);
  const from=prj(geo(S.om.anna.addr).ll),toLL=c?geo(c.town).ll:TOWNS.kosice,to=prj(toLL);
  const mx=(from[0]+to[0])/2,my=Math.min(from[1],to[1])-90;
  let svg=`<svg viewBox="0 28 ${MAPW} 392" role="img" aria-label="Mapa doručenia darčeka">${arrowDefs()}${mapBase(420)}
   <path id="sendPath" d="M${from[0].toFixed(1)},${(from[1]-12).toFixed(1)}Q${mx.toFixed(1)},${my.toFixed(1)} ${to[0].toFixed(1)},${(to[1]-12).toFixed(1)}" fill="none" stroke="var(--map-gift)" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 8"/>`;
  svg+=mapHouse(from[0],from[1],{roof:regionOf(geo(S.om.anna.addr).ll),pv:true,bat:S.bat.on,soc:.7,glow:.8,own:true,big:true,label:'Anna'});
  for(const [k,v] of Object.entries(CONTACTS)){const p=prj(geo(v.town).ll);svg+=mapHouse(p[0],p[1],{roof:regionOf(geo(v.town).ll),label:k===s.to?v.name:'',sel:k===s.to,act:'sendto:'+k,aria:v.name+', '+v.town})}
  const done=!s.anim&&last;
  svg+=`<g id="sendSun" transform="translate(${(s.anim?from[0]:done?to[0]:from[0]).toFixed(1)},${((s.anim||!done?from[1]:to[1])-26).toFixed(1)})"><circle r="15" fill="#ffd23f" stroke="#fff" stroke-width="2"/><text y="5" font-size="15" text-anchor="middle">☀</text></g></svg>`;
  const delivered=last&&last.src==='today'?sum(res.recs.filter(r=>r.gid===last.id).map(r=>r.kwh)):last?last.kwh:0;
  const inbox=S.gifts.filter(g=>g.to===s.to);
  return `<div class="gap">${ideaHead('i_send','Babka Mária býva v Košiciach a na fotovoltiku nemá. Anna jej na narodeniny pošle 3 kWh slnka z Piešťan – ako keď posielate peniaze kamarátovi. Na mape preletí slniečko zo západu na východ.')}
  <div class="grid g2" style="align-items:start"><div class="card"><h3>Poslať slnko</h3><div class="fields" style="margin-top:8px">${F('Komu','send.to',{t:'s',opts:Object.entries(CONTACTS).map(([k,v])=>[k,v.name+' – '+v.town])})}${F('Množstvo','send.kwh',{step:.5,min:.5,u:'kWh'})}${F('Príležitosť','send.occ',{t:'s',opts:['Narodeniny','Vianoce','Deň matiek','Len tak','Poďakovanie']})}${F('Zdroj','send.src',{t:'s',opts:[['bank',`Zo Slnečnej banky (zostatok ${fm(bal,1)} kWh)`],['today','Z dnešného prebytku (po skupine a batérii)']]})}${F('Provízia za doručenie','send.fee',{step:.005,u:'€/kWh'})}</div>
    <div class="fields one" style="margin-top:10px">${F('Odkaz','send.msg',{t:'x'})}</div>
    <p class="xs mut" style="margin-top:6px">OM príjemcu: ${c?c.om:'—'} · oblasť ${REG[regionOf(toLL)].co}. Príjemca neplatí nič. Vy prichádzate o predaj ${fm(s.kwh,1)} kWh (≈ ${eur(s.kwh*S.p.feedin)} pri výkupe)${s.fee>0?` + ${eur(s.kwh*s.fee)} za doručenie`:''}.</p>
    <button class="btn pri lg" style="margin-top:12px" data-act="sendsun" ${s.anim?'disabled':''}>Poslať slnko ☀</button></div>
   <div class="card map-hero hero" style="padding:16px"><div class="map-svg" style="margin:0">${svg}</div>${last?`<div class="hstat" style="margin-top:12px;max-width:none;transform:none"><b>${s.anim?'☀ Slnko letí…':'✓ Doručené'}: ${esc(CONTACTS[last.to].name)}</b><p class="sm" style="margin-top:4px">${fm(last.kwh,1)} kWh · ${esc(last.occ)}${last.src==='today'?` · dnes doručené ${fm(delivered,2)} z ${fm(last.kwh,1)} kWh po 15-minútových intervaloch${delivered<last.kwh-1e-6?' (zvyšok zajtra)':''}`:' · zo Slnečnej banky'}</p></div>`:''}</div></div>
  <div class="card"><h3>📬 Schránka príjemcu – ${esc(c?c.name:'')}</h3>${inbox.length?`<div class="gap" style="margin-top:8px">${inbox.map(g=>`<div class="ag"><span class="who" style="background:#f5b400" aria-hidden="true">🎁</span><div class="bub"><div class="row between"><b class="sm">Od Anny · ${esc(g.occ)}</b><span class="xs mut">${g.t}</span></div><div class="sm" style="margin-top:2px">„${esc(g.msg)}“</div><div class="xs mut" style="margin-top:4px">${fm(g.kwh,1)} kWh → ušetrí ${eur(g.kwh*S.c.ref)} na elektrine</div></div></div>`).join('')}</div>`:`<p class="sm mut" style="margin-top:6px">Zatiaľ žiadne darčeky.</p>`}</div>
  ${gains(['Darček, ktorý má hodnotu aj príbeh – a doručí sa za sekundu.','Aj kto nemá strechu, môže dostať slnko od rodiny.','Využitie prebytku namiesto predaja za pár centov.'],['Virálny moment: ľudia posielajú slnko ako peniaze – noví zákazníci.','Prepojenie rodín naprieč oblasťami ZSE a VSE.','Sezónne kampane: Vianoce, Deň matiek, narodeniny.'])}</div>`;
}
function vIdeaEv(){
  const E=S.ev,res=dayRun(),v=evSim(res),w=[];
  if(E.sellPrice>=S.c.ref)w.push(['r','Predajná cena nie je nižšia než cena zo siete – bistro neušetrí']);
  if(E.chPrice<=S.p.feedin)w.push(['o','Cena nabíjania nie je vyššia než výkup – strechy nezarobia viac']);
  if(E.sellPrice<=E.chPrice)w.push(['o','Predajná cena nie je vyššia než nákupná – majiteľ auta nezarobí']);
  const seg=[[0,T2I(E.plugIn),'var(--line)','doma'],[T2I(E.plugIn),T2I(E.plugOut),'var(--green)','nabíja zo striech'],[T2I(E.plugOut),T2I(E.back),'var(--mut)','jazda'],[T2I(E.back),T2I(E.v2gStart),'var(--line)','pri bistre'],[T2I(E.v2gStart),T2I(E.v2gEnd),'var(--purple)','V2G → bistro'],[T2I(E.v2gEnd),96,'var(--line)','parkuje']].filter(s=>s[1]>s[0]);
  return `<div class="gap">${ideaHead('i_ev','Auto suseda parkuje cez deň na ulici plnej fotovoltiky a nabíja sa z ich prebytkov. Večer zaparkuje pri bistre a počas večerného návalu mu vráti časť energie. Ráno má stále dosť na cestu do práce.')}
  <div class="card"><h3>Deň auta</h3><div style="display:flex;height:26px;border-radius:8px;overflow:hidden;margin-top:8px" role="img" aria-label="Časová os dňa auta">${seg.map(([a,b,c,l])=>`<div title="${I2T(a)}–${I2T(b)} ${l}" style="flex:${b-a};background:${c}"></div>`).join('')}</div><div class="legend">${seg.map(([a,b,c,l])=>`<span><i style="border-color:${c};border-top-width:8px"></i>${I2T(a)}–${I2T(b)} ${l}</span>`).join('')}</div>
   <div style="margin-top:12px">${socChart(v.soc,{cap:v.cap,ch:v.ch,dis:v.dis,min:v.minK,minLbl:'minimum na rannú jazdu',idx:S.sim.idx,soc0:v.soc0,label:'Stav nabitia elektromobilu počas dňa'})}</div>
   ${w.length?`<div class="warn">${w.map(([c,t])=>pill(c,'⚠ '+t)).join('')}</div>`:''}</div>
  <div class="grid g4">${kpi('Nabité zo striech',fm(v.chT,1)+' kWh',`z ${E.roofs} striech na ulici`)}${kpi('Vrátené bistru (V2G)',fm(v.disT,1)+' kWh',E.v2gStart+'–'+E.v2gEnd)}${kpi('Majiteľ auta zarobí',eur(v.ownerV2G),'dnes z rozdielu cien')}${kpi('Bistro ušetrí',eur(v.bistro),'oproti cene zo siete')}</div>
  <div class="grid g2"><div class="card"><h3>Nastavenie</h3><div class="fields" style="margin-top:8px">${F('Kapacita batérie auta','ev.cap',{step:5,min:10,u:'kWh'})}${F('Min. stav na ranný odchod','ev.minSoc',{step:5,max:90,u:'%'})}${F('Stav ráno','ev.soc0',{step:5,max:100,u:'%'})}${F('Max. výkon','ev.pow',{step:.25,min:.25,u:'kWh/15 min'})}${F('Príchod na ulicu','ev.plugIn',{t:'t'})}${F('Odchod','ev.plugOut',{t:'t'})}${F('Príchod k bistru','ev.back',{t:'t'})}${F('Spotreba na cestu','ev.drive',{step:.5,u:'kWh'})}${F('V2G od','ev.v2gStart',{t:'t'})}${F('V2G do','ev.v2gEnd',{t:'t'})}${F('Cena nabíjania (strechám)','ev.chPrice',{step:.005,u:'€/kWh'})}${F('Cena predaja (bistru)','ev.sellPrice',{step:.005,u:'€/kWh'})}${F('Striech na ulici','ev.roofs',{step:1,min:1,max:20})}${F('Večerný nával bistra','ev.rush',{step:.5,u:'kWh'})}</div></div>
   <div class="card"><h3>Kto koľko získa (dnes)</h3><table style="margin-top:6px"><tbody><tr><td>Strechy na ulici: predaj autu namiesto výkupu</td><td class="n">+${eur(v.roofEarn)}</td></tr><tr><td>Majiteľ auta: V2G (predaj − nákup)</td><td class="n">+${eur(v.ownerV2G)}</td></tr><tr><td>Majiteľ auta: lacnejšia jazda (zvyšok batérie)</td><td class="n">+${eur(v.ownerDrive)}</td></tr><tr><td>Bistro: večer lacnejšie než zo siete</td><td class="n">+${eur(v.bistro)}</td></tr><tr style="font-weight:700"><td>Ročne spolu (× ${S.sim.days} dní × 12)</td><td class="n">${eur0((v.roofEarn+v.ownerV2G+v.ownerDrive+v.bistro)*S.sim.days*12)}</td></tr></tbody></table>
    <p class="xs mut" style="margin-top:8px">🛡 Ochrana: auto nikdy neklesne pod ${fm(E.minSoc,0)} % (${fm(v.minK,1)} kWh) – toľko potrebuje na ranný odchod. Na rozdiel od domácej batérie (bežná funkcia aplikácie) je V2G vízia: auto nabíja zo zvyšku striech pred výkupom.</p></div></div>
  ${gains(['Majiteľ auta zarába, kým auto stojí.','Bistro má lacnejší večer bez vlastnej batérie.','Strechy predajú viac prebytku než výkupcovi.'],['Flexibilita v sieti – autá ako rozptýlená batéria ulice.','Nové služby: wallboxy s V2G, tarify pre elektromobily.','Menej večerných špičiek v oblasti ZSE/VSE.'])}</div>`;
}
function moreSheet(){
  const L=[NAV[2],NAV[3],NAV[4],['profile','Profil','user'],...NAV_PUB];
  return `<div class="modal-bg" data-act="closemodal" style="align-items:flex-end;padding:0"><div class="more" role="dialog" aria-modal="true" aria-label="Viac"><div class="row between"><h2>Viac</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div><div class="gridm">${L.map(([k,l,i])=>`<button data-act="view:${k}">${icon(i)}${l}</button>`).join('')}</div><button class="btn sm jury-btn" style="width:100%;margin-top:14px" data-act="jury" aria-pressed="${!!S.jury}">🎬 ${S.jury?'Vypnúť režim poroty':'Režim poroty'}</button></div></div>`;
}


