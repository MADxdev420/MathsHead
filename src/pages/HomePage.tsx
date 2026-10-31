import {
  ArrowUpRight,
  ArrowRight,
  Network,
  Braces,
  Binary,
  Check,
  BookOpen,
  MousePointer2,
} from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../assets/illustrations/discrete-world.svg";
const topics = [
  {
    id: "01",
    title: "Matematikai logika",
    path: "/logika",
    icon: Braces,
    className: "logic",
    description:
      "Az állításoktól a bizonyításig. Értsd meg, mikor igaz egy következtetés.",
    tags: ["Igazságtáblák", "Kvantorok", "Bizonyítások"],
    formula: "A ∧ B → C",
    count: "4 interaktív műhely",
  },
  {
    id: "02",
    title: "Gráfelmélet",
    path: "/grafelmelet",
    icon: Network,
    className: "graph",
    description:
      "Rajzold fel a kapcsolatokat. Fedezd fel a hálózatok és utak matematikáját.",
    tags: ["Gráfszerkesztő", "9 algoritmus", "Euler-séta"],
    formula: "G = (V, E)",
    count: "Saját gráflabor",
  },
  {
    id: "03",
    title: "Számelmélet",
    path: "/szamelmelet",
    icon: Binary,
    className: "number",
    description:
      "Találd meg a számok építőköveit. A prímektől egészen a titkosításig.",
    tags: ["Prímek", "LNKO · LKKT", "RSA"],
    formula: "n = p₁ᵅ¹ ··· pₖᵅᵏ",
    count: "7 interaktív műhely",
  },
];
export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> GONDOLKODJ. KÍSÉRLETEZZ. ÉRTSD MEG.
          </div>
          <h1>
            A matematika
            <br />
            akkor áll össze,
            <br />
            ha <em>kipróbálod.</em>
          </h1>
          <p>
            Fedezd fel a diszkrét matematika világát egy interaktív tankönyvvel.
            Kevesebb bemagolás, több „most már értem”.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#temakorok">
              Kezdjük a felfedezést <ArrowRight size={17} />
            </a>
            <Link className="text-link" to="/grafelmelet">
              Irány a gráflabor <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-trust">
            <span>
              <Check size={14} /> Magyar nyelvű tananyag
            </span>
            <span>
              <Check size={14} /> Ellenőrzött matematika
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-label">
            <span className="live-dot" /> A TUDÁS KAPCSOLATOKBÓL ÉPÜL
          </div>
          <img
            src={hero}
            alt="Egy összekapcsolódó matematikai világ: logikai műveletek, gráfok és prímszámok"
          />
          <span className="visual-note">Egy ötletből új összefüggések.</span>
        </div>
      </section>
      <div className="home-metrics">
        <div>
          <strong>03</strong>
          <span>egymásra épülő témakör</span>
        </div>
        <div>
          <strong>45</strong>
          <span>feladat, magyarázatokkal</span>
        </div>
        <div>
          <MousePointer2 size={24} />
          <span>Valódi, kipróbálható matematika</span>
        </div>
        <div>
          <BookOpen size={24} />
          <span>A GDE jegyzete alapján, javítva</span>
        </div>
      </div>
      <section id="temakorok" className="topics">
        <div className="section-label">
          <div>
            <span className="eyebrow">VÁLASZD KI, HOL KEZDESZ</span>
            <h2>Három nézőpont. Egy izgalmas világ.</h2>
          </div>
          <span className="muted">A saját tempódban.</span>
        </div>
        <div className="topic-cards">
          {topics.map((t) => (
            <Link
              to={t.path}
              className={"topic-card " + t.className}
              key={t.path}
            >
              <div className="card-top">
                <span className="topic-icon">
                  <t.icon size={24} />
                </span>
                <span className="topic-id">/ {t.id}</span>
              </div>
              <div className="card-formula">{t.formula}</div>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <div className="tags">
                {t.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="card-bottom">
                <span>{t.count}</span>
                <span className="round-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="learning-banner">
        <div className="banner-symbol">∴</div>
        <div>
          <span className="eyebrow">NEM CSAK AZ EREDMÉNY SZÁMÍT</span>
          <h2>A „miért”-et is megmutatjuk.</h2>
          <p>
            Léptesd az algoritmusokat, próbálj ellenpéldákat, és fedezd fel az
            összefüggéseket. Minden műhelyben te irányítasz.
          </p>
        </div>
        <Link to="/logika" className="button">
          Az első felismerés felé <ArrowRight size={16} />
        </Link>
      </section>
      <footer className="home-footer">
        <span>
          MathsHead{" "}
          <span className="muted">/ Diszkrét matematika, érthetően.</span>
        </span>
        <span>Gábor Dénes Egyetem · 2025/26-os jegyzet alapján</span>
      </footer>
    </>
  );
}
