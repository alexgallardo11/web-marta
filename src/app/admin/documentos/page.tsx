import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { DocumentsDashboard } from "@/components/admin/documents-dashboard";
import { getAdminAccess } from "@/lib/auth";
import { listDocuments } from "@/lib/documents";

type SearchParams = Promise<{
  q?: string;
  sort?: string;
  page?: string;
}>;

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const access = await getAdminAccess();
  if (access.status === "unconfigured") redirect("/admin/login");
  if (access.status === "unauthenticated") redirect("/admin/login");

  if (access.status === "forbidden") {
    return (
      <main id="contenido" className="admin-denied-page">
        <div>
          <h1>Acceso no autorizado</h1>
          <p>
            La cuenta {access.user.email} existe, pero no está incluida en{" "}
            <code>admin_users</code>.
          </p>
          <form action={logoutAction} className="mt-6">
            <button className="admin-small-button" type="submit">Cerrar esta sesión</button>
          </form>
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const sort = params.sort === "title" ? "title" : "updated";
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
  const result = await listDocuments({ query, sort, page });

  return (
    <AdminShell email={access.user.email ?? ""} role={access.admin.role} section="documents">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Biblioteca privada</p>
          <h1>Documentos PDF</h1>
          <p>
            Gestiona recursos, sustituye versiones y crea enlaces de descarga
            configurables.
          </p>
        </div>
        <div className="admin-stat-card">
          <strong>{result.total}</strong>
          <span>{result.total === 1 ? "documento" : "documentos"}</span>
        </div>
      </div>
      <DocumentsDashboard
        initialDocuments={result.documents}
        query={query}
        sort={sort}
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
      />
    </AdminShell>
  );
}
