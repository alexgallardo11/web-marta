import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Información sobre las cookies utilizadas por Marta Moreno.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Solo las imprescindibles"
      title="Política de cookies"
      updatedAt="28 de julio de 2026"
    >
      <h2>Qué utiliza este sitio</h2>
      <p>
        La zona pública y los juegos no instalan cookies publicitarias ni de
        analítica. Por eso no aparece un banner de aceptación al entrar.
      </p>

      <h2>Cookies técnicas</h2>
      <p>
        El panel privado utiliza cookies técnicas de Supabase para mantener la
        sesión de la administradora y proteger el acceso. Son imprescindibles
        para que esa función opere y no se usan para seguir la navegación con
        fines comerciales.
      </p>

      <h2>Servicios enlazados</h2>
      <p>
        Al abrir Instagram, la newsletter o páginas de cursos abandonas esta
        web. Esos servicios pueden usar sus propias cookies de acuerdo con sus
        políticas.
      </p>

      <h2>Cómo gestionarlas</h2>
      <p>
        Puedes consultar, bloquear o eliminar cookies desde la configuración de
        tu navegador. Si bloqueas las cookies técnicas, el panel de
        administración podría no funcionar correctamente.
      </p>
    </LegalPage>
  );
}
