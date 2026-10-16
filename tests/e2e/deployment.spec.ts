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
  for (const suffix of ["", "/proyectos/pwa-utt"]) {
    test(`${locale}${suffix}: canonical and language alternates use the public origin`, async ({
      page,
    }) => {
      const path = `/${locale}${suffix}`;
      await page.goto(path);
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
