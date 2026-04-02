import "./Header.css";

export function Header() {
  return (
    <header className="HeaderClass">
      <div className="header-logo">
        <img src="/icon.svg" alt="Family Logo" />
      </div>
      <div className="header-watermark">
        <img src="/abdalkhani.svg" alt="Family Watermark" />
      </div>
      <div className="header-title">
        <p>Homepage</p>
      </div>
    </header>
  );
}
