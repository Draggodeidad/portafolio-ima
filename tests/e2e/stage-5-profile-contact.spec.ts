import { expect, test } from "@playwright/test";

for (const locale of ["es", "en"] as const) {
  test(`${locale}: profile sections, stack, footer, and navigation are localized`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const copy =
      locale === "es"
        ? {
            about: "Sobre mí",
            stack: "Stack",
            contact: "Contacto",
            backend: "Backend",
            experience: "Trayectoria",
            pending: "El envío está deshabilitado",
          }
        : {
            about: "About",
            stack: "Stack",
            contact: "Contact",
            backend: "Backend",
            experience: "Experience",
            pending: "Sending is disabled",
          };

    await expect(page.locator("#sobre-mi h2")).toBeVisible();
    await expect(page.locator("#stack h2")).toBeVisible();
    await expect(page.locator("#contacto h2")).toBeVisible();
    await expect(page.locator("#trayectoria")).toHaveCount(0);
    const nav = page.locator("header nav").first();
    await expect(nav.getByRole("link", { name: copy.about })).toHaveAttribute(
      "href",
      `/${locale}#sobre-mi`,
    );
    await expect(nav.getByRole("link", { name: copy.stack })).toHaveAttribute(
      "href",
      `/${locale}#stack`,
    );
    await expect(nav.getByRole("link", { name: copy.contact })).toHaveAttribute(
      "href",
      `/${locale}#contacto`,
    );
    await expect(nav.getByRole("link", { name: copy.experience })).toHaveCount(
      0,
    );

    await expect(page.locator("#stack")).toContainText(copy.backend);
    await expect(page.locator("#stack")).toContainText(
      locale === "es" ? "En proyecto" : "In a project",
    );
    await expect(page.locator("#stack")).toContainText(
      locale === "es" ? "Declarado" : "Declared",
    );
    await expect(page.locator("#contacto [role=status]")).toContainText(
      copy.pending,
    );
    await expect(
      page.getByRole("button", {
        name: locale === "es" ? "Enviar mensaje" : "Send message",
      }),
    ).toBeDisabled();
    await expect(page.locator("a[href^='mailto:']")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /CV|Download CV/ }),
    ).toHaveCount(0);
    await expect(page.locator("footer")).toContainText(
      "Imanol Antonio De la Cruz",
    );

    const fields =
      locale === "es"
        ? ["Nombre", "Correo electrónico", "Mensaje"]
        : ["Name", "Email address", "Message"];
    for (const label of fields)
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  });

  test(`${locale}: invalid fields expose localized accessible errors`, async ({
    page,
  }) => {
    await page.goto(`/${locale}#contacto`);
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

test("contact form does not submit until a service is configured", async ({
  page,
}) => {
  await page.goto("/en#contacto");
  await page.getByLabel("Name", { exact: true }).fill("Recruiter");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("recruiter@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A valid message body.");

  const submissionWasCanceled = await page
    .locator("#contacto form")
    .evaluate(
      (form) =>
        !form.dispatchEvent(
          new SubmitEvent("submit", { bubbles: true, cancelable: true }),
        ),
    );
  expect(submissionWasCanceled).toBe(true);
  await expect(page).toHaveURL(/\/en#contacto$/);
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
