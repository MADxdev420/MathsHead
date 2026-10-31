# Matematikai audit

Forrás: `docs/source/6. téma Diszkrét matematika.pdf`, Gábor Dénes Egyetem, 2025/26/1. A feladatban szereplő `(1)` utótagú fájl helyett ez az egy PDF található a projektben. Az alábbi oldalszámok a PDF-re és a nyomtatott lapszámra egyaránt vonatkoznak (18 oldal).

## Módszer és lefedettség

A teljes szöveget oldalanként kinyertük pdfplumberrel, a teljes dokumentumot Popplerrel képpé rendereltük, az ábrás 6–8., 12–14., 17–18. oldalakat külön vizsgáltuk. A házi feladatoknál a feladat **éllistája az elsődleges adat**, nem a hibás megoldás vagy kézzel rajzolt ábra. Az eredeti PDF változatlan. Az alkalmazás saját, determinisztikus ábrákat és az alábbi javított adatokat használja.

Az ellenőrzés nem géppel ellenőrzött formális bizonyítás. A konkrét számításokra automatizált regressziós tesztek, a logikai azonosságokra teljes véges igazságtáblák, a gráfokra élazonosító-alapú útellenőrzések készültek.

## Hibák, pontatlanságok és javítások

| Oldal | Eredeti állítás / probléma | Javított változat | Matematikai indoklás | Ellenőrzés |
|---|---|---|---|---|
| 2 | Az ekvivalencia magyarázata csak az egyidejű igazságot említi. | A ↔ B akkor igaz, ha A és B azonos igazságértékű; a (H,H) esetben is igaz. | (A→B)∧(B→A) mindkét hamis operandusra igaz. | A négy értékelés külön unit tesztben. |
| 2 | Az XOR jele a szövegkinyerésben nem különül el biztosan a VAGY jelétől. | Külön ⊕ operátor, pontosan egy igaz operandussal. | (A∨B)∧¬(A∧B). | Teljes táblás ekvivalenciateszt. |
| 3, 3(a) | A korán kelés tagadásának rövid jelöléséből kimarad a korán kelés feltétele. | ∃x (K(x)∧¬A(x)). | ¬∀x(K→A) ≡ ∃x(K∧¬A). | A predikátum igazságtáblája és kvantortagadási szabály. |
| 3, 3(d) | Az implikáció tagadása újabb feltételes, bizonytalanságot kifejező mondat. | A nagynéninek kerekei vannak ÉS nem ő a miskolci gyors. | ¬(A→B) ≡ A∧¬B. | Teljes négy soros igazságtábla. |
| 3, 5(c) | A konjunkció tagadására az első megadott mondat pozitív VAGY-ot ír; a következő mondat már helyes. | Nem megyünk moziba VAGY nem eszünk fagyit. | De Morgan: ¬(A∧B) ≡ ¬A∨¬B. | Mindkét De Morgan-azonosság teljes táblával. |
| 3, 6 | „Csak az első részt tagadjuk” félreérthető a beágyazott kvantoroknál. | ∃nap ∀óra ∃billentyű: abban az órában azt a billentyűt nem ütöm le. | ¬∀d∃h∀k P ≡ ∃d∀h∃k¬P. Az eredeti természetes nyelvi válasz egyébként helyes. | Kvantorok sorrendjének szimbolikus átalakítása. |
| 3, 8 | A zöld almára történő következtetéshez nincs kimondva, hogy a zöld kizárja a pirosat. | Ezt külön feltételezni kell; ekkor az „érett→piros” állítás kontrapozíciójából következik. | A „zöld” nem definíció szerint ¬„piros”; egy alma két színt is tartalmazhat. | Ellenmodell a hiányzó színfeltétel nélkül. |
| 4, 9(b) | „Minden pozitív egész prímek szorzata” nem kezeli az 1-et. | Minden 1-nél nagyobb egész nemüres prímszorzat; 1 az üres szorzat. | Az 1-nek nincs prímosztója. | `factorize(1)` üres listát ad. |
| 4 | A sejtés „bizonyításra váró tétel”. | Igazságában feltételezett, még nem bizonyított vagy cáfolt állítás. | Egy sejtés hamis is lehet; tételként nem kezeljük. | Terminológiai ellenőrzés. |
| 5–6 | A fokszám és az él két csúccsal való azonosítása csak egyszerű gráfokra pontos. | Az élnek saját azonosítója van; irányítatlan hurok két élvégnek számít. | Párhuzamos élek azonos végpontokkal is külön élek. | Multigráf/hurok fokszám-, mátrix- és Euler-tesztek. |
| 7 | G₂ páratlan csúcsai a és d. | G₂ páratlan csúcsai a és f. | Éllista: ab,bd,df,ef,ce,ac,af; fokszámok (3,2,2,2,2,3). | Fokszámteszt és érvényes Euler-séta. |
| 7 | G₂-ben „négy” nyílt Euler-séta van. | A felsorolt négy élsor érvényes, de nem teljes felsorolás: a-ból f-be hat van (az a–f közti három belsőleg diszjunkt út 3! sorrendje), fordított iránnyal összesen tizenkettő. | A hiányzó két séta az af éllel kezdődik. | A három út permutációi; a bejárások élazonosságának ellenőrzése. |
| 7 | Háromcsúcsú erdők: „egy, két és három élűek”. | Az izomorfiatípusok élszámai 0,1,2. | Erdőben m=n−c≤n−1=2. Három él három csúcson kört alkot. | Erdő-/körteszt; gyakorlófeladat. |
| 8 | G₃-nak 15 feszítőfája van. | G₃=K₅-nek 125 címkézett feszítőfája van; ezeknek három nem izomorf alakja van. | Cayley: 5^(5−2)=125. A „három alak” önmagában helyes. | Mind az 1024 élrészhalmaz felsorolása, a 4 élű fák megszámlálása: 125. |
| 8 | G₁ szomszédsági mátrixában a (c,e) elem 1, az (e,c) elem 0. | Mindkettő 0. | G₁ élei ac,ad,ae,bd,be,de; ce nincs köztük. Irányítatlan mátrix szimmetrikus. | Teljes szimmetriaellenőrzés; incidenciamátrixszal egyeztetés. |
| 8 | Minden incidenciamátrix-oszlopban két 1 van. | Ez a hurokmentes irányítatlan esetben igaz; huroknál 2, irányítottnál −1,+1, irányított huroknál nulloszlop. | A konvenció az élvégek számlálásából, illetve előjeles illeszkedésből adódik. | Explicit hurok- és irányított mátrixteszt. |
| 9 | A prímfelbontási algoritmus az ismételt osztásban n/pᵢ-t használ k/pᵢ helyett; a változó nem csökken megbízhatóan. | Az aktuális maradékot kell osztani; minden sikeres lépés után k←k/p. | A pozitív k szigorú csökkenése garantálja a véget; a megmaradó 1 nem tényező. | 9438,5780,238,51450,5733 visszaszorzása; bemeneti korlát. |
| 9 | Az indukció összetett n+1=ab esetében 0&lt;a,b≤n szerepel. | 1&lt;a,b&lt;n+1 választandó. | Az a=1,b=n+1 választás nem használható indukcióhoz. | Erős indukció levezetésének ellenőrzése. |
| 10 | A legnagyobb ismert prímként 2^82589933−1 szerepel. | A 2026-10-31-én ellenőrzött GIMPS-lista: 2^136279841−1 (41 024 320 számjegy). | Ez 2024-ben felfedezett nagyobb prím. A sorszáma kisebb, még nem kizárt Mersenne-prímek miatt ideiglenes. | [GIMPS hivatalos lista](https://www.mersenne.org/primes/), [bejelentés](https://www.mersenne.org/primes/?press=M136279841). |
| 10 | A modern Goldbach-sejtéshez hozzáteszi, hogy 1-et is prímnek tekintjük. | Minden 2-nél nagyobb páros egész két, mai definíció szerinti prím összege; 1 nem prím. | A modern bináris sejtés és a történeti megfogalmazás összekeveredett. | [PrimePages Goldbach-ismertető](https://t5k.org/glossary/page.php?sort=goldbachconjecture); a widget véges esetet ellenőriz. |
| 10 | Az RSA biztonságának indoklása: „nincs gyors algoritmus” a faktorizálásra. | Nem ismert általános, klasszikus polinomiális idejű faktorizáló algoritmus; ez nem lehetetlenségi tétel. Az RSA feltörése és a faktorizálás általános ekvivalenciája sem bizonyított. | Algoritmus nemismerete nem nemlétezési bizonyítás; kvantumos környezetben is eltérő a helyzet. | Az alkalmazás nem tesz biztonsági ígéretet; kizárólag kisprímes demonstráció. |
| 12, HF2(c,d,f) | Fokszámok (4,3,3,1,3,2,2), négy páratlan, nincs Euler-séta; a mátrixból df és ef hiányzik. | (4,3,3,2,4,4,2), összeg 22. Két páratlan (b,c), tehát van nyílt Euler-séta. A df,fd,ef,fe mátrixelemek 1-ek. | A 11. oldali 11 él az elsődleges. A nyomtatott megoldás 9 éllel számolt. | Pontos fokszámsor-teszt; Hierholzer és minden él egyszeri felhasználásának tesztje. |
| 13, HF3(f) | Az incidenciamátrix transzponált konvencióban, egy nem létező g csúccsal szerepel. | 6 csúcssor × 11 éloszlop. Ha transzponáltan közöljük, 11×6, g oszlop nélkül. | A feladat csúcshalmaza {a,b,c,d,e,f}. | A mátrixokat közvetlenül az éllistából generáljuk. |
| 14, HF4 | LKKT(5780,238)=1375640. | 40460. A felbontások és LNKO=34 az eredeti PDF-ben már helyesek. | 2²·5·7·17²=40460; 1375640=5780·238, ezt még 34-gyel osztani kell. | BigInt LNKO·LKKT=ab azonosság és prímhatvány-visszaszorzás. |
| 14, HF5 | LKKT(51450,5733)=294962850. | 2006550. A felbontások és LNKO=147 helyesek. | 2·3²·5²·7³·13=2006550; 294962850 a két szám szorzata, ezt 147-tel osztjuk. | Külön regressziós teszt. |
| 16, HF8(c) | A (ii) és (iii) válasz szövege azonos. | Egyetlen helyes válasz marad: van kerítés, amelyen nincs macska számára átjárható lyuk. | Duplikáció miatt az eredeti feleletválasztás nem egyértelmű. | Az adaptált feladatokban minden válaszlehetőség egyedi. |
| 17, HF9(b) | A megoldás ábrája az előző hatcsúcsú feladat rajzát ismétli, nem megbízhatóan követi az új éllistát. | Saját HF9-ábra az ab,ac,ae,bc,bd,be,ce,cd,de,df,ef élekből. | A korábbi gráfban bf,cf szerepel; HF9-ben bc,cd, f foka csak 2. | HF9 pontos éllistából, fokszámok (3,4,4,4,5,2); Euler- és feszítőfateszt. |
| 18, HF10(b) | A kézi ábrán a csúcscímkék félreérthetők, e kétszer olvasható; b nem egyértelmű. | Öt különböző a,b,c,d,e címke; ab,ac,ad,ae,bd,ce élek. | A csúcsazonosítóknak egyedieknek kell lenniük. A fokszámok, mátrix és séta az éllistához helyesek. | Saját, éllistából generált ábra és címkevalidáció. |

## Ellenőrzött, helyes részek

- 1. oldal: bevezetés; a diszkrét és folytonos modellek közti különbség motiváció.
- 2. oldal: mindkét De Morgan-azonosság, az implikáció ¬A∨B alakja, tagadása A∧¬B, kontrapozíció és a kvantortagadási formulák helyesek.
- 3–4. oldal: a kedd/Belgium, korán kelés, macska, fagylalt, gondolkodás és a legtöbb kvantoros feladat megoldása helyes az itt jelzett kivételekkel. A legnagyobb számra vonatkozó indirekt érvelést az alkalmazás konkrétan ℕ-re rögzíti.
- 5–6. oldal: a königsbergi modell (fokszámok 5,3,3,3), K₁–K₅ ábrái, G₁/G₂/G₃ fokszámai és a kézfogás-lemma helyesek. A K jel eredetének nem szükséges történeti állítását nem emeljük át.
- 7. oldal: G₁ három köre, G₂ három köre, a felsorolt négy G₂-séta és a megadott G₃ Euler-kör érvényesek; a fa/erdő definíciók, a négycsúcsú erdők hat izomorfiatípusa helyes. Az „összes fa” itt izomorfia szerinti osztályokat jelent, nem címkézett fákat.
- 8. oldal: G₁ és G₂ illeszkedési mátrixa, G₂ és G₃ szomszédsági mátrixa helyes az adott konvenció mellett.
- 9. oldal: a 120 alatti 30 prím listája, a 9438 felbontása és a kiírt, nem hiányzó táblázatmezők helyesek. A felbonthatóság indukciója nem bizonyítja az egyértelműséget, ezt a jegyzet is jelzi.
- 10. oldal: LNKO(2,7)=1, LNKO(126,70)=14, LNKO(33,51)=3, LNKO(169,121)=1; az LKKT-k rendre 14,630,561,20449. A prímek végtelensége és tetszőlegesen hosszú összetettszám-sorozat helyes (például (n+1)!+2,…,(n+1)!+(n+1)).
- 11. oldal: HF1 helyes kontrapozíciós választásai: a(i), b(ii), c(iii), d(ii).
- 12–13. oldal: a megadott HF2/HF3 feszítőfák valóban feszítőfák. HF3 fokszámsora (3,4,3,3,5,4), Euler-séta nincs.
- 15–16. oldal: a logikai házi feladatok megjelölt válaszai helyesek, a HF8(c) duplikáció külön jelezve.
- 17–18. oldal: HF9 megadott élsora csúcssorozatként a,b,c,d,e,f,d,b,e,a,c,e, HF10-é a,b,d,a,e,c,a. Minden él pontosan egyszer szerepel; a feszítőfák és a szomszédsági mátrixok érvényesek.

## Történeti és aktuális források

Ellenőrzés dátuma: **2026-10-31**, Europe/Budapest.

- [GIMPS hivatalos Mersenne-prímlista](https://www.mersenne.org/primes/): az aktuális rekord és a végtelen sok Mersenne-prím nyitott kérdése.
- [PrimePages: Goldbach](https://t5k.org/glossary/page.php?sort=goldbachconjecture): történeti és modern megfogalmazás.
- [NSA: Cocks, Ellis, Williamson](https://www.nsa.gov/History/Cryptologic-History/Historical-Figures/Historical-Figures-View/Article/3006218/clifford-cocks-james-ellis-and-malcolm-williamson/): a korai GCHQ-munka és 1997-es nyilvánosságra hozatal. A „2700 évnyi számítógépidő” hardver- és módszerfüggő történeti adatát nem használjuk teljesítményígéretként.
- [Polymath projekt: bounded gaps](https://arxiv.org/abs/1407.4897): a korlátos prímszakadékok eredménye nem a végtelen sok ikerprím bizonyítása. Rekordkorlátot az alkalmazás nem állít.

## Gépi ellenőrzés

`tests/logic.test.ts`, `tests/graph.test.ts`, `tests/numberTheory.test.ts` tartalmazza a konkrét eredményeket és az invariánsokat. Az E2E tesztek ellenőrzik, hogy a javított számítások a felhasználói felületen is megjelennek. A teljes forrás-PDF nem kerül a production bundle-be.
