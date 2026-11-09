# Implementation plan

## Production configuration and immutable snapshots — 2026-11-09

Authorized continuation of PR #8: prepare imanolantonio.dev, resolve prerender/cache, add validation and release instructions; do not merge, deploy or modify DNS. Plan: inspect verified PR head and official APIs; use the Static Assets response adapter for eight immutable pages; separate production domain/origin settings from local; test snapshots and runtime behavior; update PR and docs.

Implemented @vinext/cloudflare 1.3.3 staticAssetsAdapter with all-route prerender discovery, production Wrangler environment (imanolantonio-portfolio / imanolantonio.dev / SITE_URL / observability), production build/test scripts and a CI validation-only Workers job. No KV/R2 or remote cache is needed. Next/Vercel scripts and origin remain available. The original dynamic/no-cache findings below describe the earlier evaluation and are superseded by this serving strategy.

The build emits eight rendered routes and sixteen private HTML/RSC snapshots. The catch-all remains a runtime 404. The first prerender exposed temporary localhost hreflang Link headers from next-intl; alternateLinks:false removes those redundant headers while page metadata retains canonical/language alternates. Workerd tests check all sixteen cache HIT responses, opposite-locale cookies, query strings, snapshot inventory and denied direct snapshot downloads. Existing navigation/locale/404/contact/responsive tests are retained.

Validation: production workerd suite 48 passed / 4 WebGL skips (50.9 s); focused cache suite 3 passed (5.1 s); Next production suite 45 passed / 7 skips (49.8 s, including three Workers-only tests). Lint, formatting, strict types, both builds, compatibility check and production Wrangler type generation passed. The new CI Workers job validates only; its remote result is recorded on PR #8. No publication or DNS action was run.

The adapter is read-only for the lifetime of the build; content and footer year update with a new build/deployment. No ISR or runtime invalidation is claimed. Worker middleware, routing and snapshot lookup still incur work; actual hosted costs/CPU/cache distribution remain unmeasured. The router-pattern table may still say dynamic; manifest/artifacts/runtime HIT evidence define the effective serving path. See docs/deployment.md for the reproducible checks, environment selection, manual release, DNS boundary and rollback.

## Local Cloudflare Workers evaluation — 2026-11-09

Authorized scope: evaluate vinext, ES/EN, and production browser behavior locally on `chore/cloudflare-migration`. No commits, push, PR, deployment command (including dry runs), account login, remote resources, secrets, DNS, email, or infrastructure changes. Existing Vercel CI and deployment settings are outside this evaluation.

Plan: establish the unchanged Next baseline; check published compatibility; add an independent Vite/Workers toolchain; exercise the built artifact in workerd; repeat the browser suite and Next checks; record reproducible results and limits in `docs/deployment.md`.

The unchanged baseline used Node 24.16.0, pnpm 11.4.0, Next 16.4.0, React/React DOM 19.3.0, and next-intl 4.14.9. Lint, format, build, and typecheck passed. Production Playwright passed 38 tests and skipped the four existing opt-in WebGL cases (46.6 s). Port 3001 belonged to another process, so a temporary config in `/tmp` started this worktree's `next start` on 3101. The sandbox initially blocked SWC's native cache; the same build succeeded outside that restriction after repeating Next's initial security-notice interruption. These are baseline environment/tooling findings, not migration regressions.

Published vinext 1.4.4 requires React `^19.3.1` and Vite `^8.0.0`. React, React DOM, and react-server-dom-webpack are pinned together to 19.3.1. The local toolchain uses Vite 8.3.6, @vitejs/plugin-react 6.1.0, @vitejs/plugin-rsc 0.5.39, @cloudflare/vite-plugin 1.67.0, Wrangler 4.158.0, and vite-css-modules 1.16.1, in the existing single pnpm lockfile. Only the required esbuild/workerd native install scripts were enabled. The initially selected plugin-react 6.3.0 was replaced by compatible 6.1.0 (published 2026-08-20); no release-age exception remains. The final frozen install passed supply-chain policy verification for 708 lockfile entries. The stable Cloudflare plugin uses the Wrangler integration supported by vinext; the documentation's newer v2 integration is still published under a beta tag and was not selected.

`vinext check` reports 12 supported, zero partial, zero issues (4 imports, 1 config option, 3 libraries, plus structure). This scan is evidence of recognized APIs, not proof of runtime compatibility. `next/root-params`, next-intl's request config/proxy, and `node:os` in `next.config.ts` remain intact. No design, content, styling convention, or WebGL-default changes are intended.

Reproduced adaptations:

- workerd rejected compatibility date 2026-11-09 because its newest supported date was 2026-11-08; the local config now pins the latter.
- The first built Worker returned 500: `No such module "ssr/index.js"` while Vite emitted `ssr/index.mjs`. Declaring the package ESM (`"type": "module"`), as the migration guide recommends, addresses the output-format mismatch without replacing the framework.
- The first build emitted conflicting CSS asset names. Added the official initializer's CSS Modules recipe: `patchCssModules({ exportMode: "default" })` and deterministic names based on the repository-relative file path.
- A built Worker returned a plain `Not Found` body with HTTP 200 for unmatched routes (`/en/missing-page`, `/fr` → `/es/fr`), whereas Next returned 404. Added `src/app/[locale]/[...rest]/page.tsx`, a standard catch-all that immediately calls the public `notFound()` API. Explicit routes retain priority, and the same test now confirms 404 in workerd. No dependency source patch or framework rewrite was needed.

Playwright selects Workers with `PLAYWRIGHT_RUNTIME=workers`, defaults to port 3102, and accepts `PLAYWRIGHT_PORT` for either runtime. It starts `vite preview` against the built Worker rather than testing a Node vinext server or treating Next development as Workers validation. The suite now also checks all six cases' metadata, home locale/anchor preservation, invalid locale/missing routes, loaded next/image SVGs, and all local SVG assets. Existing touch/keyboard, six-case locale navigation, contact-disabled, reduced-motion, and 360/390/768/1280 checks are retained.

### Local Workers results and limits

Final lint, formatting, strict TypeScript, Next build, Workers build, and compatibility check passed. The final Next production suite with the catch-all included passed 45 tests and skipped four opt-in WebGL cases (50.9 s). Wrangler generated local ASSETS declarations in `/tmp/portafolio-worker-env.d.ts` successfully. The full production-artifact suite passed 45 tests and skipped the same four experimental WebGL cases (52.2 s). Runtime: Cloudflare Vite plugin 1.67.0 → Miniflare 5.20261101.0-beta → workerd 1.20261101.1 (`workerd 2026-11-01`), with compatibility date 2026-11-08 and nodejs_compat. Root redirection, both languages, all six studies and language switches, home anchor preservation, 404, metadata, decoded images/SVG delivery, touch/keyboard/LAN navigation, disabled contact, and all four responsive widths passed. The first suite's incorrect Contact heading expectation was corrected to the existing dictionary text; the anchor URL itself already worked.

Captured Next and Workers home pages in ES/EN at 360/390/768/1280 px, plus the mobile menu. All eight home screenshot pairs were pixel-identical in this local Chrome sample with reduced motion. Computed heading/body colors, menu background, closed-menu opacity, and responsive display also matched. AO shows the primary workerd preview at `http://127.0.0.1:3103/es`; captures and logs are under `/tmp/portafolio-*`. This compares the existing implementation between runtimes and does not assert a new Figma review or real-device coverage.

The built Worker contains 124 JS modules totaling 2,255,770 raw bytes and 689,514 bytes when each module is gzip-compressed separately. This is a local module inventory, excluding sourcemaps/config/assets, not an uploaded bundle size or Workers plan-limit measurement. The disabled GlassObject still exists as an emitted deferred chunk; no change enabled its browser effect.

Remaining upstream warnings: duplicate CSS output name, incomplete sourcemaps from RSC plugins, ineffective dynamic imports in vinext's shims, the optional Three.js chunk above 500 KB, and partial webpack configuration support (next-intl's alias is preserved). Existing ESLint plugin peer ranges do not list ESLint 10; actual lint passes. These warnings are documented, not suppressed. SVG next/image behavior is tested; raster optimization, distributed caching, paid services, edge quotas/CPU/startup, production Lighthouse, secrets, email, infrastructure, and deployment remain untested or unconfigured.

Verdict: **viable for the tested local evaluation with the documented ESM/CSS/date/404 adaptations**. This is not a drop-in equivalence or production-readiness claim. Revalidate the suite and warnings after changing vinext, React, Vite, or workerd; authorize and design any hosting/optimization/caching work separately.

Rendering limit: Next reports both homes and all six cases as SSG; the evaluated vinext build reports dynamic routes without prerender or a cache adapter. The measured local visual/functional parity does not establish equivalent rendering cost, CPU usage, or cache behavior. This evaluation does not add a rendering/cache implementation to close that difference.

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

## Stage 6 — authorized deployment and CI/CD

The user authorized publication to Vercel and automatic deployment after passing checks on `main`; PRs run checks without preview deployments. The first attempt to assign `itsdraggodeidad.vercel.app` returned a conflict, so the user selected `itsdraggodeidad-portfolio.vercel.app`. That alternative is assigned and verified on the new `itsdraggodeidad` Vercel project. Next.js and pnpm remain unchanged; Node.js 24 is shared by CI and hosting.

The pipeline validates lint, formatting, the production build, generated route types, and Playwright before uploading the prebuilt Vercel artifact. Production publication is serialized and checks the latest `main` SHA before deployment. Vercel Git auto-deployments are disabled. Public canonical and language-alternate metadata now use a central confirmed origin. CI uses installed Chromium against `next start`, preserving Chrome/development testing locally. Reports and traces are retained on failures; credentials and generated output are excluded from Git.

Deployment behavior, credentials, token renewal, and recovery are documented in `docs/deployment.md`. The current app session could not create dedicated Vercel tokens, so the owner stored `VERCEL_TOKEN` directly in GitHub's secret UI. All three Actions secrets, including `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`, are configured without exposing credentials. No email provider, contact delivery, CV, visual redesign, or broader Stage 6 audit is included.

### Deployment verification

With Node.js 24.16.0 and the pinned pnpm, frozen installation, ESLint, Prettier, route-type generation/TypeScript, and the Vercel 64.3.1 production build passed. Playwright ran against `next start` using its installed Chromium: 38 tests passed and the four pre-existing opt-in WebGL cases were skipped. This includes canonical/alternate metadata, root redirection, SVG delivery, mobile touch/keyboard navigation, LAN hydration, all six case-study routes, 404s, layout widths, and disabled contact submission. Actionlint 1.7.12 passed after verifying the downloaded binary's official checksum. Environment files, deployment output, and browser reports are ignored by Git.

The tested prebuilt artifact was published with the authenticated local CLI as the initial bootstrap deployment (`dpl_2uVESrtvrhe5wLU9K1VJ5Spwyz6P`). The selected public origin responds over HTTPS: `/` redirects to `/es`, both home locales, all six studies, and `/icon.svg` return 200. A live Chromium mobile check confirmed English content, menu hydration with touch, menu closure, and navigation to the projects anchor.

The first [GitHub Actions run](https://github.com/Draggodeidad/portafolio-ima/actions/runs/38862660729) failed explicitly when `VERCEL_TOKEN` was absent; its deployment step was skipped and Vercel's existing production deployment stayed unchanged. After the owner configured the token, the authenticated rerun passed build, type checks, and browser tests and published commit `8c426110949004d719f8a3f0aeb2c0f3faf9d080` as `dpl_EfD8wU71dRvGw7yPQzfq4EPnDqwQ`. Vercel reported `READY` and matching commit metadata. That run exposed a reporting error: regular CLI JSON differs from the agent response envelope. The deployment command now explicitly sets `--non-interactive` to make the parsed response format deterministic in Actions as well as locally. The corrective push exercises automatic publication again; its result is available in Actions.
