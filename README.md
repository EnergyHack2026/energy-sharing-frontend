# Zdieľňa – slnko od suseda

Frontend for HACKATHON 2026, Challenge #2 (E.SK / ZSE / VSE marketplace for sharing electricity).
Static prototype: no build step, no dependencies.

## Run

Open `index.html` in a browser. To serve it locally: `python -m http.server` in this folder.

Deep links (handy for the demo and for screenshots):

```
index.html#view=home&persona=anna
index.html#view=market&persona=peter&skin=vse
index.html#view=reports&persona=anna&t=60      # t = 15-min interval 0–96 (48 = 12:00)
index.html#view=rewards&persona=anna&tab=bdg   # Odmeny → Odznaky
```

Views: `landing benefits register home market group reports rewards profile admin map ideas i_badge i_sol i_bank i_agent i_twin i_send i_ev`

## Layout

```
index.html          shell markup + script/style order (order matters, scripts share globals)
css/tokens.css      ALL colours, fonts, sizes, radii. ZSE and VSE skins.
css/app.css         shared components (btn, pill, card, hero, kicker, lead, forms, nav…)
css/landing.css     landing-page layout only (prefix lp-)
js/core.js          utils + state S
js/engine.js        model: profiles, allocation, settlement (no DOM)
js/ui.js            icon set, form helper F(), charts, QR, map pieces
js/views-app.js     Home, Market, Group, Reports, Rewards, Profile, Admin, Onboarding
js/views-public.js  Landing, Benefits, Registration
js/views-map.js     Map
js/views-ideas.js   Ideas (7 visions)
js/badges.js        Odmeny → Odznaky: badge definitions, SVG badge, stage, unlock, share card
js/chat.js          demo AI assistant
js/main.js          shell render, navigation, events (ACT), demo tour, init
assets/             ZSE / VSE logos
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

## Badges (Odmeny → Odznaky)

- **Shape = category**: circle Slnečný rytmus · roof Strecha · hexagon Komunita · heart Srdce · star Sezónne.
- **Metal = level**: bronze → silver → gold → slnko. **Face colour = data meaning** (same tokens as charts).
- Kinds: `once`, `rep` (×N counter), `tier` (100 / 1 000 / 5 000 …). Add a badge = one entry in `BADGES`.
- History is illustrative (`BDG_BASE`); today is computed live from the engine and added at midnight.
- Unlock popup appears when today's data crosses a threshold (demo: Anna crosses 1 000 kWh shared while the day plays;
  Peter after verified challenges). Badges are awarded only after IMS verification, never for higher consumption.
