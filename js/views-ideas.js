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
function stickerSvg(name,sh,lv,month){
  const [c,md]=LVC[lv]||['#5d6675','☀'],qr=QR(`Zdieľňa | ${name.slice(0,24)} | ${Math.round(sh*100)} % slnka od susedov | ${month}`),n=qr.length;
  let q='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr[y][x])q+=`M${x},${y}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Nálepka Na slnku od susedov"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d3b1f"/><stop offset=".6" stop-color="#14833b"/><stop offset="1" stop-color="#e7a400"/></linearGradient></defs><circle cx="200" cy="200" r="196" fill="url(#sg)"/><circle cx="200" cy="200" r="182" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 7" opacity=".8"/>
  <text x="200" y="74" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">FUNGUJEME NA SLNKU</text><text x="200" y="100" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">OD SUSEDOV</text>
  <g transform="translate(130,116)"><rect width="140" height="140" rx="10" fill="#fff"/><g transform="translate(10,10) scale(${(120/n).toFixed(4)})"><path d="${q}" fill="#111"/></g></g>
  <text x="200" y="292" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" text-anchor="middle">NASKENUJTE</text>
  <text x="200" y="320" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">a pozrite, koľko slnka je v našej prevádzke</text>
  <text x="200" y="350" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" text-anchor="middle">${esc(name.slice(0,26))} · ${esc(month)}</text>
  <circle cx="330" cy="88" r="30" fill="${c}" stroke="#fff" stroke-width="3"/><text x="330" y="96" font-size="24" text-anchor="middle">${md}</text></svg>`;
}
/* certifikát „Slnko od susedov“ – Odmeny → Certifikát, iba pre odberné miesta typu Prevádzka */
function vCert(){
  const {sh,lv,a}=badgeShare(),month=new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'}),name=S.badge.name||'Bistro';
  const months=[['máj',1.25],['jún',1.35],['júl',1.4],['aug',1.3],['sep',1.0],['okt',0.7]].map(([m,mul])=>{const r=agg(runDay(S.c.appTime,{mul}));return [m,r.peter.cons>0?r.peter.recv/r.peter.cons:0]});
  const nb=[['Kaviareň Pri fontáne','Trnava',.64],['Pekáreň Klások','Hlohovec',.47],['Kvetinárstvo Lúka','Piešťany',.28],[name,'Trnava',sh]].sort((x,y)=>y[2]-x[2]);
  const lvOf=s=>s>=.6?'zlato':s>=.4?'striebro':s>=.2?'bronz':null;
  return `<div class="gap">${hero({kicker:'Slnečný klub · certifikát',title:'Prevádzka <em>na slnku od susedov.</em>',lead:'Ukážte zákazníkom, koľko elektriny vo vašej prevádzke pochádza zo striech susedov. Certifikát sa počíta z 15-minútových meraní, nálepka s QR kódom ide na dvere.',extra:`<div class="hero-tabs">${rewardTabs()}</div>`})}
  <div class="grid g2"><div class="cert"><div class="lv">${lv?LVC[lv][1]+' '+lv:'zatiaľ bez úrovne'} · certifikát ${esc(month)}</div><div style="margin-top:14px;font-size:18px;font-weight:700">${esc(name)}</div><div class="pc" style="margin-top:8px">${Math.round(sh*100)} %</div><div style="margin-top:4px;font-weight:600">elektriny zo susedných striech</div><div class="sm" style="opacity:.9;margin-top:12px">Dnes ${fm(a.peter.recv,1)} kWh zo ${fm(a.peter.cons,1)} kWh spotreby${a.peter.recvBat>0?` (z toho ${fm(a.peter.recvBat,1)} kWh večer z batérie suseda)`:''}. Vypočítané z 15-minútových alokácií.</div><div class="sm" style="margin-top:10px">Úrovne: 🥉 od 20 % · 🥈 od 40 % · 🥇 od 60 %</div></div>
   <div class="card" style="text-align:center"><h3>Nálepka na dvere s QR kódom</h3><div style="max-width:260px;margin:10px auto" id="sticker">${stickerSvg(name,sh,lv,month)}</div><div class="row" style="justify-content:center"><button class="btn pri sm" data-act="stickerpng">⬇ Stiahnuť nálepku (PNG)</button></div><p class="xs mut" style="margin-top:6px">Nálepka neuvádza percento – aktuálny podiel slnka hosť uvidí po naskenovaní QR kódu. QR kód je skutočný.</p></div></div>
  <div class="grid g2"><div class="card"><h3>Nastavenie</h3><div class="fields one" style="margin-top:8px">${F('Názov prevádzky','badge.name',{t:'x'})}</div><p class="xs mut" style="margin-top:8px">Podiel zvýšite presunom spotreby do slnečného okna (Odmeny), vyššou max. cenou alebo večerným nákupom z batérie suseda.</p>
    <h3 style="margin-top:12px">Posledných 6 mesiacov</h3><div class="gap" style="margin-top:6px">${months.map(([m,v])=>`<div><div class="row between sm"><span>${m}</span><b>${pct(v)} ${lvOf(v)?LVC[lvOf(v)][1]:''}</b></div><div class="bar"><i style="width:${Math.min(100,v*100)}%"></i></div></div>`).join('')}</div><p class="xs mut" style="margin-top:6px">Mesiace sa líšia počasím (ilustračne 70–140 % dnešnej výroby).</p></div>
   <div class="card"><h3>Náhľad verejnej stránky prevádzky</h3><div style="border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:8px"><div class="row between"><b style="font-size:17px">${esc(name)}</b>${lv?pill('g',LVC[lv][1]+' '+lv):''}</div><div class="xs mut">Trnava · člen skupiny ${gname(S.group)}</div><p class="sm" style="margin-top:8px">„Tento mesiac sme fungovali z <b>${Math.round(sh*100)} %</b> na slnku od našich susedov.“</p><div class="row" style="margin-top:8px">${pill('y','☀ '+fm(a.peter.recv*S.sim.days,0)+' kWh / mesiac')}${pill('n','CO₂ −'+fm(a.peter.recv*S.sim.days*S.twin.co2,0)+' kg')}</div></div>
    <h3 style="margin-top:14px">Zapojené prevádzky v okolí</h3><table style="margin-top:4px"><tbody>${nb.map(([n,t,s])=>`<tr><td><b>${esc(n)}</b><div class="xs mut">${t}</div></td><td class="n">${pct(s)} ${lvOf(s)?LVC[lvOf(s)][1]:''}</td></tr>`).join('')}</tbody></table><p class="xs mut" style="margin-top:4px">Ostatné prevádzky sú ilustračné.</p></div></div>
  </div>`;
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


