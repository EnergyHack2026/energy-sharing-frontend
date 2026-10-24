'use strict';
/* ---------- ikony – jedna sada lineárnych ikon pre celú aplikáciu (24×24, stroke) ---------- */
const ICONS={
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
 shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 chart:'<path d="M3 3v18h18M7 15l4-5 4 3 5-8"/>',
 battery:'<rect x="3" y="6" width="17" height="12" rx="3"/><path d="M22 10v4M7 10v4m4-4v4m4-4v4"/>',
 shop:'<path d="M4 10v10h16V10M3 4h18l-1 6H4L3 4Z"/><path d="M4 10a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5"/>',
 cabin:'<path d="M12 3 3 20h18L12 3Z"/><path d="M9.5 20v-6h5v6M12 3v4"/>',
 plug:'<path d="M9 2v5m6-5v5M6 7h12v4a6 6 0 0 1-12 0V7Zm6 10v5"/>',
 car:'<path d="m4 10 2-6h12l2 6M3 10h18v9H3v-9Zm2 9v2m14-2v2M6 14h2m8 0h2"/>',
 gift:'<path d="M3 8h18v5H3zM5 13v8h14v-8M12 8v13"/><path d="M12 8C3 8 6 0 10 4l2 4Zm0 0c9 0 6-8 2-4l-2 4Z"/>',
 home:'<path d="m2 11 10-9 10 9M5 9v12h14V9M9 21v-7h6v7"/>',
 leaf:'<path d="M20 3C7 1 1 10 7 17s16-1 13-14ZM5 21 17 7"/>',
 market:'<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
 group:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.6a3.4 3.4 0 0 1 0 6.8M18 14.8c1.9.7 3.2 2.4 3.5 5.2"/>',
 star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14"/>',
 bulb:'<path d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5"/>',
 sliders:'<path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
 coins:'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.7-2.7-3-6-3"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 chat:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
 console:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m5 0h5"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
 heart:'<path d="M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.4 12 20 12 20Z"/>',
 bank:'<path d="M3 10 12 4l9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"/>',
 bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1m6-1v1M9 17h6"/>',
 city:'<path d="M3 21h18M5 21V10l5-3v14m0-9h5V6l4 2v13"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 sunrise:'<path d="M3 18h18M5 21h14M12 3v4m-7.8 3.2 2.1 2.1m13.5-2.1-2.1 2.1M7 18a5 5 0 0 1 10 0"/>',
 play:'<path d="M7 4.5v15l12-7.5-12-7.5Z"/>',
 print:'<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
 plug:'<path d="M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0V8Zm6 9v4"/>',
 grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
 pump:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="10" cy="12" r="3.5"/><path d="M10 8.5v7M6.5 12h7M17 9v6"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 /* typy odberných miest (sprievodca registrácie) – každý s odlišnou siluetou */
 om_house:'<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5M10 21v-6h4v6M16 5.5V3.5h2.5v4"/>',
 om_flat:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1.5m3 0H15M9 11h1.5m3 0H15M9 15h1.5m3 0H15M10.5 21v-3h3v3"/>',
 om_shop:'<path d="M5.5 4h13L20 9H4l1.5-5Z"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5 12v9h14v-9M10 21v-5h4v5"/>',
 om_cabin:'<path d="M12 3 3 21h18L12 3Z"/><path d="M10 21v-5h4v5M8 13h8"/>',
 om_garage:'<path d="M3 9.5 12 4l9 5.5V21H3V9.5Z"/><path d="M7 21v-8h10v8M7 15.7h10M7 18.4h10"/>',
 om_other:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'
};
function icon(name,cl='icon'){return `<svg class="${cl}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.sun}</svg>`}
/* názov meny iWatt; červená bodka nad i iba v hlavnom nadpise stránky iWatt odmien (IWT_SIG) */
const IWT='iWatt';
const IWT_SIG='<span class="iwt"><span class="iwt-i">ı</span>Watt</span>';
/* ---------- odberné miesto: typ objektu, ikona a štítky profilu – rovnaké na všetkých obrazovkách ---------- */
const OM_TYPES=[['om_house','Dom'],['om_flat','Byt'],['om_shop','Prevádzka'],['om_cabin','Chata'],['om_garage','Garáž'],['om_other','Iné']];
const OM_LEGACY={'Domácnosť':'om_house','Podnikanie (bistro)':'om_shop','Podnikanie':'om_shop'};   /* staršie hodnoty v uloženom stave */
const omKind=t=>OM_LEGACY[t]||(OM_TYPES.some(([k])=>k===t)?t:'om_house');
const omLabel=t=>OM_TYPES.find(([k])=>k===omKind(t))[1];
const omIc=(t,cl='')=>`<span class="om-ic ${cl}" title="${omLabel(t)}">${icon(omKind(t))}</span>`;
const omTags=prod=>`<span class="om-tags">${prod?`<span class="om-tag prod"><i>${icon('sun')}</i>Výroba</span>`:''}<span class="om-tag cons"><i>${icon('plug')}</i>Spotreba</span></span>`;
/* výberové pole typu objektu s ikonou zvoleného typu */
const omTypeField=(k,v,label='Typ objektu')=>`<label class="f"><span>${label}</span><span class="om-sel">${icon(omKind(v))}<select data-k="${k}" data-t="s">${OM_TYPES.map(([x,l])=>`<option value="${x}" ${x===omKind(v)?'selected':''}>${l}</option>`).join('')}</select></span></label>`;
/* ---------- UI helpers ---------- */
const F=(label,k,o={})=>{
  const v=getPath(k),t=o.t||'n';
  if(t==='n')return `<label class="f"><span>${label}</span><span class="fi"><input data-k="${k}" data-t="n" type="number" inputmode="decimal" step="${o.step||0.01}" min="${o.min??0}" ${o.max!=null?`max="${o.max}"`:''} value="${v}">${o.u?`<em>${o.u}</em>`:''}</span></label>`;
  if(t==='t')return `<label class="f"><span>${label}</span><input data-k="${k}" data-t="t" type="time" step="900" value="${v}"></label>`;
  if(t==='c')return `<label class="f chk"><input data-k="${k}" data-t="c" type="checkbox" ${v?'checked':''}><span>${label}</span></label>`;
  if(t==='s')return `<label class="f"><span>${label}</span><select data-k="${k}" data-t="s">${o.opts.map(x=>Array.isArray(x)?`<option value="${x[0]}" ${x[0]===v?'selected':''}>${x[1]}</option>`:`<option value="${x}" ${x===v?'selected':''}>${x}</option>`).join('')}</select></label>`;
  if(t==='i')return `<label class="f"><span>${label}</span><select data-k="${k}" data-t="i">${Array.from({length:96},(_,i)=>`<option value="${i}" ${i===+v?'selected':''}>${I2T(i)}–${I2T(i+1)}</option>`).join('')}</select></label>`;
  if(t==='x')return `<label class="f"><span>${label}</span><input data-k="${k}" data-t="x" type="text" value="${esc(v)}"></label>`;
  if(t==='r')return `<label class="f"><span>${label}: <b style="color:var(--ink)">${v}${o.u||''}</b></span><input data-k="${k}" data-t="n" type="range" min="${o.min??0}" max="${o.max??100}" step="${o.step||1}" value="${v}"></label>`;
  return '';
};
const pill=(c,t)=>`<span class="pill ${c}">${t}</span>`;
const kpi=(l,v,d='',c='')=>`<div class="card kpi"><div class="l">${l}</div><div class="v ${c}">${v}</div>${d?`<div class="d">${d}</div>`:''}</div>`;
/* hero pás na začiatku každej obrazovky – rovnaký jazyk ako úvodná stránka
   o: {kicker,title,lead,acts,aside,top,foot,cls} */
/* červená bodka – podpis značky: iba posledná bodka nadpisu, nikdy dve za sebou */
const sig=t=>String(t).replace(/\.((?:<\/em>)?)\s*$/,'<span class="sig">.</span>$1');
function hero(o){
  return `<section class="card hero ${o.cls||''}">${o.top?`<div class="hero-status">${o.top}</div>`:''}<div class="hero-grid${o.aside?'':' one'}"><div>${o.kicker?`<span class="kicker">${o.kicker}</span>`:''}<h1>${sig(o.title)}</h1>${o.sub?`<div class="hero-sub">${o.sub}</div>`:''}${o.lead?`<p class="lead">${o.lead}</p>`:''}${o.acts?`<div class="row hero-acts">${o.acts}</div>`:''}${o.extra||''}</div>${o.aside?`<div class="hero-aside">${o.aside}</div>`:''}</div>${o.foot?`<div class="hero-foot">${o.foot}</div>`:''}</section>`;
}
const hstat=(tag,val,sub='',cls='')=>`<div class="hstat ${cls}"><span class="tag">${tag}</span><b>${val}</b>${sub?`<span>${sub}</span>`:''}</div>`;
const secHead=(k,t,l='')=>`<div class="sec-head"><div>${k?`<span class="kicker">${k}</span>`:''}<h2>${sig(t)}</h2></div>${l?`<p class="lead">${l}</p>`:''}</div>`;
function feeTxt(){return S.fee.mode===FEE_PCT?fm(S.fee.pct,1)+' % z tržby':fm(S.fee.fix,1)+' €/MWh ('+fpr(S.fee.fix/1000)+' €/kWh) vr. DPH'}
function priceWarn(){
  const np=netPrice(S.p.price);
  if(np<0)return `<div class="pill r" style="margin-top:8px">⚠ Provízia ${BR()} (${feeTxt()}) je vyššia než vaša cena – rozdiel doplatíte inkasom</div>`;
  if(np<S.p.feedin)return `<div class="pill o" style="margin-top:8px">⚠ Čistá cena ${fpr(np)} €/kWh je nižšia než výkupná ${fpr(S.p.feedin)} €/kWh – zdieľanie sa vám neoplatí</div>`;
  return '';
}
const batWarnHtml=()=>{const w=batWarn();return w.length?`<div class="warn">${w.map(([c,t])=>pill(c,'⚠ '+t)).join('')}</div>`:''};
function feeInfo(){const np=netPrice(S.p.price),d=np-S.p.feedin;return `<div class="card" style="margin-top:12px;border-left:5px solid var(--brand)"><b>Koľko vám zostane</b><div class="sm" style="margin-top:4px">Odberateľ platí <b>${fpr(S.p.price)} €/kWh</b>. Provízia ${BR()} <b>${feeTxt()}</b> sa účtuje iba z predanej energie. Vám zostane <b>${fpr(np)} €/kWh</b>; pri výkupe by ste dostali ${fpr(S.p.feedin)} €/kWh, rozdiel je <b style="color:${d>=0?'var(--green)':'var(--red)'}">${d>=0?'+':''}${fpr(d)} €/kWh</b>.</div>${S.bat.on?`<div class="sm" style="margin-top:6px">🔋 Večer z batérie: ${fpr(S.bat.price)} €/kWh → po provízii <b>${fpr(netPrice(S.bat.price))} €/kWh</b>.</div>`:''}<div class="xs mut" style="margin-top:4px">Nenasdieľané prebytky predáte ďalej svojmu výkupcovi.</div></div>`}
function condList(){return `<details><summary>Podmienky účasti (ukážka)</summary><ul class="sm mut" style="margin:8px 0 0 18px;padding:0"><li>Odberné miesto môže byť naraz iba v jednej skupine.</li><li>Výrobca ponecháva svoju zmluvu o výkupe – nenasdieľaná energia ide jeho výkupcovi.</li><li>Výrobca je vlastníkom alebo oprávneným užívateľom výrobne; odberateľ je odberateľom na danom OM.</li><li>Na zdieľanie je potrebné inteligentné meranie (IMS) s 15-minútovými údajmi.</li><li>Vstup potvrdzuje po kontrole distribútor, ktorý ho môže zamietnuť.</li><li>Zdieľanie sa spúšťa k 1. dňu nasledujúceho mesiaca.</li><li>Výpoveď: členstvo sa končí ku koncu nasledujúceho mesiaca, do inej skupiny je možné vstúpiť až potom.</li></ul></details>`}
function settleCard(){
  const st=[['Po skončení mesiaca','Systém uzavrie 15-minútové alokácie a skontroluje súčty.'],['Do 5. dňa','Návrh vyúčtovania – každý vidí svoje alokácie, ceny a sumy.'],['Do 10. dňa',`Vyúčtovanie: odberateľ platí inkasom, výrobcovi sa zo sumy odpočíta provízia ${BR()}.`],['Do 20. dňa','Výplata výrobcovi. Ak je provízia vyššia než príjem, rozdiel sa doplatí inkasom.']];
  return `<div class="card"><h3>Ako prebieha mesačné vyúčtovanie</h3><div class="gap" style="margin-top:8px">${st.map((s,i)=>`<div class="row" style="align-items:flex-start;flex-wrap:nowrap"><span class="pill b" style="min-width:26px;justify-content:center">${i+1}</span><div><b>${s[0]}</b><div class="xs mut">${s[1]}</div></div></div>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn sm" data-act="rtab:inv">Pozrieť ukážku vyúčtovania →</button><span class="xs mut">Ukážkový harmonogram prototypu.</span></div></div>`;
}
const confPill=c=>pill(c==='vysoká'?'g':c==='stredná'?'o':'r','Istota odhadu: '+c);
function stepper(m){
  const L=['Profil dokončený','Skupina vybraná','Žiadosť odoslaná','Čaká na aktiváciu','Aktívne zdieľanie'];
  const st=i=>{if(m==='PENDING')return i<3?'done':i===3?'now':'';if(isAct(m))return 'done';if(m==='NONE')return i===0?'done':'';return i<=1?'done':''};
  return `<div class="steps" role="list">${L.map((l,i)=>{const c=st(i),sym=c==='done'?'✓':c==='now'?'●':'○';return `<div class="step ${c}" role="listitem"><span class="d" aria-hidden="true">${sym}</span><span>${l}${c==='now'?' (prebieha)':''}</span></div>`}).join('')}</div>`;
}
function mono(pts){
  const n=pts.length;if(n<2)return '';
  const dx=[],m=[];
  for(let i=0;i<n-1;i++){dx.push(pts[i+1][0]-pts[i][0]);m.push((pts[i+1][1]-pts[i][1])/dx[i])}
  const t=[m[0]];
  for(let i=1;i<n-1;i++)t.push(m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2);
  t.push(m[n-2]);
  for(let i=0;i<n-1;i++){
    if(m[i]===0){t[i]=0;t[i+1]=0;continue}
    const a=t[i]/m[i],b=t[i+1]/m[i],s=a*a+b*b;
    if(s>9){const k=3/Math.sqrt(s);t[i]=k*a*m[i];t[i+1]=k*b*m[i]}
  }
  let d=`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for(let i=0;i<n-1;i++){const h=dx[i]/3;d+=`C${(pts[i][0]+h).toFixed(1)},${(pts[i][1]+t[i]*h).toFixed(1)} ${(pts[i+1][0]-h).toFixed(1)},${(pts[i+1][1]-t[i+1]*h).toFixed(1)} ${pts[i+1][0].toFixed(1)},${pts[i+1][1].toFixed(1)}`}
  return d;
}
let chartUid=0;
function chart(res,o={}){
  const uid='c'+(++chartUid);
  const W=720,H=272,L=40,R=12,T=28,B=30,lo=24,hi=S.bat.on?92:80,idx=o.idx??96;
  const P=res.P,A=res.A,sh=res.share;
  const x=i=>L+(W-L-R)*(i-lo)/(hi-lo);
  const aa=A.a.map(v=>v*sh);
  const mx=Math.max(.25,...P.fpFull.slice(lo,hi),...P.fc.slice(lo,hi),...aa.slice(lo,hi),...A.c.slice(lo,hi))*1.18;
  const y=v=>T+(H-T-B)*(1-v/mx);
  const pts=(arr,a,b)=>{const p=[];for(let i=a;i<b;i++)p.push([x(i+.5),y(arr[i])]);return p};
  const line=(arr,a,b)=>mono(pts(arr,a,b));
  const area=(arr,a,b)=>{if(b-a<2)return '';const p=pts(arr,a,b);return mono(p)+`L${p[p.length-1][0].toFixed(1)},${y(0).toFixed(1)}L${p[0][0].toFixed(1)},${y(0).toFixed(1)}Z`};
  const shared=new Array(96).fill(0),sBat=new Array(96).fill(0);
  for(const r of res.recs)if(r.i<idx&&!r.kind&&(!o.who||r.from===o.who||r.to===o.who)){shared[r.i]+=r.kwh;if(r.src==='bat')sBat[r.i]+=r.kwh}
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Graf výroby, spotreby a zdieľanej energie počas dňa" style="display:block;overflow:visible">`;
  s+=`<defs>
   <linearGradient id="${uid}y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--yellow)" stop-opacity=".38"/><stop offset="1" stop-color="var(--yellow)" stop-opacity=".02"/></linearGradient>
   <linearGradient id="${uid}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--green)" stop-opacity=".55"/><stop offset="1" stop-color="var(--green)" stop-opacity=".08"/></linearGradient>
   <linearGradient id="${uid}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--purple)" stop-opacity=".6"/><stop offset="1" stop-color="var(--purple)" stop-opacity=".1"/></linearGradient>
   <linearGradient id="${uid}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--blue)" stop-opacity=".16"/><stop offset="1" stop-color="var(--blue)" stop-opacity="0"/></linearGradient>
  </defs>`;
  for(let k=0;k<=4;k++){const v=mx*k/4;s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1" ${k?'stroke-dasharray="2 5"':''} opacity="${k?.8:1}"/><text x="${L-8}" y="${y(v)+3.5}" font-size="10" fill="var(--mut)" text-anchor="end">${fm(v,2)}</text>`}
  s+=`<text x="4" y="${T-14}" font-size="9" fill="var(--mut)">kWh / 15 min</text>`;
  for(let h=6;h*4<=hi;h+=2)s+=`<text x="${x(h*4)}" y="${H-10}" font-size="10" fill="var(--mut)" text-anchor="middle">${pad(h)}:00</text>`;
  if(S.bat.on){const ea=Math.max(lo,res.eS??T2I(S.bat.eStart)),eb=Math.min(hi,res.eE??T2I(S.bat.eEnd));if(eb>ea)s+=`<rect x="${x(ea)}" y="${T}" width="${x(eb)-x(ea)}" height="${H-T-B}" fill="var(--purple)" opacity=".06"/><text x="${(x(ea)+x(eb))/2}" y="${T+14}" font-size="10.5" font-weight="700" fill="var(--purple)" text-anchor="middle">🔋 večer z batérie</text>`}
  if(o.win&&o.win.a!=null){const wx=x(o.win.a),ww=x(o.win.b)-wx;s+=`<rect x="${wx}" y="${T}" width="${ww}" height="${H-T-B}" rx="10" fill="var(--yellow)" opacity=".12" stroke="var(--yellow)" stroke-opacity=".5" stroke-dasharray="3 4"/><text x="${wx+ww/2}" y="${T+14}" font-size="10.5" font-weight="700" fill="var(--yellow)" text-anchor="middle">☀ najlepšie okno ${I2T(o.win.a)}–${I2T(o.win.b)}</text>`}
  if(o.band){const u=UNC[S.p.conf]||.2,up=pts(P.fpFull.map(v=>v*(1+u)),lo,hi),dn=pts(P.fpFull.map(v=>v*(1-u)),lo,hi).reverse();s+=`<path d="${mono(up)}L${dn[0][0].toFixed(1)},${dn[0][1].toFixed(1)}${mono(dn).replace(/^M[^C]*/,'')}Z" fill="var(--yellow)" opacity=".2"/>`}
  const e=Math.max(lo,Math.min(hi,idx));
  if(o.forecast){
    s+=`<path d="${area(P.fpFull,lo,hi)}" fill="url(#${uid}y)"/>`;
    if(S.bat.on){const bs=batSupply(res);s+=`<path d="${area(bs,lo,hi)}" fill="url(#${uid}p)"/>`}
  }else{
    s+=`<path d="${area(aa,lo,e)}" fill="url(#${uid}y)"/>`;
    s+=`<path d="${area(A.c,lo,e)}" fill="url(#${uid}b)"/>`;
    s+=`<path d="${area(shared,lo,e)}" fill="url(#${uid}g)"/><path d="${line(shared,lo,e)}" fill="none" stroke="var(--green)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`;
    if(S.bat.on)s+=`<path d="${area(sBat,lo,e)}" fill="url(#${uid}p)"/>`;
  }
  s+=`<path d="${line(P.fp,lo,hi)}" fill="none" stroke="var(--yellow)" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round" opacity=".85"/>`;
  s+=`<path d="${line(P.fc,lo,hi)}" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round" opacity=".85"/>`;
  if(!o.forecast){
    if(e-lo>=2){s+=`<path d="${line(aa,lo,e)}" fill="none" stroke="var(--yellow)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><path d="${line(A.c,lo,e)}" fill="none" stroke="var(--blue)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`}
    if(idx>lo&&idx<hi){const cx=x(idx);s+=`<line x1="${cx}" x2="${cx}" y1="${T}" y2="${H-B}" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="2 3"/><circle cx="${cx}" cy="${y(aa[Math.max(lo,idx-1)])}" r="4" fill="var(--yellow)" stroke="var(--card)" stroke-width="2"/><circle cx="${cx}" cy="${y(A.c[Math.max(lo,idx-1)])}" r="4" fill="var(--blue)" stroke="var(--card)" stroke-width="2"/><text x="${cx+6}" y="${H-B-6}" font-size="11" font-weight="700" fill="var(--brand)">${I2T(idx)}</text>`}
  }
  s+='</svg>';
  const bl=S.bat.on?`<span><i style="border-color:var(--purple);border-top-width:6px"></i>${o.forecast?'odhad predaja z batérie':'predaj z batérie'}</span>`:'';
  const lg=o.forecast?`<span><i style="border-color:var(--yellow);border-top-style:dashed"></i>odhad výroby (prebytok)</span><span><i style="border-color:var(--blue);border-top-style:dashed"></i>odhad spotreby</span>${o.band?'<span>▒ rozpätie odhadu</span>':''}${bl}`:
   `<span><i style="border-color:var(--yellow)"></i>skutočný prebytok</span><span><i style="border-color:var(--blue)"></i>skutočná spotreba</span><span><i style="border-color:var(--green);border-top-width:6px"></i>zdieľaná časť</span>${bl}<span><i style="border-color:var(--yellow);border-top-style:dashed"></i>odhad výroby</span><span><i style="border-color:var(--blue);border-top-style:dashed"></i>odhad spotreby</span>`;
  return s+`<div class="legend">${lg}</div>`;
}
/* ---------- prehrávač dňa (Domov): graf pre laika + popisy vypočítané z dát ---------- */
const PL_LO=24,PL_HI=92;
/* série pre osobu: sun = prebytok strechy, use = spotreba, sh = zdieľané cez deň, bat = z batérie, out = výkupca */
function storySeries(res,per){
  const z=()=>new Array(96).fill(0),sh=z(),bat=z();
  for(const r of res.recs){if(r.kind)continue;if(per==='peter'?r.to==='peter':r.from==='anna'){if(r.src==='bat')bat[r.i]+=r.kwh;else sh[r.i]+=r.kwh}}
  return {sun:res.A.a.map(v=>v*res.share),use:res.A.c,sh,bat,out:res.R.vykup};
}
function dayNotes(res,per){
  const X=storySeries(res,per),P=res.P,w=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i]))),N=[];
  const first=(a,t=.01,from=PL_LO)=>{for(let i=from;i<PL_HI;i++)if(a[i]>t)return i;return -1};
  const add=(i,txt)=>{if(i>=PL_LO&&i<=PL_HI)N.push({i,txt})};
  const a=agg(res),sunS=first(X.sun,.05);
  if(per==='peter'){
    add(PL_LO,'Ráno beriete elektrinu zo siete – susedove panely ešte nevyrábajú.');
    if(sunS>=0)add(sunS,'Slnko na streche suseda už vyrába viac, než sám minie.');
    const fs=first(X.sh);if(fs>=0&&fs>sunS+1)add(fs,'Prvá elektrina od suseda prichádza k vám.');
    if(w)add(w.a,`Najlepší čas do ${I2T(w.b)}: elektrina od suseda je lacnejšia (${fpr(S.p.price)} € namiesto ${fpr(S.c.ref)} € zo siete).`);
    let pk=-1,pv=0;for(let i=PL_LO;i<PL_HI;i++)if(X.sh[i]>pv){pv=X.sh[i];pk=i}
    if(pk>=0&&(!w||Math.abs(pk-w.a)>=3))add(pk,`Najviac naraz: ${fm(pv,2)} kWh za 15 minút od suseda.`);
    const fb=first(X.bat);
    if(fb>=0)add(fb,'Slnko zapadlo – teraz vám svieti batéria suseda.');
    else{let le=-1;for(let i=PL_LO;i<PL_HI;i++)if(X.sh[i]>.01)le=i;if(le>=0)add(le+1,'Slnko slabne – zvyšok dňa beriete zo siete.')}
    add(PL_HI,`Spolu ${fm(a.peter.recv,1)} kWh od suseda · úspora ${eur(a.peter.saved)}.`);
  }else{
    add(PL_LO,'Ráno strecha ešte nevyrába – domácnosť ide zo siete.');
    if(sunS>=0)add(sunS,'Panely vyrábajú viac, než minie domácnosť – prebytok ide susedom.');
    if(w)add(w.a,`Do ${I2T(w.b)} susedia berú najviac – predávate za ${fpr(S.p.price)} €/kWh.`);
    const fc=first(res.R.ch),fo=first(X.out);
    if(fc>=0)add(fc,'Susedia už majú dosť – zvyšok sa ukladá do batérie na večer.');
    if(fo>=0&&(fc<0||fo-fc>=2))add(fo,fc>=0?'Batéria je plná – zvyšok ide výkupcovi.':'Susedia už majú dosť – zvyšok ide výkupcovi.');
    const fb=first(X.bat);if(fb>=0)add(fb,`Večer predávate z batérie za ${fpr(S.bat.price)} €/kWh.`);
    add(PL_HI,`Spolu predané ${fm(a.anna.shared+a.anna.batSold,1)} kWh · čistý príjem ${eur(a.anna.net)}.`);
  }
  N.sort((x,y)=>x.i-y.i);
  for(let k=1;k<N.length;k++)if(N[k].i-N[k-1].i<2)N[k].i=Math.min(PL_HI,N[k-1].i+2);
  return N;
}
function storyChart(res,per,o){
  const W=760,H=300,L=46,R=18,T=30,B=34,lo=PL_LO,hi=PL_HI,idx=clamp(o.idx,lo,hi),X=storySeries(res,per),P=res.P;
  const x=i=>L+(W-L-R)*(i-lo)/(hi-lo);
  const base=per==='peter'?[X.use,X.sun]:[X.sun];
  const mx=Math.max(.3,...base.flatMap(a=>a.slice(lo,hi)),...(o.est?[...P.fpFull.slice(lo,hi).map(v=>v*res.share),...P.fc.slice(lo,hi)]:[]))*1.15;
  const y=v=>T+(H-T-B)*(1-v/mx);
  const pts=(a,e=hi)=>{const p=[];for(let i=lo;i<=e&&i<96;i++)p.push([x(i),y(a[i])]);return p};
  const line=(a,e)=>mono(pts(a,e)),area=(a,e=hi)=>{const p=pts(a,e);return p.length<2?'':mono(p)+`L${p[p.length-1][0].toFixed(1)},${y(0)}L${p[0][0].toFixed(1)},${y(0)}Z`};
  const w=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Priebeh dňa do ${I2T(idx)}"><defs><clipPath id="plclip"><rect x="0" y="0" width="${x(idx)}" height="${H}"/></clipPath></defs>`;
  for(let k=1;k<=3;k++){const v=mx*k/3.45;s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="2 6"/><text x="${L-8}" y="${y(v)+4}" font-size="12" fill="var(--mut)" text-anchor="end">${fm(v,1)}</text>`}
  s+=`<line x1="${L}" x2="${W-R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--line-2)"/><text x="4" y="${T-14}" font-size="12" fill="var(--mut)">kWh / 15 min</text>`;
  for(let h=6;h<=21;h+=3)s+=`<text x="${x(h*4)}" y="${H-10}" font-size="12" fill="var(--mut)" text-anchor="middle">${pad(h)}:00</text>`;
  if(w)s+=`<rect x="${x(w.a)}" y="${T}" width="${x(w.b)-x(w.a)}" height="${H-T-B}" rx="10" fill="var(--yellow-t)"/><text x="${(x(w.a)+x(w.b))/2}" y="${H-B-8}" font-size="12" font-weight="800" fill="var(--yellow-ink)" text-anchor="middle">☀ najlepší čas</text>`;
  if(o.est){s+=`<path d="${line(P.fpFull.map(v=>v*res.share))}" fill="none" stroke="var(--yellow)" stroke-width="1.6" stroke-dasharray="4 5" opacity=".8"/>`;if(per==='peter')s+=`<path d="${line(P.fc)}" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="4 5" opacity=".8"/>`}
  s+=`<g clip-path="url(#plclip)">`;
  s+=`<path d="${area(X.sun)}" fill="var(--yellow)" opacity=".2"/><path d="${line(X.sun)}" fill="none" stroke="var(--yellow)" stroke-width="2.6" stroke-linejoin="round"/>`;
  if(per==='anna')s+=`<path d="${area(X.out)}" fill="var(--orange)" opacity=".28"/>`;
  s+=`<path d="${area(X.sh)}" fill="var(--green)" opacity=".55"/><path d="${area(X.bat)}" fill="var(--purple)" opacity=".55"/>`;
  if(per==='peter')s+=`<path d="${line(X.use)}" fill="none" stroke="var(--blue)" stroke-width="2.6" stroke-linejoin="round"/>`;
  s+=`</g>`;
  const cx=x(idx);s+=`<line x1="${cx}" x2="${cx}" y1="${T}" y2="${H-B}" stroke="var(--surface-dark)" stroke-width="1.5" stroke-dasharray="3 3"/><rect x="${cx-24}" y="${T-24}" width="48" height="18" rx="9" fill="var(--surface-dark)"/><text x="${cx}" y="${T-11}" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${I2T(idx)}</text>`;
  /* očíslované body príbehu */
  (o.notes||[]).forEach((n,k)=>{if(n.i>idx)return;const vy=Math.max(...[X.sun,X.sh,X.bat,per==='peter'?X.use:X.out].map(a=>a[Math.min(95,n.i)]||0)),py=Math.max(T+12,y(vy)-18),on=o.cur===k;
    s+=`<g><line x1="${x(n.i)}" x2="${x(n.i)}" y1="${py+9}" y2="${y(vy)}" stroke="var(--surface-dark)" opacity=".4"/><circle cx="${x(n.i)}" cy="${py}" r="${on?12:10}" fill="${on?'var(--brand)':'var(--surface-dark)'}" stroke="#fff" stroke-width="2"/><text x="${x(n.i)}" y="${py+4}" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">${k+1}</text></g>`});
  return s+'</svg>';
}
/* graf stavu nabitia batérie (SoC) */
function socChart(socA,o={}){
  const W=720,H=180,L=40,R=12,T=16,B=26,cap=Math.max(.1,o.cap),idx=o.idx??96;
  const x=i=>L+(W-L-R)*i/96,y=v=>T+(H-T-B)*(1-v/cap);
  const ch=o.ch||[],dis=o.dis||[],bw=(W-L-R)/96;
  const barMax=Math.max(.05,...ch,...dis);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${o.label||'Stav nabitia batérie počas dňa'}" style="display:block">`;
  for(let k=0;k<=4;k++){const v=cap*k/4;s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" ${k?'stroke-dasharray="2 5"':''}/><text x="${L-6}" y="${y(v)+3.5}" font-size="10" fill="var(--mut)" text-anchor="end">${fm(v,v%1?1:0)}</text>`}
  for(let h=0;h<=24;h+=3)s+=`<text x="${x(h*4)}" y="${H-8}" font-size="10" fill="var(--mut)" text-anchor="middle">${pad(h)}:00</text>`;
  for(let i=0;i<96;i++){if(ch[i]>0){const hh=(H-T-B)*.35*ch[i]/barMax;s+=`<rect x="${x(i)+.5}" y="${H-B-hh}" width="${bw-1}" height="${hh}" fill="var(--green)" opacity=".55"/>`}if(dis[i]>0){const hh=(H-T-B)*.35*dis[i]/barMax;s+=`<rect x="${x(i)+.5}" y="${H-B-hh}" width="${bw-1}" height="${hh}" fill="var(--purple)" opacity=".65"/>`}}
  if(o.min!=null)s+=`<line x1="${L}" x2="${W-R}" y1="${y(o.min)}" y2="${y(o.min)}" stroke="var(--red)" stroke-dasharray="5 4"/><text x="${W-R}" y="${y(o.min)-4}" font-size="10" fill="var(--red)" text-anchor="end">${o.minLbl||'minimum'}</text>`;
  const p=[];for(let i=0;i<96;i++)p.push([x(i+1),y(socA[i])]);
  s+=`<path d="M${x(0)},${y(o.soc0??socA[0])}L${p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join('L')}" fill="none" stroke="var(--c-bat)" stroke-width="2.4" stroke-linejoin="round"/>`;
  if(idx>0&&idx<96)s+=`<line x1="${x(idx)}" x2="${x(idx)}" y1="${T}" y2="${H-B}" stroke="var(--ink)" stroke-dasharray="2 3"/>`;
  s+='</svg>';
  return s+`<div class="legend"><span><i style="border-color:var(--c-bat)"></i>stav nabitia (kWh)</span><span><i style="border-color:var(--green);border-top-width:6px"></i>nabíjanie</span><span><i style="border-color:var(--purple);border-top-width:6px"></i>predaj / vybíjanie</span></div>`;
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2800)}
function caption(m){const c=$('#cap');if(!m){c.classList.remove('show');return}c.innerHTML=`<span style="font-size:20px">🎬</span><div style="flex:1">${m}</div><button class="btn sm" data-act="tourstop">Zastaviť</button>`;c.classList.add('show')}

/* ---------- QR kód (byte mód, úroveň M, verzie 1–6) – vlastný kódovač bez knižníc ---------- */
const QR=(()=>{
  const ECW=[0,10,16,26,18,24,16,18,22,22],NB=[0,1,1,1,2,2,4,4,4,5];
  const raw=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r};
  const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z&255};
  const div=deg=>{const r=new Array(deg).fill(0);r[deg-1]=1;let root=1;for(let i=0;i<deg;i++){for(let j=0;j<r.length;j++){r[j]=mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=mul(root,2)}return r};
  const rem=(data,d)=>{const r=new Array(d.length).fill(0);for(const b of data){const f=b^r.shift();r.push(0);for(let i=0;i<d.length;i++)r[i]^=mul(d[i],f)}return r};
  const align=v=>{if(v===1)return [];const n=Math.floor(v/7)+2,step=Math.ceil((v*4+4)/(n*2-2))*2,res=[6];for(let p=v*4+17-7;res.length<n;p-=step)res.splice(1,0,p);return res};
  return text=>{
    const bytes=Array.from(new TextEncoder().encode(text));
    let v=1;for(;v<=6;v++){const cap=Math.floor(raw(v)/8)-ECW[v]*NB[v];if(12+bytes.length*8<=cap*8)break}
    if(v>6)throw new Error('QR: text je príliš dlhý');
    const rawCw=Math.floor(raw(v)/8),dataCap=rawCw-ECW[v]*NB[v];
    const bits=[],put=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1)};
    put(4,4);put(bytes.length,8);for(const b of bytes)put(b,8);
    put(0,Math.min(4,dataCap*8-bits.length));while(bits.length%8)bits.push(0);
    for(let p=0xEC;bits.length<dataCap*8;p^=0xEC^0x11)put(p,8);
    const data=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];data.push(b)}
    const nb=NB[v],ecl=ECW[v],nShort=nb-rawCw%nb,shortLen=Math.floor(rawCw/nb),dv=div(ecl),blocks=[];
    for(let i=0,k=0;i<nb;i++){const len=shortLen-ecl+(i<nShort?0:1),dat=data.slice(k,k+len);k+=len;blocks.push({dat,ec:rem(dat,dv)})}
    const out=[];for(let i=0;i<=shortLen-ecl;i++)for(const b of blocks)if(i<b.dat.length)out.push(b.dat[i]);
    for(let i=0;i<ecl;i++)for(const b of blocks)out.push(b.ec[i]);
    const n=v*4+17,M=[...Array(n)].map(()=>new Array(n).fill(false)),Fn=[...Array(n)].map(()=>new Array(n).fill(false));
    const set=(x,y,dk)=>{M[y][x]=dk;Fn[y][x]=true};
    for(let i=0;i<n;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
    const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),xx=cx+dx,yy=cy+dy;if(xx>=0&&xx<n&&yy>=0&&yy<n)set(xx,yy,d!==2&&d!==4)}};
    finder(3,3);finder(n-4,3);finder(3,n-4);
    const al=align(v),na=al.length;
    for(let i=0;i<na;i++)for(let j=0;j<na;j++){if((i===0&&j===0)||(i===0&&j===na-1)||(i===na-1&&j===0))continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(al[i]+dx,al[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}
    const fmt=mask=>{const dd=mask;let r=dd;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((dd<<10)|r)^0x5412,g=i=>((b>>>i)&1)===1;
      for(let i=0;i<=5;i++)set(8,i,g(i));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(let i=9;i<15;i++)set(14-i,8,g(i));
      for(let i=0;i<8;i++)set(n-1-i,8,g(i));for(let i=8;i<15;i++)set(8,n-15+i,g(i));set(8,n-8,true)};
    fmt(0);
    let bi=0;for(let right=n-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<n;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?n-1-vert:vert;if(!Fn[y][x]&&bi<out.length*8){M[y][x]=((out[bi>>>3]>>>(7-(bi&7)))&1)===1;bi++}}}
    const MK=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
    const apply=m=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!Fn[y][x]&&MK[m](x,y))M[y][x]=!M[y][x]};
    const pen=()=>{let p=0;for(let y=0;y<n;y++){let run=1;for(let x=1;x<=n;x++){if(x<n&&M[y][x]===M[y][x-1])run++;else{if(run>=5)p+=run-2;run=1}}}
      for(let x=0;x<n;x++){let run=1;for(let y=1;y<=n;y++){if(y<n&&M[y][x]===M[y-1][x])run++;else{if(run>=5)p+=run-2;run=1}}}
      for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){const c=M[y][x];if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])p+=3}
      let dk=0;for(const r of M)for(const c of r)if(c)dk++;return p+Math.floor(Math.abs(dk*20-n*n*10)/(n*n))*10};
    let best=0,bp=1e9;for(let m=0;m<8;m++){apply(m);fmt(m);const p=pen();if(p<bp){bp=p;best=m}apply(m)}
    apply(best);fmt(best);
    return M;
  };
})();
function qrSvg(text,dark='#111',light='#fff'){
  const M=QR(text),n=M.length,q=4,sz=n+q*2;let d='';
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(M[y][x])d+=`M${x+q},${y+q}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sz} ${sz}" shape-rendering="crispEdges" role="img" aria-label="QR kód"><rect width="${sz}" height="${sz}" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`;
}

/* ---------- mapové prvky ---------- */
function skPath(){return 'M'+SK_OUT.map(ll=>prj(ll).map(v=>v.toFixed(1)).join(',')).join('L')+'Z'}
function houseSvg(x,y,o){
  const w=24,h=17,roof=o.roof==='vse'?'var(--vse)':'var(--zse)';
  const glow=clamp(o.glow||0,0,1);
  return `<g class="house ${o.sel?'sel':''}" transform="translate(${(x-w/2).toFixed(1)},${(y-h).toFixed(1)})" ${o.act?`data-act="${o.act}" tabindex="0" role="button" aria-label="${esc(o.aria||o.label||'')}"`:''}>
   <rect class="hl" x="-5" y="-16" width="${w+10}" height="${h+21}" rx="7" fill="${o.own?'var(--card)':'transparent'}" fill-opacity=".55" stroke="${o.own?'var(--ink)':'transparent'}" stroke-dasharray="${o.own?'3 3':''}"/>
   <rect x="2" y="0" width="${w-4}" height="${h}" rx="1.5" fill="${o.noims?'var(--bg)':'#fff'}" stroke="${o.noims?'var(--mut)':'#5d6675'}" stroke-dasharray="${o.noims?'2 2':''}"/>
   <rect x="${w/2-3}" y="${h-8}" width="6" height="8" fill="#5d6675"/>
   <polygon points="-3,1 ${w/2},-12 ${w+3},1" fill="${roof}" stroke="#fff" stroke-width=".8"/>
   ${o.pv?`<polygon points="2,-1.2 ${w/2-1},-9.6 ${w/2-1},-4.5 6.4,-1.2" fill="#1b2f5e" stroke="#fff" stroke-width=".5"/><polygon points="2,-1.2 ${w/2-1},-9.6 ${w/2-1},-4.5 6.4,-1.2" fill="#ffd23f" opacity="${(glow*.85).toFixed(2)}"/>`:''}
   ${o.bat?`<g transform="translate(${w-2},${h-12})"><rect width="9" height="12" rx="2" fill="var(--purple)" stroke="#fff" stroke-width=".8"/><rect x="2.5" y="-2" width="4" height="2" fill="var(--purple)"/><rect x="2" y="${12-2-clamp(o.soc??.6,0,1)*8}" width="5" height="${clamp(o.soc??.6,0,1)*8}" fill="#b9f5c9"/></g>`:''}
   ${o.bistro?`<text x="${w/2}" y="${h-10}" font-size="7" text-anchor="middle">🍽</text>`:''}
   ${o.label?`<text x="${w/2}" y="${h+11}" font-size="9" font-weight="700" fill="var(--ink)" text-anchor="middle" paint-order="stroke" stroke="var(--card)" stroke-width="3">${esc(o.label)}</text>`:''}
  </g>`;
}
/* ---------- nová mapa (tmavý jazyk hero): oblasti, stromy, izometrické domčeky ---------- */
/* uzavretá Catmull-Rom krivka cez body → hladký obrys */
function smoothPath(P,t=.5){const n=P.length;let d=`M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for(let i=0;i<n;i++){const p0=P[(i-1+n)%n],p1=P[i],p2=P[(i+1)%n],p3=P[(i+2)%n];
    const c1=[p1[0]+(p2[0]-p0[0])*t/3,p1[1]+(p2[1]-p0[1])*t/3],c2=[p2[0]-(p3[0]-p1[0])*t/3,p2[1]-(p3[1]-p1[1])*t/3];
    d+=`C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`}
  return d+'Z'}
const polyD=L=>'M'+L.map(ll=>prj(ll).map(v=>v.toFixed(1)).join(',')).join('L')+'Z';
const MAP_TREES=[[18.95,49.3],[19.25,49.3],[19.55,49.18],[19.85,49.02],[19.1,48.98],[19.4,48.5],[19.75,48.55],[19.1,48.28],[19.6,48.35],[19.9,48.45],[18.95,48.88],[19.25,49.05]];
/* podklad mapy: tieň (hrúbka), tri oblasti orezané hladkým obrysom, popisy, stromy v strede */
/* polygón Stredu (medzi hranicami RB_W a RB_E) */
const ssePoly=()=>[[RB_W[0][0],52],...RB_W,[RB_W[RB_W.length-1][0],46],[RB_E[RB_E.length-1][0],46],...[...RB_E].reverse(),[RB_E[0][0],52]];
/* podklad mapy; hi = zvýraznená časť z legendy (zse | sse | vse | …) */
function mapBase(H=420,hi=null){
  const out=smoothPath(SK_OUT.map(prj)),isReg=['zse','sse','vse'].includes(hi),cls=r=>isReg?(hi===r?'hi':'dim'):'';
  const lbl=(ll,k,a,b)=>{const [x,y]=prj(ll);return `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="3" fill="var(--map-${k}-ink)">${a}</text><text x="${x}" y="${y+15}" text-anchor="middle" font-size="9.5" font-weight="700" letter-spacing="1.5" fill="var(--on-dark-mut)">${b}</text>`};
  let trees='';for(const ll of MAP_TREES){const [x,y]=prj(ll);trees+=`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" aria-hidden="true"><ellipse cy="1" rx="6" ry="2.2" fill="rgba(0,0,0,.35)"/><rect x="-.8" y="-6" width="1.6" height="7" fill="#5b4a3a"/><ellipse cy="-11" rx="4.6" ry="7.5" fill="var(--map-tree)"/></g>`}
  return `<defs><clipPath id="skclip"><path d="${out}"/></clipPath><radialGradient id="mapglow" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
   <g fill="none" stroke="rgba(255,255,255,.05)"><circle cx="380" cy="210" r="150"/><circle cx="380" cy="210" r="250"/><circle cx="380" cy="210" r="350"/></g>
   <path d="${out}" fill="rgba(0,0,0,.45)" transform="translate(0,12)"/>
   <g clip-path="url(#skclip)">
    <g class="reg-g ${cls('sse')}"><path d="${polyD(ssePoly())}" fill="var(--map-sse)"/></g>
    <g class="reg-g ${cls('zse')}"><path d="${polyD(sidePoly(RB_W,-1))}" fill="var(--map-zse)"/></g>
    <g class="reg-g ${cls('vse')}"><path d="${polyD(sidePoly(RB_E,1))}" fill="var(--map-vse)"/></g>
    <path d="M${RB_W.map(ll=>prj(ll).join(',')).join('L')}M${RB_E.map(ll=>prj(ll).join(',')).join('L')}" fill="none" stroke="var(--map-edge)" stroke-width="1.2" stroke-dasharray="4 5"/>
    <rect x="0" y="0" width="${MAPW}" height="${H}" fill="url(#mapglow)"/></g>
   <path d="${out}" fill="none" stroke="var(--map-edge)" stroke-width="1.4"/>
   <g class="reg-g ${cls('zse')}">${lbl([18.1,49.02],'zse','ZÁPAD','ZSE')}</g><g class="reg-g ${cls('sse')}">${lbl([19.45,48.72],'sse','STRED','SSE · MIMO SLUŽBY')}${trees}</g><g class="reg-g ${cls('vse')}">${lbl([21.55,49.17],'vse','VÝCHOD','VSE')}</g>`;
}
/* izometrický domček z úvodnej stránky (lpHouse) v mierke mapy; (x,y) = päta domu */
function mapHouse(x,y,o){
  const sc=o.big?.27:.22,roof=o.roof==='vse'?'var(--map-vse-roof)':'var(--map-zse-roof)',glow=clamp(o.glow||0,0,1),soc=clamp(o.soc??.6,0,1);
  return `<g class="house mhouse ${o.sel?'sel':''} ${o.dim?'dim':''} ${o.hi?'hi':''}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" ${o.act?`data-act="${o.act}" tabindex="0" role="button" aria-label="${esc(o.aria||o.label||'')}"`:''}>
   <ellipse cx="0" cy="0" rx="${(19*sc/.22).toFixed(1)}" ry="${(7*sc/.22).toFixed(1)}" fill="rgba(0,0,0,.45)"/>
   <rect class="hl" x="-21" y="-38" width="42" height="44" rx="10" fill="transparent" stroke="${o.noims?'rgba(255,255,255,.55)':'transparent'}" stroke-dasharray="${o.noims?'3 3':''}"/>
   <g transform="translate(${(-95*sc).toFixed(1)},${(-160*sc).toFixed(1)}) scale(${sc})">${lpHouse(roof,'var(--map-wall)',!!o.pv)}${o.pv?`<path d="m47 61 47-27 48 28-47 27Z" fill="var(--yellow)" opacity="${(glow*.75).toFixed(2)}"/>`:''}</g>
   ${o.bat?`<g transform="translate(14,-16)"><rect width="7" height="11" rx="1.6" fill="var(--purple)" stroke="#fff" stroke-width=".7"/><rect x="1.4" y="${(1.4+8.2*(1-soc)).toFixed(1)}" width="4.2" height="${(8.2*soc).toFixed(1)}" fill="#b9f5c9"/></g>`:''}
   ${o.bistro?`<text x="-17" y="-20" font-size="10">🍽</text>`:''}
   ${o.label?`<g transform="translate(0,${o.own?-44:12})"><rect x="${-(o.label.length*3.3+(o.own?14:9))}" y="-9" width="${o.label.length*6.6+(o.own?28:18)}" height="17" rx="8.5" fill="${o.own?'#fff':'rgba(0,0,0,.55)'}" stroke="${o.own?'none':'rgba(255,255,255,.35)'}" stroke-dasharray="${o.own?'':'3 2'}"/>${o.own?`<circle cx="${-(o.label.length*3.3)-5}" cy="-.5" r="3" fill="var(--brand)"/>`:''}<text x="${o.own?4:0}" y="3.5" font-size="10" font-weight="800" fill="${o.own?'var(--ink)':'#fff'}" text-anchor="middle">${esc(o.label)}</text></g>`:''}
  </g>`;
}
/* krivka toku + častice (pohybuje ich spoločná slučka requestAnimationFrame) */
function flowSvg(id,a,b,kwh,color,o={}){
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,bend=o.bend??0.22;
  const cx=mx-dy/len*len*bend,cy=my+dx/len*len*bend;
  const d=`M${a[0].toFixed(1)},${a[1].toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  const on=kwh>1e-4,wd=on?Math.min(7,1.4+kwh*(o.scale||8)):1.2,rm=RM();
  if(o.dot){const w2=on?Math.min(4.5,2+kwh*4):1.6;let t=`<path id="${id}" class="fl" d="${d}" fill="none" stroke="${color}" stroke-width="${w2.toFixed(2)}" stroke-linecap="round" stroke-dasharray="0.1 ${(w2*2.6).toFixed(1)}" opacity="${on?.95:.3}" ${rm&&on?`marker-end="url(#arr_${o.mk||'g'})"`:''} data-k="${kwh.toFixed(4)}"/><circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="3" fill="${color}" opacity="${on?1:.4}"/><circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="3" fill="${color}" opacity="${on?1:.4}"/>`;
    if(on&&!rm){const np=o.n||2;for(let k=0;k<np;k++)t+=`<circle class="fp" data-f="${id}" data-o="${(k/np).toFixed(3)}" r="${(3.2+Math.min(2.5,kwh*3)).toFixed(1)}" fill="${color}" stroke="var(--surface-dark)" stroke-width="1.5" cx="${a[0]}" cy="${a[1]}"/>`}
    return t}
  let s=`<path id="${id}" class="fl" d="${d}" fill="none" stroke="${color}" stroke-width="${wd.toFixed(2)}" stroke-linecap="round" opacity="${on?.55:.18}" ${on?'':'stroke-dasharray="3 5"'} ${rm&&on?`marker-end="url(#arr_${o.mk||'g'})"`:''} data-k="${kwh.toFixed(4)}"/>`;
  if(on&&!rm){const np=o.n||3;for(let k=0;k<np;k++)s+=`<circle class="fp" data-f="${id}" data-o="${(k/np).toFixed(3)}" r="${(2.2+Math.min(3,kwh*4)).toFixed(1)}" fill="${color}" stroke="#fff" stroke-width="1" cx="${a[0]}" cy="${a[1]}"/>`}
  return s;
}
const arrowDefs=()=>`<defs>${[['g','var(--green)'],['p','var(--purple)'],['y','#f5b400'],['m','var(--map-flow)'],['q','var(--map-bat)'],['h','var(--map-gift)']].map(([k,c])=>`<marker id="arr_${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${c}"/></marker>`).join('')}</defs>`;
const FLOWPH={};let flowRAF=0,flowLast=0;
function flowTick(t){
  flowRAF=0;const dt=flowLast?Math.min(0.1,(t-flowLast)/1000):0;flowLast=t;
  const ps=document.querySelectorAll('.fp');let any=ps.length>0;
  const cache={};
  ps.forEach(c=>{const id=c.dataset.f;let e=cache[id];if(!e){const p=document.getElementById(id);if(!p)return;const k=+p.dataset.k||0;e=cache[id]={p,L:p.getTotalLength(),k};FLOWPH[id]=((FLOWPH[id]||0)+dt*(0.12+Math.min(0.9,e.k*1.6)))%1}
    const ph=(FLOWPH[id]+(+c.dataset.o||0))%1,pt=e.p.getPointAtLength(ph*e.L);c.setAttribute('cx',pt.x.toFixed(1));c.setAttribute('cy',pt.y.toFixed(1))});
  const sa=S.send.anim,sun=document.getElementById('sendSun');
  if(sa&&sun){any=true;const p=document.getElementById('sendPath');if(p){const q=clamp((performance.now()-sa.t0)/2200,0,1),e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2,pt=p.getPointAtLength(e*p.getTotalLength());sun.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) scale(${(1+Math.sin(q*Math.PI)*.6).toFixed(2)})`);if(q>=1){S.send.anim=null;render(false)}}}
  if(any)flowRAF=requestAnimationFrame(flowTick);else flowLast=0;
}
function startFlows(){if(!flowRAF&&(document.querySelector('.fp')||S.send.anim)){flowLast=0;flowRAF=requestAnimationFrame(flowTick)}}


/* ---------- karty ponuky výrobcu ---------- */
function annaOfferCard(){
  const occ=S.p.occ,full=occ>=MAXC;
  return `<div class="card"><h3>Správa vašej ponuky</h3>
  <div class="row between" style="margin-top:8px"><span class="sm">Obsadenosť: <b>${occ} / ${MAXC}</b> odberateľov</span>${full?pill('r','plná'):pill('g','voľných miest: '+(MAXC-occ))}</div>
  <div class="bar ${full?'o':''}" style="margin-top:6px"><i style="width:${Math.min(100,occ/MAXC*100)}%"></i></div>
  <p class="xs mut" style="margin-top:4px">Jeden výrobca môže zdieľať najviac s ${MAXC} odberateľmi.</p></div>`;
}
function batCard(compact){
  const B=S.bat;
  if(!B.on)return `<div class="card" style="border-left:5px solid var(--purple)"><div class="row between"><h3>🔋 Domáca batéria</h3>${pill('n','vypnutá')}</div><p class="sm mut" style="margin-top:6px">Ak máte k fotovoltike batériu, cez deň si uložíte časť prebytku a večer ho predáte susedom drahšie ako na obed – stále však lacnejšie, než by platili zo siete.</p><div class="fields one" style="margin-top:8px">${F('Mám batériu','bat.on',{t:'c'})}</div></div>`;
  const res=dayRun(),o=agg(res),a=o.anna,d=S.sim.days,np=netPrice(B.price);
  const carry=Math.max(0,o.socEnd-res.minK);
  let h=`<div class="card" style="border-left:5px solid var(--purple)"><div class="row between"><h3>🔋 Večerná ponuka z batérie</h3><div class="row">${pill('p','🔋 z batérie')}${pill('n',B.eStart+' – '+B.eEnd)}</div></div>
  <p class="sm mut" style="margin-top:4px">Cez deň sa batéria nabíja z prebytku, ktorý si skupina nevzala. Večer ho predáte za <b>${fpr(B.price)} €/kWh</b> (po provízii ${fpr(np)} €) – viac ako obedných ${fpr(S.p.price)} €, menej ako ${fpr(S.c.ref)} € zo siete.</p>
  <div class="grid g4" style="margin-top:10px">${kpi('Nabité dnes',fm(a.batCh,1)+' kWh',`straty ${fm(a.batLoss,2)} kWh`)}${kpi('Predané večer',fm(a.batSold,1)+' kWh',a.batOwn>0?`+ ${fm(a.batOwn,1)} kWh pre vás`:'odberateľom v skupine')}${kpi('Zisk z batérie / deň',(a.batGain>=0?'+':'')+eur(a.batGain),'oproti predaju výkupcovi')}${kpi('Zisk z batérie / rok',(a.batGain>=0?'+':'')+eur0(a.batGain*d*12),'odhad, '+d+' dní × 12')}</div>
  <div style="margin-top:12px">${socChart(res.R.soc,{cap:B.cap,ch:res.R.ch,dis:res.R.dis.map((v,i)=>v+res.R.own[i]),min:res.minK,minLbl:'min. stav nabitia',idx:S.sim.idx,soc0:res.soc0})}</div>
  <p class="xs mut" style="margin-top:6px">Zisk z batérie = večer predané kWh × (večerná cena − provízia)${a.batOwn>0?' + vlastná spotreba × cena zo siete':''} − nabité kWh × výkupná cena (čo by ste za ne dostali bez batérie). Zostatok ${fm(carry,1)} kWh nad minimom sa prenesie do ďalšieho dňa.</p>
  ${batWarnHtml()}`;
  if(!compact)h+=`<h3 style="margin-top:14px">Nastavenie batérie</h3><div class="fields three" style="margin-top:8px">${F('Mám batériu','bat.on',{t:'c'})}${F('Kapacita','bat.cap',{step:.5,min:.5,u:'kWh'})}${F('Max. výkon','bat.pow',{step:.25,min:.25,u:'kWh/15 min'})}${F('Účinnosť nabitia','bat.eff',{step:1,min:50,max:100,u:'%'})}${F('Min. stav nabitia','bat.minSoc',{step:5,max:90,u:'%'})}${F('Ukladať zo zvyšku prebytku','bat.pct',{step:5,max:100,u:'%'})}${F('Večerné okno od','bat.eStart',{t:'t'})}${F('Večerné okno do','bat.eEnd',{t:'t'})}${F('Večerná cena','bat.price',{step:.005,u:'€/kWh'})}${F('Najprv pokryť vlastnú večernú spotrebu','bat.ownFirst',{t:'c'})}${F('Max. cena Petra večer','c.maxEve',{step:.005,u:'€/kWh'})}</div>`;
  else h+=`<div class="row" style="margin-top:10px"><button class="btn sm" data-act="view:group">Nastaviť batériu →</button></div>`;
  return h+`</div>`;
}

