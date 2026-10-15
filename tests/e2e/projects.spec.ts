import { expect, test } from "@playwright/test";

const projects = [
  { slug: "pwa-utt", title: "PWA UTT", hasDemo: true },
  { slug: "secure-transfer", title: "Secure Transfer", hasDemo: false },
  { slug: "classroom-github", title: "Classroom", hasDemo: false },
] as const;

for (const locale of ["es", "en"] as const) {
  for (const project of projects) {
    test(`${locale}: renders the ${project.slug} study with localized navigation`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/proyectos/${project.slug}`);
      await expect(page.locator("main h1")).toContainText(project.title);
      await expect(page.locator("main h2")).toHaveCount(6);
      await expect(page.locator("main")).toContainText(
        locale === "es" ? "Tecnologías" : "Technologies",
      );

      const repositoryLink = page.getByRole("link", {
        name: locale === "es" ? "Ver código" : "View code",
      });
      await expect(repositoryLink).toHaveAttribute(
        "href",
        `https://github.com/Draggodeidad/${project.slug === "classroom-github" ? "automation-classrom" : project.slug === "secure-transfer" ? "secureTransferBack" : "pwa-utt"}`,
      );
      const demoAction = page.getByRole("link", {
        name: locale === "es" ? "Abrir aplicación" : "Open application",
      });
      if (project.hasDemo) {
        await expect(demoAction).toHaveAttribute(
          "href",
          "https://pwa-utt.vercel.app/",
        );
      } else {
        await expect(demoAction).toHaveCount(0);
      }

      const languageLink = page.getByRole("link", {
        name:
          locale === "es"
            ? "Switch language to English"
            : "Switch language to Spanish",
      });
      await languageLink.click();
      const switchedLocale = locale === "es" ? "en" : "es";
      await expect(page).toHaveURL(
        new RegExp(`/${switchedLocale}/proyectos/${project.slug}$`),
      );
      await expect(page.locator("main h1")).toContainText(project.title);

      await page
        .getByRole("link", {
          name:
            switchedLocale === "es" ? "Volver a proyectos" : "Back to projects",
        })
        .click();
      await expect(page).toHaveURL(new RegExp(`/${switchedLocale}#proyectos$`));
      await expect(page.locator("#proyectos h2")).toBeVisible();
    });
  }
}

test("home project cards open their local case studies", async ({ page }) => {
  await page.goto("/es");
  for (const project of projects) {
    const article = page.locator("article").filter({ hasText: project.title });
    const link = article.getByRole("link", {
      name: /Explorar caso|Explorar caso de estudio/,
    });
    await expect(link).toHaveAttribute("href", `/es/proyectos/${project.slug}`);
  }

  await page
    .getByRole("link", { name: /Explorar caso/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/es\/proyectos\/pwa-utt$/);
});

for (const locale of ["es", "en"] as const) {
  test(`${locale}: case navbar points to home anchors without an arbitrary active section`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/proyectos/secure-transfer`);
    const nav = page.locator("header nav").first();
    await expect(
      nav.getByRole("link", {
        name: locale === "es" ? "Proyectos" : "Projects",
      }),
    ).toHaveAttribute("href", `/${locale}#proyectos`);
    const homeLink = nav.getByRole("link", {
      name: locale === "es" ? "Inicio" : "Home",
    });
    await expect(homeLink).toHaveAttribute("href", `/${locale}#inicio`);
    await expect(homeLink).not.toHaveAttribute("aria-current", "location");
  });
}

test("unknown project slugs return 404", async ({ page }) => {
  const response = await page.goto("/en/proyectos/not-a-project");
  expect(response?.status()).toBe(404);
});

test("projects layout has no horizontal overflow at requested viewport widths", async ({
  page,
}) => {
  for (const locale of ["es", "en"] as const) {
    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.document,
        `${locale} overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
});
