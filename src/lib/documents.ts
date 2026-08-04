import "server-only";

import { requireAdmin } from "@/lib/auth";
import type { AdminDocument } from "@/types/database";

const DEFAULT_PAGE_SIZE = 8;

export type DocumentListOptions = {
  query?: string;
  sort?: "updated" | "title";
  page?: number;
  pageSize?: number;
};

export type PaginatedDocuments = {
  documents: AdminDocument[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function escapeSearchTerm(value: string) {
  return value
    .trim()
    .slice(0, 100)
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replace(/[(),]/g, " ");
}

export async function listDocuments(
  options: DocumentListOptions = {},
): Promise<PaginatedDocuments> {
  const { supabase } = await requireAdmin();
  const pageSize = Math.min(Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 1), 50);
  const page = Math.max(options.page ?? 1, 1);
  const query = escapeSearchTerm(options.query ?? "");
  const sort = options.sort ?? "updated";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let documentsQuery = supabase
    .from("documents")
    .select("*", { count: "exact" })
    .order(sort === "title" ? "title" : "updated_at", {
      ascending: sort === "title",
    })
    .range(from, to);

  if (query) {
    documentsQuery = documentsQuery.or(
      `title.ilike.%${query}%,original_filename.ilike.%${query}%`,
    );
  }

  const documentsResult = await documentsQuery;
  if (documentsResult.error) throw documentsResult.error;

  const documents = documentsResult.data ?? [];
  const documentIds = documents.map((document) => document.id);
  const linksResult = documentIds.length
    ? await supabase
        .from("share_links")
        .select("*")
        .in("document_id", documentIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (linksResult.error) throw linksResult.error;

  const links = linksResult.data ?? [];
  const linkIds = links.map((link) => link.id);
  const downloadsResult = linkIds.length
    ? await supabase
        .from("download_events")
        .select("share_link_id")
        .in("share_link_id", linkIds)
    : { data: [], error: null };

  if (downloadsResult.error) throw downloadsResult.error;

  const downloadCounts = new Map<string, number>();
  for (const { share_link_id: linkId } of downloadsResult.data ?? []) {
    downloadCounts.set(linkId, (downloadCounts.get(linkId) ?? 0) + 1);
  }

  const mappedDocuments = documents.map((document) => ({
    id: document.id,
    title: document.title,
    originalFilename: document.original_filename,
    sizeBytes: document.size_bytes,
    version: document.version,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
    links: links
      .filter((link) => link.document_id === document.id)
      .map((link) => ({
        id: link.id,
        expiresAt: link.expires_at,
        revokedAt: link.revoked_at,
        usedAt: link.used_at,
        createdAt: link.created_at,
        downloadCount: downloadCounts.get(link.id) ?? 0,
      })),
  }));

  const total = documentsResult.count ?? 0;
  return {
    documents: mappedDocuments,
    page,
    pageSize,
    total,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}
