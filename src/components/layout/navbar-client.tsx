"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import type { Locale } from "@/i18n/routing";
import { sectionIds, type SectionId } from "@/lib/i18n/sections";
import { cn } from "@/lib/cn";
import glassStyles from "./navbar-glass.module.css";
import { styles } from "./navbar-client.styles";

type NavbarCopy = {
  navigationLabel: string;
  languageSelectorLabel: string;
  menuLabel: string;
  closeMenuLabel: string;
  switchToSpanish: string;
  switchToEnglish: string;
  contactAction: string;
  githubContext: string;
  skipToContent: string;
  brandLabel: string;
  sections: Record<SectionId, string>;
};

type NavbarClientProps = {
  locale: Locale;
  copy: NavbarCopy;
  visibleSectionIds: SectionId[];
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
  const hashValue = hash?.slice(1);
  const hashSection = visibleSectionIds.includes(hashValue as SectionId)
    ? (hashValue as SectionId)
    : null;
  const [observedSection, setObservedSection] = useState<SectionId | null>(
    null,
  );
  const manualSectionRef = useRef<SectionId | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const activeSection = isHome
    ? ((hashSection && !hasScrolled ? hashSection : null) ??
      observedSection ??
      hashSection ??
      "inicio")
    : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    manualSectionRef.current = hashSection;

    if (!isHome) return;

    const sections = visibleSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualSectionRef.current) return;

        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const visibleId = visibleSections[0]?.target.id;
        if (visibleId && sectionIds.includes(visibleId as SectionId)) {
          setObservedSection(visibleId as SectionId);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    function releaseManualSection() {
      manualSectionRef.current = null;
      setHasScrolled(true);
    }

    window.addEventListener("wheel", releaseManualSection, { passive: true });
    window.addEventListener("touchstart", releaseManualSection, {
      passive: true,
    });
    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", releaseManualSection);
      window.removeEventListener("touchstart", releaseManualSection);
    };
  }, [hashSection, isHome, pathname, visibleSectionIds]);

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

  const languageHash = isHome && activeSection ? `#${activeSection}` : "";

  function closeMenu() {
    setMenuOpen(false);
  }

  function selectSection(id: SectionId) {
    manualSectionRef.current = id;
    setObservedSection(id);
    closeMenu();
  }

  return (
    <>
      <a className={styles.skipLink} href="#contenido">
        {copy.skipToContent}
      </a>
      <header className={cn(styles.header, glassStyles.glass)} ref={headerRef}>
        <div className={styles.headerInner}>
          <Link
            className={styles.brand}
            href={{ pathname: "/", hash: "#inicio" }}
            aria-label={copy.brandLabel}
            onClick={() => selectSection("inicio")}
          >
            <span className={styles.brandMonogram} aria-hidden="true">
              IA
              <span className={styles.brandSignal} />
            </span>
            <span className={styles.brandText} aria-hidden="true">
              <span className={styles.brandName}>IMANOL</span>
              <span className={styles.brandDetail}>ANTONIO</span>
              <span className={styles.brandDetail}>DE LA CRUZ</span>
            </span>
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
                onClick={() => selectSection(id)}
              >
                {copy.sections[id]}
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHash}
              ready={!isHome || hash !== null}
              visibleSectionIds={visibleSectionIds}
            />
            <Link
              className={styles.contactLink}
              href={{ pathname: "/", hash: "#contacto" }}
              onClick={() => selectSection("contacto")}
            >
              {copy.contactAction}
            </Link>
            <a
              className={styles.githubLink}
              href="https://github.com/Draggodeidad"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubMark className={styles.githubMark} />
              GitHub
              <span className="sr-only">{copy.githubContext}</span>
            </a>
          </div>

          <div className={styles.mobileActions}>
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHash}
              ready={!isHome || hash !== null}
              visibleSectionIds={visibleSectionIds}
            />
            <button
              className={cn(styles.menuToggle, "cursor-pointer")}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? copy.closeMenuLabel : copy.menuLabel}
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
              onClick={() => selectSection(id)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {copy.sections[id]}
            </Link>
          ))}
          <Link
            className={cn(styles.contactLink, styles.mobileContactLink)}
            href={{ pathname: "/", hash: "#contacto" }}
            onClick={() => selectSection("contacto")}
          >
            {copy.contactAction}
          </Link>
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
  visibleSectionIds: SectionId[];
};

function LanguageSwitch({
  locale,
  copy,
  pathname,
  hash,
  ready,
  visibleSectionIds,
}: LanguageSwitchProps) {
  const router = useRouter();
  const href = hash ? { pathname, hash } : pathname;

  function switchLocale(
    event: MouseEvent<HTMLAnchorElement>,
    targetLocale: Locale,
  ) {
    event.preventDefault();
    const currentHash = window.location.hash;
    const currentSection = currentHash.slice(1);
    const targetHash = visibleSectionIds.includes(currentSection as SectionId)
      ? currentHash
      : hash;

    router.replace(`${pathname}${targetHash}`, { locale: targetLocale });
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

/** GitHub mark from Primer Octicons (`mark-github`, MIT); see docs/component-sources.md. */
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}
