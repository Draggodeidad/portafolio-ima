# Deployment and CI/CD

## Project and address

- Repository: `Draggodeidad/portafolio-ima`; production branch: `main`.
- Vercel project: `itsdraggodeidad`, under `imanol-antonio-de-la-cruzs-projects`.
- Public origin: <https://itsdraggodeidad-portfolio.vercel.app>.
- The originally requested `itsdraggodeidad.vercel.app` was unavailable. The user selected the current alternative.
- Runtime: Node.js 24; package manager: pnpm 11.4.0. Keep the single `pnpm-lock.yaml` and use frozen installs.

`vercel.json` sets the Next.js preset and disables Git-triggered Vercel deployments. GitHub Actions owns production publication. No custom DNS or GitHub Pages configuration is required.

## Pipeline

`.github/workflows/ci-cd.yml` runs for PRs targeting `main` and pushes to `main`. It installs the locked dependencies, runs ESLint and Prettier, builds, generates Next.js types, checks TypeScript, and runs Playwright against `next start` on port 3001. CI uses Playwright's Chromium with two workers; local runs keep Chrome and the development server unless `PLAYWRIGHT_PRODUCTION=1` is set.

PR builds run `pnpm build` without deployment credentials. Pushes use a pinned Vercel CLI, `vercel pull --environment=production`, and `vercel build --prod`. After all checks pass, `vercel deploy --prebuilt --prod` uploads that artifact without rebuilding it remotely. A failing check prevents the deployment step; a failed post-deployment smoke check marks the run failed and requires investigation or rollback.

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
