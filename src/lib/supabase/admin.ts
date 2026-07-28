import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireSupabaseServerConfig } from "./config";

export function createAdminClient() {
  const { url, secretKey } = requireSupabaseServerConfig();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
