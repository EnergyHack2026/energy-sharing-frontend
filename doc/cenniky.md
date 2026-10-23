# Cenníky ZSE 2026

Zdroj: `doc/podklady/Cennik_dodavka_elektriny_Domacnosti_ZSE_2026.xlsx` a
`doc/podklady/Cennik_vykup_elektriny_Virtualna_bateria_Flexi.xlsx` (podklady E.SK pre hackathon, necommitujú sa).

Pre zadanie platí: **počítame len s cenou komodity (dodávka)**, bez distribúcie, prenosu, strát a fixných poplatkov.

## Dodávka elektriny – domácnosti (produktový rad ZSE, od 1. 1. 2026)

Bez adresnej energopomoci (štandard):

| Produkt | Sadzba | Pásma | VT bez DPH | VT s DPH | NT bez DPH | NT s DPH | Mesačná platba / OM bez DPH (s DPH) |
|---|---|---|---|---|---|---|---|
| DomovMini | DD1 | 1 | 0,1137 | 0,1353 | – | – | 1,50 € (1,79 €) |
| DomovKlasik | DD2 | 1 | 0,1233 | 0,1467 | – | – | 1,50 € (1,79 €) |
| DomovNočnýPrúd | DD3 | 2 | 0,1371 | 0,1631 | 0,0885 | 0,1053 | 1,50 € (1,79 €) |
| DomovAku | DD4 | 2 | 0,1442 | 0,1716 | 0,1011 | 0,1203 | 1,50 € (1,79 €) |
| DomovVykurovanie | DD5, DD6 | 2 | 0,1533 | 0,1824 | 0,1073 | 0,1277 | 1,50 € (1,79 €) |

S adresnou energopomocou:

| Produkt | Sadzba | VT bez DPH | VT s DPH | NT bez DPH | NT s DPH |
|---|---|---|---|---|---|
| DomovMini | DD1 | 0,0825 | 0,0982 | – | – |
| DomovKlasik | DD2 | 0,0921 | 0,1096 | – | – |
| DomovNočnýPrúd | DD3 | 0,1058 | 0,1259 | 0,0572 | 0,0681 |
| DomovAku | DD4 | 0,1130 | 0,1345 | 0,0698 | 0,0831 |
| DomovVykurovanie | DD5, DD6 | 0,1221 | 0,1453 | 0,0760 | 0,0904 |

Ceny v €/kWh. VT = vysoké pásmo (drahšie), NT = nízke pásmo. Časy VT/NT určuje HDO (viď [data-model.md](data-model.md)).
Mesačná platba je fixný poplatok – v zúčtovaní zdieľania ju ignorujeme.

### Typy sadzieb
| Sadzba | Typ | Podmienky |
|---|---|---|
| DD1 | jednopásmová | nižšia spotreba. **Pri výrobe na OM sa prideľuje distribučná sadzba D3.** |
| DD2 | jednopásmová | vyššia spotreba. **Pri výrobe na OM sa prideľuje distribučná sadzba D3.** |
| DD3 | dvojpásmová | NT min. 8 h denne, z toho aspoň 3 h nepretržite; bez blokovania spotrebičov |
| DD4 | dvojpásmová | NT min. 8 h denne, blokovanie akumulačných spotrebičov vo VT; vhodná aj pre nabíjanie EV |
| DD5 | dvojpásmová | priamovýhrevné vykurovanie, NT min. 20 h denne; vhodná aj pre EV |
| DD6 | dvojpásmová | tepelné čerpadlo, NT min. 20 h denne; vhodná aj pre EV |

Väzba na kmeňové dáta: `TARIFA` D1–D5 ↔ produkt DD1–DD5 (D5 zahŕňa DD5/DD6).

## Výkup prebytkov – Virtuálna batéria Flexi (dynamický produkt ZSE, od 1. 7. 2026)

| Pásmo | Čas | bez DPH €/kWh | s DPH €/kWh |
|---|---|---|---|
| Pásmo 1 | 0:00 – 9:59 | 0,069 | 0,0821 |
| **Pásmo 2** | **10:00 – 17:59** | **0,036** | 0,0428 |
| Pásmo 3 | 18:00 – 23:59 | 0,068 | 0,0809 |
| Pásmo 4 | víkend / sviatok (celý deň) | 0,034 | 0,0405 |

Väčšina domácností nie je platiteľom DPH → **vykupuje sa za cenu bez DPH**.

## Čo z toho plynie pre marketplace

- **Cenové okno zdieľania** (pracovný deň, čas FVE, bez DPH): výrobca dnes dostane za prebytok **0,036 €/kWh**,
  odberateľ platí **0,1137 – 0,1533 €/kWh** (VT). Akákoľvek cena medzi tým je výhodná pre obe strany.
  Príklad: pri cene zdieľania 0,09 €/kWh výrobca zarobí 2,5× viac než pri výkupe a odberateľ s DD2 ušetrí 27 %.
- Najslabší výkup je presne v čase výroby FVE (pásmo 2, víkend) – to je hlavný argument, prečo zdieľať.
- Pri odberateľoch s dvojpásmovou sadzbou porovnávaj s cenou pásma, v ktorom zdieľanie nastane (cez deň zvyčajne VT).
- Cenník dodávky je **len pre domácnosti**. Pre podnikateľov (napr. bistro v demo persone) cenník nemáme – cenu označ ako predpoklad.
- Pozor na DPH: porovnávaj buď všetko bez DPH, alebo všetko s DPH, a v UI to uveď.

## Rozdiely oproti prototypu (`js/core.js`)

| Parameter v kóde | Hodnota v prototype | Podľa cenníka |
|---|---|---|
| `S.p.feedin` (výkup) | 0,05 €/kWh | 0,036 €/kWh cez deň (pásmo 2), 0,034 víkend |
| `S.c.ref` (dodávková cena odberateľa) | 0,17 €/kWh | domácnosti 0,1137 – 0,1533 bez DPH (max 0,1824 s DPH); pre firmy cenník nemáme |
| `S.calc.pfeed` / `S.calc.cref` (kalkulačka) | 0,05 / 0,17 | ako vyššie |
| `S.p.price` (ponuka Anny) | 0,11 €/kWh | v okne 0,036 – 0,123 (DD2) ✅ |
| `S.fee` (provízia E.SK) | 15 €/MWh alebo 12 % | cenník to nerieši – vlastný návrh biznis modelu |
