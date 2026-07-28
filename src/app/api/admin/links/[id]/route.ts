import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { uuidSchema } from "@/lib/document-validation";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }
    const { data, error } = await createAdminClient()
      .from("share_links")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id)
      .is("revoked_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return jsonError("El enlace ya no está activo.", 404);
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
