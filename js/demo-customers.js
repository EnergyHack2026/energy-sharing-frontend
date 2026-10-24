/* Supplied database extract. Null means unavailable; zero remains zero.
   multi_om rows are connections, not separate meters or customers. */
const DEMO_ROWS=[
 ['consumer',1,330,344,1,true,1124,28.260,3605.960,16.824],
 ['consumer',2,1181,1225,1,true,933,26.230,2033.140,9.175],
 ['consumer',3,1200,1244,1,true,958,29.720,1839.092,14.380],
 ['multi_om',1,260,272,2,true,1322,11.670,556.251,10.342,2329,813.188,7.389,9.9],
 ['multi_om',2,1804,1870,2,true,2038,6.410,174.870,10.776,3045,1187.887,7.411,0],
 ['multi_om',3,1804,1869,2,true,2039,6.400,174.883,10.788,3046,1187.866,7.440,0],
 ['no_ims',1,1252,1297,1,false,148,13.150,null,null],
 ['no_ims',2,1809,1875,1,false,283,12.850,null,null],
 ['no_ims',3,1278,1324,1,false,124,12.390,null,null],
 ['prosumer',1,400,417,1,true,2014,21.210,1001.129,14.527,3021,4565.640,31.608,10],
 ['prosumer',2,1556,1611,1,true,1365,52.940,4292.402,14.677,2372,.009,.012,8.2],
 ['prosumer',3,519,540,1,true,1339,23.430,1270.769,7.290,2346,1333.829,8.963,9.805]
].map(([scenario,candidate_rank,customer_id,connection_id,om_count,has_ims,id,mwh,aug,peak,pid,paug,ppeak,kw])=>{
 const eic='24ESK'+String(id).padStart(11,'0'),peic='24ESKVYR'+String(id).padStart(8,'0');
 const meter=(kind,eic_code,mid,energy,power)=>({kind,eic_code,energy_meter_id:mid,registry_meter_id:mid,complete_profile:has_ims,august_energy_kwh:energy,peak_kw:power});
 return {scenario,candidate_rank,customer_id,connection_id,om_count,has_ims,complete_profiles:has_ims,
  consumption_eic_codes:[eic],production_eic_codes:pid?[peic]:[],annual_expected_consumption_mwh:mwh,
  annual_expected_consumption_kwh:Math.round(mwh*1000),annual_expected_production_kwh:pid?0:null,
  august_consumption_kwh:aug,august_production_kwh:pid?paug:null,installed_power_kw:pid?kw:null,
  meters:[meter('consumption',eic,id,aug,peak),...(pid?[meter('production',peic,pid,paug,ppeak)]:[])]};
});
const demoCustomerId=()=>Number(S.reg.demoCustomer||330);
const demoRows=()=>DEMO_ROWS.filter(r=>r.customer_id===demoCustomerId());
const DEMO_LABELS={consumer:'Odberateľ',multi_om:'Viac OM',no_ims:'Bez IMS',prosumer:'Spotreba + výroba'};
function demoPicker(){return `<label class="f"><span>Testovací zákazník</span><select data-k="reg.demoCustomer" data-t="i">${[...new Set(DEMO_ROWS.map(r=>r.customer_id))].map(id=>{const rows=DEMO_ROWS.filter(r=>r.customer_id===id),r=rows[0];return `<option value="${id}" ${id===demoCustomerId()?'selected':''}>${DEMO_LABELS[r.scenario]} · zákazník ${id} · ${rows.length} pripojenie${rows.length>1?' / 2 OM':''}</option>`}).join('')}</select></label>`}
function demoLoad(){
 const rows=demoRows();S.persona=rows.some(r=>r.production_eic_codes.length)?'anna':'peter';
 const oms=rows.map(r=>({id:'connection-'+r.connection_id,eic:r.consumption_eic_codes[0],addr:'Adresa nie je v testovacích dátach',
  name:'Odberné miesto '+r.connection_id,icon:'om_house',mwh:r.annual_expected_consumption_mwh,pmwh:null,
  on:true,ims:r.has_ims,pv:!!r.production_eic_codes.length,bat:false,source:r,
  opts:{cons:r.has_ims,prod:r.has_ims&&!!r.production_eic_codes.length,bat:false},strat:null,own:null,batAns:null,imsReq:false}));
 S.wz={step:1,oms,ev:null,sent:false,err:'',edit:-1,pick:null,own:null};
 const o=oms[0];Object.assign(S.om[S.persona],{id:o.eic,addr:o.addr,type:o.icon,pv:o.pv,kwp:o.source.installed_power_kw??0});
}
const demoValue=(v,unit)=>v==null?'Chýba údaj':fm(v,3)+' '+unit;
function demoDetails(o){const r=o.source;if(!r)return '';return `<details style="margin:12px 0"><summary>Údaje z testovacej databázy · zákazník ${r.customer_id} · pripojenie ${r.connection_id}</summary>
 <p class="sm mut">${r.scenario} · kandidát ${r.candidate_rank} · OM v exporte: ${r.om_count} · IMS: ${r.has_ims?'áno':'nie'} · úplný profil: ${r.complete_profiles?'áno':'nie'}</p>
 <p class="sm">Ročná spotreba: ${demoValue(r.annual_expected_consumption_kwh,'kWh')} · Ročná výroba: ${demoValue(r.annual_expected_production_kwh,'kWh')}<br>August – spotreba: ${demoValue(r.august_consumption_kwh,'kWh')} · výroba: ${demoValue(r.august_production_kwh,'kWh')}<br>Inštalovaný výkon: ${demoValue(r.installed_power_kw,'kW')}</p>
 ${r.meters.map(m=>`<p class="sm"><b>${m.kind==='production'?'Výroba':'Spotreba'}</b> · EIC ${m.eic_code}<br>Elektromer ${m.energy_meter_id} · register ${m.registry_meter_id} · špička ${demoValue(m.peak_kw,'kW')} · august ${demoValue(m.august_energy_kwh,'kWh')}</p>`).join('')}
 ${r.production_eic_codes.length?'<p class="xs mut">Ročná výroba v exporte je 0; nejde o overenú nulovú výrobu. Pre odhad treba doplniť ročný profil.</p>':''}</details>`}
