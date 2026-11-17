import { expect, test } from "@playwright/test";
import { networkInterfaces } from "node:os";

const lanAddresses = Object.values(networkInterfaces())
  .flatMap((interfaces) => interfaces ?? [])
  .filter((network) => !network.internal && network.family === "IPv4")
  .map((network) => network.address);
const lanAddress =
  lanAddresses.find((address) => address.startsWith("192.168.")) ??
  lanAddresses[0];

test("mobile menu opens on touch and closes after choosing a section", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto("/es");
  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  await menuButton.tap();

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  const mobileNavigation = page.locator("#mobile-navigation");
  await expect(mobileNavigation).toBeVisible();
  await expect(
    mobileNavigation.getByRole("link", { name: "Proyectos" }),
  ).toBeVisible();

  await mobileNavigation.getByRole("link", { name: "Proyectos" }).tap();
  await expect(page).toHaveURL(/\/es#proyectos$/);
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await context.close();
});

test("mobile menu opens and closes with the keyboard and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");

  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-navigation")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toBeFocused();
});

test("mobile menu keeps keyboard focus inside the header while open", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");

  const header = page.getByRole("banner");
  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  const mobileNavigation = page.locator("#mobile-navigation");
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(mobileNavigation).toBeVisible();

  // Tab past the last menu link wraps to the first header control.
  const lastLink = mobileNavigation.getByRole("link").last();
  await lastLink.focus();
  await page.keyboard.press("Tab");
  await expect(
    header.getByRole("link", { name: /Imanol Antonio/ }),
  ).toBeFocused();

  // Shift+Tab from the first control wraps back to the last menu link.
  await page.keyboard.press("Shift+Tab");
  await expect(lastLink).toBeFocused();

  // A full cycle never reaches the page behind the menu.
  for (let step = 0; step < 14; step += 1) {
    await page.keyboard.press("Tab");
    const insideHeader = await header.evaluate((element) =>
      element.contains(document.activeElement),
    );
    expect(insideHeader).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
  // Once closed, the trap is released and Tab continues into the page.
  await page.keyboard.press("Tab");
  const stillInHeader = await header.evaluate((element) =>
    element.contains(document.activeElement),
  );
  expect(stillInHeader).toBe(false);
});

test("mobile menu hydrates on the local network address", async ({
  browser,
}, testInfo) => {
  test.skip(!lanAddress, "No non-loopback IPv4 interface is available");
  const baseURL = testInfo.project.use.baseURL;
  const port = typeof baseURL === "string" ? new URL(baseURL).port : "3000";

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`http://${lanAddress}:${port}/es`);
  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  await menuButton.tap();

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await context.close();
});

test("navigation has four accessible targets and preserves anchors across languages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/es#proyectos");
  const header = page.getByRole("banner");
  const menu = page.locator("#mobile-navigation");
  await header.getByRole("button", { name: "Abrir menú" }).click();
  await expect(menu.getByRole("link")).toHaveText([
    "Proyectos",
    "Trayectoria",
    "Sobre mí",
    "Contacto",
  ]);
  await expect(menu.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  for (const control of await header
    .locator("a:visible, button:visible")
    .all()) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(43.9);
    expect(box?.width).toBeGreaterThanOrEqual(43.9);
  }
  await header
    .getByRole("link", { name: "Switch language to English" })
    .click();
  await expect(page).toHaveURL(/\/en#proyectos$/);
});
