export function boundedInteger(
  raw: string,
  min = 0,
  max = 1_000_000_000_000,
): number {
  if (!/^-?\d+$/.test(raw.trim())) throw Error("Egész szám szükséges.");
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw Error(`A szám ${min} és ${max} közé essen.`);
  return n;
}
export function isPrime(n: number) {
  if (!Number.isSafeInteger(n) || n < 2) return false;
  if (n > 1e12) throw Error("A prímteszt határa 10¹².");
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2)
    if (n % p === 0) return false;
  return true;
}
export function factorize(n: number) {
  if (!Number.isSafeInteger(n) || n < 1 || n > 1e12)
    throw Error("A felbontás bemenete 1 és 10¹² közötti egész legyen.");
  const factors: { prime: number; power: number }[] = [],
    steps: { n: number; prime: number; quotient: number }[] = [];
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) {
    let power = 0;
    while (n % p === 0) {
      steps.push({ n, prime: p, quotient: n / p });
      n /= p;
      power++;
    }
    if (power) factors.push({ prime: p, power });
  }
  if (n > 1) {
    factors.push({ prime: n, power: 1 });
    steps.push({ n, prime: n, quotient: 1 });
  }
  return { factors, steps };
}
export const factorText = (n: number) =>
  factorize(n)
    .factors.map((f) => `${f.prime}${f.power > 1 ? "^" + f.power : ""}`)
    .join(" · ") || "1 (üres szorzat)";
export function sieve(n: number) {
  if (!Number.isInteger(n) || n < 2 || n > 100000)
    throw Error("A szita határa 2–100000.");
  const composite = Array<boolean>(n + 1).fill(false);
  composite[0] = composite[1] = true;
  const stages: { prime: number; removed: number[] }[] = [];
  for (let p = 2; p * p <= n; p++)
    if (!composite[p]) {
      const removed = [];
      for (let j = p * p; j <= n; j += p) {
        if (!composite[j]) removed.push(j);
        composite[j] = true;
      }
      stages.push({ prime: p, removed });
    }
  return {
    primes: Array.from({ length: n - 1 }, (_, i) => i + 2).filter(
      (x) => !composite[x],
    ),
    stages,
  };
}
const abs = (n: bigint) => (n < 0n ? -n : n);
export function euclid(a: bigint, b: bigint) {
  a = abs(a);
  b = abs(b);
  const steps: { a: bigint; b: bigint; q: bigint; r: bigint }[] = [];
  while (b) {
    const r = a % b;
    steps.push({ a, b, q: a / b, r });
    a = b;
    b = r;
  }
  return { gcd: a, steps };
}
export const gcd = (a: bigint, b: bigint) => euclid(a, b).gcd;
export const lcm = (a: bigint, b: bigint) =>
  a === 0n || b === 0n ? 0n : abs((a / gcd(a, b)) * b);
export function divisors(n: number) {
  if (n < 1 || n > 1e9 || !Number.isInteger(n))
    throw Error("Osztólista: 1–10⁹ egész.");
  const a: number[] = [];
  for (let p = 1; p * p <= n; p++)
    if (n % p === 0) {
      a.push(p);
      if (p * p !== n) a.push(n / p);
    }
  return a.sort((a, b) => a - b);
}
export function extendedGcd(a: bigint, b: bigint) {
  let [r, s, t] = [a, 1n, 0n],
    [rr, ss, tt] = [b, 0n, 1n];
  const steps: string[] = [];
  while (rr) {
    const q = r / rr;
    steps.push(`${r} = ${q} · ${rr} + ${r - q * rr}`);
    [r, rr] = [rr, r - q * rr];
    [s, ss] = [ss, s - q * ss];
    [t, tt] = [tt, t - q * tt];
  }
  return { gcd: r, x: s, y: t, steps };
}
export function modPow(base: bigint, exp: bigint, mod: bigint) {
  if (mod <= 0n || exp < 0n)
    throw Error("Pozitív modulus és nemnegatív kitevő szükséges.");
  let result = 1n % mod;
  base = ((base % mod) + mod) % mod;
  const steps: string[] = [];
  while (exp) {
    steps.push(
      `k=${exp}, alap=${base}, eredmény=${result}${exp % 2n ? " → szorzás" : ""}`,
    );
    if (exp % 2n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return { result, steps };
}
export function rsa(p: number, q: number, e: bigint, m: bigint) {
  if (p === q || p > 97 || q > 97 || !isPrime(p) || !isPrime(q))
    throw Error("Két különböző, legfeljebb 97-es prím szükséges.");
  const n = BigInt(p * q),
    phi = BigInt((p - 1) * (q - 1));
  if (e <= 1n || e >= phi || gcd(e, phi) !== 1n)
    throw Error("1 < e < φ(n) és LNKO(e,φ(n)) = 1 szükséges.");
  if (m < 0n || m >= n) throw Error("Az üzenet 0 ≤ m < n egész legyen.");
  const ext = extendedGcd(e, phi),
    d = ((ext.x % phi) + phi) % phi;
  const encrypted = modPow(m, e, n),
    decrypted = modPow(encrypted.result, d, n);
  return { n, phi, d, encrypted, decrypted, ext };
}
export function goldbach(n: number) {
  if (n < 4 || n % 2 || n > 100000)
    throw Error("4–100000 közötti páros szám szükséges.");
  const p = sieve(n).primes,
    ps = new Set(p);
  return p.filter((a) => a <= n / 2 && ps.has(n - a)).map((a) => [a, n - a]);
}
