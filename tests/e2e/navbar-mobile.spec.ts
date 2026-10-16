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
