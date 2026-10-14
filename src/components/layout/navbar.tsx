"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  dictionaries,
  sectionIds,
  type Locale,
  type SectionId,
} from "@/lib/i18n/dictionaries";

type NavbarProps = {
  locale: Locale;
};

export function Navbar({ locale }: NavbarProps) {
  const copy = dictionaries[locale];
  const pathname = usePathname();
  const initialHashSection =
    typeof window === "undefined" ? null : window.location.hash.slice(1);
  const initialSection = sectionIds.includes(initialHashSection as SectionId)
    ? (initialHashSection as SectionId)
    : null;
  const [activeSection, setActiveSection] = useState<SectionId>(
    initialSection ?? "inicio",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const manualSectionRef = useRef<SectionId | null>(initialSection);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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
          setActiveSection(visibleId as SectionId);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    function releaseManualSection() {
      manualSectionRef.current = null;
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
  }, [pathname]);

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

  const languageHref = (language: Locale) =>
    `${pathname.replace(/^\/(es|en)(?=\/|$)/, `/${language}`)}#${activeSection}`;

  function closeMenu() {
    setMenuOpen(false);
  }

  function selectSection(id: SectionId) {
    manualSectionRef.current = id;
    setActiveSection(id);
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
            aria-label="Imanol Antonio De la Cruz — inicio"
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
              hrefFor={languageHref}
              label={copy.languageSelectorLabel}
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
              hrefFor={languageHref}
              label={copy.languageSelectorLabel}
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
  copy: (typeof dictionaries)[Locale];
  hrefFor: (language: Locale) => string;
  label: string;
};

function LanguageSwitch({ locale, copy, hrefFor, label }: LanguageSwitchProps) {
  return (
    <div className="language-switch" role="group" aria-label={label}>
      <Link
        className={locale === "es" ? "is-selected" : ""}
        href={hrefFor("es")}
        lang="es"
        aria-label={copy.switchToSpanish}
        aria-current={locale === "es" ? "page" : undefined}
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
        href={hrefFor("en")}
        lang="en"
        aria-label={copy.switchToEnglish}
        aria-current={locale === "en" ? "page" : undefined}
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
