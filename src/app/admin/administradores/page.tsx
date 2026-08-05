import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdministratorsDashboard } from "@/components/admin/administrators-dashboard";
import { getAdminAccess } from "@/lib/auth";
import { listAdministrators } from "@/lib/administrators";

export default async function AdministratorsPage() {
  const access = await getAdminAccess();
  if (access.status === "unconfigured" || access.status === "unauthenticated") {
    redirect("/admin/login");
  }
  if (access.status === "forbidden" || access.admin.role !== "owner") {
    return (
      <main className="admin-denied-page">
        <h1>Acceso restringido</h1>
        <p>Solo Marta puede gestionar las cuentas con acceso al panel.</p>
      </main>
    );
  }

  const administrators = await listAdministrators();
  return (
    <AdminShell
      email={access.user.email ?? ""}
      role={access.admin.role}
      section="administrators"
    >
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Control de acceso</p>
          <h1>Administradores</h1>
          <p>
            Invita a personas de confianza y desactiva su acceso cuando deje
            de ser necesario.
          </p>
        </div>
      </div>
      <AdministratorsDashboard initialAdministrators={administrators} />
    </AdminShell>
  );
}
