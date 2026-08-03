import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  hasSupabasePublicConfig,
  requireSupabasePublicConfig,
} from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  if (!hasSupabasePublicConfig()) return NextResponse.next();

  const { url, key } = requireSupabasePublicConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data: claims } = await supabase.auth.getClaims();
  const hasSession = Boolean(claims?.claims?.sub);
  const pathname = request.nextUrl.pathname;
  const isPublicAdminRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/recuperar" ||
    pathname === "/admin/nueva-contrasena";

  if (pathname.startsWith("/admin/") && !isPublicAdminRoute && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
