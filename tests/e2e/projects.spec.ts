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
      await expect(page.locator("main h2")).toHaveCount(8);
      const contribution = page.getByRole("complementary", {
        name: locale === "es" ? "Mi aportación" : "My contribution",
      });
      const diagram = page
        .locator("main figure")
        .filter({ hasText: locale === "es" ? "Diagrama" : "Diagram" });
      expect(
        await contribution.evaluate(
          (element) => element.getBoundingClientRect().top,
        ),
      ).toBeLessThan(
        await diagram.evaluate(
          (element) => element.getBoundingClientRect().top,
        ),
      );
      if (project.hasDemo) {
        await expect(
          page.locator("main figure").filter({
            hasText:
              locale === "es"
                ? "Captura con datos sintéticos"
                : "Screenshot with synthetic data",
          }),
        ).toHaveCount(3);
      }
      await expect(page.locator("main")).toContainText(
        locale === "es" ? "Tecnologías" : "Technologies",
      );

      await expect(
        page.getByRole("complementary", {
          name: locale === "es" ? "Mi aportación" : "My contribution",
        }),
      ).toBeVisible();

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
    const link = article.getByRole("link", { name: /^Ver caso/ });
    await expect(link).toHaveAttribute("href", `/es/proyectos/${project.slug}`);
  }

  await page
    .locator("#proyectos")
    .getByRole("link", { name: /^Ver caso/ })
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
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(0);
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

test("English pages show translated project names and no literal code marks", async ({
  page,
}) => {
  for (const path of ["/en", "/en/proyectos/pwa-utt"]) {
    await page.goto(path);
    const main = page.locator("main");
    await expect(main).not.toContainText("Inspecciones de laboratorios");
    await expect(main).not.toContainText("`");
  }
  await expect(page.locator("main h1")).toHaveText("PWA UTT — Lab inspections");
  await expect(page.locator("main code", { hasText: "/login" })).toBeVisible();
  await expect(page).toHaveTitle(/^PWA UTT — Lab inspections — Case study/);
});

for (const locale of ["es", "en"] as const) {
  test(`${locale}: every case study ends with a way to get in touch`, async ({
    page,
  }) => {
    for (const project of projects) {
      await page.goto(`/${locale}/proyectos/${project.slug}`);
      const contact = page.getByRole("region", {
        name:
          locale === "es"
            ? "¿Quieres hablar de este proyecto?"
            : "Want to talk about this project?",
      });
      await expect(
        contact.getByRole("link", {
          name: locale === "es" ? "Escríbeme" : "Email me",
        }),
      ).toHaveAttribute("href", /^mailto:/);
      await expect(
        contact.getByRole("link", {
          name:
            locale === "es"
              ? "Más formas de contacto"
              : "More ways to reach me",
        }),
      ).toHaveAttribute("href", `/${locale}#contacto`);
    }
  });
}
