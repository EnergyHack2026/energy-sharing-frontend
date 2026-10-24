/* User-supplied illustrative tariff/IMS comparison; no live tariff lookup. */
const DEMO_BENEFITS=[
 [1297,32,12.04,3287.50,9862.50,2630,263,178.52,263,.07,7.76,891.60,1145],
 [1324,32,12.04,3097.50,9292.50,2478,247.80,163.32,247.80,.07,8.23,815.60,1069],
 [1875,40,15.05,12850,0,2570,257,136.40,257,.09,7.94,681,1115],
 [272,25,9.41,11670,0,2334,233.40],
 [344,40,15.05,11304,16956,5652,565.20],
 [417,32,12.04,21210,0,4242,424.20],
 [540,32,12.04,9372,14058,4686,468.60],
 [1225,40,15.05,26230,0,5246,524.60],
 [1244,40,15.05,11888,17832,5944,594.40],
 [1611,50,18.81,52940,0,10588,1058.80],
 [1869,25,9.41,2560,3840,1280,128],
 [1870,25,9.41,2564,3846,1282,128.20]
].map(([id,amps,capacity,vt,nt,shared,gross,net1=gross,net170=gross,pay1=null,pay170=null,five1=gross*5,five170=gross*5])=>({id,amps,capacity,vt,nt,shared,gross,net1,net170,pay1,pay170,five1,five170}));
const demoBenefit=o=>DEMO_BENEFITS.find(b=>b.id===o.source?.connection_id);
function demoBenefitTotals(oms,option='170'){
 return oms.filter(o=>o.on&&(!o.ims||o.opts.cons)).reduce((t,o)=>{const b=demoBenefit(o);if(!b)return t;
  const cheap=option==='1',net=cheap?b.net1:b.net170;
  t.annual+=net;t.investment+=o.ims?0:cheap?1:170;t.five+=cheap?b.five1:b.five170;
  t.gross+=b.gross;t.shared+=b.shared;t.fees+=o.ims||!cheap?0:b.capacity-5;t.count++;return t;
 },{annual:0,investment:0,five:0,gross:0,shared:0,fees:0,count:0});
}
function demoBenefitCard(o){const b=demoBenefit(o);if(!b)return '';return `<section class="db-site" aria-label="Istič a prínosy">
 <div class="db-facts"><div><span class="xs mut">Hlavný istič · odhad</span><b>3 × ${b.amps} A</b></div><div><span class="xs mut">Pôvodná fixná platba</span><b>${eur(5)} / mes.</b></div><div><span class="xs mut">Modelová kapacitná platba</span><b>${eur(b.capacity)} / mes.</b></div><div><span class="xs mut">Rozdiel platby</span><b>+${eur(b.capacity-5)} / mes.</b></div></div>
 <p class="xs mut">${esc(o.source.tariff)} · VT ${fm(b.vt,0)} kWh / rok · NT ${fm(b.nt,0)} kWh / rok · odhad zdieľania ${fm(b.shared,0)} kWh / rok</p>
 ${o.ims?`<div class="db-existing"><b>IMS už máte</b><span>Prínos ${eur(b.gross/12)} / mes. · ${eur(b.gross)} / rok</span><span class="xs mut">Investícia 0 € · dodatočná kapacitná platba 0 € podľa dodaného modelu.</span></div>`:`<div class="db-options">${[['1',b.net1,b.pay1,b.five1],['170',b.net170,b.pay170,b.five170]].map(([k,net,pay,five])=>`<article class="db-option ${k==='170'?'recommended':''}"><div class="row between"><b>IMS za ${k} €</b>${k==='170'?'<span class="pill g">Odporúčané v modeli</span>':''}</div><dl><div><dt>Dodatočná platba mesačne</dt><dd>${eur(k==='1'?b.capacity-5:0)}</dd></div><div><dt>Čistý mesačný prínos</dt><dd>${eur(net/12)}</dd></div><div><dt>Čistý ročný prínos</dt><dd>${eur(net)}</dd></div><div><dt>Návratnosť investície</dt><dd>${fm(pay,2)} mes.</dd></div><div><dt>Prínos za 5 rokov po investícii</dt><dd>${eur(five)}</dd></div></dl></article>`).join('')}</div><p class="xs mut">Riešenie za 1 € počíta s navýšením fixnej platby. Riešenie za 170 € podľa dodaného modelu nepridáva mesačný poplatok. Zapojenie je možné až po inštalácii IMS.</p>`}
 </section>`}
function demoBenefitSummary(){if(!S.reg.demoCustomer||!S.wz)return '';const oms=S.wz.oms,a=demoBenefitTotals(oms,'1'),b=demoBenefitTotals(oms,'170'),n=oms.filter(o=>o.on).length,eics=oms.filter(o=>o.on).reduce((n,o)=>n+(o.source?.meters.length||1),0);
 const box=(t,k)=>`<article class="db-option ${k==='170'?'recommended':''}"><b>${k==='170'?'IMS za 170 €':'IMS za 1 €'} · súčet portfólia</b><strong class="db-total">${eur(t.annual/12)} <small>/ mes.</small></strong><dl><div><dt>Čistý prínos za rok</dt><dd>${eur(t.annual)}</dd></div><div><dt>Jednorazová investícia</dt><dd>${eur(t.investment)}</dd></div><div><dt>Prvý rok po investícii</dt><dd>${eur(t.annual-t.investment)}</dd></div><div><dt>Prínos za 5 rokov po investícii</dt><dd>${eur(t.five)}</dd></div></dl></article>`;
 return `<section class="wz-card db-summary"><div class="row between"><div><span class="kicker">Prínosy vybraných miest</span><h2>${n} miest · ${eics} EIC kódov</h2></div><div class="row"><button class="btn" data-act="wzall:1">Zvoliť všetko</button><button class="btn" data-act="wzall:0">Zrušiť výber</button></div></div><p class="sm mut">Súčet spotreby bez dvojitého započítania výrobného EIC. Model počíta s 20 % zdieľanej ročnej spotreby a úsporou 0,10 €/kWh; výnos z predaja výroby nie je zahrnutý. Vlastné ceny v ďalšom kroku tento dodaný model nemenia.</p>
 <div class="db-options">${box(a,'1')}${box(b,'170')}</div><details class="db-months"><summary>Prínos za každý mesiac</summary><p class="xs mut">Rovnomerný odhad: ročný čistý prínos / 12. Sezónne merania chýbajú. Investícia je uvedená samostatne; sumy sa zaokrúhľujú až pri zobrazení.</p><div class="db-table"><table><thead><tr><th>Mesiac</th><th>IMS za 1 €</th><th>IMS za 170 €</th></tr></thead><tbody>${['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'].map(m=>`<tr><th>${m}</th><td>${eur(a.annual/12)}</td><td>${eur(b.annual/12)}</td></tr>`).join('')}</tbody><tfoot><tr><th>Ročne</th><td>${eur(a.annual)}</td><td>${eur(b.annual)}</td></tr></tfoot></table></div></details><p class="xs mut">Ističe sú odhadnuté (ESTIMATED). Platby, návratnosti a odporúčania vychádzajú z dodanej testovacej tabuľky. Miesta bez IMS sú zahrnuté ako budúci stav po inštalácii. Odškrtnutie príjmu energie pri mieste s IMS ho vyradí z výpočtu.</p></section>`;
}
