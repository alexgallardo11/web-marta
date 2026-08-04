import Link from "next/link";
import { FileCheck2, Link2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/brand-lockup";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main id="contenido" className="admin-auth-page paper-grain">
      <div className="admin-auth-frame">
        <section className="admin-auth-intro" aria-labelledby="workspace-title">
          <Link
            href="/"
            className="admin-auth-logo"
            aria-label="Volver a la web de Marta"
          >
            <BrandLockup />
          </Link>

          <div className="admin-auth-intro-copy">
            <p className="admin-eyebrow">Espacio privado</p>
            <h2 id="workspace-title">La biblioteca de trabajo de Marta.</h2>
            <p>
              Un espacio ordenado para custodiar recursos y compartirlos con
              control.
            </p>
          </div>

          <ul className="admin-auth-features" aria-label="Funciones del panel">
            <li>
              <FileCheck2 aria-hidden="true" />
              <span>
                <strong>Documentos privados</strong>
                Versiones siempre al día
              </span>
            </li>
            <li>
              <Link2 aria-hidden="true" />
              <span>
                <strong>Enlaces seguros</strong>
                Caducidad y descarga única
              </span>
            </li>
            <li>
              <ShieldCheck aria-hidden="true" />
              <span>
                <strong>Acceso controlado</strong>
                Solo personas autorizadas
              </span>
            </li>
          </ul>

          <p className="admin-auth-folio">Marta Moreno · Área profesional</p>
        </section>

        <section className="admin-auth-card">
          <div className="admin-auth-card-inner">
            <p className="admin-eyebrow">Biblioteca profesional</p>
            <h1>{title}</h1>
            <p className="admin-auth-description">{description}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
