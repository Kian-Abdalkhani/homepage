import "./About.css";

export function About() {
  return (
    <section className="about panel" id="about" aria-labelledby="about-title">
      <p className="section-number" aria-hidden="true">
        01
      </p>
      <div>
        <h2 id="about-title">About</h2>
        <p>
          This is the public homepage for the Abdalkhani domain—a central place
          for independent apps and projects. New tools will be added as they
          become available.
        </p>
        <p className="contact-copy">
          The domain is owned and managed by Kian Abdalkhani. For questions or
          inquiries, email{" "}
          <a href="mailto:kian@abdalkhani.com">kian@abdalkhani.com</a>.
        </p>
      </div>
    </section>
  );
}
