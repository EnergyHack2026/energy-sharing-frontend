'use strict';
/* ---------- views ---------- */
function simBar(){
  const s=S.sim,t=I2T(s.idx);
  return `<div class="card sim"><div class="sim-row">
     <button class="btn pri sm" data-act="play" aria-label="${s.playing?'Pauza':'Prehrať priebeh dňa'}">${s.playing?'⏸ Pauza':'▶ Prehrať deň'}</button>
     <button class="btn sm" data-act="simreset" aria-label="Na začiatok dňa">↺</button>
     <span class="seg hide-m" role="group" aria-label="Rýchlosť">${[1,10,60].map(x=>`<button data-act="speed:${x}" aria-pressed="${s.speed===x}">${x}×</button>`).join('')}</span>
     <input type="range" min="0" max="96" step="1" value="${s.idx}" data-k="sim.idx" data-t="n" aria-label="Čas dňa">
     <span class="b kbd sim-t">${s.idx>=96?'24:00':t}</span>
     ${s.idx>=96?`<button class="btn sm dark" data-act="midnight">🌙 Nový deň</button>`:`<span class="pill n">Deň ${S.day}</span>`}
   </div></div>`;
}
/* stav členstva – pri aktívnom členstve ako štítky v hero, inak samostatná karta */
function memTop(){
  const m=S.mem[S.persona];if(S.persona==='admin'||!isAct(m))return '';
  return pill('g','✓ '+gname(S.group)+' · aktívna')+(m==='ENDING'?pill('o','Čaká na ukončenie – zdieľanie pokračuje'):'');
}
function banner(){
  const m=S.mem[S.persona];
  if(S.persona==='admin'||isAct(m))return '';
  const ims=S.persona==='anna'?S.p.ims:S.c.ims;
  return `<div class="card" style="border-left:5px solid var(--orange)"><div class="row between"><div><div class="b">● Stav členstva: ${MEM[m]}</div><div class="sm mut">${!ims?'Na aktívne zdieľanie potrebujete inteligentné meranie (IMS). Čísla nižšie sú zatiaľ odhad potenciálu.':m==='PENDING'?'Žiadosť čaká na aktiváciu. Dovtedy sa vaše súčasné nastavenie nemení.':'Zdieľanie zatiaľ nie je aktívne – čísla nižšie sú odhad potenciálu.'}</div></div><button class="btn sm dark" data-act="view:group">Moja skupina →</button></div></div>`;
}
/* kontrola jedného 15-min intervalu – pre porotu/operátora (Prehľady → Ledger), nie pre zákazníka */
function intervalCard(res,per){
  return `<div class="card"><div class="row between"><div><h3>Kontrola intervalu – živé úpravy</h3><p class="xs mut">Zmeňte meranie alebo cenu a sledujte prepočet jednej 15-minútovej alokácie.</p></div><button class="btn sm" data-act="drawer">Všetky parametre</button></div>
   <div class="fields" style="margin-top:10px">${F('Interval skutočného merania','meter.idx',{t:'i'})}${F('Skutočný prebytok Anny','meter.anna',{step:.05,u:'kWh'})}${F('Skutočná spotreba Petra','meter.peter',{step:.05,u:'kWh'})}${F('Ponuková cena Anny','p.price',{step:.005,u:'€/kWh'})}${F('Max. cena Petra','c.max',{step:.005,u:'€/kWh'})}${F('Referenčná cena Petra','c.ref',{step:.005,u:'€/kWh'})}${F('Výkupná cena Anny','p.feedin',{step:.005,u:'€/kWh'})}${F('Provízia '+BR(),'fee.fix',{step:.5,u:'€/MWh'})}${F('Večerná cena z batérie','bat.price',{step:.005,u:'€/kWh'})}${F('Max. cena Petra večer','c.maxEve',{step:.005,u:'€/kWh'})}</div>
   ${(()=>{const i=S.meter.idx,rs=res.recs.filter(r=>r.i===i&&r.from==='anna'&&r.to==='peter'),k=sum(rs.map(r=>r.kwh)),am=sum(rs.map(r=>r.amt)),cm=sum(rs.map(r=>r.com));return `<div class="row" style="margin-top:12px;gap:18px"><div><div class="xs mut">Alokované Petrovi ${I2T(i)}–${I2T(i+1)}</div><div class="b upd" style="font-size:19px;color:var(--green)">${fm(k,2)} kWh</div></div><div><div class="xs mut">Nevyužitý prebytok Anny</div><div class="b" style="font-size:19px;color:var(--orange)">${fm(res.R.left[i],2)} kWh</div></div><div><div class="xs mut">Peter zaplatil (tržba Anny)</div><div class="b" style="font-size:19px">${eur(am)}</div></div><div><div class="xs mut">Provízia ${BR()} (od výrobcu)</div><div class="b" style="font-size:19px;color:var(--brand-ink)">${fm(cm,3)} €</div></div><div><div class="xs mut">Anna dostane (čisto)</div><div class="b" style="font-size:19px">${fm(am-cm,3)} €</div></div></div>${S.p.price>S.c.max?`<div class="pill r" style="margin-top:8px">✕ Cena ponuky (${fpr(S.p.price)} €) je vyššia než maximum odberateľa (${fpr(S.c.max)} €) – energia sa nepridelí</div>`:''}${per!=='peter'?priceWarn()+batWarnHtml():''}`})()}</div>`;
}
/* 6a – widget „Práve teraz“: iba aktuálny 15-min interval */
function nowWidget(per,res){
  const cur=Math.min(95,S.sim.idx),P=res.P,w=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),t=`${I2T(cur)}–${I2T(cur+1)}`;
  const rs=res.recs.filter(r=>r.i===cur&&!r.kind),nextSun=w?(cur<w.a?`slnečné okno o ${I2T(w.a)}`:`ďalšie slnečné okno zajtra o ${I2T(w.a)}`):'';
  let ic='🌙',txt;
  if(per==='peter'){
    const day=sum(rs.filter(r=>r.to==='peter'&&!r.src).map(r=>r.kwh)),bat=sum(rs.filter(r=>r.to==='peter'&&r.src==='bat').map(r=>r.kwh));
    if(day>.005){ic='☀';txt=`Od suseda vám teraz tečie <b>${fm(day,2)} kWh</b>`}
    else if(bat>.005){ic='🔋';txt=`Teraz vám svieti batéria suseda · <b>${fm(bat,2)} kWh</b>`}
    else txt=`Teraz beriete zo siete – ${nextSun||'dnes už bez slnka'}`;
  }else{
    const sold=sum(rs.filter(r=>r.from==='anna'&&!r.src).map(r=>r.kwh)),bat=sum(rs.filter(r=>r.from==='anna'&&r.src==='bat').map(r=>r.kwh)),soc=S.bat.on?res.R.soc[cur]/Math.max(.1,S.bat.cap):0;
    if(sold>.005){ic='☀';txt=`Vaša strecha teraz posiela susedom <b>${fm(sold,2)} kWh</b>`}
    else if(bat>.005){ic='🔋';txt=`Batéria teraz predáva susedom <b>${fm(bat,2)} kWh</b>`}
    else if(S.bat.on){ic='🔋';txt=`Batéria je nabitá na <b>${pct(soc)}</b> – ${cur<T2I(S.bat.eStart)?'večer ju predáte susedom':'čaká na zajtrajšie slnko'}`}
    else txt=`Strecha teraz oddychuje – ${nextSun||'dnes už bez slnka'}`;
  }
  return `<div class="now" role="status" aria-live="polite"><span class="tag"><i aria-hidden="true"></i>Práve teraz · ${t}</span><p><span class="ic" aria-hidden="true">${ic}</span> ${txt}</p><span class="xs">${S.jury?'čas dema':'podľa hodín'} · aktualizuje sa každých 15 minút</span></div>`;
}
/* malý náhľad dňa (bez osí) – iba ako pozvánka do prehrávača */
function daySpark(res,per){
  const lo=24,hi=92,W=260,H=90,aa=res.A.a.map(v=>v*res.share),sh=new Array(96).fill(0);
  for(const r of res.recs)if(!r.kind&&(r.from===per||r.to===per))sh[r.i]+=r.kwh;
  const base=per==='peter'?res.A.c:aa,mx=Math.max(.2,...base.slice(lo,hi),...aa.slice(lo,hi));
  const pt=(a,i)=>[(i-lo)/(hi-lo)*W,H-4-(a[i]/mx)*(H-12)];
  const line=a=>{const p=[];for(let i=lo;i<hi;i++)p.push(pt(a,i));return mono(p)};
  const area=a=>line(a)+`L${W},${H-4}L0,${H-4}Z`;
  return `<svg class="day-spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${area(aa)}" fill="var(--yellow)" opacity=".18"/><path d="${area(sh)}" fill="var(--green)" opacity=".45"/>${per==='peter'?`<path d="${line(res.A.c)}" fill="none" stroke="var(--blue)" stroke-width="1.6"/>`:''}<path d="${line(aa)}" fill="none" stroke="var(--yellow)" stroke-width="1.6"/><line x1="0" x2="${W}" y1="${H-4}" y2="${H-4}" stroke="var(--line)"/></svg>`;
}
function vHome(){
  const per=S.persona==='admin'?'peter':S.persona;
  const res=dayRun(),sim=agg(res,S.sim.idx),full=agg(res,96);
  const pot=agg(potRun());
  const P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));
  const unc=UNC[S.p.conf]||.2,wtxt=win?`${I2T(win.a)} – ${I2T(win.b)}`:'—';
  const rec=recAppTime(),gRec=gainFor(rec),d=S.sim.days,now=S.sim.idx>=96?'24:00':I2T(S.sim.idx);
  const big=(l,v,c='')=>`<div><div class="xs mut b" style="text-transform:uppercase;letter-spacing:.1em">${l}</div><div class="b" style="font-size:24px;letter-spacing:-.04em;margin-top:4px${c?';color:'+c:''}">${v}</div></div>`;
  let h=`<div class="gap">`;
  if(per==='peter')h+=hero({top:memTop(),kicker:'Dnes môžete prijať približne',title:`${fm(pot.peter.recv,1)} kWh <em>zo slnka susedov.</em>`,
      lead:`Najlepší čas na spotrebu je <b>${wtxt}</b> (odhad ${fm(pot.peter.recv*(1-unc),1)} – ${fm(pot.peter.recv*(1+unc),1)} kWh).`,
      acts:`<button class="btn" data-act="view:challenges">Naplánovať spotrebu →</button>${S.jury?`<button class="btn ghost" data-act="tour">🎬 Demo príbeh</button>`:''}`,aside:nowWidget(per,res)});
  else h+=hero({top:memTop(),kicker:'Dnes môžete ponúknuť približne',title:`${fm(pot.anna.offered,1)} kWh <em>pre susedov.</em>`,
      lead:`Vaša cena <b>${fpr(S.p.price)} €/kWh</b>, po provízii ${BR()} vám zostane <b>${fpr(netPrice(S.p.price))} €/kWh</b>.${S.bat.on?` Večer z batérie <b>${fpr(S.bat.price)} €/kWh</b>.`:''}`,
      acts:`<button class="btn" data-act="view:group">Skupina zdieľania →</button>${S.jury?`<button class="btn ghost" data-act="tour">🎬 Demo príbeh</button>`:''}`,aside:nowWidget(per,res)});
  h+=banner();
  {const mv=isAct(S.mem[per])?grpMove(per):null;if(mv)h+=`<div class="card grp-move-home"><span class="pend-ic">${icon('group')}</span><div><b>Presúvame vás do výhodnejšej skupiny ${mv.g.name}</b><p class="sm mut">Od ${dateSk(mv.from)} · ${per==='anna'?'zisk':'úspora'} navyše približne <b>+${eur0(mv.gain)} ročne</b> · jednotková cena ${fpr(mv.cv.price)} → ${fpr(mv.v.price)} €/kWh. Nemusíte nič robiť.</p></div><button class="link" data-act="view:group">Skupina zdieľania →</button></div>`}
  if(isShop()){const x=esgStats();h+=`<div class="card cert-home"><span class="pend-ic">${icon('heart')}</span><div><b>${x.ok?'Vaša prevádzka má znak Dobrý sused':'Získajte znak Dobrý sused'}</b><p class="sm mut">${x.ok?`${pct(x.sh)} elektriny zo slnka od susedov a ${fm(x.donKwh,0)} kWh mesačne pre ${x.r.name}. Nálepka s QR kódom privedie do Zdieľne aj vašich zákazníkov.`:`Splňte tri podmienky – slnko od susedov, darovanie cez Lúč pomoci a overené meranie. Teraz ${[x.okE,x.okS,x.okG].filter(Boolean).length} z 3.`}</p></div><button class="link" data-act="view:cert">${x.ok?'Nálepka a profil →':'Ako na to →'}</button></div>`}
  if(per==='anna'){const w=priceWarn();if(w)h+=w}
  /* 6b – Váš deň: súhrn dňa doteraz + prehrávač */
  const first=res.recs.find(r=>!r.kind&&(per==='peter'?r.to==='peter':r.from==='anna'));
  let story;
  if(per==='peter'){const a=sim.peter;
    story=a.recv>.005?`Dnes ste od suseda dostali <b>${fm(a.recv,1)} kWh</b>${a.recvBat>.005?` (z toho ${fm(a.recvBat,1)} kWh večer z batérie)`:''} a ušetrili <b>${eur(a.saved)}</b>. Najlepší čas: ${wtxt}.`
      :`Zatiaľ ste dnes od suseda nič nedostali – ${first?`prvá elektrina zo slnka príde okolo <b>${I2T(first.i)}</b>.`:'dnes sa slnko neukázalo.'}`}
  else{const a=sim.anna;
    story=a.shared+a.batSold>.005?`Dnes ste susedom predali <b>${fm(a.shared+a.batSold,1)} kWh</b> a čisto zarobili <b>${eur(a.net)}</b>.${a.vykup>.005?` Zvyšok ${fm(a.vykup,1)} kWh išiel výkupcovi.`:''}`
      :`Zatiaľ ste dnes nič nepredali – ${first?`prvý predaj čakáme okolo <b>${I2T(first.i)}</b>.`:'dnes bez prebytku.'}`}
  h+=secHead('Váš deň · do '+now,'Čo sa dnes stalo','Prehrajte si deň – graf ukáže krok po kroku, odkiaľ prišla vaša elektrina.');
  h+=`<div class="card day-card"><div><p class="story">${story}</p><div class="hlegend">${per==='peter'?`<span><i style="background:var(--yellow)"></i>slnko na streche suseda</span><span><i style="background:var(--blue)"></i>koľko ste minuli</span><span><i style="background:var(--green)"></i>elektrina od suseda</span>`:`<span><i style="background:var(--yellow)"></i>prebytok vašej strechy</span><span><i style="background:var(--green)"></i>predané susedom</span>`}</div>
    <div class="row" style="margin-top:16px"><button class="btn pri" data-act="player">${icon('play')}Prehrať môj deň</button><button class="link" data-act="rtabgo:rep">Podrobný graf v Prehľadoch →</button></div></div>${daySpark(res,per)}</div>`;
  h+=secHead('Slnečný klub','Malá zmena, lepší výsledok.','Presuňte existujúcu spotrebu do slnečného okna. Body sa pripíšu až po overení podľa merania IMS.');
  const month=per==='peter'?`<div class="card"><div class="xs mut b" style="text-transform:uppercase;letter-spacing:.1em">Tento mesiac · ${d} dní × dnešný profil</div><div class="grid g3" style="margin-top:14px;gap:12px">${big('Prijaté',fm(full.peter.recv*d,1)+' kWh','var(--green)')}${big('Zaplatené',eur(full.peter.paid*d))}${big('Úspora',eur(full.peter.saved*d),'var(--green)')}</div><p class="xs mut" style="margin-top:12px">Ročne približne ${eur0(full.peter.saved*d*12)} úspory. Bez poplatkov navyše.</p></div>`
    :`<div class="card"><div class="xs mut b" style="text-transform:uppercase;letter-spacing:.1em">Tento mesiac · ${d} dní × dnešný profil</div><div class="grid g3" style="margin-top:14px;gap:12px">${big('Ponúknuté',fm(full.anna.offered*d,1)+' kWh')}${big('Predané',fm((full.anna.shared+full.anna.batSold)*d,1)+' kWh','var(--green)')}${big('Čistý príjem',eur(full.anna.net*d),'var(--green)')}</div><p class="xs mut" style="margin-top:12px">Zisk oproti výkupu ${full.anna.vsVykup>=0?'+':''}${eur(full.anna.vsVykup*d)} mesačne · provízia ${BR()} ${eur(full.anna.com*d)}</p></div>`;
  if(per==='anna'){const r=recKey('p','pw'),g=gainKey('p','pw',r);h+=`<div class="grid g2"><div class="card chal">${pill('y','+ '+g.pts+' bodov · dnešná výzva')}<h3>Pračku pustite mimo slnka.</h3><p class="sm">Presuňte pranie (${fm(S.p.pw.kwh,1)} kWh) z <b>${S.p.pw.orig}</b> na <b>${r}</b> a uvoľnite energiu pre skupinu: +${fm(g.kwh,1)} kWh zdieľania, +${eur(g.earn*d)} mesačne.</p><div class="row" style="margin-top:16px">${S.p.pw.accepted?pill('g','✓ Výzva prijatá'):`<button class="btn dark" data-act="acceptx:p.pw">Prijať výzvu</button>`}<button class="link" data-act="view:rewards">Všetky výzvy →</button></div></div>${month}</div>`}
  else h+=`<div class="grid g2"><div class="card chal cons">${pill('y','+ '+gRec.pts+' bodov · dnešná výzva')}<h3>Dnes umývame so slnkom.</h3><p class="sm">Presuňte umývačku z <b>${S.c.appOrig}</b> na <b>${rec}</b>: +${fm(gRec.kwh,1)} kWh zdieľanej elektriny a +${eur(gRec.sav)} úspory. Cieľom je presun, nie vyššia spotreba.</p><div class="row" style="margin-top:16px">${S.c.accepted?pill('g','✓ Výzva prijatá'):`<button class="btn dark" data-act="accept">Prijať výzvu</button>`}<button class="link" data-act="view:rewards">Všetky výzvy →</button></div></div>${month}</div>`;
  if(per==='anna')h+=secHead('Po západe slnka','Energia z batérie pre večer.')+batCard(true);
  return h+'</div>';
}
/* 6c – prehrávač dňa: graf sa dokresľuje, popisy sa objavujú v správnom čase */
function playerModal(){
  const per=S.persona==='anna'?'anna':'peter',res=dayRun(),N=dayNotes(res,per),P=S.pl;
  let cur=-1;N.forEach((n,k)=>{if(n.i<=P.idx)cur=k});
  const c=cur>=0?N[cur]:null,done=P.idx>=PL_HI;
  const leg=per==='peter'?[['var(--yellow)','☀ Žltá – slnko na streche suseda'],['var(--blue)','🔌 Modrá – koľko ste minuli'],['var(--green)','🤝 Zelená – elektrina od suseda'],['var(--purple)','🔋 Fialová – večer z batérie suseda']]
    :[['var(--yellow)','☀ Žltá – prebytok vašej strechy'],['var(--green)','🤝 Zelená – predané susedom'],['var(--purple)','🔋 Fialová – večer z batérie'],['var(--orange)','🏭 Oranžová – zvyšok výkupcovi']];
  return `<div class="modal-bg" data-act="closemodal"><div class="modal player" role="dialog" aria-modal="true" aria-label="Prehrávač dňa">
   <div class="row between"><div><span class="kicker" style="margin-bottom:4px">Prehrať môj deň · ${per==='peter'?'Peter':'Anna'}</span><h2>${per==='peter'?'Odkiaľ dnes prišla vaša elektrina':'Kam dnes išla elektrina z vašej strechy'}</h2></div><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
   <div class="pl-chart" style="margin-top:12px">${storyChart(res,per,{idx:P.idx,est:P.est,notes:N,cur})}</div>
   <div class="hlegend">${leg.map(([c,l])=>`<span><i style="background:${c}"></i>${l}</span>`).join('')}${P.est?'<span>– – odhad</span>':''}</div>
   <div class="pl-cap" aria-live="polite">${c?`<span class="num">${cur+1}</span><p><b>${I2T(c.i)}</b> – ${esc(c.txt)}</p>`:'<p class="mut">Stlačte ▶ a sledujte, čo sa počas dňa deje.</p>'}</div>
   <div class="pl-ctrl"><button class="btn sm pri" data-act="plplay">${P.playing?'⏸ Pauza':done?'↺ Znova':'▶ Prehrať'}</button><button class="btn sm" data-act="plrestart" aria-label="Od začiatku">↺</button>
    <input type="range" min="${PL_LO}" max="${PL_HI}" step="1" value="${P.idx}" data-k="pl.idx" data-t="n" aria-label="Čas v prehrávači"><span class="pl-now">${I2T(P.idx)}</span>
    <span class="seg" role="group" aria-label="Rýchlosť">${[1,2].map(x=>`<button data-act="plspeed:${x}" aria-pressed="${P.speed===x}">${x}×</button>`).join('')}</span>
    <button class="btn sm" data-act="plest" aria-pressed="${P.est}">${P.est?'Skryť odhad':'Zobraziť odhad'}</button></div>
   <ol class="pl-steps">${N.map((n,k)=>`<li class="${n.i<=P.idx?'on':''}"><b>${k+1}</b><span><span class="b">${I2T(n.i)}</span> ${esc(n.txt)}</span></li>`).join('')}</ol>
  </div></div>`;
}
/* karty skupín s obsadenosťou (pôvodný výber skupiny) */
function groupCards(){
  const per=S.persona==='admin'?'peter':S.persona,m=S.mem[per],free=m==='NONE'||m==='MATCH'||m==='READY';
  return `<div class="groups">${GROUPS.map(g=>{const o=gOcc(g),cur=g.id===S.group&&!free,sel=g.id===S.group&&m==='READY';
    const act=cur?pill('g','✓ vaša skupina'):o.full?`<button class="btn sm" disabled>Skupina je plná</button>`:sel?pill('o','žiadosť pripravená'):free?`<button class="btn sm dark" data-act="grpsel:${g.id}">Vybrať skupinu →</button>`:`<button class="btn sm" data-act="grpres:${g.id}">Prestúpiť sem…</button>`;
    return `<article class="gcard ${cur?'cur':''}"><div class="row between"><h3>${g.name}</h3><span class="xs mut b">${REG[g.reg].co}</span></div>
     <p class="xs mut">${g.town} · ${g.tag.toLowerCase()} · úspešnosť ${g.succ} %</p>
     <div><div class="occ"><span>${g.prod} výrobcov · ${g.cons} odberateľov</span><b>${o.n} / ${o.cap}</b></div><div class="bar ${o.p>=.9?'o':''}" style="margin-top:6px"><i style="width:${(o.p*100).toFixed(0)}%"></i></div><div class="xs mut" style="margin-top:4px">${o.full?'Bez voľných miest':'voľné miesta: '+o.free}</div></div>
     <div class="row acts">${act}</div></article>`}).join('')}</div>
   <p class="note">Jedno energetické miesto môže byť aktívne iba v jednej skupine. Prestup do inej skupiny sa aktivuje až po skončení terajšieho členstva (ku koncu nasledujúceho mesiaca).</p>`;
}
function detailModal(id){
  const per=S.persona==='admin'?'peter':S.persona,list=per==='anna'?demandsForAnna():offersForPeter(),o=list.find(x=>x.id===id);if(!o)return '';
  const m=o.m,w=m.win;
  const row=(l,v,wt)=>`<div style="margin:8px 0"><div class="row between sm"><span>${l} <span class="mut">(váha ${wt} %)</span></span><b>${pct(v)}</b></div><div class="bar"><i style="width:${v*100}%"></i></div></div>`;
  const info=`<table style="margin:10px 0 4px"><tbody><tr><td class="mut">${per==='anna'?'Odber':o.eve?'Večerná ponuka z batérie':'Odhadované prebytky'}</td><td class="n">${fm(o.total*S.sim.days,0)} kWh / mesiac</td></tr><tr><td class="mut">Najčastejší čas</td><td class="n">${o.a} – ${o.b}</td></tr><tr><td class="mut">Meranie</td><td class="n">${pill('b','IMS overené')}${o.live?' '+pill('n','živé údaje'):''}</td></tr><tr><td class="mut">Istota odhadu</td><td class="n">${confPill(o.conf)}</td></tr>${per==='peter'?`<tr><td class="mut">Obsadenosť výrobcu</td><td class="n">${o.occ} / ${MAXC} odberateľov</td></tr>`:''}</tbody></table>
   ${per==='peter'&&o.eve?`<p class="xs mut">Oproti cene zo siete (${fpr(S.c.ref)} €) ušetríte ${fpr(S.c.ref-o.price)} €/kWh; vaše večerné maximum je ${fpr(S.c.maxEve)} €/kWh.</p>`:''}${per==='anna'&&o.eve?`<p class="xs mut">Vaša večerná cena ${fpr(S.bat.price)} €/kWh → po provízii ${fpr(netPrice(S.bat.price))} €/kWh.</p>`:''}`;
  return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Detail ponuky"><div class="row between"><div><span class="kicker" style="margin-bottom:4px">Detail ponuky</span><h2>${esc(o.label)}</h2></div><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  ${info}
  <p style="margin:12px 0 6px"><b>Zhoda ${pct(m.total)}:</b> ${per==='anna'?'váš prebytok':'vaša spotreba'} sa najčastejšie prekrýva ${w?`medzi ${I2T(w.a)} a ${I2T(w.b)}`:'minimálne'}. Cena ${fpr(per==='anna'?(o.ask??S.p.price):o.price)} €/kWh (pay-as-offer: výrobca dostane svoju cenu, odberateľ ju vidí vopred).${o.eve?' Energia pochádza z batérie, ktorá sa nabila cez deň.':''}</p>
  ${row('Časový prekryv',m.overlap,50)}${row('Cenová kompatibilita',m.priceS,25)}${row('Spoľahlivosť predikcie',m.rel,15)}${row('Rovnováha skupiny',m.bal,10)}
  <p class="sm mut">Odhadovaný zdieľaný objem: ${fm(m.vol*S.sim.days*.9,0)} – ${fm(m.vol*S.sim.days*1.1,0)} kWh mesačne (odhad, nie garancia).</p>
  <div class="row" style="margin-top:14px"><button class="btn pri" data-act="interest:${o.id}">Mám záujem</button><button class="btn" data-act="closemodal">Zavrieť</button></div></div></div>`;
}
/* ---------- vyhodnotenie skupín: skupiny riadi operátor; výhodnejšia → automatický presun ---------- */
const dateSk=d=>d.toLocaleDateString('sk-SK',{day:'numeric',month:'numeric',year:'numeric'});
const grpVals=(g,isP)=>{const e=grpEst(g,isP);return {kwh:e.k*12,price:e.price,eur:e.m*12}};
/* presun platí od 1. dňa po skončení terajšieho členstva (koniec nasledujúceho mesiaca) */
const grpMoveDate=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth()+2,1)};
function grpMove(per){
  const isP=per==='anna',cur=GROUPS.find(x=>x.id===S.group)||GROUPS[0],cv=grpVals(cur,isP);
  const best=GROUPS.filter(g=>g.id!==cur.id&&!gOcc(g).full).map(g=>({g,v:grpVals(g,isP)})).sort((a,b)=>b.v.eur-a.v.eur)[0];
  return best&&best.v.eur-cv.eur>=1?{...best,gain:best.v.eur-cv.eur,from:grpMoveDate(),cur,cv}:null;
}
const grpBul=(v,isP)=>`<ul class="gx-list"><li><span>${isP?'Predaná zdieľaná energia':'Odobratá zdieľaná energia'}</span><b>${fm(v.kwh,0)} kWh / rok</b></li><li><span>Jednotková cena</span><b>${fpr(v.price)} €/kWh</b></li><li><span>${isP?'Predpokladaný zisk':'Predpokladaná úspora'}</span><b>${eur0(v.eur)} / rok</b></li></ul>`;
const grpHead=(g,extra='')=>`<div class="gx-head"><div><h3>${g.name}</h3><span class="xs mut">ID ${g.code} · ${REG[g.reg].co} · ${g.town}</span></div>${extra}</div>`;
function groupEval(per){
  const isP=per==='anna',cur=GROUPS.find(x=>x.id===S.group)||GROUPS[0],cv=grpVals(cur,isP),mv=grpMove(per);
  let h=`<div class="gx">`;
  h+=`<article class="gx-card cur">${grpHead(cur,pill('g','✓ vaša skupina'))}${grpBul(cv,isP)}</article>`;
  if(mv)h+=`<article class="gx-card move">${grpHead(mv.g,pill('g','+'+eur0(mv.gain)+' ročne'))}<p class="gx-move">Našli sme pre vás výhodnejšiu skupinu. <b>Od ${dateSk(mv.from)} vás do nej presúvame</b> – nemusíte nič robiť. Jednotková cena sa vám v nastaveniach zmení na ${fpr(mv.v.price)} €/kWh.</p>${grpBul(mv.v,isP)}</article>`;
  h+=`</div><p class="note">Odhad z modelového dňa pre vaše odberné miesto, nie garancia. Jedno miesto môže byť aktívne iba v jednej skupine; presun sa uskutoční ku koncu nasledujúceho mesiaca.</p>`;
  /* produkty a služby dodávateľa, ktoré zvýšia úspory zo zdieľania */
  h+=secHead('Produkty a služby','Ušetrite ešte viac.','Doplnky, ktoré zvýšia vaše úspory zo zdieľania. Ponuku a cenu pripraví poradca – nezáväzne.');
  return h+servicesGrid(per);
}
/* ponuka produktov (inšpirované ponukou ZSE/VSE: fotovoltika, batéria, tepelné čerpadlo, nabíjanie elektromobilu); bez cien – ozve sa poradca */
const SVC={
 fve:{ic:'sun',t:'Fotovoltika na strechu',d:'Vlastná výroba – prebytky predáte susedom cez Zdieľňu.',
  b:[['Vlastná elektrina zo strechy.','Cez deň spotrebujete to, čo si sami vyrobíte, a menej kupujete zo siete.'],['Prebytky sa vám viac oplatia.','Čo nespotrebujete, ponúknete susedom za cenu zdieľania – nie za nízku výkupnú cenu.'],['Riešenie na kľúč.','Návrh podľa vašej strechy a spotreby, montáž, pripojenie aj servis.']]},
 bat:{ic:'battery',t:'Batériové úložisko',d:'Uložte poludňajšie slnko na večer, keď je elektrina najdrahšia.',
  b:[['Slnko aj po západe.','Prebytky z obeda uložíte a použijete večer, keď je elektrina najdrahšia.'],['Zarábate aj večer.','Energiu z batérie môžete ponúknuť susedom vo večerných hodinách.'],['Doplnok k vašej fotovoltike.','Kapacitu navrhneme podľa vašej výroby a spotreby.']]},
 pump:{ic:'pump',t:'Tepelné čerpadlo',d:'Kúrenie a ohrev vody z lacnej elektriny v čase prebytkov.',
  b:[['Lacnejšie kúrenie a teplá voda.','Tepelné čerpadlo vyrobí z 1 kWh elektriny niekoľkonásobne viac tepla.'],['Spotreba v čase prebytkov.','Ohrev naplánujete na čas, keď je zdieľaná elektrina najlacnejšia, a zbierate slnečné body.'],['Návrh podľa domu.','Poradca posúdi dom, vykurovanie a spotrebu tepla.']]},
 wall:{ic:'car',t:'Domáci wallbox',d:'Nabíjajte elektromobil vtedy, keď susedia vyrábajú najviac.',
  b:[['Rýchle a bezpečné nabíjanie doma.','Wallbox nabíja rýchlejšie a bezpečnejšie ako bežná zásuvka.'],['Nabíjanie zo slnka susedov.','Nabíjanie naplánujete na čas prebytkov v skupine a ušetríte.'],['Inštalácia a servis.','Postaráme sa o návrh, montáž aj revíziu.']]}};
const svcRec=(per,k)=>{const isP=per==='anna',bat=isP&&S.bat.on;return {fve:!isP,bat:isP&&!bat,pump:isP,wall:false}[k]};
function servicesGrid(per){
  return `<div class="svc-grid">${Object.entries(SVC).map(([k,x])=>{const asked=(S.svcAsked||{})[k];
   return `<article class="svc-card ${svcRec(per,k)?'rec':''}">${svcRec(per,k)?'<span class="pill g svc-rec">Odporúčame</span>':''}<span class="svc-ic">${icon(x.ic)}</span><div class="svc-t"><b>${x.t}</b></div><p class="sm mut">${x.d}</p>
    ${asked?'<span class="pill g">✓ Poradca vás kontaktuje</span>':`<button class="btn" data-act="svc:${k}">Ponuka</button>`}</article>`}).join('')}</div>`;
}
/* okno s obchodnou ponukou – rovnaký vzor ako okno zdieľania z batérie */
function svcModal(k){
  const x=SVC[k];if(!x)return '';const per=S.persona==='admin'?'peter':S.persona,om=S.om[per];
  return `<div class="modal-bg" data-act="closemodal"><div class="modal wz-bm" role="dialog" aria-modal="true" aria-labelledby="svc-h">
   <div class="row between"><span class="svc-ic">${icon(x.ic)}</span><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
   <h2 id="svc-h" style="margin-top:14px">${x.t}</h2>
   <p class="mut">${omLabel(om.type)} · ${esc(om.addr)}</p>
   <ul class="wz-bm-list">${x.b.map(([t,d])=>`<li><b>${t}</b> ${d}</li>`).join('')}</ul>
   <div class="wz-bm-req"><b>Ako to prebieha</b><p class="sm">Poradca ${BR()} vás kontaktuje, prejde s vami vaše potreby a pripraví nezáväznú ponuku s cenou na mieru. Rozhodnutie je len na vás.</p></div>
   <div class="wz-bm-act"><button class="btn" data-act="closemodal">Zatiaľ nie</button><button class="btn pri" data-act="svcok:${k}">Kontaktujte ma</button></div>
  </div></div>`;
}
function vGroup(){
  const per=S.persona==='admin'?'peter':S.persona,m=S.mem[per],g=GROUPS.find(x=>x.id===S.group),o=gOcc(g);
  const ims=per==='anna'?S.p.ims:S.c.ims,res=dayRun(),full=agg(res);
  const lead={NONE:'Zatiaľ nie ste v žiadnej skupine. Vyberte si ju nižšie.',MATCH:'Máte predbežnú zhodu – vyberte skupinu.',READY:'Žiadosť je pripravená na odoslanie.',PENDING:'Žiadosť čaká na kontrolu distribútora a aktiváciu.',ACTIVE:'Zdieľate elektrinu so susedmi v tejto skupine.',ENDING:'Požiadali ste o vystúpenie – zdieľanie pokračuje do konca členstva.'}[m];
  let h=`<div class="gap">`+hero({top:pill(isAct(m)?'g':m==='NONE'?'n':'o',MEM[m])+`<span class="pill n">${REG[g.reg].co} · ${g.town}</span>`,kicker:'Skupina zdieľania',title:m==='NONE'?'Nájdite svoju <em>skupinu.</em>':g.name.replace(/(\S+)$/,'<em>$1.</em>'),sub:m==='NONE'?'':`ID skupiny ${g.code}`,lead,
    extra:`<div style="margin-top:24px">${stepper(m)}</div>`,
    acts:m==='NONE'||m==='MATCH'?`<button class="btn" data-act="view:register">Vybrať skupinu v registrácii →</button>`:m==='READY'?`<button class="btn pri" data-act="submit">Odoslať žiadosť</button>`:m==='ACTIVE'?`<button class="btn ghost" data-act="exit">Požiadať o vystúpenie</button>`:'',
    aside:hstat('Obsadenosť',`${o.n} / ${o.cap}`,`${g.prod} výrobcov · ${g.cons} odberateľov · voľné ${o.free}`)+hstat('Úspešnosť zdieľania',g.succ+' %','tento mesiac')});
  if(m==='READY'&&!ims)h+=`<div class="card" style="border-left:5px solid var(--orange)"><p class="sm">⚠ Bez IMS nie je možné prejsť do aktívneho stavu. Žiadosť môžete odoslať, ale aktivácia bude zablokovaná, kým nebude IMS overený.</p></div>`;
  if(m==='PENDING'){const pa=agg(potRun());h+=`<div class="card"><p>Po potvrdení prebehne kontrola distribútora; zdieľanie sa spustí k 1. dňu nasledujúceho mesiaca. Aktivuje ju operátor (prepnite na „Operátor“).</p><p class="sm mut" style="margin-top:6px">Očakávaný potenciál: ${per==='anna'?`${eur(pa.anna.net*S.sim.days)} čistého príjmu mesačne (po provízii ${BR()})`:`${eur(pa.peter.saved*S.sim.days)} úspory komodity mesačne`} (odhad).</p></div>`}
  if(isAct(m)){
    const succ=full.anna.offered>0?full.anna.shared/full.anna.offered:0;
    h+=`<div class="grid g2"><div class="card"><span class="kicker">Váš profil</span><p class="sm">${per==='anna'?`Výrobca • cena ${fpr(S.p.price)} €/kWh • ${S.p.share} % prebytku • automatická ponuka${S.bat.on?` • 🔋 batéria ${fm(S.bat.cap,1)} kWh, večer ${fpr(S.bat.price)} €/kWh`:''} • vaša úspešnosť dnes ${pct(succ)}`:`Odberateľ • max. cena ${fpr(S.c.max)} €/kWh (večer ${fpr(S.c.maxEve)} €/kWh) • automatické odporúčania zapnuté`}</p></div>
    <div class="card"><span class="kicker">Ako sa energia prideľuje?</span><p class="sm mut">Najprv sa vyhodnotí aktuálny prebytok, spotreba a cenová kompatibilita. Pri nedostatku sa energia rozdelí pomerne medzi kompatibilných odberateľov. Zvyšok prebytku ide postupne do batérie, Lúča pomoci (ak je zapnuté) a nakoniec výkupcovi.</p></div></div>
    ${m==='ENDING'?`<div class="card" style="border-left:5px solid var(--orange)"><b>Žiadosť o výstup odoslaná.</b><p class="sm mut">Výstup nie je okamžitý – členstvo sa končí ku koncu nasledujúceho mesiaca a zdieľanie dovtedy pokračuje.</p>${S.reserve[per]?`<p class="sm" style="margin-top:6px">Uložená budúca rezervácia: <b>${esc(S.reserve[per])}</b> (aktivuje sa až po skončení členstva).</p>`:''}</div>`:''}`;
  }
  {const L=myPlaces(per),inG=L.filter(p=>p.ims&&p.mem!=='NONE').map(p=>p.name);
   h+=secHead('Vaše energetické miesta','Ktoré miesto je v akej skupine.',inG.length?`V skupine ${g.name}: ${inG.join(', ')}. Každé miesto má vlastné členstvo.`:'Zatiaľ nie je v skupine žiadne miesto.')+placesList(per);}
  if(isAct(m))h+=secHead('Vyhodnotenie skupín','Ako ste na tom oproti iným skupinám.','Skupiny zdieľania riadime my – ak sa nájde výhodnejšia, presunieme vás do nej automaticky.')+groupEval(per);
  return h+'</div>';
}
function heat(){
  const days=['Po','Ut','St','Št','Pi'],mul=[1,1.1,.5,1,.8],blocks=[32,40,48,56,64];
  let h=`<div class="heat"><div></div>${[8,10,12,14,16].map(x=>`<div class="mut">${pad(x)}</div>`).join('')}`;
  days.forEach((d,di)=>{const r=runDay(S.c.appTime,{mul:mul[di]});h+=`<div class="mut">${d}</div>`;blocks.forEach(b=>{let off=0,sh=0;for(let i=b;i<b+8;i++)off+=r.R.offer[i];for(const x of r.recs)if(x.from==='anna'&&!x.kind&&x.src!=='bat'&&x.i>=b&&x.i<b+8)sh+=x.kwh;const u=off>0.01?sh/off:0;const c=u>.7?'h3':u>.4?'h2':u>.05?'h1':'h0';h+=`<div class="${c}" title="${fm(u*100,0)} %">${off>0.01?fm(u*100,0)+'%':'–'}</div>`})});
  return h+`</div><div class="legend"><span>▇ vysoké (&gt;70 %)</span><span>▆ stredné (40–70 %)</span><span>▃ nízke</span><span>– bez prebytku</span><span>Ilustračný týždeň s rôznym počasím (po–pi: 100 %, 110 %, 50 %, 100 %, 80 %)</span></div>`;
}
function funnel(rows){const mx=Math.max(...rows.map(r=>r[1]),1);return `<div class="gap" style="margin-top:8px">${rows.map(([l,v,c])=>`<div><div class="row between sm"><span>${l}</span><b>${fm(v,1)} kWh</b></div><div class="bar ${c||''}"><i style="width:${Math.max(0,v/mx*100)}%"></i></div></div>`).join('')}</div>`}
function vReports(){
  const per=S.persona,res=dayRun(),a=agg(res),d=S.sim.days,t=S.rtab;
  const tabs=`<div class="hero-tabs"><span class="seg" role="tablist" aria-label="Prehľady">${[['rep','Mesačný report'],['pred','Predikcia a „Čo ak“'],['led','Ledger'],['inv','Vyúčtovanie']].map(([k,l])=>`<button role="tab" data-act="rtab:${k}" aria-pressed="${t===k}">${l}</button>`).join('')}</span></div>`;
  const mon=new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'});
  let h=`<div class="gap">`+hero({cls:'compact',kicker:'Prehľady · '+mon,title:'Každá kWh. <em>Každé euro.</em>',extra:tabs});
  if(t==='inv')return h+(per==='admin'?invoiceHtml('peter')+invoiceHtml('anna'):invoiceHtml(per))+'</div>';
  if(t==='rep'){
    if((per==='anna'||per==='admin')&&S.don.on)h+=solReportCard();
    {const P=res.P,w=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));h+=`<div class="card"><span class="kicker">Technický graf dňa</span><h3>Výroba, spotreba a zdieľanie po 15 minútach</h3><p class="xs mut" style="margin-top:4px">Plné čiary = meranie, prerušované = odhad. Jednoduchšiu verziu s popismi nájdete na Domove („Prehrať môj deň“).</p><div style="margin-top:10px">${chart(res,{idx:96,win:w,who:per==='admin'?null:per})}</div></div>`}
    if(per==='anna'||per==='admin'){
      const A=a.anna,off=A.offered*d,shr=A.shared*d,succ=off>0?shr/off:0;
      const prod=off/Math.max(.05,1-S.p.own/100),direct=prod-off;
      const dayG=A.dayEarn*d,batG=A.batEarn*d,com=A.com*d,net=A.net*d,bb=A.buyback*d,own=A.batOwnVal*d,tot=net+bb+own,onlyV=off*S.p.feedin,vs=A.vsVykup*d;
      const extra=(A.bank+A.don+A.gift)*d;
      h+=`<div class="card"><h2>Výrobca – ${new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'})}</h2><div class="grid g4" style="margin-top:12px">${kpi('Predané (deň + večer)',fm(shr+A.batSold*d,1)+' kWh')}${kpi('Čistý príjem',eur(net),'po provízii '+BR())}${kpi('Zisk oproti výkupu',(vs>=0?'+':'')+eur(vs),'zdieľanie + batéria')}${kpi('Úspešnosť zdieľania',pct(succ),'cez deň')}</div></div>
      <div class="card"><h3>Rozpis príjmu</h3><table style="margin-top:6px"><tbody>
       <tr><td>Tržba z dennej ponuky (${fm(shr,1)} kWh × ${fpr(A.shared>0?A.dayEarn/A.shared:S.p.price)} €/kWh)</td><td class="n">${eur(dayG)}</td></tr>
       ${S.bat.on?`<tr><td>🔋 Tržba z večernej ponuky z batérie (${fm(A.batSold*d,1)} kWh × ${fpr(S.bat.price)} €/kWh)</td><td class="n">${eur(batG)}</td></tr>`:''}
       <tr><td>− Provízia ${BR()} (${feeTxt()}, iba z predanej energie)</td><td class="n" style="color:var(--brand-ink)">−${eur(com)}</td></tr>
       <tr style="font-weight:700"><td>= Výplata za zdieľanie</td><td class="n">${eur(net)}</td></tr>
       ${own>0?`<tr><td>+ Vlastná večerná spotreba z batérie (${fm(A.batOwn*d,1)} kWh × ${fpr(S.c.ref)} €/kWh)</td><td class="n">${eur(own)}</td></tr>`:''}
       <tr><td>+ Zvyšných ${fm(A.vykup*d,1)} kWh predaných výkupcovi (${fpr(S.p.feedin)} €/kWh, odhad)</td><td class="n">${eur(bb)}</td></tr>
       ${A.don>0?`<tr><td class="mut">🤝 Darované cez Lúč pomoci: ${fm(A.don*d,1)} kWh (0 € platba, 0 € provízia)</td><td class="n mut">0,00 €</td></tr>`:''}
       <tr style="font-weight:700"><td>= Celkový príjem so zdieľaním</td><td class="n">${eur(tot)}</td></tr>
       <tr><td class="mut">Bez zdieľania (všetko výkupcovi: ${fm(off,1)} kWh × ${fpr(S.p.feedin)} €/kWh)</td><td class="n mut">${eur(onlyV)}</td></tr>
       <tr style="font-weight:700"><td>Zisk oproti výkupu = predané kWh × (cena − provízia − výkupná cena)${S.bat.on?' + zisk z batérie':''}</td><td class="n" style="color:${vs>=0?'var(--green)':'var(--red)'}">${vs>=0?'+':''}${eur(vs)}</td></tr></tbody></table>
       ${extra>0?`<p class="xs mut" style="margin-top:6px">Darovaná energia nie je v zisku započítaná – výkupca by za ňu dal ${eur(extra*S.p.feedin)}.</p>`:''}
       ${net<0?`<div class="pill r" style="margin-top:8px">⚠ Výplata je záporná – rozdiel sa doplatí inkasom</div>`:''}${priceWarn()}${batWarnHtml()}</div>
      <div class="card"><h3>Energetický lievik (mesiac)</h3>${funnel([['Vyrobené',prod],['Spotrebované priamo',direct,'b'],['Dostupný prebytok (ponúknutý)',off,'y'],['Predané cez deň skupine',shr],...(S.bat.on?[['Uložené do batérie',A.batCh*d,'p'],['Predané večer z batérie',A.batSold*d,'p']]:[]),...(A.don>0?[['Lúč pomoci',A.don*d]]:[]),['Výkupca',A.vykup*d,'o']])}</div>`;
    }
    if(per==='peter'||per==='admin'){
      const rec=a.peter.recv*d,cons=a.peter.cons*d;
      h+=`<div class="card"><h2>Odberateľ – ${new Date().toLocaleDateString('sk-SK',{month:'long',year:'numeric'})}</h2><div class="grid g4" style="margin-top:12px">${kpi('Prijaté',fm(rec,1)+' kWh',a.peter.recvBat>0?`z toho večer z batérie ${fm(a.peter.recvBat*d,1)} kWh`:'')}${kpi('Zaplatené',eur(a.peter.paid*d))}${kpi('Priemerná cena',fpr(rec>0?a.peter.paid/a.peter.recv:0)+' €/kWh')}${kpi('Úspora komodity',eur(a.peter.saved*d),'prijaté kWh × ('+fpr(S.c.ref)+' − cena zdieľania)')}</div><p class="xs mut" style="margin-top:8px">Odberateľ neplatí žiadnu províziu ani poplatok za službu – platíte iba cenu komodity za zdieľanú elektrinu.</p></div>
      <div class="card"><h3>Energetický lievik</h3>${funnel([['Celková spotreba',cons,'b'],['Prijaté zo zdieľania',rec],['Ostatná dodávka',cons-rec,'o']])}</div>`;
    }
    h+=settleCard();
    h+=`<div class="card"><h3>Denná heatmapa využitia prebytkov</h3>${heat()}</div>`;
  }
  if(t==='pred'){
    const fr=potRun(),fa=agg(fr),g=gainFor(S.c.appTime),P=fr.P,win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),u=UNC[S.p.conf]||.2;
    const ms=matchScore(P.fp,S.p.price,P.fc,S.c.max,S.c.ref,S.p.conf);
    h+=`<div class="card"><h2>Zajtra – odhad</h2>${chart(fr,{forecast:true,band:true,win})}<div class="row" style="margin-top:8px;gap:20px"><div><div class="xs mut">Odhadovaný potenciál</div><div class="b" style="font-size:19px">${fm(fa.peter.recv*(1-u),1)} – ${fm(fa.peter.recv*(1+u),1)} kWh</div></div><div><div class="xs mut">Najlepší interval</div><div class="b" style="font-size:19px">${win?I2T(win.a)+' – '+I2T(win.b):'—'}</div></div><div><div class="xs mut">Zhoda Anna ↔ Peter</div><div class="b" style="font-size:19px">${pct(ms.total)}</div></div>${S.bat.on?`<div><div class="xs mut">Večer z batérie</div><div class="b" style="font-size:19px">${fm(fa.anna.batSold,1)} kWh</div></div>`:''}<div>${confPill(S.p.conf)}</div></div><p class="xs mut" style="margin-top:6px">Odhad nie je garantovaný výsledok. Pásmo ukazuje možné rozpätie podľa istoty predikcie.</p></div>
    <div class="card"><h2>„Čo ak“ simulátor</h2><p class="sm mut">Posuňte čas spotrebiča a sledujte prepočet.</p><div class="fields" style="margin:10px 0">${F('Spotrebič: umývačka – pôvodný čas','c.appOrig',{t:'t'})}${F('Navrhovaný čas','c.appTime',{t:'t'})}${F('Spotreba spotrebiča','c.appKwh',{step:.1,u:'kWh'})}</div>
    <div class="grid g3"><div class="card kpi"><div class="l">Využitá zdieľaná energia</div><div class="v upd" style="color:var(--green)">${g.kwh>=0?'+':''}${fm(g.kwh,2)} kWh</div></div><div class="card kpi"><div class="l">Úspora komodity</div><div class="v upd">${g.sav>=0?'+':''}${fm(g.sav,2)} €</div></div><div class="card kpi"><div class="l">Slnečné body</div><div class="v upd">+${g.pts}</div></div></div><p class="xs mut" style="margin-top:8px">Pôvodne ${S.c.appOrig} → navrhované ${S.c.appTime}. Body sú denne limitované (max. ${S.pts.cap}).</p></div>`;
  }
  if(t==='led'){
    h+=intervalCard(res,per);
    const who=per==='anna'?'anna':per==='peter'?'peter':null,rows=res.recs.filter(r=>r.i<S.sim.idx&&(!who||r.from===who||r.to===who)),ft=per!=='peter';
    const typ=r=>r.kind==='don'?pill('g','dar'):r.kind==='gift'?pill('y','darček'):r.src==='bat'?pill('p','🔋 batéria'):r.deal?pill('b','🤖 dohoda'):'';
    h+=`<div class="card"><div class="row between"><h2>Detailný ledger – ${new Date().toLocaleDateString('sk-SK')}</h2><button class="btn sm" data-act="csv">⬇ Export CSV</button></div><p class="sm mut">Zobrazené intervaly do ${I2T(S.sim.idx)}. Každá suma je vysvetliteľná cez konkrétne 15-minútové alokácie.</p><div class="tw" style="margin-top:8px"><table><thead><tr><th>Dátum</th><th>Interval</th><th>Výrobca → odberateľ</th><th>Typ</th><th class="n">Množstvo</th><th class="n">Cena</th><th class="n">Suma</th>${ft?`<th class="n">Provízia ${BR()}</th>`:''}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td>${new Date().toLocaleDateString('sk-SK',{day:'numeric',month:'numeric'})}</td><td>${I2T(r.i)}–${I2T(r.i+1)}</td><td>${nm(r.from)} → ${nm(r.to)}</td><td>${typ(r)}</td><td class="n">${fm(r.kwh,2)} kWh</td><td class="n">${fpr(r.price)} €</td><td class="n">${fm(r.amt,2)} €</td>${ft?`<td class="n">${fm(r.com,3)} €</td>`:''}</tr>`).join(''):`<tr><td colspan="${ft?8:7}" class="mut">Zatiaľ žiadne alokácie. Prehrajte priebeh dňa.</td></tr>`}</tbody></table></div><div class="pill ${Math.abs(a.debT-a.netT-a.comT)<1e-9?'g':'r'}" style="margin-top:10px">✓ Audit: platby odberateľov ${fm(a.debT,4)} € = výplata výrobcom ${fm(a.netT,4)} € + provízia ${BR()} ${fm(a.comT,4)} €</div></div>`;
  }
  return h+'</div>';
}
function chRowG(owner,key,title,opts={}){
  const o=A_(owner,key),r=recKey(owner,key),g=gainKey(owner,key,r),reached=S.sim.idx>=T2I(o.time)+2;
  let st;
  if(!o.accepted)st=`<button class="btn sm pri" data-act="${opts.act||('acceptx:'+owner+'.'+key)}">Prijať výzvu</button>`;
  else{const v=verifyLoad(owner,key);
    st=(!reached?pill('o','● prijaté na '+o.time+' – čaká na meranie'):v.ok?pill('g','✓ splnené · overené podľa IMS'):pill('r','⚠ neoverené podľa IMS'))+` <button class="btn sm" data-act="ver:${owner}.${key}">Kontrola</button>`}
  const val=owner==='p'?`+${fm(g.kwh,2)} kWh viac pre skupinu · +${fm(g.earn*S.sim.days,2)} €/mesiac`:`+${fm(g.kwh,2)} kWh zdieľanej energie · +${fm(g.sav*S.sim.days,2)} €/mesiac`;
  return `<div class="row between" style="padding:10px 0;border-bottom:1px solid var(--line)"><div style="min-width:0"><b>${title(r)}</b><div class="xs mut">${val} · +${g.pts} bodov (z ${o.orig})</div></div><div class="row" style="justify-content:flex-end">${st}</div></div>`;
}
function lockedRow(title,fu){
  return `<div class="row between" style="padding:10px;border-bottom:1px solid var(--line);background:var(--bg);border-radius:10px"><div><b>🔒 ${title}</b><div class="xs mut">Nová výzva – zapojiť sa môžete až po polnoci (od dňa ${fu.from+1}). V ukážke dokončite deň a stlačte „🌙 Nový deň“.</div></div>${pill('o','🔒 po polnoci')}</div>`;
}
function goalCard(){
  const a=agg(dayRun()),succ=a.anna.offered>0?a.anna.shared/a.anna.offered:0,goal=.8,miss=Math.max(0,(goal*a.anna.offered-a.anna.shared)*S.sim.days);
  return `<div class="card"><h3>Skupinový cieľ</h3><p class="sm">Slnečný kruh 17 využil tento mesiac <b>${pct(succ)}</b> dostupných prebytkov (cieľ ${pct(goal)}). ${miss>0?`Do cieľa chýba ${fm(miss,0)} kWh.`:'Cieľ je splnený. 🎉'}</p><div class="bar" style="margin-top:8px"><i style="width:${Math.min(100,succ/goal*100)}%"></i></div><p class="xs mut" style="margin-top:6px">Spoločný cieľ bez verejného rebríčka jednotlivcov.</p></div>`;
}
function antiCheatCard(){
  return `<div class="card" style="border-left:5px solid var(--blue)"><h3>🛡 Ako overujeme výzvy</h3><p class="sm mut" style="margin-top:4px">Body získate až po overení. Po prijatí výzvy porovnáme 15-minútové merania IMS za posledný týždeň: v deklarovanom čase musí vzrásť spotreba zodpovedajúca spotrebiču a v pôvodnom čase musí zmiznúť. Ak merania nezodpovedajú, výzva sa označí ako neoverená a body sa nepripíšu.</p></div>`;
}
const dayChip=()=>`<span class="pill n">Deň ${S.day}</span>`;
/* body a séria návštev – v Odmenách iba na jednom mieste (hero) */
function ptsStats(tot,lvl,next){
  const v=S.visit[S.persona]||{streak:0};
  return hstat('Body · úroveň '+lvl,String(tot),`<span class="bar y" style="display:block;margin:6px 0 4px;height:6px"><i style="width:${((500-next)/5).toFixed(0)}%"></i></span>do ďalšej úrovne ${next} b`)
    +hstat('Séria návštev','☀ '+(v.streak||0)+' '+((v.streak||0)===1?'deň':(v.streak||0)<5&&(v.streak||0)>0?'dni':'dní'),'každý deň v rade = viac bodov');
}
/* úloha 11 – ukážka mesačného vyúčtovania; „Stiahnuť PDF“ = tlač prehliadača (Uložiť ako PDF) */
function invoiceHtml(who){
  const res=dayRun(),a=agg(res),d=S.sim.days,om=S.om[who],name=SSO[who].name,now=new Date(),y=now.getFullYear(),m=now.getMonth();
  const last=new Date(y,m+1,0).getDate(),mon=now.toLocaleDateString('sk-SK',{month:'long',year:'numeric'}),issue=new Date(y,m+1,who==='peter'?10:20).toLocaleDateString('sk-SK');
  const no=`ZD-${y}${pad(m+1)}-${who==='peter'?'0042':'0017'}`,row=(l,q,p,v,c='')=>`<tr${c?` class="${c}"`:''}><td>${l}</td><td class="n">${q}</td><td class="n">${p}</td><td class="n">${v}</td></tr>`;
  let body,save='';
  if(who==='peter'){
    const P=a.peter,bk=P.recvBat*d,dk=(P.recv-P.recvBat)*d,bp=P.recvBat*S.bat.price*d,dp=P.paid*d-bp;
    body=row('Zdieľaná elektrina cez deň',fm(dk,1)+' kWh',dk>0?fpr(dp/dk)+' €':'—',eur(dp))+(bk>0?row('Zdieľaná elektrina večer z batérie suseda',fm(bk,1)+' kWh',fpr(S.bat.price)+' €',eur(bp)):'')+row('Poplatok za službu Zdieľňa','—','—','0,00 €')+row('Spolu na úhradu (inkaso)','','',eur(P.paid*d),'inv-total');
    save=`<div class="inv-save">Rovnaké množstvo zo siete by stálo ${eur(P.recv*d*S.c.ref)} (${fpr(S.c.ref)} €/kWh) – ušetrili ste <b>${eur(P.saved*d)}</b>.</div>`;
  }else{
    const A=a.anna;
    body=row('Predaj susedom cez deň',fm(A.shared*d,1)+' kWh',A.shared>0?fpr(A.dayEarn/A.shared)+' €':'—',eur(A.dayEarn*d))+(A.batSold>0?row('Predaj večer z batérie',fm(A.batSold*d,1)+' kWh',fpr(S.bat.price)+' €',eur(A.batEarn*d)):'')+row(`Provízia ${BR()} (${feeTxt()})`,'','','−'+eur(A.com*d))+row('Výplata na váš účet','','',eur(A.net*d),'inv-total');
    save=`<div class="inv-save">Oproti predaju všetkého výkupcovi ste zarobili navyše <b>${A.vsVykup>=0?'+':''}${eur(A.vsVykup*d)}</b>. Zvyšných ${fm(A.vykup*d,1)} kWh vyplatí výkupca samostatne (${fpr(S.p.feedin)} €/kWh).</div>`;
  }
  return `<div class="inv-wrap"><div class="row between no-print" style="margin-bottom:12px"><p class="sm mut">${who==='peter'?'Vyúčtovanie odberateľa – Peter':'Výpis výrobcu – Anna'} · v okne tlače zvoľte „Uložiť ako PDF“.</p><button class="btn pri sm" data-act="print">${icon('print')}Stiahnuť PDF</button></div>
   <article class="invoice"><span class="inv-stamp">Ukážka – nejde o daňový doklad</span>
    <div class="inv-head"><div><img src="${LOGOS[S.skin]}" alt="${BR()}"><div class="xs mut" style="margin-top:8px">Zdieľňa<span class="sig">.</span> · zdieľanie elektriny · služba ${BR()}</div></div><div style="text-align:right"><span class="kicker" style="margin:0">${who==='peter'?'Vyúčtovanie odberateľa':'Výpis vyúčtovania výrobcu'}</span><h2>${no}</h2><div class="sm mut">vystavené ${issue}</div></div></div>
    <div class="inv-meta"><div><span>Zákazník</span>${esc(name)}<br>${esc(om.addr)}</div><div><span>Odberné miesto</span>${omLabel(om.type)} · ${esc(om.id)}<br>skupina ${gname(S.group)}</div><div><span>Obdobie</span>1. – ${last}. ${mon}<br>${d} dní × dnešný profil</div></div>
    <table><thead><tr><th>Položka</th><th class="n">Množstvo</th><th class="n">Cena</th><th class="n">Suma</th></tr></thead><tbody>${body}</tbody></table>${save}
    <p class="inv-note">${who==='peter'?`Ostatná spotreba (${fm((a.peter.cons-a.peter.recv)*d,0)} kWh) a distribučné, regulované a fixné poplatky sa účtujú na vašej bežnej faktúre za elektrinu ako doteraz. Úhrada inkasom do 10. dňa nasledujúceho mesiaca.`:`Provízia sa účtuje iba z predanej energie. Výplata do 20. dňa nasledujúceho mesiaca; ak by provízia prevýšila tržbu, rozdiel sa strhne inkasom.`} Sumy sú súčtom 15-minútových alokácií (Prehľady → Ledger).</p>
   </article></div>`;
}
/* Výzvy – samostatná položka menu (pôvodne záložka Odmien); iWatt odmeny majú záložky iWatt, Odznaky, Certifikát */
let CH_MODE=false;
function vChallenges(){const t=S.rwtab;CH_MODE=true;S.rwtab=S.chtab==='bdg'?'bdg':'ch';try{return vRewards()}finally{CH_MODE=false;S.rwtab=t}}
/* certifikát prevádzky – samostatná položka menu (iba prevádzka) */
const vCertView=()=>vGoodNeighbour();
function vRewards(){
  if(!CH_MODE)return vIwatt();
  if(S.persona==='anna')return vRewardsAnna();
  if(S.rwtab==='bdg')return `<div class="gap">${hero({kicker:'Slnečný klub',title:'Odznaky, ktoré <em>si zaslúžite.</em>',lead:'Udeľujú sa až po overení podľa merania IMS – nikdy za vyššiu spotrebu.',extra:`<div class="hero-tabs">${rewardTabs()}</div>`})}${vBadges('peter')}</div>`;
  const P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));
  const earned=earnedToday('peter'),tot=S.pts.base+earned,lvl=Math.floor(tot/500)+1,next=500-tot%500;
  const res=dayRun(),surplus=win?sum(P.fp.slice(win.a,win.b)):0;
  const fu=S.fu.peter,fuShown=fu&&fu.shown,fuOpen=fu&&S.day>fu.from;
  const mx=Math.max(0,...Array.from({length:96},(_,i)=>{const d=res.A.c[i],r=sum(res.recs.filter(x=>x.i===i&&x.to==='peter').map(x=>x.kwh));return d>0?r/d:0}));
  return `<div class="gap">${hero({kicker:'Slnečný klub · dnešné slnečné okno',title:`${win?I2T(win.a)+' – '+I2T(win.b):'—'} <em>perieme so slnkom.</em>`,lead:`V skupine očakávame prebytok ${fm(surplus+(S.sim.others?surplus*.6:0),1)} kWh. Presuňte flexibilnú spotrebu do tohto času – body sa neudeľujú za vyššiu spotrebu.`,extra:`<div class="hero-tabs">${rewardTabs()}</div>`,aside:ptsStats(tot,lvl,next)})}
  <div class="grid g2 at"><div class="card"><h3>Denné výzvy – Peter</h3><div style="margin-top:4px">
   ${chRowG('c','wash',r=>`Spustite umývačku o ${r}`,{act:'accept'})}
   ${chRowG('c','ev',r=>`Nabite vozidlo (${fm(S.c.ev.kwh,1)} kWh) o ${r}`)}
   ${chRowG('c','wh',r=>`Presuňte ohrev vody na ${r}`)}
   <div class="row between" style="padding:10px 0;${fuShown?'border-bottom:1px solid var(--line)':''}"><div><b>Aspoň 60 % spotreby zo zdieľania v jednom intervale</b><div class="xs mut">+30 bodov</div></div>${mx>=.6?pill('g','✓ splnené ('+pct(mx)+')'):pill('o','zatiaľ '+pct(mx))}</div>
   ${fuShown?(fuOpen?chRowG('c','ice',r=>`Výrobník ľadu: presuňte cyklus (${fm(S.c.ice.kwh,1)} kWh) na ${r}`):lockedRow('Nová výzva: výrobník ľadu do slnečného okna',fu)):''}
  </div><p class="xs mut" style="margin-top:10px">Dnes získané z výziev (overené): <b>+${earned} b</b> · denný limit ${S.pts.cap} b</p></div>
  <div class="card"><h3>Moje odznaky</h3><p class="xs mut" style="margin-top:4px">Posledné získané – kliknite pre detail.</p>${bdgMini('peter')}</div></div>
  ${goalCard()}${antiCheatCard()}</div>`;
}
function vRewardsAnna(){
  if(S.rwtab==='bdg')return `<div class="gap">${hero({kicker:'Slnečný klub',title:'Odznaky, ktoré <em>si zaslúžite.</em>',lead:'Udeľujú sa až po overení podľa merania IMS – nikdy za vyššiu spotrebu.',extra:`<div class="hero-tabs">${rewardTabs()}</div>`})}${vBadges('anna')}</div>`;
  const P=profiles(S.c.appTime),win=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),st=annaStats(),d=S.sim.days;
  const earned=earnedToday('anna'),tot=S.pts.baseA+earned,lvl=Math.floor(tot/500)+1,next=500-tot%500;
  const demand=win?sum(P.fc.slice(win.a,win.b)):0;
  const fu=S.fu.anna,fuShown=fu&&fu.shown,fuOpen=fu&&S.day>fu.from;
  let extra=0;for(const k of ['pw','pb']){if(!S.p[k].accepted){const g=gainKey('p',k,recKey('p',k));extra+=Math.max(0,g.earn)*d}}
  const cfg=(title,sub,ok,now,pts,btn)=>`<div class="row between" style="padding:10px 0;border-bottom:1px solid var(--line)"><div style="min-width:0"><b>${title}</b><div class="xs mut">${sub} · +${pts} bodov</div></div><div class="row" style="justify-content:flex-end">${ok?pill('g','✓ splnené'):pill('o',now)}${!ok&&btn?btn:''}</div></div>`;
  return `<div class="gap">${hero({kicker:'Slnečný klub · okno pre výrobcu',title:`${win?I2T(win.a)+' – '+I2T(win.b):'—'} <em>susedia potrebujú slnko.</em>`,lead:`V tomto okne skupina potrebuje približne ${fm(demand,1)} kWh. Čím viac prebytku v ňom uvoľníte, tým viac zarobíte${extra>0.005?` – splnením výziev až <b>+${eur(extra)} mesačne</b> navyše`:''}.`,extra:`<div class="hero-tabs">${rewardTabs()}</div>`,aside:ptsStats(tot,lvl,next)})}
  <div class="grid g2 at"><div class="card"><h3>Denné výzvy – Anna (výrobca)</h3><div style="margin-top:4px">
   ${chRowG('p','pw',r=>`Presuňte pračku (${fm(S.p.pw.kwh,1)} kWh) mimo slnka na ${r}`)}
   ${chRowG('p','pb',r=>`Presuňte ohrev bojlera (${fm(S.p.pb.kwh,1)} kWh) na ${r}`)}
   ${cfg('Zapnite automatické obnovovanie ponuky','Ponuka sa každý deň obnoví sama – nepremeškáte slnečné dni',S.p.auto,'vypnuté',20,`<button class="btn sm" data-act="setauto">Zapnúť</button>`)}
   ${cfg('Presná predikcia výroby (odchýlka ≤ 10 %)','Spoľahlivý výrobca získa vyššiu zhodu',st.err<=0.10,'teraz '+fm(st.err*100,1)+' %',25)}
   ${cfg('Využite aspoň 75 % ponúknutého prebytku','Vyhodnotí sa na konci dňa',st.succ>=0.75&&S.sim.idx>=96,S.sim.idx<96?'vyhodnotí sa o 24:00':'zatiaľ '+pct(st.succ),30)}
   ${fuShown?(fuOpen?chRowG('p','pev',r=>`Elektromobil: nabíjajte (${fm(S.p.pev.kwh,1)} kWh) až o ${r}`):lockedRow('Nová výzva: nabíjanie elektromobilu mimo slnečného okna',fu)):''}
  </div><p class="xs mut" style="margin-top:10px">Dnes získané z výziev (overené): <b>+${earned} b</b> · denný limit ${S.pts.cap} b</p></div>
  <div class="card"><h3>Moje odznaky</h3><p class="xs mut" style="margin-top:4px">Posledné získané – kliknite pre detail.</p>${bdgMini('anna')}</div></div>
  ${goalCard()}${antiCheatCard()}</div>`;
}
function verModal(id){
  const [ow,k]=id.split('.'),o=A_(ow,k),who=ow==='p'?'Anna':'Peter';
  if(!o.accepted)return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Kontrola podľa IMS"><div class="row between"><h2>Kontrola podľa IMS</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div><p class="sm mut" style="margin:8px 0">Výzva ešte nebola prijatá.</p><button class="btn" data-act="closemodal">Zavrieť</button></div></div>`;
  const v=verifyLoad(ow,k),reached=S.sim.idx>=T2I(o.time)+2;
  return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Kontrola podľa IMS"><div class="row between"><h2>Kontrola – ${who}: ${o.label}</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <p class="sm" style="margin:8px 0">Deklarovaný presun: <b>${o.orig} → ${o.time}</b> (${fm(o.kwh,1)} kWh). Porovnávame 15-minútové merania IMS s týždenným profilom spotreby.</p>
  <div class="tw" style="max-height:280px"><table><thead><tr><th>Deň</th><th class="n">Nárast v pôvodnom čase (${o.orig})</th><th class="n">Nárast v deklarovanom čase (${o.time})</th></tr></thead><tbody>${v.rows.map(r=>`<tr ${r.today?'style="font-weight:700"':''}><td>${r.d}</td><td class="n">${r.old>=0?'+':''}${fm(r.old,2)} kWh</td><td class="n">${r.nw>=0?'+':''}${fm(r.nw,2)} kWh</td></tr>`).join('')}</tbody></table></div>
  <p class="xs mut" style="margin-top:8px">Pravidlo: v deklarovanom čase musí byť nárast aspoň ${fm(0.6*o.kwh,2)} kWh a v pôvodnom čase najviac ${fm(0.4*o.kwh,2)} kWh.</p>
  <div style="margin:10px 0">${v.ok?pill('g','✓ Overené – spotreba zodpovedá deklarovanému času'):pill('r','⚠ Neoverené – '+(!v.okNew?'v deklarovanom čase sa spotreba spotrebiča neobjavila':'spotrebič stále beží v pôvodnom čase')+'; body sa nepripíšu')}${reached?'':' '+pill('o','meranie sa dokončí o '+I2T(T2I(o.time)+2))}</div>
  <button class="btn" data-act="closemodal">Zavrieť</button></div></div>`;
}
function exitModal(){
  const opts=GROUPS.filter(g=>g.id!==S.group),sel=S.exitSel||'';
  const opt=(id,name,body,dis)=>`<label class="gopt ${dis?'full':''}"><input type="radio" name="exitRes" value="${id}" ${sel===id?'checked':''} ${dis?'disabled':''}><span class="grow"><b>${name}</b>${body}</span></label>`;
  return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Žiadosť o vystúpenie"><div class="row between"><h2>Požiadať o vystúpenie?</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <p style="margin:10px 0"><b>Výstup nie je okamžitý.</b> Vaše zdieľanie pokračuje až do ukončenia členstva – ku koncu nasledujúceho mesiaca. Počas čakania nemôžete byť aktivovaný v inej skupine.</p>
  <span class="kicker" style="margin-top:16px">Budúca rezervácia (voliteľné)</span>
  <div class="gap" style="margin-top:8px">${opt('','Bez rezervácie','',false)}${opts.map(g=>{const o=gOcc(g);return opt(g.id,g.name,`<span class="row between xs mut" style="margin-top:4px"><span>${REG[g.reg].co} · ${g.town}</span><span><b style="color:var(--ink)">${o.n} / ${o.cap}</b> členov · ${o.full?'plná':'voľné '+o.free}</span></span><span class="bar ${o.p>=.9?'o':''}" style="display:block;margin-top:6px;height:7px"><i style="width:${(o.p*100).toFixed(0)}%"></i></span>`,o.full)}).join('')}</div>
  <p class="xs mut" style="margin-top:8px">Rezervácia sa aktivuje až po skončení terajšieho členstva.</p>
  <div class="row" style="margin-top:16px"><button class="btn pri" data-act="exitok">Potvrdiť výstup</button><button class="btn" data-act="closemodal">Zrušiť</button></div></div></div>`;
}
function cmpModal(){
  const L=offersForPeter().filter(o=>S.cmp.includes(o.id));
  if(L.length<2)return `<div class="modal-bg" data-act="closemodal"><div class="modal" role="dialog" aria-modal="true" aria-label="Porovnanie ponúk"><div class="row between"><h2>Porovnanie ponúk</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div><p class="sm mut" style="margin:8px 0">Vyberte aspoň 2 ponuky.</p><button class="btn" data-act="closemodal">Zavrieť</button></div></div>`;
  const best=[...L].sort((a,b)=>b.m.total-a.m.total)[0];
  const row=(l,f)=>`<tr><td class="mut">${l}</td>${L.map(o=>`<td>${f(o)}</td>`).join('')}</tr>`;
  return `<div class="modal-bg" data-act="closemodal"><div class="modal wide" role="dialog" aria-modal="true" aria-label="Porovnanie ponúk"><div class="row between"><h2>Porovnanie ponúk</h2><button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div>
  <div class="tw" style="margin-top:8px;max-height:none"><table><thead><tr><th></th>${L.map(o=>`<th style="white-space:normal;min-width:150px">${esc(o.label)}${o===best?'<br>'+pill('g','najlepšia zhoda'):''}</th>`).join('')}</tr></thead><tbody>
  ${row('Cena (€/kWh)',o=>`<b>${fpr(o.price)}</b>${o.eve?' 🔋':''}`)}${row('Zhoda s profilom',o=>pct(o.m.total))}${row('Najčastejší čas',o=>o.a+' – '+o.b)}${row('Obsadenosť',o=>o.occ+' / '+MAXC)}${row('Istota odhadu',o=>o.conf)}${row('Odhad objemu / mes.',o=>fm(o.m.vol*S.sim.days,0)+' kWh')}${row('Odhad úspory / mes.',o=>eur(o.m.ok?o.m.vol*S.sim.days*(S.c.ref-o.price):0))}${row('Cena prípustná',o=>o.m.ok?pill('g','✓ áno'):pill('r','✕ nie'))}</tbody></table></div>
  <p class="xs mut" style="margin-top:8px">Odhady, nie garancia. Cenovo nekompatibilné ponuky majú úsporu 0 €. Zobrazené sú iba sumy za komoditu.</p>
  <div class="row" style="margin-top:12px"><button class="btn" data-act="closemodal">Zavrieť</button></div></div></div>`;
}
/* ---------- energetické miesta (OM) – spoločné pre Nastavenia aj Skupinu zdieľania ----------
   Každé miesto má vlastné členstvo: hlavné OM je v skupine, chata čaká na inteligentné meranie. */
const OM_EIC={anna:'24ZZS0000000001A',peter:'24ZZS0000000002B',chata:'24ZZS0000000012L'};
const omName=t=>({om_house:'Rodinný dom',om_shop:'Bistro'})[omKind(t)]||omLabel(t);
const omIcon=t=>omKind(t);   /* rovnaké ikony typov ako v registrácii */
function myPlaces(pp){
  const om=S.om[pp],isP=pp==='anna',res=dayRun(),a=agg(res),d=S.sim.days;
  const main={key:'main',name:omName(om.type),icon:omIcon(om.type),eic:OM_EIC[pp],id:om.id,addr:om.addr,ims:isP?S.p.ims:S.c.ims,mem:S.mem[pp]||'NONE',
    prod:isP&&!!om.pv,yProd:isP&&om.pv?(om.kwp||6.5)*1.05:0,
    /* Peter: 15-min profil × 365 dní; Anna: ilustračná ročná spotreba domácnosti z vyúčtovania */
    yCons:isP?4.2:sum(res.A.c)*365/1000,
    month:isP?{kwh:(a.anna.shared+a.anna.batSold)*d,eur:a.anna.net*d}:{kwh:a.peter.recv*d,eur:a.peter.saved*d}};
  const chata={key:'chata',name:'Chata',icon:'om_cabin',eic:OM_EIC.chata,id:'SK-OM-0002',addr:'Záhradná 3, Piešťany',ims:false,mem:'NONE',prod:false,yProd:0,yCons:1.1};
  return [main,chata];
}
const mwh=v=>fm(v,1)+' MWh';
function placeRow(p,pp){
  const isP=pp==='anna',g=GROUPS.find(x=>x.id===S.group);
  const chips=(p.prod?`<span class="chip prod"><i>${icon('sun')}</i>Výroba</span>`:'')+`<span class="chip cons"><i>${icon('plug')}</i>Spotreba</span>`;
  const nums=`<div><span class="place-k">Ročná spotreba</span><b class="place-v">${mwh(p.yCons)}</b>${p.prod?`<span class="place-k" style="margin-top:6px">Ročná výroba</span><b class="place-v">${mwh(p.yProd)}</b>`:''}</div>`;
  let price,act;
  if(!p.ims){price=`<div><span class="place-k">Cena</span><span class="sm mut">Nastavíte po inštalácii inteligentného elektromera</span></div>`;act=(S.imsReqd||{})[p.key]?pill('y','Čaká na IMS · žiadosť podaná'):`${pill('y','Čaká na IMS')}<button class="btn sm" data-act="imsreq:${p.key}">Požiadať o IMS</button>`}
  else if(isP){const ok=netPrice(S.p.price)>S.p.feedin;price=`<div><span class="place-k">Predáte za</span><b class="place-v">${fpr(S.p.price)} €/kWh</b><span class="xs mut">${fm(S.p.price/Math.max(.001,S.p.feedin),1)}× viac ako výkup ${fpr(S.p.feedin)} €/kWh${S.bat.on?` · večer ${fpr(S.bat.price)} €`:''}</span><span class="xs b" style="color:var(${ok?'--green':'--orange'})">${ok?'Odporúčaná cena':'Po provízii menej ako výkup'}</span></div>`;act=curView()==='group'?'':`<button class="btn" data-act="editprice">Upraviť cenu</button>`}
  else{const ok=S.c.max+1e-9>=S.p.price;price=`<div><span class="place-k">Zaplatíte najviac</span><b class="place-v">${fpr(S.c.max)} €/kWh</b><span class="xs mut">ponuky ${fpr(S.p.price)}${S.bat.on?' – '+fpr(S.bat.price):''} €/kWh · zo siete ${fpr(S.c.ref)} €/kWh</span><span class="xs b" style="color:var(${ok?'--green':'--orange'})">${ok?'Odporúčaná cena':'Pod cenou ponúk – energia sa nepridelí'}</span></div>`;act=curView()==='group'?'':`<button class="btn" data-act="editprice">Upraviť cenu</button>`}
  const m=p.mem,inG=m!=='NONE';
  const grp=!p.ims?`<span>${icon('group')} <b>Bez skupiny</b> · do skupiny sa pridá až s inteligentným meraním (IMS).</span>`
   :inG?`<span>${icon('group')} Skupina <b>${g.name}</b> ${pill(isAct(m)?'g':'o',MEM[m])}${isAct(m)&&p.month?` · tento mesiac ${fm(p.month.kwh,0)} kWh ${isP?'predaných susedom':'od susedov'} · <b>${eur(p.month.eur)}</b> ${isP?'čistý príjem':'úspora'}`:''}</span>${curView()==='group'?'':`<button class="link" data-act="view:group">Skupina zdieľania →</button>`}`
   :`<span>${icon('group')} <b>Zatiaľ bez skupiny</b> · vyberte si skupinu susedov.</span><button class="link" data-act="view:register">Vybrať skupinu →</button>`;
  const L=placeOrder(pp),i=L.indexOf(p.key),mv=(d,l,t)=>`<button type="button" class="place-mv" data-act="plmove:${p.key}:${d}" aria-label="${t}" ${i+d<0||i+d>=L.length?'disabled':''}>${l}</button>`;
  return `<article class="place ${p.ims?'':'wait'}" draggable="true" data-pk="${p.key}"><div class="place-main">
   <div class="row" style="flex-wrap:nowrap;gap:14px"><span class="place-drag" title="Potiahnutím zmeníte poradie">${icon('grip')}<span class="place-mvs">${mv(-1,'▲','Posunúť vyššie')}${mv(1,'▼','Posunúť nižšie')}</span></span><span class="place-ic">${icon(p.icon)}</span><div><b class="place-name">${p.name}</b><div class="xs mut"><abbr title="Energetický identifikačný kód">EIC</abbr> ${p.eic}</div><div class="xs mut">${esc(p.addr)}</div></div></div>
   <div class="row" style="gap:8px">${chips}</div>${nums}${price}<div class="place-act">${act}</div></div>
   <div class="place-grp">${grp}</div></article>`;
}
/* poradie miest si zákazník mení presunom (drag & drop) – platí v Nastaveniach aj v Skupine zdieľania */
function placeOrder(pp){const keys=myPlaces(pp).map(p=>p.key),o=(S.placeOrder||[]).filter(k=>keys.includes(k));return [...o,...keys.filter(k=>!o.includes(k))]}
function placesList(pp){const L=placeOrder(pp),P=myPlaces(pp).sort((a,b)=>L.indexOf(a.key)-L.indexOf(b.key));return `<div class="places">${P.map(p=>placeRow(p,pp)).join('')}</div><p class="xs mut" style="margin-top:6px">Poradie miest zmeníte potiahnutím za úchyt ⋮⋮ alebo šípkami.</p>`}
/* ---------- Lúč pomoci: výrobca daruje % zo zvyšku prebytku (čo sa nevyzdieľalo v skupine ani neuložilo do batérie)
   a pomerom ho rozdelí medzi 1–3 príjemcov z číselníka. Bez provízie a poplatkov, bez odmeny v iWatt. ---------- */
const donList=()=>(S.don.rcps||[]).filter(r=>RCP[r.id]).slice(0,DON_MAX);
function donShares(){const L=donList(),t=L.reduce((a,r)=>a+Math.max(0,+r.w||0),0);return L.map(r=>({...r,r:RCP[r.id],sh:t>0?Math.max(0,+r.w||0)/t:1/L.length}))}
function solStats(){
  const res=S.don.on?dayRun():runDay(S.c.appTime,{cfg:{...manualCfg(),donPct:S.don.pct}}),A=agg(res).anna,mon=A.don*S.sim.days;
  const L=donShares().map(x=>({...x,kwh:mon*x.sh,val:mon*x.sh*S.c.ref}));
  return {mon,val:mon*S.c.ref,lost:mon*S.p.feedin,L,sum:(S.don.rcps||[]).slice(0,DON_MAX).reduce((a,r)=>a+(+r.w||0),0),r:L[0]?L[0].r:RCP.r2};
}
function solSettingsCard(){
  const x=solStats(),L=donList(),full=L.length>=DON_MAX;
  /* výber zaškrtnutím z číselníka – najviac 3, dar sa rozdelí rovným dielom */
  const row=k=>{const c=RCP[k],on=L.some(r=>r.id===k),dis=!on&&full;return `<label class="don-r don-pick ${on?'on':''} ${dis?'dis':''}"><input type="checkbox" data-act="donpick:${k}" ${on?'checked':''} ${dis?'disabled':''} aria-label="${c.name}"><span class="don-ic" aria-hidden="true">${c.ic}</span><span class="don-t"><b>${c.name}</b><span class="xs mut">${c.type} · ${c.via}</span></span></label>`};
  return `<div class="card" id="sol-card"><h3 class="sol-h">${icon('heart')} Lúč pomoci</h3>${(S.persona==='peter')?'<p class="xs mut sol-for">Platí pre vaše miesto s výrobou: <b>Rodinný dom</b></p>':''}<p class="sm mut" style="margin-top:4px">Darujte časť prebytku, ktorý sa nevyzdieľal v skupine ani neuložil do batérie a inak by išiel výkupcovi. Susedia v skupine majú vždy prednosť. Energiu doručíme bez provízie a bez poplatkov.</p>
   <div class="fields" style="margin-top:10px">${F('Darovať časť zvyšku prebytku','don.on',{t:'c'})}${S.don.on?F('Koľko zo zvyšku prebytku','don.pct',{t:'r',step:5,u:' %'}):''}</div>
   ${S.don.on?`<div class="don-head"><b>Komu darujete</b><span class="xs mut">Vybraní ${L.length} / ${DON_MAX} · dar sa rozdelí rovným dielom</span></div>
    <div class="don-list">${Object.keys(RCP).map(row).join('')}</div>
    <p class="sm" style="margin-top:10px">Odhad: <b>${fm(x.mon,0)} kWh mesačne</b> pre ${x.L.length} ${x.L.length===1?'príjemcu':'príjemcov'} – hodnota pre nich ${eur(x.val)}. Vy sa vzdáte výkupu ${eur(x.lost)} mesačne.</p>
    <div class="fields one" style="margin-top:8px">${F('Uviesť moje meno pri príjemcoch ako darcu (poďakovanie)','don.pub',{t:'c'})}</div>
    <p class="xs mut">Príjemcov overuje a spravuje ${BR()}. Každý má odberné miesto s inteligentným meraním v skupine zdieľania.</p>`:''}</div>`;
}
function solReportCard(){
  const x=solStats();
  return `<div class="card sol-rep"><span class="pend-ic">${icon('heart')}</span><div><b>Lúč pomoci: tento mesiac ste darovali ${fm(x.mon,0)} kWh</b><p class="sm mut">${x.L.map(e=>`${e.r.ic} ${e.r.name} ${fm(e.kwh,0)} kWh`).join(' · ')} · hodnota pre príjemcov ${eur(x.val)} · bez provízie a poplatkov${S.don.pub?' · vaše meno je uvedené pri príjemcoch':''}</p></div><button class="link" data-act="view:cert">Dobrý sused →</button></div>`;
}
/* ---------- Dobrý sused: vľavo nastavenie Lúča pomoci, vpravo odporúčanie Zdieľne (odkaz + QR kód) ---------- */
const refCode=()=>{const p=S.persona==='admin'?'peter':S.persona;return 'ZDIELNA-'+(p==='anna'?'ANNA':'PETER')+'7K'};
const refUrl=()=>`https://zdielna.sk/pozvanka/${refCode()}`;
function refCard(){
  const R=S.ref;
  return `<div class="card ref-card"><span class="kicker">Odporučte Zdieľňu</span><h3>Pozvite suseda, získajte odmenu</h3>
   <p class="sm mut" style="margin-top:4px">Pošlite odkaz alebo ukážte QR kód. Keď sa sused zaregistruje a začne zdieľať, dostanete <b>+5 000 iWatt</b>.</p>
   <div class="ref-link"><input id="ref-url" class="inp" readonly value="${refUrl()}" aria-label="Váš odkaz na pozvánku"><button class="btn pri" data-act="refcopy">Kopírovať</button></div>
   <div class="row" style="margin-top:10px"><button class="btn" data-act="refshare">${icon('arrow')} Zdieľať odkaz</button><span class="xs mut">Kód pozvánky: <b>${refCode()}</b></span></div>
   <div class="ref-qr"><div class="ref-qr-img">${R.qr?qrSvg(refUrl(),'#0b1424'):`<div class="ref-qr-ph">${icon('console')}<span class="xs mut">QR kód sa zobrazí tu</span></div>`}</div>
    <div><b>QR kód na pozvánku</b><p class="xs mut" style="margin:4px 0 10px">Naskenujú ho susedia v mobile – napríklad z letáku, na schôdzi alebo na dverách prevádzky.</p>
     ${R.qr?'<button class="btn sm" data-act="refqrpng">⬇ Stiahnuť QR (PNG)</button>':'<button class="btn sm dark" data-act="refqr">Vygenerovať QR kód</button>'}</div></div>
   <div class="ref-stats"><div><b>${R.inv}</b><span class="xs mut">pozvaných</span></div><div><b>${R.act}</b><span class="xs mut">už zdieľa</span></div><div><b>${fm(R.act*5000,0)}</b><span class="xs mut">iWatt za odporúčania</span></div></div>
   <p class="xs mut">Ukážkové údaje. Odmena sa pripíše až po aktivácii zdieľania odporučeného suseda.</p></div>`;
}
function vGoodNeighbour(){
  const per=S.persona==='admin'?'anna':S.persona,isP=per==='anna',x=solStats();
  const head=hero({kicker:'Dobrý sused',title:'Pomáhajte v okolí. <em>Pozvite susedov.</em>',
    lead:'Časť nevyzdieľaného prebytku môžete darovať tým, ktorí to potrebujú, a susedov pozvať do Zdieľne – za každého, kto začne zdieľať, dostanete odmenu.',
    aside:isP&&S.don.on?hstat('Darujete mesačne',fm(x.mon,0)+' kWh',`pre ${x.L.length} ${x.L.length===1?'príjemcu':'príjemcov'}`):hstat('Za odporúčanie','+5 000 iWatt','keď sused začne zdieľať')});
  const left=solSettingsCard();
  return `<div class="gap">${head}<div class="grid g2 dn-grid">${left}${refCard()}</div></div>`;
}
function vProfile(){
  const per=S.persona,pp=per==='admin'?'peter':per,om=S.om[pp],ims=pp==='anna'?S.p.ims:S.c.ims,gg=geo(om.addr);
  const rg=regionOf(gg.ll);
  return `<div class="gap">${hero({cls:'compact',kicker:'Nastavenia',title:per==='anna'?'Anna <em>Kováčová.</em>':per==='peter'?'Peter <em>Malý.</em>':'Operátor <em>'+BR()+'.</em>',lead:`${esc(om.addr)} · ${omLabel(om.type)}`,top:pill(REG[rg].on?'g':'o',REG[rg].name+' · '+REG[rg].co+(REG[rg].on?'':' – mimo služby'))+pill(ims?'n':'o',ims?'IMS ✓':'IMS chýba')})}
  ${REG[rg].on?'':`<div class="card" style="border-left:5px solid var(--orange)"><b>Stredné Slovensko zatiaľ nie je súčasťou služby.</b><p class="sm mut" style="margin-top:4px">Zdieľanie elektriny je dostupné v oblastiach ZSE (západ) a VSE (východ). Z tohto odberného miesta zatiaľ nemôžete elektrinu ponúkať ani odoberať.</p></div>`}
  <div class="card"><div class="row between"><h3>Energetické miesta</h3><div class="row"><button class="btn sm" data-act="view:map">🗺 Na mape</button><button class="btn sm" data-act="addom">+ Pridať energetické miesto</button></div></div>
  <p class="xs mut" style="margin:4px 0 12px">Oblasť: ${REG[rg].co} (${REG[rg].name.toLowerCase()})${REG[rg].on?'':' – zdieľanie nedostupné'}${gg.guess?' – adresu sa nepodarilo presne určiť':''}</p>
  ${placesList(pp)}
  <div class="fields" style="margin-top:12px">${F('Adresa: '+omName(om.type),'om.'+pp+'.addr',{t:'x'})}${omTypeField('om.'+pp+'.type',om.type)}${pp==='anna'?F('Mám batériu','bat.on',{t:'c'})+F('Kapacita batérie','bat.cap',{step:.5,min:.5,u:'kWh'}):''}</div>
  <p class="xs mut" style="margin-top:6px">Každé energetické miesto má vlastné členstvo, ponuky a reporty. Jedno miesto môže byť aktívne iba v jednej skupine. Zmena adresy presunie domček na mape.</p></div>
  <div class="card"><h3>IMS a dátové súhlasy</h3><div class="fields one" style="margin-top:8px">${pp==='anna'?F('Mám inteligentné meranie (IMS)','p.ims',{t:'c'}):F('Mám inteligentné meranie (IMS)','c.ims',{t:'c'})}</div>${ims?'':`<p class="sm" style="margin:8px 0">Na aktívne zdieľanie potrebujete inteligentné meranie.</p>${(S.imsReqd||{}).main?pill('y','Žiadosť o IMS podaná'):'<button class="btn sm pri" data-act="imsreq:main">Požiadať o inštaláciu IMS</button>'}<p class="xs mut" style="margin-top:6px">Presná cena a podmienky budú potvrdené po posúdení žiadosti.</p>`}</div>
  <div class="card" id="price-card"><h3>Cenové nastavenia</h3>${(mv=>mv?`<p class="grp-move-note sm">Od <b>${dateSk(mv.from)}</b> vás presúvame do skupiny <b>${mv.g.name}</b> – jednotková cena sa zmení z ${fpr(mv.cv.price)} na <b>${fpr(mv.v.price)} €/kWh</b>.</p>`:'')(isAct(S.mem[pp])?grpMove(pp):null)}<div class="fields" style="margin-top:8px">${pp==='anna'?F('Ponuková cena','p.price',{step:.005,u:'€/kWh'})+F('Ponúknuť z prebytku','p.share',{step:5,max:100,u:'%'})+F('Výkupná cena (zmluva s výkupcom)','p.feedin',{step:.005,u:'€/kWh'})+(S.bat.on?F('Večerná cena z batérie','bat.price',{step:.005,u:'€/kWh'}):''):F('Max. cena','c.max',{step:.005,u:'€/kWh'})+F('Max. cena večer','c.maxEve',{step:.005,u:'€/kWh'})+F('Referenčná cena','c.ref',{step:.005,u:'€/kWh'})}</div></div>
  <div class="card"><h3>Notifikácie</h3><div class="fields" style="margin-top:8px">${F('Predikcia na zajtra a slnečné okno','notif.pred',{t:'c'})}${F('Nová denná výzva','notif.chal',{t:'c'})}${F('Zmena stavu žiadosti alebo členstva','notif.state',{t:'c'})}${F('Zmena ceny alebo individuálna cena','notif.price',{t:'c'})}${F('Mesačné vyúčtovanie','notif.month',{t:'c'})}</div><h3 style="margin-top:12px">Kanály</h3><div class="fields" style="margin-top:6px">${F('E-mail','notif.email',{t:'c'})}${F('Push v aplikácii','notif.push',{t:'c'})}</div><p class="xs mut" style="margin-top:6px">Ukážkové nastavenie – prototyp žiadne správy neodosiela.</p></div>
  ${per==='admin'?'':`<div class="card"><h3>Platby a inkaso</h3><p class="sm mut" style="margin-top:6px">${per==='anna'?`Výplatu za zdieľanie dostanete na účet zadaný pri registrácii. Ak by provízia ${BR()} prevýšila príjem, rozdiel sa strhne inkasom.`:'Faktúry za odobratú zdieľanú elektrinu sa uhrádzajú inkasom z vášho účtu.'}</p><div class="fields one" style="margin-top:8px">${F('Inkaso mám nastavené vo svojej banke','pay.sepa',{t:'c'})}</div><div style="margin-top:6px">${S.pay.sepa?pill('g','✓ Inkaso aktívne'):pill('o','○ Inkaso nie je nastavené')}</div><p class="xs mut" style="margin-top:6px">Súhlas s inkasom sa zakladá iba vo vašej banke. Uplatní sa od vyúčtovania nasledujúceho mesiaca.</p></div>`}
  <div class="card"><h3>História žiadostí</h3><div class="tw"><table><tbody>${S.log.slice(0,12).map(l=>`<tr><td>${l.t}</td><td>${esc(l.m)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card"><h3>Pomoc</h3><p class="sm mut" style="margin-top:4px">Otázky vám zodpovie AI asistent – tlačidlo chatu vpravo dole.</p><div class="row" style="margin-top:8px"><button class="btn sm" data-act="ask:Kedy začne zdieľanie?">Kedy začne zdieľanie?</button><button class="btn sm" data-act="ask:Ako bola vypočítaná suma?">Ako bola vypočítaná suma?</button><button class="btn sm" data-act="ask:Ako zmením skupinu?">Ako zmením skupinu?</button></div></div></div>`;
}
function vAdmin(){
  const res=dayRun(),a=agg(res),pa=sum(res.P.fpFull),errA=sum(res.A.a.map((v,i)=>Math.abs(v-res.P.fpFull[i])))/Math.max(.001,pa),errC=sum(res.A.c.map((v,i)=>Math.abs(v-res.P.fc[i])))/Math.max(.001,sum(res.P.fc));
  const reqs=['anna','peter'].map(w=>({w,m:S.mem[w],ims:w==='anna'?S.p.ims:S.c.ims}));
  const comp=S.p.price<=S.c.max+1e-9;
  const ok=Math.abs(a.debT-a.credT)<1e-9&&Math.abs(a.debT-a.netT-a.comT)<1e-9;
  const byP={};for(const r of res.recs){if(r.kind)continue;const k=r.from+(r.src==='bat'?'_bat':'');const o=byP[k]||(byP[k]={kwh:0,amt:0,com:0});o.kwh+=r.kwh;o.amt+=r.amt;o.com+=r.com}
  const A=a.anna,balOk=Math.abs(a.balKwh)<1e-6&&Math.abs(a.balBat)<1e-6;
  const evr=evSim(res),bs=badgeShare();
  const pend=reqs.filter(r=>r.m==='PENDING').length;
  return `<div class="gap">${hero({cls:'compact',kicker:'Operátorská konzola · '+BR(),title:'Všetko pod <em>kontrolou.</em>',lead:'Správa členstiev, ponúk a zúčtovania (virtuálne – bez komunikácie s OKTE).',top:pill(pend?'o':'n',pend?pend+' čakajúce žiadosti':'Žiadne čakajúce žiadosti')+pill('n','Provízia dnes '+eur(a.comT))+pill(ok?'g':'o',ok?'✓ audit súčtov v poriadku':'✕ nezhoda súčtov')})}
  <div class="card"><h3>Čakajúce žiadosti a stav OM</h3><div class="tw"><table><thead><tr><th>OM</th><th>Rola</th><th>IMS</th><th>Skupina</th><th>Stav</th><th>Akcia</th></tr></thead><tbody>${reqs.map(r=>`<tr><td>${r.w==='anna'?'OM Anna':'OM Peter'}</td><td>${r.w==='anna'?'Výrobca'+(S.bat.on?' 🔋':''):'Odberateľ'}</td><td>${r.ims?pill('g','✓ overené'):pill('r','✕ chýba')}</td><td>${gname(S.group)}</td><td>${pill(isAct(r.m)?'g':r.m==='PENDING'||r.m==='ENDING'?'o':'n',MEM[r.m])}</td><td>${r.m==='PENDING'?`<button class="btn sm pri" data-act="activate:${r.w}">Aktivovať</button><div class="xs mut">po kontrole distribútora</div>`:r.m==='ENDING'?`<button class="btn sm" data-act="endmem:${r.w}">Ukončiť členstvo</button>`:r.m==='ACTIVE'?`<button class="btn sm" data-act="endmem:${r.w}">Ukončiť (priamo)</button>`:'<span class="mut">—</span>'}${r.m==='PENDING'&&!r.ims?`<div class="xs" style="color:var(--red)">Aktivácia zablokovaná: OM nemá IMS</div>`:''}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="grid g2"><div class="card"><h3>Prehľad skupín</h3><table><thead><tr><th>Skupina</th><th class="n">Výr.</th><th class="n">Odb.</th><th class="n">Úspešnosť</th></tr></thead><tbody>${GROUPS.map(g=>`<tr><td>${g.name}</td><td class="n">${g.prod}</td><td class="n">${g.cons}</td><td class="n">${g.succ} %</td></tr>`).join('')}</tbody></table></div>
  <div class="card"><h3>Ponuky a dopyty</h3><table><thead><tr><th>Strana</th><th class="n">Cena</th><th>Stav</th></tr></thead><tbody><tr><td>Ponuka Anny (deň)</td><td class="n">${fpr(S.p.price)} €</td><td rowspan="2">${comp?pill('g','✓ prípustné'):pill('r','✕ cena ponuky &gt; max.')}</td></tr><tr><td>Dopyt Petra (max.)</td><td class="n">${fpr(S.c.max)} €</td></tr>${S.bat.on?`<tr><td>🔋 Ponuka Anny (večer)</td><td class="n">${fpr(S.bat.price)} €</td><td rowspan="2">${S.bat.price<=S.c.maxEve+1e-9?pill('g','✓ prípustné'):pill('r','✕ nad max.')}</td></tr><tr><td>Dopyt Petra večer (max.)</td><td class="n">${fpr(S.c.maxEve)} €</td></tr>`:''}${S.sim.others?`<tr><td>Ponuka B</td><td class="n">${fpr(S.o.bPrice)} €</td><td></td></tr><tr><td>Dopyt C (max.)</td><td class="n">${fpr(S.o.cMax)} €</td><td>${S.o.cMax>=S.p.price?pill('g','✓'):pill('r','✕')}</td></tr><tr><td>Dopyt D (max.)</td><td class="n">${fpr(S.o.dMax)} €</td><td>${S.o.dMax>=S.p.price?pill('g','✓'):pill('r','✕')}</td></tr>`:''}</tbody></table></div></div>
  <div class="grid g2"><div class="card"><h3>Kvalita predikcií (predikcia vs. skutočnosť)</h3><div class="sm" style="margin-top:8px">Odchýlka výroby: <b>${fm(errA*100,1)} %</b></div><div class="bar y"><i style="width:${Math.min(100,errA*100*2)}%"></i></div><div class="sm" style="margin-top:8px">Odchýlka spotreby: <b>${fm(errC*100,1)} %</b></div><div class="bar b"><i style="width:${Math.min(100,errC*100*2)}%"></i></div><p class="xs mut" style="margin-top:6px">Mení sa parametrom „Odchýlka skutočnosti od odhadu“.</p></div>
  <div class="card"><h3>Zúčtovanie (celý deň)</h3><table><tbody><tr><td>Platby odberateľov</td><td class="n">${fm(a.debT,4)} €</td></tr><tr><td>Výplata výrobcom (po provízii)</td><td class="n">${fm(a.netT,4)} €</td></tr><tr><td>Provízia ${BR()}</td><td class="n">${fm(a.comT,4)} €</td></tr><tr><td>Darované (Lúč pomoci) – platba / provízia</td><td class="n">${fm(a.donT,2)} kWh · 0 € / 0 €</td></tr><tr><td>Počet alokácií</td><td class="n">${a.n}</td></tr></tbody></table><div class="pill ${ok?'g':'r'}" style="margin-top:8px">${ok?`✓ Platby odberateľov = výplata výrobcom + provízia ${BR()}`:'✕ Nezhoda súčtov'}</div></div></div>
  <div class="card"><div class="row between"><h3>⚖ Bilancia kWh – Anna (celý deň)</h3>${pill(balOk?'g':'r',balOk?'✓ každá kWh je zaúčtovaná':'✕ nezhoda')}</div>
   <table style="margin-top:6px"><tbody><tr style="font-weight:700"><td>Ponúknutý prebytok</td><td class="n">${fm(A.offered,3)} kWh</td></tr><tr><td>= predané skupine cez deň</td><td class="n">${fm(A.shared,3)}</td></tr><tr><td>+ uložené do batérie</td><td class="n">${fm(A.batCh,3)}</td></tr><tr><td>+ Lúč pomoci</td><td class="n">${fm(A.don,3)}</td></tr><tr><td>+ výkupca</td><td class="n">${fm(A.vykup,3)}</td></tr></tbody></table>
   ${S.bat.on?`<table style="margin-top:10px"><tbody><tr style="font-weight:700"><td>🔋 Nabité do batérie</td><td class="n">${fm(A.batCh,3)} kWh</td></tr><tr><td>= predané večer</td><td class="n">${fm(A.batSold,3)}</td></tr><tr><td>+ vlastná spotreba</td><td class="n">${fm(A.batOwn,3)}</td></tr><tr><td>+ zmena zostatku (${fm(a.soc0,2)} → ${fm(a.socEnd,2)} kWh)</td><td class="n">${fm(a.socEnd-a.soc0,3)}</td></tr><tr><td>+ straty účinnosti</td><td class="n">${fm(A.batLoss,3)}</td></tr></tbody></table>`:''}</div>
  <div class="card" style="border-left:5px solid var(--brand)"><div class="row between"><h3>💶 Príjem ${BR()} z provízií</h3>${pill('n','účtuje sa iba výrobcovi')}</div>
   <div class="grid g4" style="margin-top:10px">${kpi('Dnes',eur(a.comT))}${kpi('Mesiac ('+S.sim.days+' dní)',eur(a.comT*S.sim.days))}${kpi('Rok (12 mesiacov)',eur(a.comT*S.sim.days*12),'odhad pri rovnakom profile')}${kpi('Efektívna sadzba',pct(a.credT>0?a.comT/a.credT:0),'z tržby výrobcov')}</div>
   <div class="tw" style="margin-top:10px"><table><thead><tr><th>Výrobca</th><th class="n">Predané</th><th class="n">Tržba</th><th class="n">Provízia ${BR()}</th><th class="n">Výplata</th></tr></thead><tbody>${Object.keys(byP).length?Object.entries(byP).map(([k,o])=>`<tr><td>${nm(k.replace('_bat',''))}${k.endsWith('_bat')?' 🔋 večer':''}</td><td class="n">${fm(o.kwh,2)} kWh</td><td class="n">${fm(o.amt,2)} €</td><td class="n">${fm(o.com,3)} €</td><td class="n">${fm(o.amt-o.com,2)} €</td></tr>`).join(''):'<tr><td colspan="5" class="mut">Zatiaľ žiadne alokácie.</td></tr>'}</tbody></table></div>
   <div class="fields three" style="margin-top:12px">${F('Spôsob provízie','fee.mode',{t:'s',opts:[FEE_FIX,FEE_PCT]})}${F('Pevná provízia (vr. DPH)','fee.fix',{step:.5,u:'€/MWh'})}${F('Provízia v %','fee.pct',{step:.5,max:100,u:'% z tržby'})}</div>
   <p class="xs mut" style="margin-top:6px">Odberateľ neplatí žiadnu províziu. Darovaná energia (Lúč pomoci) je bez provízie. Ak je provízia vyššia než príjem výrobcu, rozdiel sa vyrovná inkasom.</p></div>
  <div class="card" style="border-left:5px solid var(--purple)"><div class="row between"><h3>💡 Nápady – súhrn</h3>${pill('vis','Vízia / koncept')}</div>
   <div class="grid g2" style="margin-top:10px">${kpi('Darované dnes (Lúč pomoci)',fm(A.don,2)+' kWh','0 € provízia')}${kpi('V2G objem dnes',fm(evr.disT,1)+' kWh','elektromobil → bistro')}</div>
   <div class="row" style="margin-top:10px">${pill(bs.lv?'g':'n','Certifikované podniky: '+(3+(bs.lv?1:0)))}</div></div>
  <div class="card"><h3>Overovanie výziev podľa IMS</h3><div class="tw"><table><thead><tr><th>Používateľ</th><th>Spotrebič</th><th>Presun</th><th>Výsledok kontroly</th></tr></thead><tbody>${(()=>{const L=[['c','wash','Peter'],['c','ev','Peter'],['c','wh','Peter'],['c','ice','Peter'],['p','pw','Anna'],['p','pb','Anna'],['p','pev','Anna']].filter(([o,k])=>A_(o,k).accepted);return L.length?L.map(([o,k,w])=>{const x=A_(o,k),v=verifyLoad(o,k);return `<tr><td>${w}</td><td>${x.label}</td><td>${x.orig} → ${x.time}</td><td>${v.ok?pill('g','✓ overené'):pill('r','⚠ podozrenie – spotreba nezodpovedá')}</td></tr>`}).join(''):'<tr><td colspan="4" class="mut">Zatiaľ žiadne prijaté výzvy.</td></tr>'})()}</tbody></table></div><p class="xs mut" style="margin-top:6px">Kontrola porovnáva 15-minútové merania IMS s týždenným profilom.</p></div>
  <div class="card"><h3>Správa gamifikácie</h3><div class="fields" style="margin-top:8px">${F('Denný limit bodov','pts.cap',{step:5,u:'b'})}</div></div>
  <div class="card"><h3>Audit udalostí</h3><div class="tw"><table><tbody>${S.log.map(l=>`<tr><td>${l.t}</td><td>${esc(l.m)}</td></tr>`).join('')}</tbody></table></div></div></div>`;
}
function vOnb(){
  const o=S.ob,per=S.persona==='admin'?'peter':S.persona,st=o.step,isP=per==='anna',om=S.om[per];
  const ims=isP?S.p.ims:S.c.ims;
  let body='';
  if(st===1)body=`<h2>Čo chcete robiť?</h2><div class="grid g3" style="margin-top:12px">${[['prod','Chcem ponúkať prebytky','☀'],['cons','Chcem získavať zdieľanú elektrinu','🔌'],['both','Chcem robiť oboje','⇄']].map(([k,l,i])=>`<button class="role" data-act="obrole:${k}" aria-pressed="${o.role===k}"><div style="font-size:26px">${i}</div><b>${l}</b></button>`).join('')}</div><p class="sm mut" style="margin-top:10px">Nastavenie môžete neskôr upraviť. Jedno odberné miesto však môže byť aktívne iba v jednej skupine zdieľania.</p>`;
  if(st===2)body=`<h2>Pridajte odberné miesto</h2><div class="fields" style="margin-top:12px">${F('Identifikátor OM','om.'+per+'.id',{t:'x'})}${F('Adresa (mesto určí polohu na mape)','om.'+per+'.addr',{t:'x'})}${omTypeField('om.'+per+'.type',om.type)}${F('Fotovoltika','om.'+per+'.pv',{t:'c'})}${om.pv?F('Inštalovaný výkon','om.'+per+'.kwp',{step:.5,u:'kWp'})+F('Batéria','bat.on',{t:'c'})+(S.bat.on?F('Kapacita batérie','bat.cap',{step:.5,min:.5,u:'kWh'}):''):''}</div>`;
  if(st===3)body=`<h2>Kontrola IMS</h2><div class="fields one" style="margin:12px 0">${isP?F('IMS je dostupný (demo prepínač)','p.ims',{t:'c'}):F('IMS je dostupný (demo prepínač)','c.ims',{t:'c'})}</div>${ims?`<div class="card" style="border-left:5px solid var(--green)"><b>✓ Inteligentné meranie overené</b><p class="sm mut">Máme k dispozícii 15-minútové údaje potrebné na predikciu a vyhodnotenie zdieľania.</p></div>`:`<div class="card" style="border-left:5px solid var(--orange)"><b>Na aktívne zdieľanie potrebujete inteligentné meranie.</b><div class="row" style="margin-top:8px"><button class="btn pri sm" data-act="imsreq">Požiadať o inštaláciu IMS</button><button class="btn sm" data-act="obnext">Zatiaľ si pozrieť odhad</button></div><p class="xs mut" style="margin-top:6px">Presná cena a podmienky budú potvrdené po posúdení žiadosti.</p></div>`}`;
  if(st===4)body=`<h2>Súhlas s použitím dát</h2><p class="sm mut" style="margin:8px 0">Na predikciu a vyhodnotenie zdieľania používame 15-minútové údaje z inteligentného merania.</p>${F('Súhlasím s použitím 15-minútových dát','ob.consent',{t:'c'})}`;
  if(st===5)body=`<h2>Cenové a spotrebné preferencie</h2><div class="fields" style="margin-top:12px">${(o.role!=='cons')?F('Minimálna cena (ponuka)','p.price',{step:.005,u:'€/kWh'})+F('Ponúknuť z predikovaného prebytku','p.share',{step:5,max:100,u:'%'})+F('Predikovaný prebytok / deň','p.surplus',{step:.1,u:'kWh'})+F('Prebytky od','p.pStart',{t:'t'})+F('Prebytky do','p.pEnd',{t:'t'})+F('Výkupná cena (vaša zmluva s výkupcom)','p.feedin',{step:.005,u:'€/kWh'})+(S.bat.on?F('Večerná cena z batérie','bat.price',{step:.005,u:'€/kWh'}):''):''}${(o.role!=='prod')?F('Maximálna cena','c.max',{step:.005,u:'€/kWh'})+F('Maximálna cena večer','c.maxEve',{step:.005,u:'€/kWh'})+F('Spotreba v okne / deň','c.daily',{step:.1,u:'kWh'})+F('Preferovaný čas od','c.cStart',{t:'t'})+F('Preferovaný čas do','c.cEnd',{t:'t'}):''}</div>${o.role!=='cons'?feeInfo()+batWarnHtml():''}${o.role!=='prod'?`<p class="sm mut" style="margin-top:10px">Flexibilná spotreba: umývačka ✓ · výrobník ľadu ✓ · automatické odporúčania zapnuté. Odberateľ neplatí žiadnu províziu ani poplatok.</p>`:''}`;
  if(st===6){const r=potRun(),f=agg(r),win=bestWin(r.P.fp.map((v,i)=>Math.min(v,r.P.fc[i]))),u=UNC[S.p.conf]||.2;const base=matchScore(r.P.fp,S.p.price,r.P.fc,S.c.max,S.c.ref,S.p.conf);
    body=`<h2>Predbežná predikcia a odporúčaná skupina</h2>${chart(r,{forecast:true,band:true,win})}<p class="sm" style="margin:8px 0">Najlepší čas na zdieľanie: <b>${win?I2T(win.a)+' – '+I2T(win.b):'—'}</b> · Odhadovaný mesačný objem: <b>${fm(f.peter.recv*S.sim.days*(1-u),0)} – ${fm(f.peter.recv*S.sim.days*(1+u),0)} kWh</b> · ${confPill(S.p.conf)}</p><p class="sm" style="margin:4px 0 12px">Porovnajte skupiny – pri každej vidíte odhad, koľko ${o.role==='prod'?'zarobíte navyše':'ušetríte'} za rok. Odporúčanú ★ sme vybrali podľa vášho profilu.</p>${grpCompare(o.role==='prod',o.group,'grp')}`}
  if(st===7){const g=GROUPS.find(x=>x.id===o.group),r=agg(potRun()),u=UNC[S.p.conf]||.2,v=(isP||o.role==='prod')?r.anna.shared+r.anna.batSold:r.peter.recv;
    body=`<h2>Súhrn žiadosti</h2><table style="margin:10px 0"><tbody><tr><td>Skupina</td><td><b>${g.name}</b></td></tr><tr><td>Rola</td><td><b>${isP?'Výrobca':'Odberateľ'}</b></td></tr><tr><td>${isP?'Ponúkaná cena':'Maximálna cena'}</td><td><b>${fpr(isP?S.p.price:S.c.max)} €/kWh</b></td></tr>${isP?`<tr><td>Provízia ${BR()}</td><td><b>${feeTxt()}</b> (iba z predanej energie)</td></tr><tr><td>Čistá cena po provízii</td><td><b>${fpr(netPrice(S.p.price))} €/kWh</b>${S.bat.on?` · večer ${fpr(netPrice(S.bat.price))} €/kWh`:''}</td></tr><tr><td>Odhad čistého príjmu</td><td><b>${eur(r.anna.net*S.sim.days*(1-u))} – ${eur(r.anna.net*S.sim.days*(1+u))} mesačne</b></td></tr>`:'<tr><td>Poplatky</td><td><b>žiadne</b> – odberateľ neplatí províziu</td></tr>'}<tr><td>Odhad zdieľania</td><td><b>${fm(v*S.sim.days*(1-u),0)} – ${fm(v*S.sim.days*(1+u),0)} kWh mesačne</b></td></tr><tr><td>Predpokladaná aktivácia</td><td>k 1. dňu nasledujúceho mesiaca po kontrole distribútora</td></tr></tbody></table>${condList()}${S.mem[per]==='NONE'||S.mem[per]==='MATCH'||S.mem[per]==='READY'?`<button class="btn pri" style="margin-top:10px" data-act="obsubmit">Odoslať virtuálnu žiadosť</button>`:`<div style="margin-top:10px">${stepper(S.mem[per])}</div>`}${ims?'':`<p class="sm" style="color:var(--orange);margin-top:8px">⚠ Bez IMS nie je možné prejsť do aktívneho stavu.</p>`}`}
  return `<div class="gap"><div class="card"><div class="row between"><b>Registrácia (zákazník SPP alebo inej spoločnosti) – krok ${st} / 7</b><button class="btn sm" data-act="regback">← Späť na výber</button></div><div class="bar" style="margin-top:8px"><i style="width:${st/7*100}%;background:var(--brand)"></i></div></div><div class="card">${body}<div class="row between" style="margin-top:16px"><button class="btn" data-act="obprev" ${st===1?'disabled':''}>← Späť</button>${st<7?`<button class="btn pri" data-act="obnext" ${st===4&&!o.consent?'disabled':''}>Ďalej →</button>`:''}</div></div></div>`;
}


