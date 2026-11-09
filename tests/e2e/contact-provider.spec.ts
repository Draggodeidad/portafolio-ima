import { expect, test } from "@playwright/test";

test.skip(
  process.env.CONTACT_E2E_MOCK !== "1",
  "Requires a local server with a test sitekey",
);

test.beforeEach(async ({ page }) => {
  await page.route("**/api/contact/config", (route) =>
    route.fulfill({ json: { siteKey: "local-test" } }),
  );
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?**",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `window.turnstile = { render: (_el, options) => { setTimeout(() => options.callback('local-token'), 0); return 'widget'; }, reset: () => {}, remove: () => {} };`,
      }),
  );
});

for (const outcome of ["success", "failure", "rate-limit"] as const) {
  test(`contact ${outcome}`, async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status:
          outcome === "success" ? 200 : outcome === "rate-limit" ? 429 : 502,
        json: outcome === "success" ? { ok: true } : { error: outcome },
      }),
    );
    await page.goto("/en#contacto");
    await page.getByLabel("Name", { exact: true }).fill("Visitor");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("visitor@example.org");
    const message = page.getByLabel("Message", { exact: true });
    await message.fill("A valid message for testing.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("#contacto [role=status]")).toContainText(
      outcome === "success"
        ? "Message accepted"
        : outcome === "rate-limit"
          ? "Too many attempts"
          : "Could not send",
    );
    await expect(message).toHaveValue(
      outcome === "success" ? "" : "A valid message for testing.",
    );
  });
}

test("server validation is associated with the field", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 422,
      json: { error: "validation", fields: { name: "required" } },
    }),
  );
  await page.goto("/en#contacto");
  await page.getByLabel("Name", { exact: true }).fill("Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.org");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A valid message for testing.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#contact-name-error")).toContainText(
    "Complete this field",
  );
});

test("pending request disables the form and prevents duplicate submission", async ({
  page,
}) => {
  let count = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    count++;
    await pending;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/en#contacto");
  await page.getByLabel("Name", { exact: true }).fill("Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.org");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A valid message for testing.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toBeDisabled();
  await page
    .locator("#contacto form")
    .evaluate((form) =>
      form.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      ),
    );
  expect(count).toBe(1);
  release();
  await expect(page.locator("#contacto [role=status]")).toContainText(
    "Message accepted",
  );
});
