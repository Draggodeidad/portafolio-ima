"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/routing";
import { sectionIds, type SectionId } from "@/lib/i18n/sections";

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

export function NavbarClient({ locale, copy }: NavbarClientProps) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(
    subscribeToHashChange,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const hashValue = hash.slice(1);
  const hashSection = sectionIds.includes(hashValue as SectionId)
    ? (hashValue as SectionId)
    : null;
  const [observedSection, setObservedSection] = useState<SectionId | null>(
    null,
  );
  const manualSectionRef = useRef<SectionId | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const activeSection =
    (hashSection && !hasScrolled ? hashSection : null) ??
    observedSection ??
    hashSection ??
    "inicio";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    manualSectionRef.current = hashSection;

    const sections = sectionIds
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
  }, [hashSection, pathname]);

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

  const languageHref = { pathname, hash: `#${activeSection}` };

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
      <a className="skip-link" href="#contenido">
        {copy.skipToContent}
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a
            className="brand"
            href="#inicio"
            aria-label={copy.brandLabel}
            onClick={() => selectSection("inicio")}
          >
            <span className="brand__monogram" aria-hidden="true">
              IA
              <span className="brand__signal" />
            </span>
            <span className="brand__text" aria-hidden="true">
              <span>IMANOL</span>
              <span>ANTONIO</span>
              <span>DE LA CRUZ</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label={copy.navigationLabel}>
            {sectionIds.map((id) => (
              <a
                className={`nav-link${activeSection === id ? " is-active" : ""}`}
                suppressHydrationWarning
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                key={id}
                onClick={() => selectSection(id)}
              >
                {copy.sections[id]}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHref.hash}
            />
            <a
              className="contact-link"
              href="#contacto"
              onClick={() => selectSection("contacto")}
            >
              {copy.contactAction}
            </a>
            <a
              className="profile-link"
              href="https://github.com/Draggodeidad"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.profileLabel}
            >
              <ProfileIcon />
            </a>
          </div>

          <div className="mobile-actions">
            <LanguageSwitch
              locale={locale}
              copy={copy}
              pathname={pathname}
              hash={languageHref.hash}
            />
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? copy.closeMenuLabel : copy.menuLabel}
              onClick={() => setMenuOpen((open) => !open)}
              ref={menuButtonRef}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav
          className={`mobile-nav${menuOpen ? " is-open" : ""}`}
          id="mobile-navigation"
          aria-label={copy.navigationLabel}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          {sectionIds.map((id) => (
            <a
              className={`nav-link${activeSection === id ? " is-active" : ""}`}
              suppressHydrationWarning
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
              key={id}
              onClick={() => selectSection(id)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {copy.sections[id]}
            </a>
          ))}
          <a
            className="contact-link"
            href="#contacto"
            onClick={() => selectSection("contacto")}
          >
            {copy.contactAction}
          </a>
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
};

function LanguageSwitch({ locale, copy, pathname, hash }: LanguageSwitchProps) {
  const router = useRouter();
  const href = { pathname, hash };

  function switchLocale(
    event: React.MouseEvent<HTMLAnchorElement>,
    targetLocale: Locale,
  ) {
    event.preventDefault();
    const currentHash = window.location.hash;
    const currentSection = currentHash.slice(1);
    const targetHash = sectionIds.includes(currentSection as SectionId)
      ? currentHash
      : hash;

    router.replace(`${pathname}${targetHash}`, { locale: targetLocale });
  }

  return (
    <div
      className="language-switch"
      role="group"
      aria-label={copy.languageSelectorLabel}
    >
      <Link
        className={locale === "es" ? "is-selected" : ""}
        href={href}
        locale="es"
        lang="es"
        aria-label={copy.switchToSpanish}
        aria-current={locale === "es" ? "page" : undefined}
        onClick={(event) => switchLocale(event, "es")}
      >
        <Image
          src="/icons/language-es.svg"
          alt=""
          aria-hidden="true"
          width={26.4791}
          height={15.5056}
        />
      </Link>
      <span aria-hidden="true">|</span>
      <Link
        className={locale === "en" ? "is-selected" : ""}
        href={href}
        locale="en"
        lang="en"
        aria-label={copy.switchToEnglish}
        aria-current={locale === "en" ? "page" : undefined}
        onClick={(event) => switchLocale(event, "en")}
      >
        <Image
          src="/icons/language-en.svg"
          alt=""
          aria-hidden="true"
          width={26.25}
          height={15.3}
        />
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
