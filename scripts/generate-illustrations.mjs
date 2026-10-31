import { mkdirSync, writeFileSync } from "node:fs";
const dir = "src/assets/illustrations";
mkdirSync(dir, { recursive: true });
const text = (x, y, t, size = 17) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="${size}" fill="#285943">${t}</text>`;
const line = (x1, y1, x2, y2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6c9b7f" stroke-width="2"/>`;
const dot = (x, y, t) =>
  `<circle cx="${x}" cy="${y}" r="20" fill="#ecf5e9" stroke="#4c8e69" stroke-width="2"/>${text(x, y + 6, t)}`;
const box = (x, y, w, t) =>
  `<rect x="${x}" y="${y}" width="${w}" height="48" rx="9" fill="#eaf2e5" stroke="#a5bf9b"/>${text(x + w / 2, y + 30, t, 14)}`;
function save(name, title, body) {
  writeFileSync(
    `${dir}/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" role="img" aria-label="${title}"><rect width="600" height="260" rx="16" fill="#f7faf2"/>${text(300, 31, title, 18)}${body}</svg>`,
  );
}
save(
  "logic-gates",
  "Logikai kapuk: ÉS, VAGY, NEM",
  `<path d="M65 85H105A40 40 0 0 1 105 165H65Z" fill="#e5efdf" stroke="#6c9b7f" stroke-width="2"/>${line(40, 105, 65, 105)}${line(40, 145, 65, 145)}${line(145, 125, 175, 125)}${text(100, 205, "A ∧ B")}<path d="M245 85Q285 125 245 165Q315 165 345 125Q315 85 245 85Z" fill="#e5efdf" stroke="#6c9b7f" stroke-width="2"/>${line(220, 105, 257, 105)}${line(220, 145, 257, 145)}${line(345, 125, 375, 125)}${text(300, 205, "A ∨ B")}<path d="M455 85L515 125L455 165Z" fill="#e5efdf" stroke="#6c9b7f" stroke-width="2"/><circle cx="522" cy="125" r="7" fill="white" stroke="#6c9b7f" stroke-width="2"/>${line(430, 125, 455, 125)}${line(529, 125, 560, 125)}${text(490, 205, "¬A")}`,
);
save(
  "venn",
  "Halmazok és logikai műveletek",
  `<rect x="90" y="55" width="420" height="175" rx="12" fill="none" stroke="#bdceb2"/><circle cx="250" cy="143" r="70" fill="#8abf8d" fill-opacity=".45" stroke="#62996d"/><circle cx="350" cy="143" r="70" fill="#85b7cb" fill-opacity=".4" stroke="#6093a4"/>${text(220, 150, "A")}${text(380, 150, "B")}${text(300, 148, "A ∩ B", 12)}`,
);
save(
  "proof-flow",
  "Egy indirekt bizonyítás útja",
  `${box(30, 110, 140, "Tagadás feltevése")}${line(175, 134, 215, 134)}${text(195, 126, "→")}${box(220, 110, 150, "Következmények")}${line(375, 134, 415, 134)}${text(395, 126, "→")}${box(420, 110, 150, "Ellentmondás")}${text(300, 205, "A kiinduló állítás igaz, ha tagadása ellentmondásra vezet.", 13)}`,
);
save(
  "bridges",
  "Königsberg: négy terület, hét híd",
  `<path d="M0 75H600V215H0Z" fill="#d7eaf0"/><ellipse cx="265" cy="145" rx="110" ry="38" fill="#e5e7c8"/><path d="M450 95H600V195H450Z" fill="#e5e7c8"/><g stroke="#5c8c70" stroke-width="10"><path d="M230 75V109M290 75V109M230 182V215M290 182V215M376 145H450M500 75V95M500 195V215"/></g>${text(265, 150, "A: 5")}${text(340, 65, "B: 3")}${text(340, 244, "C: 3")}${text(520, 150, "D: 3")}`,
);
const v = [
  [100, 95],
  [50, 195],
  [155, 195],
];
const triangle =
  v.map((p, i) => line(...p, ...v[(i + 1) % 3])).join("") +
  v.map((p, i) => dot(...p, String.fromCharCode(97 + i))).join("");
save(
  "graph-types",
  "Egyszerű, irányított, súlyozott",
  `${triangle}<g transform="translate(200 0)">${triangle}${text(75, 130, "↘", 24)}${text(135, 130, "↙", 24)}${text(100, 227, "Irányított", 12)}</g><g transform="translate(400 0)">${triangle}${text(63, 146, "4", 14)}${text(140, 146, "7", 14)}${text(100, 185, "2", 14)}${text(100, 227, "Súlyozott", 12)}</g>${text(100, 227, "Egyszerű", 12)}`,
);
const coords = Array.from({ length: 5 }, (_, i) => [
  300 + 85 * Math.sin((i * 2 * Math.PI) / 5),
  151 - 85 * Math.cos((i * 2 * Math.PI) / 5),
]);
save(
  "complete-graph",
  "K₅: öt csúcs, tíz él",
  coords
    .flatMap((p, i) => coords.slice(i + 1).map((q) => line(...p, ...q)))
    .join("") +
    coords.map((p, i) => dot(...p, String.fromCharCode(97 + i))).join(""),
);
save(
  "trees-forests",
  "Fa és erdő: m = n − c",
  `${line(140, 90, 80, 170)}${line(140, 90, 200, 170)}${line(200, 170, 250, 220)}${dot(140, 90, "a")}${dot(80, 170, "b")}${dot(200, 170, "c")}${dot(250, 220, "d")}${text(100, 235, "Fa: c=1", 12)}${line(390, 95, 345, 170)}${dot(390, 95, "a")}${dot(345, 170, "b")}${line(490, 170, 540, 220)}${dot(490, 170, "c")}${dot(540, 220, "d")}${text(420, 235, "Erdő: c=2", 12)}`,
);
save(
  "factor-tree",
  "60 prímtényezőfája",
  `${line(300, 75, 190, 130)}${line(300, 75, 380, 130)}${line(380, 130, 300, 190)}${line(380, 130, 460, 190)}${line(460, 190, 405, 235)}${line(460, 190, 515, 235)}${dot(300, 75, "60")}${dot(190, 130, "2")}${dot(380, 130, "30")}${dot(300, 190, "2")}${dot(460, 190, "15")}${dot(405, 235, "3")}${dot(515, 235, "5")}`,
);
const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
save(
  "sieve",
  "Eratoszthenész szitája: a megmaradó számok prímek",
  Array.from({ length: 30 }, (_, i) => {
    const n = i + 1,
      x = 55 + (i % 10) * 50,
      y = 65 + Math.floor(i / 10) * 59;
    return `<rect x="${x}" y="${y}" width="42" height="42" rx="6" fill="${primes.has(n) ? "#d7e9cb" : "#eef0e9"}"/>${text(x + 21, y + 27, n, 15)}${primes.has(n) ? "" : line(x + 7, y + 31, x + 35, y + 10)}`;
  }).join(""),
);
save(
  "euclid",
  "Euklideszi algoritmus: LNKO(126,70) = 14",
  `${box(40, 85, 150, "126 = 1·70 + 56")}${box(225, 85, 150, "70 = 1·56 + 14")}${box(410, 85, 150, "56 = 4·14 + 0")}${text(207, 115, "→")}${text(392, 115, "→")}${text(300, 195, "Az utolsó nemnulla maradék: 14.", 17)}`,
);
save(
  "rsa-flow",
  "RSA: nyilvános és privát kulcs",
  `${box(30, 115, 130, "Üzenet m")}${text(205, 105, "(n,e)", 13)}${line(165, 139, 245, 139)}${text(205, 134, "→")}${box(250, 115, 100, "c = mᵉ mod n")}${text(395, 105, "(n,d)", 13)}${line(355, 139, 435, 139)}${text(395, 134, "→")}${box(440, 115, 130, "m = cᵈ mod n")}${text(300, 215, "A kis prímekkel végzett demonstráció nem biztonságos titkosítás.", 13)}`,
);
console.log("11 eredeti SVG-illusztráció elkészült.");
