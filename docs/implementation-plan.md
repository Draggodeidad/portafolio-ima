# Implementation plan

## Stage 1 — foundations and navigation

Build the Next.js App Router foundation for `/es` and `/en`, typed navigation copy, shared CSS tokens and base typography, reusable `Container` and `SectionHeading` components, and the responsive fixed navbar. Add only minimal section destinations so links, locale switching, active-section tracking, and anchor offsets can be reviewed before the hero stage.

The current implementation uses `next-intl` with Spanish and English JSON messages. Translation lookup stays in Server Components; the interactive navbar receives only the localized strings it renders. The locale switch preserves the selected section hash. `/` resolves to `/es` without browser-language negotiation.

### Design findings and implementation decisions

- Figma node `12:3395` (`Header`) is outside `Main` (`12:2701`). The header is a 64 px fixed bar with an IA monogram, centered section navigation, ES/EN switch, contact action, and profile icon. Its screenshot is the visual reference for the navbar.
- Figma uses `#C2F362` for the lime, while `docs/DESIGN.md` proposes `#C4F564`; the implementation centralizes the Figma lime as the primary visual token and retains the brief's remaining content and palette guidance.
- Figma's header surface is `rgba(18,20,22,.75)` (over the dark canvas), while the brief's base background is `#101214`. Keep the page base from the brief and apply the Figma header surface with an opaque `#121416` fallback.
- Keep static page and section content server-rendered; limit client behavior to menu state and active-section observation.
- Figma's desktop-only header does not specify a mobile composition. Adapt it to a compact brand, locale switch, and accessible menu button with a collapsible panel.
- Do not copy Figma's decorative system status, coordinates, location, or uptime copy into actual portfolio content.

### Scope boundary

No hero, project details, biography, contact form, external service, or deployment work in this stage. Stop for visual review after lint, typecheck, production build, and browser checks at desktop and mobile widths.

## Stage 2 — Perfil HUD + System Playground

Implemented on `feat/stage-2-hero-profile-hud`. Replaced the `#inicio` placeholder with a responsive two-column hero, bilingual confirmed copy, Iconiq Button CTAs, and a CSS HUD frame with an IA monogram. The three selectors are a small client island; page copy and frame remain server rendered. The destinations use the existing `#proyectos` and `#contacto` section IDs. The CV action stays hidden because no CV file is configured. `src/content/profile.ts` is the optional local configuration point for a future real portrait and CV.

### Design findings and deliberate differences

- Queried the current Hero (`12:2714`), left content (`12:2716`), HUD frame (`12:2764`) and three node layers (`12:2799`, `12:2805`, `12:2811`) in Figma. The current Hero screenshot and child renders show the same two-column composition and 4:5 HUD frame. The token `--portfolio-accent: #C2F362` already matches Figma; Space Grotesk and JetBrains Mono are also already configured.
- Replaced the mockup's system identifier, coordinates, channel, transmission state, language/stack metrics and unsupported high-performance specialization with “Perfil de desarrollador” / “Developer profile”, “Perfil técnico” / “Technical profile”, and a real “ES / EN” label. The Figma photo placeholder is now a designed IA monogram; adding a photo requires a local file and one config value.
- Kept the desktop selectors around the frame and placed them in a compact row on smaller screens to prevent clipping and preserve comfortable touch targets. The explanatory copy stays visible and reserves space on selection changes.
- Figma's lime button used dark olive text. The implementation uses the existing `#101214` accent foreground to keep the CTA contrast strong. Figma's project and CV icons are local SVGs; the CV icon is unused until a real CV is configured.
- Added Next's development-only `allowedDevOrigins` entry for `127.0.0.1` after Next 16.4 blocked the browser's dev assets and HMR for the preview host. Added a local IA app icon using the existing visual identity.
- No Canvas UI, Three.js, WebGL, project section content, contact form or Stage 3 work was added.

### Component provenance

Iconiq Button was retrieved from the official `@iconiq/b-button` registry and adapted to the existing `cn()` utility and tokens. Bencho's official Action node export was opened and reviewed at `https://bencho.dev/blocks/action-node`; the block is an automation-step card with a corner action fan, so it does not match the three category selector buttons. The selectors are therefore custom and their substitution is recorded in `docs/component-sources.md`.
