import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
  Link,
} from "react-router-dom";
import {
  Home,
  Braces,
  Network,
  Binary,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import HomePage from "../pages/HomePage";
import { lessons, type Topic } from "../data/lessons";
const LogicPage = lazy(() => import("../pages/LogicPage")),
  GraphPage = lazy(() => import("../pages/GraphPage")),
  NumberTheoryPage = lazy(() => import("../pages/NumberTheoryPage"));
const routes = [
  { path: "/", title: "Áttekintés", icon: Home },
  { path: "/logika", title: "Matematikai logika", icon: Braces },
  { path: "/grafelmelet", title: "Gráfelmélet", icon: Network },
  { path: "/szamelmelet", title: "Számelmélet", icon: Binary },
];
const contents: Record<Topic, [string, string][]> = {
  logic: [
    ["fogalmak", "Fogalmak"],
    ["tetelek", "Tételek"],
    ["peldak", "Levezetett példa"],
    ["kalkulator", "Kifejezéslabor"],
    ["azonossagok", "Azonosságok"],
    ["kvantorok", "Kvantorok"],
    ["bizonyitasok", "Bizonyítások"],
    ["gyakorlas", "Gyakorlófeladatok"],
  ],
  graph: [
    ["fogalmak", "Fogalmak"],
    ["tetelek", "Tételek"],
    ["peldak", "Levezetett példa"],
    ["szerkeszto", "Gráfszerkesztő"],
    ["tulajdonsagok", "Tulajdonságok"],
    ["algoritmusok", "Algoritmusműhely"],
    ["matrixok", "Mátrixok"],
    ["hidak", "Königsbergi hidak"],
    ["gyakorlas", "Gyakorlófeladatok"],
  ],
  number: [
    ["fogalmak", "Fogalmak"],
    ["tetelek", "Tételek"],
    ["peldak", "Levezetett példa"],
    ["primek", "Prímkalkulátor"],
    ["szita", "Eratoszthenész szitája"],
    ["felbontas", "Prímfelbontás"],
    ["lnko-lkkt", "LNKO és LKKT"],
    ["osztohalo", "Osztóháló"],
    ["eloszlas", "Prímek eloszlása"],
    ["rsa", "RSA"],
    ["gyakorlas", "Gyakorlófeladatok"],
  ],
};
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className="panel">
        <h2>A műhely nem tölthető be.</h2>
        <p>
          A mentett gráf exportálásához ne töröld a böngésző adatait. Frissítsd
          az oldalt az újrapróbáláshoz.
        </p>
        <button onClick={() => window.location.reload()}>Újratöltés</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Layout() {
  const [dark, setDark] = useState(() => {
      try {
        return localStorage.getItem("mathshead-theme") === "dark";
      } catch {
        return false;
      }
    }),
    [open, setOpen] = useState(false);
  const location = useLocation(),
    topic: Topic | undefined =
      location.pathname === "/logika"
        ? "logic"
        : location.pathname === "/grafelmelet"
          ? "graph"
          : location.pathname === "/szamelmelet"
            ? "number"
            : undefined;
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("mathshead-theme", dark ? "dark" : "light");
    } catch {
      /* optional persistence */
    }
  }, [dark]);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    document.title = topic
      ? `${lessons[topic].title} · MathsHead`
      : "MathsHead · A matematika érthető.";
  }, [location.pathname, topic]);
  return (
    <>
      <a className="skip-link" href="#main">
        Ugrás a tartalomra
      </a>
      <aside className={"sidebar " + (open ? "open" : "")}>
        <Link className="brand" to="/">
          <span className="brand-mark">
            m<span>·</span>
          </span>
          <span>
            MathsHead<small>ÉRTSD MEG AZ ÖSSZEFÜGGÉST.</small>
          </span>
        </Link>
        <button
          className="mobile-close"
          aria-label="Menü bezárása"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <div className="nav-label">TANULÁSI TÉR</div>
        <nav aria-label="Fő navigáció">
          {routes.map((r, i) => (
            <NavLink to={r.path} end={r.path === "/"} key={r.path}>
              <r.icon size={19} />
              <span>{r.title}</span>
              {i > 0 && <small>0{i}</small>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        {topic ? (
          <nav className="toc" aria-label="Tartalomjegyzék">
            <div className="nav-label">EZEN AZ OLDALON</div>
            {contents[topic].map(([id, title], i) => (
              <a href={"#" + id} key={id}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {title}
              </a>
            ))}
          </nav>
        ) : (
          <div className="sidebar-note">
            <div className="mini-graph">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <h3>
              A megértés egy
              <br />
              jó kérdéssel kezdődik.
            </h3>
            <p>Mi történik, ha…?</p>
          </div>
        )}
        <div className="sidebar-bottom">
          <div className="source-card">
            <GraduationCap size={23} />
            <div>
              <strong>
                Egyetemi alapok.
                <br />
                Új nézőpont.
              </strong>
              <p>GDE · Diszkrét matematika</p>
            </div>
            <ArrowUpRight size={15} />
          </div>
          <button className="theme-button" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
            <span>{dark ? "Világos megjelenés" : "Sötét megjelenés"}</span>
            <span className="keyboard-hint">◐</span>
          </button>
          <div className="sidebar-copyright">KÍVÁNCSISÁGRA TERVEZVE.</div>
        </div>
      </aside>
      {open && (
        <button
          className="nav-scrim"
          aria-label="Menü bezárása"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label="Menü megnyitása"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
            <BookOpen size={16} />
            <span>Interaktív tankönyv</span>
            <ChevronRight size={13} />
            <strong>{topic ? lessons[topic].title : "Áttekintés"}</strong>
          </div>
          <span className="topbar-status">
            <span className="live-dot" /> TANULJ A SAJÁT TEMPÓDBAN
          </span>
        </header>
        <main id="main" className={topic ? "topic-main" : "home-main"}>
          {topic && (
            <>
              <div className="topic-intro">
                <span className="eyebrow">
                  DISZKRÉT MATEMATIKA /{" "}
                  {topic === "logic" ? "01" : topic === "graph" ? "02" : "03"}
                </span>
                <h1>
                  {lessons[topic].title}
                  <span>.</span>
                </h1>
                <p>{lessons[topic].intro}</p>
                <a
                  href={
                    "#" +
                    (topic === "logic"
                      ? "kalkulator"
                      : topic === "graph"
                        ? "szerkeszto"
                        : "primek")
                  }
                  className="button primary"
                >
                  Irány az interaktív műhely <ArrowUpRight size={17} />
                </a>
              </div>
              <nav className="mobile-toc" aria-label="Gyors tartalomjegyzék">
                {contents[topic].map(([id, t]) => (
                  <a key={id} href={"#" + id}>
                    {t}
                  </a>
                ))}
              </nav>
            </>
          )}
          <ErrorBoundary key={location.pathname}>
            <Suspense fallback={<p role="status">A műhely betöltése…</p>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/logika" element={<LogicPage />} />
                <Route path="/grafelmelet" element={<GraphPage />} />
                <Route path="/szamelmelet" element={<NumberTheoryPage />} />
                <Route
                  path="*"
                  element={
                    <section className="panel">
                      <h1>Ez az oldal nem található.</h1>
                      <Link to="/">Vissza a kezdőoldalra</Link>
                    </section>
                  }
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
