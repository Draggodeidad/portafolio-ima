import { expect, test } from "@playwright/test";

test.describe("decorative HUD glass", () => {
  test("keeps the complete hero and static ring with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es");

    await expect(
      page.getByRole("heading", { name: "Imanol Antonio De la Cruz" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Ver proyectos" }),
    ).toHaveAttribute("href", "#proyectos");
    await expect(page.getByTestId("hud-glass-fallback")).toBeVisible();
    await expect(page.locator("#inicio canvas")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Datos / Caché" }),
    ).toBeVisible();
  });

  test("keeps the static hero when WebGL2 is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = new Proxy(getContext, {
        apply(target, canvas, args: unknown[]) {
          if (args[0] === "webgl2") return null;
          return Reflect.apply(target, canvas, args);
        },
      });
    });
    await page.goto("/en");

    await expect(page.getByTestId("hud-glass-fallback")).toBeVisible();
    await expect(page.locator("#inicio canvas")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Imanol Antonio De la Cruz" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Data / Cache" }),
    ).toBeVisible();
  });

  test("updates a live motion preference without reloading the asset", async ({
    page,
  }) => {
    let assetRequests = 0;
    page.on("request", (request) => {
      if (request.url().endsWith("/images/hud-glass-ring.svg")) {
        assetRequests += 1;
      }
    });
    await page.goto("/es");

    const canvas = page.locator("#inicio canvas");
    try {
      await expect(canvas).toHaveCount(1, { timeout: 8_000 });
    } catch {
      test.skip(true, "This browser does not expose WebGL2.");
    }
    await expect(page.getByTestId("hud-glass-layer")).toHaveCSS("opacity", "1");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.getByTestId("hud-glass-fallback")).toBeVisible();
    await expect(page.getByTestId("hud-glass-layer")).toHaveCSS("opacity", "0");
    await expect(canvas).toHaveCount(1);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.getByTestId("hud-glass-layer")).toHaveCSS("opacity", "1");
    expect(assetRequests).toBe(1);
  });

  test("pauses offscreen and resumes across locale navigation without duplicate assets", async ({
    page,
  }) => {
    let assetRequests = 0;
    page.on("request", (request) => {
      if (request.url().endsWith("/images/hud-glass-ring.svg")) {
        assetRequests += 1;
      }
    });
    await page.goto("/es");

    const canvas = page.locator("#inicio canvas");
    try {
      await expect(canvas).toHaveCount(1, { timeout: 8_000 });
    } catch {
      test.skip(true, "This browser does not expose WebGL2.");
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(canvas).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.getByTestId("hud-glass-layer")).toHaveCSS("opacity", "1");
    await page.locator('a[lang="en"]').first().click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("#inicio canvas")).toHaveCount(1, {
      timeout: 8_000,
    });
    expect(assetRequests).toBe(1);
  });

  test("returns to the static ring if the local asset fails", async ({
    page,
  }) => {
    let assetRequests = 0;
    await page.route("**/images/hud-glass-ring.svg", async (route) => {
      assetRequests += 1;
      await route.abort();
    });
    await page.goto("/es");

    try {
      await expect
        .poll(() => assetRequests, { timeout: 8_000 })
        .toBeGreaterThan(0);
    } catch {
      test.skip(true, "This browser does not expose WebGL2.");
    }
    await expect(page.getByTestId("hud-glass-fallback")).toBeVisible();
    await expect(page.locator("#inicio canvas")).toHaveCount(0);
  });

  test("uses the existing fallback after a WebGL context loss", async ({
    page,
  }) => {
    await page.goto("/es");
    const canvas = page.locator("#inicio canvas");
    try {
      await expect(canvas).toHaveCount(1, { timeout: 8_000 });
    } catch {
      test.skip(true, "This browser does not expose WebGL2.");
    }

    const contextCanBeLost = await canvas.evaluate((node) => {
      const element = node as HTMLCanvasElement;
      const gl = element.getContext("webgl2");
      return Boolean(gl?.getExtension("WEBGL_lose_context"));
    });
    test.skip(!contextCanBeLost, "WEBGL_lose_context is unavailable.");
    await canvas.evaluate((node) => {
      const element = node as HTMLCanvasElement;
      element
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext();
    });

    await expect(page.getByTestId("hud-glass-fallback")).toBeVisible();
    await expect(canvas).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Ver proyectos" }),
    ).toBeVisible();
  });
});
