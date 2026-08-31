// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  decryptShareToken,
  encryptShareToken,
  hashShareToken,
  isShareToken,
} from "@/lib/share-link-tokens";

describe("share link tokens", () => {
  it("cifra y recupera un token permanente", () => {
    const token = "a".repeat(43);
    process.env.SHARE_LINK_ENCRYPTION_KEY = "test-share-link-key";

    const encrypted = encryptShareToken(token);

    expect(encrypted).not.toContain(token);
    expect(decryptShareToken(encrypted)).toBe(token);
    expect(hashShareToken(token)).toHaveLength(64);
    expect(isShareToken(token)).toBe(true);
  });

  it("rechaza un valor cifrado manipulado", () => {
    process.env.SHARE_LINK_ENCRYPTION_KEY = "test-share-link-key";
    const encrypted = encryptShareToken("b".repeat(43));
    const tampered = `${encrypted[0] === "a" ? "b" : "a"}${encrypted.slice(1)}`;

    expect(() => decryptShareToken(tampered)).toThrow();
  });
});
