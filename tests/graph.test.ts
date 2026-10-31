import { describe, it, expect } from "vitest";
import {
  examples,
  makeGraph,
  completeGraph,
  degrees,
  properties,
  matrices,
  euler,
  traversal,
  shortestPath,
  reconstructPath,
  spanningForest,
  topologicalSort,
  validateGraph,
  type Graph,
} from "../src/algorithms/graph";
function validEuler(g: Graph) {
  const r = euler(g);
  expect(r.exists).toBe(true);
  expect(r.edges).toHaveLength(g.edges.length);
  expect(new Set(r.edges).size).toBe(g.edges.length);
  for (let i = 0; i < r.edges.length; i++) {
    const edge = g.edges.find((e) => e.id === r.edges[i])!;
    const a = r.vertices[i],
      b = r.vertices[i + 1];
    expect(
      (edge.from === a && edge.to === b) ||
        (!g.directed && edge.to === a && edge.from === b),
    ).toBe(true);
  }
}
describe("Gráfalgoritmusok és javított PDF példák", () => {
  it("Prim és Kruskal eredménye független, teljes felsorolásos minimummal egyezik", () => {
    const g = completeGraph(4);
    g.weighted = true;
    g.edges.forEach((e, i) => (e.weight = [3, -2, 7, 1, 4, -1][i]));
    let best = Infinity;
    for (let mask = 0; mask < 64; mask++) {
      const es = g.edges.filter((_, i) => mask & (1 << i));
      if (es.length === 3 && properties({ ...g, edges: es }).tree)
        best = Math.min(
          best,
          es.reduce((a, e) => a + e.weight, 0),
        );
    }
    expect(spanningForest(g).weight).toBe(best);
    expect(spanningForest(g, "Prim").weight).toBe(best);
  });
  it("DFS valódi mélységi fát ad, nem előre lefoglalt testvéréleket", () => {
    const g = makeGraph("abc", ["ab", "ac", "bc"]);
    const fs = traversal(g, "a", true);
    expect(fs.map((f) => f.current)).toEqual(["a", "b", "c"]);
    expect(fs.at(-1)?.edges).toEqual(["e0", "e2"]);
  });
  it("G1 és G2 fokszámai", () => {
    expect(Object.values(degrees(examples.G1)).map((d) => d.degree)).toEqual([
      3, 2, 1, 3, 3,
    ]);
    expect(properties(examples.G2).odd).toEqual(["a", "f"]);
  });
  it("HF2 fokszámok az eredeti éllistából", () => {
    expect(Object.values(degrees(examples.HF2)).map((d) => d.degree)).toEqual([
      4, 3, 3, 2, 4, 4, 2,
    ]);
    validEuler(examples.HF2);
  });
  it.each(Object.keys(examples))("kézfogás-lemma: %s", (name) =>
    expect(properties(examples[name]).sum).toBe(
      2 * examples[name].edges.length,
    ),
  );
  it.each(["G2", "G3", "HF9", "HF10"])("érvényes Euler-séta: %s", (name) =>
    validEuler(examples[name]),
  );
  it("Königsberg és G1 nem járható be", () => {
    expect(euler(examples.G1).exists).toBe(false);
    expect(euler(examples["Königsberg"]).exists).toBe(false);
  });
  it("Euler: párhuzamos élek, hurok, izolált csúcs", () =>
    validEuler(makeGraph("abc", ["ab", "ab", "aa"])));
  it("Euler: irányított feltételek és gyenge összefüggőség", () => {
    validEuler(makeGraph("abcd", ["ab", "bc", "ca"], true));
    validEuler(makeGraph("abc", ["ab", "bc"], true));
    expect(
      euler(makeGraph("abcd", ["ab", "ba", "cd", "dc"], true)).exists,
    ).toBe(false);
    expect(euler(makeGraph("abc", ["ab", "ac"], true)).exists).toBe(false);
  });
  it("BFS/DFS minden elérhető csúcsot pontosan egyszer látogat", () => {
    for (const dfs of [false, true]) {
      const fs = traversal(examples.G2, "a", dfs);
      expect(new Set(fs.map((f) => f.current)).size).toBe(6);
      expect(fs.at(-1)?.edges).toHaveLength(5);
    }
    expect(traversal(examples.G2, "a")[1].current).toBe("b");
  });
  it("legrövidebb utak, elődök és BFS súlyelhagyás", () => {
    const g = makeGraph("abc", ["ab", "bc", "ac"]);
    g.weighted = true;
    g.edges[0].weight = 2;
    g.edges[1].weight = 3;
    g.edges[2].weight = 10;
    for (const method of ["Dijkstra", "Bellman–Ford"] as const) {
      const r = shortestPath(g, "a", method);
      expect(r.distance.c).toBe(5);
      expect(reconstructPath(r.previous, "a", "c")).toEqual(["a", "b", "c"]);
    }
    expect(shortestPath(g, "a", "BFS").distance.c).toBe(1);
  });
  it("negatív él, elérhető és nem elérhető negatív kör", () => {
    const g = makeGraph("abcd", ["ab", "bc", "cb"], true);
    g.weighted = true;
    g.edges[2].weight = -3;
    expect(() => shortestPath(g, "a", "Dijkstra")).toThrow();
    expect(shortestPath(g, "a", "Bellman–Ford").negativeCycle).toBe(true);
    expect(shortestPath(g, "d", "Bellman–Ford").negativeCycle).toBe(false);
  });
  it("erdő, hurok és multigráfkör felismerése", () => {
    expect(properties(makeGraph("abc", ["ab", "bc"])).tree).toBe(true);
    expect(properties(makeGraph("abc", ["ab"])).forest).toBe(true);
    expect(properties(makeGraph("a", ["aa"])).acyclic).toBe(false);
    expect(properties(makeGraph("ab", ["ab", "ab"])).acyclic).toBe(false);
  });
  it("G1 szomszédsági mátrixa szimmetrikus, a hibás ce él nélkül", () => {
    const a = matrices(examples.G1).adjacency;
    expect(a[2][4]).toBe(0);
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < a.length; j++) expect(a[i][j]).toBe(a[j][i]);
  });
  it("illeszkedés, hurok, irányítás és súlyösszeg konvenció", () => {
    const g = makeGraph("ab", ["ab", "ab", "aa"]);
    g.weighted = true;
    g.edges[0].weight = 2;
    g.edges[1].weight = 3;
    expect(matrices(g).adjacency).toEqual([
      [1, 5],
      [5, 0],
    ]);
    expect(matrices(g).incidence).toEqual([
      [1, 1, 2],
      [1, 1, 0],
    ]);
    g.directed = true;
    expect(matrices(g).incidence).toEqual([
      [-1, -1, 0],
      [1, 1, 0],
    ]);
  });
  it("Kruskal és Prim azonos optimális súlyt ad", () => {
    const g = completeGraph(5);
    g.weighted = true;
    g.edges.forEach((e, i) => (e.weight = (i % 4) - 1));
    const a = spanningForest(g),
      b = spanningForest(g, "Prim");
    expect(a.edges).toHaveLength(4);
    expect(b.weight).toBe(a.weight);
    expect(properties({ ...g, edges: a.edges }).tree).toBe(true);
    expect(properties({ ...g, edges: b.edges }).tree).toBe(true);
  });
  it("feszítőerdő és irányított elutasítás", () => {
    const g = makeGraph("abcd", ["ab", "cd"]);
    expect(spanningForest(g, "Prim").edges).toHaveLength(2);
    expect(() => spanningForest({ ...g, directed: true })).toThrow();
  });
  it("topologikus rendezés és körfelismerés", () => {
    expect(topologicalSort(makeGraph("abc", ["ab", "bc"], true))).toEqual({
      order: ["a", "b", "c"],
      acyclic: true,
    });
    expect(
      topologicalSort(makeGraph("abc", ["ab", "bc", "ca"], true)).acyclic,
    ).toBe(false);
  });
  it("PDF feszítőfák validálása", () => {
    for (const [name, edges] of [
      ["G1", ["ac", "ad", "ae", "bd"]],
      ["HF2", ["ab", "bd", "bf", "cf", "ce", "eg"]],
      ["HF3", ["ab", "bd", "be", "bf", "cf"]],
      ["HF9", ["ab", "bc", "bd", "be", "ef"]],
      ["HF10", ["ab", "ac", "ad", "ae"]],
    ] as [string, string[]][]) {
      const g = examples[name];
      const s = g.edges.filter(
        (e) => edges.includes(e.from + e.to) || edges.includes(e.to + e.from),
      );
      expect(properties({ ...g, edges: s }).tree).toBe(true);
    }
  });
  it("K5-nek tényleg 125 feszítőfája van, teljes felsorolással", () => {
    const g = examples.G3;
    let count = 0;
    for (let mask = 0; mask < 1 << 10; mask++) {
      const edges = g.edges.filter((_, i) => mask & (1 << i));
      if (edges.length === 4 && properties({ ...g, edges }).tree) count++;
    }
    expect(count).toBe(125);
  });
  it("JSON import validálás és üres gráf", () => {
    expect(() =>
      validateGraph({
        vertices: [],
        edges: [{}],
        directed: false,
        weighted: false,
      }),
    ).toThrow();
    expect(() =>
      validateGraph({
        ...examples.G1,
        vertices: [...examples.G1.vertices, examples.G1.vertices[0]],
      }),
    ).toThrow();
    expect(euler(makeGraph("", [])).exists).toBe(true);
  });
});
