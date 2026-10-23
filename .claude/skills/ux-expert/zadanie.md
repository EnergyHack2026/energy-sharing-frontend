# Hackathon 2026 – Challenge #2: Marketplace pre zdieľanie elektriny (E.SK / ZSE / VSE)

Zhrnutie oficiálneho zadania. Slúži ako referencia pre UX review.

## Otázka zadania
Ako môže vyzerať jednoduché, digitálne a pre zákazníka atraktívne online trhovisko pre zdieľanie elektriny?
Zákazník má na pár klikov ponúknuť prebytky alebo nájsť partnera – ako na online marketplace.
Riešenie má byť **intuitívne, dôveryhodné a atraktívne pre bežného zákazníka**.

## Zákazník musí vedieť (jadro)
1. ponúkať prebytky elektriny
2. vyhľadávať dostupné ponuky
3. vytvárať prepojenia výrobca ↔ odberateľ
4. zdieľať **bez potreby poznať členov skupiny vopred**
5. jednoducho a digitálne spravovať svoje zapojenie

## Oblasti „Vaša úloha“
- **Onboarding** – všetky údaje potrebné na zaradenie do skupiny; žiadosť o inštaláciu IMS na vlastné náklady, ak ho nemám.
- **Párovanie ponuky a dopytu** – zdieľam za konkrétnu cenu? Mám spotrebu v čase FVE a chcem lacnejšie? Kde sa stretnú? Nemusí byť len bilančná skupina E.SK.
- **Business logika skupín** – jedna veľká skupina E.SK alebo viac na výber? Každé OM len v **jednej** skupine; vstup/výstup **nie je okamžitý** (žiadosť o zmenu na OKTE). Aká metóda zdieľania (alokácie)?
- **Predikcia** spotreby a výroby členov – lepší matching, odhad benefitov.
- **Reporting** – atraktívny, prehľadný: koľko som vyzdieľal, prijal, akú to malo hodnotu.
- **Zúčtovanie a fakturácia** – koľko som zarobil / mám zaplatiť. Len cena komodity (dodávka), bez distribúcie, prenosu a fixných poplatkov.
- **Gamifikácia** – motivovať maximalizovať využitie, najmä **prijímateľov posúvať spotrebu do času výroby FVE**; zabaviť, budovať vzťah s dodávateľom a návyk chodiť do appky **častejšie ako 1× ročne** pri vyúčtovaní.

## Inšpiračné otázky (nie povinné)
- Čo ak nepoznám nikoho s IMS?
- Čo ak chcem za zdieľanú elektrinu odplatu?
- Nájdem výrobcu lacnejšieho ako moja dodávková cena?
- Vie niekto poradiť príjemcovi, ako zmeniť správanie? (zdieľa sa len v rámci **15-min intervalu**, neprenáša sa medzi intervalmi)
- Dostanem report / vizualizáciu, ktorej rozumiem?
- Zabavím sa? Vybudujem si lojalitu k dodávateľovi?

## Abstrahujeme od
- komunikácie s OKTE (skupiny sa zakladajú virtuálne)
- daňových, účtovných a právnych podmienok

Povinné legislatívne, regulačné a technické kroky musia **zostať zachované**, spôsob realizácie sa môže navrhnúť nanovo.
Inšpirácia: E.ON Propojeno.

## Výstup
- Viac než prezentácia alebo statické obrazovky; nie produkčná appka.
- **Funkčný end-to-end prototyp** s hlavným scenárom, ktorý ukazuje podporu výrobcov aj odberateľov.
- Odovzdať: 1) funkčný prototyp, 2) stručný popis konceptu a architektúry, 3) demo hlavných scenárov,
  4) obchodný prínos pre zákazníkov a E.SK, 5) čo treba na posun do reálneho riešenia.

## Hodnotiace kritériá (váhy budú oznámené pred súťažou)
| Kritérium | Otázka poroty |
|---|---|
| UX/UI a zákaznícka skúsenosť | Je to jednoduché, intuitívne, zrozumiteľné? Prináša hodnotu zákazníkovi? |
| Funkčnosť prototypu | Funguje to a vie tím predviesť ucelený scenár? |
| Inovatívnosť | Nový pohľad, alebo len elektronická verzia existujúceho procesu? |
| Gamifikácia | Je to hravé a pútavé? Motivuje? |
| Prínos a realizovateľnosť | Reálna hodnota a realistická cesta k implementácii? |
