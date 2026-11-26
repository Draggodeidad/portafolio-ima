"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import type { Locale } from "@/i18n/routing";
import type { NavSectionId } from "@/lib/i18n/sections";
import { cn } from "@/lib/cn";
import { styles } from "./navbar-client.styles";

type NavbarCopy = {
  navigationLabel: string;
  languageSelectorLabel: string;
  menuLabel: string;
  closeMenuLabel: string;
  switchToSpanish: string;
  switchToEnglish: string;
  skipToContent: string;
  brandLabel: string;
  sections: Record<NavSectionId, string>;
};

type NavbarClientProps = {
  locale: Locale;
  copy: NavbarCopy;
  visibleSectionIds: NavSectionId[];
};

function subscribeToHashChange(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHashSnapshot() {
  return window.location.hash;
}

function getServerHashSnapshot() {
  // Fragments are never sent to the server. Keep locale navigation inert until
  // the client snapshot can replace the prerendered placeholder href.
  return null;
}

// A section becomes active once its top crosses this share of the viewport.
const ACTIVATION_RATIO = 0.45;
// Sub-pixel scroll positions and anchor offsets must not flip the result.
const EDGE_TOLERANCE = 2;

/**
 * Single rule for every way of reaching a section (wheel, keyboard, touch,
 * anchors): the active link is the last section whose top has crossed the
 * activation line below the fixed header. Gaps between sections keep the
 * previous section. When the page cannot scroll any further, the last section
 * that is on screen wins, so short final sections such as Contacto still
 * activate even if they never reach the line.
 */
function getActiveSection(
  sectionIds: readonly NavSectionId[],
  headerBottom: number,
): NavSectionId | null {
  const viewportHeight = window.innerHeight;
  const root = document.documentElement;
  const atEnd =
    window.scrollY + viewportHeight >= root.scrollHeight - EDGE_TOLERANCE;
  const line = Math.max(
    headerBottom + EDGE_TOLERANCE,
    viewportHeight * ACTIVATION_RATIO,
  );
  const limit = atEnd ? viewportHeight - EDGE_TOLERANCE : line;

  // Ids follow page order, so the last section past the limit wins.
  let active: NavSectionId | null = null;
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= limit) active = id;
  }
  return active;
}

export function NavbarClient({
  locale,
  copy,
  visibleSectionIds,
}: NavbarClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hash = useSyncExternalStore<string | null>(
    subscribeToHashChange,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const [visibleSection, setVisibleSection] = useState<NavSectionId | null>(
    null,
  );
  const activeSection = isHome ? visibleSection : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) return;

    let frame = 0;

    function update() {
      frame = 0;
      const headerBottom =
        headerRef.current?.getBoundingClientRect().bottom ?? 0;
      setVisibleSection(getActiveSection(visibleSectionIds, headerBottom));
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    // Late layout changes (fonts, images) move sections without scrolling.
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, [isHome, visibleSectionIds]);

  useEffect(() => {
    if (!menuOpen) return;

    const header = headerRef.current;
    if (!header) return;

    // While the menu is open, Tab cycles through the header's visible
    // controls (brand, language, toggle and menu links) instead of
    // escaping into the page behind the panel.
    function focusableInHeader() {
      return Array.from(
        header!.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          !element.closest("[inert]") &&
          element.tabIndex >= 0 &&
          element.getClientRects().length > 0,
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableInHeader();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      const inside = active instanceof Node && header!.contains(active);

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }

    // Pointer users can still leave: focusing anything outside the header
    // closes the menu rather than pulling focus back.
    function onFocusIn(event: FocusEvent) {
      if (event.target instanceof Node && !header!.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [menuOpen]);

  const languageHash = hash ?? "";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className={styles.skipLink} href="#contenido">
        {copy.skipToContent}
      </a>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.headerInner}>
          <Link
            className={styles.brand}
            href={{ pathname: "/", hash: "#inicio" }}
            aria-label={copy.brandLabel}
            onClick={closeMenu}
          >
            Imanol De la Cruz
          </Link>

          <nav className={styles.desktopNav} aria-label={copy.navigationLabel}>
            {visibleSectionIds.map((id) => (
              <Link
                className={cn(
                  styles.navLink,
                  activeSection === id && styles.navLinkActive,
                )}
                suppressHydrationWarning
                href={{ pathname: "/", hash: `#${id}` }}
                aria-current={activeSection === id ? "location" : undefined}
                key={id}
                onClick={closeMenu}
              >
                {copy.sections[id]}
                <InkUnderline />
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHash}
              ready={hash !== null}
            />
          </div>

          <div className={styles.mobileActions}>
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHash}
              ready={hash !== null}
            />
            <button
              className={cn(styles.menuToggle, "cursor-pointer")}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? copy.closeMenuLabel : copy.menuLabel}
              // Server snapshot is null until hydration; a tap before then would be lost.
              disabled={hash === null}
              onClick={() => setMenuOpen((open) => !open)}
              ref={menuButtonRef}
            >
              <span
                className={cn(
                  styles.menuIconLine,
                  menuOpen && styles.menuIconLineFirstOpen,
                )}
              />
              <span
                className={cn(
                  styles.menuIconLine,
                  menuOpen && styles.menuIconLineLastOpen,
                )}
              />
            </button>
          </div>
        </div>

        <noscript>
          <nav className={styles.noScriptNav} aria-label={copy.navigationLabel}>
            <a
              className={styles.navLink}
              href={
                locale === "es"
                  ? `/en${pathname === "/" ? "" : pathname}`
                  : `/es${pathname === "/" ? "" : pathname}`
              }
              lang={locale === "es" ? "en" : "es"}
            >
              {locale === "es" ? "EN" : "ES"}
            </a>
            {visibleSectionIds.map((id) => (
              <a className={styles.navLink} href={`/${locale}#${id}`} key={id}>
                {copy.sections[id]}
              </a>
            ))}
          </nav>
        </noscript>
        <nav
          className={cn(styles.mobileNav, menuOpen && styles.mobileNavOpen)}
          id="mobile-navigation"
          aria-label={copy.navigationLabel}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          {visibleSectionIds.map((id) => (
            <Link
              className={cn(
                styles.navLink,
                styles.mobileNavLink,
                activeSection === id && styles.navLinkActive,
              )}
              suppressHydrationWarning
              href={{ pathname: "/", hash: `#${id}` }}
              aria-current={activeSection === id ? "location" : undefined}
              key={id}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {copy.sections[id]}
              <InkUnderline />
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

type LanguageSwitchProps = {
  locale: Locale;
  copy: NavbarCopy;
  pathname: string;
  hash: string;
  ready: boolean;
};

function LanguageSwitch({
  locale,
  copy,
  pathname,
  hash,
  ready,
}: LanguageSwitchProps) {
  const router = useRouter();
  const href = hash ? { pathname, hash } : pathname;

  function switchLocale(
    event: MouseEvent<HTMLAnchorElement>,
    targetLocale: Locale,
  ) {
    event.preventDefault();
    router.replace(`${pathname}${window.location.hash}`, {
      locale: targetLocale,
    });
  }

  return (
    <div
      className={styles.languageSwitch}
      role="group"
      aria-label={copy.languageSelectorLabel}
      inert={!ready}
    >
      <Link
        className={cn(
          styles.languageLink,
          locale === "es" && styles.languageSelected,
        )}
        href={href}
        locale="es"
        lang="es"
        aria-label={copy.switchToSpanish}
        aria-current={locale === "es" ? "page" : undefined}
        aria-disabled={!ready || undefined}
        onClick={(event) => switchLocale(event, "es")}
      >
        ES
      </Link>
      <span aria-hidden="true">|</span>
      <Link
        className={cn(
          styles.languageLink,
          locale === "en" && styles.languageSelected,
        )}
        href={href}
        locale="en"
        lang="en"
        aria-label={copy.switchToEnglish}
        aria-current={locale === "en" ? "page" : undefined}
        aria-disabled={!ready || undefined}
        onClick={(event) => switchLocale(event, "en")}
      >
        EN
      </Link>
    </div>
  );
}

function InkUnderline() {
  return (
    <svg
      className={styles.underline}
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 4 Q28 1 51 3 T98 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
