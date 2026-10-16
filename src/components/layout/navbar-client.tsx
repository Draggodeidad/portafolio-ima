"use client";

import Image from "next/image";
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
  profileLabel: string;
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
  return "";
}

export function NavbarClient({
  locale,
  copy,
  visibleSectionIds,
}: NavbarClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hash = useSyncExternalStore(
    subscribeToHashChange,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const hashValue = hash.slice(1);
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

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
      <header className={cn(styles.header, glassStyles.glass)}>
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
              className={styles.profileLink}
              href="https://github.com/Draggodeidad"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.profileLabel}
            >
              <ProfileIcon />
            </a>
          </div>

          <div className={styles.mobileActions}>
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHash}
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
  visibleSectionIds: SectionId[];
};

function LanguageSwitch({
  locale,
  copy,
  pathname,
  hash,
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
        onClick={(event) => switchLocale(event, "en")}
      >
        EN
      </Link>
    </div>
  );
}

function ProfileIcon() {
  return (
    <Image
      src="/icons/profile.svg"
      alt=""
      aria-hidden="true"
      width={12}
      height={12}
    />
  );
}
