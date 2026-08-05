import "server-only";

import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type ResourceState =
  | { status: "invalid" | "missing" }
  | { status: "revoked" | "expired" | "used"; documentTitle?: string }
  | {
      status: "active";
      linkId: string;
      documentId: string;
      documentTitle: string;
      expiresAt: string;
    };

export function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isShareToken(token: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export async function getResourceState(token: string): Promise<ResourceState> {
  if (!isShareToken(token)) return { status: "invalid" };

  const admin = createAdminClient();
  const { data: link, error } = await admin
    .from("share_links")
    .select("id, document_id, expires_at, revoked_at, used_at")
    .eq("token_hash", hashShareToken(token))
    .maybeSingle();

  if (error || !link) return { status: "missing" };

  const { data: document } = await admin
    .from("documents")
    .select("id, title")
    .eq("id", link.document_id)
    .maybeSingle();
  const documentTitle = document?.title;

  if (link.revoked_at) return { status: "revoked", documentTitle };
  if (link.used_at) return { status: "used", documentTitle };
  if (new Date(link.expires_at).getTime() <= Date.now()) {
    return { status: "expired", documentTitle };
  }
  if (!document) return { status: "missing" };

  return {
    status: "active",
    linkId: link.id,
    documentId: link.document_id,
    documentTitle: document.title,
    expiresAt: link.expires_at,
  };
}

export async function consumeShareToken(token: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("consume_share_link", {
    p_token_hash: hashShareToken(token),
  });

  if (error) throw error;
  return data?.[0] ?? null;
}
