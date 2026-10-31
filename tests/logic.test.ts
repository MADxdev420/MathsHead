import { describe, it, expect } from "vitest";
import {
  parseLogic as p,
  evaluate as ev,
  truthTable,
  equivalent,
  variables,
  subexpressions,
  quantify,
  assignments,
} from "../src/algorithms/logic";
import { finitePredicate } from "../src/algorithms/logic/predicate";
describe("Véges, korlátozott math.js predikátum", () => {
  it("aritmetika és összehasonlítás", () => {
    const f = finitePredicate("x % 2 == 0");
    expect(f(2)).toBe(true);
    expect(f(3)).toBe(false);
    expect(finitePredicate("x*x >= 4")(-2)).toBe(true);
  });
  it.each([
    'import("fs")',
    "x=2",
    "x.constructor",
    "[1,2]",
    "sqrt(x)>1",
    "y>0",
    "x^100>0",
  ])("veszélyes vagy nem engedett szintaxis: %s", (s) =>
    expect(() => finitePredicate(s)).toThrow(),
  );
  it("nem logikai eredményt, nullával maradékot és túlcsordulást elutasít", () => {
    expect(() => finitePredicate("x+1")(2)).toThrow();
    expect(() => finitePredicate("x % 0 == 1")(2)).toThrow();
    expect(() => finitePredicate("x*x*x*x*x > 0")(10000)).toThrow();
  });
});
describe("Biztonságos logikai parser és igazságértékek", () => {
  it.each([
    [false, false, true],
    [false, true, true],
    [true, false, false],
    [true, true, true],
  ])("implikáció %s → %s = %s", (a, b, r) =>
    expect(ev(p("A IMPLIES B"), { A: a, B: b })).toBe(r),
  );
  it.each([
    [false, false, true],
    [false, true, false],
    [true, false, false],
    [true, true, true],
  ])("ekvivalencia %s ↔ %s = %s", (a, b, r) =>
    expect(ev(p("A ↔ B"), { A: a, B: b })).toBe(r),
  );
  it.each([
    ["NOT (A AND B)", "NOT A OR NOT B"],
    ["NOT (A OR B)", "NOT A AND NOT B"],
    ["A IMPLIES B", "NOT B IMPLIES NOT A"],
    ["A IMPLIES B", "NOT A OR B"],
    ["A XOR B", "(A OR B) AND NOT(A AND B)"],
  ])("azonosság %s = %s", (a, b) =>
    expect(equivalent(p(a), p(b)).equivalent).toBe(true),
  );
  it("ellenpéldát ad a megfordításhoz", () => {
    const r = equivalent(p("A IMPLIES B"), p("B IMPLIES A"));
    expect(r.equivalent).toBe(false);
    expect(ev(p("A IMPLIES B"), r.counterexample!)).not.toBe(
      ev(p("B IMPLIES A"), r.counterexample!),
    );
  });
  it("precedencia és jobbra kötő implikáció", () => {
    expect(equivalent(p("A OR B AND C"), p("A OR (B AND C)")).equivalent).toBe(
      true,
    );
    expect(
      equivalent(p("A IMPLIES B IMPLIES C"), p("A IMPLIES (B IMPLIES C)"))
        .equivalent,
    ).toBe(true);
  });
  it("változók és részkifejezések", () => {
    const a = p("(A AND B) OR NOT C");
    expect(variables(a)).toEqual(["A", "B", "C"]);
    expect(subexpressions(a)).toHaveLength(3);
    expect(truthTable(a)).toHaveLength(8);
  });
  it("nyolc változó 256 sor", () =>
    expect(truthTable(p("A OR B OR C OR D OR E OR F OR G OR H"))).toHaveLength(
      256,
    ));
  it.each([
    "",
    "A && B",
    "A B",
    "(A AND B",
    "A AND",
    "A);alert(1)",
    "A OR B OR C OR D OR E OR F OR G OR H OR I",
  ])("hibás kifejezést elutasít: %s", (s) => expect(() => p(s)).toThrow());
  it("egyesített változókorlát és mélységkorlát", () => {
    expect(() =>
      assignments(Array.from({ length: 9 }, (_, i) => "" + i)),
    ).toThrow();
    expect(() => p("(".repeat(70) + "A" + ")".repeat(70))).toThrow();
  });
  it("véges kvantorok és tagadásaik", () => {
    expect(quantify([-2, 0, 2], (x) => x % 2 === 0, true)).toEqual({
      result: true,
      matches: [-2, 0, 2],
      negation: false,
    });
    expect(quantify([-1, 0, 1], (x) => x > 0, false).result).toBe(true);
    expect(quantify([], () => false, true).result).toBe(true);
    expect(quantify([], () => true, false).result).toBe(false);
  });
});
