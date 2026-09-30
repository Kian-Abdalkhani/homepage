# Abdalkhani Homepage

The public landing page for the Abdalkhani domain. It introduces the site and
provides a central directory for applications hosted on its subdomains.

## Development

### Requirements

- Node.js 20 or newer
- npm

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

The local URL is printed in the terminal (normally `http://localhost:5173`).
Vite listens on all network interfaces, so the same server is also available to
containerized or remote-workspace preview tools.

## Available scripts

- `npm run dev` starts the development server with hot module replacement.
- `npm run build` type-checks the project and creates a production build.
- `npm run lint` runs ESLint across the repository.
- `npm run preview` serves the production build locally.

## Deployment

The included `Dockerfile`, `docker-compose.yml`, and Nginx configuration can be
used to build and serve the static production bundle:

```bash
docker compose up --build
```
