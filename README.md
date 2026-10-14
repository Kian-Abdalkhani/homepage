# Abdalkhani homepage

The existing public homepage, using the Abdalkhani design kit's React components
and semantic CSS tokens. Its original copy, contact link, and Investment
Calculator destination are preserved. Branding uses the kit's compact winged
horse and matching favicon, and the compact header includes a sun/moon switch.

## Open the homepage locally

After installing dependencies, run this from the project directory:

```sh
npm start
```

Keep that terminal running and open `http://127.0.0.1:4173/` in your browser.
This builds the homepage and serves its compiled files. The root `index.html`
is Vite's source entry and references TypeScript/React modules; opening it as a
`file://` URL cannot run the app. Serve `dist/` through a web server for production
as well. For development with live updates, use `npm run dev` below.

## Development

Use Node.js 24 and npm. The app consumes these exact private Forgejo packages:

- `@abdalkhani/react-ui@0.1.0`
- `@abdalkhani/homelab-theme@0.1.0`

The tracked `.npmrc` routes only the `@abdalkhani` scope to Forgejo. Supply package
authentication through your existing user-level npm config or CI secret. For an
environment-based user config, preserve existing settings and add:

```ini
//forgejo.abdalkhani.com/api/packages/abdalkhani-homelab/npm/:_authToken=${FORGEJO_TOKEN}
```

Supply `FORGEJO_TOKEN` in the shell/CI environment. The Forgejo account needs
package access to `abdalkhani-homelab`. Credentials belong outside this repository.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

## Components and appearance

`src/main.tsx` imports theme tokens, component styles, then app styles. The header
uses `Stack`; the two content panels use `Card` and `Stack`, composed in a `Grid`.
They remain side by side above 768px and stack at narrower widths. The header
stays sticky, with a compact logo/wordmark/title group and an icon switch in one
row at normal text sizes, including 320px screens.

Appearance initially follows the operating system. The header's kit `IconButton`
is exposed as an accessible switch named "Dark mode". Sun/moon icons and a sliding
thumb indicate its state; Enter and Space both toggle it. It saves a choice to
`localStorage` under `ak-appearance`. The document-head bootstrap restores it
before the app loads. Blocked storage still permits switching for the current
page; invalid saved values fall back to system appearance. Clear that storage key
to follow the system again. App styles consume the kit's `--ak-*` tokens directly;
Tailwind is optional.

Links remain native anchors. Their destinations and same-tab behavior are
unchanged. The header imports `logos/winged-horse-compact.svg` from the theme
package and uses a CSS mask with `--ak-brand`, so the same mark is turquoise in
light mode and brass in dark mode. The original ABDALKHANI wordmark text remains.
`scripts/sync-brand-assets.mjs` copies the kit's favicon before development/build;
Vite fingerprints both SVG assets for production. The generated favicon in
`src/assets/` is ignored by Git and Docker's build context.

## Verification

```sh
npm run lint
npm run build
npm run test:browser:install
npm run test:browser
```

The browser suite builds the production app, then tests Chromium and WebKit.
`tests/fixtures/original-homepage.json` was captured from the original rendered
homepage before migration. Tests compare its copy, emphasis, links, and title.
Separate asset checks compare the served logo and favicon bytes to the installed
design kit. Tests also cover the theme toggle, reload persistence, restoration
before React starts, blocked storage, system fallback, same-tab navigation,
keyboard focus, 320px reflow, 200% text sizing, sticky positioning, forced colors,
reduced motion, and automated WCAG checks. The
calculator navigation test intercepts the destination without contacting it.

Screenshots are written to `artifacts/homepage-{light,dark}.png` and
`artifacts/homepage-{light,dark}-mobile.png`. The HTML report is in
`playwright-report/`. These generated files are ignored by Git and Docker.

To run the same suite against an already-running production container:

```sh
HOMEPAGE_TEST_URL=http://127.0.0.1:8080 npm run test:browser
```

## Docker

Compose supplies your user-level `~/.npmrc` as a BuildKit secret only during
dependency installation. It should contain a resolved authentication token for
this file-based Compose build. The runtime image contains the static build and
Nginx configuration; it needs no Forgejo access.

```sh
docker compose build --print | docker buildx bake --file - \
  --allow="fs.read=${HOMEPAGE_NPMRC:-$HOME/.npmrc}" --load
docker compose up -d
```

The existing container name, port mapping (`8080:80`), and restart policy remain
the same. To select a different credentials file outside the repository:

```sh
export HOMEPAGE_NPMRC=/absolute/path/to/npm-config
docker compose build --print | docker buildx bake --file - \
  --allow="fs.read=$HOMEPAGE_NPMRC" --load
```

For CI or a user config containing `${FORGEJO_TOKEN}`, pass the token as a second
BuildKit secret. It is available only to the `npm ci` instruction:

```sh
docker build \
  --secret id=npmrc,src="$HOME/.npmrc" \
  --secret id=forgejo_token,env=FORGEJO_TOKEN \
  -t abdalkhani-homepage .
```

The Bake command grants access to that exact external npm config file. On Compose
versions without Bake's filesystem entitlement check, `docker compose build`
also works.

The project `.npmrc` contains scope routing only. Keep credential-bearing configs
outside the build context. Use secret mounts rather than Docker build arguments
for credentials; see [Docker build secrets](https://docs.docker.com/build/building/secrets/).
