export type Op = "AND" | "OR" | "XOR" | "IMPLIES" | "IFF";
export type AST =
  | { kind: "var"; name: string }
  | { kind: "not"; child: AST }
  | { kind: "binary"; op: Op; left: AST; right: AST };
const symbols: Record<string, string> = {
  "¬": "NOT",
  "∧": "AND",
  "∨": "OR",
  "⊕": "XOR",
  "→": "IMPLIES",
  "↔": "IFF",
};
export function parseLogic(input: string): AST {
  if (input.length > 500) throw Error("Legfeljebb 500 karakter adható meg.");
  const tokens: string[] = [];
  let pos = 0;
  while (pos < input.length) {
    if (/\s/.test(input[pos])) {
      pos++;
      continue;
    }
    const m =
      /^(NOT\b|AND\b|OR\b|XOR\b|IMPLIES\b|IFF\b|[A-Za-z][A-Za-z0-9_]*|[()¬∧∨⊕→↔])/i.exec(
        input.slice(pos),
      );
    if (!m) throw Error(`Ismeretlen jel a(z) ${pos + 1}. helyen.`);
    tokens.push(symbols[m[0]] ?? m[0].toUpperCase());
    pos += m[0].length;
  }
  let i = 0;
  const prec: Record<string, number> = {
    IFF: 1,
    IMPLIES: 2,
    OR: 3,
    XOR: 4,
    AND: 5,
  };
  function expr(min = 1, depth = 0): AST {
    if (depth > 60) throw Error("Túl mély zárójelezés.");
    let left: AST;
    const t = tokens[i++];
    if (t === "NOT") left = { kind: "not", child: expr(6, depth + 1) };
    else if (t === "(") {
      left = expr(1, depth + 1);
      if (tokens[i++] !== ")") throw Error("Hiányzó záró zárójel.");
    } else if (t && /^[A-Z][A-Z0-9_]*$/.test(t) && !(t in prec))
      left = { kind: "var", name: t };
    else throw Error("Változó vagy nyitó zárójel szükséges.");
    while (prec[tokens[i]] >= min) {
      const op = tokens[i++] as Op;
      left = {
        kind: "binary",
        op,
        left,
        right: expr(prec[op] + (op === "IMPLIES" ? 0 : 1), depth + 1),
      };
    }
    return left;
  }
  const ast = expr();
  if (i !== tokens.length) throw Error("Váratlan token vagy hiányzó operátor.");
  if (variables(ast).length > 8)
    throw Error("Legfeljebb 8 változó használható.");
  return ast;
}
export function variables(a: AST): string[] {
  return [
    ...new Set(
      a.kind === "var"
        ? [a.name]
        : a.kind === "not"
          ? variables(a.child)
          : [...variables(a.left), ...variables(a.right)],
    ),
  ].sort();
}
export function evaluate(a: AST, v: Record<string, boolean>): boolean {
  if (a.kind === "var") {
    if (!(a.name in v)) throw Error("Hiányzó változóérték: " + a.name);
    return v[a.name];
  }
  if (a.kind === "not") return !evaluate(a.child, v);
  const l = evaluate(a.left, v),
    r = evaluate(a.right, v);
  switch (a.op) {
    case "AND":
      return l && r;
    case "OR":
      return l || r;
    case "XOR":
      return l !== r;
    case "IMPLIES":
      return !l || r;
    case "IFF":
      return l === r;
  }
}
export function format(a: AST, tex = false): string {
  if (a.kind === "var")
    return tex ? `\\mathrm{${a.name.replaceAll("_", "\\_")}}` : a.name;
  if (a.kind === "not")
    return `${tex ? "\\neg" : "¬"}(${format(a.child, tex)})`;
  const ops = {
    AND: tex ? "\\land" : "∧",
    OR: tex ? "\\lor" : "∨",
    XOR: tex ? "\\oplus" : "⊕",
    IMPLIES: tex ? "\\to" : "→",
    IFF: tex ? "\\leftrightarrow" : "↔",
  };
  return `(${format(a.left, tex)} ${ops[a.op]} ${format(a.right, tex)})`;
}
export function subexpressions(a: AST): AST[] {
  const all =
    a.kind === "var"
      ? []
      : a.kind === "not"
        ? [...subexpressions(a.child), a]
        : [...subexpressions(a.left), ...subexpressions(a.right), a];
  return [...new Map(all.map((n) => [format(n), n])).values()];
}
export function assignments(vars: string[]) {
  if (vars.length > 8) throw Error("Legfeljebb 8 változó.");
  return Array.from({ length: 2 ** vars.length }, (_, i) =>
    Object.fromEntries(
      vars.map((v, j) => [v, Boolean(i & (1 << (vars.length - j - 1)))]),
    ),
  );
}
export function truthTable(a: AST) {
  return assignments(variables(a)).map((values) => ({
    values,
    result: evaluate(a, values),
  }));
}
export function equivalent(a: AST, b: AST) {
  const vars = [...new Set([...variables(a), ...variables(b)])].sort();
  const counterexample = assignments(vars).find(
    (v) => evaluate(a, v) !== evaluate(b, v),
  );
  return { equivalent: !counterexample, counterexample };
}
export function quantify(
  set: number[],
  predicate: (x: number) => boolean,
  all: boolean,
) {
  const matches = set.filter(predicate);
  return {
    result: all ? matches.length === set.length : matches.length > 0,
    matches,
    negation: all
      ? set.some((x) => !predicate(x))
      : set.every((x) => !predicate(x)),
  };
}
