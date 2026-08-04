"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const PASSWORD_SETUP_TYPES = new Set(["invite", "recovery"]);

export function AuthSessionRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    const hasAuthPayload = params.has("access_token") || params.has("error");
    if (!hasAuthPayload) return;

    const type = params.get("type");
    const targetPath = PASSWORD_SETUP_TYPES.has(type ?? "")
      ? "/admin/nueva-contrasena"
      : "/admin/documentos";

    try {
      const supabase = createClient();
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          window.location.replace(targetPath);
          return;
        }

        window.location.replace("/admin/login?error=callback");
      });
    } catch {
      window.location.replace("/admin/login?error=callback");
    }
  }, []);

  return null;
}
