# Architektúra

## Futtatási modell

Vite + React + strict TypeScript frontend SPA. Nincs backend, adatbázis, fiók, távoli számítás vagy telemetria. A React Router négy fő útvonala `/`, `/logika`, `/grafelmelet`, `/szamelmelet`; a témakörök dinamikusan töltődnek. A tárhelyen az ismeretlen útvonalakat az `index.html`-re kell visszairányítani.

## Felelősségek

- `src/algorithms/logic`: tokenizálás → precedenciát kezelő rekurzív parser → AST → kiértékelés. Sem `eval`, sem JavaScript-kódfuttatás nem szerepel benne. Legfeljebb 8 változó, 500 karakter, 60 szint. Az implikáció jobbra köt; NOT > AND > XOR > OR > IMPLIES > IFF. A táblázat legfeljebb 256 soros.
- `src/algorithms/graph`: típusos csúcsok és önálló élazonosítók, multigráfok és hurkok. Algoritmusok tiszta függvények, a megjelenítéstől függetlenek. A léptethető algoritmusok `Frame` pillanatképeket adnak. Az élek súlyát csak súlyozott módban vesszük figyelembe.
- `src/algorithms/numberTheory`: korlátozott egész prímteszt, szita, faktorizálás, osztók; BigInt euklideszi algoritmus, LNKO/LKKT, kiterjesztett algoritmus, bináris moduláris hatványozás. A 30 számjegyű LNKO/LKKT bemenet sem konvertálódik lebegőpontos számmá. A math.js a szemléltető többszörösszámításban használatos; a logikai nyelvet nem a math.js értékeli.
- `src/components/GraphBoard.tsx`: JSXGraph életciklus, pontok, görbített párhuzamos élek, hurkok és nyilak. Az eseménykezelők refből olvassák az aktuális callbackeket. Minden effektus cleanupja felszabadítja a boardot. Saját ResizeObserver disconnecttel és aktív jelzővel kezeli az átméretezést; a könyvtár belső késleltetett resize-mechanizmusa ki van kapcsolva. A csúcscímkék belső SVG szövegek, nem felhasználói HTML.
- `src/components/common.tsx`: KaTeX, elérhető mezők, hibák, export, animációs léptető. Az időzítő minden szünetnél és unmountnál felszabadul.
- `src/data`: külön tananyag- és 45 feladatos adathalmaz. A hibás eredeti megoldásokat nem használjuk igazságforrásként.
- `src/pages`: az algoritmusokat felhasználó, ténylegesen működő widgetek. A gráfszerkesztő legfeljebb 60 immutábilis állapotból álló undo/redo történetet tart.
- `scripts/generate-illustrations.mjs`: 11 determinisztikus, szerkeszthető SVG. A főoldali eredeti SVG további külön illusztráció. Nincs generált bitmap és nincs másolt PDF-ábra.

## Állapot és mentés

A fejlesztői eszközök közös minimatch-függőségét az `overrides` mező javított 11-es kiadásra rögzíti; ezzel a teljes npm-audit is tiszta, és a lint/build/tesztek erre a feloldásra futottak.

`mathshead-graph` és `mathshead-theme` localStorage-kulcsok. Importkor legfeljebb 30 csúcs, 150 él, véges és korlátozott koordináták/súlyok, egyedi azonosítók és létező végpontok szükségesek. Hibás mentés helyett G₂ töltődik. localStorage hiányában az alkalmazás memóriában tovább működik. JSON-import legfeljebb 100 kB-os fájlt fogad. A gyakorlófeladatok megoldásai nem mentődnek tartósan.

## Matematikai konvenciók

Az élsúlyok a felületen és importkor −10⁶ és 10⁶ közötti **egészek**. Ez a gráfméretkorláttal együtt pontos Number-aritmetikát biztosít a távolságokhoz és súlyösszegekhez; a tizedes súlyokat hibaüzenettel elutasítjuk. A csúcsok koordinátái lehetnek törtek, mert csak a rajzhoz tartoznak.

- Üres alaphalmazon ∀ igaz, ∃ hamis. A kvantorszimulátor mindig véges halmazt értékel.
- Irányított gráf összefüggőségi mutatója **gyenge** összefüggőséget jelent; a körmentesség irányított körre vonatkozik.
- Szomszédsági mátrix: súlyozatlanul élmultiplicitás, súlyozottan a párhuzamos élek súlyösszege. Irányítatlan hurok a diagonálison egyszer szerepel, ezért ilyen konvenciónál a sorösszeg nem azonos a fokszámmal. A nulla súlyösszeg nem élhiány.
- Incidencia: irányítatlan élvégek (hurok:2), irányított kiindulás −1, érkezés +1 (hurok:0). Súlyt nem tárol.
- Euler-feltétel az élt tartalmazó komponensekre. Éltelen gráfban triviális séta; üres csúcshalmaznál üres eredmény. Élek saját ID-je garantálja a párhuzamos élek megkülönböztetését.
- Nem összefüggő gráfban Kruskal és Prim minimális **feszítőerdőt** ad. Irányított gráfot ezek elutasítanak.
- Bellman–Ford csak a kezdőcsúcsból elérhető negatív kört jelzi; ilyen esetben nincs érvényes általános távolságminimum. Dijkstra a negatív súlyokat elutasítja.
- LNKO(0,0)=0, LKKT(a,0)=0. Negatív bemeneteknél abszolút érték. Az 1 felbontása üres szorzat.

## Korlátok és fejlesztési irányok

A saját kvantorpredikátumot a math.js parserével olvassuk, majd az AST csomópontjait szigorúan fehérlistázzuk. Csak x, korlátozott egész konstansok, alapműveletek és összehasonlítások engedélyezettek. A köztes eredmények is biztonságos egészek; értékadás, függvény, indexelés és objektumelérés nem engedett. Ez elkülönül a propozicionális logika saját parserétől.

Az oktatási implementáció egyszerű tömbös élkeresést használ; nem minden algoritmus éri el a tankönyvi, optimalizált szomszédsági listás/heapes futási időt. A tényleges implementációs és az elméleti időigény külön fel van tüntetve. A pillanatképek többletmemóriát igényelnek, ezért a gráfméret korlátozott. A JSXGraph külön, körülbelül 1 MB-os minifikált chunkot ad; ezt a témák igény szerint töltik le. A JSXGraph beépített JessieCode-parserében van eval, amelyre a build figyelmeztet; ezt az alkalmazás nem hívja meg és a felhasználó kifejezését nem adja át neki. Az alkalmazás logikai parserében nincs eval.

További fejlesztés lehet a heap alapú Dijkstra, szomszédsági listák, Web Worker a nagyobb számításokhoz, képernyőolvasóval végzett használhatósági vizsgálat és a feladatok tartós haladáskövetése. A jelenlegi funkciókhoz ezek nem szükségesek.
