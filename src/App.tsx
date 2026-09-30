import "./App.css";
import { About } from "./components/About";
import { Header } from "./components/Header";
import { LinkList } from "./components/LinkList";

function App() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">The Abdalkhani domain</p>
          <h1 id="hero-title">A home for useful, thoughtfully built tools.</h1>
          <p className="hero-copy">
            Explore the applications available across the Abdalkhani domain and
            learn more about the people behind them.
          </p>
          <a className="hero-link" href="#applications">
            Explore applications
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <div className="content-grid">
          <About />
          <LinkList />
        </div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Abdalkhani</p>
        <a href="mailto:kian@abdalkhani.com">Get in touch</a>
      </footer>
    </>
  );
}

export default App;
