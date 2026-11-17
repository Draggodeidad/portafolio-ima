import { expect, test } from "@playwright/test";

test("hero actions lead to projects, contact and the downloadable CV", async ({
  page,
}) => {
  await page.goto("/es");
  const hero = page.locator("#inicio");
  await expect(hero.getByRole("heading", { level: 1 })).toContainText(
    "Imanol Antonio",
  );
  await expect(
    hero.getByRole("link", { name: "Ver proyectos" }),
  ).toHaveAttribute("href", "#proyectos");
  await expect(hero.getByRole("link", { name: "Contactar" })).toHaveAttribute(
    "href",
    "#contacto",
  );
  const cv = hero.getByRole("link", { name: /Descargar CV/ });
  await expect(cv).toHaveAttribute("download", "");
  const response = await page.request.get((await cv.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  await cv.focus();
  await expect(cv).toBeFocused();
});

test("English content and ink marks remain visible with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const hero = page.locator("#inicio");
  await expect(hero.getByText("Screenshot with synthetic data")).toBeVisible();
  await expect(hero.getByText(/Verified: backend development/)).toBeVisible();
  const paths = hero.locator("svg path");
  for (const path of await paths.all()) {
    await expect(path).toHaveCSS("animation-name", "none");
  }
});
