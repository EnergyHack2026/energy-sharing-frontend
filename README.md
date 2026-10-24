# Zdieľňa – slnko od suseda

Frontend for HACKATHON 2026, Challenge #2 (E.SK / ZSE / VSE marketplace for sharing electricity).
Static prototype: no build step, no dependencies.

## Run

Open `index.html` in a browser **from the unzipped folder** – it needs `css/`, `js/` and `assets/` next to it
(opening it straight from inside the zip shows only a warning).

For the full app (installable PWA, works offline) serve it over http(s):

```
python -m http.server 8000      # then open http://localhost:8000
```

or publish the folder on GitHub Pages / any static hosting. From `file://` everything works except
the service worker (it is simply skipped).

`zdielna.html` is the same app in one self-contained file (CSS, JS and logos inlined) – it opens on its own,
e.g. from a zip or an e-mail. After editing the split sources, regenerate it with `python3 build.py`.

Deep links (handy for the demo and for screenshots):

```
index.html#view=home&persona=anna
index.html#view=market&persona=peter&skin=vse
index.html#view=reports&persona=anna&t=60      # t = 15-min interval 0–96 (48 = 12:00)
index.html#view=rewards&persona=anna&tab=bdg   # Odmeny → Odznaky
index.html#jury=1                              # jury mode on (jury=0 off)
```

`persona=admin` or `skin=…` in the link switches jury mode on automatically.

Views: `landing join potential benefits register home market group reports rewards profile admin map ideas i_badge i_sol i_bank i_agent i_twin i_send i_ev`

## Docker on Ubuntu

From the frontend directory, with Docker Engine and the Compose plugin installed:

```bash
docker compose up -d --build
docker compose ps
curl -I http://localhost:8000/
```

Open `http://SERVER_IP:8000/`. Allow inbound TCP 8000 in the server/provider firewall if necessary.
The container serves the static app using Nginx and restarts automatically with Docker.
After pulling changes, run `docker compose up -d --build` again.
Logs: `docker compose logs --tail 100 frontend`. Stop: `docker compose down`.

This deploys the current prototype with simulated data; it does not connect it to the backend API.
PWA installation and offline service workers require HTTPS, except on localhost.

## Final version (branch `final`)

The `final` branch is the version for the jury. It starts with the landing page only; features from `main`
are switched on one by one. Switching is done in one place, `ON` in `js/core.js`:

```js
const ON=new Set(['landing']);          // e.g. add 'register','potential','home','market'
```

Keys are views from `VIEWS` (`js/main.js`) plus `chat` (AI assistant) and `tour` (demo story).
A disabled view falls back to the landing page; buttons and menu items leading to it are hidden
(`gateActs()` in `js/main.js`). Code of disabled features stays in the repo.

Workflow: one small branch per feature from `final` (e.g. `feat/register`) → check in the browser → merge into `final`.

## Layout

```
index.html          shell markup + script/style order (order matters, scripts share globals)
build.py            builds zdielna.html (one self-contained file) from the split sources
PROMPT.md           brief for the next iteration of changes
css/tokens.css      ALL colours, fonts, sizes, radii. ZSE and VSE skins.
css/app.css         shared components (btn, pill, card, hero, kicker, lead, forms, nav…)
css/landing.css     landing-page layout only (prefix lp-)
js/core.js          utils + state S
js/engine.js        model: profiles, allocation, settlement (no DOM)
js/ui.js            icon set, form helper F(), charts, QR, map pieces
js/views-app.js     Home, Market, Group, Reports, Rewards, Profile, Admin, Onboarding
js/views-public.js  Landing („Pridať sa“ → Registration), Join (EIC entry, currently not linked), Registration (choice step in the landing design, brand-neutral), Benefits, Registration, Váš potenciál (deep link only)
js/views-map.js     Map
js/views-ideas.js   Ideas (7 visions)
js/badges.js        Odmeny → Odznaky: badge definitions, SVG badge, stage, unlock, share card, welcome popup
js/notify.js        notifications (bell in the top bar)
js/chat.js          demo AI assistant
js/main.js          shell render, navigation, events (ACT), demo tour, init
manifest.webmanifest, sw.js   PWA (only in the split version; bump CACHE in sw.js on every release)
assets/             ZSE / VSE logos, app icons
```

Split up work by view file. `tokens.css` and `app.css` are shared, so agree on changes there first.

## Design rules

The landing page is the template for every screen.

1. **No raw hex in components or views.** Use tokens from `css/tokens.css`. New colour → new token.
2. **Brand colours come from zse.sk / vse.sk.**
   ZSE `#F21C0A` (hover `#B1190C`, secondary `#0AACF2`), VSE `#143C8C` (accent `#01A0D5`).
   ZSE red on white is only 4.25:1 and VSE cyan only 3:1, so use `--brand-ink` for small text or links.
3. **Data colours have a fixed meaning everywhere** (charts, legends, bars):
   production `--c-prod` (amber) · consumption `--c-cons` (blue) · shared `--c-shared` (green) ·
   battery `--c-bat` (purple) · buyback / grid `--c-grid` (orange).
4. **Typography**: Figtree. Minimum size 12px (`--fs-xs`), body 15px.
5. **Components**: buttons `.btn` + `.pri | .dark | .light | .out | .ghost` + `.sm | .lg`;
   labels `.pill` + `.g .y .b .o .r .p .n .c`; section heading `.kicker` → `h1/h2` → `.lead`;
   dark band at the top of a screen = `.card.hero`; screen header = `.page-head`.
6. **Icons**: `icon('name')` from `js/ui.js` (line SVG). No emoji in navigation.
7. **Light theme only** (projector + less testing).
8. **Customer screens have no demo controls.** Parameters go in the ⚙ drawer; the per-interval check
   lives in Reports → Ledger.
9. Numbers on the landing page come from the engine (`lpNums()`), never hard-coded.
10. **Every screen starts with a hero band** – `hero({kicker,title,lead,acts,aside,top,foot})` in `js/ui.js`
    (dark band, big title with `<em>` accent, floating stat cards `hstat()`), section titles via `secHead()`.
    Same language as `.lp-hero` / `.lp-club` on the landing page. No "simulácia" footnotes in the app.
11. **Red dot = brand signature.** The wordmark is always „Zdieľňa" + red dot (`--sig`, same in every skin).
    Use the red dot wherever it fits: the final full stop of `h1`/`h2` headings – `hero()` and `secHead()` add it
    automatically (`sig()` in `js/ui.js`), in hand-written markup use `<span class="sig">.</span>`.
    **Never two red dots in a row:** only the last full stop of a heading is red (e.g. „Začnite jedným kódom.
    Objavte nové možnosti" + red dot), no red dot in kickers, `h3` or body text, nor on a line right before a red-dot heading.
12. **Landing page is brand-neutral** – no ZSE/VSE logo, name or colours (skin `neutral`, dark `#1E1B22` + solar amber).
    ZSE/VSE branding appears only inside the app. Exception: the registration step text may name
    „účet ZSE alebo VSE" (text only, no logo or colours).

## Regions (map)

Three areas: **Západ (ZSE)**, **Stred (SSE)** and **Východ (VSE)** – `RB_W` / `RB_E` + `regionOf()` in `js/engine.js`.
Stred is outside the service: the map shows no members there and the engine blocks sharing for an OM
whose address is in SSE (`inSse` in `runDay`). `REG` in `js/core.js` holds names and on/off state.

## Groups

`GROUPS` have a capacity (`cap`) – `gOcc(g)` returns members / capacity / free places. Groups can be chosen
directly in Trhovisko → Skupiny (`grpsel`), switching to another group goes through the exit modal with occupancy (`grpres`).

## Badges (Odmeny → Odznaky)

- **Shape = category**: circle Slnečný rytmus · roof Strecha · hexagon Komunita · heart Srdce · star Sezónne.
- **Metal = level**: bronze → silver → gold → slnko. **Face colour = data meaning** (same tokens as charts).
- Kinds: `once`, `rep` (×N counter), `tier` (100 / 1 000 / 5 000 …). Add a badge = one entry in `BADGES`.
- History is illustrative (`BDG_BASE`); today is computed live from the engine and added at midnight.
- Unlock popup appears when today's data crosses a threshold (demo: Anna crosses 1 000 kWh shared while the day plays;
  Peter after verified challenges). Badges are awarded only after IMS verification, never for higher consumption.

## Jury mode vs. customer mode

- **Customer mode** (default): no persona switch, no ZSE/VSE switch, no ⚙ drawer. The skin follows the address
  of the OM (`regionOf`) and the clock follows the real time of day (`realIdx`, refreshed every 30 s).
- **Jury mode** (`S.jury`): button „Režim poroty“ at the bottom of the sidebar (mobile: menu Viac). Shows persona and
  skin switches, ⚙ „Čísla a časy“ and a jury label. The demo tour turns it on.

## No persistence

Nothing is saved in the browser – every reload (F5) starts the demo from the beginning.
„Obnoviť demo dáta“ (⚙ drawer) resets the demo without reloading.

## Welcome popup and visit streak

Once per demo day and persona a sunny popup greets the user: +points for the visit (`5 + 5 × streak`, max 30),
what today brings, tomorrow's bonus. Visits feed the tier badge **Ranné slniečko** (3 / 7 / 30 days, Komunita).

## Day player

Home → „Prehrať môj deň“ opens a modal that replays the day 6:00–23:00 with plain-language annotations computed from
the engine (sun on the roof, first kWh from the neighbour, best window, battery in the evening). Speed 1× / 2×,
estimate vs. measurement, scrubber, Esc closes. The technical 15-min chart lives in Prehľady → Mesačný report.

## Notifications

`notify(kind, who, title, text, go)` in `js/notify.js` – kinds `pred chal state price month badge`, respects the
switches in Profil → Notifikácie. Sources: 30 min before the sun window, new / verified challenge, membership change,
price change, monthly invoice, new badge. Clicking a notification opens the related screen.

## Invoice

Prehľady → Vyúčtovanie shows a sample monthly invoice (numbers from the engine). „Stiahnuť PDF“ uses
`window.print()` with a print stylesheet that hides everything but the invoice.

## Registration – step 2 „Nájdite svoju zhodu“

After the ZSE/VSE login (`S.reg.step==='acc'`, `vRegister` in `js/views-public.js`):

1. **Výsledok overenia** – account, each OM (IMS yes/no + „Požiadať o IMS“), role, contracts that stay, service area.
2. **Čo máte urobiť** – three numbered actions, then `grpCompare()`: one card per group with the yearly saving
   (consumer) or extra earning vs. buyback (producer), monthly kWh, average price, profile match, free places.
   Estimates come from the engine (`grpEst()` = model day × group match `f`, price shifted by group `dp`);
   the best one is marked ★ and preselected (`grpBest()`). The same cards are used in the SPP onboarding (step 6).
3. **Consent + „Odoslať žiadosť do skupiny …“**.
4. **Čo sa stane po odoslaní** – `regTimeline()`: today → distributor check (≤ 5 working days) → 1st of next month
   sharing starts → daily sun window → first invoice by the 10th (producer payout by the 20th). Dates are real.

`S.reg.sent` / `S.reg.group` keep the result of the registration screen separate from the demo membership,
so Anna and Peter (already active in the demo data) can go through the flow without losing their group.

## Demo customer „Joz Ggál“ (iteration 4)

The prototype runs on the exported demo customer (`customer_id` 330, 12 energy points – `DEMO_REGISTRATION_EXPORT`
in `js/demo-customers.js`). The export stores the name in capitals; the UI shows it title-cased („Joz Ggál“) via
`demoFullName()` / `demoCustomerParts()` / `demoWho(id)` (`js/core.js`, `js/demo-customers.js`). `nm(id)` in `js/core.js`
returns this name for the active persona, so the activity log, chat answers, map KPI, ideas and the day sheets no longer say „Anna“.
The welcome popup greets by first name (`welcomeModal()` in `js/badges.js`). Peter stays as the fictional neighbour in the simulation.

**Login** (`loginModal()` in `js/views-public.js`, actions in `js/main.js`, state `S.loginMode` = `app` | `reg`):

- Top bar „Prihlásiť sa“ → e-mail + password modal, prefilled `joz.ggal@example.sk` / `Joz Ggal` (nothing is sent; empty fields give a toast).
  `ACT.loginenter` enters the app directly (Domov), membership `ACTIVE`, all 12 energy points loaded.
- „Rýchla cesta“ card on the registration choice page → `ACT.loginreg` → the same modal in registration mode →
  `ACT.loginstd` → the standard registration flow (`ACT.sso('auto')`: account load → wizard → submit → approval).
  The modal also offers „Vstúpiť rovno do aplikácie →“ for customers who already share.

**Skupina zdieľania** – every energy point inside the group detail is an accordion (`demoCompositionPlace()` in
`js/demo-groups.js`, CSS `.dg-om-acc` in `css/landing.css`). Collapsed: icon, name, EIC, tags and status pill; expanded: group,
offer prices from registration and the August result.

**Nastavenia** (`vProfile()` in `js/views-app.js`) – header with the customer name and number, list of all 12 energy points
(`demoSettingsPlace()`) with status, group and prices „Nákup od skupiny / Predaj skupine / Výkup prebytkov“ taken from the
finance export, i.e. the same numbers as in Skupina zdieľania. „Upraviť cenu“ opens inline fields in the style of the former
price card (state `S.dpx`, `S.dpxOpen`; actions `pxedit`, `pxreset` in `js/main.js`). Edits are not persisted and do not change the
August result. The old „Cenové nastavenia“ card is hidden for the demo customer.

**Top bar** – the persona switch has two buttons, the customer name and „Operátor“; the ZSE / VSE switch is no longer in the app
header (it stays on the public pages in jury mode).

`sw.js` cache bumped to `zdielna-v48`; `zdielna.html` regenerated with `python3 build.py`.
