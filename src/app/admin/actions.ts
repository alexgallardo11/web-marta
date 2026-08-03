"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";

export type AuthFormState = {
  message: string;
  success?: boolean;
};

const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(10).max(200),
});

export async function loginAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasSupabasePublicConfig()) {
    return { message: "Supabase todavía no está configurado." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      message:
        "Revisa el email y escribe una contraseña de al menos 10 caracteres.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { message: "El email o la contraseña no son correctos." };
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { message: "Esta cuenta no tiene acceso al panel." };
  }

  redirect("/admin/documentos");
}

const recoverySchema = z.object({ email: z.email().trim() });

export async function recoveryAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasSupabasePublicConfig()) {
    return { message: "Supabase todavía no está configurado." };
  }

  const parsed = recoverySchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { message: "Escribe un email válido." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/admin/nueva-contrasena`,
    },
  );
  if (error) {
    return {
      message:
        "No se ha podido enviar el correo. Comprueba la dirección e inténtalo de nuevo.",
    };
  }

  return {
    success: true,
    message:
      "Revisa tu correo. Te hemos enviado un enlace para crear una contraseña nueva.",
  };
}

const passwordSchema = z
  .object({
    password: z.string().min(10).max(200),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Las contraseñas no coinciden.",
  });

export async function updatePasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasSupabasePublicConfig()) {
    return { message: "Supabase todavía no está configurado." };
  }

  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "La contraseña debe tener al menos 10 caracteres.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return {
      message:
        "El enlace ha caducado o no es válido. Solicita uno nuevo desde el acceso.",
    };
  }

  await supabase.auth.signOut();
  redirect("/admin/login?password=updated");
}

export async function logoutAction() {
  if (hasSupabasePublicConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
