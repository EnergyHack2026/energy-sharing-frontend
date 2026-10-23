# Prompt – ďalšie úpravy Zdieľne (iterácia 3)

Si skúsený frontend vývojár. Pracuješ na hackathonovom prototype **Zdieľňa – slnko od suseda**
(trhovisko na zdieľanie elektriny pre ZSE a VSE). Priložený je celý projekt (ZIP). Uprav ho podľa
úloh 1–12 nižšie a vráť **celý projekt znova ako ZIP v rovnakej štruktúre priečinkov**.

Úlohy sú zoradené tak, aby na seba nadväzovali (najprv kostra a ukladanie stavu, potom vizuál,
potom jednotlivé obrazovky). Každá vec je popísaná **iba na jednom mieste** – ak sa úloha odvoláva
na inú, urob ju podľa tej druhej, neopakuj ju.

---

## 0. Povinné pravidlá (platia pre všetky úlohy)

1. **Štruktúra súborov ostáva rozdelená** – nič nezlučuj do jedného súboru:

   ```
   index.html            kostra + poradie skriptov (poradie je dôležité, skripty zdieľajú globálne premenné)
   build.py              zloží samostatný zdielna.html (CSS, JS a logá vložené dovnútra)
   zdielna.html          generovaný súbor – needituj ručne, vždy ho pregeneruj cez build.py
   README.md, PROMPT.md
   manifest.webmanifest  NOVÝ – úloha 12 (PWA)
   sw.js                 NOVÝ – úloha 12 (service worker, musí byť v koreni kvôli rozsahu)
   css/tokens.css        VŠETKY farby, písmo, rozmery; skiny ZSE a VSE
   css/app.css           spoločné komponenty (btn, pill, card, hero, sec-head, ocard, gcard, mapa…)
   css/landing.css       iba úvodná stránka (prefix lp-)
   js/core.js            utility + stav S (defaults), GROUPS, REG, CONTACTS
   js/engine.js          model: profily, alokácia, zúčtovanie, oblasti (regionOf) – bez DOM
   js/ui.js              ikony, F(), hero(), hstat(), secHead(), graf chart(), socChart(), mapa (mapBase, mapHouse, flowSvg)
   js/views-app.js       Domov, Trhovisko, Moja skupina, Prehľady, Odmeny, Profil, Konzola, Onboarding
   js/views-public.js    Úvod (landing), Výhody, Registrácia (+ nová obrazovka Váš potenciál – úloha 5)
   js/views-map.js       Mapa
   js/views-ideas.js     Nápady
   js/badges.js          Odznaky (BCAT, BADGES, BDG_BASE, badgeSvg, checkBadges…)
   js/chat.js            AI asistent (demo)
   js/main.js            shell (renderShell), navigácia, ACT (akcie), demo príbeh runTour(), init
   assets/               zse.png, vse.png (+ ikony aplikácie – úloha 12)
   ```

   Nový kód patrí do súboru, kam tematicky patrí. Ďalší JS súbor pridaj iba ak je to naozaj nutné
   (napr. `js/store.js` pre úlohu 3 alebo `js/notify.js` pre úlohu 10) – potom ho zaraď do
   `index.html` na správne miesto, do `build.py` (ak treba) a do README.
2. **Žiadne priame hex farby vo views ani v app.css** – nová farba = nový token v `css/tokens.css`,
   definovaný pre **oba skiny** (`[data-skin="zse"]` aj `[data-skin="vse"]`).
3. Všetky čísla počíta **engine** (`dayRun()`, `potRun()`, `agg()`, `benefitNums()`…). Nič nevymýšľaj natvrdo.
4. Texty v UI sú **po slovensky s diakritikou**, krátke a zrozumiteľné pre bežného zákazníka.
5. Prístupnosť: klikateľné prvky sú `<button>` (alebo `role="button"` + `tabindex`), prepínače majú
   `aria-pressed`, modály sa zatvárajú cez ✕ aj Esc, rešpektuj `prefers-reduced-motion`,
   písmo min. 12 px, kontrast textu WCAG AA (≥ 4,5 : 1).
6. Žiadne externé knižnice ani build krok – iba čisté HTML/CSS/JS ako doteraz (Google Fonts ostáva).
7. Nesmie sa pokaziť: demo príbeh (`runTour()` v main.js), deep linky
   (`index.html#view=…&persona=…&skin=…&t=…&tab=…`), odznaky a ich odomykanie, AI asistent,
   ⚙ panel parametrov a prepínače ZSE/VSE a Anna/Peter/Operátor (po úlohe 2 sú dostupné v režime poroty).
8. Na konci spusti `python3 build.py`, aby sa pregeneroval `zdielna.html`, a doplň README o zmeny.

---

## 1. Poradie v menu: začiatok → koniec

**Kde:** `js/main.js` (`NAV`, `NAV_PUB`, `NAV_ADMIN`, `renderShell()`), `js/views-ideas.js`
(`moreSheet()`), `css/app.css` (`.side .lbl`).

Dnes je v bočnom menu najprv aplikácia a skupina „Pre nových zákazníkov“ (Výhody, Registrácia, Úvod) až dole.

Urob:
- Presuň túto skupinu **navrch** v poradí cesty zákazníka: **Úvod → Výhody → Registrácia**,
  potom oddeľovač a aplikácia: **Domov → Trhovisko → Moja skupina → Prehľady → Odmeny → Mapa → Nápady**.
- Nadpisy skupín napr. „Začíname“ a „Moja Zdieľňa“.
- Rovnaké poradie v mobilnom paneli „Viac“ (`moreSheet()`) a v menu Operátora.

---

## 2. Režim poroty – demo ovládanie skryté pred zákazníkom

**Kde:** `js/main.js` (`renderShell()`, `drawerHtml()`, `ACT`, init s deep linkami, `runTour()`),
`js/core.js` (stav), `css/app.css`.

Dnes horná lišta aplikácie vždy ukazuje prepínač person **Anna / Peter / Operátor**, prepínač
**ZSE / VSE** a tlačidlo **⚙ Upraviť čísla a časy**. Na úvode a verejných stránkach aj
„🎬 Demo príbeh“. Pôsobí to ako nástroj, nie ako produkt.

Urob:
- Pridaj stav `S.jury` (true/false) – **režim poroty**.
- **Zákaznícky režim (predvolený):** v lište iba logo, „Profil“ a zvonček (úloha 10). Žiadny
  prepínač person, ⚙ ani „Demo príbeh“. Lištu času (`simBar()`) nechaj iba tam, kde je súčasťou
  ukážky: prehrávač dňa (úloha 6c), Mapa a Nápady (AI správca, dvojča mesta, elektromobil).
  Persona sa určí cestou zákazníka: ukážkový EIC / „Som výrobca – Som odberateľ“ (úloha 5) alebo registrácia. Značka ZSE/VSE sa určí podľa oblasti adresy (`regionOf`) alebo
  podľa SSO pri registrácii.
- **Režim poroty:** všetko ako dnes (persony, ZSE/VSE, ⚙, demo príbeh, Konzola operátora).
- Prepnutie: nenápadné tlačidlo „🎬 Režim poroty“ dole v bočnom menu a v pätičke úvodnej stránky,
  deep link `&jury=1`, a `runTour()` ho zapne automaticky. V režime poroty je v lište viditeľný
  štítok „Režim poroty“ s tlačidlom na vypnutie.
- Stav sa ukladá (úloha 3). Obnovenie demo dát (`ACT.resetall`) ani demo príbeh režim nevypnú.

**Hotovo, keď:** zákazník vidí čistú aplikáciu bez demo ovládania; porota má jedným klikom všetky
nástroje ako doteraz.

---

## 3. Uloženie stavu dema v prehliadači

> **Zrušené (okt. 2026):** ukladanie stavu sa odstránilo na želanie zadávateľa – po F5 začína demo vždy od začiatku. Túto úlohu neimplementovať.

**Kde:** `js/core.js` (`defaults()`, `S`), `js/main.js` (`render()`, init, `ACT.resetall`,
`runTour()`), prípadne nový `js/store.js`.

Dnes sa po obnovení stránky (F5) všetko vráti na začiatok – registrácia, body, výzvy, darčeky, odznaky.

Urob:
- Ukladaj stav `S` do `localStorage` (kľúč napr. `zdielna:v3`) po každej zmene – s oneskorením
  (debounce ~300 ms), nie pri každom ťahu posuvníka.
- **Neukladaj prechodné polia:** `modal`, `drawer`, `tourOn`, `sim.playing`, `bank.playing`,
  `send.anim`, `match.loading`, `chat.typing`, otvorenie chatu.
- Pri štarte: načítaj uložený stav a **zlúč ho s `defaults()`** (aby nové polia z budúcich verzií
  mali predvolenú hodnotu). Pri inej verzii kľúča alebo poškodených dátach začni od `defaults()`.
- Deep link (`#view=…&persona=…`) má prednosť pred uloženým stavom.
- Všetky prístupy do `localStorage` obal do `try/catch` – v súkromnom okne alebo pri zakázanom
  úložisku musí aplikácia fungovať ďalej (iba bez ukladania).
- „↺ Obnoviť demo dáta“ v ⚙ vymaže uložený stav. Demo príbeh začína od `defaults()` ako dnes.
- Uložený stav využíva aj úloha 9 (uvítacia hláška raz za deň) a úloha 10 (prečítané notifikácie).

---

## 4. Vizuál: menší, menej rušivý hero + ZSE v červenej namiesto čiernej

**Kde:** `js/ui.js` (`hero()`, `hstat()`), všetky views, `css/app.css` (sekcia „hero“), `css/tokens.css`.

Dnes má každá obrazovka veľký tmavý hero pás (nadpis až 58 px, 2–3 natočené kartičky vpravo,
na Domove ilustrácia domu). Je **príliš veľký a otravný** – zaberá celú prvú obrazovku.

Urob:
- **Zmenši hero** na všetkých obrazovkách aplikácie (úvodná stránka `landing` ostáva veľká):
  - výška na desktope max. ~240–280 px, na mobile max. ~50 % výšky okna,
  - nadpis cca 28–40 px (dnes `clamp(34px,4.3vw,58px)`), menší padding (~24–32 px), lead max. 2 riadky,
  - kartičky `hstat` vpravo: **najviac 2**, menšie (hodnota ~20 px), bez natáčania alebo max. 1–2°,
  - dekoratívne kruhy (`.hero:after`) jemnejšie alebo preč,
  - ilustráciu domu na Domove odstráň – miesto zaberie widget „Práve teraz“ (úloha 6),
  - pre Profil, Prehľady, Konzolu a detail nápadu pridaj kompaktný variant `hero({…, cls:'compact'})`
    – jeden riadok nadpisu + akcie, bez kartičiek.
- **Skin ZSE:** všetky tmavé plochy sú dnes takmer čierne (`--surface-dark:#1E1B22`). Urob ich
  **tmavo červené v štýle ZSE** – rovnako, ako VSE používa tmavomodrú (`#0E2C68`). Návrh:
  `--surface-dark` ~ `#6B0F0A`–`#7A1209` (prípadne jemný gradient do `#4A0A06`); uprav aj
  `--accent-dark` a `--on-dark-mut`, aby text a zvýraznenia mali kontrast AA (dnešný akcent
  `#FF7A6B` na červenom pozadí nestačí – zvoľ napr. svetlú broskyňovú alebo žltú).
  Týka sa to **všetkých** tmavých plôch: hero, aktívna položka v bočnom menu, `.btn.dark`,
  zvolený `.seg`, hlavička chatu, modály odznakov, Slnečný klub a hero na úvode, pozadie mapy.
  Skontroluj, že farby oblastí na mape (`--map-zse`, `--map-sse`, `--map-vse`) sú na novom pozadí čitateľné.

**Hotovo, keď:** obsah obrazovky je viditeľný hneď pod hero bez scrollovania na 1400×900;
ZSE vyzerá „červeno“, VSE „modro“, nikde nie je čierny pás.

---

## 5. EIC kód na úvode → obrazovka „Váš potenciál“

**Kde:** `js/views-public.js` (`EIC_DEMO`, `vLanding()`, `lpResult()`, `benefitNums()`, `vBenefits()`),
`js/main.js` (`lpLookup()`, `ACT.eicdemo`, `PUB`, `VIEWS`).

Dnes: zadanie platného 16-miestneho EIC iba zobrazí pod hero malú kartu `lpResult()`.

Urob:
- Pridaj **ukážkový EIC kód** priemernej domácnosti (napr. `24ZZS0000000003C`) do `EIC_DEMO`.
  Pod pole EIC daj čip „Vložiť ukážkový kód“, ktorý kód vyplní do poľa.
- Po stlačení **„Zistiť môj potenciál“** s platným kódom sa používateľ **preklikne na novú verejnú
  obrazovku** `potential` („Váš potenciál“) – pridaj ju do `PUB` a `VIEWS`, s vlastným deep linkom.
  Kartu `lpResult()` na úvode odstráň (nahrádza ju táto obrazovka).
- Obsah obrazovky – **priemerné porovnanie výrobcu a odberateľa** v duchu sekcie Výhody:
  - hero (podľa úlohy 4): „Toto môže zdieľanie priniesť vám“ + zadaný EIC maskovaný (`24ZZS••••••003C`),
  - dva stĺpce vedľa seba: **Výrobca s fotovoltikou** vs. **Odberateľ bez panelov** – ročný zárobok
    navyše oproti výkupu / ročná úspora, kWh ročne, cena za kWh (z `benefitNums()`), rozpätie odhadu,
  - jednoduché porovnanie stĺpcami alebo pruhmi (tokeny `--c-prod`, `--c-shared`),
  - „Kto ste vy?“ s tlačidlami **„Som výrobca →“** (persona Anna) a **„Som odberateľ →“** (persona
    Peter) – nastavia personu a vedú na Registráciu; sekundárne „Pozrieť aplikáciu“.
- Ukážkové kódy pre Annu a Petra (`eicdemo:anna/peter`) vedú na tú istú obrazovku s príslušným
  stĺpcom zvýrazneným.
- Neplatný formát ostáva ako dnes (chybová hláška pod poľom, fokus späť do poľa).
- Poznámka „Ide o odhad, nie výsledok z reálneho EIC“ – malým písmom, raz.
- Stránka Výhody ostáva; obe stránky používajú rovnaké čísla z `benefitNums()` (žiadna duplicitná logika –
  ak treba, vytiahni spoločnú časť do pomocnej funkcie).

**Hotovo, keď:** ukážkový kód + klik na tlačidlo otvorí „Váš potenciál“ s porovnaním; čísla sa
menia s parametrami v ⚙; funguje deep link aj návrat na úvod.

---

## 6. Domov: widget „Práve teraz“ + graf dňa zrozumiteľný pre laika

**Kde:** `js/views-app.js` (`vHome()`, `simBar()`), `js/ui.js` (`chart()`), `js/main.js`
(`startTimer()`, `ACT.play`), `css/app.css`.

Dnes je na Domove veľký technický graf (8 čiar, prerušované odhady, os „kWh / 15 min“), nad ním
lišta prehrávania dňa a pod ním dve karty s číslami. Bežný zákazník nepochopí, čo sa stalo.

Urob tri jasne oddelené časti (každá ukazuje niečo iné, čísla sa neopakujú):

**6a. Widget „Práve teraz“ (v hero Domova, vpravo)** – živý stav **aktuálneho 15-min intervalu**:
- Peter: „☀ Od suseda vám teraz tečie **0,3 kWh**“ / večer „🔋 Teraz vám svieti batéria suseda“ /
  bez prebytku „🌙 Teraz beriete zo siete – ďalšie slnečné okno o 11:00“.
- Anna: „☀ Vaša strecha teraz posiela susedom **0,4 kWh**“ / „🔋 Batéria je nabitá na 70 %“.
- Malá animovaná ikona (pulzujúca bodka „naživo“), hodnota z `dayRun()` pre `S.sim.idx`.
- Obnovuje sa pri prehrávaní dňa; pri `prefers-reduced-motion` bez animácie.

**6b. Karta „Váš deň“** – súhrn **celého dňa doteraz** v 1–2 vetách z enginu (napr. „Dnes ste od suseda
dostali 1,4 kWh a ušetrili 0,51 €“) + tlačidlo **„▶ Prehrať môj deň“**. Dve dnešné karty s číslami
(„Dnes do …“, „Tento mesiac“) zjednoť do tejto karty a jednej karty „Tento mesiac“ – nič dvakrát.

**6c. Prehrávač dňa (modál / panel)** – otvorí sa tlačidlom zo 6b:
- graf sa **prehrá naživo** od 06:00 do 23:00 (~15–20 s; Pauza / Pretočiť / rýchlosť), krivky sa
  postupne dokresľujú; ovládanie prehrávania (dnes `simBar()`) patrí **iba sem**, z Domova ho odstráň,
- **anotácie v grafe** v momentoch vypočítaných z dát dňa (bublina so šípkou k bodu, objaví sa,
  keď prehrávanie dosiahne daný čas), napr.:
  „06:00 – ráno beriete elektrinu zo siete“ · „10:30 – susedove panely vyrábajú viac, než sám minie“ ·
  „11:00–13:45 – najlepší čas: elektrina od suseda je lacnejšia“ (zvýraznené okno) ·
  „18:00 – slnko zapadlo, svieti vám batéria suseda“ · na konci „Spolu 1,4 kWh od suseda · úspora 0,51 €“,
- **ľudská legenda**: „☀ Žltá – slnko na streche suseda“, „🔌 Modrá – koľko ste minuli“,
  „🤝 Zelená – elektrina od suseda“, „🔋 Fialová – večer z batérie“; odhadové (prerušované) čiary
  iba po zapnutí „Zobraziť odhad“,
- vizuál: menej mriežky, popisky osí min. 12 px, hodiny každé 3 h, jemné výplne, výrazný bod „teraz“,
- pre Annu rovnaký princíp, texty z jej pohľadu („predali ste susedom“, „zvyšok išiel výkupcovi“).

Plný technický graf ostane v **Prehľady** (pre porotu a zvedavých). Lišta času na Mape a v Nápadoch
ostáva (pozri úlohu 2).

**Hotovo, keď:** človek, ktorý graf vidí prvýkrát, do 10 sekúnd povie, čo sa počas dňa stalo,
a widget „Práve teraz“ sa nikde inde na Domove neopakuje.

---

## 7. Trhovisko: oveľa menšie karty ponúk a skupín

**Kde:** `js/views-app.js` (`vMarket()`, `groupCards()`), `css/app.css` (`.offers`, `.ocard*`, `.groups`, `.gcard`).

Dnes je karta ponuky veľká (farebný pás 84 px s ikonou, cena 34 px, pruh zhody, 3 tlačidlá) – dve
karty zaberú celú obrazovku.

Urob:
- Karta ponuky **cca polovičnej výšky (~110–140 px)**, „príjemná oku“:
  - bez farebného pásu – ikona (20–24 px) v malom farebnom krúžku vedľa názvu,
  - riadok: názov · cena (~20–22 px, „€/kWh“ menším),
  - zhoda ako malý štítok „84 % zhoda“ alebo tenký pruh (4 px),
  - stav ceny („✓ prípustná“) iba ako malá ikona s `title`, nie veľký štítok,
  - akcie: jedno hlavné tlačidlo „Mám záujem“ (sm) + textové odkazy „Detail · Porovnať“.
- Mriežka 3–4 karty v rade na desktope (`minmax(240px,1fr)`), na mobile jeden stĺpec ako zoznam.
- Najlepšie spojenie (po „✨ Nájsť najlepšie spojenie“) jemne zvýraznené, nie hrubým rámom.
- Rovnako zmenši karty skupín (`.gcard`) v záložke Skupiny a v Mojej skupine.

---

## 8. Mapa: klikateľná legenda, zvýraznenie vybranej časti

**Kde:** `js/views-map.js` (`mapLegend()`, `vMap()`), `js/ui.js` (`mapBase()`, `mapHouse()`,
`flowSvg()`), `js/main.js` (nová akcia v `ACT`), `css/app.css` (`.map-legend`).

Dnes sú štítky pod mapou (oblasť ZSE, oblasť SSE – mimo služby, oblasť VSE, tok cez deň,
z batérie, dar / darček, OM bez IMS) iba statické.

Urob:
- Zmeň ich na **tlačidlá** (`<button aria-pressed>`), akcia napr. `ACT.maphi(kľúč)`, stav `S.mapHi`.
- Po kliknutí sa **vybraná časť rozsvieti** a ostatné stlmia:
  - oblasť ZSE / SSE / VSE → vybraná oblasť jasnejšia (svetlejšia výplň, jemná žiara okraja),
    ostatné oblasti a ich domčeky stlmené (~35 % opacity),
  - tok cez deň / z batérie / dar → iba tieto toky ostanú plné (hrubšie, s časticami), ostatné stlmené,
  - OM bez IMS → zvýrazní domčeky bez IMS, ostatné stlmí.
- Druhý klik na ten istý štítok zvýraznenie zruší. Aktívny štítok vyzerá ako zapnutý (biele
  pozadie, tmavý text). Prechod ~200 ms, pri `prefers-reduced-motion` bez animácie.
- Pod mapou krátka veta, čo je zvýraznené (napr. „Oblasť VSE – 5 odberných miest, 2 výrobcovia“),
  čísla z `mapMembers()`.

**Hotovo, keď:** každý štítok sa dá zapnúť/vypnúť myšou aj klávesnicou a mapa jasne ukáže vybranú časť.

---

## 9. Odmeny: uvítacia „slniečková“ hláška, nový odznak, zjednotená obrazovka

**Kde:** `js/main.js` (`modalHtml()`, `ACT`, `renderMain()`, `ACT.midnight`), `js/badges.js`
(`BADGES`, `BDG_BASE`, `bdgCtx()`, `checkBadges()`, `BDG_ZERO`, `bdgMini()`), `js/views-app.js`
(`vRewards()`, `vRewardsAnna()`), `js/core.js` (stav), `css/app.css`.

**9a. Uvítacia hláška pri vstupe**
- Pri **prvom vstupe do aplikácie v danom dni** (persona Anna alebo Peter, akákoľvek obrazovka
  aplikácie) zobraz **modál v štýle slniečka**: žiariace slnko s lúčmi (SVG, jemná animácia),
  teplé farby, veľké číslo bodov.
- Text (zaujímavejší než „Deň 1. Zarobili ste 10 slnečných bodov. Zajtra dostanete 15 b.“), napr.:
  > **☀ Dobré ráno, Peter! Deň 1 v Zdieľni**
  > Slnko vyšlo aj pre vás – na štart máte **+10 slnečných bodov**.
  > Príďte aj zajtra: druhý deň v rade = **+15 b** a ste o krok bližšie k odznaku *Ranné slniečko*.
  > [ Poďme na to ☀ ]
  Text sa mení podľa dňa, série návštev (deň 2: +15 b, deň 3: +20 b…, strop 30 b) a persony.
- Body sa naozaj pripočítajú (`S.pts.base` Peter, `S.pts.baseA` Anna) **iba raz za deň** (`S.day`,
  uložené podľa úlohy 3); po `ACT.midnight` (Nový deň) sa pri ďalšom vstupe zobrazí ďalší deň.
- Nezobrazuj počas demo príbehu (`S.tourOn`), pre Operátora ani nad iným modálom. Ak sa v tom istom
  momente odomkne odznak, ukáž odznak **až po zatvorení** uvítacej hlášky.
- Uvítacia hláška **nevytvára** notifikáciu v zvončeku (úloha 10) – je to samostatný modál.

**9b. Nový odznak za návštevy**
- Pracovný názov „Ranné slniečko“ (alebo iný pekný): `kind:'tier'`, `tiers:[3,7,30]`, `unit:'dní'`,
  `who:'both'`, kategória `komunita` (alebo nová – potom doplň `BCAT` s vlastným tvarom).
- **Nesmie opakovať existujúci odznak** – názvom ani kombináciou ikona + farba (pozor, už existuje
  „Rytmus“ = séria dní s overenou výzvou). Musí však **vizuálne zapadnúť** (rovnaký `badgeSvg`,
  kovy bronz/striebro/zlato, farba z tokenov).
- Hodnotu (počet dní návštev v rade) pridaj do `bdgCtx()` aj `BDG_ZERO`, históriu do `BDG_BASE`
  tak, aby sa v deme prvý stupeň dal odomknúť do 1–2 dní (napr. `val:2`).

**9c. Zjednotená obrazovka Odmeny (bez opakovania)**
- Dnes hero ukazuje Body / Séria / Dnes získané a hneď pod ním karta „Slnečný rytmus“ ukazuje to isté
  (séria, body, úroveň, pruh). Nechaj tieto čísla **iba na jednom mieste**: hero (podľa úlohy 4,
  max. 2 kartičky: Body s úrovňou a pruhom do ďalšej úrovne, Séria návštev) – kartu „Slnečný rytmus“
  zruš a z jej obsahu nechaj iba mini náhľad odznakov (`bdgMini()`) vedľa denných výziev.
- Body z uvítacej hlášky sa prejavia v tom istom počítadle (žiadne druhé počítadlo).

---

## 10. Notifikácie – zvonček v hornej lište

**Kde:** `js/main.js` (`renderShell()`, `ACT`, `startTimer()`, `ACT.midnight`), `js/views-app.js`
(`vProfile()` – nastavenia `S.notif` už existujú), prípadne nový `js/notify.js`, `css/app.css`.

Dnes sú notifikácie iba ako prepínače v Profile, nikde sa nezobrazujú; udalosti prebliknú iba ako toast.

Urob:
- V hornej lište ikona **zvončeka** s počtom neprečítaných; klik otvorí panel (dropdown na desktope,
  spodný panel na mobile) so zoznamom, najnovšie hore, „Označiť všetko ako prečítané“.
- Notifikácie vznikajú z udalostí v deme (texty z enginu), rešpektujú prepínače v Profile (`S.notif`):
  - **Predikcia / slnečné okno** – 30 min pred začiatkom najlepšieho okna (`bestWin`) počas prehrávania dňa,
  - **Nová denná výzva** – po polnoci (`ACT.midnight`) a keď sa odomkne nová výzva (`checkFU`),
  - **Zmena stavu žiadosti/členstva** – odoslanie, aktivácia, výstup, rezervácia skupiny,
  - **Zmena ceny** – keď Anna zmení cenu alebo zapne individuálnu cenu (pre Petra),
  - **Mesačné vyúčtovanie** – odkaz na faktúru (úloha 11),
  - **Nový odznak** – krátky záznam (veľký modál odznaku ostáva).
- Klik na notifikáciu otvorí príslušnú obrazovku. Prečítané/neprečítané sa ukladá (úloha 3).
- Toasty zostávajú pre okamžitú spätnú väzbu, ale tá istá udalosť nemá byť zároveň toast aj
  notifikácia, ak je používateľ práve na danej obrazovke.

---

## 11. Ukážka mesačnej faktúry / vyúčtovania (PDF cez tlač)

**Kde:** `js/views-app.js` (`vReports()` – nová záložka, `settleCard()` v `js/ui.js`), `css/app.css`
(štýly pre tlač `@media print`).

Urob:
- V **Prehľady** pridaj záložku **„Vyúčtovanie“** (vedľa Mesačný report / Predikcia / Ledger).
- **Peter (odberateľ):** ukážka faktúry za mesiac – hlavička ZSE/VSE (logo podľa skinu), číslo
  odberného miesta, obdobie, riadky: elektrina zo zdieľania (kWh × cena), porovnanie s cenou zo
  siete, **úspora**, poznámka, že distribučné a regulované poplatky sa účtujú ako doteraz.
  Všetky čísla z `agg(dayRun())` × `S.sim.days` – rovnaké ako v Mesačnom reporte.
- **Anna (výrobca):** výpis vyúčtovania – tržba deň + batéria, provízia, výplata, zvyšok výkupcovi.
- Tlačidlo **„Stiahnuť PDF“** = `window.print()` s tlačovým štýlom (`@media print`: iba faktúra,
  A4, bez menu, lišty a tlačidiel) – prehliadač ponúkne „Uložiť ako PDF“. Žiadna knižnica.
- Viditeľné označenie „Ukážka – nejde o daňový doklad“.
- Odkaz na túto záložku z karty „Ako prebieha mesačné vyúčtovanie“ a z notifikácie (úloha 10).

---

## 12. Aplikácia v mobile (PWA) – inštalácia a beh bez internetu

**Kde:** nové `manifest.webmanifest` a `sw.js` v koreni, ikony v `assets/`, `index.html`
(`<link rel="manifest">`, `theme-color`), `js/main.js` (registrácia service workera), README.

Urob:
- `manifest.webmanifest`: názov „Zdieľňa“, `short_name`, `start_url` `./index.html`,
  `display: standalone`, farby podľa tokenov (pri ZSE červená, pri VSE modrá – `theme-color`
  meta sa prepína so skinom), ikony 192 × 192 a 512 × 512 (vytvor z loga ZSE, aj maskable variant).
- `sw.js`: pri inštalácii uloží do cache všetky súbory projektu (index.html, css/, js/, assets/,
  manifest); stratégia „cache first, potom sieť“, s verziou cache (pri novej verzii zmaž starú).
  Google Fonts: ak nie sú dostupné offline, aplikácia použije systémové písmo (už je vo `--font`).
- Registrácia iba ak `location.protocol` je `http:` alebo `https:` – pri otvorení cez `file://`
  sa nič nesmie pokaziť (service worker tam nefunguje). Rovnako `zdielna.html` ostáva bez PWA.
- V README návod: spustenie `python -m http.server` alebo nasadenie na GitHub Pages, potom
  v mobile „Pridať na plochu“; test offline: zapnúť režim lietadlo a otvoriť z plochy.

---

## 13. Kontrola pred odovzdaním

- Otvor `index.html` z rozbaleného priečinka cez `file://` aj cez `python -m http.server` (PWA,
  offline), a samostatný `zdielna.html` – všetko musí fungovať.
- Zákaznícky režim aj režim poroty: prekliknúť všetky obrazovky pre Annu, Petra aj Operátora,
  v skine ZSE aj VSE, na šírke 1400 px aj 390 px – žiadne chyby v konzole, žiadna prázdna obrazovka.
- F5 po registrácii, odoslaní darčeka a získaní bodov – stav ostane; „Obnoviť demo dáta“ ho vymaže.
- Uvítacia hláška sa ukáže raz za deň; po „Nový deň“ znova s vyššími bodmi; nový odznak sa odomkne.
- Prejsť demo príbeh (🎬) až do konca.
- Kontrast nových farieb ZSE (text na tmavo červenej ≥ 4,5 : 1).
- Na Domove a v Odmenách sa žiadne číslo nezobrazuje dvakrát.
- Vrátiť **ZIP s rovnakou štruktúrou** (index.html, build.py, zdielna.html, manifest.webmanifest,
  sw.js, README.md, PROMPT.md, css/, js/, assets/) a krátky zoznam zmien po úlohách 1–12.
