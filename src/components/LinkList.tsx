import "./LinkList.css";

const applications = [
  {
    name: "Investment Calculator",
    description:
      "Explore compound growth and see how recurring contributions can shape a long-term investment.",
    href: "https://inv-calc.abdalkhani.com",
    label: "Finance",
  },
] as const;

export function LinkList() {
  return (
    <section
      className="link-list panel"
      id="applications"
      aria-labelledby="applications-title"
    >
      <div className="section-heading">
        <p className="section-number" aria-hidden="true">
          02
        </p>
        <h2 id="applications-title">Applications</h2>
      </div>
      <ul>
        {applications.map((application) => (
          <li key={application.href}>
            <a href={application.href}>
              <span className="app-label">{application.label}</span>
              <strong>{application.name}</strong>
              <span className="app-description">{application.description}</span>
              <span className="app-cta">
                Open application <span aria-hidden="true">↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
