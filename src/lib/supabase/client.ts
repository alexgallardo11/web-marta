"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { requireSupabasePublicConfig } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function createClient() {
  if (browserClient) return browserClient;
  const { url, key } = requireSupabasePublicConfig();
  browserClient = createBrowserClient<Database>(url, key);
  return browserClient;
}
