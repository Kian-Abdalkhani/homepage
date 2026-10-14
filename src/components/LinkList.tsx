import { Card, Stack } from "@abdalkhani/react-ui";
import { apps } from "../data/apps";
import { AppIcon } from "./AppIcon";
import "./LinkList.css";

export function LinkList() {
  return (
    <Card className="link-list" role="region" aria-labelledby="apps-title">
      <Stack gap="var(--ak-space-4)">
        <h2 id="apps-title" className="section-title">List of apps within the domain:</h2>
        <ul className="app-grid">
          {apps.map((app) => (
            <li key={app.id}>
              <a className="app-link" href={app.url} aria-labelledby={`${app.id}-title`} aria-describedby={`${app.id}-description`}>
                <span className="app-icon-frame"><AppIcon icon={app.icon} /></span>
                <span className="app-summary">
                  <span id={`${app.id}-title`} className="app-name">{app.name}</span>
                  <span id={`${app.id}-description`} className="app-description">{app.description}</span>
                </span>
                <svg className="app-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </Stack>
    </Card>
  );
}
