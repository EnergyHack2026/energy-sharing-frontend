# Odmeňovanie (Slnečný klub) a akvizícia do ZSE/VSE

Dohodnutý model pre Zdieľňu (vetva `final`). Platí pre obrazovky Odmeny / Slnečný klub, Registrácia
a mesačný report a je podkladom pre prezentáciu (`/pr-expert`).

## 1. Model odmeňovania – Slnečný klub

**Princíp:** odmeňujeme spotrebu vtedy, keď má sused prebytok – overenú elektromerom, nikdy nie vyššiu spotrebu.

Pravidlo stojí na **prebytku** (akýkoľvek zdroj, 15-min interval s predikovaným alebo nameraným prebytkom v skupine),
nie doslova na slnku. „Slnko“ ostáva iba v komunikácii (slnečné okno, Slnečný klub).

### Za čo sú body

| Kto | Za čo |
|---|---|
| Odberateľ | každá kWh spotrebovaná v 15-min intervale s prebytkom v skupine |
| Odberateľ | splnená výzva (napr. „práčka v slnečnom okne“) potvrdená elektromerom |
| Odberateľ aj výrobca | séria splnených dní / týždňov |
| Výrobca | spoľahlivá ponuka (presná predikcia), vysoký podiel prebytkov u susedov namiesto výkupu |
| Celá skupina | spoločný cieľ (napr. 80 % využitých prebytkov za mesiac) → bonus všetkým |

### Výzvy
- **Denná** – jeden spotrebič, jedno okno („Dnes perieme so slnkom – presuňte pranie do okna 11:00 – 13:45. +11 bodov“).
- **Týždenná** – napr. „3 prania v slnečnom okne tento týždeň“.
- **Skupinová** – spoločný cieľ skupiny (pruh „Cieľ skupiny Slnečný kruh 17“).

Priebeh: návrh podľa predikcie a zvyčajného času spotrebiča → zákazník prijme → elektromer overí presun →
body podľa presunutých kWh (s denným stropom).

### Pravidlá férovosti
- Okno sa počíta z predikcie prebytku na daný deň (zima, oblačnosť, večer z batérie), nie pevný čas.
- Porovnanie so zvyčajným profilom zákazníka – body len za skutočný presun, nie za spotrebu navyše.
- Denný strop bodov, žiadne mínusové body.
- Výzvu ponúknuť len vtedy, keď je zdieľaná cena nižšia ako zákazníkova cena v danom čase (dvojpásmové sadzby D3 – D5).

### Čo z bodov zákazník má
Body **nie sú peniaze** (zdanenie, vyúčtovanie, riziko „hrania sa na body“). Posúvajú zákazníka po úrovniach
**Bronz → Striebro → Zlato → Slnko** (ukážkové hranice 0 / 250 / 500 / 1 000 bodov, `LEVELS` v `js/views-public.js`).
S úrovňou rastú výhody od dodávateľa:
- nižšia provízia pri zdieľaní,
- zľava na dodávku (len pre zákazníkov ZSE/VSE),
- prednostné párovanie s najvýhodnejšími ponukami,
- partnerské výhody (servis FVE, wallbox, tepelné čerpadlo),
- možnosť darovať cez Solidárne slnko.

Odznaky sú zábavné ocenenie navyše a dajú sa zdieľať.

### Prečo sa zákazník vracia
Denné upozornenie na slnečné okno, týždenná výzva, sezónne odznaky, mesačný report (kWh, €, CO₂).

### Prínos pre E.SK
Viac zdieľaných kWh → viac provízie; menej odchýlok → nižšie náklady na vyrovnávanie (z nich sa dajú financovať výhody);
vyššia lojalita – zákazník je v appke každý týždeň, nie raz ročne.

**Komunikácia:** „Zo zdieľania zarábate a šetríte. Slnečný klub vám pridá výhody navyše – nižšiu províziu a zľavy od dodávateľa.“

## 2. Akvizícia zákazníkov iných dodávateľov do ZSE/VSE

**Pravidlo:** nikdy nie podmienka. Sľub „Dodávateľa meniť nemusíte“ musí ostať pravdou a nič z toho nepatrí
na firemne neutrálnu úvodnú stránku.

| # | Kde | Čo |
|---|---|---|
| 1 | Registrácia – karta „Som zákazník inej spoločnosti“ | drobný tip pod „Spustiť registráciu →“: *„Zákazníci ZSE a VSE sa prihlásia jedným klikom a v Slnečnom klube majú výhody navyše. Pozrieť ponuku dodávky →“* |
| 2 | Koniec registrácie (po odhade) | nepovinné políčko *„☐ Pošlite mi ponuku dodávky elektriny od ZSE/VSE.“* (súhlas v súlade s GDPR) |
| 3 | Appka – po prvom mesačnom reporte (najúčinnejšie) | personalizované číslo z enginu: *„Ako zákazník ZSE by ste tento mesiac ušetrili ďalších X € (nižšia provízia + zľava zo Slnečného klubu). Porovnať ponuku →“* |
| 4 | Slnečný klub – vyššie úrovne | niektoré výhody (napr. zľava na dodávku od úrovne Zlato) len pre zákazníkov ZSE/VSE |

**Odporúčaná kombinácia:** 1 + 3.

## Vety na prezentáciu
- *„Odmeňujeme spotrebu vtedy, keď má sused prebytok – overenú elektromerom, nikdy nie vyššiu spotrebu.“*
- *„Trhovisko je otvorené všetkým, ale zákazník ZSE/VSE z neho má najviac – a to je náš akvizičný kanál.“*
