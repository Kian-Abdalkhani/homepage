import "./Header.css";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Abdalkhani home">
        <img src="/icon.svg" alt="" />
        <img
          className="brand-wordmark"
          src="/abdalkhani.svg"
          alt="Abdalkhani"
        />
      </a>
      <nav aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#applications">Applications</a>
      </nav>
    </header>
  );
}
