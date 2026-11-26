import { expect, test, type Page } from "@playwright/test";

// A production build: `next start` in CI or on request, or the Worker.
const production =
  Boolean(process.env.CI) ||
  process.env.PLAYWRIGHT_PRODUCTION === "1" ||
  process.env.PLAYWRIGHT_RUNTIME === "workers";

async function fillValidMessage(page: Page) {
  await page.getByLabel("Name", { exact: true }).fill("Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.org");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A valid message for testing.");
}

const turnstileResets = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __turnstile: { resets: number } }).__turnstile
        .resets,
  );

/** Holds every POST to the contact API until `release` is called. */
async function holdContactRequests(page: Page, status = 200) {
  let posts = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    posts++;
    await pending;
    await route.fulfill({
      status,
      json: status === 200 ? { ok: true } : { error: "provider" },
    });
  });
  return { release, posts: () => posts };
}

const plane = (page: Page, phase?: string) =>
  page.locator(
    phase ? `[data-paper-plane][data-phase="${phase}"]` : "[data-paper-plane]",
  );

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
    await fillValidMessage(page);
    const message = page.getByLabel("Message", { exact: true });
    await page.getByRole("button", { name: "Send message" }).click();
    if (outcome === "success") {
      await expect(page.locator("#contacto form [role=status]")).toHaveText(
        "Message sent",
      );
      await expect(
        page.getByRole("heading", { name: "Message sent" }),
      ).toBeFocused();
      await expect(page.locator("#contacto form")).toContainText(
        "I'll reply to visitor@example.org",
      );
    } else {
      await expect(page.locator("#contacto form [role=status]")).toContainText(
        outcome === "rate-limit" ? "Too many attempts" : "Could not send",
      );
      await expect(message).toHaveValue("A valid message for testing.");
      await expect(message).toBeVisible();
    }
    await expect(page.locator("[data-paper-plane]")).toHaveCount(0);
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
  // Without motion the form stays in place while it sends.
  await page.emulateMedia({ reducedMotion: "reduce" });
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
    "Message sent",
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

test("a sent message shows the card; sending another starts empty", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 200, json: { ok: true } }),
  );
  await page.goto("/en#contacto");
  await fillValidMessage(page);
  await page.getByRole("button", { name: "Send message" }).click();
  const status = page.locator("#contacto form [role=status]");
  await expect(status).toHaveText("Message sent");
  await expect(
    page.getByRole("heading", { name: "Message sent" }),
  ).toBeFocused();
  // The used token is replaced only when another message is started.
  expect(await turnstileResets(page)).toBe(0);
  await expect(page.locator("#contacto form [role=status] > *")).toHaveCount(1);

  await page.getByRole("button", { name: "Send another message" }).click();
  const name = page.getByLabel("Name", { exact: true });
  await expect(name).toBeFocused();
  await expect(name).toHaveValue("");
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Message sent" })).toHaveCount(
    0,
  );
  expect(await turnstileResets(page)).toBe(1);
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

for (const locale of ["es", "en"] as const) {
  test(`${locale}: Turnstile is light, localized and as wide as the fields`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${locale}#contacto`);
    const form = page.locator("#contacto form");
    const widget = form.getByTitle("Turnstile mock");
    await expect(widget).toBeVisible();
    const options = await page.evaluate(() => {
      const { options } = (
        window as unknown as {
          __turnstile: { options: Record<string, unknown> };
        }
      ).__turnstile;
      return {
        theme: options.theme,
        language: options.language,
        size: options.size,
      };
    });
    expect(options).toEqual({
      theme: "light",
      language: locale,
      size: "flexible",
    });
    const [frame, field] = await Promise.all([
      widget.boundingBox(),
      form.locator("#contact-message").boundingBox(),
    ]);
    expect(frame?.x).toBe(field?.x);
    expect(frame?.width).toBe(field?.width);
  });
}

test.describe("paper plane", () => {
  test("waits for the server and takes off only once it confirms", async ({
    page,
  }) => {
    const server = await holdContactRequests(page);
    await page.goto("/en#contacto");
    await fillValidMessage(page);
    const form = page.locator("#contacto form");
    const submit = page.getByRole("button", { name: "Send message" });
    // Scroll first, so the click does not move the (sticky) card itself.
    await submit.scrollIntoViewIfNeeded();
    const boxes = () =>
      page.evaluate(() => {
        const box = (selector: string) =>
          document.querySelector(selector)!.getBoundingClientRect().toJSON();
        return {
          scrollY: window.scrollY,
          form: box("#contacto form"),
          card: box("#contacto aside"),
          section: box("#contacto"),
        };
      });
    const before = await boxes();
    await page.evaluate(() => {
      const shifts: number[] = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          shifts.push((entry as unknown as { value: number }).value);
      }).observe({ type: "layout-shift" });
      (window as unknown as { __shifts: number[] }).__shifts = shifts;
    });
    await submit.click();

    await expect(plane(page, "hover")).toBeAttached();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toHaveCount(0);
    // A second submit while the plane waits sends nothing.
    await form.evaluate((element) =>
      element.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      ),
    );
    expect(server.posts()).toBe(1);
    const during = await boxes();

    server.release();
    await expect(plane(page, "takeoff")).toBeAttached();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    await expect(plane(page)).toHaveCount(0);
    expect(server.posts()).toBe(1);

    // Nothing moved: the form keeps its box while hidden, the card stays.
    expect(during).toEqual(before);
    expect(await boxes()).toEqual(before);
    expect(
      await page.evaluate(
        () => (window as unknown as { __shifts: number[] }).__shifts,
      ),
    ).toEqual([]);
  });

  test("unfolds on an error and gives the form back with its values", async ({
    page,
  }) => {
    const server = await holdContactRequests(page, 502);
    await page.goto("/en#contacto");
    await fillValidMessage(page);
    const submit = page.getByRole("button", { name: "Send message" });
    await submit.click();
    await expect(plane(page, "hover")).toBeAttached();
    server.release();
    await expect(plane(page, "unfold")).toBeAttached();
    await expect(page.locator("#contacto form [role=status]")).toHaveText(
      "Could not send message. Please try again.",
    );
    await expect(plane(page)).toHaveCount(0);
    await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
      "A valid message for testing.",
    );
    await expect(submit).toBeFocused();
    expect(await turnstileResets(page)).toBe(1);
  });

  test("leaves no overlay behind when the page changes mid-flight", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const server = await holdContactRequests(page);
    await page.goto("/en#contacto");
    await fillValidMessage(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(plane(page, "hover")).toBeAttached();
    await page
      .locator("a[href*='/projects/'], a[href*='/proyectos/']")
      .first()
      .click();
    await expect(page).toHaveURL(/\/(projects|proyectos)\//);
    await expect(plane(page)).toHaveCount(0);
    server.release();
    await page.waitForTimeout(300);
    await expect(plane(page)).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("reduced motion crossfades to the card without a plane", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, json: { ok: true } }),
    );
    await page.goto("/en#contacto");
    await page.evaluate(() => {
      const seen = { plane: false };
      new MutationObserver(() => {
        if (document.querySelector("[data-paper-plane]")) seen.plane = true;
      }).observe(document.body, { childList: true, subtree: true });
      (window as unknown as { __seen: typeof seen }).__seen = seen;
    });
    await fillValidMessage(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __seen: { plane: boolean } }).__seen.plane,
      ),
    ).toBe(false);
  });

  test("is downloaded on the first focus in the form, not before", async ({
    page,
  }) => {
    const scripts: string[] = [];
    page.on("response", async (response) => {
      if (response.request().resourceType() !== "script") return;
      scripts.push(await response.text().catch(() => ""));
    });
    await page.goto("/en#contacto");
    await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
    await page.waitForLoadState("networkidle");
    const loaded = () =>
      scripts.some((source) => source.includes("data-paper-plane"));
    expect(loaded()).toBe(false);
    await page.getByLabel("Name", { exact: true }).focus();
    await expect.poll(loaded).toBe(true);
  });

  test("the development mock never reaches a production build", async ({
    page,
  }) => {
    const server = await holdContactRequests(page);
    await page.goto("/en?mockContact=success#contacto");
    await fillValidMessage(page);
    await page.getByRole("button", { name: "Send message" }).click();
    if (production) {
      // The real request goes out: the query string did nothing.
      await expect.poll(server.posts).toBe(1);
      server.release();
    }
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    expect(server.posts()).toBe(production ? 1 : 0);
  });
});
