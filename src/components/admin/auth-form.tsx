"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import {
  loginAction,
  recoveryAction,
  updatePasswordAction,
  type AuthFormState,
} from "@/app/admin/actions";

const initialState: AuthFormState = { message: "" };

const inputClass = "admin-auth-input";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="admin-auth-form">
      <div className="admin-auth-field">
        <label htmlFor="email">
          Email
        </label>
        <div className="admin-auth-input-wrap">
          <Mail aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>
      </div>
      <div className="admin-auth-field">
        <label htmlFor="password">
          Contraseña
        </label>
        <div className="admin-auth-input-wrap">
          <LockKeyhole aria-hidden="true" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={10}
            required
            className={inputClass}
          />
        </div>
      </div>
      {state.message && (
        <p
          role="alert"
          className="admin-auth-message error"
        >
          {state.message}
        </p>
      )}
      <button className="admin-auth-submit" disabled={pending}>
        {pending ? "Comprobando acceso…" : "Entrar al panel"}
      </button>
      <Link
        href="/admin/recuperar"
        className="admin-auth-link"
      >
        He olvidado mi contraseña
      </Link>
    </form>
  );
}

export function RecoveryForm() {
  const [state, action, pending] = useActionState(recoveryAction, initialState);

  return (
    <form action={action} className="admin-auth-form">
      <div className="admin-auth-field">
        <label htmlFor="email">
          Email de administradora
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>
      {state.message && (
        <p
          role="status"
          className={`admin-auth-message ${state.success ? "success" : "error"}`}
        >
          {state.message}
        </p>
      )}
      <button className="admin-auth-submit" disabled={pending}>
        {pending ? "Enviando correo…" : "Enviar enlace de recuperación"}
      </button>
      <Link
        href="/admin/login"
        className="admin-auth-link"
      >
        Volver al acceso
      </Link>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <form action={action} className="admin-auth-form">
      <div className="admin-auth-field">
        <label htmlFor="password">
          Contraseña nueva
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className={inputClass}
        />
        <p className="admin-auth-help">
          Al menos 10 caracteres.
        </p>
      </div>
      <div className="admin-auth-field">
        <label htmlFor="confirmation">
          Repite la contraseña
        </label>
        <input
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className={inputClass}
        />
      </div>
      {state.message && (
        <p
          role="alert"
          className="admin-auth-message error"
        >
          {state.message}
        </p>
      )}
      <button className="admin-auth-submit" disabled={pending}>
        {pending ? "Guardando contraseña…" : "Guardar contraseña nueva"}
      </button>
    </form>
  );
}
