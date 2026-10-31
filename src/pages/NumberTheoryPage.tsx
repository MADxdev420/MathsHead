import { useMemo, useState } from "react";
import { multiply } from "mathjs";
import {
  boundedInteger,
  isPrime,
  factorize,
  factorText,
  sieve,
  divisors,
  euclid,
  gcd,
  lcm,
  rsa,
  goldbach,
} from "../algorithms/numberTheory";
import { GraphBoard } from "../components/GraphBoard";
import type { Graph } from "../algorithms/graph";
import { buildFactorTree } from "../algorithms/numberTheory/factorTree";
import {
  Panel,
  Field,
  MathText,
  ErrorMessage,
  useStepper,
  StepControls,
} from "../components/common";
import { Lesson } from "../components/Lesson";
import { Exercises } from "../components/Exercises";
function PrimeCalculator() {
  const [raw, setRaw] = useState("9438"),
    [low, setLow] = useState("2"),
    [high, setHigh] = useState("120"),
    [divisor, setDivisor] = useState("11");
  let content, error: unknown;
  try {
    const n = boundedInteger(raw, 1, 1e9),
      d = boundedInteger(divisor, 1, 1e9),
      a = boundedInteger(low, 0, 100000),
      b = boundedInteger(high, 2, 100000);
    if (a > b) throw Error("Az alsó határ nem lehet nagyobb a felsőnél.");
    const ps = sieve(b).primes;
    content = (
      <>
        <div className="stat-grid">
          <div className="stat">
            <span>{n} prím?</span>
            <strong>{isPrime(n) ? "Igen" : "Nem"}</strong>
          </div>
          <div className="stat">
            <span>
              {d} osztja {n}-t?
            </span>
            <strong>{n % d === 0 ? "Igen" : "Nem"}</strong>
          </div>
          <div className="stat">
            <span>π({b})</span>
            <strong>{ps.length}</strong>
          </div>
          <div className="stat">
            <span>
              Prímek [{a}, {b}]-ben
            </span>
            <strong>{ps.filter((p) => p >= a).length}</strong>
          </div>
        </div>
        <details>
          <summary>Pozitív osztók és prímlista</summary>
          <p>Osztók: {divisors(n).join(", ")}</p>
          <p className="prime-list">
            Prímek: {ps.filter((p) => p >= a).join(", ") || "nincs"}
          </p>
        </details>
      </>
    );
  } catch (e) {
    error = e;
  }
  return (
    <Panel
      id="primek"
      title="Ismerd meg a számod"
      eyebrow="04 / PRÍM- ÉS OSZTHATÓSÁGI KALKULÁTOR"
    >
      <div className="form-grid">
        <Field label="Vizsgált szám (1–10⁹)">
          <input value={raw} onChange={(e) => setRaw(e.target.value)} />
        </Field>
        <Field label="Vizsgált osztó">
          <input value={divisor} onChange={(e) => setDivisor(e.target.value)} />
        </Field>
        <Field label="Intervallum eleje">
          <input value={low} onChange={(e) => setLow(e.target.value)} />
        </Field>
        <Field label="Intervallum vége (≤100000)">
          <input value={high} onChange={(e) => setHigh(e.target.value)} />
        </Field>
      </div>
      <ErrorMessage error={error} />
      {content}
    </Panel>
  );
}
function Sieve() {
  const [raw, setRaw] = useState("120");
  let error: unknown,
    n = 120;
  try {
    n = boundedInteger(raw, 2, 400);
  } catch (e) {
    error = e;
  }
  const result = useMemo(() => sieve(n), [n]),
    state = useStepper(result.stages.length + 2),
    removed = new Set(
      result.stages.slice(0, state.step).flatMap((s) => s.removed),
    ),
    complete = state.step === result.stages.length + 1;
  return (
    <Panel
      id="szita"
      title="Szűrd ki a prímeket"
      eyebrow="05 / ERATOSZTHENÉSZ SZITÁJA"
    >
      <Field label="Felső határ (2–400)">
        <input
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            state.setStep(0);
            state.setPlaying(false);
          }}
        />
      </Field>
      <ErrorMessage error={error} />
      {!error && (
        <>
          <StepControls state={state} total={result.stages.length + 2} />
          <p aria-live="polite" className="feedback">
            {state.step === 0
              ? "Kezdet: 1 nem prím. A 2 az első prím."
              : complete
                ? `Kész: ${result.primes.length} prím maradt. √${n} felett nincs további szitálásra szükség.`
                : `A ${result.stages[state.step - 1]?.prime} prím többszöröseit töröltük p²-től kezdve.`}
          </p>
          <div className="sieve-grid">
            {Array.from({ length: n }, (_, i) => i + 1).map((x) => (
              <span
                title={
                  x === 1
                    ? "Az 1 nem prím"
                    : removed.has(x)
                      ? "Összetett szám"
                      : complete
                        ? "Prím"
                        : "Még nem törölt"
                }
                className={
                  x === 1
                    ? "excluded"
                    : removed.has(x)
                      ? "removed"
                      : complete
                        ? "prime"
                        : result.stages[state.step - 1]?.prime === x
                          ? "current"
                          : ""
                }
                key={x}
              >
                {x}
              </span>
            ))}
          </div>
          <p className="hint">
            Áthúzott: összetett · zöld: a végén megmaradt prím · arany: aktuális
            szitáló prím.
          </p>
        </>
      )}
    </Panel>
  );
}
function Factorization() {
  const [raw, setRaw] = useState("9438"),
    [view, setView] = useState("table"),
    [selected, setSelected] = useState("");
  let error: unknown,
    n = 1;
  try {
    n = boundedInteger(raw, 1, 1e12);
  } catch (e) {
    error = e;
  }
  const result = factorize(n);
  const graph = buildFactorTree(n);
  return (
    <Panel
      id="felbontas"
      title="Minden szám mögött prímek állnak"
      eyebrow="06 / PRÍMTÉNYEZŐS FELBONTÁS"
    >
      <Field label="Pozitív egész (legfeljebb 10¹²)">
        <input
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setSelected("");
          }}
        />
      </Field>
      <ErrorMessage error={error} />
      {!error && (
        <>
          <MathText
            block
          >{`${n} = ${result.factors.map((f) => `${f.prime}^{${f.power}}`).join("\\cdot") || "1"}`}</MathText>
          <div className="toolbar">
            <button
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              Osztási táblázat
            </button>
            <button
              aria-pressed={view === "tree"}
              onClick={() => setView("tree")}
            >
              Interaktív tényezőfa
            </button>
          </div>
          {view === "table" ? (
            <div className="factor-table">
              <table>
                <thead>
                  <tr>
                    <th>Osztandó</th>
                    <th>Prím</th>
                    <th>Hányados</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((s, i) => (
                    <tr key={i}>
                      <td>{s.n}</td>
                      <td>{s.prime}</td>
                      <td>{s.quotient}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {n === 1 && (
                <p>Az 1 felbontása az üres szorzat; nincs prímtényezője.</p>
              )}
            </div>
          ) : (
            <>
              <GraphBoard
                graph={graph}
                height={Math.max(400, (result.steps.length + 3) * 38)}
                boundingbox={[-6, 2, 6, -Math.max(3, result.steps.length + 1)]}
                current={selected}
                onVertex={setSelected}
              />
              <label className="field">
                <span>Tényezőfa csomópontja</span>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Válassz…</option>
                  {graph.vertices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              {selected && (
                <p className="feedback">
                  {graph.vertices.find((v) => v.id === selected)?.label}:{" "}
                  {isPrime(
                    Number(
                      graph.vertices.find((v) => v.id === selected)?.label,
                    ),
                  )
                    ? "prím, tovább nem bontható."
                    : "összetett; gyermekei szorzata az eredeti szám."}
                </p>
              )}
            </>
          )}
        </>
      )}
    </Panel>
  );
}
function GcdLcm() {
  const [raw, setRaw] = useState("5780, 238");
  let error: unknown;
  let nums: bigint[] = [5780n, 238n];
  try {
    const parts = raw.split(",");
    if (parts.length < 2 || parts.length > 8)
      throw Error("2–8 vesszővel elválasztott egész szükséges.");
    nums = parts.map((x) => {
      if (!/^-?\d{1,30}$/.test(x.trim()))
        throw Error("Legfeljebb 30 számjegyű egészek szükségesek.");
      return BigInt(x.trim());
    });
  } catch (e) {
    error = e;
  }
  const result = nums.reduce(gcd),
    multiple = nums.reduce(lcm),
    pairs = nums
      .slice(1)
      .map((b, i) => euclid(nums.slice(0, i + 1).reduce(gcd), b));
  const steps = pairs.flatMap((p, i) =>
    p.steps.map(
      (s) => `Összevonás ${i + 1}: ${s.a} = ${s.q} · ${s.b} + ${s.r}`,
    ),
  );
  const state = useStepper(Math.max(1, steps.length));
  const canFactor = nums.every((n) => n > 0n && n <= 1000000000000n),
    facts = canFactor ? nums.map((n) => factorize(Number(n)).factors) : [];
  const primes = [
    ...new Set(facts.flatMap((fs) => fs.map((f) => f.prime))),
  ].sort((a, b) => a - b);
  return (
    <Panel
      id="lnko-lkkt"
      title="Közös osztó, közös többszörös"
      eyebrow="07 / LNKO–LKKT MŰHELY"
    >
      <Field label="Egész számok, vesszővel elválasztva">
        <input
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            state.setStep(0);
            state.setPlaying(false);
          }}
        />
      </Field>
      <ErrorMessage error={error} />
      {!error && (
        <>
          <div className="two-col">
            <div className="big-result">
              <span>Legnagyobb közös osztó</span>
              <strong>{String(result)}</strong>
              <small>LNKO · közös minimumkitevők</small>
            </div>
            <div className="big-result amber">
              <span>Legkisebb közös többszörös</span>
              <strong>{String(multiple)}</strong>
              <small>LKKT · összes maximumkitevő</small>
            </div>
          </div>
          {canFactor ? (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Szám</th>
                      {primes.map((p, i) => (
                        <th className={"prime-color-" + (i % 4)} key={p}>
                          {p} kitevője
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nums.map((n, i) => (
                      <tr key={i}>
                        <th>{String(n)}</th>
                        {primes.map((p, j) => (
                          <td className={"prime-color-" + (j % 4)} key={p}>
                            {facts[i].find((f) => f.prime === p)?.power ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th>Minimum → LNKO</th>
                      {primes.map((p) => (
                        <td key={p}>
                          {Math.min(
                            ...facts.map(
                              (f) => f.find((x) => x.prime === p)?.power ?? 0,
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th>Maximum → LKKT</th>
                      {primes.map((p) => (
                        <td key={p}>
                          {Math.max(
                            ...facts.map(
                              (f) => f.find((x) => x.prime === p)?.power ?? 0,
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                {nums.map((n) => `${n} = ${factorText(Number(n))}`).join(" ; ")}
              </p>
            </>
          ) : (
            <p className="hint">
              Prímtényezős levezetés pozitív, legfeljebb 10¹²-es számokhoz
              látható; a BigInt euklideszi számítás a nagyobb és negatív
              számokra is pontos.
            </p>
          )}
          <h3>Az euklideszi algoritmus lépései</h3>
          <StepControls state={state} total={Math.max(1, steps.length)} />
          <ol className="calculation-steps">
            {steps.slice(0, state.step + 1).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {!steps.length && (
            <p>
              Minden második argumentum nulla; az abszolút első érték adja az
              LNKO-t.
            </p>
          )}
          {nums.length === 2 && (
            <>
              <p className="result-strip">
                LNKO · LKKT = {String(result * multiple)} = |a · b| ✓
              </p>
              {nums.every((n) => n > 0n && n <= 100n) && (
                <div className="multiples">
                  {nums.map((n, i) => (
                    <p key={i}>
                      <strong>{String(n)} többszörösei:</strong>{" "}
                      {Array.from({ length: 10 }, (_, j) => (
                        <span
                          className={
                            (BigInt(j + 1) * n) % nums[1 - i] === 0n
                              ? "common-multiple"
                              : ""
                          }
                          key={j}
                        >
                          {String(n * BigInt(j + 1))}{" "}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
          {result > 0n && result <= 1000000000n && (
            <details>
              <summary>Közös pozitív osztók</summary>
              <p>{divisors(Number(result)).join(", ")}</p>
            </details>
          )}
        </>
      )}
    </Panel>
  );
}
function Divisibility() {
  const [raw, setRaw] = useState("60"),
    [selected, setSelected] = useState("");
  let error: unknown,
    n = 60;
  try {
    n = boundedInteger(raw, 1, 10000);
  } catch (e) {
    error = e;
  }
  const ds = divisors(n),
    rank = (x: number) => factorize(x).factors.reduce((s, f) => s + f.power, 0),
    maxRank = rank(n);
  const levels = ds.reduce<Record<number, number[]>>((acc, d) => {
    (acc[rank(d)] ??= []).push(d);
    return acc;
  }, {});
  const graph: Graph = {
    vertices: ds.map((d) => {
      const level = levels[rank(d)]!;
      return {
        id: String(d),
        label: String(d),
        x: (level.indexOf(d) - (level.length - 1) / 2) * 1.6,
        y: -4 + (8 * rank(d)) / Math.max(1, maxRank),
      };
    }),
    edges: ds.flatMap((a) =>
      ds
        .filter(
          (b) =>
            b > a &&
            b % a === 0 &&
            !ds.some((c) => c > a && c < b && c % a === 0 && b % c === 0),
        )
        .map((b) => ({
          id: a + "-" + b,
          from: String(a),
          to: String(b),
          weight: 1,
        })),
    ),
    directed: true,
    weighted: false,
  };
  return (
    <Panel
      id="osztohalo"
      title="Az oszthatóság hálózata"
      eyebrow="08 / OSZTÓK ÉS KAPCSOLATOK"
    >
      <Field label="Választott szám (1–10000)">
        <input
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setSelected("");
          }}
        />
      </Field>
      <ErrorMessage error={error} />
      {!error && (
        <>
          <p>
            Osztók: {ds.join(", ")}. Prímtényezők: {factorText(n)}.
          </p>
          <p>
            Osztópárok:{" "}
            {ds
              .filter((d) => d * d <= n)
              .map((d) => `(${d}, ${n / d})`)
              .join(", ")}
            .
          </p>
          <p>
            Első többszörösök:{" "}
            {Array.from({ length: 8 }, (_, i) => multiply(n, i + 1)).join(", ")}
            .
          </p>
          <GraphBoard graph={graph} current={selected} onVertex={setSelected} />
          <p className="hint">
            Hasse-diagram: a nyilak a kisebb osztótól a nagyobbig mutatnak; a
            köztes osztóval következő kapcsolatokat elhagyjuk. A rajzon csak
            közvetlen fedési kapcsolatok láthatók.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>a | b</th>
                  {ds.map((d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ds.map((a) => (
                  <tr key={a}>
                    <th>{a}</th>
                    {ds.map((b) => (
                      <td key={b}>
                        <button
                          className="cell"
                          onClick={() => setSelected(String(a))}
                        >
                          {b % a === 0 ? "✓" : "·"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && <p>Kijelölt osztó: {selected}.</p>}
        </>
      )}
    </Panel>
  );
}
function Distribution() {
  const [raw, setRaw] = useState("120"),
    [even, setEven] = useState("50"),
    [selected, setSelected] = useState(0);
  let error: unknown,
    n = 120,
    pairs: number[][] = [];
  try {
    n = boundedInteger(raw, 10, 2000);
    pairs = goldbach(boundedInteger(even, 4, 100000));
  } catch (e) {
    error = e;
  }
  const ps = sieve(n).primes,
    gaps = ps.slice(1).map((p, i) => ({ p: ps[i], q: p, gap: p - ps[i] })),
    twins = gaps.filter((g) => g.gap === 2);
  return (
    <Panel
      id="eloszlas"
      title="Rend a szabálytalanságban"
      eyebrow="09 / A PRÍMEK ELOSZLÁSA"
    >
      <div className="form-grid">
        <Field label="Vizsgált felső határ (10–2000)">
          <input
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setSelected(0);
            }}
          />
        </Field>
        <Field label="Goldbach: páros szám">
          <input value={even} onChange={(e) => setEven(e.target.value)} />
        </Field>
      </div>
      <ErrorMessage error={error} />
      {!error && (
        <>
          <h3>Prímszámláló függvény · π(x)</h3>
          <svg
            className="distribution-chart"
            viewBox="0 0 800 220"
            role="img"
            aria-label="Prímek darabszáma x függvényében"
          >
            <path d="M45 15V185H780" stroke="#9bada1" fill="none" />
            <path
              d={
                "M45 185 " +
                ps
                  .map(
                    (p, i) =>
                      `H${45 + (730 * p) / n}V${185 - (160 * (i + 1)) / ps.length}`,
                  )
                  .join(" ") +
                "H775"
              }
              stroke="#14876b"
              strokeWidth="3"
              fill="none"
            />
            <text x="45" y="210" fill="currentColor">
              0
            </text>
            <text x="740" y="210" fill="currentColor">
              {n}
            </text>
            <text x="5" y="30" fill="currentColor">
              {ps.length}
            </text>
          </svg>
          <h3>Prímszakadékok · kattints egy oszlopra</h3>
          <div className="gap-chart">
            {gaps.map((g, i) => (
              <button
                key={g.p}
                aria-label={`${g.p} és ${g.q}, különbség ${g.gap}`}
                title={`${g.p} → ${g.q}: ${g.gap}`}
                className={selected === i ? "active" : ""}
                onClick={() => setSelected(i)}
                style={{
                  height:
                    Math.max(
                      8,
                      (g.gap / Math.max(...gaps.map((g) => g.gap))) * 100,
                    ) + "%",
                }}
              />
            ))}
          </div>
          <p>
            Kijelölt: {gaps[selected]?.p} → {gaps[selected]?.q}; prímszakadék{" "}
            {gaps[selected]?.gap}.
          </p>
          <p>Ikerprímek: {twins.map((g) => `(${g.p}, ${g.q})`).join(", ")}.</p>
          <h3>Kis Mersenne-prímek</h3>
          <div className="number-chips">
            {[2, 3, 5, 7, 13].map((p) => (
              <span className="match" key={p}>
                2^{p} − 1 = {2 ** p - 1}
              </span>
            ))}
          </div>
          <h3>Goldbach-felbontások</h3>
          <p>
            {pairs.map(([a, b]) => `${a} + ${b}`).join(" = ")} = {even}
          </p>
          <p className="feedback">
            Ez egyetlen kiválasztott páros szám véges ellenőrzése. A
            Goldbach-sejtésnek nem ismert általános bizonyítása; a végtelen sok
            ikerprím és Mersenne-prím kérdése is nyitott.
          </p>
          <p className="hint">
            A jegyzet prímrekordja elavult. A GIMPS 2026. október 31-én
            ellenőrzött listáján 2¹³⁶²⁷⁹⁸⁴¹−1 a legnagyobb ismert prím (41 024
            320 számjegy; 2024-es felfedezés).{" "}
            <a
              href="https://www.mersenne.org/primes/"
              target="_blank"
              rel="noreferrer"
            >
              GIMPS elsődleges forrás ↗
            </a>
          </p>
        </>
      )}
    </Panel>
  );
}
function RSA() {
  const [p, setP] = useState("3"),
    [q, setQ] = useState("11"),
    [e, setE] = useState("3"),
    [m, setM] = useState("7");
  let error: unknown, result: ReturnType<typeof rsa> | undefined;
  try {
    const a = boundedInteger(p, 2, 97),
      b = boundedInteger(q, 2, 97);
    const exponent = BigInt(boundedInteger(e, 2, 10000)),
      message = BigInt(boundedInteger(m, 0, 10000));
    result = rsa(a, b, exponent, message);
  } catch (err) {
    error = err;
  }
  const steps = result
    ? [
        ...result.ext.steps,
        `Inverz: d=${result.d}; e·d ≡ 1 (mod φ).`,
        ...result.encrypted.steps.map((s) => "Titkosítás: " + s),
        ...result.decrypted.steps.map((s) => "Visszafejtés: " + s),
      ]
    : ["Adj meg érvényes paramétereket."];
  const state = useStepper(steps.length);
  return (
    <Panel
      id="rsa"
      title="A titkosítás mögötti matematika"
      eyebrow="10 / RSA-DEMONSTRÁCIÓ"
    >
      <p className="feedback">
        Oktatási demonstráció kis prímekkel. Nem biztonságos éles kriptográfiai
        implementáció: nincs padding, véletlen kulcsgenerálás vagy oldalsávos
        védelem.
      </p>
      <div className="form-grid">
        {[
          [p, setP, "p prím"],
          [q, setQ, "q prím (p-től különböző)"],
          [e, setE, "Nyilvános kitevő e"],
          [m, setM, "Üzenet m"],
        ].map(([value, set, label]) => (
          <Field key={String(label)} label={String(label)}>
            <input
              value={value as string}
              onChange={(ev) => {
                (set as (v: string) => void)(ev.target.value);
                state.setStep(0);
                state.setPlaying(false);
              }}
            />
          </Field>
        ))}
      </div>
      <ErrorMessage error={error} />
      {result && (
        <>
          <div className="stat-grid">
            {[
              ["n = pq", result.n],
              ["φ(n)", result.phi],
              ["Privát kitevő d", result.d],
              ["Titkosított c", result.encrypted.result],
              ["Visszafejtett m", result.decrypted.result],
            ].map(([l, v]) => (
              <div className="stat" key={String(l)}>
                <span>{String(l)}</span>
                <strong>{String(v)}</strong>
              </div>
            ))}
          </div>
          <MathText
            block
          >{`c=m^e\\bmod n=${result.encrypted.result},\\quad m=c^d\\bmod n=${result.decrypted.result}`}</MathText>
          <div className="rsa-flow">
            <span>Üzenet {m}</span>
            <b>→ (n,e)</b>
            <span>Rejtjel {String(result.encrypted.result)}</span>
            <b>→ (n,d)</b>
            <span>Üzenet {String(result.decrypted.result)}</span>
          </div>
          <h3>Kiterjesztett Euklidész és gyors moduláris hatványozás</h3>
          <p>
            A kiterjesztett algoritmus e·x + φ·y = 1 együtthatóit keresi. Itt x=
            {String(result.ext.x)}, y={String(result.ext.y)}; d az x nemnegatív
            maradéka. A hatványozás bináris felbontással, négyzetre emeléssel és
            szükség szerinti szorzással történik.
          </p>
          <StepControls state={state} total={steps.length} />
          <ol className="calculation-steps">
            {steps.slice(0, state.step + 1).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </>
      )}
    </Panel>
  );
}
export default function NumberTheoryPage() {
  return (
    <>
      <Lesson topic="number" />
      <PrimeCalculator />
      <Sieve />
      <Factorization />
      <GcdLcm />
      <Divisibility />
      <Distribution />
      <RSA />
      <Exercises topic="number" />
    </>
  );
}
