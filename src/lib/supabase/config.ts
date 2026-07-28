export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabasePublicConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function hasSupabaseServerConfig() {
  return Boolean(
    supabaseUrl && supabasePublishableKey && supabaseSecretKey,
  );
}

export function requireSupabasePublicConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  return { url: supabaseUrl, key: supabasePublishableKey };
}

export function requireSupabaseServerConfig() {
  const publicConfig = requireSupabasePublicConfig();
  if (!supabaseSecretKey) {
    throw new Error("Falta SUPABASE_SECRET_KEY");
  }
  return { ...publicConfig, secretKey: supabaseSecretKey };
}
