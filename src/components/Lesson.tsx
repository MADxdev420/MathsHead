import { lessons, type Topic } from "../data/lessons";
import { Panel, MathText } from "./common";
import { Illustrations } from "./Illustrations";
export function Lesson({ topic }: { topic: Topic }) {
  const l = lessons[topic];
  return (
    <>
      <Panel
        id="fogalmak"
        title="Fogalmak, érthetően"
        eyebrow="01 / ELMÉLETI ALAPOK"
      >
        <div className="definitions">
          {l.definitions.map(([name, text]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Panel>
      <Panel
        id="tetelek"
        title="Ami mindig igaz"
        eyebrow="02 / TÉTELEK ÉS INDOKLÁSOK"
      >
        <div className="theorems">
          {l.theorems.map(([name, formula, proof]) => (
            <article key={name}>
              <h3>{name}</h3>
              <MathText block>{formula}</MathText>
              <p>{proof}</p>
            </article>
          ))}
        </div>
      </Panel>
      <Panel
        id="peldak"
        title="Egy példa, lépésről lépésre"
        eyebrow="03 / A JEGYZET NYOMÁN"
      >
        <p>{l.example}</p>
      </Panel>
      <Illustrations topic={topic} />
    </>
  );
}
