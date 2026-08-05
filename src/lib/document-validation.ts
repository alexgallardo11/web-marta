import { z } from "zod";

export const MAX_PDF_BYTES = 100 * 1024 * 1024;
export const uuidSchema = z.string().uuid();

export const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  sizeBytes: z.number().int().positive().max(MAX_PDF_BYTES),
  mimeType: z.string().trim().default("application/pdf"),
  documentId: z.string().uuid().optional(),
});

export const completeDocumentSchema = z.object({
  title: z.string().trim().min(1).max(160),
  storagePath: z.string().trim().min(1).max(500),
  originalFilename: z.string().trim().min(1).max(255),
  sizeBytes: z.number().int().positive().max(MAX_PDF_BYTES),
  mimeType: z.string().trim().default("application/pdf"),
  documentId: z.string().uuid().optional(),
});

export const renameDocumentSchema = z.object({
  title: z.string().trim().min(1).max(160),
});

export const createLinkSchema = z.object({
  expiresAt: z.string().datetime(),
});

export const adminInvitationSchema = z.object({
  email: z.string().trim().email().max(320),
});

export const adminStatusSchema = z.object({
  isActive: z.boolean(),
});

export const MAX_LINK_LIFETIME_DAYS = 365;

export function isPdfMimeType(mimeType: string) {
  return mimeType.toLowerCase() === "application/pdf";
}

export function isValidLinkExpiry(expiresAt: string, now = Date.now()) {
  const time = new Date(expiresAt).getTime();
  const max = now + MAX_LINK_LIFETIME_DAYS * 24 * 60 * 60 * 1000;
  return Number.isFinite(time) && time > now && time <= max;
}

export function isPdfFilename(filename: string) {
  return filename.toLowerCase().endsWith(".pdf");
}

export async function hasPdfSignature(file: File) {
  const signature = new TextDecoder("ascii").decode(
    await file.slice(0, 5).arrayBuffer(),
  );
  return signature === "%PDF-";
}
