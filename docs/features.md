# Funkciók és megvalósítási állapot

Jelölés: **Kész** = működő, a tananyaghoz kapcsolt funkció. A korlátokat itt és az érintett mezőknél is jelezzük. Nincs kihelyezett, funkció nélküli gomb, üres widget vagy statikus kalkulátormakett.

## Alkalmazás és tananyag

| Funkció | Állapot | Megjegyzés |
|---|---|---|
| Kezdőoldal és három témaköri útvonal | Kész | React Router, témánként egy oldal, belső szekciók |
| Magyar felület, fogalmak, tételek és indoklások | Kész | A teljes 18 oldalas forrás áttekintésére épül, nem pusztán PDF-nézegető |
| Levezetett példák, megoldások és magyarázatok | Kész | Mindhárom témában; az eredeti hibák javítva |
| Matematikai audit | Kész | Oldal, hibás állítás, javítás, indoklás, ellenőrzési módszer |
| Világos/sötét téma | Kész | localStorage mentéssel |
| Desktop oldalsáv és sticky tartalomjegyzék | Kész | Fix bal oldalsáv, görgethető szekcióhivatkozások |
| Összecsukható mobilmenü és gyors tartalomjegyzék | Kész | Telefonon és tableten is |
| Billentyűzetes űrlapvezérlők, címkék, hibák | Kész | Explicit label–id kapcsolat, fókuszjelölés, role=alert, skip link |
| KaTeX-képletek és reszponzív táblázatok | Kész | Helyi fontok; a nagy mátrix csak saját konténerében görgethető |
| Animációs közös vezérlés | Kész | Előző/következő, lejátszás/szünet, újrakezdés, sebesség |
| Saját illusztrációk | Kész | 12 SVG a projektben: főoldali ábra + 11 generálható tananyagábra |
| README, architektúra és ellenőrzési jelentés | Kész | Indítás, build, tesztek, matematikai konvenciók és korlátok |

## Logika

| Tervezett widget/funkció | Állapot | Részletek |
|---|---|---|
| Biztonságos kifejezésszerkesztő | Kész | Saját tokenizer, parser, AST, hibaüzenet; nincs eval |
| NOT/¬, AND/∧, OR/∨, XOR/⊕, IMPLIES/→, IFF/↔ | Kész | Precedencia és implikáció jobbra kötése dokumentált |
| Automatikus változófelismerés, kapcsolók, kiértékelés | Kész | Legfeljebb 8 változó |
| Kifejezés KaTeX-megjelenítése | Kész | A validált AST alapján |
| Igazságtábla-generátor és részkifejezések | Kész | Teljes 2ⁿ sor, részkifejezésenként oszlop |
| Sor kiemelése és CSV-export | Kész | Kattintással/billentyűzettel kiválasztható sor |
| Tautológia, ellentmondás, kielégíthetőség | Kész | Teljes táblából számított osztályozás |
| Két kifejezés ekvivalenciája és ellenpélda | Kész | A változók egyesített halmazán; együtt is legfeljebb 8 változó |
| De Morgan demonstráció | Kész | Mindkét azonosság, közös A/B kapcsolók, Venn-szemléltetés |
| Implikáció, megfordítás, inverz, kontrapozíció | Kész | Négy élő érték és a PDF eső/mozi példája; kedd/Belgium levezetés |
| Véges kvantorszimulátor | Kész | Saját, vesszős alaphalmaz, ∀/∃, tanúk és ellenpéldák, tagadás |
| Saját predikátum | Kész | Szűkített math.js AST: x, egész konstansok, + − * %, összehasonlítás. Nincs értékadás, függvényhívás, objektumelérés vagy tömb. Minden köztes eredmény biztonságos egész. |
| Beágyazott ∀a∃b: a+b=0 | Kész | Közös, kifejezetten véges alaphalmaz; hiányzó −a értékek jelzése |
| Indirekt bizonyítás | Kész | Nincs legnagyobb természetes szám, léptethető |
| Teljes indukció | Kész | Első n pozitív egész összege, léptethető |
| Ellenpéldával cáfolás | Kész | (a+b)²=a²+b² cáfolata a=b=2-vel |
| Skatulyaelv | Kész | n+1 tárgy, n skatulya; léptethető indirekt érvelés |
| 15 gyakorlófeladat | Kész | Feleletválasztás, számítás, validált tautológiaszerkesztés; nehézség és magyarázat |

## Gráfelmélet

| Tervezett widget/funkció | Állapot | Részletek |
|---|---|---|
| JSXGraph gráfszerkesztő | Kész | Valódi board, React cleanup, külön matematikai modell |
| Csúcs hozzáadás kattintással és űrlapvezérlővel | Kész | Legfeljebb 30 csúcs |
| Csúcs törlés és átnevezés | Kész | A törlés az incidens éleket is eltávolítja |
| Csúcs mozgatása | Kész | Drag-and-drop és iránygombok, korlátozott koordináták |
| Él hozzáadás két csúcs kiválasztásával | Kész | Vászonmód és billentyűzetes végpontválasztó |
| Él törlés, súly módosítás | Kész | Élazonosító szerinti kijelöléssel; pontos egész súlyok −10⁶ és 10⁶ között |
| Irányított/irányítatlan és súlyozott/súlyozatlan mód | Kész | Minden számítás az aktuális modellből frissül |
| Hurok és párhuzamos él engedélyezése | Kész | Külön kapcsolók, külön élazonosítók, ívelt megjelenítés |
| K₁–K₁₀ generálása | Kész | Ellenőrzött csúcspár-felsorolás |
| Gráf törlése, példagráfok | Kész | G₁/G₂/G₃, HF2/HF3/HF9/HF10, Königsberg |
| Automatikus elrendezés | Kész | Determinisztikus kör-elrendezés |
| Undo/redo | Kész | Legfeljebb 60 immutábilis állapot |
| localStorage-mentés | Kész | Frissítés után visszatöltődik; hibás mentésre biztonságos alapgráf |
| JSON-import/export | Kész | Fájlból és beillesztéssel; szigorú modellvalidáció, fájlméretkorlát |
| SVG-export | Kész | A valódi JSXGraph SVG-jének exportja |
| Tulajdonságkalkulátor | Kész | n,m,fokszámok, fokszámösszeg, páros/páratlan csúcsok, komponensek, körmentesség, fa/erdő, teljesség, Euler-feltétel |
| Irányított be- és kifokszám | Kész | A gyenge összefüggőség külön jelölve |
| Kézfogás-lemma | Kész | Élő Σdeg=2m ellenőrzés |
| Euler-séta Hierholzerrel | Kész | Irányított és irányítatlan feltételek, hurok/multigráf, indoklás ha nincs |
| Euler-animáció | Kész | Aktuális csúcs, használt élek, teljes útvonalszöveg, léptetés és lejátszás |
| Königsbergi hídkísérlet | Kész | Két szinkronizált saját rajz: várostérkép és multigráf; egyszer használható hídgombok |
| BFS/DFS | Kész | Kezdőcsúcs, aktuális/megtekintett csúcsok, queue/stack, sorrend és fa |
| Súlyozatlan legrövidebb út | Kész | Egységsúlyú BFS-relaxáció |
| Dijkstra | Kész | Nemnegatív súlyokra; negatív élre érthető hiba |
| Bellman–Ford | Kész | Negatív élek, elérhető negatív kör egyértelmű jelzése |
| Legrövidebbút-panel | Kész | Kezdő/cél, út, hossz, aktuális távolságok, elődök, megvizsgált él |
| Szomszédsági és incidenciamátrix | Kész | Címkék, élő frissítés, kiválasztás, gráfelem-kiemelés, CSV |
| Mátrixkonvenciók | Kész | Irány, súlyösszeg, multiplicitas és hurok esete explicit leírva |
| Fa automatikus generálása | Kész | Hatcsúcsú csillagfa; szerkeszthető |
| Kör hozzáadása, erdő komponensei | Kész | A szerkesztővel hozzáadott/törölt él azonnal frissíti a tulajdonságokat |
| Feszítőfa/feszítőerdő | Kész | Súlyozatlan módban Kruskal vagy Prim |
| Minimális feszítőfa: Kruskal és Prim | Kész | Kiemelt élek, lépések, összsúly; nem összefüggőn feszítőerdő |
| G₁/G₂/G₃ reprodukció | Kész | Ellenőrzött éllisták és javított adatok |
| Topologikus rendezés | Kész | Kahn, irányított kör jelzése |
| Algoritmusok oktatási panelje | Kész | Felhasználás, feltételek, elv, valódi időigény, aktuális lépés és eredmény |
| 15 gyakorlófeladat | Kész | Feleletválasztás, számítás, háromcsúcsú fa valódi élkapcsolós szerkesztése |

## Számelmélet

| Tervezett widget/funkció | Állapot | Részletek |
|---|---|---|
| Prímteszt | Kész | Pontos próbaosztás, UI 1–10⁹; algoritmus legfeljebb 10¹² |
| Prímek intervallumban és π(N) | Kész | Szita legfeljebb 100000-ig; lenyitható teljes lista |
| Oszthatóság és osztólista | Kész | Kiválasztott osztó, pozitív osztók |
| Eratoszthenész-szita | Kész | 2–400-as vizuális tábla; p²-től törlés, lépés/lejátszás/sebesség/reset |
| Prímfelbontás hatványalakkal | Kész | 1–10¹², az 1 üres szorzatként kezelve |
| Osztási lépések és függőleges táblázat | Kész | Minden sikeres osztás külön sor |
| Interaktív tényezőfa | Kész | JSXGraph, csomópontkattintás és billentyűzetes választó |
| LNKO több egészre | Kész | 2–8 szám, számonként legfeljebb 30 számjegy, BigInt |
| LNKO prímtényezős levezetése | Kész | Pozitív, legfeljebb 10¹²-es bemenetekre minimumkitevők |
| Euklideszi algoritmus animációja | Kész | Több számra egymás utáni összevonásokkal |
| Közös osztók | Kész | Pozitív, legfeljebb 10⁹-es LNKO esetén listázva |
| LKKT több egészre | Kész | BigInt; nulla és negatív bemenetek konvenciója dokumentált |
| LKKT prímtényezős levezetése | Kész | Maximumkitevők kiválasztása táblázatban |
| LNKO–LKKT közös vizualizáció | Kész | Színnel és prímfejlécekkel összekötött kitevők, eredmények, szorzatazonosság |
| Közös többszörösök szemléltetése | Kész | Két pozitív, legfeljebb 100-as bemenetnél az első tíz többszörös kiemelve |
| Oszthatósági táblázat és osztóháló | Kész | 1–10000, osztópárok, többszörösök, prímtényezők, Hasse-diagram |
| Prímeloszlás | Kész | Interaktív felső határ, π(x) lépcsős diagram |
| Prímszakadékok és ikerprímek | Kész | Kattintható oszlopok, kiírt értékek és ikerprímlista |
| Mersenne-prímek | Kész | Kis példák és külön ellenőrzött rekordforrás |
| Goldbach-felbontások | Kész | Egy kiválasztott, legfeljebb 100000-es páros összes rendezetlen prímfelbontása; nem bizonyításként feltüntetve |
| RSA kulcsképzés | Kész | Két különböző kis prím (≤97), n,φ,e,d és validálás |
| RSA titkosítás/visszafejtés | Kész | 0≤m<n, BigInt bináris moduláris hatványozás |
| Kiterjesztett Euklidész és RSA lépések | Kész | Bézout-együtthatók, osztások, hatványozási állapotok, közös vezérlés |
| Oktatási cél és biztonsági korlát | Kész | A felületen is világosan szerepel |
| Történeti és kutatási állapot ellenőrzése | Kész | Források és ellenőrzési dátum az auditban; elavult rekord nem került át |
| 15 gyakorlófeladat | Kész | Feleletválasztás, ellenőrzött számítások, 60 prímtényezőinek szerkesztése |

## Tudatos határok

Nincs backend, felhőszinkron, bejelentkezés, eredménykövető adatbázis, óriásszám-faktorizálás, kriptográfiai biztonsági garancia vagy korlátlan méretű gráf. Nem készült valódi iOS/WebKit-eszközteszt, teljes WCAG audit vagy képernyőolvasós használhatósági kutatás. Ezek nem rejtett félkész widgetek; a jelenlegi verzió határai. A további fejlesztési irányokat az architektúra és az ellenőrzési jelentés tartalmazza.
