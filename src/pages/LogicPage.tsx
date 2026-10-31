import { useMemo, useState } from "react";
import {
  evaluate,
  parseLogic,
  format,
  truthTable,
  variables,
  subexpressions,
  equivalent,
  quantify,
} from "../algorithms/logic";
import {
  Panel,
  Field,
  MathText,
  ErrorMessage,
  Toggle,
  ExportButton,
  useStepper,
  StepControls,
} from "../components/common";
import { Lesson } from "../components/Lesson";
import { Exercises } from "../components/Exercises";
import { finitePredicate } from "../algorithms/logic/predicate";
function LogicCalculator() {
  const [input, setInput] = useState("(A AND B) OR NOT C"),
    [other, setOther] = useState("NOT (NOT (A AND B) AND C)"),
    [values, setValues] = useState<Record<string, boolean>>({
      A: true,
      B: false,
      C: true,
    }),
    [selected, setSelected] = useState(-1);
  const data = useMemo(() => {
    try {
      const ast = parseLogic(input),
        vars = variables(ast),
        rows = truthTable(ast),
        subs = subexpressions(ast);
      return { ast, vars, rows, subs, error: null };
    } catch (error) {
      return { error };
    }
  }, [input]);
  let comparison: ReturnType<typeof equivalent> | undefined,
    comparisonError: unknown;
  try {
    if (data.ast && other) comparison = equivalent(data.ast, parseLogic(other));
  } catch (e) {
    comparisonError = e;
  }
  return (
    <Panel
      id="kalkulator"
      title="Logikai kifejezéslabor"
      eyebrow="04 / PRÓBÁLD KI"
    >
      <Field label="Logikai kifejezés">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelected(-1);
          }}
          spellCheck={false}
        />
      </Field>
      <p className="hint">
        NOT / ¬ · AND / ∧ · OR / ∨ · XOR / ⊕ · IMPLIES / → · IFF / ↔. Erősségi
        sorrend ugyanebben a sorrendben, az OR az XOR után. Az implikáció jobbra
        köt.
      </p>
      <div className="toolbar">
        {["A IFF B", "A OR NOT A", "A AND NOT A", "NOT (A AND B)"].map((f) => (
          <button className="subtle" key={f} onClick={() => setInput(f)}>
            {f}
          </button>
        ))}
      </div>
      <ErrorMessage error={data.error} />
      {data.ast && data.rows && (
        <>
          <MathText block>{format(data.ast, true)}</MathText>
          <div className="toolbar">
            {data.vars?.map((v) => (
              <Toggle
                key={v}
                label={v}
                value={values[v] ?? false}
                onChange={(x) => setValues({ ...values, [v]: x })}
              />
            ))}
          </div>
          <div className="result-strip">
            <span>Aktuális eredmény</span>
            <strong>
              {evaluate(
                data.ast,
                Object.fromEntries(
                  data.vars!.map((v) => [v, values[v] ?? false]),
                ),
              )
                ? "IGAZ"
                : "HAMIS"}
            </strong>
            <span className="badge">
              {data.rows.every((r) => r.result)
                ? "Tautológia"
                : data.rows.every((r) => !r.result)
                  ? "Ellentmondás"
                  : "Kielégíthető, nem tautológia"}
            </span>
          </div>
          <div className="section-label">
            <h3>
              Teljes igazságtábla{" "}
              <span className="muted">{data.rows.length} értékelés</span>
            </h3>
            <ExportButton
              name="igazsagtabla.csv"
              content={[
                [...data.vars!, ...data.subs!.map((a) => format(a))].join(";"),
                ...data.rows.map((r) =>
                  [
                    ...data.vars!.map((v) => +r.values[v]),
                    ...data.subs!.map((a) => +evaluate(a, r.values)),
                  ].join(";"),
                ),
              ].join("\n")}
            />
          </div>
          <p className="hint">Kattints egy sorra a kiemeléshez.</p>
          <div className="table-scroll truth">
            <table>
              <thead>
                <tr>
                  {data.vars?.map((v) => (
                    <th scope="col" key={v}>
                      {v}
                    </th>
                  ))}
                  {data.subs?.map((a) => (
                    <th scope="col" key={format(a)}>
                      {format(a)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelected(i)}
                    className={selected === i ? "selected" : ""}
                  >
                    {data.vars?.map((v) => (
                      <td key={v}>
                        <button
                          className="cell"
                          aria-label={`${i + 1}. sor, ${v}`}
                          onClick={() => setSelected(i)}
                        >
                          {r.values[v] ? "I" : "H"}
                        </button>
                      </td>
                    ))}
                    {data.subs?.map((a) => (
                      <td
                        key={format(a)}
                        className={
                          evaluate(a, r.values) ? "true-cell" : "false-cell"
                        }
                      >
                        {evaluate(a, r.values) ? "I" : "H"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Field label="Ekvivalencia ellenőrzése ezzel a kifejezéssel">
            <input value={other} onChange={(e) => setOther(e.target.value)} />
          </Field>
          <ErrorMessage error={comparisonError} />
          {comparison && (
            <p
              className={
                comparison.equivalent ? "feedback success" : "feedback error"
              }
            >
              {comparison.equivalent
                ? "✓ A két kifejezés logikailag ekvivalens."
                : `Nem ekvivalensek. Ellenpélda: ${Object.entries(
                    comparison.counterexample!,
                  )
                    .map(([v, x]) => `${v}=${x ? "igaz" : "hamis"}`)
                    .join(", ")}.`}
            </p>
          )}
        </>
      )}
    </Panel>
  );
}
function Identities() {
  const [a, setA] = useState(true),
    [b, setB] = useState(false);
  const rows = [
    ["¬(A ∧ B)", !(a && b), "¬A ∨ ¬B", !a || !b],
    ["¬(A ∨ B)", !(a || b), "¬A ∧ ¬B", !a && !b],
  ] as const;
  return (
    <Panel
      id="azonossagok"
      title="Ugyanaz, másképp"
      eyebrow="05 / DE MORGAN ÉS KONTRAPOZÍCIÓ"
    >
      <div className="toolbar">
        <Toggle label="A" value={a} onChange={setA} />
        <Toggle label="B" value={b} onChange={setB} />
      </div>
      <div className="identity-grid">
        {rows.map(([l, x, r, y]) => (
          <div className="identity" key={l}>
            <div>
              <span>{l}</span>
              <strong>{x ? "IGAZ" : "HAMIS"}</strong>
            </div>
            <span className="equal">≡</span>
            <div>
              <span>{r}</span>
              <strong>{y ? "IGAZ" : "HAMIS"}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="venn" aria-label="Venn-diagram: A és B halmaz">
        <svg viewBox="0 0 440 180" role="img">
          <rect
            x="20"
            y="10"
            width="400"
            height="160"
            rx="12"
            fill="var(--wash)"
          />
          <circle
            cx="180"
            cy="90"
            r="65"
            fill={a ? "#33b89a88" : "#b1bdb344"}
            stroke="#17866c"
            strokeWidth="2"
          />
          <circle
            cx="260"
            cy="90"
            r="65"
            fill={b ? "#69a2e688" : "#b1bdb344"}
            stroke="#4889b8"
            strokeWidth="2"
          />
          <text x="152" y="96" fill="currentColor">
            A
          </text>
          <text x="278" y="96" fill="currentColor">
            B
          </text>
        </svg>
      </div>
      <h3>Ha esik az eső (A), moziba megyünk (B)</h3>
      <div className="stat-grid">
        {[
          ["A → B", !a || b, "eredeti"],
          ["B → A", !b || a, "megfordítás"],
          ["¬A → ¬B", a || !b, "inverz"],
          ["¬B → ¬A", b || !a, "kontrapozíció"],
        ].map(([f, v, l]) => (
          <div className="stat" key={String(f)}>
            <span>{l}</span>
            <strong>{f}</strong>
            <em>{v ? "Igaz" : "Hamis"}</em>
          </div>
        ))}
      </div>
      <p>
        Az eredeti és a kontrapozíció minden értékelésnél ekvivalens. A
        megfordítás és az inverz egymással ekvivalens, de az eredetivel
        általában nem. A pillanatnyi értékegyezés önmagában nem logikai
        ekvivalencia.
      </p>
    </Panel>
  );
}
function Quantifiers() {
  const [setText, setSetText] = useState("-2,-1,0,1,2"),
    [predicate, setPredicate] = useState("even"),
    [all, setAll] = useState(true),
    [custom, setCustom] = useState("x % 2 == 0");
  let error: unknown;
  let set: number[] = [];
  try {
    const parts = setText.trim() ? setText.split(",") : [];
    if (parts.length > 30) throw Error("Legfeljebb 30 elem.");
    set = [
      ...new Set(
        parts.map((x) => {
          if (!/^-?\d+$/.test(x.trim()) || Math.abs(Number(x)) > 10000)
            throw Error(
              "Vesszővel elválasztott, −10000 és 10000 közötti egészek szükségesek.",
            );
          return Number(x);
        }),
      ),
    ];
  } catch (e) {
    error = e;
  }
  let customFn: (x: number) => boolean = () => false;
  if (predicate === "custom")
    try {
      customFn = finitePredicate(custom);
      (set.length ? set : [0]).forEach(customFn);
    } catch (e) {
      error = e;
    }
  const fn = (x: number) =>
    predicate === "custom"
      ? error
        ? false
        : customFn(x)
      : predicate === "even"
        ? x % 2 === 0
        : predicate === "positive"
          ? x > 0
          : predicate === "square"
            ? Number.isInteger(Math.sqrt(x))
            : x < 3;
  const result = quantify(set, fn, all),
    nested = set.every((a) => set.some((b) => a + b === 0));
  return (
    <Panel
      id="kvantorok"
      title="Minden vagy legalább egy?"
      eyebrow="06 / VÉGES ALAPHALMAZ"
    >
      <div className="form-grid">
        <Field label="Alaphalmaz (üresen is hagyható)">
          <input value={setText} onChange={(e) => setSetText(e.target.value)} />
        </Field>
        <Field label="Predikátum">
          <select
            value={predicate}
            onChange={(e) => setPredicate(e.target.value)}
          >
            <option value="even">x páros</option>
            <option value="positive">x &gt; 0</option>
            <option value="square">x négyzetszám</option>
            <option value="less">x &lt; 3</option>
            <option value="custom">Saját predikátum…</option>
          </select>
        </Field>
        <Field label="Kvantor">
          <select
            value={all ? "all" : "some"}
            onChange={(e) => setAll(e.target.value === "all")}
          >
            <option value="all">∀ — minden</option>
            <option value="some">∃ — létezik</option>
          </select>
        </Field>
      </div>
      {predicate === "custom" && (
        <Field label="Saját predikátum (x változóval)">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} />
        </Field>
      )}
      <ErrorMessage error={error} />
      {!error && (
        <>
          <div className="number-chips">
            {set.map((n) => (
              <span className={fn(n) ? "match" : ""} key={n}>
                {n} {fn(n) ? "✓" : "×"}
              </span>
            ))}
          </div>
          <p className="result-strip">
            {all ? "∀" : "∃"} x ∈ H: P(x){" "}
            <strong>{result.result ? "IGAZ" : "HAMIS"}</strong>
          </p>
          <p>
            Tagadás: {all ? "∃ x ∈ H: ¬P(x)" : "∀ x ∈ H: ¬P(x)"} —{" "}
            <strong>{result.negation ? "igaz" : "hamis"}</strong>.
          </p>
          <h3>Beágyazott kvantorok: ∀a ∃b: a+b=0</h3>
          <p>
            Azonos H alaphalmazon az állítás{" "}
            <strong>{nested ? "igaz" : "hamis"}</strong>.{" "}
            {set.filter((a) => !set.includes(-a)).length
              ? `Ellenpélda a-ra: ${set.filter((a) => !set.includes(-a)).join(", ")}.`
              : "Minden a elemhez van b=−a tanú (üres halmazon az univerzális állítás igaz)."}{" "}
            Tagadása: ∃a ∀b: a+b≠0.
          </p>
          <div className="hint">
            A számítás kizárólag a kiválasztott véges H alaphalmazra vonatkozik.
          </div>
        </>
      )}
    </Panel>
  );
}
const proofs: Record<string, string[]> = {
  "Nincs legnagyobb természetes szám": [
    "Állítás: a természetes számok között nincs legnagyobb.",
    "Tegyük fel az ellenkezőjét: N a legnagyobb természetes szám.",
    "N+1 is természetes szám, és N+1>N.",
    "Ellentmondás: N nem lehetett legnagyobb. Az állítás igaz.",
  ],
  "Teljes indukció": [
    "Állítás: 1+2+…+n=n(n+1)/2 minden n≥1-re.",
    "Kezdőlépés: n=1 esetén 1=1·2/2.",
    "Indukciós feltevés: 1+…+n=n(n+1)/2.",
    "Adjuk hozzá n+1-et: n(n+1)/2+(n+1)=(n+1)(n+2)/2.",
    "Ez az n+1-re vonatkozó képlet; az indukció teljes.",
  ],
  Ellenpélda: [
    "Állítás: (a+b)²=a²+b² minden valós a,b-re.",
    "Válasszuk a=b=2 értékeket.",
    "Bal oldal: (2+2)²=16. Jobb oldal: 2²+2²=8.",
    "16≠8: egyetlen ellenpélda cáfolja az univerzális állítást. A hiányzó tag 2ab.",
  ],
  Skatulyaelv: [
    "Helyezzünk n+1 tárgyat n skatulyába (n≥1).",
    "Tegyük fel, hogy egyik skatulyában sincs egynél több tárgy.",
    "Ekkor a skatulyák összesen legfeljebb n tárgyat tartalmaznak.",
    "Ez ellentmond az n+1 tárgynak: legalább egy skatulyában legalább két tárgy van.",
  ],
};
function Proofs() {
  const [name, setName] = useState(Object.keys(proofs)[0]);
  const state = useStepper(proofs[name].length);
  return (
    <Panel
      id="bizonyitasok"
      title="Kövesd a bizonyítás gondolatmenetét"
      eyebrow="07 / BIZONYÍTÁSI MÓDSZEREK"
    >
      <Field label="Bizonyítás">
        <select
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            state.setStep(0);
            state.setPlaying(false);
          }}
        >
          {Object.keys(proofs).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      <ol className="proof-steps">
        {proofs[name].map((p, i) => (
          <li
            className={
              i === state.step ? "current" : i < state.step ? "done" : "future"
            }
            key={p}
          >
            <span>{i + 1}</span>
            <p>{i <= state.step ? p : "Következő gondolat…"}</p>
          </li>
        ))}
      </ol>
      <StepControls state={state} total={proofs[name].length} />
    </Panel>
  );
}
export default function LogicPage() {
  return (
    <>
      <Lesson topic="logic" />
      <LogicCalculator />
      <Identities />
      <Quantifiers />
      <Proofs />
      <Exercises topic="logic" />
    </>
  );
}
