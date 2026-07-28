export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
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
          expires_at: string | null;
          revoked_at: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          token_hash: string;
          expires_at?: string | null;
          revoked_at?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          expires_at?: string | null;
          revoked_at?: string | null;
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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

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
    expiresAt: string | null;
    revokedAt: string | null;
    createdAt: string;
    downloadCount: number;
  }[];
};
