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

const inputClass =
  "min-h-12 w-full border-2 border-foreground bg-[var(--paper)] px-4 text-base outline-none transition-shadow focus-visible:shadow-[0.25rem_0.25rem_0_var(--yellow)]";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-bold">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-3.5 size-5 text-foreground/50" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${inputClass} pl-12`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block font-bold">
          Contraseña
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 size-5 text-foreground/50" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={10}
            required
            className={`${inputClass} pl-12`}
          />
        </div>
      </div>
      {state.message && (
        <p
          role="alert"
          className="border-2 border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive"
        >
          {state.message}
        </p>
      )}
      <button className="btn-primary mt-1" disabled={pending}>
        {pending ? "Comprobando acceso…" : "Entrar al panel"}
      </button>
      <Link
        href="/admin/recuperar"
        className="text-center text-sm font-bold underline underline-offset-4"
      >
        He olvidado mi contraseña
      </Link>
    </form>
  );
}

export function RecoveryForm() {
  const [state, action, pending] = useActionState(recoveryAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-bold">
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
          className={`border-2 p-3 text-sm font-bold ${
            state.success
              ? "border-[var(--turquoise)] bg-[var(--turquoise)]/20"
              : "border-destructive bg-destructive/10 text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}
      <button className="btn-primary" disabled={pending}>
        {pending ? "Enviando correo…" : "Enviar enlace de recuperación"}
      </button>
      <Link
        href="/admin/login"
        className="text-center text-sm font-bold underline underline-offset-4"
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
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="password" className="mb-2 block font-bold">
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
        <p className="mt-2 text-sm text-foreground/60">
          Al menos 10 caracteres.
        </p>
      </div>
      <div>
        <label htmlFor="confirmation" className="mb-2 block font-bold">
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
          className="border-2 border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive"
        >
          {state.message}
        </p>
      )}
      <button className="btn-primary" disabled={pending}>
        {pending ? "Guardando contraseña…" : "Guardar contraseña nueva"}
      </button>
    </form>
  );
}
