import { expect, test } from "@playwright/test";

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
