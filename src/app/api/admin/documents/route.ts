import { completeDocumentSchema, isPdfFilename } from "@/lib/document-validation";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let uploadedPath: string | null = null;

  try {
    requireSameOrigin(request);
    const { user } = await requireAdmin();
    const parsed = completeDocumentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return jsonError("Faltan datos para guardar el documento.");
    }
    if (!isPdfFilename(parsed.data.originalFilename)) {
      return jsonError("El archivo debe ser un PDF.");
    }
    if (!/^[0-9a-f-]{36}\/v\d+\.pdf$/i.test(parsed.data.storagePath)) {
      return jsonError("La ruta de subida no es válida.");
    }
    uploadedPath = parsed.data.storagePath;

    const admin = createAdminClient();
    const { data: exists, error: existsError } = await admin.storage
      .from("documents")
      .exists(uploadedPath);
    if (existsError || !exists) {
      return jsonError(
        "La subida no se ha completado. Vuelve a seleccionar el archivo.",
      );
    }

    if (!parsed.data.documentId) {
      const { error } = await admin.from("documents").insert({
        title: parsed.data.title,
        storage_path: uploadedPath,
        original_filename: parsed.data.originalFilename,
        size_bytes: parsed.data.sizeBytes,
        mime_type: "application/pdf",
        created_by: user.id,
      });
      if (error) throw error;
      return Response.json({ success: true });
    }

    const { data: previous, error: previousError } = await admin
      .from("documents")
      .select("*")
      .eq("id", parsed.data.documentId)
      .single();
    if (previousError || !previous) {
      await admin.storage.from("documents").remove([uploadedPath]);
      return jsonError("El documento que quieres sustituir no existe.", 404);
    }

    const { error: updateError } = await admin
      .from("documents")
      .update({
        title: parsed.data.title,
        storage_path: uploadedPath,
        original_filename: parsed.data.originalFilename,
        size_bytes: parsed.data.sizeBytes,
        mime_type: "application/pdf",
        version: previous.version + 1,
      })
      .eq("id", previous.id);

    if (updateError) {
      await admin.storage.from("documents").remove([uploadedPath]);
      throw updateError;
    }

    const { error: cleanupError } = await admin.storage
      .from("documents")
      .remove([previous.storage_path]);
    if (cleanupError) {
      console.error("Old PDF cleanup failed", cleanupError);
    }

    return Response.json({ success: true });
  } catch (error) {
    if (uploadedPath) {
      try {
        await createAdminClient().storage
          .from("documents")
          .remove([uploadedPath]);
      } catch {
        // The bucket is private; an orphaned object is not externally exposed.
      }
    }
    return handleRouteError(error);
  }
}
