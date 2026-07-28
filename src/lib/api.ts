import { AdminAuthError } from "@/lib/auth";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof AdminAuthError) {
    return jsonError(error.message, error.status);
  }
  console.error(error);
  return jsonError(
    "No hemos podido completar la operación. Inténtalo de nuevo.",
    500,
  );
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;

  if (!origin || origin !== requestOrigin) {
    throw new AdminAuthError(403, "Origen de la solicitud no permitido");
  }
}
