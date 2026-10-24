'use strict';
/* ---------- mapa odberných miest ----------
   Tri oblasti: Západ (ZSE), Stred (SSE – zdieľanie zatiaľ nie je dostupné, žiadne OM),
   Východ (VSE). Vizuál podľa úvodnej stránky: tmavý pás, izometrické domčeky, bodkované toky. */
const MAP_H=420;
function mapMembers(){
  const per=S.persona;
  const L=[
   {id:'anna',addr:S.om.anna.addr,pv:true,bat:S.bat.on,role:'Výrobca'+(S.bat.on?' s batériou':''),own:per==='anna',label:per==='anna'?'Vy':'Anna',ims:S.p.ims,grp:gname(S.group),live:true},
   {id:'peter',addr:S.om.peter.addr,bistro:true,role:'Odberateľ (bistro)',own:per==='peter',label:per==='peter'?'Vy':'Peter',ims:S.c.ims,grp:gname(S.group),live:true},
   {id:'peter2',addr:'Záhradná 3, Piešťany',role:'Odberateľ (chata)',label:per==='peter'?'chata':'',ims:false,grp:'—'},
   {id:'B',addr:'Nitra',pv:true,role:'Výrobca',label:'',ims:true,grp:gname(S.group)},
   {id:'C',addr:'Hlohovec',role:'Odberateľ',label:'',ims:true,grp:gname(S.group)},
   {id:'D',addr:'Bratislava',role:'Odberateľ (EV)',label:'',ims:true,grp:gname(S.group)},
   {id:'V1',addr:'Prešov',pv:true,bat:true,role:'Výrobca s batériou',ims:true,grp:'Poludnie 9'},{id:'V2',addr:'Košice',bistro:true,role:'Odberateľ (reštaurácia)',ims:true,grp:'Poludnie 9'},{id:'V3',addr:'Košice',role:'Odberateľ',ims:true,grp:'Poludnie 9'},{id:'V4',addr:'Michalovce',role:'Odberateľ',ims:true,grp:'Poludnie 9'},{id:'V5',addr:'Poprad',pv:true,role:'Výrobca',ims:true,grp:'Poludnie 9'}];
  if(S.don.on){const r=RCP[(S.don.rcps&&S.don.rcps[0]||{}).id||S.don.rcp];L.push({id:'rcp',addr:r.name,role:'Príjemca Lúča pomoci',label:r.ic,ims:true,grp:'Lúč pomoci',rcp:true})}
  for(const g of S.gifts){const c=CONTACTS[g.to];if(c&&!L.find(x=>x.id==='k_'+g.to))L.push({id:'k_'+g.to,addr:c.town,role:'Príjemca darčeka – '+c.name,label:'🎁',ims:true,grp:'Pošli slnko'})}
  const placed=[];
  for(const m of L){const g=geo(m.addr);let [x,y]=prj(g.ll);for(let k=0;k<10&&placed.some(p=>Math.hypot(p[0]-x,p[1]-y)<36);k++){x+=k%2?-34:30;y+=k%2?16:10}placed.push([x,y]);m.x=x;m.y=y;m.reg=regionOf(g.ll);m.town=g.town}
  /* v strede (SSE) sa elektrina neponúka – takéto OM sa na mape nezobrazí ako aktívne */
  return L.filter(m=>m.reg!=='sse'||m.own);
}
/* legenda = prepínače zvýraznenia (S.mapHi) */
const MAP_KEYS=[['zse','var(--map-zse-roof)','oblasť ZSE'],['sse','var(--map-sse-ink)','oblasť SSE – mimo služby'],['vse','var(--map-vse-roof)','oblasť VSE'],['flow','var(--map-flow)','tok cez deň'],['bat','var(--map-bat)','z batérie'],['gift','var(--map-gift)','dar (Lúč pomoci)'],['noims','','OM bez IMS']];
function mapLegend(){
  return `<div class="map-legend" role="group" aria-label="Zvýrazniť na mape">${MAP_KEYS.map(([k,c,l])=>`<button class="${k==='noims'?'dash':''}" data-act="maphi:${k}" aria-pressed="${S.mapHi===k}">${c?`<i style="background:${c}"></i>`:''}${l}</button>`).join('')}</div>`;
}
/* veta pod mapou: čo je zvýraznené */
function mapNote(M,F_){
  const hi=S.mapHi;if(!hi)return 'Kliknite na štítok a mapa zvýrazní vybranú časť.';
  if(hi==='sse')return 'Stredné Slovensko (SSE) je zatiaľ mimo služby – žiadne odberné miesta.';
  if(hi==='zse'||hi==='vse'){const L=M.filter(m=>m.reg===hi),pv=L.filter(m=>m.pv).length;return `Oblasť ${hi.toUpperCase()} – ${L.length} odberných miest, z toho ${pv} ${pv===1?'výrobca':pv<5?'výrobcovia':'výrobcov'}.`}
  if(hi==='noims'){const n=M.filter(m=>!m.ims).length;return n?`Bez inteligentného merania: ${n} ${n===1?'odberné miesto':'odberné miesta'} – zatiaľ nemôžu aktívne zdieľať.`:'Všetky odberné miesta majú IMS.'}
  const L=F_.filter(f=>f.t===hi),k=sum(L.map(f=>f.k)),lab={flow:'Toky cez deň',bat:'Toky z batérie',gift:'Dary (Lúč pomoci)'}[hi];
  if(!L.length)return hi==='gift'?'Zatiaľ žiadne dary – zapnite Lúč pomoci.':lab+': práve teraz žiadne.';
  return `${lab}: ${L.length} ${L.length===1?'spojenie':L.length<5?'spojenia':'spojení'}, práve teraz ${fm(k,2)} kWh za 15 minút.`;
}
function vMap(){
  const res=dayRun(),cur=Math.min(95,S.sim.idx),P=res.P,M=mapMembers(),by=Object.fromEntries(M.map(m=>[m.id,m]));
  const kw=(f)=>sum(res.recs.filter(r=>r.i===cur&&f(r)).map(r=>r.kwh));
  const bell=P.fpFull[cur],bs=batSupply(potRun())[cur],rm=RM();
  const F_=[],FL='var(--map-flow)',BT='var(--map-bat)',GF='var(--map-gift)';
  const add=(id,a,b,k,col,mk,o={})=>{if(by[a]&&by[b])F_.push({id,a:by[a],b:by[b],k,col,mk,t:mk==='q'?'bat':mk==='h'?'gift':'flow',...o})};
  add('fl_ap','anna','peter',kw(r=>r.from==='anna'&&r.to==='peter'&&!r.src&&!r.kind),FL,'m');
  add('fl_ab','anna','peter',kw(r=>r.from==='anna'&&r.to==='peter'&&r.src==='bat'),BT,'q',{bend:-.3});
  const oth=S.sim.others;
  add('fl_bc','B','C',oth?kw(r=>r.from==='B'&&r.to==='C'):bell*.3,FL,'m');
  add('fl_bd','B','D',oth?kw(r=>r.from==='B'&&r.to==='D'):bell*.25,FL,'m');
  add('fl_ac','anna','C',oth?kw(r=>r.from==='anna'&&r.to==='C'):0,FL,'m',{bend:.3});
  add('fl_v2','V1','V2',bell*.45,FL,'m');add('fl_v3','V1','V3',bell*.3,FL,'m',{bend:-.3});
  add('fl_vb','V1','V2',bs*.7,BT,'q',{bend:.35});
  add('fl_v4','V5','V4',bell*.35,FL,'m',{bend:.12});
  if(by.rcp)add('fl_rc','anna','rcp',kw(r=>r.kind==='don'),GF,'h',{bend:.4});
  for(const g of S.gifts)if(by['k_'+g.to])add('fl_k'+g.to,'anna','k_'+g.to,kw(r=>r.kind==='gift'&&r.to==='gift:'+g.to),GF,'h',{bend:.18});
  const now=sum(F_.map(f=>f.k)),sel=S.mapSel&&by[S.mapSel]?by[S.mapSel]:null;
  const hi=S.mapHi,isReg=['zse','sse','vse'].includes(hi),isFl=['flow','bat','gift'].includes(hi);
  let svg=`<svg viewBox="0 28 ${MAPW} ${MAP_H-28}" role="img" aria-label="Mapa Slovenska – oblasti ZSE, SSE a VSE s odbernými miestami a tokom elektriny v intervale ${I2T(cur)}">${arrowDefs()}${mapBase(MAP_H,hi)}`;
  for(const f of F_){const fc=isFl?(f.t===hi?'hi':'dim'):isReg?(f.a.reg===hi&&f.b.reg===hi?'':'dim'):hi==='noims'?'dim':'';
    svg+=`<g class="mfl ${fc}">${flowSvg(f.id,[f.a.x,f.a.y-4],[f.b.x,f.b.y-4],f.k,f.col,{mk:f.mk,bend:f.bend,dot:true})}</g>`}
  const outRes=agg(res);
  for(const m of [...M].sort((a,b)=>a.y-b.y)){const glow=m.pv?(m.id==='anna'?res.A.a[cur]*res.share:bell*.8)/Math.max(.2,Math.max(...P.fpFull)):0;
    const soc=m.bat?(m.id==='anna'?res.R.soc[cur]/Math.max(.1,S.bat.cap):(cur>=72?Math.max(.15,1-(cur-72)/16):Math.min(1,.2+Math.max(0,cur-40)/24))):0;
    const dim=isReg?m.reg!==hi:isFl?!F_.some(f=>f.t===hi&&(f.a===m||f.b===m)):hi==='noims'?m.ims:false;
    svg+=mapHouse(m.x,m.y,{roof:m.reg,pv:m.pv,bat:m.bat,soc,glow,bistro:m.bistro,own:m.own,noims:!m.ims,label:m.label,sel:sel===m,big:m.own,dim,hi:hi==='noims'&&!m.ims,act:'mapsel:'+m.id,aria:`${m.role}, ${m.town}`})}
  svg+=`</svg>`;
  const ownM=M.find(m=>m.own),ownSse=ownM&&ownM.reg==='sse';
  let card='';
  if(sel){
    let det='';
    if(sel.id==='anna')det=`<tr><td>Dnes predané (deň + večer)</td><td class="n">${fm(outRes.anna.shared+outRes.anna.batSold,2)} kWh</td></tr><tr><td>Čistý príjem dnes</td><td class="n">${eur(outRes.anna.net)}</td></tr><tr><td>Batéria teraz</td><td class="n">${S.bat.on?fm(res.R.soc[cur],1)+' / '+fm(S.bat.cap,0)+' kWh':'—'}</td></tr>`;
    else if(sel.id==='peter')det=`<tr><td>Dnes prijaté</td><td class="n">${fm(outRes.peter.recv,2)} kWh</td></tr><tr><td>Zaplatené dnes</td><td class="n">${eur(outRes.peter.paid)}</td></tr><tr><td>Úspora dnes</td><td class="n">${eur(outRes.peter.saved)}</td></tr>`;
    else det=`<tr><td colspan="2" class="mut">Anonymizovaný člen – toky sú ilustračné, odvodené z rovnakého profilu výroby.</td></tr>`;
    card=`<div class="card" style="border-left:5px solid ${sel.reg==='vse'?'var(--map-vse-roof)':'var(--map-zse-roof)'}"><div class="row between"><div><span class="kicker" style="margin-bottom:4px">${REG[sel.reg].name} · ${REG[sel.reg].co}</span><h3 class="om-row">${sel.own?`${omIc(S.om[sel.id]?S.om[sel.id].type:'')}Vaše odberné miesto`:esc(sel.role)}</h3></div><button class="btn sm" data-act="mapsel:" aria-label="Zavrieť kartu">✕</button></div><table style="margin-top:8px"><tbody><tr><td>Rola</td><td class="n">${esc(sel.role)}</td></tr><tr><td>Lokalita (približne)</td><td class="n">${esc(sel.own?sel.addr:sel.town.replace(/\b\w/g,c=>c.toUpperCase()))}</td></tr><tr><td>IMS</td><td class="n">${sel.ims?'✓ áno':'✕ chýba'}</td></tr><tr><td>Skupina</td><td class="n">${esc(sel.grp||'—')}</td></tr>${det}</tbody></table></div>`;
  }
  return `<div class="gap"><section class="card hero map-hero">
    <div class="map-head"><div><span class="kicker">Mapa odberných miest · ${I2T(cur)}</span><h1>Slnko práve <em>spája susedov.</em></h1><p class="lead">Vaše OM aj ostatní členovia (anonymizovane), umiestnení približne podľa adresy. Bodky ukazujú, kade práve tečie elektrina.</p></div>
     <div class="row"><span class="seg" role="group" aria-label="Čas na mape"><button data-act="mapt:48" aria-pressed="${cur===48}">☀ Poludnie</button><button data-act="mapt:78" aria-pressed="${cur===78}">🌙 Večer</button></span></div></div>
    <div class="map-svg">${svg}</div>${mapLegend()}<p class="map-note" aria-live="polite">${mapNote(M,F_)}</p>
   </section>
   ${ownSse?`<div class="card" style="border-left:5px solid var(--orange)"><b>Vaše odberné miesto je na Strednom Slovensku.</b><p class="sm mut" style="margin-top:4px">V oblasti SSE zatiaľ nie je možné elektrinu ponúkať ani odoberať. Zdieľanie je dostupné v oblastiach ZSE a VSE.</p></div>`:''}
   ${simBar()}
   <div class="grid g4">${kpi('Interval',I2T(cur)+'–'+I2T(cur+1))}${kpi('Tečie práve teraz',fm(now,2)+' kWh','za 15 minút, všetky skupiny')}${kpi('Vaša skupina dnes',fm(outRes.anna.shared+outRes.anna.batSold,1)+' kWh','Anna → Peter (deň + 🔋)')}${kpi('Oblasti v službe','ZSE · VSE','Stred (SSE) zatiaľ mimo služby')}</div>
   ${card}
   <p class="note">${rm?'Animácia je vypnutá podľa nastavenia „obmedziť pohyb“ – smer toku ukazujú šípky. ':''}Kliknite na domček pre detail. Polohu vášho OM zmeníte adresou v Profile.</p></div>`;
}
