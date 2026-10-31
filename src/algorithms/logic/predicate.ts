import {
  parse,
  type MathNode,
  type OperatorNode,
  type SymbolNode,
  type ConstantNode,
} from "mathjs";
/** Restricted arithmetic predicates only. No functions, assignments or accessors. */
export function finitePredicate(expression: string): (x: number) => boolean {
  if (!expression.trim() || expression.length > 120)
    throw Error("1–120 karakteres predikátum szükséges.");
  let root: MathNode;
  try {
    root = parse(expression);
  } catch {
    throw Error("Hibás matematikai predikátum. Példa: x % 2 == 0.");
  }
  const nodes: MathNode[] = [];
  root.traverse((node) => {
    nodes.push(node);
    if (nodes.length > 30)
      throw Error("A predikátum legfeljebb 30 részkifejezést tartalmazhat.");
    if (node.type === "SymbolNode") {
      if ((node as SymbolNode).name !== "x")
        throw Error("Csak az x változó engedélyezett.");
    } else if (node.type === "OperatorNode") {
      if (
        !["+", "-", "*", "%", "<", "<=", ">", ">=", "==", "!="].includes(
          (node as OperatorNode).op,
        )
      )
        throw Error("Engedélyezett műveletek: + − * % < ≤ > ≥ == !=.");
    } else if (node.type === "ConstantNode") {
      const v = (node as ConstantNode).value;
      if (
        typeof v !== "number" ||
        !Number.isSafeInteger(v) ||
        Math.abs(v) > 10000
      )
        throw Error(
          "A konstansok legfeljebb 10000 abszolút értékű egészek lehetnek.",
        );
    } else if (node.type !== "ParenthesisNode")
      throw Error(
        "Függvényhívás, értékadás, indexelés és tömb nem engedélyezett.",
      );
  });
  const compiled = nodes.map((n) => n.compile()),
    full = root.compile();
  const modDivisors = nodes
    .filter((n) => n.type === "OperatorNode" && (n as OperatorNode).op === "%")
    .map((n) => (n as OperatorNode).args[1].compile());
  return (x) => {
    if (!Number.isSafeInteger(x) || Math.abs(x) > 10000)
      throw Error(
        "A predikátum x értéke −10000 és 10000 közötti egész legyen.",
      );
    if (modDivisors.some((d) => d.evaluate({ x }) === 0))
      throw Error("Nullával vett maradék nem engedélyezett.");
    for (const c of compiled) {
      const v: unknown = c.evaluate({ x });
      if (
        typeof v !== "boolean" &&
        (typeof v !== "number" || !Number.isSafeInteger(v))
      )
        throw Error(
          "A predikátum köztes eredménye nem biztonságos egész (vagy nullával vett maradék).",
        );
    }
    const value: unknown = full.evaluate({ x });
    if (typeof value !== "boolean")
      throw Error(
        "A predikátum eredménye igaz/hamis legyen; használj összehasonlítást.",
      );
    return value;
  };
}
