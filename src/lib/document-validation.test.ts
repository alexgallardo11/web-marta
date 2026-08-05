import { describe, expect, it } from "vitest";
import {
  MAX_PDF_BYTES,
  completeDocumentSchema,
  createLinkSchema,
  hasPdfSignature,
  isPdfMimeType,
  isValidLinkExpiry,
  isPdfFilename,
  uploadRequestSchema,
} from "@/lib/document-validation";

describe("validación de documentos", () => {
  it("acepta extensiones PDF sin distinguir mayúsculas", () => {
    expect(isPdfFilename("guia.pdf")).toBe(true);
    expect(isPdfFilename("GUIA.PDF")).toBe(true);
    expect(isPdfFilename("guia.png")).toBe(false);
  });

  it("solo acepta el tipo MIME PDF", () => {
    expect(isPdfMimeType("application/pdf")).toBe(true);
    expect(isPdfMimeType("APPLICATION/PDF")).toBe(true);
    expect(isPdfMimeType("application/octet-stream")).toBe(false);
  });

  it("rechaza archivos vacíos y mayores de 100 MB", () => {
    expect(
      uploadRequestSchema.safeParse({ filename: "guia.pdf", sizeBytes: 0 })
        .success,
    ).toBe(false);
    expect(
      uploadRequestSchema.safeParse({
        filename: "guia.pdf",
        sizeBytes: MAX_PDF_BYTES + 1,
      }).success,
    ).toBe(false);
  });

  it("acepta una finalización válida y una caducidad ISO", () => {
    expect(
      completeDocumentSchema.safeParse({
        title: "Guía creativa",
        storagePath: "5d908eef-2723-4893-a27e-f9edfb918402/v1.pdf",
        originalFilename: "guia.pdf",
        sizeBytes: 2048,
      }).success,
    ).toBe(true);
    expect(
      createLinkSchema.safeParse({
        expiresAt: "2030-01-01T23:59:59.000Z",
      }).success,
    ).toBe(true);
    expect(createLinkSchema.safeParse({}).success).toBe(false);
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    expect(isValidLinkExpiry("2026-01-02T00:00:00.000Z", now)).toBe(true);
    expect(isValidLinkExpiry("2027-01-02T00:00:00.000Z", now)).toBe(false);
    expect(isValidLinkExpiry("2025-12-31T23:59:59.000Z", now)).toBe(false);
  });

  it("comprueba la firma binaria del PDF", async () => {
    const valid = new File(["%PDF-1.7\ncontenido"], "guia.pdf", {
      type: "application/pdf",
    });
    const disguised = new File(["imagen"], "falso.pdf", {
      type: "application/pdf",
    });

    await expect(hasPdfSignature(valid)).resolves.toBe(true);
    await expect(hasPdfSignature(disguised)).resolves.toBe(false);
  });
});
