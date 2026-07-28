import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";

export type AdminAccess =
  | { status: "unconfigured" }
  | { status: "unauthenticated" }
  | { status: "forbidden"; user: User }
  | {
      status: "authorized";
      user: User;
      supabase: Awaited<ReturnType<typeof createClient>>;
    };

export class AdminAuthError extends Error {
  constructor(
    public readonly status: 401 | 403 | 503,
    message: string,
  ) {
    super(message);
  }
}

export async function getAdminAccess(): Promise<AdminAccess> {
  if (!hasSupabasePublicConfig()) return { status: "unconfigured" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "unauthenticated" };

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return { status: "forbidden", user };
  return { status: "authorized", user, supabase };
}

export async function requireAdmin() {
  const access = await getAdminAccess();
  if (access.status === "unconfigured") {
    throw new AdminAuthError(503, "Supabase todavía no está configurado");
  }
  if (access.status === "unauthenticated") {
    throw new AdminAuthError(401, "Necesitas iniciar sesión");
  }
  if (access.status === "forbidden") {
    throw new AdminAuthError(403, "Esta cuenta no tiene acceso al panel");
  }
  return access;
}
