import { expect, test } from "@playwright/test";

test.describe("hero area selector", () => {
  test("moves between areas with arrow keys and links each to its case", async ({
    page,
  }) => {
    const hydrationWarnings: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("hydrated")) {
        hydrationWarnings.push(message.text());
      }
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");

    const areas = page.getByRole("radiogroup", {
      name: "Elige un área de trabajo",
    });
    const apiArea = areas.getByRole("radio", { name: /API/ });
    const dataArea = areas.getByRole("radio", { name: /Datos/ });
    const automationArea = areas.getByRole("radio", { name: /Automatización/ });
    const caseLink = page
      .locator("#inicio")
      .getByRole("link", { name: /^Ver caso/ });

    await expect(apiArea).toHaveAttribute("aria-checked", "true");
    await expect(caseLink).toHaveAttribute(
      "href",
      "/es/proyectos/secure-transfer",
    );

    await apiArea.focus();
    await page.keyboard.press("ArrowRight");
    await expect(dataArea).toBeFocused();
    await expect(dataArea).toHaveAttribute("aria-checked", "true");
    await expect(apiArea).toHaveAttribute("aria-checked", "false");
    await expect(
      page.getByText(
        "Persistencia local con IndexedDB y una cola que sincroniza con el servidor cuando vuelve la conexión.",
      ),
    ).toBeVisible();
    await expect(caseLink).toHaveAttribute("href", "/es/proyectos/pwa-utt");

    await page.keyboard.press("End");
    await expect(automationArea).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowRight");
    await expect(apiArea).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(automationArea).toHaveAttribute("aria-checked", "true");

    // Only the checked radio is in the tab order; Tab reaches the case link.
    await page.keyboard.press("Tab");
    await expect(caseLink).toBeFocused();
    await expect(caseLink).toHaveAttribute(
      "href",
      "/es/proyectos/classroom-github",
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/es\/proyectos\/classroom-github$/);
    expect(hydrationWarnings).toEqual([]);
  });

  test("localizes areas and preserves the existing section targets", async ({
    page,
  }) => {
    await page.goto("/en");

    const dataArea = page.getByRole("radio", { name: /Data/ });
    await expect(dataArea).toBeVisible();
    await expect(
      page.getByText(
        "API design and server-side logic: an Express API that encrypts, signs, and stores file packages.",
      ),
    ).toBeVisible();
    await dataArea.click();
    await expect(dataArea).toHaveAttribute("aria-checked", "true");
    await expect(
      page.getByText(
        "Local persistence with IndexedDB and a queue that syncs with the server when the connection returns.",
      ),
    ).toBeVisible();
    await expect(
      page.locator("#inicio").getByRole("link", { name: /^View case study/ }),
    ).toHaveAttribute("href", "/en/proyectos/pwa-utt");
    await expect(
      page.getByRole("link", { name: "View projects" }),
    ).toHaveAttribute("href", "#proyectos");
    await expect(
      page.getByRole("link", { name: "Get in touch" }),
    ).toHaveAttribute("href", "#contacto");
    await page.getByRole("link", { name: "View projects" }).click();
    const projectsTop = await page
      .locator("#proyectos")
      .evaluate((section) => section.getBoundingClientRect().top);
    expect(projectsTop).toBeGreaterThanOrEqual(64);
  });

  test("collapses the HUD below the two-column layout and expands on demand", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");

    const toggle = page.getByRole("button", {
      name: "Áreas de trabajo y casos",
    });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("radiogroup")).toBeHidden();
    const projectsTop = await page
      .locator("#proyectos")
      .evaluate((section) => section.getBoundingClientRect().top);
    expect(projectsTop).toBeLessThan(844);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("radio", { name: /Datos/ })).toBeVisible();
    await page.getByRole("radio", { name: /Datos/ }).click();
    await expect(
      page.locator("#inicio").getByRole("link", { name: /^Ver caso/ }),
    ).toHaveAttribute("href", "/es/proyectos/pwa-utt");

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(page.getByRole("radiogroup")).toBeVisible();
  });

  for (const locale of ["es", "en"]) {
    for (const width of [360, 390, 768, 1280]) {
      test(`fits the ${width}px viewport without horizontal overflow in ${locale}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const dimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }));
        expect(dimensions.scrollWidth).toBeLessThanOrEqual(
          dimensions.viewportWidth,
        );
      });
    }
  }
});
