# Imanol Antonio De la Cruz — Portfolio

Bilingual portfolio foundation built with Next.js App Router, React, TypeScript, next-intl, Tailwind CSS, and CSS design tokens.

## Requirements

- Node.js 20.9 or newer
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

The current page contains only minimum section destinations for reviewing navigation. The hero and portfolio content are intentionally left for later stages.

See [docs/styling.md](docs/styling.md) for the styling conventions used in components.
