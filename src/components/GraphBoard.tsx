import { useEffect, useId, useRef } from "react";
import JXG from "jsxgraph";
import type { Graph } from "../algorithms/graph";
export interface GraphBoardProps {
  height?: number;
  boundingbox?: [number, number, number, number];
  graph: Graph;
  highlightEdges?: string[];
  highlightVertices?: string[];
  current?: string;
  onVertex?: (id: string) => void;
  onEdge?: (id: string) => void;
  onAdd?: (x: number, y: number) => void;
  onMove?: (id: string, x: number, y: number) => void;
}
export function GraphBoard(props: GraphBoardProps) {
  const id =
    "board" +
    useId().replaceAll(":", "").replaceAll("«", "").replaceAll("»", "");
  const ref = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  useEffect(() => {
    callbacks.current = props;
  });
  const { graph, highlightEdges = [], highlightVertices = [], current } = props;
  const movable = Boolean(props.onMove);
  const boxKey = JSON.stringify(props.boundingbox ?? [-6, 5.5, 6, -5.5]);
  const edgeKey = JSON.stringify(highlightEdges),
    vertexKey = JSON.stringify(highlightVertices);
  useEffect(() => {
    const highlightEdges: string[] = JSON.parse(edgeKey);
    const highlightVertices: string[] = JSON.parse(vertexKey);
    if (!ref.current) return;
    const board = JXG.JSXGraph.initBoard(id, {
      boundingbox: JSON.parse(boxKey) as [number, number, number, number],
      axis: false,
      showCopyright: false,
      showNavigation: false,
      keepaspectratio: true,
      pan: { enabled: false },
      zoom: { wheel: false, pinchHorizontal: false, pinchVertical: false },
      resize: { enabled: false, throttle: 100 },
      renderer: "svg",
    });
    board.suspendUpdate();
    const removeListeners: (() => void)[] = [];
    const points: Record<string, JXG.Point> = Object.create(null);
    for (const v of graph.vertices) {
      const p = board.create("point", [v.x, v.y], {
        name: v.label,
        size: current === v.id ? 9 : 6,
        strokeWidth: 2,
        strokeColor: current === v.id ? "#e2ab40" : "#ffffff",
        fillColor:
          current === v.id
            ? "#c28019"
            : highlightVertices.includes(v.id)
              ? "#14a07e"
              : "#236e5c",
        label: {
          display: "internal",
          parse: false,
          offset: [12, 10],
          fontSize: 15,
          strokeColor: "#377b68",
        },
        fixed: !movable,
        highlight: false,
      }) as JXG.Point;
      points[v.id] = p;
      let moved = false;
      p.on("down", () => {
        moved = false;
      });
      p.on("drag", () => {
        moved = true;
      });
      p.on("up", () => {
        if (Math.abs(p.X() - v.x) + Math.abs(p.Y() - v.y) > 0.01) {
          moved = true;
          callbacks.current.onMove?.(v.id, p.X(), p.Y());
        }
      });
      const click = () => {
        if (!moved) callbacks.current.onVertex?.(v.id);
      };
      p.rendNode.addEventListener("click", click);
      removeListeners.push(() =>
        p.rendNode.removeEventListener("click", click),
      );
    }
    for (const e of graph.edges) {
      const a = points[e.from],
        b = points[e.to];
      if (!a || !b) continue;
      const group = graph.edges.filter(
        (f) =>
          (f.from === e.from && f.to === e.to) ||
          (f.from === e.to && f.to === e.from),
      );
      const k = group.indexOf(e),
        offset =
          (k - (group.length - 1) / 2) * Math.min(0.65, 3.4 / group.length);
      const selected = highlightEdges.includes(e.id);
      const coordinates = () => {
        const xs: number[] = [],
          ys: number[] = [];
        for (let j = 0; j <= 32; j++) {
          const t = j / 32;
          if (e.from === e.to) {
            const angle = t * Math.PI * 2;
            const radius = 0.55 + k * Math.min(0.2, 1.5 / group.length);
            xs.push(a.X() + radius * Math.sin(angle));
            ys.push(a.Y() + radius - radius * Math.cos(angle));
          } else {
            const dx = b.X() - a.X(),
              dy = b.Y() - a.Y(),
              len = Math.hypot(dx, dy) || 1,
              sign = e.from.localeCompare(e.to) < 0 ? 1 : -1;
            xs.push(
              a.X() +
                dx * t -
                (dy / len) * offset * Math.sin(Math.PI * t) * sign,
            );
            ys.push(
              a.Y() +
                dy * t +
                (dx / len) * offset * Math.sin(Math.PI * t) * sign,
            );
          }
        }
        return { xs, ys };
      };
      const { xs, ys } = coordinates();
      const curve = board.create("curve", [xs, ys], {
        strokeColor: selected ? "#d69b2f" : "#91aca0",
        strokeWidth: selected ? 5 : 2.5,
        highlight: false,
        lastArrow: graph.directed ? { type: 2, size: 5 } : false,
        fixed: true,
      }) as JXG.Curve;
      curve.updateDataArray = () => {
        const next = coordinates();
        curve.dataX = next.xs;
        curve.dataY = next.ys;
      };
      const edgeClick = () => callbacks.current.onEdge?.(e.id);
      curve.rendNode.addEventListener("click", edgeClick);
      removeListeners.push(() =>
        curve.rendNode.removeEventListener("click", edgeClick),
      );
      if (graph.weighted)
        board.create(
          "text",
          [
            () => coordinates().xs[16] + 0.12,
            () => coordinates().ys[16] + 0.18,
            String(e.weight),
          ],
          {
            fontSize: 13,
            fixed: true,
            strokeColor: "#6f704c",
            highlight: false,
          },
        );
    }
    board.on("down", (event: Event) => {
      const objects = board.getAllUnderMouse(event);
      if (
        objects.some(
          (o) =>
            typeof o === "object" &&
            o !== null &&
            "elType" in o &&
            (o.elType === "point" || o.elType === "curve"),
        )
      )
        return;
      const coords = board.getUsrCoordsOfMouse(event);
      callbacks.current.onAdd?.(coords[0], coords[1]);
    });
    board.unsuspendUpdate();
    let active = true;
    const observer = new ResizeObserver(() => {
      if (active && ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        if (width > 0 && height > 0) board.resizeContainer(width, height, true);
      }
    });
    observer.observe(ref.current);
    return () => {
      active = false;
      observer.disconnect();
      removeListeners.forEach((remove) => remove());
      JXG.JSXGraph.freeBoard(board);
    };
  }, [id, graph, edgeKey, vertexKey, current, movable, boxKey]);
  return (
    <div
      ref={ref}
      id={id}
      className="graph-board"
      style={props.height ? { height: props.height } : undefined}
      aria-label="Interaktív gráf, egérrel mozgatható csúcsokkal"
    />
  );
}
