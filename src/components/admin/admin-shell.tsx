import Link from "next/link";
import { FileText, LogOut, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { BrandLockup } from "@/components/brand-lockup";
import type { AdminRole } from "@/types/database";

export function AdminShell({
  email,
  role,
  section,
  children,
}: {
  email: string;
  role: AdminRole;
  section: "documents" | "administrators";
  children: ReactNode;
}) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link
            href="/admin/documentos"
            className="admin-brand-lockup"
            aria-label="Panel de Marta Moreno"
          >
            <BrandLockup />
          </Link>
          <span className="admin-workspace-label">Área de trabajo</span>
        </div>
        <nav className="admin-nav" aria-label="Navegación del panel">
          <span className="admin-nav-label">Gestión</span>
          <Link
            href="/admin/documentos"
            className={section === "documents" ? "is-active" : undefined}
            aria-current={section === "documents" ? "page" : undefined}
          >
            <FileText aria-hidden="true" />
            Documentos
          </Link>
          {role === "owner" && (
            <Link
              href="/admin/administradores"
              className={section === "administrators" ? "is-active" : undefined}
              aria-current={section === "administrators" ? "page" : undefined}
            >
              <Users aria-hidden="true" />
              Administradores
            </Link>
          )}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-account-mark" aria-hidden="true">
            <ShieldCheck />
          </div>
          <div className="admin-sidebar-account">
            <span className="admin-role-badge">
              {role === "owner" ? "Propietaria" : "Administradora"}
            </span>
            <span className="admin-sidebar-email">{email}</span>
          </div>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-kicker">Marta Moreno</p>
            <p className="admin-topbar-title">
              {section === "documents" ? "Biblioteca de documentos" : "Accesos al panel"}
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="admin-logout-button">
              <LogOut aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </form>
        </header>
        <main id="contenido" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
