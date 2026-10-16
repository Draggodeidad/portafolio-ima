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

## Stage 3 — Canvas UI Glass Object

Integrated one small decorative glass ring into the existing IA HUD frame. The approved copy, CTAs, frame, monogram, category nodes, and navbar retain their Stage 2 structure. The ring is a project-local SVG; the visible inline SVG/CSS fallback stays rendered independently of WebGL.

`HudVisual` is the only new client boundary. It reserves a square around the monogram, waits for viewport entry and a WebGL2/motion-preference check, then dynamically loads the local Canvas UI React/WebGL component. The canvas is decorative and cannot capture pointer/touch input. The library's renderer already bounds pixel ratio and total buffer area, observes resize/viewport, pauses its animation loop when out of view or inactive, and disposes WebGL resources on destroy. The integration keeps the scene mounted after first entry so returning to the HUD does not reload the SVG; the renderer's own viewport observer pauses it offscreen. Motion preference changes reveal the static SVG and pause the scene without unmounting it. Successful same-origin asset requests are reused across development Strict Mode and locale remounts. Missing WebGL, load/renderer error, or lost context show the static ring. The `GlassObject` import stays direct rather than passing through a barrel.

The source's current license is MIT + Commons Clause, retained with its attribution in `src/components/canvasui/LICENSE.md`. `three` and `@types/three` are the only added dependencies. See `docs/component-sources.md` for upstream links, API, license condition, and adaptations.

### Stage 3 verification and limits

- Captured the Stage 2 reference at `artifacts/stage-3/hero-before-desktop.png` and `artifacts/stage-3/hero-before-mobile.png`; the enabled effect preview is `artifacts/stage-3/hero-after-desktop.png` and `artifacts/stage-3/hero-after-mobile.png`; the final fallback-default preview is `artifacts/stage-3/hero-default-desktop.png` and `artifacts/stage-3/hero-default-mobile.png`.
- Compared clean production builds from Stage 2 HEAD and Stage 3 on headless Chrome at 1280×900 and 390×900, two runs per version/viewport. With the effect enabled, total JS resources rose from 720,887 decoded / 222,136 transferred bytes to 1,439,082 decoded / 407,147 transferred bytes. Most of the increase is the deferred Three.js chunk (710,250 decoded / 182,266 transferred bytes), requested shortly after viewport entry. The non-WebGL route/client chunk increase was about 2.8 KB transferred.
- The final default production build fetched 729,160 decoded / 227,688 transferred bytes of JS at either tested viewport, rendered zero canvas elements, and made no request for the model asset or the Three.js chunk. This is about 8.3 KB decoded / 5.6 KB transferred above Stage 2.
- The enabled effect generated 3–6 long tasks on desktop and 4–5 on mobile in the observed runs; the longest was 440 ms on the first desktop run and 106–130 ms on mobile. Stage 2 recorded one 50–89 ms long task per run. This cold initialization cost is too high for a decorative enhancement, so the production default retains the fallback. Set `NEXT_PUBLIC_ENABLE_HUD_GLASS=true` at build time to preview the effect experimentally; it is not enabled by default.
- LCP varied across cold/warm runs (Stage 2: 268–640 ms desktop, 252–300 ms mobile; Stage 3: 292–316 ms desktop, 272–336 ms mobile). CLS was unchanged per viewport in this sample (0.00449 desktop, 0.01984 mobile). Lighthouse was unavailable in the environment, and these local Chrome results do not substitute for profiling real mobile devices or production traffic.
- Lint, TypeScript, format check, production build, and Playwright passed. Browser checks covered desktop/mobile, reduced motion changes, WebGL2 unavailable, asset failure, context loss, node selection, locale navigation, and returning from outside the viewport. Console showed no application/hydration errors after replacing the deprecated `SVGLoader.createShapes()` call with `ShapePath.toShapes()`.
- No deployment or work on project/case-study content is included in this stage.

### Stage 3 follow-up

The optional WebGL ring remains disabled by default because its observed cold-start cost outweighed its decorative value. This is an independent Stage 3 follow-up and does not block Stage 4; no Stage 3 component was changed here.

## Stage 4 — Featured projects and bilingual case studies

Implemented on `feat/stage-4-projects`. Replaced the `#proyectos` placeholder with a data-driven bilingual project index and added the three statically generated case routes under `src/app/[locale]/proyectos/[slug]/page.tsx`. `src/content/projects.ts` holds the typed project facts, links, diagrams, and ES/EN study copy. The PWA remains the expanded featured piece; Secure Transfer and Classroom → GitHub are supporting cards.

### Design findings and deliberate differences

- Figma node `12:2817` remains the Projects section. Its 1280 px screenshot shows a large PWA card followed by two equal secondary cards, a graphite canvas, lime telemetry details, and concise actions. The implementation keeps that hierarchy while using a fluid 12/5-column featured layout and stacked cards at narrower widths.
- The mockup's PWA browser panel is illustrative rather than an actual screen capture, so it was replaced with an explicitly labelled local/offline/sync diagram grounded in the repository. The other two project visuals are explanatory diagrams: Secure Transfer separates client and server operations; Classroom shows input, validation, registry, and planned issues.
- The Main subtree contains the portfolio landing page, with no case-study composition. Figma's MCP Starter-plan limit blocked the metadata request needed to enumerate other pages, so the case pages use the approved type scale, tokens, bordered panels, and compact HUD labels as a responsive editorial adaptation. No unseen case screen is presented as a Figma match.
- Existing project screenshots were inspected and show the sign-in view with a placeholder email, so they were not copied. The public demo responds but redirects to `/login`; the implementation does not imply authenticated flows were tested.
- Secure Transfer's code supports the upload-side crypto/package path, but `extractSecurePackage` is explicitly unfinished. That limit is stated in the case; security audit, E2E encryption, production readiness, coverage numbers, and individual authorship are not claimed. Classroom's workflow remains inactive and dry-run oriented, and the case is presented as an automation rather than an app.
- Case metadata includes localized titles, descriptions, and language alternates. No canonical domain was added because the final domain is not configured. Navbar section links from a case route return to the corresponding locale's home anchors; no absent section is highlighted on the case route.

### Stage 4 verification

See `docs/project-content-sources.md` for claim-level files, commits, limitations, URL availability, and visual sourcing. Added Playwright coverage for all six locale/project combinations, project-card navigation, locale switching, return navigation, missing demos, unknown slugs, navbar home anchors, and overflow at 360/390/768/1280 px. Final results: lint, typecheck, format check, production build, and Playwright passed; 23 Playwright tests passed and 4 existing experimental-GL tests were skipped because the effect is disabled by default. Overflow checks passed at all eight locale/viewport combinations. Production screenshots are in `artifacts/stage-4/` for the section at all four widths in both locales, plus the hero and PWA case at 390 and 1280 px. Visual review confirmed the desktop section hierarchy, tablet/mobile stacking, and the existing hero/navbar. Lighthouse and live authenticated product flows were not tested.

## Stage 5 — About, stack, experience, contact, and CV

Implemented on `feat/stage-5-profile-contact`. Added bilingual About, grouped technology stack, a data-driven accessible timeline, contact form shell, direct profile links, and a compact footer. Profile facts and social URLs live in `src/content/profile.ts`; copy stays in the existing Spanish/English dictionaries. About and stack are Server Components. The contact form is static HTML with persistent labels, native constraints, a disabled Iconiq submit button, and a localized explanation because no email provider or anti-spam protection is configured. No contact endpoint or false success response was added.

### Confirmed content and omitted data

- The short first-person About copy describes a backend interest within full-stack work, APIs, data, applications, automation, and project practices visible in the three documented studies. A brief gaming interest is included as the only personal detail.
- Stack cards separate the user's declared NestJS, Hono, React, SvelteKit, and cloud-native tools from technologies evidenced by the projects. Project contexts refer to PWA UTT, Secure Transfer, and Classroom → GitHub. No skill ratings are used.
- No education or employment records were present in the repository. The typed `ExperienceEntry` shape distinguishes education, employment, and personal projects; the empty list means no timeline section or navigation item is rendered. Personal project records will not be inferred from case studies.
- No confirmed email address, local CV file, or mail provider configuration exists. Email and CV actions are omitted. The same nullable profile CV configuration is read by the hero and contact section for future use.
- The contact form remains non-operational. Fields retain browser validation semantics, but the disabled submit control cannot send data. GitHub and LinkedIn are the available contact routes. Provider credentials, authorized sender identity, recipient, and deployment-grade spam protection remain pending.

### Figma limitation and design decisions

- The Stage 5 Figma context request was blocked by the account's Starter-plan MCP call limit before any Stage 5 section nodes or screenshots could be retrieved. This implementation therefore uses established project tokens, section headings, surface hierarchy, responsive container, and the confirmed content brief; it is not claimed as screenshot-matched to the unseen sections.
- The About/stack areas use readable opaque panels and the existing graphite/lime tokens. No decorative photo, timeline entry, CV artifact, email, or form state was fabricated to fill the composition.
- Independent Stage 3 follow-up remains unchanged: optional WebGL Glass Object is disabled by default after its documented cold-start cost. Stage 4 remains unchanged.

### Stage 5 verification

Lint, TypeScript, format check, and a clean production build passed. The production build used the Webpack builder in an isolated temporary copy because a pre-existing Next dev server owns the workspace's `.next` directory; the default Turbopack builder in that copy could not resolve its external `node_modules` symlink. After the mobile preview follow-up, Playwright passed 33 tests, including the ES/EN sections, accessible validation, disabled provider state, prevention of implicit form submission, touch/keyboard mobile navigation, local-network hydration, reduced motion, and overflow at 360/390/768/1280 px. Four existing experimental-GL tests were skipped because WebGL remains opt-in. Captures are in `artifacts/stage-5/` for Spanish and English at 1280 px and 390 px. No email delivery, CV artifact, or academic/employment records were verified. Figma visual comparison remains unavailable due to the Starter-plan limit.

### Stage 5 follow-up — mobile preview menu

The mobile menu opened in Chrome at `localhost` but did not hydrate when the same page was loaded through the LAN address: Next's development-origin allowlist contained only `127.0.0.1`. `next.config.ts` now derives non-internal IPv4 interface addresses and adds them to `allowedDevOrigins` for local development. A touch test against `192.168.1.95:3000` now confirms `aria-expanded=true` and a visible menu; keyboard open/close and focus restoration are also covered. This changes development preview access only; production behavior is unchanged.
