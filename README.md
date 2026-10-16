# Imanol Antonio De la Cruz — Portfolio

Bilingual portfolio built with Next.js App Router, React, TypeScript, next-intl, and Tailwind CSS. Includes the profile HUD, project case studies, About, stack, and contact sections.

Public address: [itsdraggodeidad-portfolio.vercel.app](https://itsdraggodeidad-portfolio.vercel.app).

## Requirements

- Node.js 24 (`nvm use`, matching Vercel and GitHub Actions)
- pnpm 11.4.0 (pinned in `package.json`)

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm start
pnpm test:e2e
```

The root path redirects to `/es`; the English version is at `/en`.

## Structure

```text
messages/            # Locale-specific JSON messages (es/en)
src/
  i18n/              # next-intl routing, navigation, and request config
  app/
    [locale]/        # Localized App Router layout and page
    globals.css      # Base styles and accessibility defaults
  components/
    layout/         # Container and navigation
    sections/       # Reusable section heading
  styles/
    tokens.css       # CSS design tokens exposed to Tailwind's theme
  lib/
    cn.ts            # Conditional class composition and Tailwind conflict merging
  lib/i18n/          # Shared section IDs
docs/
  DESIGN.md          # Portfolio design brief
  implementation-plan.md
```

## Deployment

GitHub Actions validates pull requests to `main`. Pushes to `main` run lint, formatting, production build, type checks, and Playwright before deploying the tested artifact to Vercel. Failed checks stop publication. PRs do not deploy previews or receive Vercel secrets.

To test a production build locally:

```bash
pnpm build
PLAYWRIGHT_PRODUCTION=1 pnpm test:e2e
```

The contact form stays disabled until a provider is configured; GitHub and LinkedIn links remain available. CV and unconfirmed experience are omitted.

See [docs/deployment.md](docs/deployment.md) for secrets, pipeline behavior, token renewal, and rollback.

See [docs/styling.md](docs/styling.md) for the styling conventions used in components.
