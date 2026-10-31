# Végső ellenőrzési jelentés

Dátum: **2026-10-31**. Környezet: Windows, Node.js 22.13.1, npm 11.5.2, telepített Microsoft Edge (Chromium).

## Eredmények

| Ellenőrzés | Eredmény |
|---|---|
| Strict TypeScript (`npm run typecheck`, a buildben `tsc -b`) | Sikeres, 0 típushiba |
| ESLint (`npm run lint`) | Sikeres, 0 hiba, 0 figyelmeztetés |
| Vitest + React Testing Library (`npm test`) | **113/113 sikeres**, 4 tesztfájl |
| Teljes Playwright (`npm run test:e2e`) | **16/16 sikeres**, 8 forgatókönyv desktop és mobil konfiguráción |
| Tényezőfa és közös gráfrajzoló utolsó módosítása utáni célzott E2E | **4/4 sikeres**, mindkét nézetben |
| Production build (`npm run build`) | Sikeres, elkészült `dist/` |
| Teljes függőségaudit a javított lockfile-on (`npm install` beépített auditja) | **0 ismert sérülékenység** |
| Eredeti SVG-k | 12 fájl, ebből 11 determinisztikus generátorral |
| Gyakorlófeladatok | 15 logika + 15 gráf + 15 számelmélet |

A teljes 16-os E2E-futás után a prímtényezőfánál a prímlevelek tovább nem bontását és a hosszú fák olvasható elrendezését finomítottuk. Erre külön binárisfa-invariáns unit teszt, új production build és a két érintett témára mindkét képernyőméreten célzott regresszió futott. A fenti 113 unit teszt már ezt a végső állapotot ellenőrzi.

## Mit ellenőriznek a tesztek?

- **Logika:** implikáció és ekvivalencia mind a négy sora; De Morgan, XOR, kontrapozíció; precedencia, jobbra kötés, hibás szintaxis, mélység-/változókorlát; 8 változó/256 sor; ellenpélda; üres és nemüres véges halmaz kvantorai. A saját math.js-predikátumoknál AST-fehérlista, tiltott értékadás/objektumelérés/hívás, túlcsordulás és nullával vett maradék.
- **Gráfok:** a PDF összes átvett példájának kézfogás-invariánsa; javított HF2-fokszámok; irányított/irányítatlan Euler-feltételek, izolált csúcsok, hurkok, párhuzamos élek; a kapott séta élazonosítóinak és szomszédosságának ellenőrzése; BFS/DFS és tényleges DFS-fa; súlyozatlan/Dijkstra/Bellman–Ford távolságok, elődök, negatív él, elérhető és elérhetetlen negatív kör; körmentesség; mátrixkonvenciók; JSON-validáció. Prim és Kruskal eredménye egymással és egy független teljes felsorolásos minimummal is összehasonlítva. K₅ feszítőfáinak száma teljes élrészhalmaz-felsorolással 125.
- **Számelmélet:** ismert prímek és összetettek; PDF 9438/5780/238/51450/5733 felbontásai; a 2–100 táblázat minden elemének visszaszorzása; javított LNKO/LKKT-k; nulla, negatív és 2⁵³ feletti BigInt-eset; szita 120 alatt; osztók; Bézout-egyenlet; moduláris hatványozás; RSA 3·11 kulcs mellett minden 0≤m<33 üzenetre, a nem relatív prím üzenetekre is; hibás RSA-paraméterek; Goldbach véges tartományban. A tényezőfa minden belső csúcsa két gyermekének szorzata, minden levél prím, a levelek szorzata a bemenet, prím bemenetnek nincs éle.
- **React widgetek:** szintaktikai hiba, igazságtábla, feladatellenőrzés és magyarázat, valódi tautológiaszerkesztés, háromcsúcsú fa és 60 prímtényezőinek összeállítása; CSV-címkék idézőjelezése.
- **Böngésző:** routing, téma mentése, mobilmenü, teljes oldalszélesség ellenőrzése; kvantorok és saját predikátum; léptetés/reset; számbeli javítások a felületen; szita valódi törlései; tényezőfa-kijelölés; RSA hibák; gráfpéldák, tulajdonságok, mind a 9 algoritmus kiválasztása; JSON-import hibák, negatív kör, SVG-letöltés, mátrixkijelölés, undo/redo és localStorage. A vászonon való csúcs- és élkattintás, valamint desktopon a valódi egérhúzás is tesztelt.

## Vizuális ellenőrzés

A tesztek képernyőképeket készítenek a kezdőoldalról, gráf- és számelméleti oldalról, illetve a szerkesztőről. Az asztali és mobil képeket vizuálisan is ellenőriztük; a nagy táblázatok a saját konténerükben görgethetők, a teljes oldal nem lóg vízszintesen túl. A saját SVG-ábrák, a KaTeX-képletek és a JSXGraph-vászon megjelennek. Az automatikus teszt konfigurációja a csökkentett mozgást részesíti előnyben a stabil képernyőképekhez.

Az eredmények és trace-ek a figyelmen kívül hagyott `test-results/` és `playwright-report/` mappákban vannak; minden E2E-futás új eredménykészletet készít. Emiatt a célzott futtatás után csak annak képernyőképei maradnak az aktuális eredménymappában.

## Javított implementációs hibák

Az ellenőrzés során megszüntettük a JSXGraph belső késleltetett resize-callbackjének felszabadított boardra történő visszahívását, javítottuk a select mezők egyértelmű címkézését, a rögzített csúcsok desktopos kattintását, a szerkesztési módváltás után a mozgatás engedélyezését, valamint a DFS valódi bejárási fáját. A görbék és súlycímkék húzás közben is követik a végpontokat. A hosszú prímtényezőfák függőlegesen több helyet kapnak, és a prímleveleket nem bontják tovább.

## Ismert korlátok

- A mobilteszt iPhone 13 képernyőméretet és érintési paramétereket emulál **Chromiumban**; nem valódi iOS/WebKit vagy Android-eszközteszt. Firefoxot és Safarit külön nem futtattunk.
- Nem készült teljes WCAG-tanúsítás vagy képernyőolvasós használhatósági kutatás. A vezérlők billentyűzetes alternatívákat és címkéket kaptak.
- A felületen egyértelmű bemeneti korlátok vannak: 30 csúcs/150 él, egész súlyok ±10⁶-ig, legfeljebb 8 logikai változó, a számelméleti panelekhez külön értékhatárok. A gráfalgoritmusok egyszerű tömbös, oktatási implementációk; az időigényük a felületen dokumentált.
- A JSXGraph-modul kb. 1,04 MB minifikáltan (kb. 261 kB gzip), ezért a build méretfigyelmeztetést ad. A könyvtár nem használt JessieCode-parserében lévő eval miatt is van buildfigyelmeztetés. A felhasználói logikai kifejezés saját AST-parseren fut, és az alkalmazás forrása nem hív evalt.
- Az RSA szándékosan kisprímes demonstráció. A Goldbach-vizsgálat véges ellenőrzés. A prímrekord ellenőrzött dátumhoz kötött adat, később változhat.
- Nincs felhőmentés vagy tartós gyakorlási statisztika; a gráf és a téma az adott böngészőben mentődik.

## Lehetséges folytatás

Heapes Dijkstra és szomszédsági listák, Web Workerrel nagyobb bemenetek, valódi mobileszközök és több böngésző tesztelése, képernyőolvasós használhatósági vizsgálat, valamint opcionális helyi haladáskövetés. Az alkalmazás ezek nélkül is használható és a dokumentált funkciók működnek.
