import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { uuidSchema } from "@/lib/document-validation";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }

    const admin = createAdminClient();
    const { data: document, error: documentError } = await admin
      .from("documents")
      .select("storage_path")
      .eq("id", id)
      .maybeSingle();

    if (documentError) throw documentError;
    if (!document) return jsonError("El documento no existe.", 404);

    const { data: signed, error: signedError } = await admin.storage
      .from("documents")
      .createSignedUrl(document.storage_path, 60);

    if (signedError || !signed?.signedUrl) {
      return jsonError("No se ha podido abrir el PDF.", 502);
    }

    return new Response(null, {
      status: 303,
      headers: {
        location: signed.signedUrl,
        "cache-control": "no-store",
        "referrer-policy": "no-referrer",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
