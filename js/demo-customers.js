/* Supplied database extract. Null means unavailable; zero remains zero.
   multi_om rows are connections, not separate meters or customers. */
const DEMO_PREVIOUS_ROWS=[
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
// Latest registration export is authoritative for customer ownership and settings.
const DEMO_REGISTRATION_EXPORT=[
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 272,
  "object_name": "Odberné miesto 272",
  "object_type": null,
  "city": "PEZINOK",
  "region": "BL",
  "tariff": "D2",
  "tdo": null,
  "hdo": null,
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 9.9,
  "expected_consumption_2026_mwh": 11.67,
  "expected_annual_consumption_kwh": 11670.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000001322"
  ],
  "production_eic_codes": [
   "24ESKVYR00001322"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000001322",
    "mapping_count": 1,
    "registry_meter_id": 1322,
    "measurement_meter_id": 1322,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00001322",
    "mapping_count": 1,
    "registry_meter_id": 2329,
    "measurement_meter_id": 2329,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": null,
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000001322",
     "mapping_count": 1,
     "registry_meter_id": 1322,
     "measurement_meter_id": 1322,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00001322",
     "mapping_count": 1,
     "registry_meter_id": 2329,
     "measurement_meter_id": 2329,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D2",
   "address": {
    "city": "PEZINOK",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 272",
   "object_type": null,
   "connection_id": 272,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 9.9,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 11670.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 344,
  "object_name": "Odberné miesto 344",
  "object_type": null,
  "city": "ŽIRANY",
  "region": "NI",
  "tariff": "D3",
  "tdo": null,
  "hdo": "145",
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 28.26,
  "expected_annual_consumption_kwh": 28260.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000001124"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000001124",
    "mapping_count": 1,
    "registry_meter_id": 1124,
    "measurement_meter_id": 1124,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "145",
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000001124",
     "mapping_count": 1,
     "registry_meter_id": 1124,
     "measurement_meter_id": 1124,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D3",
   "address": {
    "city": "ŽIRANY",
    "region": "NI"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 344",
   "object_type": null,
   "connection_id": 344,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 28260.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 417,
  "object_name": "Odberné miesto 417",
  "object_type": null,
  "city": "BÁNOVCE NAD BEBRAVOU",
  "region": "TC",
  "tariff": "D2",
  "tdo": null,
  "hdo": null,
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 10.0,
  "expected_consumption_2026_mwh": 21.21,
  "expected_annual_consumption_kwh": 21210.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000002014"
  ],
  "production_eic_codes": [
   "24ESKVYR00002014"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000002014",
    "mapping_count": 1,
    "registry_meter_id": 2014,
    "measurement_meter_id": 2014,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00002014",
    "mapping_count": 1,
    "registry_meter_id": 3021,
    "measurement_meter_id": 3021,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": null,
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000002014",
     "mapping_count": 1,
     "registry_meter_id": 2014,
     "measurement_meter_id": 2014,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00002014",
     "mapping_count": 1,
     "registry_meter_id": 3021,
     "measurement_meter_id": 3021,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D2",
   "address": {
    "city": "BÁNOVCE NAD BEBRAVOU",
    "region": "TC"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 417",
   "object_type": null,
   "connection_id": 417,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 10.0,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 21210.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 540,
  "object_name": "Odberné miesto 540",
  "object_type": null,
  "city": "PARTIZÁNSKE",
  "region": "TC",
  "tariff": "D5",
  "tdo": null,
  "hdo": "160",
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 9.805,
  "expected_consumption_2026_mwh": 23.43,
  "expected_annual_consumption_kwh": 23430.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000001339"
  ],
  "production_eic_codes": [
   "24ESKVYR00001339"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000001339",
    "mapping_count": 1,
    "registry_meter_id": 1339,
    "measurement_meter_id": 1339,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00001339",
    "mapping_count": 1,
    "registry_meter_id": 2346,
    "measurement_meter_id": 2346,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "160",
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000001339",
     "mapping_count": 1,
     "registry_meter_id": 1339,
     "measurement_meter_id": 1339,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00001339",
     "mapping_count": 1,
     "registry_meter_id": 2346,
     "measurement_meter_id": 2346,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "PARTIZÁNSKE",
    "region": "TC"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 540",
   "object_type": null,
   "connection_id": 540,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 9.805,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 23430.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1225,
  "object_name": "Odberné miesto 1225",
  "object_type": null,
  "city": "PEZINOK",
  "region": "BL",
  "tariff": "D2",
  "tdo": null,
  "hdo": null,
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 26.23,
  "expected_annual_consumption_kwh": 26230.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000000933"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000000933",
    "mapping_count": 1,
    "registry_meter_id": 933,
    "measurement_meter_id": 933,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": null,
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000000933",
     "mapping_count": 1,
     "registry_meter_id": 933,
     "measurement_meter_id": 933,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D2",
   "address": {
    "city": "PEZINOK",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1225",
   "object_type": null,
   "connection_id": 1225,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 26230.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1244,
  "object_name": "Odberné miesto 1244",
  "object_type": null,
  "city": "BRATISLAVA",
  "region": "BL",
  "tariff": "D5",
  "tdo": null,
  "hdo": "160",
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 29.72,
  "expected_annual_consumption_kwh": 29720.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000000958"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000000958",
    "mapping_count": 1,
    "registry_meter_id": 958,
    "measurement_meter_id": 958,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "160",
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000000958",
     "mapping_count": 1,
     "registry_meter_id": 958,
     "measurement_meter_id": 958,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "BRATISLAVA",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1244",
   "object_type": null,
   "connection_id": 1244,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 29720.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1297,
  "object_name": "Odberné miesto 1297",
  "object_type": null,
  "city": "ROVINKA",
  "region": "BL",
  "tariff": "D5",
  "tdo": "TDO6",
  "hdo": "160",
  "has_ims": false,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 13.15,
  "expected_annual_consumption_kwh": 13150.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000000148"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000000148",
    "mapping_count": 1,
    "registry_meter_id": 148,
    "measurement_meter_id": 148,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "160",
   "tdo": "TDO6",
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000000148",
     "mapping_count": 1,
     "registry_meter_id": 148,
     "measurement_meter_id": 148,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "ROVINKA",
    "region": "BL"
   },
   "has_ims": false,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1297",
   "object_type": null,
   "connection_id": 1297,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 13150.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1324,
  "object_name": "Odberné miesto 1324",
  "object_type": null,
  "city": "KOSTOLNÉ KRAČANY",
  "region": "TA",
  "tariff": "D5",
  "tdo": "TDO6",
  "hdo": "160",
  "has_ims": false,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 12.39,
  "expected_annual_consumption_kwh": 12390.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000000124"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000000124",
    "mapping_count": 1,
    "registry_meter_id": 124,
    "measurement_meter_id": 124,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "160",
   "tdo": "TDO6",
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000000124",
     "mapping_count": 1,
     "registry_meter_id": 124,
     "measurement_meter_id": 124,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "KOSTOLNÉ KRAČANY",
    "region": "TA"
   },
   "has_ims": false,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1324",
   "object_type": null,
   "connection_id": 1324,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 12390.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1611,
  "object_name": "Odberné miesto 1611",
  "object_type": null,
  "city": "BRATISLAVA",
  "region": "BL",
  "tariff": "D2",
  "tdo": null,
  "hdo": null,
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 8.2,
  "expected_consumption_2026_mwh": 52.94,
  "expected_annual_consumption_kwh": 52940.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000001365"
  ],
  "production_eic_codes": [
   "24ESKVYR00001365"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000001365",
    "mapping_count": 1,
    "registry_meter_id": 1365,
    "measurement_meter_id": 1365,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00001365",
    "mapping_count": 1,
    "registry_meter_id": 2372,
    "measurement_meter_id": 2372,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": null,
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000001365",
     "mapping_count": 1,
     "registry_meter_id": 1365,
     "measurement_meter_id": 1365,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00001365",
     "mapping_count": 1,
     "registry_meter_id": 2372,
     "measurement_meter_id": 2372,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D2",
   "address": {
    "city": "BRATISLAVA",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1611",
   "object_type": null,
   "connection_id": 1611,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 8.2,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 52940.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1869,
  "object_name": "Odberné miesto 1869",
  "object_type": null,
  "city": "BÁHOŇ",
  "region": "BL",
  "tariff": "D5",
  "tdo": null,
  "hdo": "159",
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 0.0,
  "expected_consumption_2026_mwh": 6.4,
  "expected_annual_consumption_kwh": 6400.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000002039"
  ],
  "production_eic_codes": [
   "24ESKVYR00002039"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000002039",
    "mapping_count": 1,
    "registry_meter_id": 2039,
    "measurement_meter_id": 2039,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00002039",
    "mapping_count": 1,
    "registry_meter_id": 3046,
    "measurement_meter_id": 3046,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "159",
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000002039",
     "mapping_count": 1,
     "registry_meter_id": 2039,
     "measurement_meter_id": 2039,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00002039",
     "mapping_count": 1,
     "registry_meter_id": 3046,
     "measurement_meter_id": 3046,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "BÁHOŇ",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1869",
   "object_type": null,
   "connection_id": 1869,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 0.0,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 6400.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1870,
  "object_name": "Odberné miesto 1870",
  "object_type": null,
  "city": "BÁHOŇ",
  "region": "BL",
  "tariff": "D5",
  "tdo": null,
  "hdo": "160",
  "has_ims": true,
  "has_consumption": true,
  "has_production_meter": true,
  "registry_has_production": true,
  "installed_power_kw": 0.0,
  "expected_consumption_2026_mwh": 6.41,
  "expected_annual_consumption_kwh": 6410.0,
  "expected_annual_production_kwh": 0.0,
  "consumption_eic_codes": [
   "24ESK00000002038"
  ],
  "production_eic_codes": [
   "24ESKVYR00002038"
  ],
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000002038",
    "mapping_count": 1,
    "registry_meter_id": 2038,
    "measurement_meter_id": 2038,
    "has_measurement_mapping": true
   },
   {
    "kind": "production",
    "eic_code": "24ESKVYR00002038",
    "mapping_count": 1,
    "registry_meter_id": 3045,
    "measurement_meter_id": 3045,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": true,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": "160",
   "tdo": null,
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000002038",
     "mapping_count": 1,
     "registry_meter_id": 2038,
     "measurement_meter_id": 2038,
     "has_measurement_mapping": true
    },
    {
     "kind": "production",
     "eic_code": "24ESKVYR00002038",
     "mapping_count": 1,
     "registry_meter_id": 3045,
     "measurement_meter_id": 3045,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D5",
   "address": {
    "city": "BÁHOŇ",
    "region": "BL"
   },
   "has_ims": true,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": true,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1870",
   "object_type": null,
   "connection_id": 1870,
   "has_production": true,
   "has_consumption": true,
   "installed_power_kw": 0.0,
   "expected_annual_production_kwh": 0.0,
   "expected_annual_consumption_kwh": 6410.0
  }
 },
 {
  "customer_id": 330,
  "customer_number": "5300000330",
  "first_name": "JOZ",
  "last_name": "GGÁL",
  "connection_id": 1875,
  "object_name": "Odberné miesto 1875",
  "object_type": null,
  "city": "TESÁRSKE MLYŇANY",
  "region": "NI",
  "tariff": "D2",
  "tdo": "TDO4",
  "hdo": null,
  "has_ims": false,
  "has_consumption": true,
  "has_production_meter": false,
  "registry_has_production": false,
  "installed_power_kw": null,
  "expected_consumption_2026_mwh": 12.85,
  "expected_annual_consumption_kwh": 12850.0,
  "expected_annual_production_kwh": null,
  "consumption_eic_codes": [
   "24ESK00000000283"
  ],
  "production_eic_codes": null,
  "meters": [
   {
    "kind": "consumption",
    "eic_code": "24ESK00000000283",
    "mapping_count": 1,
    "registry_meter_id": 283,
    "measurement_meter_id": 283,
    "has_measurement_mapping": true
   }
  ],
  "sharing_enabled": true,
  "receive_shared_energy": true,
  "offer_shared_energy": false,
  "has_electric_vehicle": null,
  "registration_card": {
   "hdo": null,
   "tdo": "TDO4",
   "meters": [
    {
     "kind": "consumption",
     "eic_code": "24ESK00000000283",
     "mapping_count": 1,
     "registry_meter_id": 283,
     "measurement_meter_id": 283,
     "has_measurement_mapping": true
    }
   ],
   "tariff": "D2",
   "address": {
    "city": "TESÁRSKE MLYŇANY",
    "region": "NI"
   },
   "has_ims": false,
   "settings": {
    "object_type": null,
    "sharing_enabled": true,
    "offer_shared_energy": false,
    "receive_shared_energy": true
   },
   "object_name": "Odberné miesto 1875",
   "object_type": null,
   "connection_id": 1875,
   "has_production": false,
   "has_consumption": true,
   "installed_power_kw": null,
   "expected_annual_production_kwh": null,
   "expected_annual_consumption_kwh": 12850.0
  }
 }
];
const DEMO_ROWS=DEMO_REGISTRATION_EXPORT.map(r=>{
 const old=DEMO_PREVIOUS_ROWS.find(o=>o.connection_id===r.connection_id&&o.consumption_eic_codes[0]===r.consumption_eic_codes[0]);
 return {...old,...r,production_eic_codes:r.production_eic_codes||[],consumption_eic_codes:r.consumption_eic_codes||[],annual_expected_consumption_mwh:r.expected_consumption_2026_mwh,
 annual_expected_consumption_kwh:r.expected_annual_consumption_kwh,annual_expected_production_kwh:r.expected_annual_production_kwh,
 meters:r.meters.map(m=>({...old?.meters.find(o=>o.eic_code===m.eic_code),...m,energy_meter_id:m.measurement_meter_id}))};
});
const demoCustomerId=()=>Number(S.reg.demoCustomer||330);
const demoRows=()=>DEMO_ROWS.filter(r=>r.customer_id===demoCustomerId());
const DEMO_LABELS={consumer:'Odberateľ',multi_om:'Viac OM',no_ims:'Bez IMS',prosumer:'Spotreba + výroba'};
const demoCustomer=()=>demoRows()[0];
const demoCustomerName=()=>{const r=demoCustomer();return r?[r.first_name,r.last_name].filter(Boolean).join(' '):'Testovací zákazník'};
/* meno prihláseného zákazníka z exportu (v dátach je VERZÁLKAMI) – pre uvítanie a Nastavenia */
const tcName=t=>String(t||'').toLowerCase().replace(/(^|[\s-])(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('sk'));
const demoCustomerParts=()=>{const r=demoCustomer();return r?{first:tcName(r.first_name),last:tcName(r.last_name),num:r.customer_number}:{first:'Testovací',last:'zákazník',num:''}};
const demoIsOn=()=>!!(S.reg.demoCustomer&&S.wz&&S.wz.oms&&S.wz.oms.length);
function demoPicker(){return `<label class="f"><span>Testovací zákazník</span><select data-k="reg.demoCustomer" data-t="i">${[...new Set(DEMO_ROWS.map(r=>r.customer_id))].map(id=>{const rows=DEMO_ROWS.filter(r=>r.customer_id===id),r=rows[0];return `<option value="${id}" ${id===demoCustomerId()?'selected':''}>${esc(r.first_name+' '+r.last_name)} · ${esc(r.customer_number)} · ${rows.length} odberných miest</option>`}).join('')}</select></label>`}
function demoLoad(){
 const rows=[...demoRows()];const rovinka=rows.findIndex(r=>r.connection_id===1297);if(rovinka>=0)rows.splice(2,0,...rows.splice(rovinka,1));S.persona=rows.some(r=>r.production_eic_codes.length)?'anna':'peter';
 const oms=rows.map(r=>({id:'connection-'+r.connection_id,eic:r.consumption_eic_codes[0],addr:[r.city,r.region].filter(Boolean).join(' · '),
  name:r.object_name||'Odberné miesto '+r.connection_id,icon:'om_house',mwh:r.annual_expected_consumption_mwh,pmwh:r.expected_annual_production_kwh==null?null:r.expected_annual_production_kwh/1000,
  on:r.sharing_enabled===true,ims:r.has_ims,pv:!!r.production_eic_codes.length,bat:false,source:r,
  opts:{cons:r.has_ims&&r.receive_shared_energy===true,prod:r.has_ims&&r.offer_shared_energy===true&&!!r.production_eic_codes?.length,bat:false},strat:null,own:null,august:DEMO_AUGUST.connections.find(a=>a.connection_id===r.connection_id&&a.customer_id===r.customer_id&&a.consumption_eic===r.consumption_eic_codes[0]),batAns:null,imsReq:false,imsOption:r.has_ims?null:'170'}));
 S.wz={step:1,oms,ev:rows[0].has_electric_vehicle??null,sent:false,err:'',edit:-1,pick:null,own:null};
 const o=oms[0];Object.assign(S.om[S.persona],{id:o.eic,addr:o.addr,type:o.icon,pv:o.pv,kwp:o.source.installed_power_kw??0});
}
const demoValue=(v,unit)=>v==null?'Chýba údaj':fm(v,3)+' '+unit;
function demoDetails(o){const r=o.source;if(!r)return '';return `<details style="margin:12px 0"><summary>Údaje z testovacej databázy · zákazník ${r.customer_id} · pripojenie ${r.connection_id}</summary>
 <p class="sm mut">${esc(r.first_name+' '+r.last_name)} · zákaznícke číslo ${esc(r.customer_number)} · ${esc(r.city)} (${esc(r.region)})<br>Tarifa: ${esc(r.tariff??'Neuvedená')} · TDO: ${esc(r.tdo??'Neuvedené')} · HDO: ${esc(r.hdo??'Neuvedené')}<br>Typ objektu: ${esc(r.object_type??'Neuvedený')} · IMS: ${r.has_ims?'áno':'nie'} · úplný profil: ${r.complete_profiles==null?'neuvedené':r.complete_profiles?'áno':'nie'}</p>
 <p class="sm">Ročná spotreba: ${demoValue(r.annual_expected_consumption_kwh,'kWh')} · Ročná výroba: ${demoValue(r.annual_expected_production_kwh,'kWh')}<br>August – spotreba: ${demoValue(r.august_consumption_kwh,'kWh')} · výroba: ${demoValue(r.august_production_kwh,'kWh')}<br>Inštalovaný výkon: ${demoValue(r.installed_power_kw,'kW')}</p>
 ${r.meters.map(m=>`<p class="sm"><b>${m.kind==='production'?'Výroba':'Spotreba'}</b> · EIC ${m.eic_code}<br>Elektromer ${m.energy_meter_id} · register ${m.registry_meter_id} · mapovanie ${m.has_measurement_mapping?'áno':'nie'} (${m.mapping_count}) · špička ${demoValue(m.peak_kw,'kW')} · august ${demoValue(m.august_energy_kwh,'kWh')}</p>`).join('')}
 ${r.production_eic_codes.length?'<p class="xs mut">Ročná výroba v exporte je 0; nejde o overenú nulovú výrobu. Pre odhad treba doplniť ročný profil.</p>':''}</details>`}
