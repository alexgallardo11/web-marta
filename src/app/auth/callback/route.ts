import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (!hasSupabasePublicConfig()) {
    return NextResponse.redirect(new URL("/admin/login", requestUrl.origin));
  }

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/admin/") ? next : "/admin/documentos";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
  }

  // Invite and recovery links can return an implicit-flow session in the URL
  // fragment. The fragment is intentionally not sent to the server, so keep
  // it in the browser and let AuthSessionRedirect process it client-side.
  if (!code) {
    return new NextResponse(
      `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Continuando…</title></head><body><p>Continuando…</p><script>const hash = window.location.hash; window.location.replace(hash ? "/" + hash : "/admin/login?error=callback");</script></body></html>`,
      { headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=callback", requestUrl.origin),
  );
}
