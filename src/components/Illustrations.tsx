import { Panel } from "./common";
import type { Topic } from "../data/lessons";
const assets = import.meta.glob("../assets/illustrations/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const images: Record<Topic, [string, string][]> = {
  logic: [
    ["logic-gates", "Logikai kapuk: ÉS, VAGY és NEM"],
    ["venn", "Venn-diagram"],
    ["proof-flow", "Indirekt bizonyítás folyamata"],
  ],
  graph: [
    ["graph-types", "Gráftípusok"],
    ["complete-graph", "Az ötcsúcsú teljes gráf"],
    ["trees-forests", "Fa és erdő"],
    ["bridges", "A königsbergi hidak modellje"],
  ],
  number: [
    ["factor-tree", "A 60 prímtényezőfája"],
    ["sieve", "Eratoszthenész szitája"],
    ["euclid", "Az euklideszi algoritmus"],
    ["rsa-flow", "Az RSA működése"],
  ],
};
export function Illustrations({ topic }: { topic: Topic }) {
  return (
    <Panel title="Gondolkodj képekben" eyebrow="SAJÁT, ELLENŐRZÖTT ÁBRÁK">
      <div className="illustration-grid">
        {images[topic].map(([file, title]) => (
          <figure key={file}>
            <img
              src={assets[`../assets/illustrations/${file}.svg`]}
              alt={title}
              loading="lazy"
            />
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}
