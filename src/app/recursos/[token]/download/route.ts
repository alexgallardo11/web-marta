import { consumeShareToken, getResourceState } from "@/lib/resource-links";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerConfig } from "@/lib/supabase/config";

type Context = { params: Promise<{ token: string }> };

export async function POST(_request: Request, context: Context) {
  const wantsJson = _request.headers.get("accept")?.includes("application/json") ?? false;

  if (!hasSupabaseServerConfig()) {
    return Response.json({ error: "Recurso no disponible" }, { status: 503 });
  }

  const { token } = await context.params;
  const resource = await getResourceState(token);
  if (resource.status !== "active") {
    return Response.json(
      { error: "Este enlace ya no está disponible." },
      { status: 410, headers: { "cache-control": "no-store" } },
    );
  }

  const admin = createAdminClient();
  const { data: document, error: documentError } = await admin
    .from("documents")
    .select("storage_path, title")
    .eq("id", resource.documentId)
    .maybeSingle();
  if (documentError || !document) {
    return Response.json(
      { error: "El documento ya no está disponible." },
      { status: 410, headers: { "cache-control": "no-store" } },
    );
  }

  const { data: signed, error: signedError } = await admin.storage
    .from("documents")
    .createSignedUrl(document.storage_path, 60, {
      download: `${document.title.replace(/[\r\n"]/g, "").trim()}.pdf`,
    });
  if (signedError || !signed) {
    return Response.json(
      { error: "No se ha podido preparar la descarga." },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }

  const consumed = await consumeShareToken(token);
  if (!consumed || consumed.document_id !== resource.documentId) {
    return Response.json(
      { error: "Este enlace ya no está disponible." },
      { status: 410, headers: { "cache-control": "no-store" } },
    );
  }

  if (wantsJson) {
    return Response.json(
      { downloadUrl: signed.signedUrl },
      { headers: { "cache-control": "no-store" } },
    );
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
}
