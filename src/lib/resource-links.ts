import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { ShareLinkPolicy } from "@/lib/document-validation";
import {
  hashShareToken,
  isShareToken,
} from "@/lib/share-link-tokens";

export type ResourceState =
  | { status: "invalid" | "missing" }
  | { status: "revoked" | "expired" | "used"; documentTitle?: string }
  | {
      status: "active";
      linkId: string;
      documentId: string;
      documentTitle: string;
      policy: ShareLinkPolicy;
      expiresAt: string | null;
    };

export async function getResourceState(token: string): Promise<ResourceState> {
  if (!isShareToken(token)) return { status: "invalid" };

  const admin = createAdminClient();
  const { data: link, error } = await admin
    .from("share_links")
    .select("id, document_id, policy, expires_at, revoked_at, used_at")
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
  if (link.policy === "one_time") {
    if (link.used_at) return { status: "used", documentTitle };
    if (!link.expires_at || new Date(link.expires_at).getTime() <= Date.now()) {
      return { status: "expired", documentTitle };
    }
  }
  if (!document) return { status: "missing" };

  return {
    status: "active",
    linkId: link.id,
    documentId: link.document_id,
    documentTitle: document.title,
    policy: link.policy,
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
