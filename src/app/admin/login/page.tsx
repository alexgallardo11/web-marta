import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { LoginForm } from "@/components/admin/auth-form";
import { getAdminAccess } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const access = await getAdminAccess();
  if (access.status === "authorized") redirect("/admin/documentos");
  const params = await searchParams;

  return (
    <AuthShell
      title="Hola, Marta"
      description="Accede para subir recursos, sustituir archivos y controlar sus enlaces."
    >
      {access.status === "unconfigured" ? (
        <div className="flex flex-col gap-4">
          <p className="border-2 border-foreground bg-[var(--yellow)] p-4 font-bold">
            El panel está construido, pero necesita las variables de Supabase
            para conectarse.
          </p>
          <p className="text-sm text-foreground/65">
            Copia <code>.env.example</code> como <code>.env.local</code> y
            añade las claves del proyecto.
          </p>
          <Link href="/" className="btn-secondary">
            Volver a la landing
          </Link>
        </div>
      ) : (
        <>
          {params.password === "updated" && (
            <p
              role="status"
              className="mb-5 border-2 border-[var(--turquoise)] bg-[var(--turquoise)]/20 p-3 text-sm font-bold"
            >
              Contraseña actualizada. Ya puedes entrar.
            </p>
          )}
          <LoginForm />
        </>
      )}
    </AuthShell>
  );
}
