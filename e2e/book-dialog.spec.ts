import { expect, test } from "@playwright/test";

test("navega el carrusel de libros con flechas junto a los puntos", async ({
  page,
}) => {
  await page.goto("/");

  const controls = page.getByRole("group", {
    name: "Controles del carrusel",
  });
  await controls.scrollIntoViewIfNeeded();

  const previousButton = controls.getByRole("button", {
    name: "Ver libro anterior",
  });
  const nextButton = controls.getByRole("button", {
    name: "Ver siguiente libro",
  });
  const firstDot = controls.locator(
    ".reference-books__pagination button",
  ).first();

  const controlsLayout = await controls.evaluate((element) => {
    const previousArrow = element.querySelector(
      ".reference-books__arrow--previous",
    );
    const nextArrow = element.querySelector(".reference-books__arrow--next");
    const dots = Array.from(
      element.querySelectorAll(".reference-books__pagination button"),
    );

    if (!previousArrow || !nextArrow || dots.length === 0) {
      throw new Error("No se encontraron todos los controles del carrusel.");
    }

    const firstDotBounds = dots[0].getBoundingClientRect();
    const lastDotBounds = dots.at(-1)?.getBoundingClientRect();

    if (!lastDotBounds) {
      throw new Error("No se encontró el último punto del carrusel.");
    }

    return {
      firstDotLeft: firstDotBounds.left,
      lastDotRight: lastDotBounds.right,
      previousArrowRight: previousArrow.getBoundingClientRect().right,
      nextArrowLeft: nextArrow.getBoundingClientRect().left,
    };
  });

  await expect(previousButton).toBeDisabled();
  await expect(firstDot).toHaveAttribute("aria-current", "true");
  expect(controlsLayout.firstDotLeft).toBeGreaterThan(
    controlsLayout.previousArrowRight,
  );
  expect(controlsLayout.lastDotRight).toBeLessThan(
    controlsLayout.nextArrowLeft,
  );

  await nextButton.click();
  await expect(previousButton).toBeEnabled();
  await expect(firstDot).not.toHaveAttribute("aria-current", "true");

  await previousButton.click();
  await expect(firstDot).toHaveAttribute("aria-current", "true");
});

test("abre y navega el visor de libros desde el carrusel de inicio", async ({
  page,
}) => {
  await page.goto("/");

  const openBook = page
    .getByRole("button", { name: /^Abrir imágenes de / })
    .first();
  await openBook.scrollIntoViewIfNeeded();
  await openBook.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Imagen 1 de/)).toBeVisible();

  await dialog.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(dialog.getByText(/Imagen 2 de/)).toBeVisible();

  await dialog
    .getByRole("button", { name: "Cerrar imágenes del libro" })
    .click();
  await expect(dialog).toBeHidden();
});

test("abre el mismo visor desde la galería de Mis libros", async ({ page }) => {
  await page.goto("/mis-libros");

  const openBook = page
    .getByRole("button", { name: /^Abrir imágenes de / })
    .first();
  await openBook.scrollIntoViewIfNeeded();
  await openBook.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Imagen 1 de/)).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Ver imagen 1" }),
  ).toHaveAttribute("aria-pressed", "true");

  await dialog
    .getByRole("button", { name: "Cerrar imágenes del libro" })
    .click();
  await expect(dialog).toBeHidden();
});
