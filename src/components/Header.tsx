import "./Header.css";
import FamLogo from "../assets/icon.svg";
import FamWaterMark from "/public/abdalkhani.svg";

export function Header() {
  return (
    <header className="HeaderClass">
      <div className="header-logo">
        <img src={FamLogo} alt="Family Logo" />
      </div>
      <div className="header-watermark">
        <img src={FamWaterMark} alt="Family Watermark" />
      </div>
      <div className="header-title">
        <p>Homepage</p>
      </div>
    </header>
  );
}
