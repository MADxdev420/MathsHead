import type { Topic } from "./lessons";
export interface Exercise {
  question: string;
  answer: string;
  explanation: string;
  choices?: string[];
  level: "Alap" | "Közép" | "Haladó";
  edit?: boolean;
}
const e = (
  question: string,
  answer: string,
  explanation: string,
  choices?: string[],
  level: Exercise["level"] = "Alap",
  edit = false,
): Exercise => ({ question, answer, explanation, choices, level, edit });
export const exercises: Record<Topic, Exercise[]> = {
  logic: [
    e(
      "Ha kedd van, Belgiumban vagyunk. Mi következik?",
      "Ha nem Belgiumban vagyunk, nincs kedd.",
      "A → B ekvivalens ¬B → ¬A-val (PDF 2. o.).",
      [
        "Belgiumban csak kedden vagyunk.",
        "Ha nem Belgiumban vagyunk, nincs kedd.",
        "Szerdán nem vagyunk Belgiumban.",
      ],
    ),
    e(
      "A ↔ B értéke, ha A és B is hamis?",
      "igaz",
      "Az ekvivalencia azonos igazságértékekre igaz.",
      ["igaz", "hamis"],
    ),
    e(
      "¬(A ∧ B) ekvivalens alakja?",
      "¬A ∨ ¬B",
      "De Morgan: a konjunkció tagadása a tagadások diszjunkciója.",
      ["¬A ∨ ¬B", "¬A ∧ ¬B", "A ∨ B"],
    ),
    e(
      "A → B mikor hamis?",
      "A igaz, B hamis",
      "Csak az igaz előtag és hamis utótag cáfolja az implikációt.",
      ["A hamis, B igaz", "Mindkettő hamis", "A igaz, B hamis"],
    ),
    e(
      "Hány sora van egy 4 változós igazságtáblának?",
      "16",
      "Mindegyik változónak két értéke van: 2⁴=16.",
    ),
    e(
      "„Minden egér szereti a sajtot” tagadása?",
      "Van egér, amely nem szereti a sajtot.",
      "¬∀x P(x) ≡ ∃x ¬P(x) (PDF 3. o.).",
      [
        "Egy egér sem szereti.",
        "Van egér, amely nem szereti a sajtot.",
        "Minden egér nem szereti.",
      ],
    ),
    e(
      "Ha nem tanultam, megbukok. Mi következik?",
      "Ha nem bukok meg, tanultam.",
      "Kontrapozíció: ¬T → B ekvivalens ¬B → T-vel (HF1).",
      [
        "Ha tanultam, nem bukok meg.",
        "Ha nem bukok meg, tanultam.",
        "Ha megbukok, nem tanultam.",
      ],
    ),
    e(
      "Az A ∨ ¬A formula típusa?",
      "tautológia",
      "A kizárt harmadik elve: minden értékelésre igaz.",
      ["tautológia", "ellentmondás", "egyik sem"],
    ),
    e(
      "A ∧ ¬A formula típusa?",
      "ellentmondás",
      "Egy állítás és tagadása nem lehet egyszerre igaz.",
      ["tautológia", "ellentmondás", "egyik sem"],
    ),
    e(
      "Hány igaz sora van az A XOR B táblának?",
      "2",
      "A (hamis,igaz) és (igaz,hamis) sor igaz.",
    ),
    e(
      "∀a∃b: a+b=0 tagadásában mi a kvantorsorrend?",
      "∃a∀b",
      "Mindkét kvantor megfordul, a predikátum a+b≠0 lesz.",
      ["∀a∃b", "∃a∀b", "∃a∃b"],
      "Közép",
    ),
    e(
      "Az {−1,0,1} halmazon ∀a∃b: a+b=0 igaz?",
      "igaz",
      "Mindegyik a-hoz a −a is az alaphalmazban van.",
      ["igaz", "hamis"],
      "Közép",
    ),
    e(
      "a=b=2 mellett mennyi (a+b)²−(a²+b²)?",
      "8",
      "16−8=8, ezért az általános egyenlőség hamis (PDF 4. o.).",
    ),
    e(
      "5 tárgyat 4 skatulyába téve legalább hány tárgy kerül egy skatulyába?",
      "2",
      "Ha mindenhol legfeljebb egy lenne, csak négy tárgyat helyezhetnénk el.",
    ),
    e(
      "Szerkessz tautológiát A változóval!",
      "tautology",
      "Például A OR NOT A. A megoldást a teljes igazságtábla ellenőrzi.",
      undefined,
      "Haladó",
      true,
    ),
  ],
  graph: [
    e(
      "Hány éle van a K₅ gráfnak?",
      "10",
      "5·4/2=10, minden rendezetlen csúcspárhoz egy él.",
    ),
    e(
      "Hány éle lehet legfeljebb egy háromcsúcsú erdőnek?",
      "2",
      "Erdőben m=n−c, és c≥1, tehát m≤2 (PDF 7. o. javítva).",
    ),
    e("G₁ fokszámösszege?", "12", "A hat él tizenkét élvéget ad (PDF 6. o.)."),
    e("G₁-ben van Euler-séta?", "nincs", "Négy páratlan fokszámú csúcs van.", [
      "van",
      "nincs",
    ]),
    e(
      "G₂ páratlan fokszámú csúcsai?",
      "a, f",
      "A két végpont a és f; a jegyzet 7. oldalán d szerepel tévesen.",
      ["a, d", "a, f", "b, e"],
    ),
    e(
      "Hány feszítőfája van a K₅-nek?",
      "125",
      "Cayley tétele: 5^(5−2)=125, a jegyzet 15-ös állítása hibás. ",
      undefined,
      "Közép",
    ),
    e(
      "Egy hurok mennyivel növeli az irányítatlan fokszámot?",
      "2",
      "A huroknak két élvége illeszkedik ugyanahhoz a csúcshoz.",
    ),
    e(
      "Melyik algoritmus kezeli a negatív élsúlyokat?",
      "Bellman–Ford",
      "A Bellman–Ford a kezdőcsúcsból elérhető negatív kört is jelzi.",
      ["Dijkstra", "Bellman–Ford", "Prim"],
    ),
    e(
      "Melyik ad legrövidebb utat súlyozatlan gráfban?",
      "BFS",
      "A szélességi keresés távolságrétegek szerint halad.",
      ["DFS", "Kruskal", "BFS"],
    ),
    e("Egy 7 csúcsú fa élszáma?", "6", "Minden n csúcsú fában n−1 él van."),
    e(
      "A 11. oldali HF2 gráf d csúcsának valódi fokszáma?",
      "2",
      "A bd és df él illeszkedik d-hez; a 12. oldalon az utóbbi kimaradt.",
      undefined,
      "Közép",
    ),
    e(
      "HF2-ben hány páratlan fokszámú csúcs van?",
      "2",
      "Csak b és c páratlan; (4,3,3,2,4,4,2) az ellenőrzött fokszámsor.",
      undefined,
      "Közép",
    ),
    e(
      "Egy összefüggő, csupa páros fokszámú gráfban van Euler-kör?",
      "igen",
      "Az irányítatlan Euler-tétel zárt sétára vonatkozó esete.",
      ["igen", "nem"],
    ),
    e(
      "Hány soros egy 5 csúcsú gráf szomszédsági mátrixa?",
      "5",
      "Minden sor és oszlop egy csúcsnak felel meg.",
    ),
    e(
      "Szerkessz háromcsúcsú fát az élgombokkal!",
      "tree3",
      "Három csúcsot két, különböző csúcsokat összekötő éllel kell összefüggővé tenni.",
      undefined,
      "Haladó",
      true,
    ),
  ],
  number: [
    e(
      "Prímszám-e az 1?",
      "nem",
      "Az 1-nek csak egy pozitív osztója van, prímnek kettő kell.",
      ["igen", "nem"],
    ),
    e("LNKO(5780,238)?", "34", "5780=2²·5·17² és 238=2·7·17; közös rész 2·17."),
    e(
      "LKKT(5780,238)?",
      "40460",
      "A maximumkitevők szorzata 2²·5·7·17²=40460. A 1375640 a bemenetek szorzata.",
    ),
    e(
      "Mennyi 9438 legnagyobb prímtényezője?",
      "13",
      "9438=2·3·11²·13 (PDF 9. o.).",
    ),
    e("LNKO(51450,5733)?", "147", "A közös rész 3·7²=147 (PDF 14. o.)."),
    e(
      "LKKT(51450,5733)?",
      "2006550",
      "51450·5733/147=2006550; a jegyzet eredménye a szorzat.",
      undefined,
      "Közép",
    ),
    e("LNKO(126,70)?", "14", "126=1·70+56; 70=1·56+14; 56=4·14."),
    e("LKKT(33,51)?", "561", "LNKO=3, ezért 33·51/3=561."),
    e(
      "Hány prím van 120 alatt?",
      "30",
      "A szita pontosan harminc megmaradó számot ad (PDF 9. o.).",
    ),
    e(
      "Melyik az egyetlen páros prím?",
      "2",
      "Minden nagyobb párosnak a 2 valódi osztója.",
    ),
    e(
      "Melyik NEM Mersenne-prím?",
      "2047",
      "2047=2¹¹−1=23·89, noha 11 prím.",
      ["7", "31", "2047"],
      "Közép",
    ),
    e(
      "A Goldbach-sejtés 100000-ig történő ellenőrzése bizonyítás?",
      "nem",
      "Véges számú eset nem fedi le az összes páros egész számot.",
      ["igen", "nem"],
    ),
    e(
      "p=3, q=11 mellett φ(pq)?",
      "20",
      "Különböző prímekre φ(pq)=(p−1)(q−1)=2·10.",
    ),
    e("Mi 3 inverze modulo 20?", "7", "3·7=21≡1 (mod 20).", undefined, "Közép"),
    e(
      "Állítsd össze 60 prímtényezőit a gombokkal!",
      "60",
      "60=2·2·3·5. A szorzatot és minden tényező prímségét ellenőrizzük.",
      undefined,
      "Haladó",
      true,
    ),
  ],
};
