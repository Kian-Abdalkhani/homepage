import { Card, Stack } from "@abdalkhani/react-ui";
import "./LinkList.css";

export function LinkList() {
  return (
    <Card className="link-list" role="region" aria-labelledby="apps-title">
      <Stack gap="var(--ak-space-4)">
        <h2 id="apps-title" className="section-title">List of apps within the domain:</h2>
        <ul>
          <li>
            <a className="app-link" href="https://inv-calc.abdalkhani.com">Investment Calculator</a>
          </li>
        </ul>
      </Stack>
    </Card>
  );
}
