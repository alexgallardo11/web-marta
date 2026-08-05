import Link from "next/link";
import { ResourceDownloadForm } from "@/components/resource-download-form";
import { notFound } from "next/navigation";
import { getResourceState } from "@/lib/resource-links";
import { hasSupabaseServerConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ token: string }> };

function unavailableMessage(status: "expired" | "revoked" | "used") {
  if (status === "used") {
    return "Este enlace ya se ha utilizado. Pide a Marta otro enlace si necesitas descargar el recurso de nuevo.";
  }
  if (status === "revoked") {
    return "Este enlace ha sido revocado. Pide a Marta un enlace nuevo para descargar el recurso.";
  }
  return "Este enlace ha caducado. Pide a Marta un enlace nuevo para descargar el recurso.";
}

export default async function ResourcePage({ params }: Context) {
  const { token } = await params;

  if (!hasSupabaseServerConfig()) {
    return <ResourceStatus title="Recurso no disponible" message="La biblioteca se está preparando. Prueba de nuevo más tarde." />;
  }

  const resource = await getResourceState(token);
  if (resource.status === "invalid" || resource.status === "missing") notFound();

  if (resource.status !== "active") {
    return (
      <ResourceStatus
        title="Este enlace ya no está activo"
        message={unavailableMessage(resource.status)}
      />
    );
  }

  return (
    <main className="resource-page">
      <section className="resource-card" aria-labelledby="resource-title">
        <p className="resource-kicker">Recurso privado · Marta Moreno</p>
        <h1 id="resource-title">{resource.documentTitle}</h1>
        <p>
          Este enlace permite una única descarga y caduca el {formatDate(resource.expiresAt)}.
        </p>
        <ResourceDownloadForm action={`/recursos/${token}/download`} />
        <p className="resource-note">La descarga empezará en una nueva petición segura.</p>
      </section>
    </main>
  );
}

function ResourceStatus({ title, message }: { title: string; message: string }) {
  return (
    <main className="resource-page">
      <section className="resource-card" aria-labelledby="resource-title">
        <p className="resource-kicker">Marta Moreno</p>
        <h1 id="resource-title">{title}</h1>
        <p>{message}</p>
        <Link className="resource-back-link" href="/">
          Volver a martamoreno.com
        </Link>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}
