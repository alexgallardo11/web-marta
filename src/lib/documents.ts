import "server-only";

import { requireAdmin } from "@/lib/auth";
import type { AdminDocument } from "@/types/database";

export async function listDocuments(): Promise<AdminDocument[]> {
  const { supabase } = await requireAdmin();
  const [documentsResult, linksResult, downloadsResult] = await Promise.all([
    supabase.from("documents").select("*").order("updated_at", {
      ascending: false,
    }),
    supabase.from("share_links").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("download_events").select("share_link_id"),
  ]);

  if (documentsResult.error) throw documentsResult.error;
  if (linksResult.error) throw linksResult.error;
  if (downloadsResult.error) throw downloadsResult.error;

  const downloadCounts = new Map<string, number>();
  downloadsResult.data.forEach(({ share_link_id }) => {
    downloadCounts.set(
      share_link_id,
      (downloadCounts.get(share_link_id) ?? 0) + 1,
    );
  });

  return documentsResult.data.map((document) => ({
    id: document.id,
    title: document.title,
    originalFilename: document.original_filename,
    sizeBytes: document.size_bytes,
    version: document.version,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
    links: linksResult.data
      .filter((link) => link.document_id === document.id)
      .map((link) => ({
        id: link.id,
        expiresAt: link.expires_at,
        revokedAt: link.revoked_at,
        createdAt: link.created_at,
        downloadCount: downloadCounts.get(link.id) ?? 0,
      })),
  }));
}
