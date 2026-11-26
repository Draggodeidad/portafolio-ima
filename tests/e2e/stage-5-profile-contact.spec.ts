import { expect, test, type Page } from "@playwright/test";

// Simulates a configured provider so the form renders; the Turnstile stub
// never issues a token, so nothing can be submitted.
async function offerContactForm(page: Page) {
  await page.route("**/api/contact/config", (route) =>
    route.fulfill({ json: { siteKey: "local-test" } }),
  );
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?**",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "window.turnstile = { render: () => 'widget', reset: () => {}, remove: () => {} };",
      }),
  );
}

for (const locale of ["es", "en"] as const) {
  test(`${locale}: profile sections, stack, footer, and navigation are localized`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const copy =
      locale === "es"
        ? {
            about: "Sobre mí",
            contact: "Contacto",
            experience: "Trayectoria",
            copyEmail: "Copiar correo",
          }
        : {
            about: "About",
            contact: "Contact",
            experience: "Experience",
            copyEmail: "Copy email",
          };

    await expect(page.locator("#sobre-mi h2")).toBeVisible();
    await expect(page.locator("#stack h3")).toBeVisible();
    await expect(page.locator("#contacto h2")).toBeVisible();
    await expect(page.locator("#trayectoria h2")).toBeVisible();
    await expect(page.locator("#trayectoria")).toContainText(
      "1Degree Holdings Limited",
    );
    await expect(page.locator("#trayectoria")).toContainText(
      "Universidad Tecnológica de Tehuacán",
    );
    const nav = page.locator("header nav").first();
    await expect(nav.getByRole("link", { name: copy.about })).toHaveAttribute(
      "href",
      `/${locale}#sobre-mi`,
    );
    await expect(nav.getByRole("link", { name: copy.contact })).toHaveAttribute(
      "href",
      `/${locale}#contacto`,
    );
    await expect(
      nav.getByRole("link", { name: copy.experience }),
    ).toHaveAttribute("href", `/${locale}#trayectoria`);

    await expect(page.locator("#stack")).toContainText(
      locale === "es" ? "También conozco:" : "Also familiar with:",
    );
    await expect(page.locator("#stack")).not.toContainText(
      locale === "es" ? "Sin caso publicado" : "No published case",
    );
    const sectionOrder = await page
      .locator("main > section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id));
    expect(sectionOrder.indexOf("proyectos")).toBeLessThan(
      sectionOrder.indexOf("trayectoria"),
    );
    expect(sectionOrder.indexOf("trayectoria")).toBeLessThan(
      sectionOrder.indexOf("sobre-mi"),
    );
    expect(sectionOrder.indexOf("sobre-mi")).toBeLessThan(
      sectionOrder.indexOf("contacto"),
    );
    await expect(page.locator("#trayectoria h3")).toHaveCount(3);
    // Without a configured provider the form is not offered; the direct
    // routes carry the section.
    await expect(page.locator("#contacto form")).toHaveCount(0);
    await expect(
      page.locator("#contacto").getByRole("button", { name: copy.copyEmail }),
    ).toBeVisible();
    await expect(
      page.locator("#contacto a[href='mailto:antonioimanol7@gmail.com']"),
    ).toBeVisible();
    const cvLinks = page.locator("a[href='/cv/CV_Imanol_Antonio.pdf']");
    await expect(cvLinks).toHaveCount(2);
    for (const link of await cvLinks.all())
      await expect(link).toHaveAttribute("download", "");
    await expect(page.locator("footer")).toContainText(
      "Imanol Antonio De la Cruz",
    );
  });

  test(`${locale}: invalid fields expose localized accessible errors`, async ({
    page,
  }) => {
    await offerContactForm(page);
    await page.goto(`/${locale}#contacto`);
    for (const label of locale === "es"
      ? ["Nombre", "Correo electrónico", "Mensaje"]
      : ["Name", "Email address", "Message"])
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    const name = page.getByLabel(locale === "es" ? "Nombre" : "Name", {
      exact: true,
    });
    await name.click();
    await page
      .getByLabel(locale === "es" ? "Correo electrónico" : "Email address", {
        exact: true,
      })
      .focus();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute(
      "aria-describedby",
      "contact-name-error",
    );
    // The verification hint is only for a visitor who tries to send.
    const hint = page.getByText(
      locale === "es"
        ? "Completa la verificación para enviar."
        : "Complete the verification to send.",
    );
    await expect(hint).toHaveCount(0);
    await expect(page.locator("#contact-name-error")).toContainText(
      locale === "es" ? "Completa este campo" : "Complete this field",
    );

    const email = page.getByLabel(
      locale === "es" ? "Correo electrónico" : "Email address",
      { exact: true },
    );
    await email.fill("not-an-email");
    await page
      .getByLabel(locale === "es" ? "Mensaje" : "Message", { exact: true })
      .focus();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-email-error")).toContainText(
      locale === "es" ? "dirección de correo válida" : "valid email address",
    );

    // Valid fields but no token: the one status line asks for verification.
    await name.fill("Visitor");
    await email.fill("visitor@example.org");
    await page
      .getByLabel(locale === "es" ? "Mensaje" : "Message", { exact: true })
      .fill("A valid message for testing.");
    await page
      .getByRole("button", {
        name: locale === "es" ? "Enviar mensaje" : "Send message",
      })
      .click();
    await expect(page.locator("#contacto form [role=status]")).toHaveText(
      locale === "es"
        ? "Completa la verificación para enviar."
        : "Complete the verification to send.",
    );
  });
}

test("contact navigation from a study returns to the matching home section", async ({
  page,
}) => {
  await page.goto("/en/proyectos/pwa-utt");
  await page
    .locator("header nav")
    .first()
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/\/en#contacto$/);
  await expect(page.locator("#contacto h2")).toBeVisible();
});

test("published CV is served as a PDF", async ({ request }) => {
  const response = await request.get("/cv/CV_Imanol_Antonio.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("copy email confirms without changing the button width", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/es#contacto");
  const button = page
    .locator("#contacto")
    .getByRole("button", { name: "Copiar correo" });
  const before = await button.boundingBox();
  await button.click();
  const done = page
    .locator("#contacto")
    .getByRole("button", { name: "Copiado" });
  await expect(done).toBeVisible();
  expect((await done.boundingBox())?.width).toBe(before?.width);
  await expect(
    page.locator("#contacto").getByRole("button", { name: "Copiar correo" }),
  ).toBeVisible({ timeout: 4000 });
});

test("contact card links share one style", async ({ page }) => {
  await page.goto("/es#contacto");
  const links = page.locator("#contacto aside li a");
  await expect(links).toHaveCount(3);
  const looks = await links.evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const style = getComputedStyle(anchor);
      return [style.color, style.fontSize, style.fontWeight].join(" ");
    }),
  );
  expect(new Set(looks).size).toBe(1);
});

test("contact form stays hidden until a service is configured", async ({
  page,
}) => {
  const config = page.waitForResponse("**/api/contact/config");
  await page.goto("/en#contacto");
  expect(await (await config).json()).toEqual({ siteKey: null });
  await expect(page.locator("#contacto form")).toHaveCount(0);
  await expect(
    page.locator("#contacto a[href='mailto:antonioimanol7@gmail.com']"),
  ).toBeVisible();
});

test("profile sections have no horizontal overflow and honor reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["es", "en"] as const) {
    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.document,
        `${locale} overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport);
      const scrollBehavior = await page
        .locator("html")
        .evaluate((element) => getComputedStyle(element).scrollBehavior);
      expect(scrollBehavior).toBe("auto");
    }
  }
});
