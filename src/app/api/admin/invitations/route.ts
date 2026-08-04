import { inviteAdministrator } from "@/lib/administrators";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import { adminInvitationSchema } from "@/lib/document-validation";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const parsed = adminInvitationSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Escribe un email válido.");

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    await inviteAdministrator(parsed.data.email, origin);
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
