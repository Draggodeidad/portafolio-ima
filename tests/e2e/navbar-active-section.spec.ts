import { expect, test, type Page } from "@playwright/test";

const order = ["Proyectos", "Trayectoria", "Sobre mí", "Contacto"] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 900, nav: "header nav >> nth=0" },
  { name: "mobile", width: 390, height: 844, nav: "#mobile-navigation" },
] as const;

function activeLinks(page: Page, nav: string) {
  return page.locator(nav).locator('[aria-current="location"]');
}

async function atBottom(page: Page) {
  return page.evaluate(
    () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2,
  );
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
  }, id);
}

for (const viewport of viewports) {
  test.describe(`${viewport.name}: active navbar section`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/es");
      await expect(
        page.locator('button[aria-controls="mobile-navigation"]'),
      ).toBeEnabled();
    });

    test("slow scroll walks every section down and back up", async ({
      page,
    }) => {
      const active = activeLinks(page, viewport.nav);
      const seen: string[] = [];
      while (!(await atBottom(page))) {
        await page.mouse.wheel(0, 120);
        await page.waitForTimeout(40);
        const labels = await active.allTextContents();
        expect(labels.length).toBeLessThanOrEqual(1);
        if (labels[0] && seen.at(-1) !== labels[0]) seen.push(labels[0]);
        if (seen.length) expect(labels).toHaveLength(1);
      }
      await expect(active).toHaveText(["Contacto"]);
      expect(seen).toEqual([...order]);

      const back: string[] = ["Contacto"];
      while (await page.evaluate(() => window.scrollY > 0)) {
        await page.mouse.wheel(0, -120);
        await page.waitForTimeout(40);
        const label = (await active.allTextContents())[0];
        if (label && back.at(-1) !== label) back.push(label);
      }
      expect(back).toEqual([...order].reverse());
    });

    for (const start of ["proyectos", "trayectoria"]) {
      test(`End and fast scroll from ${start} land on Contacto`, async ({
        page,
      }) => {
        const active = activeLinks(page, viewport.nav);
        await scrollToSection(page, start);
        await expect(active).toHaveCount(1);

        await page.keyboard.press("End");
        await expect.poll(() => atBottom(page)).toBe(true);
        await expect(active).toHaveText(["Contacto"]);

        await scrollToSection(page, start);
        await expect(active).not.toHaveText(["Contacto"]);
        for (let i = 0; i < 5; i++) await page.mouse.wheel(0, 4000);
        await expect.poll(() => atBottom(page)).toBe(true);
        await expect(active).toHaveText(["Contacto"]);
      });
    }
  });
}

test("Contacto link stays active to the footer and survives a pause", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es#proyectos");
  const nav = page.locator("header nav").first();
  const active = activeLinks(page, "header nav >> nth=0");

  await nav.getByRole("link", { name: "Contacto" }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(active).toHaveText(["Contacto"]);
  await expect(
    active.locator("svg"),
    "the ink underline marks the active link",
  ).toHaveCSS("opacity", "1");

  await page.mouse.wheel(0, 900);
  await expect(page.locator("footer")).toBeInViewport();
  await page.waitForTimeout(5000);
  await expect(active).toHaveText(["Contacto"]);

  await nav.getByRole("link", { name: "Sobre mí" }).click();
  await expect(active).toHaveText(["Sobre mí"]);
  await page.waitForTimeout(5000);
  await expect(active).toHaveText(["Sobre mí"]);
});

test("loading a deep link marks that section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es#contacto");
  await expect(activeLinks(page, "header nav >> nth=0")).toHaveText([
    "Contacto",
  ]);
});
