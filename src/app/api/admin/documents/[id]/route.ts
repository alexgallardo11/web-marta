import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { renameDocumentSchema, uuidSchema } from "@/lib/document-validation";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }
    const parsed = renameDocumentSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Escribe un nombre válido.");

    const { data, error } = await createAdminClient()
      .from("documents")
      .update({ title: parsed.data.title })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return jsonError("El documento no existe.", 404);
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }
    const admin = createAdminClient();

    const { data: document, error } = await admin
      .from("documents")
      .select("storage_path")
      .eq("id", id)
      .single();
    if (error || !document) return jsonError("El documento no existe.", 404);

    const revokedAt = new Date().toISOString();
    const { error: revokeError } = await admin
      .from("share_links")
      .update({ revoked_at: revokedAt })
      .eq("document_id", id)
      .is("revoked_at", null);
    if (revokeError) throw revokeError;

    const { data: objectExists, error: existsError } = await admin.storage
      .from("documents")
      .exists(document.storage_path);
    if (existsError) {
      return jsonError(
        "Los enlaces ya están revocados, pero no se pudo comprobar el archivo. Vuelve a intentarlo.",
        502,
      );
    }
    if (objectExists) {
      const { error: storageError } = await admin.storage
        .from("documents")
        .remove([document.storage_path]);
      if (storageError) {
        return jsonError(
          "Los enlaces ya están revocados, pero no se pudo borrar el archivo. Vuelve a intentarlo.",
          502,
        );
      }
    }

    const { error: deleteError } = await admin
      .from("documents")
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;

    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
