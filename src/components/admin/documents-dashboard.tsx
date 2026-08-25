"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  Link2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MAX_PDF_BYTES,
  hasPdfSignature,
} from "@/lib/document-validation";
import type { AdminDocument } from "@/types/database";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? "No se ha podido completar la operación.";
}

function ConfirmDeleteDialog({
  document,
  busy,
  onCancel,
  onConfirm,
}: {
  document: AdminDocument;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="admin-confirm-dialog m-auto w-[min(92vw,31rem)] border border-foreground bg-[var(--paper)] p-0 text-foreground backdrop:bg-foreground/45"
    >
      <div className="p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-destructive">
          Acción permanente
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none">
          ¿Borrar “{document.title}”?
        </h2>
        <p className="mt-4 text-foreground/70">
          Se revocarán todos sus enlaces y el PDF se borrará de la biblioteca.
          Esta acción no se puede deshacer.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Conservar documento
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-destructive bg-destructive px-4 font-black text-white disabled:opacity-50"
          >
            <Trash2 className="size-5" aria-hidden="true" />
            {busy ? "Borrando…" : "Borrar documento"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function DocumentsDashboard({
  initialDocuments,
  query: initialQuery,
  sort: initialSort,
  page,
  totalPages,
  total,
}: {
  initialDocuments: AdminDocument[];
  query: string;
  sort: "updated" | "title";
  page: number;
  totalPages: number;
  total: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<"updated" | "title">(initialSort);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminDocument | null>(null);
  const [expiryChoiceByDocument, setExpiryChoiceByDocument] = useState<
    Record<string, string>
  >({});
  const [customExpiryByDocument, setCustomExpiryByDocument] = useState<
    Record<string, string>
  >({});
  const [createdLinks, setCreatedLinks] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const visibleDocuments = initialDocuments;

  function chooseFile(file: File | undefined) {
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage({
        kind: "error",
        text: "El archivo debe ser un PDF.",
      });
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setMessage({
        kind: "error",
        text: "El PDF supera el límite de 100 MB.",
      });
      return;
    }
    setNewFile(file);
    setNewTitle(file.name.replace(/\.pdf$/i, ""));
    setMessage(null);
  }

  async function uploadDocument(
    file: File,
    title: string,
    documentId?: string,
  ) {
    const busyKey = documentId ? `replace:${documentId}` : "upload:new";
    setBusy(busyKey);
    setMessage(null);

    try {
      if (!(await hasPdfSignature(file))) {
        throw new Error(
          "El archivo no contiene un PDF válido. Selecciona el documento original.",
        );
      }

      const signedResponse = await fetch("/api/admin/uploads", {
        method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            sizeBytes: file.size,
            mimeType: file.type || "application/pdf",
            documentId,
        }),
      });
      if (!signedResponse.ok) throw new Error(await readError(signedResponse));
      const signed = (await signedResponse.json()) as {
        storagePath: string;
        token: string;
      };

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .uploadToSignedUrl(signed.storagePath, signed.token, file, {
          contentType: "application/pdf",
          cacheControl: "3600",
        });
      if (uploadError) {
        throw new Error(
          "La subida se ha interrumpido. Comprueba tu conexión y vuelve a intentarlo.",
        );
      }

      const completeResponse = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          storagePath: signed.storagePath,
          originalFilename: file.name,
          sizeBytes: file.size,
          documentId,
        }),
      });
      if (!completeResponse.ok) {
        throw new Error(await readError(completeResponse));
      }

      setNewFile(null);
      setNewTitle("");
      if (fileInput.current) fileInput.current.value = "";
      setMessage({
        kind: "success",
        text: documentId
          ? "PDF actualizado. Sus enlaces siguen funcionando."
          : "PDF añadido a la biblioteca.",
      });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "No se ha podido subir el PDF.",
      });
    } finally {
      setBusy(null);
    }
  }

  async function createDocument(event: FormEvent) {
    event.preventDefault();
    if (!newFile || !newTitle.trim()) return;
    await uploadDocument(newFile, newTitle);
  }

  async function renameDocument(documentId: string) {
    if (!editingTitle.trim()) return;
    setBusy(`rename:${documentId}`);
    const response = await fetch(`/api/admin/documents/${documentId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      return;
    }
    setEditing(null);
    setMessage({ kind: "success", text: "Nombre actualizado." });
    router.refresh();
  }

  async function deleteDocument() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setBusy(`delete:${id}`);
    const response = await fetch(`/api/admin/documents/${id}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      setDeleteTarget(null);
      return;
    }
    setMessage({ kind: "success", text: "Documento y enlaces eliminados." });
    setDeleteTarget(null);
    router.refresh();
  }

  async function createLink(documentId: string) {
    setBusy(`link:${documentId}`);
    const choice = expiryChoiceByDocument[documentId] ?? "24h";
    let expiresAt: string;
    if (choice === "custom") {
      const customExpiry = customExpiryByDocument[documentId];
      if (!customExpiry) {
        setBusy(null);
        setMessage({ kind: "error", text: "Elige una fecha de caducidad." });
        return;
      }
      const customDate = new Date(customExpiry);
      if (Number.isNaN(customDate.getTime())) {
        setBusy(null);
        setMessage({ kind: "error", text: "La fecha de caducidad no es válida." });
        return;
      }
      expiresAt = customDate.toISOString();
    } else {
      expiresAt = new Date(
        Date.now() +
          Number.parseInt(choice.replace("h", ""), 10) * 60 * 60 * 1000,
      ).toISOString();
    }
    const response = await fetch(
      `/api/admin/documents/${documentId}/links`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expiresAt }),
      },
    );
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      return;
    }
    const data = (await response.json()) as { id: string; url: string };
    setCreatedLinks((current) => ({ ...current, [documentId]: data.url }));
    setMessage({
      kind: "success",
      text: "Enlace creado. Cópialo ahora: por seguridad no se volverá a mostrar.",
    });
    router.refresh();
  }

  async function copyLink(documentId: string) {
    const url = createdLinks[documentId];
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setMessage({ kind: "success", text: "Enlace copiado al portapapeles." });
  }

  async function revokeLink(linkId: string) {
    setBusy(`revoke:${linkId}`);
    const response = await fetch(`/api/admin/links/${linkId}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!response.ok) {
      setMessage({ kind: "error", text: await readError(response) });
      return;
    }
    setMessage({ kind: "success", text: "Enlace revocado." });
    router.refresh();
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    chooseFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="admin-documents-stack">
      {message && (
        <div
          role={message.kind === "error" ? "alert" : "status"}
          className={`admin-feedback ${message.kind} fixed right-4 top-4 z-50 max-w-md`}
        >
          {message.kind === "success" ? (
            <Check className="mt-0.5 size-5 shrink-0" />
          ) : (
            <X className="mt-0.5 size-5 shrink-0" />
          )}
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Cerrar mensaje"
            className="ml-auto grid size-8 shrink-0 place-items-center"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={createDocument}
        className="admin-upload-card grid gap-6 border border-foreground bg-[var(--paper)] p-5 lg:grid-cols-[1fr_.9fr] lg:p-7"
      >
        <label
          htmlFor="new-pdf"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="admin-dropzone flex min-h-48 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-foreground bg-background p-6 text-center transition-colors"
        >
          <UploadCloud className="size-10 text-[var(--pink)]" aria-hidden="true" />
          <strong className="mt-3 text-lg">
            {newFile ? newFile.name : "Arrastra un PDF o selecciónalo"}
          </strong>
          <span className="mt-1 text-sm text-foreground/60">
            Solo PDF · Máximo 100 MB
          </span>
          <input
            ref={fileInput}
            id="new-pdf"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
        </label>
        <div className="admin-upload-form-content flex flex-col justify-center gap-4">
          <div className="admin-upload-heading">
            <p className="admin-eyebrow">Nuevo recurso</p>
            <h2>Subir documento</h2>
            <p>Selecciona el archivo y define el nombre que verá quien lo reciba.</p>
          </div>
          <div>
            <label htmlFor="new-title" className="mb-2 block font-bold">
              Nombre que verá la alumna
            </label>
            <input
              id="new-title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              maxLength={160}
              required
              disabled={!newFile}
              className="min-h-12 w-full border-2 border-foreground bg-background px-4 disabled:opacity-50"
              placeholder="Guía para crear expresiones"
            />
          </div>
          <button
            type="submit"
            disabled={!newFile || !newTitle.trim() || busy === "upload:new"}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-5" aria-hidden="true" />
            {busy === "upload:new" ? "Subiendo y guardando…" : "Añadir PDF"}
          </button>
        </div>
      </form>

      <form
        action="/admin/documentos"
        method="get"
        className={`admin-library-toolbar flex flex-col gap-3 border-y border-foreground/20 py-4 md:flex-row md:items-end md:justify-between${total === 0 ? " is-empty" : ""}`}
      >
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Buscar documentos</span>
          <Search className="pointer-events-none absolute left-4 top-3.5 size-5 text-foreground/45" />
          <input
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre…"
            className="min-h-12 w-full border-2 border-foreground bg-[var(--paper)] pl-12 pr-4"
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-bold">
          Ordenar
          <select
            name="sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "updated" | "title")
            }
            className="min-h-12 border-2 border-foreground bg-[var(--paper)] px-3"
          >
            <option value="updated">Última actualización</option>
            <option value="title">Nombre</option>
          </select>
        </label>
        <button type="submit" className="admin-small-button">
          Buscar
        </button>
      </form>

      {visibleDocuments.length === 0 ? (
        <div className="admin-empty-state border-y-2 border-foreground py-14 text-center">
          <FileText className="mx-auto size-12 text-[var(--pink)]" aria-hidden="true" />
          <h2 className="mt-4 font-display text-4xl">
            {total === 0
              ? "Tu biblioteca empieza aquí"
              : "No hay coincidencias"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-foreground/60">
            {total === 0
              ? "Sube el primer PDF para crear un enlace privado y compartirlo con tus alumnas."
              : "Prueba con otra palabra o borra el texto de búsqueda."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleDocuments.map((document) => {
            const activeLinks = document.links.filter(
              (link) =>
                !link.revokedAt &&
                !link.usedAt &&
                new Date(link.expiresAt).getTime() > Date.now(),
            );
            return (
              <article
                key={document.id}
                className="admin-document-card border border-foreground bg-[var(--paper)]"
              >
                <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center lg:p-6">
                  <div className="flex min-w-0 gap-4">
                    <div className="grid size-12 shrink-0 place-items-center bg-[var(--pink-soft)]">
                      <FileText className="size-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editing === document.id ? (
                        <div className="flex max-w-xl flex-col gap-2 sm:flex-row">
                          <label className="sr-only" htmlFor={`title-${document.id}`}>
                            Nombre del documento
                          </label>
                          <input
                            id={`title-${document.id}`}
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            maxLength={160}
                            autoFocus
                            className="min-h-11 flex-1 border-2 border-foreground bg-background px-3 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => renameDocument(document.id)}
                            disabled={busy === `rename:${document.id}`}
                            className="min-h-11 border-2 border-foreground bg-[var(--yellow)] px-3 font-black"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="min-h-11 px-3 font-bold underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <h2 className="truncate text-xl font-black">
                          {document.title}
                        </h2>
                      )}
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/55">
                        <span>{formatBytes(document.sizeBytes)}</span>
                        <span>Versión {document.version}</span>
                        <span>Actualizado {formatDate(document.updatedAt)}</span>
                        <span>
                          {activeLinks.length}{" "}
                          {activeLinks.length === 1
                            ? "enlace activo"
                            : "enlaces activos"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="admin-document-actions flex flex-wrap gap-2">
                    <a
                      href={`/api/admin/documents/${document.id}/preview`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 border-2 border-foreground bg-[var(--yellow)] px-3 font-bold hover:bg-[var(--yellow)]/70"
                      aria-label={`Ver el PDF ${document.title}`}
                    >
                      <Eye className="size-4" aria-hidden="true" />
                      Ver PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(document.id);
                        setEditingTitle(document.title);
                      }}
                      className="inline-flex min-h-11 items-center gap-2 border-2 border-foreground px-3 font-bold hover:bg-muted"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Renombrar
                    </button>
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-2 border-foreground px-3 font-bold hover:bg-muted">
                      <RefreshCw className="size-4" aria-hidden="true" />
                      {busy === `replace:${document.id}`
                        ? "Sustituyendo…"
                        : "Sustituir PDF"}
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="sr-only"
                        disabled={busy !== null}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) uploadDocument(file, document.title, document.id);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(document)}
                      className="grid size-11 place-items-center border-2 border-destructive text-destructive hover:bg-destructive/10"
                      aria-label={`Borrar ${document.title}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <details className="group border-t border-foreground">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 font-black [&::-webkit-details-marker]:hidden lg:px-6">
                    <Link2 className="size-5 text-[var(--pink)]" aria-hidden="true" />
                    Enlaces de descarga
                    <span className="ml-auto text-sm font-normal text-foreground/55">
                      {document.links.length} creados
                    </span>
                  </summary>
                  <div className="grid gap-6 border-t border-foreground/20 bg-background p-5 lg:grid-cols-[.8fr_1.2fr] lg:p-6">
                    <div>
                      <h3 className="font-black">Crear un enlace nuevo</h3>
                      <p className="mt-1 text-sm text-foreground/60">
                        El enlace se muestra una sola vez y siempre caduca.
                      </p>
                      <div className="mt-4 flex flex-col gap-3">
                        <label className="text-sm font-bold">
                          Caducidad obligatoria
                          <select
                            value={expiryChoiceByDocument[document.id] ?? "24h"}
                            onChange={(event) =>
                              setExpiryChoiceByDocument((current) => ({
                                ...current,
                                [document.id]: event.target.value,
                              }))
                            }
                            className="mt-2 min-h-11 w-full border-2 border-foreground bg-[var(--paper)] px-3"
                          >
                            <option value="24h">24 horas (recomendado)</option>
                            <option value="168h">7 días</option>
                            <option value="720h">30 días</option>
                            <option value="custom">Fecha personalizada</option>
                          </select>
                        </label>
                        {(expiryChoiceByDocument[document.id] ?? "24h") ===
                          "custom" && (
                          <label className="text-sm font-bold">
                            Fecha y hora de caducidad
                            <input
                              type="datetime-local"
                              value={customExpiryByDocument[document.id] ?? ""}
                              onChange={(event) =>
                                setCustomExpiryByDocument((current) => ({
                                  ...current,
                                  [document.id]: event.target.value,
                                }))
                              }
                              className="mt-2 min-h-11 w-full border-2 border-foreground bg-[var(--paper)] px-3"
                            />
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => createLink(document.id)}
                          disabled={busy === `link:${document.id}`}
                          className="btn-primary"
                        >
                          <Link2 className="size-4" aria-hidden="true" />
                          {busy === `link:${document.id}`
                            ? "Creando…"
                            : "Crear enlace"}
                        </button>
                      </div>
                      {createdLinks[document.id] && (
                        <div className="mt-4 border-2 border-foreground bg-[var(--yellow)] p-3">
                          <p className="mb-2 text-xs font-black uppercase tracking-[0.12em]">
                            Cópialo ahora
                          </p>
                          <p className="truncate text-sm">
                            {createdLinks[document.id]}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyLink(document.id)}
                            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border-2 border-foreground bg-[var(--paper)] px-3 font-black"
                          >
                            <Copy className="size-4" aria-hidden="true" />
                            Copiar enlace
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black">Historial de enlaces</h3>
                      {document.links.length === 0 ? (
                        <p className="mt-4 border-y border-foreground/25 py-5 text-sm text-foreground/55">
                          Todavía no has compartido este documento.
                        </p>
                      ) : (
                        <ul className="mt-3 divide-y divide-foreground/20 border-y border-foreground/20">
                          {document.links.map((link) => {
                            const expired =
                              new Date(link.expiresAt).getTime() <= Date.now();
                            const active =
                              !link.revokedAt && !link.usedAt && !expired;
                            return (
                              <li
                                key={link.id}
                                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
                              >
                                <span
                                  className={`grid size-9 shrink-0 place-items-center rounded-full ${
                                    active
                                      ? "bg-[var(--turquoise)]"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {active ? (
                                    <Check className="size-4" />
                                  ) : (
                                    <X className="size-4" />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1 text-sm">
                                  <p className="font-black">
                                    {active
                                      ? "Enlace activo"
                                      : link.usedAt
                                        ? "Enlace utilizado"
                                        : link.revokedAt
                                        ? "Enlace revocado"
                                        : "Enlace caducado"}
                                  </p>
                                  <p className="mt-0.5 flex flex-wrap gap-x-3 text-foreground/55">
                                    <span className="inline-flex items-center gap-1">
                                      <Download className="size-3.5" />
                                      {link.downloadCount} descargas
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Clock3 className="size-3.5" />
                                      {`Caduca ${formatDate(link.expiresAt)}`}
                                    </span>
                                  </p>
                                </div>
                                {active && (
                                  <button
                                    type="button"
                                    onClick={() => revokeLink(link.id)}
                                    disabled={busy === `revoke:${link.id}`}
                                    className="min-h-11 px-3 text-sm font-black text-destructive underline underline-offset-4 disabled:opacity-50"
                                  >
                                    {busy === `revoke:${link.id}`
                                      ? "Revocando…"
                                      : "Revocar"}
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Paginación de documentos">
          <a
            href={`/admin/documentos?q=${encodeURIComponent(initialQuery)}&sort=${initialSort}&page=${Math.max(page - 1, 1)}`}
            aria-disabled={page === 1}
            className={page === 1 ? "is-disabled" : undefined}
          >
            Anterior
          </a>
          <span>Página {page} de {totalPages}</span>
          <a
            href={`/admin/documentos?q=${encodeURIComponent(initialQuery)}&sort=${initialSort}&page=${Math.min(page + 1, totalPages)}`}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "is-disabled" : undefined}
          >
            Siguiente
          </a>
        </nav>
      )}

      {deleteTarget && (
        <ConfirmDeleteDialog
          document={deleteTarget}
          busy={busy === `delete:${deleteTarget.id}`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteDocument}
        />
      )}
    </div>
  );
}
