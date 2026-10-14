# Abdalkhani homepage

The existing public homepage, using the Abdalkhani design kit's React components
and semantic CSS tokens. Its original copy, contact link, and Investment
Calculator destination are preserved. Branding uses the kit's compact winged
horse and matching favicon, and the compact header includes a sun/moon switch.
The public app directory leads the page, followed by About and contact information.

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
uses `Stack`; the two content panels use `Card` and `Stack` in a single column.
The app directory comes first at every width. Native app links include a decorative
icon and a short description, with entries defined in `src/data/apps.ts`. The
directory's responsive grid supports additional entries without changing its component.
The header
stays sticky, with a compact logo/wordmark/title group and an icon switch in one
row at normal text sizes, including 320px screens.

Appearance initially follows the operating system. The header's kit `IconButton`
is exposed as an accessible switch named "Dark mode". Sun/moon icons and a sliding
thumb indicate its state; Enter and Space both toggle it. It saves a choice to
`localStorage` under `ak-appearance`. The document-head bootstrap restores it
before the app loads. Blocked storage still permits switching for the current
page; invalid saved values fall back to system appearance. Use the "Follow system"
control below the content to clear the saved choice and resume operating-system
changes. App styles consume the kit's `--ak-*` tokens directly;
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
homepage before migration. Tests compare its About copy, emphasis, visible page
heading, and link destinations. The document title intentionally describes the
public app directory, and app descriptions are additional content.
Separate asset checks compare the served logo and favicon bytes to the installed
design kit. Tests also cover the theme toggle, reload persistence, restoration
before React starts, blocked storage, system fallback and reset, same-tab navigation,
keyboard focus, 320px reflow, 200% text sizing, sticky positioning, forced colors,
reduced motion, and automated WCAG checks. The
calculator navigation test intercepts the destination without contacting it.
App ordering and sharing metadata are also checked, including the served preview
image's PNG format and dimensions.

Screenshots are written to `artifacts/homepage-{light,dark}.png` and
`artifacts/homepage-{light,dark}-mobile.png`. The HTML report is in
`playwright-report/`. These generated files are ignored by Git and Docker.

To run the same suite against an already-running production container:

```sh
HOMEPAGE_TEST_URL=http://127.0.0.1:8080 npm run test:browser
```

## Search and sharing preview

`index.html` includes a descriptive title, search description, Open Graph metadata,
and a large-image sharing card. The tracked 1200 x 630 PNG is rendered from the
design kit's actual winged-horse asset and light-theme tokens, without external
fonts or images. To regenerate it after a brand change, install Chromium and run:

```sh
npm run brand:preview
```

The renderer writes a content-hashed image into `public/` and updates its filename
in `index.html`. Normal builds use the tracked PNG and do not need a browser.
Canonical and sharing URLs use `https://www.abdalkhani.com/`; update these together
in `index.html` if the public hostname changes.

## GitHub Actions

`.github/workflows/checks.yml` runs lint, the production build, and the Chromium/
WebKit suite on pushes to `main` and pull requests from this repository. It uses
Node.js 24, pinned official actions, and saves browser reports/screenshots for
seven days. Fork pull requests do not receive the private-package credential and
are skipped; run their checks locally before accepting changes.

After checks pass on `main`, the image job builds and publishes to
`forgejo.abdalkhani.com/abdalkhani-homelab/homepage`. Pushes to `main` and manual
runs on `main` publish images; pull requests and manual runs on other branches
only run the checks. Images include `linux/amd64` and `linux/arm64` variants,
tagged `latest` and `sha-<full-commit-sha>`. The job summary records the image
digest for reproducible deployment and rollback. Publishing an image does not
restart or change the LXC.

Configure these repository Actions settings before enabling the first publish:

| Setting | Type | Required access |
| --- | --- | --- |
| `FORGEJO_PACKAGES_TOKEN` | Secret | Read the private `abdalkhani-homelab` npm packages |
| `FORGEJO_REGISTRY_TOKEN` | Secret | Push container images under `abdalkhani-homelab` |
| `FORGEJO_USERNAME` | Variable | Forgejo account associated with the registry token |

The registry account needs write access to the package owner. Package visibility
follows the owner/organization's access settings; retain the intended private
access on `abdalkhani-homelab`. Both the npm endpoint and container registry must
be reachable from the GitHub-hosted runner. Missing settings fail with a clear
setup message. See [Forgejo package access](https://forgejo.org/docs/latest/user/packages/#access-restrictions).

The image job creates an npm configuration in the runner's temporary directory,
outside the Docker build context. This file contains only a `${FORGEJO_TOKEN}`
placeholder; the package token is supplied separately as the `forgejo_token`
BuildKit secret. Both are available only during `npm ci`, and the temporary file
is removed after the job. The registry token is used only for publishing. The
tracked `.npmrc` remains scope routing only.

## Deploy the published image

The default `docker-compose.yml` pulls the CI image. Wait for the first successful
publish on `main` before switching an existing LXC to this configuration. For a
private image, log in to Forgejo using an account/token with pull access:

```sh
docker login forgejo.abdalkhani.com
docker compose pull
docker compose up -d
```

Run these commands from the repository directory on the LXC after updating its
checkout. The container name (`homepage`), port mapping (`8080:80`), and restart
policy are preserved. Deployment requires Docker and registry pull access;
it does not install npm dependencies or need an npm credentials file.

To pin a deployment or roll back, set `HOMEPAGE_IMAGE` in the LXC's environment
or its ignored `.env` file to a previously published tag or digest:

```ini
HOMEPAGE_IMAGE=forgejo.abdalkhani.com/abdalkhani-homelab/homepage@sha256:<published-digest>
```

Use the complete digest from the CI job summary in place of the placeholder,
then run `docker compose pull` and `docker compose up -d`. Record the current
digest before upgrading if you want an explicit rollback target.

## Build an image locally

`docker-compose.build.yml` is a separate, standalone configuration for local
builds. Use it instead of the deployment Compose file. It tags the result as
`abdalkhani-homepage:local`, preserving access to a local build without replacing
the published image tag.

This build supplies your user-level `~/.npmrc` as a BuildKit secret during
dependency installation. For this file-based Compose build, that config should
contain a resolved authentication token. The runtime image contains only the
compiled site and Nginx configuration. Node runs on the builder's native platform;
the final Nginx image uses the requested deployment platform.

```sh
docker compose -f docker-compose.build.yml build --print | \
  docker buildx bake --file - \
  --allow="fs.read=${HOMEPAGE_NPMRC:-$HOME/.npmrc}" --load
docker compose -f docker-compose.build.yml up -d
```

To select a different credentials file outside the repository:

```sh
export HOMEPAGE_NPMRC=/absolute/path/to/npm-config
docker compose -f docker-compose.build.yml build --print | \
  docker buildx bake --file - \
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
versions without Bake's filesystem entitlement check,
`docker compose -f docker-compose.build.yml build` also works.

The project `.npmrc` contains scope routing only. Keep credential-bearing configs
outside the build context. Use secret mounts rather than Docker build arguments
for credentials; see [Docker build secrets](https://docs.docker.com/build/building/secrets/).
