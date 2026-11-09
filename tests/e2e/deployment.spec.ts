import { expect, test } from "@playwright/test";
import { siteConfig } from "../../src/lib/site-config";

test("root redirects to Spanish and the site icon is served", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await expect(
    page.getByRole("heading", { name: "Imanol Antonio De la Cruz" }),
  ).toBeVisible();
  const icon = await request.get("/icon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
});

for (const locale of ["es", "en"]) {
  for (const suffix of [
    "",
    "/proyectos/pwa-utt",
    "/proyectos/secure-transfer",
    "/proyectos/classroom-github",
  ]) {
    test(`${locale}${suffix}: canonical and language alternates use the public origin`, async ({
      page,
    }) => {
      const path = `/${locale}${suffix}`;
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(
        suffix
          ? locale === "es"
            ? /Caso de estudio/
            : /Case study/
          : /Imanol Antonio/,
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /\S+/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new URL(path, siteConfig.url).href,
      );
      for (const language of ["es", "en"]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${language}"]`),
        ).toHaveAttribute(
          "href",
          new URL(`/${language}${suffix}`, siteConfig.url).href,
        );
      }
    });
  }
}

test("locale switching preserves the home section anchor", async ({ page }) => {
  await page.goto("/es#contacto");
  await page.getByRole("link", { name: "Switch language to English" }).click();
  await expect(page).toHaveURL(/\/en#contacto$/);
  await expect(page.locator("#contacto h2")).toHaveText(
    "Let's talk about an opportunity",
  );
  await page.getByRole("link", { name: "Switch language to Spanish" }).click();
  await expect(page).toHaveURL(/\/es#contacto$/);
});

test("unknown locale and missing paths return 404", async ({ request }) => {
  for (const path of ["/fr", "/en/missing-page", "/es/proyectos/missing"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});

test("next/image renders local images and all SVG assets are served", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/es");
  const images = page.locator("img");
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  for (const asset of [
    "/icon.svg",
    "/icons/profile.svg",
    "/icons/project-arrow.svg",
    "/icons/download-cv.svg",
    "/icons/language-es.svg",
    "/icons/language-en.svg",
    "/images/hud-glass-ring.svg",
  ]) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    expect(response.headers()["content-type"], asset).toContain(
      "image/svg+xml",
    );
    expect(await response.text(), asset).toContain("<svg");
  }
  await expect(page.locator("#inicio canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});
