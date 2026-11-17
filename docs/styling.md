# Styling conventions

The project uses Tailwind CSS 4. Keep layout, spacing, responsive behavior, and ordinary component states in Tailwind utilities. `src/styles/tokens.css` is the source of reusable design values and maps semantic colors, fonts, and radii into Tailwind with `@theme inline`. `src/app/globals.css` is reserved for resets, document defaults, accessibility defaults, and reduced-motion behavior.

## Component classes

Group complete, static class strings in a component-local `styles` object. Keep it outside the component when it does not depend on props. Use semantic keys and compose state with `cn()`:

```tsx
const styles = {
  root: "grid items-center gap-6",
  title: "font-display text-3xl text-foreground",
  active: "bg-accent text-accent-foreground",
} as const;

<section className={cn(styles.root, active && styles.active, className)} />;
```

`cn()` in `src/lib/cn.ts` combines conditional classes with `clsx` and resolves Tailwind utility conflicts with `tailwind-merge`. Put a caller-provided `className` last. Keep utility names literal so Tailwind can detect them; do not construct utility names dynamically.

## Variants

Use CVA only for a reusable component that has meaningful variants. Keep the base composition in CVA and avoid repeating the same variant classes in a separate `styles` object. There are no such components in the current foundation, so CVA is not installed.

## CSS Modules

Use a component CSS Module for effects that are clearer as scoped CSS, including pseudo-elements, HUD signal effects, glass surfaces, `@supports` rules, and effect-specific fallbacks. Keep structural layout and responsive utilities in Tailwind. The navbar's liquid glass surface is isolated in `navbar-glass.module.css`, with an opaque fallback and blur enhancement under `@supports`.

Preserve keyboard focus, reduced-motion behavior, readable contrast, and functionality when decorative effects are unavailable. Do not add client boundaries solely to organize styles.

The Stage 2 hero keeps its main grid, spacing, and button states in Tailwind. Its scoped module (`src/components/hero/hero.module.css`) also positions the three nodes against the HUD frame because those percentage offsets and connection endpoints form one component-specific composition; it contains the reticle, responsive paths, one-shot selection signal, and liquid-glass enhancement with an opaque fallback. The node selector owns only its selected-node state; descriptive content and frame stay server-rendered. The imported Iconiq Button keeps its real CVA variants, with the hero supplying token-based `className` overrides.

Stage 3 keeps the decorative Glass Object in the small `HudVisual` client island. The HUD's square reservation, static SVG fallback, and monogram remain in the existing composition. `hero.module.css` owns only the component-specific canvas/fallback layering and loaded-state detail; Tailwind continues to own page layout. The effect starts only after viewport entry, WebGL support, and motion preference checks. Reduced motion, renderer/asset errors, and context loss restore the static ring. The build flag `NEXT_PUBLIC_ENABLE_HUD_GLASS=true` enables the experimental effect; without it, the server-rendered fallback is the default.

Stage 4 project content stays in server-rendered components and a typed local data module. `projects-section.tsx` and the case route keep their complete utility strings in local semantic `styles` objects. Project diagrams use ordinary HTML/CSS and labelled text instead of product screenshots or another rendering engine. The single Figma section canvas color is exposed as the `project-canvas` theme token; shared background, surfaces, borders, typography, and spacing continue to use existing tokens and utilities.

Stage 5 profile sections remain Server Components backed by typed local profile/skill/experience data and localized messages. Their layout and form controls use semantic local `styles` objects with existing Tailwind theme tokens. The experience timeline is rendered only when a complete confirmed entry exists. Lucide icons already present through Iconiq are used for skill groups and social links; no icon package was added. The unavailable contact form does not add a client boundary because it has no interactive submission behavior.

Global element resets (`a`, `button`, `:focus-visible`) live in `@layer base` in `src/app/globals.css`. Unlayered rules outrank every Tailwind layer, so a reset outside a layer silently discards text-colour, font, and outline utilities. The Iconiq Button maps its `--ic-*` and `--button-*` variables to portfolio tokens inside `b-button.tsx`; there are no OS-dependent `dark:` variants because the site has a single dark theme.

Glass surfaces declare only the unprefixed `backdrop-filter` inside `@supports (backdrop-filter: …)`. When a rule pairs `-webkit-backdrop-filter` with `backdrop-filter` and the value uses `var()`, the CSS compiler drops both declarations, which left the navbar translucent but unblurred. The compiler already adds the `-webkit-` alternative to the `@supports` condition. The translucent background belongs inside the same `@supports` block so browsers without blur keep the opaque fallback.

The hero area selector (`node-selector.tsx`) is a size container (`@container`); its tiles switch from stacked rows to three across at Tailwind's `@sm` container width, and `hero.module.css` mirrors that with `@container (min-width: 24rem)` for the cursor and connector. Below `lg`, `HudDisclosure` collapses the HUD into a single toggle row.

Typography floor: functional text (labels, metadata, tags, navigation, diagram labels) uses Tailwind's `text-xs` (12px) as the minimum; no `text-[9px]`, `text-[10px]`, or `text-[11px]` remain. Use the built-in scale rather than a custom `--text-*` token: `tailwind-merge` cannot tell a custom `text-label` from a colour, so `cn()` would drop the neighbouring `text-{colour}` class. Headings get `text-wrap: balance` and running text (`p`, `li`, `dd`, `figcaption`, `blockquote`) gets `text-wrap: pretty` from `@layer base` in `globals.css`. Case-study prose is capped at `max-w-prose`.

Fonts load through `next/font/google` in `src/app/[locale]/layout.tsx`, which exposes `--font-space-grotesk` and `--font-jetbrains-mono`; `tokens.css` builds the `--portfolio-font-*` stacks from them. Both Next and the vinext Workers build self-host the files with metric-matched fallbacks, so no request goes to Google at runtime.
