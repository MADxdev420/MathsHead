import {
  useEffect,
  useState,
  useId,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import katex from "katex";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Download,
} from "lucide-react";
export function MathText({
  children,
  block = false,
}: {
  children: string;
  block?: boolean;
}) {
  return (
    <span
      className={block ? "formula block-formula" : "formula"}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(children, {
          throwOnError: false,
          displayMode: block,
          strict: "ignore",
        }),
      }}
    />
  );
}
export function Panel({
  title,
  eyebrow,
  children,
  className = "",
  id,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`panel ${className}`}>
      <div className="panel-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ id: string }>, { id })
        : children}
    </div>
  );
}
export function ErrorMessage({ error }: { error: unknown }) {
  return error ? (
    <p role="alert" className="error">
      {error instanceof Error ? error.message : String(error)}
    </p>
  ) : null;
}
export function download(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(
    new Blob([type.startsWith("text/csv") ? "\ufeff" : "", content], { type }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(rows: (string | number)[][]) {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const s = String(value);
          return /[;"\r\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
        })
        .join(";"),
    )
    .join("\r\n");
}
export function ExportButton({
  name,
  content,
}: {
  name: string;
  content: string;
}) {
  return (
    <button
      className="subtle"
      onClick={() => download(name, content, "text/csv;charset=utf-8")}
    >
      <Download size={15} /> CSV-export
    </button>
  );
}
export function useStepper(total: number) {
  const [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(850);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setStep((s) => {
          if (s >= total - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      speed,
    );
    return () => clearInterval(t);
  }, [playing, speed, total]);
  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [total]);
  return {
    step: Math.min(step, Math.max(0, total - 1)),
    setStep,
    playing,
    setPlaying,
    speed,
    setSpeed,
  };
}
export type StepperState = ReturnType<typeof useStepper>;
export function StepControls({
  state,
  total,
}: {
  state: StepperState;
  total: number;
}) {
  return (
    <div className="step-controls">
      <button
        title="Előző lépés"
        aria-label="Előző lépés"
        disabled={state.step <= 0}
        onClick={() => state.setStep((s) => s - 1)}
      >
        <ChevronLeft size={17} />
      </button>
      <button onClick={() => state.setPlaying((p) => !p)} disabled={total < 2}>
        {state.playing ? <Pause size={16} /> : <Play size={16} />}{" "}
        {state.playing ? "Szünet" : "Lejátszás"}
      </button>
      <button
        title="Következő lépés"
        aria-label="Következő lépés"
        disabled={state.step >= total - 1}
        onClick={() => state.setStep((s) => s + 1)}
      >
        <ChevronRight size={17} />
      </button>
      <button
        title="Újrakezdés"
        aria-label="Újrakezdés"
        onClick={() => {
          state.setStep(0);
          state.setPlaying(false);
        }}
      >
        <RotateCcw size={16} />
      </button>
      <span className="muted">
        {total ? state.step + 1 : 0} / {total}
      </span>
      <label className="speed">
        Lépésidő{" "}
        <input
          aria-label="Lépésidő"
          type="range"
          min="150"
          max="1800"
          step="50"
          value={state.speed}
          onChange={(e) => state.setSpeed(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
export function Matrix({
  rows,
  cols,
  values,
  onCell,
  selectedRow = -1,
  selectedColumn = -1,
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  onCell?: (row: number, col: number) => void;
  selectedRow?: number;
  selectedColumn?: number;
}) {
  return (
    <div className="table-scroll">
      <table className="matrix">
        <thead>
          <tr>
            <th scope="col">↘</th>
            {cols.map((c, i) => (
              <th scope="col" key={i}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r}>
              <th scope="row">{r}</th>
              {cols.map((_, j) => (
                <td
                  key={j}
                  className={
                    i === selectedRow || j === selectedColumn
                      ? "matrix-selected"
                      : ""
                  }
                >
                  {onCell ? (
                    <button
                      className={values[i][j] ? "nonzero" : ""}
                      aria-label={`${r}, ${cols[j]}: ${values[i][j]}`}
                      onClick={() => onCell(i, j)}
                    >
                      {values[i][j]}
                    </button>
                  ) : (
                    values[i][j]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className={`toggle ${value ? "on" : ""}`}
      onClick={() => onChange(!value)}
    >
      <span className="switch-track">
        <i />
      </span>
      {label} <strong>{value ? "igaz" : "hamis"}</strong>
    </button>
  );
}
