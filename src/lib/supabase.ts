import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ROOTLINE — Supabase client factory.
 *
 * Reads publishable credentials from Vite env. When they are missing the
 * client is `null` and `isSupabaseEnabled` is false, so the whole app
 * degrades gracefully to showcase/demo mode.
 */

export type VideoRow = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration_seconds: number | null;
  file_path: string;
  status: string;
  views: number | null;
  created_at: string;
};

export type VideoInsert = {
  creator_id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  duration_seconds?: number | null;
  file_path: string;
  status?: string;
  views?: number;
};

export type Database = {
  public: {
    Tables: {
      videos: {
        Row: VideoRow;
        Insert: VideoInsert & { id?: string; created_at?: string };
        Update: Partial<VideoInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

export const isSupabaseEnabled = Boolean(url && publishableKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseEnabled
  ? createClient<Database>(url as string, publishableKey as string)
  : null;
