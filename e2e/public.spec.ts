import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("la landing comunica la propuesta y enlaza los juegos", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /dibuja lo que todavía no sabes que imaginas/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /recibir ideas cada martes/i }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: /personajes locos/i }).first().click();
  await expect(page).toHaveURL(/\/juegos\/personajes-locos$/);
});

test("la biblioteca permite cambiar de libro y abrir una muestra", async ({
  page,
}) => {
  await page.goto("/mis-libros?libro=sant-jordi");

  await expect(
    page.getByRole("heading", { name: /Escoge un libro.*Ábrelo.*Quédate/i }),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("library-3d-scene")
      .or(page.getByRole("img", { name: "Libro abierto: Sant Jordi" })),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Seleccionar Sant Jordi" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".library-stage__topline, .library-stage__atmosphere, .library-stage__navigation")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator(".library-experience")).toHaveClass(/is-shelf/);
  await expect(page.getByRole("button", { name: "Abrir Sant Jordi tocando la portada" })).toHaveCount(0);

  await page.getByRole("tab", { name: "Seleccionar Kai y Emma" }).click();
  await expect(page.locator(".library-experience")).toHaveClass(/is-inspect/);
  await expect(page).toHaveURL(/\/mis-libros\?libro=kai-y-emma$/);

  await page.getByRole("button", { name: "Abrir Kai y Emma tocando la portada" }).click();
  await expect(page.locator(".library-experience")).toHaveClass(/is-reading/);
  await expect(page.getByRole("button", { name: "Página siguiente" })).toBeVisible();
  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(page.getByText("02 / 03")).toBeVisible();
  await page.getByRole("button", { name: "Página anterior" }).click();
  await expect(page.getByText("01 / 03")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar libro" }).click();
  await expect(page.getByRole("button", { name: "Abrir Kai y Emma tocando la portada" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".library-experience")).toHaveClass(/is-shelf/);
  await expect(page.getByRole("button", { name: "Abrir Kai y Emma tocando la portada" })).toHaveCount(0);

  await page.getByRole("tab", { name: "Seleccionar Simona" }).click();
  await expect(page.getByRole("button", { name: "Abrir Simona tocando la portada" })).toHaveCount(0);
});

test("todos los accesos del Club llevan a Skool", async ({ page }) => {
  const clubUrl =
    "https://www.skool.com/mi-club-de-ilustracion-3724/about";
  await page.goto("/");

  await expect(page.locator(`a[href="${clubUrl}"]`)).toHaveCount(7);
  await expect(
    page.locator('a[href="#club"], a[href="/#club"], a[href^="mailto:"][href*="Club"]'),
  ).toHaveCount(0);
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

test("el caldero permite elegir cada ingrediente de forma independiente", async ({
  page,
}) => {
  await page.goto("/juegos/caldero-magico");

  const ingredient = page.getByRole("button", {
    name: "Cambiar ingrediente base",
  });
  const personality = page.getByRole("button", {
    name: "Cambiar especia secreta",
  });
  const context = page.getByRole("button", {
    name: "Cambiar poción transformadora",
  });

  await ingredient.click();

  await expect(ingredient).toHaveAttribute("aria-pressed", "true");
  await expect(personality).toHaveAttribute("aria-pressed", "false");
  await expect(context).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText("1/3")).toBeVisible();
  await expect(page.getByText("Personaje invocado")).toHaveCount(0);

  await personality.click();
  await context.click();

  await expect(page.getByText("3/3")).toBeVisible();
  await expect(page.getByText("Personaje invocado")).toBeVisible();
});

test("los dos juegos convierten una foto del dibujo en una Story compartible", async ({
  page,
}) => {
  for (const game of ["personajes-locos", "caldero-magico"] as const) {
    await page.goto(`/juegos/${game}`);
    if (game === "personajes-locos") {
      await page.getByRole("button", { name: "Mezclar los cuatro" }).click();
    } else {
      await page.getByRole("button", { name: "Invocar personaje" }).click();
    }

    const cameraButton = page.getByRole("button", {
      name: "Fotografiar mi dibujo",
    });
    await expect(cameraButton).toBeEnabled({ timeout: 3_000 });
    await cameraButton.click();
    await expect(
      page.getByRole("heading", { name: "Encuadra tu creación" }),
    ).toBeVisible();

    await page
      .getByLabel("Elegir una foto de la galería")
      .setInputFiles("public/images/web-2026/marta-illustration.png");
    await expect(
      page.getByRole("heading", { name: "¿Te gusta esta foto?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Usar esta foto" }).click();

    await expect(
      page.getByRole("heading", { name: "Tu Story está lista" }),
    ).toBeVisible({ timeout: 3_000 });
    await expect(
      page.getByRole("button", { name: "Compartir en redes" }),
    ).toBeVisible();
    const saveButton = page.getByRole("button", { name: "Guardar" });
    await expect(saveButton).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await saveButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      game === "personajes-locos"
        ? "mi-dibujo-personajes-locos-marta-moreno.png"
        : "mi-dibujo-caldero-magico-marta-moreno.png",
    );
    await page.getByRole("button", { name: "Cerrar cámara" }).click();
  }
});

test("abre directamente la cámara nativa cuando no hay cámara en directo", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/juegos/caldero-magico");
  await page.getByRole("button", { name: "Invocar personaje" }).click();
  const chooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Fotografiar mi dibujo" }).click();
  const chooser = await chooserPromise;
  expect(chooser.isMultiple()).toBe(false);
  await chooser.setFiles("public/images/web-2026/marta-illustration.png");

  await expect(
    page.getByRole("heading", { name: "¿Te gusta esta foto?" }),
  ).toBeVisible();
  await expect(page.getByLabel("Abrir cámara del dispositivo")).toHaveAttribute(
    "capture",
    "environment",
  );
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
