export type Database = {
  public: {
    Enums: {
      admin_role: "owner" | "admin";
      share_link_policy: "permanent" | "one_time";
    };
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string | null;
          role: "owner" | "admin";
          is_active: boolean;
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          role?: "owner" | "admin";
          is_active?: boolean;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string | null;
          role?: "owner" | "admin";
          is_active?: boolean;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          version: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          storage_path: string;
          original_filename: string;
          mime_type?: string;
          size_bytes: number;
          version?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          storage_path?: string;
          original_filename?: string;
          mime_type?: string;
          size_bytes?: number;
          version?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      share_links: {
        Row: {
          id: string;
          document_id: string;
          token_hash: string;
          token_ciphertext: string | null;
          policy: Database["public"]["Enums"]["share_link_policy"];
          expires_at: string | null;
          revoked_at: string | null;
          used_at: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          token_hash: string;
          token_ciphertext?: string | null;
          policy?: Database["public"]["Enums"]["share_link_policy"];
          expires_at?: string | null;
          revoked_at?: string | null;
          used_at?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          token_ciphertext?: string | null;
          expires_at?: string | null;
          revoked_at?: string | null;
          used_at?: string | null;
        };
        Relationships: [];
      };
      download_events: {
        Row: {
          id: number;
          share_link_id: string;
          downloaded_at: string;
        };
        Insert: {
          id?: never;
          share_link_id: string;
          downloaded_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_share_link: {
        Args: { p_token_hash: string };
        Returns: {
          share_link_id: string;
          document_id: string;
        }[];
      };
    };
    CompositeTypes: Record<string, never>;
  };
};

export type AdminRole = Database["public"]["Enums"]["admin_role"];

export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

export type AdminDocument = {
  id: string;
  title: string;
  originalFilename: string;
  sizeBytes: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  links: {
    id: string;
    policy: Database["public"]["Enums"]["share_link_policy"];
    canRecover: boolean;
    expiresAt: string | null;
    revokedAt: string | null;
    usedAt: string | null;
    createdAt: string;
    downloadCount: number;
  }[];
};
