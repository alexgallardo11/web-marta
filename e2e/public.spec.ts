import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("la landing comunica la propuesta y enlaza la biblioteca", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /la ilustración infantil.*no es solo dibujar bonito/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /ver todos mis libros/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: /desfile de personajes infantiles ilustrados por Marta Moreno/i,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: /ver todos mis libros/i }).click();
  await expect(page).toHaveURL(/\/mis-libros$/);
});

test("la landing se adapta a móvil y tablet sin desbordamiento", async ({
  page,
}) => {
  test.setTimeout(60_000);

  for (const viewport of [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const layout = await page.evaluate(() => {
      const testimonial = document.querySelector(".reference-testimonial-card");
      const menu = document.querySelector(".site-header__mobile summary");
      const menuRect = menu?.getBoundingClientRect();

      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        testimonialWidth: testimonial?.getBoundingClientRect().width ?? 0,
        menuSize: menuRect && menuRect.height > 0 ? menuRect.height : null,
      };
    });

    expect(layout.scrollWidth).toBe(layout.clientWidth);
    expect(layout.testimonialWidth).toBeGreaterThanOrEqual(
      viewport.width < 640 ? viewport.width * 0.8 : 275,
    );
    if (layout.menuSize !== null) {
      expect(layout.menuSize).toBeGreaterThanOrEqual(44);
    }
  }
});

test("el pie móvil conserva sus enlaces en una fila y actualiza el año", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");

  const footerLinks = page.locator(".reference-footer__main > a");
  await expect(footerLinks).toHaveCount(3);
  await expect(footerLinks).toHaveText([
    "Aviso legal",
    "Instagram",
    "Contacto",
  ]);

  const linkPositions = await footerLinks.evaluateAll((links) =>
    links.map((link) => Math.round(link.getBoundingClientRect().top)),
  );
  expect(new Set(linkPositions).size).toBe(1);
  await expect(page.locator(".reference-footer__bottom time")).toHaveText(
    String(new Date().getFullYear()),
  );
});

test("el menú móvil se cierra al pulsar fuera y con Escape", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/");

  const mobileMenu = page.locator(".site-header__mobile");
  const menuButton = mobileMenu.locator("summary");

  await menuButton.click();
  await expect(mobileMenu).toHaveAttribute("open", "");
  await page.locator("main").click({ position: { x: 4, y: 300 } });
  await expect(mobileMenu).not.toHaveAttribute("open", "");

  await menuButton.click();
  await page.keyboard.press("Escape");
  await expect(mobileMenu).not.toHaveAttribute("open", "");
  await expect(menuButton).toBeFocused();
});

test("el acceso flotante aparece al bajar y vuelve al inicio", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/mis-libros");

  const scrollTopButton = page.getByRole("button", { name: "Volver arriba" });
  await expect(scrollTopButton).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(scrollTopButton).toBeVisible();
  await scrollTopButton.click();

  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThanOrEqual(1);
});

test("la landing abre libros y reseñas completas sin abandonar la página", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: "Abrir imágenes de Sant Jordi" })
    .click();
  const bookDialog = page.getByRole("dialog", { name: "Sant Jordi" });
  await expect(bookDialog).toBeVisible();
  await expect(bookDialog.getByText("Imagen 1 de 5")).toBeVisible();
  await bookDialog.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(bookDialog.getByText("Imagen 2 de 5")).toBeVisible();
  await bookDialog
    .getByRole("button", { name: "Cerrar imágenes del libro" })
    .click();
  await expect(page).toHaveURL(/\/$/);

  const firstReview = page.locator(".reference-testimonial-card").first();
  await firstReview.getByRole("button", { name: "Ver más" }).click();
  const reviewDialog = page.getByRole("dialog", { name: "SANTI" });
  await expect(reviewDialog).toContainText(
    "Incluso he preparado mi propio cuadernillo",
  );
  await page.keyboard.press("Escape");
  await expect(reviewDialog).toBeHidden();
});

test("la página editorial filtra los libros sin páginas individuales", async ({
  page,
}) => {
  const selectFilter = async (label: string) => {
    const mobileFilter = page.locator(".reference-library-filter-menu");
    if (await mobileFilter.isVisible()) {
      await mobileFilter
        .locator(".reference-library-filter-menu__trigger")
        .click();
      await mobileFilter.getByRole("option", { name: label }).click();
      return;
    }
    await page.getByRole("button", { name: label }).click();
  };

  await page.goto("/mis-libros");

  await expect(page.getByRole("heading", { name: "Mis libros" })).toBeVisible();
  await expect(page.locator(".reference-library-card")).toHaveCount(19);
  await expect(page.locator(".reference-library-card__number")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Volver atrás" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(
    page.getByRole("img", { name: "Marta Moreno dibujando en su estudio" }),
  ).toBeVisible();
  await expect(page.getByText("Ver el libro", { exact: true })).toHaveCount(0);
  await expect(page.locator(".reference-library-card a")).toHaveCount(0);
  const cardSpacing = await page.locator(".reference-library-card").evaluateAll(
    (cards) =>
      cards.map((card) => {
        const figureBottom = card.querySelector("figure")?.getBoundingClientRect().bottom ?? 0;
        const titleTop = card.querySelector("h2")?.getBoundingClientRect().top ?? 0;
        return titleTop - figureBottom;
      }),
  );
  expect(Math.min(...cardSpacing)).toBeGreaterThanOrEqual(15);

  await selectFilter("Colección Antón Piñón");
  await expect(page.locator(".reference-library-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Antón Piñón" })).toBeVisible();

  await selectFilter("Autoría integral");
  await expect(page.locator(".reference-library-card")).toHaveCount(5);

  await selectFilter("Todos los libros");
  await expect(page.locator(".reference-library-card")).toHaveCount(19);

  const removedPage = await page.request.get("/mis-libros/sant-jordi");
  expect(removedPage.status()).toBe(404);
});

test("los accesos del Club distinguen la página informativa de Skool", async ({ page }) => {
  const clubUrl =
    "https://www.skool.com/mi-club-de-ilustracion-3724/about";
  await page.goto("/");

  await expect(page.locator(`a[href="${clubUrl}"]`)).toHaveCount(1);
  await expect(page.locator('a[href="/mi-club-de-ilustracion"]')).toHaveCount(1);
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
    "/mis-libros",
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
