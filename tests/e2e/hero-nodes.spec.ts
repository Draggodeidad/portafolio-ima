import { expect, test } from "@playwright/test";

test.describe("hero system playground", () => {
  test("selects an area with Enter and Space and updates its explanation", async ({
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

    const dataNode = page.getByRole("button", { name: "Datos / Caché" });
    await dataNode.focus();
    await page.keyboard.press("Enter");
    await expect(dataNode).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("Persistencia local, bases de datos y sincronización."),
    ).toBeVisible();

    const cloudNode = page.getByRole("button", { name: "Cloud / Workers" });
    await cloudNode.focus();
    await page.keyboard.press("Space");
    await expect(cloudNode).toHaveAttribute("aria-pressed", "true");
    await expect(dataNode).toHaveAttribute("aria-pressed", "false");
    await expect(
      page.getByText(
        "Integración y despliegue de aplicaciones en servicios cloud.",
      ),
    ).toBeVisible();
    expect(hydrationWarnings).toEqual([]);
  });

  test("localizes node labels and preserves the existing section targets", async ({
    page,
  }) => {
    await page.goto("/en");

    await expect(
      page.getByRole("button", { name: "Data / Cache" }),
    ).toBeVisible();
    await expect(
      page.getByText("API design and server-side logic."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Data / Cache" }).click();
    await expect(
      page.getByText("Local persistence, databases, and synchronization."),
    ).toBeVisible();
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
