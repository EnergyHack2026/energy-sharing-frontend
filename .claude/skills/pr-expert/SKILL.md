---
name: pr-expert
description: Priprav 10-minútovú prezentáciu aplikácie: screenshoty, fungovanie, všetky body propozícií, dátová a backendová architektúra, wow efekt a kompletný rečnícky scenár.
---

# Expert na prezentácie aplikácií

Pôsob ako tvorca prezentácií, dramaturg, vizuálny dizajnér a softvérový architekt schopný zrozumiteľne vysvetliť technické riešenie.

Vytvor presvedčivú 10-minútovú prezentáciu, ktorá:
- predstaví hlavnú ideu a hodnotu aplikácie,
- vysvetlí jej fungovanie na konkrétnom príklade,
- pokryje všetky požiadavky uvedené v propozíciách,
- ukáže dátovú štruktúru a backendovú architektúru,
- obsahuje zapamätateľný wow moment.

Aplikáciu predstavuj pomocou screenshotov. Technické súvislosti vysvetľuj jednoduchými statickými schémami. Celá prezentácia musí fungovať bez otvorenia aplikácie, internetu a živého dema.

Predvolene komunikuj po slovensky.

## 1. Najprv spracuj zadanie a propozície

Preštuduj všetky dodané podklady:
- úplné znenie propozícií a hodnotiacich kritérií,
- opis aplikácie a jej cieľovej skupiny,
- screenshoty,
- technickú dokumentáciu alebo dostupný zdrojový kód,
- potvrdené informácie o dátach, backende a použitých technológiách.

Podklady v tomto repe (Zdieľňa, Hackathon 2026 Challenge #2):
- propozície a hodnotiace kritériá: [doc/zadanie.md](../../../doc/zadanie.md),
- cenníky dodávky a výkupu: [doc/cenniky.md](../../../doc/cenniky.md) (vrátane rozdielov oproti prototypu),
- štruktúra dát od E.SK (kmeňové dáta, 15-min spotreba a prebytky, ďalšie zdroje): [doc/data-model.md](../../../doc/data-model.md),
- opis aplikácie, mapa súborov, pravidlá dizajnu a deep linky na screenshoty: `README.md` v koreni repa,
- zdrojový kód: `index.html`, `js/` (dátový model a výpočty v `js/engine.js`, stav v `js/core.js`), `css/`.

Screenshoty vyrob z `index.html` cez deep linky z README (napr. `index.html#view=market&persona=peter`).

Z propozícií vytiahni každú samostatnú požiadavku vrátane podbodov. Oddeľ povinné požiadavky od odporúčaní. Ak sú uvedené váhy hodnotenia, zohľadni ich pri rozdelení času a dôrazu.

Vytvor kontrolnú maticu:

| ID | Požiadavka propozícií | Rola (výrobca / odberateľ / E.SK) | Čo treba vysvetliť alebo doložiť | Snímka | Miesto v scenári | Podklad | Stav |
|---|---|---|---|---|---|---|---|

Pri každej požiadavke urči, ktorej role sa týka. Ak sa týka oboch strán trhu, odpoveď musí byť zvlášť pre výrobcu aj pre odberateľa.

Používaj stavy:
- pokryté,
- čiastočne pokryté,
- chýba podklad.

Za pokrytú považuj požiadavku až vtedy, keď na ňu prezentácia obsahuje konkrétnu odpoveď. Samotné uvedenie jej názvu nestačí.

Povinné body pokry v hlavnej prezentácii. Ich umiestnenie iba do prílohy nepovažuj za splnenie, pokiaľ to propozície výslovne nepripúšťajú.

Ak propozície chýbajú, vyžiadaj ich. Medzitým môžeš pripraviť predbežnú štruktúru, ale nepotvrdzuj úplnosť pokrytia.

## 2. Urči hlavnú myšlienku a príbeh

Sformuluj jednu nosnú vetu:

„Aplikácia pomáha [komu] vyriešiť [problém] prostredníctvom [princíp riešenia], čo prináša [hlavný prínos].“

### Kto je zákazník

Aplikácia je trhovisko, takže má dve strany trhu a zadávateľa. Prezentácia musí jasne pomenovať všetky tri roly:

| Rola | Persona v prototype | Kto to je | Problém | Čo urobí v aplikácii | Čo z toho má |
|---|---|---|---|---|---|
| **Výrobca** | Anna | domácnosť s fotovoltikou a IMS | prebytky predáva lacno do výkupu, nepozná nikoho na zdieľanie | ponúkne prebytky za svoju cenu | zarobí viac než pri výkupe |
| **Odberateľ** | Peter | malý podnik (bistro) bez fotovoltiky, spotreba cez deň | platí plnú dodávkovú cenu, nepozná výrobcu | nájde ponuku, vstúpi do skupiny, posunie spotrebu | ušetrí oproti dodávkovej cene |
| **E.SK (ZSE/VSE)** | prevádzkovateľ trhoviska, porota | dodávateľ elektriny | zákazník otvorí appku 1× ročne, prebytky končia vo výkupe | prevádzkuje trh, zúčtuje, odmeňuje | lojalita, nový produkt, viac využitých prebytkov |

Údaje o personách over v kóde (`js/core.js` → `S.om`, `js/engine.js`). Hodnoty v € a kWh ber z enginu, nie z hlavy.

Pre výrobcu aj odberateľa ukáž: kto to je, aký má problém, čo urobí v appke a koľko získa.
Prínos pre E.SK pomenuj samostatne, pretože ho propozície vyžadujú (obchodný prínos pre zákazníkov **a** spoločnosť E.SK).

Zaraď samostatnú snímku **„Pre koho to je“** s tromi stĺpcami: výrobca, odberateľ, E.SK.

### Príbeh

Vyber jeden súvislý scenár, v ktorom sa výrobca a odberateľ **nepoznajú** a aplikácia ich spojí. To je jadro zadania (zdieľanie bez potreby poznať členov skupiny vopred). Príbeh rozprávaj z oboch strán a na ňom prepoj:
1. Problém výrobcu aj odberateľa.
2. Ich vstupy (ponuka s cenou, dopyt).
3. Činnosť aplikácie (párovanie, skupina, dohoda o cene).
4. Spracovanie údajov (predikcia, 15-min alokácia, zúčtovanie).
5. Výsledok a hodnotu pre každú rolu vrátane E.SK.

Používaj konzistentné príklady a údaje naprieč screenshotmi aj technickým vysvetlením.

Príbeh musí zároveň niesť odpovede na propozície. Povinné témy začleňuj tam, kde prirodzene patria.

## 3. Vysvetli, ako aplikácia funguje

Ukáž celý hlavný proces od vstupu po výsledok.

Pri každom dôležitom kroku vysvetli:
- čo používateľ urobí,
- aké údaje aplikácia potrebuje,
- čo aplikácia vykoná automaticky,
- aké pravidlo, výpočet alebo rozhodnutie sa uplatní,
- čo používateľ dostane ako výsledok.

Odlišuj to, čo používateľ vidí, od spracovania na pozadí.

Vyber primeraný počet screenshotov podľa potrebného vysvetlenia a propozícií. Neobmedzuj počet funkcií tak, že by si vynechal povinnú požiadavku.

Ku každému screenshotu urč:
- jeho účel v príbehu,
- prvok, na ktorý sa má publikum pozerať,
- potrebný výrez alebo zväčšenie,
- stručný komentár vysvetľujúci význam.

Nepredpokladaj, že publikum pochopí fungovanie len z obrázka rozhrania.

## 4. Predstav dátovú štruktúru

Vychádzaj z [doc/data-model.md](../../../doc/data-model.md). Ukáž dátové zdroje od E.SK (kmeňové dáta ↔ 15-min spotreba ↔ 15-min prebytky, kľúč EIC), ich súhrnné čísla (napr. 2 307 odberných miest, 1 007 výrobcov, 2 000 s IMS) a ako sa mapujú na prototyp. Jasne oddeľ, čo prototyp dnes simuluje a čo by čítal z reálnych dát. Nikdy neukazuj osobné údaje z kmeňových dát (mená, dátumy narodenia).

Priprav zrozumiteľný pohľad na dáta aplikácie. Podľa skutočného riešenia vysvetli:
- odkiaľ údaje prichádzajú,
- ktoré sú hlavné dátové entity alebo objekty,
- aké majú podstatné vzťahy,
- kde a ako sa ukladajú,
- ktoré údaje sú vstupné a ktoré vznikajú spracovaním,
- ako sa aktualizujú alebo synchronizujú, ak je to relevantné.

Použi jednoduchú dátovú schému s hlavnými entitami a vzťahmi. Ukáž len atribúty potrebné na pochopenie princípu.

Prepoj dátový model s konkrétnym príkladom zo screenshotov: vysvetli, ktoré údaje sa pri danej činnosti čítajú, vytvárajú alebo menia.

Ak aplikácia používa súbory, externú službu alebo dáta iba v pamäti, opíš skutočný stav. Nevymýšľaj databázu len preto, aby architektúra pôsobila komplexnejšie.

## 5. Predstav backend a architektúru

Vysvetli hlavné komponenty a ich zodpovednosti:
- frontend a používateľské rozhranie,
- backend alebo aplikačnú logiku,
- API a komunikáciu medzi komponentmi,
- databázu alebo iné úložisko,
- externé služby a integrácie.

Pri relevantných častiach vysvetli, kde prebieha:
- validácia vstupov,
- hlavný výpočet alebo rozhodovanie,
- prístup k údajom,
- overovanie používateľa a oprávnení.

Priprav jednoduchú schému architektúry. Šípky označ tak, aby bolo jasné, aké údaje alebo požiadavky prenášajú.

Na jednom príklade zo screenshotov vysvetli cestu požiadavky cez skutočné komponenty až po zobrazenie výsledku.

Použité technológie pomenuj a stručne vysvetli dôvod ich voľby, ak je doložený alebo vyžadovaný propozíciami. Samotný zoznam názvov technológií nestačí.

Rozlišuj:
- skutočne implementované riešenie,
- simulované alebo prototypové časti,
- plánovanú cieľovú architektúru.

Backend neodvodzuj iba zo screenshotov. Vychádzaj z kódu, dokumentácie alebo potvrdeného opisu. Neznáme časti označ na doplnenie.

## 6. Predstav biznis model

Biznis model je povinná súčasť prezentácie. Propozície vyžadujú „prezentáciu obchodného prínosu pre zákazníkov a spoločnosť E.SK“, porota hodnotí „Prínos a realizovateľnosť“ a zadanie žiada „business logiku, ako sa budú tvoriť skupiny zdieľania“. Venuj mu vlastnú snímku (ideálne dve) v hlavnej prezentácii, nie v prílohe.

Ceny ber z [doc/cenniky.md](../../../doc/cenniky.md): výkup cez deň 0,036 €/kWh (pásmo 2) vs. dodávka domácností 0,1137 – 0,1533 €/kWh bez DPH. Toto cenové okno je hlavný argument biznis modelu. Ak sa prototyp od cenníka líši, v prezentácii použi cenník alebo rozdiel výslovne pomenuj. Uvádzaj, či sú ceny s DPH alebo bez DPH.

Vychádzaj z toho, čo je v prototype implementované, a over to v kóde:
- ceny a provízia: `js/core.js` (`S.p.price`, `S.p.feedin`, `S.c.ref`, `S.fee` – pevná €/MWh alebo % z obchodu),
- výpočet provízie a čistej ceny: `js/engine.js` (`feeOf`, `netPrice`), zúčtovanie v `agg()`,
- skupiny, členstvo a stavy žiadosti: `S.group`, `S.mem` a obrazovky Group a Admin v `js/views-app.js`,
- doplnkové služby (batéria, energetická banka, darovanie, „Pošli slnko“): `S.bat`, `S.bank`, `S.gifts`.

Pokry tieto otázky:

1. **Hodnotová ponuka pre každú rolu.** Jedna veta a jedno číslo z enginu:
   - výrobca: zarobí viac než pri výkupe (cena zdieľania vs. výkupná cena),
   - odberateľ: ušetrí oproti dodávkovej cene,
   - E.SK: čo získa (viď bod 3).
2. **Cenotvorba.** Kto určuje cenu (výrobca ponúkne, odberateľ má strop, agenti sa dohodnú). Prečo je výhodná pre obe strany, teda platí *výkup < cena zdieľania < dodávková cena*. Ukáž to jednoduchou cenovou osou.
3. **Ako zarába E.SK.** Provízia z každej zdieľanej kWh (pevná alebo percentuálna; uveď skutočné hodnoty z kódu), poplatky za doplnkové služby, žiadosť o IMS. K tomu nepriame prínosy: lojalita a nižší odchod zákazníkov, appka otváraná častejšie ako 1× ročne vďaka gamifikácii, noví zákazníci (trh nie je obmedzený na bilančnú skupinu E.SK), lepšie využitie prebytkov z FVE.
4. **Business logika skupín.** Jedna veľká skupina E.SK alebo viac skupín na výber. Kto ju zakladá a spravuje. Aká je metóda zdieľania (alokačný kľúč v 15-min intervale). Pravidlo, že OM môže byť len v jednej skupine. Vstup a výstup nie sú okamžité (žiadosť na OKTE). Pomenuj, ako to prototyp rieši.
5. **Tok peňazí.** Jednoduchá schéma: odberateľ platí → E.SK zúčtuje a ponechá si províziu → výrobca dostane čistú sumu. Len komodita, bez distribučných a fixných poplatkov, ako určujú propozície.
6. **Príklad v číslach.** Jeden deň alebo mesiac Anny a Petra z enginu: kWh, cena, zárobok výrobcu, úspora odberateľa, provízia E.SK. Ak je číslo ilustračné alebo z nastavenia v ⚙, tak to aj označ.
7. **Škálovanie a realizovateľnosť.** Čo by bolo treba pre reálne nasadenie (napojenie na OKTE, reálne IMS dáta, fakturácia, právne a daňové podmienky, od ktorých hackathon abstrahuje). Prepoj to s bodom 5 propozícií („čo treba urobiť, aby sa prototyp posunul do reálneho riešenia“).

Nevymýšľaj trhové čísla (počet zákazníkov, obrat, TAM). Ak ich chceš použiť, označ ich ako predpoklad a uveď do zoznamu chýbajúcich podkladov.

## 7. Vytvor wow moment

Vyber jeden hlavný moment, v ktorom publikum jasne uvidí hodnotu aplikácie.

Použi postup:
1. Ukáž konkrétny problém alebo prekážku.
2. Vytvor očakávanie výsledku.
3. Odhaľ riešenie pomocou screenshotu alebo jasného porovnania.
4. Vlož krátku pauzu.
5. Pomenuj význam výsledku jednou zapamätateľnou vetou.

Wow moment môže vzniknúť aj prepojením jednoduchého používateľského kroku s hodnotným spracovaním na pozadí.

Presne urč:
- kde v prezentácii nastane,
- čo publikum uvidí,
- čo rečník povie,
- aký dôkaz podporuje prezentovaný prínos.

Nevymýšľaj úspory, výsledky, referencie ani schopnosti aplikácie. Oddeľ reálne výsledky od ilustračných príkladov.

## 8. Dodrž čas a vizuálnu zrozumiteľnosť

Plánuj 9:30 obsahu vrátane prechodov a páuz a 0:30 rezervy.

Ako východisko použi:

| Čas | Obsah |
|---|---|
| 0:00–0:35 | Úvod zachytávajúci pozornosť. |
| 0:35–1:20 | Problém a roly (výrobca, odberateľ, E.SK). |
| 1:20–1:50 | Hlavná idea riešenia. |
| 1:50–4:15 | Fungovanie cez screenshoty a wow moment. |
| 4:15–5:15 | Dáta, dátový model a zdroje. |
| 5:15–6:30 | Backend, architektúra a spracovanie požiadavky. |
| 6:30–8:00 | Biznis model: cenotvorba, tok peňazí, ako zarába E.SK, skupiny. |
| 8:00–8:50 | Cesta k reálnemu riešeniu a ďalšie povinné témy. |
| 8:50–9:30 | Záver a konkrétny ďalší krok. |

Povinné body propozícií rozlož naprieč celou prezentáciou. Časovanie uprav podľa ich rozsahu a hodnotiacich váh.

Odporúčaný počet snímok je približne 9 až 12. Úplnosť povinného obsahu má prednosť pred týmto odporúčaním.

Pri skracovaní najprv odstráň opakovania, dekoratívne úvody a nepovinné detaily. Povinné body nevynechávaj.

Ak sa rozsah nedá zrozumiteľne odprezentovať za 10 minút, výslovne pomenuj konflikt. Neskrývaj ho nereálnym časovaním.

Na každej snímke používaj:
- jedno hlavné posolstvo,
- krátky titulok vyjadrujúci záver,
- veľké čitateľné písmo,
- dostatok voľného priestoru,
- čitateľné screenshoty alebo jednoduché schémy.

Technické vysvetlenie prispôsob publiku, ale zachovaj jeho vecnú správnosť.

## 9. Dodaj kompletný výstup

Priprav:
1. Nosnú myšlienku a cieľ prezentácie.
2. Maticu pokrytia všetkých požiadaviek propozícií.
3. Storyboard v tabuľke: snímka, čas, posolstvo, text na plátne, vizuál a ID pokrytých požiadaviek.
4. Kompletný hovorený scenár ku každej snímke.
5. Návrh dátovej a backendovej schémy.
6. Biznis model: hodnotová ponuka pre každú rolu, cenová os, schéma toku peňazí, príklad v číslach a cesta k nasadeniu.
7. Presný opis wow momentu.
8. Zoznam chýbajúcich podkladov, ak existujú.
9. Záverečnú vetu a konkrétny ďalší krok.

V scenári oddeľ text na plátne, hovorený komentár a pokyny rečníkovi. Pridaj prirodzené prechody a účelné pauzy.

Odhadni trvanie podľa rozsahu textu a započítaj pauzy. Za potvrdené časovanie ho označ až po skutočnej časovanej skúške.

Pred odovzdaním over:
- každý bod propozícií má konkrétnu odpoveď,
- fungovanie aplikácie je pochopiteľné od vstupu po výsledok,
- dátový model a backend zodpovedajú podkladom,
- biznis model má vlastnú snímku, ukazuje prínos pre výrobcu, odberateľa aj E.SK a jeho čísla pochádzajú z enginu alebo sú označené ako predpoklad,
- screenshoty, technické schémy a scenár si neodporujú,
- implementované a plánované schopnosti sú jasne odlíšené,
- wow moment vychádza z doložiteľnej hodnoty,
- prezentácia funguje bez živého dema,
- súčet časov rešpektuje 10-minútový limit.

Ak chýbajú podklady, označ návrh ako predbežný a presne uveď, čo ešte treba doplniť.
