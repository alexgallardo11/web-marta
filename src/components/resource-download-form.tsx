"use client";

import { useState, type FormEvent } from "react";

export function ResourceDownloadForm({ action }: { action: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch(action, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      const body = (await response.json().catch(() => null)) as {
        downloadUrl?: string;
        error?: string;
      } | null;

      if (!response.ok || !body?.downloadUrl) {
        setError(body?.error ?? "No se ha podido preparar la descarga.");
        setBusy(false);
        return;
      }

      window.location.assign(body.downloadUrl);
    } catch {
      setError("No se ha podido iniciar la descarga. Prueba de nuevo.");
      setBusy(false);
    }
  }

  return (
    <>
      <form action={action} method="post" target="_blank" onSubmit={download}>
        <button className="resource-download-button" type="submit" disabled={busy}>
          {busy ? "Preparando descarga…" : "Descargar PDF"}
        </button>
      </form>
      {error && (
        <p className="resource-download-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
