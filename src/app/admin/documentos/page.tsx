import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { DocumentsDashboard } from "@/components/admin/documents-dashboard";
import { getAdminAccess } from "@/lib/auth";
import { listDocuments } from "@/lib/documents";

export default async function DocumentsPage() {
  const access = await getAdminAccess();
  if (access.status === "unconfigured") redirect("/admin/login");
  if (access.status === "unauthenticated") redirect("/admin/login");

  if (access.status === "forbidden") {
    return (
      <main
        id="contenido"
        className="grid min-h-screen place-items-center px-4 text-center"
      >
        <div className="max-w-lg border-2 border-foreground bg-[var(--paper)] p-8 shadow-[0.5rem_0.5rem_0_var(--pink)]">
          <h1 className="font-display text-5xl">Acceso no autorizado</h1>
          <p className="mt-4 text-foreground/65">
            La cuenta {access.user.email} existe, pero no está incluida en{" "}
            <code>admin_users</code>.
          </p>
          <form action={logoutAction} className="mt-6">
            <button className="btn-secondary">Cerrar esta sesión</button>
          </form>
        </div>
      </main>
    );
  }

  const documents = await listDocuments();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-foreground bg-[var(--paper)]">
        <div className="site-container flex min-h-20 items-center justify-between gap-6 py-3">
          <Link href="/">
            <Image
              src="/images/marta-moreno-logo.png"
              alt="Marta Moreno"
              width={226}
              height={60}
              className="h-auto w-40 sm:w-48"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-foreground/60 sm:inline">
              {access.user.email}
            </span>
            <form action={logoutAction}>
              <button
                className="grid size-11 place-items-center border-2 border-foreground hover:bg-muted"
                aria-label="Cerrar sesión"
              >
                <LogOut className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="contenido" className="site-container py-10 sm:py-14">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow text-[var(--pink)]">Panel privado</p>
            <h1 className="section-title mt-4">Biblioteca de PDFs</h1>
            <p className="mt-3 max-w-2xl text-lg text-foreground/60">
              Sube, actualiza y comparte recursos sin cambiar los enlaces que
              ya tienen tus alumnas.
            </p>
          </div>
          <div className="border-2 border-foreground bg-[var(--turquoise)] px-5 py-3 font-black">
            {documents.length}{" "}
            {documents.length === 1 ? "documento" : "documentos"}
          </div>
        </div>
        <DocumentsDashboard initialDocuments={documents} />
      </main>
    </div>
  );
}
