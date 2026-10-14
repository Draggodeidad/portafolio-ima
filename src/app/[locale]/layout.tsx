import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { isLocale, locales } from "@/lib/i18n/dictionaries";
import "../globals.css";

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return {
    title: "Imanol Antonio De la Cruz — Full-stack Developer",
    description:
      locale === "es"
        ? "Portafolio de Imanol Antonio De la Cruz, desarrollador full-stack con enfoque en backend."
        : "Portfolio of Imanol Antonio De la Cruz, a full-stack developer focused on backend engineering.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <Navbar key={locale} locale={locale} />
        {children}
      </body>
    </html>
  );
}
