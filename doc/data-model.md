# Štruktúra dát pre Marketplace

Zdroj: `doc/podklady/Sprievodný dokument k datam pre Marketplace.docx` a `doc/podklady/Kmeňové data.xlsx`
(podklady E.SK, necommitujú sa – obsahujú mená a dátumy narodenia, aj keď anonymizované).

Všetky dáta sú anonymizované a určené výhradne na účely Marketplace / hackathonu.

## Prehľad

```
Zákazník (CISLO_ZAKAZNIKA)
  └─ 1..N  Odberné miesto  (EIC_SPOTREBNE)      ← kmeňové dáta
              ├─ 0..1  Odovzdávacie (výrobné) miesto (EIC_VYROBNE)
              ├─ 15-min spotreba     (OM = EIC_SPOTREBNE)   ← len s IMS
              └─ 15-min prebytky     (OM = EIC_VYROBNE)     ← len výrobcovia
Bez IMS → spotreba len ročná (PREDPOKLADANA_SPOTREBA_2026_MWH) + profil TDO
```

Kľúčom medzi súbormi je **EIC kód**. Jeden zákazník môže mať viac OM. Každé OM môže byť **len v jednej skupine zdieľania**.

## 1. Kmeňové dáta (1 riadok = 1 odberné miesto)

| Atribút | Význam |
|---|---|
| `CISLO_ZAKAZNIKA` | číslo zákazníka v systémoch E.SK |
| `MENO`, `PRIEZVISKO` | meno zákazníka (anonymizované) |
| `DATUM_NARODENIA` | dátum narodenia (Excel sériové číslo) |
| `KOMODITA` | elektrina / plyn (v dátach len elektrina) |
| `EIC_SPOTREBNE` | EIC kód odberného miesta |
| `PREDPOKLADANA_SPOTREBA_2026_MWH` | predpokladaná ročná spotreba 2026 v MWh |
| `TARIFA` | distribučná sadzba D1 – D5 (↔ cenník DD1 – DD6, viď [cenniky.md](cenniky.md)) |
| `FREKVENCIA_ODPOCTU` | mesačná / ročná fakturácia |
| `MA_IMS` | inteligentný merací systém: 1 = áno, 0 = nie |
| `TDO` | typový diagram odberu – štandardný profil pre OM bez IMS (napr. 300 kWh/mesiac → odhad po hodinách) |
| `ADRESA_OM_PSC`, `_MESTO`, `_STAT`, `_OKRES`, `_KRAJ` | adresa OM |
| `EIC_VYROBNE` | EIC kód odovzdávacieho (výrobného) miesta |
| `VYROBNA_ZMLUVA_OD` | účinnosť zmluvy na dodávku prebytkov do bilančnej skupiny E.SK (Excel sériové číslo) |
| `MA_VYROBU` | má výrobu: 1 = áno, 0 = nie |
| `INSTALOVANY_VYKON_KW` | inštalovaný výkon FVE v kW |
| `PREDPOKLADANA_ROC_VYROBA_KWH` | predpokladaná ročná výroba v kWh |
| `HDO` | kód hromadného diaľkového ovládania – časy prepínania VT/NT |

### Distribučné sadzby
| Tarifa | Typ | Popis |
|---|---|---|
| D1 | jednopásmová | nižšia spotreba; pri výrobe na OM sa prideľuje D3 |
| D2 | jednopásmová | vyššia spotreba; pri výrobe na OM sa prideľuje D3 |
| D3 | dvojpásmová | NT min. 8 h denne, bez blokovania spotrebičov |
| D4 | dvojpásmová | NT min. 8 h denne, blokovanie akumulačných spotrebičov vo VT; vhodná pre EV |
| D5 | dvojpásmová | elektrické vykurovanie, NT min. 20 h denne; vhodná pre EV |

### Súhrn dát (spočítané z `Kmeňové data.xlsx`)

| Ukazovateľ | Hodnota |
|---|---|
| Odberné miesta | 2 307 (2 211 zákazníkov) |
| S IMS / bez IMS | 2 000 / 307 (bez IMS majú TDO: TDO4 293, TDO5 8, TDO6 6) |
| S výrobou (`MA_VYROBU = 1`) | 1 007 – všetci majú `EIC_VYROBNE` |
| S IMS a bez výroby (potenciálni odberatelia) | 1 000 |
| Výrobcovia s vyplneným výkonom > 0 | 725; výkon 0,75 – 96 kW, medián 5 kW |
| `PREDPOKLADANA_ROC_VYROBA_KWH` > 0 | len 5 záznamov → ročnú výrobu treba **odhadnúť** (výkon × meteo) alebo z 15-min prebytkov |
| Tarify | D2 1 378 · D1 420 · D5 320 · D3 181 · D4 8 |
| Odpočet | ročný 1 651 · mesačný 656 |
| Kraj | BL 1 135 · NI 477 · TA 469 · TC 188 · ostatné < 20 |
| Ročná spotreba | 0 – 174,8 MWh, medián 3,27 MWh |
| Zmluva o výrobe od | najmä 1. 1. 2023, 1. 7. 2023, 1. 4. 2023 |

Pozor pri spracovaní:
- Dátumy sú **Excel sériové čísla** (44927 = 1. 1. 2023).
- Výkon je niekde `0.0000000` aj pri `MA_VYROBU = 1` – chýbajúci údaj, nie nulová FVE.
- Okres OM sa pri tom istom zákazníkovi môže líšiť (rôzne OM).

## 2. Spotreba v 15-min intervaloch (OM s IMS, od 1. 1. 2025)

| Atribút | Význam |
|---|---|
| `FROM` | začiatok 15-min intervalu (`01.01.2025 01:30:00` = 01:30:00 – 01:44:59) |
| `VALUE` | spotrebovaná elektrina v intervale |
| `OM` | EIC odberného miesta (`EIC_SPOTREBNE`) |

Použitie: spotrebné profily, predikcia spotreby, návrh produktov. Len pre OM s IMS.

## 3. Prebytky výroby v 15-min intervaloch (odovzdávacie miesta, od 1. 1. 2025)

| Atribút | Význam |
|---|---|
| `FROM` | začiatok 15-min intervalu |
| `VALUE` | prebytky elektriny odoslané do siete v intervale |
| `OM` | EIC odovzdávacieho miesta (`EIC_VYROBNE`) |

Ide o **prebytky** (to, čo išlo do siete), nie o celkovú výrobu – vlastná spotreba je už odpočítaná.
Zdieľa sa len v rámci toho istého 15-min intervalu.

## Ďalšie zdroje dát

| Zdroj | Na čo |
|---|---|
| [Open-Meteo API](https://open-meteo.com/) | počasie, slnečné žiarenie → predikcia výroby FVE |
| [OKTE – ISOT, výsledky VDT](https://okte.sk/sk/kratkodoby-trh/zverejnenie-udajov-vda/celkove-vysledky-vda/) | trhové ceny elektriny |
| [ZSDIS – Typové diagramy odberu](https://www.zsdis.sk/Uvod/Dodavatelia/Typove-diagramy-odberu/Hodnoty) | hodnoty TDO pre OM bez IMS |
| HDO – Západoslovenská distribučná | časy prepínania VT/NT |
| [cenniky.md](cenniky.md) | ceny dodávky a výkupu |

## Väzba na prototyp

Prototyp dnes beží na simulovaných profiloch v `js/engine.js` (persony Anna a Peter v `js/core.js` → `S.om`).
Reálne dáta by sa mapovali takto:

| Prototyp | Reálne dáta |
|---|---|
| `S.om.<persona>.id` (`SK-OM-…`) | `EIC_SPOTREBNE` (`24ESK…`) |
| `S.om.<persona>.pv`, `.kwp` | `MA_VYROBU`, `INSTALOVANY_VYKON_KW` |
| `S.om.<persona>.addr` | `ADRESA_OM_*` |
| `S.p.ims`, `S.c.ims` | `MA_IMS` |
| profil výroby / prebytkov | 15-min prebytky (`EIC_VYROBNE`) |
| profil spotreby | 15-min spotreba (IMS) alebo ročná spotreba × TDO |
