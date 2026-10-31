import { describe, it, expect } from "vitest";
import {
  isPrime,
  factorize,
  sieve,
  divisors,
  gcd,
  lcm,
  euclid,
  extendedGcd,
  modPow,
  rsa,
  goldbach,
  boundedInteger,
} from "../src/algorithms/numberTheory";
import { buildFactorTree } from "../src/algorithms/numberTheory/factorTree";
describe("Számelmélet: PDF regresszió és határesetek", () => {
  it("a tényezőfa bináris, prímeit nem bontja tovább, levelei visszaszorozhatók", () => {
    for (const n of [2, 60, 9438, 549755813888]) {
      const g = buildFactorTree(n);
      for (const v of g.vertices) {
        const children = g.edges
          .filter((e) => e.from === v.id)
          .map((e) => Number(g.vertices.find((v) => v.id === e.to)!.label));
        if (children.length) {
          expect(children).toHaveLength(2);
          expect(children[0] * children[1]).toBe(Number(v.label));
        } else expect(isPrime(Number(v.label))).toBe(true);
      }
      const leaves = g.vertices.filter(
        (v) => !g.edges.some((e) => e.from === v.id),
      );
      expect(leaves.reduce((s, v) => s * BigInt(v.label), 1n)).toBe(BigInt(n));
    }
    expect(buildFactorTree(2).edges).toHaveLength(0);
  });
  it("a PDF 2–100-as felbontási táblázatának minden száma visszaszorozható", () => {
    for (let n = 2; n <= 100; n++) {
      const fs = factorize(n).factors;
      expect(fs.every((f) => isPrime(f.prime))).toBe(true);
      expect(fs.reduce((a, f) => a * f.prime ** f.power, 1)).toBe(n);
    }
  });
  it.each([2, 3, 11, 17, 97, 999983])("%i prím", (n) =>
    expect(isPrime(n)).toBe(true),
  );
  it.each([-7, 0, 1, 4, 49, 121, 2047])("%i nem prím", (n) =>
    expect(isPrime(n)).toBe(false),
  );
  it.each([
    [
      9438,
      [
        [2, 1],
        [3, 1],
        [11, 2],
        [13, 1],
      ],
    ],
    [
      5780,
      [
        [2, 2],
        [5, 1],
        [17, 2],
      ],
    ],
    [
      238,
      [
        [2, 1],
        [7, 1],
        [17, 1],
      ],
    ],
    [
      51450,
      [
        [2, 1],
        [3, 1],
        [5, 2],
        [7, 3],
      ],
    ],
    [
      5733,
      [
        [3, 2],
        [7, 2],
        [13, 1],
      ],
    ],
  ])("%i ellenőrzött prímfelbontása", (n, expected) => {
    const f = factorize(n as number);
    expect(f.factors.map((f) => [f.prime, f.power])).toEqual(expected);
    expect(
      f.factors.reduce((s, f) => s * BigInt(f.prime) ** BigInt(f.power), 1n),
    ).toBe(BigInt(n as number));
  });
  it.each([
    [5780n, 238n, 34n, 40460n],
    [51450n, 5733n, 147n, 2006550n],
    [70n, 126n, 14n, 630n],
    [33n, 51n, 3n, 561n],
    [121n, 169n, 1n, 20449n],
    [-12n, 18n, 6n, 36n],
    [0n, 0n, 0n, 0n],
    [0n, 5n, 5n, 0n],
  ])("LNKO/LKKT: %s, %s", (a, b, g, l) => {
    expect(gcd(a, b)).toBe(g);
    expect(lcm(a, b)).toBe(l);
    expect(g * l).toBe(a * b < 0n ? -a * b : a * b);
  });
  it("nagy BigInt esetén sincs kerekítés", () =>
    expect(lcm(9007199254740993n, 2n)).toBe(18014398509481986n));
  it("euklideszi sor maradékai csökkennek", () => {
    const r = euclid(5780n, 238n);
    expect(r.gcd).toBe(34n);
    for (const s of r.steps) {
      expect(s.a).toBe(s.q * s.b + s.r);
      expect(s.r).toBeLessThan(s.b);
    }
  });
  it("szita: 30 prím 120 alatt, helyes törlés", () => {
    const s = sieve(120);
    expect(s.primes).toHaveLength(30);
    expect(s.primes.at(-1)).toBe(113);
    expect(s.stages[0].removed[0]).toBe(4);
    expect(s.primes.every(isPrime)).toBe(true);
  });
  it("osztólista", () =>
    expect(divisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]));
  it("kiterjesztett Euklidész Bézout-egyenlete", () => {
    const r = extendedGcd(17n, 3120n);
    expect(17n * r.x + 3120n * r.y).toBe(1n);
  });
  it("gyors moduláris hatvány", () => {
    expect(modPow(4n, 13n, 497n).result).toBe(445n);
    expect(modPow(-2n, 3n, 5n).result).toBe(2n);
    expect(modPow(2n, 0n, 1n).result).toBe(0n);
  });
  it("RSA minden üzenetet visszafejt kis kulcsnál, nem relatív prím üzenetet is", () => {
    for (let m = 0n; m < 33n; m++) {
      const r = rsa(3, 11, 3n, m);
      expect(r.decrypted.result).toBe(m);
      expect(r.d).toBe(7n);
    }
  });
  it.each([
    [3, 3, 3n, 1n],
    [4, 11, 3n, 1n],
    [3, 11, 4n, 1n],
    [3, 11, 3n, 33n],
  ])("hibás RSA paramétereket elutasít", (p, q, e, m) =>
    expect(() => rsa(p, q, e, m)).toThrow(),
  );
  it("Goldbach a kiválasztott tartományban", () => {
    for (let n = 4; n <= 200; n += 2) {
      const pairs = goldbach(n);
      expect(pairs.length).toBeGreaterThan(0);
      expect(
        pairs.every(([a, b]) => a + b === n && isPrime(a) && isPrime(b)),
      ).toBe(true);
    }
  });
  it("korlátok és 1 felbontása", () => {
    expect(factorize(1).factors).toEqual([]);
    expect(() => factorize(1e13)).toThrow();
    expect(() => sieve(Infinity)).toThrow();
    expect(() => boundedInteger("1.5")).toThrow();
    expect(() => modPow(1n, -1n, 5n)).toThrow();
  });
});
