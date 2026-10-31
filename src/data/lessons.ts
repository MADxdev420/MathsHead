export type Topic = "logic" | "graph" | "number";
export const lessons: Record<
  Topic,
  {
    title: string;
    intro: string;
    definitions: [string, string][];
    theorems: [string, string, string][];
    example: string;
  }
> = {
  logic: {
    title: "Matematikai logika",
    intro:
      "A pontos gondolkodás nyelve. Fogalmazz állításokat, fedezd fel a logikai kapcsolatok szabályait, és ellenőrizd a következtetéseidet.",
    definitions: [
      [
        "Állítás és változó",
        "Az állítás kijelentő mondat, amelynek a rögzített értelmezésben pontosan egy igazságértéke van: igaz vagy hamis. Az A, B, C változók állítások helyén állnak.",
      ],
      [
        "Negáció, konjunkció, diszjunkció",
        "¬A megfordítja az igazságértéket. A ∧ B akkor igaz, ha mindkettő igaz; A ∨ B akkor, ha legalább az egyik igaz. A ⊕ B pontosan egy igaz operandust kíván.",
      ],
      [
        "Implikáció és ekvivalencia",
        "A → B kizárólag akkor hamis, ha A igaz és B hamis. A ↔ B akkor igaz, ha A és B igazságértéke megegyezik: a két hamis állítás is ekvivalens.",
      ],
      [
        "Tautológia és ellentmondás",
        "A tautológia minden értékelésre igaz; az ellentmondás minden értékelésre hamis. Kielégíthető a formula, ha van legalább egy igazzá tevő értékelése.",
      ],
      [
        "Kvantor és alaphalmaz",
        "∀x P(x): minden alaphalmazbeli elem teljesíti P-t. ∃x P(x): legalább egy elem teljesíti. A kvantorok sorrendje számít, az alaphalmazt mindig rögzíteni kell.",
      ],
      [
        "Definíció, axióma, tétel, lemma, sejtés",
        "A definíció fogalmat vezet be. Az axiómát a rendszer kiinduló állításként fogadja el. A tétel és a lemma bizonyított állítás; a lemma általában segédtétel. A sejtés igazsága még nem eldöntött.",
      ],
      [
        "Bizonyítás és cáfolat",
        "Direkt bizonyításban a feltételekből jutunk a következményhez. Indirekt bizonyításban a tagadásból ellentmondást vezetünk le. Egy univerzális állítást egy ellenpélda is cáfol. A teljes indukcióhoz kezdőlépés és öröklődési lépés kell.",
      ],
    ],
    theorems: [
      [
        "De Morgan azonosságai",
        "\\neg(A\\land B)\\equiv\\neg A\\lor\\neg B",
        "Az összes négy értékelésben azonosak az értékek. A másik azonosság: ¬(A ∨ B) ≡ ¬A ∧ ¬B.",
      ],
      [
        "Kontrapozíció",
        "(A\\to B)\\equiv(\\neg B\\to\\neg A)",
        "Mindkét formula pontosan az A igaz, B hamis sorban hamis. A megfordítás B → A ebből nem következik.",
      ],
      [
        "Kvantorok tagadása",
        "\\neg\\forall x P(x)\\equiv\\exists x\\neg P(x)",
        "Hasonlóan ¬∃x P(x) ≡ ∀x ¬P(x). Beágyazásnál minden kvantort cserélünk: ¬∀a∃b P ≡ ∃a∀b ¬P.",
      ],
      [
        "Logikai azonosságok",
        "A\\lor\\neg A\\equiv\\top",
        "Idempotencia: A ∧ A ≡ A. Abszorpció: A ∨ (A ∧ B) ≡ A. Disztributivitás: A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C).",
      ],
    ],
    example:
      "A jegyzet példája: „Ha kedd van, Belgiumban vagyunk.” Ebből „Ha nem Belgiumban vagyunk, nincs kedd” következik. A „Ha Belgiumban vagyunk, kedd van” megfordítás nem következik: szerdán is lehetünk Belgiumban.",
  },
  graph: {
    title: "Gráfelmélet",
    intro:
      "Kapcsolatokból struktúra. Rajzolj hálózatokat, keresd meg a legrövidebb utat, és kövesd az algoritmusok gondolatmenetét.",
    definitions: [
      [
        "Csúcs, él és gráftípusok",
        "A gráf csúcsok és élek halmaza. Egyszerű gráfban nincs hurok vagy párhuzamos él. Multigráfban lehetnek párhuzamos élek. Irányított él rendezett csúcspár; súlyozott gráfban az élekhez számot rendelünk.",
      ],
      [
        "Fokszám és összefüggőség",
        "Irányítatlan gráfban egy hurok kettővel növeli a fokszámot. Irányított gráfban be- és kifokszámot különböztetünk meg. Összefüggő a gráf, ha minden csúcspár között van út. Irányított gráfnál a panel gyenge összefüggőséget jelez.",
      ],
      [
        "Séta, út és kör",
        "A séta szomszédos csúcsok és élek sorozata; csúcs és él ismétlődhet. Úton a csúcsok különbözők. Körön a kezdő és végcsúcs azonos, más csúcs nem ismétlődik. Multigráfban két párhuzamos él is alkothat kört.",
      ],
      [
        "Euler-séta és Euler-kör",
        "Az Euler-séta minden élt pontosan egyszer használ. A zárt Euler-séta Euler-kör. A csúcsokat többször is érintheti. Az izolált csúcsokat az Euler-feltételnél elhagyjuk.",
      ],
      [
        "Fa, erdő és feszítőfa",
        "A fa összefüggő, körmentes irányítatlan gráf. Az erdő körmentes gráf, komponensei fák. A feszítőfa az eredeti gráf minden csúcsát tartalmazó fa, csak eredeti élekkel. Nem összefüggő gráfban feszítőerdőt keresünk.",
      ],
      [
        "Mátrixok",
        "A szomszédsági mátrix a csúcspárok kapcsolatát írja le. Az illeszkedési mátrix sorai csúcsok, oszlopai élek. A reprezentáció súlyokra, hurkokra és irányokra vonatkozó konvencióját a panel alatt rögzítjük.",
      ],
    ],
    theorems: [
      [
        "Kézfogás-lemma",
        "\\sum_{v\\in V}\\deg(v)=2|E|",
        "Minden él két élvéget ad, a hurok is kettőt. Következmény: a páratlan fokszámú csúcsok száma páros.",
      ],
      [
        "Euler-feltétel",
        "|\\{v:\\deg(v)\\text{ páratlan}\\}|\\in\\{0,2\\}",
        "Ha az élt tartalmazó rész összefüggő, a feltétel szükséges és elégséges. Irányított esetben minden csúcs be- és kifokszáma egyenlő; nyílt sétánál egy +1 és egy −1 eltérés megengedett.",
      ],
      [
        "Erdők élszáma",
        "|E|=|V|-c",
        "c a komponensek száma. Fában c = 1, tehát n − 1 él van. Három csúcson erdőnek csak 0, 1 vagy 2 éle lehet.",
      ],
      [
        "Teljes gráf és Cayley tétele",
        "|E(K_n)|=\\frac{n(n-1)}2",
        "Az n címkézett csúcsú teljes gráfnak n^(n−2) feszítőfája van n ≥ 2 esetén. Így K₅ feszítőfáinak száma 125.",
      ],
    ],
    example:
      "G₁ élei: ac, ad, ae, bd, be, de. Fokszámok: (3,2,1,3,3), összegük 12 = 2·6. A négy páratlan fokszám miatt nincs Euler-séta. Egy feszítőfa: ac, ad, ae, bd, amely minden csúcsot összeköt és négy élt tartalmaz.",
  },
  number: {
    title: "Számelmélet",
    intro:
      "Az egészek rejtett rendje. Bonts számokat prímekre, fedezd fel az oszthatóságot, és értsd meg a titkosítás matematikáját.",
    definitions: [
      [
        "Egész számok és oszthatóság",
        "ℤ = {…,−2,−1,0,1,2,…}. Az a egész osztja b-t, ha van olyan egész c, amelyre ac = b. Pozitív osztópárokban d · (n/d) = n. A nemnulla a osztja a nullát.",
      ],
      [
        "Prím és összetett szám",
        "A prím 1-nél nagyobb egész, pontosan két pozitív osztóval. Az 1 sem nem prím, sem nem összetett. Az 1-nél nagyobb nem prím egészek összetettek.",
      ],
      [
        "Eratoszthenész szitája",
        "A 2-től N-ig terjedő listában minden megmaradt p ≤ √N prím többszöröseit p²-től töröljük. Az ennél kisebb összetett többszörösöknek már volt kisebb prímosztójuk.",
      ],
      [
        "LNKO és LKKT",
        "Az LNKO a legnagyobb pozitív közös osztó, az LKKT a legkisebb pozitív közös többszörös nemnulla bemeneteknél. Itt LNKO(0,0)=0 és LKKT(a,0)=0 megállapodást használunk. Negatív bemeneteknél abszolút értékkel számolunk.",
      ],
      [
        "Prímszakadék, ikerprím, Mersenne-prím",
        "Szomszédos prímek különbsége a prímszakadék. Az ikerprímek különbsége 2. Mersenne-prím a 2^p − 1 alakú prím; p prímsége szükséges, de nem elégséges (p=11 esetén 2047=23·89).",
      ],
      [
        "Goldbach-sejtés és nyitott kérdések",
        "A modern erős Goldbach-sejtés szerint minden 2-nél nagyobb páros egész két prím összege. Az 1 nem prím. A véges ellenőrzés nem bizonyítás. A végtelen sok ikerprím és a végtelen sok Mersenne-prím létezése szintén nyitott kérdés.",
      ],
      [
        "RSA alapelve",
        "Két különböző p,q prímből n=pq és φ(n)=(p−1)(q−1). Olyan e-t választunk, amely relatív prím φ(n)-hez; d az e moduláris inverze. A publikus kulcs (n,e), a privát kulcs d.",
      ],
    ],
    theorems: [
      [
        "A számelmélet alaptétele",
        "n=\\prod_{i=1}^k p_i^{\\alpha_i}\\quad(n>1)",
        "Minden 1-nél nagyobb egész egyértelműen prímhatványok szorzatára bontható, a tényezők sorrendjétől eltekintve. Létezés: erős indukció; az egyértelműséghez Euklidész lemmája is kell.",
      ],
      [
        "Euklideszi algoritmus",
        "\\gcd(a,b)=\\gcd(b,a\\bmod b)",
        "Az a = qb+r egyenlet miatt a,b közös osztói ugyanazok, mint b,r közös osztói. A nemnegatív maradékok szigorúan csökkennek, ezért az algoritmus véget ér.",
      ],
      [
        "LNKO és LKKT kapcsolata",
        "\\gcd(a,b)\\cdot\\operatorname{lcm}(a,b)=|ab|",
        "A közös prímek minimumkitevői az LNKO-ba, a maximumkitevői az LKKT-ba kerülnek. Minden prímre min(α,β)+max(α,β)=α+β.",
      ],
      [
        "Végtelen sok prím",
        "N=p_1p_2\\cdots p_k+1",
        "Bármely véges prímlistához N egyetlen listabeli prímmel sem osztható. N valamely prímosztója ezért új prím. N maga nem feltétlenül prím.",
      ],
      [
        "Tetszőlegesen hosszú összetett sorozat",
        "(n+1)!+2,\\ldots,(n+1)!+(n+1)",
        "Ez n egymást követő összetett szám: a k-adik felsorolt szám osztható k-val, és nagyobb k-nál (2≤k≤n+1). Így a prímszakadékok nem korlátosak.",
      ],
    ],
    example:
      "5780 = 2²·5·17², 238 = 2·7·17. A minimumkitevők: LNKO = 2·17 = 34. A maximumkitevők: LKKT = 2²·5·7·17² = 40460. Ellenőrzés: 34·40460 = 5780·238 = 1375640.",
  },
};
