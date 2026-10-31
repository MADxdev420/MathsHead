import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  MousePointer2,
  Undo2,
  Redo2,
  Download,
  Upload,
  Trash2,
  Shuffle,
} from "lucide-react";
import {
  type Graph,
  type Frame,
  examples,
  completeGraph,
  validateGraph,
  properties,
  matrices,
  traversal,
  shortestPath,
  reconstructPath,
  spanningForest,
  topologicalSort,
} from "../algorithms/graph";
import { GraphBoard } from "../components/GraphBoard";
import {
  Panel,
  Field,
  ErrorMessage,
  Matrix,
  ExportButton,
  download,
  csv,
  useStepper,
  StepControls,
} from "../components/common";
import { Lesson } from "../components/Lesson";
import { Exercises } from "../components/Exercises";
const empty: Frame = {
  current: "",
  visited: [],
  frontier: [],
  edges: [],
  message: "Válassz algoritmust és léptesd a bejárást.",
};
function initial(): Graph {
  try {
    const s = localStorage.getItem("mathshead-graph");
    return s ? validateGraph(JSON.parse(s)) : examples.G2;
  } catch {
    return examples.G2;
  }
}
function GraphLab() {
  const [history, setHistory] = useState<Graph[]>([initial()]),
    [cursor, setCursor] = useState(0),
    [mode, setMode] = useState("move"),
    [selected, setSelected] = useState(""),
    [edgeId, setEdgeId] = useState(""),
    [from, setFrom] = useState("a"),
    [to, setTo] = useState("b"),
    [weight, setWeight] = useState("1"),
    [rename, setRename] = useState(""),
    [loops, setLoops] = useState(false),
    [parallel, setParallel] = useState(false),
    [error, setError] = useState<unknown>(null),
    [algorithm, setAlgorithm] = useState("BFS"),
    [start, setStart] = useState("a"),
    [end, setEnd] = useState("f"),
    [k, setK] = useState(5),
    [json, setJson] = useState("");
  const graph = history[cursor],
    p = properties(graph),
    m = matrices(graph);
  const [revision, setRevision] = useState(0);
  const ids = graph.vertices.map((v) => v.id),
    actualStart = ids.includes(start) ? start : (ids[0] ?? ""),
    actualEnd = ids.includes(end) ? end : (ids.at(-1) ?? "");
  function commit(next: Graph) {
    try {
      validateGraph(next);
      setHistory((h) => [...h.slice(0, cursor + 1), next].slice(-60));
      setCursor(Math.min(cursor + 1, 59));
      setError(null);
      setRevision((r) => r + 1);
    } catch (e) {
      setError(e);
    }
  }
  useEffect(() => {
    try {
      localStorage.setItem("mathshead-graph", JSON.stringify(graph));
    } catch {
      /* Storage may be disabled. */
    }
  }, [graph]);
  function addEdge(a = from, b = to) {
    if (!ids.includes(a) || !ids.includes(b)) {
      setError("Válassz két létező csúcsot.");
      return;
    }
    if (a === b && !loops) {
      setError("A hurokélek külön engedélyezendők.");
      return;
    }
    if (
      !parallel &&
      graph.edges.some(
        (e) =>
          (e.from === a && e.to === b) ||
          (!graph.directed && e.from === b && e.to === a),
      )
    ) {
      setError("A párhuzamos élek külön engedélyezendők.");
      return;
    }
    const w = Number(weight);
    if (!weight.trim() || !Number.isSafeInteger(w) || Math.abs(w) > 1e6) {
      setError("Egész, legfeljebb 10⁶ abszolút értékű élsúly szükséges.");
      return;
    }
    commit({
      ...graph,
      edges: [
        ...graph.edges,
        { id: crypto.randomUUID(), from: a, to: b, weight: w },
      ],
    });
  }
  function addVertex(x = 0, y = 0) {
    let i = 0;
    while (ids.includes("v" + i)) i++;
    const id = "v" + i;
    commit({
      ...graph,
      vertices: [
        ...graph.vertices,
        {
          id,
          label: id,
          x: Math.max(-5, Math.min(5, x)),
          y: Math.max(-4.5, Math.min(4.5, y)),
        },
      ],
    });
  }
  function vertexClick(id: string) {
    setRename(graph.vertices.find((v) => v.id === id)?.label ?? "");
    if (mode === "edge") {
      if (selected) {
        addEdge(selected, id);
        setSelected("");
      } else setSelected(id);
    } else setSelected(id);
  }
  function arrange() {
    commit({
      ...graph,
      vertices: graph.vertices.map((v, i) => ({
        ...v,
        x: 4 * Math.cos((i * 2 * Math.PI) / ids.length),
        y: 4 * Math.sin((i * 2 * Math.PI) / ids.length),
      })),
    });
  }
  function run() {
    const frames: Frame[] = [];
    let result = "",
      distances: Record<string, number> | undefined,
      previous: Record<string, string> | undefined,
      negative = false;
    try {
      if (algorithm === "BFS" || algorithm === "DFS") {
        frames.push(...traversal(graph, actualStart, algorithm === "DFS"));
        result =
          "Bejárási sorrend: " +
          frames.map((f) => label(f.current)).join(" → ");
      } else if (algorithm === "Euler") {
        const e = p.euler;
        result =
          e.reason +
          (e.exists ? " Útvonal: " + e.vertices.map(label).join(" → ") : "");
        if (e.exists)
          for (let i = 0; i <= e.edges.length; i++)
            frames.push({
              current: e.vertices[i] ?? "",
              visited: e.vertices.slice(0, i + 1),
              frontier: [],
              edges: e.edges.slice(0, i),
              message:
                i === 0
                  ? "Hierholzer: indulás."
                  : `${i}. él bejárva; minden él legfeljebb egyszer szerepel.`,
            });
      } else if (algorithm === "Kruskal" || algorithm === "Prim") {
        const r = spanningForest(graph, algorithm);
        frames.push(...r.frames);
        result = `Minimális feszítő${p.connected ? "fa" : "erdő"}: ${r.edges.length} él, összsúly ${r.weight}.`;
      } else if (algorithm === "Topologikus") {
        const r = topologicalSort(graph);
        result = r.acyclic
          ? "Topologikus sorrend: " + r.order.map(label).join(" → ")
          : "Irányított kör van: nem létezik topologikus rendezés.";
        r.order.forEach((id, i) =>
          frames.push({
            current: id,
            visited: r.order.slice(0, i + 1),
            frontier: [],
            edges: [],
            message: "Nulla befokú csúcs eltávolítása: " + label(id),
          }),
        );
      } else {
        const method =
          algorithm === "Legrövidebb BFS"
            ? "BFS"
            : (algorithm as "Dijkstra" | "Bellman–Ford");
        const r = shortestPath(graph, actualStart, method);
        frames.push(...r.frames);
        distances = r.distance;
        previous = r.previous;
        negative = r.negativeCycle;
        const path = reconstructPath(r.previous, actualStart, actualEnd);
        result = negative
          ? "A kezdőcsúcsból elérhető negatív kör van; nincs minden érintett csúcsra véges minimum."
          : path.length
            ? `Optimális út: ${path.map(label).join(" → ")}. Hossz: ${r.distance[actualEnd]}.`
            : "A célcsúcs nem érhető el.";
      }
      return {
        frames: frames.length ? frames : [empty],
        result,
        distances,
        previous,
        negative,
        error: null,
      };
    } catch (e) {
      return { frames: [empty], result: "", error: e };
    }
  }
  function label(id: string) {
    return graph.vertices.find((v) => v.id === id)?.label ?? id;
  }
  // Immutable graph snapshots are the complete algorithm inputs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const simulation = useMemo(run, [graph, algorithm, actualStart, actualEnd]);
  const stepper = useStepper(simulation.frames.length);
  const { setStep, setPlaying } = stepper;
  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [revision, algorithm, actualStart, actualEnd, setStep, setPlaying]);
  const frame = simulation.frames[stepper.step] ?? empty;
  function svgExport() {
    const svg = document.querySelector("#editor-board svg");
    if (svg)
      download(
        "graf.svg",
        new XMLSerializer().serializeToString(svg),
        "image/svg+xml",
      );
  }
  const selectedVertex = graph.vertices.find((v) => v.id === selected),
    selectedEdge = graph.edges.find((e) => e.id === edgeId);
  const descriptions: Record<string, [string, string, string]> = {
    BFS: [
      "Rétegenként járja be az elérhető csúcsokat; legrövidebb élszámú utat ad.",
      "Irányított és irányítatlan, súlyozatlan értelmezéssel.",
      "O(V+E) szomszédsági listával; itt a szemléltető élkeresés miatt O(VE).",
    ],
    DFS: [
      "Mélyre halad, majd visszalép; egy bejárási erdőt épít.",
      "Bármely gráfon, a kiválasztott kezdőcsúcsból.",
      "O(V+E) szomszédsági listával; itt O(VE).",
    ],
    Euler: [
      "Hierholzer: rész-körök összeillesztése, a felhasznált élek azonosítóinak követésével.",
      "Az Euler-feltételnek megfelelő (multi)gráfokon.",
      "O(E) optimalizált listákkal; a szemléltető implementáció O(E²).",
    ],
    Dijkstra: [
      "A legkisebb ismert távolságú csúcs távolsága véglegesíthető.",
      "Csak nemnegatív súlyokkal.",
      "Egyszerű rendezett fronttal O(E² log E + VE).",
    ],
    "Bellman–Ford": [
      "Minden élt legfeljebb V−1 menetben relaxálunk; további javulás negatív kört jelez.",
      "Negatív súlyokkal is; csak elérhető negatív körre figyelmeztet.",
      "O(VE), az animációs pillanatképek tárolása további memóriát igényel.",
    ],
    "Legrövidebb BFS": [
      "Az élek egységnyi súlyúnak számítanak; a távolság az élszám.",
      "Súlyozatlan gráfokon; az eltárolt súlyokat figyelmen kívül hagyja.",
      "A jelen implementáció O(VE).",
    ],
    Kruskal: [
      "A súly szerinti következő élt bevesszük, ha nem zár kört (vágási tulajdonság).",
      "Irányítatlan gráf; negatív súly is lehet.",
      "Rendezés O(E log E); egyszerű komponenskereséssel itt O(EV).",
    ],
    Prim: [
      "A növekvő fából kifelé vezető legkisebb él mindig választható (vágási tulajdonság).",
      "Irányítatlan gráf; nem összefüggő esetben erdőt ad.",
      "A szemléltető tömbös megvalósítás O(E²+EV).",
    ],
    Topologikus: [
      "Kahn algoritmusa a nulla befokú csúcsokat távolítja el.",
      "Csak körmentes irányított gráfnak van teljes rendezése.",
      "O(V+E) listákkal; itt O(VE).",
    ],
  };
  return (
    <>
      <Panel
        id="szerkeszto"
        title="A saját gráflaborod"
        eyebrow="04 / RAJZOLJ. MÓDOSÍTS. FEDEZD FEL."
      >
        <div className="graph-settings">
          <label>
            <input
              type="checkbox"
              checked={graph.directed}
              onChange={(e) => commit({ ...graph, directed: e.target.checked })}
            />{" "}
            Irányított
          </label>
          <label>
            <input
              type="checkbox"
              checked={graph.weighted}
              onChange={(e) => commit({ ...graph, weighted: e.target.checked })}
            />{" "}
            Súlyozott
          </label>
          <label>
            <input
              type="checkbox"
              checked={loops}
              onChange={(e) => setLoops(e.target.checked)}
            />{" "}
            Hurokélek engedélyezve
          </label>
          <label>
            <input
              type="checkbox"
              checked={parallel}
              onChange={(e) => setParallel(e.target.checked)}
            />{" "}
            Párhuzamos élek engedélyezve
          </label>
        </div>
        <div className="toolbar">
          <button
            aria-pressed={mode === "move"}
            onClick={() => {
              setMode("move");
              setSelected("");
            }}
          >
            <MousePointer2 size={16} /> Kijelölés / mozgatás
          </button>
          <button aria-pressed={mode === "add"} onClick={() => setMode("add")}>
            <Plus size={16} /> Kattintással csúcs
          </button>
          <button
            aria-pressed={mode === "edge"}
            onClick={() => {
              setMode("edge");
              setSelected("");
            }}
          >
            Két kattintással él
          </button>
          <button onClick={() => addVertex()}>
            <Plus size={16} /> Csúcs középre
          </button>
          <button
            title="Visszavonás"
            aria-label="Visszavonás"
            disabled={!cursor}
            onClick={() => {
              setCursor((c) => c - 1);
              setRevision((r) => r + 1);
            }}
          >
            <Undo2 size={16} />
          </button>
          <button
            title="Újra"
            aria-label="Újra"
            disabled={cursor === history.length - 1}
            onClick={() => {
              setCursor((c) => c + 1);
              setRevision((r) => r + 1);
            }}
          >
            <Redo2 size={16} />
          </button>
          <button onClick={arrange}>
            <Shuffle size={16} /> Elrendezés
          </button>
        </div>
        <div className="editor-layout">
          <div id="editor-board" className="board-wrap">
            <GraphBoard
              graph={graph}
              highlightEdges={edgeId ? [edgeId] : frame.edges}
              highlightVertices={selected ? [selected] : frame.visited}
              current={frame.current}
              onVertex={vertexClick}
              onEdge={(id) => {
                setEdgeId(id);
                setWeight(
                  String(graph.edges.find((e) => e.id === id)?.weight ?? 1),
                );
              }}
              onAdd={mode === "add" ? (x, y) => addVertex(x, y) : undefined}
              onMove={
                mode === "move"
                  ? (id, x, y) =>
                      commit({
                        ...graph,
                        vertices: graph.vertices.map((v) =>
                          v.id === id
                            ? {
                                ...v,
                                x: Math.max(-5, Math.min(5, x)),
                                y: Math.max(-4.5, Math.min(4.5, y)),
                              }
                            : v,
                        ),
                      })
                  : undefined
              }
            />
            <span className="board-caption">
              {mode === "add"
                ? "Kattints az üres vászonra egy új csúcshoz."
                : mode === "edge"
                  ? selected
                    ? `Kezdőcsúcs: ${label(selected)}. Válaszd a végpontot.`
                    : "Válaszd az él két végpontját."
                  : "Húzd a csúcsokat, vagy kattints egy elemre."}
            </span>
          </div>
          <aside className="editor-inspector">
            <h3>Gráf létrehozása</h3>
            <Field label="Ellenőrzött példagráf">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    commit(structuredClone(examples[e.target.value]));
                    setSelected("");
                    setEdgeId("");
                  }
                }}
              >
                <option value="" disabled>
                  Példa betöltése…
                </option>
                {Object.keys(examples).map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </Field>
            <div className="inline">
              <Field label="Teljes gráf mérete">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                />
              </Field>
              <button
                onClick={() => {
                  try {
                    commit(completeGraph(k));
                  } catch (e) {
                    setError(e);
                  }
                }}
              >
                K{k}
              </button>
            </div>
            <button
              onClick={() =>
                commit({
                  ...completeGraph(6),
                  edges: completeGraph(6).edges.filter((e) => e.from === "a"),
                })
              }
            >
              Fa generálása (6 csúcs)
            </button>
            <button
              className="subtle"
              onClick={() => commit({ ...graph, vertices: [], edges: [] })}
            >
              <Trash2 size={15} /> Gráf törlése
            </button>
            <hr />
            <h3>Billentyűzettel is szerkeszthető</h3>
            <Field label="Kijelölt csúcs">
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setRename(label(e.target.value));
                }}
              >
                <option value="">Válassz…</option>
                {graph.vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>
            {selectedVertex && (
              <>
                <Field label="Új csúcsnév">
                  <input
                    value={rename}
                    maxLength={20}
                    onChange={(e) => setRename(e.target.value)}
                  />
                </Field>
                <button
                  onClick={() => {
                    if (rename.trim())
                      commit({
                        ...graph,
                        vertices: graph.vertices.map((v) =>
                          v.id === selected
                            ? { ...v, label: rename.trim() }
                            : v,
                        ),
                      });
                  }}
                >
                  Átnevezés
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    commit({
                      ...graph,
                      vertices: graph.vertices.filter((v) => v.id !== selected),
                      edges: graph.edges.filter(
                        (e) => e.from !== selected && e.to !== selected,
                      ),
                    });
                    setSelected("");
                  }}
                >
                  Csúcs törlése
                </button>
                <div
                  className="toolbar"
                  aria-label="Csúcs mozgatása billentyűzettel"
                >
                  {[
                    ["Balra", -0.5, 0],
                    ["Jobbra", 0.5, 0],
                    ["Fel", 0, 0.5],
                    ["Le", 0, -0.5],
                  ].map(([name, dx, dy]) => (
                    <button
                      key={name}
                      aria-label={`Csúcs ${name}`}
                      onClick={() =>
                        commit({
                          ...graph,
                          vertices: graph.vertices.map((v) =>
                            v.id === selected
                              ? {
                                  ...v,
                                  x: Math.max(
                                    -5,
                                    Math.min(5, v.x + Number(dx)),
                                  ),
                                  y: Math.max(
                                    -4.5,
                                    Math.min(4.5, v.y + Number(dy)),
                                  ),
                                }
                              : v,
                          ),
                        })
                      }
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="form-grid compact">
              <Field label="Él kezdete">
                <select
                  value={ids.includes(from) ? from : ""}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  <option value="">Válassz…</option>
                  {graph.vertices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Él vége">
                <select
                  value={ids.includes(to) ? to : ""}
                  onChange={(e) => setTo(e.target.value)}
                >
                  <option value="">Válassz…</option>
                  {graph.vertices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Élsúly">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Field>
            <p className="hint">
              Egész súlyok −10⁶ és 10⁶ között; pontos számítás, kerekítés
              nélkül.
            </p>
            <button onClick={() => addEdge()}>Él hozzáadása</button>
            <Field label="Kijelölt él">
              <select
                value={selectedEdge ? edgeId : ""}
                onChange={(e) => {
                  setEdgeId(e.target.value);
                  setWeight(
                    String(
                      graph.edges.find((x) => x.id === e.target.value)
                        ?.weight ?? 1,
                    ),
                  );
                }}
              >
                <option value="">Válassz…</option>
                {graph.edges.map((e, i) => (
                  <option key={e.id} value={e.id}>
                    e{i + 1}: {label(e.from)}–{label(e.to)}
                  </option>
                ))}
              </select>
            </Field>
            {selectedEdge && (
              <div className="toolbar">
                <button
                  onClick={() => {
                    const w = Number(weight);
                    if (
                      !weight.trim() ||
                      !Number.isSafeInteger(w) ||
                      Math.abs(w) > 1e6
                    ) {
                      setError("Érvénytelen súly.");
                      return;
                    }
                    commit({
                      ...graph,
                      edges: graph.edges.map((e) =>
                        e.id === edgeId ? { ...e, weight: w } : e,
                      ),
                    });
                  }}
                >
                  Súly mentése
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    commit({
                      ...graph,
                      edges: graph.edges.filter((e) => e.id !== edgeId),
                    });
                    setEdgeId("");
                  }}
                >
                  Él törlése
                </button>
              </div>
            )}
          </aside>
        </div>
        <ErrorMessage error={error} />
        <details>
          <summary>Mentés, import és export</summary>
          <div className="toolbar">
            <button
              onClick={() =>
                download(
                  "graf.json",
                  JSON.stringify(graph, null, 2),
                  "application/json",
                )
              }
            >
              <Download size={15} /> JSON-export
            </button>
            <button onClick={svgExport}>
              <Download size={15} /> SVG-export
            </button>
            <label className="button">
              <Upload size={15} /> JSON-fájl
              <input
                className="sr-only"
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  try {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 100000)
                        throw Error("Legfeljebb 100 kB-os JSON.");
                      commit(validateGraph(JSON.parse(await f.text())));
                    }
                  } catch (err) {
                    setError(err);
                  }
                }}
              />
            </label>
          </div>
          <Field label="Gráf JSON beillesztése">
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              rows={4}
            />
          </Field>
          <button
            onClick={() => {
              try {
                commit(validateGraph(JSON.parse(json)));
              } catch (e) {
                setError(e);
              }
            }}
          >
            JSON importálása
          </button>
          <p className="hint">
            A gráf automatikusan mentődik ezen a böngészőn. Legfeljebb 30 csúcs,
            150 él, 60 visszavonási állapot.
          </p>
        </details>
      </Panel>
      <Panel
        id="tulajdonsagok"
        title="Mit árul el a gráfod?"
        eyebrow="05 / ÉLŐ TULAJDONSÁGOK"
      >
        <div className="stat-grid">
          {[
            ["Csúcs", ids.length],
            ["Él", graph.edges.length],
            ["Komponens", p.components.length],
            ["Összefüggő (gyengén)", p.connected ? "igen" : "nem"],
            ["Körmentes", p.acyclic ? "igen" : "nem"],
            ["Fa / erdő", p.tree ? "fa" : p.forest ? "erdő" : "egyik sem"],
            ["Teljes gráf", p.complete ? "igen" : "nem"],
            ["Euler-séta", p.euler.exists ? "van" : "nincs"],
            ["Euler-kör", p.euler.exists && p.euler.circuit ? "van" : "nincs"],
          ].map(([l, v]) => (
            <div className="stat" key={l}>
              <span>{l}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <div className="result-strip">
          <span>Kézfogás-lemma {graph.directed ? "(be + ki)" : ""}</span>
          <strong>
            Σdeg(v) = {p.sum} = 2 × {graph.edges.length} ✓
          </strong>
        </div>
        <div className="number-chips">
          {graph.vertices.map((v) => (
            <span key={v.id}>
              {v.label}:{" "}
              {graph.directed
                ? `be ${p.degrees[v.id].incoming}, ki ${p.degrees[v.id].outgoing}`
                : `deg ${p.degrees[v.id].degree}`}
            </span>
          ))}
        </div>
        <p>
          Páratlan fokszám: {p.odd.map(label).join(", ") || "nincs"}. Páros
          fokszám:{" "}
          {ids
            .filter((id) => !p.odd.includes(id))
            .map(label)
            .join(", ") || "nincs"}
          . Komponensek:{" "}
          {p.components
            .map((c) => "{" + c.map(label).join(", ") + "}")
            .join(" · ")}
          .
        </p>
      </Panel>
      <Panel
        id="algoritmusok"
        title="Lásd az algoritmus gondolkodását"
        eyebrow="06 / ALGORITMUSMŰHELY"
      >
        <div className="form-grid">
          <Field label="Algoritmus">
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setEdgeId("");
                setSelected("");
              }}
            >
              {Object.keys(descriptions).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Kezdőcsúcs">
            <select
              value={actualStart}
              onChange={(e) => setStart(e.target.value)}
            >
              {graph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Célcsúcs">
            <select value={actualEnd} onChange={(e) => setEnd(e.target.value)}>
              {graph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="algorithm-info">
          <h3>{algorithm}</h3>
          <p>{descriptions[algorithm][0]}</p>
          <p>
            <strong>Feltételek: </strong>
            {descriptions[algorithm][1]}
          </p>
          <p>
            <strong>Időigény: </strong>
            {descriptions[algorithm][2]}
          </p>
        </div>
        <ErrorMessage error={simulation.error} />
        <GraphBoard
          graph={graph}
          highlightEdges={frame.edges}
          highlightVertices={frame.visited}
          current={frame.current}
        />
        <StepControls state={stepper} total={simulation.frames.length} />
        <div aria-live="polite" className="feedback">
          <strong>{frame.message}</strong>
          <p>
            Meglátogatott: {frame.visited.map(label).join(", ") || "—"} ·
            Várakozó {algorithm === "DFS" ? "verem" : "sor"}:{" "}
            {frame.frontier.map(label).join(", ") || "üres"}
          </p>
        </div>
        <p className={simulation.negative ? "error" : "result-strip"}>
          {simulation.result}
        </p>
        {simulation.distances && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Csúcs</th>
                  <th>Távolság az aktuális lépésben</th>
                  <th>Előd</th>
                </tr>
              </thead>
              <tbody>
                {ids.map((id) => (
                  <tr key={id}>
                    <th>{label(id)}</th>
                    <td>
                      {String((frame.distances ?? simulation.distances)?.[id])}
                    </td>
                    <td>
                      {label(
                        (frame.previous ?? simulation.previous)?.[id] ?? "—",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel id="matrixok" title="A gráf számokban" eyebrow="07 / MÁTRIXOK">
        <div className="two-col">
          <div>
            <div className="section-label">
              <h3>Szomszédsági mátrix</h3>
              <ExportButton
                name="szomszedsagi.csv"
                content={csv([
                  ["", ...graph.vertices.map((v) => v.label)],
                  ...m.adjacency.map((r, i) => [label(ids[i]), ...r]),
                ])}
              />
            </div>
            <Matrix
              rows={graph.vertices.map((v) => v.label)}
              cols={graph.vertices.map((v) => v.label)}
              values={m.adjacency}
              selectedRow={ids.indexOf(selected)}
              selectedColumn={ids.indexOf(selected)}
              onCell={(i, j) => {
                setSelected(ids[i]);
                setEdgeId(
                  graph.edges.find(
                    (e) =>
                      (e.from === ids[i] && e.to === ids[j]) ||
                      (!graph.directed && e.from === ids[j] && e.to === ids[i]),
                  )?.id ?? "",
                );
              }}
            />
          </div>
          <div>
            <div className="section-label">
              <h3>Illeszkedési mátrix</h3>
              <ExportButton
                name="illeszkedesi.csv"
                content={csv([
                  ["", ...graph.edges.map((_, i) => "e" + (i + 1))],
                  ...m.incidence.map((r, i) => [label(ids[i]), ...r]),
                ])}
              />
            </div>
            <Matrix
              rows={graph.vertices.map((v) => v.label)}
              cols={graph.edges.map((_, i) => "e" + (i + 1))}
              values={m.incidence}
              selectedRow={ids.indexOf(selected)}
              selectedColumn={graph.edges.findIndex((e) => e.id === edgeId)}
              onCell={(i, j) => {
                setSelected(ids[i]);
                setEdgeId(graph.edges[j].id);
              }}
            />
          </div>
        </div>
        <p className="hint">
          Kattintás: a sor csúcsa és a kapcsolódó él kiemelődik a szerkesztőben.
          Szomszédság: súlyozatlanul élszám, súlyozottan súlyösszeg; a 0
          súlyösszeg nem feltétlenül jelent élhiányt. Hurok a diagonálison
          egyszer szerepel. Illeszkedés: irányítatlanul élvégek száma (hurok:
          2); irányítottan kiindulás −1, érkezés +1, hurokoszlop 0. A súlyoktól
          független.
        </p>
      </Panel>
    </>
  );
}
function Bridges() {
  const g = examples["Königsberg"];
  const [current, setCurrent] = useState("a"),
    [used, setUsed] = useState<string[]>([]),
    [route, setRoute] = useState(["a"]);
  const available = g.edges.filter(
    (e) => !used.includes(e.id) && (e.from === current || e.to === current),
  );
  return (
    <Panel
      id="hidak"
      title="Egy város. Hét híd. Egy lehetetlen séta."
      eyebrow="08 / A KÖNIGSBERGI HIDAK"
    >
      <p>
        Válassz kezdőterületet, majd a hídgombokkal próbálj átkelni mind a hét
        hídon pontosan egyszer. A két rajz ugyanazt a négy területet és hét
        hidat követi.
      </p>
      <div className="two-col">
        <svg
          className="bridge-map"
          viewBox="0 0 500 350"
          role="img"
          aria-label="Königsberg sematikus térképe"
        >
          <rect width="500" height="350" rx="20" fill="#d7eaf0" />
          <path d="M0 0H500V75H0ZM0 285H500V350H0Z" fill="#e4e4ca" />
          <ellipse cx="220" cy="180" rx="115" ry="45" fill="#e4e4ca" />
          <path d="M385 105H500V250H385Z" fill="#e4e4ca" />
          {g.edges.map((e, i) => {
            const paths = [
              "M160 75L160 140",
              "M230 75L230 137",
              "M160 220L160 285",
              "M230 224L230 285",
              "M333 180L386 180",
              "M435 75L435 105",
              "M435 250L435 285",
            ];
            return (
              <path
                key={e.id}
                d={paths[i]}
                stroke={used.includes(e.id) ? "#d89c30" : "#497e68"}
                strokeWidth="13"
              />
            );
          })}
          {[
            ["A", 220, 185],
            ["B", 300, 45],
            ["C", 300, 325],
            ["D", 445, 180],
          ].map(([t, x, y]) => (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              fill="#255a4c"
              fontSize="24"
              fontWeight="bold"
            >
              {t}
              {current === String(t).toLowerCase() ? " ●" : ""}
            </text>
          ))}
        </svg>
        <GraphBoard graph={g} current={current} highlightEdges={used} />
      </div>
      <div className="toolbar">
        <Field label="Kezdőterület">
          <select
            value={route[0]}
            onChange={(e) => {
              setCurrent(e.target.value);
              setRoute([e.target.value]);
              setUsed([]);
            }}
          >
            {g.vertices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label.toUpperCase()}
              </option>
            ))}
          </select>
        </Field>
        {available.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              const next = e.from === current ? e.to : e.from;
              setUsed([...used, e.id]);
              setCurrent(next);
              setRoute([...route, next]);
            }}
          >
            Híd {g.edges.indexOf(e) + 1}: {e.from.toUpperCase()}–
            {e.to.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => {
            setUsed([]);
            setCurrent(route[0]);
            setRoute([route[0]]);
          }}
        >
          Újrakezdés
        </button>
      </div>
      <p className="result-strip">
        {route.map((x) => x.toUpperCase()).join(" → ")} · {used.length}/7 híd
      </p>
      {available.length === 0 && (
        <p className="error">
          Elakadtál: {7 - used.length} híd kimaradt. Más kezdőponttal sem
          járható be az összes.
        </p>
      )}
      <p>
        Fokszámok: A=5, B=3, C=3, D=3. Négy páratlan fokszámú csúcs van. Egy
        séta csak két végpontot enged, ezért az összes híd egyszeri bejárása
        lehetetlen (Euler, 1736).
      </p>
    </Panel>
  );
}
export default function GraphPage() {
  return (
    <>
      <Lesson topic="graph" />
      <GraphLab />
      <Bridges />
      <Exercises topic="graph" />
    </>
  );
}
