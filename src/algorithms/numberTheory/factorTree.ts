import { factorize } from "./index";
import type { Graph } from "../graph";
/** Binary tree: every internal node is composite; leaves are primes. */
export function buildFactorTree(n: number): Graph {
  const { steps } = factorize(n);
  const graph: Graph = {
    vertices: n > 1 ? [{ id: "n0", label: String(n), x: 0, y: 0 }] : [],
    edges: [],
    directed: true,
    weighted: false,
  };
  steps.forEach((s, i) => {
    if (s.quotient === 1) return;
    graph.vertices.push(
      { id: "p" + i, label: String(s.prime), x: -3, y: -i - 1 },
      { id: "n" + (i + 1), label: String(s.quotient), x: 1, y: -i - 1 },
    );
    graph.edges.push(
      { id: "ep" + i, from: "n" + i, to: "p" + i, weight: 1 },
      { id: "en" + i, from: "n" + i, to: "n" + (i + 1), weight: 1 },
    );
  });
  return graph;
}
