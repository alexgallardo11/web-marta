import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { AdminAuthError, requireOwner } from "@/lib/auth";
import type { AdminUser } from "@/types/database";

async function findAuthUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
) {
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.trim().toLowerCase() === email,
    );
    if (user) return user;
    if (data.users.length < 1000) return null;
    page += 1;
  }
}

export async function listAdministrators(): Promise<AdminUser[]> {
  await requireOwner();
  const { data, error } = await createAdminClient()
    .from("admin_users")
    .select("user_id, email, role, is_active, invited_by, created_at, updated_at")
    .order("role", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function inviteAdministrator(email: string, origin: string) {
  const owner = await requireOwner();
  const admin = createAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findAuthUserByEmail(admin, normalizedEmail);
  if (existingUser) {
    throw new AdminAuthError(
      409,
      "Esta cuenta ya existe. No se puede volver a invitar el mismo email.",
    );
  }

  const redirectTo = `${origin.replace(/\/$/, "")}/auth/callback?next=/admin/nueva-contrasena`;
  const { data: invitation, error: invitationError } =
    await admin.auth.admin.inviteUserByEmail(normalizedEmail, { redirectTo });

  if (invitationError) {
    if (invitationError.message.toLowerCase().includes("email rate limit")) {
      throw new AdminAuthError(
        429,
        "Supabase ha alcanzado el límite temporal de correos. Espera antes de reintentarlo o configura un SMTP propio.",
      );
    }
    throw invitationError;
  }

  if (!invitation.user) {
    throw invitationError ?? new Error("No se ha podido crear la invitación");
  }

  const { error: rowError } = await admin.from("admin_users").upsert(
    {
      user_id: invitation.user.id,
      email: normalizedEmail,
      role: "admin",
      is_active: true,
      invited_by: owner.user.id,
    },
    { onConflict: "user_id" },
  );

  if (rowError) {
    try {
      await admin.auth.admin.deleteUser(invitation.user.id);
    } catch (cleanupError) {
      console.error("Invitation cleanup failed", cleanupError);
    }
    throw rowError;
  }

  return { email: normalizedEmail };
}

export async function updateAdministratorStatus(
  userId: string,
  isActive: boolean,
) {
  const owner = await requireOwner();
  if (userId === owner.user.id) {
    throw new Error("La propietaria no puede desactivarse");
  }

  const admin = createAdminClient();
  const { data: target, error: targetError } = await admin
    .from("admin_users")
    .select("user_id, role")
    .eq("user_id", userId)
    .maybeSingle();
  if (targetError) throw targetError;
  if (!target) throw new Error("La cuenta no existe");
  if (target.role === "owner") {
    throw new Error("La propietaria no puede desactivarse");
  }

  const { error } = await admin
    .from("admin_users")
    .update({ is_active: isActive })
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw error;
}
