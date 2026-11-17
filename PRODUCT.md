# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** recruiters and technical leads evaluating Imanol Antonio De la Cruz for a **first job / junior role** as a full-stack developer with a backend focus. Recruiters scan for role fit, stack, and a way to make contact; technical leads open case studies to judge reasoning, architecture, and honesty about limits.
- Visitors arrive in Spanish (primary) or English and expect the equivalent content in either language.

## Product Purpose

A bilingual (ES/EN) portfolio whose job is to get Imanol hired into a junior full-stack role with backend emphasis. It works by showing real projects explained as decisions (problem, scope, contribution, architecture, trade-offs, validation, limits) rather than by listing skills. Success means a reviewer understands what he built and how he thinks, and has a working path to contact him or download his CV.

## Positioning

An entry-level candidate who proves criterion through verifiable, self-built backend-leaning work and states limits openly: every claim traces to a repository, and nothing is inflated (no metrics, proficiency bars, or invented experience). The candour is the differentiator, not a disclaimer.

## Operating Context

- Reviewers reach the site from a CV, LinkedIn, or GitHub link, often on mobile first, then on desktop when evaluating cases.
- Home page with anchored sections (hero, projects, about, stack, trajectory, contact) plus one case-study page per project at `/{locale}/proyectos/{slug}`.
- Each project links to its public GitHub repository; PWA UTT also links to a live demo.

## Capabilities and Constraints

- Existing implementation: Next.js App Router (built for Cloudflare Workers through vinext), TypeScript strict, Tailwind CSS 4, next-intl, typed local content (`src/content/`). Live at https://imanolantonio.dev, deployed by GitHub Actions from `main` to Cloudflare Workers (confirmed 2026-11-17). Vercel is no longer the deploy target. Deploys and infrastructure changes only with authorization.
- Projects (all confirmed as individual work by the user, 2026-11-11, except where noted):
  - **PWA UTT** — academic lab-inspection app with offline persistence, sync, conflict resolution, and permissions. Main implementation and architecture by Imanol; team collaborated on testing/documentation. Demo: https://pwa-utt.vercel.app/ (verify availability before publishing). Code: https://github.com/Draggodeidad/pwa-utt
  - **Secure Transfer** — file-transfer backend with encryption and integrity verification. Individual project. No demo (database deleted). Code: https://github.com/Draggodeidad/secureTransferBack
  - **Classroom → GitHub** — n8n workflow turning Classroom assignments into GitHub issue plans. Individual project. Presented as an automation, not an app; not claimed to run in production. Code: https://github.com/Draggodeidad/automation-classrom
- Contact form: implemented (server-side validation, Turnstile, real submission states, Resend delivery on Cloudflare) but **not visible in production**: on 2026-11-17 `https://imanolantonio.dev/api/contact/config` returned `{"siteKey":null}`, so the form renders nothing. The user believed it was live; enabling it is a configuration task outside design scope that needs explicit authorization. Provider acceptance is not guaranteed delivery; never simulate success or send real test emails without authorization.
- **Contact without a form (user decision, 2026-11-17):** the contact section is designed complete without a form (email, CV and social links). The form renders below that block only when a provider is configured, and never leaves an empty slot or reflows the content above it.
- No blog, CMS, database, auth, or separate backend in scope.
- Public email (`antonioimanol7@gmail.com`), Spanish CV (`public/cv/CV_Imanol_Antonio.pdf`), and trajectory (1Degree Holdings internship 2025; UTT TSU 2023–2025 and engineering 2025–2027 expected) were supplied on 2026-11-11 and are published. The CV also lists CampusOps DMI, a team project not yet in the portfolio.
- Still missing: **portrait photo** (confirmed pending 2026-11-17). Omit the portrait slot until a real photo exists; never generate or simulate a person. The "IA" monogram was dropped in the 2026-11-17 redesign because Spanish readers take it as "Inteligencia Artificial".

## Brand Commitments

- Name: Imanol Antonio De la Cruz; role: "Desarrollador full-stack con enfoque en backend" / "Full-stack developer focused on backend engineering".
- Declared stack: JavaScript/TypeScript, NestJS, Hono, React, SvelteKit, cloud-native tools — shown without proficiency levels.
- Personality: young, passionate, fresh, curious, with a confirmed love of video games expressed with restraint; professional discourse stays primary. No logos, characters, or UI from referenced games.
- Visual direction: on 2026-11-17 the user opened a **free redesign**. The previous "Perfil HUD, graphite + electric lime" world (`docs/DESIGN.md`, the Figma file in `AGENTS.md`) is now evidence and anti-reference, not authority. The new direction is chosen with the user and recorded in root `DESIGN.md`; personality and content commitments above still apply.
- Links: GitHub https://github.com/Draggodeidad · LinkedIn https://www.linkedin.com/in/imanol-antonio-de-la-cruz-1a1281370/

## Evidence on Hand

- Three bilingual case studies in `src/content/projects.ts`, sourced from repositories at commits recorded in `docs/project-content-sources.md`.
- Profile/stack sourcing and limits in `docs/profile-content-sources.md`.
- Real PWA UTT screenshots: 8 desktop captures (1544×1076) in `pwa-img/`, supplied 2026-11-17, showing synthetic test data ("Laboratorio sintético", "Usuario de prueba"). Not yet optimized or placed in `public/`. Secure Transfer and Classroom → GitHub have no screenshots; their visuals stay labelled explanatory diagrams.
- Absent and not to be fabricated: metrics, test coverage figures, security audit claims, clients, employers, dates, certifications, testimonials, response-time promises, availability indicators.

## Product Principles

1. **Every claim is traceable.** If it isn't in a repository, the brief, or confirmed by the user, it isn't published.
2. **Show reasoning, not résumé padding.** Cases explain decisions, trade-offs, and limits; commits are never used as a quality or authorship metric.
3. **Hide what's pending instead of faking it.** Missing data means an omitted field, not placeholder copy or broken links.
4. **Personality supports, never replaces, professional evidence.**
5. **Spanish and English are equals.** Every page and claim has its equivalent; the language switch preserves the page.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard navigation, visible focus, ~44 px touch targets, persistent form labels with associated errors, `prefers-reduced-motion` respected, and every hover interaction has a focus/touch equivalent. Responsive from 360 px.
