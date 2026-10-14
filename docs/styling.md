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
