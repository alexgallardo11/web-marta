import { updateAdministratorStatus } from "@/lib/administrators";
import { handleRouteError, jsonError, requireSameOrigin } from "@/lib/api";
import {
  adminStatusSchema,
  uuidSchema,
} from "@/lib/document-validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return jsonError("El identificador no es válido.", 404);
    }
    const parsed = adminStatusSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("El estado no es válido.");

    await updateAdministratorStatus(id, parsed.data.isActive);
    return Response.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
