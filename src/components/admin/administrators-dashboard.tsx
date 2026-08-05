"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import type { AdminUser } from "@/types/database";

async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? "No se ha podido completar la operación.";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AdministratorsDashboard({
  initialAdministrators,
}: {
  initialAdministrators: AdminUser[];
}) {
  const [email, setEmail] = useState("");
  const [administrators, setAdministrators] = useState(initialAdministrators);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function invite(event: FormEvent) {
    event.preventDefault();
    setBusy("invite");
    setMessage(null);
    const response = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      return;
    }
    const invitedEmail = email.trim().toLowerCase();
    setEmail("");
    setMessage({
      kind: "success",
      text: `Invitación enviada a ${invitedEmail}.`,
    });
    window.location.reload();
  }

  async function setStatus(userId: string, isActive: boolean) {
    setBusy(userId);
    setMessage(null);
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      return;
    }
    setAdministrators((current) =>
      current.map((administrator) =>
        administrator.user_id === userId
          ? { ...administrator, is_active: isActive }
          : administrator,
      ),
    );
    setMessage({
      kind: "success",
      text: isActive ? "Cuenta activada." : "Cuenta desactivada.",
    });
  }

  return (
    <div className="admin-module-stack">
      {message && (
        <div className={`admin-feedback ${message.kind}`} role={message.kind === "error" ? "alert" : "status"}>
          {message.kind === "success" ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
          <span>{message.text}</span>
        </div>
      )}

      <form className="admin-invite-card" onSubmit={invite}>
        <div>
          <p className="admin-eyebrow">Nueva invitación</p>
          <h2>Dar acceso al panel</h2>
          <p>La persona recibirá un correo de Supabase para crear su contraseña.</p>
        </div>
        <div className="admin-invite-fields">
          <label>
            Email
            <span className="admin-input-with-icon">
              <Mail aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@ejemplo.com"
                required
                maxLength={320}
              />
            </span>
          </label>
          <button className="admin-primary-button" type="submit" disabled={busy === "invite"}>
            {busy === "invite" ? "Enviando…" : "Enviar invitación"}
          </button>
        </div>
      </form>

      <section className="admin-list-card" aria-labelledby="accounts-title">
        <div className="admin-list-heading">
          <div>
            <p className="admin-eyebrow">Cuentas autorizadas</p>
            <h2 id="accounts-title">Personas con acceso</h2>
          </div>
          <span className="admin-count-badge">{administrators.length}</span>
        </div>
        <div className="admin-account-list">
          {administrators.map((administrator) => {
            const isOwner = administrator.role === "owner";
            return (
              <article className="admin-account-row" key={administrator.user_id}>
                <div className="admin-account-icon">
                  {isOwner ? <ShieldCheck aria-hidden="true" /> : <UserRound aria-hidden="true" />}
                </div>
                <div className="admin-account-details">
                  <strong>{administrator.email ?? "Email no disponible"}</strong>
                  <span>
                    {isOwner ? "Propietaria" : "Administradora"} · Invitada el {formatDate(administrator.created_at)}
                  </span>
                </div>
                <span className={`admin-status ${administrator.is_active ? "active" : "inactive"}`}>
                  {administrator.is_active ? "Activa" : "Inactiva"}
                </span>
                {isOwner ? (
                  <span className="admin-owner-note">Cuenta protegida</span>
                ) : (
                  <button
                    type="button"
                    className="admin-small-button"
                    disabled={busy === administrator.user_id}
                    onClick={() => setStatus(administrator.user_id, !administrator.is_active)}
                  >
                    {busy === administrator.user_id
                      ? "Guardando…"
                      : administrator.is_active
                        ? "Desactivar"
                        : "Activar"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
