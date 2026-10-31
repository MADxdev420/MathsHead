import { useState } from "react";
import { exercises } from "../data/exercises";
import type { Topic } from "../data/lessons";
import {
  evaluate,
  parseLogic,
  truthTable,
  variables,
} from "../algorithms/logic";
import { Panel } from "./common";
export function Exercises({ topic }: { topic: Topic }) {
  const [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState<boolean | null>(null),
    [parts, setParts] = useState<number[]>([]),
    [edges, setEdges] = useState<string[]>([]);
  const q = exercises[topic][index];
  function check() {
    let valid = false;
    try {
      if (q.edit) {
        if (topic === "logic") {
          const ast = parseLogic(answer);
          valid =
            variables(ast).includes("A") &&
            truthTable(ast).every((r) => evaluate(ast, r.values));
        } else if (topic === "graph") valid = edges.length === 2;
        else
          valid = parts.length > 0 && parts.reduce((a, b) => a * b, 1) === 60;
      } else
        valid =
          answer.trim().toLocaleLowerCase("hu") ===
          q.answer.toLocaleLowerCase("hu");
    } catch {
      valid = false;
    }
    setChecked(valid);
  }
  return (
    <Panel
      id="gyakorlas"
      title="Most te következel"
      eyebrow="GYAKORLÓMŰHELY / 15 FELADAT"
    >
      <div className="exercise-tabs">
        {exercises[topic].map((_, i) => (
          <button
            aria-label={`${i + 1}. feladat`}
            aria-pressed={index === i}
            key={i}
            className={index === i ? "active" : ""}
            onClick={() => {
              setIndex(i);
              setAnswer("");
              setChecked(null);
              setParts([]);
              setEdges([]);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="exercise">
        <span className="badge">
          {q.level} ·{" "}
          {q.edit ? "Szerkesztés" : q.choices ? "Feleletválasztás" : "Számítás"}
        </span>
        <h3>{q.question}</h3>
        {q.choices ? (
          <div className="choices">
            {q.choices.map((c) => (
              <label key={c}>
                <input
                  type="radio"
                  name={`${topic}-answer`}
                  value={c}
                  checked={answer === c}
                  onChange={() => {
                    setAnswer(c);
                    setChecked(null);
                  }}
                />
                {c}
              </label>
            ))}
          </div>
        ) : q.edit && topic === "graph" ? (
          <>
            <svg
              viewBox="0 0 400 150"
              className="exercise-graph"
              role="img"
              aria-label="Háromcsúcsú szerkesztett gráf"
            >
              {edges.map((e) => {
                const p: Record<string, [number, number]> = {
                  a: [60, 110],
                  b: [200, 30],
                  c: [340, 110],
                };
                return (
                  <line
                    key={e}
                    x1={p[e[0]][0]}
                    y1={p[e[0]][1]}
                    x2={p[e[1]][0]}
                    y2={p[e[1]][1]}
                    stroke="#148269"
                    strokeWidth="4"
                  />
                );
              })}
              {[
                [60, 110, "a"],
                [200, 30, "b"],
                [340, 110, "c"],
              ].map(([x, y, t]) => (
                <g key={t}>
                  <circle cx={x} cy={y} r="18" fill="#126c58" />
                  <text
                    x={x}
                    y={Number(y) + 5}
                    fill="white"
                    textAnchor="middle"
                  >
                    {t}
                  </text>
                </g>
              ))}
            </svg>
            <div className="toolbar">
              {["ab", "ac", "bc"].map((e) => (
                <button
                  key={e}
                  aria-pressed={edges.includes(e)}
                  onClick={() => {
                    setEdges((es) =>
                      es.includes(e) ? es.filter((x) => x !== e) : [...es, e],
                    );
                    setChecked(null);
                  }}
                >
                  {e} {edges.includes(e) ? "✓" : "+"}
                </button>
              ))}
            </div>
          </>
        ) : q.edit && topic === "number" ? (
          <>
            <div className="toolbar">
              {[2, 3, 5, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setParts((p) => [...p, n]);
                    setChecked(null);
                  }}
                >
                  × {n}
                </button>
              ))}
              <button onClick={() => setParts([])}>Törlés</button>
            </div>
            <p>
              {parts.join(" · ") || "Válassz tényezőket"} ={" "}
              {parts.reduce((a, b) => a * b, 1)}
            </p>
          </>
        ) : (
          <label className="field">
            <span>{q.edit ? "Logikai formula" : "Válasz"}</span>
            <input
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setChecked(null);
              }}
            />
          </label>
        )}
        <button className="primary" onClick={check}>
          Megoldás ellenőrzése
        </button>
        {checked !== null && (
          <div
            role="status"
            className={checked ? "feedback success" : "feedback error"}
          >
            <strong>{checked ? "Helyes megoldás!" : "Még nem helyes."}</strong>
            <p>{q.explanation}</p>
            {!checked && !q.edit && <p>Helyes válasz: {q.answer}</p>}
          </div>
        )}
      </div>
    </Panel>
  );
}
