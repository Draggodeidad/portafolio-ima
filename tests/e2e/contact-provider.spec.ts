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
        body: `window.__turnstile = { options: null, resets: 0 };
window.turnstile = {
  render: (el, options) => {
    window.__turnstile.options = options;
    const frame = document.createElement('iframe');
    frame.title = 'Turnstile mock';
    frame.style.display = 'block';
    frame.style.width = options.size === 'compact' ? '150px' : options.size === 'flexible' ? '100%' : '300px';
    frame.style.height = options.size === 'compact' ? '140px' : '65px';
    frame.style.border = '0';
    el.appendChild(frame);
    setTimeout(() => options.callback('local-token'), 0);
    return 'widget';
  },
  reset: () => {
    window.__turnstile.resets++;
    setTimeout(() => window.__turnstile.options.callback('local-token-2'), 0);
  },
  remove: () => {},
};`,
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
    await expect(page.locator("#contacto form [role=status]")).toContainText(
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
  const submit = page.locator("#contacto form button[type=submit]");
  const idleWidth = (await submit.boundingBox())?.width;
  await submit.click();
  await expect(page.getByLabel("Name", { exact: true })).toBeDisabled();
  await expect(submit).toHaveAttribute("aria-busy", "true");
  await expect(submit).toHaveAccessibleName("Sending…");
  expect((await submit.boundingBox())?.width).toBe(idleWidth);
  await page
    .locator("#contacto form")
    .evaluate((form) =>
      form.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      ),
    );
  expect(count).toBe(1);
  release();
  await expect(page.locator("#contacto form [role=status]")).toContainText(
    "Message accepted",
  );
});

for (const locale of ["es", "en"] as const) {
  test(`${locale}: configured contact fits the 360px viewport and shows the right intro`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/${locale}#contacto`);
    const form = page.locator("#contacto form");
    const widget = form.getByTitle("Turnstile mock");
    await expect(widget).toBeVisible();
    await expect(form).toContainText(
      locale === "es"
        ? "Cuéntame cómo puedo ayudarte."
        : "Tell me how I can help.",
    );
    await expect(form).not.toContainText(
      locale === "es"
        ? "el envío todavía no está disponible"
        : "sending is not available yet",
    );
    await expect(
      form.getByRole("button", {
        name: locale === "es" ? "Enviar mensaje" : "Send message",
      }),
    ).toBeEnabled();
    const geometry = await widget.evaluate((frame) => {
      const form = frame.closest("form")!.getBoundingClientRect();
      const box = frame.getBoundingClientRect();
      return {
        viewport: document.documentElement.clientWidth,
        page: document.documentElement.scrollWidth,
        left: box.left,
        right: box.right,
        formLeft: form.left,
        formRight: form.right,
        width: box.width,
        height: box.height,
      };
    });
    expect(geometry.page).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.left).toBeGreaterThanOrEqual(geometry.formLeft);
    expect(geometry.right).toBeLessThanOrEqual(geometry.formRight);
    expect(geometry.width).toBe(150);
    expect(geometry.height).toBe(140);
  });
}

test("a sent message clears the form and the confirmation stays alone", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 200, json: { ok: true } }),
  );
  await page.goto("/en#contacto");
  const name = page.getByLabel("Name", { exact: true });
  await name.fill("Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.org");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A valid message for testing.");
  await page.getByRole("button", { name: "Send message" }).click();
  const status = page.locator("#contacto form [role=status]");
  await expect(status).toHaveText(
    "Message accepted for sending. Thanks for reaching out.",
  );
  await expect(name).toHaveValue("");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __turnstile: { resets: number } }).__turnstile
          .resets,
    ),
  ).toBe(1);
  // The widget's next token must not bring the verification hint back.
  await page.waitForTimeout(100);
  await expect(page.getByText("Complete the verification")).toHaveCount(0);
  await expect(page.locator("#contacto form [role=status] > *")).toHaveCount(1);
  // Writing a new message clears the confirmation.
  await name.pressSequentially("A");
  await expect(status).toHaveText("");
});

test("sending without verification asks for it and sends nothing", async ({
  page,
}) => {
  let posts = 0;
  await page.route("**/api/contact", (route) => {
    posts++;
    return route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?**",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "window.turnstile = { render: () => 'widget', reset: () => {}, remove: () => {} };",
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
  await expect(page.locator("#contacto form [role=status]")).toHaveText(
    "Complete the verification to send.",
  );
  expect(posts).toBe(0);
});

test("a network failure is reported once", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.abort("failed"));
  await page.goto("/en#contacto");
  await page.getByLabel("Name", { exact: true }).fill("Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.org");
  const message = page.getByLabel("Message", { exact: true });
  await message.fill("A valid message for testing.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contacto form [role=status]")).toHaveText(
    "Could not send message. Please try again.",
  );
  await expect(message).toHaveValue("A valid message for testing.");
});

test("submitting empty fields marks each field and focuses the first", async ({
  page,
}) => {
  let posts = 0;
  await page.route("**/api/contact", (route) => {
    posts++;
    return route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/en#contacto");
  await page.getByRole("button", { name: "Send message" }).click();
  const name = page.getByLabel("Name", { exact: true });
  await expect(name).toBeFocused();
  for (const field of ["name", "email", "message"]) {
    const control = page.locator(`#contact-${field}`);
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAttribute(
      "aria-describedby",
      `contact-${field}-error`,
    );
  }
  await expect(page.locator("#contacto form [role=status]")).toHaveText("");
  expect(posts).toBe(0);
});

test("both primary buttons print white on ink", async ({ page }) => {
  await page.goto("/en#contacto");
  for (const button of [
    page.locator("#contacto a[href^='mailto:']"),
    page.locator("#contacto form button[type=submit]"),
  ]) {
    const colours = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.color, style.backgroundColor];
    });
    expect(colours).toEqual(["rgb(255, 255, 255)", "rgb(31, 58, 147)"]);
  }
});
