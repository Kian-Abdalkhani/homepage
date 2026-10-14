import { Card, Stack } from "@abdalkhani/react-ui";
import "./About.css";

export function About() {
  return (
    <Card className="about" role="region" aria-labelledby="about-title">
      <Stack gap="var(--ak-space-4)">
        <h2 id="about-title" className="section-title">About Us</h2>
        <p>
          Welcome to the public <strong>Abdalkhani</strong> homepage!
        </p>
        <p>
          This page serves as a general reference for apps within the site. More
          apps will be available soon.
        </p>
        <p className="about-contact">
          <em>
            (Domain currently owned and managed by Kian Abdalkhani, for further
            inquiries contact me at{" "}
            <a href="mailto:kian@abdalkhani.com">kian@abdalkhani.com</a>)
          </em>
        </p>
      </Stack>
    </Card>
  );
}
