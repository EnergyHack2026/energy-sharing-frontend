'use strict';
/* =====================================================================
   Odznaky (Odmeny → Odznaky)
   Tvar = kategória, kov = úroveň, vnútorná farba = význam dát (tokens).
   História je ilustračná (BDG_BASE), dnešok sa počíta živo z enginu,
   o polnoci sa pripočíta. Odznak sa udelí až po overení (výzvy cez IMS).
   ===================================================================== */
const BCAT={
  rytmus:{name:'Slnečný rytmus',shape:'circle',sub:'Presun spotreby do slnečného okna'},
  strecha:{name:'Strecha, ktorá zdieľa',shape:'roof',sub:'Výroba a predaj prebytkov'},
  komunita:{name:'Komunita',shape:'hex',sub:'Spoločné ciele – bez rebríčka jednotlivcov'},
  srdce:{name:'Srdce',shape:'heart',sub:'Darovanie a darčeky'},
  sezona:{name:'Sezónne',shape:'star',sub:'Iba v určitom období roka'}
};
/* kind: once = raz · rep = opakovateľný (×N) · tier = úrovne podľa hodnoty */
const BADGES=[
 {id:'first_shift',cat:'rytmus',who:'peter',kind:'once',metal:'bronze',icon:'clock',col:'--c-cons',name:'Prvý presun',how:'Prvá výzva overená podľa merania IMS.',live:c=>c.peterVerified},
 {id:'wash',cat:'rytmus',who:'peter',kind:'rep',metal:'silver',icon:'sun',col:'--c-prod',name:'Perieme so slnkom',how:'Spotrebič z výzvy bežal v slnečnom okne a meranie IMS to potvrdilo.',live:c=>c.peterVerified},
 {id:'perfect',cat:'rytmus',who:'peter',kind:'rep',metal:'gold',icon:'bolt',col:'--c-shared',name:'Perfektný interval',how:'Aspoň 60 % spotreby v jednom 15-minútovom intervale pokryla zdieľaná elektrina.',live:c=>c.peterPerfect},
 {id:'streak',cat:'rytmus',who:'peter',kind:'tier',tiers:[7,30,100],unit:'dní',icon:'star',col:'--c-prod',name:'Rytmus',how:'Séria dní, v ktorých ste splnili aspoň jednu overenú výzvu.',live:c=>c.peterVerified?1:0},
 {id:'shifted',cat:'rytmus',who:'peter',kind:'tier',tiers:[10,100,1000],unit:'kWh',icon:'market',col:'--c-cons',name:'Presunuté kWh',how:'Spotreba presunutá do slnečného okna – počítajú sa iba overené výzvy.',live:c=>c.peterShift},
 {id:'saved',cat:'rytmus',who:'peter',kind:'tier',tiers:[10,100,500],unit:'€',icon:'coins',col:'--c-shared',name:'Ušetrené eurá',how:'Úspora na cene komodity vďaka zdieľanej elektrine od susedov.',live:c=>c.peterSaved},

 {id:'first_share',cat:'strecha',who:'anna',kind:'once',metal:'bronze',icon:'sun',col:'--c-prod',name:'Prvé vyzdieľanie',how:'Prvá kWh z vašej strechy u suseda.',live:c=>c.annaShared>0.001},
 {id:'shared',cat:'strecha',who:'anna',kind:'tier',tiers:[100,1000,5000],unit:'kWh',icon:'home',col:'--c-shared',name:'Vyzdieľané kWh',how:'Elektrina predaná susedom cez deň aj večer z batérie.',live:c=>c.annaShared},
 {id:'nowaste',cat:'strecha',who:'anna',kind:'rep',metal:'silver',icon:'leaf',col:'--c-shared',name:'Nič nazmar',how:'Skupina využila viac ako 75 % vášho ponúknutého prebytku. Vyhodnocuje sa o 24:00.',live:c=>c.eod&&c.annaSucc>=.75},
 {id:'forecast',cat:'strecha',who:'anna',kind:'rep',metal:'gold',icon:'chart',col:'--c-cons',name:'Presná predpoveď',how:'Skutočná výroba sa od predpovede líšila najviac o 10 %. Vyhodnocuje sa o 24:00.',live:c=>c.eod&&c.annaErr<=.10},
 {id:'evening',cat:'strecha',who:'anna',kind:'rep',metal:'silver',icon:'battery',col:'--c-bat',name:'Večerná hviezda',how:'Batéria večer predala uloženú energiu susedom.',live:c=>c.batSold>0.01,need:()=>S.bat.on},
 {id:'better',cat:'strecha',who:'anna',kind:'tier',tiers:[10,100,500],unit:'€',icon:'coins',col:'--c-prod',name:'Lepšie než výkup',how:'Zárobok navyše oproti tomu, keby ste všetko predali výkupcovi.',live:c=>Math.max(0,c.annaVs)},

 {id:'goal',cat:'komunita',who:'both',kind:'rep',metal:'gold',icon:'group',col:'--c-shared',name:'Cieľ skupiny',how:'Skupina využila aspoň 80 % prebytkov dňa. Spoločný úspech, bez rebríčka. Vyhodnocuje sa o 24:00.',live:c=>c.eod&&c.annaSucc>=.8},
 {id:'connector',cat:'komunita',who:'anna',kind:'once',metal:'silver',icon:'market',col:'--brand',name:'Prepájač',how:'Nový sused sa pripojil cez váš prepájací kód.',live:()=>S.codeOk},
 {id:'founder',cat:'komunita',who:'both',kind:'once',metal:'gold',icon:'award',col:'--brand',name:'Zakladateľ',how:'Patríte medzi prvých 10 členov skupiny Slnečný kruh 17.'},
 {id:'eastwest',cat:'komunita',who:'both',kind:'once',metal:'silver',icon:'map',col:'--c-cons',name:'Západ – východ',how:'Vaša elektrina putovala medzi oblasťami ZSE a VSE, napríklad cez Pošli slnko.',live:c=>c.eastWest},

 {id:'first_gift',cat:'srdce',who:'anna',kind:'once',metal:'bronze',icon:'heart',col:'--brand',name:'Prvý dar',how:'Prvá kWh darovaná cez Solidárne slnko alebo Pošli slnko.',live:c=>c.don>0.001||c.gifts>0},
 {id:'donated',cat:'srdce',who:'anna',kind:'tier',tiers:[50,500],unit:'kWh',icon:'heart',col:'--c-prod',name:'Darované kWh',how:'Energia darovaná cez Solidárne slnko – bez provízie a bez poplatkov.',live:c=>c.don},
 {id:'sent',cat:'srdce',who:'anna',kind:'rep',metal:'silver',icon:'gift',col:'--c-prod',name:'Poslané slnko',how:'Darček cez Pošli slnko bol odoslaný blízkemu človeku.',count:c=>c.gifts},

 {id:'longest',cat:'sezona',who:'both',kind:'once',metal:'slnko',icon:'sun',col:'--c-prod',name:'Najdlhší deň',how:'Zdieľali ste 21. júna, v deň letného slnovratu.'},
 {id:'spring',cat:'sezona',who:'both',kind:'once',metal:'silver',icon:'leaf',col:'--c-shared',name:'Prvý jarný lúč',how:'Prvé zdieľanie po zime.'},
 {id:'autumn',cat:'sezona',who:'both',kind:'tier',tiers:[10],unit:'dní',icon:'leaf',col:'--c-grid',name:'Jesenný lovec',how:'10 zamračených októbrových dní (výroba pod 70 %), keď ste aj tak zdieľali.',live:c=>c.cloudy?1:0},
 {id:'xmas',cat:'sezona',who:'anna',kind:'once',metal:'slnko',secret:true,icon:'gift',col:'--brand',name:'Vianoce zo slnka',how:'Do 24. decembra máte v Slnečnej banke cieľ, ktorý si nastavil AI správca.',live:()=>S.bank.bal>=S.agent.goal,prog:()=>[S.bank.bal,S.agent.goal,'kWh']}
];
/* ilustračná história (dátumy ISO) – nastavená tak, aby sa v deme dali odznaky odomknúť */
const BDG_BASE={
 first_shift:{date:'2026-05-12'},wash:{count:37,date:'2026-10-16'},perfect:{count:19,date:'2026-10-14'},
 streak:{val:5},shifted:{val:98.2,dates:{10:'2026-06-03'}},saved:{val:61.3,dates:{10:'2026-06-20'}},
 first_share:{date:'2026-04-03'},shared:{val:993,dates:{100:'2026-04-29'}},nowaste:{count:23,date:'2026-10-11'},
 forecast:{count:11,date:'2026-10-09'},evening:{count:41,date:'2026-10-17'},better:{val:72.4,dates:{10:'2026-05-18'}},
 goal:{count:3,date:'2026-09-30'},connector:{date:'2026-06-02'},founder:{date:'2026-03-20'},
 longest:{date:'2026-06-21'},spring:{date:'2026-03-08'},autumn:{val:6}
};
const BDG=()=>S.bdg||(S.bdg={base:JSON.parse(JSON.stringify(BDG_BASE)),seen:{},cnt:{},sel:{},fresh:{}});
const todayISO=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const fdate=iso=>new Date(iso+'T12:00:00').toLocaleDateString('sk-SK',{day:'numeric',month:'long',year:'numeric'});
const bdgFor=per=>BADGES.filter(b=>(b.who==='both'||b.who===per)&&(!b.need||b.need()));

/* dnešné hodnoty z enginu (do aktuálneho času simulácie) */
function bdgCtx(){
  const res=dayRun(),idx=S.sim.idx,a=agg(res,idx),full=idx>=96?a:agg(res,96);
  const doneC=['wash','ev','wh','ice'].filter(k=>doneG('c',k));
  let perfect=false;
  for(let i=0;i<Math.min(96,idx)&&!perfect;i++){const d=res.A.c[i];if(d<=0)continue;let r=0;for(const x of res.recs)if(x.i===i&&x.to==='peter')r+=x.kwh;if(r/d>=.6)perfect=true}
  let num=0,den=0;for(let i=0;i<96;i++){if(i===S.meter.idx)continue;num+=Math.abs(res.A.a[i]-res.P.fpFull[i]);den+=res.P.fpFull[i]}
  const home=regionOf(geo(S.om.anna.addr).ll);
  return {eod:idx>=96,peterVerified:doneC.length>0,peterShift:sum(doneC.map(k=>A_('c',k).kwh)),peterPerfect:perfect,peterSaved:a.peter.saved,
    annaShared:a.anna.shared+a.anna.batSold,batSold:a.anna.batSold,annaVs:a.anna.vsVykup,annaSucc:full.anna.offered>0?full.anna.shared/full.anna.offered:0,annaErr:den>0?num/den:0,
    don:a.anna.don,gifts:S.gifts.length,eastWest:S.gifts.some(g=>CONTACTS[g.to]&&regionOf(geo(CONTACTS[g.to].town).ll)!==home),cloudy:S.p.weather<70};
}
const TIER_METALS={1:['gold'],2:['silver','gold'],3:['bronze','silver','gold']};
function bdgState(b,c){
  const base=BDG().base[b.id]||{},t=todayISO(),st={b,earned:false,ids:[],date:null,count:0,val:0,tier:-1,next:null,metal:b.metal};
  if(b.kind==='once'){const l=!!(b.live&&b.live(c));st.earned=!!base.date||l;st.date=base.date||(l?t:null);if(st.earned)st.ids.push(b.id);if(b.prog)st.prog=b.prog(c)}
  else if(b.kind==='rep'){const l=!!(b.live&&b.live(c));st.count=b.count?b.count(c):(base.count||0)+(l?1:0);st.earned=st.count>0;st.date=l||b.count&&st.count?t:base.date||null;st.today=l;if(st.earned)st.ids.push(b.id)}
  else{const v=(base.val||0)+(b.live?+b.live(c)||0:0),ms=TIER_METALS[b.tiers.length];st.val=v;
    b.tiers.forEach((th,i)=>{if(v>=th-1e-9){st.tier=i;st.ids.push(b.id+'@'+th)}});
    st.earned=st.tier>=0;st.metal=ms[Math.max(0,st.tier)];st.next=b.tiers[st.tier+1]??null;
    if(st.earned){const th=b.tiers[st.tier];st.date=(base.dates||{})[th]||t}
    st.prog=st.next!=null?[v,st.next,b.unit]:null;}
  st.secret=!!b.secret&&!st.earned;
  return st;
}
function bdgAll(per,c=bdgCtx()){return bdgFor(per).map(b=>bdgState(b,c))}

/* ---------- vykreslenie odznaku (SVG, 2,5D) ---------- */
const METALS={bronze:['#6E3F1E','#E3A673','#8A5228','#4A2A12'],silver:['#7D8793','#F7F9FB','#A3ACB6','#59626C'],gold:['#8A6200','#FFE58F','#C08F0E','#5E4300'],slnko:['#B88A12','#FFFBEA','#F5B400','#7A5A00']};
let bdgUid=0;
function tokHex(name){
  const k=S.skin+name,c=tokHex.c||(tokHex.c={});if(c[k])return c[k];
  let v=getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if(v.startsWith('var(')){v=getComputedStyle(document.documentElement).getPropertyValue(v.slice(4,-1).trim()).trim()}
  return c[k]=v||'#888888';
}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function shapePath(shape,r){
  const cx=60,cy=60,poly=pts=>'M'+pts.map(([x,y])=>(cx+x*r).toFixed(2)+','+(cy+y*r).toFixed(2)).join('L')+'Z';
  if(shape==='circle')return `M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0Z`;
  if(shape==='hex')return poly([0,1,2,3,4,5].map(k=>{const a=(k*60-90)*Math.PI/180;return [Math.cos(a),Math.sin(a)]}));
  if(shape==='roof')return poly([[0,-1],[.97,-.2],[.82,.95],[-.82,.95],[-.97,-.2]]);
  if(shape==='star'){const p=[];for(let k=0;k<24;k++){const a=(k*15-90)*Math.PI/180,rr=k%2?.86:1;p.push([Math.cos(a)*rr,Math.sin(a)*rr])}return poly(p)}
  if(shape==='heart'){const s=r/46;return `M${cx},${cy+40*s}C${cx-30*s},${cy+20*s} ${cx-46*s},${cy+4*s} ${cx-46*s},${cy-14*s}C${cx-46*s},${cy-30*s} ${cx-34*s},${cy-42*s} ${cx-20*s},${cy-42*s}C${cx-10*s},${cy-42*s} ${cx-3*s},${cy-36*s} ${cx},${cy-28*s}C${cx+3*s},${cy-36*s} ${cx+10*s},${cy-42*s} ${cx+20*s},${cy-42*s}C${cx+34*s},${cy-42*s} ${cx+46*s},${cy-30*s} ${cx+46*s},${cy-14*s}C${cx+46*s},${cy+4*s} ${cx+30*s},${cy+20*s} ${cx},${cy+40*s}Z`}
  return shapePath('circle',r);
}
/* st: stav z bdgState; o.tier: vynútená úroveň (index) pre náhľad úrovní */
function badgeSvg(st,o={}){
  const b=st.b,u='bg'+(++bdgUid),shape=BCAT[b.cat].shape;
  const tier=o.tier??st.tier,metal=b.kind==='tier'?TIER_METALS[b.tiers.length][Math.max(0,tier)]:st.metal,M=METALS[metal];
  const col=tokHex(b.col),light=mixHex(col,'#ffffff',.42),dark=mixHex(col,'#000000',.35);
  if(st.secret&&o.tier==null)return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${shapePath(shape,50)}" fill="none" stroke="#B9B4C4" stroke-width="2.5" stroke-dasharray="6 6"/><text x="60" y="72" font-family="Arial,sans-serif" font-size="34" font-weight="800" fill="#B9B4C4" text-anchor="middle">?</text></svg>`;
  const num=b.kind==='tier'?b.tiers[Math.max(0,tier)]:null;
  const numTxt=num==null?'':num>=1000?fm(num/1000,0)+'k':String(num);
  const ico=ICONS[b.icon]||ICONS.sun,iy=num!=null?24:31,is=num!=null?1.45:1.9;
  let rays='';
  if(metal==='slnko')for(let k=0;k<16;k++){const a=k*22.5;rays+=`<path d="M60,2 L63,12 L57,12Z" fill="${M[2]}" transform="rotate(${a} 60 60)"/>`}
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
   <linearGradient id="${u}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${M[1]}"/><stop offset=".45" stop-color="${M[2]}"/><stop offset="1" stop-color="${M[0]}"/></linearGradient>
   <linearGradient id="${u}e" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${M[1]}"/><stop offset="1" stop-color="${M[3]}"/></linearGradient>
   <radialGradient id="${u}f" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
   <clipPath id="${u}c"><path d="${shapePath(shape,41)}"/></clipPath>
  </defs>
  ${rays}
  <path d="${shapePath(shape,52)}" fill="url(#${u}m)" stroke="${M[3]}" stroke-width="1" stroke-linejoin="round"/>
  <path d="${shapePath(shape,46)}" fill="url(#${u}e)" stroke-linejoin="round"/>
  <path d="${shapePath(shape,41)}" fill="url(#${u}f)"/>
  <g clip-path="url(#${u}c)"><rect x="-20" y="22" width="160" height="16" fill="#ffffff" opacity=".18" transform="rotate(-28 60 60)"/><rect x="-20" y="44" width="160" height="5" fill="#ffffff" opacity=".14" transform="rotate(-28 60 60)"/></g>
  <g transform="translate(${60-12*is},${iy}) scale(${is})" fill="none" stroke="#ffffff" stroke-width="${(2/is).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${ico}</g>
  ${numTxt?`<text x="60" y="${b.unit?83:87}" font-family="Figtree,Arial,sans-serif" font-size="${numTxt.length>3?17:21}" font-weight="800" fill="#ffffff" stroke="${dark}" stroke-width="2.4" paint-order="stroke" text-anchor="middle">${numTxt}</text>${b.unit?`<text x="60" y="95" font-family="Figtree,Arial,sans-serif" font-size="8" font-weight="800" letter-spacing="1" fill="#ffffff" opacity=".9" text-anchor="middle">${esc(b.unit.toUpperCase())}</text>`:''}`:''}
  </svg>`;
}

/* ---------- obrazovka Odznaky ---------- */
const bdgLine=st=>{const b=st.b;
  if(b.kind==='tier')return `Spolu ${fm(st.val,b.unit==='€'?2:0)} ${b.unit}${st.next!=null?` · do ďalšej úrovne ${fm(Math.max(0,st.next-st.val),b.unit==='€'?2:0)} ${b.unit}`:' · najvyššia úroveň'}`;
  if(b.kind==='rep')return `Získané ${st.count}×${st.today?' · dnes +1':''}`;
  return b.how};
function bdgStatus(st){
  const b=st.b;
  if(st.secret)return `<span class="xs mut">Tajný odznak</span>`;
  if(b.kind==='rep')return st.earned?pill(st.today?'g':'n','×'+st.count):`<span class="xs mut">zatiaľ nezískaný</span>`;
  if(b.kind==='once')return st.earned?`<span class="xs mut">${fdate(st.date)}</span>`:st.prog?bdgBar(st.prog):`<span class="xs mut">zatiaľ nezískaný</span>`;
  return st.next!=null?bdgBar(st.prog):`<span class="xs mut">všetky úrovne ✓</span>`;
}
function bdgBar([v,m,unit]){const p=clamp(v/m,0,1),dec=unit==='€'?2:0;return `<div class="bdg-prog"><div class="bar y"><i style="width:${(p*100).toFixed(1)}%"></i></div><span class="xs mut">${fm(v,dec)} / ${fm(m,0)} ${unit}</span></div>`}
const bdgEarned=list=>list.filter(s=>s.earned).sort((a,b)=>(BDG().fresh[b.b.id]?1:0)-(BDG().fresh[a.b.id]?1:0)||String(b.date).localeCompare(String(a.date)));
function bdgNav(per,d){const L=bdgEarned(bdgAll(per));if(!L.length)return;const B=BDG(),k=Math.max(0,L.findIndex(s=>s.b.id===B.sel[per]));B.sel[per]=L[(k+d+L.length)%L.length].b.id}
function bdgStage(per,list){
  const earned=bdgEarned(list);
  if(!earned.length)return '';
  const B=BDG(),k=Math.max(0,earned.findIndex(s=>s.b.id===B.sel[per])),st=earned[k],b=st.b;
  return `<div class="card hero bdg-stage"><div class="row between"><span class="kicker">${B.fresh[b.id]?'Nový odznak':'Posledné odznaky'} · ${k+1} / ${earned.length}</span>${B.fresh[b.id]?pill('y','NOVÝ'):''}</div>
   <div class="bdg-show"><button class="btn ghost sm" data-act="bdgnav:-1" aria-label="Predchádzajúci odznak">‹</button>
    <button class="bdg-big" data-act="bdg:${b.id}" aria-label="Detail odznaku ${esc(b.name)}">${badgeSvg(st)}<span class="bdg-pedestal" aria-hidden="true"></span></button>
    <button class="btn ghost sm" data-act="bdgnav:1" aria-label="Ďalší odznak">›</button></div>
   <div class="bdg-cap"><h2>${esc(b.name)}${b.kind==='rep'?` <span class="bdg-x">×${st.count}</span>`:''}</h2><p>Získané ${fdate(st.date)}</p><p class="sm">${esc(bdgLine(st))}</p>
   <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sm" data-act="bdgshare:${b.id}">Zdieľať</button><button class="btn ghost sm" data-act="bdg:${b.id}">Detail</button></div></div></div>`;
}
function vBadges(per){
  const list=bdgAll(per),earnedN=list.filter(s=>s.earned).length;
  const cats=Object.keys(BCAT).filter(c=>list.some(s=>s.b.cat===c));
  return bdgStage(per,list)+`<div class="card"><div class="row between"><div><h3>Moje odznaky</h3><p class="xs mut">Tvar = kategória · kov = úroveň (bronz, striebro, zlato, slnko) · farba = význam (výroba, spotreba, zdieľanie, batéria)</p></div>${pill('n',earnedN+' / '+list.length+' získaných')}</div>
   ${cats.map(c=>{const L=list.filter(s=>s.b.cat===c),n=L.filter(s=>s.earned).length;return `<details class="bdg-group" open><summary><span>${BCAT[c].name}</span><span class="xs mut">${BCAT[c].sub} · ${n}/${L.length}</span></summary><div class="bdg-grid">${L.map(st=>{const b=st.b;
     return `<button class="bdg-item ${st.earned?'':'locked'} ${BDG().fresh[b.id]?'fresh':''}" data-act="bdg:${b.id}" aria-label="${esc(st.secret?'Tajný odznak':b.name)}, ${st.earned?'získaný':'zatiaľ nezískaný'}"><span class="bdg-ico">${badgeSvg(st)}</span><b>${esc(st.secret?'???':b.name)}</b>${bdgStatus(st)}</button>`}).join('')}</div></details>`}).join('')}
   <p class="note">Odznaky sa udeľujú až po overení podľa merania IMS a nikdy nie za vyššiu spotrebu. Nemajú peňažnú hodnotu. Opakovateľné odznaky ukazujú, koľkokrát ste ich získali.</p></div>`;
}
function bdgMini(per){
  const L=bdgAll(per).filter(s=>s.earned).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,4);
  return `<div class="bdg-mini">${L.map(st=>`<button class="bdg-mini-i" data-act="bdg:${st.b.id}" title="${esc(st.b.name)}" aria-label="${esc(st.b.name)}">${badgeSvg(st)}</button>`).join('')}<button class="link" data-act="rwtab:bdg">Všetky odznaky →</button></div>`;
}
const rewardTabs=()=>`<div class="seg" role="tablist" aria-label="Odmeny">${[['ch','Výzvy'],['bdg','Odznaky']].map(([k,l])=>`<button role="tab" data-act="rwtab:${k}" aria-pressed="${(S.rwtab||'ch')===k}">${l}</button>`).join('')}</div>`;

/* ---------- detail a odomknutie (modál) ---------- */
function bdgModal(id,isNew){
  const per=S.persona==='anna'?'anna':'peter',b=BADGES.find(x=>x.id===id);if(!b)return '';
  const st=bdgState(b,bdgCtx());
  const tiers=b.kind==='tier'?`<div class="bdg-tiers">${b.tiers.map((th,i)=>`<div class="${st.tier>=i?'':'locked'}"><span class="bdg-ico">${badgeSvg({...st,secret:false},{tier:i})}</span><span class="xs">${fm(th,0)} ${b.unit}</span></div>`).join('')}</div>`:'';
  return `<div class="modal-bg" data-act="closemodal"><div class="modal bdg-modal" role="dialog" aria-modal="true" aria-label="${isNew?'Nový odznak':'Detail odznaku'}: ${esc(st.secret?'tajný':b.name)}">
   <div class="bdg-mstage ${isNew?'new':''}">${isNew?'<span class="bdg-rays" aria-hidden="true"></span>':''}<button class="btn ghost sm bdg-x-btn" data-act="closemodal" aria-label="Zavrieť">✕</button>
    ${isNew?'<span class="kicker">Nový odznak!</span>':`<span class="kicker">${BCAT[b.cat].name}</span>`}
    <div class="bdg-big ${st.earned?'':'locked'}">${badgeSvg(st)}<span class="bdg-pedestal" aria-hidden="true"></span></div>
    <h2>${esc(st.secret?'Tajný odznak':b.name)}${b.kind==='rep'&&st.earned?` <span class="bdg-x">×${st.count}</span>`:''}</h2>
    <p>${st.earned?'Získané '+fdate(st.date):st.secret?'Odhalí sa, keď ho získate.':'Zatiaľ nezískaný'}</p></div>
   <div style="padding:18px 20px 20px">
    <p>${esc(st.secret?'Tento odznak je prekvapenie. Patrí k Slnečnej banke a AI správcovi.':b.how)}</p>
    ${!st.secret&&(st.prog)?`<div style="margin-top:12px">${bdgBar(st.prog)}</div>`:''}
    ${b.kind!=='once'?`<p class="sm mut" style="margin-top:10px">${esc(bdgLine(st))}</p>`:''}
    ${tiers}
    <div class="row" style="margin-top:16px">${st.earned?`<button class="btn pri" data-act="bdgshare:${b.id}">Zdieľať</button>`:''}${isNew&&curView()!=='rewards'?`<button class="btn" data-act="bdgopen:${b.id}">Zobraziť v Odmenách</button>`:''}<button class="btn" data-act="closemodal">Zavrieť</button></div>
   </div></div></div>`;
}

/* ---------- odomykanie počas dema ---------- */
function checkBadges(){
  const per=S.persona;if(per!=='anna'&&per!=='peter')return;
  if(PUB.includes(curView()))return;
  const B=BDG(),list=bdgAll(per),ids=new Set(list.flatMap(s=>s.ids)),cnt={};list.forEach(s=>{if(s.b.kind==='rep')cnt[s.b.id]=s.count});
  /* „videné“ = iba história, bez dneška – dnešné odomknutie sa tak ukáže aj po pretočení dňa */
  if(!B.seen[per]){const h=bdgAll(per,BDG_ZERO);B.seen[per]=h.flatMap(s=>s.ids);B.cnt[per]=Object.fromEntries(h.filter(s=>s.b.kind==='rep').map(s=>[s.b.id,s.count]))}
  const seen=new Set(B.seen[per]),fresh=[...ids].filter(i=>!seen.has(i));
  for(const [k,v] of Object.entries(cnt)){const old=B.cnt[per][k]||0;if(v>old&&old>0&&!fresh.includes(k)){const b=BADGES.find(x=>x.id===k);toast(`Odznak ${b.name} ×${v}`)}B.cnt[per][k]=Math.max(old,v)}
  if(!fresh.length)return;
  fresh.forEach(i=>seen.add(i));B.seen[per]=[...seen];
  const id=fresh[0].split('@')[0],b=BADGES.find(x=>x.id===id);B.fresh[id]=true;B.sel[per]=id;
  logEv(`${nm(per)}: nový odznak – ${b.name}`);
  if(S.tourOn||S.modal){toast('Nový odznak: '+b.name);return}
  S.modal='bdgnew:'+id;$('#modal').innerHTML=modalHtml();
  const f=$('#modal [role=dialog] button');if(f)f.focus({preventScroll:true});
}
const BDG_ZERO={eod:false,peterVerified:false,peterShift:0,peterPerfect:false,peterSaved:0,annaShared:0,batSold:0,annaVs:0,annaSucc:0,annaErr:1,don:0,gifts:0,eastWest:false,cloudy:false};
/* o polnoci sa dnešok pripočíta do histórie */
function bdgCommitDay(){
  const c=bdgCtx(),B=BDG(),t=todayISO();
  for(const b of BADGES){const base=B.base[b.id]||(B.base[b.id]={}),l=b.live?b.live(c):0;
    if(b.kind==='once'&&l&&!base.date)base.date=t;
    if(b.kind==='rep'&&!b.count&&l){base.count=(base.count||0)+1;base.date=t}
    if(b.kind==='tier'){const v0=base.val||0,v1=v0+(+l||0);base.dates=base.dates||{};b.tiers.forEach(th=>{if(v1>=th&&v0<th)base.dates[th]=t});base.val=v1}}
  B.fresh={};
}

/* ---------- zdieľanie: karta 1080×1350 ako PNG ---------- */
function bdgShare(id){
  const b=BADGES.find(x=>x.id===id),st=bdgState(b,bdgCtx());if(!st.earned){toast('Tento odznak ešte nemáte');return}
  const dk=tokHex('--surface-dark'),ac=tokHex('--accent-dark'),inner=badgeSvg(st).replace('<svg ','<svg x="290" y="300" width="500" height="500" ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><defs><radialGradient id="sp" cx=".5" cy=".18" r=".7"><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
   <rect width="1080" height="1350" fill="${dk}"/><rect width="1080" height="1350" fill="url(#sp)"/>
   <text x="540" y="170" font-family="Arial,sans-serif" font-size="34" font-weight="800" letter-spacing="6" fill="${ac}" text-anchor="middle">ZÍSKAL(A) SOM ODZNAK</text>
   <ellipse cx="540" cy="860" rx="230" ry="38" fill="#000" opacity=".45"/><ellipse cx="540" cy="848" rx="230" ry="38" fill="#ffffff" opacity=".08"/>
   ${inner}
   <text x="540" y="990" font-family="Arial,sans-serif" font-size="68" font-weight="800" fill="#ffffff" text-anchor="middle">${esc(b.name)}${b.kind==='rep'?' ×'+st.count:''}</text>
   <text x="540" y="1060" font-family="Arial,sans-serif" font-size="34" fill="#d9d5e2" text-anchor="middle">${esc(bdgLine(st).slice(0,60))}</text>
   <text x="540" y="1110" font-family="Arial,sans-serif" font-size="30" fill="#b9b4c4" text-anchor="middle">${esc(fdate(st.date))}</text>
   <text x="540" y="1270" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#ffffff" text-anchor="middle">Zdieľňa<tspan fill="${ac}">.</tspan> <tspan font-weight="400" fill="#b9b4c4">slnko od suseda · ${BR()}</tspan></text></svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  img.onload=()=>{try{const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;cv.getContext('2d').drawImage(img,0,0);URL.revokeObjectURL(url);
    cv.toBlob(bl=>{const u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download='zdielna-odznak-'+b.id+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)},'image/png');toast('Karta odznaku stiahnutá')}catch(e){toast('Zdieľanie sa nepodarilo')}};
  img.onerror=()=>{URL.revokeObjectURL(url);toast('Zdieľanie sa nepodarilo')};img.src=url;
}
