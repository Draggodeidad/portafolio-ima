# Styling conventions

`DESIGN.md` defines the notebook's appearance. `src/styles/tokens.css` is the source for semantic colours, typography, spacing, grid and motion; Tailwind CSS 4 exposes these through `@theme inline`. Use roles such as `paper`, `ink`, `graphite`, `font-body`, `text-h2` and `text-body` rather than duplicating values. The 20 px grid and 10 px half-cell govern spacing.

Keep layout, spacing and responsive behaviour in Tailwind utilities. Group complete static class strings in a local `styles` object, and use `cn()` for conditional classes and caller-provided `className`. Use CVA for reusable components with real variants; the imported Iconiq Button retains its variants. CSS Modules hold component-specific decorative effects and motion.

Notebook pages share paper, grid and a red margin. Content starts to the right of that rule, and home sections use 40 px vertical padding to produce an 80 px interval between sections. Global resets and focus styles live in the base layer of `src/app/globals.css` so utilities can override them. Maintain visible focus, accessible touch targets, reduced-motion alternatives, and readable content without decorative effects.

Schibsted Grotesk is loaded with `next/font/google`; role utilities carry their own size, weight, leading and tracking. Preserve static content as Server Components and add client boundaries only for interaction.
