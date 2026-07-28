import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerConfig } from "@/lib/supabase/config";

type Context = { params: Promise<{ token: string }> };

function unavailablePage(title: string, message: string, status: number) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Marta Moreno</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f0e4;color:#30262f;font-family:system-ui,sans-serif;padding:24px}.box{max-width:560px;border:2px solid #30262f;background:#fffaf0;padding:40px;box-shadow:8px 8px 0 #f1ce43}h1{font-size:2.4rem;line-height:1;margin:0 0 18px}p{font-size:1.1rem;line-height:1.6;margin:0}a{display:inline-block;margin-top:24px;color:inherit;font-weight:700}</style></head><body><main class="box"><h1>${title}</h1><p>${message}</p><a href="/">Volver a martamoreno.com</a></main></body></html>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

export async function GET(_request: Request, context: Context) {
  if (!hasSupabaseServerConfig()) {
    return unavailablePage(
      "Recurso no disponible",
      "La biblioteca se está preparando. Prueba de nuevo más tarde.",
      503,
    );
  }

  const { token } = await context.params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return unavailablePage(
      "Enlace desconocido",
      "Este enlace no corresponde a ningún recurso.",
      404,
    );
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const admin = createAdminClient();
  const { data: link, error } = await admin
    .from("share_links")
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !link) {
    return unavailablePage(
      "Enlace desconocido",
      "Comprueba que has copiado el enlace completo.",
      404,
    );
  }

  const expired =
    link.expires_at && new Date(link.expires_at).getTime() <= Date.now();
  if (link.revoked_at || expired) {
    return unavailablePage(
      "Este enlace ya no está activo",
      "Pide a Marta un enlace nuevo para descargar el recurso.",
      410,
    );
  }

  const { data: document } = await admin
    .from("documents")
    .select("*")
    .eq("id", link.document_id)
    .maybeSingle();
  if (!document) {
    return unavailablePage(
      "Recurso no disponible",
      "El documento asociado a este enlace ya no existe.",
      410,
    );
  }

  const { data: signed, error: signedError } = await admin.storage
    .from("documents")
    .createSignedUrl(document.storage_path, 60, {
      download: `${document.title.replace(/[\r\n"]/g, "").trim()}.pdf`,
    });
  if (signedError || !signed) {
    return unavailablePage(
      "No se ha podido preparar la descarga",
      "Espera un momento y vuelve a abrir el enlace.",
      502,
    );
  }

  const { error: eventError } = await admin.from("download_events").insert({
    share_link_id: link.id,
  });
  if (eventError) console.error("Download event insert failed", eventError);

  return new Response(null, {
    status: 307,
    headers: {
      location: signed.signedUrl,
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "referrer-policy": "no-referrer",
    },
  });
}
