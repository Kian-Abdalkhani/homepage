import { IconButton, Stack } from "@abdalkhani/react-ui";
import markUrl from "@abdalkhani/homelab-theme/logos/winged-horse-compact.svg?url";
import "./Header.css";

type HeaderProps = {
  appearance: "light" | "dark";
  toggleAppearance: () => void;
};

export function Header({ appearance, toggleAppearance }: HeaderProps) {
  return (
    <header className="homepage-header">
      <Stack className="header-content" direction="row" align="center" justify="space-between" wrap>
        <Stack className="header-brand" direction="row" align="center" gap="var(--ak-space-2)">
          <span
            className="header-logo"
            aria-hidden="true"
            style={{ maskImage: `url("${markUrl}")`, WebkitMaskImage: `url("${markUrl}")` }}
          />
          <div className="header-identity">
            <div className="header-watermark">ABDALKHANI</div>
            <h1>Homepage</h1>
          </div>
        </Stack>
        <IconButton
          className="appearance-toggle"
          variant="quiet"
          label="Dark mode"
          role="switch"
          aria-checked={appearance === "dark"}
          title={`Switch to ${appearance === "dark" ? "light" : "dark"} mode`}
          onClick={toggleAppearance}
        >
          <span className="appearance-track" aria-hidden="true">
            <span className="appearance-thumb" />
            <svg className="appearance-icon appearance-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg className="appearance-icon appearance-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8a8.4 8.4 0 1 0 11.6 11.6Z" />
            </svg>
          </span>
        </IconButton>
      </Stack>
    </header>
  );
}
