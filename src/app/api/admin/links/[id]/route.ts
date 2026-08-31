import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { uuidSchema } from "@/lib/document-validation";
import {
  decryptShareToken,
  hashShareToken,
  isShareToken,
} from "@/lib/share-link-tokens";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }

    const { data: link, error } = await createAdminClient()
      .from("share_links")
      .select("policy, token_hash, token_ciphertext, revoked_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!link) return jsonError("El enlace no existe.", 404);
    if (link.policy !== "permanent") {
      return jsonError(
        "Solo se pueden recuperar enlaces permanentes.",
        409,
      );
    }
    if (link.revoked_at) return jsonError("El enlace ya está revocado.", 410);
    if (!link.token_ciphertext) {
      return jsonError(
        "No se puede recuperar este enlace. Crea uno permanente nuevo.",
        409,
      );
    }

    let token: string;
    try {
      token = decryptShareToken(link.token_ciphertext);
    } catch (decryptError) {
      console.error(
        "No se ha podido descifrar un enlace permanente",
        decryptError,
      );
      return jsonError("No se ha podido recuperar el enlace.", 502);
    }

    if (!isShareToken(token) || hashShareToken(token) !== link.token_hash) {
      return jsonError("El enlace permanente no es válido.", 502);
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    return Response.json(
      { url: `${origin.replace(/\/$/, "")}/recursos/${token}` },
      { headers: { "cache-control": "no-store" } },
    );
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
