# Styling conventions

`DESIGN.md` defines the notebook's appearance. `src/styles/tokens.css` is the source for semantic colours, typography, spacing, grid and motion; Tailwind CSS 4 exposes these through `@theme inline`. Use roles such as `paper`, `ink`, `graphite`, `font-body`, `text-h2` and `text-body` rather than duplicating values. The 20 px grid and 10 px half-cell govern spacing.

## Component classes

Keep layout, spacing and responsive behaviour in Tailwind utilities. Group complete, statically detectable class strings in a semantic local `styles` object outside the component when they do not depend on props. Use `cn()` for conditional classes, with a caller-provided `className` last:

```tsx
const styles = {
  root: "border border-page-edge bg-paper p-5",
  title: "text-h2 text-graphite",
  active: "text-ink",
} as const;

<section className={cn(styles.root, active && styles.active, className)}>
  <h2 className={styles.title}>{title}</h2>
</section>;
```

`cn()` in `src/lib/cn.ts` combines `clsx` with `tailwind-merge`. Keep utility names literal; do not construct class names dynamically. Check compositions involving semantic `text-*` roles: `tailwind-merge` can confuse custom text sizes with colours and remove a needed class.

## Variants and effects

Use CVA only for reusable components with real variants, deriving variant types from their definitions. The imported Iconiq Button retains its CVA variants; do not duplicate those classes in a separate styles object.

Use CSS Modules for complex effects specific to a component, such as ink strokes, tape, grid effects and motion. Keep ordinary layout, spacing and responsive behaviour in Tailwind utilities. Static style objects alone do not require a client boundary; preserve Server Components unless interaction requires one.

## Document defaults and accessibility

Element resets and shared focus styles live in `@layer base` in `src/app/globals.css`. Unlayered rules outrank Tailwind's layered utilities and can silently override component text colour, font or outline utilities. Keep focus visible and interactive targets comfortably sized.

Schibsted Grotesk is loaded with `next/font/google`. Semantic typography roles provide size, weight, leading and tracking. Body text and form input text use at least 16 px; small, label and annotation roles are reserved for secondary or functional text and remain at least 14 px. Use the defined roles rather than arbitrary smaller sizes.

Each component owns its `prefers-reduced-motion` alternative: information and state remain visible without the animation. There is no global animation kill rule; the global preference only disables smooth scrolling. Preserve keyboard access and readable content when decorative effects are unavailable.

## Notebook layout

Notebook pages share paper, the 20 px grid and a red margin. Content starts to the right of that rule, and home sections use 40 px vertical padding to produce an 80 px interval between sections. The spread is capped at `--content-width`, with shared page gutters and navigation height defined in the tokens.
