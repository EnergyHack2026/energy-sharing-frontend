'use strict';
/* ---------- model ---------- */
function genBell(a,b,total){const o=new Array(96).fill(0);if(b<=a||total<=0)return o;const n=b-a;let s=0;for(let i=a;i<b;i++)s+=Math.sin(Math.PI*(i-a+.5)/n);for(let i=a;i<b;i++)o[i]=total*Math.sin(Math.PI*(i-a+.5)/n)/s;return o}
function genFlat(a,b,daily,base){const o=new Array(96).fill(base);for(let i=0;i<96;i++)if(i>=a&&i<b)o[i]=(b>a?daily/(b-a):0);return o}
function loadArr(k,t){const a=new Array(96).fill(0),j=T2I(t);if(k>0){if(j<96)a[j]+=k/2;if(j+1<96)a[j+1]+=k/2}return a}
function profiles(appT,mul=1){
  const s=S,share=Math.max(0,s.p.share)/100,pS=T2I(s.p.pStart),pE=T2I(s.p.pEnd);
  const bell=genBell(pS,pE,s.p.surplus*s.p.weather/100*mul);
  const shiftA=real=>{const a=bell.slice();for(const k of ['pw','pb','pev']){const o=s.p[k],to=real&&o.cheat?o.orig:o.time,f=loadArr(o.kwh,o.orig),t=loadArr(o.kwh,to);for(let i=pS;i<pE;i++){a[i]+=f[i];a[i]-=t[i]}}return a.map(v=>Math.max(0,v))};
  const fpFull=shiftA(false),fpReal=shiftA(true);
  const fcBase=genFlat(T2I(s.c.cStart),T2I(s.c.cEnd),s.c.daily,s.c.base);
  const mkfc=real=>{const fc=fcBase.slice();const add=(k,t)=>loadArr(k,t).forEach((v,i)=>fc[i]+=v);
    add(s.c.appKwh,real&&s.c.washCheat?s.c.appOrig:appT);
    for(const k of ['ev','wh','ice']){const o=s.c[k];add(o.kwh,real&&o.cheat?o.orig:o.time)}
    return fc};
  const fc=mkfc(false),fcReal=mkfc(true);
  return {fpFull,fpReal,fp:fpFull.map(x=>x*share),fcBase,fc,fcReal};
}
function actuals(P){
  const dev=S.sim.dev/100,nz=(i,k)=>Math.sin(i*7.13+k*1.7);
  const a=P.fpReal.map((v,i)=>v*(1+dev*nz(i,1))),c=P.fcReal.map((v,i)=>v*(1+dev*nz(i,2))),cb=P.fcBase.map((v,i)=>v*(1+dev*nz(i,3)));
  const m=S.meter;if(m.idx>=0&&m.idx<96){a[m.idx]=Math.max(0,m.anna);c[m.idx]=Math.max(0,m.peter)}
  return {a,c,cb};
}
function feeOf(kwh,amt){return S.fee.mode===FEE_PCT?amt*S.fee.pct/100:kwh*S.fee.fix/1000}
function netPrice(p){return p-(S.fee.mode===FEE_PCT?p*S.fee.pct/100:S.fee.fix/1000)}
const round5=v=>Math.round(v/0.005)*0.005;
/* hodnota dňa pre výrobcu: výplata + výkup + vlastná spotreba z batérie + kredit v banke + zostatok v batérii (oceňený výkupom) */
const annaValue=o=>o.anna.net+o.anna.buyback+o.anna.batOwnVal+o.anna.bank*coinEur()+(o.socEnd-o.soc0)*S.p.feedin;
function daysToXmas(){const n=new Date(),y=n.getMonth()===11&&n.getDate()>24?n.getFullYear()+1:n.getFullYear(),x=new Date(y,11,24);return Math.max(1,Math.ceil((x-n)/864e5))}
/* kaskáda nevyužitého prebytku: ručné nastavenie alebo rozhodnutie AI správcu */
function manualCfg(){return {batPct:S.bat.pct,bankPct:S.bank.on?S.bank.pct:0,donPct:S.don.on?S.don.pct:0,ownFirst:S.bat.ownFirst,deal:null}}
function cascadeCfg(o){if(o.cfg)return o.cfg;if(S.agent.on&&!o.noAgent)return agentPlan();return manualCfg()}
function agentPlan(){return memo('ap',()=>{
  const a=S.agent,cx=a.cancel,m=manualCfg(),why={};
  let deal=null;
  const bid=Math.min(a.maxP,S.c.max);
  if(!cx.deal){if(a.minA<=bid+1e-9){deal=round5((a.minA+bid)/2);why.deal=`Annin agent žiadal aspoň ${fpr(a.minA)} €, Petrov ponúkol najviac ${fpr(bid)} € – stretli sa v strede.`}else why.deal=`Dohoda nevznikla: Anna chce aspoň ${fpr(a.minA)} €, Peter dá najviac ${fpr(bid)} €.`}
  const worth=netPrice(S.bat.price)>S.p.feedin+1e-9&&S.bat.on;
  let batPct=m.batPct,ownFirst=m.ownFirst;
  if(!cx.bat){ownFirst=a.prio==='ušetriť';
    if(!worth&&!ownFirst)batPct=0;
    else{let best=-1e9;for(const p of [0,20,40,60,80,100]){const r=runDay(S.c.appTime,{forecast:true,potential:true,noAgent:true,cfg:{batPct:p,bankPct:0,donPct:0,ownFirst,deal}}),o=agg(r),v=annaValue(o);if(v>best+1e-6){best=v;batPct=p}}}
    why.bat=!S.bat.on?'Batéria nie je zapnutá.':batPct===0?'Uložiť do batérie sa dnes neoplatí – večer by sa energia nepredala.':ownFirst?`Priorita „ušetriť“: batéria najprv pokryje vašu večernú spotrebu – ukladám ${batPct} % zvyšku.`:`Večer predám po ${fpr(netPrice(S.bat.price))} €/kWh čisto, výkup dá len ${fpr(S.p.feedin)} € – ukladám ${batPct} % zvyšku, viac by večer nikto nekúpil.`}
  let donPct=m.donPct;
  if(!cx.don){donPct=a.prio==='darovať'?50:(S.don.on?S.don.pct:0);if(donPct)why.don=a.prio==='darovať'?'Priorita „darovať“: polovicu zvyšku po banke posielam cez Lúč pomoci (bez provízie).':'Darovanie podľa vášho nastavenia.'}
  let bankPct=m.bankPct;
  if(!cx.bank){
    const need=Math.max(0,a.goal-S.bank.bal)/daysToXmas();
    const probe=runDay(S.c.appTime,{forecast:true,potential:true,noAgent:true,cfg:{batPct,bankPct:100,donPct:0,ownFirst,deal}});
    const L=sum(probe.R.bank);
    bankPct=need<=1e-9?0:L>1e-9?Math.min(100,Math.ceil(need/L*100)):0;
    why.bank=need<=1e-9?`Cieľ ${fm(a.goal,0)} kWh v Slnečnej banke je splnený – zvyšok ide výkupcovi.`:`Do Vianoc (${daysToXmas()} dní) chýba ${fm(a.goal-S.bank.bal,0)} kWh, t. j. ${fm(need,2)} kWh denne – ukladám ${bankPct} % zvyšku po batérii.`;
  }
  return {batPct,bankPct,donPct,ownFirst,deal,why};
})}
function runDay(appT,o={}){
  const P=profiles(appT,o.mul||1);
  const A=o.forecast?{a:P.fpFull,c:P.fc,cb:P.fcBase}:actuals(P);
  const share=Math.max(0,S.p.share)/100,off=o.off||{};
  /* OM na Strednom Slovensku (SSE) nemôže zdieľať – oblasť je zatiaľ mimo služby */
  const inSse=w=>!o.twin&&regionOf(geo(S.om[w].addr).ll)==='sse';
  const aAct=(o.potential||isAct(S.mem.anna))&&!off.anna&&!inSse('anna'),pAct=(o.potential||isAct(S.mem.peter))&&!off.peter&&!inSse('peter');
  const others=S.sim.others||o.twin,cfg=cascadeCfg(o),B=S.bat,bOn=B.on&&aAct;
  const cap=Math.max(0,B.cap),minK=cap*clamp(B.minSoc,0,100)/100,eff=clamp(B.eff/100,0.01,1),pow=Math.max(0,B.pow);
  const eS=T2I(B.eStart),eE=T2I(B.eEnd);
  let soc=bOn?Math.min(cap,minK+Math.max(0,B.carry)):0;const soc0=soc;
  const recs=[],arr=()=>new Array(96).fill(0);
  const R={soc:arr(),ch:arr(),dis:arr(),own:arr(),loss:arr(),bank:arr(),vykup:arr(),offer:arr(),left:arr()};
  const gifts=(S.gifts||[]).filter(g=>g.src==='today').map(g=>({id:g.id,to:g.to,fee:g.fee,left:g.kwh}));
  const annaOwn=0.12;
  for(let i=0;i<96;i++){
    const prods=[],cons=[];
    const aSup=aAct?A.a[i]*share:0;R.offer[i]=aSup;
    if(aAct)prods.push({id:'anna',price:S.p.price,sup:aSup});
    if(bOn&&inWin(i,eS,eE)){
      let avail=Math.max(0,Math.min(pow,soc-minK));
      if(cfg.ownFirst&&avail>0){const u=Math.min(avail,annaOwn);soc-=u;avail-=u;R.own[i]=u}
      if(avail>1e-9)prods.push({id:'anna',bat:true,price:B.price,sup:avail});
    }
    if(others&&!off.B)prods.push({id:'B',price:S.o.bPrice,sup:P.fpFull[i]*0.6*(o.mulB??1)});
    if(pAct)cons.push({id:'peter',max:S.c.max,maxE:S.c.maxEve,dem:A.c[i]});
    if(others){if(!off.C)cons.push({id:'C',max:S.o.cMax,maxE:S.o.cMax+0.03,dem:A.cb[i]*0.8});if(!off.D)cons.push({id:'D',max:S.o.dMax,maxE:S.o.dMax+0.02,dem:A.cb[i]*0.5})}
    if(o.twin){if(!off.SK)cons.push({id:'SK',max:0.12,maxE:0.12,dem:inWin(i,32,56)?0.125:0.02});if(!off.NB)cons.push({id:'NB',max:0.13,maxE:0.15,dem:inWin(i,44,60)?0.25:0})}
    prods.sort((x,y)=>x.price-y.price);
    const pr=(p,c)=>{if(p.bat)return p.price;if(p.id==='anna'&&c.id==='peter'){if(S.p.indiv.on)return S.p.indiv.price;if(cfg.deal)return cfg.deal}return p.price};
    const mx=(p,c)=>p.bat?c.maxE:c.max;
    let aGiven=0;
    for(const p of prods){
      const el=cons.filter(c=>c.dem>1e-9&&mx(p,c)>=pr(p,c)-1e-9);
      const T=sum(el.map(c=>c.dem));
      if(p.sup<=1e-9||T<=1e-9)continue;
      const give=Math.min(p.sup,T),ks=el.map(c=>give*c.dem/T);
      el.forEach((c,j)=>{const q=pr(p,c),am=ks[j]*q,r={i,from:p.id,to:c.id,kwh:ks[j],price:q,amt:am,com:feeOf(ks[j],am)};if(p.bat)r.src='bat';else if(p.id==='anna'&&c.id==='peter'&&cfg.deal&&!S.p.indiv.on)r.deal=1;recs.push(r)});
      el.forEach((c,j)=>{c.dem-=ks[j]});
      if(p.bat){soc-=give;R.dis[i]=give}else if(p.id==='anna')aGiven=give;
    }
    let L=Math.max(0,aSup-aGiven);R.left[i]=L;
    if(L>1e-9){
      if(bOn&&!inWin(i,eS,eE)&&cfg.batPct>0){const ch=Math.min(L*cfg.batPct/100,pow,Math.max(0,(cap-soc)/eff));if(ch>1e-12){soc+=ch*eff;R.ch[i]=ch;R.loss[i]=ch*(1-eff);L-=ch}}
      if(cfg.bankPct>0){const d=L*cfg.bankPct/100;R.bank[i]=d;L-=d}
      if(cfg.donPct>0){const d=L*cfg.donPct/100;if(d>1e-9){recs.push({i,from:'anna',to:'don',kind:'don',kwh:d,price:0,amt:0,com:0});L-=d}}
      for(const g of gifts){if(L<=1e-9)break;const d=Math.min(L,g.left);if(d>1e-9){g.left-=d;L-=d;recs.push({i,from:'anna',to:'gift:'+g.to,kind:'gift',gid:g.id,kwh:d,price:0,amt:0,com:d*g.fee})}}
    }
    R.vykup[i]=L;R.soc[i]=soc;
  }
  return {P,A,recs,share,aAct,R,soc0,cfg,cap,minK,eS,eE};
}
function agg(res,upto=96){
  const o={anna:{offered:0,shared:0,dayEarn:0,dayCom:0,earn:0,com:0,net:0,vsVykup:0,buyback:0,vykup:0,batCh:0,batLoss:0,batSold:0,batEarn:0,batCom:0,batOwn:0,batOwnVal:0,batGain:0,bank:0,don:0,gift:0,giftCom:0,deal:0},peter:{recv:0,recvBat:0,paid:0,saved:0,cons:0},cred:{},deb:{},com:{},n:0,comT:0,donT:0,giftT:0};
  const R=res.R,a=o.anna;
  for(let i=0;i<upto;i++){a.offered+=R.offer[i];o.peter.cons+=res.A.c[i];a.vykup+=R.vykup[i];a.batCh+=R.ch[i];a.batLoss+=R.loss[i];a.batOwn+=R.own[i];a.bank+=R.bank[i]}
  for(const r of res.recs)if(r.i<upto){
    o.cred[r.from]=(o.cred[r.from]||0)+r.amt;o.deb[r.to]=(o.deb[r.to]||0)+r.amt;o.com[r.from]=(o.com[r.from]||0)+r.com;o.comT+=r.com;o.n++;
    if(r.kind==='don'){o.donT+=r.kwh;if(r.from==='anna')a.don+=r.kwh;continue}
    if(r.kind==='gift'){o.giftT+=r.kwh;if(r.from==='anna'){a.gift+=r.kwh;a.giftCom+=r.com}continue}
    if(r.from==='anna'){if(r.src==='bat'){a.batSold+=r.kwh;a.batEarn+=r.amt;a.batCom+=r.com}else{a.shared+=r.kwh;a.dayEarn+=r.amt;a.dayCom+=r.com;if(r.deal)a.deal+=r.kwh}}
    if(r.to==='peter'){o.peter.recv+=r.kwh;o.peter.paid+=r.amt;o.peter.saved+=r.kwh*(S.c.ref-r.price);if(r.src==='bat')o.peter.recvBat+=r.kwh}
  }
  a.earn=a.dayEarn+a.batEarn;a.com=a.dayCom+a.batCom+a.giftCom;a.net=a.earn-a.com;
  a.batOwnVal=a.batOwn*S.c.ref;
  a.batGain=(a.batEarn-a.batCom)+a.batOwnVal-a.batCh*S.p.feedin;
  a.vsVykup=(a.dayEarn-a.dayCom)-a.shared*S.p.feedin+a.batGain;
  a.buyback=a.vykup*S.p.feedin;
  o.credT=sum(Object.values(o.cred));o.debT=sum(Object.values(o.deb));o.netT=o.credT-o.comT;
  o.socEnd=upto>0?R.soc[upto-1]:res.soc0;o.soc0=res.soc0;
  o.balKwh=a.offered-(a.shared+a.batCh+a.bank+a.don+a.gift+a.vykup);
  o.balBat=a.batCh-(a.batSold+a.batOwn+(o.socEnd-o.soc0)+a.batLoss);
  return o;
}
function winLen(){return Math.max(1,Math.round(S.sim.win*4))}
function bestWin(m){
  const W=winLen();let best=-1,bi=0,run=sum(m.slice(0,W));best=run;
  for(let i=1;i+W<=96;i++){run+=m[i+W-1]-m[i-1];if(run>best+1e-12){best=run;bi=i}}
  return best>1e-6?{a:bi,b:bi+W,sum:best}:null;
}
function matchScore(sup,price,dem,max,ref,conf){
  const m=sup.map((s,i)=>Math.min(s,dem[i])),sS=sum(sup),sD=sum(dem),sM=sum(m);
  const overlap=(sS>0&&sD>0)?sM/Math.min(sS,sD):0;
  const ok=price<=max+1e-9;
  const priceS=ok?Math.max(0,Math.min(1,0.6+0.4*Math.min(1,Math.max(0,(ref-price)/ref)/0.5))):0;
  const rel={'vysoká':.92,'stredná':.75,'nízka':.55}[conf]||.75;
  const bal=(sS>0&&sD>0)?1-Math.abs(sS-sD)/Math.max(sS,sD):0;
  const total=.5*overlap+.25*priceS+.15*rel+.1*bal;
  return {total,overlap,priceS,rel,bal,ok,vol:sM,win:bestWin(m)};
}
const UNC={'vysoká':.10,'stredná':.20,'nízka':.35};
const memoC={};
function memo(tag,fn){const k=tag+JSON.stringify([S.om,S.p,S.c,S.bat,S.sim.dev,S.sim.others,S.sim.win,S.sim.days,S.o,S.meter,S.fee,S.agent,S.bank.on,S.bank.pct,S.bank.bal,S.don,S.gifts,S.mem]);if(k in memoC)return memoC[k];const v=fn();const ks=Object.keys(memoC);if(ks.length>400)delete memoC[ks[0]];memoC[k]=v;return v}
const potRun=()=>memo('pot',()=>runDay(S.c.appTime,{forecast:true,potential:true}));
const dayRun=()=>runDay(S.c.appTime);
/* očakávaná ponuka z batérie (pre Smart Match): uložená energia rozložená do večerného okna */
function batSupply(res){
  const B=S.bat,o=new Array(96).fill(0);if(!B.on)return o;
  let st=sum(res.R.ch)*clamp(B.eff/100,0.01,1)+Math.max(0,B.carry);const eS=T2I(B.eStart),eE=T2I(B.eEnd);
  for(let k=0;k<96&&st>1e-9;k++){const i=(eS+k)%96;if(!inWin(i,eS,eE))break;const v=Math.min(B.pow,st);o[i]=v;st-=v}
  return o;
}
function batWarn(){
  const B=S.bat,eff=B.eff/100,w=[];if(!B.on)return w;
  if(B.price*eff<=S.p.price+1e-9)w.push(['o',`Večerná cena po stratách (${fpr(B.price*eff)} €/kWh) nie je vyššia než obedná ${fpr(S.p.price)} €/kWh – batéria sa vám neoplatí`]);
  if(B.price>=S.c.ref-1e-9)w.push(['r',`Večerná cena ${fpr(B.price)} €/kWh nie je nižšia než cena zo siete ${fpr(S.c.ref)} €/kWh – pre odberateľa nie je výhodná`]);
  if(netPrice(B.price)<S.p.feedin)w.push(['o',`Čistá večerná cena ${fpr(netPrice(B.price))} €/kWh je pod výkupnou ${fpr(S.p.feedin)} €/kWh`]);
  if(B.price>S.c.maxEve+1e-9)w.push(['r',`Večerná cena je nad večerným maximom Petra (${fpr(S.c.maxEve)} €/kWh) – energia sa mu nepridelí`]);
  return w;
}
function recAppTime(){return memo('rw',()=>{let best=-1,bi=T2I(S.c.appOrig);for(let i=0;i<95;i++){const r=agg(runDay(I2T(i),{forecast:true,potential:true}));const v=r.peter.recv-i*1e-6;if(v>best){best=v;bi=i}}return I2T(bi)})}
function gainFor(appT){
  const a=agg(runDay(appT,{forecast:true,potential:true})),b=agg(runDay(S.c.appOrig,{forecast:true,potential:true}));
  const kwh=a.peter.recv-b.peter.recv,sav=a.peter.saved-b.peter.saved;
  return {kwh,sav,pts:Math.max(0,Math.min(S.pts.cap,Math.round(Math.max(0,kwh)*30)))};
}
function A_(owner,key){
  if(owner==='c'&&key==='wash')return {label:'umývačka',get kwh(){return S.c.appKwh},get orig(){return S.c.appOrig},get time(){return S.c.appTime},set time(v){S.c.appTime=v},get accepted(){return S.c.accepted},set accepted(v){S.c.accepted=v},get cheat(){return S.c.washCheat}};
  return S[owner][key];
}
const KEYS={c:['wash','ev','wh','ice'],p:['pw','pb','pev']};
function gainKey(owner,key,t){
  const o=A_(owner,key),old=o.time,run=()=>agg(runDay(S.c.appTime,{forecast:true,potential:true}));
  o.time=t;const a=run();o.time=o.orig;const b=run();o.time=old;
  const kwh=owner==='p'?a.anna.shared-b.anna.shared:a.peter.recv-b.peter.recv;
  return {kwh,sav:a.peter.saved-b.peter.saved,earn:a.anna.net-b.anna.net,pts:Math.max(0,Math.min(S.pts.cap,Math.round(Math.max(0,kwh)*30)))};
}
function recKey(owner,key){
  return memo('rk'+owner+key,()=>{
    const o=A_(owner,key),old=o.time;let best=-1e9,bi=T2I(o.orig);
    for(let i=0;i<95;i++){o.time=I2T(i);const r=agg(runDay(S.c.appTime,{forecast:true,potential:true}));
      const m=owner==='p'?r.anna.shared:r.peter.recv,dist=owner==='p'?Math.abs(i-(T2I(S.p.pEnd)+4)):i;
      const v=m-dist*1e-6;if(v>best){best=v;bi=i}}
    o.time=old;return I2T(bi);
  });
}
function ownerBase(ow){return ow==='c'?genFlat(T2I(S.c.cStart),T2I(S.c.cEnd),S.c.daily,S.c.base):new Array(96).fill(0.12)}
function verifyLoad(ow,key){
  const base=ownerBase(ow),dev=S.sim.dev/100,nz=(i,k)=>Math.sin(i*7.13+k*1.7),o=A_(ow,key),k=o.kwh,j=T2I(o.time),j0=T2I(o.orig);
  const ws=(arr,a)=>sum(arr.slice(Math.max(0,a-1),Math.min(96,a+3)));
  const series=(timeOf,skip)=>{const s=base.slice();for(const kk of KEYS[ow]){if(kk===skip)continue;const ob=A_(ow,kk);loadArr(ob.kwh,timeOf(ob,kk)).forEach((v,i)=>{s[i]+=v})}return s};
  const noisy=(s,seed)=>s.map((v,i)=>v*(1+0.6*dev*nz(i,seed)));
  const M=noisy(series((ob,kk)=>ob.cheat?ob.orig:ob.time,null),20);
  const E=series(ob=>ob.accepted?ob.time:ob.orig,key);
  const resNew=ws(M,j)-ws(E,j),resOld=ws(M,j0)-ws(E,j0);
  const rows=[];
  for(let d=6;d>=1;d--){const Mh=noisy(series(ob=>ob.orig,null),30+d),Eh=series(ob=>ob.orig,key);
    rows.push({d:new Date(Date.now()-d*864e5).toLocaleDateString('sk-SK',{weekday:'short',day:'numeric',month:'numeric'}),old:ws(Mh,j0)-ws(Eh,j0),nw:ws(Mh,j)-ws(Eh,j)})}
  rows.push({d:'dnes',old:resOld,nw:resNew,today:true});
  const okNew=resNew>=0.6*k,okOld=resOld<=0.4*k;
  return {ok:okNew&&okOld,okNew,okOld,resNew,resOld,rows,k,j,j0};
}
function doneG(owner,key){const o=A_(owner,key);return !!(o.accepted&&S.sim.idx>=T2I(o.time)+2&&verifyLoad(owner,key).ok)}
function annaStats(){
  const r=dayRun(),a=agg(r);let num=0,den=0;
  for(let i=0;i<96;i++){if(i===S.meter.idx)continue;num+=Math.abs(r.A.a[i]-r.P.fpFull[i]);den+=r.P.fpFull[i]}
  return {err:den>0?num/den:0,succ:a.anna.offered>0?a.anna.shared/a.anna.offered:0,shared:a.anna.shared,offered:a.anna.offered};
}
function earnedToday(who){
  const owner=who==='anna'?'p':'c',keys=who==='anna'?['pw','pb']:['wash','ev','wh'],fu=S.fu[who];
  if(fu&&S.day>fu.from)keys.push(who==='anna'?'pev':'ice');
  let s=0;for(const k of keys){if(doneG(owner,k))s+=gainKey(owner,k,A_(owner,k).time).pts}
  if(who==='anna'){const st=annaStats();s+=(S.p.auto?20:0)+(st.err<=0.10?25:0)+(st.succ>=0.75&&S.sim.idx>=96?30:0)}
  return Math.min(S.pts.cap,s);
}
function checkFU(){
  for(const who of ['anna','peter']){
    if(S.fu[who])continue;
    const owner=who==='anna'?'p':'c',keys=who==='anna'?['pw','pb']:['wash','ev','wh'];
    if(keys.some(k=>doneG(owner,k))){
      S.fu[who]={from:S.day,shown:false};
      setTimeout(()=>{if(S.fu[who]){S.fu[who].shown=true;toast('🎯 Nová výzva sa zobrazila – zapojiť sa môžete až po polnoci');notify('chal',who,'Nová výzva za splnenie','Zapojiť sa môžete po polnoci.','rewards');render(false)}},3500);
    }
  }
}
/* trhovisko – ponuky a dopyty */
function offersForPeter(){
  const P=profiles(S.c.appTime),W=S.c;
  const mk=(id,label,price,a,b,total,conf,occ,live)=>{const sup=genBell(T2I(a),T2I(b),total);const m=matchScore(sup,price,P.fc,W.max,W.ref,conf);return {id,label,price,a,b,total,conf,live,occ,m}};
  const ep=S.p.indiv.on?S.p.indiv.price:S.p.price;
  const show=S.p.vis===VIS_PUB||isAct(S.mem.peter)||(S.p.vis===VIS_HID&&S.codeOk);
  const L=[];
  if(show){const an=mk('anna','Overená domácnosť s fotovoltikou',ep,S.p.pStart,S.p.pEnd,S.p.surplus*S.p.weather/100*S.p.share/100,S.p.conf,S.p.occ,true);an.priv=S.p.vis!==VIS_PUB;an.indiv=S.p.indiv.on;L.push(an);
    if(S.bat.on){const sup=batSupply(potRun()),m=matchScore(sup,S.bat.price,P.fc,W.maxEve,W.ref,S.p.conf);L.push({id:'anna_bat',label:'Tá istá domácnosť – večer z batérie',price:S.bat.price,a:S.bat.eStart,b:S.bat.eEnd,total:sum(sup),conf:S.p.conf,live:true,occ:S.p.occ,m,eve:true,priv:an.priv})}}
  L.push(mk('B','Overený výrobca s IMS',S.o.bPrice,'09:30','14:30',3.8,'stredná',9));
  L.push(mk('O3','Malý podnik s fotovoltikou',0.14,'09:00','13:00',5.2,'vysoká',10));
  L.push(mk('O4','Výrobca s fotovoltikou',0.10,'07:00','11:00',4.0,'nízka',3));
  {const sup=genFlat(T2I('18:30'),T2I('21:30'),3.2,0),m=matchScore(sup,0.135,P.fc,W.maxEve,W.ref,'stredná');L.push({id:'O5',label:'Rodinný dom s fotovoltikou a batériou',price:0.135,a:'18:30',b:'21:30',total:3.2,conf:'stredná',occ:6,m,eve:true})}
  return L;
}
function demandsForAnna(){
  const P=profiles(S.c.appTime),W=S.p;
  const mk=(id,label,max,a,b,total,conf)=>{const dem=genFlat(T2I(a),T2I(b),total,0);const m=matchScore(P.fp,W.price,dem,max,max+.05,conf);return {id,label,max,a,b,total,conf,m}};
  const pm=matchScore(P.fp,W.price,P.fc,S.c.max,S.c.ref,'vysoká');
  const L=[
   {id:'peter',label:'Malý podnik (bistro)',max:S.c.max,a:S.c.cStart,b:S.c.cEnd,total:S.c.daily+S.c.appKwh,conf:'vysoká',m:pm,live:true},
   mk('C','Overená domácnosť',S.o.cMax,'11:00','15:00',3.0,'stredná'),
   mk('D','Domácnosť s elektromobilom',S.o.dMax,'11:00','17:00',4.5,'vysoká'),
   mk('E','Malý podnik',0.15,'08:00','12:00',3.5,'nízka')];
  if(S.bat.on){const sup=batSupply(potRun()),m=matchScore(sup,S.bat.price,P.fc,S.c.maxEve,S.c.ref,'vysoká');L.splice(1,0,{id:'peter_eve',label:'Malý podnik (bistro) – večerný dopyt',max:S.c.maxEve,a:S.bat.eStart,b:S.bat.eEnd,total:sum(P.fc.slice(T2I(S.bat.eStart),T2I(S.bat.eEnd))),conf:'vysoká',m,live:true,eve:true,ask:S.bat.price})}
  return L;
}
/* ---------- elektromobil ako batéria ulice (vízia) ---------- */
function evSim(res){
  const E=S.ev,cap=Math.max(1,E.cap),minK=cap*clamp(E.minSoc,0,100)/100,pow=Math.max(0,E.pow);
  const pin=T2I(E.plugIn),pout=T2I(E.plugOut),back=T2I(E.back),vS=T2I(E.v2gStart),vE=T2I(E.v2gEnd);
  let soc=cap*clamp(E.soc0,0,100)/100;const soc0=soc;
  const socA=new Array(96).fill(0),ch=new Array(96).fill(0),dis=new Array(96).fill(0);
  const rushN=Math.max(1,vE-vS);let drove=false;
  for(let i=0;i<96;i++){
    if(i>=pin&&i<pout){const avail=res.R.left[i]*Math.max(1,E.roofs);const c=Math.min(pow,avail,cap-soc);if(c>0){soc+=c;ch[i]=c}}
    if(i===pout&&!drove){soc=Math.max(0,soc-E.drive);drove=true}
    if(i>=Math.max(back,vS)&&i<vE){
      const bat=sum(res.recs.filter(r=>r.i===i&&r.to==='peter').map(r=>r.kwh));
      const dem=Math.max(0,res.A.c[i]-bat)+E.rush/rushN;
      const d=Math.min(pow,dem,Math.max(0,soc-minK));if(d>0){soc-=d;dis[i]=d}
    }
    socA[i]=soc;
  }
  const chT=sum(ch),disT=sum(dis);
  return {soc:socA,ch,dis,chT,disT,soc0,minK,cap,
    roofEarn:chT*(E.chPrice-S.p.feedin),
    ownerV2G:disT*(E.sellPrice-E.chPrice),
    ownerDrive:Math.max(0,chT-disT)*(S.c.ref-E.chPrice),
    bistro:disT*(S.c.ref-E.sellPrice)};
}
/* ---------- Slnečná banka – projekcia júl → december ---------- */
const MONTHS=['júl','august','september','október','november','december'];
const SEASON=[1.4,1.3,1.0,0.7,0.3,0.15];
function bankProj(dailyDep){
  const B=S.bank,feeK=1-clamp(B.fee,0,100)/100,rate=clamp(B.rate,0,200)/100;
  const rows=[];let bal=0,depT=0;
  for(let m=0;m<6;m++){const dep=m<4?dailyDep*30*SEASON[m]*feeK:0;bal+=dep;depT+=dep;const wd=m===5?bal:0;rows.push({m:MONTHS[m],dep,wd,bal:bal-(m===5?wd:0)})}
  const winterKwh=depT*rate,winterEur=winterKwh*B.winter,summerEur=depT/feeK*S.p.feedin;
  return {rows,depT,winterKwh,winterEur,summerEur,gain:winterEur-summerEur};
}
const coinEur=()=>S.bank.rate/100*S.bank.winter;
/* ---------- mapa – mestá a odberné miesta ---------- */
const TOWNS={'bratislava':[17.11,48.15],'trnava':[17.59,48.38],'piestany':[17.83,48.59],'nitra':[18.09,48.31],'trencin':[18.04,48.89],'hlohovec':[17.80,48.43],'senica':[17.37,48.68],'zilina':[18.74,49.22],'martin':[18.92,49.07],'banska bystrica':[19.15,48.74],'zvolen':[19.13,48.58],'poprad':[20.30,49.06],'presov':[21.24,49.00],'kosice':[21.26,48.72],'michalovce':[21.92,48.75],'bardejov':[21.28,49.29],'humenne':[21.91,48.93],'spisska nova ves':[20.56,48.94],'komarno':[18.13,47.76],'dunajska streda':[17.62,47.99],'levice':[18.60,48.22],'lucenec':[19.67,48.33],'roznava':[20.53,48.66],'malacky':[17.02,48.44],'pezinok':[17.27,48.29],'nove zamky':[18.16,47.99],'prievidza':[18.62,48.77],'ruzomberok':[19.30,49.08],'liptovsky mikulas':[19.61,49.08],'vranov nad toplou':[21.68,48.89],'trebisov':[21.72,48.63]};
const ZSE_LON=20.05;
function geo(addr){const a=norm(addr);let best=null;for(const t of Object.keys(TOWNS))if(a.includes(t)&&(!best||t.length>best.length))best=t;return best?{town:best,ll:TOWNS[best]}:{town:'bratislava',ll:TOWNS.bratislava,guess:true}}
/* tri oblasti: Západ (ZSE), Stred (SSE – zatiaľ mimo služby), Východ (VSE).
   Hranice sú približné (kraje TT/TN/NR/BA | ZA/BB | PO/KE), stačia na umiestnenie OM. */
const RB_W=[[18.45,49.37],[18.55,49.15],[18.7,48.95],[18.8,48.75],[18.75,48.55],[18.85,48.3],[19.0,48.07]];
const RB_E=[[20.05,49.18],[20.1,48.95],[20.2,48.75],[20.25,48.5],[20.3,48.27]];
function inPoly(pt,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>pt[1])!==(yj>pt[1])&&pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi)c=!c}return c}
/* polygón naľavo / napravo od hraničnej čiary (predĺženej mimo územia) */
const sidePoly=(B,dir)=>[[B[0][0],52],...B,[B[B.length-1][0],46],[dir<0?15:24,46],[dir<0?15:24,52]];
const regionOf=ll=>inPoly(ll,sidePoly(RB_W,-1))?'zse':inPoly(ll,sidePoly(RB_E,1))?'vse':'sse';
const SK_OUT=[[17.06,48.07],[16.98,48.17],[16.88,48.32],[16.9,48.45],[16.95,48.6],[17.15,48.81],[17.4,48.83],[17.65,48.85],[17.9,48.92],[18.1,49.05],[18.25,49.25],[18.45,49.37],[18.6,49.47],[18.8,49.52],[18.95,49.42],[19.25,49.52],[19.45,49.6],[19.7,49.35],[19.9,49.2],[20.05,49.18],[20.15,49.26],[20.35,49.4],[20.55,49.38],[20.9,49.3],[21.1,49.38],[21.45,49.43],[21.85,49.37],[22.05,49.22],[22.4,49.1],[22.57,49.08],[22.47,48.85],[22.35,48.7],[22.15,48.41],[21.75,48.33],[21.45,48.55],[21.2,48.52],[20.95,48.52],[20.6,48.55],[20.3,48.27],[20.0,48.17],[19.65,48.23],[19.45,48.1],[19.0,48.07],[18.82,47.98],[18.72,47.82],[18.3,47.75],[18.1,47.76],[17.75,47.75],[17.5,47.9],[17.25,48.0]];
const MAPW=760,MAPH=380;
const prj=ll=>[(ll[0]-16.75)*0.66*192+14,(49.66-ll[1])*192+12];


