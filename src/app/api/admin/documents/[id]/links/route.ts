import { createHash, randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import {
  createLinkSchema,
  isValidLinkExpiry,
  uuidSchema,
} from "@/lib/document-validation";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    const { user } = await requireAdmin();
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }
    const parsed = createLinkSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("La fecha de caducidad no es válida.");

    const expiresAt = parsed.data.expiresAt;
    if (!isValidLinkExpiry(expiresAt)) {
      return jsonError(
        "La caducidad debe estar en el futuro y como máximo a 365 días.",
      );
    }

    const admin = createAdminClient();
    const { data: document } = await admin
      .from("documents")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!document) return jsonError("El documento no existe.", 404);

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const { data: link, error } = await admin
      .from("share_links")
      .insert({
        document_id: id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (error) throw error;

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    return Response.json({
      id: link.id,
      url: `${origin.replace(/\/$/, "")}/recursos/${token}`,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
