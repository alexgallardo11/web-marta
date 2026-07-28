import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { uploadRequestSchema, isPdfFilename } from "@/lib/document-validation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await requireAdmin();
    const parsed = uploadRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return jsonError("Revisa el nombre y el tamaño del PDF.");
    }
    if (!isPdfFilename(parsed.data.filename)) {
      return jsonError("El archivo debe tener extensión .pdf.");
    }

    const admin = createAdminClient();
    let nextVersion = 1;
    if (parsed.data.documentId) {
      const { data: document, error } = await admin
        .from("documents")
        .select("version")
        .eq("id", parsed.data.documentId)
        .single();
      if (error || !document) return jsonError("El documento no existe.", 404);
      nextVersion = document.version + 1;
    }

    const storagePath = `${randomUUID()}/v${nextVersion}.pdf`;
    const { data, error } = await admin.storage
      .from("documents")
      .createSignedUploadUrl(storagePath);

    if (error || !data) throw error ?? new Error("No signed upload URL");
    return Response.json({
      storagePath,
      token: data.token,
      version: nextVersion,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
