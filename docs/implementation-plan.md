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
