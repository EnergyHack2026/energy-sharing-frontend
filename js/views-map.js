'use strict';
/* ---------- mapa odberných miest ---------- */
function mapMembers(){
  const per=S.persona;
  const L=[
   {id:'anna',addr:S.om.anna.addr,pv:true,bat:S.bat.on,role:'Výrobca'+(S.bat.on?' s batériou':''),own:per==='anna',label:per==='anna'?'Vy':'Anna',ims:S.p.ims,grp:gname(S.group),live:true},
   {id:'peter',addr:S.om.peter.addr,bistro:true,role:'Odberateľ (bistro)',own:per==='peter',label:per==='peter'?'Vy':'Peter',ims:S.c.ims,grp:gname(S.group),live:true},
   {id:'peter2',addr:'Záhradná 3, Piešťany',role:'Odberateľ (chata)',own:per==='peter',label:per==='peter'?'chata':'',ims:false,grp:'—'},
   {id:'B',addr:'Nitra',pv:true,role:'Výrobca',label:'',ims:true,grp:gname(S.group)},
   {id:'C',addr:'Hlohovec',role:'Odberateľ',label:'',ims:true,grp:gname(S.group)},
   {id:'D',addr:'Bratislava',role:'Odberateľ (EV)',label:'',ims:true,grp:gname(S.group)},
   {id:'Z1',addr:'Žilina',pv:true,role:'Výrobca',ims:true,grp:'Poludnie 9'},{id:'Z2',addr:'Martin',role:'Odberateľ',ims:true,grp:'Poludnie 9'},{id:'Z3',addr:'Banská Bystrica',role:'Odberateľ',ims:true,grp:'Poludnie 9'},
   {id:'V1',addr:'Prešov',pv:true,bat:true,role:'Výrobca s batériou',ims:true,grp:'Východné slnko'},{id:'V2',addr:'Košice',bistro:true,role:'Odberateľ (reštaurácia)',ims:true,grp:'Východné slnko'},{id:'V3',addr:'Košice',role:'Odberateľ',ims:true,grp:'Východné slnko'},{id:'V4',addr:'Michalovce',role:'Odberateľ',ims:true,grp:'Východné slnko'},{id:'V5',addr:'Poprad',pv:true,role:'Výrobca',ims:true,grp:'Východné slnko'}];
  if(S.don.on||S.agent.on&&agentPlan().donPct>0){const r=RCP[S.don.rcp];L.push({id:'rcp',addr:r.name,role:'Príjemca Solidárneho slnka',label:r.ic,ims:true,grp:'Solidárne slnko',rcp:true})}
  for(const g of S.gifts){const c=CONTACTS[g.to];if(c&&!L.find(x=>x.id==='k_'+g.to))L.push({id:'k_'+g.to,addr:c.town,role:'Príjemca darčeka – '+c.name,label:'🎁',ims:true,grp:'Pošli slnko'})}
  const placed=[];
  for(const m of L){const g=geo(m.addr);let [x,y]=prj(g.ll);for(let k=0;k<8&&placed.some(p=>Math.hypot(p[0]-x,p[1]-y)<26);k++){x+=22;y+=k%2?-6:6}placed.push([x,y]);m.x=x;m.y=y;m.reg=regionOf(g.ll);m.town=g.town}
  return L;
}
function vMap(){
  const res=dayRun(),cur=Math.min(95,S.sim.idx),P=res.P,M=mapMembers(),by=Object.fromEntries(M.map(m=>[m.id,m]));
  const kw=(f)=>sum(res.recs.filter(r=>r.i===cur&&f(r)).map(r=>r.kwh));
  const bell=P.fpFull[cur],bs=batSupply(potRun())[cur],rm=RM();
  const F_=[];
  const add=(id,a,b,k,col,mk,o={})=>{if(by[a]&&by[b])F_.push({id,a:by[a],b:by[b],k,col,mk,...o})};
  add('fl_ap','anna','peter',kw(r=>r.from==='anna'&&r.to==='peter'&&!r.src&&!r.kind),'var(--green)','g');
  add('fl_ab','anna','peter',kw(r=>r.from==='anna'&&r.to==='peter'&&r.src==='bat'),'var(--purple)','p',{bend:-.25,fromBat:true});
  const oth=S.sim.others;
  add('fl_bc','B','C',oth?kw(r=>r.from==='B'&&r.to==='C'):bell*.3,'var(--green)','g');
  add('fl_bd','B','D',oth?kw(r=>r.from==='B'&&r.to==='D'):bell*.25,'var(--green)','g');
  add('fl_ac','anna','C',oth?kw(r=>r.from==='anna'&&r.to==='C'):0,'var(--green)','g',{bend:.3});
  add('fl_z2','Z1','Z2',bell*.4,'var(--green)','g');add('fl_z3','Z1','Z3',bell*.3,'var(--green)','g',{bend:-.2});
  add('fl_v2','V1','V2',bell*.45,'var(--green)','g');add('fl_v3','V1','V3',bell*.3,'var(--green)','g',{bend:-.3});
  add('fl_vb','V1','V2',bs*.7,'var(--purple)','p',{bend:.35,fromBat:true});
  add('fl_v4','V5','V4',bell*.35,'var(--green)','g');
  if(by.rcp)add('fl_rc','anna','rcp',kw(r=>r.kind==='don'),'#f5b400','y',{bend:.4});
  for(const g of S.gifts)if(by['k_'+g.to])add('fl_k'+g.to,'anna','k_'+g.to,kw(r=>r.kind==='gift'&&r.to==='gift:'+g.to),'#f5b400','y',{bend:.18});
  const now=sum(F_.map(f=>f.k)),sel=S.mapSel&&by[S.mapSel]?by[S.mapSel]:null;
  const [zx]=prj([ZSE_LON,48.5]);
  let svg=`<svg viewBox="0 0 ${MAPW} 392" role="img" aria-label="Mapa Slovenska s odbernými miestami a tokom elektriny v intervale ${I2T(cur)}">${arrowDefs()}
   <defs><clipPath id="skc"><path d="${skPath()}"/></clipPath></defs>
   <path d="${skPath()}" fill="var(--card)" stroke="var(--mut)" stroke-width="1.5"/>
   <g clip-path="url(#skc)"><rect x="0" y="0" width="${zx}" height="392" fill="var(--zse)" opacity=".07"/><rect x="${zx}" y="0" width="${MAPW-zx}" height="392" fill="var(--vse)" opacity=".08"/><line x1="${zx}" x2="${zx}" y1="0" y2="392" stroke="var(--mut)" stroke-dasharray="4 6" opacity=".6"/></g>
   <text x="${zx-12}" y="378" font-size="12" font-weight="800" fill="var(--zse)" text-anchor="end">oblasť ZSE ←</text><text x="${zx+12}" y="378" font-size="12" font-weight="800" fill="var(--vse)">→ oblasť VSE</text>`;
  for(const f of F_){const a=[f.a.x+(f.fromBat?14:0),f.a.y-(f.fromBat?8:10)],b=[f.b.x,f.b.y-10];svg+=flowSvg(f.id,a,b,f.k,f.col,{mk:f.mk,bend:f.bend})}
  const outRes=agg(res);
  for(const m of M){const glow=m.pv?(m.id==='anna'?res.A.a[cur]*res.share:bell*.8)/Math.max(.2,Math.max(...P.fpFull)):0;
    const soc=m.bat?(m.id==='anna'?res.R.soc[cur]/Math.max(.1,S.bat.cap):(cur>=72?Math.max(.15,1-(cur-72)/16):Math.min(1,.2+Math.max(0,cur-40)/24))):0;
    svg+=houseSvg(m.x,m.y,{roof:m.reg,pv:m.pv,bat:m.bat,soc,glow,bistro:m.bistro,own:m.own,noims:!m.ims,label:m.label,sel:sel===m,act:'mapsel:'+m.id,aria:`${m.role}, ${m.town}`})}
  svg+=`</svg>`;
  let card='';
  if(sel){
    let det='';
    if(sel.id==='anna')det=`<tr><td>Dnes predané (deň + večer)</td><td class="n">${fm(outRes.anna.shared+outRes.anna.batSold,2)} kWh</td></tr><tr><td>Čistý príjem dnes</td><td class="n">${eur(outRes.anna.net)}</td></tr><tr><td>Batéria teraz</td><td class="n">${S.bat.on?fm(res.R.soc[cur],1)+' / '+fm(S.bat.cap,0)+' kWh':'—'}</td></tr>`;
    else if(sel.id==='peter')det=`<tr><td>Dnes prijaté</td><td class="n">${fm(outRes.peter.recv,2)} kWh</td></tr><tr><td>Zaplatené dnes</td><td class="n">${eur(outRes.peter.paid)}</td></tr><tr><td>Úspora dnes</td><td class="n">${eur(outRes.peter.saved)}</td></tr>`;
    else det=`<tr><td colspan="2" class="mut">Anonymizovaný člen – toky sú ilustračné, odvodené z rovnakého profilu výroby.</td></tr>`;
    card=`<div class="card" style="border-left:5px solid ${sel.reg==='vse'?'var(--vse)':'var(--zse)'}"><div class="row between"><h3>${sel.own?'🏠 Vaše OM':esc(sel.role)}</h3><button class="btn sm" data-act="mapsel:" aria-label="Zavrieť kartu">✕</button></div><table style="margin-top:6px"><tbody><tr><td>Rola</td><td class="n">${esc(sel.role)}</td></tr><tr><td>Lokalita (približne)</td><td class="n">${esc(sel.own?sel.addr:sel.town.replace(/\b\w/g,c=>c.toUpperCase()))}</td></tr><tr><td>Oblasť</td><td class="n">${sel.reg==='zse'?'ZSE':'VSE'}</td></tr><tr><td>IMS</td><td class="n">${sel.ims?'✓ áno':'✕ chýba'}</td></tr><tr><td>Skupina</td><td class="n">${esc(sel.grp||'—')}</td></tr>${det}</tbody></table></div>`;
  }
  return `<div class="gap"><div class="card"><div class="row between"><div><h2>🗺 Mapa odberných miest</h2><p class="sm mut">Vaše OM aj ostatní členovia (anonymizovane) – umiestnené približne podľa adresy. Svetielka ukazujú, kade práve tečie elektrina virtuálnou sieťou.</p></div><div class="row"><button class="btn sm" data-act="mapt:48">☀ Poludnie</button><button class="btn sm" data-act="mapt:78">🌙 Večer</button></div></div></div>
   ${simBar()}
   <div class="grid" style="grid-template-columns:minmax(0,1fr)"><div class="mapwrap">${svg}</div></div>
   <div class="grid g4">${kpi('Interval',I2T(cur)+'–'+I2T(cur+1))}${kpi('Tečie práve teraz',fm(now,2)+' kWh','za 15 minút, všetky skupiny')}${kpi('Vaša skupina dnes',fm(outRes.anna.shared+outRes.anna.batSold,1)+' kWh','Anna → Peter (deň + 🔋)')}${kpi('Oblasti','ZSE · VSE','červená a modrá strecha')}</div>
   ${card}
   <div class="card"><div class="legend" style="margin:0"><span><svg width="16" height="12" aria-hidden="true"><polygon points="0,10 8,2 16,10" fill="var(--zse)"/></svg> oblasť ZSE</span><span><svg width="16" height="12" aria-hidden="true"><polygon points="0,10 8,2 16,10" fill="var(--vse)"/></svg> oblasť VSE</span><span>▰ solárny panel = výrobca</span><span style="color:var(--purple)">▮ batéria</span><span><i style="border-color:var(--green)"></i>tok cez deň</span><span><i style="border-color:var(--purple)"></i>tok z batérie</span><span><i style="border-color:#f5b400"></i>dar / darček</span><span>čiarkovaný dom = OM bez IMS</span></div><p class="xs mut" style="margin-top:6px">${rm?'Animácia je vypnutá podľa nastavenia „obmedziť pohyb“ – smer toku ukazujú šípky. ':''}Kliknite na domček pre detail. Polohu vášho OM zmeníte adresou v Profile.</p></div>
   ${FOOT()}</div>`;
}

