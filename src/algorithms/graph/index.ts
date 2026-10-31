export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}
export interface Edge {
  id: string;
  from: string;
  to: string;
  weight: number;
}
export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
}
export interface Frame {
  current: string;
  visited: string[];
  frontier: string[];
  edges: string[];
  message: string;
  distances?: Record<string, number>;
  previous?: Record<string, string>;
}
export function makeGraph(
  labels: string,
  pairs: string[],
  directed = false,
): Graph {
  return {
    vertices: [...labels].map((id, i) => ({
      id,
      label: id,
      x: 4 * Math.cos((i * 2 * Math.PI) / labels.length),
      y: 4 * Math.sin((i * 2 * Math.PI) / labels.length),
    })),
    edges: pairs.map((p, i) => ({
      id: "e" + i,
      from: p[0],
      to: p[1],
      weight: 1,
    })),
    directed,
    weighted: false,
  };
}
export function completeGraph(n: number) {
  if (!Number.isInteger(n) || n < 1 || n > 10)
    throw Error("K₁–K₁₀ választható.");
  const labels = "abcdefghij".slice(0, n);
  return makeGraph(
    labels,
    [...labels].flatMap((a, i) => [...labels].slice(i + 1).map((b) => a + b)),
  );
}
export const examples: Record<string, Graph> = {
  G1: makeGraph("abcde", ["ac", "ad", "ae", "bd", "be", "de"]),
  G2: makeGraph("abcdef", ["ab", "bd", "df", "ef", "ce", "ac", "af"]),
  G3: completeGraph(5),
  HF2: makeGraph("abcdefg", [
    "ab",
    "ac",
    "ae",
    "ag",
    "bd",
    "bf",
    "ce",
    "cf",
    "df",
    "ef",
    "eg",
  ]),
  HF3: makeGraph("abcdef", [
    "ab",
    "ac",
    "ae",
    "bd",
    "be",
    "bf",
    "ce",
    "cf",
    "de",
    "df",
    "ef",
  ]),
  HF9: makeGraph("abcdef", [
    "ab",
    "ac",
    "ae",
    "bc",
    "bd",
    "be",
    "ce",
    "cd",
    "de",
    "df",
    "ef",
  ]),
  HF10: makeGraph("abcde", ["ab", "ac", "ad", "ae", "bd", "ce"]),
  Königsberg: makeGraph("abcd", ["ab", "ab", "ac", "ac", "ad", "bd", "cd"]),
};
export function validateGraph(input: unknown): Graph {
  if (!input || typeof input !== "object") throw Error("Hibás gráf JSON.");
  const g = input as Graph;
  if (
    !Array.isArray(g.vertices) ||
    !Array.isArray(g.edges) ||
    g.vertices.length > 30 ||
    g.edges.length > 150 ||
    typeof g.directed !== "boolean" ||
    typeof g.weighted !== "boolean"
  )
    throw Error("Legfeljebb 30 csúcs és 150 él importálható.");
  const ids = new Set<string>(),
    eids = new Set<string>();
  for (const v of g.vertices) {
    if (
      !v ||
      typeof v.id !== "string" ||
      !v.id ||
      ids.has(v.id) ||
      typeof v.label !== "string" ||
      v.label.length > 20 ||
      !Number.isFinite(v.x) ||
      !Number.isFinite(v.y) ||
      Math.abs(v.x) > 10 ||
      Math.abs(v.y) > 10
    )
      throw Error("Érvénytelen csúcs.");
    ids.add(v.id);
  }
  for (const e of g.edges) {
    if (
      !e ||
      typeof e.id !== "string" ||
      eids.has(e.id) ||
      !ids.has(e.from) ||
      !ids.has(e.to) ||
      !Number.isSafeInteger(e.weight) ||
      Math.abs(e.weight) > 1000000
    )
      throw Error("Érvénytelen él.");
    eids.add(e.id);
  }
  return g;
}
export function degrees(g: Graph) {
  return Object.fromEntries(
    g.vertices.map((v) => {
      const incoming = g.edges.filter((e) => e.to === v.id).length,
        outgoing = g.edges.filter((e) => e.from === v.id).length;
      return [v.id, { degree: incoming + outgoing, incoming, outgoing }];
    }),
  );
}
export function neighbors(g: Graph, id: string, weak = false) {
  return g.edges.flatMap((e) =>
    e.from === id
      ? [{ id: e.to, edge: e }]
      : (!g.directed || weak) && e.to === id
        ? [{ id: e.from, edge: e }]
        : [],
  );
}
export function components(g: Graph) {
  const seen = new Set<string>(),
    groups: string[][] = [];
  for (const v of g.vertices)
    if (!seen.has(v.id)) {
      const group: string[] = [],
        todo = [v.id];
      seen.add(v.id);
      while (todo.length) {
        const u = todo.pop()!;
        group.push(u);
        for (const w of neighbors(g, u, true))
          if (!seen.has(w.id)) {
            seen.add(w.id);
            todo.push(w.id);
          }
      }
      groups.push(group);
    }
  return groups;
}
export function matrices(g: Graph) {
  const ids = g.vertices.map((v) => v.id);
  const adjacency = ids.map((a) =>
    ids.map((b) =>
      g.edges.reduce(
        (s, e) =>
          s +
          ((e.from === a && e.to === b) ||
          (!g.directed && e.from === b && e.to === a)
            ? g.weighted
              ? e.weight
              : 1
            : 0),
        0,
      ),
    ),
  );
  const incidence = ids.map((a) =>
    g.edges.map((e) =>
      g.directed
        ? (e.to === a ? 1 : 0) - (e.from === a ? 1 : 0)
        : (e.to === a ? 1 : 0) + (e.from === a ? 1 : 0),
    ),
  );
  return { adjacency, incidence };
}
export function traversal(g: Graph, start: string, dfs = false) {
  if (!g.vertices.some((v) => v.id === start)) return [];
  if (dfs) {
    const seen = new Set<string>(),
      visited: string[] = [],
      tree: string[] = [],
      frames: Frame[] = [];
    const stack: { id: string; edge?: string }[] = [{ id: start }];
    while (stack.length) {
      const item = stack.pop()!;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      visited.push(item.id);
      if (item.edge) tree.push(item.edge);
      for (const n of neighbors(g, item.id).reverse())
        if (!seen.has(n.id)) stack.push({ id: n.id, edge: n.edge.id });
      frames.push({
        current: item.id,
        visited: [...visited],
        frontier: stack.filter((s) => !seen.has(s.id)).map((s) => s.id),
        edges: [...tree],
        message: `${item.id} feldolgozása mélységi kereséssel. A verem teteje jobbra található.`,
      });
    }
    return frames;
  }
  const frontier = [start],
    seen = new Set([start]),
    visited: string[] = [],
    tree: string[] = [],
    frames: Frame[] = [];
  while (frontier.length) {
    const current = frontier.shift()!;
    visited.push(current);
    for (const n of neighbors(g, current)) {
      if (!seen.has(n.id)) {
        seen.add(n.id);
        frontier.push(n.id);
        tree.push(n.edge.id);
      }
    }
    frames.push({
      current,
      visited: [...visited],
      frontier: [...frontier],
      edges: [...tree],
      message: `${current} feldolgozása; ${dfs ? "verem" : "sor"}: ${frontier.join(", ") || "üres"}.`,
    });
  }
  return frames;
}
export function euler(g: Graph) {
  const d = degrees(g),
    active = g.vertices.filter((v) => d[v.id].degree > 0);
  if (!active.length)
    return {
      vertices: g.vertices.length ? [g.vertices[0].id] : [],
      edges: [],
      reason: "Az üres élhalmaz triviális Euler-sétát ad.",
      exists: true,
      circuit: true,
    };
  if (components(g).filter((c) => c.some((v) => d[v].degree > 0)).length > 1)
    return {
      vertices: [],
      edges: [],
      reason: "Az élt tartalmazó komponensek nem összefüggők.",
      exists: false,
      circuit: false,
    };
  const odd = active.filter((v) => d[v.id].degree % 2);
  let start = active[0].id,
    circuit = true;
  if (g.directed) {
    const plus = active.filter(
        (v) => d[v.id].outgoing - d[v.id].incoming === 1,
      ),
      minus = active.filter((v) => d[v.id].incoming - d[v.id].outgoing === 1);
    if (
      active.some((v) => Math.abs(d[v.id].outgoing - d[v.id].incoming) > 1) ||
      !(
        (plus.length === 0 && minus.length === 0) ||
        (plus.length === 1 && minus.length === 1)
      )
    )
      return {
        vertices: [],
        edges: [],
        reason:
          "A be- és kifokszámok eltérése nem felel meg az Euler-feltételnek.",
        exists: false,
        circuit: false,
      };
    if (plus.length) {
      start = plus[0].id;
      circuit = false;
    }
  } else {
    if (odd.length !== 0 && odd.length !== 2)
      return {
        vertices: [],
        edges: [],
        reason: `${odd.length} páratlan fokszámú csúcs van; 0 vagy 2 szükséges.`,
        exists: false,
        circuit: false,
      };
    if (odd.length) {
      start = odd[0].id;
      circuit = false;
    }
  }
  const used = new Set<string>(),
    stack: { v: string; e?: string }[] = [{ v: start }],
    vs: string[] = [],
    es: string[] = [];
  while (stack.length) {
    const u = stack.at(-1)!;
    const next = neighbors(g, u.v).find((n) => !used.has(n.edge.id));
    if (next) {
      used.add(next.edge.id);
      stack.push({ v: next.id, e: next.edge.id });
    } else {
      const t = stack.pop()!;
      vs.push(t.v);
      if (t.e) es.push(t.e);
    }
  }
  return {
    vertices: vs.reverse(),
    edges: es.reverse(),
    reason: circuit
      ? "Minden aktív csúcs kiegyensúlyozott: Euler-kör."
      : "Két végponttal rendelkező Euler-séta.",
    exists: used.size === g.edges.length,
    circuit,
  };
}
export function shortestPath(
  g: Graph,
  start: string,
  method: "BFS" | "Dijkstra" | "Bellman–Ford",
) {
  if (!g.vertices.some((v) => v.id === start))
    throw Error("Válassz kezdőcsúcsot.");
  if (method === "Dijkstra" && g.edges.some((e) => e.weight < 0) && g.weighted)
    throw Error("A Dijkstra-algoritmushoz nemnegatív súlyok szükségesek.");
  const distance: Record<string, number> = Object.fromEntries(
      g.vertices.map((v) => [v.id, Infinity]),
    ),
    previous: Record<string, string> = {},
    frames: Frame[] = [];
  distance[start] = 0;
  const arcs = g.edges.flatMap((e) =>
    g.directed ? [e] : [e, { ...e, from: e.to, to: e.from }],
  );
  function relax(e: Edge) {
    const w = method === "BFS" || !g.weighted ? 1 : e.weight;
    if (distance[e.from] + w < distance[e.to]) {
      distance[e.to] = distance[e.from] + w;
      previous[e.to] = e.from;
      return true;
    }
    return false;
  }
  function frame(e: Edge) {
    frames.push({
      current: e.to,
      visited: Object.keys(previous),
      frontier: [],
      edges: [e.id],
      message: `${e.from} → ${e.to} él vizsgálata.`,
      distances: { ...distance },
      previous: { ...previous },
    });
  }
  if (method === "Bellman–Ford") {
    for (let i = 1; i < g.vertices.length; i++) {
      let changed = false;
      for (const e of arcs) {
        changed = relax(e) || changed;
        frame(e);
      }
      if (!changed) break;
    }
  } else {
    const todo = [start],
      seen = new Set<string>();
    while (todo.length) {
      if (method === "Dijkstra") todo.sort((a, b) => distance[a] - distance[b]);
      const u = todo.shift()!;
      if (seen.has(u)) continue;
      seen.add(u);
      for (const e of arcs.filter((e) => e.from === u)) {
        if (relax(e)) todo.push(e.to);
        frame(e);
      }
    }
  }
  const negativeCycle =
    method === "Bellman–Ford" &&
    arcs.some(
      (e) => distance[e.from] + (g.weighted ? e.weight : 1) < distance[e.to],
    );
  return { distance, previous, frames, negativeCycle };
}
export function reconstructPath(
  previous: Record<string, string>,
  start: string,
  end: string,
) {
  const path = [end],
    seen = new Set([end]);
  while (path[0] !== start) {
    const p = previous[path[0]];
    if (!p || seen.has(p)) return [];
    seen.add(p);
    path.unshift(p);
  }
  return path;
}
export function spanningForest(
  g: Graph,
  method: "Kruskal" | "Prim" = "Kruskal",
) {
  if (g.directed) throw Error("A feszítőfa-panel irányítatlan gráfot igényel.");
  const parent = Object.fromEntries(g.vertices.map((v) => [v.id, v.id]));
  function root(a: string): string {
    while (parent[a] !== a) a = parent[a];
    return a;
  }
  const selected: Edge[] = [],
    frames: Frame[] = [];
  const sorted = [...g.edges].sort(
    (a, b) =>
      (g.weighted ? a.weight - b.weight : 0) || a.id.localeCompare(b.id),
  );
  const reached = new Set<string>();
  if (method === "Prim" && g.vertices.length) reached.add(g.vertices[0].id);
  while (sorted.length) {
    let index = 0;
    if (method === "Prim") {
      index = sorted.findIndex(
        (e) => reached.has(e.from) !== reached.has(e.to),
      );
      if (index < 0) {
        const v = g.vertices.find((v) => !reached.has(v.id));
        if (!v) break;
        reached.add(v.id);
        continue;
      }
    }
    const e = sorted.splice(index, 1)[0];
    if (root(e.from) !== root(e.to)) {
      parent[root(e.from)] = root(e.to);
      selected.push(e);
      reached.add(e.from);
      reached.add(e.to);
    }
    frames.push({
      current: e.to,
      visited: [...reached],
      frontier: [],
      edges: selected.map((e) => e.id),
      message: `${e.from}–${e.to}: ${selected.includes(e) ? "bevesszük, nem keletkezik kör" : "kihagyjuk, kört zárna"}.`,
    });
  }
  return {
    edges: selected,
    weight: selected.reduce((s, e) => s + (g.weighted ? e.weight : 1), 0),
    frames,
  };
}
export function topologicalSort(g: Graph) {
  if (!g.directed) throw Error("Topologikus rendezéshez irányított gráf kell.");
  const d = degrees(g),
    todo = g.vertices.filter((v) => d[v.id].incoming === 0).map((v) => v.id),
    order: string[] = [];
  while (todo.length) {
    const u = todo.shift()!;
    order.push(u);
    for (const n of neighbors(g, u))
      if (--d[n.id].incoming === 0) todo.push(n.id);
  }
  return { order, acyclic: order.length === g.vertices.length };
}
export function properties(g: Graph) {
  const d = degrees(g),
    c = components(g);
  let acyclic: boolean;
  if (g.directed) acyclic = topologicalSort(g).acyclic;
  else acyclic = g.edges.length === g.vertices.length - c.length;
  const simple = g.edges.every(
    (e, i) =>
      e.from !== e.to &&
      !g.edges
        .slice(0, i)
        .some(
          (f) =>
            (e.from === f.from && e.to === f.to) ||
            (!g.directed && e.from === f.to && e.to === f.from),
        ),
  );
  return {
    degrees: d,
    components: c,
    connected: c.length === 1,
    acyclic,
    forest: !g.directed && acyclic,
    tree: !g.directed && acyclic && c.length === 1,
    complete:
      simple &&
      g.edges.length ===
        (g.directed
          ? g.vertices.length * (g.vertices.length - 1)
          : (g.vertices.length * (g.vertices.length - 1)) / 2),
    sum: Object.values(d).reduce((s, v) => s + v.degree, 0),
    odd: g.vertices.filter((v) => d[v.id].degree % 2).map((v) => v.id),
    euler: euler(g),
  };
}
