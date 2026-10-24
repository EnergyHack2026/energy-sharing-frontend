'use strict';
const APP_NAME='Zdieľňa';
const LOGOS={zse:'assets/zse.png',vse:'assets/vse.png'},SKN={zse:'ZSE',vse:'VSE'};
/* značka Zdieľne bez ZSE/VSE – úvodná stránka */
const LOGO_APP='assets/zdielna-dot.svg';
/* oficiálne logá zo zse.sk a vse.sk (bez podkladu) – tlačidlá výberu spoločnosti v registrácii */
const LOGO_OFF={zse:'assets/zse-logo.svg',vse:'assets/vse-logo.png'};
/* ---------- utils ---------- */
const pad=n=>String(n).padStart(2,'0');
const T2I=t=>{const m=/^(\d{1,2}):(\d{2})$/.exec(t||'');if(!m)return 0;return Math.max(0,Math.min(96,Math.round((+m[1]*60+ +m[2])/15)))};
const I2T=i=>{const m=Math.max(0,Math.min(96,i))*15;return pad(Math.floor(m/60))+':'+pad(m%60)};
const fm=(n,d=2)=>Number(n||0).toLocaleString('sk-SK',{minimumFractionDigits:d,maximumFractionDigits:d});
const fpr=n=>Number(n||0).toLocaleString('sk-SK',{minimumFractionDigits:2,maximumFractionDigits:3});
const eur=n=>fm(n,2)+' €';
const eur0=n=>fm(n,0)+' €';
const pct=n=>Math.round((n||0)*100)+' %';
const sum=a=>a.reduce((s,x)=>s+x,0);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=s=>document.querySelector(s);
const getPath=(k)=>k.split('.').reduce((o,p)=>o&&o[p],S);
const setPath=(k,v)=>{const a=k.split('.');const l=a.pop();a.reduce((o,p)=>o[p],S)[l]=v};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const inWin=(i,a,b)=>a<=b?(i>=a&&i<b):(i>=a||i<b);
const BR=()=>SKN[S.skin]||SKN[S.reg&&S.reg.company]||'ZSE';  /* v neutrálnom dizajne podľa účtu zákazníka */
const RM=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};

/* ---------- finálna verzia: zapnuté časti ----------
   Do finálu pridáš funkciu doplnením jej kľúča: obrazovka z VIEWS (home, market, register…) alebo 'chat', 'tour'.
   Vypnuté obrazovky sa nezobrazia a tlačidlá, ktoré na ne vedú, sa skryjú (gateActs v main.js). */
const ON=new Set(['landing','register','home','challenges','group','reports','rewards','cert','profile','chat']);
const isOn=k=>ON.has(k);

/* ---------- state ---------- */
const FEE_FIX='pevná (€/MWh)',FEE_PCT='% z tržby',VIS_PUB='verejná',VIS_HID='skrytá',VIS_LOCK='uzamknutá',MAXC=10;
const PRIO=['zarobiť','ušetriť','darovať'];
const defaults=()=>({
  skin:'zse',persona:'peter',view:'landing',rtab:'rep',drawer:false,modal:null,tourOn:false,more:false,
  /* režim poroty: persony, ZSE/VSE, ⚙ a demo príbeh; zákazník ich nevidí */
  jury:false,
  /* návštevy pre uvítaciu hlášku a odznak Ranné slniečko (deň dema S.day) */
  visit:{anna:{day:0,streak:0},peter:{day:0,streak:0}},welcome:null,
  /* notifikácie v zvončeku; for = komu patrí (anna | peter | both) */
  notes:[{id:'n0',day:0,t:'08:00',kind:'month',for:'both',title:'Vyúčtovanie za september je pripravené',text:'Pozrite si ukážku mesačného vyúčtovania.',go:'reports:inv',read:false},
         {id:'n1',day:0,t:'07:30',kind:'state',for:'both',title:'Vitajte v skupine Spoločná energia',text:'Členstvo je aktívne – zdieľanie beží.',go:'group',read:true}],
  /* prehrávač dňa na Domove (oddelený od lišty času na Mape a v Nápadoch) */
  pl:{idx:24,playing:false,est:false,speed:1},
  mapHi:null,
  chat:{open:false,msgs:[],typing:false},mtab:'off',exitSel:'',
  p:{price:0.11,share:100,surplus:10,pStart:'10:30',pEnd:'15:30',weather:100,conf:'vysoká',ims:true,own:67,auto:false,feedin:0.036,occ:7,vis:VIS_PUB,code:'SLNKO-4821',indiv:{on:false,price:0.09},pw:{label:'pračka',kwh:1.2,orig:'10:45',time:'10:45',accepted:false,cheat:false},pb:{label:'bojler',kwh:1.5,orig:'15:00',time:'15:00',accepted:false,cheat:false},pev:{label:'nabíjanie elektromobilu',kwh:2.0,orig:'14:45',time:'14:45',accepted:false,cheat:false}},
  bat:{on:true,cap:10,pow:1.25,eff:90,minSoc:10,pct:70,eStart:'18:00',eEnd:'22:00',price:0.115,ownFirst:false,carry:0},
  c:{max:0.13,maxEve:0.15,ref:0.17,daily:7.0,cStart:'10:00',cEnd:'16:00',base:0.1,appKwh:1.2,appTime:'19:00',appOrig:'19:00',accepted:false,ims:true,washCheat:false,ev:{label:'nabíjanie vozidla',kwh:2.0,orig:'20:00',time:'20:00',accepted:false,cheat:false},wh:{label:'ohrev vody',kwh:1.5,orig:'06:00',time:'06:00',accepted:false,cheat:false},ice:{label:'výrobník ľadu',kwh:1.0,orig:'17:00',time:'17:00',accepted:false,cheat:false},dry:{label:'sušička',kwh:2.0,orig:'18:00',time:'18:00',accepted:false,cheat:false},cool:{label:'predchladenie chladiacich boxov',kwh:1.8,orig:'16:00',time:'16:00',accepted:false,cheat:false},oven:{label:'predpečenie v rúre',kwh:2.5,orig:'17:30',time:'17:30',accepted:false,cheat:false}},
  om:{anna:{id:'SK-OM-1101',addr:'Krajinská 8, Piešťany',type:'om_house',pv:true,kwp:6.5},peter:{id:'SK-OM-0001',addr:'Hlavná 12, Trnava',type:'om_shop',pv:false,kwp:0}},
  meter:{idx:48,anna:1.20,peter:1.00},
  sim:{days:22,dev:8,others:false,win:2.75,idx:96,playing:false,speed:10},
  o:{bPrice:0.12,cMax:0.10,dMax:0.14},
  mem:{anna:'ACTIVE',peter:'ACTIVE'},group:'g17',reserve:{anna:null,peter:null},
  pts:{base:340,baseA:210,cap:60},day:1,fu:{anna:null,peter:null},
  imsReqd:{chata:true},chPick:{},ref:{qr:false,inv:3,act:1},iw:{bal:12000,best:0,day:1,red:{},got:{},pend:[]},wz:null,acc:{cno:'',psc:'',email:'',ok:false,err:'',done:false},sup:{email:'',tel:'',ok:false,sent:false,err:''},calc:{pkwh:100,pprice:0.11,pfeed:0.036,ckwh:100,cprice:0.11,cref:0.17},fee:{mode:FEE_FIX,fix:15,pct:12},codeOk:false,pay:{sepa:false},cmp:[],notif:{email:true,push:true,pred:true,chal:true,state:true,price:true,month:true},
  ob:{step:1,role:'cons',consent:false,group:'g17'},
  reg:{step:'choose',company:'zse',load:0,sent:false},
  match:{done:false,sort:'match'},
  don:{on:false,pct:0,rcp:'r2',need:30,rcps:[],pub:false},esg:{on:false,kwh:20,rcp:'r2'},
  bank:{on:false,pct:100,bal:120,rate:90,fee:5,winter:0.19,month:0,pays:[],playing:false},
  gifts:[],send:{to:'k1',code:'',kwh:3,occ:'Narodeniny',msg:'Všetko najlepšie! Posielam ti kúsok slnka z Piešťan.',fee:0,src:'bank',anim:null,last:null},
  agent:{on:false,done:[],minA:0.09,maxP:0.12,goal:200,prio:'zarobiť',appl:{pw:true,pb:true,wash:true,ev:true},cancel:{}},
  twin:{cloud:600,off:{},co2:0.15},
  ev:{cap:60,minSoc:40,soc0:45,plugIn:'09:00',plugOut:'16:30',back:'17:00',drive:4,pow:2.75,chPrice:0.08,sellPrice:0.135,v2gStart:'18:00',v2gEnd:'21:00',roofs:4,rush:5},
  badge:{name:'Bistro U Petra'},
  mapSel:null,
  log:[{t:'—',m:'Demo dáta načítané'}]
});
let S=defaults();
/* stav sa neukladá – po F5 začína demo vždy od začiatku; staré uložené dáta z predchádzajúcej verzie sa zmažú */
try{localStorage.removeItem('zdielna:v3')}catch(e){}
/* aktuálny 15-min interval podľa hodín (zákaznícky režim – „Práve teraz“) */
const realIdx=()=>{const n=new Date();return Math.min(95,Math.floor((n.getHours()*60+n.getMinutes())/15))};
const isAct=m=>m==='ACTIVE'||m==='ENDING';
const MEM={NONE:'Bez skupiny',MATCH:'Predbežný match',READY:'Žiadosť pripravená',PENDING:'Čaká na aktiváciu',ACTIVE:'Aktívny člen',ENDING:'Čaká na ukončenie'};
/* dp = typický rozdiel ceny v skupine oproti vašej cene (€/kWh) – iba na odhad pri výbere skupiny */
const GROUPS=[
 {id:'g17',code:'SE-ZSE-0417',dp:0,name:'Spoločná energia',prod:8,cons:21,cap:35,reg:'zse',town:'Trnava · Piešťany',succ:73,tag:'Odporúčaná skupina',why:'najlepší celkový časový súlad výroby a spotreby',f:1},
 {id:'g4',code:'ZD-ZSE-0204',dp:-0.003,name:'Zelená dolina 4',prod:5,cons:12,cap:20,reg:'zse',town:'Nitra · Hlohovec',succ:68,tag:'Najnižšia očakávaná cena',why:'členovia s nižšími ponukovými cenami',f:.93},
 {id:'g9',code:'PO-VSE-0609',dp:0.004,name:'Poludnie 9',prod:11,cons:30,cap:45,reg:'vse',town:'Prešov · Košice',succ:79,tag:'Najstabilnejší profil',why:'najvyššia spoľahlivosť predikcií členov',f:.88},
 /* ukážka presunu: skupina s lepším časovým súladom pre odberateľa aj výrobcu (operátor do nej presúva) */
 {id:'g21',code:'PS-ZSE-0521',dp:-0.002,name:'Poludňajšie slnko',prod:9,cons:18,cap:30,reg:'zse',town:'Trnava · Hlohovec',succ:81,tag:'Najlepší súlad s vaším profilom',why:'členovia vyrábajú presne v čase vašej spotreby',f:1.12}
];
/* číselník príjemcov Lúča pomoci – spravuje operátor; každý má odberné miesto s IMS v skupine zdieľania E.SK (ilustračné údaje) */
const RCP={r1:{name:'Rodina v núdzi – Hlohovec',type:'Rodina v núdzi',via:'cez Mesto Hlohovec',town:'Hlohovec',ic:'🏠',eic:'24ZZS000000R001'},
 r2:{name:'ZŠ Komenského – Piešťany',type:'Škola',via:'cez Mesto Piešťany',town:'Piešťany',ic:'🏫',eic:'24ZZS000000R002'},
 r3:{name:'Charita – Trnava',type:'Charita',via:'cez Trnavskú arcidiecéznu charitu (ilustračne)',town:'Trnava',ic:'🤝',eic:'24ZZS000000R003'}};
const DON_MAX=3;   /* najviac 3 príjemcovia na výrobcu */
const CONTACTS={k1:{name:'Babka Mária',town:'Košice',om:'SK-OM-7712'},k2:{name:'Brat Tomáš',town:'Poprad',om:'SK-OM-5520'},k3:{name:'Mama Eva',town:'Prešov',om:'SK-OM-8104'},k4:{name:'Kamarátka Lucia',town:'Bratislava',om:'SK-OM-2231'}};
const gname=id=>(GROUPS.find(g=>g.id===id)||GROUPS[0]).name;
/* obsadenosť skupiny: členovia (výrobcovia + odberatelia) voči kapacite */
const gOcc=g=>{const n=g.prod+g.cons;return {n,cap:g.cap,free:Math.max(0,g.cap-n),full:n>=g.cap,p:Math.min(1,n/g.cap)}};
const REG={zse:{name:'Západ',co:'ZSE',on:true},sse:{name:'Stred',co:'SSE',on:false},vse:{name:'Východ',co:'VSE',on:true}};
const logEv=m=>{S.log.unshift({t:new Date().toLocaleTimeString('sk-SK'),m})};
/* meno prihláseného (demo) zákazníka z exportu; mimo demo vráti null a platí pôvodné meno persony */
/* celé meno demo zákazníka (pre prepínač persón); pred načítaním dát vráti null */
function demoFullName(){try{const c=demoCustomerParts();return c.last?c.first+' '+c.last:null}catch(e){return null}}
function demoWho(id){try{if(id===S.persona&&S.reg&&S.reg.demoCustomer&&S.wz&&S.wz.oms&&S.wz.oms.length){const r=DEMO_ROWS.find(x=>x.customer_id===Number(S.reg.demoCustomer));if(r)return tcName(r.first_name)+' '+tcName(r.last_name)}}catch(e){}return null}
const nm=id=>demoWho(id)||({anna:'Anna',peter:'Peter',B:'Výrobca B',C:'Odberateľ C',D:'Odberateľ D',SK:'Škola',NB:'Nabíjačka',don:'Lúč pomoci'}[id]||(String(id).startsWith('gift:')?'Pošli slnko → '+((CONTACTS[id.slice(5)]||{}).name||id.slice(5)):id));

