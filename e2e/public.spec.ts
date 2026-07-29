import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("la landing comunica la propuesta y enlaza los juegos", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /crea personajes que emocionen y conecten/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /recibir la newsletter/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /personajes locos/i }).first().click();
  await expect(page).toHaveURL(/\/juegos\/personajes-locos$/);
});

test("el juego de vasos mezcla y reinicia", async ({ page }) => {
  await page.goto("/juegos/personajes-locos");
  const firstCup = page.getByRole("button", { name: "Mezclar personaje" });
  await firstCup.click();
  await expect(firstCup).toContainText("Mezclando");
  await expect(firstCup).not.toContainText("Toca para mezclar", {
    timeout: 2_000,
  });
  await page.getByRole("button", { name: "Empezar de nuevo" }).click();
  await expect(firstCup).toContainText("Toca para mezclar");
});

test("el juego de vasos exporta la combinación para Stories", async ({
  page,
}, testInfo) => {
  await page.goto("/juegos/personajes-locos");
  await page.getByRole("button", { name: "Mezclar los cuatro" }).click();

  const downloadButton = page.getByRole("button", {
    name: "Descargar para Stories",
  });
  await expect(downloadButton).toBeEnabled({ timeout: 3_000 });

  const downloadPromise = page.waitForEvent("download");
  await downloadButton.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "personaje-loco-marta-moreno.png",
  );
  await download.saveAs(testInfo.outputPath("story-preview.png"));
});

test("el Caldero Mágico crea un resultado y habilita la exportación", async ({
  page,
}) => {
  await page.goto("/juegos/caldero-magico");
  await page.getByRole("button", { name: "Invocar personaje" }).click();
  await expect(page.getByText("Personaje invocado")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Descargar para Stories" }),
  ).toBeEnabled();
});

test("los juegos respetan la preferencia de movimiento reducido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto("/juegos/personajes-locos");
  await page.getByRole("button", { name: "Mezclar personaje" }).click();
  await expect(page.locator(".idea-cup__object").first()).toHaveCSS(
    "animation-name",
    "none",
  );

  await page.goto("/juegos/caldero-magico");
  await page.getByRole("button", { name: "Invocar personaje" }).click();
  await expect(page.locator(".magic-cauldron")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("las páginas públicas no tienen infracciones críticas de accesibilidad", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/juegos/personajes-locos",
    "/juegos/caldero-magico",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      `${path}: ${results.violations
        .map((violation) => violation.id)
        .join(", ")}`,
    ).toEqual([]);
  }
});

test("la URL antigua redirige de forma permanente", async ({ request }) => {
  const response = await request.get("/crea-personajes-locos", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/juegos/personajes-locos");

  const legacyResponse = await request.get("/crea-personajes-locos/");
  expect(legacyResponse.url()).toContain("/juegos/personajes-locos");
  expect(legacyResponse.ok()).toBe(true);
});
