# Deployment and CI/CD

## Automated Workers release — 2026-11-09

This section supersedes the historical Vercel pipeline and manual-release instructions below. GitHub Actions now owns publication to `https://imanolantonio.dev`; Vercel publication steps and their credential requirements have been removed. Next.js validation remains as a compatibility gate.

Every PR targeting main and push to main runs lint, formatting, Next build, typecheck and Next production e2e, plus a separate Workers compatibility check, production build and workerd e2e suite. After successful Workers tests, main pushes archive the complete `dist` tree (including snapshots and generated configuration). The `deploy-workers` job requires both validation jobs to succeed, downloads that same run's commit-named artifact and runs `pnpm exec wrangler deploy --config dist/server/wrangler.json`. It never rebuilds or adds `--env` to the flattened production configuration. PRs cannot enter this job and validation does not need deployment credentials.

Configure repository Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Use a token limited to the intended account with Workers deployment and the permissions required for the configured Custom Domain; see [Cloudflare's GitHub Actions setup](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) and [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). Secrets are exposed only to the deploy step; missing values fail explicitly without printing them. No Vercel secrets are needed by this workflow.

Production workflows remain serialized, and the deploy job skips a commit if main has already advanced. The workflow uses read-only repository permissions and pinned actions. Artifacts expire after seven days. Each successful deploy writes the commit and public origin to the run summary. Restoring an artifact into a fresh runner preserves its relative `dist/server` → `dist/client` asset paths.

The first successful main run publishes the configured Worker and requests attachment of `imanolantonio.dev` as a Custom Domain. Before merging, the owner must configure the secrets and ensure the domain is in the intended Cloudflare account with no conflicting records. This implementation does not provision secrets, execute deployment locally, or change DNS. After release, verify domain/certificate readiness, public routes, canonical URLs, HIT headers and inaccessible private snapshots using the checks below. Hosted behavior remains unverified until that run. Rollback remains available through the Worker's Deployments view.

## Production preparation for imanolantonio.dev — 2026-11-09

This section supersedes the earlier dynamic/no-cache evaluation for the current PR head. The user authorized production configuration, prerender/cache implementation, tests, commits and PR #8 updates. No merge, deployment, authentication, DNS change, secret provisioning, email, or infrastructure mutation was performed. The existing Vercel deployment workflow remains unchanged; review/disable its publication path in a separately authorized cutover before merging to main if Vercel publication is no longer wanted.

### Rendering and cache decision

Use `@vinext/cloudflare` 1.3.3's official `staticAssetsAdapter()` with `prerender: { routes: "*" }`. All content is local and public, with no working contact endpoint or personalized data. Build-time discovery produces the two home pages and six studies; the catch-all is skipped and continues to return runtime 404. The adapter packages eight HTML and eight RSC snapshots under `dist/client/_vinext/static-cache/`, accessed internally via ASSETS. No KV, R2, Response Store, Images service, paid cache or runtime cache writes are required.

Successful static response reads emit `X-Vinext-Cache: HIT`. Content is immutable for a deployment: changes require a fresh build and deployment; revalidatePath/revalidateTag, ISR intervals and cache warming do not refresh these snapshots. Request-specific features must opt out or adopt an explicitly reviewed writable cache later. The footer year is also captured at build time. Query parameters do not personalize these pages, and language identity is in the pathname. Do not add a blanket Cache Everything rule over HTML/RSC or private snapshot files.

The router summary still prints dynamic route patterns. The prerender manifest (eight rendered paths), sixteen packaged snapshots and workerd HTML/RSC HIT tests establish the implemented serving strategy. Middleware, redirects, fallback routes and ASSETS lookup still execute in the Worker; this is not a zero-CPU static export or evidence of hosted quota/cost parity with Next SSG.

`run_worker_first` covers every path except hashed `_next/static` assets. This prevents direct access to `/_vinext/static-cache/*`. Keep these protections intact. Hashed client assets retain the plugin's normal immutable asset handling. The next-intl `alternateLinks` response header is disabled because it otherwise persisted the temporary prerender origin in snapshots. Canonical and hreflang HTML metadata remains defined by each page and is tested for all eight paths.

### Environment and domain

The root Wrangler configuration remains local without public routes. Its `production` environment names the Worker `imanolantonio-portfolio`, declares the Custom Domain `imanolantonio.dev`, disables workers.dev and preview URLs, sets `SITE_URL=https://imanolantonio.dev`, and enables Worker observability. These are source declarations only: the domain is not attached until a future authorized deployment. No account ID or credentials are committed.

`build:workers:production` explicitly sets both CLOUDFLARE_ENV and SITE_URL. The origin must be correct during prerender, not only set after deployment. `test:e2e:workers:production` sets the same expected canonical origin. Existing Next/Vercel builds retain their original fallback origin. Public configuration is described in .env.example without creating an environment file or changing secrets.

### Reproduce locally (no deployment)

```bash
nvm use
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm check:workers
WRANGLER_SEND_METRICS=false CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm build:workers:production
WRANGLER_SEND_METRICS=false CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm test:e2e:workers:production --workers=2 --output=/tmp/portafolio-production-playwright
pnpm exec wrangler types /tmp/portafolio-production-env.d.ts --env production
pnpm build
pnpm typecheck
PLAYWRIGHT_PRODUCTION=1 PLAYWRIGHT_PORT=3101 pnpm test:e2e --workers=2 --output=/tmp/portafolio-production-next-playwright
```

CI now has an independent Workers validation job that performs a frozen install, compatibility scan, production prerender build and production-artifact Playwright run. It has no deployment command or credentials. The existing Next job also remains. Local preview: `pnpm preview:workers --host 0.0.0.0 --port 3105 --strictPort`, then `ao preview http://127.0.0.1:3105/es`. A later build replaces dist, so rerun the production build before using its preview or uploading its artifact.

### Validation of this preparation

Production build: eight prerendered paths, sixteen HTML/RSC snapshots. Full production-artifact Playwright in local workerd: 48 passed, 4 existing WebGL skips (50.9 s). Focused cache suite: 3 passed (5.1 s), including unknown routes returning 404 without a HIT. Next production Playwright: 45 passed, 7 skipped (49.8 s: four WebGL tests and three Workers-only tests). Canonical/hreflang checks use https://imanolantonio.dev for both homes and all six cases. The preview uses the same pinned Miniflare/workerd runtime recorded in the evaluation; no dependency upgrades beyond @vinext/cloudflare 1.3.3 were required, and no release-age exclusion was added.

Wrangler production types, lint, format check, compatibility scan and strict TypeScript passed. Next production build remains SSG for the eight content pages. Logs/screenshots/traces are in /tmp/portafolio-production-*; the primary AO preview is the local workerd build on port 3105. Upstream CSS/sourcemap/optional chunk warnings remain as documented below; no hosted CPU/quotas/performance results are asserted.

### Future manual release — instructions only, not executed

1. Review PR #8 and its two CI jobs. Approve the cutover and reconcile the old Vercel publication workflow before merging; this change does not merge or disable it remotely.
2. Confirm imanolantonio.dev is an active zone in the intended Cloudflare account. Choose whether www is needed; this PR declares the apex only. Check for conflicting DNS/CNAME records before any authorized domain attachment. No DNS record has been inspected or changed here.
3. Authenticate interactively with `pnpm exec wrangler login` in that account, or configure a suitably scoped deployment API token through the approved secret store. Do not put credentials in source. Authentication is not required for local tests.
4. Run the local checks above, ending with a fresh `pnpm build:workers:production` and `pnpm test:e2e:workers:production`. Inspect `dist/server/wrangler.json`: name must be imanolantonio-portfolio, SITE_URL must use the apex HTTPS origin, the route must have custom_domain=true, ASSETS must point to the generated client directory, and the private-cache routing exclusions must be intact. Keep the commit SHA and a copy of the tested artifact outside Git.
5. Only after explicit publication authorization, run `pnpm exec wrangler deploy --config dist/server/wrangler.json`. Use the flattened generated configuration, not the source root config; do not add --env again. This upload also requests the configured Custom Domain and therefore changes hosting/DNS/certificates. Do not execute it merely to validate configuration. No deploy or dry-run command was run for this PR.
6. Confirm Worker readiness and the Custom Domain certificate, then verify HTTPS, root redirect, ES/EN, all six cases, 404, canonical/hreflang domain, HTML and RSC navigation, HIT headers, SVG/images, mobile menu and disabled contact. Confirm private snapshot URLs return 404. Monitor Worker errors/CPU/request usage; local results cannot certify edge behavior or account limits.
7. If www is desired, separately authorize and configure its redirect to https://imanolantonio.dev using Cloudflare's documented redirect/DNS procedure; no www record or redirect is part of this preparation.
8. For rollback, use the Worker's Deployments view to restore the previous known-good version. For the first cutover keep Vercel available and retain the prior DNS/hosting state so the owner can reverse the domain attachment if necessary. Never rebuild an old commit with current content and call it the original artifact.

Primary references: [Static Assets response cache](https://vinext.dev/docs/guides/caching#static-assets-response-cache), [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [next-intl alternate links](https://next-intl.dev/docs/routing/configuration#alternatelinks-hreflang), installed adapter/runtime source and Wrangler schema.

## Historical local evaluation scope

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

## Contact provider — Resend (not deployed)

The app validates contact details and forwards them to the authenticated contact Worker. The Worker applies a five-attempt rolling-hour limit per hashed IP with a SQLite-backed Durable Object, validates the Turnstile token, hostname and `contact` action, then sends with Resend's HTTPS API. Resend acceptance is not proof of delivery. Failed verification, missing settings, API errors and quota exhaustion fail closed. No provider credentials or messages are logged.

### Setup before an authorized deployment

1. Create a Resend Free account. Add and verify a domain you own in Resend; add the SPF/DKIM records it provides in Cloudflare DNS. Set `CONTACT_FROM` to an address at that verified domain and `CONTACT_TO` to your mailbox. The free plan currently allows 100 emails per day and 3,000 per month; see [Resend pricing](https://resend.com/pricing) for current limits. API acceptance does not guarantee inbox delivery.
2. Create a managed Turnstile widget for `imanolantonio.dev`. Keep its secret private. The widget's action is `contact`. No paid Cloudflare Email Sending subscription or Email Routing is required for this setup.
3. After explicit authorization, deploy the separate Worker using `workers/portfolio-contact-email/wrangler.jsonc`. It uses workers.dev and provisions the SQLite Durable Object through its migration. Cloudflare's Workers Free plan supports SQLite-backed Durable Objects subject to free-tier limits; check [pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/). The Worker does not use a Cloudflare email binding.
4. In the contact Worker's **Settings → Variables and Secrets**, configure `CONTACT_FROM`, `CONTACT_TO`, `TURNSTILE_HOSTNAME` and secrets `AUTH_SECRET`, `TURNSTILE_SECRET`, and `RESEND_API_KEY`. Create a Resend API key with sending permissions and, if available, limit it to the verified sending domain. Never put secrets in source control or chat.
5. In the website Worker's **Settings → Variables and Secrets**, configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CF_WORKER_URL` (the contact Worker HTTPS URL), `CONTACT_IP_HEADER=cf-connecting-ip`, and secret `CF_WORKER_AUTH_SECRET` (identical to the contact Worker's `AUTH_SECRET`). The app exposes only the public sitekey through `/api/contact/config` with `Cache-Control: no-store`. The deployment uses `--keep-vars` to retain dashboard variables. For Vercel use `x-vercel-forwarded-for` instead, and ensure the selected platform overwrites the trusted IP header.
6. After separate authorization for deployment and a real test, submit with an address you control, check inbox and spam, verify Reply-To, and inspect provider activity and Worker errors. Do not enable test keys or fake destinations in production. The existing workflow deploys the website on pushes to `main`; merging this PR requires separate deployment authorization.

Local tests (`pnpm test:contact` and the opt-in Playwright contact suite) intercept Turnstile and Resend and never send real email. Resend Free quota exhaustion causes a generic send error and retains the visitor's message. The app does not queue submissions; an ambiguous network timeout can still occur after provider acceptance, so a retry may produce a duplicate. Cloudflare test keys do not return the production hostname/action, so automated tests simulate those fields; real verification and delivery remain untested.
