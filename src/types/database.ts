export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          plan?: string;
          settings?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      org_members: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "member";
        };
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "org_members_user_id_profiles_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      signatures: {
        Row: {
          id: string;
          org_id: string | null;
          owner_user_id: string | null;
          template_id: string;
          name: string;
          config: Json;
          html_output: string;
          public_slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          owner_user_id?: string | null;
          template_id: string;
          name: string;
          config: Json;
          html_output: string;
          public_slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          org_id?: string | null;
          template_id?: string;
          name?: string;
          config?: Json;
          html_output?: string;
          public_slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tracked_links: {
        Row: {
          id: string;
          signature_id: string;
          label: string;
          destination_url: string;
          short_id: string;
          link_key: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          signature_id: string;
          label: string;
          destination_url: string;
          short_id: string;
          link_key?: string | null;
          created_at?: string;
        };
        Update: {
          label?: string;
          destination_url?: string;
        };
        Relationships: [];
      };
      click_events: {
        Row: {
          id: string;
          link_id: string;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      bulk_import_jobs: {
        Row: {
          id: string;
          org_id: string | null;
          user_id: string | null;
          status: "pending" | "processing" | "completed" | "failed";
          csv_data: Json;
          results: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          user_id?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
          csv_data: Json;
          results?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "processing" | "completed" | "failed";
          results?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      org_invites: {
        Row: {
          id: string;
          org_id: string;
          email: string;
          role: "admin" | "member";
          invited_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          email: string;
          role?: "admin" | "member";
          invited_by: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_organization: {
        Args: { org_name: string; org_slug: string };
        Returns: Database["public"]["Tables"]["organizations"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
