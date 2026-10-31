# MathsHead — interaktív diszkrét matematika

Magyar nyelvű, frontend-only oktatási alkalmazás a Gábor Dénes Egyetem diszkrét matematika jegyzete alapján. Logikai kifejezéslabor, valódi JSXGraph-gráfszerkesztő, léptethető gráfalgoritmusok, számelméleti kalkulátorok és 45 magyarázatos feladat.

## Indítás

Node.js **22.13.1 vagy újabb** (a választott fejlesztői eszközök miatt; a projekt ezzel a verzióval tesztelt).

```sh
npm ci
npm run dev
```

A helyi cím alapértelmezésben `http://127.0.0.1:5173`. Másik gépről történő eléréshez: `npm run dev -- --host 0.0.0.0`.

## Ellenőrzés és build

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Az E2E konfiguráció a telepített **Microsoft Edge** böngészőt használja, asztali és iPhone 13 méretű mobil emulációval, mindkettőt Chromium motorral. Más rendszeren állítsd a `playwright.config.ts` két projektjében a `channel` értékét a helyi böngészőre, vagy hagyd el és telepítsd a Playwright Chromiumot: `npx playwright install chromium`. A mobil emuláció nem helyettesíti a valódi iOS/WebKit-eszköztesztet.

Production kimenet: **`dist/`**. Bármely statikus tárhelyen kiszolgálható; a kliensoldali útvonalakhoz SPA fallback szükséges az `index.html` fájlra. Nincs szükség szerveroldali alkalmazásra, adatbázisra vagy környezeti titkokra. Helyi production próba: `npx vite preview`.

## Tartalom és használat

- `/logika`: NOT, AND, OR, XOR, IMPLIES, IFF és Unicode-jeleik; AST parser, 8 változós igazságtábla és CSV, ekvivalencia és ellenpélda; kvantorok, azonosságok és bizonyítások.
- `/grafelmelet`: csúcs- és élműveletek, irányok/súlyok, hurkok és multigráfok, undo/redo, mentés, JSON/SVG/CSV; Euler, BFS/DFS, legrövidebb utak, MST, topologikus rendezés, Königsberg.
- `/szamelmelet`: prímteszt, intervallum, szita, prímfelbontás és tényezőfa, BigInt LNKO/LKKT, osztóháló, prímdiagramok, Goldbach, kisprímes RSA.

A gráf csúcsai egérrel mozgathatók; a hozzáadás, élműveletek, kijelölés és átnevezés űrlapvezérlőkkel is elérhetők. A kiválasztott téma és a tartalomjegyzék desktopon bal oldalt, mobilon menüben/gyorssávban található. A gráf és a világos/sötét téma localStorage-ba mentődik. A számítási méretkorlátok a mezőknél és a dokumentációban láthatók.

## Dokumentáció

- [Matematikai audit](docs/math-audit.md): minden eredeti oldal áttekintése, hibák, javítások, ellenőrzések és források.
- [Funkciójegyzék](docs/features.md): minden kért widget és állapota.
- [Architektúra](docs/architecture.md): algoritmusok, típusok, mátrixkonvenciók, életciklus és korlátok.
- [Ellenőrzési jelentés](docs/verification.md): tényleges teszteredmények és ismert korlátok.

Az illusztrációk saját SVG-k, nem a PDF-ből másolt képek. Újragenerálás: `node scripts/generate-illustrations.mjs`. Bitmap képgenerálást a projekt nem használ.

Az RSA kizárólag oktatási célú, éles titkosításra nem alkalmas. A Goldbach-vizsgálat véges számítás, nem a sejtés bizonyítása.
