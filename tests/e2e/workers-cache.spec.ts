import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const paths = ["es", "en"].flatMap((locale) =>
  [
    "",
    "/proyectos/pwa-utt",
    "/proyectos/secure-transfer",
    "/proyectos/classroom-github",
  ].map((suffix) => `/${locale}${suffix}`),
);

test.describe("Workers build-time response snapshots", () => {
  test.skip(
    process.env.PLAYWRIGHT_RUNTIME !== "workers",
    "Workers adapter only",
  );

  test("packages all eight pages as HTML and RSC snapshots", async () => {
    const manifest: { routes: { path?: string; status: string }[] } =
      JSON.parse(await readFile("dist/server/vinext-prerender.json", "utf8"));
    expect(
      manifest.routes
        .filter((route) => route.status === "rendered")
        .map((route) => route.path)
        .sort(),
    ).toEqual([...paths].sort());
    const index: Record<string, { kind: string }> = JSON.parse(
      await readFile("dist/client/_vinext/static-cache/index.json", "utf8"),
    );
    expect(
      Object.values(index).filter((entry) => entry.kind === "html"),
    ).toHaveLength(8);
    expect(
      Object.values(index).filter((entry) => entry.kind === "rsc"),
    ).toHaveLength(8);
  });

  test("serves HTML and RSC cache hits without leaking prerender origins", async ({
    request,
  }) => {
    for (const path of paths) {
      for (const rsc of [false, true]) {
        const response = await request.get(`${path}?evaluation=cache`, {
          headers: {
            ...(rsc ? { RSC: "1" } : {}),
            Cookie: path.startsWith("/es")
              ? "NEXT_LOCALE=en"
              : "NEXT_LOCALE=es",
          },
        });
        expect(response.status(), path).toBe(200);
        expect(response.headers()["x-vinext-cache"], `${path} RSC=${rsc}`).toBe(
          "HIT",
        );
        expect(response.headers()["content-type"]).toContain(
          rsc ? "text/x-component" : "text/html",
        );
        expect(response.headers()["link"]).toBeUndefined();
        const body = await response.text();
        expect(body).not.toContain("http://127.0.0.1:");
        expect(body).toContain(
          path.includes("/proyectos/")
            ? path.startsWith("/es")
              ? "Caso de estudio"
              : "Case study"
            : path.startsWith("/es")
              ? "Perfil de desarrollador"
              : "Developer profile",
        );
      }
    }
  });

  test("blocks direct access to private snapshot files", async ({
    request,
  }) => {
    const index: Record<string, { kind: string }> = JSON.parse(
      await readFile("dist/client/_vinext/static-cache/index.json", "utf8"),
    );
    const [id, entry] = Object.entries(index)[0];
    for (const path of ["index.json", `${id}.${entry.kind}`]) {
      expect(
        (await request.get(`/_vinext/static-cache/${path}`)).status(),
      ).toBe(404);
    }
    for (const path of ["/en/missing-page", "/es/proyectos/missing"]) {
      const response = await request.get(path);
      expect(response.status()).toBe(404);
      expect(response.headers()["x-vinext-cache"]).not.toBe("HIT");
    }
  });
});
