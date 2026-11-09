# Deployment and CI/CD

## Current evaluation scope

The 2026-11-09 Cloudflare/vinext work is **local evaluation only**. The existing Vercel information below describes the previously configured deployment; it does not authorize publication of this branch. No push, PR, deployment, infrastructure, DNS, secret, or email operation is part of the evaluation. See the local Workers section at the end for its reproduction steps and measured limits.

## Project and address

- Repository: `Draggodeidad/portafolio-ima`; production branch: `main`.
- Vercel project: `itsdraggodeidad`, under `imanol-antonio-de-la-cruzs-projects`.
- Public origin: <https://itsdraggodeidad-portfolio.vercel.app>.
- The original assignment request for `itsdraggodeidad.vercel.app` returned a conflict. The user selected the current alternative.
- Runtime: Node.js 24; package manager: pnpm 11.4.0. Keep the single `pnpm-lock.yaml` and use frozen installs.

`vercel.json` sets the Next.js preset and disables Git-triggered Vercel deployments. GitHub Actions owns production publication. No custom DNS or GitHub Pages configuration is required.

## Pipeline

`.github/workflows/ci-cd.yml` runs for PRs targeting `main` and pushes to `main`. It installs the locked dependencies, runs ESLint and Prettier, builds, generates Next.js types, checks TypeScript, and runs Playwright against `next start` on port 3001. CI uses Playwright's Chromium with two workers; local runs keep Chrome and the development server unless `PLAYWRIGHT_PRODUCTION=1` is set.

PR builds run `pnpm build` without deployment credentials. Pushes use a pinned Vercel CLI, `vercel pull --environment=production`, and `vercel build --prod`. After all checks pass, `vercel deploy --prebuilt --prod` uploads that artifact without rebuilding it remotely. Explicit non-interactive JSON output keeps the deployment result format consistent between CI and agent sessions. A failing check prevents the deployment step; a failed post-deployment smoke check marks the run failed and requires investigation or rollback.

Production runs are serialized. Immediately before publication, the workflow compares its SHA with the current `main` SHA and skips superseded commits. This comparison prevents publishing commits already known to be outdated; a push arriving during an upload will be handled by the next serialized run.

The run summary includes the commit, immutable deployment URL, and public address. On failures, Playwright reports, screenshots, and traces are retained as Actions artifacts for seven days. The workflow does not upload `.vercel` or environment files.

## Credentials and configuration

Configure these repository Actions secrets in GitHub Settings → Secrets and variables → Actions:

| Secret              | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Dedicated deployment token with access to the project team's scope. |
| `VERCEL_ORG_ID`     | Team ID from the local ignored `.vercel/project.json`.              |
| `VERCEL_PROJECT_ID` | Project ID from the same file.                                      |

Only production steps on pushes receive these secrets. The workflow uses read-only repository permissions and does not use `pull_request_target`. Actions are pinned to verified commit SHAs. Missing secrets fail the run explicitly.

Create the dedicated token at <https://vercel.com/account/tokens>, then paste it directly into GitHub's `VERCEL_TOKEN` secret. Never commit it, print it, or share it in chat. Renew the secret before the token's expiration and revoke the old token after verifying a successful deployment. The locally authenticated Vercel app cannot create tokens; this step requires the account owner's UI access.

`SITE_URL` is the public canonical origin, configured in Vercel production. `src/lib/site-config.ts` contains the same confirmed origin as a fallback. `.env.example` documents it for local use. If the address changes, update this variable, the fallback, and the workflow's smoke-check/summary URLs together. Canonicals and ES/EN alternates use this origin on both home and case-study routes.

## Local verification

```bash
nvm use
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm build
pnpm typecheck
PLAYWRIGHT_PRODUCTION=1 pnpm test:e2e
```

CI installs Chromium with `pnpm exec playwright install --with-deps chromium`. Local Chrome remains the default. The suite covers navigation, locale switching, case studies, 404s, layout, reduced motion, disabled contact submission, root redirection, assets, and canonical/language metadata. Existing opt-in WebGL tests may be skipped while the experimental effect is disabled.

## Operation and recovery

Push reviewed changes to `main` to publish. Check the Actions run before assuming the site updated. Failed build/test checks leave the previous production deployment serving traffic. If a token expires, replace `VERCEL_TOKEN` and rerun the failed workflow.

To recover from a regression after publication, open the Vercel project's Deployments list and use Instant Rollback to select a known good production deployment. This restores serving traffic without creating a Git merge. Follow with a corrective commit or revert on `main`; a later successful pipeline publishes its current contents again. Do not rerun an old workflow to roll back: the stale-commit guard intentionally skips it.

After publication, verify HTTPS, `/` → `/es`, both home locales, all six case-study routes, the icon, and interactive mobile navigation. The Actions smoke step checks HTTP availability; browser tests verify behavior before publication.

This pipeline does not configure contact email delivery, add CV content, enable the optional WebGL effect, or claim Lighthouse results.

## Local Workers evaluation

Use Node 24 (`nvm use`) and pnpm 11.4.0. `pnpm install --frozen-lockfile` uses the single existing lockfile. The Next commands (`dev`, `build`, `start`, `typecheck`) remain available; no deployment script was added. Worker configuration contains no account ID, route, secret, or remote service. `ASSETS` serves only build/public files. The Vite plugin disables remote bindings and persistent state; there is no cache or Images service adapter. `workers_dev` and `preview_urls` are false.

```bash
pnpm check:workers
WRANGLER_SEND_METRICS=false CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm build:workers
WRANGLER_SEND_METRICS=false CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm test:e2e:workers --workers=2 --output=/tmp/portafolio-workers-playwright
# Persistent local preview of the same build:
WRANGLER_SEND_METRICS=false CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm preview:workers --host 0.0.0.0 --port 3103 --strictPort
ao preview http://127.0.0.1:3103/es
```

`vite preview` uses the Cloudflare plugin's Miniflare/workerd runtime with `dist/server/wrangler.json`. It serves the built artifact, not a Next or vinext Node server. `dev:workers` is available separately and is not a substitute for this check. Port 3102 belongs to the Playwright-managed Worker and 3103 to the persistent AO preview. `PLAYWRIGHT_PORT` can override test ports; Workers never reuse an existing server. Logs, traces, and screenshots for this evaluation belong in `/tmp`; set `WRANGLER_LOG_PATH=/tmp/portafolio-wrangler.log` to redirect Wrangler's own log.

To repeat Next validation after Workers:

```bash
pnpm lint
pnpm format:check
pnpm build
pnpm typecheck
PLAYWRIGHT_PRODUCTION=1 PLAYWRIGHT_PORT=3101 pnpm test:e2e --workers=2 --output=/tmp/portafolio-next-playwright
```

Both toolchains generate `.next/types` and rewrite `next-env.d.ts`; run them sequentially and use `pnpm typecheck` to regenerate Next's route/root-params declarations before checking the combined source tree. Do not hand-edit the generated declarations or interpret a generator-only diff as an application change. Generated Workers output/state is gitignored and excluded from lint/typecheck.

The active next/image instances use local SVG icons; there is no configured portrait or raster content. Next automatically bypasses optimization for `.svg`. The evaluation checks rendered image decoding and direct delivery of every SVG. No Cloudflare Images binding is configured, so resizing/transcoding parity with Next's optimizer is not claimed. A future raster portrait needs an explicit optimization decision and its own tests.

Revalidated primary sources: [vinext migration](https://vinext.dev/docs/getting-started/migrating), [Workers integration](https://vinext.dev/docs/deploying/cloudflare), [Next differences](https://vinext.dev/docs/reference/differences), [Cloudflare Vite API](https://developers.cloudflare.com/workers/vite-plugin/reference/api/), [next-intl routing](https://next-intl.dev/docs/routing/setup), and the installed Next 16.4 guides under `node_modules/next/dist/docs/`. The pinned vinext initializer's Wrangler and CSS Modules recipes were also inspected; the current web docs describe a newer Cloudflare plugin v2/beta path. npm's published peer metadata was checked before installation.

### Recorded local result — 2026-11-09

The original Next baseline passed lint, formatting, build, typecheck, and 38 Playwright tests (4 opt-in WebGL skips). After adding the seven migration checks, the final Next run with the catch-all included passed 45 tests (4 skips, 50.9 s). Workers' final production-artifact run passed the same 45 tests (4 skips, 52.2 s). `vinext check` reports 12 supported, zero partial, zero issues; that static scan does not replace the workerd run.

Pinned runtime/tooling: Node 24.16.0, pnpm 11.4.0, Next 16.4.0, next-intl 4.14.9, React/DOM/RSC 19.3.1, vinext 1.4.4, Vite 8.3.6, plugin-react 6.1.0, plugin-rsc 0.5.39, Cloudflare Vite plugin 1.67.0, Wrangler 4.158.0, vite-css-modules 1.16.1. The preview's runtime is Miniflare 5.20261101.0-beta/workerd 1.20261101.1 (reports `workerd 2026-11-01`), not Wrangler's separate bundled workerd version. Its supported compatibility date is pinned to 2026-11-08. Frozen installation verifies 708 entries without release-age exclusions.

Adaptations are ESM package mode (fixes the missing `ssr/index.js` entry), the initializer's deterministic CSS Modules recipe, the supported compatibility date, and a catch-all App Router page that calls `notFound()` (fixes vinext's HTTP 200 unmatched-route fallback). Existing `next/root-params`, `src/proxy.ts`, next-intl configuration, and `node:os` remain unchanged. No monkeypatch or fork was used. `wrangler types /tmp/portafolio-worker-env.d.ts` also passed and generated the ASSETS binding declarations outside the repository.

The artifact inventory is reproducible without a deploy command:

```bash
python3 - <<'PY'
from pathlib import Path
import gzip
files = [p for p in Path('dist/server').rglob('*') if p.suffix in ('.js', '.mjs', '.wasm')]
print(len(files), sum(p.stat().st_size for p in files),
      sum(len(gzip.compress(p.read_bytes(), mtime=0)) for p in files))
PY
```

Measured: 124 modules, 2,255,770 raw bytes, 689,514 bytes summed gzip. This excludes static assets/sourcemaps and is not the upload size or evidence of meeting hosted Worker limits. The optional Three.js chunk is still emitted, but the effect remains off by default. Browser tests verify zero hero canvases.

Local Chrome captures in `/tmp/portafolio-{next,workers}-{es,en}-{360,390,768,1280}.png` were pixel-identical across the eight paired home views with reduced motion. This is a local rendering comparison, not a fresh Figma or production performance audit. The primary application remains available in AO at `http://127.0.0.1:3103/es` while its preview process runs.

Remaining warnings include duplicate CSS asset emission, RSC sourcemaps, ineffective dynamic imports in vinext shims, the optional >500 KB chunk, and partial webpack customization support. They were not suppressed; observed CSS and browser behavior match Next. Existing ESLint peer-range warnings remain. Next also emitted its security-upgrade recommendation before the first build after dependency changes; repeating the build proceeded. No security-upgrade workflow or unrelated updates were run.

**Verdict: locally viable with the recorded adaptations and tested versions.** Not evaluated: real Cloudflare deployment, edge startup/CPU/quotas, cache behavior across instances, raster resizing, real-device performance, production Lighthouse, or contact delivery. No service was purchased or provisioned. Hosted adoption requires a separate authorized phase; this branch does not change CI, the canonical origin, or the current Vercel deployment.

Rendering differs: Next's build reports the home pages and six studies as SSG, while this vinext build reports dynamic routes, with no prerender or cache adapter configured. Local visual and functional parity does not demonstrate parity in per-request rendering cost, CPU usage, or caching. Choosing and measuring a hosted rendering/cache strategy remains a separate decision; no additional implementation was added to address it here.
